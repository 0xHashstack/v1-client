import {
  useTransactionReceipt,
  UseTransactionReceiptResult,
} from "@starknet-react/core";
import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Col,
  Form,
  Input,
  InputGroup,
  Nav,
  NavItem,
  NavLink,
  Row,
  Spinner,
  UncontrolledAccordion,
} from "reactstrap";
import { CoinClassNames, EventMap } from "../../../blockchain/constants";
import {
  diamondAddress,
  isTransactionLoading,
  tokenAddressMap,
} from "../../../blockchain/stark-constants";
import { TxToastManager } from "../../../blockchain/txToastManager";
import {
  BNtoNum,
  borrowInterestAccrued,
  currentBorrowInterestRate,
} from "../../../blockchain/utils";
import OffchainAPI from "../../../services/offchainapi.service";
import TxHistoryTable from "../../dashboard/tx-history-table";
import MySpinner from "../../mySpinner";
import SwapToLoan from "./swaps/swap-to-loan";
import AddToCollateral from "./add-to-collateral";
import Repay from "./repay";

const BorrowData = ({
  asset,
  historicalAPRs,
  key,
  customActiveTabs,
  loanActionTab,
  toggleLoanAction,
  account,
  tog_collateral_active_loan,
  collateral_active_loan,
  repay_active_loan,
  tog_repay_active_loan,
  withdraw_active_loan,
  tog_withdraw_active_loan,
  swap_active_loan,
  tog_swap_active_loan,
  swap_to_active_loan,
  tog_swap_to_active_loan,
  depositRequestSel,
  inputVal1,
  setInputVal1,
  setLoanId,
  handleMax,
  isLoading,
  handleWithdrawLoanTransactionDone,
  handleWithdrawLoan,
  setSwapMarket,
  handleSwapTransactionDone,
  handleSwap,
  setAddCollateralTransactionReceipt,
  setRepayTransactionReceipt,
  withdrawLoanTransactionReceipt,
  swapLoanToSecondaryTransactionReceipt,
  setRevertSwapTransactionReceipt,
  repayTransactionReceipt,
  addCollateralTransactionReceipt,
  revertSwapTransactionReceipt,
}: {
  asset: any;
  historicalAPRs: any;
  key: any;
  customActiveTabs: any;
  loanActionTab: any;
  toggleLoanAction: any;
  account: any;
  tog_collateral_active_loan: any;
  collateral_active_loan: any;
  repay_active_loan: any;
  tog_repay_active_loan: any;
  withdraw_active_loan: any;
  tog_withdraw_active_loan: any;
  swap_active_loan: any;
  tog_swap_active_loan: any;
  swap_to_active_loan: any;
  tog_swap_to_active_loan: any;
  depositRequestSel: any;
  inputVal1: any;
  setInputVal1: any;
  setLoanId: any;
  handleMax: any;
  isLoading: any;
  handleWithdrawLoanTransactionDone: any;
  handleWithdrawLoan: any;
  setSwapMarket: any;
  handleSwapTransactionDone: any;
  handleSwap: any;
  setAddCollateralTransactionReceipt: any;
  setRepayTransactionReceipt: any;
  withdrawLoanTransactionReceipt: any;
  swapLoanToSecondaryTransactionReceipt: any;
  setRevertSwapTransactionReceipt: any;
  repayTransactionReceipt: any;
  addCollateralTransactionReceipt: any;
  revertSwapTransactionReceipt: any;
}) => {
  const [borrowInterest, setBorrowInterest] = useState<string>("");
  const [currentBorrowInterest, setCurrentBorrowInterest] = useState<string>();
  useEffect(() => {
    setBorrowInterest(borrowInterestAccrued(asset));
    if (asset && historicalAPRs) {
      setCurrentBorrowInterest(
        currentBorrowInterestRate(asset, historicalAPRs)
      );
    }
  }, [asset, historicalAPRs]);

  return (
    <div key={key} style={{ borderTop: "5px" }}>
      <UncontrolledAccordion
        defaultOpen="0"
        open="false"
        style={{
          margin: "10px",
          color: "black",
          textAlign: "left",
        }}
      >
        <Row
          style={{
            margin: "15px 1px 15px 10px",
            alignItems: "center",
            gap: "50px",
          }}
        >
          {/* <AccordionItem style={{ padding: "20px" }}> */}
          {/* <AccordionHeader targetId="1"> */}

          <Col style={{ marginLeft: "-10px" }}>XXXXX1234</Col>

          <Col style={{}}>
            <div>
              <img
                src={
                  asset
                    ? CoinClassNames[
                        EventMap[asset.loanMarket.toUpperCase()]
                      ] || asset.loanMarket.toUpperCase()
                    : null
                }
                height="24px"
              />
              <div
                className="mr-6"
                style={{
                  display: "inline-block",
                  fontSize: "13px",
                }}
                // align="right"
              >
                &nbsp; &nbsp;
                {EventMap[asset.loanMarket.toUpperCase()]}
              </div>
            </div>
            <CardTitle tag="h5"></CardTitle>
          </Col>
          {/* <Col className="mr-4 ">
            <div>
              <img
                src={
                  CoinClassNames[EventMap[asset.loanMarket.toUpperCase()]] ||
                  asset.loanMarket.toUpperCase()
                }
                height="18px"
              />

              <div
                className="mr-6"
                style={{
                  display: "inline-block",
                  fontSize: "18px",
                }}
              >
                &nbsp; &nbsp;
                {EventMap[asset.loanMarket.toUpperCase()]}
              </div>
            </div>
            <CardTitle tag="h5"></CardTitle>
            <CardSubtitle className=" text-muted" tag="h6">
              <span style={{ fontSize: "14px" }}>
                &nbsp; &nbsp;&nbsp;{" "}
                {parseFloat(BNtoNum(Number(asset.loanAmount))).toFixed(6)}
              </span>
              &nbsp; &nbsp;
              {!asset.isSwapped && (
                <img
                  src="https://img.icons8.com/cotton/64/000000/synchronize--v3.png"
                  // width="18%"
                  height="12px"
                />
              )}
            </CardSubtitle>
          </Col> */}

          <Col className="mr-4 ">
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              {parseFloat(BNtoNum(Number(asset.collateralAmount)))}
            </span>
            <div>
              <img
                src={
                  asset
                    ? CoinClassNames[
                        EventMap[asset.loanMarket.toUpperCase()]
                      ] || asset.loanMarket.toUpperCase()
                    : null
                }
                height="18px"
              />

              <div
                className="mr-6"
                style={{
                  display: "inline-block",
                  fontSize: "13px",
                }}
              >
                &nbsp;
                {EventMap[asset.loanMarket.toUpperCase()]}
              </div>
            </div>
          </Col>

          <Col>
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              {parseFloat(BNtoNum(Number(asset.loanInterest))).toFixed(6)}&nbsp;
              {EventMap[asset.loanMarket.toUpperCase()]}
            </span>
            <div
              className="mr-6"
              style={{
                display: "inline-block",
                fontSize: "13px",
              }}
            >
              <span style={{ fontSize: "14px" }}>
                {currentBorrowInterest}% APR
              </span>
            </div>
          </Col>

          <Col>xxxxxxxx</Col>

          {/* <Col className="mr-4 ">
            <div>
              <img
                src={
                  CoinClassNames[
                    EventMap[asset.collateralMarket.toUpperCase()]
                  ] || asset.collateralMarket.toUpperCase()
                }
                height="18px"
              />

              <div
                className="mr-6"
                style={{
                  display: "inline-block",
                  fontSize: "18px",
                }}
                // align="right"
              >
                &nbsp; &nbsp;
                {EventMap[asset.collateralMarket.toUpperCase()]}
              </div>
            </div>
            <CardTitle tag="h5"></CardTitle>
            <CardSubtitle className=" text-muted" tag="h6">
              <span style={{ fontSize: "14px" }}>
                &nbsp; &nbsp;&nbsp;{" "}
                {parseFloat(BNtoNum(Number(asset.collateralAmount))).toFixed(6)}
              </span>
              &nbsp; &nbsp;
            </CardSubtitle>
          </Col> */}

          {/* <Col className="mr-4 ">
            <Card className="mb-1" style={{ marginTop: "20px" }}>
              <CardBody>
                <div>
                  <img
                    src={
                      CoinClassNames[
                        EventMap[asset.currentLoanMarket.toUpperCase()]
                      ] || asset.currentLoanMarket.toUpperCase()
                    }
                    height="18px"
                  />

                  <div
                    className="mr-6"
                    style={{
                      display: "inline-block",
                      fontSize: "18px",
                    }}
                    // align="right"
                  >
                    &nbsp; &nbsp;
                    {EventMap[asset.currentLoanMarket.toUpperCase()]}
                  </div>
                </div>
                <CardTitle tag="h5"></CardTitle>

                <CardSubtitle className=" text-muted" tag="h6">
                  <span style={{ fontSize: "14px" }}>
                    &nbsp; &nbsp;&nbsp;{" "}
                    {parseFloat(
                      BNtoNum(Number(asset.currentLoanAmount))
                    ).toFixed(6)}
                  </span>
                  &nbsp; &nbsp;
                </CardSubtitle>
              </CardBody>
            </Card>
          </Col> */}

          <Col className="mr-4 ">
            <div
              className="mr-6"
              style={{
                display: "inline-block",
                fontSize: "14px",
              }}
              // align="right"
            >
              {asset.commitment}
            </div>
            <CardTitle tag="h5"></CardTitle>
          </Col>

          <Col>
            <button
              style={{
                backgroundColor: "white",
                borderRadius: "5px",
                padding: "8px 15px",
              }}
              // onClick={() => {
              //   setAction(!action);
              // }}
            >
              Actions
            </button>
          </Col>

          {/* </AccordionHeader> */}
          <AccordionBody accordionId="1">
            <div style={{ borderWidth: 1 }}>
              <CardBody>
                {/* <form> */}
                <div>
                  <div className="mb-4 ">
                    <Row>
                      <Col lg="4 mb-3">
                        <div
                          className="block-example border"
                          style={{
                            padding: "15px",
                            borderRadius: "5px",
                          }}
                        >
                          <Row className="mb-3">
                            <Col>
                              {customActiveTabs === "2" && (
                                <Nav tabs className="nav-tabs-custom mb-1">
                                  <NavItem>
                                    <NavLink
                                      style={{
                                        background:
                                          loanActionTab === "0"
                                            ? "#2a3042"
                                            : "none",

                                        cursor: "pointer",
                                        color: "white",
                                        borderColor:
                                          loanActionTab === "0"
                                            ? "#3a425a #3a425a #2a3042"
                                            : "none",
                                      }}
                                      onClick={() => {
                                        // toggleCustoms("0");
                                        toggleLoanAction("0");
                                      }}
                                    >
                                      <span className="d-none d-sm-block">
                                        Loan Actions{" "}
                                      </span>
                                    </NavLink>
                                  </NavItem>
                                  {account ? (
                                    // <>
                                    <NavItem>
                                      <NavLink
                                        style={{
                                          background:
                                            loanActionTab === "1"
                                              ? "#2a3042"
                                              : "none",
                                          borderColor:
                                            loanActionTab === "1"
                                              ? "#3a425a #3a425a #2a3042"
                                              : "none",
                                          cursor: "pointer",
                                          color: "white",
                                        }}
                                        // className={classnames({
                                        //   active: customActiveTabs === "1",
                                        // })}
                                        onClick={() => {
                                          // toggleCustoms("1");
                                          toggleLoanAction("1");
                                        }}
                                      >
                                        <span className="d-none d-sm-block">
                                          Swap
                                        </span>
                                      </NavLink>
                                    </NavItem>
                                  ) : // </>
                                  null}
                                </Nav>
                              )}
                            </Col>
                          </Row>

                          {loanActionTab === "0" && (
                            <div className="mb-3">
                              <Button
                                onClick={() => {
                                  tog_collateral_active_loan();
                                }}
                                color={
                                  collateral_active_loan === true
                                    ? "light"
                                    : "outline-light"
                                }
                              >
                                Add Collateral
                              </Button>
                              &nbsp; &nbsp;
                              <Button
                                color={
                                  repay_active_loan === true
                                    ? "light"
                                    : "outline-light"
                                }
                                className="btn-block btn-md"
                                onClick={() => {
                                  tog_repay_active_loan();
                                }}
                              >
                                Repay
                              </Button>
                              &nbsp; &nbsp;
                              <Button
                                color={
                                  withdraw_active_loan === true
                                    ? "light"
                                    : "outline-light"
                                }
                                className="btn-block btn-md"
                                onClick={() => {
                                  tog_withdraw_active_loan();
                                }}
                              >
                                Withdraw
                              </Button>
                            </div>
                          )}

                          {loanActionTab === "1" && (
                            <div className="mb-3">
                              <Button
                                className="btn-block btn-md"
                                color={
                                  swap_active_loan === true
                                    ? "light"
                                    : "outline-light"
                                }
                                onClick={() => {
                                  tog_swap_active_loan();
                                }}
                              >
                                Swap Loan
                              </Button>
                              &nbsp; &nbsp;
                              {"  "}
                              <Button
                                className="btn-block btn-md"
                                color={
                                  swap_to_active_loan === true
                                    ? "light"
                                    : "outline-light"
                                }
                                onClick={() => {
                                  tog_swap_to_active_loan();
                                }}
                              >
                                Swap To Loan
                              </Button>
                            </div>
                          )}

                          {collateral_active_loan && loanActionTab === "0" && (
                            <AddToCollateral
                              asset={asset}
                              depositRequestSel={depositRequestSel}
                              setAddCollateralTransactionReceipt={
                                setAddCollateralTransactionReceipt
                              }
                            />
                          )}

                          {repay_active_loan && loanActionTab === "0" && (
                            <Repay
                              depositRequestSel={depositRequestSel}
                              asset={asset}
                              setRepayTransactionReceipt={
                                setRepayTransactionReceipt
                              }
                            />
                          )}

                          {withdraw_active_loan && loanActionTab === "0" && (
                            <Form>
                              <div className="row mb-3">
                                <Col sm={12}>
                                  <InputGroup>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="horizontal-password-Input"
                                      placeholder="Amount"
                                      value={inputVal1}
                                      onChange={(event) => {
                                        setInputVal1(
                                          Number(event.target.value)
                                        );
                                        setLoanId(asset.loanId);
                                      }}
                                    />

                                    <Button
                                      outline
                                      type="button"
                                      className="btn btn-md w-xs"
                                      onClick={() =>
                                        handleMax(
                                          asset.collateralAmount,
                                          asset.loanAmount,
                                          asset.loanMarket,
                                          asset.collateralMarket
                                        )
                                      }
                                      // disabled={dataBalance ? false : true}
                                      style={{
                                        background: "#2e3444",
                                        border: "#2e3444",
                                      }}
                                    >
                                      <span
                                        style={{
                                          borderBottom: "2px dotted #fff",
                                        }}
                                      >
                                        {isLoading ? (
                                          <Spinner
                                            style={{
                                              height: "14px",
                                              width: "14px",
                                            }}
                                          >
                                            Loading...
                                          </Spinner>
                                        ) : (
                                          "Max"
                                        )}
                                      </span>
                                    </Button>
                                  </InputGroup>
                                </Col>
                              </div>

                              <div className="d-grid gap-2">
                                <Button
                                  // color="primary"
                                  className="w-md"
                                  disabled={
                                    handleWithdrawLoanTransactionDone ||
                                    inputVal1 <= 0
                                  }
                                  onClick={() => {
                                    handleWithdrawLoan(asset);
                                  }}
                                  style={{
                                    color: "#4B41E5",
                                  }}
                                >
                                  {!isTransactionLoading(
                                    withdrawLoanTransactionReceipt
                                  ) ? (
                                    "Withdraw Loan"
                                  ) : (
                                    <MySpinner text="Withdrawing loan" />
                                  )}
                                </Button>
                              </div>
                            </Form>
                          )}

                          {swap_active_loan && loanActionTab === "1" && (
                            <Form>
                              <div className="d-grid ">
                                <Row>
                                  <Col md="12" className="mb-3">
                                    <select
                                      className="form-select"
                                      onChange={(e) => {
                                        setSwapMarket(
                                          tokenAddressMap[
                                            e.target.value as string
                                          ] as string
                                        );
                                        setLoanId(asset.loanId);
                                      }}
                                    >
                                      <option hidden>Swap Market</option>
                                      <option value={"BTC"}>BTC</option>
                                      <option value={"BNB"}>BNB</option>
                                      <option value={"USDC"}>USDC</option>
                                    </select>
                                  </Col>
                                </Row>

                                <Button
                                  // color="primary"
                                  className="w-md"
                                  disabled={
                                    asset.isSwapped || handleSwapTransactionDone
                                  }
                                  onClick={() => {
                                    handleSwap();
                                  }}
                                  style={{
                                    color: "#4B41E5",
                                  }}
                                >
                                  {!isTransactionLoading(
                                    swapLoanToSecondaryTransactionReceipt
                                  ) ? (
                                    "Swap Loan"
                                  ) : (
                                    <MySpinner text="Swapping loan" />
                                  )}
                                </Button>
                              </div>
                            </Form>
                          )}

                          {swap_to_active_loan && loanActionTab === "1" && (
                            <SwapToLoan
                              asset={asset}
                              setRevertSwapTransactionReceipt={
                                setRevertSwapTransactionReceipt
                              }
                            />
                          )}
                        </div>
                      </Col>
                      <Col lg="8">
                        {
                          <TxHistoryTable
                            asset={asset}
                            type="loans"
                            market={asset.loanMarket}
                            observables={[
                              repayTransactionReceipt,
                              addCollateralTransactionReceipt,
                              withdrawLoanTransactionReceipt,
                              swapLoanToSecondaryTransactionReceipt,
                              revertSwapTransactionReceipt,
                            ]}
                          />
                        }
                      </Col>
                    </Row>
                  </div>
                </div>
                {/* </form> */}
              </CardBody>
            </div>
          </AccordionBody>
          {/* </AccordionItem> */}
        </Row>
      </UncontrolledAccordion>
    </div>
  );
};

