"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { Loader2, LayoutDashboard, Heart, Calendar, Gift, BookOpen, MessageSquare, Code, Save, LogOut, Menu, X, Image as ImageIcon } from "lucide-react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import HeroForm from "./components/HeroForm";
import CoupleForm from "./components/CoupleForm";
import EventsForm from "./components/EventsForm";
import StoryForm from "./components/StoryForm";
import GiftForm from "./components/GiftForm";
import CommentsForm from "./components/CommentsForm";
import GalleryForm from "./components/GalleryForm";
import MediaManagerForm from "./components/MediaManagerForm";

// Schema (Kept same as before)
const invitationSchema = z.object({
  hero: z.object({
    heading: z.string(),
    names: z.string(),
    date: z.string(),
    image: z.string().optional(),
    quote: z.object({
        arabic: z.string(),
        translation: z.string(),
        source: z.string()
    })
  }),
  overlay: z.object({
    backgroundImage: z.string().optional(),
    coupleImage: z.string().optional()
  }).optional(),
  mempelai: z.object({
      pria: z.object({
          namaLengkap: z.string(),
          putraDari: z.string(),
          fotoUrl: z.string(),
      }),
       wanita: z.object({
          namaLengkap: z.string(),
          putriDari: z.string(),
          fotoUrl: z.string(),
      })
  }),
  acara: z.array(z.object({
      title: z.string(),
      tanggal: z.string(),
      jam: z.string(),
      tempat: z.string(),
      maps: z.string(),
      enabled: z.boolean().default(true)
  })),
  weddingStory: z.array(z.object({
      year: z.string(),
      title: z.string(),
      content: z.string(),
      enabled: z.boolean().default(true)
  })).optional(),
  paymentMethods: z.array(z.object({
      bank: z.string().optional(),
      number: z.string().optional(),
      holder: z.string().optional(),
      name: z.string().optional(),
      address: z.string().optional(),
      image: z.string().optional(),
      type: z.enum(["bank", "address", "qris"]),
      enabled: z.boolean().default(true)
  })).optional(),
  comments: z.array(z.object({
      name: z.string(),
      message: z.string(),
      timestamp: z.string().or(z.date()),
      isVisible: z.boolean().default(true),
      isFavorite: z.boolean().default(false)
  })).optional(),
  gallery: z.array(z.string()).optional(),
  mediaLibrary: z.array(z.string()).optional()
});

type InvitationFormValues = z.infer<typeof invitationSchema>;

const MENU_ITEMS = [
  { id: "hero", label: "Hero & Intro", icon: LayoutDashboard },
  { id: "couple", label: "Bride & Groom", icon: Heart },
  { id: "events", label: "Wedding Events", icon: Calendar },
  { id: "story", label: "Love Story", icon: BookOpen },
  { id: "gift", label: "Gifts & Bank", icon: Gift },
  { id: "gallery", label: "Gallery Section", icon: ImageIcon },
  { id: "media", label: "Media Manager", icon: ImageIcon },
  { id: "comments", label: "Comments", icon: MessageSquare },
  { id: "json", label: "Raw JSON", icon: Code },
];


