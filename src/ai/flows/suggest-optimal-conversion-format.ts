'use server';

/**
 * @fileOverview This file contains a Genkit flow that suggests the most efficient output file format
 * based on the desired conversion type.
 *
 * - suggestOptimalConversionFormat - A function that suggests the optimal conversion format.
 * - SuggestOptimalConversionFormatInput - The input type for the suggestOptimalConversionFormat function.
 * - SuggestOptimalConversionFormatOutput - The return type for the suggestOptimalConversionFormat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalConversionFormatInputSchema = z.object({
  targetFileType: z
    .string()
    .describe('The file type the user wants to convert to (e.g., image, video, audio, document).'),
  desiredQuality: z
    .string()
    .describe(
      'The desired quality of the converted file (e.g., best, good, reasonable, smallest filesize).'
    ),
});
export type SuggestOptimalConversionFormatInput = z.infer<
  typeof SuggestOptimalConversionFormatInputSchema
>;

const SuggestOptimalConversionFormatOutputSchema = z.object({
  suggestedFormat: z
    .string()
    .describe(
      'The suggested file format for the conversion, balancing quality and file size.'
    ),
  reason: z
    .string()
    .describe(
      'The reason for suggesting the format, explaining the trade-offs between quality and file size.'
    ),
});
export type SuggestOptimalConversionFormatOutput = z.infer<
  typeof SuggestOptimalConversionFormatOutputSchema
>;

export async function suggestOptimalConversionFormat(
  input: SuggestOptimalConversionFormatInput
): Promise<SuggestOptimalConversionFormatOutput> {
  return suggestOptimalConversionFormatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalConversionFormatPrompt',
  input: {schema: SuggestOptimalConversionFormatInputSchema},
  output: {schema: SuggestOptimalConversionFormatOutputSchema},
  prompt: `You are an expert in file conversion formats. Based on the user's desired target file type and desired quality, suggest the most efficient output format, considering the balance between quality and file size. Provide a clear reason for your suggestion.

Target File Type: {{{targetFileType}}}
Desired Quality: {{{desiredQuality}}}

Suggestion:`,
});

const suggestOptimalConversionFormatFlow = ai.defineFlow(
  {
    name: 'suggestOptimalConversionFormatFlow',
    inputSchema: SuggestOptimalConversionFormatInputSchema,
    outputSchema: SuggestOptimalConversionFormatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