export default BorrowData;

// import React, { useState, useEffect } from "react";
// import {
//   Row,
//   Col,
//   Card,
//   CardBody,
//   Button,
//   Form,
//   Input,
//   Table,
//   Spinner,
//   AccordionItem,
//   AccordionHeader,
//   AccordionBody,
//   UncontrolledAccordion,
//   CardTitle,
//   CardSubtitle,
// } from "reactstrap";
// import RangeSlider from "react-bootstrap-range-slider";
// import {
//   CoinClassNames,
//   EventMap,
//   MinimumAmount,
// } from "../../../blockchain/constants";
// import useAddDeposit from "../../../blockchain/hooks/active-deposits/useAddDeposit";
// import useWithdrawDeposit from "../../../blockchain/hooks/active-deposits/useWithdrawDeposit";
// import {
//   diamondAddress,
//   isTransactionLoading,
// } from "../../../blockchain/stark-constants";
// import {
//   BNtoNum,
//   currentDepositInterestRate,
//   depositInterestAccrued,
// } from "../../../blockchain/utils";
// import TxHistoryTable from "../../dashboard/tx-history-table";
// import { useTransactionReceipt } from "@starknet-react/core";
// import MySpinner from "../../mySpinner";
// import { TxToastManager } from "../../../blockchain/txToastManager";

