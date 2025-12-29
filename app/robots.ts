export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin"],
    },
    sitemap: "https://tilsimmodelofturkiye.com/sitemap.xml",
  };
}
