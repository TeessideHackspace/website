import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  if (!token && process.env.NEXTAUTH_URL) {
    console.warn("No JWT token found when calling /federated-logout endpoint,");
    return NextResponse.redirect(process.env.NEXTAUTH_URL as string, 302);
  }
  if (token && !token.id_token) {
    throw new Error(
      "Without an id_token the user won't be redirected back from the IdP after logout."
    );
  }
  if (token && token.id_token && process.env.KEYCLOAK_ISSUER) {
    const endsessionParams = new URLSearchParams({
      id_token_hint: token["id_token"] as string,
      post_logout_redirect_uri: process.env.NEXTAUTH_URL as string,
    });
    const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout?${endsessionParams}`;
    cookies().delete("next-auth.session-token");
    cookies().delete("__Secure-next-auth.session-token");
    return NextResponse.redirect(url, 302);
  }
  return NextResponse.redirect(process.env.NEXTAUTH_URL as string, 302);
}
