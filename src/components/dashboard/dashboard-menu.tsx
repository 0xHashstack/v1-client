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

import arrowDown from "../../assets/images/ArrowDownDark.svg";

const DashboardMenu = ({
  margin,
  customActiveTab,
  toggleCustom,
  account,
}: {
  margin: string;
  customActiveTab: any;
  toggleCustom: (tab: any) => void;
  account: string;
}) => {
  return (
    <Col>
      <Nav
        tabs
        className="nav-tabs-custom"
        style={{
          borderBottom: "0px",
          gap: "10px",
          margin: `20px ${margin}`,
        }}
      >
        <NavItem>
          <NavLink
            style={{
              cursor: "pointer",
              color: "black",
              border: "1px solid #000",
              borderRadius: "5px",
              boxShadow: "rgba(0, 0, 0, 0.5) 2.4px 2.4px 3.2px",
            }}
            className={classnames({
              active: customActiveTab === "1",
            })}
            onClick={() => {
              toggleCustom("1");
            }}
          >
            {customActiveTab === "1" ? (
              <span className="d-none d-sm-block">Market</span>
            ) : (
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
            )}
          </NavLink>
        </NavItem>
        {account ? (
          <>
            <NavItem>
              <NavLink
                style={{
                  cursor: "pointer",
                  color: "black",
                  border: "1px solid #000",
                  borderRadius: "5px",
                  boxShadow: "rgba(0, 0, 0, 0.5) 2.4px 2.4px 3.2px",
                }}
                className={classnames({
                  active: customActiveTab === "2",
                })}
                onClick={() => {
                  toggleCustom("2");
                }}
              >
                <span className="d-none d-sm-block">Spend Borrow</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={{
                  cursor: "pointer",
                  color: "black",
                  border: "1px solid #000",
                  borderRadius: "5px",
                  boxShadow: "rgba(0, 0, 0, 0.5) 2.4px 2.4px 3.2px",
                }}
                className={classnames({
                  active: customActiveTab === "3",
                })}
                onClick={() => {
                  toggleCustom("3");
                }}
              >
                <span className="d-none d-sm-block">Your Supply</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={{
                  cursor: "pointer",
                  color: "black",
                  border: "1px solid #000",
                  borderRadius: "5px",
                  boxShadow: "rgba(0, 0, 0, 0.5) 2.4px 2.4px 3.2px",
                }}
                className={classnames({
                  active: customActiveTab === "4",
                })}
                onClick={() => {
                  toggleCustom("4");
                }}
              >
                <span className="d-none d-sm-block">Your Borrow</span>
              </NavLink>
            </NavItem>
          </>
        ) : null}
      </Nav>
    </Col>
  );
};

export default DashboardMenu;