// const BorrowData = ({
//   asset,
//   modal_add_active_deposit,
//   tog_add_active_deposit,
//   modal_withdraw_active_deposit,
//   tog_withdraw_active_deposit,
//   depositRequestSel,
//   withdrawDepositTransactionDone,
//   historicalAPRs,
// }: {
//   asset: any;
//   modal_add_active_deposit: any;
//   tog_add_active_deposit: any;
//   modal_withdraw_active_deposit: any;
//   tog_withdraw_active_deposit: any;
//   depositRequestSel: any;
//   withdrawDepositTransactionDone: any;
//   historicalAPRs: any;
// }) => {
//   console.log(asset);
//   const {
//     DepositAmount,
//     handleApprove,
//     setDepositAmount,
//     setDepositCommit,
//     setDepositMarket,
//     allowanceVal,
//     depositAmount,
//     depositCommit,
//     loadingApprove,
//     loadingDeposit,
//     transApprove,
//     transDeposit,
//   } = useAddDeposit(asset, diamondAddress);

//   const [action, setAction] = useState(false);

//   const { withdrawDeposit, withdrawAmount, setWithdrawAmount, transWithdraw } =
//     useWithdrawDeposit(asset, diamondAddress, asset.depositId);

//   const approveTransactionReceipt = useTransactionReceipt({
//     hash: transApprove,
//     watch: true,
//   });
//   const addDepositTransactionReceipt = useTransactionReceipt({
//     hash: transDeposit,
//     watch: true,
//   });
//   const withdrawTransactionReceipt = useTransactionReceipt({
//     hash: transWithdraw,
//     watch: true,
//   });

