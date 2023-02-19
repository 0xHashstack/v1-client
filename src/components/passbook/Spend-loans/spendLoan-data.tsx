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
          textAlign: "center",
          // marginLeft: "70px",
        }}
      >
        <Row
          onClick={() => {
            if (selectedLoan?.loanId != loan.loanId) {
              setSelectedLoan(loan);
            } else {
              setSelectedLoan("");
            }
          }}
          style={{
            opacity: `${selectedLoan?.loanId === loan.loanId ? "10" : "0.5"}`,
            alignItems: "center",
            marginLeft: "-40px",
            cursor: "pointer",
            padding: "20px 0",
            backgroundColor: `${
              selectedLoan?.loanId === loan.loanId ? "#1C202F40" : "#2A2E3F"
            }`,
            // gap: "30px",
          }}
        >
          <Col style={{ marginLeft: "-10px" }}>ID{loan.loanId}</Col>
          <Col style={{ marginLeft: "-10px" }}>
            <img src={`./${loan.loanMarket}.svg`} height="20px" />
            &nbsp;&nbsp;{loan.loanMarket}
          </Col>

          <Col className="mr-4 ">
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              {(loan.loanAmount / 10 ** 18).toFixed(4)}
            </span>
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
          </Col>
        </Row>
      </UncontrolledAccordion>
    </div>
  );
};

export default SpendLoanData;
