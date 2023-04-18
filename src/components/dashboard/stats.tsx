import Image from "next/image";
import { useEffect, useState } from "react";
import statsIcon from "../../assets/images/statsIcon.svg";
import OffchainAPI from "../../services/offchainapi.service";
import { TabContext } from "../../hooks/contextHooks/TabContext";
import { useContext } from "react";
import { number } from "starknet";
import { useAccount } from "@starknet-react/core";
import { tokenDecimalsMap } from "../../blockchain/stark-constants";
import MySpinner from "../mySpinner";
import { NumericFormat } from "react-number-format";

const StatsBoard = (result: {
  depositsArray: any;
  loansArray: any;
  setTotalBorrowAssets: any;
  setTotalSupplyDash: any;
}) => {
  const { account: starknetAccount, address: _account } = useAccount();
  const [totalSupply, setTotalSupply] = useState(0);
  const [yourBorrow, setYourBorrow] = useState(0);
  const [totalReserves, setTotalReserves] = useState(0);
  const [availableReserves, setAvailableReserves] = useState(0);
  const [account, setAccount] = useState<string>("");
  const {
    depositsArray,
    loansArray,
    setTotalBorrowAssets,
    setTotalSupplyDash,
  } = result;
  const { customActiveTab, toggleCustom, setYourBorrows, setYourSupply } =
    useContext(TabContext);
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
  let reservesAmount = 0;
  useEffect(() => {
    setAccount(number.toHex(number.toBN(number.toFelt(_account || ""))));
  }, [_account]);
  let borrowedAmount = 0;
  useEffect(() => {
    if (!depositsArray || !loansArray) return;
    let supply = 0;
    let sum = 0;
    let borrow = 0;

    OffchainAPI.getOraclePrices().then((val) => {
      for (let i = 0; i < val?.oraclePrices?.length; i++) {
        depositsArray.map((item: any, index: number) => {
          if (item.market === val.oraclePrices[i].name) {
            supply +=
              (item.amount / 10 ** Number(tokenDecimalsMap[item.market])) *
              val.oraclePrices[i].price;
            sum +=
              (item.amount / 10 ** Number(tokenDecimalsMap[item.market])) *
              val.oraclePrices[i].price;
          }
        });

        loansArray.map((item: any, index: number) => {
          if (
            item.loanMarket === val.oraclePrices[i].name &&
            !["REPAID", "LIQUIDATED"].includes(item.state)
          ) {
            borrow +=
              (item.loanAmount /
                10 ** Number(tokenDecimalsMap[item.loanMarket])) *
              val.oraclePrices[i].price;
            sum -=
              (item.loanAmount /
                10 ** Number(tokenDecimalsMap[item.loanMarket])) *
              val.oraclePrices[i].price;
          }
          if (
            item.currentLoanMarket === val.oraclePrices[i].name &&
            !["REPAID", "LIQUIDATED"].includes(item.state)
          ) {
            sum +=
              (item.currentLoanAmount /
                10 ** Number(tokenDecimalsMap[item.currentLoanMarket])) *
              val.oraclePrices[i].price;
          }
          if (item.collateralMarket === val.oraclePrices[i].name) {
            sum +=
              (item.collateralAmount /
                10 ** Number(tokenDecimalsMap[item.collateralMarket])) *
              val.oraclePrices[i].price;
          }
        });
        setYourBorrow(borrow);
        setNetWorth(sum);
        setTotalSupply(supply);

        setTotalBorrowAssets(borrow);
        setTotalSupplyDash(supply);
        setYourBorrows(borrow);
        setYourSupply(supply);

        const getReserves = async () => {
          const res: any = await OffchainAPI.getReserves();
          for (let token in res?.reserves?.deposits) {
            if (token === val.oraclePrices[i].name) {
              reservesAmount +=
                res.reserves.deposits[token] * val.oraclePrices[i].price;
            }
          }
          setTotalReserves(reservesAmount);

          
          for (let token in res?.reserves?.loans) {
            if (token == val.oraclePrices[i].name) {
              borrowedAmount +=
                res.reserves.loans[token] * val.oraclePrices[i].price;
                
            }
            
          }
          setAvailableReserves(reservesAmount- borrowedAmount);
        };

        getReserves();
      }
    });
  }, [depositsArray, loansArray]);
// console.log("set",availableReserves,totalReserves);

  return (
    <div
      className="stats-board"
      style={{
        display: "flex",
        justifyContent: "space-between",
        margin: "80px 20px 20px 20px",
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
          boxShadow:
            "5px 10px 5px -5px rgba(20, 23, 38, 0.15), 5px 5px 5px -5px rgba(20, 23, 38, 0.3)",
        }}
      >
        <div className="">
          <p style={{ marginBottom: "10px", color: "#8b8b8b" }}>Net Worth</p>
          <h4>
            {netWorth !== undefined ? (
              <NumericFormat
                displayType="text"
                value={netWorth.toFixed(2)}
                thousandSeparator=","
                prefix={"$"}
              />
            ) : (
              <MySpinner />
            )}
          </h4>
        </div>
        <div className="">
          <p style={{ marginBottom: "10px", color: "#8b8b8b" }}>Your Supply</p>
          <h4>
            {totalSupply !== undefined   ?(
              <NumericFormat
                displayType="text"
                value={totalSupply.toFixed(2)}
                thousandSeparator=","
                prefix={"$"}
              />
            ) : (
              <MySpinner />
            )}
          </h4>
        </div>
        <div className="">
          <p style={{ marginBottom: "10px", color: "#8b8b8b" }}>Your Borrow</p>
          <h4>
            {yourBorrow !== undefined ? (
              <NumericFormat
                displayType="text"
                value={yourBorrow.toFixed(2)}
                thousandSeparator=","
                prefix={"$"}
              />
            ) : (
              <MySpinner />
            )}
          </h4>
        </div>
        <img
          src="./statsIcon.svg"
          alt="Navbar Logo"
          style={{
            marginLeft: "20px",
            cursor: "pointer",
            marginTop: "20px",
            zIndex: "2",
          }}
          height={24}
          width={24}
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
          boxShadow:
            "5px 10px 5px -5px rgba(20, 23, 38, 0.15), 5px 5px 5px -5px rgba(20, 23, 38, 0.3)",
        }}
      >
        <div className="Net Worth">
          <p style={{ marginBottom: "10px", color: "#8b8b8b" }}>
            Total Reserves
          </p>
          <h4>
            {totalReserves !== undefined && totalReserves !== 0?  (
              <NumericFormat
                displayType="text"
                value={totalReserves.toFixed(2)}
                thousandSeparator=","
                prefix={"$"}
              />
            ) : (
              <MySpinner />
            )}
          </h4>
        </div>
        <div className="Net Worth">
          <p style={{ marginBottom: "10px", color: "#8b8b8b" }}>
            Available Reserves
          </p>
          <h4>
            {availableReserves !== undefined && availableReserves !== 0? (
              <NumericFormat
                displayType="text"
                value={availableReserves.toFixed(2)}
                thousandSeparator=","
                prefix={"$"}
              />
            ) : (
              <MySpinner />
            )}
          </h4>
        </div>
        <div className="Net Worth">
          <p style={{ marginBottom: "10px", color: "#8b8b8b" }}>
            Asset utilisation rate
          </p>
          <h4>
            {availableReserves !== undefined && availableReserves !== 0 && totalReserves !== undefined && totalReserves !== 0? (
              `${(100 * (1 - availableReserves / totalReserves)).toFixed(2)}%`
            ) : (
              <MySpinner />
            )}
          </h4>
        </div>

        {/* <img
          src="./statsIcon.svg"
          alt="Navbar Logo"
          style={{
            marginLeft: "20px",
            cursor: "pointer",
            marginTop: "20px",
            zIndex: "2",
          }}
          height={24}
          width={24}
          onClick={() => {
            toggleCustom("8");
          }}
        /> */}
      </div>
      <div className="stat-card"></div>
    </div>
  );
};

export default StatsBoard;
