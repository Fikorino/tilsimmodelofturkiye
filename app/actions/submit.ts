"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";
import { formatReference } from "@/lib/format";


const contestantSchema = z.object({
  adSoyad: z.string().min(3, "Ad soyad zorunludur."),
  dogumTarihi: z.string().min(1, "Doğum tarihi zorunludur."),
  boyCm: z.string().min(2, "Boy bilgisi zorunludur."),
  sehir: z.string().min(2, "Şehir zorunludur."),
  telefon: z.string().min(10, "Telefon zorunludur."),
  eposta: z.string().email("Geçerli bir e-posta giriniz."),
  instagramUrl: z.string().url("Geçerli bir Instagram URL giriniz."),
  tiktokUrl: z.string().optional().or(z.literal("")),
  kendiniTanit: z.string().min(10, "Kendini tanıt alanı zorunludur."),
  sartlarOnay: z.literal("onay"),
});

const sponsorSchema = z.object({
  firmaAdi: z.string().min(2, "Firma adı zorunludur."),
  yetkiliAdiSoyadi: z.string().min(3, "Yetkili kişi zorunludur."),
  sektor: z.string().min(2, "Sektör zorunludur."),
  telefon: z.string().min(10, "Telefon zorunludur."),
  eposta: z.string().email("Geçerli bir e-posta giriniz."),
  butceAraligi: z.string().min(2, "Bütçe aralığı seçiniz."),
  mesaj: z.string().min(10, "Mesaj zorunludur."),
});

function getClientIp() {
  const headerList = headers();
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return headerList.get("x-real-ip") ?? "unknown";
}

async function uploadFile(
  bucket: string,
  file: File,
  folder: string
): Promise<{ path: string; name: string; size: number; mimeType: string; publicUrl: string }> {
  const supabase = createSupabaseAdminClient();
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "-");
  const path = `${folder}/${timestamp}-${safeName}`;
  const arrayBuffer = await file.arrayBuffer();
  const { error } = await supabase.storage.from(bucket).upload(path, arrayBuffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error("Dosya yükleme başarısız.");
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return {
    path,
    name: file.name,
    size: file.size,
    mimeType: file.type,
    publicUrl: data.publicUrl,
  };
}

export async function submitContestant(formData: FormData) {
  const ip = getClientIp();
  const rate = checkRateLimit(`contestant-${ip}`);
  if (!rate.allowed) {
    return { ok: false, message: "Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin." };
  }

  const values = Object.fromEntries(formData.entries());
  const parsed = contestantSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Form hatası." };
  }

  const vesikalikFoto = formData.get("vesikalikFoto") as File | null;
  const tamBoyFoto = formData.get("tamBoyFoto") as File | null;
  const tanitimVideosu = formData.get("tanitimVideosu") as File | null;
  const onayBelgesi = formData.get("onayBelgesi") as File | null;
  const ekFotograflar = formData.getAll("ekFotograflar") as File[];

  if (!vesikalikFoto || !tamBoyFoto) {
    return { ok: false, message: "Zorunlu fotoğrafları ekleyin." };
  }

  const dob = new Date(parsed.data.dogumTarihi);
  const age = new Date().getFullYear() - dob.getFullYear();
  if (age < 18 && !onayBelgesi) {
    return { ok: false, message: "18 yaş altı için onay belgesi zorunludur." };
  }

  const folder = `contestant/${parsed.data.adSoyad.replace(/\s+/g, "-").toLowerCase()}`;
  const vesikalikMeta = await uploadFile("contestant_uploads", vesikalikFoto, folder);
  const tamBoyMeta = await uploadFile("contestant_uploads", tamBoyFoto, folder);

  const extraMeta = [] as typeof vesikalikMeta[];
  for (const file of ekFotograflar.slice(0, 5)) {
    if (file && file.size > 0) {
      extraMeta.push(await uploadFile("contestant_uploads", file, folder));
    }
  }

  const tanitimMeta = tanitimVideosu && tanitimVideosu.size > 0
    ? await uploadFile("contestant_uploads", tanitimVideosu, folder)
    : null;
  const onayMeta = onayBelgesi && onayBelgesi.size > 0
    ? await uploadFile("contestant_uploads", onayBelgesi, folder)
    : null;

  const reference = formatReference();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("contestant_applications").insert({
    reference,
    ad_soyad: parsed.data.adSoyad,
    dogum_tarihi: parsed.data.dogumTarihi,
    boy_cm: parsed.data.boyCm,
    sehir: parsed.data.sehir,
    telefon: parsed.data.telefon,
    eposta: parsed.data.eposta,
    instagram_url: parsed.data.instagramUrl,
    tiktok_url: parsed.data.tiktokUrl || null,
    kendini_tanit: parsed.data.kendiniTanit,
    vesikalik_foto: vesikalikMeta,
    tam_boy_foto: tamBoyMeta,
    ek_fotograflar: extraMeta,
    tanitim_videosu: tanitimMeta,
    onay_belgesi: onayMeta,
    status: "yeni",
  });

  if (error) {
    return { ok: false, message: "Başvuru kaydedilemedi. Lütfen tekrar deneyin." };
  }

  return { ok: true, reference };
}

export async function submitSponsor(formData: FormData) {
  const ip = getClientIp();
  const rate = checkRateLimit(`sponsor-${ip}`);
  if (!rate.allowed) {
    return { ok: false, message: "Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin." };
  }

  const values = Object.fromEntries(formData.entries());
  const parsed = sponsorSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Form hatası." };
  }

  const paketler = formData.getAll("ilgilenilenPaketler").map(String).filter(Boolean);
  if (!paketler.length) {
    return { ok: false, message: "En az bir sponsorluk paketi seçmelisiniz." };
  }

  const firmaSunumu = formData.get("firmaSunumu") as File | null;
  const firmaLogosu = formData.get("firmaLogosu") as File | null;
  const folder = `sponsor/${parsed.data.firmaAdi.replace(/\s+/g, "-").toLowerCase()}`;

  const sunumMeta = firmaSunumu && firmaSunumu.size > 0
    ? await uploadFile("sponsor_uploads", firmaSunumu, folder)
    : null;
  const logoMeta = firmaLogosu && firmaLogosu.size > 0
    ? await uploadFile("sponsor_uploads", firmaLogosu, folder)
    : null;

  const reference = formatReference();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("sponsor_applications").insert({
    reference,
    firma_adi: parsed.data.firmaAdi,
    yetkili_adi_soyadi: parsed.data.yetkiliAdiSoyadi,
    sektor: parsed.data.sektor,
    telefon: parsed.data.telefon,
    eposta: parsed.data.eposta,
    butce_araligi: parsed.data.butceAraligi,
    ilgilenilen_paketler: paketler,
    mesaj: parsed.data.mesaj,
    firma_sunumu: sunumMeta,
    firma_logosu: logoMeta,
    status: "yeni",
  });

  if (error) {
    return { ok: false, message: "Başvuru kaydedilemedi. Lütfen tekrar deneyin." };
  }

  return { ok: true, reference };
}
