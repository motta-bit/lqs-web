'use client'

/**
 * CityStage — the gate between the DOM layer and the 3D world.
 *
 * Decision D-04 made executable: this is the only place that decides whether
 * the canvas exists. The copy layer around it is identical in all three modes,
 * so `lite` and `static` are not a separate build of the site — they are this
 * component returning a different backdrop.
 *
 * The 3D bundle is behind `ssr: false` + dynamic import so that three, R3F and
 * drei never enter the initial JS payload. That is what keeps the app-shell
 * budget in `.size-limit.json` honest.
 */

import dynamic from 'next/dynamic'
import { useCapability } from '@/motion/useCapability'
import { DISTRICTS, ACCENT_HEX } from './districts'

const CityGreybox = dynamic(() => import('./scene/CityGreybox'), {
  ssr: false,
  loading: () => <CityBackdrop />,
})

/**
 * The `lite` / `static` backdrop — Concept 2's visual base.
 *
 * Pure CSS: eight accent fields laid out on the same octagon as the 3D city, so
 * the spatial memory carries between modes. Costs nothing, shifts nothing, and
 * is what mobile and reduced-motion users actually see.
 */
function CityBackdrop() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black" aria-hidden="true">
      {DISTRICTS.map((district, i) => {
        const angle = (i / DISTRICTS.length) * Math.PI * 2 - Math.PI / 2
        return (
          <div
            key={district.slug}
            className="absolute h-[45vmin] w-[45vmin] rounded-full opacity-[0.18] blur-[70px]"
            style={{
              backgroundColor: ACCENT_HEX[district.accent],
              left: `calc(50% + ${Math.cos(angle) * 30}% )`,
              top: `calc(50% + ${Math.sin(angle) * 30}% )`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )
      })}
    </div>
  )
}

export function CityStage() {
  const { profile, resolved } = useCapability()

  // Before capability resolves we render the flat backdrop. Mounting a canvas
  // and tearing it down once the mode is known is a guaranteed layout shift,
  // and CLS is one of the three budgets that break the build.
  if (!resolved || !profile.canvas3D) {
    return <CityBackdrop />
  }

  return <CityGreybox ambient={profile.ambientLoops} />
}

export default CityStage
