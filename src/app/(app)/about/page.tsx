import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const features = [
  "Comprehensive PDF Tools",
  "Versatile Image Conversion",
  "High-Quality Video & Audio Processing",
  "Drag & Drop Simplicity",
  "Blazing Fast Conversions",
  "Privacy-First: Files are deleted after processing",
  "AI-Powered Format Suggestions",
  "Modern, Responsive Dark & Light UI",
];

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">About FlipFile</h1>
        <p className="text-xl text-muted-foreground">
          Your all-in-one solution for seamless file conversions. We built FlipFile to be fast, private, and incredibly easy to use.
        </p>
      </div>

      <Card className="mt-12 shadow-lg">
        <CardHeader>
          <CardTitle>Core Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <CheckCircle className="size-5 text-primary" />
                <span className="font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="mt-12 text-center">
        <h2 className="text-3xl font-bold">Our Mission</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          To provide a powerful, reliable, and user-friendly file conversion platform that respects your privacy. Whether you're a student, a professional, or just someone needing a quick conversion, FlipFile is here to help you get the job done without any hassle.
        </p>
      </div>
    </div>
  );
}
