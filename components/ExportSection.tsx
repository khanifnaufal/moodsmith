"use client";

import { useState, useRef } from "react";
import { MoodResult } from "@/types";

interface ExportSectionProps {
  result: MoodResult;
}

export default function ExportSection({ result }: ExportSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"css" | "json" | "tailwind">("css");
  const [copied, setCopied] = useState(false);
  const [copiedTailwind, setCopiedTailwind] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const colors = result.palette.colors;
  const font = result.font;

  const cssString = `:root {
  --color-1: ${colors[0] || "#FFFFFF"};
  --color-2: ${colors[1] || "#FFFFFF"};
  --color-3: ${colors[2] || "#FFFFFF"};
  --color-4: ${colors[3] || "#FFFFFF"};
  --color-5: ${colors[4] || "#FFFFFF"};
  --font-heading: '${font.heading}', sans-serif;
  --font-body: '${font.body}', sans-serif;
}`;

  const tailwindConfigSnippet = `// tailwind.config.ts
colors: {
  'vibe-1': '${colors[0] || "#FFFFFF"}',
  'vibe-2': '${colors[1] || "#FFFFFF"}',
  'vibe-3': '${colors[2] || "#FFFFFF"}',
  'vibe-4': '${colors[3] || "#FFFFFF"}',
  'vibe-5': '${colors[4] || "#FFFFFF"}',
},
fontFamily: {
  heading: ['${font.heading}', 'sans-serif'],
  body: ['${font.body}', 'sans-serif'],
}`;

  const handleCopyCSS = async () => {
    try {
      await navigator.clipboard.writeText(cssString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error("Failed to copy CSS to clipboard:", err);
    }
  };

  const handleCopyTailwind = async () => {
    try {
      await navigator.clipboard.writeText(tailwindConfigSnippet);
      setCopiedTailwind(true);
      setTimeout(() => setCopiedTailwind(false), 2200);
    } catch (err) {
      console.error("Failed to copy Tailwind config to clipboard:", err);
    }
  };

  const handleDownloadJSON = () => {
    try {
      const sanitizedPaletteName = result.palette.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const filename = `moodsmith-${sanitizedPaletteName || "palette"}.json`;
      const blob = new Blob([JSON.stringify(result, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download JSON:", err);
    }
  };

  return (
    <div className="flex flex-col gap-0 w-full animate-slide-up-fade stagger-5">
      {/* Section header — dark bar */}
      <div className="bg-ink text-paper border-brutal flex items-center justify-between px-5 py-3 shadow-brutal">
        <div className="flex items-center gap-3">
          <span className="font-mono-custom text-[10px] text-paper/40 uppercase tracking-widest select-none">04</span>
          <h2 className="font-heading font-black text-sm uppercase tracking-wider text-paper">
            Export
          </h2>
        </div>

        <button
          id="export-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 font-heading font-black text-xs tracking-wider uppercase bg-paper text-ink border-2 border-paper px-3 py-1.5 hover:bg-rainbow-lemon hover:border-rainbow-lemon active:scale-95 transition-all select-none"
          aria-expanded={isOpen}
          aria-controls="export-panel"
        >
          {isOpen ? (
            <>
              {/* X icon */}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Close
            </>
          ) : (
            <>
              {/* Download icon */}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export Style
            </>
          )}
        </button>
      </div>

      {/* Expandable panel */}
      <div
        id="export-panel"
        ref={contentRef}
        className={`border-brutal border-t-0 bg-white overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 border-0"
        }`}
        aria-hidden={!isOpen}
        inert={!isOpen || undefined}
      >
        <div className="p-5 sm:p-6 flex flex-col gap-5">
          {/* Tab toggle pills */}
          <div className="flex flex-col gap-2">
            <span className="font-mono-custom text-[10px] uppercase tracking-wider text-ink/50 select-none">
              Export Format
            </span>
            <div className="flex gap-0 w-fit border-brutal shadow-brutalXs">
              <button
                id="tab-css"
                onClick={() => setActiveTab("css")}
                className={`font-heading font-black text-xs uppercase tracking-wider px-4 py-2 transition-colors border-r-2 border-ink select-none focus:outline-none ${
                  activeTab === "css"
                    ? "bg-rainbow-lime text-ink"
                    : "bg-white text-ink/50 hover:text-ink hover:bg-ink/5"
                }`}
                aria-selected={activeTab === "css"}
                role="tab"
              >
                CSS Vars
              </button>
              <button
                id="tab-json"
                onClick={() => setActiveTab("json")}
                className={`font-heading font-black text-xs uppercase tracking-wider px-4 py-2 transition-colors border-r-2 border-ink select-none focus:outline-none ${
                  activeTab === "json"
                    ? "bg-rainbow-lime text-ink"
                    : "bg-white text-ink/50 hover:text-ink hover:bg-ink/5"
                }`}
                aria-selected={activeTab === "json"}
                role="tab"
              >
                JSON
              </button>
              <button
                id="tab-tailwind"
                onClick={() => setActiveTab("tailwind")}
                className={`font-heading font-black text-xs uppercase tracking-wider px-4 py-2 transition-colors select-none focus:outline-none ${
                  activeTab === "tailwind"
                    ? "bg-rainbow-lime text-ink"
                    : "bg-white text-ink/50 hover:text-ink hover:bg-ink/5"
                }`}
                aria-selected={activeTab === "tailwind"}
                role="tab"
              >
                Tailwind
              </button>
            </div>
          </div>

          {/* Content */}
          {activeTab === "css" ? (
            <div className="flex flex-col gap-3">
              <pre className="border-2 border-ink bg-[#1a1a2e] text-[#e8e8f0] p-4 font-mono-custom text-xs sm:text-sm overflow-x-auto whitespace-pre leading-relaxed scrollbar-brutal-dark">
                {cssString}
              </pre>
              <button
                id="copy-css-btn"
                onClick={handleCopyCSS}
                className={`flex items-center gap-2 self-start font-heading font-black text-xs uppercase tracking-wider border-brutal px-4 py-2 shadow-brutalSm transition-all select-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                  copied
                    ? "bg-rainbow-lime text-ink"
                    : "bg-rainbow-sky text-ink hover:bg-rainbow-sky/90 hover:-translate-y-[1px] hover:shadow-brutal"
                }`}
              >
                {copied ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-check-bounce" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy CSS
                  </>
                )}
              </button>
            </div>
          ) : activeTab === "json" ? (
            <div className="flex flex-col gap-3">
              <pre className="border-2 border-ink bg-[#1a1a2e] text-[#e8e8f0] p-4 font-mono-custom text-xs sm:text-sm overflow-y-auto max-h-56 overflow-x-auto whitespace-pre leading-relaxed scrollbar-brutal-dark">
                {JSON.stringify(result, null, 2)}
              </pre>
              <button
                id="download-json-btn"
                onClick={handleDownloadJSON}
                className="flex items-center gap-2 self-start font-heading font-black text-xs uppercase tracking-wider border-brutal bg-rainbow-tangerine text-ink px-4 py-2 shadow-brutalSm hover:bg-rainbow-tangerine/90 hover:-translate-y-[1px] hover:shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all select-none"
              >
                {/* Download icon */}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download JSON
              </button>
            </div>
          ) : (
            /* Tailwind tab */
            <div className="flex flex-col gap-3">
              <pre className="border-2 border-ink bg-[#1a1a2e] text-[#e8e8f0] p-4 font-mono-custom text-xs sm:text-sm overflow-x-auto whitespace-pre leading-relaxed scrollbar-brutal-dark">
                {tailwindConfigSnippet}
              </pre>
              <button
                id="copy-tailwind-btn"
                onClick={handleCopyTailwind}
                className={`flex items-center gap-2 self-start font-heading font-black text-xs uppercase tracking-wider border-brutal px-4 py-2 shadow-brutalSm transition-all select-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                  copiedTailwind
                    ? "bg-rainbow-lime text-ink"
                    : "bg-rainbow-sky text-ink hover:bg-rainbow-sky/90 hover:-translate-y-[1px] hover:shadow-brutal"
                }`}
              >
                {copiedTailwind ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-check-bounce" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
                    </svg>
                    Copy Tailwind Config
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
