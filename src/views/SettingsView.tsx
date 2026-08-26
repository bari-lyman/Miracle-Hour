import { useRef, useState } from 'react'
import { useStore } from '../store'
import { LIST_DEFS, RING_LABEL, RING_ORDER } from '../types'

export default function SettingsView() {
  const settings = useStore((s) => s.settings)
  const setSettings = useStore((s) => s.setSettings)
  const resetAll = useStore((s) => s.resetAll)
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<string | null>(null)

  function exportBackup() {
    const state = useStore.getState()
    const data = {
      contacts: state.contacts,
      sales: state.sales,
      dailyLogs: state.dailyLogs,
      weeklyPlan: state.weeklyPlan,
      settings: state.settings,
      cycleCounter: state.cycleCounter,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `miracle-hour-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function importBackup(file: File) {
    const text = await file.text()
    try {
      const data = JSON.parse(text)
      useStore.getState().replaceState(data)
      setMsg('Backup restored.')
    } catch {
      setMsg('Could not read that file — is it a Miracle Hour backup JSON?')
    }
    setTimeout(() => setMsg(null), 4000)
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="card p-5">
        <h2 className="font-semibold text-lg mb-4">Daily goals</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Daily touch goal">
            <input
              type="number"
              className="input"
              value={settings.dailyTouchGoal}
              onChange={(e) => setSettings({ dailyTouchGoal: Number(e.target.value) })}
            />
          </Field>
          <Field label="Daily offer goal">
            <input
              type="number"
              className="input"
              value={settings.dailyOfferGoal}
              onChange={(e) => setSettings({ dailyOfferGoal: Number(e.target.value) })}
            />
          </Field>
          <Field label="Cycle length (days)">
            <input
              type="number"
              className="input"
              value={settings.cycleLength}
              onChange={(e) => setSettings({ cycleLength: Number(e.target.value) })}
            />
          </Field>
          <Field label="Flag overdue after (days)">
            <input
              type="number"
              className="input"
              value={settings.touchReminderDays}
              onChange={(e) => setSettings({ touchReminderDays: Number(e.target.value) })}
            />
          </Field>
        </div>
        <p className="text-xs text-black/40 mt-3">
          Kelly Roach's defaults: 100 touches/day, 20 offers/day, a 10-day cycle so everyone on your Dream 1000
          hears from you at least twice a month.
        </p>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-lg mb-1">Bullseye ring mapping</h2>
        <p className="text-sm text-black/50 mb-4">
          Which ring of the "Order of Action" bullseye each Dream 1000 list belongs to. Defaults follow Kelly
          Roach's methodology — override if your business categorizes differently.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {LIST_DEFS.map((l) => (
            <div key={l.id} className="flex items-center justify-between gap-2 text-sm">
              <span>{l.label}</span>
              <select
                className="input !w-auto"
                value={settings.ringOverride[l.id] ?? l.ring}
                onChange={(e) =>
                  setSettings({
                    ringOverride: { ...settings.ringOverride, [l.id]: e.target.value as any },
                  })
                }
              >
                {RING_ORDER.map((r) => (
                  <option key={r} value={r}>
                    {RING_LABEL[r]}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-lg mb-1">Backup &amp; restore</h2>
        <p className="text-sm text-black/50 mb-4">
          Everything lives in this browser's local storage. Export a backup regularly, or before clearing browser
          data / switching devices.
        </p>
        <div className="flex flex-wrap gap-2">
          <button className="btn-outline" onClick={exportBackup}>
            Export JSON backup
          </button>
          <button className="btn-outline" onClick={() => fileRef.current?.click()}>
            Import backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && importBackup(e.target.files[0])}
          />
        </div>
        {msg && <div className="text-sm text-gold-dark mt-2">{msg}</div>}
      </div>

      <div className="card p-5 border-red-100">
        <h2 className="font-semibold text-lg mb-1 text-red-600">Danger zone</h2>
        <p className="text-sm text-black/50 mb-4">
          Wipes all contacts, sales, activity logs, and settings from this browser. Export a backup first.
        </p>
        <button
          className="btn-outline border-red-300 text-red-600 hover:bg-red-50"
          onClick={() => {
            if (confirm('This will permanently delete all local data. Continue?')) resetAll()
          }}
        >
          Reset everything
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-black/50">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}
