import { useStore } from '../store'
import { WeeklyPlanDay } from '../types'
import { DEFAULT_WEEKLY_PLAN } from '../data/weeklyPlan'

export default function WeeklyPlanView() {
  const weeklyPlan = useStore((s) => s.weeklyPlan)
  const setWeeklyPlan = useStore((s) => s.setWeeklyPlan)

  function updateDay(dayName: WeeklyPlanDay['day'], items: string[]) {
    setWeeklyPlan(weeklyPlan.map((d) => (d.day === dayName ? { ...d, items } : d)))
  }

  function updateItem(dayName: WeeklyPlanDay['day'], idx: number, value: string) {
    const day = weeklyPlan.find((d) => d.day === dayName)!
    const items = [...day.items]
    items[idx] = value
    updateDay(dayName, items)
  }

  function addItem(dayName: WeeklyPlanDay['day']) {
    const day = weeklyPlan.find((d) => d.day === dayName)!
    updateDay(dayName, [...day.items, ''])
  }

  function removeItem(dayName: WeeklyPlanDay['day'], idx: number) {
    const day = weeklyPlan.find((d) => d.day === dayName)!
    updateDay(dayName, day.items.filter((_, i) => i !== idx))
  }

  const today = new Date().toLocaleDateString(undefined, { weekday: 'long' })

  return (
    <div className="space-y-4">
      <div className="card p-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">Weekly Order of Activity</h2>
          <p className="text-sm text-black/50 mt-1">
            Each day gets its own theme so the hour never goes robotic — edit freely to match your business.
          </p>
        </div>
        <button className="btn-outline" onClick={() => setWeeklyPlan(DEFAULT_WEEKLY_PLAN)}>
          Reset to VBS example
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {weeklyPlan.map((day) => (
          <div key={day.day} className={'card p-4 ' + (day.day === today ? 'ring-2 ring-gold' : '')}>
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">{day.day}</div>
              {day.day === today && <span className="badge bg-gold text-ink">today</span>}
            </div>
            <ul className="space-y-2">
              {day.items.map((item, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="text-black/30 mt-2">•</span>
                  <textarea
                    className="input flex-1 !py-1 text-sm resize-none"
                    rows={2}
                    value={item}
                    onChange={(e) => updateItem(day.day, i, e.target.value)}
                  />
                  <button className="text-black/30 hover:text-red-500 mt-1.5" onClick={() => removeItem(day.day, i)}>
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <button className="btn-ghost text-xs mt-2" onClick={() => addItem(day.day)}>
              + add item
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
