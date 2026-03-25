"use client";

import type { DiaryEntry, PlantPhase } from "@/types/database";
import { PLANT_PHASES } from "@/lib/constants";

const PHASE_COLORS: Record<PlantPhase, string> = {
  GERM: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  SEEDLING: "bg-lime-500/20 text-lime-400 border-lime-500/30",
  VEG: "bg-green-500/20 text-green-400 border-green-500/30",
  FLOWER: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  HARVEST: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  CURING: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

interface DiaryCardProps {
  entry: DiaryEntry & { plant_name?: string };
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: undefined,
  });
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "agora";
  if (diffMins < 60) return `${diffMins}min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d`;
  return formatDate(dateStr);
}

export function DiaryCard({ entry }: DiaryCardProps) {
  const phase = entry.phase_at_entry;
  const phaseColor = phase ? PHASE_COLORS[phase] : "";
  const phaseLabel = phase ? PLANT_PHASES[phase]?.label : null;

  return (
    <div className="card relative">
      {/* Timeline dot */}
      <div className="absolute -left-[25px] top-4 w-3 h-3 rounded-full bg-grow-primary border-2 border-grow-bg" />

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {entry.plant_name && (
            <span className="text-[10px] font-bold text-grow-primary uppercase tracking-wider">
              {entry.plant_name}
            </span>
          )}
          {phaseLabel && (
            <span
              className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${phaseColor}`}
            >
              {phaseLabel}
            </span>
          )}
        </div>
        <span className="text-[10px] text-grow-muted font-semibold">
          {timeAgo(entry.created_at)}
        </span>
      </div>

      {/* Photo */}
      {entry.photo_url && (
        <div className="mb-2 rounded-xl overflow-hidden border border-grow-border">
          <img
            src={entry.photo_url}
            alt="Foto do diario"
            className="w-full h-40 object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <p className="text-[13px] text-grow-text leading-relaxed whitespace-pre-wrap">
        {entry.content}
      </p>

      {/* Tags */}
      {entry.tags && entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-bold text-grow-muted bg-grow-tint px-2 py-0.5 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
