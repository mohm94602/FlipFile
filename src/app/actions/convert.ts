'use server';

import sharp from 'sharp';

// Helper function to convert buffer to base64 data URL
function bufferToDataURL(buffer: Buffer, mimeType: string): string {
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

export async function convertImage(
  formData: FormData
): Promise<{ dataUrl: string; originalName: string; } | { error: string }> {
  const file = formData.get('file') as File;
  const targetFormat = (formData.get('format') as string) || 'jpeg';

  if (!file) {
    return { error: 'No file provided.' };
  }

  // List of formats supported by sharp for output
  const supportedOutputFormats = ['jpeg', 'png', 'webp', 'gif', 'avif', 'tiff', 'svg'];
  
  // Normalize format
  const format = targetFormat.toLowerCase();
  
  if (format === 'jpg') {
      // sharp uses 'jpeg'
  }

  if (!supportedOutputFormats.includes(format === 'jpg' ? 'jpeg' : format)) {
      return { error: `Unsupported output format: ${targetFormat}` };
  }
  
  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    let sharpInstance = sharp(fileBuffer);

    // Get metadata to check if the input is a valid image
    try {
        await sharpInstance.metadata();
    } catch (e) {
        return { error: 'Invalid or unsupported input image format.' };
    }

    let convertedBuffer: Buffer;
    let mimeType: string;

    switch (format) {
      case 'jpg':
      case 'jpeg':
        convertedBuffer = await sharpInstance.jpeg({ quality: 80 }).toBuffer();
        mimeType = 'image/jpeg';
        break;
      case 'png':
        convertedBuffer = await sharpInstance.png().toBuffer();
        mimeType = 'image/png';
        break;
      case 'gif':
        convertedBuffer = await sharpInstance.gif().toBuffer();
        mimeType = 'image/gif';
        break;
      case 'svg':
        // Note: Sharp cannot convert raster to SVG. If the input is SVG, it can be processed.
        // For simplicity, we are assuming we don't do raster-to-svg, as it's complex.
        // If the user wants to "convert" an SVG to SVG, we just return it.
        if (file.type === 'image/svg+xml') {
            convertedBuffer = fileBuffer;
            mimeType = 'image/svg+xml';
        } else {
            return { error: 'Raster to SVG conversion is not supported.' };
        }
        break;
      default:
         // Fallback for other formats sharp supports.
         convertedBuffer = await sharpInstance.toFormat(format as keyof sharp.FormatEnum).toBuffer();
         mimeType = `image/${format}`;
         break;
    }

    const dataUrl = bufferToDataURL(convertedBuffer, mimeType);
    return { dataUrl, originalName: file.name };

  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
        return { error: `Conversion failed: ${error.message}` };
    }
    return { error: 'An unknown error occurred during conversion.' };
  }
}
