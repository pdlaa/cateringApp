import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          supabaseResponse.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          supabaseResponse.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Refresh session jika expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes
  const protectedPaths = ['/admin', '/owner', '/kurir', '/profile']
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // Redirect logic
  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Jika sudah login, redirect berdasarkan role
  if (user && request.nextUrl.pathname === '/') {
    // Ambil role dari metadata atau database
    const { data: userData } = await supabase
      .from('users')
      .select('level')
      .eq('id', user.id)
      .single()

    const { data: pelangganData } = await supabase
      .from('pelanggans')
      .select('id')
      .eq('id', user.id)
      .single()

    if (userData?.level === 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/paket'
      return NextResponse.redirect(url)
    }
    
    if (userData?.level === 'owner') {
      const url = request.nextUrl.clone()
      url.pathname = '/owner'
      return NextResponse.redirect(url)
    }
    
    if (userData?.level === 'kurir') {
      const url = request.nextUrl.clone()
      url.pathname = '/kurir'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}