import Link from "next/link";
import { GUIDES } from "@/lib/guides-content";

const ICON_BG: Record<string, string> = {
  setup: "bg-grow-primary/10",
  phases: "bg-green-500/10",
  nutrients: "bg-amber-500/10",
  diseases: "bg-rose-500/10",
  training: "bg-sky-500/10",
  harvest: "bg-purple-500/10",
};

const ICON_COLOR: Record<string, string> = {
  setup: "text-grow-primary",
  phases: "text-green-400",
  nutrients: "text-amber-400",
  diseases: "text-rose-400",
  training: "text-sky-400",
  harvest: "text-purple-400",
};

export default function GuidesPage() {
  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-4 pb-24">
        <div className="text-[10px] text-grow-muted font-bold uppercase tracking-wider mb-3">
          guias de cultivo
        </div>
        <div className="flex flex-col gap-2">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="bg-grow-surface-alt border border-grow-border rounded-2xl p-3.5 flex items-center gap-3 hover:bg-grow-tint transition-colors no-underline w-full"
            >
              <div
                className={`w-11 h-11 rounded-[15px] flex-shrink-0 flex items-center justify-center text-sm font-black ${ICON_BG[guide.slug] || "bg-grow-primary/10"} ${ICON_COLOR[guide.slug] || "text-grow-primary"}`}
              >
                {guide.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-grow-text">
                  {guide.title}
                </div>
                <div className="text-[11px] text-grow-muted font-medium mt-0.5 leading-relaxed">
                  {guide.desc}
                </div>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-grow-tertiary flex-shrink-0"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
