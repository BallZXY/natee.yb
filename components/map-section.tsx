'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { cn } from '@/lib/utils'

export type Pin = {
  id: string
  name: string
  type: 'attraction' | 'food'
  category: string
  district: 'oldtown' | 'chinatown' | 'chatuchak' | 'downtown'
  note: string
  hours: string
  svgX: number
  svgY: number
  image: string
}

export const pins: Pin[] = [
  {
    id: 'palace',
    name: 'Grand Palace & Wat Phra Kaew',
    type: 'attraction',
    category: 'Royal Landmark',
    district: 'oldtown',
    note: 'The gilded heart of old Bangkok — spired halls, mirrored mosaics and the revered Emerald Buddha behind glittering walls.',
    hours: '8:30 AM – 3:30 PM',
    svgX: 235,
    svgY: 235,
    image: '/images/map/palace.jpg',
  },
  {
    id: 'arun',
    name: 'Wat Arun (Temple of Dawn)',
    type: 'attraction',
    category: 'Riverside Temple',
    district: 'oldtown',
    note: 'The Temple of Dawn rises from the Chao Phraya river bend, its porcelain-studded prang catching first and last light.',
    hours: '8:00 AM – 6:00 PM',
    svgX: 86,
    svgY: 335,
    image: '/images/map/arun.jpg',
  },
  {
    id: 'swing',
    name: 'Giant Swing (Sao Chingcha)',
    type: 'attraction',
    category: 'Historic Landmark',
    district: 'oldtown',
    note: 'A towering red teak arch marking centuries of ceremony in the old quarter in front of Wat Suthat.',
    hours: 'Open 24 hours',
    svgX: 405,
    svgY: 250,
    image: '/images/map/swing.jpg',
  },
  {
    id: 'chatuchak',
    name: 'Chatuchak Weekend Market',
    type: 'attraction',
    category: 'Market',
    district: 'chatuchak',
    note: 'Fifteen thousand stalls of vintage, plants, art and everything you did not know you needed surrounding the landmark clock tower.',
    hours: 'Sat–Sun 9:00 AM – 6:00 PM',
    svgX: 545,
    svgY: 95,
    image: '/images/map/chatuchak.jpg',
  },
  {
    id: 'nana',
    name: 'Nana Coffee Roasters',
    type: 'food',
    category: 'Specialty Coffee',
    district: 'downtown',
    note: 'A jungle-wrapped glasshouse roastery pouring competition-grade single origins in a plant-filled sanctuary.',
    hours: '7:00 AM – 6:00 PM',
    svgX: 790,
    svgY: 360,
    image: '/images/map/coffee.jpg',
  },
  {
    id: 'jayfai',
    name: 'Jay Fai',
    type: 'food',
    category: 'Michelin Street Food',
    district: 'oldtown',
    note: 'Goggle-clad Auntie Fai flames her legendary crab omelette over charcoal woks, one order at a time.',
    hours: '9:00 AM – 8:00 PM (Closed Sun–Mon)',
    svgX: 450,
    svgY: 275,
    image: '/images/map/jayfai.jpg',
  },
  {
    id: 'thipsamai',
    name: 'Thipsamai Pad Thai',
    type: 'food',
    category: 'Iconic Noodles',
    district: 'oldtown',
    note: 'The pad thai institution since 1966 — silky egg-wrapped noodles and fresh orange juice by the queue.',
    hours: '5:00 PM – 12:00 AM',
    svgX: 480,
    svgY: 295,
    image: '/images/map/thipsamai.jpg',
  },
  {
    id: 'yaowarat',
    name: 'Yaowarat (Chinatown Gate)',
    type: 'food',
    category: 'Street Food District',
    district: 'chinatown',
    note: 'The ceremonial Chinese arch gate leads into glowing neon alleys where Bangkok becomes an open-air night kitchen.',
    hours: '6:00 PM – 12:00 AM',
    svgX: 520,
    svgY: 435,
    image: '/images/map/yaowarat.jpg',
  },
]

type TimeMode = 'sunset' | 'night' | 'day'
type District = Pin['district'] | 'all'

