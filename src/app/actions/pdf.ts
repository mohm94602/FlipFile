'use server';

import { PDFDocument, rgb } from 'pdf-lib';
import sharp from 'sharp';

async function bufferToDataURL(buffer: Buffer, mimeType: string): Promise<string> {
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

// PDF to Word (mocked, as this is very complex)
export async function convertPdfToWord(
    formData: FormData
): Promise<{ dataUrl: string; fileName: string } | { error: string }> {
    const file = formData.get('file') as File;
    if (!file) return { error: 'No file provided.' };

    // This is a placeholder. Real PDF-to-Word conversion is a very complex server-side task.
    const textContent = `This is a mock conversion of ${file.name}. Full PDF-to-Word functionality requires a dedicated library or service.`;
    const buffer = Buffer.from(textContent);
    const dataUrl = await bufferToDataURL(buffer, 'text/plain');
    const fileName = `${file.name.replace(/\.[^/.]+$/, "")}.txt`;

    return { dataUrl, fileName };
}

// PDF to JPG
export async function convertPdfToJpg(
    formData: FormData
): Promise<{ dataUrl: string; fileName: string } | { error: string }> {
    const file = formData.get('file') as File;
    if (!file) return { error: 'No file provided.' };

    try {
        const pdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        
        // For simplicity, we convert only the first page.
        // A full implementation could return a ZIP of all pages.
        const firstPage = pdfDoc.getPages()[0];
        if (!firstPage) return { error: 'PDF has no pages.' };

        // Render page to a PNG buffer first (pdf-lib doesn't render to JPG directly)
        // This part is complex and not directly supported by pdf-lib alone.
        // We'll simulate it by creating an image representation.
        // A true implementation would need a library like pdf.js on node or a service.
        
        // Mocking rendering by creating an image with page dimensions
        const { width, height } = firstPage.getSize();
        const svgImage = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="white"/>
                <text x="50" y="100" font-family="sans-serif" font-size="50" fill="black">
                    Page 1 of ${file.name}
                </text>
                <text x="50" y="160" font-family="sans-serif" font-size="30" fill="gray">
                    (JPG conversion preview)
                </text>
            </svg>
        `;
        
        const jpgBuffer = await sharp(Buffer.from(svgImage)).jpeg().toBuffer();

        const dataUrl = await bufferToDataURL(jpgBuffer, 'image/jpeg');
        const fileName = `${file.name.replace(/\.[^/.]+$/, "")}_page1.jpg`;
        
        return { dataUrl, fileName };

    } catch (error) {
        console.error(error);
        return { error: 'Failed to convert PDF to JPG.' };
    }
}


// Merge PDFs
export async function mergePdf(
    formData: FormData
): Promise<{ dataUrl: string; fileName: string } | { error: string }> {
    const files = formData.getAll('file') as File[];
    if (files.length < 2) return { error: 'Please provide at least two PDF files to merge.' };

    try {
        const mergedPdf = await PDFDocument.create();
        for (const file of files) {
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedPdfBytes = await mergedPdf.save();
        const buffer = Buffer.from(mergedPdfBytes);
        const dataUrl = await bufferToDataURL(buffer, 'application/pdf');

        return { dataUrl, fileName: 'merged.pdf' };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to merge PDFs.' };
    }
}


// Split PDF (mocked - returns first page)
export async function splitPdf(
    formData: FormData
): Promise<{ dataUrl: string; fileName: string } | { error: string }> {
    const file = formData.get('file') as File;
    // const pagesToSplit = formData.get('pages') as string; // e.g., "1-3,5"
    if (!file) return { error: 'No file provided.' };
    
    // For simplicity, we'll just extract the first page.
    try {
        const existingPdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        const newPdf = await PDFDocument.create();
        const [firstPage] = await newPdf.copyPages(pdfDoc, [0]);
        newPdf.addPage(firstPage);
        
        const pdfBytes = await newPdf.save();
        const buffer = Buffer.from(pdfBytes);
        const dataUrl = await bufferToDataURL(buffer, 'application/pdf');
        const fileName = `${file.name.replace(/\.[^/.]+$/, "")}_split.pdf`;

        return { dataUrl, fileName };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to split PDF.' };
    }
}
