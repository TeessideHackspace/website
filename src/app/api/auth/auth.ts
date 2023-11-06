import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export const config = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],

  callbacks: {
    async jwt(inputs) {
      if (inputs.account) {
        inputs.token.id_token = inputs.account.id_token;
      }
      return inputs.token;
    },
    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.id_token = token.id_token as string;
      }
      return session;
    },
  },
} satisfies NextAuthOptions;

export async function getSession(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  const session = await getServerSession(...args, config);
  if (!session || !session.user || !session.user.id || !session.user.email) {
    console.warn("Invalid session", session);
    return;
  }
  const result = {
    id: session.user.id,
    email: session.user.email,
  };
  return result;
}
