// src/ai/flows/suggest-optimal-conversion-format.ts
'use server';

export type SuggestOptimalConversionFormatInput = {
  targetFileType: string;
  desiredQuality: string;
};

export type SuggestOptimalConversionFormatOutput = {
  suggestedFormat: string;
  reason: string;
};

export async function suggestOptimalConversionFormat(
  input: SuggestOptimalConversionFormatInput
): Promise<SuggestOptimalConversionFormatOutput> {
  return {
    suggestedFormat: input.targetFileType,
    reason: 'AI functionality removed, returning default value.',
  };
}
