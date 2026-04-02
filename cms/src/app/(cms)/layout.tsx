import Sidebar from '@/components/layout/Sidebar'

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-container-low flex">
      <Sidebar />
      <main
        className="flex-1 min-h-screen"
        style={{ marginLeft: 'var(--t-sidebarWidth)' }}
      >
        {children}
      </main>
    </div>
  )
}
