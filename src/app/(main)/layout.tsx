import { QuoterPanel }  from '@/components/quoter/QuoterPanel'
import Header           from '@/components/layout/Header'
import Footer           from '@/components/layout/Footer'
import WhatsAppButton   from '@/components/ui/WhatsAppButton'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <QuoterPanel />
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton floating position="bottom-right" />
    </>
  )
}
