import "./nav.scss";

import React, { PropsWithChildren } from "react";
import Link from "next/link";
import Login from "../login";
type NavbarProps = {
  currentRoute: string;
};
const Navbar = ({
  children,
  currentRoute,
  ...props
}: PropsWithChildren<NavbarProps>) => {
  const links = [
    { href: "/", label: "Home" },
    { href: "/organisation", label: "Organisation" },
    { href: "/members", label: "Membership" },
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
        <Login />
      </div>
    </div>
  );
};

export default Navbar;
