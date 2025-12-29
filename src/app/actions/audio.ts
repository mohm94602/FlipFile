'use server';

import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static-electron';
import { Writable, Readable } from 'stream';
import { unlink, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

// Set the path for ffmpeg
if (ffmpegStatic.path) {
  ffmpeg.setFfmpegPath(ffmpegStatic.path);
} else {
    console.warn("ffmpeg-static path not found. Conversion might fail.");
}

function bufferToDataURL(buffer: Buffer, mimeType: string): string {
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
}

export async function convertAudio(
    formData: FormData
  ): Promise<{ dataUrl: string; originalName: string; } | { error: string }> {
    const file = formData.get('file') as File;
    const targetFormat = formData.get('format') as string || 'mp3';
    const bitrate = formData.get('bitrate') as string;

    if (!file) {
        return { error: 'No file provided.' };
    }

    const inputPath = join(tmpdir(), `input_${Date.now()}_${file.name}`);
    const outputPath = join(tmpdir(), `output_${Date.now()}.${targetFormat}`);

    try {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, fileBuffer);

        const outputStream = new Writable({
            write(chunk, encoding, callback) {
                this.read().push(chunk);
                callback();
            }
        });
        
        const outputBufferPromise = new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = [];
            outputStream.on('data', (chunk) => chunks.push(chunk));
            outputStream.on('finish', () => resolve(Buffer.concat(chunks)));
            outputStream.on('error', reject);
        });

        await new Promise<Buffer>((resolve, reject) => {
            let command = ffmpeg(inputPath)
              .toFormat(targetFormat);
            
            if (bitrate) {
                command = command.audioBitrate(bitrate);
            }
            
            command
                .on('error', (err) => {
                    console.error('FFmpeg error:', err.message);
                    reject(new Error(`Conversion failed: ${err.message}`));
                })
                .on('end', () => {
                    console.log('FFmpeg processing finished');
                })
                .pipe(outputStream as any, { end: true });
            
            const chunks: any[] = [];
            const bufferStream = new Readable({
                read() {}
            });

            command.on('data', (chunk) => {
                bufferStream.push(chunk);
            });
            command.on('end', () => {
                bufferStream.push(null);
                streamToBuffer(bufferStream).then(resolve).catch(reject);
            });
        });

        const finalBuffer = await streamToBuffer(outputStream as any);

        const mimeType = `audio/${targetFormat}`;
        const dataUrl = bufferToDataURL(finalBuffer, mimeType);

        return { dataUrl, originalName: file.name };

    } catch (error) {
        console.error('Conversion process error:', error);
        return { error: `Conversion failed: ${error instanceof Error ? error.message : "Unknown error"}` };
    } finally {
        // Cleanup temporary files
        try {
            await unlink(inputPath);
        } catch (e) {
            console.error('Failed to delete temp input file:', e);
        }
        try {
            await unlink(outputPath);
        } catch (e) {
            // Output file might not have been created if there was an error
        }
    }
}
