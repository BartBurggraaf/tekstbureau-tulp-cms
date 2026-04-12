import Link from 'next/link'
import { site } from '../../config/site'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface text-center px-6">
      <p className="font-headline text-[clamp(6rem,20vw,10rem)] leading-none font-extrabold text-primary/20 select-none">
        404
      </p>
      <h1 className="font-headline text-2xl font-bold text-on-surface mt-4 mb-2">
        Pagina niet gevonden
      </h1>
      <p className="text-on-surface-variant text-sm mb-8">
        Deze pagina bestaat niet of is verplaatst.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg primary-gradient text-on-primary text-sm font-bold"
      >
        ← Terug naar home
      </Link>
      <p className="mt-12 text-xs text-outline">{site.name}</p>
    </div>
  )
}
