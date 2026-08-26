export function makeId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function daysBetween(aISO: string, bISO: string): number {
  const a = new Date(aISO + 'T00:00:00')
  const b = new Date(bISO + 'T00:00:00')
  return Math.round((b.getTime() - a.getTime()) / 86400000)
}
