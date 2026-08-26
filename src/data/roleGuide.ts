export interface RoleGuideEntry {
  id: string
  role: string
  responsibility: string
  focusAreas: string[]
  priorities: string[]
  outcomes: string[]
  quote: string
}

// From "Executing the Miracle Hour by Department Role" (Miracle Hour Toolkit p.23-28)
export const ROLE_GUIDE: RoleGuideEntry[] = [
  {
    id: 'ceo',
    role: 'Executive / Founder / CEO',
    responsibility: 'Direction, Demand, Visibility',
    focusAreas: ['Vision casting', 'Authority building', 'Strategic relationships', 'Market trust', 'Large deals'],
    priorities: [
      'Creating and sharing thought leadership content',
      'Going live or publishing long-form content (podcasts, articles)',
      'Engaging with peers, collaboration partners, and high-level prospects',
      'Promoting core offers or driving strategic initiatives',
      'Strategic networking and following up with high-value relationships',
      'Taking exclusive sales meetings that only the leader of a company can take',
    ],
    outcomes: ['Increased brand authority', 'Warmer sales conversations', 'Stronger trust at the top of the funnel', 'Large deals'],
    quote: 'The CEO fuels the energy, and the team fuels the execution.',
  },
  {
    id: 'sales',
    role: 'Sales Team',
    responsibility: 'Offers, Conversations, Conversion',
    focusAreas: ['Stage 2–4 execution', 'Active conversations', 'Follow-up and decision support'],
    priorities: [
      'Inbox sweeps and DM follow-ups',
      'Responding to warm leads',
      'Inviting to calls, demos, consults, or direct offers to buy',
      'Re-engaging prospects that went cold',
      'Sending personal follow-ups post-call or conversation',
      'Following up with every inquiry for services',
    ],
    outcomes: ['Leads in conversation', 'Calls booked', 'Follow-ups completed', 'Conversions'],
    quote: 'Sales executes the bottom half of the funnel, but must still support the top.',
  },
  {
    id: 'marketing',
    role: 'Marketing Team',
    responsibility: 'Visibility & Demand Creation',
    focusAreas: ['New leads generated', 'New followers', 'New email subscribers', 'Launch/event registrations'],
    priorities: [
      'Publishing and scheduling content',
      'Engaging on ideal-client accounts',
      'Sweeping one-word marketing threads to pull leads through to conversion (opt-in, list, launch registration)',
      'Promoting workshops, webinars, or lead magnets',
      'Driving traffic to opt-ins, email lists, or events',
      'Supporting sales with fresh demand through list growth',
      'Planning collabs or local events for brick-and-mortar businesses',
    ],
    outcomes: ['Owns Stage 1 and early Stage 2 — volume and consistency, not immediate ROI'],
    quote: 'Marketing fills the funnel so sales never has to “start from zero.”',
  },
  {
    id: 'client_service',
    role: 'Client Service / Delivery Team',
    responsibility: 'Retention, Expansion, Advocacy',
    focusAreas: ['Higher lifetime value', 'Increased renewals', 'Organic referrals/affiliate partners', 'Reduced churn'],
    priorities: [
      'Personal check-ins with active clients',
      'Gathering online reviews',
      'Identifying add-on or upsell opportunities',
      'Following up on usage, results, or wins',
      'Inviting satisfied clients into next-level upgrade offers',
      'Asking for referrals / introductions',
      'Re-engaging disengaged or at-risk clients',
    ],
    outcomes: ['Your warmest leads are your current clients — this role keeps revenue compounding instead of leaking.'],
    quote: 'This is where most companies leave money on the table.',
  },
  {
    id: 'ops',
    role: 'Operations / Admin / Support',
    responsibility: 'Speed, Experience, Trust Protection',
    focusAreas: ['Speed of response', 'Removing friction', 'Protecting client experience', 'Ensuring nothing falls through the cracks'],
    priorities: [
      'Responding to support requests',
      'Following up on incomplete onboarding',
      'Tracking unanswered inquiries',
      'Improving internal systems that slow conversion',
      'Flagging issues that could block renewals or referrals',
      'Collections / cost savings',
    ],
    outcomes: ['Not outward-facing in sales, but directly impacts conversion and retention.'],
    quote: 'Every department touches the funnel differently, but every department drives daily revenue.',
  },
]
