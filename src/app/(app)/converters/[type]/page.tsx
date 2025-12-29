import { converterTools } from '@/lib/converter-options';
import type { ConverterType } from '@/lib/types';
import { ConverterWrapper } from '@/components/converters/ConverterWrapper';
import { notFound } from 'next/navigation';

export const dynamic = 'force-static';
export const dynamicParams = true;

export function generateStaticParams() {
  return Object.keys(converterTools).map(type => ({ type }));
}

function getPageInfo(type: ConverterType) {
    switch (type) {
        case 'image': return { title: 'Image Converter', description: 'Convert, resize, and compress your images with ease.' };
        case 'pdf': return { title: 'PDF Converter', description: 'All the PDF tools you need in one place.' };
        default: return { title: 'Converter', description: 'Select a tool to get started.' };
    }
}

export default function ConverterPage({ params }: { params: { type: ConverterType } }) {
  const { type } = params;
  const tools = converterTools[type];
  const { title, description } = getPageInfo(type);

  if (!tools) {
    notFound();
  }

  return (
    <div className="space-y-8">
       <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {title}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {description}
            </p>
        </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <ConverterWrapper 
            key={tool.name} 
            tool={tool} 
            maxFiles={tool.name.toLowerCase().includes('merge') ? 10 : 1} 
          />
        ))}
      </div>
    </div>
  );
}
