import "./header.scss";
import React from "react";
import Logo from "../logo";
import Navbar from "../nav/nav";

const Header = ({ ...props }: { currentRoute: string & any }) => {
  return (
    <div>
      <div className="d-flex">
        <div className="logo">
          <Logo />
        </div>

        <div className="header-text">
          <h1>
            Teesside <br />
            Hackspace
          </h1>
        </div>
      </div>
      <Navbar {...props} />
    </div>
  );
};

export default Header;
