import Link from "next/link";
import Image from "next/image";
import { getPublicContent } from "@/lib/data";
import { MotionReveal } from "@/components/motion-reveal";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function HomePage() {
  const { siteSettings, homeSections, timelineItems, faqItems, sponsorLogos } = await getPublicContent();

  const hero = homeSections
    ? {
        heroTitle: homeSections.hero_title ?? "Tılsım Model of Türkiye",
        heroSubtitle:
          homeSections.hero_subtitle ??
          "Işıltını sahneye taşı. Türkiye'nin en prestijli model yarışmasında yerini al.",
        heroDateCity: homeSections.hero_date_city ?? "09.09.2025 · İstanbul",
        aboutTitle: homeSections.about_title ?? "Yarışma Hakkında",
        aboutBody:
          homeSections.about_body ??
          "Tılsım Model of Türkiye; moda, sahne ve kişisel gelişimi bir araya getiren seçkin bir platformdur. Finale kalan yarışmacılar, özel eğitim kampları ve global markalarla buluşma fırsatı elde eder.",
        processTitle: homeSections.process_title ?? "Süreç & Takvim",
        processBody:
          homeSections.process_body ??
          "Başvuru, ön eleme, kamp ve final gala adımlarını kapsayan özel bir süreç.",
        juryTitle: homeSections.jury_title ?? "Jüri & Eğitmenler",
        juryBody:
          homeSections.jury_body ??
          "Uluslararası moda profesyonelleri, fotoğrafçılar ve kreatif yönetmenler.",
        prizesTitle: homeSections.prizes_title ?? "Ödüller",
        prizesBody:
          homeSections.prizes_body ??
          "Yurt dışı temsil, moda çekimi, marka iş birlikleri ve para ödülleri.",
        faqTitle: homeSections.faq_title ?? "Sıkça Sorulan Sorular",
        sponsorsTitle: homeSections.sponsors_title ?? "Sponsorlarımız",
        ctaPrimary: homeSections.cta_primary ?? "Yarışmacı Başvur",
        ctaSecondary: homeSections.cta_secondary ?? "Sponsor Başvur",
      }
    : {
    heroTitle: "Tılsım Model of Türkiye",
    heroSubtitle: "Işıltını sahneye taşı. Türkiye'nin en prestijli model yarışmasında yerini al.",
    heroDateCity: "09.09.2025 · İstanbul",
    aboutTitle: "Yarışma Hakkında",
    aboutBody:
      "Tılsım Model of Türkiye; moda, sahne ve kişisel gelişimi bir araya getiren seçkin bir platformdur. Finale kalan yarışmacılar, özel eğitim kampları ve global markalarla buluşma fırsatı elde eder.",
    processTitle: "Süreç & Takvim",
    processBody: "Başvuru, ön eleme, kamp ve final gala adımlarını kapsayan özel bir süreç.",
    juryTitle: "Jüri & Eğitmenler",
    juryBody: "Uluslararası moda profesyonelleri, fotoğrafçılar ve kreatif yönetmenler.",
    prizesTitle: "Ödüller",
    prizesBody: "Yurt dışı temsil, moda çekimi, marka iş birlikleri ve para ödülleri.",
    faqTitle: "Sıkça Sorulan Sorular",
    sponsorsTitle: "Sponsorlarımız",
    ctaPrimary: "Yarışmacı Başvur",
    ctaSecondary: "Sponsor Başvur",
      };

  return (
    <div className="min-h-screen bg-bg text-fg">
      <SiteHeader brandName={siteSettings?.brand_name} logoUrl={siteSettings?.logo_url} />
      <main>
        <section className="relative overflow-hidden bg-gold-gradient">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
            <MotionReveal>
              <p className="text-sm uppercase tracking-[0.3em] text-gold">{hero.heroDateCity}</p>
              <h1 className="mt-4 font-display text-4xl md:text-5xl leading-tight">{hero.heroTitle}</h1>
              <p className="mt-4 text-muted text-lg">{hero.heroSubtitle}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/basvuru/yarismaci">{hero.ctaPrimary}</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/basvuru/sponsor">{hero.ctaSecondary}</Link>
                </Button>
              </div>
            </MotionReveal>
            <MotionReveal delay={0.2}>
              <div className="glass rounded-3xl p-6 shadow-glow">
                <Image
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80"
                  alt="Model sahnesi"
                  width={520}
                  height={640}
                  className="rounded-2xl object-cover"
                  priority
                />
              </div>
            </MotionReveal>
          </div>
        </section>

        <section id="hakkinda" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <MotionReveal>
            <h2 className="section-title">{hero.aboutTitle}</h2>
            <p className="mt-4 text-muted text-lg">{hero.aboutBody}</p>
          </MotionReveal>
        </section>

        <section id="takvim" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <MotionReveal>
            <div className="flex items-center justify-between">
              <h2 className="section-title">{hero.processTitle}</h2>
              <span className="text-sm text-muted">{hero.processBody}</span>
            </div>
          </MotionReveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {(timelineItems.length ? timelineItems : [
              { id: 1, title: "Başvurular", date_text: "01.06.2025 - 01.08.2025", description: "Dijital başvuru toplama süreci.", order: 1 },
              { id: 2, title: "Ön Eleme", date_text: "15.08.2025", description: "Online değerlendirme ve mülakatlar.", order: 2 },
              { id: 3, title: "Kamp", date_text: "01.09.2025", description: "Eğitim, styling, yürüyüş ve kamera koçluğu.", order: 3 },
              { id: 4, title: "Final Gala", date_text: "09.09.2025", description: "Canlı yayın ve jüri değerlendirmesi.", order: 4 },
            ]).map((item: any) => (
              <Card key={item.id}>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-gold">{item.date_text || item.dateText}</p>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="juri" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <MotionReveal>
            <h2 className="section-title">{hero.juryTitle}</h2>
            <p className="mt-4 text-muted text-lg">{hero.juryBody}</p>
          </MotionReveal>
        </section>

        <section id="oduller" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <MotionReveal>
            <h2 className="section-title">{hero.prizesTitle}</h2>
            <p className="mt-4 text-muted text-lg">{hero.prizesBody}</p>
          </MotionReveal>
        </section>

        <section id="sss" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <MotionReveal>
            <h2 className="section-title">{hero.faqTitle}</h2>
          </MotionReveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {(faqItems.length ? faqItems : [
              { id: 1, question: "Başvuru ücreti var mı?", answer: "Başvuru ücretsizdir. Finale kalanlar için kamp süreci hakkında bilgi paylaşılır.", order: 1 },
              { id: 2, question: "Yaş sınırı nedir?", answer: "18 yaş ve üzeri adaylar başvurabilir. 18 yaş altı için veli onayı gereklidir.", order: 2 },
              { id: 3, question: "Başvurular ne zaman açıklanır?", answer: "Ön eleme sonuçları e-posta ile paylaşılır.", order: 3 },
              { id: 4, question: "Yarışma hangi şehirde?", answer: "Final gala İstanbul'da yapılacaktır.", order: 4 },
            ]).map((faq: any) => (
              <Card key={faq.id}>
                <h3 className="text-base font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm text-muted">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="sponsorlar" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <MotionReveal>
            <h2 className="section-title">{hero.sponsorsTitle}</h2>
          </MotionReveal>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            {(sponsorLogos.length ? sponsorLogos : [
              { id: 1, name: "Luxe Brand", logo_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80", website_url: "#" },
              { id: 2, name: "Gold Atelier", logo_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80", website_url: "#" },
            ]).map((logo: any) => (
              <a
                key={logo.id}
                href={logo.website_url || "#"}
                className="glass flex items-center gap-3 rounded-full px-6 py-3 text-sm text-muted hover:text-fg"
              >
                <Image
                  src={logo.logo_url || logo.logoUrl}
                  alt={logo.name}
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
                {logo.name}
              </a>
            ))}
          </div>
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
