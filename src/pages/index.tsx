import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
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
  getCommitmentIndex,
  getCommitmentNameFromIndexDeposit,
  getCommitmentNameFromIndexLoan,
  getTokenFromAddress,
} from "../blockchain/stark-constants";
import BigNumber from "bignumber.js";
import { useAccount, useStarknet } from "@starknet-react/core";
import ActiveDepositTable from "../components/passbook/passbook-table/active-deposit-table";
import { number } from "starknet";
import { assert } from "console";
import Script from "next/script";
import StatsBoard from "../components/dashboard/stats";
import connectWalletArrowDown from "../assets/images/connectWalletArrowDown.svg";
import SpendLoan from "../components/passbook/Spend-loans/spendLoan";
import SpendLoanNav from "../components/passbook/Spend-loans/spendLoan-navbar";
// import YourSupplyBody from "../components/dashboard/supply";
import { TabContext } from "../hooks/contextHooks/TabContext";
import DashboardLiquid from "../components/dashboard/DashboardLiquid";

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
  state: number;
  currentLoanMarket: string | undefined;
  currentLoanAmount: number;
}

const Dashboard = () => {
  const [dropDownArrow, setDropDownArrow] = useState(connectWalletArrowDown);
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

  const [loanOption, setLoanOption] = useState();
  const [swapOption, setSwapOption] = useState();
  const [loanCommitement, setLoanCommitement] = useState();

  const [collateralOption, setCollateralOption] = useState();
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

  useEffect(() => {
    setAccount(number.toHex(number.toBN(number.toFelt(_account || ""))));
  }, [_account]);

  const dappsArray = ["1", "2", "3", "4", "5", "6", "7"];

  const [uf, setUf] = useState(null);
  const [txHistoryData, setTxHistoryData] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [dominantMarket, setDominantMarket] = useState("");

  const [collateral_active_loan, setCollateralActiveLoan] = useState(true);
  const [repay_active_loan, setReapyActiveLoan] = useState(false);
  const [withdraw_active_loan, setWithdrawActiveLoan] = useState(false);
  const [swap_active_loan, setSwapActiveLoan] = useState(true);
  const [swap_to_active_loan, setSwapToActiveLoan] = useState(false);
  // Context hook for the CustomTab
  const { customActiveTab, toggleCustom } = useContext(TabContext);

  function toggle(newIndex: string) {
    if (newIndex === index) {
      setIndex("1");
    } else {
      setIndex(newIndex);
    }
  }

  let utilizationFactor;

  const onLoansData = async (loansData: any[]) => {
    console.log("Loans: ", loansData);
    const loans: ILoans[] = [];
    for (let i = 0; i < loansData.length; ++i) {
      let loanData = loansData[i];
      const cdr = new BigNumber(loanData.collateralAmount)
        .div(new BigNumber(loanData.loanAmount))
        .toNumber();
      let debtCategory;
      if (cdr >= 1) {
        debtCategory = 1;
      } else if (cdr >= 0.5 && cdr < 1) {
        debtCategory = 2;
      } else if (cdr >= 0.333 && cdr < 0.5) {
        debtCategory = 3;
      }
      let temp_len = {
        loanMarket: getTokenFromAddress(loanData.loanMarket)?.name,
        loanMarketAddress: loanData.loanMarket,
        loanAmount: Number(loanData.loanAmount), // 2 Amount
        commitment: getCommitmentNameFromIndexLoan(loanData.commitment), // 3  Commitment
        commitmentIndex: getCommitmentIndex(loanData.commitment) as number,
        collateralMarket: getTokenFromAddress(loanData.collateralMarket)?.name, // 4 Collateral Market
        collateralAmount: Number(loanData.collateralAmount), // 5 Collateral Amount
        loanInterest: Number(loanData.interest), //loan interest
        interestRate: 0,
        //interest market will always be same as loan market
        account,
        cdr,
        debtCategory,
        loanId: loanData.loanId,
        isSwapped: loanData.state == "SWAPPED", // Swap status
        state:
          loanData.state == "REPAID" || loanData.state == "LIQUIDATED" ? 1 : 0, // Repay status
        currentLoanMarket: getTokenFromAddress(
          loanData.currentMarket || loanData.loanMarket
        )?.name, // Borrow market(current)
        currentLoanAmount: Number(
          loanData.currentAmount != "0"
            ? loanData.currentAmount
            : loanData.openLoanAmount
        ), // Borrow amount(current)
        timestamp: loanData.time,
        //get apr is for loans apr
      };
      loans.push(JSON.parse(JSON.stringify(temp_len)));

      setActiveLoansData(
        loans.filter((asset) => {
          return asset.state === 0;
        })
      );
      setRepaidLoansData(
        loans.filter((asset) => {
          console.log(asset, "testasset");
          return asset.state === 1;
        })
      );
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
    console.log("useEffect", isTransactionDone, account);
    !isTransactionDone &&
      account &&
      OffchainAPI.getLoans(account).then(
        (loans) => {
          console.log("loans:", loans);
          onLoansData(loans);
          setIsLoading(false);
        },
        (err) => {
          setIsLoading(false);
          setActiveLoansData([]);
          console.log(err);
        }
      );
  }, [
    // account,
    passbookStatus,
    customActiveTab,
    isTransactionDone,
    activeLiquidationsData,
  ]);

  const onDepositData = async (depositsData: any[]) => {
    let deposits: any[] = [];
    console.log("depositdata", depositsData);
    for (let i = 0; i < depositsData.length; i++) {
      let deposit: any = depositsData[i];
      console.log(deposit);
      // let interest = await wrapper
      //   ?.getDepositInstance()
      //   .getDepositInterest(account, i + 1)
      // let interestAPR = await wrapper
      //   ?.getComptrollerInstance()
      //   .getsavingsAPR(depositsData.market[i], depositsData.commitment[i])
      console.log(
        "gettokenfrom address",
        getTokenFromAddress(deposit.market as string),
        deposit.market
      );
      let myDep = {
        amount: deposit.amount.toString(),
        account,
        commitment: getCommitmentNameFromIndexDeposit(
          deposit.commitment as string
        ),
        commitmentIndex: Number(deposit.commitment),
        market: getTokenFromAddress(deposit.market as string)?.name,
        marketAddress: deposit.market as string,
        acquiredYield: Number(0), // deposit interest
        interestRate: 0,
        depositId: deposit.depositId,
        timestamp: deposit.createdAtOnChain,
      };

      // VT: had to stringify and append due to a weird bug that was updating data randomly after append
      let myDepString = JSON.stringify(myDep);
      console.log("on deposit", i, myDepString);
      deposits.push(JSON.parse(myDepString));
    }
    let nonZeroDeposits = deposits.filter(function (el) {
      console.log(el.amount, "deposits123");
      return el.amount !== "0";
    });
    setActiveDepositsData(nonZeroDeposits);
  };

  useEffect(() => {
    !isTransactionDone &&
      account &&
      OffchainAPI.getActiveDeposits(account).then(
        (deposits) => {
          onDepositData(deposits);
          setIsLoading(false);
        },
        (err) => {
          setIsLoading(false);
          setActiveDepositsData([]);
          console.log(err);
        }
      ).catch(() => {
        console.log("error in getting deposits", error);
      });
  }, [
    // account,
    passbookStatus,
    customActiveTab,
    isTransactionDone,
  ]);

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
      console.log("loan in liquidation", loan);
      let myLiquidableLoan = {
        loanOwner: loan.account,
        loanMarket: getTokenFromAddress(loan.loanMarket)?.name,
        commitment: getCommitmentNameFromIndexDeposit(loan.commitment),
        loanAmount: loan.loanAmount,
        collateralMarket: getTokenFromAddress(loan.collateralMarket)?.name,
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
    // console.log("uni liquida", uniqueLiquidableLoans);
    // setActiveLiquidationsData(uniqueLiquidableLoans);
    console.log("onLiquidationsData in", liquidationsData, liquidations);
    setActiveLiquidationsData(liquidations);
  };

  const navigateLoansToLiquidate = async (liquidationIndex: any) => {
    !isTransactionDone &&
      account &&
      OffchainAPI.getLiquidableLoans(account).then(
        (loans) => {
          onLiquidationsData(loans);
          setIsLoading(false);
        },
        (err) => {
          setIsLoading(false);
          setActiveLiquidationsData([]);
          console.log(err);
        }
      );
  };

  // const getPassbookTable = (passbookStatus: string) => {
  //   switch (passbookStatus) {
  //     case "ActiveDeposit":
  //       <ActiveDepositTable activeDepositsData={activeDepositsData} />;
  //       break;

  //     case "ActiveLoan": //
  //       <ActiveLoansTable activeLoansData={activeLoansData} />;
  //       break;

  //     case "RepaidLoan":
  //       <RepaidLoanTable repaidLoansData={repaidLoansData} />;
  //       break;

  //     default:
  //       return null;
  //   }
  // };
  //here

  const getActionTabs = (customActiveTab: string) => {
    console.log("blockchain activedepoist", activeDepositsData);
    console.log("blockchain activeloans", activeLoansData);
    console.log("customActiveTab: ", customActiveTab);
    switch (customActiveTab) {
      case "1":
        return (
          <ActiveDepositsTab
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
            activeLoansData={activeLoansData}
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
    return (
      <BorrowTab
        activeLoansData={activeLoansData}
        customActiveTabs={customActiveTabs}
        isTransactionDone={isTransactionDone}
        depositRequestSel={depositRequestSel}
        // inputVal1={inputVal1}
        removeBodyCss={removeBodyCss}
        setCustomActiveTabs={setCustomActiveTabs}
      />
      // <ActiveLoansTab
      //   activeLoansData={activeLoansData}
      //   customActiveTabs={customActiveTabs}
      //   isTransactionDone={isTransactionDone}
      //   depositRequestSel={depositRequestSel}
      //   // inputVal1={inputVal1}
      //   removeBodyCss={removeBodyCss}
      //   setCustomActiveTabs={setCustomActiveTabs}
      // />
    );
  };

  function incorrectChain() {
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
          Please switch to Goerli 2 network and refresh
        </p>
        Currently connected to: {starknetAccount?.baseUrl}. The base url should
        be `https://alpha4-2.starknet.io` in your wallet for Goerli 2 network.
      </div>
    );
  }

  function dashboardUI() {
    return (
      <div>
        {customActiveTab === "1" ? <StatsBoard /> : null}
        <Container fluid style={{ backgroundColor: "transparent" }}>
          {/* Protocol Stats */}
          {/* <ProtocolStats /> */}

          <Row>
            <Col xl={"12"}>
              {/* <Card style={{ height: "35rem", overflowY: "scroll" }}> */}
              <div style={{ margin: "1px 5px 5px 14px" }}>
                {customActiveTab === "1" ||
                customActiveTab === "2" ||
                customActiveTab === "3" ||
                customActiveTab === "4" ? (
                  <DashboardMenu
                    customActiveTab={customActiveTab}
                    toggleCustom={toggleCustom}
                    account={account as string}
                  />
                ) : (
                  <div></div>
                )}
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
                    <div style={{ width: "7%" }}>
                      Total Supply
                      <div style={{ fontSize: "16px", fontWeight: "500" }}>
                        $8,932.14
                      </div>
                    </div>
                    <div style={{ width: "7%" }}>
                      {" "}
                      APR Earned
                      <div style={{ fontSize: "16px", fontWeight: "500" }}>
                        $8,932.14
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      zIndex: "500",
                      right: "80px",
                      top: "60px",
                    }}
                  >
                    <button
                      style={{
                        color: "white",
                        backgroundColor: "rgb(57, 61, 79)",
                        padding: "6px 16px",
                        borderRadius: "5px",
                        display: "flex",
                        alignItems: "center",
                        border:"none"
                      }}
                    >
                      Active&nbsp;&nbsp;&nbsp;
                      <Image
                        src={dropDownArrow}
                        alt="Picture of the author"
                        width="14px"
                        height="14px"
                      />
                    </button>
                  </div>
                </>
              ) : null}

              {customActiveTab === "1" ||
              customActiveTab === "3" ||
              customActiveTab === "4" ? (
                <Card style={{ height: "30rem" }}>
                  <CardBody
                    style={{
                      overflowX: "hidden",
                      backgroundColor: "#2A2E3F",
                      outline: "none",
                      border: "none",
                      boxShadow: "0px 0px 1px 1px #181728",
                    }}
                  >
                    {console.log("depositDatall", activeDepositsData, activeLoansData)}
                    {" "}
                    {customActiveTab === "1" ? (
                      <LoanBorrowCommitment 
                        isLoading={isLoading} 
                        activeDepositsData={activeDepositsData}
                        activeLoansData={activeLoansData}
                      />
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
                            <div style={{ color: "black" }}>
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
                      <Row style={{ backgroundColor: "white", height: "40px" }}>
                        {customActiveTab === "2" ? <SpendLoan /> : null}
                      </Row>
                    </CardBody>
                  </Card>
                  <div style={{ color: "white", margin: "10px 0" }}>
                    &nbsp; &nbsp; Only unspent loans are displayed here. For
                    comprehensive list of active loansgo to{" "}
                    <u style={{ cursor: "pointer" }}>your borrow</u>
                  </div>
                  <SpendLoanNav />
                  <div
                    style={{
                      fontSize: "16px",
                      marginLeft: "15px",
                      color: "white",
                    }}
                  >
                    Select Dapp to begin with the spend
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-betwwen",
                      gap: "120px",
                      margin: "10px 15px",
                    }}
                  >
                    {dappsArray.map((dapp, index) => {
                      return (
                        <div key={index}>
                          <img src={`./dapps/${dapp}.svg`} height="90px" />
                        </div>
                      );
                    })}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-betwwen",
                      gap: "120px",
                      margin: "10px 15px",
                    }}
                  >
                    {dappsArray.map((dapp, index) => {
                      return (
                        <div key={index}>
                          <img src={`./dapps/${dapp}.svg`} height="90px" />
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : null}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  function isCorrectNetwork() {
    return (
      starknetAccount?.baseUrl.includes("alpha4-2.starknet.io") ||
      starknetAccount?.baseUrl.includes("localhost")
    );
  }

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
    <div
      style={{
        backgroundColor: "#1C202F",
      }}
    >
      <Head>
        <title>Hashstack | Starknet testnet</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

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
        {dashboardUI()}
        {/* <Banner /> */}
        {/* {!starknetAccount ? (
          <h3>Loading...</h3>
        ) : !isCorrectNetwork() ? (
          incorrectChain()
        ) : (
          dashboardUI()
        )} */}

        {/* <Analytics></Analytics>
            {props.children} */}
      </div>
      {/* // </React.Fragment> */}
    </div>
  );
};

export default Dashboard;
