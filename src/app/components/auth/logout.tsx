"use client";
import React from "react";
import { getSession, signOut } from "next-auth/react";

const Logout = () => {
  async function logout() {
    const session = await getSession();
    const idToken = session?.id_token;
    await signOut({
      callbackUrl: "/api/auth/federated-logout?id_token_hint=" + idToken,
    });
  }

  return (
    <div className="d-flex">
      <a className="btn btn-outline-light" onClick={logout}>
        Logout
      </a>
    </div>
  );
};

export default Logout;
