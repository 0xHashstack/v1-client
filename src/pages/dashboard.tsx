import React, { useState, useEffect, useContext } from "react";
// import MetaTags from "react-meta-tags";
import axios from "axios";
import { Container, Row, Col, Card, CardBody, TabContent } from "reactstrap";
import classnames from "classnames";
import "react-toastify/dist/ReactToastify.css";
// import { Web3ModalContext } from "../contexts/Web3ModalProvider";
// import { Web3WrapperContext } from "../contexts/Web3WrapperProvider";
// import {
//   EventMap,
//   CoinClassNames,
//   MinimumAmount,
//   SymbolsMap,
//   DecimalsMap,
//   CommitMap,
//   CommitMapReverse,
// } from "../blockchain/constants";
// import { BNtoNum, GetErrorText, bytesToString } from "../blockchain/utils";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { main } from "./data-analytics";
// import { txHistory } from "./passbook-history";

import loadable from "@loadable/component";
// const PassbookTBody = loadable(() => import("../components/passbook-body"));
// const DashboardTBody = loadable(() => import("../components/dashboard-body"));
const TxHistoryTable = loadable(
  () => import("../components/dashboard/tx-history-table")
);

import DashboardTBody from "../components/dashboard/dashboard-body";
import ProtocolStats from "../components/dashboard/protocol-stats";
import RepaidLoanTable from "../components/passbook/passbook-table/repaid-loan-table";
import RepaidLoansTab from "../components/passbook/active-tabs/repaid-loans";
import ActiveLoansTab from "../components/passbook/active-tabs/active-loans";
import ActiveDepositsTab from "../components/passbook/active-tabs/active-deposits";
import ActiveLoansTable from "../components/passbook/passbook-table/active-loans-table";
import DashboardMenu from "../components/dashboard/dashboard-menu";
import PassbookMenu from "../components/passbook/passbook-menu";
import Liquidation from "../components/liquidation/liquidation";
import LoanBorrowCommitment from "../components/dashboard/loanborrow-commitment";

