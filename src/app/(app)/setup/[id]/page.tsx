import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SetupDetailSections } from "@/components/setup/setup-detail-sections";

const GROW_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  INDOOR: { label: "Indoor", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  OUTDOOR: { label: "Outdoor", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  GREENHOUSE: { label: "Greenhouse", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
};

export default async function SetupDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: setup } = await supabase
    .from("setups")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!setup) {
    notFound();
  }

  // Fetch all related data in parallel
  const [lightsRes, soilsRes, ventsRes, fertsRes] = await Promise.all([
    supabase.from("lights").select("*").eq("setup_id", setup.id).order("created_at", { ascending: false }),
    supabase.from("soils").select("*").eq("setup_id", setup.id).order("created_at", { ascending: false }),
    supabase.from("vents").select("*").eq("setup_id", setup.id).order("created_at", { ascending: false }),
    supabase.from("ferts").select("*").eq("setup_id", setup.id).order("created_at", { ascending: false }),
  ]);

  const lights = lightsRes.data || [];
  const soils = soilsRes.data || [];
  const vents = ventsRes.data || [];
  const ferts = fertsRes.data || [];

  const growInfo = GROW_TYPE_LABELS[setup.grow_type || "INDOOR"] || GROW_TYPE_LABELS.INDOOR;
  const hasDimensions = setup.tent_width_cm && setup.tent_depth_cm && setup.tent_height_cm;

  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-4 pb-24">
        {/* Back + Edit */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/setup"
            className="inline-flex items-center gap-1.5 text-xs text-grow-muted font-semibold hover:text-grow-text transition-colors"
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
          <Link
            href={`/setup/${setup.id}/edit`}
            className="btn-ghost px-3 h-8 flex items-center gap-1.5 text-[10px]"
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
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Editar
          </Link>
        </div>

        {/* Setup info card */}
        <div className="card mb-3">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h1 className="text-lg font-bold text-grow-text">{setup.name}</h1>
              {(setup.city || setup.state) && (
                <p className="text-xs text-grow-muted font-semibold mt-0.5 flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {[setup.city, setup.state].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
            <span
              className={`flex-shrink-0 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xl border ${growInfo.color}`}
            >
              {growInfo.label}
            </span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {hasDimensions && (
              <div className="bg-grow-tint rounded-xl p-2 text-center">
                <span className="text-[8px] text-grow-muted font-bold uppercase tracking-wider block mb-0.5">
                  Dimensoes
                </span>
                <span className="text-[10px] font-bold text-grow-text">
                  {setup.tent_width_cm}x{setup.tent_depth_cm}x{setup.tent_height_cm}
                </span>
              </div>
            )}
            {setup.max_plants && (
              <div className="bg-grow-tint rounded-xl p-2 text-center">
                <span className="text-[8px] text-grow-muted font-bold uppercase tracking-wider block mb-0.5">
                  Max plantas
                </span>
                <span className="text-[10px] font-bold text-grow-text">
                  {setup.max_plants}
                </span>
              </div>
            )}
            {setup.tent_brand && (
              <div className="bg-grow-tint rounded-xl p-2 text-center">
                <span className="text-[8px] text-grow-muted font-bold uppercase tracking-wider block mb-0.5">
                  Marca
                </span>
                <span className="text-[10px] font-bold text-grow-text truncate block">
                  {setup.tent_brand}
                </span>
              </div>
            )}
            {setup.tent_type && (
              <div className="bg-grow-tint rounded-xl p-2 text-center">
                <span className="text-[8px] text-grow-muted font-bold uppercase tracking-wider block mb-0.5">
                  Tenda
                </span>
                <span className="text-[10px] font-bold text-grow-text truncate block">
                  {setup.tent_type}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sub-item sections */}
        <SetupDetailSections
          setupId={setup.id}
          lights={lights}
          soils={soils}
          vents={vents}
          ferts={ferts}
        />
      </div>
    </div>
  );
}
