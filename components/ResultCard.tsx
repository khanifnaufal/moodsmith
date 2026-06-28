import { MoodResult } from "@/types";
import PaletteGrid from "@/components/PaletteGrid";
import FontPreview from "@/components/FontPreview";
import ExportSection from "@/components/ExportSection";
import ShareButton from "@/components/ShareButton";

interface ResultCardProps {
  result: MoodResult;
}

/**
 * Reusable display for a single MoodResult.
 * Shows: action bar (share), palette grid + swatches, font preview card, export section.
 * Used by both the main generate page and the /p/[id] permalink page.
 */
export default function ResultCard({ result }: ResultCardProps) {
  return (
    <section className="w-full max-w-5xl px-4 sm:px-6 pb-24 flex flex-col gap-12">
      {/* Action bar — floated right, minimal height */}
      <div className="flex items-center justify-end -mb-6">
        <ShareButton resultId={result.id} />
      </div>

      <PaletteGrid palette={result.palette} />
      <FontPreview font={result.font} moodInput={result.moodInput} />
      <ExportSection result={result} />
    </section>
  );
}
