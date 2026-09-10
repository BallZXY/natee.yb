export function SiteFooter() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-center sm:flex-row sm:text-left lg:px-8">
        <div className="flex items-center gap-2">
          <span className="font-serif text-base font-bold text-gold">Unique</span>
          <span className="text-base font-light tracking-[0.3em] text-foreground/90">BANGKOK</span>
        </div>
        <p className="text-xs text-muted-foreground">
          A deeper look at the City of Angels — traditional soul, futuristic pulse.
        </p>
      </div>
    </footer>
  )
}
