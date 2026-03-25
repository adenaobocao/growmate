"use client";

import Link from "next/link";
import type { Setup } from "@/types/database";

const GROW_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  INDOOR: { label: "Indoor", color: "bg-blue-500/15 text-blue-400 border-blue-500/25" },
  OUTDOOR: { label: "Outdoor", color: "bg-amber-500/15 text-amber-400 border-amber-500/25" },
  GREENHOUSE: { label: "Greenhouse", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" },
};

interface SetupCardProps {
  setup: Setup & {
    _counts?: {
      lights: number;
      soils: number;
      vents: number;
      ferts: number;
    };
  };
}

export function SetupCard({ setup }: SetupCardProps) {
  const growInfo = GROW_TYPE_LABELS[setup.grow_type || "INDOOR"] || GROW_TYPE_LABELS.INDOOR;
  const counts = setup._counts || { lights: 0, soils: 0, vents: 0, ferts: 0 };

  const hasDimensions =
    setup.tent_width_cm && setup.tent_depth_cm && setup.tent_height_cm;

  return (
    <Link href={`/setup/${setup.id}`} className="block">
      <div className="card hover:border-grow-border-strong transition-colors animate-fade-in">
        {/* Top row: name + grow type badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-grow-text truncate">
              {setup.name}
            </h3>
            {hasDimensions && (
              <p className="text-[10px] text-grow-muted font-semibold mt-0.5">
                {setup.tent_width_cm} x {setup.tent_depth_cm} x {setup.tent_height_cm} cm
              </p>
            )}
          </div>
          <span
            className={`flex-shrink-0 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-xl border ${growInfo.color}`}
          >
            {growInfo.label}
          </span>
        </div>

        {/* Location */}
        {(setup.city || setup.state) && (
          <p className="text-[10px] text-grow-muted font-semibold mb-2.5 flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {[setup.city, setup.state].filter(Boolean).join(", ")}
          </p>
        )}

        {/* Item counts */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {counts.lights > 0 && (
            <span className="text-[9px] font-bold text-grow-muted bg-grow-tint px-2 py-0.5 rounded-lg">
              {counts.lights} luz{counts.lights !== 1 ? "es" : ""}
            </span>
          )}
          {counts.soils > 0 && (
            <span className="text-[9px] font-bold text-grow-muted bg-grow-tint px-2 py-0.5 rounded-lg">
              {counts.soils} substrato{counts.soils !== 1 ? "s" : ""}
            </span>
          )}
          {counts.vents > 0 && (
            <span className="text-[9px] font-bold text-grow-muted bg-grow-tint px-2 py-0.5 rounded-lg">
              {counts.vents} vent.
            </span>
          )}
          {counts.ferts > 0 && (
            <span className="text-[9px] font-bold text-grow-muted bg-grow-tint px-2 py-0.5 rounded-lg">
              {counts.ferts} nutri.
            </span>
          )}
          {counts.lights === 0 && counts.soils === 0 && counts.vents === 0 && counts.ferts === 0 && (
            <span className="text-[9px] font-semibold text-grow-muted italic">
              Nenhum item configurado
            </span>
          )}
          {setup.max_plants && (
            <span className="text-[9px] font-bold text-grow-muted bg-grow-tint px-2 py-0.5 rounded-lg ml-auto">
              max {setup.max_plants} plantas
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
