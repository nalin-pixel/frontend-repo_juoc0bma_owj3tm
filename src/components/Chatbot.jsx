import { useEffect, useMemo, useRef, useState } from 'react'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function randomId() {
  return (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2)
}

function Chatbot() {
  const [userId, setUserId] = useState('')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('wm-user-id')
    if (saved) {
      setUserId(saved)
    } else {
      const id = randomId()
      localStorage.setItem('wm-user-id', id)
      setUserId(id)
    }
  }, [])

  useEffect(() => {
    if (!userId) return
    // load last messages
    fetch(`${baseUrl}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, limit: 30 })
    }).then(r => r.json()).then(data => {
      if (Array.isArray(data)) setMessages(data)
    }).catch(() => {})
  }, [userId])

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, loading])

  const send = async () => {
    if (!input.trim() || !userId) return
    const text = input.trim()
    setInput('')
    const now = new Date().toISOString()
    setMessages(m => [...m, { role: 'user', content: text, created_at: now }])
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/advice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, message: text })
      })
      const data = await res.json()
      const replyText = `${data.reply || ''}${data.tips ? '\n\n' + data.tips.map(t => '• ' + t).join('\n') : ''}`
      setMessages(m => [...m, { role: 'assistant', content: replyText, created_at: new Date().toISOString() }])
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: 'Sorry, I had trouble reaching the server. Please try again.', created_at: new Date().toISOString() }])
    } finally {
      setLoading(false)
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <section id="chatbot" className="relative bg-slate-950 py-16">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(255,140,0,0.25),transparent_60%)]" />
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Your well-being companion</h2>
          <p className="text-orange-100/80 mt-2">Ask about stress, sleep, mood, or healthy habits. You’ll get small, compassionate steps you can take right now.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur">
            <div ref={listRef} className="h-[420px] overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-sm text-slate-300/70">
                  Try: “I’ve been feeling anxious at night.” or “I’m low energy this afternoon.”
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`whitespace-pre-wrap rounded-xl px-3 py-2 text-sm ${m.role === 'user' ? 'bg-orange-500/20 text-orange-100 self-end ml-auto max-w-[80%]' : 'bg-white/5 text-slate-200 max-w-[85%]'}`}>
                  {m.content}
                </div>
              ))}
              {loading && (
                <div className="animate-pulse text-slate-300 text-sm">Thinking of some gentle ideas…</div>
              )}
            </div>
            <div className="border-t border-white/10 p-3 flex gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="Type how you feel or what you need..."
                rows={2}
                className="flex-1 resize-none rounded-xl bg-slate-800/70 text-white placeholder-slate-400 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
              <button onClick={send} className="self-end rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 font-medium shadow-md shadow-orange-500/30 disabled:opacity-50" disabled={loading || !input.trim()}>
                Send
              </button>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 text-sm text-slate-300/90 space-y-3">
            <h3 className="text-white font-semibold">Today’s tiny tools</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Box breathing 4-4-4-4 for 1 minute</li>
              <li>2-minute stretch + sunlight</li>
              <li>Write 3 priorities on a sticky note</li>
            </ul>
            <p className="text-slate-400 text-xs">This assistant is supportive, not medical advice. If you’re in crisis, please contact local emergency services.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Chatbot
