import Image from "next/image";
import { useEffect, useState } from "react";
import statsIcon from "../../assets/images/statsIcon.svg";
import OffchainAPI from "../../services/offchainapi.service";
import { TabContext } from "../../hooks/contextHooks/TabContext";
import { useContext } from "react";
import { number } from "starknet";
import { useAccount } from "@starknet-react/core";

const StatsBoard = (result: { depositsArray: any; loansArray: any }) => {
  const { account: starknetAccount, address: _account } = useAccount();
  const [totalSupply, setTotalSupply] = useState(0);
  const [yourBorrow, setYourBorrow] = useState(0);
  const [totalReserves, setTotalReserves] = useState(0);
  const [availableReserves, setAvailableReserves] = useState(0);
  const [account, setAccount] = useState<string>("");
  const { depositsArray, loansArray } = result;
  const { customActiveTab, toggleCustom } = useContext(TabContext);
  const [oraclePrices, setOraclePrices] = useState<any>();
  const [deposits, setDeposits] = useState<any>();
  const [loans, setLoans] = useState<any>();
  const [netWorth, setNetWorth] = useState(0);
  const [reserves, setReserves] = useState(0);
  const rates = {
    USDT: 0,
    BTC: 0,
    ETH: 0,
    USDC: 0,
  };

  useEffect(() => {
    setAccount(number.toHex(number.toBN(number.toFelt(_account || ""))));
  }, [_account]);

  useEffect(() => {
    let sum = 0;
    let borrow = 0;

    OffchainAPI.getOraclePrices().then((val) => {
      for (let i = 0; i < val.oraclePrices.length; i++) {
        depositsArray.map((item: any, index: number) => {
          if (item.market === val.oraclePrices[i].name) {
            sum += (item.amount / 10 ** 18) * val.oraclePrices[i].price;
            // console.log("venkatss", sum);
          }
          setTotalSupply(sum);
        });
        loansArray.map((item: any, index: number) => {
          if (
            item.loanMarket === val.oraclePrices[i].name &&
            !["REPAID", "LIQUIDATED"].includes(item.state)
          ) {
            borrow -= (item.loanAmount / 10 ** 18) * val.oraclePrices[i].price;
            sum -= (item.loanAmount / 10 ** 18) * val.oraclePrices[i].price;
            // console.log("venkat", sum);
          }
          if (
            item.currentLoanMarket === val.oraclePrices[i].name &&
            !["REPAID", "LIQUIDATED"].includes(item.state)
          ) {
            borrow -=
              (item.currentLoanAmount / 10 ** 18) * val.oraclePrices[i].price;
            sum -=
              (item.currentLoanAmount / 10 ** 18) * val.oraclePrices[i].price;
            // console.log("venkat", sum);
          }
          if (item.collateralMarket === val.oraclePrices[i].name) {
            borrow +=
              (item.collateralAmount / 10 ** 18) * val.oraclePrices[i].price;
            sum +=
              (item.collateralAmount / 10 ** 18) * val.oraclePrices[i].price;
            // console.log("venkat", sum);
          }
          setYourBorrow(borrow);
          setNetWorth(sum);
        });
        const getReserves = async () => {
          let reservesAmount = 0;
          const res: any = await OffchainAPI.getReserves();
          // console.log("MMM", res?.reserves);
          for (let token in res?.reserves?.deposits) {
            if (token == val.oraclePrices[i].name) {
              reservesAmount +=
                res?.reserves.deposits[token] * val.oraclePrices[i].price;
              // console.log("BBBB", reservesAmount);
            }
          }
          setTotalReserves(reservesAmount);

          let borrowedAmount = 0;
          for (let token in res?.reserves?.loans) {
            if (token == val.oraclePrices[i].name) {
              borrowedAmount +=
                res?.reserves.loans[token] * val.oraclePrices[i].price;
              // console.log("BBBB", reservesAmount);
            }
          }
          setAvailableReserves(reservesAmount - borrowedAmount);
          // setReserves(reservesAmount);
        };

        getReserves();
      }
    });
  }, [depositsArray]);

  // console.log("hiharsh", depositsArray);
  // console.log("byeharsh", loansArray);

  return (
    <div
      className="stats-board"
      style={{
        display: "flex",
        justifyContent: "space-between",
        margin: "20px 20px",
        gap: "20px",
      }}
    >
      <div
        className="stat-card"
        style={{
          width: "50%",
          background: "#2A2E3F",
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 40px",
          gap: "30px",
          boxShadow: "rgba(0, 0, 0, 0.5) 2.4px 2.4px 3.2px",
        }}
      >
        <div className="Net Worth">
          <p style={{ marginBottom: "10px" }}>Net Worth</p>
          <h4>${netWorth.toFixed(2)}</h4>
        </div>
        <div className="Net Worth">
          <p style={{ marginBottom: "10px" }}>Your Supply</p>
          <h4>${totalSupply.toFixed(2)}</h4>
        </div>
        <div className="Net Worth">
          <p style={{ marginBottom: "10px" }}>Your Borrow</p>
          <h4>${yourBorrow.toFixed(2)}</h4>
        </div>
        {/* <div className="Net Worth">
          <p style={{ marginBottom: "10px" }}>Net APR</p>
          <h4>15.5%</h4>
        </div> */}
        <Image
          src={statsIcon}
          alt="Navbar Logo"
          style={{ marginLeft: "20px", cursor: "pointer" }}
          height="20px"
          width="20px"
          onClick={() => {
            toggleCustom("7");
          }}
        />
      </div>
      <div className="stat-card"></div>
      <div
        className="stat-card"
        style={{
          width: "50%",
          background: "#2A2E3F",
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 40px",
          gap: "30px",
          boxShadow: "rgba(0, 0, 0, 0.5) 2.4px 2.4px 3.2px",
        }}
      >
        <div className="Net Worth">
          <p style={{ marginBottom: "10px" }}>Total Reserves</p>
          <h4>{totalReserves.toFixed(2)}</h4>
        </div>
        <div className="Net Worth">
          <p style={{ marginBottom: "10px" }}>Available Reserves</p>
          <h4>{availableReserves.toFixed(2)}</h4>
        </div>
        <div className="Net Worth">
          <p style={{ marginBottom: "10px" }}>Asset utilisation rate</p>
          <h4>{(100 * (1 - availableReserves / totalReserves)).toFixed(2)}%</h4>
        </div>
        <Image
          src={statsIcon}
          alt="Navbar Logo"
          style={{ marginLeft: "20px", cursor: "pointer" }}
          height="20px"
          width="20px"
          onClick={() => {
            toggleCustom("8");
          }}
        />
      </div>
      <div className="stat-card"></div>
    </div>
  );
};

export default StatsBoard;
