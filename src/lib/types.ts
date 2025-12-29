import type { LucideIcon } from "lucide-react";

export type ConverterType = 'image' | 'pdf';

export type ConverterOption = {
  value: string;
  label: string;
};

export type ConverterToolOption = {
  id: string;
  label: string;
  type: 'select' | 'switch' | 'slider';
  defaultValue: string | boolean | number;
  items?: ConverterOption[];
  min?: number;
  max?: number;
  step?: number;
};

export type ConverterTool = {
  name: string;
  description: string;
  options: ConverterToolOption[];
};

export type ConverterTools = {
  [key in ConverterType]: ConverterTool[];
};
