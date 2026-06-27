"use client";

import { useState, useEffect } from "react";
import { MoodResult } from "@/types";

export default function Home() {
  const [moodInput, setMoodInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MoodResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Copy hex to clipboard and show feedback
  const copyToClipboard = async (hex: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedIndex(index);
      setTimeout(() => {
        setCopiedIndex(null);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Generate palette and font pairing from prompt
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moodInput.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ moodInput }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      const data: MoodResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Inject selected Google Fonts dynamically into head
  useEffect(() => {
    if (!result?.font?.googleFontsUrl) return;

    const existingLink = document.querySelector(
      `link[href="${result.font.googleFontsUrl}"]`
    );
    if (!existingLink) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = result.font.googleFontsUrl;
      document.head.appendChild(link);
    }
  }, [result?.font?.googleFontsUrl]);

  return (
    <main className="min-h-screen bg-paper text-ink flex flex-col items-center p-0 selection:bg-rainbow-lemon selection:text-ink font-sans">
      {/* Stripe horizontal 6 blok warna rainbow */}
      <div className="w-full flex h-[10px] select-none">
        <div className="flex-1 bg-rainbow-coral"></div>
        <div className="flex-1 bg-rainbow-tangerine"></div>
        <div className="flex-1 bg-rainbow-lemon"></div>
        <div className="flex-1 bg-rainbow-lime"></div>
        <div className="flex-1 bg-rainbow-sky"></div>
        <div className="flex-1 bg-rainbow-grape"></div>
      </div>

      {/* Header */}
      <header className="w-full max-w-4xl px-6 pt-12 pb-8 flex flex-col items-center text-center">
        <h1 className="font-heading font-black text-5xl sm:text-6xl text-ink tracking-tight uppercase select-none">
          MOODSMITH
        </h1>
        <p className="font-mono-custom text-sm text-ink/80 mt-2">
          type a vibe, get a palette + font pairing
        </p>
      </header>

      {/* Input Area */}
      <section className="w-full max-w-4xl px-6 pb-12">
        <form
          onSubmit={handleGenerate}
          className="flex flex-col md:flex-row gap-4 items-stretch"
        >
          <textarea
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
            disabled={loading}
            placeholder="Describe a vibe... (e.g. rainy tokyo night, soft pastel morning)"
            className="flex-1 border-brutal bg-white p-4 font-mono-custom text-base text-ink placeholder:text-ink/40 shadow-brutal outline-none disabled:bg-white disabled:text-ink/60 resize-none h-[120px] rounded-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_#161616] transition-all"
          />
          <button
            type="submit"
            disabled={loading || !moodInput.trim()}
            className="md:w-48 bg-rainbow-lemon text-ink font-heading font-bold text-lg tracking-wider uppercase border-brutal shadow-brutal px-6 py-4 flex items-center justify-center transition-all select-none rounded-none disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-brutal hover:bg-rainbow-lemon/95 active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            {loading ? "GENERATING..." : "GENERATE"}
          </button>
        </form>

        {/* Error State */}
        {error && (
          <div className="border-brutal bg-rainbow-coral p-4 shadow-brutal font-mono-custom text-ink font-semibold flex flex-col gap-1 mt-6 rounded-none">
            <span className="font-bold text-lg">ERROR GENERATING STYLE:</span>
            <span>{error}</span>
          </div>
        )}
      </section>

      {/* Skeleton Loading State */}
      {loading && (
        <section className="w-full max-w-4xl px-6 pb-24 flex flex-col gap-12 animate-pulse">
          {/* Skeleton Swatches Container */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end border-b-2 border-dashed border-ink/20 pb-2">
              <div className="h-4 bg-ink/10 w-48 rounded-none"></div>
              <div className="h-3.5 bg-ink/10 w-32 rounded-none hidden sm:inline"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="h-36 border-brutal bg-white shadow-brutal relative rounded-none overflow-hidden"
                >
                  {/* Pulsing grey block representing color */}
                  <div className="w-full h-full bg-ink/5"></div>
                  {/* Skeleton Sticker Hex Label */}
                  <div className="absolute bottom-3 left-3 w-20 h-6 border-2 border-ink bg-white rotate-[-2deg] rounded-none flex items-center justify-center">
                    <div className="w-12 h-2.5 bg-ink/15"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skeleton Font Pair Preview Card */}
          <div className="flex flex-col gap-4">
            <div className="border-b-2 border-dashed border-ink/20 pb-2">
              <div className="h-4 bg-ink/10 w-64 rounded-none"></div>
            </div>

            <div className="border-brutal bg-white p-6 sm:p-10 shadow-brutal flex flex-col gap-6 rounded-none">
              <div className="border-b-2 border-ink pb-4">
                {/* Heading font name skeleton */}
                <div className="h-10 bg-ink/10 w-2/3 rounded-none"></div>
                {/* Heading font metadata skeleton */}
                <div className="h-3.5 bg-ink/5 w-1/3 mt-3 rounded-none"></div>
              </div>

              <div className="flex flex-col gap-3">
                {/* Body paragraph lines skeleton */}
                <div className="h-4 bg-ink/10 w-full rounded-none"></div>
                <div className="h-4 bg-ink/10 w-11/12 rounded-none"></div>
                <div className="h-4 bg-ink/10 w-4/5 rounded-none"></div>
                {/* Body font metadata skeleton */}
                <div className="h-3.5 bg-ink/5 w-16 mt-3 rounded-none"></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Hasil (setelah API response) */}
      {!loading && result && (
        <section className="w-full max-w-4xl px-6 pb-24 flex flex-col gap-12">
          {/* Swatches Container */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end border-b-2 border-dashed border-ink/20 pb-2">
              <h2 className="font-mono-custom text-xs uppercase tracking-widest text-ink/60">
                Palette: {result.palette.name}
              </h2>
              <span className="font-mono-custom text-[10px] text-ink/40 hidden sm:inline">
                Click swatch to copy hex
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {result.palette.colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => copyToClipboard(color, index)}
                  style={{ backgroundColor: color }}
                  className="group h-36 border-brutal shadow-brutal relative cursor-pointer outline-none select-none transition-all active:translate-x-1 active:translate-y-1 active:shadow-none rounded-none text-left"
                  title="Click to copy hex code"
                >
                  {/* Sticker Hex Label */}
                  <div
                    className={`absolute bottom-3 left-3 font-mono-custom text-xs font-bold border-2 border-ink bg-white px-2 py-0.5 shadow-[2px_2px_0_#161616] pointer-events-none select-all transition-all rotate-[-2deg] rounded-none ${
                      copiedIndex === index
                        ? "bg-rainbow-lime text-ink"
                        : "text-ink"
                    }`}
                  >
                    {copiedIndex === index ? "COPIED!" : color.toUpperCase()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Font Pair Preview Card */}
          <div className="flex flex-col gap-4">
            <h2 className="font-mono-custom text-xs uppercase tracking-widest text-ink/60 border-b-2 border-dashed border-ink/20 pb-2">
              Font Pairing: {result.font.heading} + {result.font.body}
            </h2>

            <div className="border-brutal bg-white p-6 sm:p-10 shadow-brutal flex flex-col gap-6 rounded-none">
              <div className="border-b-2 border-ink pb-4">
                <h3
                  style={{ fontFamily: result.font.heading }}
                  className="text-4xl sm:text-5xl font-black text-ink tracking-tight uppercase"
                >
                  {result.font.heading}
                </h3>
                <p className="font-mono-custom text-xs text-ink/40 mt-1">
                  Heading Font &mdash; Tags: {result.font.mood.join(", ")}
                </p>
              </div>

              <div>
                <p
                  style={{ fontFamily: result.font.body }}
                  className="text-base sm:text-lg text-ink leading-relaxed"
                >
                  This is a sample of the body font &ldquo;{result.font.body}&rdquo;. Moodsmith analyzes the emotional undertones of your description &ldquo;{result.moodInput}&rdquo; and pairs dynamic color swatches with matching typography to capture the exact feeling you want to convey.
                </p>
                <p className="font-mono-custom text-xs text-ink/40 mt-3">
                  Body Font
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
