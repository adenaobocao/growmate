"use client";

import { useRouter } from "next/navigation";

export function PlantsTabToggle({ activeTab }: { activeTab: string }) {
  const router = useRouter();

  return (
    <div className="flex gap-1 bg-grow-surface-alt border border-grow-border rounded-2xl p-1 mb-3">
      <button
        onClick={() => router.push("/plants?tab=ativas")}
        className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
          activeTab === "ativas"
            ? "bg-grow-primary/15 text-grow-primary shadow-sm"
            : "text-grow-muted hover:text-grow-text"
        }`}
      >
        Ativas
      </button>
      <button
        onClick={() => router.push("/plants?tab=arquivo")}
        className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
          activeTab === "arquivo"
            ? "bg-grow-primary/15 text-grow-primary shadow-sm"
            : "text-grow-muted hover:text-grow-text"
        }`}
      >
        Arquivo
      </button>
    </div>
  );
}
