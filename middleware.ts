import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    const protectedRoutes = ['/dashboard', '/tracker', '/cycle', '/recipes', '/encyclopedia', '/library']
    const isProtected = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

    if (isProtected && !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') && user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

  } catch {
    return response
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/tracker/:path*', '/cycle/:path*', '/recipes/:path*', '/encyclopedia/:path*', '/library/:path*', '/login', '/signup', '/onboarding/:path*'],
}