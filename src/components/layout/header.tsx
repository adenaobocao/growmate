"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

const PAGE_SUBS: Record<string, string> = {
  "/": "ia . assistente",
  "/chat": "ia . assistente",
  "/setup": "set & setup",
  "/plants": "minhas plantas",
  "/diary": "diario de cultivo",
  "/guides": "guias de cultivo",
  "/settings": "configuracoes",
  "/upgrade": "plano pro",
};

export function Header() {
  const pathname = usePathname();
  const subtitle = PAGE_SUBS[pathname] || "growmate";

  return (
    <header className="flex-shrink-0 bg-grow-surface backdrop-blur-[26px] border-b border-grow-border rounded-b-3xl px-[18px] pt-4 pb-3 shadow-lg z-20 transition-colors">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] rounded-[11px] overflow-hidden flex-shrink-0">
            <Image src="/bud.png" alt="" width={30} height={30} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-display text-base font-black text-grow-primary lowercase leading-none tracking-tight">
              growmate
            </div>
            <div className="text-[9px] text-grow-muted font-bold tracking-wider lowercase mt-0.5">
              {subtitle}
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/settings"
            className="w-9 h-9 rounded-xl border border-grow-border-strong bg-grow-tint flex items-center justify-center text-grow-muted hover:text-grow-primary transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
