import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple passthrough middleware – auth is handled client-side via JWT tokens.
// The Spring Boot backend validates JWTs on protected API calls.
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
