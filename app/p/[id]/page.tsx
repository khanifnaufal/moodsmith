import { redis } from "@/lib/redis";
import { MoodResult } from "@/types";
import ResultCard from "@/components/ResultCard";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const raw = await redis.get(`result:${id}`);
  if (!raw) {
    return { title: "Vibe Expired — Moodsmith" };
  }
  const result: MoodResult =
    typeof raw === "string" ? JSON.parse(raw) : (raw as MoodResult);
  return {
    title: `${result.palette.name} — Moodsmith`,
    description: `A mood palette generated for "${result.moodInput}" on Moodsmith.`,
  };
}

export default async function PermalinkPage({ params }: Props) {
  const { id } = await params;

  // Fetch from Redis — raw may be a pre-parsed object or a JSON string
  const raw = await redis.get(`result:${id}`);

  // ── Not Found ────────────────────────────────────────────────────────
  if (!raw) {
    return (
      <main className="min-h-screen bg-paper text-ink flex flex-col items-center justify-center px-4 font-sans">
        <div className="border-brutal shadow-brutal-lg bg-rainbow-lemon max-w-lg w-full p-10 flex flex-col gap-6">
          {/* Big 404 heading */}
          <p className="font-mono-custom text-xs uppercase tracking-widest text-ink/60">
            Error 404
          </p>
          <h1 className="font-heading font-black text-5xl sm:text-6xl leading-none uppercase">
            Vibe<br />Expired.
          </h1>
          <p className="font-mono-custom text-sm text-ink/70 leading-relaxed">
            This mood palette link is either invalid or has passed its 90-day
            shelf life. Vibes don&apos;t last forever — generate a new one.
          </p>

          {/* Divider */}
          <div className="border-t-brutal" />

          <Link
            href="/"
            className="
              inline-flex items-center gap-2
              font-heading font-black text-sm uppercase tracking-wider
              border-brutal bg-ink text-paper shadow-brutal
              px-5 py-3 self-start
              hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none
              transition-all duration-100
            "
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Moodsmith
          </Link>
        </div>
      </main>
    );
  }

  // ── Found ─────────────────────────────────────────────────────────────
  const result: MoodResult =
    typeof raw === "string" ? JSON.parse(raw) : (raw as MoodResult);

  return (
    <main className="min-h-screen bg-paper text-ink flex flex-col items-center font-sans">
      {/* Minimal top bar */}
      <header className="w-full border-b-brutal bg-paper sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-heading font-black text-base uppercase tracking-widest hover:underline"
          >
            Moodsmith
          </Link>

          <Link
            href="/"
            id="generate-own-vibe-btn"
            className="
              inline-flex items-center gap-1.5
              font-heading font-black text-xs uppercase tracking-wider
              border-brutal bg-rainbow-lemon text-ink shadow-brutal-sm
              px-4 py-2
              hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none
              transition-all duration-100
            "
          >
            Generate your own vibe
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Palette name + mood input label */}
      <div className="w-full max-w-5xl px-4 sm:px-6 pt-10 pb-2 flex flex-col gap-1">
        <p className="font-mono-custom text-xs uppercase tracking-widest text-ink/50">
          Shared vibe
        </p>
        <h1 className="font-heading font-black text-3xl sm:text-4xl uppercase leading-tight">
          {result.palette.name}
        </h1>
        <p className="font-mono-custom text-sm text-ink/60 mt-1">
          &ldquo;{result.moodInput}&rdquo;
        </p>
      </div>

      {/* Result display — reuse the same component as the main page */}
      <ResultCard result={result} />
    </main>
  );
}
