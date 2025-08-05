
'use server';
/**
 * @fileOverview Extracts answers from provided document chunks using an LLM.
 *
 * - extractAnswer - A function to extract the answer from relevant document chunks.
 * - ExtractAnswerInput - The input type for the extractAnswer function.
 * - ExtractAnswerOutput - The return type for the extractAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractAnswerInputSchema = z.object({
  question: z.string().describe('The question to answer.'),
  documentChunks: z.array(z.string()).describe('The relevant document chunks.'),
});
export type ExtractAnswerInput = z.infer<typeof ExtractAnswerInputSchema>;

const ExtractAnswerOutputSchema = z.object({
  answer: z
    .string()
    .describe(
      'The extracted answer from the document chunks. If the answer is not found, respond that you cannot answer the question.'
    ),
});
export type ExtractAnswerOutput = z.infer<typeof ExtractAnswerOutputSchema>;

export async function extractAnswer(input: ExtractAnswerInput): Promise<ExtractAnswerOutput> {
  return extractAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractAnswerPrompt',
  input: {schema: ExtractAnswerInputSchema},
  output: {schema: ExtractAnswerOutputSchema},
  prompt: `You are an expert at analyzing policy and legal documents.

  Answer the user's question based on the content from the document chunks. Be precise and concise. If the answer is not found, respond that you cannot answer the question.

  If the user asks multiple questions in one query, address each question separately. It is critical that you insert a blank line between each distinct answer.

  User's Question:
  {{question}}

  Document Chunks:
  {{#each documentChunks}}
  ---
  {{{this}}}
  {{/each}}
  ---`,
});

const extractAnswerFlow = ai.defineFlow(
  {
    name: 'extractAnswerFlow',
    inputSchema: ExtractAnswerInputSchema,
    outputSchema: ExtractAnswerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
