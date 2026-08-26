import { useMemo, useState } from 'react'
import { TEMPLATE_CATEGORIES, TEMPLATES } from '../data/templates'

function extractVars(body: string): string[] {
  const matches = body.match(/{{\s*([^}]+)\s*}}/g) ?? []
  return Array.from(new Set(matches.map((m) => m.replace(/[{}]/g, '').trim())))
}

function fillTemplate(body: string, values: Record<string, string>): string {
  return body.replace(/{{\s*([^}]+)\s*}}/g, (_, key) => {
    const k = key.trim()
    return values[k]?.trim() ? values[k] : `[${k}]`
  })
}

function TemplateCard({ id, title, body }: { id: string; title: string; body: string }) {
  const vars = useMemo(() => extractVars(body), [body])
  const [values, setValues] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)
  const filled = fillTemplate(body, values)

  async function copy() {
    try {
      await navigator.clipboard.writeText(filled)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable — user can still select the text manually
    }
  }

  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="font-medium">{title}</div>
      {vars.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {vars.map((v) => (
            <input
              key={v}
              className="input !py-1 text-xs"
              placeholder={v}
              value={values[v] ?? ''}
              onChange={(e) => setValues((s) => ({ ...s, [v]: e.target.value }))}
            />
          ))}
        </div>
      )}
      <div className="text-sm whitespace-pre-wrap bg-black/[0.03] rounded-lg p-3 leading-relaxed">{filled}</div>
      <button className="btn-gold self-start" onClick={copy}>
        {copied ? 'Copied ✓' : 'Copy message'}
      </button>
    </div>
  )
}

export default function TemplatesView() {
  const [category, setCategory] = useState<string>('all')

  const filtered = category === 'all' ? TEMPLATES : TEMPLATES.filter((t) => t.category === category)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h2 className="font-semibold text-lg">Message templates</h2>
        <p className="text-sm text-black/50 mt-1">
          Straight from the Miracle Hour scripts: welcome messages, top-25 nurture lines, invitation-to-buy, and the
          20-second offer. Fill in the blanks, copy, and paste into your DM/text/email.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            className={'px-3 py-1.5 rounded-full text-sm border ' + (category === 'all' ? 'bg-ink text-white border-ink' : 'border-black/10 hover:bg-black/5')}
            onClick={() => setCategory('all')}
          >
            All
          </button>
          {TEMPLATE_CATEGORIES.map((c) => (
            <button
              key={c}
              className={'px-3 py-1.5 rounded-full text-sm border ' + (category === c ? 'bg-ink text-white border-ink' : 'border-black/10 hover:bg-black/5')}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((t) => (
          <TemplateCard key={t.id} id={t.id} title={t.title} body={t.body} />
        ))}
      </div>
    </div>
  )
}
