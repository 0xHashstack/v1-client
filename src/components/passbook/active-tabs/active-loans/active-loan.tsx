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
import { CoinClassNames, EventMap } from "../../../../blockchain/constants";
import {
  diamondAddress,
  isTransactionLoading,
  tokenAddressMap,
} from "../../../../blockchain/stark-constants";
import { TxToastManager } from "../../../../blockchain/txToastManager";
import { BNtoNum, borrowInterestAccrued } from "../../../../blockchain/utils";
import OffchainAPI from "../../../../services/offchainapi.service";
import TxHistoryTable from "../../../dashboard/tx-history-table";
import MySpinner from "../../../mySpinner";
import SwapToLoan from "../swaps/swap-to-loan";
import AddToCollateral from "./add-to-collateral";
import Repay from "./repay";

const ActiveLoan = ({
  asset,
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
  const [borrowInterest, setBorrowInterest] = useState<string>();
  useEffect(() => {
    setBorrowInterest(borrowInterestAccrued(asset));
  }, []);

  return (
    <div key={key} style={{ borderTop: "5px" }}>
      <UncontrolledAccordion
        defaultOpen="0"
        open="1"
        style={{ margin: "20px" }}
      >
        <Row>
          <AccordionItem style={{ padding: "20px" }}>
            <AccordionHeader targetId="1">
              <Col className="mr-4 ">
                <Card className="mb-1" style={{ marginTop: "20px" }}>
                  <CardBody>
                    <div>
                      <img
                        src={
                          CoinClassNames[
                            EventMap[asset.loanMarket.toUpperCase()]
                          ] || asset.loanMarket.toUpperCase()
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
                        {EventMap[asset.loanMarket.toUpperCase()]}
                      </div>
                    </div>
                    <CardTitle tag="h5"></CardTitle>
                    <CardSubtitle className=" text-muted" tag="h6">
                      <span style={{ fontSize: "14px" }}>
                        &nbsp; &nbsp;&nbsp;{" "}
                        {parseFloat(BNtoNum(Number(asset.loanAmount))).toFixed(
                          6
                        )}
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
                  </CardBody>
                </Card>
              </Col>

              <Col className="mr-4 ">
                <Card className="mb-1" style={{ marginTop: "20px" }}>
                  <CardBody>
                    <div>
                      <div
                        className="mr-6"
                        style={{
                          display: "inline-block",
                          fontSize: "18px",
                        }}
                        // align="right"
                      >
                        {parseFloat(
                          BNtoNum(Number(asset.loanInterest))
                        ).toFixed(6)}
                        &nbsp;
                        {EventMap[asset.loanMarket.toUpperCase()]}
                      </div>
                    </div>
                    <CardTitle tag="h5"></CardTitle>

                    <CardSubtitle className=" text-muted" tag="h6">
                      <span style={{ fontSize: "14px" }}>
                        &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                        {asset.interestRate}%APR
                      </span>
                      &nbsp; &nbsp;
                    </CardSubtitle>
                  </CardBody>
                </Card>
              </Col>
              <Col className="mr-4 ">
                <Card className="mb-1" style={{ marginTop: "20px" }}>
                  <CardBody>
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
                        {parseFloat(
                          BNtoNum(Number(asset.collateralAmount))
                        ).toFixed(6)}
                      </span>
                      &nbsp; &nbsp;
                    </CardSubtitle>
                  </CardBody>
                </Card>
              </Col>

              <Col className="mr-4 ">
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
              </Col>

              <Col className="mr-4 ">
                <Card className="mb-1" style={{ marginTop: "20px" }}>
                  <CardBody>
                    <div
                      className="mr-6"
                      style={{
                        display: "inline-block",
                        fontSize: "14px",
                      }}
                      // align="right"
                    >
                      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;{" "}
                      {asset.commitment}
                    </div>
                    <CardTitle tag="h5"></CardTitle>
                  </CardBody>
                </Card>
              </Col>
            </AccordionHeader>
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

                            {collateral_active_loan &&
                              loanActionTab === "0" && (
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
                                      asset.isSwapped ||
                                      handleSwapTransactionDone
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
          </AccordionItem>
        </Row>
      </UncontrolledAccordion>
    </div>
  );
};

export default ActiveLoan;
