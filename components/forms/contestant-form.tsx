"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitContestant } from "@/app/actions/submit";
import type { AppContent } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  adSoyad: z.string().optional(),
  dogumTarihi: z.string().optional(),
  boyCm: z.string().optional(),
  sehir: z.string().optional(),
  telefon: z.string().optional(),
  eposta: z.string().email("Geçerli bir e-posta giriniz.").optional().or(z.literal("")),
  instagramUrl: z.string().url("Geçerli bir Instagram URL giriniz.").optional().or(z.literal("")),
  tiktokUrl: z.string().optional(),
  kendiniTanit: z.string().optional(),
  sartlarOnay: z.boolean().refine(Boolean, "Şartları kabul etmelisiniz."),
});

type FormValues = z.infer<typeof formSchema>;

export function ContestantForm({ content }: { content: AppContent }) {
  const [status, setStatus] = useState<{ ok: boolean; message?: string; reference?: string } | null>(
    null
  );
  const {
    register,
    handleSubmit,
    watch,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sartlarOnay: false,
    },
  });

  const birthDate = watch("dogumTarihi");
  const isUnder18 = useMemo(() => {
    if (!birthDate) return false;
    const date = new Date(birthDate);
    if (Number.isNaN(date.getTime())) return false;
    return new Date().getFullYear() - date.getFullYear() < 18;
  }, [birthDate]);

  const requiredFields = new Set(content.contestant.requiredFields || []);
  const onSubmit = handleSubmit(async (data) => {
    setStatus(null);
    const requiredMap: Record<string, string> = {
      adSoyad: "Ad soyad zorunludur.",
      dogumTarihi: "Doğum tarihi zorunludur.",
      boyCm: "Boy bilgisi zorunludur.",
      sehir: "Şehir zorunludur.",
      telefon: "Telefon zorunludur.",
      eposta: "E-posta zorunludur.",
      instagramUrl: "Instagram linki zorunludur.",
      kendiniTanit: "Kendini tanıt alanı zorunludur.",
    };
    Object.entries(requiredMap).forEach(([field, message]) => {
      if (requiredFields.has(field) && !(data as any)[field]) {
        setError(field as keyof FormValues, { message });
      }
    });
    if (requiredFields.size > 0) {
      const missing = Array.from(requiredFields).some((field) => {
        if (field === "vesikalikFoto" || field === "tamBoyFoto") {
          return false;
        }
        return field in requiredMap && !(data as any)[field];
      });
      if (missing) return;
    }
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        formData.append(key, value ? "onay" : "");
      } else if (value) {
        formData.append(key, value);
      } else {
        formData.append(key, "");
      }
    });

    const fileFields = [
      "vesikalikFoto",
      "tamBoyFoto",
      "ekFotograflar",
      "tanitimVideosu",
      "onayBelgesi",
    ];

    fileFields.forEach((field) => {
      const input = document.querySelector<HTMLInputElement>(`input[name='${field}']`);
      if (!input?.files) return;
      if (field === "ekFotograflar") {
        Array.from(input.files).forEach((file) => formData.append(field, file));
      } else if (input.files[0]) {
        formData.append(field, input.files[0]);
      }
    });

    content.contestant.customFields.forEach((field, index) => {
      const input = document.querySelector<HTMLInputElement>(`input[name='extra_${index}']`);
      if (input?.value) {
        formData.append(`extra_${index}`, input.value);
      }
    });

    const result = await submitContestant(formData);
    setStatus(result);
  });

  if (status?.ok) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-semibold">{content.contestant.successTitle}</h2>
        <p className="mt-3 text-muted">
          Referans numaran: <span className="text-gold font-semibold">{status.reference}</span>
        </p>
        <p className="mt-2 text-sm text-muted">{content.contestant.successSubtitle}</p>
      </div>
    );
  }

  return (
    <form className="grid gap-6" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="adSoyad">
            {content.labels.contestant.adSoyad}
            {requiredFields.has("adSoyad") && " *"}
          </Label>
          <Input id="adSoyad" placeholder={content.placeholders.contestant.adSoyad} {...register("adSoyad")}
          />
          {errors.adSoyad && <span className="text-xs text-red-400">{errors.adSoyad.message}</span>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dogumTarihi">
            {content.labels.contestant.dogumTarihi}
            {requiredFields.has("dogumTarihi") && " *"}
          </Label>
          <Input id="dogumTarihi" type="date" {...register("dogumTarihi")} />
          {errors.dogumTarihi && (
            <span className="text-xs text-red-400">{errors.dogumTarihi.message}</span>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="boyCm">
            {content.labels.contestant.boyCm}
            {requiredFields.has("boyCm") && " *"}
          </Label>
          <Input id="boyCm" placeholder={content.placeholders.contestant.boyCm} {...register("boyCm")} />
          {errors.boyCm && <span className="text-xs text-red-400">{errors.boyCm.message}</span>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sehir">
            {content.labels.contestant.sehir}
            {requiredFields.has("sehir") && " *"}
          </Label>
          <Input id="sehir" placeholder={content.placeholders.contestant.sehir} {...register("sehir")} />
          {errors.sehir && <span className="text-xs text-red-400">{errors.sehir.message}</span>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="telefon">
            {content.labels.contestant.telefon}
            {requiredFields.has("telefon") && " *"}
          </Label>
          <Input id="telefon" placeholder={content.placeholders.contestant.telefon} {...register("telefon")} />
          {errors.telefon && <span className="text-xs text-red-400">{errors.telefon.message}</span>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="eposta">
            {content.labels.contestant.eposta}
            {requiredFields.has("eposta") && " *"}
          </Label>
          <Input id="eposta" type="email" placeholder={content.placeholders.contestant.eposta} {...register("eposta")} />
          {errors.eposta && <span className="text-xs text-red-400">{errors.eposta.message}</span>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="instagramUrl">
            {content.labels.contestant.instagramUrl}
            {requiredFields.has("instagramUrl") && " *"}
          </Label>
          <Input id="instagramUrl" placeholder={content.placeholders.contestant.instagramUrl} {...register("instagramUrl")}
          />
          {errors.instagramUrl && (
            <span className="text-xs text-red-400">{errors.instagramUrl.message}</span>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tiktokUrl">{content.labels.contestant.tiktokUrl}</Label>
          <Input id="tiktokUrl" placeholder={content.placeholders.contestant.tiktokUrl} {...register("tiktokUrl")} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="kendiniTanit">
          {content.labels.contestant.kendiniTanit}
          {requiredFields.has("kendiniTanit") && " *"}
        </Label>
        <Textarea id="kendiniTanit" placeholder={content.placeholders.contestant.kendiniTanit} {...register("kendiniTanit")} />
        {errors.kendiniTanit && (
          <span className="text-xs text-red-400">{errors.kendiniTanit.message}</span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="vesikalikFoto">
            {content.labels.contestant.vesikalikFoto}
            {requiredFields.has("vesikalikFoto") && " *"}
          </Label>
          <Input id="vesikalikFoto" name="vesikalikFoto" type="file" accept="image/*" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tamBoyFoto">
            {content.labels.contestant.tamBoyFoto}
            {requiredFields.has("tamBoyFoto") && " *"}
          </Label>
          <Input id="tamBoyFoto" name="tamBoyFoto" type="file" accept="image/*" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ekFotograflar">{content.labels.contestant.ekFotograflar}</Label>
          <Input id="ekFotograflar" name="ekFotograflar" type="file" accept="image/*" multiple />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tanitimVideosu">{content.labels.contestant.tanitimVideosu}</Label>
          <Input id="tanitimVideosu" name="tanitimVideosu" type="file" accept="video/*" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="onayBelgesi">
            {content.labels.contestant.onayBelgesi} {isUnder18 ? "(zorunlu)" : "(opsiyonel)"}
          </Label>
          <Input id="onayBelgesi" name="onayBelgesi" type="file" accept="application/pdf,image/*" />
          {isUnder18 && (
            <span className="text-xs text-gold">{content.contestant.under18Note}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <Controller
          control={control}
          name="sartlarOnay"
          render={({ field }) => (
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
        <span>{content.contestant.termsCheckboxLabel}</span>
      </div>
      {errors.sartlarOnay && (
        <span className="text-xs text-red-400">{errors.sartlarOnay.message}</span>
      )}

      {content.contestant.customFields.length > 0 && (
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold">Ek Sorular</h3>
          {content.contestant.customFields.map((field, index) => (
            <div key={field.label} className="grid gap-2">
              <Label htmlFor={`extra_${index}`}>
                {field.label} {field.required ? "*" : ""}
              </Label>
              <Input id={`extra_${index}`} name={`extra_${index}`} />
            </div>
          ))}
        </div>
      )}

      {status?.message && <div className="text-sm text-red-400">{status.message}</div>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Gönderiliyor..." : content.contestant.submitLabel}
      </Button>
    </form>
  );
}