//   useEffect(() => {
//     console.log(
//       "approve tx receipt",
//       approveTransactionReceipt.data?.transaction_hash,
//       approveTransactionReceipt
//     );
//     TxToastManager.handleTxToast(
//       approveTransactionReceipt,
//       `Add Deposit: Approve ${depositAmount?.toFixed(4)} ${asset.market}`,
//       true
//     );
//   }, [approveTransactionReceipt]);

//   useEffect(() => {
//     console.log(
//       "borrow tx receipt",
//       addDepositTransactionReceipt.data?.transaction_hash,
//       addDepositTransactionReceipt
//     );
//     TxToastManager.handleTxToast(
//       addDepositTransactionReceipt,
//       `Deposit ${depositAmount?.toFixed(4)} ${asset.market}`
//     );
//   }, [addDepositTransactionReceipt]);

//   useEffect(() => {
//     console.log(
//       "borrow tx receipt",
//       withdrawTransactionReceipt.data?.transaction_hash,
//       withdrawTransactionReceipt
//     );
//     TxToastManager.handleTxToast(
//       withdrawTransactionReceipt,
//       `Withdraw ${withdrawAmount?.toFixed(4)} ${asset.market}`
//     );
//   }, [withdrawTransactionReceipt]);

//   const handleWithdrawDeposit = async (withdrawDeposit: any) => {
//     await withdrawDeposit();
//   };

