"use client";
import React from "react";

const Logout = () => {
  return (
    <div className="d-flex">
      {" "}
      <a
        className="btn btn-outline-light"
        onClick={() => (window.location.href = `/api/auth/federated-logout`)}
      >
        Logout
      </a>
    </div>
  );
};

export default Logout;
