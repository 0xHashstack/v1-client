import React, { useState, useEffect } from "react";
import { Table } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
// import { txHistory } from "./passbook-history";
import { BNtoNum } from "../../blockchain/utils";
import BigNumber from "bignumber.js";
import OffchainAPI from "../../services/offchainapi.service";
import { useStarknet } from "@starknet-react/core";
import { number } from "starknet";

interface IHistoryData {
  txnHash: string;
  actionType: string;
  date: string;
  value: string;
}

const TxHistoryTable = ({
  asset,
  type,
  market,
  isTrasactionDone,
}: {
  asset: any;
  type: string;
  market: string;
  isTrasactionDone: boolean;
}) => {
  const { account, commitment } = asset;
  const [txHistoryData, setTxHistoryData] = useState<IHistoryData[]>([]);

  useEffect(() => {
    // const _account = ;
    OffchainAPI.getTransactionEvents(
      number.toHex(number.toBN(number.toFelt(account || "")))
    ).then((events) => {
      setTxHistoryData(events);
    });

    // txHistory(type, account, market, `comit_${commitment}`).then((res) => {
    //   setTxHistoryData(res);
    // });
  }, [type, account, market]);

  const renderTableData = () => {
    return (
      txHistoryData &&
      txHistoryData.map((row, index) => {
        const { txnHash, actionType, date, value } = row;
        let myDate = new Date(date);
        let formattedDate = myDate.toLocaleString();

        let formattedValue = new BigNumber(value);

        return (
          <tr
            key={index}
            // onClick={() => window.open(`https://testnet.bscscan.com/tx/${tsx}`)}
            style={{ cursor: "pointer" }}
          >
            <td>
              {txnHash.substring(0, 10) +
                "..............." +
                txnHash.substring(txnHash.length - 11)}
            </td>
            <td>{actionType}</td>
            <td>{formattedDate}</td>
            <td>{BNtoNum(formattedValue.toNumber(), 18)}</td>
          </tr>
        );
      })
    );
  };

  return (
    <div className="table-responsive">
      <Table className="table table-nowrap align-middle mb-0 mr-2 ">
        <thead>
          <tr>
            <th>Transaction Hash</th>
            <th>Action Type</th>
            <th>Date</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>{renderTableData()}</tbody>
      </Table>
    </div>
  );
};

export default TxHistoryTable;
