alter table site_settings add column if not exists seo_title text;
alter table site_settings add column if not exists seo_description text;
alter table site_settings add column if not exists seo_keywords text;

create table if not exists articles (
  id bigserial primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image_url text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  status text default 'draft',
  published_at date,
  created_at timestamptz default now()
);

create index if not exists idx_articles_slug on articles (slug);
create index if not exists idx_articles_status on articles (status);
create index if not exists idx_articles_published_at on articles (published_at);

alter table articles enable row level security;

create policy "public read published articles" on articles
  for select using (status = 'published');

create policy "admin manage articles" on articles
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
