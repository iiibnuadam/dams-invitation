"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import MediaLibraryModal from "./MediaLibraryModal";

export default function GalleryForm() {
  const { watch, setValue } = useFormContext();
  const gallery = watch("gallery") || [];

  const handleAddFromLibrary = (url: string) => {
      // User specifically requested to allow duplicates ("nambahin foto yang sama")
      // So we just add it without checking includes()
      setValue("gallery", [...gallery, url], { shouldDirty: true });
      toast.success("Image added to gallery");
  };

  const removeImage = (indexToRemove: number) => {
    const newGallery = gallery.filter((_: any, index: number) => index !== indexToRemove);
    setValue("gallery", newGallery, { shouldDirty: true });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Website Gallery</CardTitle>
            <CardDescription>Select images to display in the "Our Moment" section.</CardDescription>
        </div>
        <div>
             <MediaLibraryModal onSelect={handleAddFromLibrary} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label>Selected Images ({gallery.length})</Label>
            {gallery.length === 0 ? (
                <div className="text-center py-10 bg-muted/20 rounded-lg text-muted-foreground">
                    No images selected for the website gallery.<br/>
                    Click the button above to add images from the Media Library.
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {gallery.map((url: string, index: number) => (
                        <div key={index} className="group relative aspect-square rounded-md overflow-hidden border bg-background">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={url} 
                                alt={`Gallery ${index}`} 
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => removeImage(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
