alter table site_settings add column if not exists logo_size int;
alter table site_settings add column if not exists logo_only boolean default false;
