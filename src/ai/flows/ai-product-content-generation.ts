'use server';
/**
 * @fileOverview An AI agent for generating comprehensive product content.
 *
 * - generateProductContent - A function that handles the generation of product descriptions and SEO metadata.
 * - AIProductContentGenerationInput - The input type for the generateProductContent function.
 * - AIProductContentGenerationOutput - The return type for the generateProductContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIProductContentGenerationInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  category: z.string().describe('The category the product belongs to.'),
  keyFeatures: z.array(z.string()).describe('A list of key features or selling points of the product.').min(1),
  targetAudience: z.string().optional().describe('The intended target audience for the product.'),
  tone: z.string().optional().describe('The desired tone for the content (e.g., professional, exciting, friendly).'),
});
export type AIProductContentGenerationInput = z.infer<typeof AIProductContentGenerationInputSchema>;

const AIProductContentGenerationOutputSchema = z.object({
  description: z.string().describe('A comprehensive product description, formatted with paragraphs and bullet points if appropriate.'),
  shortDescription: z.string().describe('A concise and engaging short description for the product, suitable for listings or social media.'),
  seoTitle: z.string().describe('An SEO-friendly title for the product page (max 60 characters).'),
  seoDescription: z.string().describe('An SEO-friendly meta description for the product page (max 160 characters).'),
  seoKeywords: z.array(z.string()).describe('A list of relevant keywords for SEO, separated by commas.'),
});
export type AIProductContentGenerationOutput = z.infer<typeof AIProductContentGenerationOutputSchema>;

export async function generateProductContent(input: AIProductContentGenerationInput): Promise<AIProductContentGenerationOutput> {
  return aiProductContentGenerationFlow(input);
}

const aiProductContentGenerationPrompt = ai.definePrompt({
  name: 'aiProductContentGenerationPrompt',
  input: { schema: AIProductContentGenerationInputSchema },
  output: { schema: AIProductContentGenerationOutputSchema },
  prompt: `You are an expert copywriter and SEO specialist for an e-commerce platform. Your task is to generate compelling product content based on the provided details.

Product Name: {{{productName}}}
Category: {{{category}}}
Key Features:
{{#each keyFeatures}}- {{{this}}}
{{/each}}
{{#if targetAudience}}Target Audience: {{{targetAudience}}}{{/if}}
{{#if tone}}Tone: {{{tone}}}{{else}}Tone: professional and engaging{{/if}}

Based on the information above, please generate the following:

1.  A comprehensive product description:
    - Be detailed and highlight the benefits of each key feature.
    - Use clear, easy-to-understand language.
    - Structure with paragraphs and bullet points for readability.

2.  A concise and engaging short description:
    - Approximately 1-2 sentences.
    - Ideal for product listings or social media snippets.

3.  SEO Metadata:
    - **SEO Title**: A compelling title (max 60 characters) including the product name and relevant keywords.
    - **SEO Description**: A descriptive meta description (max 160 characters) summarizing the product's value proposition.
    - **SEO Keywords**: A comma-separated list of 5-10 relevant keywords and phrases.

Format your response as a JSON object matching the provided schema, without any additional text outside the JSON.
`,
});

const aiProductContentGenerationFlow = ai.defineFlow(
  {
    name: 'aiProductContentGenerationFlow',
    inputSchema: AIProductContentGenerationInputSchema,
    outputSchema: AIProductContentGenerationOutputSchema,
  },
  async (input) => {
    const { output } = await aiProductContentGenerationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate product content: No output received.');
    }
    return output;
  }
);
