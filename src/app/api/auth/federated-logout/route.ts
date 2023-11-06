import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("id_token_hint");
  if (!token && process.env.NEXTAUTH_URL) {
    console.warn("No JWT token found when calling /federated-logout endpoint,");
    return NextResponse.redirect(process.env.NEXTAUTH_URL as string, 302);
  }
  if (token && token && process.env.KEYCLOAK_ISSUER) {
    const endsessionParams = new URLSearchParams({
      id_token_hint: token,
      post_logout_redirect_uri: process.env.NEXTAUTH_URL as string,
    });
    const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout?${endsessionParams}`;
    return Response.redirect(url, 302);
  }
  return NextResponse.redirect(process.env.NEXTAUTH_URL as string, 302);
}
