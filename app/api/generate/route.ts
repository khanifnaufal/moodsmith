import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/lib/groq";
import { FONT_PAIRINGS } from "@/lib/fontPairings";
import { MoodResult } from "@/types";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { moodInput } = body;

    if (!moodInput || typeof moodInput !== "string" || !moodInput.trim()) {
      return NextResponse.json(
        { error: "Invalid request. 'moodInput' is required and must be a string." },
        { status: 400 }
      );
    }

    const fontListString = FONT_PAIRINGS.map(
      (fp) => `ID: "${fp.id}" | Mood Tags: [${fp.mood.join(", ")}]`
    ).join("\n");

    const systemPrompt = `You are a professional design assistant that helps generate design styles matching a user's mood.

Your tasks are:
1. Generate one color palette of exactly 5 colors (each as a valid 6-character hex code starting with '#') that fits the given mood input. Give this palette a catchy name.
2. Select exactly ONE font pairing ID from the allowed list of font pairings below. Choose the font pairing whose mood tags best match the user's mood input. You MUST choose an ID from this list. Do not make up any other ID.

Allowed Font Pairings:
${fontListString}

You must return your response as a JSON object matching this structure:
{
  "palette": {
    "name": "Catchy Name",
    "colors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"]
  },
  "fontId": "selected-font-pairing-id"
}
Do not include any extra text, comments, markdown blocks, or other keys. Only output the JSON object.`;

    let generatedData: any = null;
    let success = false;
    let lastError: any = null;

    // First attempt: llama-3.1-8b-instant
    try {
      const response = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Mood input: ${moodInput}` },
        ],
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const text = response.choices[0]?.message?.content || "";
      generatedData = JSON.parse(text);
      if (validateGeneratedData(generatedData)) {
        success = true;
      } else {
        lastError = new Error("Validation failed for llama-3.1-8b-instant output: " + text);
      }
    } catch (err: any) {
      lastError = err;
    }

    // Fallback attempt: llama-3.3-70b-versatile
    if (!success) {
      console.warn("First attempt failed, retrying with fallback model llama-3.3-70b-versatile...", lastError);
      try {
        const response = await groq.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Mood input: ${moodInput}` },
          ],
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" },
          temperature: 0.7,
        });

        const text = response.choices[0]?.message?.content || "";
        generatedData = JSON.parse(text);
        if (validateGeneratedData(generatedData)) {
          success = true;
        } else {
          lastError = new Error("Validation failed for fallback model llama-3.3-70b-versatile output: " + text);
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    if (!success) {
      console.error("All generation attempts failed:", lastError);
      return NextResponse.json(
        { error: `Generation failed: ${lastError?.message || "Unknown error"}` },
        { status: 500 }
      );
    }

    // Assemble MoodResult
    const matchedFont = FONT_PAIRINGS.find((fp) => fp.id === generatedData.fontId)!;
    const moodResult: MoodResult = {
      id: crypto.randomUUID(),
      palette: generatedData.palette,
      font: matchedFont,
      moodInput: moodInput,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(moodResult);
  } catch (error: any) {
    console.error("Unhandled error in generation route:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}

function validateGeneratedData(data: any): boolean {
  if (!data || typeof data !== "object") return false;

  const { palette, fontId } = data;
  if (!palette || typeof palette !== "object") return false;
  if (typeof palette.name !== "string" || !palette.name.trim()) return false;
  if (!Array.isArray(palette.colors) || palette.colors.length !== 5) return false;

  // Validate hex colors
  const hexPattern = /^#[0-9A-Fa-f]{6}$/;
  for (const color of palette.colors) {
    if (typeof color !== "string" || !hexPattern.test(color)) {
      return false;
    }
  }

  // Validate fontId
  if (typeof fontId !== "string") return false;
  const fontExists = FONT_PAIRINGS.some((fp) => fp.id === fontId);
  if (!fontExists) return false;

  return true;
}
