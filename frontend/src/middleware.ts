import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Definir rutas públicas (no requieren token)
  const publicPaths = ['/login', '/registro', '/', '/agenda'];
  
  // Rutas que requieren autenticación pero no verificación de rol
  const protectedPaths = ['/capacidad', '/desafio', '/chats', '/solicitudes'];

  // 2. Si es una ruta pública, dejar pasar sin verificar token
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }
  
  // 3. Si es una ruta protegida o admin, verificar token
  const needsAuth = protectedPaths.some(path => pathname.startsWith(path)) || pathname.startsWith('/admin');
  
  // 4. Obtener token
  const token = request.cookies.get('token')?.value;

  // 5. Si la ruta necesita autenticación Y no hay token, redirigir a login
  if (!token && needsAuth) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'session_expired');
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 6. Si hay token y la ruta necesita autenticación, verificarlo
  if (token && needsAuth) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/auth/verify`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Token inválido');
      }

      const data = await res.json();
      const user = data.user;

      // 7. Lógica de autorización para rutas admin
      if (pathname.startsWith('/admin')) {
        if (user.rol === 'admin') {
          return NextResponse.next(); // Permitido: Admin en ruta /admin
        } else {
          // No es admin, pero intenta entrar a /admin
          const loginUrl = new URL('/login', request.url);
          loginUrl.searchParams.set('error', 'unauthorized');
          return NextResponse.redirect(loginUrl);
        }
      }
      
      // 8. Para otras rutas protegidas, solo verificar que esté autenticado
      return NextResponse.next();

    } catch (error) {
      // 9. El token es inválido o expiró
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'session_expired');
      
      // Borrar la cookie inválida
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('token');
      return response;
    }
  }

  // 10. Si el usuario está logueado e intenta ir a /login o /registro, redirigir
  if (token && publicPaths.includes(pathname) && pathname !== '/' && pathname !== '/agenda') {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/auth/verify`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        const user = data.user;
        
        if (user.rol === 'admin') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        } else if (user.rol === 'unsa') {
          return NextResponse.redirect(new URL('/capacidad', request.url));
        } else if (user.rol === 'externo') {
          return NextResponse.redirect(new URL('/desafio', request.url));
        }
      }
    } catch (error) {
      // Token inválido, dejar pasar al login
    }
  }

  // Fallback: dejar pasar
  return NextResponse.next();
}

// El "Matcher"
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};