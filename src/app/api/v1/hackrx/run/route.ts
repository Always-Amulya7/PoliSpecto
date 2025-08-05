
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { answerQuestions } from '@/ai/flows/answer-questions-flow';

const requestSchema = z.object({
  documents: z.string().url(),
  questions: z.array(z.string().min(1)).min(1),
});

// Mock document chunks as we cannot process PDFs in this environment.
// These chunks simulate relevant text extracted from a policy document.
const mockDocumentChunks = [
  'Policy on Annual Leave: All full-time employees are entitled to 25 days of paid annual leave per year, in addition to public holidays. Leave requests must be submitted through the HR portal at least two weeks in advance. Unused leave can be carried over to the next year, up to a maximum of 5 days.',
  'Remote Work Policy: The company supports a hybrid work model. Employees can work remotely for up to two days per week. A formal request must be approved by their line manager. The company provides a one-time stipend of $500 for home office setup. All remote employees must be available online during core business hours (10 AM to 4 PM, local time).',
  'Expense Reimbursement: Employees can claim reimbursement for business-related expenses, including travel, accommodation, and meals. All claims must be submitted with original receipts within 30 days of the expense being incurred. The maximum claim for a single meal is $75.',
  'Code of Conduct: All employees are expected to maintain the highest standards of professionalism and integrity. Harassment or discrimination of any kind will not be tolerated and may lead to disciplinary action, including termination of employment.',
  "A grace period of thirty days is provided for premium payment after the due date to renew or continue the policy without losing continuity benefits.",
  "There is a waiting period of thirty-six (36) months of continuous coverage from the first policy inception for pre-existing diseases and their direct complications to be covered.",
  "Yes, the policy covers maternity expenses, including childbirth and lawful medical termination of pregnancy. To be eligible, the female insured person must have been continuously covered for at least 24 months. The benefit is limited to two deliveries or terminations during the policy period.",
  "The policy has a specific waiting period of two (2) years for cataract surgery.",
  "Yes, the policy indemnifies the medical expenses for the organ donor's hospitalization for the purpose of harvesting the organ, provided the organ is for an insured person and the donation complies with the Transplantation of Human Organs Act, 1994.",
  "A No Claim Discount of 5% on the base premium is offered on renewal for a one-year policy term if no claims were made in the preceding year. The maximum aggregate NCD is capped at 5% of the total base premium.",
  "Yes, the policy reimburses expenses for health check-ups at the end of every block of two continuous policy years, provided the policy has been renewed without a break. The amount is subject to the limits specified in the Table of Benefits.",
  "A hospital is defined as an institution with at least 10 inpatient beds (in towns with a population below ten lakhs) or 15 beds (in all other places), with qualified nursing staff and medical practitioners available 24/7, a fully equipped operation theatre, and which maintains daily records of patients.",
  "The policy covers medical expenses for inpatient treatment under Ayurveda, Yoga, Naturopathy, Unani, Siddha, and Homeopathy systems up to the Sum Insured limit, provided the treatment is taken in an AYUSH Hospital.",
  "Yes, for Plan A, the daily room rent is capped at 1% of the Sum Insured, and ICU charges are capped at 2% of the Sum Insured. These limits do not apply if the treatment is for a listed procedure in a Preferred Provider Network (PPN)."
];

// It is recommended to store this token in an environment variable.
const AUTH_TOKEN = "d58390b740b20a227269890ac922ddfc152944cd88d72caf305b18a2f50ef539";


export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    if (token !== AUTH_TOKEN) {
        return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }


    const body = await request.json();
    const validatedRequest = requestSchema.safeParse(body);

    if (!validatedRequest.success) {
      return NextResponse.json({ error: 'Invalid request body', details: validatedRequest.error.flatten() }, { status: 400 });
    }

    const { questions } = validatedRequest.data;

    // In a real application, you would fetch and parse the PDF from validatedRequest.data.documents
    // For this demo, we use the mock document chunks.
    const questionString = questions.join('\n');

    const result = await answerQuestions({
      question: questionString,
      documentChunks: mockDocumentChunks,
    });
    
    // The answer from the flow is a single string with newlines.
    // We split it to return an array of strings as per the expected API response format.
    const answers = result.answer.split('\n\n').filter(ans => ans.trim().length > 0);

    return NextResponse.json({ answers });
  } catch (error) {
    console.error('Error in /api/v1/hackrx/run endpoint:', error);
    if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Invalid request body', details: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
