import { useEffect, useState } from 'react'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const moods = [
  { k: 'calm', label: 'Calm' },
  { k: 'happy', label: 'Happy' },
  { k: 'ok', label: 'Okay' },
  { k: 'stressed', label: 'Stressed' },
  { k: 'anxious', label: 'Anxious' },
  { k: 'sad', label: 'Sad' },
]

function randomId() {
  return (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2)
}

function MoodTracker() {
  const [userId, setUserId] = useState('')
  const [selected, setSelected] = useState('')
  const [note, setNote] = useState('')
  const [history, setHistory] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('wm-user-id') || randomId()
    localStorage.setItem('wm-user-id', saved)
    setUserId(saved)
  }, [])

  useEffect(() => {
    if (!userId) return
    fetch(`${baseUrl}/mood/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, limit: 30 })
    }).then(r => r.json()).then(data => {
      if (Array.isArray(data)) setHistory(data.reverse())
    }).catch(() => {})
  }, [userId])

  const submit = async () => {
    if (!selected) return
    setSaving(true)
    try {
      await fetch(`${baseUrl}/mood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, mood: selected, note })
      })
      setNote('')
      setSelected('')
      // reload
      const res = await fetch(`${baseUrl}/mood/list`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, limit: 30 })
      })
      const data = await res.json()
      if (Array.isArray(data)) setHistory(data.reverse())
    } catch (e) {}
    setSaving(false)
  }

  return (
    <section id="moods" className="relative bg-slate-950 py-16">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom,rgba(255,140,0,0.15),transparent_60%)]" />
      <div className="relative mx-auto max-w-5xl px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Mood check-in</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/60 border border-white/10 rounded-2xl p-5">
            <div className="flex flex-wrap gap-2 mb-4">
              {moods.map((m) => (
                <button key={m.k} onClick={() => setSelected(m.k)} className={`rounded-full px-4 py-2 text-sm border transition-colors ${selected === m.k ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'}`}>
                  {m.label}
                </button>
              ))}
            </div>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Add an optional note..." className="w-full rounded-xl bg-slate-800/70 text-white placeholder-slate-400 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/50 mb-3" />
            <button onClick={submit} disabled={!selected || saving} className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 font-medium disabled:opacity-50">Save check-in</button>
          </div>

          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 text-sm text-slate-300/90">
            <h3 className="text-white font-semibold mb-2">Recent check-ins</h3>
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {history.length === 0 && <p className="text-slate-400">No entries yet.</p>}
              {history.map((h, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-3">
                  <div className="text-white font-medium">{h.mood}</div>
                  {h.note && <div className="text-slate-300 text-sm mt-1">{h.note}</div>}
                  {h.created_at && <div className="text-slate-400 text-xs mt-2">{new Date(h.created_at).toLocaleString()}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MoodTracker
