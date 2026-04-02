import TopBar from '@/components/layout/TopBar'
import { createClient } from '@/lib/supabase/server'

async function getStats() {
  const supabase = await createClient()
  const [pages, posts, users, submissions] = await Promise.all([
    supabase.from('pages').select('id', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('form_submissions').select('id', { count: 'exact', head: true }).eq('is_read', false),
  ])
  return {
    pages:       pages.count ?? 0,
    posts:       posts.count ?? 0,
    users:       users.count ?? 0,
    unreadForms: submissions.count ?? 0,
  }
}

async function getRecentActivity() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  return data ?? []
}

const iconMap: Record<string, { icon: string; color: string; bg: string }> = {
  'page':      { icon: 'description',  color: 'text-primary',    bg: 'bg-primary/10' },
  'blog_post': { icon: 'article',      color: 'text-tertiary',   bg: 'bg-tertiary/10' },
  'user':      { icon: 'person',       color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  'media':     { icon: 'photo_library',color: 'text-amber-600',  bg: 'bg-amber-500/10' },
}

function timeAgo(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (diff < 60)    return `${diff}s ago`
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default async function DashboardPage() {
  const [stats, activity] = await Promise.all([getStats(), getRecentActivity()])

  const metrics = [
    { label: 'Total Pages',   value: stats.pages,       icon: 'layers',    color: 'bg-primary',  progress: 75 },
    { label: 'Blog Posts',    value: stats.posts,       icon: 'edit_note', color: 'bg-tertiary', progress: 50 },
    { label: 'Active Users',  value: stats.users,       icon: 'group',     color: 'bg-secondary', progress: 30 },
    { label: 'Unread Forms',  value: stats.unreadForms, icon: 'inbox',     color: 'bg-error',    progress: 20 },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Dashboard" />

      <div className="p-9 space-y-9">
        {/* Header */}
        <section className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">
              Architect Dashboard
            </h1>
            <p className="text-on-surface-variant mt-1 text-sm">
              Real-time performance and system overview
            </p>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-label font-bold uppercase tracking-wider text-outline">
              System Online
            </span>
          </div>
        </section>

        {/* Metrics grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map(m => (
            <div
              key={m.label}
              className="bg-surface-container-lowest p-7 rounded-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl">{m.icon}</span>
              </div>
              <p className="text-xs font-label uppercase tracking-widest text-outline mb-2">
                {m.label}
              </p>
              <span className="text-4xl font-headline font-bold text-on-surface">
                {m.value}
              </span>
              <div className="mt-5 h-1 w-full bg-surface-container-low rounded-full">
                <div
                  className={`h-full ${m.color} rounded-full transition-all`}
                  style={{ width: `${Math.min(m.progress, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </section>

        {/* Activity + Quick Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-9">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-headline font-bold text-on-surface">Recent Activity</h2>
              <a href="/activity" className="text-xs font-bold text-primary hover:underline">
                View All
              </a>
            </div>

            <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
              {activity.length === 0 ? (
                <div className="px-6 py-10 text-center text-outline text-sm">
                  No activity yet.
                </div>
              ) : (
                activity.map((item, i) => {
                  const style = iconMap[item.target_type] ?? { icon: 'info', color: 'text-outline', bg: 'bg-surface-container' }
                  return (
                    <div
                      key={item.id}
                      className={`group px-6 py-4 hover:bg-surface-container-low transition-colors flex items-center justify-between ${i < activity.length - 1 ? 'border-b border-surface-container' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-9 h-9 rounded-lg ${style.bg} flex items-center justify-center ${style.color}`}>
                          <span className="material-symbols-outlined text-[18px]">{style.icon}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-on-surface">{item.action}</p>
                          <p className="text-xs text-outline">
                            {item.actor_name} &bull; {timeAgo(item.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-lg font-headline font-bold text-on-surface">Quick Actions</h2>

            <a
              href="/pages?action=new"
              className="group block bg-surface-container-lowest p-6 rounded-xl hover:shadow-xl hover:shadow-black/5 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-11 h-11 rounded-xl primary-gradient flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-xl">add_box</span>
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-sm">Create New Page</h3>
                  <p className="text-xs text-outline">Draft a new entry</p>
                </div>
              </div>
              <div className="h-9 w-full rounded-lg border-2 border-dashed border-surface-container flex items-center justify-center text-xs text-outline font-bold group-hover:border-primary group-hover:text-primary transition-colors">
                Use Page Template
              </div>
            </a>

            <a
              href="/blog?action=new"
              className="group block bg-surface-container-lowest p-6 rounded-xl hover:shadow-xl hover:shadow-black/5 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline text-[18px]">history_edu</span>
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-sm">New Blog Post</h3>
                  <p className="text-xs text-outline">Start writing</p>
                </div>
              </div>
            </a>

            <a
              href="/media"
              className="group block bg-surface-container-lowest p-6 rounded-xl hover:shadow-xl hover:shadow-black/5 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline text-[18px]">upload</span>
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-sm">Upload Media</h3>
                  <p className="text-xs text-outline">Add images or files</p>
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* Traffic placeholder */}
        <section className="bg-surface-container-lowest p-8 rounded-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-headline font-bold text-on-surface">Traffic Overview</h2>
              <p className="text-xs text-outline">Site visitors across all managed pages</p>
            </div>
          </div>
          <div className="w-full h-40 flex items-end gap-3 px-2">
            {[60, 80, 100, 55, 90, 40, 110].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-surface-container rounded-t-lg relative group"
                style={{ height: `${h}%` }}
              >
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-all rounded-t-lg" />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-2">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
              <span key={d} className="text-[10px] text-outline font-bold uppercase tracking-widest">{d}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
