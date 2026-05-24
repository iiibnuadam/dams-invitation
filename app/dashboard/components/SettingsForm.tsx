import { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, User, Loader2, Music, Play, Pause, Link, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { upload } from "@vercel/blob/client";

const MUSIC_PRESETS = [
  { name: "Can't Help Falling in Love", url: "/assets/musics/cant-help-falling-in-love.mp3" },
  { name: "1000x", url: "/assets/musics/1000x.mp3" },
];

export default function SettingsForm() {
  const { register, watch, setValue } = useFormContext();
  const isLocked = watch("isLocked");
  const musicUrl = watch("musicUrl") || "";
  const musicTracks = watch("musicTracks") || [];

  // Custom Tracks State
  const [newTrack, setNewTrack] = useState({ name: "", url: "" });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    setIsUploading(true);

    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      // Clean file extension for name suggestion
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      
      setNewTrack({
        name: cleanName,
        url: newBlob.url
      });
      
      toast.success("Lagu berhasil diunggah ke storage!");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Gagal mengunggah file. Silakan cek konsol.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const addCustomTrack = () => {
    if (!newTrack.name.trim() || !newTrack.url.trim()) {
      toast.error("Nama lagu dan URL lagu tidak boleh kosong.");
      return;
    }
    if (!newTrack.url.startsWith("http://") && !newTrack.url.startsWith("https://")) {
      toast.error("URL lagu harus dimulai dengan http:// atau https://");
      return;
    }
    
    const updatedTracks = [...musicTracks, { name: newTrack.name.trim(), url: newTrack.url.trim() }];
    setValue("musicTracks", updatedTracks, { shouldDirty: true });
    setNewTrack({ name: "", url: "" });
    toast.success("Lagu berhasil ditambahkan ke daftar!");
  };

  const removeCustomTrack = (indexToRemove: number) => {
    const updatedTracks = musicTracks.filter((_: any, index: number) => index !== indexToRemove);
    setValue("musicTracks", updatedTracks, { shouldDirty: true });
    toast.success("Lagu dihapus dari daftar.");
  };

  // Admin Update State
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminForm, setAdminForm] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
  });

  // Preview Player State
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const togglePreview = () => {
    if (!previewAudioRef.current) {
      previewAudioRef.current = new Audio();
      previewAudioRef.current.loop = true;
      previewAudioRef.current.addEventListener("ended", () => setIsPreviewPlaying(false));
      previewAudioRef.current.addEventListener("pause", () => setIsPreviewPlaying(false));
      previewAudioRef.current.addEventListener("play", () => setIsPreviewPlaying(true));
    }

    const targetSrc = musicUrl;

    if (isPreviewPlaying) {
      previewAudioRef.current.pause();
    } else {
      if (previewAudioRef.current.src !== targetSrc) {
        previewAudioRef.current.src = targetSrc;
        previewAudioRef.current.load();
      }
      previewAudioRef.current.play()
        .then(() => setIsPreviewPlaying(true))
        .catch(err => {
          console.error("Preview play failed:", err);
          toast.error("Failed to play preview. Please check the URL.");
          setIsPreviewPlaying(false);
        });
    }
  };

  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (previewAudioRef.current && isPreviewPlaying) {
      previewAudioRef.current.pause();
      setIsPreviewPlaying(false);
    }
  }, [musicUrl]);

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
                <div className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-primary" />
                    <CardTitle>Background Music</CardTitle>
                </div>
                <CardDescription>
                    Configure the background music for the invitation. You can choose from presets or use direct links from the internet.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="musicUrl">Music URL (.mp3)</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                            <Link className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="musicUrl"
                                type="text"
                                placeholder="Enter direct MP3 link (e.g. https://example.com/audio.mp3)"
                                className="pl-9"
                                {...register("musicUrl")}
                            />
                        </div>
                        <Button
                            type="button"
                            variant={isPreviewPlaying ? "destructive" : "secondary"}
                            className="sm:w-28 flex items-center justify-center gap-2"
                            onClick={togglePreview}
                        >
                            {isPreviewPlaying ? (
                                <>
                                    <Pause className="w-4 h-4 animate-pulse" />
                                    Pause
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4" />
                                    Preview
                                </>
                            )}
                        </Button>
                    </div>
                    <p className="text-[0.8rem] text-muted-foreground">
                        Leave blank to use the default local track (<code>{musicUrl}</code>).
                    </p>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm">Quick Presets</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {MUSIC_PRESETS.map((preset) => {
                            const isActive = musicUrl === preset.url;
                            return (
                                <Button
                                    key={preset.name}
                                    type="button"
                                    variant="outline"
                                    className={`justify-start text-left h-auto py-2 px-3 block truncate transition-all duration-200 ${
                                        isActive ? "border-primary bg-primary/5 text-primary font-medium shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                                    }`}
                                    onClick={() => setValue("musicUrl", preset.url, { shouldDirty: true })}
                                >
                                    <div className="font-semibold text-xs truncate">{preset.name}</div>
                                    <div className="text-[10px] text-muted-foreground truncate">{preset.url || "Default local file"}</div>
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {/* Custom Tracks Section */}
                <div className="space-y-3 pt-4 border-t">
                    <Label className="text-sm flex items-center gap-1.5 font-medium text-foreground">
                        <Music className="w-4 h-4 text-primary" />
                        Daftar Lagu Kustom Anda ({musicTracks.length})
                    </Label>
                    
                    {musicTracks.length === 0 ? (
                        <p className="text-xs text-muted-foreground bg-muted/20 rounded-md p-3 text-center border border-dashed">
                            Belum ada lagu kustom yang disimpan. Tambahkan di bawah ini agar bisa dipilih kembali kapan saja.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 animate-in fade-in-50">
                            {musicTracks.map((track: any, index: number) => {
                                const isActive = musicUrl === track.url;
                                return (
                                    <div 
                                        key={index} 
                                        className={`group relative flex items-center justify-between rounded-md border p-1 transition-all duration-200 ${
                                            isActive ? "border-primary bg-primary/5 text-primary" : "hover:bg-muted/40"
                                        }`}
                                    >
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="flex-1 justify-start text-left h-auto py-1.5 px-2 truncate block hover:bg-transparent"
                                            onClick={() => setValue("musicUrl", track.url, { shouldDirty: true })}
                                        >
                                            <div className="font-semibold text-xs truncate">{track.name}</div>
                                            <div className="text-[10px] text-muted-foreground truncate">{track.url}</div>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all mr-1 flex-shrink-0"
                                            onClick={() => removeCustomTrack(index)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Add Custom Track Form */}
                    <div className="bg-muted/30 rounded-lg p-4 border space-y-3">
                        <p className="text-xs font-semibold text-foreground">Tambah Lagu Baru ke Daftar:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="newTrackName" className="text-[10px] text-muted-foreground">Nama Lagu</Label>
                                <Input
                                    id="newTrackName"
                                    type="text"
                                    placeholder="Contoh: Instrumen Akad Biola"
                                    value={newTrack.name}
                                    onChange={(e) => setNewTrack({ ...newTrack, name: e.target.value })}
                                    className="h-8 text-xs bg-background"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="newTrackUrl" className="text-[10px] text-muted-foreground flex justify-between items-center">
                                    <span>URL Lagu (.mp3)</span>
                                    <span className="text-[9px] text-[#C5A059] cursor-pointer hover:underline font-medium" onClick={() => fileInputRef.current?.click()}>
                                        Atau Upload File
                                    </span>
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="newTrackUrl"
                                        type="text"
                                        placeholder="https://domain.com/lagu-anda.mp3"
                                        value={newTrack.url}
                                        onChange={(e) => setNewTrack({ ...newTrack, url: e.target.value })}
                                        className="h-8 text-xs bg-background flex-1"
                                    />
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        accept="audio/*"
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="h-8 text-xs flex items-center gap-1.5 px-3 flex-shrink-0"
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <Upload className="w-3.5 h-3.5" />
                                        )}
                                        Upload
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-1">
                            <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={addCustomTrack}
                                className="h-8 text-xs hover:bg-muted"
                            >
                                Tambahkan ke Daftar
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-xs text-muted-foreground space-y-3">
                    <div>
                        <p className="font-semibold text-foreground flex items-center gap-1.5 mb-1 text-amber-600 dark:text-amber-400">
                            ⚠️ Mengapa Spotify & SoundCloud tidak didukung langsung?
                        </p>
                        <p className="text-muted-foreground/90 pl-5">
                            Spotify dan SoundCloud merupakan platform tertutup yang <strong>tidak menyediakan link file MP3 langsung</strong>. Widget embed mereka juga membatasi pemutaran (hanya 30 detik untuk non-premium) serta tidak memperbolehkan autoplay otomatis saat undangan dibuka, sehingga merusak transisi estetis premium.
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="font-medium text-foreground">💡 Solusi Alternatif & 100% Gratis:</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground/80 pl-2">
                            <li>
                                <strong>Cari & Unduh Gratis:</strong> Cari lagu/instrumen yang Anda sukai di YouTube (misalnya "wedding piano instrumental") atau download gratis di <a href="https://pixabay.com/music/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Pixabay Music</a> atau <a href="https://www.bensound.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Bensound</a>.
                            </li>
                            <li>
                                <strong>Convert ke MP3:</strong> Gunakan situs converter gratis di internet (seperti <em>y2mate</em>, <em>ytmp3</em>, atau <em>freemp3cloud</em>) untuk mengonversi link YouTube tersebut menjadi file <code>.mp3</code>.
                            </li>
                            <li>
                                <strong>Hosting File Mudah:</strong> Upload file MP3 tersebut ke <a href="https://catbox.moe" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Catbox.moe</a> (layanan hosting file gratis instan) untuk mendapatkan link langsung berakhiran <code>.mp3</code>, atau gunakan Dropbox (ubah ujung link dari <code>?dl=0</code> ke <code>?raw=1</code>).
                            </li>
                        </ul>
                    </div>
                </div>
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
