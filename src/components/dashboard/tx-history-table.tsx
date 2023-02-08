import React, { useState, useEffect } from "react";
import { Table } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
// import { txHistory } from "./passbook-history";
import { BNtoNum } from "../../blockchain/utils";
import BigNumber from "bignumber.js";
import OffchainAPI from "../../services/offchainapi.service";
import { useStarknet } from "@starknet-react/core";
import { number } from "starknet";
import { UseTransactionReceiptResult } from "@starknet-react/core";
import { toast } from "react-toastify";
import MySpinner from "../mySpinner";

interface IHistoryData {
  txnHash: string;
  actionType: string;
  date: string;
  value: string;
  id: number;
}

const TxHistoryTable = ({
  asset,
  type,
  market,
  observables,
}: {
  asset: any;
  type: string;
  market: string;
  observables?: UseTransactionReceiptResult[];
}) => {
  // const { account, commitment } = asset;
  // const [txHistoryData, setTxHistoryData] = useState<IHistoryData[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [lookingForTxs, setLookingForTxs] = useState<{
  //   [key: string]: boolean;
  // }>({});

  // async function refreshHistory() {
  //   setLoading(true);
  //   let events: IHistoryData[] = [];
  //   try {
  //     if (type === "deposits") {
  //       events = await OffchainAPI.getTransactionEventsActiveDeposits(
  //         number.toHex(number.toBN(number.toFelt(account || ""))),
  //         market
  //       );
  //       console.log("tx history:", events);
  //     } else if (type === "loans") {
  //       events = await OffchainAPI.getTransactionEventsActiveLoans(
  //         number.toHex(number.toBN(number.toFelt(account || ""))),
  //         market
  //       );
  //     } else if (type === "repaid") {
  //       events = await OffchainAPI.getTransactionEventsRepaid(
  //         number.toHex(number.toBN(number.toFelt(account || ""))),
  //         market
  //       );
  //     }
  //     console.log("history", type, events);
  //     setTxHistoryData(events);
  //     setLoading(false);
  //   } catch (err) {
  //     console.log("error fetch history", err);
  //     toast.error("Could not fetch history");
  //     setLoading(false);
  //   }
  // }

  // function hasTx(tx: string) {
  //   console.log("history: check for tx", tx);
  //   for (let i = 0; i < txHistoryData.length; ++i) {
  //     let history = txHistoryData[i];
  //     console.log("historymatch", history.txnHash, tx, history.txnHash == tx);
  //     if (history.txnHash == tx) return true;
  //   }
  //   return false;
  // }

  // useEffect(() => {
  //   console.log("history: lookingForTxs change", lookingForTxs);
  // }, [lookingForTxs]);

  // async function lookForTransaction(tx: string, retry = 0) {
  //   console.log("history: lookForTransaction", lookingForTxs, { retry });
  //   if (lookingForTxs[tx]) return;
  //   if (Object.keys(lookingForTxs).includes(tx) && retry == 0) {
  //     return;
  //   }
  //   if (lookingForTxs[tx] == undefined) {
  //     let _txMap: any = {};
  //     _txMap[tx] = false;
  //     setLookingForTxs({ ...lookingForTxs, ..._txMap });
  //   }

  //   await refreshHistory();
  //   setTimeout(() => {
  //     if (!lookingForTxs[tx]) lookForTransaction(tx, retry + 1);
  //   }, 5000);
  // }

  // useEffect(() => {
  //   // const _account = ;
  //   console.log(type);
  //   refreshHistory();
  // }, [type, account, market]);

  // useEffect(() => {
  //   if (observables) {
  //     for (let i = 0; i < observables?.length; ++i) {
  //       let observable = observables[i];
  //       let status = observable.data?.status;
  //       let hash = observable.data?.transaction_hash;
  //       if (hash && (status == "PENDING" || status == "ACCEPTED_ON_L2")) {
  //         lookForTransaction(hash);
  //       }
  //     }
  //   }
  // }, [observables]);

  // useEffect(() => {
  //   let _lookup = { ...lookingForTxs };
  //   for (let i = 0; i < txHistoryData.length; ++i) {
  //     let history = txHistoryData[i];
  //     _lookup[history.txnHash] = true;
  //   }
  //   setLookingForTxs(_lookup);
  // }, [txHistoryData]);

  // const renderTableData = () => {
  //   console.log("renderTableDat:", txHistoryData);
  //   return (
  //     txHistoryData &&
  //     txHistoryData
  //       .filter((txEntry) => {
  //         console.log(txEntry, asset, txEntry.id === asset.loanId, txEntry);
  //         if (type === "deposits") {
  //           return txEntry.id === asset.depositId;
  //         } else if (type === "loans") {
  //           return txEntry.id === asset.loanId;
  //         } else {
  //           return txEntry.id === asset.loanId;
  //         }
  //       })
  //       .sort((a: IHistoryData, b: IHistoryData) => {
  //         const dateA = new Date(a.date);
  //         const dateB = new Date(b.date);
  //         return dateA - dateB;
  //       })
  //       .map((row, index) => {
  //         const { txnHash, actionType, date, value } = row;
  //         let myDate = new Date(date);
  //         let formattedDate = myDate.toLocaleString();

  //         let formattedValue = new BigNumber(value);

  //         return (
  //           <tr
  //             key={index}
  //             onClick={() =>
  //               window.open(`https://testnet.starkscan.co/tx/${txnHash}`)
  //             }
  //             style={{ cursor: "pointer" }}
  //           >
  //             <td>
  //               {txnHash.substring(0, 10) +
  //                 "..............." +
  //                 txnHash.substring(txnHash.length - 11)}
  //             </td>
  //             <td>{actionType}</td>
  //             <td>{formattedDate}</td>
  //             <td style={{ textAlign: "center" }}>
  //               {value == "all"
  //                 ? "100%"
  //                 : BNtoNum(formattedValue.toNumber(), 18)}
  //             </td>
  //           </tr>
  //         );
  //       })
  //   );
  // };
  // // console.log(asset, type, market, observables);
  // // console.log(asset.depositId);

  // return (
  //   <div className="table-responsive">
  //     <Table className="table table-nowrap align-middle mb-0 mr-2 ">
  //       <thead>
  //         <tr>
  //           <th>Transaction Hash</th>
  //           <th>Action Type</th>
  //           <th>Date</th>
  //           <th>Amount In Protocol</th>
  //         </tr>
  //       </thead>
  //       <tbody>{renderTableData()}</tbody>
  //     </Table>
  //     <div style={{ padding: "10px", textAlign: "center", width: "100%" }}>
  //       {loading && !Object.keys(lookingForTxs).length ? (
  //         <MySpinner />
  //       ) : (
  //         <span></span>
  //       )}
  //       {Object.keys(lookingForTxs)
  //         .filter((tx) => lookingForTxs[tx] == false)
  //         .map((tx) => {
  //           let len = tx.length;
  //           return (
  //             <MySpinner
  //               key={tx}
  //               text={`Waiting for ${tx.substring(0, 4)}...${tx.substring(
  //                 len - 4,
  //                 len
  //               )} (~ 1 min)`}
  //             />
  //           );
  //         })}
  //     </div>
  //   </div>
  // );
  return <span></span>
};

export default TxHistoryTable;
