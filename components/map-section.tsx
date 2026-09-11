'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { cn } from '@/lib/utils'

type Pin = {
  id: string
  name: string
  type: 'attraction' | 'food'
  category: string
  note: string
  hours: string
  height: number
  x: number
  y: number
  image: string
}

const pins: Pin[] = [
  {
    id: 'palace',
    name: 'Grand Palace & Wat Phra Kaew',
    type: 'attraction',
    category: 'Royal Landmark',
    note: 'The gilded heart of old Bangkok — spired halls, mirrored mosaics and the revered Emerald Buddha behind glittering walls.',
    hours: '8:30 AM – 3:30 PM',
    height: 88,
    x: 26,
    y: 40,
    image: '/images/map/palace.jpg',
  },
  {
    id: 'arun',
    name: 'Wat Arun',
    type: 'attraction',
    category: 'Riverside Temple',
    note: 'The Temple of Dawn rises from the river bend, its porcelain-studded prang catching first and last light.',
    hours: '8:00 AM – 6:00 PM',
    height: 96,
    x: 16,
    y: 58,
    image: '/images/map/arun.jpg',
  },
  {
    id: 'swing',
    name: 'Giant Swing (Sao Chingcha)',
    type: 'attraction',
    category: 'Historic Landmark',
    note: 'A towering red teak arch marking centuries of ceremony in the old quarter.',
    hours: 'Open 24 hours',
    height: 72,
    x: 42,
    y: 34,
    image: '/images/map/swing.jpg',
  },
  {
    id: 'chatuchak',
    name: 'Chatuchak Weekend Market',
    type: 'attraction',
    category: 'Market',
    note: 'Fifteen thousand stalls of vintage, plants, art and everything you did not know you needed.',
    hours: 'Sat–Sun 9:00 AM – 6:00 PM',
    height: 46,
    x: 50,
    y: 16,
    image: '/images/map/chatuchak.jpg',
  },
  {
    id: 'nana',
    name: 'Nana Coffee Roasters',
    type: 'food',
    category: 'Specialty Coffee',
    note: 'A jungle-wrapped roastery pouring competition-grade single origins in a plant-filled sanctuary.',
    hours: '7:00 AM – 6:00 PM',
    height: 40,
    x: 60,
    y: 30,
    image: '/images/map/coffee.jpg',
  },
  {
    id: 'jayfai',
    name: 'Jay Fai',
    type: 'food',
    category: 'Michelin Street Food',
    note: 'Goggle-clad Auntie Fai flames her legendary crab omelette over charcoal woks, one order at a time.',
    hours: '9:00 AM – 8:00 PM (Closed Sun–Mon)',
    height: 34,
    x: 48,
    y: 46,
    image: '/images/map/jayfai.jpg',
  },
  {
    id: 'thipsamai',
    name: 'Thipsamai Pad Thai',
    type: 'food',
    category: 'Iconic Noodles',
    note: 'The pad thai institution since 1966 — silky egg-wrapped noodles and fresh orange juice by the queue.',
    hours: '5:00 PM – 12:00 AM',
    height: 30,
    x: 58,
    y: 52,
    image: '/images/map/thipsamai.jpg',
  },
  {
    id: 'yaowarat',
    name: 'Yaowarat (Chinatown)',
    type: 'food',
    category: 'Street Food District',
    note: 'After dark the neon signs flare and the whole street becomes an open-air kitchen.',
    hours: '6:00 PM – 12:00 AM',
    height: 58,
    x: 34,
    y: 66,
    image: '/images/map/yaowarat.jpg',
  },
]

