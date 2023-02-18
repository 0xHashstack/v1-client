import React, { useContext } from "react";
import { CardTitle, Col, Row, UncontrolledAccordion } from "reactstrap";
import { tokenDecimalsMap } from "../../../blockchain/stark-constants";
import { TabContext } from "../../../hooks/contextHooks/TabContext";

const SpendLoanData = ({ loan }) => {
  const { selectedLoan, setSelectedLoan } = useContext(TabContext);
  return (
    <div>
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
          onClick={() => setSelectedLoan(loan)}
          style={{
            // margin: "15px 1px 15px 10px",
            opacity: `${selectedLoan.loanId === loan.loanId ? "1" : "0.5"}`,
            alignItems: "center",
            gap: "50px",
          }}
        >
          <Col style={{ marginLeft: "-10px" }}>
            ID{loan.loanId}
          </Col>
          <Col style={{ marginLeft: "-10px" }}>
            <img src={`./${loan.loanMarket}.svg`} height="20px" />
            &nbsp;&nbsp;{loan.loanMarket}
          </Col>

          <Col className="mr-4 ">
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              {(loan.loanAmount/ 10 ** 18).toFixed(4)}
            </span>
            <div>
              <img src={`./${loan.loanMarket}.svg`} height="20px" />
              &nbsp;&nbsp;{loan.loanMarket}
            </div>
          </Col>

          <Col>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <img src={`./${loan.collateralMarket}.svg`} height="20px" />
            &nbsp;&nbsp;{loan.collateralMarket}
          </Col>

          <Col className="mr-4 ">
            <span
              style={{
                fontSize: "14px",
                fontWeight: "600",
                marginLeft: "20px",
              }}
            >
              {(loan.collateralAmount / 10 ** 18).toFixed(4)}
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
