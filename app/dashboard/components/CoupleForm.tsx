"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploadInput from "./ImageUploadInput";

export default function CoupleForm() {
  const { register } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Groom (Pria)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input {...register("mempelai.pria.namaLengkap")} />
          </div>
          <div className="space-y-2">
            <Label>Son of (Parents)</Label>
            <Input {...register("mempelai.pria.putraDari")} />
          </div>
          <ImageUploadInput name="mempelai.pria.fotoUrl" label="Groom Photo" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bride (Wanita)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input {...register("mempelai.wanita.namaLengkap")} />
          </div>
          <div className="space-y-2">
            <Label>Daughter of (Parents)</Label>
            <Input {...register("mempelai.wanita.putriDari")} />
          </div>
          <ImageUploadInput name="mempelai.wanita.fotoUrl" label="Bride Photo" />
        </CardContent>
      </Card>
    </div>
  );
}
