import type { Metadata, Viewport } from 'next'
import { Archivo, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import ThemeProvider       from '@/components/layout/ThemeProvider'
import LenisProvider       from '@/components/layout/LenisProvider'
import { NextAuthProvider } from '@/components/layout/NextAuthProvider'
import { WebVitals }        from '@/components/layout/WebVitals'
import { CurtainProvider }  from '@/city/transitions/CurtainProvider'

// D-02: "Archivo Expanded Black" no existe como familia en Google Fonts.
// Se usa Archivo variable con el eje de anchura (`wdth`) disponible y peso 900.
// Si LQS consigue licencia del corte Expanded real, esto pasa a next/font/local
// sin tocar ningún consumidor: el token `--font-archivo` no cambia.
// `axes` solo se permite con peso variable, así que el 900 se aplica en CSS
// (`.font-display`), junto con el eje de anchura al máximo (font-stretch 125%).
const archivo = Archivo({
  subsets:  ['latin'],
  axes:     ['wdth'],
  variable: '--font-archivo',
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
      className={`${archivo.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen antialiased"
        style={{
          backgroundColor: 'var(--imi-bgAbsolute)',
          color:           'var(--imi-textPrimary)',
        }}
      >
        <WebVitals />
        <NextAuthProvider>
          <ThemeProvider>
            {/*
              El preloader falso global (progreso por setInterval) se retiró:
              la ciudad tiene su propio preloader con carga real (CityPreloader).
              Los patos legacy (cursor/header/float) bajaron a (main)/layout:
              corren bucles de re-render por frame y las rutas de la ciudad no
              deben pagarlos. La ciudad usa @/components/duck.
            */}
            <LenisProvider>
              <CurtainProvider>
                {children}
              </CurtainProvider>
            </LenisProvider>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
