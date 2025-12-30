import Link from "next/link";

export function SiteFooter({
  contactEmail,
  contactPhone,
  contactAddress,
}: {
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}) {
  return (
    <footer className="border-t border-white/10 bg-black/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <h3 className="text-lg font-semibold">Tılsım Model of Türkiye</h3>
          <p className="mt-2 text-sm text-muted">
            Türkiye'nin en seçkin model yarışması. Yeni jenerasyon yetenekleri keşfetmek için sahnedeyiz.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gold">İletişim</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>{contactEmail}</li>
            <li>{contactPhone}</li>
            <li>{contactAddress}</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gold">Yasal</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <Link href="/legal/kvkk" className="hover:text-fg">
                KVKK
              </Link>
            </li>
            <li>
              <Link href="/legal/aydinlatma" className="hover:text-fg">
                Aydınlatma Metni
              </Link>
            </li>
            <li>
              <Link href="/legal/acik-riza" className="hover:text-fg">
                Açık Rıza
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Tılsım Model of Türkiye. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
