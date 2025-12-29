'use server';

import sharp from 'sharp';

function bufferToDataURL(buffer: Buffer, mimeType: string): string {
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

export async function convertImage(
  formData: FormData
): Promise<{ dataUrl: string; originalName: string; } | { error: string }> {
  const file = formData.get('file') as File;
  const targetFormat = (formData.get('format') as string | null) || 'jpeg';
  const quality = parseInt(formData.get('quality') as string, 10) || 80;
  const width = parseInt(formData.get('width') as string, 10) || undefined;
  const height = parseInt(formData.get('height') as string, 10) || undefined;
  const keepAspectRatio = formData.get('keepAspectRatio') === 'true';

  if (!file) {
    return { error: 'No file provided.' };
  }

  const supportedOutputFormats = ['jpeg', 'png', 'webp', 'gif', 'avif', 'tiff'];
  let format = targetFormat.toLowerCase();
  if (format === 'jpg') format = 'jpeg';
  
  if (!supportedOutputFormats.includes(format)) {
      if (targetFormat.toLowerCase() === 'svg' && file.type === 'image/svg+xml') {
        // "Converting" SVG to SVG, just pass it through
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const dataUrl = bufferToDataURL(fileBuffer, 'image/svg+xml');
        return { dataUrl, originalName: file.name };
      }
      return { error: `Unsupported output format: ${targetFormat}` };
  }
  
  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    let sharpInstance = sharp(fileBuffer);

    try {
        await sharpInstance.metadata();
    } catch (e) {
        return { error: 'Invalid or unsupported input image format.' };
    }

    if (width || height) {
        sharpInstance.resize(width, height, { fit: keepAspectRatio ? 'inside' : 'fill' });
    }
    
    let convertedBuffer: Buffer;
    const mimeType = `image/${format}`;

    sharpInstance.toFormat(format as keyof sharp.FormatEnum, { quality });

    convertedBuffer = await sharpInstance.toBuffer();

    const dataUrl = bufferToDataURL(convertedBuffer, mimeType);
    const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
    return { dataUrl, originalName: `${originalName}.${format}` };

  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
        return { error: `Conversion failed: ${error.message}` };
    }
    return { error: 'An unknown error occurred during conversion.' };
  }
}
