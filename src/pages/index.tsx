import React, { useState, useEffect, useContext } from "react";
import Ellipse1 from "../assets/images/Ellipse 59.svg";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  TabContent,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  NavLink,
  NavItem,
  Nav,
} from "reactstrap";
import Image from "next/image";
import classnames from "classnames";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { Icon } from "semantic-ui-react";

import loadable from "@loadable/component";
const TxHistoryTable = loadable(
  () => import("../components/dashboard/tx-history-table")
);

import ProtocolStats from "../components/dashboard/protocol-stats";

import RepaidLoansTab from "../components/passbook/active-tabs/repaid-loans";
import ActiveLoansTab from "../components/passbook/active-tabs/active-loans";
import ActiveDepositsTab from "../components/passbook/active-tabs/active-deposits";
import BorrowTab from "../components/passbook/borrow-section/borrow";
import DashboardMenu from "../components/dashboard/dashboard-menu";
import PassbookMenu from "../components/passbook/passbook-menu";
import Liquidation from "../components/liquidation/liquidation";
import LoanBorrowCommitment from "../components/dashboard/loanborrow-commitment";
import OffchainAPI from "../services/offchainapi.service";

import arrowDown from "../assets/images/arrowDown.svg";
import {
  diamondAddress,
  getCommitmentIndex,
  getCommitmentNameFromIndexDeposit,
  getCommitmentNameFromIndexLoan,
  getTokenFromAddress,
  tokenDecimalsMap,
} from "../blockchain/stark-constants";
import BigNumber from "bignumber.js";
import {
  useAccount,
  useContract,
  useStarknet,
  useStarknetCall,
} from "@starknet-react/core";
import ActiveDepositTable from "../components/passbook/passbook-table/active-deposit-table";
import { Abi, Contract, number, RpcProvider, uint256 } from "starknet";
import { assert } from "console";
import depositAbi from "../../starknet-artifacts/contracts/modules/deposit.cairo/deposit_abi.json";
import loanAbi from "../../starknet-artifacts/contracts/modules/loan.cairo/loan_abi.json";
import Script from "next/script";
import StatsBoard from "../components/dashboard/stats";
import connectWalletArrowDown from "../assets/images/connectWalletArrowDown.svg";
import SpendLoan from "../components/passbook/Spend-loans/spendLoan";
import SpendLoanNav from "../components/passbook/Spend-loans/spendLoan-navbar";
// import YourSupplyBody from "../components/dashboard/supply";
import { TabContext } from "../hooks/contextHooks/TabContext";
import DashboardLiquid from "../components/dashboard/DashboardLiquid";
import ToastModal from "../components/toastModals/customToastModal";

import useMaxloan from "../blockchain/hooks/Max_loan_given_collat";
import { BNtoNum, GetErrorText, NumToBN } from "../blockchain/utils";
import Crossimg from "../../public/cross.svg";
import Chart from "../components/charts/Chart";
import Chart2 from "../components/charts/Chart2";
import BarChartComponent from "../components/charts/barChart";
import DownArrow from "../assets/images/ArrowDownDark.svg";
import UpArrow from "../assets/images/ArrowUpDark.svg";
import YourMatrics from "../components/matrics/yourMatrics";
import ProtocolMatrics from "../components/matrics/protocolMatrix";
import MySpinner from "../components/mySpinner";
import { NumericFormat } from "react-number-format";
// import App from "./Chart"

interface IDeposit {
  amount: string;
  account: string | undefined;
  commitment: string | null;
  market: string | undefined;
  acquiredYield: number;
  interestRate: number;
}

interface ILoans {
  loanMarket: string | undefined;
  loanMarketAddress: string | undefined;
  loanAmount: number;
  commitment: string | null;
  commitmentIndex: number | null;
  collateralMarket: string | undefined;
  collateralAmount: number;
  loanInterest: number;
  interestRate: number;
  account: string | undefined;
  cdr: number;
  debtCategory: number | undefined;
  loanId: number;
  isSwapped: boolean;
  state: string;
  stateType: number;
  currentLoanMarket: string | undefined;
  currentLoanAmount: number;
}

