import { useState } from "react";
import { MoodResult } from "@/types";

interface ExportSectionProps {
  result: MoodResult;
}

export default function ExportSection({ result }: ExportSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"css" | "json">("css");
  const [copied, setCopied] = useState(false);

  const colors = result.palette.colors;
  const font = result.font;

  const cssString = `:root {
  --color-1: ${colors[0] || "#FFFFFF"};
  --color-2: ${colors[1] || "#FFFFFF"};
  --color-3: ${colors[2] || "#FFFFFF"};
  --color-4: ${colors[3] || "#FFFFFF"};
  --color-5: ${colors[4] || "#FFFFFF"};
  --font-heading: '${font.heading}', sans-serif;
  --font-body: '${font.body}', sans-serif;
}`;

  const handleCopyCSS = async () => {
    try {
      await navigator.clipboard.writeText(cssString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy CSS to clipboard:", err);
    }
  };

  const handleDownloadJSON = () => {
    try {
      const sanitizedPaletteName = result.palette.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const filename = `moodsmith-${sanitizedPaletteName || "palette"}.json`;
      const blob = new Blob([JSON.stringify(result, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download JSON:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-dashed border-ink/20 pb-2">
        <h2 className="font-mono-custom text-xs uppercase tracking-widest text-ink/60">
          Export Style Result
        </h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-rainbow-lemon hover:bg-rainbow-lemon/90 text-ink border-2 border-ink shadow-brutalSm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none font-heading font-black py-1.5 px-4 text-xs tracking-wider uppercase transition-all select-none rounded-none"
        >
          {isOpen ? "✕ CLOSE EXPORT" : "📦 EXPORT STYLE"}
        </button>
      </div>

      {isOpen && (
        <div className="border-brutal bg-white p-6 sm:p-8 shadow-brutal flex flex-col gap-6 rounded-none transition-all duration-200">
          <div className="flex flex-col gap-2">
            <span className="font-mono-custom text-xs uppercase tracking-wider text-ink/50">
              Select Export Format
            </span>
            {/* Sliding Switch-like Tabs bar */}
            <div className="relative flex border-2 border-ink bg-paper p-1 rounded-none select-none max-w-xs overflow-hidden">
              {/* Sliding Background */}
              <div
                className="absolute top-1 bottom-1 left-1 bg-rainbow-lime border-2 border-ink transition-transform duration-300 ease-out"
                style={{
                  width: "calc(50% - 4px)",
                  transform:
                    activeTab === "json"
                      ? "translateX(100%)"
                      : "translateX(0%)",
                }}
              />

              <button
                onClick={() => setActiveTab("css")}
                className="relative z-10 w-1/2 py-1.5 text-xs font-heading font-black uppercase text-center transition-colors text-ink select-none focus:outline-none"
              >
                CSS Variables
              </button>

              <button
                onClick={() => setActiveTab("json")}
                className="relative z-10 w-1/2 py-1.5 text-xs font-heading font-black uppercase text-center transition-colors text-ink select-none focus:outline-none"
              >
                JSON Data
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {activeTab === "css" ? (
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <pre className="border-2 border-ink bg-[#1E1E1E] text-[#D4D4D4] p-4 font-mono-custom text-xs sm:text-sm overflow-x-auto whitespace-pre rounded-none">
                    {cssString}
                  </pre>
                </div>
                <div>
                  <button
                    onClick={handleCopyCSS}
                    className="w-full sm:w-auto bg-rainbow-sky text-ink border-2 border-ink shadow-brutalSm hover:bg-rainbow-sky/95 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none font-heading font-black py-2 px-6 uppercase text-xs select-none rounded-none transition-all"
                  >
                    {copied ? "✓ Copied to Clipboard!" : "📋 Copy CSS to Clipboard"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <pre className="border-2 border-ink bg-[#1E1E1E] text-[#D4D4D4] p-4 font-mono-custom text-xs sm:text-sm overflow-y-auto max-h-60 overflow-x-auto whitespace-pre rounded-none">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
                <div>
                  <button
                    onClick={handleDownloadJSON}
                    className="w-full sm:w-auto bg-rainbow-tangerine text-ink border-2 border-ink shadow-brutalSm hover:bg-rainbow-tangerine/95 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none font-heading font-black py-2 px-6 uppercase text-xs select-none rounded-none transition-all"
                  >
                    📥 Download JSON File
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
