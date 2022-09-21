import React, { useState, useEffect } from "react";
import { Table } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
// import { txHistory } from "./passbook-history";
import { BNtoNum } from "../../blockchain/utils";
import BigNumber from "bignumber.js";

interface IHistoryData {
  txnId: string;
  timestamp: number;
  amount: string;
  action: string;
}

const historyData: IHistoryData[] = [
  {
    txnId: "0x2ab8028daf987d7c385270ae2dabd15b0cf77786260444d0300aae1add0284d",
    timestamp: 20,
    amount: "10000",
    action: "Withdraw",
  },

  {
    txnId: "0x07Ab78DF9a821343632a47Dea7a46f8D040f7a3Ac2f1bd6CA71cba1aC27c8425",
    timestamp: 5023423,
    amount: "20000",
    action: "NewDeposit",
  },
];

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
    setTxHistoryData(historyData);
    // txHistory(type, account, market, `comit_${commitment}`).then((res) => {
    //   setTxHistoryData(res);
    // });
  }, [type, account, market]);

  const renderTableData = () => {
    return (
      txHistoryData &&
      txHistoryData.map((row, index) => {
        const { txnId, timestamp, amount, action } = row;
        let myDate = new Date(timestamp * 1000);
        var formattedDate = myDate.toLocaleString();

        return (
          <tr
            key={index}
            // onClick={() => window.open(`https://testnet.bscscan.com/tx/${tsx}`)}
            style={{ cursor: "pointer" }}
          >
            <td>
              {txnId.substring(0, 10) +
                "..............." +
                txnId.substring(txnId.length - 11)}
            </td>
            <td>{action}</td>
            <td>{formattedDate}</td>
            <td>{parseFloat(BNtoNum(Number(amount))).toFixed(6)}</td>
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
