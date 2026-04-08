'use client'

import { useState, useTransition } from 'react'
import PageBuilder from '@/components/editor/PageBuilder'
import { savePage, publishPage, unpublishPage, restoreVersion } from '../actions'
import type { PageContent } from '@/components/editor/types'

interface Version {
  id: string
  title: string
  saved_at: string
  saved_by: string | null
}

interface Props {
  page: {
    id: string
    title: string
    slug: string
    status: string
    content: PageContent | null
  }
  versions: Version[]
}

function timeAgo(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (diff < 60)   return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return new Date(date).toLocaleString('nl-NL')
}

export default function PageEditorClient({ page, versions: initialVersions }: Props) {
  const [title,   setTitle]   = useState(page.title)
  const [slug,    setSlug]    = useState(page.slug)
  const [content, setContent] = useState<PageContent>(page.content ?? { v: 1, blocks: [] })
  const [status,  setStatus]  = useState(page.status)
  const [versions, setVersions] = useState(initialVersions)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await savePage(page.id, title, slug, content)
        // Prepend a synthetic version entry to the local list
        setVersions(v => [{ id: '_', title, saved_at: new Date().toISOString(), saved_by: null }, ...v].slice(0, 20))
        showToast('Saved')
      } catch (e) {
        showToast((e as Error).message)
      }
    })
  }

  function handlePublish() {
    startTransition(async () => {
      try {
        await publishPage(page.id, title, slug, content)
        setStatus('published')
        showToast('Published')
      } catch (e) {
        showToast((e as Error).message)
      }
    })
  }

  function handleUnpublish() {
    startTransition(async () => {
      try {
        await unpublishPage(page.id)
        setStatus('draft')
        showToast('Set to draft')
      } catch (e) {
        showToast((e as Error).message)
      }
    })
  }

  function handleRestore(versionId: string) {
    startTransition(async () => {
      try {
        await restoreVersion(versionId, page.id)
        showToast('Version restored — refresh to see changes')
        setHistoryOpen(false)
        // Force reload to pick up the restored content
        window.location.reload()
      } catch (e) {
        showToast((e as Error).message)
      }
    })
  }

  const statusStyle: Record<string, string> = {
    published: 'bg-emerald-100 text-emerald-700',
    draft:     'bg-surface-container text-outline',
    archived:  'bg-error-container text-on-error-container',
  }

  return (
    <div className="flex flex-col min-h-screen">

      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-surface-container-lowest border-b border-surface-container-high px-6 py-3 flex items-center gap-3">
        <a href="/pages" className="p-1.5 rounded-lg hover:bg-surface-container text-outline" title="Back to pages">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </a>

        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="flex-1 text-lg font-headline font-semibold text-on-surface bg-transparent focus:outline-none min-w-0"
          placeholder="Page title"
        />

        <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${statusStyle[status] ?? statusStyle.draft}`}>
          {status}
        </span>

        <a
          href={`/preview/${slug}`}
          target="_blank"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container transition-colors flex-shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          Preview
        </a>

        <button
          onClick={() => setHistoryOpen(o => !o)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container transition-colors flex-shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">history</span>
          History
          {versions.length > 0 && (
            <span className="bg-surface-container text-outline text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {versions.length}
            </span>
          )}
        </button>

        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-4 py-2 rounded-lg text-sm font-semibold border border-surface-container-high text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50 flex-shrink-0"
        >
          Save draft
        </button>

        {status === 'published' ? (
          <button
            onClick={handleUnpublish}
            disabled={isPending}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-outline border border-surface-container-high hover:bg-surface-container transition-colors disabled:opacity-50 flex-shrink-0"
          >
            Unpublish
          </button>
        ) : (
          <button
            onClick={handlePublish}
            disabled={isPending}
            className="primary-gradient text-on-primary px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex-shrink-0"
          >
            Publish
          </button>
        )}
      </div>

      <div className="flex flex-1 min-h-0">

        {/* Editor main */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto min-w-0">
          {/* Slug field */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-outline">URL:</span>
            <div className="flex items-center border border-surface-container-high rounded-lg overflow-hidden text-sm">
              <span className="px-3 py-1.5 text-outline bg-surface-container border-r border-surface-container-high select-none">/</span>
              <input
                value={slug}
                onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                className="px-3 py-1.5 text-on-surface bg-surface-container-lowest focus:outline-none w-48"
              />
            </div>
          </div>

          {/* Page builder */}
          <PageBuilder
            initialContent={page.content}
            onChange={setContent}
          />
        </div>

        {/* Version history panel */}
        {historyOpen && (
          <div className="w-72 flex-shrink-0 border-l border-surface-container-high bg-surface-container-lowest overflow-y-auto">
            <div className="px-5 py-4 border-b border-surface-container-high flex items-center justify-between">
              <p className="font-semibold text-on-surface text-sm">Version history</p>
              <button onClick={() => setHistoryOpen(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {versions.length === 0 ? (
              <p className="px-5 py-8 text-sm text-outline text-center">
                No versions yet. Save or publish to create the first snapshot.
              </p>
            ) : (
              <div className="divide-y divide-surface-container">
                {versions.map((v, i) => (
                  <div key={v.id + i} className="px-5 py-3 hover:bg-surface-container-low transition-colors">
                    <p className="text-sm font-medium text-on-surface truncate">{v.title}</p>
                    <p className="text-xs text-outline mt-0.5">{timeAgo(v.saved_at)}</p>
                    {v.id !== '_' && (
                      <button
                        onClick={() => handleRestore(v.id)}
                        disabled={isPending}
                        className="mt-2 text-xs text-primary hover:underline disabled:opacity-50"
                      >
                        Restore this version
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-on-surface text-surface px-5 py-2.5 rounded-full text-sm font-medium shadow-lg z-50 pointer-events-none">
          {toast}
        </div>
      )}
    </div>
  )
}
