create table if not exists hotel_photos (
  id bigserial primary key,
  title text,
  photo_url text not null,
  "order" int default 0
);

create index if not exists idx_hotel_photos_order on hotel_photos ("order");

alter table hotel_photos enable row level security;

create policy "public read hotel photos" on hotel_photos
  for select using (true);

create policy "admin write hotel photos" on hotel_photos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
