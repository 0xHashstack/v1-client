import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Form,
  Input,
  Table,
  Nav,
  NavItem,
  NavLink,
  Spinner,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  UncontrolledAccordion,
  CardTitle,
  CardSubtitle,
} from "reactstrap";
import classnames from "classnames";
import Image from "next/image";

import arrowDown from "../../assets/images/arrowDown.svg";

const DashboardLiquid = ({
  customActiveTab,
  toggleCustom,
  account,
}: {
  customActiveTab: any;
  toggleCustom: (tab: any) => void;
  account: string;
}) => {
  return (
    <Col xl="7">
      <Nav
        tabs
        className="nav-tabs-custom"
        style={{ borderBottom: "0px", gap: "10px" }}
      >
        <NavItem>
          <NavLink
            style={{
              cursor: "pointer",
              color: "black",
              border: "1px solid #000",
              borderRadius: "5px",
            }}
            className={classnames({
              active: customActiveTab === "1",
            })}
            onClick={() => {
              toggleCustom("1");
            }}
          >
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <Image
                  // onClick={toggleBorrowDropdown}
                  style={{
                    rotate: "90deg",
                    cursor: "pointer",
                    // marginLeft: "-7px",
                  }}
                  src={arrowDown}
                  alt="Picture of the author"
                  width="18px"
                  height="18px"
                  // style={{ rotate: "90" }}
                />
                <div>Back</div>
              </div>
          </NavLink>
        </NavItem>
        {account ? (
          <>
            <NavItem>
              <NavLink
                style={{
                  cursor: "pointer",
                  color: "white",
                  border: "1px solid #000",
                  borderRadius: "5px",
                  backgroundColor:"black",
                  fontWeight:"350px"
                }}
                className={classnames({
                  active: customActiveTab === "6",
                })}
                onClick={() => {
                  toggleCustom("6");
                }}
              >
                <span className="d-none d-sm-block">Liquidate</span>
              </NavLink>
            </NavItem>
          </>
        ) : null}
      </Nav>
    </Col>
  );
};

export default DashboardLiquid;
