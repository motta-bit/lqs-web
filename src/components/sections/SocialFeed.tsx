'use client'

import { useScrollReveal } from '@/hooks/useScrollAnimation'
import { WhatsAppButton }  from '@/components/ui/WhatsAppButton'

const IG_POSTS  = Array.from({ length: 6 }, (_, i) => ({ id: `ig-${i}`, permalink: 'https://instagram.com/loqueseacreative' }))
const YT_VIDEOS = Array.from({ length: 3 }, (_, i) => ({ id: `yt-${i}`, title: `Video LQS #${i + 1}`, href: 'https://youtube.com/@loqueseacreative' }))
const SOCIALS   = [
  { label: 'Instagram', href: 'https://instagram.com/loqueseacreative'  },
  { label: 'TikTok',    href: 'https://tiktok.com/@loqueseacreative'    },
  { label: 'YouTube',   href: 'https://youtube.com/@loqueseacreative'   },
]

export function SocialFeed() {
  const sectionRef = useScrollReveal({ stagger: 0.06 })

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="social"
      className="py-36 px-6"
      style={{ background: 'var(--imi-cardBg)' }}
    >
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6" data-reveal>
          <div>
            <p className="font-mono-data text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--imi-accentOrange)' }}>◆ Síguenos</p>
            <h2 className="font-authority text-5xl md:text-7xl leading-none" style={{ color: 'var(--imi-textPrimary)' }}>
              EN VIVO<br /><span style={{ color: 'var(--imi-securityTeal)' }}>EN REDES.</span>
            </h2>
          </div>
          <div className="flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-data text-xs tracking-widest uppercase px-4 py-2 border rounded-sm transition-all hover:scale-105"
                style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textMuted)' }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-16" data-reveal>
          {IG_POSTS.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square block overflow-hidden rounded-sm border transition-all hover:scale-105 flex items-center justify-center"
              style={{ borderColor: 'var(--imi-gridBorder)', background: 'var(--imi-bgAbsolute)' }}
            >
              <span className="font-authority text-2xl opacity-20" style={{ color: 'var(--imi-accentOrange)' }}>IG</span>
            </a>
          ))}
        </div>

        <div data-reveal>
          <h3 className="font-authority text-3xl tracking-wider mb-6" style={{ color: 'var(--imi-textMuted)' }}>ÚLTIMOS VIDEOS</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {YT_VIDEOS.map((video) => (
              <a
                key={video.id}
                href={video.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block border rounded-sm overflow-hidden transition-all hover:-translate-y-1"
                style={{ borderColor: 'var(--imi-gridBorder)', background: 'var(--imi-bgAbsolute)' }}
              >
                <div className="aspect-video flex items-center justify-center" style={{ background: 'var(--imi-cardBg)' }}>
                  <span className="font-authority text-4xl opacity-20" style={{ color: 'var(--imi-accentOrange)' }}>▶</span>
                </div>
                <div className="p-4">
                  <p className="font-readability text-sm" style={{ color: 'var(--imi-textPrimary)' }}>{video.title}</p>
                  <p className="font-mono-data text-xs mt-1" style={{ color: 'var(--imi-textMuted)' }}>youtube.com/@loqueseacreative</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="text-center mt-16" data-reveal>
          <p className="font-authority text-3xl tracking-wider mb-6" style={{ color: 'var(--imi-textPrimary)' }}>¿Listo para crear algo increíble?</p>
          <WhatsAppButton
            message="¡Hola LQS! Vi su trabajo en redes y me gustaría hablar sobre un proyecto."
            floating={false}
            className="inline-flex items-center gap-3 px-8 py-4 font-authority tracking-widest text-lg transition-all hover:scale-105"
            style={{ background: 'var(--imi-accentOrange)', color: '#000', boxShadow: '0 0 20px rgba(255,70,0,0.35)' }}
          >
            💬 Hablemos por WhatsApp
          </WhatsAppButton>
        </div>

      </div>
    </section>
  )
}

export default SocialFeed
