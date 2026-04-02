import TopBar from '@/components/layout/TopBar'
import { createClient } from '@/lib/supabase/server'

function formatDate(date: string) {
  return new Date(date).toLocaleString('nl-NL', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default async function FormsPage() {
  const supabase = await createClient()
  const { data: submissions } = await supabase
    .from('form_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  const rows = submissions ?? []
  const unread = rows.filter(r => !r.is_read).length

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Forms" />
      <div className="p-9 space-y-7">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">
              Form Submissions
            </h1>
            <p className="text-on-surface-variant mt-1 text-sm">
              {unread > 0 ? `${unread} unread submission${unread > 1 ? 's' : ''}` : `${rows.length} total submissions`}
            </p>
          </div>
          <button className="bg-secondary-container text-on-secondary-container px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-surface-container-lowest rounded-xl p-6">
            <p className="text-xs font-label uppercase tracking-widest text-outline mb-2">Total</p>
            <p className="text-3xl font-headline font-bold text-on-surface">{rows.length}</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-6">
            <p className="text-xs font-label uppercase tracking-widest text-outline mb-2">Unread</p>
            <p className="text-3xl font-headline font-bold text-on-surface">{unread}</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-6">
            <p className="text-xs font-label uppercase tracking-widest text-outline mb-2">Forms</p>
            <p className="text-3xl font-headline font-bold text-on-surface">
              {new Set(rows.map(r => r.form_name)).size}
            </p>
          </div>
        </div>

        {/* Submissions list */}
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] text-xs font-label uppercase tracking-widest text-outline px-6 py-3 bg-surface-container-low gap-4">
            <span>Read</span>
            <span>Form</span>
            <span>Preview</span>
            <span>Date</span>
            <span>Actions</span>
          </div>

          {rows.length === 0 ? (
            <div className="px-6 py-14 text-center text-outline text-sm">
              No submissions yet.
            </div>
          ) : (
            rows.map((sub, i) => {
              const preview = Object.entries(sub.data as Record<string, unknown>)
                .slice(0, 2)
                .map(([k, v]) => `${k}: ${v}`)
                .join(' · ')

              return (
                <div
                  key={sub.id}
                  className={`group grid grid-cols-[auto_1fr_1fr_auto_auto] items-center px-6 py-4 gap-4 hover:bg-surface-container-low transition-colors ${i < rows.length - 1 ? 'border-b border-surface-container' : ''}`}
                >
                  <div>
                    {sub.is_read ? (
                      <span className="material-symbols-outlined text-[18px] text-outline">drafts</span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-primary block" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-on-surface">{sub.form_name}</span>
                  <span className="text-xs text-outline truncate">{preview || 'No preview'}</span>
                  <span className="text-xs text-outline whitespace-nowrap">{formatDate(sub.created_at)}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-surface-container rounded-md text-outline" title="View details">
                      <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                    </button>
                    <button className="p-1.5 hover:bg-error-container rounded-md text-outline hover:text-on-error-container" title="Delete">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
