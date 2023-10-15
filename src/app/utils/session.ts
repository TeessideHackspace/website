import { getSession } from "@auth0/nextjs-auth0";

const ID_CLAIM = "sub";

export async function getUser() {
  const session = await getSession();
  if (!session || !session.user) {
    return;
  }
  return session.user[ID_CLAIM];
}

export async function getEmail() {
  const session = await getSession();
  if (!session || !session.email) {
    return;
  }
  return session.user.email;
}
