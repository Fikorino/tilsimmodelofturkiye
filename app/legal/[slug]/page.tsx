import Link from "next/link";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server";

export default async function LegalPage({ params }: { params: { slug: string } }) {
  const supabase = createSupabaseServerComponentClient();
  const { data } = await supabase.from("legal_pages").select("*").eq("slug", params.slug).single();

  return (
    <div className="min-h-screen bg-bg text-fg">
      <main className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <Link href="/" className="text-sm text-muted hover:text-fg">
          ← Ana sayfaya dön
        </Link>
        <h1 className="mt-6 font-display text-3xl">{data?.title ?? "Yasal Metin"}</h1>
        <article className="mt-6 whitespace-pre-line text-sm text-muted">
          {data?.content ?? "Bu metin admin panelinden güncellenebilir."}
        </article>
      </main>
    </div>
  );
}
