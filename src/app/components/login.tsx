import React from "react";
import { getSession } from "@auth0/nextjs-auth0";

const Login = async () => {
  const session = await getSession();

  const link = session?.user ? (
    <a className="btn btn-outline-light" href="/api/auth/logout">
      Logout
    </a>
  ) : (
    <a className="btn btn-outline-light" href="/api/auth/login">
      Login
    </a>
  );

  return <div className="d-flex">{link}</div>;
};

export default Login;