//   const [value, setValue] = useState(50);

//   useEffect(() => {
//     const currentBalance =
//       parseFloat(BNtoNum(Number(asset.amount))) +
//       parseFloat(BNtoNum(Number(asset.acquiredYield)));
//     console.log("currentBalance", (value / 100) * currentBalance);
//     setWithdrawAmount(Number((value / 100) * currentBalance));
//   }, [value]);

//   return (
//     <div style={{ borderTop: "5px" }}>
//       <UncontrolledAccordion
//         defaultOpen="0"
//         open="false"
//         style={{
//           margin: "10px",
//           color: "black",
//           textAlign: "left",
//         }}
//       >
//         <Row
//           style={{
//             margin: "15px 1px 15px 10px",
//             alignItems: "center",
//             gap: "50px",
//           }}
//         >
//           {/* <AccordionItem style={{ padding: "20px" }}> */}
//           {/* <AccordionHeader targetId="1"> */}
//           <Col style={{ marginLeft: "-10px" }}>XXXXX1234</Col>
//           <Col style={{}}>
//             <div>
//               <img
//                 src={
//                   asset
//                     ? CoinClassNames[EventMap[asset.market.toUpperCase()]] ||
//                       asset.market.toUpperCase()
//                     : null
//                 }
//                 height="24px"
//               />
//               <div
//                 className="mr-6"
//                 style={{
//                   display: "inline-block",
//                   fontSize: "13px",
//                 }}
//                 // align="right"
//               >
//                 &nbsp; &nbsp;
//                 {EventMap[asset.market.toUpperCase()]}
//               </div>
//             </div>
//             <CardTitle tag="h5"></CardTitle>
//           </Col>
//           <Col>
//             <span style={{ fontSize: "14px", fontWeight: "600" }}>
//               {BNtoNum(Number(asset.amount))}
//             </span>
//             <div>
//               <img
//                 src={
//                   asset
//                     ? CoinClassNames[EventMap[asset.market.toUpperCase()]] ||
//                       asset.market.toUpperCase()
//                     : null
//                 }
//                 height="18px"
//               />

