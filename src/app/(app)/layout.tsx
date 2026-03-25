import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full max-w-[430px] min-h-screen flex flex-col relative z-10">
        <Header />
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
        <BottomNav />
      </div>

      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -left-[8vw] -top-[8vw] w-[55vw] h-[55vw] rounded-full blur-[90px] opacity-[0.12] bg-grow-primary/25" />
        <div className="absolute -right-[8vw] -bottom-[8vw] w-[55vw] h-[55vw] rounded-full blur-[90px] opacity-[0.12] bg-grow-secondary/15" />
      </div>
    </div>
  );
}
