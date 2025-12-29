# Tılsım Model of Türkiye

Premium, mobil öncelikli yarışma sitesi (Next.js + Supabase).

## Kurulum

### 1) Supabase projesi oluştur
1. [Supabase](https://supabase.com) üzerinde yeni proje oluşturun.
2. Project Settings → API ekranından `SUPABASE_URL`, `anon` ve `service_role` anahtarlarını alın.

### 2) SQL şemasını çalıştır
Supabase SQL Editor'da `supabase/migrations/001_init.sql` dosyasını çalıştırın.
Ardından içerik ve SEO alanları için sırasıyla `supabase/migrations/002_content.sql`, `003_home_updates.sql` ve `004_seo_articles.sql` dosyalarını çalıştırın.

### 3) Storage bucket'ları oluştur
Supabase Storage → Buckets bölümünde aşağıdaki bucket'ları oluşturun:
- `contestant_uploads`
- `sponsor_uploads`
- `site_uploads`

> `site_uploads` bucket'ı logo görseli için kullanılır.

> Not: Logo ve medya içeriklerini göstermek için bucket'ları **public** yapın veya signed URL yaklaşımı kullanın.

### 4) ENV değişkenlerini ayarla
`.env.example` dosyasını `.env.local` olarak kopyalayın:

```bash
cp .env.example .env.local
```

`.env.local` içinde aşağıdakileri doldurun:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=https://tilsimmodelofturkiye.com
```

### 5) Lokal çalıştır

```bash
npm install
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

### 6) Deploy (Vercel + custom domain)
1. Projeyi GitHub'a gönderin.
2. Vercel üzerinden yeni proje oluşturup repo'yu bağlayın.
3. Environment Variables kısmına `.env.local` içeriğini ekleyin.
4. Deploy alın.
5. Vercel → Domains bölümünde `tilsimmodelofturkiye.com` domainini ekleyin ve yönlendirmeleri tamamlayın.

## Admin Panel
- `/admin/login` üzerinden admin kullanıcı ile giriş yapılır.
- Supabase Auth içinde admin kullanıcısı oluşturmanız gerekir.
- İçerikler, SSS, takvim, sponsor paketleri/logoları ve yasal metinler buradan yönetilir.
- Başvuru sayfalarının metinleri ve form etiketleri de admin panelinden düzenlenebilir.
- Site logosu için `site_uploads` bucket'ı kullanılır.
- SEO başlığı/açıklaması ve makaleler admin panelinden yönetilir.

## Notlar
- Başvurular `contestant_applications` ve `sponsor_applications` tablolarına yazılır.
- Dosya metadata bilgileri JSON olarak kaydedilir.
- Basit bir IP tabanlı rate-limit uygulaması `lib/rate-limit.ts` içinde yer alır.
