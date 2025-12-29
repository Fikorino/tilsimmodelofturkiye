import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { getSiteSettings } from "@/lib/data";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const title = siteSettings?.seo_title || siteSettings?.brand_name || "Tılsım Model of Türkiye";
  const description =
    siteSettings?.seo_description ||
    "Tılsım Model of Türkiye ile Türkiye'nin en prestijli model yarışmasına katılın. Yarışmacı ve sponsor başvuruları şimdi açık.";
  const domain = siteSettings?.domain || "tilsimmodelofturkiye.com";

  return {
    metadataBase: new URL(`https://${domain}`),
    title,
    description,
    keywords: siteSettings?.seo_keywords ?? undefined,
    openGraph: {
      title,
      description,
      url: `https://${domain}`,
      siteName: siteSettings?.brand_name ?? "Tılsım Model of Türkiye",
      locale: "tr_TR",
      type: "website",
    },
    alternates: {
      canonical: `https://${domain}`,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}> 
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
