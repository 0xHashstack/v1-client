import React, { useEffect, useState } from "react";
import { Col, Row, Table } from "reactstrap";
import SpendLoanData from "./spendLoan-data";

const SpendLoan = () => {
  return (
    <>
      {/* <UncontrolledAccordion
        defaultOpen="0"
        open="false"
        style={{
          width: "100%",
          // margin: "10px",

          color: "black",
          textAlign: "left",
        }}
      > */}
      <Table>
        {/* <Table className="table table-nowrap  mb-0"> */}
        <Row
          style={{
            // width: "92.77vw",

            color: "white",
            fontWeight: "600",
            alignItems: "center",
            gap: "60px",
            fontSize: "11px",
            backgroundColor: "black",
            textAlign: "left",
          }}
        >
          <Col
            style={{
              width: "10px",
              padding: "20px 10px",
              marginLeft: "70px",
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

      <SpendLoanData />
    </>
  );
};

export default SpendLoan;
