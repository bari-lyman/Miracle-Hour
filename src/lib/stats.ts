import { DailyLog, SaleEntry } from '../types'
import { daysBetween, todayISO } from './id'

export function computeStreak(dailyLogs: Record<string, DailyLog>): number {
  let streak = 0
  let cursor = new Date()
  // If today has no touches yet, streak counts back from yesterday so a
  // fresh morning doesn't show 0 before the user has done anything.
  const today = todayISO()
  const todayLog = dailyLogs[today]
  if (!todayLog || todayLog.touchIds.length === 0) {
    cursor.setDate(cursor.getDate() - 1)
  }
  for (let i = 0; i < 3650; i++) {
    const iso = cursor.toISOString().slice(0, 10)
    const log = dailyLogs[iso]
    if (log && log.touchIds.length > 0) {
      streak += 1
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

export function last7Days(): string[] {
  const out: string[] = []
  const cursor = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(cursor)
    d.setDate(cursor.getDate() - i)
    out.push(d.toISOString().slice(0, 10))
  }
  return out
}

export function salesInRange(sales: SaleEntry[], fromISO: string, toISO: string): SaleEntry[] {
  return sales.filter((s) => daysBetween(s.date, toISO) >= 0 && daysBetween(fromISO, s.date) >= 0)
}
