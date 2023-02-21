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
  oraclePriceForCoin,
  fairPriceForCoin,
  reserves,
}: {
  coin: ICoin;
  idx: number;
  borrowCommitment: string;
  depositCommitment: string;
  depositLoanRates: any;
  oraclePriceForCoin: any;
  fairPriceForCoin: any;
  reserves: any;
}) => {
  useEffect(() => {
    console.log(
      `%c Protocol deposit ${depositCommitment} ${borrowCommitment} ${coin.name}`,
      "background: #222; color: #bada55"
    );
  }, []);

  console.log("reserves", reserves);

  return (
    <>
      <tr
        key={idx}
        style={{
          backgroundColor: "#2A2E3F",
          color: "white",
          height: "80px",
          borderBottom: "1.5px solid #252335",
          textAlign: "center",
        }}
      >
        <th>
          {" "}
          {coin.name === "BTC" ? (
            <Image
              src={tickMark}
              width="20px"
              height="20px"
              alt="dropdown tick"
            />
          ) : (
            <></>
          )}
        </th>
        <th scope="row" style={{ padding: "25px 5px", textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>
              <Image
                alt="token"
                src={`/${coin.name}.svg`}
                width="20px"
                height="20px"
                style={{ marginTop: "5px" }}
              ></Image>
              &nbsp;&nbsp;&nbsp;
            </div>
            <span style={{}}>{coin.name}</span>
          </div>
        </th>
        <td style={{ padding: "31px 10px" }}>{oraclePriceForCoin || "N/A"}</td>
        <td style={{ padding: "31px 10px" }}>{fairPriceForCoin || "N/A"}</td>
        <td style={{ padding: "31px 10px" }}>
          {reserves?.deposits?.[coin.name] ?? "N/A"}
        </td>
        <td style={{ padding: "31px 10px" }}>
          {reserves?.loans?.[coin.name] ?? "N/A"}
        </td>
        <td style={{ padding: "31px", textAlign: "center" }}>
          <div>
            {/* {deposit ? deposit[0].apr.toNumber() / 100 : "NaN"}% */}

            {depositLoanRates && parseInt(depositCommitment) < 4 ? (
              `${
                parseFloat(
                  depositLoanRates[
                    `${
                      getTokenFromName(coin.name)?.address
                    }__${depositCommitment}`
                  ]?.depositAPR.apr100x
                ) / 100
              } %`
            ) : (
              <MySpinner />
            )}
          </div>
        </td>
        <td style={{ padding: "31px", textAlign: "center" }}>
          <div>
            {/* {borrow ? borrow[0].apr.toNumber() / 100 : "NaN"}% */}
            {depositLoanRates && parseInt(borrowCommitment) < 2 ? (
              `${
                parseFloat(
                  depositLoanRates[
                    `${
                      getTokenFromName(coin.name)?.address
                    }__${borrowCommitment}`
                  ]?.borrowAPR?.apr100x
                ) / 100
              }%`
            ) : (
              <MySpinner />
            )}
          </div>
        </td>
        <td style={{ width: "120px", padding: "25px 20px" }}>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "40px" }}
          >
            <Deposit asset={coin.name} depositLoanRates={depositLoanRates} />
            <Borrow
              asset={coin.name}
              title={coin.name}
              depositLoanRates={depositLoanRates}
            />
          </div>
        </td>
        {/* <td style={{ width: "120px", padding: "25px 20px" }}>
          <Borrow
            asset={coin.name}
            title={coin.name}
            depositLoanRates={depositLoanRates}
          />
        </td> */}
      </tr>
    </>
  );
};
export default DashboardTokens;
