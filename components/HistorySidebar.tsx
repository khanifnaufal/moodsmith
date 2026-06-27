import React from "react";
import { MoodResult } from "@/types";

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: MoodResult[];
  onDelete: (id: string) => void;
  onSelect: (item: MoodResult) => void;
}

export default function HistorySidebar({
  isOpen,
  onClose,
  history,
  onDelete,
  onSelect,
}: HistorySidebarProps) {
  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-ink/40 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Collapsible Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[320px] max-w-[85vw] bg-paper border-r-[3px] border-ink z-50 shadow-brutal transform transition-transform duration-300 ease-in-out flex flex-col rounded-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="bg-rainbow-tangerine border-b-brutal p-4 flex justify-between items-center shrink-0">
          <h2 className="font-heading font-black text-lg uppercase tracking-tight text-ink">
            PAST MOODS
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 border-brutal bg-white hover:bg-rainbow-coral text-ink font-bold flex items-center justify-center transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shadow-[1px_1px_0_#161616]"
            title="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Sidebar Scroll Content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {history.length === 0 ? (
            <div className="border-brutal border-dashed bg-white p-6 text-center shadow-brutal-sm rounded-none">
              <p className="font-mono-custom text-xs text-ink/60">
                No history yet.<br />Generate a style to get started!
              </p>
            </div>
          ) : (
            history.map((item) => {
              const dateStr = item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Unknown date";

              return (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelect(item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(item);
                    }
                  }}
                  className="border-brutal bg-white p-3 shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_#161616] cursor-pointer transition-all flex flex-col gap-3 group rounded-none"
                >
                  {/* Card Header: Prompt + Delete */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-col min-w-0">
                      <span
                        className="font-heading font-black text-sm uppercase text-ink truncate max-w-[200px]"
                        title={item.moodInput}
                      >
                        {item.moodInput}
                      </span>
                      <span className="font-mono-custom text-[10px] text-ink/50 uppercase">
                        Palette: {item.palette.name}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      className="w-5 h-5 border border-ink bg-rainbow-coral hover:bg-rainbow-coral/90 text-ink text-xs font-bold flex items-center justify-center shadow-[1px_1px_0_#161616] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all shrink-0"
                      title="Delete from history"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Mini Swatches */}
                  <div className="flex gap-1">
                    {item.palette.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 border border-ink"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>

                  {/* Card Footer: Fonts & Date */}
                  <div className="flex justify-between items-center border-t border-dashed border-ink/20 pt-2 text-[9px] font-mono-custom text-ink/60">
                    <span className="truncate max-w-[140px]" title={`${item.font.heading} + ${item.font.body}`}>
                      {item.font.heading} + {item.font.body}
                    </span>
                    <span className="shrink-0">{dateStr}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
