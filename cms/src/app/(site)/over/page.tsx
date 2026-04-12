import Link from "next/link";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/site";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("over");
  if (!page) return {};
  return {
    title: page.meta_title ?? page.title,
    description: page.meta_desc ?? undefined,
  };
}

const waarden = [
  { num: "01", title: "Persoonlijke aandacht", body: "Elk project begint met een goed gesprek. Ik leer uw bedrijf kennen zodat de teksten echt van u zijn." },
  { num: "02", title: "Authenticiteit voorop", body: "Alles wordt eerst door u goedgekeurd. Uw eigen stijl en stem blijven altijd het vertrekpunt." },
  { num: "03", title: "Helder en direct", body: "Geen wollige zinnen of jargon — alleen heldere teksten die uw doelgroep direct aanspreken." },
];

export default async function OverPage() {
  const page = await getPage("over");
  if (!page) notFound();

  const c = (page.content ?? {}) as Record<string, string>;

  return (
    <>
      <section className="bg-[var(--color-surface-container-low)] pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-6 space-y-5">
          <p className="font-[var(--font-label)] text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-primary)]">Over ons</p>
          <h1 className="font-[var(--font-headline)] text-5xl md:text-[4.5rem] font-bold italic text-[var(--color-on-surface)] leading-tight max-w-[20ch]">
            {c.hero_heading}
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="bg-[var(--color-surface)] py-28">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[3fr_2fr] gap-20 items-start">
          <div className="space-y-7">
            <p className="font-[var(--font-label)] text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-primary)]">Het verhaal</p>
            <h2 className="font-[var(--font-headline)] text-4xl font-bold italic text-[var(--color-on-surface)] leading-tight">{c.story_heading}</h2>
            <p className="text-[var(--color-on-surface-variant)] leading-relaxed max-w-[60ch]">{c.story_body_1}</p>
            <p className="text-[var(--color-on-surface-variant)] leading-relaxed max-w-[60ch]">{c.story_body_2}</p>
            <blockquote className="py-6 border-t border-b border-[var(--color-outline-variant)]/40">
              <p className="font-[var(--font-headline)] text-xl italic text-[var(--color-on-surface)] leading-snug max-w-[52ch]">
                &ldquo;{c.quote}&rdquo;
              </p>
            </blockquote>
          </div>
          <div className="relative md:sticky md:top-24">
            <div className="aspect-[3/4] rounded-[var(--radius-brand)] overflow-hidden bg-[var(--color-surface-container)]">
              {c.founder_image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.founder_image} alt={c.founder_name} className="w-full h-full object-cover object-top" />
              )}
            </div>
            <div className="absolute -bottom-4 -right-4 bg-[var(--color-surface-container-lowest)] rounded-[var(--radius-brand)] px-5 py-4 shadow-[0_16px_48px_color-mix(in_srgb,var(--color-primary)_10%,transparent)]">
              <p className="font-[var(--font-headline)] font-bold italic text-[var(--color-on-surface)]">{c.founder_name}</p>
              <p className="text-xs font-[var(--font-label)] uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)] mt-0.5">{c.founder_role}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values — editorial numbered list */}
      <section className="bg-[var(--color-surface-container-low)] py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14 space-y-3 max-w-xl">
            <p className="font-[var(--font-label)] text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-primary)]">Kernwaarden</p>
            <h2 className="font-[var(--font-headline)] text-4xl font-bold italic text-[var(--color-on-surface)]">{c.values_heading}</h2>
          </div>
          <div className="space-y-0">
            {waarden.map(({ num, title, body }, i) => (
              <div
                key={num}
                className={`grid md:grid-cols-[80px_1fr_2fr] gap-6 md:gap-12 items-start py-10 ${
                  i < waarden.length - 1 ? "border-b border-[var(--color-outline-variant)]/40" : ""
                }`}
              >
                <span className="font-[var(--font-headline)] text-5xl font-bold italic text-[var(--color-outline-variant)] leading-none select-none">
                  {num}
                </span>
                <h3 className="font-[var(--font-headline)] text-xl font-bold italic text-[var(--color-on-surface)] mt-1">{title}</h3>
                <p className="text-[var(--color-on-surface-variant)] leading-relaxed max-w-[60ch]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--color-surface)] py-24">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <h2 className="font-[var(--font-headline)] text-3xl font-bold italic text-[var(--color-on-surface)] max-w-md">{c.cta_heading}</h2>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/contact"
              className="inline-flex items-center bg-[var(--color-secondary)] text-[var(--color-on-secondary)] text-xs font-semibold uppercase tracking-[0.15em] px-7 py-3.5 rounded-[var(--radius-brand)] hover:bg-[var(--color-secondary-container)] active:scale-[0.97] transition-all duration-150 font-[var(--font-label)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-secondary)]"
            >
              Neem contact op
            </Link>
            <Link
              href="/diensten"
              className="inline-flex items-center border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] text-xs font-semibold uppercase tracking-[0.15em] px-7 py-3.5 rounded-[var(--radius-brand)] hover:border-[var(--color-outline)] hover:text-[var(--color-on-surface)] active:scale-[0.97] transition-all duration-150 font-[var(--font-label)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              Bekijk diensten
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
