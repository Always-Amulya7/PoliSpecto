'use server';
/**
 * @fileOverview Verifies a document chunk against a set of criteria.
 *
 * - verifyDocument - A function to verify document content.
 * - VerifyDocumentInput - The input type for the verifyDocument function.
 * - VerifyDocumentOutput - The return type for the verifyDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyDocumentInputSchema = z.object({
  documentChunk: z.string().describe('The content of the document to verify.'),
  criteria: z.string().describe('The criteria to verify the document against.'),
});
export type VerifyDocumentInput = z.infer<typeof VerifyDocumentInputSchema>;

const VerifyDocumentOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the document is valid based on the criteria.'),
  reason: z.string().describe('A brief explanation of why the document is valid or not.'),
});
export type VerifyDocumentOutput = z.infer<typeof VerifyDocumentOutputSchema>;

export async function verifyDocument(input: VerifyDocumentInput): Promise<VerifyDocumentOutput> {
  return verifyDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyDocumentPrompt',
  input: {schema: VerifyDocumentInputSchema},
  output: {schema: VerifyDocumentOutputSchema},
  prompt: `You are an expert document compliance checker.

  Given the following document content:
  ---
  {{{documentChunk}}}
  ---

  And the following verification criteria:
  "{{{criteria}}}"

  Determine if the document content meets the criteria.
  - If it meets the criteria, set isValid to true.
  - If it does not meet the criteria, set isValid to false.
  - Provide a concise reason for your decision.`,
});

const verifyDocumentFlow = ai.defineFlow(
  {
    name: 'verifyDocumentFlow',
    inputSchema: VerifyDocumentInputSchema,
    outputSchema: VerifyDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
