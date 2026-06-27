"use client";

import { useState } from "react";
import { MoodResult } from "@/types";
import Header from "@/components/Header";
import VibeForm from "@/components/VibeForm";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import PaletteGrid from "@/components/PaletteGrid";
import FontPreview from "@/components/FontPreview";

export default function Home() {
  const [moodInput, setMoodInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MoodResult | null>(null);

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

  return (
    <main className="min-h-screen bg-paper text-ink flex flex-col items-center p-0 selection:bg-rainbow-lemon selection:text-ink font-sans">
      {/* Header and top rainbow stripe */}
      <Header />

      {/* Input area for user prompt */}
      <VibeForm
        moodInput={moodInput}
        setMoodInput={setMoodInput}
        loading={loading}
        onSubmit={handleGenerate}
      />

      {/* Error state notification */}
      {error && (
        <section className="w-full max-w-4xl px-6 pb-12">
          <div className="border-brutal bg-rainbow-coral p-4 shadow-brutal font-mono-custom text-ink font-semibold flex flex-col gap-1 rounded-none">
            <span className="font-bold text-lg">ERROR GENERATING STYLE:</span>
            <span>{error}</span>
          </div>
        </section>
      )}

      {/* Skeleton loading display */}
      {loading && <LoadingSkeleton />}

      {/* Output results (Swatches & Font Preview) */}
      {!loading && result && (
        <section className="w-full max-w-4xl px-6 pb-24 flex flex-col gap-12">
          {/* Swatches block with self-contained click-to-copy interactions */}
          <PaletteGrid palette={result.palette} />

          {/* Typography pairing card with self-contained dynamic loading */}
          <FontPreview font={result.font} moodInput={result.moodInput} />
        </section>
      )}
    </main>
  );
}
