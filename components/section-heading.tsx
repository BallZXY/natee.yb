import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

export function SectionHeading({
  index,
  kicker,
  title,
  description,
  className,
}: {
  index: string
  kicker: string
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn('mx-auto max-w-3xl text-center', className)}>
      <Reveal>
        <div className="mb-4 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-gold/50" />
          <span className="text-xs font-medium uppercase tracking-[0.35em] text-gold">
            {index} · {kicker}
          </span>
          <span className="h-px w-8 bg-gold/50" />
        </div>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="text-balance font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={160}>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}