// toast.configure({
//   autoClose: 4000,
// });

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeDepositsData, setActiveDepositsData] = useState([]);
  const [activeLoansData, setActiveLoansData] = useState([]);
  const [repaidLoansData, setRepaidLoansData] = useState([]);
  const [activeLiquidationsData, setActiveLiquidationsData] = useState([]);
  const [isTransactionDone, setIsTransactionDone] = useState(false);

  const [
    handleWithdrawCollateralTransactionDone,
    setHandleWithdrawCollateralTransactionDone,
  ] = useState(false);
  const [handleDepositTransactionDone, setHandleDepositTransactionDone] =
    useState(false);
  const [withdrawDepositTransactionDone, setWithdrawDepositTransactionDone] =
    useState(false);
  const [handleCollateralTransactionDone, setHandleCollateralTransactionDone] =
    useState(false);
  const [handleRepayTransactionDone, setHandleRepayTransactionDone] =
    useState(false);
  const [
    handleWithdrawLoanTransactionDone,
    setHandleWithdrawLoanTransactionDone,
  ] = useState(false);
  const [handleSwapTransactionDone, setHandleSwapTransactionDone] =
    useState(false);
  const [handleSwapToLoanTransactionDone, setHandleSwapToLoanTransactionDone] =
    useState(false);

  const [customActiveTab, setCustomActiveTab] = useState("1");
  const [customActiveTabs, setCustomActiveTabs] = useState("1");
  const [loanActionTab, setLoanActionTab] = useState("0");
  const [mainTab, setMainTab] = useState("1");
  const [passbookStatus, setPassbookStatus] = useState("ActiveDeposit");

  const [modal_repay_loan, setmodal_repay_loan] = useState(false);
  const [modal_withdraw_loan, setmodal_withdraw_loan] = useState(false);
  const [modal_swap_loan, setmodal_swap_loan] = useState(false);
  const [modal_swap_to_loan, setmodal_swap_to_loan] = useState(false);
  const [modal_add_collateral, setmodal_add_collateral] = useState(false);
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

  const [repayLoanTooltipOpen, setRepayLoanTooltipOpen] = useState(false);
  const [swapLoanTooltipOpen, setSwapLoanTooltipOpen] = useState(false);
  const [swapToLoanTooltipOpen, setSwapToLoanTooltipOpen] = useState(false);
  const [addCollateralTooltipOpen, setAddCollateralTooltipOpen] =
    useState(false);
  const [withdrawCollateralTooltipOpen, setWithdrawCollateralTooltipOpen] =
    useState(false);

  const [inputVal1, setInputVal1] = useState(0);
  const [liquidationIndex, setLiquidationIndex] = useState(0);

  //   const { connect, disconnect, account, chainId } =
  //     useContext(Web3ModalContext);
  const account = "0x01234";
  const [index, setIndex] = useState("1");

  const [uf, setUf] = useState(null);
  const [tvl, setTvl] = useState(null);
  const [txHistoryData, setTxHistoryData] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [dominantMarket, setDominantMarket] = useState("");

  const [collateral_active_loan, setCollateralActiveLoan] = useState(true);
  const [repay_active_loan, setReapyActiveLoan] = useState(false);
  const [withdraw_active_loan, setWithdrawActiveLoan] = useState(false);
  const [swap_active_loan, setSwapActiveLoan] = useState(true);
  const [swap_to_active_loan, setSwapToActiveLoan] = useState(false);

  function toggle(newIndex: string) {
    if (newIndex === index) {
      setIndex("1");
    } else {
      setIndex(newIndex);
    }
  }

  let utilizationFactor;
  useEffect(() => {
    // main("totalValueLocked").then((res) => {
    //   if (typeof res === "number") {
    //     //@ts-ignore
    //     setTvl(res?.toFixed(2));
    //   }
    // });
    // main("totalBorrowedUsd").then((res1) => {
    //   if (res1) {
    //     main("totalDepositUsd").then((res2) => {
    //       //@ts-ignore
    //       utilizationFactor = res1 / res2;
    //       const uf = utilizationFactor.toFixed(2);
    //       setUf(uf);
    //     });
    //   }
    // });
    // main("totalUsers").then((res) => {
    //   setTotalUsers(res);
    // });
    // main("dominantMarket").then((res) => {
    //   setDominantMarket(res[0]);
    // });
  }, []);

  //   const { web3Wrapper: wrapper } = useContext(Web3WrapperContext);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
    // !isTransactionDone &&
    //   account &&
    //   wrapper
    //     ?.getLoanInstance()
    //     .getLoans(account)
    //     .then(
    //       (loans) => {
    //         onLoansData(loans);
    //         setIsLoading(false);
    //       },
    //       (err) => {
    //         setIsLoading(false);
    //         setActiveLoansData([]);
    //         console.log(err);
    //       }
    //     );
  }, [
    // account,
    passbookStatus,
    customActiveTab,
    isTransactionDone,
    activeLiquidationsData,
  ]);

  useEffect(() => {
    // !isTransactionDone &&
    //   account &&
    //   wrapper
    //     ?.getDepositInstance()
    //     .getDeposits(account)
    //     .then(
    //       (deposits) => {
    //         onDepositData(deposits);
    //         setIsLoading(false);
    //       },
    //       (err) => {
    //         setIsLoading(false);
    //         setActiveDepositsData([]);
    //         console.log(err);
    //       }
    //     );
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
    if (customActiveTab == "3") {
      navigateLoansToLiquidate(liquidationIndex);
    }
  }, [customActiveTab]); //only call this when custom active tab changes

  const toggleCustom = (tab: any) => {
    if (customActiveTab !== tab) {
      setCustomActiveTab(tab);
    }
  };

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
  function tog_add_collateral() {
    setmodal_add_collateral(!modal_add_collateral);
    removeBodyCss();
  }
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

  function tog_collateral_active_loan() {
    setCollateralActiveLoan(true);
    setReapyActiveLoan(false);
    setWithdrawActiveLoan(false);
    setSwapToActiveLoan(false);
    setSwapActiveLoan(false);
    //setmodal_add_active_deposit(false)
    removeBodyCss();
  }

  function tog_repay_active_loan() {
    setCollateralActiveLoan(false);
    setReapyActiveLoan(true);
    setWithdrawActiveLoan(false);
    setSwapToActiveLoan(false);
    setSwapActiveLoan(false);
    //setmodal_add_active_deposit(false)
    removeBodyCss();
  }

  function tog_withdraw_active_loan() {
    setCollateralActiveLoan(false);
    setReapyActiveLoan(false);
    setWithdrawActiveLoan(true);
    setSwapToActiveLoan(false);
    setSwapActiveLoan(false);
    //setmodal_add_active_deposit(false)
    removeBodyCss();
  }

  function tog_swap_active_loan() {
    setCollateralActiveLoan(false);
    setReapyActiveLoan(false);
    setWithdrawActiveLoan(true);
    setSwapToActiveLoan(false);

    setSwapActiveLoan(true);
    //setmodal_add_active_deposit(false)
    removeBodyCss();
  }

  function tog_swap_to_active_loan() {
    setCollateralActiveLoan(false);
    setReapyActiveLoan(false);
    setWithdrawActiveLoan(false);
    setSwapToActiveLoan(true);
    setSwapActiveLoan(false);
    //setmodal_add_active_deposit(false)
    removeBodyCss();
  }

  const handleLoanOptionChange = (e: any) => {
    setLoanOption(e.target.value);
  };

  const handleLoanCommitementChange = (e: any) => {
    setLoanCommitement(e.target.value);
  };

  const handleSwapOptionChange = (e: any) => {
    setSwapOption(e.target.value);
  };

  const handleCollateralOptionChange = (e: any) => {
    setCollateralOption(e.target.value);
  };

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

  const navigateLoansToLiquidate = async (liquidationIndex: any) => {
    //   !isTransactionDone &&
    //     account &&
    //     wrapper
    //       ?.getLiquidatorInstance()
    //       .liquidableLoans(liquidationIndex)
    //       .then(
    //         (loans) => {
    //           onLiquidationsData(loans);
    //           setIsLoading(false);
    //         },
    //         (err) => {
    //           setIsLoading(false);
    //           setActiveLiquidationsData([]);
    //           console.log(err);
    //         }
    //       );
  };

  const getPassbookTable = (passbookStatus: string) => {
    switch (passbookStatus) {
      case "ActiveDeposit":
        <ActiveDepositsTab activeDepositsData={activeDepositsData} />;
        break;

      case "ActiveLoan": //
        <ActiveLoansTable activeLoansData={activeLoansData} />;
        break;

      case "RepaidLoan":
        <RepaidLoanTable repaidLoansData={repaidLoansData} />;
        break;

      default:
        return null;
    }
  };
  //here

  const getActionTabs = (customActiveTab: string) => {
    console.log("blockchain activedepoist", activeDepositsData);
    switch (customActiveTab) {
      case "1":
        return <ActiveDepositsTab activeDepositsData={activeDepositsData} />;
        break;

      case "2": //
        return <ActiveLoansTab activeLoansData={activeLoansData} />;
        break;

      case "3":
        return <RepaidLoansTab repaidLoansData={repaidLoansData} />;
        break;
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <div className="page-content" style={{ marginTop: "0px" }}>
        {/* <MetaTags>
          <title>Hashstack Finance</title>
        </MetaTags> */}

        {/* <Banner /> */}
        <Container fluid>
          {/* Protocol Stats */}
          <ProtocolStats tvl={tvl} />
          <Row>
            <Col xl={"12"}>
              <Card style={{ height: "29rem", overflow: "scroll" }}>
                <CardBody>
                  <Row>
                    {/* Dashboard Menu Panes */}
                    <DashboardMenu
                      customActiveTab={customActiveTab}
                      toggleCustom={toggleCustom}
                      account={account}
                    />

                    {/* ----------------- PASSBOOK MENU TOGGLES -------------------- */}
                    <Col xl="5">
                      {customActiveTab === "2" && (
                        <PassbookMenu
                          account={account}
                          customActiveTabs={customActiveTabs}
                          toggleCustoms={toggleCustoms}
                        />
                      )}
                    </Col>
                  </Row>

                  {/* ----------------- PASSBOOK BODY -------------------- */}
                  <Row>
                    <div>
                      <Col lg={12}>
                        {customActiveTab === "2" &&
                          getActionTabs(customActiveTabs)}
                        {/* {getPassbookTable(passbookStatus)} */}
                      </Col>
                    </div>
                  </Row>

                  <TabContent activeTab={customActiveTab} className="p-1">
                    {/* ------------------------------------- DASHBOARD ----------------------------- */}
                    <LoanBorrowCommitment
                      handleDepositInterestChange={handleDepositInterestChange}
                      handleBorrowInterestChange={handleBorrowInterestChange}
                      depositInterestChange={depositInterestChange}
                      borrowInterestChange={borrowInterestChange}
                      isLoading={isLoading}
                    />

                    {/* -------------------------------------- PASSBOOK ----------------------------- */}

                    {/* -------------------------------------- LIQUIDATION ----------------------------- */}
                    <Liquidation
                      activeLiquidationsData={activeLiquidationsData}
                    />
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* <Analytics></Analytics>
            {props.children} */}
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
