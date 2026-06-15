"use client";

import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "../SortableItem";
import ImageUploadInput from "./ImageUploadInput";

export default function GiftForm() {
    const { control, register, watch, setValue } = useFormContext();
    const { fields, append, remove, move } = useFieldArray({
      control,
      name: "paymentMethods"
    });
  
    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );
  
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (active.id !== over?.id) {
        const oldIndex = fields.findIndex((i) => i.id === active.id);
        const newIndex = fields.findIndex((i) => i.id === over?.id);
        move(oldIndex, newIndex);
      }
    };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gift Methods (Data Gift)</CardTitle>
            <CardDescription>
              Manage Bank Account, QRIS, or Gift Address. Custom background and text colors can be selected below.
            </CardDescription>
          </div>
          <Button
            onClick={() =>
              append({
                bank: "BCA",
                number: "",
                holder: "",
                type: "bank",
                enabled: true,
                bgColor: "#1A1A1A",
                textColor: "#FFFFFF",
              })
            }
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Method
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Global Gift Settings */}
        <div className="p-4 bg-muted/40 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Label className="font-semibold text-sm">Mobile Navigation Direction</Label>
            <p className="text-xs text-muted-foreground">Choose direction for mobile deck pagination controls & dots (horizontal below, or vertical to the side).</p>
          </div>
          <div className="w-[180px] flex-shrink-0">
            <select
              {...register("giftIndicatorDirection")}
              className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="vertical">Vertical (Side)</option>
              <option value="horizontal">Horizontal (Below)</option>
            </select>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields}
            strategy={verticalListSortingStrategy}
          >
            {fields.map((field, index) => {
              // Watch the type specific to this row
              const methodType = watch(`paymentMethods.${index}.type`);

              return (
                <SortableItem key={field.id} id={field.id}>
                  <div className="border p-4 rounded-md space-y-4 relative bg-background ml-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-sm">Method {index + 1}</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 mr-2">
                          <Label
                            htmlFor={`payment-enabled-${index}`}
                            className="text-xs"
                          >
                            Show
                          </Label>
                          <Controller
                            control={control}
                            name={`paymentMethods.${index}.enabled`}
                            render={({ field }) => (
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id={`payment-enabled-${index}`}
                              />
                            )}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Method Type</Label>
                        <select
                          {...register(`paymentMethods.${index}.type`)}
                          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="bank">Bank Transfer</option>
                          <option value="qris">QRIS (QR Code)</option>
                          <option value="address">Send Gift (Address)</option>
                        </select>
                      </div>

                      {methodType === "address" ? (
                        <>
                          <div className="space-y-2">
                            <Label>Recipient Label (e.g. Home, Office)</Label>
                            <Input
                              placeholder="Home"
                              {...register(`paymentMethods.${index}.name`)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Full Address</Label>
                            <Textarea
                              placeholder="Jl. Example No. 123, City, Postal Code"
                              {...register(`paymentMethods.${index}.address`)}
                            />
                          </div>
                        </>
                      ) : methodType === "qris" ? (
                        <>
                           <div className="space-y-2">
                              <Label>QRIS / E-Wallet Name</Label>
                              <Input
                                placeholder="GoPay / OVO / Dana / Mandiri QR"
                                {...register(`paymentMethods.${index}.bank`)}
                              />
                           </div>
                           <div className="space-y-2">
                              <Label>Account Name (Merchant)</Label>
                              <Input
                                placeholder="a.n. Sasti & Adam"
                                {...register(`paymentMethods.${index}.holder`)}
                              />
                           </div>
                           <div className="space-y-2">
                              <Label>QR Code Image</Label>
                              <ImageUploadInput 
                                  name={`paymentMethods.${index}.image`}
                                  label="Upload QR Code"
                              />
                           </div>
                        </>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Bank Name</Label>
                              <Input
                                placeholder="BCA / Mandiri"
                                {...register(`paymentMethods.${index}.bank`)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Account Number</Label>
                              <Input
                                placeholder="1234567890"
                                {...register(`paymentMethods.${index}.number`)}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Account Holder</Label>
                            <Input
                              placeholder="Recipient Name"
                              {...register(`paymentMethods.${index}.holder`)}
                            />
                          </div>
                        </>
                      )}

                      {/* Custom Appearance Style Section */}
                      <div className="space-y-3 border-t pt-4 mt-2">
                        <Label className="text-xs font-semibold">Custom Appearance (Warna Kartu)</Label>
                        
                        {/* Curated Premium Color Presets */}
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: "Midnight Slate", bg: "#1A1A1A", text: "#FFFFFF" },
                            { name: "Soft Pearl", bg: "#FFFFFF", text: "#1A1A1A" },
                            { name: "Champagne Gold", bg: "#FAF6EE", text: "#C5A059" },
                            { name: "Emerald Forest", bg: "#1E352F", text: "#EBE3D5" },
                            { name: "Midnight Navy", bg: "#141E30", text: "#E0E0E0" },
                            { name: "Coklat Susu", bg: "#B58A63", text: "#FFFDF9" },
                            { name: "Coklat Tua", bg: "#4A2E1B", text: "#F5EBE6" },
                            { name: "Kuning Mandiri", bg: "#FFC72C", text: "#003A70" },
                            { name: "Oren BNI", bg: "#E05326", text: "#FFFFFF" },
                          ].map((preset) => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => {
                                setValue(`paymentMethods.${index}.bgColor`, preset.bg, { shouldDirty: true });
                                setValue(`paymentMethods.${index}.textColor`, preset.text, { shouldDirty: true });
                              }}
                              className="px-2.5 py-1 text-[11px] rounded border flex items-center gap-1.5 hover:bg-muted transition-colors cursor-pointer select-none bg-background"
                            >
                              <span 
                                className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block flex-shrink-0" 
                                style={{ backgroundColor: preset.bg }}
                              />
                              <span>{preset.name}</span>
                            </button>
                          ))}
                        </div>

                        {/* Hex & Color Picker Inputs */}
                        <div className="grid grid-cols-2 gap-4 pt-1">
                          <div className="space-y-1">
                            <Label className="text-[10px] text-muted-foreground">Background Color</Label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={
                                  (watch(`paymentMethods.${index}.bgColor`) && /^#[0-9A-F]{6}$/i.test(watch(`paymentMethods.${index}.bgColor`))) 
                                    ? watch(`paymentMethods.${index}.bgColor`) 
                                    : "#1A1A1A"
                                }
                                onChange={(e) => {
                                  setValue(`paymentMethods.${index}.bgColor`, e.target.value, { shouldDirty: true });
                                }}
                                className="w-8 h-8 rounded-md border border-input cursor-pointer bg-transparent p-0 overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-md flex-shrink-0"
                              />
                              <Input
                                placeholder="#1A1A1A"
                                className="h-8 text-xs font-mono"
                                {...register(`paymentMethods.${index}.bgColor`)}
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] text-muted-foreground">Text Color</Label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={
                                  (watch(`paymentMethods.${index}.textColor`) && /^#[0-9A-F]{6}$/i.test(watch(`paymentMethods.${index}.textColor`))) 
                                    ? watch(`paymentMethods.${index}.textColor`) 
                                    : "#FFFFFF"
                                }
                                onChange={(e) => {
                                  setValue(`paymentMethods.${index}.textColor`, e.target.value, { shouldDirty: true });
                                }}
                                className="w-8 h-8 rounded-md border border-input cursor-pointer bg-transparent p-0 overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-md flex-shrink-0"
                              />
                              <Input
                                placeholder="#FFFFFF"
                                className="h-8 text-xs font-mono"
                                {...register(`paymentMethods.${index}.textColor`)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SortableItem>
              );
            })}
          </SortableContext>
        </DndContext>
        {fields.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No payment methods added.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
