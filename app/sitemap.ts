import { getArticles } from "@/lib/data";

export default async function sitemap() {
  const baseUrl = "https://tilsimmodelofturkiye.com";
  const articles = await getArticles();

  const staticRoutes = [
    "",
    "/basvuru/yarismaci",
    "/basvuru/sponsor",
    "/makaleler",
    "/legal/kvkk",
    "/legal/aydinlatma",
    "/legal/acik-riza",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
    })),
    ...articles.map((article: any) => ({
      url: `${baseUrl}/makaleler/${article.slug}`,
      lastModified: article.published_at ? new Date(article.published_at) : new Date(),
    })),
  ];
}
