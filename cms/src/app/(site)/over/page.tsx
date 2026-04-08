import { notFound } from 'next/navigation'
import { getPage } from '@/lib/site'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('over')
  if (!page) return {}
  return {
    title: page.meta_title ?? page.title,
    description: page.meta_desc ?? undefined,
  }
}

export default async function OverPage() {
  const page = await getPage('over')
  if (!page) notFound()

  return (
    <article>
      <h1 className="font-headline text-4xl font-bold text-on-surface mb-6">
        {page.title}
      </h1>
      {page.content && (
        <div className="prose text-on-surface-variant">
          <pre className="text-sm">{JSON.stringify(page.content, null, 2)}</pre>
        </div>
      )}
    </article>
  )
}
