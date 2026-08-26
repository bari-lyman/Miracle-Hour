import { WeeklyPlanDay } from '../types'

// Seeded from the VBS "Order of Activity" example — editable in-app.
export const DEFAULT_WEEKLY_PLAN: WeeklyPlanDay[] = [
  {
    day: 'Monday',
    items: [
      'All 7 core activities',
      'Actives: quality assurance, upsells/add-ons, ticket sales, renewal offers',
      'Inactives: relationship-building call bookings, consult bookings, presentation of offer, re-engagement touchpoints, warm cycle touches',
      'Referrals: new referral generation, referral partner outreach, guest training in partner groups, invites to local meetups/events',
      'New hot leads',
      'Confirm all call bookings for the week',
    ],
  },
  {
    day: 'Tuesday',
    items: [
      'Warm lead outreach — all lists',
      'All 7 core activities',
      'Nurture + sales: consult follow-up, consult booking (warm leads), trust-builder offers to warm leads, launch/masterclass lead follow-up',
      'New hot leads',
    ],
  },
  {
    day: 'Wednesday',
    items: [
      'All 7 core activities',
      'Warm lead outreach — all lists',
      'Nurture + sales: consult follow-up, consult booking (warm leads), trust-builder offers to warm leads, launch/masterclass lead follow-up',
      'New hot leads',
    ],
  },
  {
    day: 'Thursday',
    items: [
      'All 7 core activities',
      'In-ecosystem leads + new leads: nurture and sales, new lead qualifying, booking upsell calls (mid-tier/high ticket)',
      'New hot leads',
    ],
  },
  {
    day: 'Friday',
    items: [
      'All 7 core activities',
      'Cycle-back: close-gap call bookings, next-steps touches where applicable',
      'New lead qualifying',
      'Booking upsell calls (mid-tier/high ticket)',
      'Invite new strategic/referral partners; book a collab for visibility',
    ],
  },
]
