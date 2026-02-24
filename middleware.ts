import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/explore")) {
    const token = request.cookies.get("we_session")?.value;
    if (token !== "1") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/explore/:path*"] };
