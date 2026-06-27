"use client";

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
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-ink/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <aside
        id="history-sidebar"
        role="dialog"
        aria-modal="true"
        aria-label="Past moods history"
        className={`fixed top-0 left-0 h-full w-[300px] max-w-[85vw] bg-paper z-50 flex flex-col border-r-brutal shadow-brutalLg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header — dark bar */}
        <div className="bg-ink text-paper border-b-brutal flex items-center justify-between px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            {/* Clock icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <h2 className="font-heading font-black text-sm uppercase tracking-wider">
              Past Moods
            </h2>
            <span className="font-mono-custom text-[10px] text-paper/50 ml-1">
              ({history.length})
            </span>
          </div>

          {/* Close button */}
          <button
            id="close-history-btn"
            onClick={onClose}
            className="w-7 h-7 border-2 border-paper/60 text-paper hover:bg-paper hover:text-ink flex items-center justify-center transition-all active:scale-90 flex-shrink-0"
            aria-label="Close history"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
          {history.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center gap-3 mt-12 px-4 text-center">
              {/* Empty doodle SVG */}
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink/20" aria-hidden="true">
                <rect x="8" y="12" width="32" height="26" rx="2" />
                <line x1="14" y1="20" x2="34" y2="20" />
                <line x1="14" y1="26" x2="28" y2="26" />
                <line x1="14" y1="32" x2="22" y2="32" />
                <path d="M30 4L24 12" />
                <path d="M18 4L24 12" />
              </svg>
              <p className="font-mono-custom text-xs text-ink/40 leading-relaxed">
                No history yet.<br />
                Generate a style to get started.
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
                : "—";

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
                  className="border-brutal bg-white shadow-brutalXs hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none cursor-pointer transition-all flex flex-col group overflow-hidden"
                >
                  {/* Mini palette color bar — full width, 8px tall */}
                  <div className="flex h-2 w-full flex-shrink-0" aria-hidden="true">
                    {item.palette.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="flex-1"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  {/* Card body */}
                  <div className="p-3 flex flex-col gap-2">
                    {/* Card header: prompt + delete */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col min-w-0">
                        <span
                          className="font-heading font-black text-xs uppercase text-ink truncate max-w-[180px] leading-tight"
                          title={item.moodInput}
                        >
                          {item.moodInput}
                        </span>
                        <span className="font-mono-custom text-[9px] text-ink/40 uppercase tracking-wider mt-0.5">
                          {item.palette.name}
                        </span>
                      </div>

                      {/* Delete button with SVG X */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id);
                        }}
                        className="w-5 h-5 border border-ink bg-paper hover:bg-rainbow-coral text-ink flex items-center justify-center shadow-brutalXs active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex-shrink-0"
                        title="Delete from history"
                        aria-label={`Delete ${item.moodInput} from history`}
                      >
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>

                    {/* Footer: fonts + date */}
                    <div className="flex justify-between items-center border-t border-dashed border-ink/20 pt-2 text-[9px] font-mono-custom text-ink/50">
                      <span className="truncate max-w-[130px]" title={`${item.font.heading} + ${item.font.body}`}>
                        {item.font.heading} + {item.font.body}
                      </span>
                      <span className="flex-shrink-0">{dateStr}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
}
