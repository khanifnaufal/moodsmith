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
    <main className="min-h-screen bg-paper text-ink flex flex-col items-center p-0 selection:bg-rainbow-lemon selection:text-ink font-sans">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-6 right-6 z-30 bg-rainbow-sky text-ink font-heading font-bold text-xs sm:text-sm tracking-wider uppercase border-brutal shadow-brutal px-4 py-2 hover:bg-rainbow-sky/95 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all select-none rounded-none"
      >
        📁 HISTORY ({history.length})
      </button>

      {/* Collapsible History Sidebar */}
      <HistorySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        history={history}
        onDelete={handleDelete}
        onSelect={handleSelectHistory}
      />

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

          {/* Export card with code copying and JSON download */}
          <ExportSection result={result} />
        </section>
      )}
    </main>
  );
}