const loanTypes = ["Repaid", "Active"];

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeDepositsData, setActiveDepositsData] = useState<IDeposit[]>([]);
  const [activeLoansData, setActiveLoansData] = useState<ILoans[]>([]);
  const [repaidLoansData, setRepaidLoansData] = useState<ILoans[]>([]);
  const [activeLiquidationsData, setActiveLiquidationsData] = useState<any>([]);
  const [isTransactionDone, setIsTransactionDone] = useState(false);

  const [handleDepositTransactionDone, setHandleDepositTransactionDone] =
    useState(false);
  const [withdrawDepositTransactionDone, setWithdrawDepositTransactionDone] =
    useState(false);

  // const [customActiveTab, setCustomActiveTab] = useState("1");
  // const [customActiveTabs, setCustomActiveTabs] = useState("1");
  const [loanActionTab, setLoanActionTab] = useState("0");
  const [passbookStatus, setPassbookStatus] = useState("ActiveDeposit");

  const [modal_repay_loan, setmodal_repay_loan] = useState(false);
  const [modal_withdraw_loan, setmodal_withdraw_loan] = useState(false);
  const [modal_swap_loan, setmodal_swap_loan] = useState(false);
  const [modal_swap_to_loan, setmodal_swap_to_loan] = useState(false);
  // const [modal_add_collateral, setmodal_add_collateral] = useState(false);
  const [modal_withdraw_collateral, setmodal_withdraw_collateral] =
    useState(false);
  const [modal_add_active_deposit, setmodal_add_active_deposit] =
    useState(true);
  const [modal_withdraw_active_deposit, setmodal_withdraw_active_deposit] =
    useState(false);

  const [depositInterestChange, setDepositInterestChange] = useState("NONE");
  const [borrowInterestChange, setBorrowInterestChange] = useState("NONE");

  const [depositRequestSel, setDepositRequestSel] = useState();
  const [withdrawDepositSel, setWithdrawDepositSel] = useState();
  const [depositRequestVal, setDepositRequestVal] = useState();
  const [withdrawDepositVal, setWithdrawDepositVal] = useState();

  const [customActiveTabs, setCustomActiveTabs] = useState("1");

  const [inputVal1, setInputVal1] = useState(0);
  const [liquidationIndex, setLiquidationIndex] = useState(0);

  const [index, setIndex] = useState("1");
  const { account: starknetAccount, address: _account } = useAccount();
  const [account, setAccount] = useState<string>("");
  // const [totalBorrowApr, setTotalBorrowApr] = useState(0);
  const [netBorrowedApr, setNetBorrowedApr] = useState(0);
  const [netAprEarned, setNetAprEarned] = useState(0);
  const [oracleAndFairPrices, setOracleAndFairPrices] = useState<any>();
  const [offchainCurrentBlock, setOffchainCurrentBlock] = useState("");
  const [modal_deposit, setmodal_deposit] = useState(false);

  // isWhitelisted is use to redirect users who are not whitelisted
  const [isWhitelisted, setIsWhitelisted] = useState(0);
  const [isWaitlisted, setIsWaitlisted] = useState(0);

  let [timer, setTimer] = useState(3);

  const checkDB = async () => {
    try {
      //Whitelist check [correct check, ensure this is used on mainnet]
      const whitelistStatus = await OffchainAPI.getWhitelistData(
        _account ? _account : ""
      );

      //Waitlist check [I waitlisted my address for testing]
      //const whitelistStatus = await OffchainAPI.getWhitelistData("0x04ed937e802b1599a8d3b5dc93cf45f627d413e2d03e018c1da9f62062f7dfc8");

      //Redirect check [Non existential address]
      //const whitelistStatus = await OffchainAPI.getWhitelistData("0x04ed93802b1599a8d3b5dc93cf45f627d413e2d03e018c1da9f62062f7dfc8");

      if (whitelistStatus.isWhitelistedStatus == "Selected") {
        setIsWhitelisted(1);
      } else if (whitelistStatus.isWhitelistedStatus == "Waitlist") {
        setIsWaitlisted(1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    //0x05b55db55f5884856860e63f3595b2ec6b2c9555f3f507b4ca728d8e427b7864
    // setAccount(number.toHex(number.toBN(number.toFelt(_account || ""))));
    setAccount(
      number.toHex(
        number.toBN(
          number.toFelt(
            "0x5b55db55f5884856860e63f3595b2ec6b2c9555f3f507b4ca728d8e427b7864"
          )
        )
      )
    );
    checkDB();
  }, [_account]);

  const {
    customActiveTab,
    toggleCustom,
    totalBorrowAssets,
    setTotalBorrowAssets,
    totalSupplyDash,
    setTotalSupplyDash,
  } = useContext(TabContext);

  const [reserves, setReserves] = useState();

  const [typeOfLoans, setTypeOfLoans] = useState("Active");
  const [isDropDownOpenTypeOfLoans, setIsDropDownOpenTypeOfLoans] =
    useState(false);
  const [typeOfLoansDropDownArrowType, setTypeOfLoansDropDownArrowType] =
    useState(DownArrow);
  const [filteredLoans, setFilteredLoans] = useState<ILoans[]>([]);
  const [ActiveRepaytab, setActiveRepaytab] = useState("Active");

  function toggle(newIndex: string) {
    if (newIndex === index) {
      setIndex("1");
    } else {
      setIndex(newIndex);
    }
  }
  OffchainAPI.getDashboardStats().then(
    (stats) => {
      setOffchainCurrentBlock(stats.lastProcessedBlock?.blockNumber);
    },
    (err) => {
      console.error(err);
    }
  );

  useEffect(() => {
    const getReserves = async () => {
      const res = await OffchainAPI.getReserves();
      setReserves(res?.reserves);
    };
    getReserves();
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

  useEffect(() => {
    if (!oracleAndFairPrices || !activeLoansData) return;
    calculateNetBorrowedApr();
  }, [activeLoansData, oracleAndFairPrices]);

  useEffect(() => {
    if (!oracleAndFairPrices || !activeDepositsData) return;
    calculateNetAprEarned();
  }, [activeDepositsData, oracleAndFairPrices]);

  const calculateNetAprEarned = () => {
    let sum = 0;
    for (let i = 0; i < oracleAndFairPrices?.oraclePrices?.length; i++) {
      activeDepositsData.map((item: any, index: number) => {
        if (item.market === oracleAndFairPrices?.oraclePrices[i].name) {
          sum +=
            ((Number(item.acquiredYield) + Number(item.interestPaid)) /
              10 ** Number(tokenDecimalsMap[item.market])) *
            oracleAndFairPrices?.oraclePrices[i].price;
        }
      });
    }
    // console.log("net apr earned", sum);
    setNetAprEarned(sum);
  };

  const calculateNetBorrowedApr = () => {
    let sum = 0;
    for (let i = 0; i < oracleAndFairPrices?.oraclePrices?.length; i++) {
      activeLoansData.map((item: any) => {
        if (
          item.loanMarket === oracleAndFairPrices?.oraclePrices[i].name &&
          !["REPAID", "LIQUIDATED"].includes(item.state)
        ) {
          sum +=
            ((Number(item.interestPaid) + Number(item.interest)) /
              10 ** Number(tokenDecimalsMap[item.loanMarket])) *
            oracleAndFairPrices?.oraclePrices[i].price;
        }
      });
    }
    // console.log("net borrow apr earned", sum);
    setNetBorrowedApr(sum.toFixed(2));
  };
  useEffect(() => {
    let validTypes = ["REPAID", "SWAPPED", "OPEN"];
    if (typeOfLoans === "Repaid") {
      setFilteredLoans(
        activeLoansData.filter((loan) => {
          return (
            loan.state === typeOfLoans?.toUpperCase() &&
            loan.collateralAmount > 0
          );
        })
      );
      return;
    }
    setFilteredLoans(
      activeLoansData.filter((loan) => {
        return loan.state !== "REPAID" && loan.state !== "LIQUIDATED";
      })
    );
  }, [typeOfLoans, activeLoansData]);

  function parseLoansData(loansData: any, collateralsData: any) {
    const loans: ILoans[] = [];
    for (let i = 0; i < loansData?.length; ++i) {
      let loanData = loansData[i];
      let collateralData = collateralsData[i];
      let temp_len = {
        loanMarket: getTokenFromAddress(number.toHex(loanData?.market))?.name,
        loanMarketSymbol: getTokenFromAddress(number.toHex(loanData?.market))
          ?.symbol,
        currentLoanMarket: getTokenFromAddress(
          number.toHex(loanData?.current_market)
        )?.name, // Borrow market(current)
        currentLoanMarketSymbol: getTokenFromAddress(
          number.toHex(loanData?.current_market)
        )?.symbol,
        loanMarketAddress: number.toHex(loanData?.market),
        loanAmount: uint256.uint256ToBN(loanData?.amount).toString(), //  Amount
        loanId: Number(BNtoNum(loanData?.id, 0)),
        account: number.toHex(loanData?.owner),
        commitment: getCommitmentNameFromIndexLoan(
          Number(BNtoNum(loanData?.commitment, 0) as string).toString()
        ), //  Commitment
        commitmentIndex: getCommitmentIndex(
          BNtoNum(loanData?.commitment, 0)
        ) as number,
        collateralMarket: getTokenFromAddress(
          number.toHex(collateralData?.market)
        )?.name, //  Collateral Market
        collateralMarketSymbol: getTokenFromAddress(
          number.toHex(collateralData?.market)
        )?.symbol,
        collateralAmount: uint256
          .uint256ToBN(collateralData?.current_amount)
          .toString(), // 5 Collateral Amount
        interestRate: 0,
        debtCategory: BNtoNum(loanData?.debt_category, 0),
        loanCreationTime: Number(loanData?.created_at),
        openLoanAmount:
          number.toHex(loanData?.market) ===
          number.toHex(loanData?.current_market)
            ? uint256.uint256ToBN(loanData?.current_amount).toString()
            : "0",
        currentLoanAmount: uint256
          .uint256ToBN(loanData?.current_amount)
          .toString(),
        isWithdrawn: Number(BNtoNum(loanData?.is_loan_withdrawn, 0)) === 1,
        timelockDuration: Number(BNtoNum(collateralData?.timelock_validity, 0)), // Time lock duration for collateral
        timelockActivationTime: Number(BNtoNum(collateralData?.activation_time, 0)), // when was time lock applied
        isTimelockActivated: Number(BNtoNum(collateralData?.is_timelock_activated, 0)) === 1, // time-lock applied currently or not
        isSwapped: Number(BNtoNum(loanData?.state, 0)) === 2, // Swap status
        state:
          Number(BNtoNum(loanData?.state, 0)) === 1
            ? "OPEN"
            : Number(BNtoNum(loanData?.state, 0)) === 2
            ? "SWAPPED"
            : Number(BNtoNum(loanData?.state, 0)) === 3
            ? "REPAID"
            : Number(BNtoNum(loanData?.state, 0)) === 4
            ? "LIQUIDATED"
            : null,
        stateType:
          Number(BNtoNum(loanData?.state, 0)) === 3 ||
          Number(BNtoNum(loanData?.state, 0)) === 4
            ? 1
            : 0, // Repay status
        interest: Number(0),
        interestPaid: Number(0),
        l3App: (number.toBN(loanData?.l3_integration).toString() === "1962660952167394271600" ?
          "jediSwap" : number.toBN(loanData?.l3_integration, 0).toString() === "30814223327519088" ?
            "mySwap" : null
        ),
        // cdr: BNtoNum(loanData?.debt_category, 0),
        // interestPaid: Number(loanData.interestPaid), //loan interest
        // interest: Number(loanData.interest),

        //get apr is for loans apr
      };
      loans.push(JSON.parse(JSON.stringify(temp_len)));
    }

    setActiveLoansData(loans);
    // console.log("loans: " + loans);
    setRepaidLoansData(
      loans.filter((asset) => {
        // console.log(asset, "testasset");
        return asset.state === "REPAID";
      })
    );
    setFilteredLoans(
      activeLoansData.filter((loan) => {
        return loan.state !== "REPAID" && loan.state !== "LIQUIDATED";
      })
    );
    console.log("parsed loans data", loans);
  }

  async function get_user_loans() {
    let provider = new RpcProvider({ nodeUrl: "https://starknet-mainnet.infura.io/v3/c93242f6373647c7b5df8e400f236b7c" })
    const MySwap = new Contract(loanAbi, diamondAddress, provider);
    const res = await MySwap.call('get_user_loans', [account]);
    parseLoansData(res?.loan_records_arr, res?.collateral_records_arr);
    console.log(res)
  }

  useEffect(() => {
    if (account)
      get_user_loans();
  }, [account, customActiveTab]);


  /*============================== Get Deposits from the blockchain ====================================*/


  function parseDepositsData(depositsData: any[]) {
    let deposits: any[] = [];
    let deposit;
    for (let i = 0; i < depositsData?.length; i++) {
      let deposit: any = depositsData?.[i];
      let myDep = {
        amount: uint256.uint256ToBN(deposit?.amount).toString(),
        market: getTokenFromAddress(number.toHex(deposit?.market))?.name,
        account: number.toHex(deposit?.owner),
        commitment: getCommitmentNameFromIndexDeposit(
          Number(BNtoNum(deposit?.commitment, 0)).toString()
        ),
        commitmentIndex: Number(BNtoNum(deposit?.commitment, 0)),
        marketSymbol: getTokenFromAddress(number.toHex(deposit?.market))
          ?.symbol,
        marketAddress: number.toHex(deposit?.market),
        depositId: Number(BNtoNum(deposit?.id, 0)),
        acquiredYield: Number(0), // deposit interest TODO: FORMULA
        interestPaid: Number(0), // deposit interest TODO: FORMULA

        isTimelockApplicable: Number(BNtoNum(deposit?.is_timelock_applicable, 0)) === 1,
        isTimelockActivated: Number(BNtoNum(deposit?.is_timelock_activated, 0)) === 1,
        timelockActivationTime: Number(BNtoNum(deposit?.activation_time, 0)),
        timelockDuration: Number(BNtoNum(deposit?.timelock_validity, 0)),

        depositCreationTime: Number(deposit.created_at),
      };
      // VT: had to stringify and append due to a weird bug that was updating data randomly after append
      let myDepString = JSON.stringify(myDep);
      deposits.push(JSON.parse(myDepString));
    }
    let nonZeroDeposits = deposits.filter(function (el) {
      console.log("amount parse deposit", el.amount)
      return el.amount !== "0";
    });
    console.log("parsed deposit data", deposits);
    setActiveDepositsData(nonZeroDeposits);
  }

  async function get_user_deposits() {
    let provider = new RpcProvider({ nodeUrl: "https://starknet-mainnet.infura.io/v3/c93242f6373647c7b5df8e400f236b7c" })
    const Deposit = new Contract(depositAbi, diamondAddress, provider);
    const res = await Deposit.call('get_user_deposits', [ account ]);
    parseDepositsData(res?.deposit_records_arr);
  }

  useEffect(() => {
    if (account)
      get_user_deposits();
  }, [account, customActiveTab, isTransactionDone]);


  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
    if (customActiveTab == "6") {
      navigateLoansToLiquidate(liquidationIndex);
    }
  }, [customActiveTab]); //only call this when custom active tab changes

  // const toggleCustom = (tab: any) => {
  //   if (customActiveTab !== tab) {
  //     setCustomActiveTab(tab);
  //   }
  // };

  const toggleCustoms = (tab: any) => {
    if (customActiveTabs !== tab) {
      setCustomActiveTabs(tab);
    }
  };

  const toggleLoanAction = (tab: any) => {
    if (loanActionTab !== tab) {
      setLoanActionTab(tab);
    }
  };

  function removeBodyCss() {
    setInputVal1(0);
    document.body.classList.add("no_padding");
  }

  function tog_repay_loan() {
    setmodal_repay_loan(!modal_repay_loan);
    removeBodyCss();
  }
  function tog_withdraw_loan() {
    setmodal_withdraw_loan(!modal_withdraw_loan);
    removeBodyCss();
  }
  function tog_swap_loan() {
    setmodal_swap_loan(!modal_swap_loan);
    removeBodyCss();
  }
  function tog_swap_to_loan() {
    setmodal_swap_to_loan(!modal_swap_to_loan);
    removeBodyCss();
  }
  // function tog_add_collateral() {
  //   setmodal_add_collateral(!modal_add_collateral);
  //   removeBodyCss();
  // }
  function tog_withdraw_collateral() {
    setmodal_withdraw_collateral(!modal_withdraw_collateral);
    removeBodyCss();
  }
  function tog_add_active_deposit() {
    // setmodal_add_active_deposit(!modal_add_active_deposit)
    setmodal_add_active_deposit(true);
    setmodal_withdraw_active_deposit(false);
    removeBodyCss();
  }
  function tog_withdraw_active_deposit() {
    setmodal_withdraw_active_deposit(true);
    setmodal_add_active_deposit(false);
    removeBodyCss();
  }

  const handleDepositInterestChange = (e: any) => {
    setDepositInterestChange(e.target.value);
  };

  const handleBorrowInterestChange = (e: any) => {
    setBorrowInterestChange(e.target.value);
  };

  const handleDepositRequestSelect = (e: any) => {
    setDepositRequestSel(e.target.value);
  };
  const handleWithdrawDepositSelect = (e: any) => {
    setWithdrawDepositSel(e.target.value);
  };

  const handleDepositRequestTime = (e: any) => {
    setDepositRequestVal(e.target.value);
  };
  const handleWithdrawDepositTime = (e: any) => {
    setWithdrawDepositVal(e.target.value);
  };

  const onLiquidationsData = async (liquidationsData: any[]) => {
    const liquidations: any[] = [];
    for (let i = 0; i < liquidationsData.length; i++) {
      const loan = liquidationsData[i];
      // console.log("loan in liquidation", loan);
      let myLiquidableLoan = {
        loanOwner: loan.account,

        loanMarket: getTokenFromAddress(loan.loanMarket)?.name,
        loanMarketSymbol: getTokenFromAddress(loan.loanMarket)?.symbol,
        loanAmount: loan.loanAmount,
        openLoanAmount: loan.openLoanAmount,
        
        commitment: getCommitmentNameFromIndexDeposit(loan.commitment),

        currentMarket: getTokenFromAddress(loan.currentMarket)?.name,
        currentMarketSymbol: getTokenFromAddress(loan.currentMarket)?.symbol,
        currentAmount: loan.currentAmount,

        collateralMarket: getTokenFromAddress(loan.collateralMarket)?.name,
        collateralMarketSymbol: getTokenFromAddress(loan.collateralMarket)
          ?.symbol,
        collateralAmount: loan.collateralAmount,

        isLiquidationDone: false,
        id: loan.loanId,
      };
      let myLoanString = JSON.stringify(myLiquidableLoan);
      liquidations.push(JSON.parse(myLoanString));
    }
    // getting the unique liquidable loans by filtering laonMarket and Commitment
    // const uniqueLiquidableLoans = liquidations.filter(
    //   (loan, index, self) =>
    //     index ===
    //     self.findIndex(
    //       (t) =>
    //         t.loanMarket === loan.loanMarket && t.commitment === loan.commitment
    //     )
    // );
    // // console.log("uni liquida", uniqueLiquidableLoans);
    // setActiveLiquidationsData(uniqueLiquidableLoans);
    // console.log("onLiquidationsData in", liquidationsData, liquidations);
    setActiveLiquidationsData(liquidations);
  };

  const navigateLoansToLiquidate = async (liquidationIndex: any) => {
    !isTransactionDone &&
      account &&
      OffchainAPI.getLiquidableLoans(account).then(
        (loans) => {
          onLiquidationsData(loans);
          setIsLoading(false);
          console.log("liquidable", loans);
        },
        (err) => {
          setIsLoading(false);
          setActiveLiquidationsData([]);
          // console.log(err);
        }
      );
  };
  const getActionTabs = (customActiveTab: string) => {
    // console.log("blockchain activedepoist", activeDepositsData);
    // console.log("blockchain activeloans", activeLoansData);
    // console.log("customActiveTab: ", customActiveTab);
    switch (customActiveTab) {
      case "1":
        return (
          <ActiveDepositsTab
            reserves={reserves}
            activeDepositsData={activeDepositsData}
            modal_add_active_deposit={modal_add_active_deposit}
            tog_add_active_deposit={tog_add_active_deposit}
            modal_withdraw_active_deposit={modal_withdraw_active_deposit}
            tog_withdraw_active_deposit={tog_withdraw_active_deposit}
            depositRequestSel={depositRequestSel}
            setInputVal1={setInputVal1}
            handleDepositTransactionDone={handleDepositTransactionDone}
            withdrawDepositTransactionDone={withdrawDepositTransactionDone}
            isTransactionDone={isTransactionDone}
            inputVal1={inputVal1}
          />
        );
        break;

      case "2": //
        return (
          <ActiveLoansTab
            activeLoansData={filteredLoans}
            customActiveTabs={customActiveTabs}
            isTransactionDone={isTransactionDone}
            depositRequestSel={depositRequestSel}
            // inputVal1={inputVal1}
            removeBodyCss={removeBodyCss}
            setCustomActiveTabs={setCustomActiveTabs}
          />
        );
        break;

      case "3":
        return (
          <RepaidLoansTab
            repaidLoansData={repaidLoansData}
            customActiveTabs={customActiveTab}
          />
        );
        break;
      default:
        return null;
    }
  };

  const borrowActionTabs = () => {
    // console.log(repaidLoansData);

    return (
      <BorrowTab
        activeLoansData={filteredLoans}
        customActiveTabs={customActiveTabs}
        isTransactionDone={isTransactionDone}
        depositRequestSel={depositRequestSel}
        removeBodyCss={removeBodyCss}
        setCustomActiveTabs={setCustomActiveTabs}
        fairPriceArray={oracleAndFairPrices?.fairPrices}
      />
    );
  };

  function incorrectChain() {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        <p
          style={{
            color: "white",
            fontSize: "25px",
            zIndex: "100",
          }}
        >
          Please switch to Starknet Mainnet and refresh
        </p>
        {/* Currently connected to: {starknetAccount?.baseUrl}. The base url should
        be `https://alpha4-2.starknet.io` in your wallet for Goerli 2 network. */}
      </div>
    );
  }

  // Waitlist UI
  const WaitlistUI = () => {
    return (
      <p
        style={{
          zIndex: "1000",
          marginTop: "200px",
          marginBottom: "400px",
          textAlign: "center",
          verticalAlign: "text-bottom",
          fontSize: "40px",
          color: "white",
        }}
      >
        You're already in the queue
      </p>
    );
  };

  // Timer logic
  const showTimer = async () => {
    if (timer >= 1) {
      setTimer(--timer);
    } else {
      if (isWaitlisted != 1 && isWhitelisted != 1) {
        window.location.href = "https://spearmint.xyz/p/hashstack";
      }
    }

    return null;
  };


  // Spearmint redirect UI
  const SpearmintRedirectUI = () => {
    console.log("Inside redirection UI");
    setTimeout(showTimer, 1200);
    return (
      <span>
        <p
          style={{
            zIndex: "1000",
            marginTop: "200px",
            marginBottom: "350px",
            textAlign: "center",
            verticalAlign: "text-bottom",
            fontSize: "40px",
            color: "white",
          }}
        >
          Only registered users are allowed to access the mainnet. You're
          redirected to the waitlist page in {timer} seconds
        </p>
      </span>
    );
  };

  const DashboardUI = () => {
    return (
      <div style={{ width: "100%", backgroundColor: "#1C202", height: "100%" }}>
        {customActiveTab === "1" ? (
          <StatsBoard
            setTotalBorrowAssets={setTotalBorrowAssets}
            setTotalSupplyDash={setTotalSupplyDash}
            depositsArray={activeDepositsData}
            loansArray={activeLoansData}
          />
        ) : null}
        <Container fluid>
          <Row>
            <Col xl={"12"}>
              {/* <Card style={{ height: "35rem", overflowY: "scroll" }}> */}
              <div style={{ margin: "1px 5px 5px 14px" }}>
                {customActiveTab === "2" ||
                customActiveTab === "3" ||
                customActiveTab === "4" ? (
                  <div style={{ marginTop: "90px" }}>
                    <DashboardMenu
                      margin={"0px"}
                      customActiveTab={customActiveTab}
                      toggleCustom={toggleCustom}
                      account={account as string}
                    />
                  </div>
                ) : customActiveTab === "1" ? (
                  <DashboardMenu
                    margin={"30px"}
                    customActiveTab={customActiveTab}
                    toggleCustom={toggleCustom}
                    account={account as string}
                  />
                ) : null}
              </div>
              <div style={{ margin: "1px 5px 10px 14px" }}>
                {customActiveTab === "6" ? (
                  <DashboardLiquid
                    customActiveTab={customActiveTab}
                    toggleCustom={toggleCustom}
                    account={account as string}
                  />
                ) : (
                  <div></div>
                )}
              </div>
              {customActiveTab === "3" ||
              customActiveTab === "4" ||
              customActiveTab === "2" ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      margin: "10px 18px",
                      color: "white",
                      fontSize: "10px",
                    }}
                  >
                    {customActiveTab === "4" ? (
                      <>
                        <div style={{ width: "7%" }}>
                          <div style={{ color: "#8C8C8C" }}>Total Borrow</div>
                          <div style={{ fontSize: "16px", fontWeight: "500" }}>
                            {totalBorrowAssets !== undefined ? (
                              <NumericFormat
                                displayType="text"
                                value={totalBorrowAssets.toFixed("2")}
                                thousandSeparator=","
                                prefix={"$"}
                              />
                            ) : (
                              <MySpinner />
                            )}
                          </div>
                        </div>
                        <div style={{ width: "7%" }}>
                          <div style={{ color: "#8C8C8C" }}>APR Earned</div>
                          <div style={{ fontSize: "16px", fontWeight: "500" }}>
                            {/* $8,932.14 */}${netAprEarned}
                          </div>
                        </div>
                      </>
                    ) : customActiveTab === "3" ? (
                      <>
                        <div style={{ width: "8%" }}>
                          <div style={{ color: "#8C8C8C" }}>Total Supply</div>
                          <div style={{ fontSize: "16px", fontWeight: "500" }}>
                            {totalSupplyDash !== undefined ? (
                              <NumericFormat
                                displayType="text"
                                value={totalSupplyDash.toFixed(2)}
                                thousandSeparator=","
                                prefix={"$"}
                              />
                            ) : (
                              <MySpinner />
                            )}
                          </div>
                        </div>
                        <div style={{ width: "7%" }}>
                          <div style={{ color: "#8C8C8C" }}>APR Earned</div>
                          <div style={{ fontSize: "16px", fontWeight: "500" }}>
                            {/* $8,932.14 */}${netAprEarned}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ width: "8%" }}>
                          <div style={{ color: "#8C8C8C" }}>
                            Total Borrow Assets
                          </div>
                          <div style={{ fontSize: "16px", fontWeight: "500" }}>
                            {totalBorrowAssets !== undefined ? (
                              <NumericFormat
                                displayType="text"
                                value={totalBorrowAssets.toFixed(2)}
                                thousandSeparator=","
                                prefix={"$"}
                              />
                            ) : (
                              <MySpinner />
                            )}
                          </div>
                        </div>
                        <div style={{ width: "7%" }}>
                          <div style={{ color: "#8C8C8C" }}>Net Borrow APR</div>
                          <div style={{ fontSize: "16px", fontWeight: "500" }}>
                            {/* $8,932.14 */}${netBorrowedApr}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {customActiveTab === "4" ? (
                    <div
                      style={{
                        position: "absolute",
                        zIndex: "3",
                        right: "80px",
                        top: "60px",
                      }}
                    >
                      <button
                        style={{
                          marginTop: "40px",
                          color: "white",
                          backgroundColor: "rgb(57, 61, 79)",
                          padding: "6px 8px 6px 10px",
                          borderRadius: "5px",
                          display: "flex",
                          width: "105px",
                          justifyContent: "space-between",
                          alignItems: "center",
                          border: "none",
                        }}
                        onClick={() => {
                          setTypeOfLoansDropDownArrowType(
                            isDropDownOpenTypeOfLoans ? DownArrow : UpArrow
                          );
                          setIsDropDownOpenTypeOfLoans(
                            !isDropDownOpenTypeOfLoans
                          );
                        }}
                      >
                        {typeOfLoans}&nbsp;&nbsp;&nbsp;
                        <Image
                          src={typeOfLoansDropDownArrowType}
                          alt="Picture of the author"
                          width="14px"
                          height="14px"
                        />
                      </button>

                      {isDropDownOpenTypeOfLoans ? (
                        <>
                          <div
                            style={{
                              borderRadius: "5px",
                              position: "absolute",
                              zIndex: "100",
                              top: "31px",
                              right: "0px",
                              width: "105px",
                              margin: "0px auto",
                              marginBottom: "20px",
                              padding: "5px 10px",
                              backgroundColor: "#393D4F",
                              // boxShadow: "0px 0px 10px rgb(57, 61, 79)",
                            }}
                          >
                            {loanTypes.map((type, index) => {
                              return (
                                <div
                                  key={index}
                                  style={{
                                    margin: "10px 0",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    fontSize: "0.8rem",
                                    color: "white",
                                  }}
                                  onClick={() => {
                                    setTypeOfLoans(type);
                                    setTypeOfLoansDropDownArrowType(DownArrow);
                                    setIsDropDownOpenTypeOfLoans(false);
                                    setActiveRepaytab(type);
                                  }}
                                >
                                  {type}
                                </div>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  ) : null}
                </>
              ) : null}
              {customActiveTab === "7" ? (
                <div style={{ marginTop: "130px" }}>
                  <YourMatrics />
                </div>
              ) : null}

              {customActiveTab === "8" ? (
                <div style={{ marginTop: "130px" }}>
                  <ProtocolMatrics />
                </div>
              ) : null}

              {customActiveTab === "1" ||
              customActiveTab === "3" ||
              customActiveTab === "4" ? (
                <Card
                  style={{
                    height: "77vh",
                    maxHeight: "36rem",
                    border: "none",
                    boxShadow:
                      "5px 10px 5px -5px rgba(20, 23, 38, 0.15), 5px 5px 5px -5px rgba(20, 23, 38, 0.3)",
                  }}
                >
                  <CardBody
                    style={{
                      overflowX: "hidden",
                      backgroundColor: "#2A2E3F",
                      border: "none",
                      boxShadow:
                        "5px 10px 5px -5px rgba(20, 23, 38, 0.15), 5px 5px 5px -5px rgba(20, 23, 38, 0.3)",
                    }}
                  >
                    {/* {// console.log(
                      "depositDatall",
                      activeDepositsData,
                      activeLoansData
                    )} */}{" "}
                    {customActiveTab === "1" ? (
                      activeDepositsData && activeLoansData ? (
                        <LoanBorrowCommitment
                          reserves={reserves}
                          isLoading={isLoading}
                          activeDepositsData={activeDepositsData}
                          activeLoansData={filteredLoans}
                        />
                      ) : (
                        "This is it"
                      )
                    ) : null}
                    <Row>
                      <div>
                        <Col lg={12}>
                          {customActiveTab === "3"
                            ? getActionTabs(customActiveTabs)
                            : null}
                        </Col>
                      </div>
                    </Row>
                    <Row>
                      <div>
                        <Col lg={12}>
                          {customActiveTab === "4" ? borrowActionTabs() : null}
                        </Col>
                      </div>
                    </Row>
                  </CardBody>
                </Card>
              ) : (
                <>
                  <TabContent activeTab={customActiveTab} className="p-1">
                    <Row>
                      <div>
                        <Col lg={12}>
                          {customActiveTab === "6" ? (
                            <div style={{ color: "black", marginTop: "30px" }}>
                              <Liquidation
                                activeLiquidationsData={activeLiquidationsData}
                                isTransactionDone={isTransactionDone}
                              />
                            </div>
                          ) : null}
                        </Col>
                      </div>
                    </Row>
                  </TabContent>
                </>
              )}

              {customActiveTab === "2" ? (
                <>
                  {" "}
                  <Card
                    style={{
                      height: "15rem",
                      overflowY: "scroll",
                    }}
                  >
                    <CardBody
                      style={{
                        backgroundColor: "rgb(42, 46, 63)",
                        overflowX: "hidden",
                        marginTop: "-20px",
                      }}
                    >
                      <Row
                        style={{
                          height: "40px",
                        }}
                      >
                        {customActiveTab === "2" ? (
                          <SpendLoan
                            activeLoansData={activeLoansData.filter(
                              (loan) => loan.state === "OPEN"
                            )}
                          />
                        ) : null}
                      </Row>
                    </CardBody>
                  </Card>
                  <div
                    style={{
                      margin: "10px 0",
                      color: "#8B8B8B",
                    }}
                  >
                    &nbsp; &nbsp; Only unspent loans are displayed here. For
                    comprehensive list of active loansgo to{" "}
                    <u
                      style={{ cursor: "pointer", color: "white" }}
                      onClick={() => {
                        toggleCustom("4");
                      }}
                    >
                      your borrow
                    </u>
                  </div>
                  <SpendLoanNav
                    activeLoansData={activeLoansData.filter(
                      (loan) => loan.state === "OPEN"
                    )}
                    modal_deposit={modal_deposit}
                    setmodal_deposit={setmodal_deposit}
                  />
                </>
              ) : null}
            </Col>
          </Row>
        </Container>
      </div>
    );
  };

  function isCorrectNetwork() {
    return (
      starknetAccount?.baseUrl.includes("alpha-mainnet.starknet.io") ||
      starknetAccount?.baseUrl.includes("localhost")
    );
  }
  // console.log("starknet",starknetAccount);

  function maintenance() {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#efb90b",
            fontSize: "25px",
          }}
        >
          Maintenance
        </p>
        We are currently under maintenance and should be back in couple of hours
      </div>
    );
  }

  return (
    // <React.Fragment>
    <>
      <div
        style={{
          backgroundColor: "#1C202F",
        }}
      >
        <Head>
          <title>Hashstack | Starknet testnet</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>

        {/* Google analytics */}
        {/* <Script id="google-analytics-zk" strategy="afterInteractive">
          {`
            <!-- Google tag (gtag.js) -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-KVDQT1MBVW"></script>
            <script>
              if (window.location.host.includes('zk.hashstack.finance')) {
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
              
                gtag('config', 'G-KVDQT1MBVW');
              }
            </script>
          `}
        </Script> */}

        {/* testnet.hashstack.finance */}
        <Script id="microsoft-clarity-testnet" strategy="afterInteractive">
          {`
            if (!window.location.host.includes('localhost')) {
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "f0nuusees0");
            }
          `}
        </Script>
        {/* zk.hashstack.finance */}
        {/* <Script id="microsoft-clarity-zk" strategy="afterInteractive">
          {`
            if (!window.location.host.includes('localhost')) {
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "f0rc7ez2pl");
            }
          `}
      </Script> */}
        <div
          className="page-content"
          style={{
            marginTop: "0px",
            zIndex: "100",
            backgroundColor: "#1C202F",
          }}
        >
          {/* <MetaTags>
          <title>Hashstack Finance</title>
        </MetaTags> */}
          {/* {maintenance()} */}

          {/* {DashboardUI()}
          <Row
        style={{
          marginTop: "5px",
          position: "relative",
          bottom: "0px",
          left: "85%",
          backgroundColor: "transparent",
          borderRadius: "5px",
          zIndex: "200  ",
        }}
      >
        <div
          style={{ display: "flex", padding: "5px 10px", alignItems: "center" }}
        >
          <div>Latest synced block:&nbsp;&nbsp;</div>
          <div style={{ opacity: 0.6 }}>{offchainCurrentBlock}</div>
          <div style={{ marginLeft: "5px" }} className="green-circle"></div>
        </div>
      </Row> */}
          {/* <Banner /> */}
          {!starknetAccount ? (
            <h3>Loading...</h3>
          ) : !isCorrectNetwork() ? (
            incorrectChain()
          ) : (
            <>
              {isWhitelisted ? (
                <DashboardUI />
              ) : isWaitlisted ? (
                <WaitlistUI />
              ) : (
                <SpearmintRedirectUI />
              )}
              <Row
                style={{
                  marginTop: "5px",
                  position: "relative",
                  bottom: "0px",
                  left: "85%",
                  backgroundColor: "transparent",
                  borderRadius: "5px",
                  zIndex: "200  ",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    padding: "5px 10px",
                    alignItems: "center",
                  }}
                >
                  <div>Latest synced block:&nbsp;&nbsp;</div>
                  <div style={{ opacity: 0.6 }}>{offchainCurrentBlock}</div>
                  <div
                    style={{ marginLeft: "5px" }}
                    className="green-circle"
                  ></div>
                </div>
              </Row>
            </>
          )}
          {/* <Analytics></Analytics>
            {props.children} */}
        </div>
        {/* <ToastModal
        bool={false}
        heading="Transaction Complete"
        desc="Copy Transaction Hash"
      /> */}
        {/* // </React.Fragment> */}
      </div>
    </>
  );
};

export default Dashboard;
