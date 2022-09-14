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

const DashboardMenu = ({
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
      <Nav tabs className="nav-tabs-custom" style={{ borderBottom: "0px" }}>
        <NavItem>
          <NavLink
            style={{ cursor: "pointer", color: "white" }}
            className={classnames({
              active: customActiveTab === "1",
            })}
            onClick={() => {
              toggleCustom("1");
            }}
          >
            <span className="d-none d-sm-block">Dashboard</span>
          </NavLink>
        </NavItem>
        {account ? (
          <>
            <NavItem>
              <NavLink
                style={{ cursor: "pointer", color: "white" }}
                className={classnames({
                  active: customActiveTab === "2",
                })}
                onClick={() => {
                  toggleCustom("2");
                }}
              >
                <span className="d-none d-sm-block">Passbook</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={{ cursor: "pointer", color: "white" }}
                className={classnames({
                  active: customActiveTab === "3",
                })}
                onClick={() => {
                  toggleCustom("3");
                }}
              >
                <span className="d-none d-sm-block">Liquidation</span>
              </NavLink>
            </NavItem>
          </>
        ) : null}
      </Nav>
    </Col>
  );
};

export default DashboardMenu;
