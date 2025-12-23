import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  // Update session expiration if valid
  const response = await updateSession(request);
  
  // Protected routes logic
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const session = request.cookies.get("session");
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect to dashboard if already logged in and visiting login
  if (request.nextUrl.pathname.startsWith("/login")) {
    const session = request.cookies.get("session");
    if (session) {
       return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response || NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
