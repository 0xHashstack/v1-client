import {
  useAccount,
  useContract,
  useStarknetCall,
  useStarknetExecute,
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
  FormGroup,
  FormText,
  Input,
  InputGroup,
  Modal,
  Nav,
  NavItem,
  NavLink,
  Row,
  Spinner,
  UncontrolledAccordion,
} from "reactstrap";
import {
  CoinClassNames,
  EventMap,
  MinimumAmount,
} from "../../../blockchain/constants";
import {
  diamondAddress,
  ERC20Abi,
  isTransactionLoading,
  tokenAddressMap,
} from "../../../blockchain/stark-constants";
import { TxToastManager } from "../../../blockchain/txToastManager";
import {
  BNtoNum,
  borrowInterestAccrued,
  currentBorrowInterestRate,
  GetErrorText,
  NumToBN,
} from "../../../blockchain/utils";
import OffchainAPI from "../../../services/offchainapi.service";
import TxHistoryTable from "../../dashboard/tx-history-table";
import MySpinner from "../../mySpinner";
import SwapToLoan from "./swaps/swap-to-loan";
import AddToCollateral from "./add-to-collateral";
import Repay from "./repay";

import Image from "next/image";
import Slider from "react-custom-slider";
import Downarrow from "../../../assets/images/ArrowDownDark.svg";
import UpArrow from "../../../assets/images/ArrowUpDark.svg";
import { ICoin } from "../../dashboard/dashboard-body";
import { Abi, uint256 } from "starknet";
import useAddDeposit from "../../../blockchain/hooks/active-deposits/useAddDeposit";
import { toast } from "react-toastify";
import classnames from "classnames";
import useWithdrawCollateral from "../../../blockchain/hooks/repaid-loans/useWithdrawCollateral";
import useRepay from "../../../blockchain/hooks/active-borrow/useRepay";

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
  const Coins: ICoin[] = [
    { name: "USDT",icon: "mdi-bitcoin", },
    { name: "USDC",icon: "mdi-ethereum",},
    { name: "BTC",icon: "mdi-bitcoin",},
    { name: "ETH", icon: "mdi-ethereum" },
    { name: "DAI", icon: "mdi-dai" },
  ];

  const {
    DepositAmount,
    handleApprove,
    setDepositAmount,
    setDepositCommit,
    setDepositMarket,
    allowanceVal,
    depositAmount,
    depositCommit,
    loadingApprove,
    loadingDeposit,
    transApprove,
    transDeposit,
  }: {
    DepositAmount: any;
    handleApprove: any;
    setDepositAmount: any;
    setDepositCommit: any;
    setDepositMarket: any;
    allowanceVal: any;
    depositAmount: any;
    depositCommit: any;
    loadingApprove: any;
    loadingDeposit: any;
    transApprove: any;
    transDeposit: any;
  } = useAddDeposit(asset, diamondAddress);

  const { repayAmount, setRepayAmount, executeRepay } = useRepay(asset, diamondAddress);

  const { withdrawCollateral } = useWithdrawCollateral(diamondAddress, asset.loanId);

  const [tokenName, setTokenName] = useState("BTC");
  const [marketTokenName, setMarketTokenName] = useState("BTC");
  const [title, setTitle] = useState({
    amount: "Borrowd",
    label: "Stake",
  });
  const [isCollateralActions, setIsCollateralActions] = useState(false);
  const [isSelfLiquidate, setIsSelfLiquidate] = useState(false);
  const [customActiveTab, setCustomActiveTab] = useState("1");
  const [modal_deposit, setmodal_deposit] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [dropDownArrow, setDropDownArrow] = useState(Downarrow);
  const [dropDownArrowTwo, setDropDownArrowTwo] = useState(Downarrow);
  const [dropDownArrowThree, setDropDownArrowThree] = useState(Downarrow);
  const [marketDropDown, setMarketDropDown] = useState(false);
  const [actionLabel, setActionLabel] = useState("Stake");

  const [borrowInterest, setBorrowInterest] = useState<string>("");
  const [currentBorrowInterest, setCurrentBorrowInterest] = useState<string>();

  const [selection, setSelection] = useState("Spend Borrow");
  const [selectionTwo, setSelectionTwo] = useState("Add Collateral");

  const [idDropDown, setIdDropDown] = useState(false);
  const [idDropDownArrow, setIdDropDownArrow] = useState(Downarrow);

  const [value, setValue] = useState(0);
  const [commitPeriod, setCommitPeriod] = useState(0);
  const [stakeDropDown, setStakeDropDown] = useState(false);
  // const [transDeposit, setTransDeposit] = useState("");

  const { contract } = useContract({
    abi: ERC20Abi as Abi,
    address: tokenAddressMap[tokenName] as string,
  });

  const {
    data: dataAllowance,
    loading: loadingAllowance,
    error: errorAllowance,
    refresh: refreshAllowance,
  } = useStarknetCall({
    contract: contract,
    method: "allowance",
    args: [account, diamondAddress],
    options: {
      watch: true,
    },
  });

  const {
    data: dataBalance,
    loading: loadingBalance,
    error: errorBalance,
    refresh: refreshBalance,
  } = useStarknetCall({
    contract: contract,
    method: "balanceOf",
    args: [account],
    options: {
      watch: true,
    },
  });

  const {
    data: dataUSDC,
    loading: loadingUSDC,
    error: errorUSDC,
    reset: resetUSDC,
    execute: USDC,
  } = useStarknetExecute({
    calls: {
      contractAddress: tokenAddressMap[tokenName] as string,
      entrypoint: "approve",
      calldata: [diamondAddress, NumToBN(depositAmount, 18), 0],
    },
  });

  const requestDepositTransactionReceipt = useTransactionReceipt({
    hash: transDeposit,
    watch: true,
  });

  const handleWithdrawCollateral = async (withdrawCollateral) => {
    await withdrawCollateral();
  }

  const tog_center = async () => {
    setmodal_deposit(!modal_deposit);
    // removeBodyCss();
  };

  const toggleDropdown = () => {
    setDropDown(!dropDown);
    setDropDownArrow(dropDown ? Downarrow : UpArrow);
    // disconnectEvent(), connect(connector);
  };

  const toggleDropdownTwo = () => {
    setStakeDropDown(!stakeDropDown);
    setDropDownArrowTwo(stakeDropDown ? Downarrow : UpArrow);
  };

  const toggleDropdownThree = () => {
    setMarketDropDown(!marketDropDown);
    setDropDownArrowThree(marketDropDown ? Downarrow : UpArrow);
  };

  const handleBalanceChange = async () => {
    await refreshAllowance();
    await refreshBalance();
  };

  const handleDepositAmountChange = (e: any) => {
    if (e.target.value) setDepositAmount(Number(e.target.value));
    else setDepositAmount(0);
  };

  function isInvalid() {
    return (
      depositAmount < MinimumAmount[tokenName] ||
      depositAmount >
        Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) / 10 ** 18
    );
  }

  const handleDeposit = async (asset: string) => {
    if (
      !tokenAddressMap[asset] &&
      !depositAmount &&
      !diamondAddress &&
      !commitPeriod
    ) {
      toast.error(`${GetErrorText(`Invalid request`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
    if (depositAmount === 0) {
      // approve the transfer
      toast.error(`${GetErrorText(`Can't deposit 0 of ${asset}`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
    try {
      let val = await executeDeposit();
      // setTransDeposit(val.transaction_hash);
    } catch (err) {
      console.log(err, "err deposit");
    }
    if (errorDeposit) {
      toast.error(`${GetErrorText(`Deposit for ${asset} failed`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
  };

  const selectionAction = (value: string) => {
    setSelection(value);
    setDropDown(false);
    setDropDownArrow(Downarrow);

    if (value === "Self Liquidate") {
      setTitle({
        amount: "Repayment",
        label: "Stake",
      });
      setIsSelfLiquidate(true);
    }
    if (value === "Withdraw Partial Borrow") {
      setTitle({
        amount: "Borrowed",
        label: "Starknet",
      });
      setIsSelfLiquidate(false);
    }
    if (value === "Add Collateral") {
      setTitle({
        amount: "Borrowed",
        label: "Starknet",
      });
      setIsSelfLiquidate(false);
    }
    if (value === "Withdraw Collateral") {
      setTitle({
        amount: "Borrowed",
        label: "Starknet",
      });
      setIsSelfLiquidate(false);
    }
  };

  const handleAction = (value: string) => {
    if (value === "Stake") {
      setActionLabel("Stake");
    }
    if (value === "Swap") {
      setActionLabel("Swap");
    }
    if (value === "Trade") {
      setActionLabel("Trade");
    }
    setStakeDropDown(false);
    setDropDownArrowTwo(Downarrow);
  };

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
          color: "white",
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
          <Col style={{ marginLeft: "-10px" }}>ID{asset.loanId}</Col>

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

          <Col className="mr-4 ">
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              {parseFloat(BNtoNum(Number(asset.loanAmount)))}
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
                backgroundColor: "rgb(57, 61, 79)",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "8px 15px",
              }}
              onClick={() => {
                setmodal_deposit(true);
              }}
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

      <Modal
        style={{ width: "548px", height: "603px" }}
        isOpen={modal_deposit}
        toggle={() => {
          tog_center();
        }}
        centered
      >
        <div
          className="modal-body"
          style={{
            backgroundColor: "#1D2131",
            color: "white",
            padding: "40px",
          }}
        >
          {account ? (
            <Form>
              <div style={{ minWidth: "30vw" }}>
                <Col sm={8}>
                  <Nav
                    tabs
                    className="nav-tabs-custom"
                    style={{
                      borderBottom: "0px",
                      gap: "10px",
                      margin: "12px auto",
                    }}
                  >
                    <NavItem>
                      <NavLink
                        style={{
                          cursor: "pointer",
                          color: "black",
                          border: "1px solid #000",
                          borderRadius: "5px",
                        }}
                        className={classnames({
                          active: customActiveTab === "1",
                        })}
                        onClick={() => {
                          setCustomActiveTab("1");
                          setIsCollateralActions(false);
                          setSelection("Spend Borrow");
                        }}
                      >
                        <span className="d-none d-sm-block">
                          Borrow Actions
                        </span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{
                          cursor: "pointer",
                          color: "black",
                          border: "1px solid #000",
                          borderRadius: "5px",
                        }}
                        className={classnames({
                          active: customActiveTab === "2",
                        })}
                        onClick={() => {
                          setCustomActiveTab("2");
                          setIsCollateralActions(true);
                          setSelection("Add Collateral");
                        }}
                      >
                        <span className="d-none d-sm-block">
                          Collateral Actions
                        </span>
                      </NavLink>
                    </NavItem>
                  </Nav>
                </Col>

                <div
                  style={{
                    fontSize: "12px",
                    paddingTop: "10px",
                    color: "rgb(111, 111, 111)",
                    display: "flex",
                    gap: "10px",
                    width: "100%",
                  }}
                >
                  Borrow ID = {asset.loanId}
                  <Image
                    style={{ cursor: "pointer" }}
                    src={idDropDownArrow}
                    alt="Picture of the author"
                    width="16px"
                    height="16px"
                    onClick={() => {
                      setIdDropDown(!idDropDown);
                      setIdDropDownArrow(idDropDown ? Downarrow : UpArrow);
                    }}
                  />
                </div>

                {!isCollateralActions ? (
                  <>
                    <div style={{ display: "block", maxWidth: "420px" }}>
                      <label
                        style={{
                          width: "420px",
                          margin: "5px auto",
                          marginBottom: "20px",
                          padding: "5px 10px",
                          fontSize: "18px",
                          borderRadius: "5px",
                          border: "2px solid rgb(57, 61, 79)",
                          fontWeight: "200",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: "14px",
                            fontWeight: "400",
                          }}
                        >
                          <div>&nbsp;&nbsp;{selection}</div>
                          <div
                            style={{
                              marginRight: "20px",
                              marginTop: "3px",
                              marginBottom: "0",
                              cursor: "pointer",
                            }}
                          >
                            <Image
                              onClick={toggleDropdown}
                              src={dropDownArrow}
                              alt="Picture of the author"
                              width="20px"
                              height="20px"
                            />
                          </div>
                        </div>
                      </label>

                      {selection === "Spend Borrow" ? (
                        <div
                          style={{
                            display: "flex",
                            justifyItems: "center",
                            gap: "20px",
                          }}
                        >
                          <label
                            style={{
                              width: "100px",
                              height: "45px",

                              padding: "10px 10px",
                              fontSize: "13px",
                              borderRadius: "5px",
                              border: "2px solid rgb(57, 61, 79)",
                              fontWeight: "200",
                              display: "flex",
                              gap: "10px",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div style={{ textAlign: "center" }}>
                              {actionLabel}
                            </div>
                            <Image
                              onClick={toggleDropdownTwo}
                              style={{ cursor: "pointer" }}
                              src={dropDownArrowTwo}
                              alt="Picture of the author"
                              width="20px"
                              height="20px"
                            />
                          </label>

                          <label
                            style={{
                              width: "300px",
                              padding: "5px 10px",
                              fontSize: "18px",
                              borderRadius: "5px",
                              border: "2px solid rgb(57, 61, 79)",
                              fontWeight: "200",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <div>
                                &nbsp;&nbsp;
                                <img
                                  src={`./yagilogo.svg`}
                                  width="60px"
                                  height="30px"
                                ></img>
                              </div>
                              <div
                                style={{
                                  marginRight: "20px",
                                  marginTop: "3px",
                                  cursor: "pointer",
                                }}
                              >
                                <Image
                                  // onClick={toggleDropdown}
                                  src={dropDownArrow}
                                  alt="Picture of the author"
                                  width="20px"
                                  height="20px"
                                />
                              </div>
                            </div>
                          </label>
                        </div>
                      ) : null}
                    </div>

                    <br />

                    {selection === "Spend Borrow" &&
                    (actionLabel === "Swap" || actionLabel === "Trade") ? (
                      <div
                        style={{
                          display: "flex",
                          fontSize: "10px",
                          color: "rgb(111, 111, 111)",
                          marginTop: "-10px",
                          marginBottom: "15px",
                        }}
                      >
                        From
                      </div>
                    ) : null}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "7px",
                        marginTop: "-20px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "12px",
                            paddingTop: "10px",
                            color: "rgb(111, 111, 111)",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          Borrow Market:
                          <span
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            &nbsp;
                            <img
                              src={`./${tokenName}.svg`}
                              width="12px"
                              height="12px"
                            ></img>
                            &nbsp;
                            <div style={{ color: "white" }}>{tokenName}</div>
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          marginRight: "20px",
                          marginTop: "3px",
                          marginBottom: "0",
                          cursor: "pointer",
                        }}
                      ></div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "7px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "rgb(111, 111, 111)",
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "15px",
                          }}
                        >
                          Borrow Amount:
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "white",
                            }}
                          >
                            &nbsp;600 USDT
                          </span>
                        </div>
                      </div>
                    </div>

                    {selection === "Self Liquidate" ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "7px",
                          marginTop: "-20px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              paddingTop: "7px",
                              color: "rgb(111, 111, 111)",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            Repayment Amount:
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                color: "white",
                              }}
                            >
                              &nbsp;0
                            </span>
                          </div>

                          <div
                            style={{
                              fontSize: "12px",
                              paddingTop: "7px",
                              color: "rgb(111, 111, 111)",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            Borrow Spent(?):
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                color: "white",
                              }}
                            >
                              &nbsp;Yes
                            </span>
                          </div>

                          <div
                            style={{
                              fontSize: "12px",
                              paddingTop: "7px",
                              color: "rgb(111, 111, 111)",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            Spent dapp:
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                color: "white",
                              }}
                            >
                              &nbsp;&nbsp;&nbsp;
                              <img src="./yagilogo.svg" width="50px" />
                            </span>
                          </div>

                          <div
                            style={{
                              fontSize: "12px",
                              paddingTop: "7px",
                              color: "rgb(111, 111, 111)",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            To:
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                color: "white",
                              }}
                            >
                              &nbsp;Swap
                            </span>
                          </div>

                          <div
                            style={{
                              fontSize: "12px",
                              paddingTop: "7px",
                              color: "rgb(111, 111, 111)",
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "10px",
                            }}
                          >
                            Spent Market:
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                color: "white",
                              }}
                            >
                              &nbsp;XRP
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {selection === "Repay Borrow" ||
                    selection === "Withdraw Partial Borrow" ? (
                      <>
                        {" "}
                        <div
                          style={{
                            display: "flex",
                            fontSize: "10px",
                            color: "rgb(111, 111, 111)",
                            marginTop: "-10px",
                            marginBottom: "15px",
                          }}
                        >
                          Repayment Amount
                        </div>
                        <FormGroup>
                          <div className="row mb-4" style={{ width: "440px" }}>
                            <Col sm={12}>
                              <InputGroup>
                                <Input
                                  style={{
                                    backgroundColor: "#1D2131",
                                    borderRight: "1px solid #rgb(57, 61, 79)",
                                  }}
                                  type="number"
                                  className="form-control"
                                  id="amount"
                                  min={MinimumAmount[asset]}
                                  placeholder={`Minimum ${MinimumAmount[asset]} ${asset}`}
                                  onChange={handleDepositAmountChange}
                                  value={depositAmount}
                                  valid={!isInvalid()}
                                />

                                {
                                  <>
                                    <Button
                                      outline
                                      type="button"
                                      className="btn btn-md w-xs"
                                      onClick={handleMax}
                                      // disabled={balance ? false : true}
                                      style={{
                                        background: "#1D2131",
                                        color: "rgb(111, 111, 111)",
                                        border: "1px solid rgb(57, 61, 79)",
                                        borderLeft: "none",
                                      }}
                                    >
                                      <span
                                        style={{ borderBottom: "2px  #fff" }}
                                      >
                                        MAX
                                      </span>
                                    </Button>
                                  </>
                                }
                              </InputGroup>

                              <div
                                style={{
                                  display: "flex",
                                  fontSize: "10px",
                                  justifyContent: "end",
                                  marginTop: "4px",
                                }}
                              >
                                Wallet Balance:&nbsp;
                                {/* {dataBalance ? (
                                  (
                                    Number(
                                      uint256.uint256ToBN(dataBalance[0])
                                    ) /
                                    10 ** 18
                                  ).toString()
                                ) : (
                                  <MySpinner />
                                )} */}
                                {/* <div style={{ color: "#76809D" }}>
                                  &nbsp;{asset}{" "}
                                </div> */}
                              </div>

                              {selection === "Repay Borrow" ? (
                                <div
                                  style={{
                                    marginLeft: "-10px",
                                    marginTop: "15px",
                                  }}
                                >
                                  <Slider
                                    handlerActiveColor="rgb(57, 61, 79)"
                                    stepSize={10}
                                    value={value}
                                    trackColor="rgb(57, 61, 79)"
                                    handlerShape="rounded"
                                    handlerColor="white"
                                    fillColor="white"
                                    trackLength={420}
                                    grabCursor={false}
                                    showMarkers="hidden"
                                    onChange={(value: any) => {
                                      setDepositAmount(
                                        (value *
                                          (Number(
                                            uint256.uint256ToBN(dataBalance[0])
                                          ) /
                                            10 ** 18)) /
                                          100
                                      );
                                      setValue(value);
                                    }}
                                    valueRenderer={(value: any) => `${value}%`}
                                    showValue={false}
                                  />
                                </div>
                              ) : null}

                              {selection === "Repay Borrow" ? (
                                <div
                                  style={{
                                    fontSize: "10px",
                                    position: "absolute",
                                    right: "12px",
                                    top: "90px",
                                  }}
                                >
                                  {value}%
                                </div>
                              ) : null}

                              {depositAmount != 0 &&
                                depositAmount >
                                  Number(
                                    uint256.uint256ToBN(
                                      dataBalance ? dataBalance[0] : 0
                                    )
                                  ) /
                                    10 ** 18 && (
                                  <FormText
                                    style={{ color: "#e97272 !important" }}
                                  >
                                    {`Amount is greater than your balance`}
                                  </FormText>
                                )}
                            </Col>
                          </div>
                        </FormGroup>
                      </>
                    ) : null}
                  </>
                ) : (
                  <>
                    <label
                      style={{
                        width: "420px",
                        margin: "5px auto",
                        marginBottom: "20px",
                        padding: "5px 10px",
                        fontSize: "18px",
                        borderRadius: "5px",
                        border: "2px solid rgb(57, 61, 79)",
                        fontWeight: "200",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "14px",
                          fontWeight: "400",
                        }}
                      >
                        <div>&nbsp;&nbsp;{selection}</div>
                        <div
                          style={{
                            marginRight: "20px",
                            marginTop: "3px",
                            marginBottom: "0",
                            cursor: "pointer",
                          }}
                        >
                          <Image
                            onClick={toggleDropdown}
                            src={dropDownArrow}
                            alt="Picture of the author"
                            width="20px"
                            height="20px"
                          />
                        </div>
                      </div>
                    </label>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "7px",
                        marginTop: "-20px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "12px",
                            paddingTop: "10px",
                            color: "rgb(111, 111, 111)",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          Borrow Market:
                          <span
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            &nbsp;
                            <img
                              src={`./${tokenName}.svg`}
                              width="12px"
                              height="12px"
                            ></img>
                            &nbsp;
                            <div style={{ color: "white" }}>{tokenName}</div>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "7px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "rgb(111, 111, 111)",
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "15px",
                          }}
                        >
                          Borrow Amount:
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "white",
                            }}
                          >
                            &nbsp;600 USDT
                          </span>
                        </div>
                      </div>
                    </div>

                    {selection === "Withdraw Collateral" ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "7px",
                          marginTop: "-10px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "rgb(111, 111, 111)",
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "15px",
                            }}
                          >
                            Borrowed Status:
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                color: "white",
                              }}
                            >
                              &nbsp;Active
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                        marginTop: "-24px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "12px",
                            paddingTop: "10px",
                            color: "rgb(111, 111, 111)",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          Collateral Market:
                          <span
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            &nbsp;
                            <img
                              src={`./${tokenName}.svg`}
                              width="12px"
                              height="12px"
                            ></img>
                            &nbsp;
                            <div style={{ color: "white" }}>{tokenName}</div>
                          </span>
                        </div>
                      </div>
                    </div>

                    {selection === "Add Collateral" ? (
                      <>
                        <div
                          style={{
                            display: "flex",
                            fontSize: "10px",
                            color: "rgb(111, 111, 111)",
                            marginTop: "-10px",
                            marginBottom: "7px",
                          }}
                        >
                          Collateral Amount
                        </div>

                        <FormGroup>
                          <div className="row mb-4" style={{ width: "440px" }}>
                            <Col sm={12}>
                              <InputGroup>
                                <Input
                                  style={{
                                    backgroundColor: "#1D2131",
                                    borderRight: "1px solid #rgb(57, 61, 79)",
                                  }}
                                  type="number"
                                  className="form-control"
                                  id="amount"
                                  min={MinimumAmount[asset]}
                                  placeholder={`Minimum ${MinimumAmount[asset]} ${asset}`}
                                  onChange={handleDepositAmountChange}
                                  value={depositAmount}
                                  valid={!isInvalid()}
                                />

                                {
                                  <>
                                    <Button
                                      outline
                                      type="button"
                                      className="btn btn-md w-xs"
                                      onClick={handleMax}
                                      // disabled={balance ? false : true}
                                      style={{
                                        background: "#1D2131",
                                        color: "rgb(111, 111, 111)",
                                        border: "1px solid rgb(57, 61, 79)",
                                        borderLeft: "none",
                                      }}
                                    >
                                      <span
                                        style={{ borderBottom: "2px  #fff" }}
                                      >
                                        MAX
                                      </span>
                                    </Button>
                                  </>
                                }
                              </InputGroup>

                              <div
                                style={{
                                  display: "flex",
                                  fontSize: "10px",
                                  justifyContent: "end",
                                  marginTop: "4px",
                                }}
                              >
                                Wallet Balance:&nbsp;
                                {/* {dataBalance ? (
                                  (
                                    Number(
                                      uint256.uint256ToBN(dataBalance[0])
                                    ) /
                                    10 ** 18
                                  ).toString()
                                ) : (
                                  <MySpinner />
                                )} */}
                                {/* <div style={{ color: "#76809D" }}>
                                  &nbsp;{asset}{" "}
                                </div> */}
                              </div>

                              <div
                                style={{
                                  fontSize: "10px",
                                  position: "absolute",
                                  right: "12px",
                                  top: "80px",
                                }}
                              >
                                {value}%
                              </div>

                              {depositAmount != 0 &&
                                depositAmount >
                                  Number(
                                    uint256.uint256ToBN(
                                      dataBalance ? dataBalance[0] : 0
                                    )
                                  ) /
                                    10 ** 18 && (
                                  <FormText
                                    style={{ color: "#e97272 !important" }}
                                  >
                                    {`Amount is greater than your balance`}
                                  </FormText>
                                )}
                            </Col>
                          </div>
                        </FormGroup>

                        <div
                          style={{
                            marginLeft: "-10px",
                            marginTop: "-15px",
                            marginBottom: "15px",
                          }}
                        >
                          <Slider
                            handlerActiveColor="rgb(57, 61, 79)"
                            stepSize={10}
                            value={value}
                            trackColor="rgb(57, 61, 79)"
                            handlerShape="rounded"
                            handlerColor="white"
                            fillColor="white"
                            trackLength={420}
                            grabCursor={false}
                            showMarkers="hidden"
                            onChange={(value: any) => {
                              setDepositAmount(
                                (value *
                                  (Number(uint256.uint256ToBN(dataBalance[0])) /
                                    10 ** 18)) /
                                  100
                              );
                              setValue(value);
                            }}
                            valueRenderer={(value: any) => `${value}%`}
                            showValue={false}
                          />
                        </div>
                      </>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "20px",
                          marginTop: "-24px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              paddingTop: "10px",
                              color: "rgb(111, 111, 111)",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            Collateral Market:
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                color: "white",
                              }}
                            >
                              &nbsp; 00.00 USDT
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {stakeDropDown ? (
                  <>
                    <div
                      style={{
                        borderRadius: "5px",
                        position: "absolute",
                        zIndex: "100",
                        top: "240px",
                        left: "40px",
                        width: "100px",
                        margin: "0px auto",
                        marginBottom: "20px",
                        padding: "5px 10px",
                        backgroundColor: "#1D2131",
                        boxShadow: "0px 0px 10px rgb(57, 61, 79)",
                      }}
                    >
                      <div
                        style={{
                          margin: "10px 0",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          fontSize: "16px",
                        }}
                      >
                        {!isCollateralActions ? (
                          <>
                            <div style={{ display: "block" }}>
                              <div
                                onClick={() => {
                                  handleAction("Stake");
                                }}
                              >
                                &nbsp;Stake
                              </div>
                              <br />
                              <div
                                onClick={() => {
                                  handleAction("Swap");
                                }}
                              >
                                &nbsp;Swap
                              </div>
                              <br />
                              <div
                                onClick={() => {
                                  handleAction("Trade");
                                }}
                              >
                                &nbsp;Trade
                              </div>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {dropDown ? (
                  <>
                    <div
                      style={{
                        borderRadius: "5px",
                        position: "absolute",
                        zIndex: "100",
                        top: "175px",
                        left: "40px",
                        width: "420px",
                        margin: "0px auto",
                        marginBottom: "20px",
                        padding: "5px 10px",
                        backgroundColor: "#1D2131",
                        boxShadow: "0px 0px 10px rgb(57, 61, 79)",
                      }}
                    >
                      <div
                        style={{
                          margin: "10px 0",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          fontSize: "16px",
                        }}
                      >
                        {!isCollateralActions ? (
                          <>
                            <div style={{ display: "block" }}>
                              <div
                                onClick={() => {
                                  selectionAction("Self Liquidate");
                                }}
                              >
                                &nbsp;Self Liquidate
                              </div>
                              <br />
                              <div
                                onClick={() => {
                                  selectionAction("Spend Borrow");
                                }}
                              >
                                &nbsp;Spend Borrow
                              </div>
                              <br />
                              <div
                                onClick={() => {
                                  selectionAction("Repay Borrow");
                                }}
                              >
                                &nbsp;Repay Borrow
                              </div>
                              <br />
                              <div
                                onClick={() => {
                                  selectionAction("Withdraw Partial Borrow");
                                }}
                              >
                                &nbsp;Withdraw Partial Borrow
                              </div>
                            </div>
                          </>
                        ) : selection === "Add Collateral" ? (
                          <div
                            onClick={() => {
                              selectionAction("Withdraw Collateral");
                            }}
                          >
                            &nbsp;Withdraw Collateral
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              selectionAction("Add Collateral");
                            }}
                          >
                            &nbsp;Add Collateral
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {marketDropDown ? (
                  <>
                    <div
                      style={{
                        borderRadius: "5px",
                        position: "absolute",
                        zIndex: "100",
                        top: "405px",
                        left: "39px",
                        width: "420px",
                        margin: "0px auto",
                        marginBottom: "20px",
                        padding: "5px 10px",
                        backgroundColor: "#1D2131",
                        boxShadow: "0px 0px 10px #00000020",
                      }}
                    >
                      {Coins.map((coin, index) => {
                        if (coin.name === marketTokenName) return <></>;
                        return (
                          <div
                            style={{
                              margin: "10px 0",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              fontSize: "16px",
                            }}
                            onClick={() => {
                              setMarketTokenName(`${coin.name}`);
                              setMarketDropDown(false);
                              setDropDownArrowThree(Downarrow);
                              handleBalanceChange();

                              // handleDepositAmountChange(0);
                            }}
                          >
                            <img
                              src={`./${coin.name}.svg`}
                              width="30px"
                              height="30px"
                            ></img>
                            <div>&nbsp;&nbsp;&nbsp;{coin.name}</div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>

              {selection === "Spend Borrow" &&
                (actionLabel === "Swap" || actionLabel === "Trade") ? (
                  <FormGroup>
                    <div className="row mb-4">
                      <Col sm={12}>
                        <div
                          style={{
                            display: "flex",
                            fontSize: "10px",
                            color: "rgb(111, 111, 111)",
                            marginTop: "-10px",
                          }}
                        >
                          To
                        </div>
                        <label
                          style={{
                            width: "420px",
                            margin: "10px auto",
                            marginBottom: "20px",
                            padding: "5px 10px",
                            fontSize: "18px",
                            borderRadius: "5px",
                            border: "2px solid rgb(57, 61, 79)",
                            fontWeight: "200",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              {" "}
                              <img
                                src={`./${marketTokenName}.svg`}
                                width="24px"
                                height="24px"
                              ></img>
                              &nbsp;&nbsp;{marketTokenName}
                            </div>
                            <div
                              style={{
                                marginRight: "20px",
                                marginTop: "3px",
                                marginBottom: "0",
                                cursor: "pointer",
                              }}
                            >
                              <Image
                                onClick={toggleDropdownThree}
                                src={dropDownArrowThree}
                                alt="Picture of the author"
                                width="20px"
                                height="20px"
                              />
                            </div>
                          </div>
                        </label>
                      </Col>
                    </div>
                  </FormGroup>
                ) : (
                  <></>
              )}

              {selection === "Spend Borrow" ? (
                <div className="d-grid gap-2">
                  <div
                    style={{
                      marginBottom: "25px",
                      fontSize: "11px",
                      marginTop: "-10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "3px 0",
                      }}
                    >
                      <div style={{ color: "#6F6F6F" }}>Est. Conversion:</div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#6F6F6F",
                        }}
                      >
                        1 BTC = 21,000 USDT
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "3px 0",
                      }}
                    >
                      <div style={{ color: "#6F6F6F" }}>Gas Estimate:</div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#6F6F6F",
                        }}
                      >
                        $0.5
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "3px 0",
                      }}
                    >
                      <div style={{ color: "#6F6F6F" }}>Supply Network:</div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#6F6F6F",
                        }}
                      >
                        Starknet
                      </div>
                    </div>
                  </div>
                  <Button
                    color="primary"
                    className="w-md"
                    style={{
                      backgroundColor: "rgb(57, 61, 79)",
                      border: "none",
                    }}
                    disabled={
                      commitPeriod === undefined ||
                      loadingApprove ||
                      loadingDeposit ||
                      isInvalid()
                    }
                    onClick={(e) => {
                      handleDeposit(tokenName);
                    }}
                  >
                    {!(
                      loadingApprove ||
                      isTransactionLoading(requestDepositTransactionReceipt)
                    ) ? (
                      <>{selection}</>
                    ) : (
                      <MySpinner text="Depositing token" />
                    )}
                  </Button>
                </div>
              ) : null}

              {selection === "Repay Borrow" ? (
                <div className="d-grid gap-2">
                  <div
                    style={{
                      marginBottom: "25px",
                      fontSize: "11px",
                      marginTop: "-10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "3px 0",
                      }}
                    >
                      <div style={{ color: "#6F6F6F" }}>Gas Estimate:</div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#6F6F6F",
                        }}
                      >
                        $0.5
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "3px 0",
                      }}
                    >
                      <div style={{ color: "#6F6F6F" }}>Debt Category:</div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#6F6F6F",
                        }}
                      >
                        DC1/DC2/DC3
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "3px 0",
                      }}
                    >
                      <div
                        style={{
                          color: "#6F6F6F",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Estimated Collateral Return:
                      </div>
                      <div style={{ display: "flex" }}>
                        <img
                          src="./LabelIcon.svg"
                          style={{ marginTop: "-2px" }}
                        />
                        &nbsp;<div>1</div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "3px 0",
                      }}
                    >
                      <div style={{ color: "#6F6F6F" }}>Network:</div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#6F6F6F",
                        }}
                      >
                        Starknet
                      </div>
                    </div>
                  </div>
                  <Button
                    color="primary"
                    className="w-md"
                    style={{
                      backgroundColor: "rgb(57, 61, 79)",
                      border: "none",
                    }}
                    disabled={
                      commitPeriod === undefined ||
                      loadingApprove ||
                      loadingDeposit ||
                      isInvalid()
                    }
                    onClick={(e) => {
                      handleDeposit(tokenName);
                    }}
                  >
                    {!(
                      loadingApprove ||
                      isTransactionLoading(requestDepositTransactionReceipt)
                    ) ? (
                      <>{selection}</>
                    ) : (
                      <MySpinner text="Depositing token" />
                    )}
                  </Button>
                </div>
              ) : null}

              {selection === "Withdraw Partial Borrow" ? (
                <div className="d-grid gap-2">
                  <div
                    style={{
                      marginBottom: "25px",
                      fontSize: "11px",
                      marginTop: "-10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "3px 0",
                      }}
                    >
                      <div style={{ color: "#6F6F6F" }}>Gas Estimate:</div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#6F6F6F",
                        }}
                      >
                        $0.5
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "3px 0",
                      }}
                    >
                      <div style={{ color: "#6F6F6F" }}>Transaction fees:</div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#6F6F6F",
                        }}
                      >
                        x%
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: "-20px",
                      }}
                    >
                      <div style={{ padding: "15px" }}></div>
                      <div style={{ color: "#6F6F6F", fontSize: "9px" }}>
                        Withdrawing partial borrow increases the chances of your
                        borrow becoming a non-performing asset leading to
                        liquidation. By proceeding ahead, you acknowledge the
                        risks this withdrawal has on your active borrow
                      </div>
                    </div>
                  </div>
                  <Button
                    color="primary"
                    className="w-md"
                    style={{
                      backgroundColor: "rgb(57, 61, 79)",
                      border: "none",
                    }}
                    disabled={
                      commitPeriod === undefined ||
                      loadingApprove ||
                      loadingDeposit ||
                      isInvalid()
                    }
                    onClick={(e) => {
                      handleDeposit(tokenName);
                    }}
                  >
                    {!(
                      loadingApprove ||
                      isTransactionLoading(requestDepositTransactionReceipt)
                    ) ? (
                      <>{selection}</>
                    ) : (
                      <MySpinner text="Depositing token" />
                    )}
                  </Button>
                </div>
              ) : null}

              {selection === "Self Liquidate" ? (
                <div className="d-grid gap-2">
                  <div
                    style={{
                      marginBottom: "25px",
                      fontSize: "11px",
                      marginTop: "-10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "3px 0",
                      }}
                    >
                      <div style={{ color: "#6F6F6F" }}>Gas Estimate:</div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#6F6F6F",
                        }}
                      >
                        $0.5
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "3px 0",
                      }}
                    >
                      <div style={{ color: "#6F6F6F" }}>Transaction fees:</div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#6F6F6F",
                        }}
                      >
                        1%
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "3px 0",
                      }}
                    >
                      <div style={{ color: "#6F6F6F" }}>
                        Self liquidation fees:
                      </div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#6F6F6F",
                        }}
                      >
                        1%
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "3px 0",
                      }}
                    >
                      <div
                        style={{
                          color: "#6F6F6F",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Estimated collateral return:
                      </div>
                      <div style={{ display: "flex" }}>
                        <img
                          src="./LabelIcon.svg"
                          style={{ marginTop: "-2px" }}
                        />
                        &nbsp;<div>1</div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "3px 0",
                      }}
                    >
                      <div style={{ color: "#6F6F6F" }}>Network:</div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#6F6F6F",
                        }}
                      >
                        Starknet
                      </div>
                    </div>
                  </div>
                  <Button
                    color="primary"
                    className="w-md"
                    style={{
                      backgroundColor: "rgb(57, 61, 79)",
                      border: "none",
                    }}
                    disabled={
                      commitPeriod === undefined ||
                      loadingApprove ||
                      loadingDeposit ||
                      isInvalid()
                    }
                    onClick={(e) => {
                      handleDeposit(tokenName);
                    }}
                  >
                    {!(
                      loadingApprove ||
                      isTransactionLoading(requestDepositTransactionReceipt)
                    ) ? (
                      <>{selection}</>
                    ) : (
                      <MySpinner text="Depositing token" />
                    )}
                  </Button>

                  <div
                    style={{
                      marginTop: "-20px",
                    }}
                  >
                    <div style={{ padding: "15px" }}></div>
                    <div style={{ color: "#6F6F6F", fontSize: "9px" }}>
                      Self liquidation allows borrowers to secure a borrow
                      that’s closer to its liquidation price. This helps
                      borrower to recover a portion of their collateral, which
                      otherwise
                    </div>
                  </div>
                </div>
              ) : null}

              {selection === "Add Collateral" ? (
                <div className="d-grid gap-2">
                  <div
                    style={{
                      marginBottom: "25px",
                      fontSize: "11px",
                      marginTop: "-10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "3px 0",
                      }}
                    >
                      <div style={{ color: "#6F6F6F" }}>Gas Estimate:</div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#6F6F6F",
                        }}
                      >
                        $0.5
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "3px 0",
                      }}
                    >
                      <div style={{ color: "#6F6F6F" }}>Debt Category:</div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#6F6F6F",
                        }}
                      >
                        DC1/DC2/DC3
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "3px 0",
                      }}
                    >
                      <div style={{ color: "#6F6F6F" }}>Borrow apr:</div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#6F6F6F",
                        }}
                      >
                        00.0%
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "3px 0",
                      }}
                    >
                      <div style={{ color: "#6F6F6F" }}>Borrow Network:</div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#6F6F6F",
                        }}
                      >
                        Starknet
                      </div>
                    </div>
                  </div>
                  <Button
                    color="primary"
                    className="w-md"
                    style={{
                      backgroundColor: "rgb(57, 61, 79)",
                      border: "none",
                    }}
                    disabled={
                      commitPeriod === undefined ||
                      loadingApprove ||
                      loadingDeposit ||
                      isInvalid()
                    }
                    onClick={(e) => {
                      handleDeposit(tokenName);
                    }}
                  >
                    {!(
                      loadingApprove ||
                      isTransactionLoading(requestDepositTransactionReceipt)
                    ) ? (
                      <>{selection}</>
                    ) : (
                      <MySpinner text="Depositing token" />
                    )}
                  </Button>
                </div>
              ) : null}

              {selection === "Withdraw Collateral" ? (
                <div className="d-grid gap-2">
                  <div
                    style={{
                      marginBottom: "25px",
                      fontSize: "11px",
                      marginTop: "-10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "3px 0",
                      }}
                    >
                      <div style={{ color: "#6F6F6F" }}>Gas Estimate:</div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#6F6F6F",
                        }}
                      >
                        $0.5
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "3px 0",
                      }}
                    >
                      <div style={{ color: "#6F6F6F" }}>Transaction fees:</div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#6F6F6F",
                        }}
                      >
                        x%
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "3px 0",
                      }}
                    >
                      <div style={{ color: "#6F6F6F" }}>
                        Pre-closure charges:
                      </div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#6F6F6F",
                        }}
                      >
                        y%
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "3px 0",
                      }}
                    >
                      <div style={{ color: "#6F6F6F" }}>Supply Network:</div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#6F6F6F",
                        }}
                      >
                        Starknet
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: "-20px",
                      }}
                    >
                      <div style={{ padding: "15px" }}></div>
                      <div style={{ color: "#6F6F6F", fontSize: "9px" }}>
                        A pre-closure charge is applied on your collateral,
                        since you are withdrawing the collateral of a pre-closed
                        borrow.
                      </div>
                    </div>
                  </div>

                  <Button
                    color="primary"
                    className="w-md"
                    style={{
                      backgroundColor: "rgb(57, 61, 79)",
                      border: "none",
                    }}
                    disabled={
                      commitPeriod === undefined ||
                      loadingApprove ||
                      loadingDeposit ||
                      isInvalid()
                    }
                    onClick={(e) => {
                      handleWithdrawCollateral(withdrawCollateral);
                    }}
                  >
                    {!(
                      loadingApprove ||
                      isTransactionLoading(requestDepositTransactionReceipt)
                    ) ? (
                      <>{selection}</>
                    ) : (
                      <MySpinner text="Depositing token" />
                    )}
                  </Button>
                </div>
              ) : null}
            </Form>
          ) : (
            <h2 style={{ color: "black" }}>Please connect your wallet</h2>
          )}
        </div>

        {idDropDown ? (
          <>
            <div
              style={{
                borderRadius: "5px",
                position: "absolute",
                zIndex: "100",
                top: "130px",
                left: "40px",
                width: "123px",
                margin: "0px auto",
                marginBottom: "20px",
                padding: "5px 10px",
                backgroundColor: "#393D4F",
                // boxShadow: "0px 0px 10px rgb(57, 61, 79)",
              }}
            >
              <div
                style={{
                  margin: "10px 0",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "11px",
                  color: "#6F6F6F",
                }}
              >
                Borrow ID - 123665
              </div>{" "}
              <div
                style={{
                  margin: "10px 0",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "11px",
                  color: "#6F6F6F",
                }}
              >
                Borrow ID - 123665
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </Modal>
    </div>
  );
};

export default BorrowData;
