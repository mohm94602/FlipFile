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

async function bufferToDataURL(buffer: Buffer, mimeType: string): Promise<string> {
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

export async function convertVideo(
  formData: FormData
): Promise<{ dataUrl: string; originalName: string; } | { error: string }> {
    const file = formData.get('file') as File;
    const targetFormat = formData.get('format') as string || 'mp4';
    const quality = formData.get('crf') as string; // For compression
    const extractAudio = formData.get('extract') === 'true';

    if (!file) {
        return { error: 'No file provided.' };
    }

    const finalFormat = extractAudio ? 'mp3' : targetFormat;
    const inputPath = join(tmpdir(), `input_${Date.now()}_${file.name}`);
    
    try {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, fileBuffer);

        const buffer = await new Promise<Buffer>((resolve, reject) => {
            let command = ffmpeg(inputPath);

            if (extractAudio) {
                command.noVideo().audioCodec('libmp3lame');
            } else {
                command.toFormat(finalFormat);
                if (quality) {
                    command.outputOptions(`-crf ${quality}`);
                }
            }

            const writableStream = new Writable({
                write(chunk, encoding, callback) {
                    // This is a bit of a hack to gather chunks from the stream
                    if (!this.data) this.data = [];
                    this.data.push(chunk);
                    callback();
                },
                final(callback) {
                    resolve(Buffer.concat(this.data || []));
                    callback();
                }
            });

            command
                .on('error', (err) => {
                    console.error('FFmpeg error:', err.message);
                    reject(new Error(`Conversion failed: ${err.message}`));
                })
                .on('end', () => {
                    console.log('FFmpeg processing finished.');
                })
                .pipe(writableStream, { end: true });
        });

        const mimeType = extractAudio ? 'audio/mpeg' : `video/${finalFormat}`;
        const dataUrl = await bufferToDataURL(buffer, mimeType);

        return { dataUrl, originalName: `${file.name.substring(0, file.name.lastIndexOf('.'))}.${finalFormat}` };

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
    }
}
