"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function MediaManagerForm() {
  const { watch, setValue } = useFormContext();
  const mediaLibrary = watch("mediaLibrary") || [];
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    setIsUploading(true);

    try {
        const { upload } = await import("@vercel/blob/client");
        const newBlob = await upload(file.name, file, {
            access: 'public',
            handleUploadUrl: '/api/upload',
        });

        const currentLibrary = watch("mediaLibrary") || [];
        setValue("mediaLibrary", [...currentLibrary, newBlob.url], { shouldDirty: true });
        toast.success("Image added to library");
    } catch (error) {
        console.error("Upload failed", error);
        toast.error("Upload failed");
    } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
  };

  const removeImage = (indexToRemove: number) => {
    const currentLibrary = watch("mediaLibrary") || [];
    const newLibrary = currentLibrary.filter((_: any, index: number) => index !== indexToRemove);
    setValue("mediaLibrary", newLibrary, { shouldDirty: true });
    toast.success("Image removed from library");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Manager</CardTitle>
        <CardDescription>Upload and manage all your images here.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 bg-muted/20 hover:bg-muted/40 transition-colors">
            <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleUpload}
                disabled={isUploading}
            />
            <div className="flex flex-col items-center gap-2 text-center">
                <div className="p-4 bg-background rounded-full shadow-sm">
                    {isUploading ? <Loader2 className="h-8 w-8 animate-spin text-primary" /> : <Upload className="h-8 w-8 text-primary" />}
                </div>
                <div className="space-y-1">
                    <h3 className="font-semibold text-lg">Upload Image</h3>
                    <p className="text-sm text-muted-foreground">Click to browse or drag and drop</p>
                </div>
                <Button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="mt-4"
                >
                    {isUploading ? "Uploading..." : "Select File"}
                </Button>
            </div>
        </div>

        {/* Library Grid */}
        <div className="space-y-2">
            <Label>Library Content ({mediaLibrary.length})</Label>
            {mediaLibrary.length === 0 ? (
                <div className="text-center py-10 bg-muted/20 rounded-lg text-muted-foreground">
                    No images in library.
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {mediaLibrary.map((url: string, index: number) => (
                        <div key={index} className="group relative aspect-square rounded-md overflow-hidden border bg-background">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={url} 
                                alt={`Library ${index}`} 
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
