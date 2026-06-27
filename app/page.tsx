export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 bg-paper text-ink font-sans selection:bg-rainbow-lemon selection:text-ink">
      <div className="text-center space-y-8 max-w-2xl border-brutal p-8 sm:p-12 bg-white shadow-brutal transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_#161616]">
        {/* Title using verification font-family class */}
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight font-[family-name:var(--font-heading)] uppercase">
          Moodsmith
        </h1>
        
        <p className="text-lg sm:text-xl font-[family-name:var(--font-mono-custom)] leading-relaxed max-w-md mx-auto border-t-2 border-dashed border-ink/20 pt-6">
          Crafting your emotional landscape. Your personalized mood companion is coming soon.
        </p>

        <div className="flex flex-wrap gap-3 justify-center pt-4">
          <span className="px-3 py-1.5 border-brutal text-sm font-bold bg-rainbow-coral shadow-brutalSm">
            Creative
          </span>
          <span className="px-3 py-1.5 border-brutal text-sm font-bold bg-rainbow-tangerine shadow-brutalSm">
            Dynamic
          </span>
          <span className="px-3 py-1.5 border-brutal text-sm font-bold bg-rainbow-lemon shadow-brutalSm">
            Brutalist
          </span>
          <span className="px-3 py-1.5 border-brutal text-sm font-bold bg-rainbow-lime shadow-brutalSm">
            Fresh
          </span>
          <span className="px-3 py-1.5 border-brutal text-sm font-bold bg-rainbow-sky shadow-brutalSm">
            Vibrant
          </span>
          <span className="px-3 py-1.5 border-brutal text-sm font-bold bg-rainbow-grape text-white shadow-brutalSm">
            Bold
          </span>
        </div>
      </div>
    </main>
  );
}

