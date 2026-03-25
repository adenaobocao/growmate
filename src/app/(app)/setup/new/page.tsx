import Link from "next/link";
import { SetupForm } from "@/components/setup/setup-form";

export default function NewSetupPage() {
  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-4 pb-24">
        <Link
          href="/setup"
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
          novo setup
        </div>

        <SetupForm />
      </div>
    </div>
  );
}
