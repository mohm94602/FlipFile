"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export default function ReportPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<{ success: boolean; message: string } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setFormStatus(null);
    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormStatus({ success: true, message: result.message || 'Report sent successfully!' });
        toast({
          title: "Report Sent!",
          description: "Thanks for your feedback. We'll look into it.",
        });
        form.reset();
      } else {
        throw new Error(result.error || 'Failed to send report.');
      }
    } catch (error: any) {
      setFormStatus({ success: false, message: error.message || 'An unknown error occurred.' });
      toast({
        title: "Submission Failed",
        description: error.message || "Could not send your report. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
        <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Report a Problem</h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Having an issue with a conversion or noticed a bug? Let us know.
            </p>
        </div>

        <Card className="mt-12 shadow-lg">
            <CardHeader>
                <CardTitle>Submit a Report</CardTitle>
                <CardDescription>Your feedback helps us improve FlipFile.</CardDescription>
            </CardHeader>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
                <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., 'PDF to JPG conversion failed'" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Please describe the issue in detail..." {...field} rows={6} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4">
              <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Report
              </Button>
               {formStatus && (
                <Alert variant={formStatus.success ? "default" : "destructive"} className={formStatus.success ? "bg-green-500/10 border-green-500/50 text-green-700" : ""}>
                  <AlertDescription>
                    {formStatus.message}
                  </AlertDescription>
                </Alert>
              )}
            </CardFooter>
            </form>
            </Form>
        </Card>
    </div>
  );
}
