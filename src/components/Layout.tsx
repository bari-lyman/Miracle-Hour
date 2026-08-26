import { ReactNode } from 'react'

export type TabId = 'today' | 'contacts' | 'templates' | 'plan' | 'reports' | 'roles' | 'settings'

const TABS: { id: TabId; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'contacts', label: 'Dream 1000' },
  { id: 'templates', label: 'Templates' },
  { id: 'plan', label: 'Weekly Plan' },
  { id: 'reports', label: 'Reports' },
  { id: 'roles', label: 'Role Guide' },
  { id: 'settings', label: 'Settings' },
]

export default function Layout({
  active,
  onChange,
  children,
}: {
  active: TabId
  onChange: (t: TabId) => void
  children: ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 bg-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-6">
          <div className="flex items-center gap-2 shrink-0">
            <svg width="26" height="26" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="#fff" />
              <circle cx="50" cy="50" r="48" fill="none" stroke="#111" strokeWidth="0" />
              <circle cx="50" cy="50" r="36" fill="#111" />
              <circle cx="50" cy="50" r="24" fill="none" stroke="#fff" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="12" fill="#C9A227" />
            </svg>
            <div className="leading-tight">
              <div className="font-semibold tracking-tight">Miracle Hour</div>
              <div className="text-[11px] text-white/50 -mt-0.5">Daily Sales Dashboard</div>
            </div>
          </div>
          <nav className="flex-1 overflow-x-auto">
            <ul className="flex gap-1 text-sm">
              {TABS.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => onChange(t.id)}
                    className={
                      'px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ' +
                      (active === t.id ? 'bg-gold text-ink font-medium' : 'text-white/75 hover:bg-white/10')
                    }
                  >
                    {t.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">{children}</main>
      <footer className="text-center text-xs text-black/35 py-6">
        Built on Kelly Roach's Miracle Hour methodology · data stays in your browser
      </footer>
    </div>
  )
}
