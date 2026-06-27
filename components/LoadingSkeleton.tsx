export default function LoadingSkeleton() {
  // Arc heights matching PaletteGrid: sm, md, lg, md, sm
  const skeletonHeights = ["h-36", "h-44", "h-52", "h-44", "h-36"] as const;

  return (
    <section className="w-full max-w-5xl px-4 sm:px-6 pb-24 flex flex-col gap-12">

      {/* Skeleton Palette — decorative, hidden from AT */}
      <div className="flex flex-col gap-4" aria-hidden="true">
        {/* Section header skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-3 bg-ink/10 w-5 rounded-none" />
          <div className="h-4 bg-ink/10 w-20 rounded-none" />
          <div className="h-5 bg-ink/10 w-32 rounded-none" />
        </div>

        {/* Arc swatches skeleton */}
        <div className="flex gap-3 items-end">
          {skeletonHeights.map((h, index) => (
            <div
              key={index}
              className={`flex-1 ${h} border-brutal bg-white shadow-brutal relative overflow-hidden`}
            >
              {/* Pulsing fill */}
              <div className="w-full h-full bg-ink/5 animate-pulse" />

              {/* Scan line */}
              <div
                className="absolute top-0 bottom-0 w-1/4 bg-gradient-to-r from-transparent via-ink/10 to-transparent animate-scan-line"
                style={{ animationDelay: `${index * 0.15}s` }}
                aria-hidden="true"
              />

              {/* Hex label skeleton */}
              <div className="absolute bottom-2.5 left-2 w-16 h-5 border-2 border-ink bg-white -rotate-2 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Skeleton Font Preview — decorative, hidden from AT */}
      <div className="flex flex-col gap-4" aria-hidden="true">
        {/* Section header skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-3 bg-ink/10 w-5 rounded-none" />
          <div className="h-4 bg-ink/10 w-24 rounded-none" />
          <div className="h-5 bg-ink/10 w-44 rounded-none" />
        </div>

        {/* Card skeleton */}
        <div className="border-brutal bg-white shadow-brutal overflow-hidden">
          {/* Type scale strip skeleton */}
          <div className="px-6 py-2 border-b-2 border-ink bg-ink/5 flex gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-4 w-5 bg-ink/10 animate-pulse" />
            ))}
          </div>

          <div className="grid sm:grid-cols-2 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-ink">
            {/* Left skeleton */}
            <div className="p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-ink/10 animate-pulse" />
                <div className="h-3 bg-ink/10 w-14 animate-pulse" />
              </div>
              <div className="h-14 bg-ink/10 w-4/5 animate-pulse -rotate-1" />
              <div className="flex gap-1.5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 w-12 bg-ink/10 animate-pulse" />
                ))}
              </div>
            </div>

            {/* Right skeleton */}
            <div className="p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-ink/10 animate-pulse" />
                <div className="h-3 bg-ink/10 w-10 animate-pulse" />
              </div>
              <div className="border-l-4 border-ink/20 pl-4 flex flex-col gap-2">
                <div className="h-4 bg-ink/10 w-full animate-pulse" />
                <div className="h-4 bg-ink/10 w-11/12 animate-pulse" />
                <div className="h-4 bg-ink/10 w-4/5 animate-pulse" />
              </div>
              <div className="h-3 bg-ink/5 w-16 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Generating status — polite live region announced to screen readers */}
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-2 text-ink/40 select-none"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-spin flex-shrink-0" aria-hidden="true">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <span className="font-mono-custom text-xs uppercase tracking-wider">
          Generating your vibe
          <span aria-hidden="true" style={{ animation: "typing-dot 1.2s 0ms infinite" }}>.</span>
          <span aria-hidden="true" style={{ animation: "typing-dot 1.2s 200ms infinite" }}>.</span>
          <span aria-hidden="true" style={{ animation: "typing-dot 1.2s 400ms infinite" }}>.</span>
        </span>
      </div>
    </section>
  );
}
