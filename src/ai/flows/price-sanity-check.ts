'use server';

/**
 * @fileOverview Checks the sanity of product prices entered by the user, highlighting potentially anomalous values and suggesting current prices.
 *
 * - priceSanityCheck - A function that performs the price sanity check.
 * - PriceSanityCheckInput - The input type for the priceSanityCheck function.
 * - PriceSanityCheckOutput - The return type for the priceSanityCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  unit: z.string().describe('The unit of the product (e.g., CNY/jin, CNY/liter).'),
  currentPrice: z.number().describe('The current price of the product.'),
});

const PriceSanityCheckInputSchema = z.object({
  products: z.array(ProductSchema).describe('An array of products with their prices entered by the user.'),
});
export type PriceSanityCheckInput = z.infer<typeof PriceSanityCheckInputSchema>;

const PriceSanityCheckOutputSchema = z.object({
  anomalousPrices: z.array(
    z.object({
      productName: z.string().describe('The name of the product with a potentially anomalous price.'),
      suggestedPrice: z.number().describe('A suggested price for the product based on current market rates.'),
      reason: z.string().describe('Reasoning why the price is considered anomalous.')
    })
  ).describe('An array of products with potentially anomalous prices, along with suggested prices.'),
});
export type PriceSanityCheckOutput = z.infer<typeof PriceSanityCheckOutputSchema>;

export async function priceSanityCheck(input: PriceSanityCheckInput): Promise<PriceSanityCheckOutput> {
  return priceSanityCheckFlow(input);
}

const getMarketPrice = ai.defineTool({
  name: 'getMarketPrice',
  description: 'Returns the current market price of a product.',
  inputSchema: z.object({
    productName: z.string().describe('The name of the product.'),
    unit: z.string().describe('The unit of the product (e.g., CNY/jin).'),
  }),
  outputSchema: z.number().describe('The current market price of the product.'),
  async (input) => {
    // Dummy implementation - replace with actual price retrieval logic
    // This could involve calling an external API or querying a database
    return Math.random() * 10; // Replace with actual logic
  },
});

const priceSanityCheckPrompt = ai.definePrompt({
  name: 'priceSanityCheckPrompt',
  input: {schema: PriceSanityCheckInputSchema},
  output: {schema: PriceSanityCheckOutputSchema},
  tools: [getMarketPrice],
  prompt: `You are an expert in identifying potentially incorrect product prices.  Given a list of products and their prices, determine if any of the prices are anomalous compared to typical market prices.

  For each product, use the getMarketPrice tool to get the current market price.  If a price deviates significantly from the market price (e.g., more than 50%), consider it anomalous. Provide reasoning for why the price is considered anomalous and suggest a more reasonable price based on the market data.

  Products:
  {{#each products}}
  - Product: {{productName}}, Unit: {{unit}}, Price: {{currentPrice}}
  {{/each}}`,
});

const priceSanityCheckFlow = ai.defineFlow(
  {
    name: 'priceSanityCheckFlow',
    inputSchema: PriceSanityCheckInputSchema,
    outputSchema: PriceSanityCheckOutputSchema,
  },
  async input => {
    const {output} = await priceSanityCheckPrompt(input);
    return output!;
  }
);
