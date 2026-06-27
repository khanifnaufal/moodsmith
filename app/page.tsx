"use client";

import { useState, useEffect } from "react";
import { MoodResult } from "@/types";
import Header from "@/components/Header";
import VibeForm from "@/components/VibeForm";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import PaletteGrid from "@/components/PaletteGrid";
import FontPreview from "@/components/FontPreview";
import { getHistory, saveToHistory, deleteFromHistory } from "@/lib/history";

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

      {/* Backdrop overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-ink/40 z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Collapsible Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[320px] max-w-[85vw] bg-paper border-r-[3px] border-ink z-50 shadow-brutal transform transition-transform duration-300 ease-in-out flex flex-col rounded-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="bg-rainbow-tangerine border-b-brutal p-4 flex justify-between items-center shrink-0">
          <h2 className="font-heading font-black text-lg uppercase tracking-tight text-ink">
            PAST MOODS
          </h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="w-8 h-8 border-brutal bg-white hover:bg-rainbow-coral text-ink font-bold flex items-center justify-center transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shadow-[1px_1px_0_#161616]"
            title="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Sidebar Scroll Content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {history.length === 0 ? (
            <div className="border-brutal border-dashed bg-white p-6 text-center shadow-brutal-sm rounded-none">
              <p className="font-mono-custom text-xs text-ink/60">
                No history yet.<br />Generate a style to get started!
              </p>
            </div>
          ) : (
            history.map((item) => {
              const dateStr = item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Unknown date";

              return (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectHistory(item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectHistory(item);
                    }
                  }}
                  className="border-brutal bg-white p-3 shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_#161616] cursor-pointer transition-all flex flex-col gap-3 group rounded-none"
                >
                  {/* Card Header: Prompt + Delete */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-col min-w-0">
                      <span
                        className="font-heading font-black text-sm uppercase text-ink truncate max-w-[200px]"
                        title={item.moodInput}
                      >
                        {item.moodInput}
                      </span>
                      <span className="font-mono-custom text-[10px] text-ink/50 uppercase">
                        Palette: {item.palette.name}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="w-5 h-5 border border-ink bg-rainbow-coral hover:bg-rainbow-coral/90 text-ink text-xs font-bold flex items-center justify-center shadow-[1px_1px_0_#161616] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all shrink-0"
                      title="Delete from history"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Mini Swatches */}
                  <div className="flex gap-1">
                    {item.palette.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 border border-ink"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>

                  {/* Card Footer: Fonts & Date */}
                  <div className="flex justify-between items-center border-t border-dashed border-ink/20 pt-2 text-[9px] font-mono-custom text-ink/60">
                    <span className="truncate max-w-[140px]" title={`${item.font.heading} + ${item.font.body}`}>
                      {item.font.heading} + {item.font.body}
                    </span>
                    <span className="shrink-0">{dateStr}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

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
