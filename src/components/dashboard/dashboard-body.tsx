import React, { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import OffchainAPI from "../../services/offchainapi.service";
import DashboardTokens from "./dashboard-tokens";
import Typewriter from "typewriter-effect"
export interface ICoin {
  name: string;
  symbol: string;
  icon: string;
}

export const Coins: ICoin[] = [
  { name: "USDT", icon: "mdi-bitcoin", symbol: "USDT" },
  { name: "USDC", icon: "mdi-ethereum", symbol: "USDC" },
  { name: "BTC", icon: "mdi-bitcoin", symbol: "WBTC" },
  { name: "ETH", icon: "mdi-ethereum", symbol: "WETH" },
  { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
];

let DashboardTBody: any = ({
  reserves,
  isloading,
  borrowCommitment,
  depositCommitment,
  activeDepositsData: activeDepositsDataParam,
  activeLoansData: activeLoansDataParam,
}: {
  reserves: any;
  isloading: boolean;
  borrowCommitment: string;
  depositCommitment: string;
  activeDepositsData: any;
  activeLoansData: any;
}) => {
  const [depositLoanRates, setDepositLoanRates] = useState();
  const [oracleAndFairPrices, setOracleAndFairPrices] = useState<any>();

  const processOracleFairPrices = (coinName: string, arr) => {
    if (!arr) return;
    const oraclePrice = arr.find((ele) => {
      return ele.name === coinName;
    });
    return oraclePrice?.price?.toFixed(3);
  };

  useEffect(() => {
    OffchainAPI.getProtocolDepositLoanRates().then((val) => {
      // console.log("got them", val);
      setDepositLoanRates(val);
    });
  }, []);

  useEffect(() => {
    const getPrices = () => {
      OffchainAPI.getOraclePrices().then((prices) => {
        // console.log("prices", prices);
        setOracleAndFairPrices(prices);
      });
    };
    getPrices();
  }, []);

  // console.log(isloading);
  
  if (isloading) {
  
    return (
      
      <tr>
        <td colSpan={6}>
          
          <Spinner>Loading...</Spinner>
        </td>
      </tr>
    );
  } else {
    return Coins.map((coin, idx) => {
      if (oracleAndFairPrices === undefined) return;
      let oraclePriceForCoin = processOracleFairPrices(
        coin.name,
        oracleAndFairPrices?.oraclePrices
      );
      let fairPriceForCoin = processOracleFairPrices(
        coin.name,
        oracleAndFairPrices?.fairPrices
      );
      // console.log(
      //   "prices process",
      //   oraclePriceForCoin,
      //   fairPriceForCoin,
      //   coin.name
      // );
      // console.log(coin);
      
      return (
        <>
          <DashboardTokens
            reserves={reserves}
            coin={coin}
            idx={idx}
            key={idx}
            borrowCommitment={borrowCommitment}
            depositCommitment={depositCommitment}
            depositLoanRates={depositLoanRates}
            oraclePriceForCoin={oraclePriceForCoin}
            fairPriceForCoin={fairPriceForCoin}
            fairPriceArray={oracleAndFairPrices?.fairPrices}
          />
        </>
      );
    });
  }
};

export default DashboardTBody = React.memo(DashboardTBody);
