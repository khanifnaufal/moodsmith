import { MoodResult } from "@/types";
import PaletteGrid from "@/components/PaletteGrid";
import FontPreview from "@/components/FontPreview";
import ExportSection from "@/components/ExportSection";

interface ResultCardProps {
  result: MoodResult;
}

/**
 * Reusable display for a single MoodResult.
 * Shows: palette grid + swatches, font preview card, export section.
 * Used by both the main generate page and the /p/[id] permalink page.
 */
export default function ResultCard({ result }: ResultCardProps) {
  return (
    <section className="w-full max-w-5xl px-4 sm:px-6 pb-24 flex flex-col gap-12">
      <PaletteGrid palette={result.palette} />
      <FontPreview font={result.font} moodInput={result.moodInput} />
      <ExportSection result={result} />
    </section>
  );
}
