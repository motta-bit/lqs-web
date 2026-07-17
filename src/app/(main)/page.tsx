import { HeroWelcome }          from '@/components/sections/HeroWelcome'
import { ProyectosDestacados }  from '@/components/sections/ProyectosDestacados'
import { MuestrasEmpresas }     from '@/components/sections/MuestrasEmpresas'
import { PlanesTabs }           from '@/components/sections/PlanesTabs'
import { CTAFinal }             from '@/components/sections/CTAFinal'

export default function Home() {
  return (
    <>
      <HeroWelcome />
      <ProyectosDestacados />
      <MuestrasEmpresas />
      <PlanesTabs />
      <CTAFinal />
    </>
  )
}
