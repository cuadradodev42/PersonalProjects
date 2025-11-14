import { NextResponse } from 'next/server';

export function middleware(request) {
  // Obtener el path de la URL
  const path = request.nextUrl.pathname;

  // Rutas públicas que no requieren autenticación
  const publicPaths = ['/', '/login', '/signup'];
  const isPublicPath = publicPaths.includes(path);

  // Obtener el token de las cookies (Firebase auth token)
  // Next.js con Firebase usa el estado del cliente, pero podemos verificar cookies
  const token = request.cookies.get('__session')?.value || '';

  // Si el usuario está autenticado y trata de ir a login o signup
  if (token && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configurar qué rutas debe verificar el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

