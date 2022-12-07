import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
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
      console.log(val);
    });
  }, []);
  return (
    // Active Deposits
    <div className="table-responsive mt-3" style={{ overflow: "hidden" }}>
      <Table className="table table-nowrap align-middle mb-0 mr-2">
        <thead className="mb-3">
          <tr>
            <th scope="row" colSpan={2}>
              &nbsp; &nbsp; &nbsp; Deposit Amount
            </th>
            <th scope="row" colSpan={2}>
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
              &nbsp;Deposit Interest
            </th>
            <th scope="row" colSpan={2}>
              &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
              &nbsp;Deposit Balance&nbsp;&nbsp; &nbsp;
            </th>
            <th scope="row" colSpan={2}>
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;
              Deposit Commitment
            </th>
          </tr>
        </thead>
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
    </div>
  );
};

export default ActiveDepositsTab;
