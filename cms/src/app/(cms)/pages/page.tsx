import Link from 'next/link'
import TopBar from '@/components/layout/TopBar'
import { createClient } from '@/lib/supabase/server'
import { deletePage } from './actions'

const statusStyle: Record<string, string> = {
  published: 'bg-emerald-100 text-emerald-700',
  draft:     'bg-surface-container text-outline',
  archived:  'bg-error-container text-on-error-container',
}

function timeAgo(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return new Date(date).toLocaleDateString('nl-NL')
}

export default async function PagesPage() {
  const supabase = await createClient()
  const { data: pages } = await supabase
    .from('pages')
    .select('id, title, slug, status, updated_at')
    .order('updated_at', { ascending: false })

  const rows = pages ?? []

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Pages" />
      <div className="p-9 space-y-7">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">Pages</h1>
            <p className="text-on-surface-variant mt-1 text-sm">Manage all site pages</p>
          </div>
          <Link
            href="/pages/new"
            className="primary-gradient text-on-primary px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Page
          </Link>
        </div>

        <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] text-xs font-label uppercase tracking-widest text-outline px-6 py-3 bg-surface-container-low">
            <span>Title</span>
            <span className="px-4">Slug</span>
            <span className="px-4">Status</span>
            <span className="px-4">Updated</span>
            <span className="px-4">Actions</span>
          </div>

          {rows.length === 0 ? (
            <div className="px-6 py-14 text-center text-outline text-sm">
              No pages yet.{' '}
              <Link href="/pages/new" className="text-primary hover:underline">Create your first page.</Link>
            </div>
          ) : (
            rows.map((page, i) => (
              <div
                key={page.id}
                className={`group grid grid-cols-[1fr_auto_auto_auto_auto] items-center px-6 py-4 hover:bg-surface-container-low transition-colors ${i < rows.length - 1 ? 'border-b border-surface-container' : ''}`}
              >
                <Link href={`/pages/${page.id}`} className="text-sm font-semibold text-on-surface hover:text-primary transition-colors">
                  {page.title}
                </Link>
                <span className="px-4 text-xs text-outline font-mono">/{page.slug}</span>
                <span className="px-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusStyle[page.status] ?? statusStyle.draft}`}>
                    {page.status}
                  </span>
                </span>
                <span className="px-4 text-xs text-outline">{timeAgo(page.updated_at)}</span>
                <div className="px-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/pages/${page.id}`} className="p-1.5 hover:bg-surface-container rounded-md text-outline" title="Edit">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </Link>
                  <Link href={`/preview/${page.slug}`} target="_blank" className="p-1.5 hover:bg-surface-container rounded-md text-outline" title="Preview">
                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  </Link>
                  <form action={deletePage.bind(null, page.id)}>
                    <button type="submit" className="p-1.5 hover:bg-error-container rounded-md text-outline hover:text-on-error-container" title="Delete">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
