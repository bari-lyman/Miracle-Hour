import * as XLSX from 'xlsx'
import { Contact, LIST_DEFS, ListDef, ListId } from '../types'

const ACTIVE_COLUMNS = ['First Name', 'Last Name', 'Program/Offer', 'Social Links', 'Notes']
const STANDARD_COLUMNS = ['First Name', 'Last Name', 'Business Name', 'Email', 'Phone Number', 'Social Media Page', 'Notes']

export function columnsFor(def: ListDef): string[] {
  return def.columns === 'active' ? ACTIVE_COLUMNS : STANDARD_COLUMNS
}

function rowToContact(row: Record<string, unknown>, def: ListDef): Partial<Contact> {
  const get = (key: string) => {
    const v = row[key]
    return typeof v === 'string' ? v.trim() : v != null ? String(v).trim() : undefined
  }
  if (def.columns === 'active') {
    return {
      firstName: get('First Name') ?? '',
      lastName: get('Last Name') ?? '',
      program: get('Program/Offer'),
      socialLink: get('Social Links'),
      notes: get('Notes'),
    }
  }
  return {
    firstName: get('First Name') ?? '',
    lastName: get('Last Name') ?? '',
    businessName: get('Business Name'),
    email: get('Email'),
    phone: get('Phone Number'),
    socialLink: get('Social Media Page'),
    notes: get('Notes'),
  }
}

function contactToRow(c: Contact, def: ListDef): Record<string, string> {
  if (def.columns === 'active') {
    return {
      'First Name': c.firstName,
      'Last Name': c.lastName,
      'Program/Offer': c.program ?? '',
      'Social Links': c.socialLink ?? '',
      Notes: c.notes ?? '',
    }
  }
  return {
    'First Name': c.firstName,
    'Last Name': c.lastName,
    'Business Name': c.businessName ?? '',
    Email: c.email ?? '',
    'Phone Number': c.phone ?? '',
    'Social Media Page': c.socialLink ?? '',
    Notes: c.notes ?? '',
  }
}

/** Parses an uploaded Dream 1000-style workbook. Matches sheet names loosely
 * (case/space-insensitive) against known list labels; unmatched sheets are
 * skipped. Returns rows grouped by the ListId they were matched to. */
export async function parseDream1000Workbook(file: File): Promise<Record<ListId, Partial<Contact>[]>> {
  const buf = await file.arrayBuffer()
  const wb = XLSX.read(buf, { type: 'array' })
  const result: Partial<Record<ListId, Partial<Contact>[]>> = {}

  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
  const byNormalizedLabel = new Map(LIST_DEFS.map((d) => [normalize(d.label), d]))

  for (const sheetName of wb.SheetNames) {
    const def = byNormalizedLabel.get(normalize(sheetName))
    if (!def) continue
    const sheet = wb.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
    result[def.id] = rows.map((r) => rowToContact(r, def))
  }
  return result as Record<ListId, Partial<Contact>[]>
}

/** Parses a single-list CSV/XLSX file for import into one specific list. */
export async function parseSingleListFile(file: File, def: ListDef): Promise<Partial<Contact>[]> {
  const buf = await file.arrayBuffer()
  const wb = XLSX.read(buf, { type: 'array' })
  const sheet = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
  return rows.map((r) => rowToContact(r, def))
}

/** Exports the full Dream 1000 workbook (all lists, one sheet each) matching
 * the original template's column layout, for round-tripping / backup. */
export function exportDream1000Workbook(contactsByList: Record<ListId, Contact[]>): void {
  const wb = XLSX.utils.book_new()
  for (const def of LIST_DEFS) {
    const rows = (contactsByList[def.id] ?? []).map((c) => contactToRow(c, def))
    const sheet =
      rows.length > 0
        ? XLSX.utils.json_to_sheet(rows, { header: columnsFor(def) })
        : XLSX.utils.aoa_to_sheet([columnsFor(def)])
    XLSX.utils.book_append_sheet(wb, sheet, def.label.slice(0, 31))
  }
  XLSX.writeFile(wb, `dream-1000-export-${new Date().toISOString().slice(0, 10)}.xlsx`)
}

export function exportListCsv(contacts: Contact[], def: ListDef): void {
  const rows = contacts.map((c) => contactToRow(c, def))
  const sheet =
    rows.length > 0
      ? XLSX.utils.json_to_sheet(rows, { header: columnsFor(def) })
      : XLSX.utils.aoa_to_sheet([columnsFor(def)])
  const csv = XLSX.utils.sheet_to_csv(sheet)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${def.label.replace(/\s+/g, '-').toLowerCase()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
