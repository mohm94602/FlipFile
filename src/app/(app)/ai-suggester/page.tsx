"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  suggestOptimalConversionFormat,
  type SuggestOptimalConversionFormatOutput,
} from "@/ai/flows/suggest-optimal-conversion-format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  targetFileType: z.string().min(1, "Please select a file type."),
  desiredQuality: z.string().min(1, "Please select a quality."),
});

const fileTypes = ["Image", "Video", "Audio", "Document"];
const qualityLevels = ["Best Quality", "Good Balance", "Smallest File Size"];

export default function AISuggesterPage() {
  const [suggestion, setSuggestion] = useState<SuggestOptimalConversionFormatOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetFileType: "",
      desiredQuality: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await suggestOptimalConversionFormat(values);
      setSuggestion(result);
    } catch (error) {
      console.error("Error fetching suggestion:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Wand2 className="size-6" />
            </div>
            <div>
              <CardTitle className="text-2xl">AI Format Suggester</CardTitle>
              <CardDescription>Let our AI recommend the best format for your needs, balancing quality and file size.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="targetFileType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What are you converting to?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a file type..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fileTypes.map((type) => (
                          <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desiredQuality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What is your priority?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a quality level..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {qualityLevels.map((level) => (
                          <SelectItem key={level} value={level.toLowerCase()}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Get Suggestion
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {suggestion && (
        <Alert className="mt-6 border-primary/50 bg-primary/5 text-primary">
            <Sparkles className="h-4 w-4 !text-primary" />
            <AlertTitle className="font-bold text-primary">AI Suggestion: {suggestion.suggestedFormat}</AlertTitle>
            <AlertDescription className="!text-primary/80">
                {suggestion.reason}
            </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
