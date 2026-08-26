import { useState } from 'react'
import { useStore } from '../store'
import { Contact, LIST_DEFS, ListId } from '../types'

export default function ContactModal({
  contact,
  defaultListId,
  onClose,
}: {
  contact: Contact | null
  defaultListId: ListId
  onClose: () => void
}) {
  const addContact = useStore((s) => s.addContact)
  const updateContact = useStore((s) => s.updateContact)
  const deleteContact = useStore((s) => s.deleteContact)

  const [form, setForm] = useState<Partial<Contact>>(
    contact ?? {
      listId: defaultListId,
      firstName: '',
      lastName: '',
      readyToBuy: false,
      status: 'active',
    },
  )

  const listDef = LIST_DEFS.find((l) => l.id === form.listId) ?? LIST_DEFS[0]
  const isActiveColumns = listDef.columns === 'active'

  function set<K extends keyof Contact>(key: K, value: Contact[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function save() {
    if (!form.firstName?.trim()) return
    if (contact) {
      updateContact(contact.id, form)
    } else {
      addContact(form as any)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="card w-full max-w-lg p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">{contact ? 'Edit contact' : 'Add contact'}</h3>
          <button className="btn-ghost !px-2" onClick={onClose}>✕</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-black/50">First name</label>
            <input className="input mt-1" value={form.firstName ?? ''} onChange={(e) => set('firstName', e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-black/50">Last name</label>
            <input className="input mt-1" value={form.lastName ?? ''} onChange={(e) => set('lastName', e.target.value)} />
          </div>

          <div className="col-span-2">
            <label className="text-xs text-black/50">List</label>
            <select
              className="input mt-1"
              value={form.listId}
              onChange={(e) => set('listId', e.target.value as ListId)}
              disabled={!!contact}
            >
              {LIST_DEFS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {isActiveColumns ? (
            <div className="col-span-2">
              <label className="text-xs text-black/50">Program / Offer</label>
              <input className="input mt-1" value={form.program ?? ''} onChange={(e) => set('program', e.target.value)} />
            </div>
          ) : (
            <>
              <div className="col-span-2">
                <label className="text-xs text-black/50">Business name</label>
                <input className="input mt-1" value={form.businessName ?? ''} onChange={(e) => set('businessName', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-black/50">Email</label>
                <input className="input mt-1" value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-black/50">Phone</label>
                <input className="input mt-1" value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} />
              </div>
            </>
          )}

          <div className="col-span-2">
            <label className="text-xs text-black/50">{isActiveColumns ? 'Social links' : 'Social media page'}</label>
            <input className="input mt-1" value={form.socialLink ?? ''} onChange={(e) => set('socialLink', e.target.value)} />
          </div>

          <div className="col-span-2">
            <label className="text-xs text-black/50">Notes</label>
            <textarea className="input mt-1" rows={3} value={form.notes ?? ''} onChange={(e) => set('notes', e.target.value)} />
          </div>

          <div className="col-span-2 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!form.readyToBuy} onChange={(e) => set('readyToBuy', e.target.checked)} />
              Ready to buy
            </label>
            {contact && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.status === 'disqualified'}
                  onChange={(e) => set('status', e.target.checked ? 'disqualified' : 'active')}
                />
                Disqualified
              </label>
            )}
            {contact && (
              <div className="ml-auto flex items-center gap-2 text-sm">
                <span className="text-black/40">Cycle day</span>
                <input
                  type="number"
                  min={1}
                  className="input w-16 !px-2 !py-1"
                  value={form.cycleDay ?? 1}
                  onChange={(e) => set('cycleDay', Number(e.target.value))}
                />
              </div>
            )}
          </div>
        </div>

        {contact && contact.touchLog.length > 0 && (
          <div className="mt-4 border-t border-black/10 pt-3">
            <div className="text-xs text-black/50 mb-1.5">Touch history</div>
            <ul className="text-sm space-y-1 max-h-28 overflow-y-auto pr-1">
              {[...contact.touchLog].reverse().map((t) => (
                <li key={t.id} className="text-black/70">
                  <span className="text-black/40">{t.date}</span> — {t.outcome.replace('_', ' ')}
                  {t.note ? `: ${t.note}` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          {contact ? (
            <button
              className="btn-outline text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => {
                deleteContact(contact.id)
                onClose()
              }}
            >
              Delete
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-gold" onClick={save}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
