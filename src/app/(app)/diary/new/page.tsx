import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DiaryForm } from "@/components/diary/diary-form";

export default async function NewDiaryEntryPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plants } = await supabase
    .from("plants")
    .select("*")
    .eq("user_id", user!.id)
    .eq("archived", false)
    .order("name");

  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-4 pb-24">
        <Link
          href="/diary"
          className="flex items-center gap-1.5 text-[11px] text-grow-muted font-semibold mb-3 no-underline hover:text-grow-primary transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Voltar
        </Link>

        <div className="text-[10px] text-grow-muted font-bold uppercase tracking-wider mb-3">
          novo registro
        </div>

        <DiaryForm plants={plants || []} />
      </div>
    </div>
  );
}
