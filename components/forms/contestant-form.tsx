"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitContestant } from "@/app/actions/submit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  adSoyad: z.string().min(3, "Ad soyad zorunludur."),
  dogumTarihi: z.string().min(1, "Doğum tarihi zorunludur."),
  boyCm: z.string().min(2, "Boy bilgisi zorunludur."),
  sehir: z.string().min(2, "Şehir zorunludur."),
  telefon: z.string().min(10, "Telefon zorunludur."),
  eposta: z.string().email("Geçerli bir e-posta giriniz."),
  instagramUrl: z.string().url("Geçerli bir Instagram URL giriniz."),
  tiktokUrl: z.string().optional(),
  kendiniTanit: z.string().min(10, "Kendini tanıt alanı zorunludur."),
  sartlarOnay: z.boolean().refine(Boolean, "Şartları kabul etmelisiniz."),
});

type FormValues = z.infer<typeof formSchema>;

export function ContestantForm() {
  const [status, setStatus] = useState<{ ok: boolean; message?: string; reference?: string } | null>(
    null
  );
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sartlarOnay: false,
    },
  });

  const birthDate = watch("dogumTarihi");
  const isUnder18 = useMemo(() => {
    if (!birthDate) return false;
    const date = new Date(birthDate);
    if (Number.isNaN(date.getTime())) return false;
    return new Date().getFullYear() - date.getFullYear() < 18;
  }, [birthDate]);

  const onSubmit = handleSubmit(async (data) => {
    setStatus(null);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        formData.append(key, value ? "onay" : "");
      } else if (value) {
        formData.append(key, value);
      }
    });

    const fileFields = [
      "vesikalikFoto",
      "tamBoyFoto",
      "ekFotograflar",
      "tanitimVideosu",
      "onayBelgesi",
    ];

    fileFields.forEach((field) => {
      const input = document.querySelector<HTMLInputElement>(`input[name='${field}']`);
      if (!input?.files) return;
      if (field === "ekFotograflar") {
        Array.from(input.files).forEach((file) => formData.append(field, file));
      } else if (input.files[0]) {
        formData.append(field, input.files[0]);
      }
    });

    const result = await submitContestant(formData);
    setStatus(result);
  });

  if (status?.ok) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-semibold">Başvurun alındı</h2>
        <p className="mt-3 text-muted">
          Referans numaran: <span className="text-gold font-semibold">{status.reference}</span>
        </p>
        <p className="mt-2 text-sm text-muted">Ekibimiz en kısa sürede seninle iletişime geçecek.</p>
      </div>
    );
  }

  return (
    <form className="grid gap-6" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="adSoyad">Ad Soyad</Label>
          <Input id="adSoyad" placeholder="Adınız Soyadınız" {...register("adSoyad")}
          />
          {errors.adSoyad && <span className="text-xs text-red-400">{errors.adSoyad.message}</span>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dogumTarihi">Doğum Tarihi</Label>
          <Input id="dogumTarihi" type="date" {...register("dogumTarihi")} />
          {errors.dogumTarihi && (
            <span className="text-xs text-red-400">{errors.dogumTarihi.message}</span>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="boyCm">Boy (cm)</Label>
          <Input id="boyCm" placeholder="175" {...register("boyCm")} />
          {errors.boyCm && <span className="text-xs text-red-400">{errors.boyCm.message}</span>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sehir">Şehir</Label>
          <Input id="sehir" placeholder="İstanbul" {...register("sehir")} />
          {errors.sehir && <span className="text-xs text-red-400">{errors.sehir.message}</span>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="telefon">Telefon</Label>
          <Input id="telefon" placeholder="05xx xxx xx xx" {...register("telefon")} />
          {errors.telefon && <span className="text-xs text-red-400">{errors.telefon.message}</span>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="eposta">E-posta</Label>
          <Input id="eposta" type="email" placeholder="ornek@mail.com" {...register("eposta")} />
          {errors.eposta && <span className="text-xs text-red-400">{errors.eposta.message}</span>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="instagramUrl">Instagram Profil Linki</Label>
          <Input id="instagramUrl" placeholder="https://instagram.com/" {...register("instagramUrl")}
          />
          {errors.instagramUrl && (
            <span className="text-xs text-red-400">{errors.instagramUrl.message}</span>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tiktokUrl">TikTok Profil Linki (opsiyonel)</Label>
          <Input id="tiktokUrl" placeholder="https://tiktok.com/@" {...register("tiktokUrl")} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="kendiniTanit">Kendini Kısaca Tanıt</Label>
        <Textarea id="kendiniTanit" placeholder="Kısaca kendinden bahset." {...register("kendiniTanit")} />
        {errors.kendiniTanit && (
          <span className="text-xs text-red-400">{errors.kendiniTanit.message}</span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="vesikalikFoto">Vesikalık Fotoğraf (zorunlu)</Label>
          <Input id="vesikalikFoto" name="vesikalikFoto" type="file" accept="image/*" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tamBoyFoto">Tam Boy Fotoğraf (zorunlu)</Label>
          <Input id="tamBoyFoto" name="tamBoyFoto" type="file" accept="image/*" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ekFotograflar">Ek Fotoğraflar (opsiyonel, max 5)</Label>
          <Input id="ekFotograflar" name="ekFotograflar" type="file" accept="image/*" multiple />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tanitimVideosu">Tanıtım Videosu (opsiyonel)</Label>
          <Input id="tanitimVideosu" name="tanitimVideosu" type="file" accept="video/*" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="onayBelgesi">
            Veli Onay Belgesi {isUnder18 ? "(zorunlu)" : "(opsiyonel)"}
          </Label>
          <Input id="onayBelgesi" name="onayBelgesi" type="file" accept="application/pdf,image/*" />
          {isUnder18 && (
            <span className="text-xs text-gold">18 yaş altı için onay belgesi zorunludur.</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <Controller
          control={control}
          name="sartlarOnay"
          render={({ field }) => (
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
        <span>Şartları okudum ve kabul ediyorum.</span>
      </div>
      {errors.sartlarOnay && (
        <span className="text-xs text-red-400">{errors.sartlarOnay.message}</span>
      )}

      {status?.message && <div className="text-sm text-red-400">{status.message}</div>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Gönderiliyor..." : "Başvuruyu Gönder"}
      </Button>
    </form>
  );
}
