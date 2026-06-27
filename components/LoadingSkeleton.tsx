export default function LoadingSkeleton() {
  return (
    <section className="w-full max-w-4xl px-6 pb-24 flex flex-col gap-12 animate-pulse">
      {/* Skeleton Swatches Container */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end border-b-2 border-dashed border-ink/20 pb-2">
          <div className="h-4 bg-ink/10 w-48 rounded-none"></div>
          <div className="h-3.5 bg-ink/10 w-32 rounded-none hidden sm:inline"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="h-36 border-brutal bg-white shadow-brutal relative rounded-none overflow-hidden"
            >
              {/* Pulsing grey block representing color */}
              <div className="w-full h-full bg-ink/5"></div>
              {/* Skeleton Sticker Hex Label */}
              <div className="absolute bottom-3 left-3 w-20 h-6 border-2 border-ink bg-white rotate-[-2deg] rounded-none flex items-center justify-center">
                <div className="w-12 h-2.5 bg-ink/15"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skeleton Font Pair Preview Card */}
      <div className="flex flex-col gap-4">
        <div className="border-b-2 border-dashed border-ink/20 pb-2">
          <div className="h-4 bg-ink/10 w-64 rounded-none"></div>
        </div>

        <div className="border-brutal bg-white p-6 sm:p-10 shadow-brutal flex flex-col gap-6 rounded-none">
          <div className="border-b-2 border-ink pb-4">
            {/* Heading font name skeleton */}
            <div className="h-10 bg-ink/10 w-2/3 rounded-none"></div>
            {/* Heading font metadata skeleton */}
            <div className="h-3.5 bg-ink/5 w-1/3 mt-3 rounded-none"></div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Body paragraph lines skeleton */}
            <div className="h-4 bg-ink/10 w-full rounded-none"></div>
            <div className="h-4 bg-ink/10 w-11/12 rounded-none"></div>
            <div className="h-4 bg-ink/10 w-4/5 rounded-none"></div>
            {/* Body font metadata skeleton */}
            <div className="h-3.5 bg-ink/5 w-16 mt-3 rounded-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
