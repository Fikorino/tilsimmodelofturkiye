alter table home_sections add column if not exists hotel_image_url text;
alter table home_sections add column if not exists hotel_address text;
alter table home_sections add column if not exists hotel_map_url text;

create table if not exists jury_members (
  id bigserial primary key,
  name text not null,
  role text,
  photo_url text,
  socials jsonb default '{}'::jsonb,
  "order" int default 0
);

create index if not exists idx_jury_members_order on jury_members ("order");

alter table jury_members enable row level security;

create policy "public read jury members" on jury_members
  for select using (true);

create policy "admin write jury members" on jury_members
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
