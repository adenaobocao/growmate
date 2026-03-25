import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ChatUI } from "@/components/chat/chat-ui";
import { PLAN_LIMITS } from "@/lib/constants";
import type { ChatMessage, Plant } from "@/types/database";

export default async function ChatPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Load last 50 messages
  const { data: messages } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(50);

  // Load active plants for context
  const { data: plants } = await supabase
    .from("plants")
    .select("id, name, strain, phase, substrate, gen_type, health, start_date")
    .eq("user_id", user.id)
    .eq("archived", false)
    .order("created_at", { ascending: false });

  // Get subscription plan
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const plan = sub?.plan || "FREE";

  // Get today's usage count
  const today = new Date().toISOString().split("T")[0];
  const { count: todayCount } = await supabase
    .from("chat_messages")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("role", "user")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`);

  return (
    <ChatUI
      initialMessages={(messages as ChatMessage[]) || []}
      plants={(plants as Plant[]) || []}
      plan={plan as "FREE" | "PRO"}
      todayUsage={todayCount || 0}
      maxMessages={PLAN_LIMITS[plan as "FREE" | "PRO"].maxMessagesPerDay}
    />
  );
}
