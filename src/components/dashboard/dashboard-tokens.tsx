import { useEffect, useState } from "react";
import useBorrowAPR from "../../blockchain/hooks/aprs/useBorrowAPR";
import useSavingsAPR from "../../blockchain/hooks/aprs/useSavingsAPR";
import useDeposit from "../../blockchain/hooks/useDeposit";
import {
  getTokenFromAddress,
  getTokenFromName,
  tokenAddressMap,
} from "../../blockchain/stark-constants";
import Image from "next/image";
import tickMark from "../../assets/images/tickMark.svg";
import OffchainAPI from "../../services/offchainapi.service";
import Borrow from "../borrow";
import Deposit from "../deposit";
import MySpinner from "../mySpinner";
import { ICoin } from "./dashboard-body";

const DashboardTokens = ({
  coin,
  idx,
  borrowCommitment,
  depositCommitment,
  depositLoanRates,
}: {
  coin: ICoin;
  idx: number;
  borrowCommitment: string;
  depositCommitment: string;
  depositLoanRates: any;
}) => {
  useEffect(() => {
    console.log(
      `%c Protocol deposit ${depositCommitment} ${borrowCommitment} ${coin.name}`,
      "background: #222; color: #bada55"
    );
  });

  return (
    <tr
      key={idx}
      style={{
        backgroundColor: "#2A2E3F",
        color: "white",
        borderBottom: "2px solid #D6D6D650",
        height: "80px",
      }}
    >
      <th style={{ padding: "28px 2px" }}>
        {" "}
        {coin.name === "BTC" ? (
          <Image src={tickMark} width="20px" height="20px" />
        ) : (
          <></>
        )}
      </th>
      <th scope="row" style={{ padding: "25px 5px" }}>
        <div className="d-flex align-items-center">
          <div className="avatar-xs me-3">
            <img
              src={`./${coin.name}.svg`}
              width="20px"
              height="20px"
              style={{ marginTop: "5px" }}
            ></img>
          </div>
          <span style={{ marginLeft: "-15px" }}>{coin.name}</span>
        </div>
      </th>
      <td style={{ padding: "31px 10px" }}>0000</td>
      <td style={{ padding: "31px 10px" }}>0000</td>
      <td style={{ padding: "31px 10px" }}>00000</td>
      <td style={{ padding: "31px 10px" }}>0000</td>
      <td style={{ padding: "31px", textAlign: "center" }}>
        <div>
          {/* {deposit ? deposit[0].apr.toNumber() / 100 : "NaN"}% */}

          {/* {depositLoanRates && parseInt(depositCommitment) < 4 ? (
            `${
              parseFloat(
                depositLoanRates[
                  `${getTokenFromName(coin.name).address}__${depositCommitment}`
                ]?.depositAPR.apr100x
              ) / 100
            } %`
          ) : (
            <MySpinner />
          )} */}
        </div>
      </td>
      <td style={{ padding: "31px", textAlign: "center" }}>
        <div>
          {/* {borrow ? borrow[0].apr.toNumber() / 100 : "NaN"}% */}
          {depositLoanRates && parseInt(borrowCommitment) < 2 ? (
            `${
              parseFloat(
                depositLoanRates[
                  `${getTokenFromName(coin.name).address}__${borrowCommitment}`
                ]?.borrowAPR?.apr100x
              ) / 100 || '0'
            }%`
          ) : (
            <MySpinner />
          )}
        </div>
      </td>
      <td style={{ width: "120px", padding: "25px 20px" }}>
        <Deposit asset={coin.name} />
      </td>
      <td style={{ width: "120px", padding: "25px 20px" }}>
        <Borrow asset={coin.name} title={coin.name} />
      </td>
    </tr>
  );
};
export default DashboardTokens;
