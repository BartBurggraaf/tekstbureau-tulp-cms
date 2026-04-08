import { createClient } from '@/lib/supabase/server'

export interface Page {
  id: string
  title: string
  slug: string
  status: string
  content: Record<string, unknown> | null
  meta_title: string | null
  meta_desc: string | null
  published_at: string | null
}

/**
 * Fetch a single published page by slug.
 * Returns null if the page does not exist or is not published.
 * The anon RLS policy ensures unpublished pages are never returned.
 */
export async function getPage(slug: string): Promise<Page | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('pages')
    .select('id, title, slug, status, content, meta_title, meta_desc, published_at')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  return data ?? null
}
