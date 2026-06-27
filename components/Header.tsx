interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
}

export default function Header({ historyCount, onOpenHistory }: HeaderProps) {
  return (
    <>
      {/* Rainbow stripe — 20px with shimmer animation */}
      <div
        className="w-full h-5 select-none flex-shrink-0"
        style={{
          background:
            "linear-gradient(90deg, #FF6B6B 0%, #FFA63D 16.6%, #FFD93D 33.3%, #6BCB77 50%, #4D96FF 66.6%, #9B5DE5 83.3%, #FF6B6B 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer-stripe 4s linear infinite",
        }}
        aria-hidden="true"
      />

      {/* Navbar — 3 columns */}
      <header className="w-full border-b-brutal bg-paper sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

          {/* Left: History button */}
          <button
            id="open-history-btn"
            onClick={onOpenHistory}
            className="flex items-center gap-2 border-brutal bg-paper text-ink font-heading font-black text-xs tracking-wider uppercase shadow-brutalSm px-3 py-2 hover:bg-rainbow-tangerine active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all select-none flex-shrink-0"
            aria-label={`Open history (${historyCount} items)`}
          >
            {/* Clock / history icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="hidden sm:inline">History</span>
            <span className="inline-flex items-center justify-center w-5 h-5 bg-ink text-paper text-[10px] font-black leading-none">
              {historyCount}
            </span>
          </button>

          {/* Center: MOODSMITH title */}
          <div className="flex flex-col items-center text-center flex-1 min-w-0">
            <h1
              className="font-heading font-black text-3xl sm:text-5xl text-ink tracking-tight uppercase select-none leading-none"
              style={{ animation: "stagger-in 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
            >
              MOODSMITH
            </h1>
            <p className="font-mono-custom text-[10px] sm:text-xs text-ink/60 mt-1 tracking-wide">
              type a vibe → get a palette + font pairing
            </p>
          </div>

          {/* Right: Status dot */}
          <div
            className="flex items-center gap-1.5 font-mono-custom text-[10px] uppercase tracking-wider text-ink/60 flex-shrink-0 select-none"
            aria-label="Service status: ready"
          >
            <span
              className="w-2 h-2 rounded-full bg-rainbow-lime flex-shrink-0"
              style={{ animation: "dot-blink 2s ease-in-out infinite" }}
              aria-hidden="true"
            />
            <span className="hidden sm:inline">Ready</span>
          </div>

        </div>
      </header>
    </>
  );
}
