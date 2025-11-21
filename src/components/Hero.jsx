import Spline from '@splinetool/react-spline'

function Hero() {
  const handleScrollToChat = () => {
    const el = document.getElementById('chatbot');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/AeAqaKLmGsS-FPBN/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 flex flex-col items-center text-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        <h1 className="relative text-4xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_6px_24px_rgba(255,140,0,0.25)]">
          WellMind Assistant
        </h1>
        <p className="relative mt-4 max-w-2xl text-base sm:text-lg text-orange-100/90">
          A gentle space to check in, track your mood, and get small, science-backed steps for your day.
        </p>
        <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
          <button onClick={handleScrollToChat} className="rounded-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 font-medium shadow-lg shadow-orange-500/30 transition-colors">
            Start chatting
          </button>
          <a href="#moods" className="rounded-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 font-medium backdrop-blur border border-white/20 transition-colors">
            Track mood
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
