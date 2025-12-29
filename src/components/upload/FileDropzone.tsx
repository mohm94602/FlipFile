"use client";

import { UploadCloud, File as FileIcon, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { Button } from "../ui/button";

interface FileDropzoneProps {
  files: File[];
  setFiles: (files: File[]) => void;
  maxFiles?: number;
  accept?: Record<string, string[]>;
  disabled?: boolean;
}

export function FileDropzone({ files, setFiles, maxFiles = 1, accept, disabled = false }: FileDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (maxFiles === 1) {
        setFiles(acceptedFiles);
      } else {
        setFiles([...files, ...acceptedFiles]);
      }
    },
    [setFiles, maxFiles, files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: maxFiles > 1 ? undefined : maxFiles,
    accept,
    disabled,
  });

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  const canAddMoreFiles = maxFiles === 1 ? files.length < 1 : true;

  return (
    <div className="space-y-4">
      {canAddMoreFiles && (
        <div
          {...getRootProps()}
          className={`w-full cursor-pointer rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center transition-colors hover:border-primary/50 ${
            isDragActive ? "border-primary bg-primary/10" : ""
          } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-4 text-primary">
            <UploadCloud className="size-12" />
            <p className="font-semibold">Drag & drop files here, or click to select</p>
            <p className="text-sm text-muted-foreground">
              {maxFiles > 1 ? `You can add multiple files` : "Single file upload"}
            </p>
          </div>
        </div>
      )}
      
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-md border bg-card p-3"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <FileIcon className="size-6 shrink-0 text-muted-foreground" />
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeFile(file)} disabled={disabled}>
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
