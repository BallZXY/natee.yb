import Image from 'next/image'
import { Reveal } from '@/components/reveal'

const contrasts = [
  { a: 'Ancient temples', b: 'neon skylines' },
  { a: 'Street-cart noodles', b: 'rooftop fine dining' },
  { a: 'Sacred calm', b: 'joyful chaos' },
]

export function ConceptSection() {
  const imageSrc = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/images/bangkok-scifi.png`

  return (
    <section id="concept" className="relative scroll-mt-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src={imageSrc}
          alt="Futuristic neon-lit vision of Bangkok at night"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--background)_78%,transparent),color-mix(in_oklch,var(--background)_86%,transparent)_45%,var(--background))]" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 pb-20 pt-32 lg:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-background/40 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.3em] text-gold backdrop-blur">
            The City of Angels
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="mt-6 max-w-4xl text-balance font-serif text-5xl font-bold leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl">
            Know Bangkok on a<span className="text-gold"> deeper level</span>
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-foreground/85 md:text-xl">
            This is an invitation to look past the postcard. To wander the hidden gems tucked down
            unnamed sois, to fall for the charming chaos of the markets, and to feel the perfect
            contrasts that make this city unlike anywhere on earth — where gilded temple spires
            catch the same light as electric night-market signs.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-10 flex flex-wrap gap-3">
            {contrasts.map((c) => (
              <div
                key={c.a}
                className="flex items-center gap-2.5 rounded-full border border-border bg-background/50 px-4 py-2 text-sm backdrop-blur"
              >
                <span className="text-foreground">{c.a}</span>
                <span className="text-gold">×</span>
                <span className="text-neon-pink">{c.b}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={400}>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href="#map"
              className="rounded-full bg-gold px-7 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Explore the city
            </a>
            <a
              href="#presentation"
              className="rounded-full border border-border px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:border-gold hover:text-gold"
            >
              View the presentation
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