export function MapSection() {
  const [active, setActive] = useState<string | null>(null)
  const activePin = pins.find((p) => p.id === active) ?? null

  return (
    <section id="map" className="scroll-mt-20 border-t border-border/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          index="02"
          kicker="Map"
          title="Bangkok, drawn as a living city"
          description="Read the city as a layered urban plan: the Chao Phraya, old-town landmarks, market districts, and the food trail that connects them. Tap a location to see the real place."
        />

        <Reveal className="mt-14">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card">
            {/* isometric stage */}
            <div className="relative aspect-[16/10] w-full [perspective:1400px] md:aspect-[16/9]">
              <div
                aria-hidden={false}
                className="absolute inset-0"
                style={{
                      transform: 'rotateX(0deg) rotateZ(0deg) scale(1)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* ground plane */}
                <div
                  className="absolute inset-0 rounded-2xl border border-gold/15 bg-[radial-gradient(circle_at_35%_30%,color-mix(in_oklch,var(--gold)_14%,transparent),transparent_55%)] bg-background/40"
                  style={{
                    backgroundImage:
                      'linear-gradient(color-mix(in oklch, var(--gold) 12%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklch, var(--gold) 12%, transparent) 1px, transparent 1px)',
                    backgroundSize: '7% 7%',
                  }}
                />

                {/* river ribbon on the plane */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full"
                >
                  <path
                    d="M8 -4 C 20 24, 6 40, 22 56 C 36 70, 30 84, 44 104"
                    fill="none"
                    stroke="color-mix(in oklch, var(--neon-cyan) 45%, transparent)"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  <path d="M2 24 C 28 18, 52 30, 98 20" fill="none" stroke="color-mix(in oklch, var(--gold) 30%, transparent)" strokeWidth="0.7" strokeDasharray="2 2" />
                  <path d="M4 76 C 30 62, 60 78, 96 60" fill="none" stroke="color-mix(in oklch, var(--gold) 25%, transparent)" strokeWidth="0.7" strokeDasharray="2 2" />
                  <path d="M18 2 C 30 24, 28 58, 22 98" fill="none" stroke="color-mix(in oklch, var(--neon-cyan) 22%, transparent)" strokeWidth="0.7" strokeDasharray="1.5 2.5" />
                  <path d="M72 2 C 62 25, 74 55, 68 98" fill="none" stroke="color-mix(in oklch, var(--neon-cyan) 22%, transparent)" strokeWidth="0.7" strokeDasharray="1.5 2.5" />
                </svg>

                <span className="absolute left-[8%] top-[12%] text-[10px] font-semibold uppercase tracking-[0.25em] text-neon-cyan/70">Chatuchak</span>
                <span className="absolute left-[9%] top-[78%] text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/70">Old Town</span>
                <span className="absolute right-[10%] top-[24%] text-[10px] font-semibold uppercase tracking-[0.25em] text-neon-pink/70">Sukhumvit</span>
                <span className="absolute right-[11%] bottom-[13%] text-[10px] font-semibold uppercase tracking-[0.25em] text-neon-cyan/70">Chinatown</span>

                {/* extruded landmarks + pins */}
                {pins.map((pin) => {
                  const isActive = pin.id === active
                  const isFood = pin.type === 'food'
                  const accent = isFood ? 'var(--neon-pink)' : 'var(--gold)'
                  return (
                    <button
                      key={pin.id}
                      type="button"
                      onClick={() => setActive(pin.id)}
                      style={{
                        left: `${pin.x}%`,
                        top: `${pin.y}%`,
                        transformStyle: 'preserve-3d',
                      }}
                      className="group absolute -translate-x-1/2 -translate-y-1/2"
                      aria-label={`${pin.name} — ${pin.category}`}
                    >
                      {/* extruded tower rising off the plane */}
                      <span
                        className="block rounded-[4px] transition-all duration-300"
                        style={{
                          width: 20,
                          height: 20,
                          transform: `translateZ(${isActive ? pin.height + 16 : pin.height}px)`,
                          background: `linear-gradient(135deg, color-mix(in oklch, ${accent} 90%, white 10%), ${accent})`,
                          boxShadow: `0 0 22px color-mix(in oklch, ${accent} ${isActive ? 90 : 55}%, transparent), 0 ${pin.height}px ${pin.height / 2}px -8px color-mix(in oklch, ${accent} 35%, transparent)`,
                          border: `1px solid color-mix(in oklch, ${accent} 60%, white 40%)`,
                        }}
                      />
                      {/* glow footprint on the ground */}
                      <span
                        aria-hidden="true"
                        className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[6px] transition-all duration-300"
                        style={{
                          width: isActive ? 34 : 24,
                          height: isActive ? 34 : 24,
                          background: `color-mix(in oklch, ${accent} ${isActive ? 55 : 30}%, transparent)`,
                        }}
                      />
                    </button>
                  )
                })}
              </div>

              {/* legend, flat overlay */}
              <div className="absolute left-4 top-4 flex items-center gap-4 rounded-full border border-border bg-background/80 px-4 py-2 text-xs backdrop-blur">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_10px_var(--gold)]" /> Attractions
                </span>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full bg-neon-pink shadow-[0_0_10px_var(--neon-pink)]" /> Food
                </span>
              </div>

              {!activePin && (
                <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background/80 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
                  Tap a glowing landmark to explore
                </div>
              )}
            </div>

            {/* sliding detail panel */}
            <div
              className={cn(
                'pointer-events-none absolute inset-y-0 right-0 z-20 flex w-full max-w-sm translate-x-full flex-col border-l border-border bg-card/95 backdrop-blur-xl transition-transform duration-500 ease-out',
                activePin && 'pointer-events-auto translate-x-0',
              )}
              role="dialog"
              aria-modal="false"
              aria-hidden={!activePin}
              aria-label={activePin ? `${activePin.name} details` : 'Location details'}
            >
              {activePin && (
                <div className="flex h-full flex-col overflow-y-auto p-6">
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider',
                        activePin.type === 'food'
                          ? 'border-neon-pink/40 text-neon-pink'
                          : 'border-gold/40 text-gold',
                      )}
                    >
                      {activePin.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActive(null)}
                      className="rounded-full border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="Close details"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div
                    className="relative mt-5 aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-background/60"
                    style={{
                      boxShadow: `inset 0 0 40px color-mix(in oklch, ${activePin.type === 'food' ? 'var(--neon-pink)' : 'var(--gold)'} 12%, transparent)`,
                    }}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${activePin.image}?v=3`}
                      alt={activePin.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 360px"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent px-4 pb-3 pt-10">
                      <p className="text-xs font-medium text-foreground/80">Bangkok field note</p>
                    </div>
                  </div>

                  <h3 className="mt-5 font-serif text-2xl font-semibold leading-tight text-balance">
                    {activePin.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {activePin.note}
                  </p>

                  <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-background/50 p-4">
                    <svg
                      className={activePin.type === 'food' ? 'text-neon-pink' : 'text-gold'}
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Opening Hours
                      </p>
                      <p className="text-sm font-medium">{activePin.hours}</p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-border pt-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Jump to
                    </p>
                    <ul className="flex flex-wrap gap-1.5">
                      {pins.map((pin) => (
                        <li key={pin.id}>
                          <button
                            type="button"
                            onClick={() => setActive(pin.id)}
                            className={cn(
                              'rounded-full border px-2.5 py-1 text-xs transition-colors',
                              pin.id === active
                                ? pin.type === 'food'
                                  ? 'border-neon-pink/50 bg-neon-pink/10 text-neon-pink'
                                  : 'border-gold/50 bg-gold/10 text-gold'
                                : 'border-border text-muted-foreground hover:text-foreground',
                            )}
                          >
                            {pin.name.split(' ')[0]}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
