import Link from "next/link";
import { ContestantForm } from "@/components/forms/contestant-form";
import { getAppContent, getContestantTerms, getSiteSettings } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default async function ContestantApplicationPage() {
  const [terms, siteSettings, appContent] = await Promise.all([
    getContestantTerms(),
    getSiteSettings(),
    getAppContent(),
  ]);

  return (
    <div className="min-h-screen bg-bg text-fg">
      <SiteHeader brandName={siteSettings?.brand_name} logoUrl={siteSettings?.logo_url} />
      <main className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <Link href="/" className="text-sm text-muted hover:text-fg">
          ← Ana sayfaya dön
        </Link>
        <h1 className="mt-6 font-display text-3xl">{appContent.contestant.pageTitle}</h1>
        <p className="mt-2 text-muted">{appContent.contestant.pageSubtitle}</p>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">{appContent.contestant.termsTitle}</h2>
          <p className="mt-3 text-sm text-muted whitespace-pre-line">
            {terms?.content ??
              "Katılımcılar 18 yaş ve üzeri olmalıdır. 18 yaş altı adaylar veli onayı sunmalıdır. Başvuru sürecinde verilen bilgilerin doğruluğu esastır."}
          </p>
        </section>

        <section className="mt-10">
          <ContestantForm content={appContent} />
        </section>
      </main>
      <SiteFooter
        contactEmail={siteSettings?.contact_email ?? "info@tilsimmodelofturkiye.com"}
        contactPhone={siteSettings?.contact_phone ?? "+90 212 000 00 00"}
        contactAddress={siteSettings?.contact_address ?? "Nişantaşı / İstanbul"}
      />
    </div>
  );
}
