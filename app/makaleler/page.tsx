import Link from "next/link";
import Image from "next/image";
import { getArticles, getSiteSettings } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MotionReveal } from "@/components/motion-reveal";

export default async function ArticlesPage() {
  const [articles, siteSettings] = await Promise.all([getArticles(), getSiteSettings()]);

  return (
    <div className="min-h-screen bg-bg text-fg">
      <SiteHeader
        brandName={siteSettings?.brand_name}
        logoUrl={siteSettings?.logo_url}
        logoSize={siteSettings?.logo_size}
        logoOnly={siteSettings?.logo_only}
      />
      <main className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <MotionReveal>
          <h1 className="font-display text-3xl">Makaleler</h1>
          <p className="mt-2 text-muted">Yarışma, moda ve kariyer yolculuğuna dair güncel içerikler.</p>
        </MotionReveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {articles.length === 0 && (
            <div className="text-sm text-muted">Henüz yayınlanmış makale yok.</div>
          )}
          {articles.map((article: any) => (
            <Link
              key={article.id}
              href={`/makaleler/${article.slug}`}
              className="glass rounded-2xl p-6 transition hover:border-gold/50"
            >
              {article.cover_image_url && (
                <Image
                  src={article.cover_image_url}
                  alt={article.title}
                  width={560}
                  height={320}
                  className="mb-4 h-48 w-full rounded-xl object-cover"
                  unoptimized
                />
              )}
              <h2 className="text-xl font-semibold">{article.title}</h2>
              <p className="mt-2 text-sm text-muted">{article.excerpt}</p>
              {article.published_at && (
                <span className="mt-4 inline-flex text-xs text-gold">{article.published_at}</span>
              )}
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter
        contactEmail={siteSettings?.contact_email ?? "info@tilsimmodelofturkiye.com"}
        contactPhone={siteSettings?.contact_phone ?? "+90 212 000 00 00"}
        contactAddress={siteSettings?.contact_address ?? "Nişantaşı / İstanbul"}
      />
    </div>
  );
}
