'use client'

const sparkles = Array.from({ length: 18 }, (_, index) => index)

export function BangkokAtmosphere() {
  return (
    <div className="bangkok-atmosphere" aria-hidden="true">
      <div className="river-light river-light-one" />
      <div className="river-light river-light-two" />
      <div className="skyline-trace" />
      {sparkles.map((sparkle) => (
        <span key={sparkle} className={`city-spark city-spark-${sparkle + 1}`} />
      ))}
    </div>
  )
}
