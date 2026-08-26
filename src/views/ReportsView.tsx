import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useStore } from '../store'
import { last7Days } from '../lib/stats'
import { daysBetween, todayISO } from '../lib/id'
import { SALE_CATEGORY_LABEL, SaleCategory } from '../types'

const COLORS = ['#111114', '#C9A227', '#8A6D14', '#6b6b6f', '#e4c866']

export default function ReportsView() {
  const sales = useStore((s) => s.sales)
  const dailyLogs = useStore((s) => s.dailyLogs)
  const contacts = useStore((s) => s.contacts)
  const settings = useStore((s) => s.settings)

  const days = last7Days()

  const activityData = days.map((d) => {
    const log = dailyLogs[d]
    return {
      day: new Date(d + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short' }),
      touches: log?.touchIds.length ?? 0,
      offers: log?.offersCount ?? 0,
    }
  })

  const salesLast7 = useMemo(() => sales.filter((s) => days.includes(s.date)), [sales, days])

  const pieData = useMemo(() => {
    const counts: Record<SaleCategory, number> = {
      new_prospects: 0,
      upsells: 0,
      renewals: 0,
      referrals: 0,
      reactivations: 0,
    }
    for (const s of salesLast7) counts[s.category] += 1
    return (Object.keys(counts) as SaleCategory[])
      .map((k) => ({ name: SALE_CATEGORY_LABEL[k], value: counts[k] }))
      .filter((d) => d.value > 0)
  }, [salesLast7])

  const activeContacts = contacts.filter((c) => c.status === 'active')
  const today = todayISO()
  const overdueCount = activeContacts.filter((c) => {
    const days = c.lastTouchedAt ? daysBetween(c.lastTouchedAt, today) : Infinity
    return days >= settings.touchReminderDays
  }).length
  const neverTouched = activeContacts.filter((c) => !c.lastTouchedAt).length

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-4 gap-4">
        <Stat label="Dream 1000 size" value={activeContacts.length} />
        <Stat label="Sales this week" value={salesLast7.length} />
        <Stat label="Overdue touches" value={overdueCount} warn={overdueCount > 0} />
        <Stat label="Never touched" value={neverTouched} warn={neverTouched > 0} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-semibold mb-3">Touches &amp; offers — last 7 days</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="touches" fill="#111114" radius={[4, 4, 0, 0]} />
              <Bar dataKey="offers" fill="#C9A227" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold mb-3">Healthy weekly sales breakdown</h3>
          {pieData.length === 0 ? (
            <div className="text-sm text-black/45 py-16 text-center">
              No sales logged yet this week. Log a sale from the Today queue to see your breakdown across new
              prospects, upsells, renewals, referrals, and reactivations.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div className="card p-4">
      <div className="text-xs text-black/45">{label}</div>
      <div className={'text-2xl font-bold mt-1 ' + (warn ? 'text-red-600' : 'text-ink')}>{value}</div>
    </div>
  )
}
