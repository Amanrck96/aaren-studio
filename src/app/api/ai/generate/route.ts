import { NextResponse } from "next/server";
import { ai } from "@/lib/genkit";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, system } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    const response = await ai.generate({
      system: system || "You are an AI assistant for Aaren Studio, an architectural luxury surface and interior design material house.",
      prompt,
    });

    return NextResponse.json({
      success: true,
      text: response.text,
    });
  } catch (error: any) {
    console.error("Genkit AI generation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate AI response" },
      { status: 500 }
    );
  }
}
