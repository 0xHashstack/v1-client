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
];

let DashboardTBody: any = ({
  isloading,
  borrowCommitment,
  depositCommitment,
}: {
  isloading: boolean;
  borrowCommitment: string;
  depositCommitment: string;
}) => {
  const [depositLoanRates, setDepositLoanRates] = useState();
  useEffect(() => {
    OffchainAPI.getProtocolDepositLoanRates().then((val) => {
      // console.log(`%c Protocol deposit`, "background: #222; color: #bada55");
      console.log(val);
      setDepositLoanRates(val);
    });
  }, []);

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
      return (
        <DashboardTokens
          coin={coin}
          idx={idx}
          key={idx}
          borrowCommitment={borrowCommitment}
          depositCommitment={depositCommitment}
          depositLoanRates={depositLoanRates}
        />
      );
    });
  }
};

export default DashboardTBody = React.memo(DashboardTBody);
