import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getArticleBySlug, getSiteSettings } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const [article, siteSettings] = await Promise.all([
    getArticleBySlug(params.slug),
    getSiteSettings(),
  ]);

  if (!article) {
    return {
      title: "Makale bulunamadı",
      robots: { index: false, follow: false },
    };
  }

  const title = article.seo_title || article.title;
  const description = article.seo_description || article.excerpt || siteSettings?.seo_description || "";

  return {
    title,
    description,
    keywords: article.seo_keywords || siteSettings?.seo_keywords || undefined,
    alternates: {
      canonical: `https://tilsimmodelofturkiye.com/makaleler/${article.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://tilsimmodelofturkiye.com/makaleler/${article.slug}`,
      images: article.cover_image_url ? [{ url: article.cover_image_url }] : undefined,
      locale: "tr_TR",
      type: "article",
    },
  };
}

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const [article, siteSettings] = await Promise.all([
    getArticleBySlug(params.slug),
    getSiteSettings(),
  ]);

  if (!article) {
    return (
      <div className="min-h-screen bg-bg text-fg">
        <main className="mx-auto max-w-3xl px-4 py-16 md:px-6">
          <Link href="/makaleler" className="text-sm text-muted hover:text-fg">
            ← Makalelere dön
          </Link>
          <h1 className="mt-6 text-2xl font-semibold">Makale bulunamadı</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <SiteHeader
        brandName={siteSettings?.brand_name}
        logoUrl={siteSettings?.logo_url}
        logoSize={siteSettings?.logo_size}
        logoOnly={siteSettings?.logo_only}
      />
      <main className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <Link href="/makaleler" className="text-sm text-muted hover:text-fg">
          ← Makalelere dön
        </Link>
        <h1 className="mt-6 font-display text-3xl">{article.title}</h1>
        {article.published_at && <p className="mt-2 text-xs text-gold">{article.published_at}</p>}
        {article.cover_image_url && (
          <Image
            src={article.cover_image_url}
            alt={article.title}
            width={800}
            height={420}
            className="mt-6 rounded-2xl object-cover"
            unoptimized
          />
        )}
        <article className="mt-6 whitespace-pre-line text-sm text-muted">{article.content}</article>
      </main>
      <SiteFooter
        contactEmail={siteSettings?.contact_email ?? "info@tilsimmodelofturkiye.com"}
        contactPhone={siteSettings?.contact_phone ?? "+90 212 000 00 00"}
        contactAddress={siteSettings?.contact_address ?? "Nişantaşı / İstanbul"}
      />
    </div>
  );
}
