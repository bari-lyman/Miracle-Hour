import { useMemo, useRef, useState } from 'react'
import { useStore } from '../store'
import { Contact, LIST_DEFS, ListId } from '../types'
import ContactModal from '../components/ContactModal'
import { exportDream1000Workbook, exportListCsv, parseDream1000Workbook, parseSingleListFile } from '../lib/xlsxIO'

export default function ContactsView() {
  const contacts = useStore((s) => s.contacts)
  const bulkImport = useStore((s) => s.bulkImport)
  const [activeList, setActiveList] = useState<ListId>('activeClients')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Contact | null | 'new'>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const wbFileRef = useRef<HTMLInputElement>(null)
  const [importMsg, setImportMsg] = useState<string | null>(null)

  const listDef = LIST_DEFS.find((l) => l.id === activeList)!

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return contacts
      .filter((c) => c.listId === activeList)
      .filter((c) => {
        if (!q) return true
        return (
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          (c.businessName ?? '').toLowerCase().includes(q) ||
          (c.program ?? '').toLowerCase().includes(q)
        )
      })
      .sort((a, b) => a.firstName.localeCompare(b.firstName))
  }, [contacts, activeList, search])

  const contactsByList = useMemo(() => {
    const map: Record<ListId, Contact[]> = {} as any
    for (const l of LIST_DEFS) map[l.id] = contacts.filter((c) => c.listId === l.id)
    return map
  }, [contacts])

  async function handleSingleImport(file: File) {
    const parsed = await parseSingleListFile(file, listDef)
    const n = bulkImport(activeList, parsed)
    setImportMsg(`Imported ${n} contacts into ${listDef.label}.`)
    setTimeout(() => setImportMsg(null), 4000)
  }

  async function handleWorkbookImport(file: File) {
    const grouped = await parseDream1000Workbook(file)
    let total = 0
    for (const [listId, rows] of Object.entries(grouped) as [ListId, Partial<Contact>[]][]) {
      total += bulkImport(listId, rows)
    }
    setImportMsg(`Imported ${total} contacts across ${Object.keys(grouped).length} matched sheets.`)
    setTimeout(() => setImportMsg(null), 5000)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 flex flex-wrap items-center gap-2">
        <div className="font-semibold mr-2">Dream 1000</div>
        <span className="text-sm text-black/40">{contacts.length} total contacts</span>
        <div className="ml-auto flex flex-wrap gap-2">
          <button className="btn-outline" onClick={() => wbFileRef.current?.click()}>
            Import full Dream 1000 workbook (.xlsx)
          </button>
          <input
            ref={wbFileRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleWorkbookImport(e.target.files[0])}
          />
          <button className="btn-outline" onClick={() => exportDream1000Workbook(contactsByList)}>
            Export full workbook
          </button>
        </div>
      </div>

      {importMsg && <div className="card p-3 text-sm bg-gold/10 border-gold/30">{importMsg}</div>}

      <div className="flex flex-wrap gap-2">
        {LIST_DEFS.map((l) => (
          <button
            key={l.id}
            onClick={() => setActiveList(l.id)}
            className={
              'px-3 py-1.5 rounded-full text-sm border transition-colors ' +
              (activeList === l.id ? 'bg-ink text-white border-ink' : 'bg-white border-black/10 hover:bg-black/5')
            }
          >
            {l.label} <span className="opacity-50">({contactsByList[l.id]?.length ?? 0})</span>
          </button>
        ))}
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <input
            className="input max-w-xs"
            placeholder="Search this list…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="ml-auto flex gap-2">
            <button className="btn-outline" onClick={() => fileRef.current?.click()}>
              Import CSV/XLSX
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleSingleImport(e.target.files[0])}
            />
            <button className="btn-outline" onClick={() => exportListCsv(rows, listDef)}>
              Export CSV
            </button>
            <button className="btn-gold" onClick={() => setEditing('new')}>
              + Add contact
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-black/40 border-b border-black/10">
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">{listDef.columns === 'active' ? 'Program' : 'Business'}</th>
                <th className="py-2 pr-3">Cycle day</th>
                <th className="py-2 pr-3">Last touch</th>
                <th className="py-2 pr-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b border-black/5 hover:bg-black/[0.02] cursor-pointer" onClick={() => setEditing(c)}>
                  <td className="py-2 pr-3 font-medium">
                    {c.firstName} {c.lastName} {c.readyToBuy && <span className="badge bg-gold/20 text-gold-dark ml-1">RTB</span>}
                  </td>
                  <td className="py-2 pr-3 text-black/60">{c.businessName || c.program || '—'}</td>
                  <td className="py-2 pr-3 text-black/60">{c.cycleDay}</td>
                  <td className="py-2 pr-3 text-black/60">{c.lastTouchedAt ?? 'never'}</td>
                  <td className="py-2 pr-3">
                    <span className={'badge ' + (c.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-black/10 text-black/40')}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-black/40">
                    No contacts yet in {listDef.label}. Add one, or import from your Dream 1000 spreadsheet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing !== null && (
        <ContactModal
          contact={editing === 'new' ? null : editing}
          defaultListId={activeList}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}
