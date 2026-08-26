# Miracle Hour Dashboard

A daily sales & outreach dashboard built on **Kelly Roach's Miracle Hour**
methodology (Virtual Business School). It turns the "Order of Action for
Daily Sales" bullseye, the Dream 1000, the 7 Core Activities, and the daily
goals (100 touches / 20 offers / 10-day cycle) into a working tool you run
every day.

Everything runs client-side — your Dream 1000 data lives only in your
browser's local storage. Nothing is sent to a server.

## What's in it

- **Today** — the daily Miracle Hour dashboard. Set today's theme, check off
  the 7 Core Activities, and work today's outreach queue: everyone whose
  10-day cycle slot falls today, plus anyone overdue, ordered bullseye-in
  (current clients → past clients/internal buyers → referrals → warm leads
  that didn't close → in-ecosystem leads → new leads). Log a touch, an
  offer, a booked call, or a sale straight from the queue. Live progress
  bars track your daily goals and a streak counter rewards consistency.
- **Dream 1000** — contact manager mirroring the original Dream 1000
  spreadsheet's 9 lists (Active Clients, Alumni Targets, Trust-Building
  Offer Targets, Upsell Offer Targets, Referral Targets, Referral Partners,
  Book a Consult, Consult Follow Up, Flagship Offer Targets) plus two
  app-native lists for in-ecosystem and new leads. Import your existing
  Dream 1000 `.xlsx` workbook directly (sheet names are matched
  automatically), import/export single lists as CSV, or add contacts by
  hand.
- **Templates** — the actual scripts from the training materials (welcome
  message, the 13 "top 25" nurture lines, the invitation-to-buy script, and
  the 20-second offer), with fill-in-the-blank variables and one-click copy.
- **Weekly Plan** — an editable Monday–Friday order-of-activity plan, seeded
  from the VBS example so the hour never goes robotic.
- **Reports** — touches/offers over the last 7 days and the "healthy weekly
  sales breakdown" (new prospects / upsells / renewals / referrals /
  reactivations), plus overdue-contact and coverage stats.
- **Role Guide** — the by-department reference (CEO, Sales, Marketing,
  Client Service, Operations) so a whole team can run Miracle Hour together
  without stepping on each other.
- **Settings** — daily goals, cycle length, the overdue threshold, which
  bullseye ring each Dream 1000 list maps to, and JSON backup/restore.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (defaults to `http://localhost:5173`).

## Build for deployment

```bash
npm run build
```

This produces a static site in `dist/`. Since it's a fully client-side app,
you can deploy it anywhere that serves static files — Vercel, Netlify,
GitHub Pages, or just `npm run preview` to serve the build locally.

## Importing your existing Dream 1000

Use **Dream 1000 → Import full Dream 1000 workbook (.xlsx)** and pick your
existing spreadsheet. Sheet names are matched against the 9 list names
above (case/spacing-insensitive) — matching sheets import automatically,
unmatched sheets are skipped. You can also import one list at a time as
CSV or XLSX from within that list's tab.

## Backing up your data

Since all data lives in browser local storage, go to **Settings → Backup &
restore** and export a JSON backup regularly (and before clearing browser
data or switching devices/browsers).
