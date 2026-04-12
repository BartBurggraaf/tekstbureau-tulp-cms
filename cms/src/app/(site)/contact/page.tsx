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
      <section className="bg-[var(--color-surface-container-low)] pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-6 space-y-5">
          <p className="font-[var(--font-label)] text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-primary)]">Contact</p>
          <h1 className="font-[var(--font-headline)] text-5xl md:text-[4.5rem] font-bold italic text-[var(--color-on-surface)] leading-tight max-w-[18ch]">
            {c.hero_heading}
          </h1>
          <p className="text-lg text-[var(--color-on-surface-variant)] max-w-[52ch] leading-relaxed pt-2">
            {c.hero_body}
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-surface)] py-28">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[3fr_2fr] gap-20">

          {/* Form */}
          <form noValidate className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)] font-[var(--font-label)]">
                  Volledige naam <span className="text-[var(--color-secondary)]">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="w-full bg-transparent border-b-2 border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] outline-none py-3 text-[var(--color-on-surface)] transition-colors duration-150 placeholder:text-[var(--color-outline)]"
                  placeholder="Uw naam"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)] font-[var(--font-label)]">
                  E-mailadres <span className="text-[var(--color-secondary)]">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full bg-transparent border-b-2 border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] outline-none py-3 text-[var(--color-on-surface)] transition-colors duration-150 placeholder:text-[var(--color-outline)]"
                  placeholder="uw@email.nl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="service" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)] font-[var(--font-label)]">
                Type dienst
              </label>
              <select
                id="service"
                className="w-full bg-transparent border-b-2 border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] outline-none py-3 text-[var(--color-on-surface)] transition-colors duration-150"
              >
                <option value="">Selecteer een dienst</option>
                <option>Gratis quickscan</option>
                <option>Webcontent &amp; SEO</option>
                <option>Tekstredactie &amp; revisie</option>
                <option>AI-prompts</option>
                <option>Doelgroeponderzoek</option>
                <option>Anders</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)] font-[var(--font-label)]">
                Uw bericht <span className="text-[var(--color-secondary)]">*</span>
              </label>
              <textarea
                id="message"
                rows={5}
                required
                className="w-full bg-transparent border-b-2 border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] outline-none py-3 text-[var(--color-on-surface)] transition-colors duration-150 resize-none placeholder:text-[var(--color-outline)]"
                placeholder="Vertel kort over uw project of vraag…"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-[var(--color-outline)] font-[var(--font-label)]">Reactie binnen 24 uur</p>
              <button
                type="submit"
                className="inline-flex items-center bg-[var(--color-secondary)] text-[var(--color-on-secondary)] text-xs font-semibold uppercase tracking-[0.15em] px-8 py-4 rounded-[var(--radius-brand)] hover:bg-[var(--color-secondary-container)] active:scale-[0.97] transition-all duration-150 font-[var(--font-label)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-secondary)]"
              >
                Verzend aanvraag
              </button>
            </div>
          </form>

          {/* Contact info */}
          <div className="space-y-10 pt-2">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-outline)] font-[var(--font-label)]">Direct contact</p>
              <div className="space-y-2">
                {c.email && (
                  <p>
                    <a
                      href={`mailto:${c.email}`}
                      className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
                    >
                      {c.email}
                    </a>
                  </p>
                )}
                {c.phone && (
                  <p>
                    <a
                      href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}
                      className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
                    >
                      {c.phone}
                    </a>
                  </p>
                )}
              </div>
            </div>

            {c.kvk && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-outline)] font-[var(--font-label)]">KVK</p>
                <p className="text-[var(--color-on-surface-variant)]">{c.kvk}</p>
              </div>
            )}

            <div className="bg-[var(--color-surface-container-low)] rounded-[var(--radius-brand)] p-6 space-y-3">
              <p className="font-[var(--font-headline)] text-lg font-bold italic text-[var(--color-on-surface)]">Gratis quickscan</p>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed max-w-[38ch]">
                Vraag vrijblijvend een scan van uw website aan. Ik kijk naar leesbaarheid, doelgroep en SEO.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
