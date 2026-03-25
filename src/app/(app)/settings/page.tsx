import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const plan = subscription?.plan || "FREE";

  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-4 pb-24 flex flex-col gap-3">
        <div className="text-[10px] text-grow-muted font-bold uppercase tracking-wider mb-1">
          configuracoes
        </div>

        {/* Profile card */}
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-grow-primary/10 border border-grow-primary/20 flex items-center justify-center text-lg flex-shrink-0">
              {profile?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-grow-text truncate">{profile?.name || "Usuario"}</div>
              <div className="text-[11px] text-grow-muted truncate">{user!.email}</div>
            </div>
          </div>
        </div>

        {/* Plan card */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-grow-muted font-bold uppercase tracking-wider">Plano atual</div>
              <div className="text-sm font-bold text-grow-text mt-1">
                {plan === "PRO" ? (
                  <span className="text-grow-primary">PRO</span>
                ) : (
                  "Gratuito"
                )}
              </div>
              <div className="text-[10px] text-grow-muted mt-1">
                {plan === "FREE" ? "1 planta, 10 msgs/dia" : "6 plantas, msgs ilimitadas"}
              </div>
            </div>
            {plan === "FREE" && (
              <a
                href="/upgrade"
                className="btn-primary px-4 py-2 text-[11px] no-underline"
              >
                Fazer upgrade
              </a>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="card flex flex-col gap-0">
          <button className="flex items-center gap-3 py-3 px-1 border-b border-grow-border text-left w-full">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5a7a62" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="text-xs font-semibold text-grow-text">Editar perfil</span>
          </button>

          <button className="flex items-center gap-3 py-3 px-1 border-b border-grow-border text-left w-full">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5a7a62" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-xs font-semibold text-grow-text">Suporte</span>
          </button>

          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
