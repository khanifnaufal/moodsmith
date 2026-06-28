"use client";

import { useState } from "react";

interface ShareButtonProps {
  resultId: string;
}

export default function ShareButton({ resultId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/p/${resultId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error("Failed to copy share link:", err);
    }
  };

  return (
    <button
      id="share-btn"
      onClick={handleShare}
      aria-label="Copy share link"
      className={`
        inline-flex items-center gap-2
        font-heading font-black text-xs uppercase tracking-wider
        border-brutal px-4 py-2.5
        transition-all duration-100 select-none
        ${
          copied
            ? "bg-rainbow-lime text-ink shadow-none translate-x-[2px] translate-y-[2px]"
            : "bg-paper text-ink shadow-brutal hover:-translate-y-[1px] hover:shadow-brutal-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        }
      `}
    >
      {copied ? (
        <>
          {/* Checkmark icon */}
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-check-bounce"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Link Copied!
        </>
      ) : (
        <>
          {/* Link icon */}
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          Share
        </>
      )}
    </button>
  );
}
