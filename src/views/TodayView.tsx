import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { buildTodayQueue } from '../lib/queue'
import { computeStreak } from '../lib/stats'
import BullseyeDiagram from '../components/BullseyeDiagram'
import ContactModal from '../components/ContactModal'
import { Contact, CORE_ACTIVITIES, RING_LABEL, RingId, SALE_CATEGORY_LABEL, SaleCategory, TouchOutcome } from '../types'

function ProgressBar({ value, goal, label }: { value: number; goal: number; label: string }) {
  const pct = Math.min(100, Math.round((value / goal) * 100))
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm mb-1">
        <span className="text-black/60">{label}</span>
        <span className="font-semibold">
          {value} <span className="text-black/40 font-normal">/ {goal}</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-black/10 overflow-hidden">
        <div className="h-full bg-gold transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function TodayView() {
  const contacts = useStore((s) => s.contacts)
  const settings = useStore((s) => s.settings)
  const logTouch = useStore((s) => s.logTouch)
  const logSale = useStore((s) => s.logSale)
  const toggleCoreActivity = useStore((s) => s.toggleCoreActivity)
  const setTheme = useStore((s) => s.setTheme)
  const getTodayLog = useStore((s) => s.getTodayLog)
  const dailyLogs = useStore((s) => s.dailyLogs)

  const [editing, setEditing] = useState<Contact | null>(null)
  const [saleFor, setSaleFor] = useState<string | null>(null)
  const [collapsedRings, setCollapsedRings] = useState<Record<string, boolean>>({})

  const todayLog = getTodayLog()
  const streak = useMemo(() => computeStreak(dailyLogs), [dailyLogs])
  const queue = useMemo(() => buildTodayQueue(contacts, settings), [contacts, settings])

  const grouped = useMemo(() => {
    const map = new Map<RingId, typeof queue>()
    for (const item of queue) {
      if (!map.has(item.ring)) map.set(item.ring, [])
      map.get(item.ring)!.push(item)
    }
    return map
  }, [queue])

  function handleTouch(contactId: string, outcome: TouchOutcome) {
    logTouch(contactId, outcome)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
      <aside className="space-y-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-black/40">Today</div>
              <div className="text-lg font-semibold">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
            </div>
            {streak > 0 && (
              <div className="text-right">
                <div className="text-2xl font-bold text-gold-dark">{streak}</div>
                <div className="text-[11px] text-black/40 -mt-1">day streak</div>
              </div>
            )}
          </div>
          <div className="mt-4">
            <label className="text-xs text-black/50">Theme for today's hour</label>
            <input
              className="input mt-1"
              placeholder="e.g. Filling the waitlist, booking VIP days…"
              value={todayLog.theme}
              onChange={(e) => setTheme(e.target.value)}
            />
          </div>
          <div className="mt-4 space-y-3">
            <ProgressBar value={todayLog.touchIds.length} goal={settings.dailyTouchGoal} label="Touches" />
            <ProgressBar value={todayLog.offersCount} goal={settings.dailyOfferGoal} label="Offers made" />
            <ProgressBar value={todayLog.callsBookedCount} goal={5} label="Calls booked" />
          </div>
        </div>

        <div className="card p-5">
          <div className="font-semibold mb-3">7 Core Activities</div>
          <ul className="space-y-2.5">
            {CORE_ACTIVITIES.map((a) => (
              <li key={a.id} className="flex gap-2.5 items-start">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={!!todayLog.coreActivitiesDone[a.id]}
                  onChange={() => toggleCoreActivity(a.id)}
                />
                <div>
                  <div className={todayLog.coreActivitiesDone[a.id] ? 'text-sm font-medium line-through text-black/40' : 'text-sm font-medium'}>
                    {a.label}
                  </div>
                  <div className="text-xs text-black/45">{a.detail}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <div className="font-semibold mb-3">Order of Action</div>
          <BullseyeDiagram compact />
        </div>
      </aside>

      <section className="space-y-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold text-lg">Today's queue</h2>
            <span className="text-sm text-black/45">{queue.length} people due</span>
          </div>
          <p className="text-sm text-black/45 mb-4">
            Worked bullseye-in: current clients first, new leads last. Overdue contacts (no touch in{' '}
            {settings.touchReminderDays}+ days) are pulled forward inside their ring.
          </p>

          {queue.length === 0 && (
            <div className="text-sm text-black/50 py-10 text-center">
              No one is due today. Add contacts to your Dream 1000 in the "Dream 1000" tab, or check back tomorrow's cycle slot.
            </div>
          )}

          <div className="space-y-5">
            {Array.from(grouped.entries()).map(([ring, items]) => (
              <div key={ring}>
                <button
                  className="w-full flex items-center justify-between text-left mb-2"
                  onClick={() => setCollapsedRings((c) => ({ ...c, [ring]: !c[ring] }))}
                >
                  <div className="flex items-center gap-2">
                    <span className="badge bg-ink text-white">{RING_LABEL[ring]}</span>
                    <span className="text-xs text-black/40">{items.length}</span>
                  </div>
                  <span className="text-black/30 text-xs">{collapsedRings[ring] ? 'show' : 'hide'}</span>
                </button>
                {!collapsedRings[ring] && (
                  <ul className="divide-y divide-black/5 rounded-xl border border-black/5">
                    {items.map(({ contact, overdue, daysSinceTouch }) => (
                      <li key={contact.id} className="p-3 flex flex-wrap items-center gap-3">
                        <button className="text-left mr-auto" onClick={() => setEditing(contact)}>
                          <div className="font-medium text-sm flex items-center gap-2">
                            {contact.firstName} {contact.lastName}
                            {contact.readyToBuy && <span className="badge bg-gold/20 text-gold-dark">ready to buy</span>}
                            {overdue && <span className="badge bg-red-50 text-red-600">overdue</span>}
                          </div>
                          <div className="text-xs text-black/45">
                            {contact.businessName || contact.program || '—'}
                            {daysSinceTouch !== null ? ` · last touch ${daysSinceTouch}d ago` : ' · never touched'}
                          </div>
                        </button>
                        <div className="flex gap-1.5 flex-wrap">
                          <button className="btn-outline !px-2 !py-1 text-xs" onClick={() => handleTouch(contact.id, 'touched')}>
                            Touched
                          </button>
                          <button className="btn-outline !px-2 !py-1 text-xs" onClick={() => handleTouch(contact.id, 'offer_made')}>
                            Offer made
                          </button>
                          <button className="btn-outline !px-2 !py-1 text-xs" onClick={() => handleTouch(contact.id, 'call_booked')}>
                            Call booked
                          </button>
                          <button className="btn-outline !px-2 !py-1 text-xs" onClick={() => handleTouch(contact.id, 'no_response')}>
                            No response
                          </button>
                          <button className="btn-gold !px-2 !py-1 text-xs" onClick={() => setSaleFor(contact.id)}>
                            Sale 🎉
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {editing !== null && <ContactModal contact={editing} defaultListId={editing.listId} onClose={() => setEditing(null)} />}

      {saleFor && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSaleFor(null)}>
          <div className="card w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold mb-3">Log a sale</h3>
            <div className="grid gap-2">
              {(Object.keys(SALE_CATEGORY_LABEL) as SaleCategory[]).map((cat) => (
                <button
                  key={cat}
                  className="btn-outline justify-start"
                  onClick={() => {
                    logSale(cat, saleFor)
                    setSaleFor(null)
                  }}
                >
                  {SALE_CATEGORY_LABEL[cat]}
                </button>
              ))}
            </div>
            <button className="btn-ghost mt-3 w-full" onClick={() => setSaleFor(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
