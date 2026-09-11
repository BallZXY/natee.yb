'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const links = [
  { id: 'concept', label: 'Concept' },
  { id: 'map', label: 'Map' },
  { id: 'ai-image', label: 'AI Image' },
  { id: 'desmos', label: 'Desmos' },
  { id: 'mermaid', label: 'Mermaid' },
  { id: 'latex', label: 'LaTeX' },
  { id: 'notebooklm', label: 'NotebookLM' },
  { id: 'presentation', label: 'Presentation' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border bg-background/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#concept" className="group flex items-center gap-2">
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/logo.svg?v=2`}
            alt="Unique Bangkok"
            className="h-9 w-9 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105"
          />
          <span className="font-serif text-lg font-bold tracking-tight text-gold">Unique</span>
          <span className="text-lg font-light tracking-[0.3em] text-foreground/90">BANGKOK</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-gold"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
        >
          <div className="space-y-1.5">
            <span
              className={cn(
                'block h-0.5 w-5 bg-current transition-transform',
                open && 'translate-y-2 rotate-45',
              )}
            />
            <span
              className={cn('block h-0.5 w-5 bg-current transition-opacity', open && 'opacity-0')}
            />
            <span
              className={cn(
                'block h-0.5 w-5 bg-current transition-transform',
                open && '-translate-y-2 -rotate-45',
              )}
            />
          </div>
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-border bg-background/95 px-5 pb-4 pt-2 backdrop-blur-xl lg:hidden">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-gold"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
