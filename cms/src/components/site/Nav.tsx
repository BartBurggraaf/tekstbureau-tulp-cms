"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { brand } from "../../../../config/brand";

const links = [
  { href: "/", label: "Home" },
  { href: "/diensten", label: "Diensten" },
  { href: "/over", label: "Over" },
  { href: "/contact", label: "Contact" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface-container-lowest)]/80 backdrop-blur-[12px]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-[var(--font-headline)] font-bold italic text-xl text-[var(--color-on-surface)]">
          {brand.name}
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`font-[var(--font-label)] text-sm font-semibold uppercase tracking-widest transition-colors ${
                pathname === href
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="hidden md:inline-flex items-center bg-[var(--color-secondary)] text-[var(--color-on-secondary)] text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-[var(--radius-brand)] hover:bg-[var(--color-secondary-container)] transition-colors font-[var(--font-label)]"
        >
          Neem contact op
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-[var(--color-on-surface)]"
          aria-label="Menu"
        >
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[var(--color-surface-container-lowest)] border-t border-[var(--color-outline-variant)]/20 px-6 py-4 flex flex-col gap-4">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-sm font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)] font-[var(--font-label)]"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="inline-flex self-start items-center bg-[var(--color-secondary)] text-[var(--color-on-secondary)] text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-[var(--radius-brand)] font-[var(--font-label)]"
          >
            Neem contact op
          </Link>
        </div>
      )}
    </header>
  );
}
