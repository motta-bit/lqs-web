import Link from 'next/link'

const WHATSAPP_NUMBER = '573247680413'
const EMAIL           = 'loqueseaproductionsp1@gmail.com'

const SERVICE_LINKS = [
  { label: 'Fotografía Corporativa', href: '#servicios' },
  { label: 'Video Producción',       href: '#servicios' },
  { label: 'Gestión de Redes',       href: '#servicios' },
  { label: 'Branding & Identidad',   href: '#servicios' },
  { label: 'Diseño Web',             href: '#servicios' },
  { label: 'Pauta Digital',          href: '#servicios' },
]

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href:  'https://instagram.com/loqueseaproductions',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href:  'https://tiktok.com/@loqueseaproductions',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.79a4.85 4.85 0 01-1.07-.1z"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href:  'https://youtube.com/@loqueseaproductions',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#050505] border-t border-[#262626]">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <p className="font-authority text-5xl tracking-[0.15em] text-white mb-3">LQS</p>
          <p className="font-data-mono text-xs tracking-[0.25em] text-[--theme-secondary] uppercase mb-4">
            Lo Que Sea
          </p>
          <p className="font-readability text-sm text-white/50 leading-relaxed max-w-xs">
            Agencia creativa colombiana. Hacemos lo que sea para que tu marca deje huella.
          </p>

          {/* Social links */}
          <div className="flex gap-4 mt-6">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-white/40 hover:text-[--theme-accent] transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <p className="font-data-mono text-xs tracking-[0.3em] text-white/40 uppercase mb-6">
            Servicios
          </p>
          <ul className="space-y-3">
            {SERVICE_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="font-readability text-sm text-white/50 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="font-data-mono text-xs tracking-[0.3em] text-white/40 uppercase mb-6">
            Contacto
          </p>
          <ul className="space-y-4">
            <li>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-white/50 hover:text-[#25D366] transition-colors"
              >
                <span className="font-data-mono text-xs tracking-wider">WhatsApp</span>
                <span className="font-readability text-sm">+57 324 768 0413</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${EMAIL}`}
                className="group flex items-center gap-3 text-white/50 hover:text-[--theme-accent] transition-colors"
              >
                <span className="font-data-mono text-xs tracking-wider">Email</span>
                <span className="font-readability text-sm break-all">{EMAIL}</span>
              </a>
            </li>
            <li className="pt-2">
              <p className="font-data-mono text-xs text-white/30 tracking-wider">
                Colombia 🇨🇴
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-data-mono text-xs text-white/25 tracking-widest">
            © {year} LQS — Lo Que Sea. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacidad"
              className="font-data-mono text-xs text-white/25 hover:text-white/50 transition-colors tracking-wider"
            >
              Privacidad
            </Link>
            <Link
              href="/terminos"
              className="font-data-mono text-xs text-white/25 hover:text-white/50 transition-colors tracking-wider"
            >
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