const districts: Array<{ id: District; label: string }> = [
  { id: 'all', label: 'Full City' },
  { id: 'oldtown', label: 'Old Town' },
  { id: 'chinatown', label: 'Chinatown' },
  { id: 'chatuchak', label: 'Chatuchak' },
  { id: 'downtown', label: 'Sukhumvit' },
]

export function MapSection() {
  const [active, setActive] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [timeMode, setTimeMode] = useState<TimeMode>('sunset')
  const [activeDistrict, setActiveDistrict] = useState<District>('all')
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const isPanningRef = useRef(false)
  const startPanRef = useRef({ x: 0, y: 0 })

  const activePin = pins.find((pin) => pin.id === active) ?? null
  const hoveredPin = pins.find((pin) => pin.id === hovered) ?? null

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button, .interactive-pin')) return
    isPanningRef.current = true
    startPanRef.current = { x: event.clientX - pan.x, y: event.clientY - pan.y }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanningRef.current) return
    setPan({
      x: event.clientX - startPanRef.current.x,
      y: event.clientY - startPanRef.current.y,
    })
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    isPanningRef.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    setZoom((current) => Math.min(Math.max(current - event.deltaY * 0.0015, 0.8), 2.2))
  }

  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setActive(null)
    setActiveDistrict('all')
  }

  const focusDistrict = (district: District) => {
    setActiveDistrict(district)
    setActive(null)

    const views: Record<District, { zoom: number; pan: { x: number; y: number } }> = {
      all: { zoom: 1, pan: { x: 0, y: 0 } },
      oldtown: { zoom: 1.45, pan: { x: 250, y: 120 } },
      chinatown: { zoom: 1.55, pan: { x: -30, y: -155 } },
      chatuchak: { zoom: 1.5, pan: { x: -70, y: 340 } },
      downtown: { zoom: 1.45, pan: { x: -420, y: -40 } },
    }

    setZoom(views[district].zoom)
    setPan(views[district].pan)
  }

  return (
    <section id="map" className="scroll-mt-20 border-t border-border/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          index="02"
          kicker="Isometric 2D Map"
          title="Bangkok, drawn as an authentic Isometric city"
          description="Explore Bangkok through an architectural isometric plan: the meandering Chao Phraya River, Rama VIII & Memorial bridges, elevated BTS Skytrain viaduct, historic Rattanakosin temples, and legendary Michelin street food."
        />

        <Reveal className="mt-12">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07111d] shadow-[0_28px_100px_rgba(0,0,0,0.42)]">
            <div
              className="relative h-[620px] w-full select-none overflow-hidden md:h-[720px]"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onWheel={handleWheel}
              style={{ cursor: isPanningRef.current ? 'grabbing' : 'grab' }}
            >
              <div
                className="absolute inset-0 flex items-center justify-center transition-transform duration-150 ease-out"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                }}
              >
                <div className="relative h-[667px] w-[1000px] shrink-0 overflow-hidden">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/images/bangkok-isometric-v2.png`}
                    alt="Isometric illustrated map of Bangkok"
                    fill
                    priority
                    sizes="(max-width: 1280px) 1000px, 1200px"
                    className={cn(
                      'object-cover transition-[filter] duration-700',
                      timeMode === 'sunset' && 'brightness-[0.86] saturate-[1.08]',
                      timeMode === 'night' && 'brightness-[0.48] saturate-[0.85] hue-rotate-[8deg]',
                      timeMode === 'day' && 'brightness-[1.08] saturate-[0.82]',
                    )}
                  />

                  <div
                    className={cn(
                      'pointer-events-none absolute inset-0 transition-colors duration-700',
                      timeMode === 'sunset' && 'bg-gradient-to-tr from-[#09101d]/45 via-transparent to-amber-300/10',
                      timeMode === 'night' && 'bg-[#020817]/35 mix-blend-multiply',
                      timeMode === 'day' && 'bg-sky-100/5',
                    )}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_48%,rgba(2,8,23,0.56)_100%)]" />

                  <svg viewBox="0 0 1000 667" className="absolute inset-0 h-full w-full overflow-visible" aria-label="Interactive Bangkok landmarks">
                    <g className="pointer-events-none" fontFamily="ui-monospace, monospace" fontSize="9" fontWeight="700" letterSpacing="1.1">
                      <text x="200" y="170" fill="rgba(255,255,255,.72)">RATTANAKOSIN · OLD TOWN</text>
                      <text x="510" y="475" fill="rgba(255,255,255,.72)">YAOWARAT · CHINATOWN</text>
                      <text x="470" y="55" fill="rgba(255,255,255,.72)">CHATUCHAK · NORTHERN HUB</text>
                      <text x="750" y="240" fill="rgba(255,255,255,.72)">SUKHUMVIT · DOWNTOWN</text>
                    </g>

                    {pins.map((pin) => {
                      const isSelected = pin.id === active
                      const isHovered = pin.id === hovered
                      const isVisible = activeDistrict === 'all' || pin.district === activeDistrict
                      const color = pin.type === 'food' ? '#fb7185' : '#fbbf24'
                      const label = pin.name.split(' (')[0]
                      const labelWidth = Math.min(Math.max(label.length * 5.2, 72), 164)

                      return (
                        <g
                          key={pin.id}
                          className="interactive-pin cursor-pointer outline-none transition-opacity duration-300"
                          transform={`translate(${pin.svgX}, ${pin.svgY})`}
                          opacity={isVisible ? 1 : 0.22}
                          role="button"
                          tabIndex={0}
                          aria-label={`Open details for ${pin.name}`}
                          onClick={(event) => {
                            event.stopPropagation()
                            setActive(pin.id)
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault()
                              setActive(pin.id)
                            }
                          }}
                          onMouseEnter={() => setHovered(pin.id)}
                          onMouseLeave={() => setHovered(null)}
                          onFocus={() => setHovered(pin.id)}
                          onBlur={() => setHovered(null)}
                        >
                          <circle cy="4" r={isSelected ? 22 : 16} fill="none" stroke={color} strokeWidth="1.5" opacity=".58" className={isSelected ? 'animate-ping' : ''} />
                          <ellipse cy="5" rx="15" ry="7" fill={color} opacity={isSelected ? '.3' : '.17'} />
                          <g transform={`translate(0 -18) scale(${isSelected ? 1.18 : isHovered ? 1.1 : 1})`} className="transition-transform duration-200">
                            <path d="M0 15C-3 9-11 2-11-7a11 11 0 1 1 22 0C11 2 3 9 0 15Z" fill={color} stroke="white" strokeWidth="1.4" />
                            <circle cy="-7" r="3.6" fill="#08111d" />
                          </g>
                          <g transform="translate(0 25)">
                            <rect x={-labelWidth / 2} y="-10" width={labelWidth} height="20" rx="10" fill="rgba(4,10,20,.88)" stroke={isSelected ? color : 'rgba(255,255,255,.26)'} strokeWidth={isSelected ? 1.4 : 0.8} />
                            <text x="0" y="3" fill="white" fontSize="8.5" fontFamily="ui-sans-serif, sans-serif" fontWeight={isSelected ? 700 : 600} textAnchor="middle">
                              {label}
                            </text>
                          </g>
                        </g>
                      )
                    })}
                  </svg>
                </div>
              </div>

              <div className="absolute left-4 top-4 z-20 flex items-center gap-3 rounded-2xl border border-white/15 bg-[#07111d]/78 px-4 py-2.5 text-[11px] text-white/70 shadow-xl backdrop-blur-xl md:left-5 md:top-5">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,.8)]" /> Attractions
                </span>
                <span className="h-3 w-px bg-white/20" />
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,.8)]" /> Food & Markets
                </span>
              </div>

              <div className="absolute right-4 top-4 z-20 flex rounded-2xl border border-white/15 bg-[#07111d]/78 p-1 text-[11px] shadow-xl backdrop-blur-xl md:right-5 md:top-5">
                {(['sunset', 'night', 'day'] as TimeMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTimeMode(mode)}
                    aria-pressed={timeMode === mode}
                    className={cn(
                      'rounded-xl px-3 py-1.5 font-medium capitalize text-white/55 transition hover:text-white',
                      timeMode === mode && 'bg-white/14 text-white shadow-sm',
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {hoveredPin && !activePin && (
                <div className="pointer-events-none absolute bottom-20 left-1/2 z-20 w-max max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-2xl border border-white/15 bg-[#07111d]/88 px-4 py-3 text-white shadow-2xl backdrop-blur-xl">
                  <p className="text-xs font-semibold">{hoveredPin.name}</p>
                  <p className="mt-0.5 text-[11px] text-white/55">{hoveredPin.category} · Click to inspect field notes</p>
                </div>
              )}

              <div className="absolute bottom-4 left-4 z-20 flex max-w-[calc(100%-9rem)] flex-wrap gap-1.5 md:bottom-5 md:left-5">
                {districts.map((district) => (
                  <button
                    key={district.id}
                    type="button"
                    onClick={() => focusDistrict(district.id)}
                    aria-pressed={activeDistrict === district.id}
                    className={cn(
                      'rounded-full border border-white/15 bg-[#07111d]/76 px-3 py-1.5 text-[11px] font-medium text-white/55 shadow-lg backdrop-blur-xl transition hover:border-white/30 hover:text-white',
                      activeDistrict === district.id && 'border-white/35 bg-white/14 text-white',
                    )}
                  >
                    {district.label}
                  </button>
                ))}
              </div>

              <div className="absolute bottom-4 right-4 z-20 flex items-center rounded-2xl border border-white/15 bg-[#07111d]/78 p-1 text-white shadow-xl backdrop-blur-xl md:bottom-5 md:right-5">
                <button type="button" onClick={() => setZoom((value) => Math.min(value + 0.25, 2.2))} className="grid h-8 w-8 place-items-center rounded-xl text-sm text-white/65 transition hover:bg-white/10 hover:text-white" aria-label="Zoom in">+</button>
                <button type="button" onClick={() => setZoom((value) => Math.max(value - 0.25, 0.8))} className="grid h-8 w-8 place-items-center rounded-xl text-sm text-white/65 transition hover:bg-white/10 hover:text-white" aria-label="Zoom out">−</button>
                <button type="button" onClick={resetView} className="rounded-xl px-2.5 py-1.5 text-[11px] text-white/55 transition hover:bg-white/10 hover:text-white">Reset</button>
              </div>
            </div>

            <div
              className={cn(
                'pointer-events-none absolute inset-y-0 right-0 z-30 flex w-full max-w-sm translate-x-full flex-col border-l border-white/10 bg-[#08111d]/94 text-white shadow-[-24px_0_80px_rgba(0,0,0,.38)] backdrop-blur-2xl transition-transform duration-500 ease-out',
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
                    <span className={cn('inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[.14em]', activePin.type === 'food' ? 'border-rose-400/35 bg-rose-400/10 text-rose-300' : 'border-amber-400/35 bg-amber-400/10 text-amber-300')}>
                      {activePin.category}
                    </span>
                    <button type="button" onClick={() => setActive(null)} className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-white/55 transition hover:bg-white/10 hover:text-white" aria-label="Close details">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${activePin.image}?v=5`}
                      alt={activePin.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 360px"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#08111d] via-[#08111d]/45 to-transparent px-4 pb-3 pt-12">
                      <p className="text-[11px] text-white/60">Bangkok field note · Isometric landmark</p>
                    </div>
                  </div>

                  <h3 className="mt-5 font-serif text-2xl font-semibold leading-tight text-balance">{activePin.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/58">{activePin.note}</p>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-white/40">Opening hours</p>
                    <p className="mt-1 text-sm font-medium text-white/85">{activePin.hours}</p>
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-4">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.14em] text-white/40">Explore other landmarks</p>
                    <ul className="flex flex-wrap gap-1.5">
                      {pins.map((pin) => (
                        <li key={pin.id}>
                          <button
                            type="button"
                            onClick={() => setActive(pin.id)}
                            className={cn(
                              'rounded-full border px-2.5 py-1 text-xs transition',
                              pin.id === active ? 'border-white/35 bg-white/12 text-white' : 'border-white/10 text-white/45 hover:border-white/25 hover:text-white',
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
