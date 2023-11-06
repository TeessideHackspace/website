"use client";
import React from "react";
import { signIn } from "next-auth/react";

const Login = () => {
  return (
    <div className="d-flex">
      {" "}
      <a className="btn btn-outline-light" onClick={() => signIn("keycloak")}>
        Login
      </a>
    </div>
  );
};

export default Login;
