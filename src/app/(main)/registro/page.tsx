'use client'

import { useState }  from 'react'
import { useRouter } from 'next/navigation'
import Link          from 'next/link'
import { DuckSVG }   from '@/components/ui/DuckIllustration'

export default function RegistroPage() {
  const [form, setForm] = useState({ nombre: '', empresa: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/cliente/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, nombre: form.nombre, empresa: form.empresa, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Error al crear cuenta.')
      } else {
        setSuccess(true)
        setTimeout(() => router.push('/login'), 2500)
      }
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="section-compact min-h-screen flex items-center justify-center px-6 py-24" style={{ background: '#000' }}>
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-[-5%] right-[-5%] pointer-events-none"
        style={{ width: 450, height: 450, background: '#0055FF', opacity: 0.05, borderRadius: '50%', filter: 'blur(100px)' }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <DuckSVG pose="eating" direction="right" size={72} />
          </div>
          <Link href="/" className="font-authority text-4xl tracking-widest" style={{ color: '#fff' }}>
            LQS<span style={{ color: '#FF4600' }}>.</span>
          </Link>
          <p className="font-mono-data text-xs tracking-widest uppercase mt-2" style={{ color: '#444' }}>
            Crear cuenta de cliente
          </p>
        </div>

        <div className="border p-8" style={{ background: '#080808', borderColor: '#1a1a1a' }}>
          {success ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-4">✓</p>
              <h2 className="font-authority text-2xl tracking-wider mb-2" style={{ color: '#fff' }}>
                ¡Cuenta creada!
              </h2>
              <p className="font-readability text-sm" style={{ color: '#666' }}>
                Redirigiendo al login...
              </p>
            </div>
          ) : (
            <>
              <h1 className="font-authority text-2xl tracking-wider mb-1" style={{ color: '#fff' }}>
                Crear cuenta
              </h1>
              <p className="font-readability text-sm mb-8" style={{ color: '#555' }}>
                Accede a tu espacio de proyectos con LQS
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { key: 'nombre',  label: 'Nombre completo', type: 'text',     placeholder: 'Tu nombre', required: true  },
                  { key: 'empresa', label: 'Empresa (opcional)', type: 'text',  placeholder: 'Nombre de tu empresa', required: false },
                  { key: 'email',   label: 'Correo electrónico', type: 'email', placeholder: 'tu@email.com', required: true  },
                  { key: 'password', label: 'Contraseña', type: 'password',     placeholder: 'Mínimo 8 caracteres', required: true  },
                  { key: 'confirm', label: 'Confirmar contraseña', type: 'password', placeholder: '••••••••', required: true },
                ].map(field => (
                  <div key={field.key}>
                    <label className="font-mono-data text-xs tracking-widest uppercase block mb-2" style={{ color: '#444' }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      required={field.required}
                      value={form[field.key as keyof typeof form]}
                      onChange={set(field.key as keyof typeof form)}
                      className="w-full bg-transparent border px-4 py-3 font-readability text-sm outline-none transition-colors focus:border-[#FF4600]"
                      style={{ borderColor: '#222', color: '#fff' }}
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}

                {error && (
                  <p className="font-readability text-sm px-4 py-3 border"
                    style={{ color: '#FF4600', background: 'rgba(255,70,0,0.06)', borderColor: 'rgba(255,70,0,0.2)' }}>
                    {error}
                  </p>
                )}

                <button type="submit" disabled={loading}
                  className="w-full py-4 font-mono-data text-sm tracking-widest uppercase transition-all disabled:opacity-50 mt-2"
                  style={{ background: '#FF4600', color: '#000' }}>
                  {loading ? 'Creando cuenta...' : 'Crear cuenta →'}
                </button>
              </form>

              <p className="font-readability text-sm text-center mt-6 pt-6 border-t" style={{ borderColor: '#111', color: '#555' }}>
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="hover:text-white transition-colors" style={{ color: '#FF4600' }}>
                  Iniciar sesión
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
