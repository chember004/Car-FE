// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// // List of protected routes
// const protectedRoutes = ["/dashboard", "/profile", "/settings"];

// export function middleware(req: NextRequest) {
//   const url = req.nextUrl.clone();
//   const token = req.cookies.get("session-token"); // Assuming the token is stored in cookies

//   if (protectedRoutes.includes(url.pathname)) {
//     if (!token) {
//       // If no token, redirect to login
//       url.pathname = "/login";
//       return NextResponse.redirect(url);
//     }
//   }

//   return NextResponse.next();
// }

// // Specify which paths should use the middleware
// export const config = {
//   matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*"],
// };

//************************************************* */
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// // Define routes that need protection
// const protectedRoutes = ["/dashboard", "/profile"];

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get("session-token");

//   if (protectedRoutes.includes(req.nextUrl.pathname) && !token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/profile/:path*"],
// };

//*************************************** */
import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/app/auth/stateless-session';
import { cookies } from 'next/headers';

// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/login', '/signup', '/'];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);

  // 4. Redirect
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
}
