import { createSupabaseServerComponentClient } from "@/lib/supabase/server";
import { mergeAppContent } from "@/lib/content";

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

export async function getAppContent() {
  const supabase = createSupabaseServerComponentClient();
  const { data, error } = await supabase.from("app_content").select("content").single();
  if (error) {
    return mergeAppContent(null);
  }
  return mergeAppContent(data?.content ?? null);
}

export async function getArticles() {
  const supabase = createSupabaseServerComponentClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return data ?? [];
}

export async function getArticleBySlug(slug: string) {
  const supabase = createSupabaseServerComponentClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data;
}

export async function getJuryMembers() {
  const supabase = createSupabaseServerComponentClient();
  const { data } = await supabase.from("jury_members").select("*").order("order", { ascending: true });
  return data ?? [];
}
