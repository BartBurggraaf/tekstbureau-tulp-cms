import { notFound } from "next/navigation";
import { getPage } from "@/lib/site";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("contact");
  if (!page) return {};
  return {
    title: page.meta_title ?? page.title,
    description: page.meta_desc ?? undefined,
  };
}

export default async function ContactPage() {
  const page = await getPage("contact");
  if (!page) notFound();

  const c = (page.content ?? {}) as Record<string, string>;

  return (
    <>
      <section className="bg-[var(--color-surface-container-low)] py-24">
        <div className="max-w-6xl mx-auto px-6 space-y-4">
          <p className="font-[var(--font-label)] text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-primary)]">Contact</p>
          <h1 className="font-[var(--font-headline)] text-5xl md:text-6xl font-bold italic text-[var(--color-on-surface)] leading-tight max-w-2xl">{c.hero_heading}</h1>
          <p className="text-lg text-[var(--color-on-surface-variant)] max-w-xl leading-relaxed">{c.hero_body}</p>
        </div>
      </section>

      <section className="bg-[var(--color-surface)] py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[2fr_1fr] gap-16">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] font-[var(--font-label)]">Volledige naam</label>
                <input type="text" className="w-full bg-transparent border-b-2 border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] outline-none py-3 text-[var(--color-on-surface)] transition-colors" placeholder="Uw naam" />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] font-[var(--font-label)]">E-mailadres</label>
                <input type="email" className="w-full bg-transparent border-b-2 border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] outline-none py-3 text-[var(--color-on-surface)] transition-colors" placeholder="uw@email.nl" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] font-[var(--font-label)]">Type dienst</label>
              <select className="w-full bg-transparent border-b-2 border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] outline-none py-3 text-[var(--color-on-surface)] transition-colors">
                <option value="">Selecteer een dienst</option>
                <option>Gratis quickscan</option>
                <option>Webcontent & SEO</option>
                <option>Tekstredactie & revisie</option>
                <option>AI-prompts</option>
                <option>Doelgroeponderzoek</option>
                <option>Anders</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] font-[var(--font-label)]">Uw bericht</label>
              <textarea rows={5} className="w-full bg-transparent border-b-2 border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] outline-none py-3 text-[var(--color-on-surface)] transition-colors resize-none" placeholder="Vertel kort over uw project of vraag..." />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-[var(--color-outline)] font-[var(--font-label)]">Verwachte reactie: 24u</p>
              <button type="submit" className="inline-flex items-center bg-[var(--color-secondary)] text-[var(--color-on-secondary)] text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-[var(--radius-brand)] hover:bg-[var(--color-secondary-container)] transition-colors font-[var(--font-label)]">
                Verzend aanvraag
              </button>
            </div>
          </form>

          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-outline)] font-[var(--font-label)]">Direct contact</p>
              <div className="space-y-3 text-[var(--color-on-surface-variant)]">
                <p><a href={`mailto:${c.email}`} className="hover:text-[var(--color-primary)] transition-colors">{c.email}</a></p>
                <p><a href={`tel:${c.phone?.replace(/-/g, "")}`} className="hover:text-[var(--color-primary)] transition-colors">{c.phone}</a></p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-outline)] font-[var(--font-label)]">KVK</p>
              <p className="text-[var(--color-on-surface-variant)]">{c.kvk}</p>
            </div>
            <div className="bg-[var(--color-surface-container-low)] rounded-[var(--radius-brand)] p-6 space-y-2">
              <p className="font-[var(--font-headline)] text-lg font-bold italic text-[var(--color-on-surface)]">Gratis quickscan?</p>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">Vraag vrijblijvend een quickscan van uw website aan. Ik kijk naar leesbaarheid, doelgroep en SEO.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
