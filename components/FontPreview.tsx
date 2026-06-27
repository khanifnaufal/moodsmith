import { useEffect } from "react";
import { FontPairing } from "@/types";

interface FontPreviewProps {
  font: FontPairing;
  moodInput: string;
}

export default function FontPreview({ font, moodInput }: FontPreviewProps) {
  // Inject Google Fonts stylesheet dynamically on mount/change
  useEffect(() => {
    if (!font.googleFontsUrl) return;

    const existingLink = document.querySelector(
      `link[href="${font.googleFontsUrl}"]`
    );
    if (!existingLink) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = font.googleFontsUrl;
      document.head.appendChild(link);
    }
  }, [font.googleFontsUrl]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-mono-custom text-xs uppercase tracking-widest text-ink/60 border-b-2 border-dashed border-ink/20 pb-2">
        Font Pairing: {font.heading} + {font.body}
      </h2>

      <div className="border-brutal bg-white p-6 sm:p-10 shadow-brutal flex flex-col gap-6 rounded-none">
        <div className="border-b-2 border-ink pb-4">
          <h3
            style={{ fontFamily: font.heading }}
            className="text-4xl sm:text-5xl font-black text-ink tracking-tight uppercase"
          >
            {font.heading}
          </h3>
          <p className="font-mono-custom text-xs text-ink/40 mt-1">
            Heading Font &mdash; Tags: {font.mood.join(", ")}
          </p>
        </div>

        <div>
          <p
            style={{ fontFamily: font.body }}
            className="text-base sm:text-lg text-ink leading-relaxed"
          >
            This is a sample of the body font &ldquo;{font.body}&rdquo;. Moodsmith analyzes the emotional undertones of your description &ldquo;{moodInput}&rdquo; and pairs dynamic color swatches with matching typography to capture the exact feeling you want to convey.
          </p>
          <p className="font-mono-custom text-xs text-ink/40 mt-3">
            Body Font
          </p>
        </div>
      </div>
    </div>
  );
}
