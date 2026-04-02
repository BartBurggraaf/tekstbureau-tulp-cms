import TopBar from '@/components/layout/TopBar'
import { createClient } from '@/lib/supabase/server'

const roleStyle: Record<string, string> = {
  admin:  'bg-primary/10 text-primary',
  editor: 'bg-tertiary/10 text-tertiary',
  viewer: 'bg-surface-container text-outline',
}

const statusStyle: Record<string, string> = {
  active:    'bg-emerald-100 text-emerald-700',
  inactive:  'bg-surface-container text-outline',
  suspended: 'bg-error-container text-on-error-container',
}

function timeAgo(date: string | null) {
  if (!date) return 'Never'
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return new Date(date).toLocaleDateString('nl-NL')
}

export default async function UsersPage() {
  const supabase = await createClient()
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, role, status, avatar_url, created_at, last_active')
    .order('created_at', { ascending: false })

  const rows = profiles ?? []
  const counts = {
    total:    rows.length,
    active:   rows.filter(u => u.status === 'active').length,
    pending:  0,
    flagged:  rows.filter(u => u.status === 'suspended').length,
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Users" />
      <div className="p-9 space-y-7">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">
              User Management
            </h1>
            <p className="text-on-surface-variant mt-1 text-sm">
              Manage access levels, assign roles, and monitor account status
            </p>
          </div>
          <button className="primary-gradient text-on-primary px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Add New User
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Users',     value: counts.total,   icon: 'group' },
            { label: 'Active Now',      value: counts.active,  icon: 'radio_button_checked' },
            { label: 'Pending Invites', value: counts.pending, icon: 'mail' },
            { label: 'Security Flags',  value: counts.flagged, icon: 'flag' },
          ].map(s => (
            <div key={s.label} className="bg-surface-container-lowest rounded-xl p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-outline text-[20px]">{s.icon}</span>
              </div>
              <div>
                <p className="text-2xl font-headline font-bold text-on-surface">{s.value}</p>
                <p className="text-xs text-outline">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] text-xs font-label uppercase tracking-widest text-outline px-6 py-3 bg-surface-container-low">
            <span>Name & Identity</span>
            <span className="px-4">Role</span>
            <span className="px-4">Status</span>
            <span className="px-4">Last Active</span>
            <span className="px-4">Actions</span>
          </div>

          {rows.length === 0 ? (
            <div className="px-6 py-14 text-center text-outline text-sm">No users yet.</div>
          ) : (
            rows.map((user, i) => {
              const initials = user.display_name
                ? user.display_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                : '?'
              return (
                <div
                  key={user.id}
                  className={`group grid grid-cols-[1fr_auto_auto_auto_auto] items-center px-6 py-4 hover:bg-surface-container-low transition-colors ${i < rows.length - 1 ? 'border-b border-surface-container' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.display_name} className="w-9 h-9 rounded-full" />
                    ) : (
                      <div className="w-9 h-9 rounded-full primary-gradient flex items-center justify-center text-on-primary text-xs font-bold">
                        {initials}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{user.display_name || 'Unnamed'}</p>
                    </div>
                  </div>

                  <span className="px-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${roleStyle[user.role] ?? ''}`}>
                      {user.role}
                    </span>
                  </span>

                  <span className="px-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${statusStyle[user.status] ?? ''}`}>
                      {user.status}
                    </span>
                  </span>

                  <span className="px-4 text-xs text-outline">{timeAgo(user.last_active)}</span>

                  <div className="px-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-surface-container rounded-md text-outline" title="Edit role">
                      <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                    </button>
                    <button className="p-1.5 hover:bg-error-container rounded-md text-outline hover:text-on-error-container" title="Suspend">
                      <span className="material-symbols-outlined text-[18px]">block</span>
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Permissions info */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-surface-container-lowest rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-headline font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">shield</span>
              Role Permissions Matrix
            </h3>
            <div className="space-y-2 text-sm text-on-surface-variant">
              <p><strong>Admin</strong> — full access: create, edit, delete, manage users</p>
              <p><strong>Editor</strong> — can create and publish content, no user management</p>
              <p><strong>Viewer</strong> — read-only access across all modules</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-headline font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-tertiary">history</span>
              Audit Logs
            </h3>
            <p className="text-sm text-on-surface-variant">
              All configuration changes and user logins are recorded in the activity log.
            </p>
            <a href="/activity" className="text-xs font-bold text-primary hover:underline">
              Access Activity Log →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
