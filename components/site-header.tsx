import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { label: "Hakkında", href: "#hakkinda" },
  { label: "Takvim", href: "#takvim" },
  { label: "Jüri", href: "#juri" },
  { label: "Ödüller", href: "#oduller" },
  { label: "Medya", href: "#medya" },
  { label: "Makaleler", href: "/makaleler" },
  { label: "SSS", href: "#sss" },
  { label: "Sponsorlar", href: "#sponsorlar" },
];

export function SiteHeader({
  brandName,
  logoUrl,
  logoSize,
  logoOnly,
}: {
  brandName?: string;
  logoUrl?: string | null;
  logoSize?: number | null;
  logoOnly?: boolean | null;
}) {
  const size = logoSize && logoSize > 0 ? logoSize : 120;
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="text-lg font-semibold tracking-wide">
          {logoUrl ? (
            <span className="flex items-center gap-3">
              <Image
                src={logoUrl}
                alt={brandName ?? "Tılsım Model of Türkiye"}
                width={size}
                height={size}
                className="rounded-full object-cover"
                unoptimized
              />
              {!logoOnly && <span>{brandName ?? "Tılsım Model of Türkiye"}</span>}
            </span>
          ) : (
            brandName ?? "Tılsım Model of Türkiye"
          )}
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          {navItems.map((item) =>
            item.href.startsWith("/") ? (
              <Link key={item.href} href={item.href} className="hover:text-fg">
                {item.label}
              </Link>
            ) : (
              <a key={item.href} href={item.href} className="hover:text-fg">
                {item.label}
              </a>
            )
          )}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/basvuru/yarismaci">Yarışmacı Başvur</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="hidden md:inline-flex">
            <Link href="/basvuru/sponsor">Sponsor Başvur</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
