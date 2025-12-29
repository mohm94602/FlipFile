"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Github, Twitter, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export default function ContactPage() {
    const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
        title: "Message Sent!",
        description: "Thanks for reaching out. We'll get back to you soon.",
    })
    form.reset();
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
        <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Get in Touch</h1>
            <p className="mt-4 text-xl text-muted-foreground">
            We'd love to hear from you. Send us a message with any questions or feedback.
            </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Send a Message</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your Name" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="your.email@example.com" {...field} />
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
                                <Textarea placeholder="How can we help?" {...field} rows={5} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" className="w-full">Send Message</Button>
                    </form>
                    </Form>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                        <CardDescription>Find us on social media or send us an email directly.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p><strong>Email:</strong> contact@fileflex.com</p>
                        <p><strong>Address:</strong> 123 Convert Lane, Tech City, 45678</p>
                    </CardContent>
                </Card>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Follow Us</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <a href="#" target="_blank"><Twitter className="size-5" /></a>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                            <a href="#" target="_blank"><Github className="size-5" /></a>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                            <a href="#" target="_blank"><Linkedin className="size-5" /></a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
