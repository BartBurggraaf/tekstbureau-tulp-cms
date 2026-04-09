import Link from "next/link";
import { brand } from "../../../../config/brand";

export default function SiteFooter() {
  return (
    <footer className="bg-[var(--color-inverse-surface)] text-[var(--color-inverse-on-surface)]">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="space-y-3">
          <p className="font-[var(--font-headline)] font-bold italic text-xl text-[var(--color-inverse-on-surface)]">
            {brand.name}
          </p>
          <p className="text-sm opacity-70 leading-relaxed">{brand.tagline}</p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest opacity-50 font-[var(--font-label)]">
            Navigatie
          </p>
          {[
            { href: "/", label: "Home" },
            { href: "/diensten", label: "Diensten" },
            { href: "/over", label: "Over" },
            { href: "/contact", label: "Contact" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block text-sm opacity-70 hover:opacity-100 transition-opacity"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest opacity-50 font-[var(--font-label)]">
            Contact
          </p>
          <p className="text-sm opacity-70">info@{brand.domain}</p>
        </div>
      </div>

      <div className="border-t border-white/10 max-w-6xl mx-auto px-6 py-4">
        <p className="text-xs opacity-40">
          © {new Date().getFullYear()} {brand.name}. Alle rechten voorbehouden.
        </p>
      </div>
    </footer>
  );
}
