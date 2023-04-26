import React from "react";
import { NavLink } from "react-bootstrap";

const NavLinks = (props) => {
  return (
    <NavLink
      style={{
        cursor: "pointer",
        color: "black",

        borderRadius: "5px",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      }}
      className={classnames({
        active: customActiveTab === "3",
      })}
      onClick={() => {
        toggleCustom("3");
      }}
    >
      <span className="d-none d-sm-block">{props.children}</span>
    </NavLink>
  );
};

export default NavLinks;
