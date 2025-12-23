"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, X } from "lucide-react";
import { upload } from "@vercel/blob/client";
import { toast } from "sonner";
import { useFormContext } from "react-hook-form";

interface ImageUploadInputProps {
  name: string;
  label: string;
}

export default function ImageUploadInput({ name, label }: ImageUploadInputProps) {
  const { watch, setValue } = useFormContext();
  const currentUrl = watch(name);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // ... existing logic ...
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

      setValue(name, newBlob.url, { shouldDirty: true });
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Upload failed. Check console.");
    } finally {
      setIsUploading(false);
      // Reset input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = () => {
    setValue(name, "", { shouldDirty: true });
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {currentUrl ? (
        <>
        <div className="relative w-full h-48 rounded-md overflow-hidden border bg-muted/50 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={currentUrl} 
            alt="Preview" 
            className="w-full h-full object-contain cursor-pointer" 
            onClick={() => setIsPreviewOpen(true)}
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Modal Preview */}
        {isPreviewOpen && (
            <div 
                className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm animate-in fade-in"
                onClick={() => setIsPreviewOpen(false)}
            >
                <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src={currentUrl} 
                        alt="Preview Full" 
                        className="max-w-full max-h-full object-contain"
                    />
                    <button 
                        type="button"
                        className="absolute -top-4 -right-4 md:top-0 md:right-0 text-white hover:text-gray-300 bg-black/20 rounded-full p-2 backdrop-blur-md"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsPreviewOpen(false);
                        }}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>
            </div>
        )}
        </>
      ) : (
        <div className="flex gap-2">
          <Input 
             value={currentUrl || ""} 
             readOnly 
             placeholder="No image selected" 
             className="flex-1 bg-muted"
          />
          <Button 
            type="button" 
            variant="outline"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          </Button>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
        </div>
      )}
    </div>
  );
}
