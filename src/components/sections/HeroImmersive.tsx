'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { CTAButton } from '@/components/ui/CTAButton'
import { useQuoterStore } from '@/store/quoterStore'
import { DuckSVG } from '@/components/ui/DuckIllustration'

const HeroCanvas   = dynamic(() => import('@/components/three/HeroCanvas').then(m => m.HeroCanvas), {
  ssr: false,
  loading: () => null,
})
const HeroFallback = dynamic(() => import('@/components/three/HeroFallback').then(m => m.HeroFallback), {
  ssr: false,
})

export function HeroImmersive() {
  const titleRef   = useRef<HTMLHeadingElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef     = useRef<HTMLDivElement>(null)
  const scrollRef  = useRef<HTMLDivElement>(null)
  const duckRef    = useRef<HTMLDivElement>(null)

  const isMobile  = useIsMobile()
  const openPanel  = useQuoterStore((s) => s.openPanel)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo(duckRef.current,
      { opacity: 0, scale: 0.8, y: 30 },
      { opacity: 1, scale: 1,   y: 0,  duration: 1.2 }
    )
    .fromTo(titleRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1 },
      '-=0.7'
    )
    .fromTo(taglineRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.4'
    )
    .fromTo(ctaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.3'
    )
    .fromTo(scrollRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      '-=0.2'
    )
  }, [])

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: 'var(--imi-bgAbsolute)' }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern-animated opacity-20 pointer-events-none" />

      {/* 3D Canvas or fallback */}
      <div className="absolute inset-0 pointer-events-none">
        {isMobile ? <HeroFallback /> : <HeroCanvas />}
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 90% 90% at 35% 50%, transparent 20%, var(--imi-bgAbsolute) 72%)',
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-16"
        style={{ paddingTop: 'clamp(5rem, 12vh, 9rem)', paddingBottom: 'clamp(3rem, 8vh, 6rem)' }}
      >
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-20">

          {/* Pato estático — arriba en mobile, derecha en desktop */}
          <div
            ref={duckRef}
            className="order-first md:order-last flex-shrink-0 flex items-center justify-center"
          >
            <DuckSVG
              pose="photo"
              direction="left"
              size={220}
              isMoving={false}
              className="w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] md:w-[160px] md:h-[160px] lg:w-[220px] lg:h-[220px]"
            />
          </div>

          {/* Texto identidad */}
          <div className="flex-1 min-w-0">
            <div
              className="font-data-mono text-xs tracking-[0.3em] mb-6"
              style={{ color: 'var(--theme-accent)' }}
            >
              // AGENCIA CREATIVA — COLOMBIA
            </div>

            <h1
              ref={titleRef}
              className="font-authority leading-none mb-10"
              style={{ color: 'var(--imi-textPrimary)', letterSpacing: '0.02em' }}
            >
              <span
                className="block text-[clamp(2.4rem,6.5vw,5rem)] tracking-[0.18em]"
                style={{ color: 'var(--theme-accent)' }}
              >
                LQS
              </span>
              <span className="block text-[clamp(3.6rem,11vw,8.5rem)] leading-[0.88]">
                LO QUE<br />
                <span style={{ color: 'var(--theme-accent)' }}>SEA</span>
              </span>
            </h1>

            <p
              ref={taglineRef}
              className="text-base md:text-lg leading-[1.8] mb-12 max-w-sm"
              style={{ color: 'var(--imi-textMuted)' }}
            >
              Producción creativa sin límites. Medios,
              crecimiento e ideación para marcas que se
              atreven a existir de verdad.
            </p>

            <div ref={ctaRef} className="flex flex-wrap gap-5">
              <CTAButton variant="primary" size="lg" onClick={openPanel}>
                Cotiza tu proyecto
              </CTAButton>
              <CTAButton variant="secondary" size="lg" href="/servicios">
                Ver servicios
              </CTAButton>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: 'var(--imi-textMuted)' }}
      >
        <span className="font-data-mono text-xs tracking-[0.2em]">SCROLL</span>
        <div className="w-px h-12 bg-gradient-to-b from-current to-transparent animate-pulse" />
      </div>
    </section>
  )
}

export default HeroImmersive
