import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Contact,
  DailyLog,
  DEFAULT_SETTINGS,
  ListId,
  SaleEntry,
  Settings,
  TouchOutcome,
  WeeklyPlanDay,
  SaleCategory,
} from './types'
import { makeId, todayISO } from './lib/id'
import { DEFAULT_WEEKLY_PLAN } from './data/weeklyPlan'

interface State {
  contacts: Contact[]
  sales: SaleEntry[]
  dailyLogs: Record<string, DailyLog>
  weeklyPlan: WeeklyPlanDay[]
  settings: Settings
  cycleCounter: number

  addContact: (c: Omit<Partial<Contact>, 'id'> & { listId: ListId; firstName: string }) => Contact
  updateContact: (id: string, patch: Partial<Contact>) => void
  deleteContact: (id: string) => void
  bulkImport: (listId: ListId, rows: Partial<Contact>[]) => number

  logTouch: (contactId: string, outcome: TouchOutcome, note?: string) => void
  logSale: (category: SaleCategory, contactId?: string, amount?: number, note?: string) => void

  toggleCoreActivity: (activityId: string) => void
  setTheme: (theme: string) => void
  getTodayLog: () => DailyLog

  setWeeklyPlan: (plan: WeeklyPlanDay[]) => void
  setSettings: (patch: Partial<Settings>) => void
  resetAll: () => void
  replaceState: (data: Partial<State>) => void
}

function emptyDailyLog(date: string): DailyLog {
  return {
    date,
    theme: '',
    coreActivitiesDone: {},
    touchIds: [],
    offersCount: 0,
    callsBookedCount: 0,
  }
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      contacts: [],
      sales: [],
      dailyLogs: {},
      weeklyPlan: DEFAULT_WEEKLY_PLAN,
      settings: DEFAULT_SETTINGS,
      cycleCounter: 0,

      addContact: (c) => {
        const cycleLength = get().settings.cycleLength
        const cycleDay = (get().cycleCounter % cycleLength) + 1
        const contact: Contact = {
          id: makeId(),
          listId: c.listId,
          firstName: c.firstName,
          lastName: c.lastName ?? '',
          businessName: c.businessName,
          program: c.program,
          email: c.email,
          phone: c.phone,
          socialLink: c.socialLink,
          notes: c.notes,
          cycleDay: c.cycleDay ?? cycleDay,
          readyToBuy: c.readyToBuy ?? false,
          status: c.status ?? 'active',
          createdAt: new Date().toISOString(),
          lastTouchedAt: c.lastTouchedAt,
          touchLog: c.touchLog ?? [],
        }
        set((s) => ({ contacts: [...s.contacts, contact], cycleCounter: s.cycleCounter + 1 }))
        return contact
      },

      updateContact: (id, patch) => {
        set((s) => ({
          contacts: s.contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        }))
      },

      deleteContact: (id) => {
        set((s) => ({ contacts: s.contacts.filter((c) => c.id !== id) }))
      },

      bulkImport: (listId, rows) => {
        const cycleLength = get().settings.cycleLength
        let counter = get().cycleCounter
        const newContacts: Contact[] = rows
          .filter((r) => (r.firstName && r.firstName.trim()) || (r.lastName && r.lastName.trim()))
          .map((r) => {
            const cycleDay = (counter % cycleLength) + 1
            counter += 1
            return {
              id: makeId(),
              listId,
              firstName: r.firstName?.trim() ?? '',
              lastName: r.lastName?.trim() ?? '',
              businessName: r.businessName,
              program: r.program,
              email: r.email,
              phone: r.phone,
              socialLink: r.socialLink,
              notes: r.notes,
              cycleDay,
              readyToBuy: false,
              status: 'active',
              createdAt: new Date().toISOString(),
              touchLog: [],
            } as Contact
          })
        set((s) => ({ contacts: [...s.contacts, ...newContacts], cycleCounter: counter }))
        return newContacts.length
      },

      logTouch: (contactId, outcome, note) => {
        const date = todayISO()
        const entry = { id: makeId(), date, outcome, note }
        set((s) => ({
          contacts: s.contacts.map((c) =>
            c.id === contactId
              ? { ...c, lastTouchedAt: date, touchLog: [...c.touchLog, entry] }
              : c,
          ),
        }))
        set((s) => {
          const log = s.dailyLogs[date] ?? emptyDailyLog(date)
          const touchIds = [...log.touchIds, entry.id]
          const offersCount = log.offersCount + (outcome === 'offer_made' ? 1 : 0)
          const callsBookedCount = log.callsBookedCount + (outcome === 'call_booked' ? 1 : 0)
          return {
            dailyLogs: {
              ...s.dailyLogs,
              [date]: { ...log, touchIds, offersCount, callsBookedCount },
            },
          }
        })
      },

      logSale: (category, contactId, amount, note) => {
        const sale: SaleEntry = { id: makeId(), date: todayISO(), category, contactId, amount, note }
        set((s) => ({ sales: [...s.sales, sale] }))
        if (contactId) {
          get().logTouch(contactId, 'sale', note)
        }
      },

      toggleCoreActivity: (activityId) => {
        const date = todayISO()
        set((s) => {
          const log = s.dailyLogs[date] ?? emptyDailyLog(date)
          return {
            dailyLogs: {
              ...s.dailyLogs,
              [date]: {
                ...log,
                coreActivitiesDone: {
                  ...log.coreActivitiesDone,
                  [activityId]: !log.coreActivitiesDone[activityId],
                },
              },
            },
          }
        })
      },

      setTheme: (theme) => {
        const date = todayISO()
        set((s) => {
          const log = s.dailyLogs[date] ?? emptyDailyLog(date)
          return { dailyLogs: { ...s.dailyLogs, [date]: { ...log, theme } } }
        })
      },

      getTodayLog: () => {
        const date = todayISO()
        return get().dailyLogs[date] ?? emptyDailyLog(date)
      },

      setWeeklyPlan: (plan) => set({ weeklyPlan: plan }),
      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      resetAll: () =>
        set({
          contacts: [],
          sales: [],
          dailyLogs: {},
          weeklyPlan: DEFAULT_WEEKLY_PLAN,
          settings: DEFAULT_SETTINGS,
          cycleCounter: 0,
        }),

      replaceState: (data) => set((s) => ({ ...s, ...data })),
    }),
    { name: 'miracle-hour-dashboard' },
  ),
)
