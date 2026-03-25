import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AddPlantForm } from "@/components/plants/add-plant-form";

export default async function NewPlantPage() {
  const supabase = createClient();

  // Check freemium limit
  let canCreate = true;
  try {
    const { data, error } = await supabase.rpc("can_create_plant");
    if (!error && data !== null) {
      canCreate = !!data;
    }
  } catch {
    // If RPC doesn't exist yet, allow creation
    canCreate = true;
  }

  if (!canCreate) {
    return (
      <div className="absolute inset-0 overflow-y-auto">
        <div className="px-4 py-4 pb-24">
          <Link
            href="/plants"
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

          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="text-4xl mb-4 opacity-60">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-grow-warning"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-grow-text mb-1">
              Limite atingido
            </h2>
            <p className="text-xs text-grow-muted text-center mb-5">
              Voce atingiu o limite de plantas do plano gratuito. Faca upgrade
              para o plano Pro e cultive ate 6 plantas.
            </p>
            <Link
              href="/upgrade"
              className="btn-primary px-7 flex items-center gap-2 text-xs"
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
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Fazer upgrade
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-4 pb-24">
        <Link
          href="/plants"
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
          nova planta
        </div>

        <AddPlantForm />
      </div>
    </div>
  );
}
