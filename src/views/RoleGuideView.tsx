import { ROLE_GUIDE } from '../data/roleGuide'

export default function RoleGuideView() {
  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h2 className="font-semibold text-lg">Miracle Hour by role</h2>
        <p className="text-sm text-black/50 mt-1">
          The Miracle Hour is full-funnel execution, not just a "sales hour." Every role touches the funnel
          differently — when everyone runs it together, you eliminate silos and create company-wide revenue
          momentum.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {ROLE_GUIDE.map((r) => (
          <div key={r.id} className="card p-5">
            <div className="font-semibold text-lg">{r.role}</div>
            <div className="text-sm text-gold-dark font-medium mt-0.5">{r.responsibility}</div>

            <div className="mt-3">
              <div className="text-xs uppercase tracking-wide text-black/40 mb-1">Focus areas</div>
              <div className="flex flex-wrap gap-1.5">
                {r.focusAreas.map((f) => (
                  <span key={f} className="badge bg-black/5 text-black/60">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xs uppercase tracking-wide text-black/40 mb-1">Miracle Hour priorities</div>
              <ul className="text-sm space-y-1">
                {r.priorities.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-gold-dark">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3">
              <div className="text-xs uppercase tracking-wide text-black/40 mb-1">Outcomes</div>
              <div className="flex flex-wrap gap-1.5">
                {r.outcomes.map((o) => (
                  <span key={o} className="badge bg-gold/15 text-gold-dark">
                    {o}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-sm italic text-black/50 mt-4 border-t border-black/10 pt-3">"{r.quote}"</p>
          </div>
        ))}
      </div>
    </div>
  )
}
