import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles the OAuth2 callback from Spring Boot.
 * Spring Boot's OAuth2SuccessHandler redirects to:
 *   http://localhost:3000/api/auth/oauth-callback?accessToken=...&refreshToken=...
 *
 * This route stores the tokens in cookies and redirects the user to the home page.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL("/?auth_error=missing_tokens", req.url));
  }

  const response = NextResponse.redirect(new URL("/", req.url));

  // Store tokens in cookies
  response.cookies.set("access_token", accessToken, {
    httpOnly: false, // must be readable by client JS for auth context
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  response.cookies.set("refresh_token", refreshToken, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
