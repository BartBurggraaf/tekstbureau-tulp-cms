import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[var(--color-surface)] px-6 text-center">
      <p className="font-[var(--font-headline)] text-[8rem] font-bold italic leading-none text-[var(--color-outline-variant)] select-none">
        404
      </p>
      <h1 className="font-[var(--font-headline)] text-3xl font-bold italic text-[var(--color-on-surface)] mt-4">
        Pagina niet gevonden
      </h1>
      <p className="text-[var(--color-on-surface-variant)] mt-3 max-w-[40ch] leading-relaxed">
        De pagina die u zoekt bestaat niet of is verplaatst.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center bg-[var(--color-secondary)] text-[var(--color-on-secondary)] text-xs font-semibold uppercase tracking-[0.15em] px-7 py-3.5 rounded-[var(--radius-brand)] hover:bg-[var(--color-secondary-container)] active:scale-[0.97] transition-all duration-150 font-[var(--font-label)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-secondary)]"
      >
        Terug naar home
      </Link>
    </div>
  );
}
