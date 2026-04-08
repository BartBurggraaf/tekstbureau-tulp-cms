/**
 * Preview route — shows any page (draft or published) for authenticated users.
 * Protected by the proxy (middleware). Never accessible to anonymous visitors.
 */
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import { site } from '../../../../config/site'
import { brand } from '../../../../config/brand'
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
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Preview banner */}
      <div className="bg-primary text-on-primary px-6 py-2.5 flex items-center justify-between text-sm">
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

      {/* Site nav (mirrors public layout) */}
      <header className="border-b border-outline-variant bg-surface-container-lowest">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-headline font-bold text-lg text-on-surface">{site.name}</span>
          <nav className="flex items-center gap-6 text-sm text-on-surface-variant">
            <span className="opacity-50">Diensten</span>
            <span className="opacity-50">Over</span>
            <span className="opacity-50">Contact</span>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <article>
          <BlockRenderer content={page.content as PageContent} />
          {!page.content && (
            <div className="py-16 text-center border-2 border-dashed border-surface-container-high rounded-xl text-outline">
              <p className="text-sm">This page has no content yet.</p>
              <Link href={`/pages/${page.id}`} className="text-primary text-sm mt-2 inline-block hover:underline">
                Open editor →
              </Link>
            </div>
          )}
        </article>
      </main>

      {/* Site footer */}
      <footer className="border-t border-outline-variant">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-on-surface-variant">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>{brand.domain}</span>
        </div>
      </footer>
    </div>
  )
}
