import React from "react";

interface VibeFormProps {
  moodInput: string;
  setMoodInput: (value: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const MAX_CHARS = 200;

export default function VibeForm({
  moodInput,
  setMoodInput,
  loading,
  onSubmit,
}: VibeFormProps) {
  const charCount = moodInput.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isNearLimit = charCount > MAX_CHARS * 0.8;

  return (
    <section className="w-full max-w-5xl px-4 sm:px-6 py-8">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono-custom text-xs text-ink/40 uppercase tracking-widest select-none">
          01
        </span>
        <span className="font-heading font-black text-sm uppercase tracking-wider text-ink border-b-2 border-ink pb-0.5">
          Describe Your Vibe
        </span>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        {/* Input container */}
        <div className="relative border-brutal shadow-brutal bg-white">
          <textarea
            id="vibe-input"
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
            disabled={loading}
            placeholder="e.g. rainy tokyo night, soft pastel morning, neon synthwave sunset..."
            maxLength={MAX_CHARS + 20}
            className="w-full bg-transparent p-4 pb-8 font-mono-custom text-base text-ink placeholder:text-ink/30 outline-none disabled:text-ink/60 resize-none h-[110px] rounded-none leading-relaxed"
            aria-label="Mood/vibe description"
          />

          {/* Character counter — bottom right of textarea */}
          <div
            className={`absolute bottom-2.5 right-3 font-mono-custom text-[10px] select-none transition-colors ${
              isOverLimit
                ? "text-rainbow-coral font-bold"
                : isNearLimit
                ? "text-rainbow-tangerine"
                : "text-ink/30"
            }`}
            aria-live="polite"
          >
            {charCount} / {MAX_CHARS}
          </div>
        </div>

        {/* Submit button */}
        <button
          id="generate-btn"
          type="submit"
          disabled={loading || isOverLimit || charCount === 0}
          className={`self-end flex items-center gap-2 font-heading font-black text-sm tracking-wider uppercase border-brutal px-6 py-3 transition-all select-none rounded-none ${
            loading
              ? "bg-rainbow-lemon text-ink animate-pulse-ring cursor-wait"
              : "bg-rainbow-lemon text-ink shadow-brutal hover:bg-rainbow-lemon/90 hover:-translate-y-[2px] hover:shadow-brutalLg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-brutal"
          }`}
          aria-label={loading ? "Generating palette..." : "Generate palette and font pairing"}
        >
          {loading ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-spin" aria-hidden="true">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <span>
                CRAFTING
                <span style={{ animation: "typing-dot 1.2s 0ms infinite" }}>.</span>
                <span style={{ animation: "typing-dot 1.2s 200ms infinite" }}>.</span>
                <span style={{ animation: "typing-dot 1.2s 400ms infinite" }}>.</span>
              </span>
            </>
          ) : (
            <>
              CRAFT IT
              {/* Arrow right icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </form>
    </section>
  );
}
