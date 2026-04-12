/**
 * Preview route — shows any page (draft or published) for authenticated users.
 * Protected by the proxy (middleware). Never accessible to anonymous visitors.
 * Wraps content in the real (site) layout for true WYSIWYG preview.
 */
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import SiteLayout from '../../(site)/layout'
import type { PageContent } from '@/components/editor/types'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PreviewPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch regardless of status — this is a privileged preview
  const { data: page } = await supabase
    .from('pages')
    .select('id, title, slug, status, content, meta_title, meta_desc')
    .eq('slug', slug)
    .single()

  if (!page) notFound()

  return (
    <>
      {/* Preview banner — sticky above the site layout */}
      <div className="sticky top-0 z-50 bg-primary text-on-primary px-6 py-2.5 flex items-center justify-between text-sm font-label">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">visibility</span>
          <span className="font-medium">Preview mode</span>
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
            page.status === 'published'
              ? 'bg-emerald-200 text-emerald-800'
              : 'bg-on-primary/20 text-on-primary'
          }`}>
            {page.status}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={`/pages/${page.id}`}
            className="flex items-center gap-1.5 hover:underline opacity-90"
          >
            <span className="material-symbols-outlined text-[14px]">edit</span>
            Edit page
          </Link>
          {page.status === 'published' && (
            <Link
              href={`/${slug}`}
              target="_blank"
              className="flex items-center gap-1.5 hover:underline opacity-90"
            >
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              View live
            </Link>
          )}
        </div>
      </div>

      {/* Real site layout — fonts, nav, footer, grain exactly as visitors see it */}
      <SiteLayout>
        <article>
          <BlockRenderer content={page.content as unknown as PageContent} />
          {!page.content && (
            <div className="py-16 text-center border-2 border-dashed border-surface-container-high rounded-xl text-outline">
              <p className="text-sm">This page has no content yet.</p>
              <Link href={`/pages/${page.id}`} className="text-primary text-sm mt-2 inline-block hover:underline">
                Open editor →
              </Link>
            </div>
          )}
        </article>
      </SiteLayout>
    </>
  )
}
