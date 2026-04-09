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
  { title: "Creatieve invalshoeken", body: "We schrijven creatieve teksten die klanten trekken, zodat u zich kunt focussen op uw klant.", icon: "✦" },
  { title: "Laat uw stem horen!", body: "Authenticiteit is prioriteit! Alles wordt eerst door u goedgekeurd. Zo houdt u eigen stijl en stem.", icon: "◆" },
  { title: "Blijf bij de tijd", body: "Een frisse blik op uw website of publicatie, met tips en tricks om uw publiek te bereiken.", icon: "❋" },
];

const offerings = [
  "Webcontent & SEO-artikelen",
  "Quickscan voor uw website",
  "AI-prompts die werken voor uw bedrijf",
  "Redactie van geschreven teksten",
  "Website optimalisatie",
  "Zoekwoorden- en doelgroeponderzoek",
];

export default async function HomePage() {
  const page = await getPage("home");
  if (!page) notFound();

  const c = (page.content ?? {}) as Record<string, string>;

  return (
    <>
      <section className="bg-[var(--color-surface)] min-h-[88vh] flex items-center">
        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <p className="font-[var(--font-label)] text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-primary)]">
              Tekstbureau Tulp
            </p>
            <h1 className="font-[var(--font-headline)] text-5xl md:text-6xl font-bold leading-[1.05] text-[var(--color-on-surface)] italic">
              {c.hero_heading}
            </h1>
            <p className="text-lg text-[var(--color-on-surface-variant)] leading-relaxed max-w-md">
              {c.hero_body}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/diensten" className="inline-flex items-center bg-[var(--color-secondary)] text-[var(--color-on-secondary)] text-xs font-bold uppercase tracking-widest px-7 py-3.5 rounded-[var(--radius-brand)] hover:bg-[var(--color-secondary-container)] transition-colors font-[var(--font-label)]">
                {c.hero_cta_primary}
              </Link>
              <Link href="/contact" className="inline-flex items-center border-2 border-[var(--color-primary)]/40 text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest px-7 py-3.5 rounded-[var(--radius-brand)] hover:border-[var(--color-primary)] transition-colors font-[var(--font-label)]">
                {c.hero_cta_secondary}
              </Link>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="aspect-[4/3] rounded-[var(--radius-brand)] overflow-hidden bg-[var(--color-primary-container)]">
              {c.hero_image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.hero_image} alt="Tekstbureau Tulp" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[var(--color-surface-container-lowest)] rounded-[var(--radius-brand)] px-6 py-4 shadow-[0_20px_40px_rgba(0,32,30,0.08)]">
              <p className="font-[var(--font-headline)] text-3xl font-bold text-[var(--color-primary)] italic">15+</p>
              <p className="text-xs font-[var(--font-label)] uppercase tracking-widest text-[var(--color-on-surface-variant)] mt-0.5">Jaren ervaring</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-surface-container-low)] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14 space-y-3">
            <p className="font-[var(--font-label)] text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-primary)]">Waarom Tulp</p>
            <h2 className="font-[var(--font-headline)] text-4xl font-bold italic text-[var(--color-on-surface)]">{c.section_heading}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {valueProps.map(({ title, body, icon }) => (
              <div key={title} className="bg-[var(--color-surface-container-lowest)] rounded-[var(--radius-brand)] p-8 space-y-4 shadow-[0_4px_24px_rgba(0,32,30,0.04)]">
                <span className="text-3xl text-[var(--color-primary)]">{icon}</span>
                <h3 className="font-[var(--font-headline)] text-xl font-bold text-[var(--color-on-surface)] italic">{title}</h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-surface)] py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <p className="font-[var(--font-label)] text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-primary)]">Wat ik doe</p>
            <h2 className="font-[var(--font-headline)] text-4xl font-bold italic text-[var(--color-on-surface)] leading-tight">{c.services_heading}</h2>
            <p className="text-[var(--color-on-surface-variant)] leading-relaxed">{c.services_body}</p>
            <Link href="/diensten" className="inline-flex items-center text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest font-[var(--font-label)] border-b-2 border-[var(--color-primary-fixed)] pb-0.5 hover:border-[var(--color-primary)] transition-colors">
              Bekijk alle diensten →
            </Link>
          </div>
          <ul className="space-y-4">
            {offerings.map((item) => (
              <li key={item} className="flex items-center gap-4">
                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] flex-shrink-0" />
                <span className="text-[var(--color-on-surface-variant)]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[var(--color-primary)] py-24">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-6">
          <p className="font-[var(--font-label)] text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-primary-fixed)]">Gratis aangeboden</p>
          <h2 className="font-[var(--font-headline)] text-4xl md:text-5xl font-bold italic text-[var(--color-on-primary)] leading-tight">{c.cta_heading}</h2>
          <p className="text-[var(--color-on-primary)]/80 max-w-xl mx-auto leading-relaxed">{c.cta_body}</p>
          <Link href="/contact" className="inline-flex items-center bg-[var(--color-on-primary)] text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-[var(--radius-brand)] hover:bg-[var(--color-primary-fixed)] transition-colors font-[var(--font-label)]">
            Vraag gratis quickscan aan
          </Link>
        </div>
      </section>
    </>
  );
}
