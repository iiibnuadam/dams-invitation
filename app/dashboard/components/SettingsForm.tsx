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

        {isLocked && (
             <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
                <Label htmlFor="password">Unlock Password</Label>
                <div className="relative">
                     <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                     <input
                        id="password"
                        type="text"
                        placeholder="Enter password to unlock..."
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register("password")}
                     />
                </div>
                 <p className="text-[0.8rem] text-muted-foreground">
                    Optional: Set a password to allow guests to unlock the invitation even when locked. Leave empty to keep it strictly locked.
                </p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
