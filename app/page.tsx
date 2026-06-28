"use client";

import { useState, useEffect } from "react";
import { MoodResult, TemplatePalette } from "@/types";
import Header from "@/components/Header";
import VibeForm from "@/components/VibeForm";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { getHistory, saveToHistory, deleteFromHistory } from "@/lib/history";
import HistorySidebar from "@/components/HistorySidebar";
import ExportSection from "@/components/ExportSection";
import TemplatesSection from "@/components/TemplatesSection";
import ResultCard from "@/components/ResultCard";
import { FONT_PAIRINGS } from "@/lib/fontPairings";

type ActiveTab = "generate" | "templates";

export default function Home() {
  const [moodInput, setMoodInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MoodResult | null>(null);
  const [history, setHistory] = useState<MoodResult[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("generate");

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
    // Always switch to generate tab so results are visible
    setActiveTab("generate");
  };

  // Load a TemplatePalette into the main result display and save to history
  const handleSelectTemplate = (template: TemplatePalette) => {
    const font =
      FONT_PAIRINGS.find((f) => f.id === template.fontId) ?? FONT_PAIRINGS[0];

    const moodResult: MoodResult = {
      id: `template-${template.id}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      moodInput: template.name,
      palette: {
        name: template.name,
        colors: template.colors,
      },
      font,
    };

    setResult(moodResult);
    setMoodInput(template.name);
    saveToHistory(moodResult);
    setHistory(getHistory());

    // Switch back to generate view so the result display is visible
    setActiveTab("generate");

    // Scroll to top so results are immediately visible
    window.scrollTo({ top: 0, behavior: "smooth" });
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

      {/* ── Tab switcher ─────────────────────────────────────── */}
      <div
        className="w-full max-w-5xl px-4 sm:px-6 pt-2 pb-6 flex gap-0"
        role="tablist"
        aria-label="Main navigation"
      >
        {(
          [
            { id: "generate", label: "Generate" },
            { id: "templates", label: "Starter Kits" },
          ] as { id: ActiveTab; label: string }[]
        ).map((tab, i) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`
              font-heading font-black text-xs uppercase tracking-wider
              px-5 py-2.5 border-2 border-ink transition-all duration-100
              ${i === 0 ? "" : "-ml-[2px]"}
              ${
                activeTab === tab.id
                  ? "bg-ink text-paper z-10 relative shadow-none translate-x-[2px] translate-y-[2px]"
                  : "bg-paper text-ink hover:bg-rainbow-lemon hover:z-10"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Generate tab panel ───────────────────────────────── */}
      <div
        id="tabpanel-generate"
        role="tabpanel"
        aria-labelledby="tab-generate"
        className={`w-full flex flex-col items-center ${
          activeTab === "generate" ? "" : "hidden"
        }`}
      >
        {/* Input area */}
        <VibeForm
          moodInput={moodInput}
          setMoodInput={setMoodInput}
          loading={loading}
          onSubmit={handleGenerate}
        />

        {/* Error state */}
        {error && (
          <section
            className="w-full max-w-5xl px-4 sm:px-6 pb-8"
            role="alert"
          >
            <div className="border-brutal bg-rainbow-coral p-4 shadow-brutal font-mono-custom text-ink flex items-start gap-3">
              {/* Error icon */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0 mt-0.5"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div className="flex flex-col gap-0.5">
                <span className="font-heading font-black text-sm uppercase">
                  Generation Failed
                </span>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          </section>
        )}

        {/* Loading skeleton */}
        {loading && <LoadingSkeleton />}

        {/* Results */}
        {!loading && result && <ResultCard result={result} />}
      </div>

      {/* ── Templates tab panel ──────────────────────────────── */}
      <div
        id="tabpanel-templates"
        role="tabpanel"
        aria-labelledby="tab-templates"
        className={`w-full flex flex-col items-center ${
          activeTab === "templates" ? "" : "hidden"
        }`}
      >
        <TemplatesSection onSelect={handleSelectTemplate} />
      </div>
    </main>
  );
}
