"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Trash2, Upload, Eye, Copy } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { cn, getFilenameFromUrl } from "@/lib/utils";

// Helper function to find where an image URL is used in the invitation form data
function findImageUsage(url: string, data: any): string[] {
  const usages: string[] = [];
  if (!data) return usages;

  if (data.hero?.image === url) usages.push("Hero Image");
  if (data.overlay?.backgroundImage === url) usages.push("Overlay Background");
  if (data.overlay?.coupleImage === url) usages.push("Overlay Couple");
  if (data.mempelai?.pria?.fotoUrl === url) usages.push("Mempelai Pria Profile");
  if (data.mempelai?.wanita?.fotoUrl === url) usages.push("Mempelai Wanita Profile");
  
  if (Array.isArray(data.gallery)) {
    const isInGallery = data.gallery.some((item: any) => item?.url === url);
    if (isInGallery) usages.push("Gallery Section");
  }
  
  if (Array.isArray(data.paymentMethods)) {
    const isInPayments = data.paymentMethods.some((item: any) => item?.image === url);
    if (isInPayments) usages.push("Gifts (QRIS/Image)");
  }
  
  return usages;
}

export default function MediaManagerForm() {
  const { watch, setValue } = useFormContext();
  const mediaLibrary = watch("mediaLibrary") || [];
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detail Modal State
  const [selectedImage, setSelectedImage] = useState<{ url: string; index: number } | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  const handleOpenDetails = (url: string, index: number) => {
    setSelectedImage({ url, index });
    setImageDimensions(null);
    
    // Dynamically retrieve image dimensions
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
  };

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

  const allValues = watch();
  const usages = selectedImage ? findImageUsage(selectedImage.url, allValues) : [];

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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {mediaLibrary.map((url: string, index: number) => {
                        const { clean } = getFilenameFromUrl(url);
                        return (
                            <div key={index} className="flex flex-col gap-1.5 group">
                                <div 
                                    className="relative aspect-square rounded-md overflow-hidden border bg-background cursor-pointer"
                                    onClick={() => handleOpenDetails(url, index)}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                        src={url} 
                                        alt={clean} 
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenDetails(url, index);
                                            }}
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeImage(index);
                                            }}
                                            title="Delete Image"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <span className="text-[11px] text-muted-foreground truncate px-1 text-center font-medium" title={clean}>
                                    {clean}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

        {/* Details Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto md:overflow-visible flex flex-col md:flex-row gap-6 p-6">
                <DialogTitle className="sr-only">Image Details</DialogTitle>
                {selectedImage && (
                    <>
                        {/* Left Column: Image Preview */}
                        <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg border min-h-[250px] md:min-h-[350px] overflow-hidden p-4 relative group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={selectedImage.url}
                                alt="Preview"
                                className="max-w-full max-h-[350px] md:max-h-[450px] object-contain rounded-md shadow-sm"
                            />
                        </div>
                        
                        {/* Right Column: Info & Actions */}
                        <div className="w-full md:w-80 flex flex-col justify-between space-y-4">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg border-b pb-2">Image Details</h3>
                                </div>
                                
                                <div className="space-y-3.5 text-sm">
                                    <div>
                                        <Label className="text-muted-foreground text-xs font-semibold">File Name</Label>
                                        <div className="flex items-center justify-between gap-2 mt-1">
                                            <div className="font-medium text-foreground truncate max-w-[220px]" title={getFilenameFromUrl(selectedImage.url).clean}>
                                                {getFilenameFromUrl(selectedImage.url).clean}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 shrink-0 hover:bg-muted"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(getFilenameFromUrl(selectedImage.url).clean);
                                                    toast.success("Filename copied");
                                                }}
                                                title="Copy clean filename"
                                            >
                                                <Copy className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-muted-foreground text-xs font-semibold">Raw File Name</Label>
                                        <div className="flex items-center justify-between gap-2 mt-1">
                                            <div className="font-mono text-xs text-muted-foreground truncate max-w-[220px]" title={getFilenameFromUrl(selectedImage.url).raw}>
                                                {getFilenameFromUrl(selectedImage.url).raw}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 shrink-0 hover:bg-muted"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(getFilenameFromUrl(selectedImage.url).raw);
                                                    toast.success("Raw filename copied");
                                                }}
                                                title="Copy raw filename"
                                            >
                                                <Copy className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-muted-foreground text-xs font-semibold">Dimensions</Label>
                                            <div className="font-medium mt-0.5">
                                                {imageDimensions ? `${imageDimensions.width} × ${imageDimensions.height} px` : "Loading..."}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-muted-foreground text-xs font-semibold">Usage in Invitation</Label>
                                        <div className="mt-1.5 flex flex-wrap gap-1">
                                            {usages.length === 0 ? (
                                                <span className="text-xs font-medium text-amber-700 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900">
                                                    Not used
                                                </span>
                                            ) : (
                                                usages.map((use, i) => (
                                                    <span key={i} className="text-xs font-medium text-green-700 bg-green-50 dark:bg-green-950/20 dark:text-green-400 px-2 py-0.5 rounded border border-green-200 dark:border-green-900">
                                                        {use}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-muted-foreground text-xs font-semibold">File URL</Label>
                                        <div className="flex items-center gap-1 mt-1 bg-muted/50 p-1.5 rounded border">
                                            <Input
                                                value={selectedImage.url}
                                                readOnly
                                                className="h-7 text-xs border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-1 select-all font-mono"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 shrink-0 hover:bg-muted"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(selectedImage.url);
                                                    toast.success("Image URL copied");
                                                }}
                                                title="Copy file URL"
                                            >
                                                <Copy className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="w-full gap-2"
                                    onClick={() => {
                                        removeImage(selectedImage.index);
                                        setSelectedImage(null);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" /> Delete permanently
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setSelectedImage(null)}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
