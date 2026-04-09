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
  { tag: "01", title: "Strategische Copywriting", subtitle: "Webcontent & SEO", body: "Helps merken hun unieke stem vinden en versterken — van websiteteksten en whitepapers tot direct response en brand storytelling.", items: ["Webcontent & SEO-geoptimaliseerde artikelen", "Brand storytelling & missie/visie statements", "Direct response & salesteksten", "AI-prompts die werken voor uw bedrijf"] },
  { tag: "02", title: "Tekstredactie & Revisie", subtitle: "Kwaliteitsborging", body: "Professionele redactie en proeflezen om uw documenten te polijsten op helderheid, nauwkeurigheid en publicatiegereedheid.", items: ["Grondige eindredactie", "Stijl- en taalcorrectie", "Proeflezen voor publicatie", "Redactie van bestaande webteksten"] },
  { tag: "03", title: "Quickscan voor uw website", subtitle: "Gratis & vrijblijvend", body: "Een frisse blik op uw website. De scan kijkt naar leesbaarheid, doelgroep, online vindbaarheid, en geeft concrete aanbevelingen.", items: ["Leesbaarheid & structuur", "Doelgroepgerichtheid", "Online vindbaarheid (SEO)", "Kansen en verbeterpunten"] },
  { tag: "04", title: "Zoekwoorden- & doelgroeponderzoek", subtitle: "Strategie", body: "Wie zoekt naar uw dienst, en hoe? Met gerichte keyword research en doelgroepanalyse zorgen we dat de juiste mensen u vinden.", items: ["Keyword research", "Concurrentieanalyse", "Doelgroepprofilering", "Contentstrategie op maat"] },
];

export default async function DienstenPage() {
  const page = await getPage("diensten");
  if (!page) notFound();

  const c = (page.content ?? {}) as Record<string, string>;

  return (
    <>
      <section className="bg-[var(--color-surface-container-low)] py-24">
        <div className="max-w-6xl mx-auto px-6 space-y-4">
          <p className="font-[var(--font-label)] text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-primary)]">Wat ik doe</p>
          <h1 className="font-[var(--font-headline)] text-5xl md:text-6xl font-bold italic text-[var(--color-on-surface)] leading-tight max-w-2xl">{c.hero_heading}</h1>
          <p className="text-lg text-[var(--color-on-surface-variant)] max-w-xl leading-relaxed">{c.hero_body}</p>
        </div>
      </section>

      <section className="bg-[var(--color-surface)] py-24">
        <div className="max-w-6xl mx-auto px-6 space-y-6">
          {diensten.map(({ tag, title, subtitle, body, items }) => (
            <div key={tag} className="bg-[var(--color-surface-container-lowest)] rounded-[var(--radius-brand)] p-10 grid md:grid-cols-[1fr_2fr] gap-10 shadow-[0_4px_24px_rgba(0,32,30,0.04)]">
              <div className="space-y-3">
                <p className="font-[var(--font-label)] text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-outline)]">{tag}</p>
                <h2 className="font-[var(--font-headline)] text-2xl font-bold italic text-[var(--color-on-surface)]">{title}</h2>
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-[var(--color-secondary)] font-[var(--font-label)]">{subtitle}</span>
              </div>
              <div className="space-y-5">
                <p className="text-[var(--color-on-surface-variant)] leading-relaxed">{body}</p>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-[var(--color-on-surface-variant)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-surface-container-low)] py-24">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="space-y-2">
            <h2 className="font-[var(--font-headline)] text-3xl font-bold italic text-[var(--color-on-surface)]">{c.cta_heading}</h2>
            <p className="text-[var(--color-on-surface-variant)]">{c.cta_body}</p>
          </div>
          <Link href="/contact" className="inline-flex items-center bg-[var(--color-secondary)] text-[var(--color-on-secondary)] text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-[var(--radius-brand)] hover:bg-[var(--color-secondary-container)] transition-colors font-[var(--font-label)] flex-shrink-0">
            Start een project
          </Link>
        </div>
      </section>
    </>
  );
}
