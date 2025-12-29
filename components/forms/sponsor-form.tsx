"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitSponsor } from "@/app/actions/submit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  firmaAdi: z.string().min(2, "Firma adı zorunludur."),
  yetkiliAdiSoyadi: z.string().min(3, "Yetkili kişi zorunludur."),
  sektor: z.string().min(2, "Sektör zorunludur."),
  telefon: z.string().min(10, "Telefon zorunludur."),
  eposta: z.string().email("Geçerli bir e-posta giriniz."),
  butceAraligi: z.string().min(2, "Bütçe aralığı seçiniz."),
  ilgilenilenPaketler: z.array(z.string()).min(1, "En az bir paket seçiniz."),
  mesaj: z.string().min(10, "Mesaj zorunludur."),
});

type FormValues = z.infer<typeof formSchema>;

export function SponsorForm({ paketler }: { paketler: { id: string; name: string }[] }) {
  const [status, setStatus] = useState<{ ok: boolean; message?: string; reference?: string } | null>(
    null
  );
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { ilgilenilenPaketler: [] },
  });

  const onSubmit = handleSubmit(async (data) => {
    setStatus(null);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, item));
      } else if (value) {
        formData.append(key, value);
      }
    });

    const fileFields = ["firmaSunumu", "firmaLogosu"];
    fileFields.forEach((field) => {
      const input = document.querySelector<HTMLInputElement>(`input[name='${field}']`);
      if (input?.files?.[0]) {
        formData.append(field, input.files[0]);
      }
    });

    const result = await submitSponsor(formData);
    setStatus(result);
  });

  if (status?.ok) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-semibold">Başvurunuz alınmıştır</h2>
        <p className="mt-3 text-muted">
          Referans numaranız: <span className="text-gold font-semibold">{status.reference}</span>
        </p>
        <p className="mt-2 text-sm text-muted">Ekibimiz sizinle en kısa sürede iletişime geçecektir.</p>
      </div>
    );
  }

  return (
    <form className="grid gap-6" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="firmaAdi">Firma Adı</Label>
          <Input id="firmaAdi" placeholder="Marka / Şirket Adı" {...register("firmaAdi")} />
          {errors.firmaAdi && <span className="text-xs text-red-400">{errors.firmaAdi.message}</span>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="yetkiliAdiSoyadi">Yetkili Adı Soyadı</Label>
          <Input id="yetkiliAdiSoyadi" placeholder="Yetkili kişi" {...register("yetkiliAdiSoyadi")} />
          {errors.yetkiliAdiSoyadi && (
            <span className="text-xs text-red-400">{errors.yetkiliAdiSoyadi.message}</span>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sektor">Sektör</Label>
          <Input id="sektor" placeholder="Moda, teknoloji, perakende..." {...register("sektor")} />
          {errors.sektor && <span className="text-xs text-red-400">{errors.sektor.message}</span>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="telefon">Telefon</Label>
          <Input id="telefon" placeholder="05xx xxx xx xx" {...register("telefon")} />
          {errors.telefon && <span className="text-xs text-red-400">{errors.telefon.message}</span>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="eposta">E-posta</Label>
          <Input id="eposta" type="email" placeholder="marka@mail.com" {...register("eposta")} />
          {errors.eposta && <span className="text-xs text-red-400">{errors.eposta.message}</span>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="butceAraligi">Bütçe Aralığı</Label>
          <Input id="butceAraligi" placeholder="Örn. 100.000 - 250.000 TL" {...register("butceAraligi")} />
          {errors.butceAraligi && (
            <span className="text-xs text-red-400">{errors.butceAraligi.message}</span>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <Label>İlgilenilen Paketler</Label>
        <Controller
          control={control}
          name="ilgilenilenPaketler"
          render={({ field }) => (
            <div className="grid gap-2 md:grid-cols-2">
              {paketler.length ? (
                paketler.map((paket) => {
                  const checked = field.value.includes(paket.name);
                  return (
                    <label key={paket.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => {
                          const updated = event.target.checked
                            ? [...field.value, paket.name]
                            : field.value.filter((value) => value !== paket.name);
                          field.onChange(updated);
                        }}
                        className="h-4 w-4 rounded border-white/30 bg-white/10 text-gold"
                      />
                      {paket.name}
                    </label>
                  );
                })
              ) : (
                <p className="text-sm text-muted">Paketler admin panelinden tanımlanır.</p>
              )}
            </div>
          )}
        />
        {errors.ilgilenilenPaketler && (
          <span className="text-xs text-red-400">{errors.ilgilenilenPaketler.message}</span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="mesaj">Mesajınız</Label>
        <Textarea id="mesaj" placeholder="Kısaca beklentinizi yazın." {...register("mesaj")} />
        {errors.mesaj && <span className="text-xs text-red-400">{errors.mesaj.message}</span>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="firmaSunumu">Firma Sunumu (PDF, opsiyonel)</Label>
          <Input id="firmaSunumu" name="firmaSunumu" type="file" accept="application/pdf" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="firmaLogosu">Firma Logosu (opsiyonel)</Label>
          <Input id="firmaLogosu" name="firmaLogosu" type="file" accept="image/*" />
        </div>
      </div>

      {status?.message && <div className="text-sm text-red-400">{status.message}</div>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Gönderiliyor..." : "Sponsor Başvurusu Gönder"}
      </Button>
    </form>
  );
}
