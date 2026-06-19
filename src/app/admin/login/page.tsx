'use client'

import { useState }  from 'react'
import { signIn }    from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CTAButton } from '@/components/ui/CTAButton'

export default function AdminLoginPage() {
  const [email,    setEmail]    = useState('admin@lqs.studio')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.ok) router.push('/admin')
    else setError('Credenciales incorrectas')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--imi-bgAbsolute)' }}>
      <div className="w-full max-w-md p-8 border rounded-sm" style={{ borderColor: 'var(--imi-gridBorder)', background: 'var(--imi-cardBg)' }}>
        <h1 className="font-authority text-4xl tracking-wider mb-1" style={{ color: 'var(--imi-textPrimary)' }}>
          LQS<span style={{ color: 'var(--imi-accentOrange)' }}>.</span> ADMIN
        </h1>
        <p className="font-mono-data text-xs tracking-widest uppercase mb-8" style={{ color: 'var(--imi-textMuted)' }}>
          Panel de administración
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          {[
            { id: 'email',    label: 'Correo',     type: 'email',    value: email,    set: setEmail,    autoComplete: 'email'            },
            { id: 'password', label: 'Contraseña', type: 'password', value: password, set: setPassword, autoComplete: 'current-password' },
          ].map((f) => (
            <div key={f.id}>
              <label
                htmlFor={f.id}
                className="font-mono-data text-xs tracking-widest uppercase mb-1 block"
                style={{ color: 'var(--imi-textMuted)' }}
              >
                {f.label}
              </label>
              <input
                id={f.id}
                type={f.type}
                value={f.value}
                autoComplete={f.autoComplete}
                required
                onChange={(e) => f.set(e.target.value)}
                className="w-full px-4 py-3 rounded-sm border bg-transparent font-readability text-sm outline-none"
                style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textPrimary)' }}
              />
            </div>
          ))}
          {error && (
            <p className="font-mono-data text-xs" style={{ color: 'var(--imi-accentOrange)' }}>✕ {error}</p>
          )}
          <CTAButton type="submit" size="lg" isLoading={loading} className="w-full mt-2">
            Ingresar al panel
          </CTAButton>
        </form>
        <p className="font-mono-data text-xs mt-4 text-center" style={{ color: 'var(--imi-gridBorder)' }}>
          admin@lqs.studio / lqs-admin-2024
        </p>
      </div>
    </div>
  )
}