export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [jsonError, setJsonError] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const methods = useForm<InvitationFormValues>();
  const { handleSubmit, reset, watch } = methods;

  // Watch for JSON view
  const formData = watch();

  // Fetch initial data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/invitation"); 
      const data = await res.json();
      if (data && !data.error) {
           // Migration: If mediaLibrary is empty but gallery has items, copy them
           if ((!data.mediaLibrary || data.mediaLibrary.length === 0) && data.gallery && data.gallery.length > 0) {
              data.mediaLibrary = [...data.gallery];
           }
           reset(data);
           toast.success("Data refreshed");
      }
    } catch (error) {
      console.error("Failed to fetch invitation", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch without toast
    async function loadInitial() {
        try {
            const res = await fetch("/api/invitation"); 
            const data = await res.json();
            if (data && !data.error) {
                 // Migration: If mediaLibrary is empty but gallery has items, copy them
                 if ((!data.mediaLibrary || data.mediaLibrary.length === 0) && data.gallery && data.gallery.length > 0) {
                    data.mediaLibrary = [...data.gallery];
                 }
                 reset(data);
            }
        } catch (error) {
            console.error("Failed to fetch invitation", error);
        } finally {
            setIsLoading(false);
        }
    }
    loadInitial();
  }, [reset]);

  const onSubmit = async (data: InvitationFormValues) => {
    setIsSaving(true);
    try {
        const res = await fetch("/api/invitation", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error("Failed to update");
        
        toast.success("Changes saved successfully");
    } catch (error) {
        toast.error("Failed to save changes");
    } finally {
        setIsSaving(false);
    }
  };
// ...
  const SidebarContent = () => (
    <>
        <div className="p-6 border-b flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
                <Icon icon="ph:diamonds-four" className="h-5 w-5" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">CMS</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
            {MENU_ITEMS.map((item) => {
                const LucideIcon = item.icon;
                return (
                    <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md w-full transition-colors",
                            activeSection === item.id 
                                ? "bg-primary text-primary-foreground" 
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <LucideIcon className="h-4 w-4" />
                        {item.label}
                    </button>
                )
            })}
        </nav>

        <div className="p-4 border-t">
            <Button variant="outline" className="w-full justify-start text-muted-foreground" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        </div>
    </>
  );

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row relative">
      {/* Scroll to top anchor */}
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-background border-r flex-shrink-0 flex-col h-screen sticky top-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <aside className="relative w-64 bg-background h-full shadow-xl flex flex-col animate-in slide-in-from-left duration-200">
                <div className="absolute top-2 right-2">
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <SidebarContent />
            </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-hidden bg-muted/20 flex flex-col relative w-full">
        {/* Mobile Header Toggle */}
        <div className="md:hidden flex items-center p-4 bg-background border-b flex-shrink-0">
             <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="h-6 w-6" />
             </Button>
             <div className="ml-2 flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
                    <Icon icon="ph:diamonds-four" className="h-3 w-3" />
                </div>
                <h1 className="font-bold text-lg tracking-tight">CMS</h1>
             </div>
        </div>

        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full overflow-hidden">
                {/* Header - Full Width */}
                <div className="hidden md:flex items-center justify-between flex-shrink-0 bg-background/95 backdrop-blur border-b px-8 py-4 shadow-sm z-10">
                     <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
                            {MENU_ITEMS.find(i => i.id === activeSection)?.label}
                        </h2>
                        <p className="text-sm text-muted-foreground">Make changes to your invitation content.</p>
                     </div>
                     <div className="flex items-center gap-2">
                        <Button type="submit" disabled={isSaving} className="shadow-sm hover:shadow-md transition-all">
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Changes
                        </Button>
                     </div>
                </div>

                {/* Mobile Header Actions (Save Button) */}
                 <div className="md:hidden flex items-center justify-between p-4 bg-background/50 backdrop-blur border-b z-10 flex-shrink-0">
                     <span className="font-semibold text-sm truncate max-w-[150px]">
                         {MENU_ITEMS.find(i => i.id === activeSection)?.label}
                     </span>
                     <Button type="submit" size="sm" disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save
                    </Button>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full">
                    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                        {activeSection === "hero" && <HeroForm />}
                        {activeSection === "couple" && <CoupleForm />}
                        {activeSection === "events" && <EventsForm />}
                        {activeSection === "story" && <StoryForm />}
                        {activeSection === "gift" && <GiftForm />}
                        {activeSection === "gallery" && <GalleryForm />}
                        {activeSection === "media" && <MediaManagerForm />}
                        {activeSection === "comments" && <CommentsForm onRefresh={fetchData} />}
                        
                        {activeSection === "json" && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Raw JSON Viewer</CardTitle>
                                    <CardDescription>
                                        Read-only view of the current data structure.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Textarea 
                                        className="font-mono text-xs min-h-[500px]"
                                        value={JSON.stringify(formData, null, 2)}
                                        readOnly
                                    />
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </form>
        </FormProvider>
      </main>
    </div>
  );
}
