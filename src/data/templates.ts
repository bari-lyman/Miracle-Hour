export interface MessageTemplate {
  id: string
  category: string
  title: string
  body: string // use {{variable}} placeholders
}

// All copy pulled directly from the Virtual Business School Miracle Hour
// training materials (welcome message, top-25 engagement lines, invitation
// to buy, and the 20-second offer script).
export const TEMPLATES: MessageTemplate[] = [
  {
    id: 'welcome_new_follower',
    category: 'Top of Funnel',
    title: 'Welcome new follower / connection',
    body: `Hi {{Name}},

Thanks so much for following along.

I love creating content with my followers/connections/friends in mind—so I would love to get to know you a bit better!

I can see from your profile that {{something specific from their profile}}. {{Ask a specific question about that thing—as closely related to your area of expertise as possible}}.

{{Your Name}}`,
  },
  {
    id: 'top25_still_interested',
    category: 'Middle of Funnel — Top 25 Nurture',
    title: 'Still interested?',
    body: `Are you still interested in {{result}}?`,
  },
  {
    id: 'top25_hope_ok',
    category: 'Middle of Funnel — Top 25 Nurture',
    title: 'Hope everything is ok',
    body: `Hey — hope everything is ok?`,
  },
  {
    id: 'top25_trying_to_reach',
    category: 'Middle of Funnel — Top 25 Nurture',
    title: 'Trying to reach you',
    body: `I have been trying to reach you, hope everything is ok?`,
  },
  {
    id: 'top25_never_connected',
    category: 'Middle of Funnel — Top 25 Nurture',
    title: 'Never actually connected',
    body: `We have been connected for forever, but never actually connected?!`,
  },
  {
    id: 'top25_still_priority',
    category: 'Middle of Funnel — Top 25 Nurture',
    title: 'Still a priority?',
    body: `Is {{goal/result}} still a priority for you?`,
  },
  {
    id: 'top25_thinking_of_you',
    category: 'Middle of Funnel — Top 25 Nurture',
    title: 'Thinking of you',
    body: `I was just thinking of you…`,
  },
  {
    id: 'top25_had_to_share',
    category: 'Middle of Funnel — Top 25 Nurture',
    title: 'Had to share this',
    body: `I had to share this… {{a client success in a similar situation that directly relates to them}} — made me think of you and where you wanted to get to.`,
  },
  {
    id: 'top25_here_to_help',
    category: 'Middle of Funnel — Top 25 Nurture',
    title: 'Here when ready',
    body: `I am here to help when you are ready.`,
  },
  {
    id: 'top25_still_working_on',
    category: 'Middle of Funnel — Top 25 Nurture',
    title: 'Still working on it?',
    body: `Are you still working on {{goal}}?`,
  },
  {
    id: 'top25_forgot_to_mention',
    category: 'Middle of Funnel — Top 25 Nurture',
    title: 'Forgot to mention',
    body: `I forgot to mention this in our conversation… {{detail}}`,
  },
  {
    id: 'top25_by_date',
    category: 'Middle of Funnel — Top 25 Nurture',
    title: 'Still on track for their date?',
    body: `Are you still looking to achieve {{goal}} by {{date}}?`,
  },
  {
    id: 'top25_thought_of_you',
    category: 'Middle of Funnel — Top 25 Nurture',
    title: 'Thought of you',
    body: `I thought of you — I think this will make a difference: {{resource/insight}}`,
  },
  {
    id: 'top25_best_results',
    category: 'Middle of Funnel — Top 25 Nurture',
    title: 'What’s working right now',
    body: `This is what our clients are seeing the best results with right now: {{result/proof}}`,
  },
  {
    id: 'invitation_to_buy_recap',
    category: 'Bottom of Funnel — Invitation to Buy',
    title: 'Recap + invite',
    body: `Based on everything we have spoken about, what I am hearing is that you want results in the areas of {{area 1}}, {{area 2}} and {{area 3}}, and you don't want to compromise {{value}} in order to achieve this. I think {{offer}} would be the perfect solution for you to achieve these results while feeling {{desired feeling}}. What questions do you have about {{offer}}?`,
  },
  {
    id: 'invitation_to_buy_concerns',
    category: 'Bottom of Funnel — Invitation to Buy',
    title: 'Concerns + ready check',
    body: `Based on everything we've discussed so far about {{offer}}, what concerns do you have about moving forward? Are you ready to get started?`,
  },
  {
    id: 'twenty_second_offer',
    category: 'The 20-Second Sale',
    title: 'One-line offer (voice memo / text / DM)',
    body: `Hey {{Name}}, it's been so awesome connecting with you about your goals to {{their goal}}. I don't know if you saw, but we're open for {{offer/program}} right now. If you are ready to create {{desired outcome}}, I'd love to invite you to join. What questions do you have — or are you ready to join us?`,
  },
]

export const TEMPLATE_CATEGORIES = Array.from(new Set(TEMPLATES.map((t) => t.category)))
