"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image as ImageIcon, Check, Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaLibraryModalProps {
  onSelect: (url: string) => void;
}

export default function MediaLibraryModal({ onSelect }: MediaLibraryModalProps) {
  const { watch, setValue } = useFormContext();
  const mediaLibrary = watch("mediaLibrary") || [];
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    setIsUploading(true);
    
    try {
        const { upload } = await import("@vercel/blob/client");
        const newBlob = await upload(file.name, file, {
            access: 'public',
            handleUploadUrl: '/api/upload',
        });

        // Add to mediaLibrary array
        const currentLibrary = watch("mediaLibrary") || [];
        setValue("mediaLibrary", [...currentLibrary, newBlob.url], { shouldDirty: true });
        
        // Auto select the new image
        setSelectedUrl(newBlob.url);
    } catch (error) {
        console.error("Upload failed", error);
    } finally {
         setIsUploading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      setIsOpen(false);
      setSelectedUrl(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button" className="w-full">
            <ImageIcon className="mr-2 h-4 w-4" />
            Select from Gallery
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Media Library (From Gallery)</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden min-h-0 relative bg-muted/20 rounded-md border flex flex-col">
            <div className="p-4 border-b bg-background flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Select an image from your library or upload a new one.</p>
                <div>
                     <input 
                        type="file" 
                        id="modal-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={isUploading}
                      />
                      <Button 
                        size="sm" 
                        variant="secondary"
                        disabled={isUploading}
                        onClick={() => document.getElementById('modal-upload')?.click()}
                      >
                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        Upload New
                      </Button>
                </div>
            </div>

            {mediaLibrary.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground p-8 text-center">
                    <p>No images in Media Library.<br/>Upload one to get started.</p>
                </div>
            ) : (
                <ScrollArea className="flex-1 p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {mediaLibrary.map((url: string, index: number) => (
                            <div 
                                key={index}
                                className={cn(
                                    "relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:opacity-90 group",
                                    selectedUrl === url ? "border-primary ring-2 ring-primary ring-offset-2" : "border-transparent"
                                )}
                                onClick={() => setSelectedUrl(url)}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src={url} 
                                    alt={`Gallery item ${index}`}
                                    className="w-full h-full object-cover"
                                />
                                {selectedUrl === url && (
                                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-sm">
                                        <Check className="h-3 w-3" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!selectedUrl}>
                Select Image
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
