import React, { useContext, useEffect, useState } from "react";
import { Col, Row, TabContent, Table } from "reactstrap";
import { TabContext } from "../../../hooks/contextHooks/TabContext";
import SpendLoanData from "./spendLoan-data";

const SpendLoan = ({ activeLoansData }) => {
  const { selectedLoan, setSelectedLoan } = useContext(TabContext);

  return (
    <>
      <Table>
        <Row
          onClick={() => {
            setSelectedLoan("");
          }}
          style={{
            color: "rgb(140, 140, 140)",
            fontWeight: "600",
            alignItems: "center",
            fontSize: "11px",
            backgroundColor: "rgb(42, 46, 63)",
            textAlign: "center",
            marginLeft: "-40px",
          }}
        >
          <Col
            style={{
              // width: "10px",
              padding: "20px 10px",

              // marginLeft: "70px",
            }}
          >
            Borrow ID
          </Col>
          <Col
            style={{
              width: "10px",
              padding: "20px 10px",
              // marginLeft: "70px",
            }}
          >
            Borrow Market
          </Col>
          <Col
            style={{
              width: "100px",
              padding: "20px 10px",
            }}
          >
            Available borrow amount
          </Col>
          <Col style={{ width: "100px", padding: "20px 10px" }}>
            Collateral market
          </Col>
          <Col scope="col" style={{ width: "100px", padding: "20px 10px" }}>
            Collateral amount
          </Col>
        </Row>
        {/* </Table> */}
      </Table>

      {activeLoansData.map((loan, index) => {
        return (
          <div key={index}>
            <SpendLoanData loan={loan} />
          </div>
        );
      })}

      {/* <SpendLoanData /> */}
    </>
  );
};

export default SpendLoan;
