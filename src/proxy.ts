import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    secret: process.env.NEXTAUTH_SECRET || 'lqs-dev-secret-2024',
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl
        if (pathname === '/admin/login') return true
        if (pathname.startsWith('/admin')) return !!token
        return true
      },
    },
    pages: { signIn: '/admin/login' },
  }
)

export const config = {
  matcher: ['/admin/:path*'],
}
