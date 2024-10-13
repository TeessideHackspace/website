"use server";

import "./nav.scss";

import React, { PropsWithChildren } from "react";
import Link from "next/link";
import Login from "../auth/login";
import { getSession } from "../../api/auth/auth";
import Logout from "../auth/logout";
import AmIAtTheSpace from "../am-i-at-the-space";
type NavbarProps = {
  currentRoute: string;
};
const Navbar = async ({
  children,
  currentRoute,
  ...props
}: PropsWithChildren<NavbarProps>) => {
  const user = await getSession();
  const links = [
    { href: "/", label: "Home" },
    { href: "/organisation", label: "Organisation" },
    { href: "/members", label: "Membership" },
    { href: "https://chat.teessidehackspace.org.uk/", label: "Chat" },
    { href: "https://wiki.teessidehackspace.org.uk/", label: "Wiki" },
    { href: "/stats", label: "Stats" },
  ];
  function isActive(href: string) {
    return currentRoute === href;
  }
  return (
    <div className="navbar navbar-expand-lg navbar-dark mt-4 mb-4">
      <div className="container-fluid">
        <ul className="navbar-nav">
          <AmIAtTheSpace>
            <li
              key={`/kiosk`}
              className={isActive("/kiosk") ? "nav-item active" : "nav-item"}
            >
              <Link className="nav-link" href={"/kiosk"}>
                Kiosk
              </Link>
            </li>
          </AmIAtTheSpace>

          {links.map(({ href, label }) => (
            <li
              key={`${href}${label}`}
              className={isActive(href) ? "nav-item active" : "nav-item"}
            >
              <Link className="nav-link" href={href}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        {user ? <Logout /> : <Login />}
      </div>
    </div>
  );
};

export default Navbar;