//               <div
//                 className="mr-6"
//                 style={{
//                   display: "inline-block",
//                   fontSize: "13px",
//                 }}
//               >
//                 &nbsp;
//                 {EventMap[asset.market.toUpperCase()]}
//               </div>
//             </div>
//           </Col>
//           <Col className="mr-4 ">
//             <span style={{ fontSize: "14px", fontWeight: "600" }}>
//               {asset &&
//                 historicalAPRs &&
//                 depositInterestAccrued(asset, historicalAPRs)}
//               &nbsp;
//               {EventMap[asset.market.toUpperCase()]}
//             </span>
//             <div
//               className="mr-6"
//               style={{
//                 display: "inline-block",
//                 fontSize: "13px",
//               }}
//             >
//               <span style={{ fontSize: "14px" }}>
//                 {asset &&
//                   historicalAPRs &&
//                   currentDepositInterestRate(asset, historicalAPRs)}
//                 %APR
//               </span>
//             </div>
//           </Col>
//           <Col className="mr-4 ">
//             <div
//               className="mr-6"
//               style={{
//                 display: "inline-block",
//                 fontSize: "14px",
//               }}
//             >
//               {asset.commitment.toLowerCase()}
//             </div>
//             <CardTitle tag="h5"></CardTitle>
//           </Col>
//           <Col>Active</Col>
//           <Col>
//             <button
//               style={{
//                 backgroundColor: "white",
//                 borderRadius: "5px",
//                 padding: "8px 15px",
//               }}
//               onClick={() => {
//                 setAction(!action);
//               }}
//             >
//               Actions
//             </button>
//           </Col>
//           {/* <Col className="mr-4 ">
//             <div>
//               <img
//                 src={
//                   CoinClassNames[EventMap[asset.market.toUpperCase()]] ||
//                   asset.market.toUpperCase()
//                 }
//                 height="18px"
//               />

