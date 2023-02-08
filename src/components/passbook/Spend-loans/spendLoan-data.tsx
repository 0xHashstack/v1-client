import React from "react";
import { CardTitle, Col, Row, UncontrolledAccordion } from "reactstrap";

const SpendLoanData = () => {
  return (
    <div >
      <UncontrolledAccordion
        defaultOpen="0"
        open="false"
        style={{
          margin: "10px",
          color: "white",
          textAlign: "left",
          marginLeft: "70px",
        }}
      >
        <Row
          style={{
            // margin: "15px 1px 15px 10px",

            alignItems: "center",
            gap: "50px",
            
          }}
        >
          <Col style={{ marginLeft: "-10px" }}>
            <img src={`./usdt.svg`} height="20px" />
            &nbsp;&nbsp;USDT
          </Col>

          <Col className="mr-4 ">
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              10,325.553697
            </span>
            <div>
              <img src={`./usdt.svg`} height="20px" />
              &nbsp;&nbsp;USDT
            </div>
          </Col>

          <Col>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <img src={`./usdt.svg`} height="20px" />
            &nbsp;&nbsp;USDT
          </Col>

          <Col className="mr-4 ">
            <span
              style={{
                fontSize: "14px",
                fontWeight: "600",
                marginLeft: "20px",
              }}
            >
              10,325.553697
            </span>
            <div style={{ marginLeft: "20px" }}>
              <img src={`./usdt.svg`} height="20px" />
              &nbsp;&nbsp;USDT
            </div>
          </Col>
        </Row>
      </UncontrolledAccordion>
    </div>
  );
};

export default SpendLoanData;
