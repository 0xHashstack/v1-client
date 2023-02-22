import React, { useContext, useEffect, useState } from "react";
import { Col, Row, TabContent, Table } from "reactstrap";
import { TabContext } from "../../../hooks/contextHooks/TabContext";
import SpendLoanData from "./spendLoan-data";

const SpendLoan = ({ activeLoansData }: { activeLoansData: any }) => {
  const { selectedLoan, setSelectedLoan } = useContext(TabContext);

  return (
    <>
      <Table style={{ backgroundColor: "rgb(42, 46, 63)",position:'absolute',zIndex:'2',width:'99%',top:"-9px"}}>
        <Row
          onClick={() => {
            setSelectedLoan("");
          }}
          style={{
            marginLeft: "50px",
            width: "96%",
            zIndex: "1000",
            // position: "absolute",
            color: "rgb(140, 140, 140)",
            fontWeight: "300",
            alignItems: "center",
            fontSize: "14px",
            backgroundColor: "#2A2E3F",
            textAlign: "left",
            gap:'50px'
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

      <div style={{ marginTop: "60px" }}>
        {activeLoansData.map((loan: any, index: number) => {
          return (
            <div key={index}>
              <SpendLoanData loan={loan} />
            </div>
          );
        })}
      </div>

      {/* <SpendLoanData /> */}
    </>
  );
};

export default SpendLoan;
