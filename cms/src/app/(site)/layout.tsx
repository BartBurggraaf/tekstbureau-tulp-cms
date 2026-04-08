import Link from 'next/link'
import { site } from '../../../config/site'
import { brand } from '../../../config/brand'

function SiteNav() {
  return (
    <header className="border-b border-outline-variant bg-surface-container-lowest">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-headline font-bold text-lg text-on-surface">
          {site.name}
        </Link>
        <nav className="flex items-center gap-6 text-sm text-on-surface-variant">
          <Link href="/diensten" className="hover:text-on-surface transition-colors">Diensten</Link>
          <Link href="/over"     className="hover:text-on-surface transition-colors">Over</Link>
          <Link href="/contact"  className="hover:text-on-surface transition-colors">Contact</Link>
        </nav>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-outline-variant mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-on-surface-variant">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>{brand.domain}</span>
      </div>
    </footer>
  )
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <SiteNav />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
