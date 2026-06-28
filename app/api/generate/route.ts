import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/lib/groq";
import { FONT_PAIRINGS } from "@/lib/fontPairings";
import { MoodResult } from "@/types";
import { ratelimit } from "@/lib/ratelimit";
import { redis } from "@/lib/redis";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    // 1. Validate HTTP method is POST and Content-Type is application/json
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type harus application/json" },
        { status: 400 }
      );
    }

    // 2. Rate limiting check
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    try {
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "Kamu udah generate terlalu banyak hari ini, coba lagi besok ya!" },
          { status: 429 }
        );
      }
    } catch (ratelimitError) {
      console.error("Rate limiting check failed:", ratelimitError);
      // Fallback: allow request in case of Redis/Upstash issues in dev/production
    }

    // 3. Input validation
    const body = await req.json().catch(() => ({}));
    const { moodInput } = body;

    if (typeof moodInput !== "string") {
      return NextResponse.json(
        { error: "Input mood harus berupa teks (string)." },
        { status: 400 }
      );
    }

    const trimmedMood = moodInput.trim();
    if (trimmedMood.length < 1) {
      return NextResponse.json(
        { error: "Input mood tidak boleh kosong." },
        { status: 400 }
      );
    }

    if (trimmedMood.length > 150) {
      return NextResponse.json(
        { error: "Input mood tidak boleh lebih dari 150 karakter." },
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
          { role: "user", content: `Mood input: ${trimmedMood}` },
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
            { role: "user", content: `Mood input: ${trimmedMood}` },
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
      moodInput: trimmedMood,
      createdAt: new Date().toISOString(),
    };

    // Persist result to Redis: key result:{id}, TTL 90 days
    try {
      const TTL_90_DAYS = 60 * 60 * 24 * 90;
      await redis.set(`result:${moodResult.id}`, JSON.stringify(moodResult), { ex: TTL_90_DAYS });
    } catch (redisError) {
      // Non-fatal: log but still return the result to the client
      console.error("Failed to persist MoodResult to Redis:", redisError);
    }

    return NextResponse.json(moodResult);
  } catch (error: any) {
    console.error("Unhandled error in generation route:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
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
