import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import ThemeProvider       from '@/components/layout/ThemeProvider'
import LenisProvider       from '@/components/layout/LenisProvider'
import Preloader           from '@/components/layout/Preloader'
import { DuckCursor, HeaderDuck } from '@/components/layout/DuckCursor'
import { NextAuthProvider } from '@/components/layout/NextAuthProvider'

const bebasNeue = Bebas_Neue({
  weight:   '400',
  subsets:  ['latin'],
  variable: '--font-bebas',
  display:  'swap',
})

const inter = Inter({
  subsets:  ['latin'],
  variable: '--font-inter',
  display:  'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets:  ['latin'],
  variable: '--font-jetbrains',
  display:  'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://lqs.studio'),
  title: {
    default:  'LQS — Lo Que Sea',
    template: '%s | LQS',
  },
  description:
    'Agencia creativa colombiana. Creative · Digital · Technology · Production.',
  keywords: ['agencia creativa', 'diseño', 'tecnología', 'producción', 'Colombia', 'LQS'],
  authors:  [{ name: 'LQS Studio' }],
  creator:  'LQS Studio',
  manifest: '/manifest.json',
  robots: {
    index:  true,
    follow: true,
  },
  openGraph: {
    type:      'website',
    locale:    'es_CO',
    siteName:  'LQS — Lo Que Sea',
    title:     'LQS — Lo Que Sea',
    description: 'Agencia creativa colombiana. Creative · Digital · Technology · Production.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'LQS — Lo Que Sea',
    description: 'Agencia creativa colombiana.',
    images:      ['/og-image.jpg'],
  },
}

export const viewport: Viewport = {
  themeColor:    '#000000',
  width:         'device-width',
  initialScale:  1,
  maximumScale:  1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      data-theme="default"
      className={`${bebasNeue.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen antialiased"
        style={{
          backgroundColor: 'var(--imi-bgAbsolute)',
          color:           'var(--imi-textPrimary)',
        }}
      >
        <NextAuthProvider>
          <ThemeProvider>
            <Preloader />
            <DuckCursor />
            <HeaderDuck />
            <LenisProvider>
              {children}
            </LenisProvider>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
