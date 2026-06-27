export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-indigo-950 via-slate-900 to-black text-white font-sans">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-pink-400 to-indigo-400">
          Moodsmith
        </h1>
        <p className="text-zinc-400 text-lg max-w-md mx-auto">
          Crafting your emotional landscape. Your personalized mood companion is coming soon.
        </p>
      </div>
    </main>
  );
}
