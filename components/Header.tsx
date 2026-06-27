export default function Header() {
  return (
    <>
      {/* Stripe horizontal 6 blok warna rainbow */}
      <div className="w-full flex h-[10px] select-none">
        <div className="flex-1 bg-rainbow-coral"></div>
        <div className="flex-1 bg-rainbow-tangerine"></div>
        <div className="flex-1 bg-rainbow-lemon"></div>
        <div className="flex-1 bg-rainbow-lime"></div>
        <div className="flex-1 bg-rainbow-sky"></div>
        <div className="flex-1 bg-rainbow-grape"></div>
      </div>

      {/* Header Title & Tagline */}
      <header className="w-full max-w-4xl px-6 pt-12 pb-8 flex flex-col items-center text-center">
        <h1 className="font-heading font-black text-5xl sm:text-6xl text-ink tracking-tight uppercase select-none">
          MOODSMITH
        </h1>
        <p className="font-mono-custom text-sm text-ink/80 mt-2">
          type a vibe, get a palette + font pairing
        </p>
      </header>
    </>
  );
}
