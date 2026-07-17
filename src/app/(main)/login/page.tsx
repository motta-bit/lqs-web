'use client'

import { useState }    from 'react'
import { signIn }      from 'next-auth/react'
import { useRouter }   from 'next/navigation'
import Link            from 'next/link'
import { DuckSVG }     from '@/components/ui/DuckIllustration'

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await signIn('credentials', {
        email, password, redirect: false, callbackUrl: '/mi-proyecto',
      })
      if (res?.error) {
        setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
      } else if (res?.url) {
        router.push('/mi-proyecto')
      }
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="section-compact min-h-screen flex items-center justify-center px-6 py-24" style={{ background: '#000' }}>
      {/* Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* Orb */}
      <div className="absolute top-[-10%] left-[-5%] pointer-events-none"
        style={{ width: 500, height: 500, background: '#FF4600', opacity: 0.06, borderRadius: '50%', filter: 'blur(100px)' }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <DuckSVG pose="photo" direction="right" size={72} />
          </div>
          <Link href="/" className="font-authority text-4xl tracking-widest" style={{ color: '#fff' }}>
            LQS<span style={{ color: '#FF4600' }}>.</span>
          </Link>
          <p className="font-mono-data text-xs tracking-widest uppercase mt-2" style={{ color: '#444' }}>
            Portal de clientes
          </p>
        </div>

        <div className="border p-8" style={{ background: '#080808', borderColor: '#1a1a1a' }}>
          <h1 className="font-authority text-2xl tracking-wider mb-1" style={{ color: '#fff' }}>
            Iniciar sesión
          </h1>
          <p className="font-readability text-sm mb-8" style={{ color: '#555' }}>
            Accede al seguimiento de tus proyectos
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-mono-data text-xs tracking-widest uppercase block mb-2" style={{ color: '#444' }}>
                Correo electrónico
              </label>
              <input
                type="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-transparent border px-4 py-3 font-readability text-sm outline-none transition-colors focus:border-[#FF4600]"
                style={{ borderColor: '#222', color: '#fff' }}
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="font-mono-data text-xs tracking-widest uppercase block mb-2" style={{ color: '#444' }}>
                Contraseña
              </label>
              <input
                type="password" required
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-transparent border px-4 py-3 font-readability text-sm outline-none transition-colors focus:border-[#FF4600]"
                style={{ borderColor: '#222', color: '#fff' }}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="font-readability text-sm px-4 py-3 border"
                style={{ color: '#FF4600', background: 'rgba(255,70,0,0.06)', borderColor: 'rgba(255,70,0,0.2)' }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 font-mono-data text-sm tracking-widest uppercase transition-all disabled:opacity-50"
              style={{ background: '#FF4600', color: '#000' }}>
              {loading ? 'Ingresando...' : 'Ingresar →'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t flex flex-col gap-3" style={{ borderColor: '#111' }}>
            <p className="font-readability text-sm text-center" style={{ color: '#555' }}>
              ¿No tienes cuenta?{' '}
              <Link href="/registro" className="transition-colors hover:text-white" style={{ color: '#FF4600' }}>
                Regístrate gratis
              </Link>
            </p>
            <p className="font-readability text-sm text-center" style={{ color: '#333' }}>
              ¿Eres administrador?{' '}
              <Link href="/admin/login" className="transition-colors hover:text-white" style={{ color: '#555' }}>
                Panel de admin →
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center font-mono-data text-xs mt-6" style={{ color: '#222' }}>
          LQS Studio · Colombia
        </p>
      </div>
    </main>
  )
}
