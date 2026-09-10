import Image from 'next/image'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { cn } from '@/lib/utils'

type Frame = {
  label: string
  caption: string
  /** Optional real image. When omitted, a styled drop-in frame is shown. */
  src?: string
  alt?: string
  /** Suggested file path to drop a screenshot into. */
  dropPath?: string
}

export type ShowcaseSectionProps = {
  id: string
  index: string
  kicker: string
  title: string
  description: string
  initial: Frame
  refined: Frame
  steps: { title: string; detail: string }[]
  bullets: string[]
  bulletsTitle: string
  reverse?: boolean
}

function ImageFrame({ frame, tone }: { frame: Frame; tone: 'muted' | 'accent' }) {
  const ringColor = tone === 'accent' ? 'ring-gold/40' : 'ring-border'
  const imagePath = frame.src ?? frame.dropPath
  const imageSrc = imagePath
    ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${imagePath}`
    : undefined
  const badge =
    tone === 'accent'
      ? 'bg-gold text-primary-foreground'
      : 'bg-secondary text-muted-foreground'

  return (
    <figure className="group flex flex-col gap-3">
      <div
        className={cn(
          'relative aspect-[16/10] overflow-hidden rounded-2xl bg-card ring-1 transition-all duration-500',
          ringColor,
        )}
      >
        <span
          className={cn(
            'absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider',
            badge,
          )}
        >
          {frame.label}
        </span>

        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={frame.alt ?? frame.caption}
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_30%,color-mix(in_oklch,var(--gold)_14%,transparent),transparent_70%)] p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-gold/50 text-gold">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 16l4.5-4.5a2 2 0 0 1 2.8 0L16 16m-2-2 1.5-1.5a2 2 0 0 1 2.8 0L20 14M4 6h16v12H4z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground/80">Screenshot slot</p>
            {frame.dropPath && (
              <code className="rounded-md bg-background/60 px-2 py-1 text-[11px] text-muted-foreground">
                {frame.dropPath}
              </code>
            )}
          </div>
        )}
      </div>
      <figcaption className="text-sm leading-relaxed text-muted-foreground">
        {frame.caption}
      </figcaption>
    </figure>
  )
}

export function ShowcaseSection({
  id,
  index,
  kicker,
  title,
  description,
  initial,
  refined,
  steps,
  bullets,
  bulletsTitle,
}: ShowcaseSectionProps) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-border/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading index={index} kicker={kicker} title={title} description={description} />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Reveal>
            <ImageFrame frame={initial} tone="muted" />
          </Reveal>
          <Reveal delay={120}>
            <ImageFrame frame={refined} tone="accent" />
          </Reveal>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <div className="rounded-2xl border border-border bg-card/60 p-6 md:p-8">
              <h3 className="font-serif text-xl font-semibold text-foreground">
                Prompt evolution &amp; process
              </h3>
              <ol className="mt-6 space-y-6">
                {steps.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 font-serif text-sm text-gold">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-2">
            <div className="h-full rounded-2xl border border-gold/25 bg-[linear-gradient(160deg,color-mix(in_oklch,var(--gold)_10%,var(--card)),var(--card))] p-6 md:p-8">
              <h3 className="font-serif text-xl font-semibold text-foreground">{bulletsTitle}</h3>
              <ul className="mt-6 space-y-3.5">
                {bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
