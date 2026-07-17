import { NextAuthOptions } from 'next-auth'
import CredentialsProvider  from 'next-auth/providers/credentials'
import bcrypt               from 'bcryptjs'

async function getClienteFromEdgeConfig(email: string) {
  try {
    const { get } = await import('@vercel/edge-config')
    const clientes = await get<ClienteUser[]>('clientes_web') ?? []
    return clientes.find(c => c.email === email && c.active) ?? null
  } catch { return null }
}

export interface ClienteUser {
  id: string
  email: string
  nombre: string
  empresa?: string
  passwordHash: string
  createdAt: string
  active: boolean
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Admin hardcoded (always available)
        if (credentials.email === 'admin@lqs.studio' && credentials.password === 'lqs-admin-2024') {
          return { id: 'dev-admin', email: 'admin@lqs.studio', name: 'LQS Admin', role: 'ADMIN' } as any
        }

        // Client users in Edge Config
        const cliente = await getClienteFromEdgeConfig(credentials.email)
        if (cliente) {
          const ok = await bcrypt.compare(credentials.password, cliente.passwordHash)
          if (!ok) return null
          return { id: cliente.id, email: cliente.email, name: cliente.nombre, role: 'CLIENT' } as any
        }

        // DB users (if Prisma is configured)
        try {
          if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('user:password')) {
            const { prisma } = await import('./prisma')
            const user = await prisma.user.findUnique({ where: { email: credentials.email } })
            if (!user) return null
            const isValid = await bcrypt.compare(credentials.password, user.password)
            if (!isValid) return null
            return { id: user.id, email: user.email, name: user.name, role: (user as any).role ?? 'ADMIN' }
          }
        } catch { /* DB unavailable */ }

        return null
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages:   { signIn: '/admin/login', error: '/admin/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.role = (user as any).role; token.id = user.id }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
        ;(session.user as any).id   = token.id
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'lqs-dev-secret-2024',
}
