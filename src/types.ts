// Core data model for the Miracle Hour Dashboard.
// Mirrors Kelly Roach's "Order of Action for Daily Sales" bullseye and the
// Dream 1000 spreadsheet structure (9 native lists from the template + 2
// app-native lists for ecosystem/new leads, which the template doesn't track
// as named sheets but the methodology still requires).

export type RingId =
  | 'current_clients'
  | 'past_clients'
  | 'referrals'
  | 'warm_leads'
  | 'ecosystem_leads'
  | 'new_leads'

export const RING_ORDER: RingId[] = [
  'current_clients',
  'past_clients',
  'referrals',
  'warm_leads',
  'ecosystem_leads',
  'new_leads',
]

export const RING_LABEL: Record<RingId, string> = {
  current_clients: 'Current Clients',
  past_clients: 'Past Clients / Internal Buyers List',
  referrals: 'Referrals',
  warm_leads: "Warm Leads Didn't Close",
  ecosystem_leads: 'In-Ecosystem Leads',
  new_leads: 'New Leads',
}

export const RING_SUBLABEL: Record<RingId, string> = {
  current_clients: 'Quality assurance, upsells, renewals',
  past_clients: 'Alumni, internal buyers, reactivations',
  referrals: 'New referrals + referral partners',
  warm_leads: 'Waitlist, consult, app, launch — didn’t close',
  ecosystem_leads: 'Email list, FB group, engaged on social, launch registrants',
  new_leads: 'Friend requests, ads, brand-new contacts',
}

export type ListId =
  | 'activeClients'
  | 'upsellOfferTargets'
  | 'alumniTargets'
  | 'referralTargets'
  | 'referralPartners'
  | 'bookConsult'
  | 'consultFollowUp'
  | 'trustBuildingOfferTargets'
  | 'flagshipOfferTargets'
  | 'ecosystemLeads'
  | 'newLeads'

export interface ListDef {
  id: ListId
  label: string
  ring: RingId
  /** Column layout matches the source Dream 1000 xlsx template exactly. */
  columns: 'active' | 'standard'
}

export const LIST_DEFS: ListDef[] = [
  { id: 'activeClients', label: 'Active Clients', ring: 'current_clients', columns: 'active' },
  { id: 'alumniTargets', label: 'Alumni Targets', ring: 'past_clients', columns: 'standard' },
  { id: 'trustBuildingOfferTargets', label: 'Trust-Building Offer Targets', ring: 'past_clients', columns: 'standard' },
  { id: 'upsellOfferTargets', label: 'Upsell Offer Targets', ring: 'past_clients', columns: 'standard' },
  { id: 'referralTargets', label: 'Referral Targets', ring: 'referrals', columns: 'standard' },
  { id: 'referralPartners', label: 'Referral Partners', ring: 'referrals', columns: 'standard' },
  { id: 'bookConsult', label: 'Book a Consult', ring: 'warm_leads', columns: 'standard' },
  { id: 'consultFollowUp', label: 'Consult Follow Up', ring: 'warm_leads', columns: 'standard' },
  { id: 'flagshipOfferTargets', label: 'Flagship Offer Targets', ring: 'warm_leads', columns: 'standard' },
  { id: 'ecosystemLeads', label: 'In-Ecosystem Leads', ring: 'ecosystem_leads', columns: 'standard' },
  { id: 'newLeads', label: 'New Leads', ring: 'new_leads', columns: 'standard' },
]

export type TouchOutcome =
  | 'touched'
  | 'offer_made'
  | 'call_booked'
  | 'no_response'
  | 'sale'
  | 'disqualified'

export interface TouchLogEntry {
  id: string
  date: string // ISO date (yyyy-mm-dd)
  outcome: TouchOutcome
  note?: string
}

export interface Contact {
  id: string
  listId: ListId
  firstName: string
  lastName: string
  businessName?: string
  program?: string // "Program/Offer" for Active Clients sheet
  email?: string
  phone?: string
  socialLink?: string
  notes?: string
  cycleDay: number // 1-10, which day of the 10-day rotation this person is touched on
  readyToBuy: boolean
  status: 'active' | 'disqualified'
  createdAt: string
  lastTouchedAt?: string
  touchLog: TouchLogEntry[]
}

export type SaleCategory = 'new_prospects' | 'upsells' | 'renewals' | 'referrals' | 'reactivations'

export const SALE_CATEGORY_LABEL: Record<SaleCategory, string> = {
  new_prospects: 'New Prospects',
  upsells: 'Upsells',
  renewals: 'Renewals',
  referrals: 'Referrals',
  reactivations: 'Reactivations',
}

export interface SaleEntry {
  id: string
  date: string
  category: SaleCategory
  contactId?: string
  amount?: number
  note?: string
}

export interface CoreActivity {
  id: string
  label: string
  detail: string
}

export const CORE_ACTIVITIES: CoreActivity[] = [
  { id: 'post', label: 'Post on your feed', detail: 'Batched in advance; alternate Hope / How-To / Conviction. Get it up before you start.' },
  { id: 'dream1000', label: 'Dream 1000 touch points', detail: "Work today's cycle queue below." },
  { id: 'engage_top', label: 'Engage on top prospects’ content', detail: 'Comment/react on their feed, not just yours.' },
  { id: 'thread_sweep', label: 'Thread sweep', detail: '“View all comments” on your posts, groups, and team threads.' },
  { id: 'inbox_sweep', label: 'Inbox sweep', detail: 'Message the Dream 1000 with value-add, even with no response yet.' },
  { id: 'make_offers', label: 'Make offers / consult invites', detail: 'Target: 20 offers today.' },
  { id: 'friend_requests', label: 'Friend request new leads', detail: 'Fill the top of the funnel.' },
]

export interface DailyLog {
  date: string
  theme: string
  coreActivitiesDone: Record<string, boolean>
  touchIds: string[] // touch log entry ids logged today, for quick counting
  offersCount: number
  callsBookedCount: number
}

export interface WeeklyPlanDay {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'
  items: string[]
}

export interface Settings {
  dailyTouchGoal: number
  dailyOfferGoal: number
  cycleLength: number
  touchReminderDays: number // flag overdue if not touched in N days
  ringOverride: Partial<Record<ListId, RingId>>
}

export const DEFAULT_SETTINGS: Settings = {
  dailyTouchGoal: 100,
  dailyOfferGoal: 20,
  cycleLength: 10,
  touchReminderDays: 14,
  ringOverride: {},
}
