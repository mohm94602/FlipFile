import type { ConverterTools } from './types';

export const converterTools: ConverterTools = {
  image: [
    {
      name: 'Convert Image',
      description: 'Change image format to JPG, PNG, GIF, or SVG.',
      options: [
        { id: 'format', label: 'Convert to', type: 'select', defaultValue: 'png', items: [{ value: 'png', label: 'PNG' }, { value: 'jpg', label: 'JPG' }, { value: 'gif', label: 'GIF' }, { value: 'svg', label: 'SVG' }] },
      ],
    },
    {
      name: 'Resize Image',
      description: 'Change the dimensions of your image.',
      options: [
        { id: 'width', label: 'Width (px)', type: 'slider', defaultValue: 1280, min: 100, max: 4000, step: 10 },
        { id: 'height', label: 'Height (px)', type: 'slider', defaultValue: 720, min: 100, max: 4000, step: 10 },
        { id: 'keepAspectRatio', label: 'Keep Aspect Ratio', type: 'switch', defaultValue: true },
      ],
    },
    {
      name: 'Compress Image',
      description: 'Reduce the file size of your image.',
      options: [
        { id: 'quality', label: 'Quality', type: 'slider', defaultValue: 80, min: 10, max: 100, step: 5 },
      ],
    },
  ],
  pdf: [
    {
      name: 'PDF to Word',
      description: 'Convert your PDF to an editable Word document.',
      options: [],
    },
    {
      name: 'PDF to JPG',
      description: 'Convert each page of your PDF to a JPG image.',
      options: [],
    },
    {
      name: 'Merge PDF',
      description: 'Combine multiple PDF files into one.',
      options: [],
    },
    {
      name: 'Split PDF',
      description: 'Extract specific pages from a PDF file.',
      options: [],
    },
  ],
};
