export type AppContent = {
  contestant: {
    pageTitle: string;
    pageSubtitle: string;
    termsTitle: string;
    successTitle: string;
    successSubtitle: string;
    submitLabel: string;
    termsCheckboxLabel: string;
    under18Note: string;
    requiredFields: string[];
    customFields: { label: string; required: boolean }[];
  };
  sponsor: {
    pageTitle: string;
    pageSubtitle: string;
    termsTitle: string;
    successTitle: string;
    successSubtitle: string;
    submitLabel: string;
    termsLinkLabel: string;
    packagesHelper: string;
    packagesEmpty: string;
  };
  labels: {
    contestant: Record<string, string>;
    sponsor: Record<string, string>;
  };
  placeholders: {
    contestant: Record<string, string>;
    sponsor: Record<string, string>;
  };
};

export const defaultAppContent: AppContent = {
  contestant: {
    pageTitle: "Yarışmacı Başvuru",
    pageSubtitle: "Başvuru formunu eksiksiz doldurun ve belgelerinizi yükleyin.",
    termsTitle: "Katılım Şartları",
    successTitle: "Başvurun alındı",
    successSubtitle: "Ekibimiz en kısa sürede seninle iletişime geçecek.",
    submitLabel: "Başvuruyu Gönder",
    termsCheckboxLabel: "Şartları okudum ve kabul ediyorum.",
    under18Note: "18 yaş altı için onay belgesi zorunludur.",
    requiredFields: [
      "adSoyad",
      "dogumTarihi",
      "boyCm",
      "sehir",
      "telefon",
      "eposta",
      "instagramUrl",
      "kendiniTanit",
      "vesikalikFoto",
      "tamBoyFoto",
    ],
    customFields: [],
  },
  sponsor: {
    pageTitle: "Sponsor Başvuru",
    pageSubtitle: "Markanıza özel paketleri birlikte kurgulayalım.",
    termsTitle: "Sponsorluk Bilgileri",
    successTitle: "Başvurunuz alınmıştır",
    successSubtitle: "Ekibimiz sizinle en kısa sürede iletişime geçecektir.",
    submitLabel: "Sponsor Başvurusu Gönder",
    termsLinkLabel: "Şartname PDF'ini görüntüle",
    packagesHelper: "İlgilenilen Paketler",
    packagesEmpty: "Paketler admin panelinden tanımlanır.",
  },
  labels: {
    contestant: {
      adSoyad: "Ad Soyad",
      dogumTarihi: "Doğum Tarihi",
      boyCm: "Boy (cm)",
      sehir: "Şehir",
      telefon: "Telefon",
      eposta: "E-posta",
      instagramUrl: "Instagram Profil Linki",
      tiktokUrl: "TikTok Profil Linki (opsiyonel)",
      kendiniTanit: "Kendini Kısaca Tanıt",
      vesikalikFoto: "Vesikalık Fotoğraf (zorunlu)",
      tamBoyFoto: "Tam Boy Fotoğraf (zorunlu)",
      ekFotograflar: "Ek Fotoğraflar (opsiyonel, max 5)",
      tanitimVideosu: "Tanıtım Videosu (opsiyonel)",
      onayBelgesi: "Veli Onay Belgesi",
    },
    sponsor: {
      firmaAdi: "Firma Adı",
      yetkiliAdiSoyadi: "Yetkili Adı Soyadı",
      sektor: "Sektör",
      telefon: "Telefon",
      eposta: "E-posta",
      butceAraligi: "Bütçe Aralığı",
      ilgilenilenPaketler: "İlgilenilen Paketler",
      mesaj: "Mesajınız",
      firmaSunumu: "Firma Sunumu (PDF, opsiyonel)",
      firmaLogosu: "Firma Logosu (opsiyonel)",
    },
  },
  placeholders: {
    contestant: {
      adSoyad: "Adınız Soyadınız",
      dogumTarihi: "",
      boyCm: "175",
      sehir: "İstanbul",
      telefon: "05xx xxx xx xx",
      eposta: "ornek@mail.com",
      instagramUrl: "https://instagram.com/",
      tiktokUrl: "https://tiktok.com/@",
      kendiniTanit: "Kısaca kendinden bahset.",
    },
    sponsor: {
      firmaAdi: "Marka / Şirket Adı",
      yetkiliAdiSoyadi: "Yetkili kişi",
      sektor: "Moda, teknoloji, perakende...",
      telefon: "05xx xxx xx xx",
      eposta: "marka@mail.com",
      butceAraligi: "Örn. 100.000 - 250.000 TL",
      mesaj: "Kısaca beklentinizi yazın.",
    },
  },
};

export function mergeAppContent(content?: Partial<AppContent> | null): AppContent {
  if (!content) return defaultAppContent;
  return {
    contestant: {
      ...defaultAppContent.contestant,
      ...content.contestant,
      requiredFields: content.contestant?.requiredFields ?? defaultAppContent.contestant.requiredFields,
      customFields: content.contestant?.customFields ?? defaultAppContent.contestant.customFields,
    },
    sponsor: { ...defaultAppContent.sponsor, ...content.sponsor },
    labels: {
      contestant: { ...defaultAppContent.labels.contestant, ...content.labels?.contestant },
      sponsor: { ...defaultAppContent.labels.sponsor, ...content.labels?.sponsor },
    },
    placeholders: {
      contestant: { ...defaultAppContent.placeholders.contestant, ...content.placeholders?.contestant },
      sponsor: { ...defaultAppContent.placeholders.sponsor, ...content.placeholders?.sponsor },
    },
  };
}
