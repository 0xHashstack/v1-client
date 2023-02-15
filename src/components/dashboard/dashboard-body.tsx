import React, { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import OffchainAPI from "../../services/offchainapi.service";
import DashboardTokens from "./dashboard-tokens";
export interface ICoin {
  name: string;
  icon: string;
}

const Coins: ICoin[] = [
  {
    name: "USDT",
    icon: "mdi-bitcoin",
  },
  {
    name: "USDC",
    icon: "mdi-ethereum",
  },
  {
    name: "BTC",
    icon: "mdi-bitcoin",
  },
  { name: "BNB", icon: "mdi-drag-variant" },

  { name: "ETH", icon: "mdi-ethereum" },

  { name: "DAI", icon: "mdi-dai" },
];

let DashboardTBody: any = ({
  isloading,
  borrowCommitment,
  depositCommitment,
  activeDepositsData: activeDepositsDataParam,
  activeLoansData: activeLoansDataParam,
}: {
  isloading: boolean;
  borrowCommitment: string;
  depositCommitment: string;
  activeDepositsData: any; 
  activeLoansData: any;
}) => {
  const [depositLoanRates, setDepositLoanRates] = useState();
  const [oracleAndFairPrices, setOracleAndFairPrices] = useState<any>();
  
  const processOracleFairPrices = (coinName: string, arr) => {
    const oraclePrice = arr.find((ele) => {
      return ele.name === coinName
    });
    return oraclePrice?.price?.toFixed(3);  
  }

  const getTotal = (arr) => {
    
  }

  useEffect(() => {
    OffchainAPI.getProtocolDepositLoanRates().then((val) => {
      console.log(val);
      setDepositLoanRates(val);
    });
  }, []);

  const getPrices = () => {
    OffchainAPI.getOraclePrices().then((prices) => {
      console.log("prices", prices);
      setOracleAndFairPrices(prices);
    })
  }

  useEffect(() => {
    getPrices();
  }, [oracleAndFairPrices])

  if (isloading) {
    return (
      // <tr align="center">
      <tr>
        <td colSpan={6}>
          <Spinner>Loading...</Spinner>
        </td>
      </tr>
    );
  } else {
    // return <div>sdlfksjdf</div>;
    return Coins.map((coin, idx) => {
      if(oracleAndFairPrices === undefined) return;
      let oraclePriceForCoin = processOracleFairPrices(coin.name, oracleAndFairPrices?.oraclePrices);
      let fairPriceForCoin = processOracleFairPrices(coin.name, oracleAndFairPrices?.fairPrices);
      console.log("prices process", oraclePriceForCoin, fairPriceForCoin, coin.name);
      return (
        <DashboardTokens
          coin={coin}
          idx={idx}
          key={idx}
          borrowCommitment={borrowCommitment}
          depositCommitment={depositCommitment}
          depositLoanRates={depositLoanRates}
          oraclePriceForCoin={oraclePriceForCoin}
          fairPriceForCoin={fairPriceForCoin}
        />
      );
    });
  }
};

export default DashboardTBody = React.memo(DashboardTBody);
