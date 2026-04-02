import TopBar from '@/components/layout/TopBar'
import { createClient } from '@/lib/supabase/server'

const statusStyle: Record<string, string> = {
  published: 'bg-emerald-100 text-emerald-700',
  draft:     'bg-surface-container text-outline',
  scheduled: 'bg-tertiary-container text-on-tertiary-container',
  archived:  'bg-error-container text-on-error-container',
}

function timeAgo(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return new Date(date).toLocaleDateString('nl-NL')
}

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, status, excerpt, tags, updated_at')
    .order('updated_at', { ascending: false })

  const rows = posts ?? []

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Blog" />
      <div className="p-9 space-y-7">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">
              Blog Posts
            </h1>
            <p className="text-on-surface-variant mt-1 text-sm">
              Write, schedule, and manage posts
            </p>
          </div>
          <a
            href="/blog?action=new"
            className="primary-gradient text-on-primary px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Post
          </a>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {['All', 'Published', 'Draft', 'Scheduled'].map((tab, i) => (
            <button
              key={tab}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${i === 0 ? 'bg-primary text-on-primary' : 'bg-surface-container text-outline hover:bg-surface-container-high'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Post list */}
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
          {rows.length === 0 ? (
            <div className="px-6 py-14 text-center text-outline text-sm">
              No posts yet. Start writing your first post.
            </div>
          ) : (
            rows.map((post, i) => (
              <div
                key={post.id}
                className={`group flex items-center justify-between px-6 py-5 hover:bg-surface-container-low transition-colors ${i < rows.length - 1 ? 'border-b border-surface-container' : ''}`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">article</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate">{post.title}</p>
                    {post.excerpt && (
                      <p className="text-xs text-outline truncate mt-0.5">{post.excerpt}</p>
                    )}
                    {post.tags?.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {post.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-fixed-dim text-on-secondary-fixed">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusStyle[post.status] ?? statusStyle.draft}`}>
                    {post.status}
                  </span>
                  <span className="text-xs text-outline">{timeAgo(post.updated_at)}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-surface-container rounded-md text-outline" title="Edit">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button className="p-1.5 hover:bg-error-container rounded-md text-outline hover:text-on-error-container" title="Delete">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
