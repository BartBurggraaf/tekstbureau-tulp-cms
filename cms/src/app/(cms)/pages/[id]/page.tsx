import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PageEditorClient from './PageEditorClient'
import type { PageContent } from '@/components/editor/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PageEditorPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: page }, { data: versions }] = await Promise.all([
    supabase
      .from('pages')
      .select('id, title, slug, status, content')
      .eq('id', id)
      .single(),
    supabase
      .from('page_versions')
      .select('id, title, saved_at, saved_by')
      .eq('page_id', id)
      .order('saved_at', { ascending: false })
      .limit(20),
  ])

  if (!page) notFound()

  return (
    <PageEditorClient
      page={{ ...page, content: page.content as PageContent | null }}
      versions={versions ?? []}
    />
  )
}
