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
    socials,
  });
  revalidatePath("/admin");
}

export async function upsertHomeSections(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("home_sections").upsert({
    id: 1,
    hero_title: formData.get("heroTitle"),
    hero_subtitle: formData.get("heroSubtitle"),
    hero_date_city: formData.get("heroDateCity"),
    about_title: formData.get("aboutTitle"),
    about_body: formData.get("aboutBody"),
    process_title: formData.get("processTitle"),
    process_body: formData.get("processBody"),
    jury_title: formData.get("juryTitle"),
    jury_body: formData.get("juryBody"),
    prizes_title: formData.get("prizesTitle"),
    prizes_body: formData.get("prizesBody"),
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
