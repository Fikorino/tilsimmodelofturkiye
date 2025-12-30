"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitSponsor } from "@/app/actions/submit";
import type { AppContent } from "@/lib/content";
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

export function SponsorForm({
  paketler,
  content,
}: {
  paketler: { id: string; name: string }[];
  content: AppContent;
}) {
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
        <h2 className="text-2xl font-semibold">{content.sponsor.successTitle}</h2>
        <p className="mt-3 text-muted">
          Referans numaranız: <span className="text-gold font-semibold">{status.reference}</span>
        </p>
        <p className="mt-2 text-sm text-muted">{content.sponsor.successSubtitle}</p>
      </div>
    );
  }

  return (
    <form className="grid gap-6" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="firmaAdi">{content.labels.sponsor.firmaAdi}</Label>
          <Input id="firmaAdi" placeholder={content.placeholders.sponsor.firmaAdi} {...register("firmaAdi")} />
          {errors.firmaAdi && <span className="text-xs text-red-400">{errors.firmaAdi.message}</span>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="yetkiliAdiSoyadi">{content.labels.sponsor.yetkiliAdiSoyadi}</Label>
          <Input
            id="yetkiliAdiSoyadi"
            placeholder={content.placeholders.sponsor.yetkiliAdiSoyadi}
            {...register("yetkiliAdiSoyadi")}
          />
          {errors.yetkiliAdiSoyadi && (
            <span className="text-xs text-red-400">{errors.yetkiliAdiSoyadi.message}</span>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sektor">{content.labels.sponsor.sektor}</Label>
          <Input id="sektor" placeholder={content.placeholders.sponsor.sektor} {...register("sektor")} />
          {errors.sektor && <span className="text-xs text-red-400">{errors.sektor.message}</span>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="telefon">{content.labels.sponsor.telefon}</Label>
          <Input id="telefon" placeholder={content.placeholders.sponsor.telefon} {...register("telefon")} />
          {errors.telefon && <span className="text-xs text-red-400">{errors.telefon.message}</span>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="eposta">{content.labels.sponsor.eposta}</Label>
          <Input id="eposta" type="email" placeholder={content.placeholders.sponsor.eposta} {...register("eposta")} />
          {errors.eposta && <span className="text-xs text-red-400">{errors.eposta.message}</span>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="butceAraligi">{content.labels.sponsor.butceAraligi}</Label>
          <Input
            id="butceAraligi"
            placeholder={content.placeholders.sponsor.butceAraligi}
            {...register("butceAraligi")}
          />
          {errors.butceAraligi && (
            <span className="text-xs text-red-400">{errors.butceAraligi.message}</span>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <Label>{content.sponsor.packagesHelper}</Label>
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
                <p className="text-sm text-muted">{content.sponsor.packagesEmpty}</p>
              )}
            </div>
          )}
        />
        {errors.ilgilenilenPaketler && (
          <span className="text-xs text-red-400">{errors.ilgilenilenPaketler.message}</span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="mesaj">{content.labels.sponsor.mesaj}</Label>
        <Textarea id="mesaj" placeholder={content.placeholders.sponsor.mesaj} {...register("mesaj")} />
        {errors.mesaj && <span className="text-xs text-red-400">{errors.mesaj.message}</span>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="firmaSunumu">{content.labels.sponsor.firmaSunumu}</Label>
          <Input id="firmaSunumu" name="firmaSunumu" type="file" accept="application/pdf" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="firmaLogosu">{content.labels.sponsor.firmaLogosu}</Label>
          <Input id="firmaLogosu" name="firmaLogosu" type="file" accept="image/*" />
        </div>
      </div>

      {status?.message && <div className="text-sm text-red-400">{status.message}</div>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Gönderiliyor..." : content.sponsor.submitLabel}
      </Button>
    </form>
  );
}
