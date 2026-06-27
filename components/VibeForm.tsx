import React from "react";

interface VibeFormProps {
  moodInput: string;
  setMoodInput: (value: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function VibeForm({
  moodInput,
  setMoodInput,
  loading,
  onSubmit,
}: VibeFormProps) {
  return (
    <section className="w-full max-w-4xl px-6 pb-12">
      <form
        onSubmit={onSubmit}
        className="flex flex-col md:flex-row gap-4 items-stretch"
      >
        <textarea
          value={moodInput}
          onChange={(e) => setMoodInput(e.target.value)}
          disabled={loading}
          placeholder="Describe a vibe... (e.g. rainy tokyo night, soft pastel morning)"
          className="flex-1 border-brutal bg-white p-4 font-mono-custom text-base text-ink placeholder:text-ink/40 shadow-brutal outline-none disabled:bg-white disabled:text-ink/60 resize-none h-[120px] rounded-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_#161616] transition-all"
        />
        <button
          type="submit"
          disabled={loading || !moodInput.trim()}
          className="md:w-48 bg-rainbow-lemon text-ink font-heading font-bold text-lg tracking-wider uppercase border-brutal shadow-brutal px-6 py-4 flex items-center justify-center transition-all select-none rounded-none disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-brutal hover:bg-rainbow-lemon/95 active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          {loading ? "GENERATING..." : "GENERATE"}
        </button>
      </form>
    </section>
  );
}
