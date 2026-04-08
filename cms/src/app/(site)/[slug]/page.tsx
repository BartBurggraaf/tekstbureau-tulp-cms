import { notFound } from 'next/navigation'
import { getPage } from '@/lib/site'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) return {}
  return {
    title: page.meta_title ?? page.title,
    description: page.meta_desc ?? undefined,
  }
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) notFound()

  return (
    <article>
      <h1 className="font-headline text-4xl font-bold text-on-surface mb-6">
        {page.title}
      </h1>
      {page.content && (
        <div className="prose text-on-surface-variant">
          {/* Render content blocks here — extend as needed */}
          <pre className="text-sm">{JSON.stringify(page.content, null, 2)}</pre>
        </div>
      )}
    </article>
  )
}
