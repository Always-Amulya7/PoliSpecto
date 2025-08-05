
'use server';
/**
 * @fileOverview This flow orchestrates answering multiple questions from a document.
 * It can accept a single question string or an array of question strings.
 * It gets an answer for each question and returns a structured response.
 *
 * - answerQuestions - The main function to handle a query with one or more questions.
 * - AnswerQuestionsInput - The input type for the answerQuestions function.
 * - AnswerQuestionsOutput - The return type for the answerQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {extractAnswer} from './extract-answer-from-chunks';

const AnswerQuestionsInputSchema = z.object({
  question: z.union([z.string(), z.array(z.string())]).describe('The user query, which can be a single question or an array of questions.'),
  documentChunks: z.array(z.string()).describe('The relevant document chunks.'),
});
export type AnswerQuestionsInput = z.infer<typeof AnswerQuestionsInputSchema>;

const AnswerQuestionsOutputSchema = z.object({
  answers: z
    .array(z.string())
    .describe('An array of answers corresponding to the questions asked.'),
});
export type AnswerQuestionsOutput = z.infer<typeof AnswerQuestionsOutputSchema>;

export async function answerQuestions(input: AnswerQuestionsInput): Promise<AnswerQuestionsOutput> {
  return answerQuestionsFlow(input);
}

const answerQuestionsFlow = ai.defineFlow(
  {
    name: 'answerQuestionsFlow',
    inputSchema: AnswerQuestionsInputSchema,
    outputSchema: AnswerQuestionsOutputSchema,
  },
  async ({question, documentChunks}) => {
    let questions: string[] = [];

    if (Array.isArray(question)) {
      questions = question;
    } else {
       questions = question
        .split(/[\n?]/)
        .map(q => q.trim())
        .filter(q => q.length > 1);
    }
    
    if (questions.length === 0) {
        return { answers: ["I couldn't identify a specific question in your query. Please try rephrasing."] };
    }

    const answerPromises = questions.map(q =>
      extractAnswer({
        question: q,
        documentChunks,
      })
    );

    const results = await Promise.all(answerPromises);
    const answers = results.map(r => r.answer);

    return {answers: answers};
  }
);
