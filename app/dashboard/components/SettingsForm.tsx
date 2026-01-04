import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsForm() {
  const { register, watch, setValue } = useFormContext();
  const isLocked = watch("isLocked");

  // Admin Update State
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminForm, setAdminForm] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
  });

  useEffect(() => {
      const fetchAdminData = async () => {
          try {
              const res = await fetch("/api/auth/me");
              const data = await res.json();
              if (data.user) {
                  setAdminForm(prev => ({
                      ...prev,
                      name: data.user.name || "",
                      email: data.user.email || ""
                  }));
              }
          } catch (error) {
              console.error("Failed to fetch admin data");
          }
      };
      fetchAdminData();
  }, []);

  const handleAdminUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (adminForm.password && adminForm.password !== adminForm.confirmPassword) {
          toast.error("Passwords do not match");
          return;
      }

      setAdminLoading(true);
      try {
          const res = await fetch("/api/auth/update", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  name: adminForm.name || undefined,
                  email: adminForm.email || undefined,
                  password: adminForm.password || undefined
              })
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to update");

          toast.success("Admin credentials updated");
          setAdminForm(prev => ({ 
              ...prev, 
              password: "", 
              confirmPassword: "" 
          }));
      } catch (error: any) {
          toast.error(error.message);
      } finally {
          setAdminLoading(false);
      }
  };

  return (
    <div className="space-y-6">
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
                        <Input
                            id="password"
                            type="text"
                            placeholder="Enter password to unlock..."
                            className="pl-9"
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

        <Card>
            <CardHeader>
                <CardTitle>Admin Account</CardTitle>
                <CardDescription>Update your admin login credentials.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Display Name</Label>
                        <Input 
                            value={adminForm.name} 
                            onChange={(e) => setAdminForm({...adminForm, name: e.target.value})} 
                            placeholder="Update admin name..."
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Email Address</Label>
                        <Input 
                            type="email"
                            value={adminForm.email} 
                            onChange={(e) => setAdminForm({...adminForm, email: e.target.value})} 
                            placeholder="Update email..."
                        />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label>New Password</Label>
                            <Input 
                                type="password"
                                value={adminForm.password} 
                                onChange={(e) => setAdminForm({...adminForm, password: e.target.value})} 
                                placeholder="New password..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Confirm Password</Label>
                            <Input 
                                type="password"
                                value={adminForm.confirmPassword} 
                                onChange={(e) => setAdminForm({...adminForm, confirmPassword: e.target.value})} 
                                placeholder="Confirm password..."
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="button" onClick={handleAdminUpdate} disabled={adminLoading}>
                            {adminLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Credentials
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
