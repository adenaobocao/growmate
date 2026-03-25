"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV_ITEMS = [
  {
    href: "/",
    label: "IA",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
        <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "/setup",
    label: "Set",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/plants",
    label: "Planta",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 8" />
        <path d="M20.71 4.63A2 2 0 0 0 19 4h-1.5A4.5 4.5 0 0 0 13 8.5V9" />
      </svg>
    ),
  },
  {
    href: "/diary",
    label: "Diario",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    href: "/guides",
    label: "Manual",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="flex-shrink-0 bg-grow-bg/95 border-t border-grow-border backdrop-blur-[26px] pb-[calc(12px+env(safe-area-inset-bottom))] pt-2 px-2.5 z-20 relative">
      {/* Glow effect */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 120% at 50% 120%, rgb(var(--color-tint)), transparent 70%)"
      }} />

      <div className="w-full max-w-[430px] mx-auto flex justify-around relative z-10">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 px-1 transition-colors ${
                active ? "text-grow-text" : "text-grow-tertiary"
              }`}
            >
              <span className={`transition-transform ${active ? "scale-110" : ""}`}>
                {item.icon}
              </span>
              <span className="relative text-[9px] font-bold tracking-wider uppercase pb-1">
                {item.label}
                {active && (
                  <span className="absolute left-0 right-0 bottom-0 h-[2.5px] rounded-full bg-grow-primary shadow-[0_0_8px_rgb(var(--color-glow))]" />
                )}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
