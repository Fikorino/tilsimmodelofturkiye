import Link from "next/link";
import { SponsorForm } from "@/components/forms/sponsor-form";
import { getSiteSettings, getSponsorPackages, getSponsorTerms } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default async function SponsorApplicationPage() {
  const [terms, packages, siteSettings] = await Promise.all([
    getSponsorTerms(),
    getSponsorPackages(),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen bg-bg text-fg">
      <SiteHeader brandName={siteSettings?.brand_name} />
      <main className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <Link href="/" className="text-sm text-muted hover:text-fg">
          ← Ana sayfaya dön
        </Link>
        <h1 className="mt-6 font-display text-3xl">Sponsor Başvuru</h1>
        <p className="mt-2 text-muted">Markanıza özel paketleri birlikte kurgulayalım.</p>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Sponsorluk Bilgileri</h2>
          <p className="mt-3 text-sm text-muted whitespace-pre-line">
            {terms?.content ??
              "Sponsorluk paketlerimiz görünürlük, sahne entegrasyonu ve dijital tanıtım içerir. Detaylı şartname ve teklif dosyası admin panelinden yönetilebilir."}
          </p>
          {terms?.pdf_url && (
            <Link href={terms.pdf_url} className="mt-3 inline-flex text-sm text-gold">
              Şartname PDF'ini görüntüle
            </Link>
          )}
        </section>

        <section className="mt-10">
          <SponsorForm paketler={packages.map((p: any) => ({ id: p.id, name: p.name }))} />
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
