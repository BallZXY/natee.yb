import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Outfit } from 'next/font/google'
import { BangkokAtmosphere } from '@/components/bangkok-atmosphere'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Unique Bangkok — A Deeper Look at the City of Angels',
  description:
    'An immersive showcase of Bangkok: its temples, night neon, hidden gems, and the AI-powered creative process behind exploring the city.',
  generator: 'v0.app',
  icons: {
    icon: '/natee.yb/logo.svg?v=2',
    apple: '/natee.yb/logo.svg?v=2',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#12101a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable} bg-background`}>
      <body className="font-sans antialiased">
        <BangkokAtmosphere />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
