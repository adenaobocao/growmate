import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { ThemeSection } from "./theme-section";
import { SettingsClient } from "@/components/settings/settings-client";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  const plan = (subscription?.plan || "FREE") as "FREE" | "PRO";

  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-4 pb-24 flex flex-col gap-3">
        <div className="text-[10px] text-grow-muted font-bold uppercase tracking-wider mb-1">
          configuracoes
        </div>

        <SettingsClient
          profileName={profile?.name || null}
          email={user!.email || ""}
          plan={plan}
        />

        {/* Theme */}
        <ThemeSection />

        {/* Actions */}
        <div className="card flex flex-col gap-0">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
