import { useEffect, useState } from "react";
import useBorrowAPR from "../../blockchain/hooks/aprs/useBorrowAPR";
import useSavingsAPR from "../../blockchain/hooks/aprs/useSavingsAPR";
import useDeposit from "../../blockchain/hooks/useDeposit";
import {
  ERC20Abi,
  getTokenFromAddress,
  getTokenFromName,
  tokenAddressMap,
  tokenDecimalsMap,
} from "../../blockchain/stark-constants";
import Image from "next/image";
import tickMark from "../../assets/images/tickMark.svg";
import OffchainAPI from "../../services/offchainapi.service";
import Borrow from "../borrow";
import Deposit from "../deposit";
import MySpinner from "../mySpinner";
import { ICoin } from "./dashboard-body";
import { useAccount, useContract, useStarknetCall } from "@starknet-react/core";
import { Abi, uint256 } from "starknet";

const DashboardTokens = ({
  coin,
  idx,
  borrowCommitment,
  depositCommitment,
  depositLoanRates,
  oraclePriceForCoin,
  fairPriceForCoin,
  reserves,
  fairPriceArray,
}: {
  coin: ICoin;
  idx: number;
  borrowCommitment: string;
  depositCommitment: string;
  depositLoanRates: any;
  oraclePriceForCoin: any;
  fairPriceForCoin: any;
  reserves: any;
  fairPriceArray: any;
}) => {
  useEffect(() => {
    console.log(
      `%c Protocol deposit ${depositCommitment} ${borrowCommitment} ${coin.symbol}`,
      "background: #222; color: #bada55"
    );
  }, []);

  const { contract } = useContract({
    abi: ERC20Abi as Abi,
    address: tokenAddressMap[coin.name] as string,
  });

  const { account, address: accountAddress, status } = useAccount();

  const {
    data: dataBalance,
    loading: loadingBalance,
    error: errorBalance,
    refresh: refreshBalance,
  } = useStarknetCall({
    contract: contract,
    method: "balanceOf",
    args: [accountAddress],
    options: {
      watch: true,
    },
  });

  return (
    <tr
      key={idx}
      style={{
        backgroundColor: "#2A2E3F",
        color: "white",
        height: "20px",
        borderBottom:
          coin.symbol === "DAI" ? "1px solid #2A2E3F" : "1px solid #252335",
        textAlign: "left",
      }}
    >
      <th scope="row" style={{ padding: "25px 5px", textAlign: "center" }}>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
              padding: "0 40px",
            }}
          >
            <div>
              <Image
                alt="token"
                src={`/${coin.name}.svg`}
                width="15px"
                height="15px"
                style={{ marginTop: "5px" }}
              ></Image>
              &nbsp;&nbsp;&nbsp;
            </div>
            <span style={{ textAlign: "left", marginTop: "7px" }}>
              {coin.symbol}
              <div
                style={{
                  fontSize: "9px",
                  color: "#8C8C8C",
                  width: "60px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Wallet Bal &nbsp;
                {dataBalance ? (
                  (
                    Number(uint256.uint256ToBN(dataBalance[0])) /
                    10 ** (tokenDecimalsMap[coin.name] || 18)
                  ).toFixed(4)
                ) : (
                  <MySpinner />
                )}
              </div>
            </span>
          </div>
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
          {depositLoanRates && parseInt(borrowCommitment) < 2 ? (
            `${
              parseFloat(
                depositLoanRates[
                  `${getTokenFromName(coin.name)?.address}__${borrowCommitment}`
                ]?.borrowAPR?.apr100x
              ) / 100
            }%`
          ) : (
            <MySpinner />
          )}
        </div>
      </td>
      <td style={{ width: "120px", padding: "25px 20px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "40px" }}>
          <Deposit
            reserves={reserves}
            asset={coin.name}
            assetSymbol={coin.symbol}
            depositLoanRates={depositLoanRates}
          />
          <Borrow
            reserves={reserves}
            asset={coin.name}
            assetSymbol={coin.symbol}
            title={coin.name}
            depositLoanRates={depositLoanRates}
            fairPriceArray={fairPriceArray}
          />
        </div>
      </td>
    </tr>
  );
};
export default DashboardTokens;
