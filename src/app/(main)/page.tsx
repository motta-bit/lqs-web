import { HeroV3 }               from '@/components/sections/HeroV3'
import { ProyectosDestacados }  from '@/components/sections/ProyectosDestacados'
import { MuestrasEmpresas }     from '@/components/sections/MuestrasEmpresas'
import { PlanesTabs }           from '@/components/sections/PlanesTabs'
import { CTAFinal }             from '@/components/sections/CTAFinal'

export default function Home() {
  return (
    <>
      <HeroV3 />
      <ProyectosDestacados />
      <MuestrasEmpresas />
      <PlanesTabs />
      <CTAFinal />
    </>
  )
}
