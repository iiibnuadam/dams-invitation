"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import ImageUploadInput from "./ImageUploadInput";

export default function HeroForm() {
  const { register, watch, setValue } = useFormContext();
  const showArabicQuote = watch("hero.showArabicQuote") !== false;

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Hero Details</CardTitle>
        <CardDescription>Main heading and wedding date.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Heading</Label>
            <Input {...register("hero.heading")} />
          </div>
          <div className="space-y-2">
            <Label>Couple Names (Display)</Label>
            <Input {...register("hero.names")} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Date String</Label>
          <Input {...register("hero.date")} />
        </div>
        <ImageUploadInput name="hero.image" label="Hero Image" />
        
        <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/20">
          <div className="space-y-0.5">
            <Label className="text-xs font-semibold">Tampilkan Tulisan Arab</Label>
            <p className="text-[11px] text-muted-foreground">
              Tampilkan teks ayat Al-Quran/kutipan bahasa Arab di halaman Hero.
            </p>
          </div>
          <Switch
            checked={showArabicQuote}
            onCheckedChange={(checked) => setValue("hero.showArabicQuote", checked, { shouldDirty: true })}
          />
        </div>

        {showArabicQuote && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <Label>Quote (Arabic)</Label>
            <Input {...register("hero.quote.arabic")} />
          </div>
        )}
        <div className="space-y-2">
          <Label>Quote Translation</Label>
          <Textarea {...register("hero.quote.translation")} rows={3} />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Opening Screen (Overlay)</CardTitle>
        <CardDescription>Customize the first screen guests see.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ImageUploadInput name="overlay.backgroundImage" label="Overlay Background" />
        <ImageUploadInput name="overlay.coupleImage" label="Overlay Couple Photo" />
      </CardContent>
    </Card>
    </>
  );
}
