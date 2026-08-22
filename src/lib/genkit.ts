import "dotenv/config";
import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/googleai";

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY,
    }),
  ],
  model: "googleai/gemini-2.5-flash",
});

// Sample Flow that appears in the Genkit Developer UI
export const designConsultantFlow = ai.defineFlow(
  {
    name: "designConsultant",
    inputSchema: z.object({
      roomType: z.string().default("Living Room"),
      stylePreference: z.string().default("Italian Luxury Minimalist"),
    }),
    outputSchema: z.string(),
  },
  async ({ roomType, stylePreference }) => {
    const response = await ai.generate({
      system: "You are an expert luxury interior designer and architectural surfaces consultant for Aaren Studio.",
      prompt: `Recommend luxury Italian surfaces, textures, and color palettes for a ${roomType} designed in ${stylePreference} style.`,
    });
    return response.text;
  }
);

export default ai;
