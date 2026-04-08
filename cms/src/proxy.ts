import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// CMS admin routes — all require authentication.
// Everything not listed here (public site pages, /manual, /login) is accessible without auth.
const CMS_ROUTES = [
  '/dashboard',
  '/pages',
  '/blog',
  '/media',
  '/forms',
  '/seo',
  '/style',
  '/users',
  '/activity',
  '/preview',   // draft preview — auth required so anonymous users can't see unpublished content
]

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // /login — redirect already-authenticated users to the dashboard
  if (pathname === '/login') {
    if (user) return NextResponse.redirect(new URL('/dashboard', request.url))
    return supabaseResponse
  }

  // CMS admin routes — require auth
  const isCmsRoute = CMS_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'))
  if (isCmsRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Everything else — public (site pages, /manual, /)
  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
