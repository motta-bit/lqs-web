'use client'

import { useState, useEffect } from 'react'
import { IntroSequence }        from './IntroSequence'
import { HeroWelcome }          from './HeroWelcome'
import { ProyectosScroll }      from './ProyectosScroll'
import { MuestrasEmpresas }     from './MuestrasEmpresas'
import { PlanesTabs }           from './PlanesTabs'
import { CTAFinal }             from './CTAFinal'

const SKIP_KEY = 'lqs_intro_seen'

export function HomeClient() {
  const [showIntro, setShowIntro] = useState(false)
  const [ready, setReady]         = useState(false)

  useEffect(() => {
    const seen = sessionStorage.getItem(SKIP_KEY)
    if (seen) {
      setReady(true)
    } else {
      setShowIntro(true)
    }
  }, [])

  const handleIntroDone = () => {
    sessionStorage.setItem(SKIP_KEY, '1')
    setShowIntro(false)
    setReady(true)
  }

  return (
    <>
      {showIntro && <IntroSequence onDone={handleIntroDone} />}

      {ready && (
        <main>
          <section id="inicio">
            <HeroWelcome />
          </section>

          <section id="portafolio">
            <ProyectosScroll />
          </section>

          <section id="clientes">
            <MuestrasEmpresas />
          </section>

          <section id="planes">
            <PlanesTabs />
          </section>

          <section id="contacto">
            <CTAFinal />
          </section>
        </main>
      )}
    </>
  )
}
