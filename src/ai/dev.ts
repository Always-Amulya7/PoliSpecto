import { config } from 'dotenv';
config();

import '@/ai/flows/extract-answer-from-chunks';
import '@/ai/flows/generate-image-flow';
import '@/ai/flows/verify-document-flow';
import '@/ai/flows/answer-questions-flow';
import '@/ai/flows/api-answer-questions-flow';