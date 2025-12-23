"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploadInput from "./ImageUploadInput";

export default function HeroForm() {
  const { register } = useFormContext();

  return (
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
        <div className="space-y-2">
          <Label>Quote (Arabic)</Label>
          <Input {...register("hero.quote.arabic")} />
        </div>
        <div className="space-y-2">
          <Label>Quote Translation</Label>
          <Textarea {...register("hero.quote.translation")} rows={3} />
        </div>
      </CardContent>
    </Card>
  );
}
