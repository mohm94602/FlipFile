"use client";

import { useState, useEffect } from "react";
import { FileDropzone } from "@/components/upload/FileDropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ConverterTool, ConverterToolOption } from "@/lib/types";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";

interface ConverterWrapperProps {
  tool: ConverterTool;
  maxFiles?: number;
}

export function ConverterWrapper({ tool, maxFiles = 1 }: ConverterWrapperProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [options, setOptions] = useState<Record<string, any>>(() => {
    const defaultOptions: Record<string, any> = {};
    tool.options.forEach(opt => {
        defaultOptions[opt.id] = opt.defaultValue;
    });
    return defaultOptions;
  });

  const { toast } = useToast();

  const handleOptionChange = (id: string, value: any) => {
    setOptions(prev => ({ ...prev, [id]: value }));
  };

  const handleConvert = () => {
    if (files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please select a file to convert.",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    setIsDone(false);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          return prev;
        }
        return prev + Math.floor(Math.random() * 10) + 5;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setIsConverting(false);
      setIsDone(true);
      toast({
        title: "Conversion Successful!",
        description: "Your file is ready for download.",
      });
    }, 4000);
  };

  const handleReset = () => {
    setFiles([]);
    setIsConverting(false);
    setProgress(0);
    setIsDone(false);
  };
  
  const handleDownload = () => {
    // This is a mock download.
    const mockFile = new Blob(["This is a mock converted file."], { type: "text/plain" });
    const url = URL.createObjectURL(mockFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted_${files[0]?.name.split('.')[0] || 'file'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const renderOption = (option: ConverterToolOption) => {
    switch (option.type) {
      case 'select':
        return (
          <Select
            value={options[option.id]}
            onValueChange={(value) => handleOptionChange(option.id, value)}
            disabled={isConverting || isDone}
          >
            <SelectTrigger id={option.id}>
              <SelectValue placeholder={option.label} />
            </SelectTrigger>
            <SelectContent>
              {option.items?.map(item => (
                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'slider':
        return (
          <div className="flex items-center gap-4">
            <Slider
              id={option.id}
              value={[options[option.id]]}
              onValueChange={(value) => handleOptionChange(option.id, value[0])}
              min={option.min}
              max={option.max}
              step={option.step}
              disabled={isConverting || isDone}
            />
            <span className="w-12 text-right font-mono text-sm">{options[option.id]}</span>
          </div>
        );
      case 'switch':
        return (
          <div className="flex items-center gap-4">
            <Switch
              id={option.id}
              checked={options[option.id]}
              onCheckedChange={(checked) => handleOptionChange(option.id, checked)}
              disabled={isConverting || isDone}
            />
            <Label htmlFor={option.id} className="cursor-pointer">
              {options[option.id] ? "Enabled" : "Disabled"}
            </Label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="flex h-full w-full flex-col shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle>{tool.name}</CardTitle>
        <CardDescription>{tool.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        {!isDone && <FileDropzone files={files} setFiles={setFiles} maxFiles={maxFiles} disabled={isConverting} />}
        
        {tool.options.length > 0 && files.length > 0 && !isDone && (
            <div className="space-y-4 rounded-md border p-4">
                <h3 className="font-medium">Options</h3>
                {tool.options.map(option => (
                    <div key={option.id} className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor={option.id} className="text-sm">{option.label}</Label>
                        <div className="col-span-2">
                            {renderOption(option)}
                        </div>
                    </div>
                ))}
            </div>
        )}

        {isConverting && (
          <div className="space-y-2 text-center">
            <p className="text-sm font-medium">Converting...</p>
            <Progress value={progress} />
            <p className="text-xs text-muted-foreground">{progress}% complete</p>
          </div>
        )}

        {isDone && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-green-500/30 bg-green-500/5 p-8 text-center text-green-500">
            <CheckCircle className="size-12" />
            <p className="font-semibold">Conversion Complete!</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={handleDownload}>
                <Download className="mr-2 size-4" />
                Download File
              </Button>
              <Button variant="outline" onClick={handleReset}>Convert Another</Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-auto">
          {!isDone && (
            <Button onClick={handleConvert} disabled={files.length === 0 || isConverting} className="w-full">
              {isConverting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                'Convert Now'
              )}
            </Button>
          )}
      </CardFooter>
    </Card>
  );
}
