import React from "react";
import Link from "next/link";
import { getSession } from "@auth0/nextjs-auth0";

const Login = async () => {
  const session = await getSession();

  const link = session?.user ? (
    <Link className="btn btn-outline-light" href="/api/auth/logout">
      Logout
    </Link>
  ) : (
    <Link className="btn btn-outline-light" href="/api/auth/login">
      Login
    </Link>
  );

  return <div className="d-flex">{link}</div>;
};

export default Login;
