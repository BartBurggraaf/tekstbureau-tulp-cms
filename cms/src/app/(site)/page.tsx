import Link from "next/link";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/site";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("home");
  if (!page) return {};
  return {
    title: page.meta_title ?? page.title,
    description: page.meta_desc ?? undefined,
  };
}

const valueProps = [
  { num: "01", title: "Creatieve invalshoeken", body: "Pakkende teksten die klanten trekken, zodat u zich kunt focussen op uw klant. Geen wollige zinnen — alleen taal die werkt." },
  { num: "02", title: "Uw stem, uw stijl", body: "Authenticiteit staat voorop. Alles wordt eerst door u goedgekeurd. Uw eigen toon blijft het vertrekpunt, altijd." },
  { num: "03", title: "Bijblijven loont", body: "Een frisse blik op uw teksten met concrete tips om uw publiek te bereiken. Actueel, helder en vindbaar." },
];

const offerings = [
  "Webcontent & SEO-artikelen",
  "Quickscan voor uw website",
  "AI-prompts voor uw bedrijf",
  "Redactie van bestaande teksten",
  "Website-optimalisatie",
  "Zoekwoorden- en doelgroeponderzoek",
];

export default async function HomePage() {
  const page = await getPage("home");
  if (!page) notFound();

  const c = (page.content ?? {}) as Record<string, string>;

  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--color-surface)] min-h-[100dvh] flex items-center">
        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-[3fr_2fr] gap-16 items-center">
          <div className="space-y-10">
            <p className="font-[var(--font-label)] text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-primary)]">
              Tekstbureau Tulp
            </p>
            <h1 className="font-[var(--font-headline)] text-5xl md:text-[4.5rem] font-bold leading-[1.02] text-[var(--color-on-surface)] italic">
              {c.hero_heading}
            </h1>
            <p className="text-lg text-[var(--color-on-surface-variant)] leading-relaxed max-w-[52ch]">
              {c.hero_body}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/diensten"
                className="inline-flex items-center bg-[var(--color-secondary)] text-[var(--color-on-secondary)] text-xs font-semibold uppercase tracking-[0.15em] px-7 py-3.5 rounded-[var(--radius-brand)] hover:bg-[var(--color-secondary-container)] active:scale-[0.97] transition-all duration-150 font-[var(--font-label)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-secondary)]"
              >
                {c.hero_cta_primary}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] text-xs font-semibold uppercase tracking-[0.15em] px-7 py-3.5 rounded-[var(--radius-brand)] hover:border-[var(--color-outline)] hover:text-[var(--color-on-surface)] active:scale-[0.97] transition-all duration-150 font-[var(--font-label)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
              >
                {c.hero_cta_secondary}
              </Link>
            </div>
          </div>
          <div className="relative hidden md:flex flex-col gap-4">
            <div className="aspect-[3/4] rounded-[var(--radius-brand)] overflow-hidden bg-[var(--color-surface-container)]">
              {c.hero_image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.hero_image} alt="Tekstbureau Tulp" className="w-full h-full object-cover" fetchPriority="high" decoding="async" />
              )}
            </div>
            <div className="absolute -bottom-4 -left-8 bg-[var(--color-surface-container-lowest)] rounded-[var(--radius-brand)] px-5 py-4 shadow-[0_16px_48px_color-mix(in_srgb,var(--color-primary)_12%,transparent)]">
              <p className="font-[var(--font-headline)] text-3xl font-bold text-[var(--color-primary)] italic tabular-nums">15+</p>
              <p className="text-xs font-[var(--font-label)] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)] mt-0.5">Jaren ervaring</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Tulp — editorial numbered list, not 3 equal cards */}
      <section className="cv-auto bg-[var(--color-surface-container-low)] py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 space-y-3 max-w-xl">
            <p className="font-[var(--font-label)] text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-primary)]">Waarom Tulp</p>
            <h2 className="font-[var(--font-headline)] text-4xl font-bold italic text-[var(--color-on-surface)]">{c.section_heading}</h2>
          </div>
          <div className="space-y-0">
            {valueProps.map(({ num, title, body }, i) => (
              <div
                key={num}
                className={`grid md:grid-cols-[80px_1fr_2fr] gap-6 md:gap-12 items-start py-10 ${
                  i < valueProps.length - 1 ? "border-b border-[var(--color-outline-variant)]/40" : ""
                }`}
              >
                <span className="font-[var(--font-headline)] text-5xl font-bold italic text-[var(--color-outline-variant)] leading-none select-none">
                  {num}
                </span>
                <h3 className="font-[var(--font-headline)] text-xl font-bold italic text-[var(--color-on-surface)] mt-1">
                  {title}
                </h3>
                <p className="text-[var(--color-on-surface-variant)] leading-relaxed max-w-[60ch]">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services overview */}
      <section className="cv-auto bg-[var(--color-surface)] py-28">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-start">
          <div className="space-y-6 md:sticky md:top-24">
            <p className="font-[var(--font-label)] text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-primary)]">Wat ik doe</p>
            <h2 className="font-[var(--font-headline)] text-4xl font-bold italic text-[var(--color-on-surface)] leading-tight">{c.services_heading}</h2>
            <p className="text-[var(--color-on-surface-variant)] leading-relaxed max-w-[52ch]">{c.services_body}</p>
            <Link
              href="/diensten"
              className="inline-flex items-center gap-2 text-[var(--color-primary)] text-xs font-semibold uppercase tracking-[0.2em] font-[var(--font-label)] pb-0.5 border-b border-[var(--color-primary-fixed)] hover:border-[var(--color-primary)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              Bekijk alle diensten →
            </Link>
          </div>
          <ul className="space-y-0 pt-2">
            {offerings.map((item, i) => (
              <li
                key={item}
                className={`flex items-center gap-5 py-5 ${
                  i < offerings.length - 1 ? "border-b border-[var(--color-outline-variant)]/40" : ""
                }`}
              >
                <span className="font-[var(--font-headline)] text-sm italic text-[var(--color-outline)] tabular-nums select-none w-6 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[var(--color-on-surface)]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="cv-auto bg-[var(--color-primary)] py-28">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[3fr_2fr] gap-12 items-center">
          <div className="space-y-5">
            <p className="font-[var(--font-label)] text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-primary-fixed)]">Gratis aangeboden</p>
            <h2 className="font-[var(--font-headline)] text-4xl md:text-5xl font-bold italic text-[var(--color-on-primary)] leading-tight">{c.cta_heading}</h2>
            <p className="text-[var(--color-on-primary)]/75 leading-relaxed max-w-[52ch]">{c.cta_body}</p>
          </div>
          <div className="flex md:justify-end">
            <Link
              href="/contact"
              className="inline-flex items-center bg-[var(--color-on-primary)] text-[var(--color-primary)] text-xs font-semibold uppercase tracking-[0.15em] px-8 py-4 rounded-[var(--radius-brand)] hover:bg-[var(--color-primary-fixed)] active:scale-[0.97] transition-all duration-150 font-[var(--font-label)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-on-primary)] whitespace-nowrap"
            >
              Vraag gratis quickscan aan
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
