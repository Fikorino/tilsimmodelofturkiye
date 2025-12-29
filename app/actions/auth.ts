"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerActionClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const supabase = createSupabaseServerActionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, message: "Giriş başarısız. Bilgileri kontrol edin." };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = createSupabaseServerActionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
