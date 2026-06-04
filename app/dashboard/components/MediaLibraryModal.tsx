"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image as ImageIcon, Check, Upload, Loader2, Copy } from "lucide-react";
import { cn, getFilenameFromUrl } from "@/lib/utils";
import { toast } from "sonner";

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
        toast.success("Image uploaded and selected");
    } catch (error) {
        console.error("Upload failed", error);
        toast.error("Upload failed");
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
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Media Library (From Gallery)</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden min-h-0 relative bg-muted/20 rounded-md border flex flex-col md:flex-row">
            {/* Left side: Grid of images */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <div className="p-4 border-b bg-background flex justify-between items-center flex-shrink-0">
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {mediaLibrary.map((url: string, index: number) => {
                                const { clean } = getFilenameFromUrl(url);
                                return (
                                    <div key={index} className="flex flex-col gap-1">
                                        <div 
                                            className={cn(
                                                "relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:opacity-90 group",
                                                selectedUrl === url ? "border-primary ring-2 ring-primary ring-offset-2" : "border-muted-foreground/20 hover:border-muted-foreground/45"
                                            )}
                                            onClick={() => setSelectedUrl(url)}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img 
                                                src={url} 
                                                alt={clean}
                                                className="w-full h-full object-cover"
                                            />
                                            {selectedUrl === url && (
                                                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-sm">
                                                    <Check className="h-3 w-3" />
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground truncate px-1 text-center font-medium mt-0.5" title={clean}>
                                            {clean}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                )}
            </div>

            {/* Right side: Detail Panel */}
            {selectedUrl && (
                <div className="w-full md:w-72 border-t md:border-t-0 md:border-l bg-background flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
                    <div className="p-3 border-b flex items-center justify-between bg-muted/20 flex-shrink-0">
                        <span className="font-semibold text-sm">Selection Details</span>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            <div className="aspect-video w-full rounded border bg-muted/40 overflow-hidden flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={selectedUrl}
                                    alt="Selection Preview"
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                            
                            <div className="space-y-3.5 text-xs">
                                <div>
                                    <span className="text-muted-foreground font-semibold block">File Name</span>
                                    <span className="font-medium text-foreground break-all mt-0.5 block" title={getFilenameFromUrl(selectedUrl).clean}>
                                        {getFilenameFromUrl(selectedUrl).clean}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-muted-foreground font-semibold block">Raw File Name</span>
                                    <span className="font-mono text-[10px] text-muted-foreground break-all mt-0.5 block" title={getFilenameFromUrl(selectedUrl).raw}>
                                        {getFilenameFromUrl(selectedUrl).raw}
                                    </span>
                                </div>
                                
                                <div>
                                    <span className="text-muted-foreground font-semibold block">URL</span>
                                    <div className="flex items-center gap-1 mt-1 bg-muted/50 p-1.5 rounded border">
                                        <span className="truncate font-mono text-[10px] flex-1 px-1 text-muted-foreground select-all">
                                            {selectedUrl}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 shrink-0 hover:bg-muted"
                                            onClick={() => {
                                                navigator.clipboard.writeText(selectedUrl);
                                                toast.success("Image URL copied");
                                            }}
                                        >
                                            <Copy className="h-3 w-3 text-muted-foreground" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
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
