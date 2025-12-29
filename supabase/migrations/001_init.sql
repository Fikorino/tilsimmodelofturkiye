create table if not exists site_settings (
  id int primary key default 1,
  brand_name text not null,
  domain text not null,
  contact_email text,
  contact_phone text,
  contact_address text,
  socials jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists home_sections (
  id int primary key default 1,
  hero_title text,
  hero_subtitle text,
  hero_date_city text,
  about_title text,
  about_body text,
  process_title text,
  process_body text,
  jury_title text,
  jury_body text,
  prizes_title text,
  prizes_body text,
  faq_title text,
  sponsors_title text,
  cta_primary text,
  cta_secondary text,
  updated_at timestamptz default now()
);

create table if not exists timeline_items (
  id bigserial primary key,
  title text not null,
  date_text text,
  description text,
  "order" int default 0
);

create table if not exists faq_items (
  id bigserial primary key,
  question text not null,
  answer text not null,
  "order" int default 0
);

create table if not exists sponsor_packages (
  id bigserial primary key,
  name text not null,
  description text,
  benefits_json jsonb default '[]'::jsonb,
  "order" int default 0
);

create table if not exists sponsor_logos (
  id bigserial primary key,
  name text not null,
  logo_url text,
  website_url text,
  "order" int default 0
);

create table if not exists legal_pages (
  id bigserial primary key,
  slug text unique not null,
  title text,
  content text,
  pdf_url text
);

create table if not exists contestant_applications (
  id bigserial primary key,
  reference text unique not null,
  ad_soyad text not null,
  dogum_tarihi text,
  boy_cm text,
  sehir text,
  telefon text,
  eposta text,
  instagram_url text,
  tiktok_url text,
  kendini_tanit text,
  vesikalik_foto jsonb,
  tam_boy_foto jsonb,
  ek_fotograflar jsonb,
  tanitim_videosu jsonb,
  onay_belgesi jsonb,
  status text default 'yeni',
  created_at timestamptz default now()
);

create table if not exists sponsor_applications (
  id bigserial primary key,
  reference text unique not null,
  firma_adi text not null,
  yetkili_adi_soyadi text,
  sektor text,
  telefon text,
  eposta text,
  butce_araligi text,
  ilgilenilen_paketler text[],
  mesaj text,
  firma_sunumu jsonb,
  firma_logosu jsonb,
  status text default 'yeni',
  created_at timestamptz default now()
);

create index if not exists idx_timeline_order on timeline_items ("order");
create index if not exists idx_faq_order on faq_items ("order");
create index if not exists idx_sponsor_packages_order on sponsor_packages ("order");
create index if not exists idx_sponsor_logos_order on sponsor_logos ("order");
create index if not exists idx_contestant_name on contestant_applications (ad_soyad);
create index if not exists idx_contestant_city on contestant_applications (sehir);
create index if not exists idx_sponsor_firma on sponsor_applications (firma_adi);
create index if not exists idx_contestant_created on contestant_applications (created_at);
create index if not exists idx_sponsor_created on sponsor_applications (created_at);

alter table site_settings enable row level security;
alter table home_sections enable row level security;
alter table timeline_items enable row level security;
alter table faq_items enable row level security;
alter table sponsor_packages enable row level security;
alter table sponsor_logos enable row level security;
alter table legal_pages enable row level security;
alter table contestant_applications enable row level security;
alter table sponsor_applications enable row level security;

create policy "public read site settings" on site_settings
  for select using (true);
create policy "admin write site settings" on site_settings
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read home" on home_sections
  for select using (true);
create policy "admin write home" on home_sections
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read timeline" on timeline_items
  for select using (true);
create policy "admin write timeline" on timeline_items
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read faq" on faq_items
  for select using (true);
create policy "admin write faq" on faq_items
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read sponsor packages" on sponsor_packages
  for select using (true);
create policy "admin write sponsor packages" on sponsor_packages
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read sponsor logos" on sponsor_logos
  for select using (true);
create policy "admin write sponsor logos" on sponsor_logos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read legal" on legal_pages
  for select using (true);
create policy "admin write legal" on legal_pages
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public insert contestant" on contestant_applications
  for insert with check (true);
create policy "admin select contestant" on contestant_applications
  for select using (auth.role() = 'authenticated');
create policy "admin update contestant" on contestant_applications
  for update using (auth.role() = 'authenticated');

create policy "public insert sponsor" on sponsor_applications
  for insert with check (true);
create policy "admin select sponsor" on sponsor_applications
  for select using (auth.role() = 'authenticated');
create policy "admin update sponsor" on sponsor_applications
  for update using (auth.role() = 'authenticated');
