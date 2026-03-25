import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditPlantForm } from "@/components/plants/edit-plant-form";

export default async function EditPlantPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: plant } = await supabase
    .from("plants")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!plant) {
    notFound();
  }

  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-4 pb-24">
        <Link
          href={`/plants/${plant.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-grow-muted font-semibold mb-4 hover:text-grow-text transition-colors"
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
          editar planta
        </div>

        <EditPlantForm plant={plant} />
      </div>
    </div>
  );
}
