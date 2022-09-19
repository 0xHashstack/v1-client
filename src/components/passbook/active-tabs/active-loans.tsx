import { useStarknet } from "@starknet-react/core";
import classNames from "classnames";
import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Form,
  Input,
  Table,
  Nav,
  NavItem,
  NavLink,
  Spinner,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  UncontrolledAccordion,
  CardTitle,
  CardSubtitle,
} from "reactstrap";
import {
  CoinClassNames,
  EventMap,
  MinimumAmount,
} from "../../../blockchain/constants";
import { BNtoNum } from "../../../blockchain/utils";
import TxHistoryTable from "../../dashboard/tx-history-table";

const ActiveLoansTab = ({
  activeLoansData,
  customActiveTabs,
  isTransactionDone,
  depositRequestSel,
  // inputVal1,
  removeBodyCss,
  setCustomActiveTabs,
}: {
  activeLoansData: any;
  customActiveTabs: any;
  isTransactionDone: any;
  depositRequestSel: any;
  // inputVal1: any;
  removeBodyCss: () => void;
  setCustomActiveTabs: any;
}) => {
  const [loanActionTab, setLoanActionTab] = useState("0");
  const { account } = useStarknet();

  const [handleRepayTransactionDone, setHandleRepayTransactionDone] =
    useState(false);
  const [
    handleWithdrawLoanTransactionDone,
    setHandleWithdrawLoanTransactionDone,
  ] = useState(false);
  const [swapOption, setSwapOption] = useState();
  const [handleSwapTransactionDone, setHandleSwapTransactionDone] =
    useState(false);
  const [handleSwapToLoanTransactionDone, setHandleSwapToLoanTransactionDone] =
    useState(false);
  const [modal_add_collateral, setmodal_add_collateral] = useState(false);

  const [collateral_active_loan, setCollateralActiveLoan] = useState(true);
  const [withdraw_active_loan, setWithdrawActiveLoan] = useState(false);
  const [repay_active_loan, setReapyActiveLoan] = useState(false);
  const [swap_to_active_loan, setSwapToActiveLoan] = useState(false);
  const [swap_active_loan, setSwapActiveLoan] = useState(true);
  const [inputVal1, setInputVal1] = useState(0);

  const toggleLoanAction = (tab: string) => {
    if (loanActionTab !== tab) {
      setLoanActionTab(tab);
    }
  };

  const toggleCustoms = (tab: string) => {
    if (customActiveTabs !== tab) {
      setCustomActiveTabs(tab);
    }
  };
  function tog_repay_active_loan() {
    setCollateralActiveLoan(false);
    setReapyActiveLoan(true);
    setWithdrawActiveLoan(false);
    setSwapToActiveLoan(false);
    setSwapActiveLoan(false);
    removeBodyCss();
  }

  function tog_add_collateral() {
    setmodal_add_collateral(!modal_add_collateral);
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
  const handleSwapOptionChange = (e: any) => {
    setSwapOption(e.target.value);
  };

  const handleCollateral = (
    loanMarket: string,
    commitment: string,
    collateralMarket: string
  ) => {};

  const handleRepay = (loanMarket: string, commitment: string) => {};

  // asset.loanMarket,
  // asset.commitment
  const handleSwap = (loanMarket: string, commitment: string) => {};

  // asset.loanMarket,
  // asset.commitment
  const handleWithdrawLoan = (loanMarket: string, commitment: string) => {};

  // asset.loanMarket,
  // asset.commitment
  const handleSwapToLoan = (loanMarket: string, commitment: string) => {};
  return (
    <div className="table-responsive  mt-3">
      <Table className="table table-nowrap align-middle mb-0">
        <thead>
          <tr>
            <th scope="col"> &nbsp; &nbsp; &nbsp; Borrow Market</th>
            <th scope="col"> &nbsp; &nbsp; &nbsp;Interest</th>
            <th scope="col"> &nbsp; &nbsp; &nbsp;Collateral</th>
            <th scope="col"> &nbsp; &nbsp; &nbsp;Current Balance</th>
            <th scope="col"> &nbsp; &nbsp; &nbsp;Commitment</th>
            {/* <th scope="col" colSpan={2}>Interest</th> */}
          </tr>
        </thead>
      </Table>
      {Array.isArray(activeLoansData) && activeLoansData.length > 0 ? (
        activeLoansData.map((asset, key) => {
          return (
            <div key={key}>
              <UncontrolledAccordion defaultOpen="0" open="1">
                <Row>
                  <AccordionItem style={{ border: "2px" }}>
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
                                {parseFloat(
                                  BNtoNum(Number(asset.loanAmount))
                                ).toFixed(6)}
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
                                    EventMap[
                                      asset.collateralMarket.toUpperCase()
                                    ]
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
                                    EventMap[
                                      asset.currentLoanMarket.toUpperCase()
                                    ]
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
                                {
                                  EventMap[
                                    asset.currentLoanMarket.toUpperCase()
                                  ]
                                }
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
                              {EventMap[asset.commitment]}
                            </div>
                            <CardTitle tag="h5"></CardTitle>
                          </CardBody>
                        </Card>
                      </Col>
                    </AccordionHeader>
                    <AccordionBody accordionId="1">
                      <div style={{ borderWidth: 1 }}>
                        <CardBody>
                          <form>
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
                                          <Nav
                                            tabs
                                            className="nav-tabs-custom mb-1"
                                          >
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
                                          // className={`btn-block btn-md ${classnames(
                                          //   {
                                          //     active:
                                          //       modal_add_collateral ===
                                          //       true,
                                          //   }
                                          // )}`}
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
                                        <Form>
                                          <div className="row mb-3">
                                            <Col sm={12}>
                                              <Input
                                                type="text"
                                                className="form-control"
                                                id="horizontal-password-Input"
                                                placeholder={
                                                  depositRequestSel
                                                    ? `Minimum amount =  ${MinimumAmount[depositRequestSel]}`
                                                    : "Amount"
                                                }
                                                onChange={(event) => {
                                                  setInputVal1(
                                                    Number(event.target.value)
                                                  );
                                                }}
                                              />
                                            </Col>
                                          </div>

                                          <div className="d-grid gap-2">
                                            <Button
                                              className="w-md"
                                              disabled={
                                                isTransactionDone ||
                                                inputVal1 <= 0
                                              }
                                              onClick={() => {
                                                handleCollateral(
                                                  asset.loanMarket,
                                                  asset.commitment,
                                                  asset.collateralMarket
                                                );
                                              }}
                                            >
                                              {!isTransactionDone ? (
                                                "Add to Collateral"
                                              ) : (
                                                <Spinner>Loading...</Spinner>
                                              )}
                                            </Button>
                                          </div>
                                        </Form>
                                      )}

                                    {repay_active_loan &&
                                      loanActionTab === "0" && (
                                        <Form>
                                          <div className="row mb-3">
                                            <Col sm={12}>
                                              <Input
                                                type="text"
                                                className="form-control"
                                                id="horizontal-password-Input"
                                                placeholder="Amount"
                                                onChange={(event) => {
                                                  setInputVal1(
                                                    Number(event.target.value)
                                                  );
                                                }}
                                              />
                                            </Col>
                                          </div>

                                          <div className="d-grid gap-2">
                                            <Button
                                              className="w-md"
                                              disabled={
                                                handleRepayTransactionDone ||
                                                inputVal1 < 0
                                              }
                                              onClick={() => {
                                                handleRepay(
                                                  asset.loanMarket,
                                                  asset.commitment
                                                );
                                              }}
                                              style={{
                                                color: "#4B41E5",
                                              }}
                                            >
                                              {!handleRepayTransactionDone ? (
                                                "Repay Loan"
                                              ) : (
                                                <Spinner>Loading...</Spinner>
                                              )}
                                            </Button>
                                          </div>
                                        </Form>
                                      )}

                                    {withdraw_active_loan &&
                                      loanActionTab === "0" && (
                                        <Form>
                                          <div className="row mb-3">
                                            <Col sm={12}>
                                              <Input
                                                type="text"
                                                className="form-control"
                                                id="horizontal-password-Input"
                                                placeholder="Amount"
                                                onChange={(event) => {
                                                  setInputVal1(
                                                    Number(event.target.value)
                                                  );
                                                }}
                                              />
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
                                                handleWithdrawLoan(
                                                  asset.loanMarket,
                                                  asset.commitment
                                                );
                                              }}
                                              style={{
                                                color: "#4B41E5",
                                              }}
                                            >
                                              {!handleWithdrawLoanTransactionDone ? (
                                                "Withdraw Loan"
                                              ) : (
                                                <Spinner>Loading...</Spinner>
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
                                                onChange={
                                                  handleSwapOptionChange
                                                }
                                              >
                                                <option hidden>
                                                  Swap Market
                                                </option>
                                                <option value={"SXP"}>
                                                  SXP
                                                </option>
                                                <option value={"CAKE"}>
                                                  CAKE
                                                </option>
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
                                              handleSwap(
                                                asset.loanMarket,
                                                asset.commitment
                                              );
                                            }}
                                            style={{
                                              color: "#4B41E5",
                                            }}
                                          >
                                            {!handleSwapTransactionDone ? (
                                              "Swap Loan"
                                            ) : (
                                              <Spinner>Loading...</Spinner>
                                            )}
                                          </Button>
                                        </div>
                                      </Form>
                                    )}

                                    {swap_to_active_loan &&
                                      loanActionTab === "1" && (
                                        <Form>
                                          <div className="d-grid gap-2">
                                            <Button
                                              // color="primary"

                                              className="w-md mr-2"
                                              disabled={
                                                !asset.isSwapped ||
                                                handleSwapToLoanTransactionDone
                                              }
                                              onClick={() => {
                                                handleSwapToLoan(
                                                  asset.loanMarket,
                                                  asset.commitment
                                                );
                                              }}
                                              style={{
                                                color: "#4B41E5",
                                              }}
                                            >
                                              {!handleSwapToLoanTransactionDone ? (
                                                "Swap To Loan"
                                              ) : (
                                                <Spinner>Loading...</Spinner>
                                              )}
                                            </Button>
                                          </div>
                                        </Form>
                                      )}
                                  </div>
                                </Col>
                                <Col lg="8">
                                  {
                                    <TxHistoryTable
                                      asset={asset}
                                      type="loans"
                                      market={asset.loanMarket}
                                      isTrasactionDone={isTransactionDone}
                                    />
                                  }
                                </Col>
                              </Row>
                            </div>
                          </form>
                        </CardBody>
                      </div>
                    </AccordionBody>
                  </AccordionItem>
                </Row>
              </UncontrolledAccordion>
            </div>
          );
        })
      ) : (
        <div>No records found</div>
      )}
    </div>
  );
};

export default ActiveLoansTab;
