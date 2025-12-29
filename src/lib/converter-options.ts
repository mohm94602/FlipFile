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
  video: [
    {
      name: 'Convert Video',
      description: 'Change video format to MP4, MOV, AVI, or MKV.',
      options: [
        { id: 'format', label: 'Convert to', type: 'select', defaultValue: 'mp4', items: [{ value: 'mp4', label: 'MP4' }, { value: 'mov', label: 'MOV' }, { value: 'avi', label: 'AVI' }, { value: 'mkv', label: 'MKV' }] },
      ],
    },
    {
      name: 'Compress Video',
      description: 'Reduce the file size of your video.',
      options: [
        { id: 'crf', label: 'Quality (lower is better)', type: 'slider', defaultValue: 23, min: 18, max: 28, step: 1 },
      ],
    },
    {
      name: 'Extract Audio',
      description: 'Extract audio from video to an MP3 file.',
      options: [
        { id: 'extract', label: 'Extract Audio', type: 'switch', defaultValue: false },
      ],
    },
  ],
  audio: [
    {
      name: 'Convert Audio',
      description: 'Change audio format to MP3, WAV, AAC, or OGG.',
      options: [
        { id: 'format', label: 'Convert to', type: 'select', defaultValue: 'mp3', items: [{ value: 'mp3', label: 'MP3' }, { value: 'wav', label: 'WAV' }, { value: 'aac', label: 'AAC' }, { value: 'ogg', label: 'OGG' }] },
      ],
    },
    {
      name: 'Change Bitrate',
      description: 'Adjust the bitrate of your audio file.',
      options: [
        { id: 'bitrate', label: 'Bitrate (kbps)', type: 'select', defaultValue: '192', items: [{ value: '128', label: '128 kbps' }, { value: '192', label: '192 kbps' }, { value: '256', label: '256 kbps' }, { value: '320', label: '320 kbps' }] },
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
