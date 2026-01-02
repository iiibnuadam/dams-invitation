"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Lock, Unlock } from "lucide-react";

export default function SettingsForm() {
  const { register, watch, setValue } = useFormContext();
  const isLocked = watch("isLocked");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Settings</CardTitle>
        <CardDescription>
          Manage general settings for your invitation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-4 shadow-sm gap-4">
            <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                    {isLocked ? <Lock className="w-4 h-4 text-primary" /> : <Unlock className="w-4 h-4 text-muted-foreground" />}
                    <Label className="text-base">Lock Invitation</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                    When locked, guests cannot open the invitation. A "Coming Soon" message will be shown with the date blurred.
                </p>
            </div>
            <Switch
                checked={isLocked}
                onCheckedChange={(checked) => setValue("isLocked", checked, { shouldDirty: true })}
            />
        </div>
      </CardContent>
    </Card>
  );
}
