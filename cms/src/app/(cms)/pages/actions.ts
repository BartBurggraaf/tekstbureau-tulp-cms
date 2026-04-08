'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { PageContent } from '@/components/editor/types'

// ─── helpers ─────────────────────────────────────────────────────────────────

async function authedClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return { supabase, userId: user.id }
}

async function saveVersion(
  supabase: Awaited<ReturnType<typeof createClient>>,
  pageId: string,
  title: string,
  content: PageContent | null,
  userId: string,
) {
  await supabase.from('page_versions').insert({
    page_id:  pageId,
    title,
    content,
    saved_by: userId,
  })
}

// ─── actions ─────────────────────────────────────────────────────────────────

export async function createPage(formData: FormData) {
  const { supabase, userId } = await authedClient()

  const title = (formData.get('title') as string).trim()
  const slug  = (formData.get('slug')  as string).trim()

  if (!title || !slug) throw new Error('Title and slug are required')

  const { data, error } = await supabase
    .from('pages')
    .insert({ title, slug, status: 'draft', author_id: userId })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  redirect(`/pages/${data.id}`)
}

export async function savePage(
  pageId: string,
  title: string,
  slug: string,
  content: PageContent,
) {
  const { supabase, userId } = await authedClient()

  // Snapshot current state before overwriting
  const { data: current } = await supabase
    .from('pages')
    .select('title, content')
    .eq('id', pageId)
    .single()

  if (current) {
    await saveVersion(supabase, pageId, current.title, current.content as PageContent, userId)
  }

  const { error } = await supabase
    .from('pages')
    .update({ title, slug, content, updated_at: new Date().toISOString() })
    .eq('id', pageId)

  if (error) throw new Error(error.message)

  revalidatePath(`/pages/${pageId}`)
  revalidatePath(`/${slug}`)
}

export async function publishPage(
  pageId: string,
  title: string,
  slug: string,
  content: PageContent,
) {
  const { supabase, userId } = await authedClient()

  const { data: current } = await supabase
    .from('pages')
    .select('title, content')
    .eq('id', pageId)
    .single()

  if (current) {
    await saveVersion(supabase, pageId, current.title, current.content as PageContent, userId)
  }

  const { error } = await supabase
    .from('pages')
    .update({
      title,
      slug,
      content,
      status:       'published',
      published_at: new Date().toISOString(),
      updated_at:   new Date().toISOString(),
    })
    .eq('id', pageId)

  if (error) throw new Error(error.message)

  revalidatePath(`/pages/${pageId}`)
  revalidatePath(`/${slug}`)
}

export async function unpublishPage(pageId: string) {
  const { supabase } = await authedClient()

  const { error } = await supabase
    .from('pages')
    .update({ status: 'draft', updated_at: new Date().toISOString() })
    .eq('id', pageId)

  if (error) throw new Error(error.message)
  revalidatePath(`/pages/${pageId}`)
}

export async function restoreVersion(versionId: string, pageId: string) {
  const { supabase, userId } = await authedClient()

  // Fetch the version to restore
  const { data: version, error: vErr } = await supabase
    .from('page_versions')
    .select('title, content')
    .eq('id', versionId)
    .single()

  if (vErr || !version) throw new Error('Version not found')

  // Snapshot the current state first
  const { data: current } = await supabase
    .from('pages')
    .select('title, content, slug')
    .eq('id', pageId)
    .single()

  if (current) {
    await saveVersion(supabase, pageId, current.title, current.content as PageContent, userId)
  }

  // Restore
  const { error } = await supabase
    .from('pages')
    .update({
      title:      version.title,
      content:    version.content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)

  if (error) throw new Error(error.message)

  revalidatePath(`/pages/${pageId}`)
  if (current?.slug) revalidatePath(`/${current.slug}`)
}

export async function deletePage(pageId: string) {
  const { supabase } = await authedClient()
  const { error } = await supabase.from('pages').delete().eq('id', pageId)
  if (error) throw new Error(error.message)
  revalidatePath('/pages')
  redirect('/pages')
}
