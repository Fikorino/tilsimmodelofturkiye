import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL("https://tilsimmodelofturkiye.com"),
  title: "Tılsım Model of Türkiye",
  description:
    "Tılsım Model of Türkiye ile Türkiye'nin en prestijli model yarışmasına katılın. Yarışmacı ve sponsor başvuruları şimdi açık.",
  openGraph: {
    title: "Tılsım Model of Türkiye",
    description:
      "Türkiye'nin en prestijli model yarışması. Yarışmacı ve sponsor başvuruları şimdi açık.",
    url: "https://tilsimmodelofturkiye.com",
    siteName: "Tılsım Model of Türkiye",
    locale: "tr_TR",
    type: "website",
  },
  alternates: {
    canonical: "https://tilsimmodelofturkiye.com",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}> 
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