//               <div
//                 className="mr-6"
//                 style={{
//                   display: "inline-block",
//                   fontSize: "18px",
//                 }}
//                 // align="right"
//               >
//                 &nbsp; &nbsp;
//                 {EventMap[asset.market.toUpperCase()]}
//               </div>
//             </div>
//             <CardTitle tag="h5"></CardTitle>

//             <CardSubtitle className=" text-muted" tag="h6">
//               <span style={{ fontSize: "14px" }}>
//                 &nbsp; &nbsp;&nbsp;{" "}
//                 {(
//                   parseFloat(BNtoNum(Number(asset.amount))) +
//                   parseFloat(BNtoNum(Number(asset.acquiredYield)))
//                 ).toFixed(6)}
//               </span>
//               &nbsp; &nbsp;
//             </CardSubtitle>
//           </Col> */}
//           {/* </AccordionHeader> */}
//           {/* <AccordionBody accordionId="1"> */}
//           {action ? (
//             <div style={{ borderWidth: 1 }}>
//               <CardBody>
//                 <div>
//                   <div className="mb-4 ">
//                     <Row>
//                       <Col lg="4 mb-3">
//                         <div
//                           className="block-example border"
//                           style={{
//                             padding: "15px",
//                             borderRadius: "5px",
//                           }}
//                         >
//                           <div className="mb-3">
//                             {/* <label className="card-radio-label mb-2"> */}
//                             <Button
//                               className="btn-block btn-md"
//                               color={
//                                 modal_add_active_deposit === true
//                                   ? "light"
//                                   : "outline-light"
//                               }
//                               onClick={() => {
//                                 tog_add_active_deposit();
//                               }}
//                             >
//                               Add to Deposit
//                             </Button>
//                             &nbsp; &nbsp;
//                             <Button
//                               className="btn-block btn-md"
//                               color={
//                                 modal_withdraw_active_deposit === true
//                                   ? "light"
//                                   : "outline-light"
//                               }
//                               onClick={() => {
//                                 tog_withdraw_active_deposit();
//                               }}
//                             >
//                               Withdraw Deposit
//                             </Button>
//                           </div>
//                           {modal_add_active_deposit && (
//                             <Form>
//                               <div className="row mb-4">
//                                 <Col sm={12}>
//                                   <Input
//                                     type="text"
//                                     className="form-control"
//                                     id="horizontal-password-Input"
//                                     placeholder={
//                                       depositRequestSel
//                                         ? `Minimum amount =  ${MinimumAmount[depositRequestSel]}`
//                                         : "Amount"
//                                     }
//                                     onChange={(event) => {
//                                       setDepositAmount(
//                                         Number(event.target.value)
//                                       );
//                                       setDepositCommit(asset.commitmentIndex);
//                                       setDepositMarket(asset.marketAddress);
//                                     }}
//                                   />
//                                 </Col>
//                               </div>

