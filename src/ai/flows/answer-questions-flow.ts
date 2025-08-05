
'use server';
/**
 * @fileOverview This flow orchestrates answering multiple questions from a document.
 * It first splits the user's query into individual questions using a tool,
 * then gets an answer for each question, and finally combines them into a single response.
 *
 * - answerQuestions - The main function to handle a query with potentially multiple questions.
 * - AnswerQuestionsInput - The input type for the answerQuestions function.
 * - AnswerQuestionsOutput - The return type for the answerQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {extractAnswer} from './extract-answer-from-chunks';

const AnswerQuestionsInputSchema = z.object({
  question: z.string().describe('The user query, which may contain one or more questions.'),
  documentChunks: z.array(z.string()).describe('The relevant document chunks.'),
});
export type AnswerQuestionsInput = z.infer<typeof AnswerQuestionsInputSchema>;

const AnswerQuestionsOutputSchema = z.object({
  answer: z
    .string()
    .describe('The combined, formatted answers to all identified questions.'),
});
export type AnswerQuestionsOutput = z.infer<typeof AnswerQuestionsOutputSchema>;

export async function answerQuestions(input: AnswerQuestionsInput): Promise<AnswerQuestionsOutput> {
  return answerQuestionsFlow(input);
}

// A tool to split a single query string into multiple distinct questions.
const splitQuestions = ai.defineTool(
  {
    name: 'splitQuestions',
    description: 'Splits a user query into a list of individual questions.',
    inputSchema: z.object({
      query: z.string(),
    }),
    outputSchema: z.object({
      questions: z.array(z.string()),
    }),
  },
  async ({query}) => {
    // A simple heuristic to split by newlines or question marks.
    // A more advanced implementation could use an LLM call for more robust splitting.
    const questions = query
        .split('\n')
        .map(q => q.trim())
        .filter(q => q.length > 0)
        .flatMap(q => q.split('?').map(sq => {
          const trimmed = sq.trim();
          if (!trimmed) return '';
          return trimmed.endsWith('?') ? trimmed : `${trimmed}?`;
        }))
        .filter(q => q.trim().length > 1 && q.trim() !== '?');
    
    return { questions: Array.from(new Set(questions)) }; // Return unique questions
  }
);


const answerQuestionsFlow = ai.defineFlow(
  {
    name: 'answerQuestionsFlow',
    inputSchema: AnswerQuestionsInputSchema,
    outputSchema: AnswerQuestionsOutputSchema,
  },
  async ({question, documentChunks}) => {
    const { questions } = await splitQuestions({query: question});

    if (questions.length === 0) {
        return { answer: "I couldn't identify a specific question in your query. Please try rephrasing." };
    }

    const answerPromises = questions.map(q =>
      extractAnswer({
        question: q,
        documentChunks,
      })
    );

    const results = await Promise.all(answerPromises);
    const combinedAnswer = results.map(r => r.answer).join('\n\n');

    return {answer: combinedAnswer};
  }
);
