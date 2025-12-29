import { signIn } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-bg text-fg flex items-center justify-center px-4">
      <form
        action={signIn}
        className="glass w-full max-w-md space-y-6 rounded-2xl p-8"
      >
        <div>
          <h1 className="text-2xl font-semibold">Admin Girişi</h1>
          <p className="mt-2 text-sm text-muted">Yönetim paneline erişmek için giriş yapın.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-posta</Label>
          <Input id="email" name="email" type="email" placeholder="admin@mail.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Şifre</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">Giriş Yap</Button>
      </form>
    </div>
  );
}
