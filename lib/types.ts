export type HomeSection = {
  heroTitle: string;
  heroSubtitle: string;
  heroDateCity: string;
  aboutTitle: string;
  aboutBody: string;
  processTitle: string;
  processBody: string;
  juryTitle: string;
  juryBody: string;
  prizesTitle: string;
  prizesBody: string;
  faqTitle: string;
  sponsorsTitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export type SiteSettings = {
  brandName: string;
  domain: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socials: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
};