//                               <div className="d-grid gap-2">
//                                 {allowanceVal < (depositAmount as number) ? (
//                                   <Button
//                                     color="primary"
//                                     className="w-md"
//                                     disabled={
//                                       depositCommit === undefined ||
//                                       loadingApprove ||
//                                       loadingDeposit ||
//                                       (depositAmount as number) <
//                                         MinimumAmount[asset]
//                                     }
//                                     onClick={(e) => handleApprove(asset)}
//                                   >
//                                     {/* setApproveStatus(transactions[0]?.status); */}
//                                     {!(
//                                       loadingApprove ||
//                                       isTransactionLoading(
//                                         approveTransactionReceipt
//                                       )
//                                     ) ? (
//                                       "Approve"
//                                     ) : (
//                                       <MySpinner text="Approvin token" />
//                                     )}
//                                   </Button>
//                                 ) : (
//                                   <Button
//                                     color="primary"
//                                     className="w-md"
//                                     disabled={
//                                       depositCommit === undefined ||
//                                       loadingApprove ||
//                                       loadingDeposit ||
//                                       (depositAmount as number) <
//                                         MinimumAmount[asset]
//                                     }
//                                     onClick={(e) => DepositAmount(asset)}
//                                   >
//                                     {!(
//                                       loadingApprove ||
//                                       isTransactionLoading(
//                                         addDepositTransactionReceipt
//                                       )
//                                     ) ? (
//                                       "Deposit"
//                                     ) : (
//                                       <MySpinner text="Adding Deposit" />
//                                     )}
//                                   </Button>
//                                 )}
//                               </div>
//                             </Form>
//                           )}
//                           {modal_withdraw_active_deposit && (
//                             <Form>
//                               <div className="row mb-4">
//                                 <Col sm={12}>
//                                   <Input
//                                     type="text"
//                                     className="form-control"
//                                     id="horizontal-password-Input"
//                                     placeholder="Amount"
//                                     onChange={(event) => {
//                                       setWithdrawAmount(
//                                         Number(event.target.value)
//                                       );
//                                     }}
//                                     value={withdrawAmount}
//                                   />
//                                   <RangeSlider
//                                     value={value}
//                                     step={25}
//                                     tooltip="on"
//                                     tooltipLabel={(v) => `${v} %`}
//                                     onChange={(changeEvent) =>
//                                       setValue(
//                                         parseFloat(changeEvent.target.value)
//                                       )
//                                     }
//                                     style={{
//                                       width: "100%",
//                                       marginTop: "12px",
//                                     }}
//                                   />
//                                 </Col>
//                               </div>

//                               <div className="d-grid gap-2">
//                                 <Button
//                                   className="w-md"
//                                   disabled={(depositAmount as number) <= 0}
//                                   onClick={() => {
//                                     handleWithdrawDeposit(withdrawDeposit);
//                                   }}
//                                   style={{
//                                     color: "#4B41E5",
//                                   }}
//                                 >
//                                   {!isTransactionLoading(
//                                     withdrawTransactionReceipt
//                                   ) ? (
//                                     "Withdraw Deposit"
//                                   ) : (
//                                     <MySpinner text="Withdrawing Deposit" />
//                                   )}
//                                 </Button>
//                               </div>
//                             </Form>
//                           )}
//                         </div>
//                       </Col>
//                       <Col lg="8">
//                         {
//                           <TxHistoryTable
//                             asset={asset}
//                             type="deposits"
//                             market={asset.market}
//                             observables={[
//                               withdrawTransactionReceipt,
//                               addDepositTransactionReceipt,
//                             ]}
//                           />
//                         }
//                       </Col>
//                     </Row>
//                   </div>
//                 </div>
//               </CardBody>
//             </div>
//           ) : null}

//           {/* </AccordionBody> */}
//           {/* </AccordionItem> */}
//         </Row>
//         <hr style={{ color: "#00000080" }} />
//       </UncontrolledAccordion>
//     </div>
//   );
// };
// export default BorrowData;
