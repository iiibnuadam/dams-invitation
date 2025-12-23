"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CalendarIcon, Plus, Trash2 } from "lucide-react"; // Icons
import { toast } from "sonner";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableItem } from "./SortableItem";

// Simple Schema for now - can be expanded
const invitationSchema = z.object({
  slug: z.string().min(1),
  hero: z.object({
    heading: z.string(),
    names: z.string(),
    date: z.string(),
    image: z.string().optional(),
    quote: z.object({
        arabic: z.string(),
        translation: z.string(),
        source: z.string()
    })
  }),
  mempelai: z.object({
      pria: z.object({
          namaLengkap: z.string(),
          putraDari: z.string(),
          fotoUrl: z.string(),
      }),
       wanita: z.object({
          namaLengkap: z.string(),
          putriDari: z.string(),
          fotoUrl: z.string(),
      })
  }),
  acara: z.array(z.object({
      title: z.string(),
      tanggal: z.string(),
      jam: z.string(),
      tempat: z.string(),
      maps: z.string(),
      enabled: z.boolean().default(true)
  })),
  weddingStory: z.array(z.object({
      year: z.string(),
      title: z.string(),
      content: z.string(),
      enabled: z.boolean().default(true)
  })).optional(),
  paymentMethods: z.array(z.object({
      bank: z.string().optional(),
      number: z.string().optional(),
      holder: z.string().optional(),
      name: z.string().optional(),
      address: z.string().optional(),
      type: z.enum(["bank", "address"]),
      enabled: z.boolean().default(true)
  })).optional(),
  comments: z.array(z.object({
      name: z.string(),
      message: z.string(),
      timestamp: z.string().or(z.date()), // API might return string
      isVisible: z.boolean().default(true),
      isFavorite: z.boolean().default(false)
  })).optional()
});

