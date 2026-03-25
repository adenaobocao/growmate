import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DiaryCard } from "@/components/diary/diary-card";
import type { DiaryEntry } from "@/types/database";

export default async function DiaryPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch plants for filter
  const { data: plants } = await supabase
    .from("plants")
    .select("id, name")
    .eq("user_id", user!.id)
    .eq("archived", false)
    .order("name");

  // Fetch diary entries with plant name
  const { data: entries } = await supabase
    .from("diary_entries")
    .select("*, plants(name)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(50);

  type EntryRow = DiaryEntry & { plants: { name: string } | null };
  const diaryEntries = (entries as EntryRow[] || []).map((e) => ({
    ...e,
    plant_name: e.plants?.name || undefined,
  }));

  const hasPlants = (plants || []).length > 0;
  const hasEntries = diaryEntries.length > 0;

  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-4 pb-24">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] text-grow-muted font-bold uppercase tracking-wider">
            diario de cultivo
          </div>
          {hasPlants && (
            <Link
              href="/diary/new"
              className="btn-primary px-3 py-1.5 text-[10px] flex items-center gap-1.5 no-underline"
            >
              <svg
                width="12"
                height="12"
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
              Novo registro
            </Link>
          )}
        </div>

        {!hasPlants ? (
          <div className="empty-state">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-grow-muted/40 mx-auto mb-3"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <p className="text-xs text-grow-muted font-semibold">
              Cadastre uma planta primeiro para usar o diario.
            </p>
            <Link
              href="/plants/new"
              className="btn-primary px-4 py-2 text-[11px] mt-3 inline-block no-underline"
            >
              Criar planta
            </Link>
          </div>
        ) : !hasEntries ? (
          <div className="empty-state">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-grow-muted/40 mx-auto mb-3"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <p className="text-xs text-grow-muted font-semibold">
              Nenhum registro ainda. Comece documentando seu cultivo!
            </p>
            <Link
              href="/diary/new"
              className="btn-primary px-4 py-2 text-[11px] mt-3 inline-block no-underline"
            >
              Primeiro registro
            </Link>
          </div>
        ) : (
          /* Timeline */
          <div className="relative pl-5 border-l-2 border-grow-border space-y-3">
            {diaryEntries.map((entry) => (
              <DiaryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
