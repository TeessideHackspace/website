import React from "react";
import { getUser } from "../utils/session";

const Login = async () => {
  const userId = await getUser();

  const link = userId ? (
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
