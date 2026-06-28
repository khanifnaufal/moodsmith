import { ImageResponse } from "next/og";
import { redis } from "@/lib/redis";
import { MoodResult } from "@/types";

export const alt = "Moodsmith — AI-generated mood palette";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch from Redis — returns pre-parsed object or JSON string
  const raw = await redis.get(`result:${id}`);

  // ── Fallback image when ID is not found / expired ─────────────────────
  if (!raw) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#FFFCF2",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "6px solid #161616",
            fontFamily: "serif",
          }}
        >
          <div
            style={{
              background: "#FFD93D",
              border: "4px solid #161616",
              padding: "48px 64px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              boxShadow: "8px 8px 0 #161616",
            }}
          >
            <div
              style={{
                fontSize: 18,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#161616",
                opacity: 0.6,
                display: "flex",
              }}
            >
              ERROR 404
            </div>
            <div
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: "#161616",
                lineHeight: 1,
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              Vibe Expired.
            </div>
            <div
              style={{
                fontSize: 22,
                color: "#161616",
                opacity: 0.7,
                display: "flex",
              }}
            >
              moodsmith.app
            </div>
          </div>
        </div>
      ),
      { ...size }
    );
  }

  // ── Parse result ──────────────────────────────────────────────────────
  const result: MoodResult =
    typeof raw === "string" ? JSON.parse(raw) : (raw as MoodResult);

  const { palette, moodInput } = result;
  const colors = palette.colors.slice(0, 5);

  // Swatch height tiers (tallest in center): [sm, md, lg, md, sm]
  const swatchHeights = [280, 340, 400, 340, 280];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FFFCF2",
          display: "flex",
          flexDirection: "column",
          padding: "0",
          border: "6px solid #161616",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Top info bar ─────────────────────────────────────────────── */}
        <div
          style={{
            padding: "32px 48px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            borderBottom: "4px solid #161616",
            background: "#FFFCF2",
          }}
        >
          {/* Eyebrow label */}
          <div
            style={{
              fontSize: 15,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#161616",
              opacity: 0.45,
              display: "flex",
            }}
          >
            Moodsmith · Shared Vibe
          </div>

          {/* Palette name */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: "#161616",
              lineHeight: 1.05,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            {palette.name}
          </div>

          {/* Mood input */}
          <div
            style={{
              fontSize: 20,
              color: "#161616",
              opacity: 0.55,
              display: "flex",
            }}
          >
            &ldquo;{moodInput}&rdquo;
          </div>
        </div>

        {/* ── Swatch arc row ────────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            padding: "0 48px 0",
            gap: "12px",
          }}
        >
          {colors.map((color, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: swatchHeights[i] ?? 320,
                background: color,
                border: "3px solid #161616",
                boxShadow: "4px 4px 0 #161616",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "10px 10px",
                position: "relative",
              }}
            >
              {/* Hex sticker */}
              <div
                style={{
                  background: "#FFFCF2",
                  border: "2px solid #161616",
                  padding: "3px 7px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#161616",
                  letterSpacing: "0.05em",
                  display: "flex",
                  alignSelf: "flex-start",
                  boxShadow: "2px 2px 0 #161616",
                }}
              >
                {color.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom branding strip ─────────────────────────────────────── */}
        <div
          style={{
            height: "52px",
            background: "#161616",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 48px",
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#FFFCF2",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            MOODSMITH
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#FFFCF2",
              opacity: 0.5,
              display: "flex",
            }}
          >
            Generate your own vibe →
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
