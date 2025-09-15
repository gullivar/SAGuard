import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if user is authenticated
  const isAuthenticated =
    request.cookies.get("isAuthenticated")?.value === "true" || request.headers.get("authorization")

  // If accessing login page and already authenticated, redirect to dashboard
  if (request.nextUrl.pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If accessing protected routes and not authenticated, redirect to login
  if (request.nextUrl.pathname !== "/login" && !isAuthenticated) {
    // For client-side auth check, we'll handle this in the component
    // This middleware primarily handles server-side redirects
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
