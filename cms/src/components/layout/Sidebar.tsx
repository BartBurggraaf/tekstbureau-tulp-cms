'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { site } from '../../../config/site'
import { theme } from '../../../config/theme'
import { createClient } from '@/lib/supabase/client'

export default function Sidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  const enabledNav = site.nav.filter(
    item => item.key === 'dashboard' || site.features[item.key as keyof typeof site.features]
  )

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside
      className="fixed left-0 top-0 h-screen bg-surface-container-lowest flex flex-col z-40"
      style={{ width: 'var(--t-sidebarWidth)' }}
    >
      {/* Brand */}
      <div className="p-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-1">
          {theme.logo && (
            <img
              src={theme.logo}
              alt={site.name}
              className="h-7 w-auto"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          )}
          <span className="text-lg font-headline font-bold text-on-surface">{site.name}</span>
        </div>
        <span className="text-[10px] font-label uppercase tracking-widest text-outline">
          {site.tagline}
        </span>
      </div>

      {/* Create New button */}
      <div className="px-6 mb-6 flex-shrink-0">
        <Link
          href="/pages?action=new"
          className="primary-gradient w-full text-on-primary py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-bold shadow-lg transition-opacity hover:opacity-90"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create New
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
        {enabledNav.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'border-l-[3px] border-primary bg-surface-container-low text-on-surface pl-[9px]'
                  : 'text-outline hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="p-4 flex-shrink-0 border-t-0">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-outline hover:bg-surface-container-low hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Sign out
        </button>
      </div>
    </aside>
  )
}
