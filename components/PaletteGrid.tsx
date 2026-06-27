"use client";

import { useState } from "react";
import { ColorPalette } from "@/types";

interface PaletteGridProps {
  palette: ColorPalette;
}

// Arc height tiers: [sm, md, lg, md, sm] — tallest in center
const HEIGHT_TIERS = ["swatch-h-sm", "swatch-h-md", "swatch-h-lg", "swatch-h-md", "swatch-h-sm"] as const;

// Hex label sticker rotations — alternating subtle angles
const ROTATIONS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-1"] as const;

// Stagger animation delay classes
const STAGGER_CLASSES = ["stagger-1", "stagger-2", "stagger-3", "stagger-4", "stagger-5"] as const;

export default function PaletteGrid({ palette }: PaletteGridProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (hex: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1800);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono-custom text-xs text-ink/40 uppercase tracking-widest select-none">02</span>
          <h2 className="font-heading font-black text-sm uppercase tracking-wider text-ink border-b-2 border-ink pb-0.5">
            Palette
          </h2>
          {/* Palette name pill */}
          <span className="font-mono-custom text-[10px] uppercase tracking-wider bg-rainbow-lemon text-ink border-2 border-ink px-2 py-0.5 shadow-brutalXs">
            {palette.name}
          </span>
        </div>

        {/* Clipboard hint */}
        <div className="hidden sm:flex items-center gap-1.5 text-ink/40 select-none">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span className="font-mono-custom text-[10px] uppercase tracking-wider">Click to copy</span>
        </div>
      </div>

      {/* Swatch arc grid */}
      <div className="flex gap-3 items-end">
        {palette.colors.map((color, index) => (
          <button
            key={index}
            id={`swatch-${index}`}
            onClick={() => copyToClipboard(color, index)}
            style={{ backgroundColor: color }}
            className={`
              flex-1 border-brutal shadow-brutal relative cursor-pointer outline-none select-none
              ${HEIGHT_TIERS[index] ?? "swatch-h-md"}
              animate-slide-up-fade ${STAGGER_CLASSES[index]}
              hover:-translate-y-1 hover:shadow-brutalLg
              active:translate-y-1 active:translate-x-[2px] active:shadow-none
              transition-transform duration-150
            `}
            title={`Copy ${color.toUpperCase()}`}
            aria-label={`Copy color ${color.toUpperCase()}`}
          >
            {/* Hex sticker label */}
            <div
              className={`
                absolute bottom-2.5 left-2 font-mono-custom text-[10px] font-bold
                border-2 border-ink bg-white px-1.5 py-0.5
                shadow-brutalXs pointer-events-none select-none
                ${ROTATIONS[index]}
                transition-all duration-200
                ${copiedIndex === index ? "bg-rainbow-lime scale-110" : ""}
              `}
            >
              {copiedIndex === index ? (
                <span className="animate-check-bounce inline-block">✓</span>
              ) : (
                color.toUpperCase()
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
