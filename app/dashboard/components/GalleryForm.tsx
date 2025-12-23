"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, Loader2, Plus } from "lucide-react";
import { useState, useRef } from "react";
import { upload } from "@vercel/blob/client";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

export default function GalleryForm() {
  const { control, watch, setValue } = useFormContext();
  // We can manage the array directly via watch/setValue for simple string arrays, 
  // or use useFieldArray if we mapped it to objects. 
  // The schema defines gallery as string[]. 
  // useFieldArray works best with object arrays { id, url }. 
  // For simple string arrays, it's sometimes tricky. 
  // Let's coerce it to a simple list management for now or change schema to objects if needed.
  // Given current schema is string[], let's stick to manual management or use useFieldArray with a transform.
  
  // Actually, useFieldArray requires objects with 'id'.
  // Let's use a local managed approach sync'd with setValue/watch for simplicity with simple string array
  
  const gallery = watch("gallery") || [];
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

      // Add to gallery
      const currentGallery = gallery || [];
      setValue("gallery", [...currentGallery, newBlob.url], { shouldDirty: true });
      toast.success("Image uploaded successfully");
      
      // Reset input
      if (fileInputRef.current) {
          fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Upload failed. Check console and make sure BLOB_READ_WRITE_TOKEN is set.");
    } finally {
      setIsUploading(false);
      // Reset input to allow selecting the same file again
      if (fileInputRef.current) {
          fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    const currentGallery = gallery || [];
    const newGallery = currentGallery.filter((_: string, index: number) => index !== indexToRemove);
    setValue("gallery", newGallery, { shouldDirty: true });
  };

  const addImageUrl = () => {
    // Propose an input for manual URL adding?
    // For now simple upload is the priority.
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photo Gallery</CardTitle>
        <CardDescription>
          Upload photos to display in the gallery section.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Upload Area */}
        <div className="flex flex-col gap-4">
            <Label>Upload New Photo</Label>
            <div className="flex items-center gap-4">
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full h-32 border-dashed border-2 flex flex-col gap-2 hover:bg-muted/50"
                >
                    {isUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    ) : (
                        <Upload className="h-8 w-8 text-muted-foreground" />
                    )}
                    <span className="text-muted-foreground">
                        {isUploading ? "Uploading..." : "Click to select image"}
                    </span>
                </Button>
                <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                />
            </div>
        </div>

        {/* Gallery Grid */}
        <div>
            <Label className="mb-4 block">Current Photos ({gallery.length})</Label>
            {gallery.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border-dashed border">
                    No photos uploaded yet.
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {gallery.map((url: string, index: number) => (
                        <div key={index} className="relative group aspect-square rounded-md overflow-hidden border bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={url} 
                                alt={`Gallery ${index + 1}`} 
                                className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => removeImage(index)}
                                    className="h-8 w-8"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => window.open(url, '_blank')}
                                >
                                    <Icon icon="ph:eye" className="h-4 w-4" />
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
