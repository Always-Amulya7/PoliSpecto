import { config } from 'dotenv';
config();

import '@/ai/flows/extract-answer-from-chunks.ts';
import '@/ai/flows/generate-image-flow.ts';
import '@/ai/flows/verify-document-flow.ts';
import '@/ai/flows/answer-questions-flow.ts';
