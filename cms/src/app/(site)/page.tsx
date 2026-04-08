import { notFound } from 'next/navigation'
import { getPage } from '@/lib/site'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import type { Metadata } from 'next'
import type { PageContent } from '@/components/editor/types'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('home')
  if (!page) return {}
  return {
    title: page.meta_title ?? page.title,
    description: page.meta_desc ?? undefined,
  }
}

export default async function HomePage() {
  const page = await getPage('home')
  if (!page) notFound()

  return (
    <article>
      <BlockRenderer content={page.content as unknown as PageContent} />
    </article>
  )
}
