import React, { useEffect, useState } from "react";
import { Col, Row, Table, UncontrolledAccordion } from "reactstrap";
import { diamondAddress } from "../../../blockchain/stark-constants";
import TxHistoryTable from "../../dashboard/tx-history-table";
import useAddDeposit from "../../../blockchain/hooks/active-deposits/useAddDeposit";
import useWithdrawDeposit from "../../../blockchain/hooks/active-deposits/useWithdrawDeposit";
import ActiveDeposit from "./active-deposts/active-deposit";
import OffchainAPI from "../../../services/offchainapi.service";

const ActiveDepositsTab = ({
  activeDepositsData,
  modal_add_active_deposit,
  tog_add_active_deposit,
  modal_withdraw_active_deposit,
  tog_withdraw_active_deposit,
  depositRequestSel,
  setInputVal1,
  handleDepositTransactionDone,
  withdrawDepositTransactionDone,
  isTransactionDone,

  inputVal1,
}: {
  activeDepositsData: any;
  modal_add_active_deposit: any;
  tog_add_active_deposit: any;
  modal_withdraw_active_deposit: any;
  tog_withdraw_active_deposit: any;
  depositRequestSel: any;
  setInputVal1: any;
  handleDepositTransactionDone: any;
  withdrawDepositTransactionDone: any;
  isTransactionDone: any;
  inputVal1: any;
}) => {
  const [historicalAPRs, setHistoricalAPRs] = useState();
  useEffect(() => {
    OffchainAPI.getHistoricalDepositRates().then((val) => {
      setHistoricalAPRs(val);
    });
  }, []);
  return (
    // Active Deposits
    <div style={{ borderTop: "5px" }}>
      <UncontrolledAccordion
        defaultOpen="0"
        open="false"
        style={{
          margin: "10px",
          color: "black",
          // width: "85vw",
          textAlign: "left",
        }}
      >
        <Table>
          {/* <Table className="table table-nowrap  mb-0"> */}
          <Row
            style={{
              borderStyle: "hidden",
              color: "black",
              fontWeight: "500",
              marginLeft: "5px",
            }}
          >
            <Col
              style={{
                width: "10px",
                padding: "20px 10px",
              }}
            >
              Supply ID
            </Col>
            <Col
              style={{
                width: "100px",
                padding: "20px 10px",
              }}
            >
              Market
            </Col>
            <Col style={{ width: "100px", padding: "20px 10px" }}>
              Supply Amount
            </Col>
            <Col scope="col" style={{ width: "100px", padding: "20px 10px" }}>
              APR
            </Col>
            <Col scope="col" style={{ width: "100px", padding: "20px 10px" }}>
              MCP
            </Col>
            <Col scope="col" style={{ width: "100px", padding: "20px 10px" }}>
              Status
            </Col>

            <Col scope="col" style={{ width: "100px", padding: "20px 20px" }}>
              Actions
            </Col>
          </Row>
          {/* </Table> */}
        </Table>

        {Array.isArray(activeDepositsData) && activeDepositsData.length > 0 ? (
          activeDepositsData.map((asset, key) => {
            return (
              <ActiveDeposit
                key={key}
                asset={asset}
                modal_add_active_deposit={modal_add_active_deposit}
                tog_add_active_deposit={tog_add_active_deposit}
                modal_withdraw_active_deposit={modal_withdraw_active_deposit}
                tog_withdraw_active_deposit={tog_withdraw_active_deposit}
                depositRequestSel={depositRequestSel}
                withdrawDepositTransactionDone={withdrawDepositTransactionDone}
                historicalAPRs={historicalAPRs}
              />
            );
          })
        ) : (
          <Table>
            <tbody>
              <tr>
                <td colSpan={5}>No Records Found.</td>
              </tr>
            </tbody>
          </Table>
        )}
      </UncontrolledAccordion>
    </div>
  );
};

export default ActiveDepositsTab;
