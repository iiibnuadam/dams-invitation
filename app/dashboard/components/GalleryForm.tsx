"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import MediaLibraryModal from "./MediaLibraryModal";
import { cn } from "@/lib/utils";

// DnD Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface GalleryItemType {
  url: string;
  focusY: number;
  cols: number;
  rows: number;
}

function SortableGalleryItem({
  id,
  item,
  index,
  removeImage,
  handleUpdateFocusY,
  handleUpdateSize,
}: {
  id: string;
  item: GalleryItemType;
  index: number;
  removeImage: (idx: number) => void;
  handleUpdateFocusY: (idx: number, focusY: number) => void;
  handleUpdateSize: (idx: number, cols: number, rows: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.6 : 1,
  };

  const currentFocusY = typeof item.focusY === "number" ? item.focusY : 50;
  const c = item.cols || 1;
  const r = item.rows || 1;
  
  // Responsive bento grid span matching the client page exactly
  const colClass = c === 2 ? "col-span-2" : c === 3 ? "col-span-2 md:col-span-3" : "col-span-1";
  const rowClass = r === 2 ? "row-span-2" : "row-span-1";
  const spanClass = `${colClass} ${rowClass}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group overflow-hidden rounded-xl border border-border/40 bg-muted select-none min-h-[120px] md:min-h-[180px] transition-all",
        isDragging && "ring-2 ring-primary/60 shadow-lg",
        spanClass
      )}
    >
      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
          src={item.url} 
          alt={`Gallery ${index}`} 
          className="w-full h-full object-cover transition-all"
          style={{ objectPosition: `center ${currentFocusY}%` }}
      />
      
      {/* Controls Overlay */}
      
      {/* Top Left: Drag Handle */}
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute top-2 left-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white p-2 rounded cursor-grab active:cursor-grabbing transition-colors z-20 shadow-md"
        title="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Top Right: Delete Button */}
      <div className="absolute top-2 right-2 z-20">
          <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-8 w-8 rounded bg-red-600/80 hover:bg-red-600 backdrop-blur-sm shadow-md"
              onClick={() => removeImage(index)}
          >
              <Trash2 className="h-4 w-4" />
          </Button>
      </div>

      {/* Bottom Left: Focus Crop Slider */}
      <div className="absolute bottom-2 left-2 bg-black/60 hover:bg-black/85 backdrop-blur-sm px-2.5 py-1.5 rounded flex items-center gap-2 z-20 w-[110px] hover:w-[150px] transition-all group/slider shadow-md">
          <input 
              type="range" 
              min="0" 
              max="100" 
              value={currentFocusY} 
              onChange={(e) => handleUpdateFocusY(index, parseInt(e.target.value))}
              className="w-full h-1 bg-white/20 rounded appearance-none cursor-pointer accent-white"
          />
          <span className="text-[9px] text-white font-bold tracking-wider">{currentFocusY}%</span>
      </div>

      {/* Bottom Right: Layout Grid Selector */}
      <div className="absolute bottom-2 right-2 flex gap-1 z-20 bg-black/50 backdrop-blur-sm p-1 rounded shadow-md">
          {(["1x1", "2x1", "1x2", "2x2"] as const).map((s) => {
              const targetCols = s === "2x1" || s === "2x2" ? 2 : 1;
              const targetRows = s === "1x2" || s === "2x2" ? 2 : 1;
              const isSelected = c === targetCols && r === targetRows;
              
              return (
                  <button
                      key={s}
                      type="button"
                      onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateSize(index, targetCols, targetRows);
                      }}
                      className={cn(
                          "w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold border transition-all",
                          isSelected
                              ? "bg-white text-black border-white"
                              : "bg-black/40 text-white/80 border-transparent hover:bg-black/60 hover:text-white"
                      )}
                  >
                      {s}
                  </button>
              );
          })}
      </div>
    </div>
  );
}

export default function GalleryForm() {
  const { watch, setValue, control } = useFormContext();
  const gallery = watch("gallery") || [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddFromLibrary = (url: string) => {
      setValue("gallery", [...gallery, { url, focusY: 50, cols: 1, rows: 1 }], { shouldDirty: true });
      toast.success("Image added to gallery");
  };

  const removeImage = (indexToRemove: number) => {
    const newGallery = gallery.filter((_: any, index: number) => index !== indexToRemove);
    setValue("gallery", newGallery, { shouldDirty: true });
  };

  const handleUpdateFocusY = (indexToUpdate: number, newFocusY: number) => {
    const updatedGallery = gallery.map((item: any, index: number) => {
      if (index === indexToUpdate) {
        return { ...item, focusY: newFocusY };
      }
      return item;
    });
    setValue("gallery", updatedGallery, { shouldDirty: true });
  };

  const handleUpdateSize = (indexToUpdate: number, cols: number, rows: number) => {
    const updatedGallery = gallery.map((item: any, index: number) => {
      if (index === indexToUpdate) {
        return { ...item, cols, rows };
      }
      return item;
    });
    setValue("gallery", updatedGallery, { shouldDirty: true });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = gallery.findIndex((item: any) => item.url === active.id);
      const newIndex = gallery.findIndex((item: any) => item.url === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(gallery, oldIndex, newIndex);
        setValue("gallery", reordered, { shouldDirty: true });
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Website Gallery</CardTitle>
            <CardDescription>Drag the handle to reorder, slide focal point, and choose grid sizes (1x1, 2x1, 1x2, 2x2) with live bento preview.</CardDescription>
        </div>
        <div>
             <MediaLibraryModal onSelect={handleAddFromLibrary} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border">
          <div className="space-y-0.5">
            <Label htmlFor="gallery-popup-toggle" className="text-sm font-medium">Enable Lightbox Popup</Label>
            <p className="text-xs text-muted-foreground">Allow guests to click on gallery images to view them in full screen.</p>
          </div>
          <Controller
            control={control}
            name="showGalleryPopup"
            render={({ field }) => (
              <Switch
                checked={field.value !== false}
                onCheckedChange={field.onChange}
                id="gallery-popup-toggle"
              />
            )}
          />
        </div>

        <div className="space-y-2">
            <Label>Selected Images ({gallery.length})</Label>
            {gallery.length === 0 ? (
                <div className="text-center py-10 bg-muted/20 rounded-lg text-muted-foreground">
                    No images selected for the website gallery.<br/>
                    Click the button above to add images from the Media Library.
                </div>
            ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={gallery.map((item: any) => item.url)}
                    strategy={rectSortingStrategy}
                  >
                    <div className="grid gap-4 auto-rows-[120px] md:auto-rows-[180px] grid-cols-2 md:grid-cols-3 grid-flow-dense">
                        {gallery.map((item: GalleryItemType, index: number) => (
                            <SortableGalleryItem
                              key={item.url}
                              id={item.url}
                              item={item}
                              index={index}
                              removeImage={removeImage}
                              handleUpdateFocusY={handleUpdateFocusY}
                              handleUpdateSize={handleUpdateSize}
                            />
                        ))}
                    </div>
                  </SortableContext>
                </DndContext>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
