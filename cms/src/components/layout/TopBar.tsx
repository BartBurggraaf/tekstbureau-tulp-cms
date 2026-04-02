'use client'

import { useState } from 'react'
import Link from 'next/link'

interface TopBarProps {
  title: string
}

export default function TopBar({ title }: TopBarProps) {
  const [search, setSearch] = useState('')

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_0_0_var(--t-surfaceContainer)]">
      {/* Search */}
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-full max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
            className="w-full bg-surface-container-high rounded-lg pl-10 pr-4 py-2 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-4">
        <Link
          href="/activity"
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-outline"
          title="Activity log"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
        </Link>
        <Link
          href="/style"
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-outline"
          title="Settings"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </Link>
      </div>
    </header>
  )
}
