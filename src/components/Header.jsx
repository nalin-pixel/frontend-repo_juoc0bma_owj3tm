function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-black/40 border-b border-white/10">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <a href="#" className="text-white font-semibold tracking-tight">WellMind</a>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <a href="#chatbot" className="text-slate-300 hover:text-white">Chat</a>
          <a href="#moods" className="text-slate-300 hover:text-white">Mood</a>
          <a href="/test" className="text-slate-300 hover:text-white">Status</a>
        </nav>
      </div>
    </header>
  )
}

export default Header
