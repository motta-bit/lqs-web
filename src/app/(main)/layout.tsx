import { QuoterPanel }  from '@/components/quoter/QuoterPanel'
import Header           from '@/components/layout/Header'
import Footer           from '@/components/layout/Footer'
import WhatsAppButton   from '@/components/ui/WhatsAppButton'
import { DuckCursor, HeaderDuck, DuckFloat } from '@/components/layout/DuckCursor'

// Patos legacy: solo el sitio actual. Se retiran cuando la ciudad reemplace
// estas rutas (Fase 2). La ciudad usa @/components/duck, sin re-renders.
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DuckCursor />
      <HeaderDuck />
      <DuckFloat />
      <QuoterPanel />
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton floating position="bottom-right" />
    </>
  )
}
