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

const PassbookMenu = ({
  account,
  customActiveTabs,
  toggleCustoms,
}: {
  account: string;
  customActiveTabs: string;
  toggleCustoms: (tab: any) => void;
}) => {
  return (
    <Nav tabs className="nav-tabs-custom" align="right">
      {/* <NavItem>
                            <NavLink
                              style={{ cursor: "pointer" }}
                              className={classnames({
                                active: customActiveTabs === "0",
                              })}
                              onClick={() => {
                                toggleCustoms("0")
                              }}
                            >
                              <span className="d-none d-sm-block">All</span>
                            </NavLink>
                          </NavItem> */}
      {account ? (
        <>
          <NavItem>
            <NavLink
              style={{
                cursor: "pointer",
                color: "white",
              }}
              className={classnames({
                active: customActiveTabs === "1",
              })}
              onClick={() => {
                toggleCustoms("1");
              }}
            >
              <span className="d-none d-sm-block">Active Deposits</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              style={{
                cursor: "pointer",
                color: "white",
              }}
              className={classnames({
                active: customActiveTabs === "2",
              })}
              onClick={() => {
                toggleCustoms("2");
              }}
            >
              <span className="d-none d-sm-block">Active Loans</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              style={{
                cursor: "pointer",
                color: "white",
              }}
              className={classnames({
                active: customActiveTabs === "3",
              })}
              onClick={() => {
                toggleCustoms("3");
              }}
            >
              <span className="d-none d-sm-block">Repaid Loans</span>
            </NavLink>
          </NavItem>
        </>
      ) : null}
    </Nav>
  );
};

export default PassbookMenu;
