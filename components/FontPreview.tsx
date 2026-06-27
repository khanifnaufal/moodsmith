"use client";

import { useEffect } from "react";
import { FontPairing } from "@/types";

interface FontPreviewProps {
  font: FontPairing;
  moodInput: string;
}

// Assign a bg color to each mood tag pill, cycling through rainbow set
const CHIP_COLORS = [
  "bg-rainbow-lemon",
  "bg-rainbow-lime",
  "bg-rainbow-sky",
  "bg-rainbow-coral",
  "bg-rainbow-tangerine",
  "bg-rainbow-grape text-paper",
];

export default function FontPreview({ font, moodInput }: FontPreviewProps) {
  // Inject Google Fonts stylesheet dynamically on mount/change
  useEffect(() => {
    if (!font.googleFontsUrl) return;
    const existingLink = document.querySelector(
      `link[href="${font.googleFontsUrl}"]`
    );
    if (!existingLink) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = font.googleFontsUrl;
      document.head.appendChild(link);
    }
  }, [font.googleFontsUrl]);

  return (
    <div className="flex flex-col gap-4 animate-slide-up-fade stagger-3">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <span className="font-mono-custom text-xs text-ink/40 uppercase tracking-widest select-none">03</span>
        <h2 className="font-heading font-black text-sm uppercase tracking-wider text-ink border-b-2 border-ink pb-0.5">
          Font Pairing
        </h2>
        <span className="font-mono-custom text-[10px] uppercase tracking-wider bg-rainbow-sky text-ink border-2 border-ink px-2 py-0.5 shadow-brutalXs">
          {font.heading} + {font.body}
        </span>
      </div>

      {/* Preview card */}
      <div className="border-brutal bg-white shadow-brutal overflow-hidden">
        {/* Type scale strip */}
        <div
          className="w-full px-6 py-2 border-b-2 border-ink bg-ink/5 flex items-center gap-4 overflow-x-auto"
          aria-hidden="true"
        >
          {["Aa", "Bb", "Cc", "Dd", "Ee", "Ff", "Gg"].map((ch) => (
            <span
              key={ch}
              style={{ fontFamily: font.heading }}
              className="font-black text-ink/50 text-sm flex-shrink-0 select-none"
            >
              {ch}
            </span>
          ))}
          <span className="font-mono-custom text-[9px] text-ink/30 ml-auto flex-shrink-0 uppercase tracking-wider">
            {font.heading}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-ink">
          {/* Left: Heading font display */}
          <div className="p-6 flex flex-col gap-3">
            {/* Label */}
            <div className="flex items-center gap-2">
              {/* T icon */}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="4 7 4 4 20 4 20 7" />
                <line x1="9" y1="20" x2="15" y2="20" />
                <line x1="12" y1="4" x2="12" y2="20" />
              </svg>
              <span className="font-mono-custom text-[10px] uppercase tracking-widest text-ink/50">
                Heading
              </span>
            </div>

            {/* Massive heading display */}
            <h3
              style={{ fontFamily: font.heading }}
              className="text-5xl sm:text-6xl font-black text-ink leading-none uppercase -rotate-1 select-none"
            >
              {font.heading.split(" ").slice(0, 2).join(" ")}
            </h3>

            {/* Mood chips */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {font.mood.map((tag, i) => (
                <span
                  key={tag}
                  className={`font-mono-custom text-[9px] uppercase tracking-wider border border-ink px-1.5 py-0.5 ${CHIP_COLORS[i % CHIP_COLORS.length]}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Body font preview */}
          <div className="p-6 flex flex-col gap-3">
            {/* Label */}
            <div className="flex items-center gap-2">
              {/* Align left icon */}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="21" y1="10" x2="3" y2="10" />
                <line x1="15" y1="6" x2="3" y2="6" />
                <line x1="17" y1="14" x2="3" y2="14" />
                <line x1="11" y1="18" x2="3" y2="18" />
              </svg>
              <span className="font-mono-custom text-[10px] uppercase tracking-widest text-ink/50">
                Body
              </span>
            </div>

            {/* Body sample with left border accent */}
            <p
              style={{ fontFamily: font.body }}
              className="text-base text-ink leading-relaxed border-l-4 border-ink pl-4"
            >
              This is <em>{font.body}</em>. Moodsmith reads &ldquo;{moodInput}&rdquo; and surfaces a palette and type pairing that carries that exact emotional register.
            </p>

            <span className="font-mono-custom text-[10px] text-ink/40 uppercase tracking-wider">
              {font.body}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
