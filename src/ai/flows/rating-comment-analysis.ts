'use server';
/**
 * @fileOverview Analyzes customer rating comments to identify common feedback themes and overall sentiment.
 *
 * - analyzeRatingComments - A function that analyzes a list of customer comments.
 * - AnalyzeRatingCommentsInput - The input type for the analyzeRatingComments function.
 * - AnalyzeRatingCommentsOutput - The return type for the analyzeRatingComments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeRatingCommentsInputSchema = z.object({
  comments: z
    .array(z.string())
    .describe('An array of free-text customer rating comments.'),
});
export type AnalyzeRatingCommentsInput = z.infer<
  typeof AnalyzeRatingCommentsInputSchema
>;

const AnalyzeRatingCommentsOutputSchema = z.object({
  overallSentiment: z
    .string()
    .describe('The overall sentiment expressed in the comments (e.g., positive, negative, mixed).'),
  feedbackThemes: z
    .array(z.string())
    .describe('A list of common feedback themes identified in the comments.'),
  summary: z
    .string()
    .describe('A concise summary of all feedback themes and overall sentiment.'),
});
export type AnalyzeRatingCommentsOutput = z.infer<
  typeof AnalyzeRatingCommentsOutputSchema
>;

export async function analyzeRatingComments(
  input: AnalyzeRatingCommentsInput
): Promise<AnalyzeRatingCommentsOutput> {
  return analyzeRatingCommentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeRatingCommentsPrompt',
  input: {schema: AnalyzeRatingCommentsInputSchema},
  output: {schema: AnalyzeRatingCommentsOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing customer feedback. Your task is to review a list of customer comments, identify common themes, determine the overall sentiment, and provide a concise summary.

Customer Comments:
{{#each comments}}
- {{{this}}}
{{/each}}

Focus on extracting actionable insights for performance improvement.`,
});

const analyzeRatingCommentsFlow = ai.defineFlow(
  {
    name: 'analyzeRatingCommentsFlow',
    inputSchema: AnalyzeRatingCommentsInputSchema,
    outputSchema: AnalyzeRatingCommentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
