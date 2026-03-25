import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuideBySlug, GUIDES } from "@/lib/guides-content";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export default function GuideDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();

  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-4 pb-24">
        <Link
          href="/guides"
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
          Guias
        </Link>

        <h1 className="text-page-title mb-1">{guide.title}</h1>
        <p className="text-body-sm mb-4">{guide.desc}</p>

        <div className="space-y-4">
          {guide.sections.map((section, i) => (
            <div key={i} className="card">
              <h2 className="text-section-title mb-2">{section.heading}</h2>
              <div className="text-[12.5px] text-grow-text/85 leading-relaxed whitespace-pre-wrap">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
