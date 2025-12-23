"use client";

import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Search, RefreshCcw } from "lucide-react";
import { useState } from "react";

interface CommentsFormProps {
  onRefresh?: () => void;
}

export default function CommentsForm({ onRefresh }: CommentsFormProps) {
  const { control } = useFormContext();
  const { fields, remove } = useFieldArray({
    control,
    name: "comments"
  });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredFields = fields.map((field, index) => {
    return { ...field, originalIndex: index };
  }).filter((field: any) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = field.name?.toLowerCase().includes(term);
    const msgMatch = field.message?.toLowerCase().includes(term);
    return nameMatch || msgMatch;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <CardTitle>Comments Management</CardTitle>
                <CardDescription>
                Manage visibility and pin favorite comments.
                </CardDescription>
            </div>
            <div className="flex items-center gap-2">
                 <Button variant="outline" size="sm" onClick={onRefresh}>
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Refresh Data
                </Button>
            </div>
        </div>
        <div className="pt-4">
             <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Filter by name or message..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredFields.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {fields.length === 0 ? "No comments yet." : "No comments match your filter."}
          </p>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {filteredFields.map((field: any) => (
              <div
                key={field.id}
                className="border p-4 rounded-md bg-background flex justify-between items-start"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold">{field.name}</h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(field.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm bg-muted/50 p-2 rounded-md mb-2">
                    {field.message}
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Visible</Label>
                    <Controller
                      control={control}
                      name={`comments.${field.originalIndex}.isVisible`}
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
                      name={`comments.${field.originalIndex}.isFavorite`}
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
                    onClick={() => remove(field.originalIndex)}
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
  );
}
