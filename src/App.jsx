import Header from './components/Header'
import Hero from './components/Hero'
import Chatbot from './components/Chatbot'
import MoodTracker from './components/MoodTracker'

function App() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <Hero />
      <Chatbot />
      <MoodTracker />
      <footer className="bg-black border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-slate-400">
          This assistant offers supportive guidance and is not a substitute for professional care. If you are in crisis, contact local emergency services.
        </div>
      </footer>
    </div>
  )
}

export default App
