import { useState } from "react";
import { ColorPalette } from "@/types";

interface PaletteGridProps {
  palette: ColorPalette;
}

export default function PaletteGrid({ palette }: PaletteGridProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (hex: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedIndex(index);
      setTimeout(() => {
        setCopiedIndex(null);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-end border-b-2 border-dashed border-ink/20 pb-2">
        <h2 className="font-mono-custom text-xs uppercase tracking-widest text-ink/60">
          Palette: {palette.name}
        </h2>
        <span className="font-mono-custom text-[10px] text-ink/40 hidden sm:inline">
          Click swatch to copy hex
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {palette.colors.map((color, index) => (
          <button
            key={index}
            onClick={() => copyToClipboard(color, index)}
            style={{ backgroundColor: color }}
            className="group h-36 border-brutal shadow-brutal relative cursor-pointer outline-none select-none transition-all active:translate-x-1 active:translate-y-1 active:shadow-none rounded-none text-left"
            title="Click to copy hex code"
          >
            {/* Sticker Hex Label */}
            <div
              className={`absolute bottom-3 left-3 font-mono-custom text-xs font-bold border-2 border-ink bg-white px-2 py-0.5 shadow-[2px_2px_0_#161616] pointer-events-none select-all transition-all rotate-[-2deg] rounded-none ${
                copiedIndex === index
                  ? "bg-rainbow-lime text-ink"
                  : "text-ink"
              }`}
            >
              {copiedIndex === index ? "COPIED!" : color.toUpperCase()}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
