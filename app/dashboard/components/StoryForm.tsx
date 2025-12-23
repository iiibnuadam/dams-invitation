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

export default function StoryForm() {
  const { control, register } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "weddingStory"
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
            <CardTitle>Love Story</CardTitle>
            <CardDescription>
              Edit the timeline of your story. Reorder or hide items.
            </CardDescription>
          </div>
          <Button
            onClick={() =>
              append({ year: "", title: "", content: "", enabled: true })
            }
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Story
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
            {fields.map((field, index) => (
              <SortableItem key={field.id} id={field.id}>
                <div className="border p-4 rounded-md space-y-3 mb-4 last:mb-0 relative bg-background ml-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-sm">Story Item {index + 1}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 mr-2">
                        <Label
                          htmlFor={`story-enabled-${index}`}
                          className="text-xs"
                        >
                          Show
                        </Label>
                        <Controller
                          control={control}
                          name={`weddingStory.${index}.enabled`}
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              id={`story-enabled-${index}`}
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

                  <div className="grid grid-cols-6 gap-2">
                    <div className="col-span-1">
                      <Input
                        placeholder="Year"
                        {...register(`weddingStory.${index}.year`)}
                      />
                    </div>
                    <div className="col-span-5">
                      <Input
                        placeholder="Title"
                        {...register(`weddingStory.${index}.title`)}
                      />
                    </div>
                  </div>
                  <Textarea
                    placeholder="Content"
                    {...register(`weddingStory.${index}.content`)}
                  />
                </div>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
        {fields.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No story items yet. Click "Add Story" to begin.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
