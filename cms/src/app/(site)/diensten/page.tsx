import Link from "next/link";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/site";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("diensten");
  if (!page) return {};
  return {
    title: page.meta_title ?? page.title,
    description: page.meta_desc ?? undefined,
  };
}

const diensten = [
  {
    tag: "01",
    title: "Strategische copywriting",
    subtitle: "Webcontent & SEO",
    body: "Merken helpen hun unieke stem te vinden en te versterken — van websiteteksten en whitepapers tot direct response en brand storytelling.",
    items: ["Webcontent & SEO-geoptimaliseerde artikelen", "Brand storytelling & missie/visie", "Direct response & salesteksten", "AI-prompts op maat"],
  },
  {
    tag: "02",
    title: "Tekstredactie & revisie",
    subtitle: "Kwaliteitsborging",
    body: "Professionele redactie en proeflezen om uw documenten te polijsten op helderheid, nauwkeurigheid en publicatiegereedheid.",
    items: ["Grondige eindredactie", "Stijl- en taalcorrectie", "Proeflezen voor publicatie", "Revisie van webteksten"],
  },
  {
    tag: "03",
    title: "Quickscan website",
    subtitle: "Gratis & vrijblijvend",
    body: "Een frisse blik op uw website. De scan kijkt naar leesbaarheid, doelgroep, online vindbaarheid en geeft concrete aanbevelingen.",
    items: ["Leesbaarheid & structuur", "Doelgroepgerichtheid", "Online vindbaarheid (SEO)", "Concrete verbeterpunten"],
  },
  {
    tag: "04",
    title: "Zoekwoorden- & doelgroeponderzoek",
    subtitle: "Strategie",
    body: "Wie zoekt naar uw dienst, en hoe? Met gerichte keyword research en doelgroepanalyse zorgen we dat de juiste mensen u vinden.",
    items: ["Keyword research", "Concurrentieanalyse", "Doelgroepprofilering", "Contentstrategie op maat"],
  },
];

export default async function DienstenPage() {
  const page = await getPage("diensten");
  if (!page) notFound();

  const c = (page.content ?? {}) as Record<string, string>;

  return (
    <>
      <section className="bg-[var(--color-surface-container-low)] pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-6 space-y-5">
          <p className="font-[var(--font-label)] text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-primary)]">Wat ik doe</p>
          <h1 className="font-[var(--font-headline)] text-5xl md:text-[4.5rem] font-bold italic text-[var(--color-on-surface)] leading-tight max-w-[16ch]">
            {c.hero_heading}
          </h1>
          <p className="text-lg text-[var(--color-on-surface-variant)] max-w-[52ch] leading-relaxed pt-2">
            {c.hero_body}
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-surface)] py-20">
        <div className="max-w-6xl mx-auto px-6 space-y-0">
          {diensten.map(({ tag, title, subtitle, body, items }, i) => (
            <div
              key={tag}
              className={`grid md:grid-cols-[120px_1fr_1fr] gap-8 md:gap-16 py-14 ${
                i < diensten.length - 1 ? "border-b border-[var(--color-outline-variant)]/40" : ""
              }`}
            >
              <div className="space-y-2 pt-1">
                <span className="font-[var(--font-headline)] text-4xl font-bold italic text-[var(--color-outline-variant)] leading-none tabular-nums">
                  {tag}
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-secondary)] font-[var(--font-label)] pt-3">
                  {subtitle}
                </p>
              </div>
              <div className="space-y-3">
                <h2 className="font-[var(--font-headline)] text-2xl font-bold italic text-[var(--color-on-surface)]">
                  {title}
                </h2>
                <p className="text-[var(--color-on-surface-variant)] leading-relaxed max-w-[52ch]">
                  {body}
                </p>
              </div>
              <ul className="space-y-3 pt-1">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--color-on-surface-variant)]">
                    <span className="w-4 h-4 rounded-full border border-[var(--color-primary)]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-surface-container-low)] py-24">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="space-y-3 max-w-lg">
            <h2 className="font-[var(--font-headline)] text-3xl font-bold italic text-[var(--color-on-surface)]">{c.cta_heading}</h2>
            <p className="text-[var(--color-on-surface-variant)] leading-relaxed">{c.cta_body}</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center bg-[var(--color-secondary)] text-[var(--color-on-secondary)] text-xs font-semibold uppercase tracking-[0.15em] px-8 py-4 rounded-[var(--radius-brand)] hover:bg-[var(--color-secondary-container)] active:scale-[0.97] transition-all duration-150 font-[var(--font-label)] flex-shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-secondary)]"
          >
            Start een project
          </Link>
        </div>
      </section>
    </>
  );
}
