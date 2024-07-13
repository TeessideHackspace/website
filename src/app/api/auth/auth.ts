import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type {
  Account,
  CallbacksOptions,
  NextAuthOptions,
  Profile,
} from "next-auth";
import { getServerSession } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export interface HackspaceProfile extends Profile {
  roles: string[];
}

const callbacks: Partial<CallbacksOptions<HackspaceProfile, Account>> = {
  async jwt(inputs) {
    if (inputs.account) {
      inputs.token.id_token = inputs.account.id_token;
    }
    if (inputs.profile?.roles) {
      inputs.token.roles = inputs.profile.roles;
    }
    return inputs.token;
  },
  async session({ session, token, user }) {
    if (session.user) {
      session.user.id = token.sub as string;
      session.id_token = token.id_token as string;
      session.user.roles = token.roles as string[];
    }
    return session;
  },
};

export const config = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_SECRET!,
      issuer: `${process.env.KEYCLOAK_URL}/realms/master`,

      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          email: profile.email,
          image: profile.picture,
          roles: profile.roles,
        };
      },
    }),
  ],

  callbacks,
};

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
    name: session.user.name,
    image: session.user.image,
    roles: session.user.roles,
  };
  return result;
}
