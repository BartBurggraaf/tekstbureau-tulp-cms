import TopBar from '@/components/layout/TopBar'
import { createClient } from '@/lib/supabase/server'

const typeStyle: Record<string, { icon: string; color: string; bg: string }> = {
  page:      { icon: 'description',   color: 'text-primary',     bg: 'bg-primary/10' },
  blog_post: { icon: 'article',       color: 'text-tertiary',    bg: 'bg-tertiary/10' },
  user:      { icon: 'person',        color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  media:     { icon: 'photo_library', color: 'text-amber-600',   bg: 'bg-amber-500/10' },
  system:    { icon: 'terminal',      color: 'text-outline',     bg: 'bg-surface-container' },
}

function formatDate(date: string) {
  return new Date(date).toLocaleString('nl-NL', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default async function ActivityPage() {
  const supabase = await createClient()
  const { data: logs } = await supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  const rows = logs ?? []

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Activity" />
      <div className="p-9 space-y-7">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">
              Activity Log
            </h1>
            <p className="text-on-surface-variant mt-1 text-sm">
              Full audit trail of all CMS actions
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
          {rows.length === 0 ? (
            <div className="px-6 py-14 text-center text-outline text-sm">
              No activity recorded yet.
            </div>
          ) : (
            rows.map((log, i) => {
              const style = typeStyle[log.target_type] ?? typeStyle.system
              return (
                <div
                  key={log.id}
                  className={`flex items-start gap-4 px-6 py-5 hover:bg-surface-container-low transition-colors ${i < rows.length - 1 ? 'border-b border-surface-container' : ''}`}
                >
                  <div className={`w-9 h-9 rounded-lg ${style.bg} flex items-center justify-center ${style.color} flex-shrink-0 mt-0.5`}>
                    <span className="material-symbols-outlined text-[18px]">{style.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface">{log.action}</p>
                    {log.target_label && (
                      <p className="text-xs text-outline truncate">"{log.target_label}"</p>
                    )}
                    <p className="text-xs text-outline mt-0.5">
                      {log.actor_name ?? 'System'} &bull; {formatDate(log.created_at)}
                    </p>
                  </div>
                  {log.target_type && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-outline bg-surface-container px-2 py-1 rounded-full flex-shrink-0">
                      {log.target_type.replace('_', ' ')}
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
