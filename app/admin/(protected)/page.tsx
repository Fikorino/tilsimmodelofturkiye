import { signOut } from "@/app/actions/auth";
import {
  addFaqItem,
  addSponsorLogo,
  addSponsorPackage,
  addTimelineItem,
  deleteFaqItem,
  deleteSponsorLogo,
  deleteSponsorPackage,
  deleteTimelineItem,
  upsertHomeSections,
  upsertLegalPage,
  upsertSiteSettings,
  updateFaqItem,
  updateSponsorPackage,
  updateTimelineItem,
} from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: {
    query?: string;
    city?: string;
    date?: string;
    sponsorQuery?: string;
    sponsorDate?: string;
  };
}) {
  const supabase = createSupabaseServerComponentClient();
  const contestantQuery = supabase
    .from("contestant_applications")
    .select("*")
    .ilike("ad_soyad", `%${searchParams.query ?? ""}%`)
    .order("created_at", { ascending: false });

  if (searchParams.city) {
    contestantQuery.ilike("sehir", `%${searchParams.city}%`);
  }
  if (searchParams.date) {
    contestantQuery
      .gte("created_at", `${searchParams.date}T00:00:00Z`)
      .lte("created_at", `${searchParams.date}T23:59:59Z`);
  }

  const sponsorQuery = supabase
    .from("sponsor_applications")
    .select("*")
    .ilike("firma_adi", `%${searchParams.sponsorQuery ?? ""}%`)
    .order("created_at", { ascending: false });

  if (searchParams.sponsorDate) {
    sponsorQuery
      .gte("created_at", `${searchParams.sponsorDate}T00:00:00Z`)
      .lte("created_at", `${searchParams.sponsorDate}T23:59:59Z`);
  }

  const [
    { data: siteSettings },
    { data: homeSections },
    { data: timelineItems },
    { data: faqItems },
    { data: sponsorPackages },
    { data: sponsorLogos },
    { data: legalPages },
    { data: contestantApplications },
    { data: sponsorApplications },
  ] = await Promise.all([
    supabase.from("site_settings").select("*").single(),
    supabase.from("home_sections").select("*").single(),
    supabase.from("timeline_items").select("*").order("order", { ascending: true }),
    supabase.from("faq_items").select("*").order("order", { ascending: true }),
    supabase.from("sponsor_packages").select("*").order("order", { ascending: true }),
    supabase.from("sponsor_logos").select("*").order("order", { ascending: true }),
    supabase.from("legal_pages").select("*"),
    contestantQuery,
    sponsorQuery,
  ]);

  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Admin Panel</h1>
          <form action={signOut}>
            <Button variant="outline" type="submit">
              Çıkış
            </Button>
          </form>
        </div>

        <Tabs defaultValue="content" className="mt-8">
          <TabsList>
            <TabsTrigger value="content">İçerik Yönetimi</TabsTrigger>
            <TabsTrigger value="applications">Başvurular</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <div className="grid gap-10">
              <section className="glass rounded-2xl p-6">
                <h2 className="text-xl font-semibold">Site Ayarları</h2>
                <form action={upsertSiteSettings} className="mt-6 grid gap-4">
                  <div className="grid gap-2">
                    <Label>Marka Adı</Label>
                    <Input
                      name="brandName"
                      defaultValue={siteSettings?.brand_name ?? "Tılsım Model of Türkiye"}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Domain</Label>
                    <Input
                      name="domain"
                      defaultValue={siteSettings?.domain ?? "tilsimmodelofturkiye.com"}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>İletişim E-posta</Label>
                    <Input
                      name="contactEmail"
                      defaultValue={siteSettings?.contact_email ?? "info@tilsimmodelofturkiye.com"}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Telefon</Label>
                    <Input
                      name="contactPhone"
                      defaultValue={siteSettings?.contact_phone ?? "+90 212 000 00 00"}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Adres</Label>
                    <Textarea
                      name="contactAddress"
                      defaultValue={siteSettings?.contact_address ?? "Nişantaşı / İstanbul"}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Instagram</Label>
                    <Input name="instagram" defaultValue={siteSettings?.socials?.instagram ?? ""} />
                  </div>
                  <div className="grid gap-2">
                    <Label>TikTok</Label>
                    <Input name="tiktok" defaultValue={siteSettings?.socials?.tiktok ?? ""} />
                  </div>
                  <div className="grid gap-2">
                    <Label>YouTube</Label>
                    <Input name="youtube" defaultValue={siteSettings?.socials?.youtube ?? ""} />
                  </div>
                  <Button type="submit">Kaydet</Button>
                </form>
              </section>

              <section className="glass rounded-2xl p-6">
                <h2 className="text-xl font-semibold">Ana Sayfa İçerikleri</h2>
                <form action={upsertHomeSections} className="mt-6 grid gap-4">
                  <Input
                    name="heroTitle"
                    defaultValue={homeSections?.hero_title ?? "Tılsım Model of Türkiye"}
                  />
                  <Textarea name="heroSubtitle" defaultValue={homeSections?.hero_subtitle ?? ""} />
                  <Input name="heroDateCity" defaultValue={homeSections?.hero_date_city ?? ""} />
                  <Input name="aboutTitle" defaultValue={homeSections?.about_title ?? ""} />
                  <Textarea name="aboutBody" defaultValue={homeSections?.about_body ?? ""} />
                  <Input name="processTitle" defaultValue={homeSections?.process_title ?? ""} />
                  <Textarea name="processBody" defaultValue={homeSections?.process_body ?? ""} />
                  <Input name="juryTitle" defaultValue={homeSections?.jury_title ?? ""} />
                  <Textarea name="juryBody" defaultValue={homeSections?.jury_body ?? ""} />
                  <Input name="prizesTitle" defaultValue={homeSections?.prizes_title ?? ""} />
                  <Textarea name="prizesBody" defaultValue={homeSections?.prizes_body ?? ""} />
                  <Input name="faqTitle" defaultValue={homeSections?.faq_title ?? ""} />
                  <Input name="sponsorsTitle" defaultValue={homeSections?.sponsors_title ?? ""} />
                  <Input name="ctaPrimary" defaultValue={homeSections?.cta_primary ?? ""} />
                  <Input name="ctaSecondary" defaultValue={homeSections?.cta_secondary ?? ""} />
                  <Button type="submit">Kaydet</Button>
                </form>
              </section>

              <section className="glass rounded-2xl p-6">
                <h2 className="text-xl font-semibold">Takvim Adımları</h2>
                <form action={addTimelineItem} className="mt-6 grid gap-3 md:grid-cols-4">
                  <Input name="title" placeholder="Başlık" />
                  <Input name="dateText" placeholder="Tarih" />
                  <Input name="order" placeholder="Sıra" type="number" />
                  <Button type="submit">Ekle</Button>
                  <Textarea name="description" placeholder="Açıklama" className="md:col-span-4" />
                </form>
                <div className="mt-6 grid gap-4">
                  {timelineItems?.map((item: any) => (
                    <form
                      key={item.id}
                      action={updateTimelineItem}
                      className="grid gap-3 md:grid-cols-4"
                    >
                      <input type="hidden" name="id" value={item.id} />
                      <Input name="title" defaultValue={item.title} />
                      <Input name="dateText" defaultValue={item.date_text} />
                      <Input name="order" type="number" defaultValue={item.order} />
                      <div className="flex gap-2">
                        <Button type="submit" size="sm">
                          Güncelle
                        </Button>
                        <Button type="submit" formAction={deleteTimelineItem} variant="outline" size="sm">
                          Sil
                        </Button>
                      </div>
                      <Textarea
                        name="description"
                        defaultValue={item.description}
                        className="md:col-span-4"
                      />
                    </form>
                  ))}
                </div>
              </section>

              <section className="glass rounded-2xl p-6">
                <h2 className="text-xl font-semibold">SSS</h2>
                <form action={addFaqItem} className="mt-6 grid gap-3 md:grid-cols-3">
                  <Input name="question" placeholder="Soru" />
                  <Input name="order" placeholder="Sıra" type="number" />
                  <Button type="submit">Ekle</Button>
                  <Textarea name="answer" placeholder="Cevap" className="md:col-span-3" />
                </form>
                <div className="mt-6 grid gap-4">
                  {faqItems?.map((item: any) => (
                    <form key={item.id} action={updateFaqItem} className="grid gap-3 md:grid-cols-3">
                      <input type="hidden" name="id" value={item.id} />
                      <Input name="question" defaultValue={item.question} />
                      <Input name="order" type="number" defaultValue={item.order} />
                      <div className="flex gap-2">
                        <Button type="submit" size="sm">
                          Güncelle
                        </Button>
                        <Button type="submit" formAction={deleteFaqItem} variant="outline" size="sm">
                          Sil
                        </Button>
                      </div>
                      <Textarea name="answer" defaultValue={item.answer} className="md:col-span-3" />
                    </form>
                  ))}
                </div>
              </section>

              <section className="glass rounded-2xl p-6">
                <h2 className="text-xl font-semibold">Sponsor Paketleri</h2>
                <form action={addSponsorPackage} className="mt-6 grid gap-3 md:grid-cols-4">
                  <Input name="name" placeholder="Paket adı" />
                  <Input name="order" placeholder="Sıra" type="number" />
                  <Button type="submit">Ekle</Button>
                  <Textarea name="description" placeholder="Açıklama" className="md:col-span-4" />
                  <Textarea
                    name="benefitsJson"
                    placeholder="Avantajlar (satır başına bir madde)"
                    className="md:col-span-4"
                  />
                </form>
                <div className="mt-6 grid gap-4">
                  {sponsorPackages?.map((item: any) => (
                    <form
                      key={item.id}
                      action={updateSponsorPackage}
                      className="grid gap-3 md:grid-cols-4"
                    >
                      <input type="hidden" name="id" value={item.id} />
                      <Input name="name" defaultValue={item.name} />
                      <Input name="order" type="number" defaultValue={item.order} />
                      <div className="flex gap-2">
                        <Button type="submit" size="sm">
                          Güncelle
                        </Button>
                        <Button
                          type="submit"
                          formAction={deleteSponsorPackage}
                          variant="outline"
                          size="sm"
                        >
                          Sil
                        </Button>
                      </div>
                      <Textarea
                        name="description"
                        defaultValue={item.description}
                        className="md:col-span-4"
                      />
                      <Textarea
                        name="benefitsJson"
                        defaultValue={item.benefits_json?.join("\n")}
                        className="md:col-span-4"
                      />
                    </form>
                  ))}
                </div>
              </section>

              <section className="glass rounded-2xl p-6">
                <h2 className="text-xl font-semibold">Sponsor Logoları</h2>
                <form
                  action={addSponsorLogo}
                  encType="multipart/form-data"
                  className="mt-6 grid gap-3 md:grid-cols-4"
                >
                  <Input name="name" placeholder="Logo adı" />
                  <Input name="websiteUrl" placeholder="Web sitesi" />
                  <Input name="logoUrl" placeholder="Logo URL (opsiyonel)" />
                  <Input name="order" placeholder="Sıra" type="number" />
                  <div className="flex items-center gap-3">
                    <Input type="file" name="logoFile" />
                    <Button type="submit">Ekle</Button>
                  </div>
                </form>
                <div className="mt-6 grid gap-4">
                  {sponsorLogos?.map((item: any) => (
                    <form
                      key={item.id}
                      action={deleteSponsorLogo}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted">{item.website_url}</p>
                      </div>
                      <input type="hidden" name="id" value={item.id} />
                      <Button type="submit" variant="outline" size="sm">
                        Sil
                      </Button>
                    </form>
                  ))}
                </div>
              </section>

              <section className="glass rounded-2xl p-6">
                <h2 className="text-xl font-semibold">Yasal Metinler</h2>
                {[
                  { slug: "kvkk", title: "KVKK" },
                  { slug: "aydinlatma", title: "Aydınlatma Metni" },
                  { slug: "acik-riza", title: "Açık Rıza" },
                  { slug: "katilim-sartlari", title: "Yarışmacı Katılım Şartları" },
                  { slug: "sponsor-sartname", title: "Sponsor Şartnamesi" },
                ].map((meta) => {
                  const page = legalPages?.find((item: any) => item.slug === meta.slug);
                  return (
                    <form key={meta.slug} action={upsertLegalPage} className="mt-6 grid gap-3">
                      <input type="hidden" name="slug" value={meta.slug} />
                      <Label>{meta.title}</Label>
                      <Input name="title" defaultValue={page?.title ?? meta.title} />
                      <Textarea name="content" defaultValue={page?.content ?? ""} />
                      {meta.slug === "sponsor-sartname" && (
                        <Input name="pdfUrl" placeholder="PDF URL" defaultValue={page?.pdf_url ?? ""} />
                      )}
                      <Button type="submit">Kaydet</Button>
                    </form>
                  );
                })}
              </section>
            </div>
          </TabsContent>

          <TabsContent value="applications">
            <section className="glass rounded-2xl p-6">
              <h2 className="text-xl font-semibold">Yarışmacı Başvuruları</h2>
              <form className="mt-4 grid gap-3 md:grid-cols-4" method="get">
                <Input name="query" placeholder="Ad Soyad" defaultValue={searchParams.query ?? ""} />
                <Input name="city" placeholder="Şehir" defaultValue={searchParams.city ?? ""} />
                <Input name="date" type="date" defaultValue={searchParams.date ?? ""} />
                <Button type="submit">Filtrele</Button>
              </form>
              <div className="mt-6 grid gap-4">
                {contestantApplications?.map((app: any) => (
                  <div key={app.id} className="rounded-2xl border border-white/10 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{app.ad_soyad}</p>
                        <p className="text-sm text-muted">
                          {app.sehir} · {app.telefon}
                        </p>
                      </div>
                      <span className="text-xs text-gold">{app.reference}</span>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm text-muted">
                      <p>E-posta: {app.eposta}</p>
                      <p>Instagram: {app.instagram_url}</p>
                      <p>TikTok: {app.tiktok_url ?? "—"}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      {app.vesikalik_foto?.publicUrl && (
                        <a className="text-gold" href={app.vesikalik_foto.publicUrl}>
                          Vesikalık
                        </a>
                      )}
                      {app.tam_boy_foto?.publicUrl && (
                        <a className="text-gold" href={app.tam_boy_foto.publicUrl}>
                          Tam Boy
                        </a>
                      )}
                      {app.tanitim_videosu?.publicUrl && (
                        <a className="text-gold" href={app.tanitim_videosu.publicUrl}>
                          Tanıtım Videosu
                        </a>
                      )}
                      {Array.isArray(app.ek_fotograflar) &&
                        app.ek_fotograflar.map((foto: any, index: number) =>
                          foto?.publicUrl ? (
                            <a key={foto.publicUrl} className="text-gold" href={foto.publicUrl}>
                              Ek Fotoğraf {index + 1}
                            </a>
                          ) : null
                        )}
                      {app.onay_belgesi?.publicUrl && (
                        <a className="text-gold" href={app.onay_belgesi.publicUrl}>
                          Onay Belgesi
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="glass rounded-2xl p-6 mt-10">
              <h2 className="text-xl font-semibold">Sponsor Başvuruları</h2>
              <form className="mt-4 grid gap-3 md:grid-cols-3" method="get">
                <Input name="sponsorQuery" placeholder="Firma adı" defaultValue={searchParams.sponsorQuery ?? ""} />
                <Input name="sponsorDate" type="date" defaultValue={searchParams.sponsorDate ?? ""} />
                <Button type="submit">Filtrele</Button>
              </form>
              <div className="mt-6 grid gap-4">
                {sponsorApplications?.map((app: any) => (
                  <div key={app.id} className="rounded-2xl border border-white/10 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{app.firma_adi}</p>
                        <p className="text-sm text-muted">
                          {app.yetkili_adi_soyadi} · {app.telefon}
                        </p>
                      </div>
                      <span className="text-xs text-gold">{app.reference}</span>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm text-muted">
                      <p>E-posta: {app.eposta}</p>
                      <p>İlgilenilen Paketler: {app.ilgilenilen_paketler?.join(", ")}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      {app.firma_sunumu?.publicUrl && (
                        <a className="text-gold" href={app.firma_sunumu.publicUrl}>
                          Sunum PDF
                        </a>
                      )}
                      {app.firma_logosu?.publicUrl && (
                        <a className="text-gold" href={app.firma_logosu.publicUrl}>
                          Logo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
