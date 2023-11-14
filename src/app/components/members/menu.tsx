"use server";

import "./menu.scss";

import React, { PropsWithChildren } from "react";
import Link from "next/link";
import AmIAtTheSpace from "../am-i-at-the-space";
type NavbarProps = {
  currentRoute: string;
};
const MembersMenu = async ({
  children,
  currentRoute,
  ...props
}: PropsWithChildren<NavbarProps>) => {
  const links = [
    { href: "/members/account", label: "Account" },
    { href: "/members/rfid", label: "Manage RFID Keyfobs" },
  ];
  function isActive(href: string) {
    return currentRoute === href;
  }
  return (
    <AmIAtTheSpace>
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
        </div>
      </div>
    </AmIAtTheSpace>
  );
};

export default MembersMenu;
