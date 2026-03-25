"use client";

import { useState, type ReactNode } from "react";

interface SetupSectionProps {
  title: string;
  count: number;
  children: ReactNode;
  onAdd: () => void;
  addLabel?: string;
}

export function SetupSection({
  title,
  count,
  children,
  onAdd,
  addLabel = "Adicionar",
}: SetupSectionProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="card mb-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 bg-transparent border-0 cursor-pointer p-0"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-grow-muted transition-transform ${expanded ? "rotate-90" : ""}`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-[10px] text-grow-muted font-bold uppercase tracking-wider">
            {title}
          </span>
          <span className="text-[9px] font-bold text-grow-primary bg-grow-primary/10 px-1.5 py-0.5 rounded-lg min-w-[18px] text-center">
            {count}
          </span>
        </button>

        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1 text-[10px] font-bold text-grow-primary bg-grow-tint hover:bg-grow-primary/15 px-2.5 py-1.5 rounded-xl border border-grow-border transition-colors cursor-pointer"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {addLabel}
        </button>
      </div>

      {/* Content */}
      {expanded && (
        <div className="space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}
