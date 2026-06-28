"use client";

import { useState } from "react";
import { TemplatePalette } from "@/types";
import { TEMPLATE_PALETTES } from "@/lib/templatePalettes";

interface TemplatesSectionProps {
  onSelect: (template: TemplatePalette) => void;
}

// Category labels for visual grouping (matches order in TEMPLATE_PALETTES)
const CATEGORY_TAGS: Record<string, string> = {
  "cupertino-minimal": "Tech",
  "midnight-search": "Tech",
  "prancing-bold": "Auto",
  "propeller-precision": "Auto",
  "amber-intelligence": "AI",
  "nebula-mind": "AI",
  "octocode-dark": "Dev",
  "terminal-brutalist": "Dev",
  "bazaar-burst": "Commerce",
  "market-fiesta": "Commerce",
  "maison-noir": "Luxury",
  "velvet-monogram": "Luxury",
  "crimson-stream": "Entertainment",
  "gradient-social": "Social",
};

// Accent colours for the category pills — maps to Moodsmith rainbow tokens
const CATEGORY_COLORS: Record<string, string> = {
  Tech: "bg-rainbow-sky text-ink",
  Auto: "bg-rainbow-coral text-ink",
  AI: "bg-rainbow-tangerine text-ink",
  Dev: "bg-ink text-paper",
  Commerce: "bg-rainbow-lime text-ink",
  Luxury: "bg-rainbow-lemon text-ink",
  Entertainment: "bg-rainbow-coral text-ink",
  Social: "bg-rainbow-grape text-paper",
};

export default function TemplatesSection({ onSelect }: TemplatesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [pressedId, setPressedId] = useState<string | null>(null);

  const categories = [
    "All",
    ...Array.from(new Set(Object.values(CATEGORY_TAGS))),
  ];

  const visible =
    activeCategory === "All"
      ? TEMPLATE_PALETTES
      : TEMPLATE_PALETTES.filter(
          (t) => CATEGORY_TAGS[t.id] === activeCategory
        );

  const handleClick = (template: TemplatePalette) => {
    setPressedId(template.id);
    setTimeout(() => setPressedId(null), 300);
    onSelect(template);
  };

  return (
    <section
      id="templates-section"
      className="w-full max-w-5xl px-4 sm:px-6 pb-24 flex flex-col gap-6"
      aria-label="Starter kit templates"
    >
      {/* ── Section header ─────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono-custom text-xs text-ink/40 uppercase tracking-widest select-none">
            01
          </span>
          <h2 className="font-heading font-black text-sm uppercase tracking-wider text-ink border-b-2 border-ink pb-0.5">
            Starter Kits
          </h2>
          <span className="font-mono-custom text-[10px] uppercase tracking-wider bg-rainbow-lemon text-ink border-2 border-ink px-2 py-0.5 shadow-brutalXs">
            {TEMPLATE_PALETTES.length} templates
          </span>
        </div>

        <p className="font-mono-custom text-xs text-ink/50 leading-relaxed max-w-lg">
          Pick a brand-inspired palette to load it instantly — no prompting
          needed. It goes straight to your results and history.
        </p>

        {/* ── Category filter pills ───────────────────────── */}
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by category"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                font-mono-custom text-[10px] uppercase tracking-wider px-3 py-1
                border-2 border-ink transition-all duration-100 select-none
                ${
                  activeCategory === cat
                    ? "bg-ink text-paper shadow-brutalXs translate-x-[1px] translate-y-[1px]"
                    : "bg-paper text-ink hover:bg-rainbow-lemon hover:-translate-y-px hover:shadow-brutalXs"
                }
              `}
              aria-pressed={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Template card grid ─────────────────────────────── */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        role="list"
      >
        {visible.map((template) => {
          const category = CATEGORY_TAGS[template.id] ?? "Other";
          const catColorClass =
            CATEGORY_COLORS[category] ?? "bg-ink text-paper";
          const isPressed = pressedId === template.id;

          return (
            <button
              key={template.id}
              id={`template-card-${template.id}`}
              role="listitem"
              onClick={() => handleClick(template)}
              className={`
                border-brutal bg-white text-left flex flex-col overflow-hidden
                outline-none cursor-pointer group
                transition-all duration-150
                ${
                  isPressed
                    ? "translate-x-[3px] translate-y-[3px] shadow-none"
                    : "shadow-brutal hover:-translate-y-1 hover:-translate-x-0.5 hover:shadow-brutalLg"
                }
              `}
              aria-label={`Load ${template.name}, inspired by ${template.inspiredBy}`}
            >
              {/* ── 5-colour swatch bar ─────────────────────── */}
              <div
                className="flex h-16 w-full flex-shrink-0"
                aria-hidden="true"
              >
                {template.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className="flex-1 transition-transform duration-300 group-hover:scale-y-110 origin-bottom"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* ── Card body ───────────────────────────────── */}
              <div className="p-3 flex flex-col gap-2 flex-1">
                {/* Header row: name + category pill */}
                <div className="flex items-start justify-between gap-2">
                  <span className="font-heading font-black text-sm uppercase leading-tight text-ink">
                    {template.name}
                  </span>
                  <span
                    className={`font-mono-custom text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-ink flex-shrink-0 ${catColorClass}`}
                  >
                    {category}
                  </span>
                </div>

                {/* Inspired-by badge */}
                <div className="flex items-center gap-1.5">
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-ink/30 flex-shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  <span className="font-mono-custom text-[10px] text-ink/50 uppercase tracking-wider">
                    {template.inspiredBy}
                  </span>
                </div>

                {/* Description */}
                <p className="font-mono-custom text-[10px] text-ink/60 leading-relaxed flex-1">
                  {template.description}
                </p>

                {/* Footer: font pair + CTA hint */}
                <div className="flex items-center justify-between border-t border-dashed border-ink/20 pt-2 mt-auto">
                  <span
                    className="font-mono-custom text-[9px] text-ink/40 uppercase tracking-wider truncate max-w-[65%]"
                    title={`Font: ${template.fontId}`}
                  >
                    {template.fontId.replace(/-/g, " · ")}
                  </span>
                  <span
                    className="font-mono-custom text-[9px] text-ink/30 uppercase tracking-wider flex items-center gap-1 group-hover:text-ink/70 transition-colors"
                    aria-hidden="true"
                  >
                    Load
                    <svg
                      width="9"
                      height="9"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
