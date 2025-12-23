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

                  <div className="space-y-2 flex flex-col">
                    <Label>Date</Label>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input {...register(`acara.${index}.jam`)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Venue</Label>
                      <Input {...register(`acara.${index}.tempat`)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Maps URL</Label>
                    <Input {...register(`acara.${index}.maps`)} />
                  </div>
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
