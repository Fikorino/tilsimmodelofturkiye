alter table home_sections add column if not exists about_image_url text;
alter table home_sections add column if not exists process_image_url text;
alter table home_sections add column if not exists prizes_image_url text;
alter table home_sections add column if not exists jury_image_url text;

create table if not exists media_items (
  id bigserial primary key,
  title text,
  media_url text not null,
  category text default 'genel',
  "order" int default 0,
  created_at timestamptz default now()
);

create index if not exists idx_media_items_order on media_items ("order");

alter table media_items enable row level security;

create policy "public read media" on media_items
  for select using (true);

create policy "admin write media" on media_items
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
