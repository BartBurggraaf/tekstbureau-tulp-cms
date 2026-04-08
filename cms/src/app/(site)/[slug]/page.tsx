import { notFound } from 'next/navigation'
import { getPage } from '@/lib/site'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import type { Metadata } from 'next'
import type { PageContent } from '@/components/editor/types'

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
      <BlockRenderer content={page.content as unknown as PageContent} />
    </article>
  )
}