type InvitationFormValues = z.infer<typeof invitationSchema>;

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [jsonError, setJsonError] = useState("");
  
  const form = useForm<InvitationFormValues>({
    // resolver: zodResolver(invitationSchema),
  });

  const { register, handleSubmit, reset, watch, setValue, control, formState: { errors } } = form;

  const { fields: storyFields, append: appendStory, remove: removeStory, move: moveStory } = useFieldArray({
    control,
    name: "weddingStory"
  });

  const { fields: eventFields, append: appendEvent, remove: removeEvent, move: moveEvent } = useFieldArray({
    control,
    name: "acara"
  });

  const { fields: paymentFields, append: appendPayment, remove: removePayment, move: movePayment } = useFieldArray({
    control,
    name: "paymentMethods"
  });

  const { fields: commentFields, update: updateComment, remove: removeComment } = useFieldArray({
      control,
      name: "comments"
  });

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent, name: "acara" | "weddingStory" | "paymentMethods") => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      if (name === "acara") {
          const oldIndex = eventFields.findIndex(i => i.id === active.id);
          const newIndex = eventFields.findIndex(i => i.id === over?.id);
          moveEvent(oldIndex, newIndex);
      } else if (name === "weddingStory") {
          const oldIndex = storyFields.findIndex(i => i.id === active.id);
          const newIndex = storyFields.findIndex(i => i.id === over?.id);
          moveStory(oldIndex, newIndex);
      } else if (name === "paymentMethods") {
          const oldIndex = paymentFields.findIndex(i => i.id === active.id);
          const newIndex = paymentFields.findIndex(i => i.id === over?.id);
          movePayment(oldIndex, newIndex);
      }
    }
  };

  // Watch for JSON view
  const formData = watch();

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/invitation?slug=sasti-adam"); 
        const data = await res.json();
        if (data && !data.error) {
             // Ensure dates are strings for inputs if needed, generic handling
             reset(data);
        }
      } catch (error) {
        console.error("Failed to fetch invitation", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [reset]);

  const onSubmit = async (data: InvitationFormValues) => {
    setIsSaving(true);
    try {
        const res = await fetch("/api/invitation", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error("Failed to update");
        
        toast.success("Invitation updated successfully");
    } catch (error) {
        toast.error("Failed to update invitation");
    } finally {
        setIsSaving(false);
    }
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      try {
          const parsed = JSON.parse(e.target.value);
          setJsonError("");
          reset(parsed); // Update form state
      } catch (err) {
          setJsonError("Invalid JSON format");
      }
  };

  if (isLoading) {
      return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold">Edit Invitation</h1>
        <Button onClick={handleSubmit(onSubmit)} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
        </Button>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="mb-4 flex-wrap h-auto gap-2">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="couple">Couple</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="gift">Gift</TabsTrigger>
          <TabsTrigger value="story">Story</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="json">Raw JSON</TabsTrigger>
        </TabsList>

        {/* Hero Tab */}
        <TabsContent value="hero">
            <Card>
                <CardHeader>
                    <CardTitle>Hero Details</CardTitle>
                    <CardDescription>Main heading and wedding date.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Heading</Label>
                            <Input {...register("hero.heading")} />
                        </div>
                         <div className="space-y-2">
                            <Label>Couple Names (Display)</Label>
                            <Input {...register("hero.names")} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Date String</Label>
                        <Input {...register("hero.date")} />
                    </div>
                     <div className="space-y-2">
                        <Label>Hero Image URL</Label>
                        <Input {...register("hero.image")} />
                    </div>
                     <div className="space-y-2">
                        <Label>Quote (Arabic)</Label>
                        <Input {...register("hero.quote.arabic")} />
                    </div>
                     <div className="space-y-2">
                        <Label>Quote Translation</Label>
                        <Textarea {...register("hero.quote.translation")} rows={3} />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        {/* Couple Tab */}
        <TabsContent value="couple">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Groom (Pria)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input {...register("mempelai.pria.namaLengkap")} />
                        </div>
                        <div className="space-y-2">
                            <Label>Son of (Parents)</Label>
                            <Input {...register("mempelai.pria.putraDari")} />
                        </div>
                         <div className="space-y-2">
                            <Label>Photo URL</Label>
                            <Input {...register("mempelai.pria.fotoUrl")} />
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Bride (Wanita)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input {...register("mempelai.wanita.namaLengkap")} />
                        </div>
                        <div className="space-y-2">
                            <Label>Daughter of (Parents)</Label>
                            <Input {...register("mempelai.wanita.putriDari")} />
                        </div>
                         <div className="space-y-2">
                            <Label>Photo URL</Label>
                            <Input {...register("mempelai.wanita.fotoUrl")} />
                        </div>
                    </CardContent>
                </Card>
             </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
             <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Wedding Events (Acara)</CardTitle>
                            <CardDescription>
                                Add, remove, reorder, or toggle events.
                            </CardDescription>
                        </div>
                        <Button onClick={() => appendEvent({ title: "New Event", tanggal: new Date().toISOString(), jam: "10:00", tempat: "Venue", maps: "#", enabled: true })} size="sm">
                            <Plus className="mr-2 h-4 w-4" /> Add Event
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                     <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'acara')}>
                        <SortableContext items={eventFields} strategy={verticalListSortingStrategy}>
                         {eventFields.map((field, index) => (
                             <SortableItem key={field.id} id={field.id}>
                                 <div className="border p-4 rounded-md space-y-4 relative bg-background ml-4">
                                      <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-sm">Event {index + 1}</h4>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1.5 mr-2">
                                                <Label htmlFor={`event-enabled-${index}`} className="text-xs">Show</Label>
                                                <Controller
                                                    control={control}
                                                    name={`acara.${index}.enabled`}
                                                    render={({ field }) => (
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} id={`event-enabled-${index}`} />
                                                    )}
                                                />
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => removeEvent(index)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                     </div>
                                     
                                    <div className="space-y-2">
                                        <Label>Event Title</Label>
                                        <Input {...register(`acara.${index}.title` as const)} />
                                    </div>

                                     <div className="space-y-2 flex flex-col">
                                        <Label>Date</Label>
                                        <Controller
                                            control={control}
                                            name={`acara.${index}.tanggal` as const}
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
                                                            selected={field.value ? new Date(field.value) : undefined}
                                                            defaultMonth={field.value ? new Date(field.value) : undefined}
                                                            onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
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
                                            <Input {...register(`acara.${index}.jam` as const)} />
                                        </div>
                                         <div className="space-y-2">
                                            <Label>Venue</Label>
                                            <Input {...register(`acara.${index}.tempat` as const)} />
                                        </div>
                                     </div>
                                    <div className="space-y-2">
                                        <Label>Maps URL</Label>
                                        <Input {...register(`acara.${index}.maps` as const)} />
                                    </div>
                                 </div>
                             </SortableItem>
                         ))}
                        </SortableContext>
                     </DndContext>
                     {eventFields.length === 0 && (
                         <p className="text-center text-muted-foreground py-8">No events yet. Click "Add Event" to begin.</p>
                     )}
                </CardContent>
             </Card>
        </TabsContent>

        {/* Gift Tab */}
        <TabsContent value="gift">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Gift & Payment Methods</CardTitle>
                            <CardDescription>
                                Add bank accounts or address for gifts. Reorder or hide.
                            </CardDescription>
                        </div>
                        <Button onClick={() => appendPayment({ bank: "BCA", number: "", holder: "", type: "bank", enabled: true })} size="sm">
                            <Plus className="mr-2 h-4 w-4" /> Add Method
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'paymentMethods')}>
                        <SortableContext items={paymentFields} strategy={verticalListSortingStrategy}>
                     {paymentFields.map((field, index) => {
                         // Watch the type specific to this row
                         const methodType = watch(`paymentMethods.${index}.type`);

                         return (
                         <SortableItem key={field.id} id={field.id}>
                         <div className="border p-4 rounded-md space-y-4 relative bg-background ml-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-sm">Method {index + 1}</h4>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 mr-2">
                                        <Label htmlFor={`payment-enabled-${index}`} className="text-xs">Show</Label>
                                        <Controller
                                            control={control}
                                            name={`paymentMethods.${index}.enabled`}
                                            render={({ field }) => (
                                                <Switch checked={field.value} onCheckedChange={field.onChange} id={`payment-enabled-${index}`} />
                                            )}
                                        />
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removePayment(index)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                             </div>
                             
                             <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <select 
                                        {...register(`paymentMethods.${index}.type` as const)}
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="bank">Bank Transfer</option>
                                        <option value="address">Send Gift (Address)</option>
                                    </select>
                                </div>

                                {methodType === 'bank' || !methodType ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Bank Name</Label>
                                                <Input placeholder="BCA / Mandiri" {...register(`paymentMethods.${index}.bank` as const)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Account Number</Label>
                                                <Input placeholder="1234567890" {...register(`paymentMethods.${index}.number` as const)} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Account Holder / Name</Label>
                                            <Input placeholder="Recipient Name" {...register(`paymentMethods.${index}.holder` as const)} />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <Label>Recipient Name / Label</Label>
                                            <Input placeholder="Home / Office" {...register(`paymentMethods.${index}.name` as const)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Full Address</Label>
                                            <Textarea placeholder="Jl. Example No. 123, City" {...register(`paymentMethods.${index}.address` as const)} />
                                        </div>
                                    </>
                                )}
                             </div>
                         </div>
                         </SortableItem>
                     )})}
                     </SortableContext>
                     </DndContext>
                     {paymentFields.length === 0 && (
                         <p className="text-center text-muted-foreground py-8">No payment methods added.</p>
                     )}
                </CardContent>
            </Card>
        </TabsContent>

        {/* Story Tab - Dynamic Fields */}
        <TabsContent value="story">
             <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Love Story</CardTitle>
                            <CardDescription>
                                Edit the timeline of your story. Reorder or hide items.
                            </CardDescription>
                        </div>
                        <Button onClick={() => appendStory({ year: "", title: "", content: "", enabled: true })} size="sm">
                            <Plus className="mr-2 h-4 w-4" /> Add Story
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'weddingStory')}>
                        <SortableContext items={storyFields} strategy={verticalListSortingStrategy}>
                     {storyFields.map((field, index) => (
                         <SortableItem key={field.id} id={field.id}>
                         <div className="border p-4 rounded-md space-y-3 mb-4 last:mb-0 relative bg-background ml-4">
                             <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-sm">Story Item {index + 1}</h4>
                                <div className="flex items-center gap-2">
                                   <div className="flex items-center gap-1.5 mr-2">
                                        <Label htmlFor={`story-enabled-${index}`} className="text-xs">Show</Label>
                                        <Controller
                                            control={control}
                                            name={`weddingStory.${index}.enabled`}
                                            render={({ field }) => (
                                                <Switch checked={field.value} onCheckedChange={field.onChange} id={`story-enabled-${index}`} />
                                            )}
                                        />
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeStory(index)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                             </div>
                             
                             <div className="grid grid-cols-6 gap-2">
                                <div className="col-span-1">
                                     <Input placeholder="Year" {...register(`weddingStory.${index}.year` as const)} />
                                </div>
                                <div className="col-span-5">
                                     <Input placeholder="Title" {...register(`weddingStory.${index}.title` as const)} />
                                </div>
                             </div>
                             <Textarea placeholder="Content" {...register(`weddingStory.${index}.content` as const)} />
                         </div>
                         </SortableItem>
                     ))}
                        </SortableContext>
                    </DndContext>
                     {storyFields.length === 0 && (
                         <p className="text-center text-muted-foreground py-8">No story items yet. Click "Add Story" to begin.</p>
                     )}
                </CardContent>
            </Card>
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments">
             <Card>
                <CardHeader>
                    <CardTitle>Comments Management</CardTitle>
                    <CardDescription>
                        Manage visibility and pin favorite comments.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {commentFields.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No comments yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {commentFields.map((field, index) => (
                                <div key={field.id} className="border p-4 rounded-md bg-background flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold">{field.name}</h4>
                                            <span className="text-xs text-muted-foreground">{new Date(field.timestamp as any).toLocaleString()}</span>
                                        </div>
                                        <p className="text-sm bg-muted/50 p-2 rounded-md mb-2">{field.message}</p>
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-xs">Visible</Label>
                                            <Controller
                                                control={control}
                                                name={`comments.${index}.isVisible`}
                                                render={({ field }) => (
                                                    <Switch 
                                                        checked={field.value === true} 
                                                        onCheckedChange={field.onChange} 
                                                    />
                                                )}
                                            />
                                        </div>
                                         <div className="flex items-center gap-2">
                                            <Label className="text-xs">Favorite</Label>
                                            <Controller
                                                control={control}
                                                name={`comments.${index}.isFavorite`}
                                                render={({ field }) => (
                                                    <Switch 
                                                        checked={field.value === true} 
                                                        onCheckedChange={field.onChange} 
                                                    />
                                                )}
                                            />
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => removeComment(index)} 
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                                            title="Delete Comment"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

        {/* Raw JSON Tab */}
        <TabsContent value="json">
            <Card>
                 <CardHeader>
                    <CardTitle>Raw JSON Editor</CardTitle>
                    <CardDescription>
                        Directly edit the data structure. Useful for adding items to arrays (Story, Gift, Gallery).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        className="font-mono text-xs min-h-[500px]"
                        defaultValue={JSON.stringify(formData, null, 2)}
                        onChange={handleJsonChange}
                    />
                    {jsonError && (
                        <p className="text-destructive text-sm mt-2">{jsonError}</p>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
