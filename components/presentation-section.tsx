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
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-gold/25 bg-card">
            {/* window chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-neon-pink/70" />
              <span className="h-3 w-3 rounded-full bg-gold/70" />
              <span className="h-3 w-3 rounded-full bg-neon-cyan/70" />
              <span className="ml-3 truncate text-xs text-muted-foreground">AI.pdf — Unique Bangkok</span>
            </div>

            {/* mock slide */}
            <div className="relative aspect-[16/9] bg-[radial-gradient(circle_at_70%_20%,color-mix(in_oklch,var(--gold)_16%,transparent),transparent_55%),radial-gradient(circle_at_20%_90%,color-mix(in_oklch,var(--neon-pink)_16%,transparent),transparent_55%)]">
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <span className="text-xs font-medium uppercase tracking-[0.35em] text-gold">
                  Slide Presentation
                </span>
                <h3 className="mt-4 text-balance font-serif text-3xl font-bold sm:text-4xl md:text-5xl">
                  Unique Bangkok
                </h3>
                <p className="mt-3 max-w-md text-sm text-muted-foreground">
                  The City of Angels — a deeper look through culture, food, and AI-assisted craft.
                </p>
                <button
                  type="button"
                  onClick={openPdf}
                  className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  View Full Slide Presentation
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    <path
                      d="M5 12h14m-6-6 6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

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
