import Link from "next/link";
import { NewPostForm } from "@/components/feed/new-post-form";

export default function NewPostPage() {
  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-4 pb-24">
        <Link
          href="/feed"
          className="flex items-center gap-1.5 text-[11px] text-grow-muted font-semibold mb-3 no-underline hover:text-grow-primary transition-colors"
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
          novo post
        </div>

        <NewPostForm />
      </div>
    </div>
  );
}
