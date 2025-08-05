
'use server';

import {z} from 'zod';
import {answerQuestions} from '@/ai/flows/answer-questions-flow';
import {generateImage} from '@/ai/flows/generate-image-flow';
import {verifyDocument} from '@/ai/flows/verify-document-flow';

const formSchema = z.object({
  documentUrl: z.string().min(1),
  question: z.string().min(1).max(500),
});

// Mock document chunks as we cannot process PDFs in this environment.
// These chunks simulate relevant text extracted from a policy document.
const mockDocumentChunks = [
  'Policy on Annual Leave: All full-time employees are entitled to 25 days of paid annual leave per year, in addition to public holidays. Leave requests must be submitted through the HR portal at least two weeks in advance. Unused leave can be carried over to the next year, up to a maximum of 5 days.',
  'Remote Work Policy: The company supports a hybrid work model. Employees can work remotely for up to two days per week. A formal request must be approved by their line manager. The company provides a one-time stipend of $500 for home office setup. All remote employees must be available online during core business hours (10 AM to 4 PM, local time).',
  'Expense Reimbursement: Employees can claim reimbursement for business-related expenses, including travel, accommodation, and meals. All claims must be submitted with original receipts within 30 days of the expense being incurred. The maximum claim for a single meal is $75.',
  'Code of Conduct: All employees are expected to maintain the highest standards of professionalism and integrity. Harassment or discrimination of any kind will not be tolerated and may lead to disciplinary action, including termination of employment.',
  'A grace period of thirty days is provided for premium payment after the due date to renew or continue the policy without losing continuity benefits.',
  'There is a waiting period of thirty-six (36) months of continuous coverage from the first policy inception for pre-existing diseases and their direct complications to be covered.',
  'Yes, the policy covers maternity expenses, including childbirth and lawful medical termination of pregnancy. To be eligible, the female insured person must have been continuously covered for at least 24 months. The benefit is limited to two deliveries or terminations during the policy period.',
  'The policy has a specific waiting period of two (2) years for cataract surgery.',
  "Yes, the policy indemnifies the medical expenses for the organ donor's hospitalization for the purpose of harvesting the organ, provided the organ is for an insured person and the donation complies with the Transplantation of Human Organs Act, 1994.",
  'A No Claim Discount of 5% on the base premium is offered on renewal for a one-year policy term if no claims were made in the preceding year. The maximum aggregate NCD is capped at 5% of the total base premium.',
  'Yes, the policy reimburses expenses for health check-ups at the end of every block of two continuous policy years, provided the policy has been renewed without a break. The amount is subject to the limits specified in the Table of Benefits.',
  "A hospital is defined as an institution with at least 10 inpatient beds (in towns with a population below ten lakhs) or 15 beds (in all other places), with qualified nursing staff and medical practitioners available 24/7, a fully equipped operation theatre, and which maintains daily records of patients.",
  'The policy covers medical expenses for inpatient treatment under Ayurveda, Yoga, Naturopathy, Unani, Siddha, and Homeopathy systems up to the Sum Insured limit, provided the treatment is taken in an AYUSH Hospital.',
  'Yes, for Plan A, the daily room rent is capped at 1% of the Sum Insured, and ICU charges are capped at 2% of the Sum Insured. These limits do not apply if the treatment is for a listed procedure in a Preferred Provider Network (PPN).',
];

export async function getAnswerAction(values: z.infer<typeof formSchema>) {
  try {
    const validatedValues = formSchema.safeParse(values);
    if (!validatedValues.success) {
      return {success: false, error: 'Invalid input.'};
    }

    // In a real application, this is where we would fetch the PDF, parse it,
    // and find relevant chunks. For this demo, we use mock chunks.
    const {question} = validatedValues.data;

    // The documentUrl is not used to fetch, but we can use it to select
    // a subset of mock chunks for more realistic behavior.
    // Here we just use all chunks for simplicity.
    const result = await answerQuestions({
      question,
      documentChunks: mockDocumentChunks,
    });

    return {success: true, data: result};
  } catch (e) {
    console.error(e);
    const errorMessage =
      e instanceof Error ? e.message : 'An unexpected error occurred.';
    return {
      success: false,
      error: `An unexpected error occurred: ${errorMessage}. Please try again.`,
    };
  }
}

export async function generateImageAction(prompt: string) {
    try {
        const result = await generateImage({ prompt });
        return { success: true, data: result };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
        return {
            success: false,
            error: `An unexpected error occurred: ${errorMessage}. Please try again.`,
        };
    }
}

const verifySchema = z.object({
  documentId: z.string(),
  criteria: z.string().min(10),
});

export async function verifyDocumentAction(values: z.infer<typeof verifySchema>) {
    try {
        const validatedValues = verifySchema.safeParse(values);
        if (!validatedValues.success) {
            return { success: false, error: 'Invalid input.' };
        }

        const { criteria } = validatedValues.data;
        
        // For this demo, we use a single mock chunk for verification.
        const documentChunk = mockDocumentChunks[0]; 

        const result = await verifyDocument({
            documentChunk,
            criteria,
        });

        return { success: true, data: result };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
        return {
            success: false,
            error: `An unexpected error occurred: ${errorMessage}. Please try again.`,
        };
    }
}
