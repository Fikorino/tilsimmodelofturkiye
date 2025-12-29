import { createSupabaseServerComponentClient } from "@/lib/supabase/server";

export async function getPublicContent() {
  const supabase = createSupabaseServerComponentClient();
  const [{ data: siteSettings }, { data: homeSections }, { data: timelineItems }, { data: faqItems }, { data: sponsorLogos }] =
    await Promise.all([
      supabase.from("site_settings").select("*").single(),
      supabase.from("home_sections").select("*").single(),
      supabase.from("timeline_items").select("*").order("order", { ascending: true }),
      supabase.from("faq_items").select("*").order("order", { ascending: true }),
      supabase.from("sponsor_logos").select("*").order("order", { ascending: true }),
    ]);

  return {
    siteSettings,
    homeSections,
    timelineItems: timelineItems ?? [],
    faqItems: faqItems ?? [],
    sponsorLogos: sponsorLogos ?? [],
  };
}

export async function getContestantTerms() {
  const supabase = createSupabaseServerComponentClient();
  const { data } = await supabase.from("legal_pages").select("*").eq("slug", "katilim-sartlari").single();
  return data;
}

export async function getSponsorTerms() {
  const supabase = createSupabaseServerComponentClient();
  const { data } = await supabase.from("legal_pages").select("*").eq("slug", "sponsor-sartname").single();
  return data;
}

export async function getSponsorPackages() {
  const supabase = createSupabaseServerComponentClient();
  const { data } = await supabase.from("sponsor_packages").select("*").order("order", { ascending: true });
  return data ?? [];
}

export async function getSiteSettings() {
  const supabase = createSupabaseServerComponentClient();
  const { data } = await supabase.from("site_settings").select("*").single();
  return data;
}
