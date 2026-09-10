'use client'

import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'

const slides = ['Concept', 'Map', 'AI Image', 'Desmos', 'Mermaid', 'LaTeX', 'NotebookLM', 'Recap']

export function PresentationSection() {
  const openPdf = () => {
    const url = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/AI.pdf`
    if (typeof window !== 'undefined' && window.self !== window.top) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section id="presentation" className="scroll-mt-20 border-t border-border/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          index="08"
          kicker="Presentation"
          title="The full slide deck"
          description="Everything above, assembled into one presentation. Open AI.pdf to page through the complete Unique Bangkok showcase."
        />

        <Reveal className="mt-14">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-gold/25 bg-card shadow-[0_0_60px_color-mix(in_oklch,var(--neon-cyan)_10%,transparent)]">
            {/* window chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-neon-pink/70" />
              <span className="h-3 w-3 rounded-full bg-gold/70" />
              <span className="h-3 w-3 rounded-full bg-neon-cyan/70" />
              <span className="ml-3 truncate text-xs text-muted-foreground">AI.pdf — Unique Bangkok</span>
            </div>

            <div className="border-b border-border bg-background/60 px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Review the deck</p>
                  <p className="mt-1 text-xs text-muted-foreground">Scroll inside the viewer to move through every slide</p>
                </div>
                <button
                  type="button"
                  onClick={openPdf}
                  className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-xs font-semibold text-gold transition-all hover:-translate-y-0.5 hover:bg-gold hover:text-primary-foreground"
                >
                  Open PDF
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <iframe
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/AI.pdf#view=FitH`}
              title="Unique Bangkok slide presentation review"
              className="h-[70vh] min-h-[520px] w-full bg-background"
            />

            {/* slide index */}
            <div className="flex flex-wrap gap-2 border-t border-border bg-secondary/30 px-4 py-4">
              {slides.map((slide, i) => (
                <span
                  key={slide}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                >
                  <span className="text-gold">{String(i + 1).padStart(2, '0')}</span> {slide}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted-foreground">
            Place your <code className="rounded bg-secondary px-1.5 py-0.5">AI.pdf</code> file in the
            project&apos;s <code className="rounded bg-secondary px-1.5 py-0.5">public/</code> folder
            and this button will open it.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
