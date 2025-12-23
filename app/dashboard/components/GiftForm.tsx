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
    const { control, register, watch } = useFormContext();
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
              Manage Bank Account, QRIS, or Gift Address.
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
              })
            }
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Method
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
