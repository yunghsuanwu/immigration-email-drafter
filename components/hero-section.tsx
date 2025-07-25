'use client'

export function HeroSection() {
  const handleScroll = () => {
    const cta = document.getElementById('call-to-action')
    if (cta) {
      cta.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="py-12 md:py-36 text-left md:text-center px-4 mb-12">
      <div className="max-w-3xl mx-auto flex flex-col gap-8 items-start md:items-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-2">Immigration Rule Change Is Here.</h1>
        <span className="block text-xl md:text-2xl font-medium text-muted-foreground tracking-tight mb-2">
          Without public debate, without consultation, new immigration rules have arrived at the UK Parliament on 22 July 2025.
        </span>
        <button
          type="button"
          onClick={handleScroll}
          className="mt-4 px-6 py-3 rounded-lg font-semibold text-lg shadow transition-colors flex items-center gap-2 cursor-pointer hover:opacity-90"
          style={{ background: 'var(--headline-primary)', color: 'white' }}
        >
          Make Your Voice Heard Now
          <span aria-hidden="true" className="text-2xl leading-none">↓</span>
        </button>
      </div>
    </section>
  )
}
