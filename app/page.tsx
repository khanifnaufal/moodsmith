"use client";

import { useState, useEffect } from "react";
import { MoodResult } from "@/types";
import Header from "@/components/Header";
import VibeForm from "@/components/VibeForm";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import PaletteGrid from "@/components/PaletteGrid";
import FontPreview from "@/components/FontPreview";
import { getHistory, saveToHistory, deleteFromHistory } from "@/lib/history";
import HistorySidebar from "@/components/HistorySidebar";
import ExportSection from "@/components/ExportSection";

export default function Home() {
  const [moodInput, setMoodInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MoodResult | null>(null);
  const [history, setHistory] = useState<MoodResult[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDelete = (id: string) => {
    deleteFromHistory(id);
    setHistory(getHistory());
  };

  const handleSelectHistory = (item: MoodResult) => {
    setResult(item);
    setMoodInput(item.moodInput);
    setIsSidebarOpen(false);
  };

  // Generate palette and font pairing from prompt
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

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
      saveToHistory(data);
      setHistory(getHistory());
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-paper text-ink flex flex-col items-center selection:bg-rainbow-lemon selection:text-ink font-sans">
      {/* History sidebar — history button lives in Header */}
      <HistorySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        history={history}
        onDelete={handleDelete}
        onSelect={handleSelectHistory}
      />

      {/* Navbar header — contains history button, title, status */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsSidebarOpen(true)}
      />

      {/* Input area */}
      <VibeForm
        moodInput={moodInput}
        setMoodInput={setMoodInput}
        loading={loading}
        onSubmit={handleGenerate}
      />

      {/* Error state */}
      {error && (
        <section className="w-full max-w-5xl px-4 sm:px-6 pb-8" role="alert">
          <div className="border-brutal bg-rainbow-coral p-4 shadow-brutal font-mono-custom text-ink flex items-start gap-3">
            {/* Error icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div className="flex flex-col gap-0.5">
              <span className="font-heading font-black text-sm uppercase">Generation Failed</span>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        </section>
      )}

      {/* Loading skeleton */}
      {loading && <LoadingSkeleton />}

      {/* Results */}
      {!loading && result && (
        <section className="w-full max-w-5xl px-4 sm:px-6 pb-24 flex flex-col gap-12">
          <PaletteGrid palette={result.palette} />
          <FontPreview font={result.font} moodInput={result.moodInput} />
          <ExportSection result={result} />
        </section>
      )}
    </main>
  );
}
