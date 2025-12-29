alter table site_settings add column if not exists logo_url text;

create table if not exists app_content (
  id int primary key default 1,
  content jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table app_content enable row level security;

create policy "public read app content" on app_content
  for select using (true);

create policy "admin write app content" on app_content
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
