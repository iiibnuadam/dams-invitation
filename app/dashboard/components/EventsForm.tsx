"use client";

import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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

export default function EventsForm() {
  const { control, register } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "acara"
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
            <CardTitle>Wedding Events (Acara)</CardTitle>
            <CardDescription>
              Add, remove, reorder, or toggle events.
            </CardDescription>
          </div>
          <Button
            onClick={() =>
              append({
                title: "New Event",
                tanggal: new Date().toISOString(),
                jam: "10:00",
                tempat: "Venue",
                maps: "#",
                enabled: true,
                schedules: [],
              })
            }
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields}
            strategy={verticalListSortingStrategy}
          >
            {fields.map((field, index) => (
              <SortableItem key={field.id} id={field.id}>
                <div className="border p-4 rounded-md space-y-4 relative bg-background ml-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-sm">Event {index + 1}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 mr-2">
                        <Label
                          htmlFor={`event-enabled-${index}`}
                          className="text-xs"
                        >
                          Show
                        </Label>
                        <Controller
                          control={control}
                          name={`acara.${index}.enabled`}
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              id={`event-enabled-${index}`}
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

                  <div className="space-y-2">
                    <Label>Event Title</Label>
                    <Input {...register(`acara.${index}.title`)} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 flex flex-col">
                      <Label>Start Date</Label>
                      <Controller
                        control={control}
                        name={`acara.${index}.tanggal`}
                        render={({ field }) => (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={
                                  field.value ? new Date(field.value) : undefined
                                }
                                defaultMonth={
                                  field.value ? new Date(field.value) : undefined
                                }
                                onSelect={(date) =>
                                  field.onChange(
                                    date ? format(date, "yyyy-MM-dd") : ""
                                  )
                                }
                                disabled={(date) =>
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        )}
                      />
                    </div>

                    <div className="space-y-2 flex flex-col">
                      <Label>End Date (Optional, for multi-day events)</Label>
                      <Controller
                        control={control}
                        name={`acara.${index}.tanggalEnd`}
                        render={({ field }) => (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>No End Date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={
                                  field.value ? new Date(field.value) : undefined
                                }
                                defaultMonth={
                                  field.value ? new Date(field.value) : undefined
                                }
                                onSelect={(date) =>
                                  field.onChange(
                                    date ? format(date, "yyyy-MM-dd") : ""
                                  )
                                }
                                disabled={(date) =>
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                              {field.value && (
                                <div className="p-2 border-t text-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => field.onChange("")}
                                    className="text-xs text-destructive hover:bg-destructive/10"
                                  >
                                    Clear End Date
                                  </Button>
                                </div>
                              )}
                            </PopoverContent>
                          </Popover>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Time (Jam)</Label>
                        <div className="flex items-center gap-1.5">
                          <Label htmlFor={`event-showjam-${index}`} className="text-xs">
                            Show Time
                          </Label>
                          <Controller
                            control={control}
                            name={`acara.${index}.showJam`}
                            render={({ field }) => (
                              <Switch
                                checked={field.value !== false}
                                onCheckedChange={field.onChange}
                                id={`event-showjam-${index}`}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Input placeholder="e.g. 09:00 WIB" {...register(`acara.${index}.jam`)} />
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <Controller
                            control={control}
                            name={`acara.${index}.sampaiSelesai`}
                            render={({ field }) => (
                              <Switch
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                                id={`event-sampaiselesai-${index}`}
                              />
                            )}
                          />
                          <Label htmlFor={`event-sampaiselesai-${index}`} className="text-xs">
                            Until Finish
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Venue Name</Label>
                      <Input placeholder="e.g. Rumah Mempelai Wanita" {...register(`acara.${index}.tempat`)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Detailed Address (Alamat Lengkap)</Label>
                    <Input placeholder="e.g. Jl. Kenanga No. 45, RT 02/03, Kec. Menteng" {...register(`acara.${index}.alamat`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Maps URL</Label>
                    <Input {...register(`acara.${index}.maps`)} />
                  </div>

                  <SchedulesFieldArray eventIndex={index} control={control} register={register} />
                </div>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
        {fields.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No events yet. Click "Add Event" to begin.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function SchedulesFieldArray({ eventIndex, control, register }: { eventIndex: number; control: any; register: any }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `acara.${eventIndex}.schedules`
  });

  return (
    <div className="space-y-3 border-t pt-4 mt-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">Sub-Schedules (Rundown Waktu)</Label>
        <Button
          type="button"
          onClick={() => append({ name: "", jam: "" })}
          variant="outline"
          className="h-7 px-2 text-xs"
        >
          <Plus className="mr-1 h-3.5 w-3.5" /> Add Time
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Add multiple event times inside this single card (e.g. Akad and Resepsi schedules).
      </p>

      {fields.map((item, subIndex) => (
        <div key={item.id} className="flex gap-2 items-center">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Input
                placeholder="Name (e.g. Akad Nikah)"
                {...register(`acara.${eventIndex}.schedules.${subIndex}.name` as const)}
              />
            </div>
            <div className="space-y-1">
              <Input
                placeholder="Time (e.g. 08:00 - 10:00 WIB)"
                {...register(`acara.${eventIndex}.schedules.${subIndex}.jam` as const)}
              />
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(subIndex)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 w-9 flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
