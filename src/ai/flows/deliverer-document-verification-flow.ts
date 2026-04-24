'use server';
/**
 * @fileOverview This flow handles the automatic extraction of key information from uploaded deliverer documents
 * and provides an initial assessment of the selfie against the ID photo for global admins.
 *
 * - delivererDocumentVerification - A function that initiates the document verification process.
 * - DelivererDocumentVerificationInput - The input type for the delivererDocumentVerification function.
 * - DelivererDocumentVerificationOutput - The return type for the delivererDocumentVerification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DelivererDocumentVerificationInputSchema = z.object({
  documentPhotoDataUri: z
    .string()
    .describe(
      "A photo of the deliverer's identification document (e.g., RG, CNH), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  selfiePhotoDataUri: z
    .string()
    .describe(
      "A selfie photo of the deliverer, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DelivererDocumentVerificationInput = z.infer<typeof DelivererDocumentVerificationInputSchema>;

const DelivererDocumentVerificationOutputSchema = z.object({
  extractedInfo: z.object({
    name: z.string().describe("The full name extracted from the identification document."),
    cpf: z.string().describe("The CPF (Cadastro de Pessoas Físicas) extracted from the identification document. Format: XXX.XXX.XXX-XX."),
    documentType: z.string().describe("The type of the identification document (e.g., 'RG', 'CNH')."),
  }).describe("Key information extracted from the deliverer's identification document."),
  selfieMatchAssessment: z.string().describe("An assessment of the similarity between the provided selfie and the photo on the identification document. This should be a descriptive text."),
});
export type DelivererDocumentVerificationOutput = z.infer<typeof DelivererDocumentVerificationOutputSchema>;

export async function delivererDocumentVerification(input: DelivererDocumentVerificationInput): Promise<DelivererDocumentVerificationOutput> {
  return delivererDocumentVerificationFlow(input);
}

const delivererDocumentVerificationPrompt = ai.definePrompt({
  name: 'delivererDocumentVerificationPrompt',
  input: { schema: DelivererDocumentVerificationInputSchema },
  output: { schema: DelivererDocumentVerificationOutputSchema },
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an AI assistant tasked with verifying deliverer documents. Your goal is to extract key information from an identification document and assess the similarity between a selfie and the document photo.

Here are the images:
Identification Document: {{media url=documentPhotoDataUri}}
Selfie: {{media url=selfiePhotoDataUri}}

Based on these images, perform the following tasks:
1.  **Extract Information from the Identification Document**: Identify the document type (e.g., RG, CNH), the full name, and the CPF. Ensure the CPF is in the format XXX.XXX.XXX-XX.
2.  **Assess Selfie Match**: Compare the face in the selfie with the face in the identification document. Provide a descriptive assessment of their similarity.

Present your findings strictly in the following JSON format, adhering to the schema descriptions:
{
  "extractedInfo": {
    "name": "",
    "cpf": "",
    "documentType": ""
  },
  "selfieMatchAssessment": ""
}`,
});

const delivererDocumentVerificationFlow = ai.defineFlow(
  {
    name: 'delivererDocumentVerificationFlow',
    inputSchema: DelivererDocumentVerificationInputSchema,
    outputSchema: DelivererDocumentVerificationOutputSchema,
  },
  async (input) => {
    const { output } = await delivererDocumentVerificationPrompt(input);
    if (!output) {
      throw new Error('Failed to extract information or assess selfie match.');
    }
    return output;
  }
);
