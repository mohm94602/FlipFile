"use client";

import { useState } from "react";
import { FileDropzone } from "@/components/upload/FileDropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ConverterTool, ConverterToolOption } from "@/lib/types";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { convertImage } from "@/app/actions/convert";
import { convertPdfToJpg, convertPdfToWord, mergePdf, splitPdf } from "@/app/actions/pdf";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface ConverterWrapperProps {
  tool: ConverterTool;
  maxFiles?: number;
}

export function ConverterWrapper({ tool, maxFiles = 1 }: ConverterWrapperProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>('');
  const [conversionError, setConversionError] = useState<string | null>(null);

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

  const handleConvert = async () => {
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
    setConversionError(null);

    const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 10, 90));
    }, 500);

    const formData = new FormData();
    files.forEach(file => formData.append('file', file));
    Object.entries(options).forEach(([key, value]) => {
        formData.append(key, String(value));
    });

    let result: { dataUrl: string; originalName?: string; fileName?: string; } | { error: string } | undefined;
    const toolName = tool.name.toLowerCase();

    try {
        if (toolName.includes('image')) {
            result = await convertImage(formData);
        } else if (toolName.includes('pdf to word')) {
            result = await convertPdfToWord(formData);
        } else if (toolName.includes('pdf to jpg')) {
            result = await convertPdfToJpg(formData);
        } else if (toolName.includes('merge pdf')) {
            result = await mergePdf(formData);
        } else if (toolName.includes('split pdf')) {
            result = await splitPdf(formData);
        }
    } catch (e) {
        console.error(e);
        result = { error: "An unexpected error occurred." };
    }

    clearInterval(progressInterval);
    setProgress(100);

    if (result && 'error' in result) {
        setConversionError(result.error);
        toast({
            title: 'Conversion Failed',
            description: result.error,
            variant: 'destructive',
        });
    } else if (result && 'dataUrl' in result) {
        setDownloadUrl(result.dataUrl);
        const originalName = result.originalName || files[0].name;
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
        const targetFormat = options.format || tool.name.split(' ').pop()?.toLowerCase();
        
        let finalFilename = result.fileName || `${nameWithoutExt}.${targetFormat}`;
        if (result.originalName) {
            finalFilename = result.originalName;
        }

        setDownloadFilename(finalFilename);
        setIsDone(true);
        toast({
            title: "Conversion Successful!",
            description: "Your file is ready for download.",
        });
    }
    
    setIsConverting(false);
  };

  const handleReset = () => {
    setFiles([]);
    setIsConverting(false);
    setProgress(0);
    setIsDone(false);
    setDownloadUrl(null);
    setDownloadFilename('');
    setConversionError(null);
  };
  
  const handleDownload = () => {
    if (!downloadUrl) return;

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = downloadFilename;
    document.body.appendChild(a);
a.click();
    document.body.removeChild(a);
    
    if (downloadUrl.startsWith('blob:')) {
        URL.revokeObjectURL(downloadUrl);
    }
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
  
  const toolName = tool.name.toLowerCase();
  let acceptedFormats: Record<string, string[]> | undefined;
  if (toolName.includes('image')) acceptedFormats = { 'image/*': [] };
  if (toolName.includes('pdf')) acceptedFormats = { 'application/pdf': ['.pdf'] };

  return (
    <Card className="flex h-full w-full flex-col shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle>{tool.name}</CardTitle>
        <CardDescription>{tool.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        {!isDone && <FileDropzone files={files} setFiles={setFiles} maxFiles={maxFiles} disabled={isConverting} accept={acceptedFormats} />}
        
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
        
        {conversionError && !isConverting && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Conversion Error</AlertTitle>
                <AlertDescription>
                    {conversionError}
                </AlertDescription>
            </Alert>
        )}

        {isDone && !conversionError && downloadUrl && (
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
          {!isDone && !conversionError && (
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
           {(isDone || conversionError) && (
             <Button onClick={handleReset} className="w-full">
                {conversionError ? 'Try Again' : 'Convert Another File'}
             </Button>
           )}
      </CardFooter>
    </Card>
  );
}
