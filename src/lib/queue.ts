import { Contact, LIST_DEFS, ListId, RING_ORDER, RingId, Settings } from '../types'
import { daysBetween, todayISO } from './id'

export function listRing(listId: ListId, settings: Settings): RingId {
  const override = settings.ringOverride[listId]
  if (override) return override
  return LIST_DEFS.find((l) => l.id === listId)!.ring
}

export function todayCycleDay(cycleLength: number): number {
  const daysSinceEpoch = Math.floor(Date.now() / 86400000)
  return (daysSinceEpoch % cycleLength) + 1
}

export interface QueueItem {
  contact: Contact
  ring: RingId
  overdue: boolean
  dueToday: boolean
  daysSinceTouch: number | null
}

/**
 * Builds today's Miracle Hour outreach queue: everyone whose 10-day cycle
 * slot lands on today, plus anyone overdue (untouched past the reminder
 * window) regardless of slot — ordered by bullseye ring (current clients
 * first, new leads last), most-overdue first within each ring.
 */
export function buildTodayQueue(contacts: Contact[], settings: Settings): QueueItem[] {
  const today = todayISO()
  const cycleDay = todayCycleDay(settings.cycleLength)
  const ringIndex = new Map(RING_ORDER.map((r, i) => [r, i]))

  const items: QueueItem[] = contacts
    .filter((c) => c.status === 'active')
    .map((c) => {
      const ring = listRing(c.listId, settings)
      const daysSinceTouch = c.lastTouchedAt ? daysBetween(c.lastTouchedAt, today) : null
      const overdue = daysSinceTouch === null ? true : daysSinceTouch >= settings.touchReminderDays
      const dueToday = c.cycleDay === cycleDay
      return { contact: c, ring, overdue, dueToday, daysSinceTouch }
    })
    .filter((item) => item.dueToday || item.overdue)

  items.sort((a, b) => {
    const ringDiff = (ringIndex.get(a.ring) ?? 99) - (ringIndex.get(b.ring) ?? 99)
    if (ringDiff !== 0) return ringDiff
    if (a.overdue !== b.overdue) return a.overdue ? -1 : 1
    const aDays = a.daysSinceTouch ?? 9999
    const bDays = b.daysSinceTouch ?? 9999
    return bDays - aDays
  })

  return items
}
