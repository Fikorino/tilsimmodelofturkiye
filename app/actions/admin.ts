"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

async function uploadAdminFile(bucket: string, file: File, folder: string) {
  const supabase = createSupabaseAdminClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "-");
  const path = `${folder}/${Date.now()}-${safeName}`;
  const arrayBuffer = await file.arrayBuffer();
  const { error } = await supabase.storage.from(bucket).upload(path, arrayBuffer, {
    contentType: file.type,
    upsert: true,
  });

  if (error) {
    throw new Error("Dosya yüklenemedi.");
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function upsertSiteSettings(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  const logoFile = formData.get("logoFile") as File | null;
  let logoUrl = formData.get("logoUrl") || null;
  if (logoFile && logoFile.size > 0) {
    const upload = await uploadAdminFile("site_uploads", logoFile, "brand");
    logoUrl = upload.url;
  }
  const socials = {
    instagram: formData.get("instagram") || null,
    tiktok: formData.get("tiktok") || null,
    youtube: formData.get("youtube") || null,
  };
  await supabase.from("site_settings").upsert({
    id: 1,
    brand_name: formData.get("brandName"),
    domain: formData.get("domain"),
    contact_email: formData.get("contactEmail"),
    contact_phone: formData.get("contactPhone"),
    contact_address: formData.get("contactAddress"),
    logo_url: logoUrl,
    logo_size: formData.get("logoSize") ? Number(formData.get("logoSize")) : null,
    logo_only: formData.get("logoOnly") === "on",
    seo_title: formData.get("seoTitle"),
    seo_description: formData.get("seoDescription"),
    seo_keywords: formData.get("seoKeywords"),
    socials,
  });
  revalidatePath("/admin");
}

export async function upsertHomeSections(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  const heroImageFile = formData.get("heroImageFile") as File | null;
  let heroImageUrl = formData.get("heroImageUrl") || null;
  if (heroImageFile && heroImageFile.size > 0) {
    const upload = await uploadAdminFile("site_uploads", heroImageFile, "home");
    heroImageUrl = upload.url;
  }
  const aboutImageFile = formData.get("aboutImageFile") as File | null;
  let aboutImageUrl = formData.get("aboutImageUrl") || null;
  if (aboutImageFile && aboutImageFile.size > 0) {
    const upload = await uploadAdminFile("site_uploads", aboutImageFile, "home");
    aboutImageUrl = upload.url;
  }
  const processImageFile = formData.get("processImageFile") as File | null;
  let processImageUrl = formData.get("processImageUrl") || null;
  if (processImageFile && processImageFile.size > 0) {
    const upload = await uploadAdminFile("site_uploads", processImageFile, "home");
    processImageUrl = upload.url;
  }
  const juryImageFile = formData.get("juryImageFile") as File | null;
  let juryImageUrl = formData.get("juryImageUrl") || null;
  if (juryImageFile && juryImageFile.size > 0) {
    const upload = await uploadAdminFile("site_uploads", juryImageFile, "home");
    juryImageUrl = upload.url;
  }
  const prizesImageFile = formData.get("prizesImageFile") as File | null;
  let prizesImageUrl = formData.get("prizesImageUrl") || null;
  if (prizesImageFile && prizesImageFile.size > 0) {
    const upload = await uploadAdminFile("site_uploads", prizesImageFile, "home");
    prizesImageUrl = upload.url;
  }
  const hotelImageFile = formData.get("hotelImageFile") as File | null;
  let hotelImageUrl = formData.get("hotelImageUrl") || null;
  if (hotelImageFile && hotelImageFile.size > 0) {
    const upload = await uploadAdminFile("site_uploads", hotelImageFile, "home");
    hotelImageUrl = upload.url;
  }
  await supabase.from("home_sections").upsert({
    id: 1,
    hero_title: formData.get("heroTitle"),
    hero_subtitle: formData.get("heroSubtitle"),
    hero_date_city: formData.get("heroDateCity"),
    hero_image_url: heroImageUrl,
    about_title: formData.get("aboutTitle"),
    about_body: formData.get("aboutBody"),
    about_image_url: aboutImageUrl,
    process_title: formData.get("processTitle"),
    process_body: formData.get("processBody"),
    process_image_url: processImageUrl,
    jury_title: formData.get("juryTitle"),
    jury_body: formData.get("juryBody"),
    jury_image_url: juryImageUrl,
    prizes_title: formData.get("prizesTitle"),
    prizes_body: formData.get("prizesBody"),
    prizes_image_url: prizesImageUrl,
    hotel_title: formData.get("hotelTitle"),
    hotel_body: formData.get("hotelBody"),
    hotel_image_url: hotelImageUrl,
    hotel_address: formData.get("hotelAddress"),
    hotel_map_url: formData.get("hotelMapUrl"),
    faq_title: formData.get("faqTitle"),
    sponsors_title: formData.get("sponsorsTitle"),
    cta_primary: formData.get("ctaPrimary"),
    cta_secondary: formData.get("ctaSecondary"),
  });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function upsertLegalPage(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("legal_pages").upsert({
    slug: formData.get("slug"),
    title: formData.get("title"),
    content: formData.get("content"),
    pdf_url: formData.get("pdfUrl") || null,
  });
  revalidatePath("/admin");
}

export async function addTimelineItem(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("timeline_items").insert({
    title: formData.get("title"),
    date_text: formData.get("dateText"),
    description: formData.get("description"),
    order: Number(formData.get("order") || 0),
  });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateTimelineItem(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("timeline_items").update({
    title: formData.get("title"),
    date_text: formData.get("dateText"),
    description: formData.get("description"),
    order: Number(formData.get("order") || 0),
  }).eq("id", Number(formData.get("id")));
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteTimelineItem(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("timeline_items").delete().eq("id", Number(formData.get("id")));
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function addFaqItem(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("faq_items").insert({
    question: formData.get("question"),
    answer: formData.get("answer"),
    order: Number(formData.get("order") || 0),
  });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateFaqItem(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("faq_items").update({
    question: formData.get("question"),
    answer: formData.get("answer"),
    order: Number(formData.get("order") || 0),
  }).eq("id", Number(formData.get("id")));
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteFaqItem(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("faq_items").delete().eq("id", Number(formData.get("id")));
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function addSponsorPackage(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("sponsor_packages").insert({
    name: formData.get("name"),
    description: formData.get("description"),
    benefits_json: formData.get("benefitsJson") ? String(formData.get("benefitsJson")).split("\n") : [],
    order: Number(formData.get("order") || 0),
  });
  revalidatePath("/admin");
  revalidatePath("/basvuru/sponsor");
}

export async function updateSponsorPackage(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("sponsor_packages").update({
    name: formData.get("name"),
    description: formData.get("description"),
    benefits_json: formData.get("benefitsJson") ? String(formData.get("benefitsJson")).split("\n") : [],
    order: Number(formData.get("order") || 0),
  }).eq("id", Number(formData.get("id")));
  revalidatePath("/admin");
  revalidatePath("/basvuru/sponsor");
}

export async function deleteSponsorPackage(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("sponsor_packages").delete().eq("id", Number(formData.get("id")));
  revalidatePath("/admin");
  revalidatePath("/basvuru/sponsor");
}

export async function addSponsorLogo(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  const file = formData.get("logoFile") as File | null;
  let logoUrl = formData.get("logoUrl");
  if (file && file.size > 0) {
    const upload = await uploadAdminFile("sponsor_uploads", file, "logos");
    logoUrl = upload.url;
  }
  await supabase.from("sponsor_logos").insert({
    name: formData.get("name"),
    logo_url: logoUrl,
    website_url: formData.get("websiteUrl") || null,
    order: Number(formData.get("order") || 0),
  });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteSponsorLogo(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("sponsor_logos").delete().eq("id", Number(formData.get("id")));
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function upsertAppContent(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  const requiredFields = formData.getAll("contestantRequiredFields").map(String).filter(Boolean);
  const customFieldsRaw = String(formData.get("contestantCustomFields") || "");
  const customFields = customFieldsRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, requiredText] = line.split("|");
      return {
        label: label?.trim() ?? "",
        required: (requiredText ?? "").trim().toLowerCase() === "zorunlu",
      };
    })
    .filter((item) => item.label.length > 0);
  const content = {
    contestant: {
      pageTitle: formData.get("contestantPageTitle"),
      pageSubtitle: formData.get("contestantPageSubtitle"),
      termsTitle: formData.get("contestantTermsTitle"),
      successTitle: formData.get("contestantSuccessTitle"),
      successSubtitle: formData.get("contestantSuccessSubtitle"),
      submitLabel: formData.get("contestantSubmitLabel"),
      termsCheckboxLabel: formData.get("contestantTermsCheckboxLabel"),
      under18Note: formData.get("contestantUnder18Note"),
      requiredFields,
      customFields,
    },
    sponsor: {
      pageTitle: formData.get("sponsorPageTitle"),
      pageSubtitle: formData.get("sponsorPageSubtitle"),
      termsTitle: formData.get("sponsorTermsTitle"),
      successTitle: formData.get("sponsorSuccessTitle"),
      successSubtitle: formData.get("sponsorSuccessSubtitle"),
      submitLabel: formData.get("sponsorSubmitLabel"),
      termsLinkLabel: formData.get("sponsorTermsLinkLabel"),
      packagesHelper: formData.get("sponsorPackagesHelper"),
      packagesEmpty: formData.get("sponsorPackagesEmpty"),
    },
    labels: {
      contestant: {
        adSoyad: formData.get("labelContestantAdSoyad"),
        dogumTarihi: formData.get("labelContestantDogumTarihi"),
        boyCm: formData.get("labelContestantBoyCm"),
        sehir: formData.get("labelContestantSehir"),
        telefon: formData.get("labelContestantTelefon"),
        eposta: formData.get("labelContestantEposta"),
        instagramUrl: formData.get("labelContestantInstagramUrl"),
        tiktokUrl: formData.get("labelContestantTiktokUrl"),
        kendiniTanit: formData.get("labelContestantKendiniTanit"),
        vesikalikFoto: formData.get("labelContestantVesikalikFoto"),
        tamBoyFoto: formData.get("labelContestantTamBoyFoto"),
        ekFotograflar: formData.get("labelContestantEkFotograflar"),
        tanitimVideosu: formData.get("labelContestantTanitimVideosu"),
        onayBelgesi: formData.get("labelContestantOnayBelgesi"),
      },
      sponsor: {
        firmaAdi: formData.get("labelSponsorFirmaAdi"),
        yetkiliAdiSoyadi: formData.get("labelSponsorYetkiliAdiSoyadi"),
        sektor: formData.get("labelSponsorSektor"),
        telefon: formData.get("labelSponsorTelefon"),
        eposta: formData.get("labelSponsorEposta"),
        butceAraligi: formData.get("labelSponsorButceAraligi"),
        ilgilenilenPaketler: formData.get("labelSponsorPaketler"),
        mesaj: formData.get("labelSponsorMesaj"),
        firmaSunumu: formData.get("labelSponsorFirmaSunumu"),
        firmaLogosu: formData.get("labelSponsorFirmaLogosu"),
      },
    },
    placeholders: {
      contestant: {
        adSoyad: formData.get("placeholderContestantAdSoyad"),
        boyCm: formData.get("placeholderContestantBoyCm"),
        sehir: formData.get("placeholderContestantSehir"),
        telefon: formData.get("placeholderContestantTelefon"),
        eposta: formData.get("placeholderContestantEposta"),
        instagramUrl: formData.get("placeholderContestantInstagramUrl"),
        tiktokUrl: formData.get("placeholderContestantTiktokUrl"),
        kendiniTanit: formData.get("placeholderContestantKendiniTanit"),
      },
      sponsor: {
        firmaAdi: formData.get("placeholderSponsorFirmaAdi"),
        yetkiliAdiSoyadi: formData.get("placeholderSponsorYetkiliAdiSoyadi"),
        sektor: formData.get("placeholderSponsorSektor"),
        telefon: formData.get("placeholderSponsorTelefon"),
        eposta: formData.get("placeholderSponsorEposta"),
        butceAraligi: formData.get("placeholderSponsorButceAraligi"),
        mesaj: formData.get("placeholderSponsorMesaj"),
      },
    },
  };

  await supabase.from("app_content").upsert({ id: 1, content });
  revalidatePath("/admin");
  revalidatePath("/basvuru/yarismaci");
  revalidatePath("/basvuru/sponsor");
}

export async function addArticle(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("articles").insert({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    cover_image_url: formData.get("coverImageUrl"),
    seo_title: formData.get("seoTitle"),
    seo_description: formData.get("seoDescription"),
    seo_keywords: formData.get("seoKeywords"),
    status: formData.get("status") || "draft",
    published_at: formData.get("publishedAt") || null,
  });
  revalidatePath("/admin");
  revalidatePath("/makaleler");
}

export async function updateArticle(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  await supabase
    .from("articles")
    .update({
      title: formData.get("title"),
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      cover_image_url: formData.get("coverImageUrl"),
      seo_title: formData.get("seoTitle"),
      seo_description: formData.get("seoDescription"),
      seo_keywords: formData.get("seoKeywords"),
      status: formData.get("status") || "draft",
      published_at: formData.get("publishedAt") || null,
    })
    .eq("id", Number(formData.get("id")));
  revalidatePath("/admin");
  revalidatePath("/makaleler");
}

export async function deleteArticle(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("articles").delete().eq("id", Number(formData.get("id")));
  revalidatePath("/admin");
  revalidatePath("/makaleler");
}

export async function addJuryMember(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  const photoFile = formData.get("photoFile") as File | null;
  let photoUrl = formData.get("photoUrl") || null;
  if (photoFile && photoFile.size > 0) {
    const upload = await uploadAdminFile("site_uploads", photoFile, "jury");
    photoUrl = upload.url;
  }
  const socials = {
    instagram: formData.get("instagram") || null,
    tiktok: formData.get("tiktok") || null,
    linkedin: formData.get("linkedin") || null,
    website: formData.get("website") || null,
  };
  await supabase.from("jury_members").insert({
    name: formData.get("name"),
    role: formData.get("role"),
    photo_url: photoUrl,
    socials,
    order: Number(formData.get("order") || 0),
  });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateJuryMember(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  const photoFile = formData.get("photoFile") as File | null;
  let photoUrl = formData.get("photoUrl") || null;
  if (photoFile && photoFile.size > 0) {
    const upload = await uploadAdminFile("site_uploads", photoFile, "jury");
    photoUrl = upload.url;
  }
  const socials = {
    instagram: formData.get("instagram") || null,
    tiktok: formData.get("tiktok") || null,
    linkedin: formData.get("linkedin") || null,
    website: formData.get("website") || null,
  };
  await supabase
    .from("jury_members")
    .update({
      name: formData.get("name"),
      role: formData.get("role"),
      photo_url: photoUrl,
      socials,
      order: Number(formData.get("order") || 0),
    })
    .eq("id", Number(formData.get("id")));
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteJuryMember(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("jury_members").delete().eq("id", Number(formData.get("id")));
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function addHotelPhoto(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  const photoFile = formData.get("photoFile") as File | null;
  let photoUrl = formData.get("photoUrl") || null;
  if (photoFile && photoFile.size > 0) {
    const upload = await uploadAdminFile("site_uploads", photoFile, "hotel");
    photoUrl = upload.url;
  }
  await supabase.from("hotel_photos").insert({
    title: formData.get("title"),
    photo_url: photoUrl,
    order: Number(formData.get("order") || 0),
  });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateHotelPhoto(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  const photoFile = formData.get("photoFile") as File | null;
  let photoUrl = formData.get("photoUrl") || null;
  if (photoFile && photoFile.size > 0) {
    const upload = await uploadAdminFile("site_uploads", photoFile, "hotel");
    photoUrl = upload.url;
  }
  await supabase
    .from("hotel_photos")
    .update({
      title: formData.get("title"),
      photo_url: photoUrl,
      order: Number(formData.get("order") || 0),
    })
    .eq("id", Number(formData.get("id")));
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteHotelPhoto(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("hotel_photos").delete().eq("id", Number(formData.get("id")));
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function addMediaItem(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  const mediaFile = formData.get("mediaFile") as File | null;
  let mediaUrl = formData.get("mediaUrl") || null;
  if (mediaFile && mediaFile.size > 0) {
    const upload = await uploadAdminFile("site_uploads", mediaFile, "media");
    mediaUrl = upload.url;
  }
  await supabase.from("media_items").insert({
    title: formData.get("title"),
    media_url: mediaUrl,
    category: formData.get("category") || "genel",
    order: Number(formData.get("order") || 0),
  });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateMediaItem(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  const mediaFile = formData.get("mediaFile") as File | null;
  let mediaUrl = formData.get("mediaUrl") || null;
  if (mediaFile && mediaFile.size > 0) {
    const upload = await uploadAdminFile("site_uploads", mediaFile, "media");
    mediaUrl = upload.url;
  }
  await supabase
    .from("media_items")
    .update({
      title: formData.get("title"),
      media_url: mediaUrl,
      category: formData.get("category") || "genel",
      order: Number(formData.get("order") || 0),
    })
    .eq("id", Number(formData.get("id")));
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteMediaItem(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("media_items").delete().eq("id", Number(formData.get("id")));
  revalidatePath("/admin");
  revalidatePath("/");
}
