import {
  useAccount,
  useContract,
  useStarknetCall,
  useStarknetExecute,
  useTransactionReceipt,
  UseTransactionReceiptResult,
} from "@starknet-react/core";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Modal,
  Row,
  Table,
  UncontrolledAccordion,
} from "reactstrap";
import {
  diamondAddress,
  ERC20Abi,
  getTokenFromName,
  isTransactionLoading,
  tokenAddressMap,
} from "../../../blockchain/stark-constants";
import starknetLogo from "../../../assets/images/starknetLogo.svg";
import Slider from "react-custom-slider";
import { BNtoNum, GetErrorText, NumToBN } from "../../../blockchain/utils";
import { getPrice } from "../../../blockchain/priceFeed";
import { TxToastManager } from "../../../blockchain/txToastManager";
import BorrowData from "./borrow-data";
import OffchainAPI from "../../../services/offchainapi.service";
import Image from "next/image";
import arrowDown from "../../../assets/images/arrowDown.svg";
import arrowUp from "../../../assets/images/arrowUp.svg";
import { Abi, uint256 } from "starknet";
import { ICoin } from "../../dashboard/dashboard-body";
import MySpinner from "../../mySpinner";
import { MinimumAmount } from "../../../blockchain/constants";

const BorrowTab = ({
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
  interface IBorrowParams {
    loanAmount: number;
    collateralAmount: number;
    commitBorrowPeriod: number | null;
    collateralMarket: string | null;
  }

  interface IDepositLoanRates {
    [key: string]: {
      borrowAPR?: {
        apr100x: string;
        block: number;
      };
      depositAPR?: {
        apr100x: string;
        block: number;
      };
    };
  }
  const coins: ICoin[] = [
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

    { name: "ETH", icon: "mdi-ethereum" },

    { name: "DAI", icon: "mdi-ethereum" },
  ];

  const [value, setValue] = useState(0);
  const [dropDown, setDropDown] = useState(false);
  const [dropDownArrow, setDropDownArrow] = useState(arrowDown);

  const [commitmentValue, setCommitmentValue] = useState("Flexible");
  const [commitmentDropDown, setCommitmentDropDown] = useState(false);
  const [commitmentArrow, setCommitmentArrow] = useState(arrowDown);
  const [borrowParams, setBorrowParams] = useState<IBorrowParams>({
    loanAmount: 0,
    collateralAmount: 0,
    commitBorrowPeriod: 0,
    collateralMarket: null,
  });

  const [modal_borrow, setmodal_borrow] = useState(false);

  const [borrowDropDown, setBorrowDropDown] = useState(false);
  const [borrowArrow, setBorrowArrow] = useState(arrowDown);

  const [tokenName, setTokenName] = useState("BTC");
  const [borrowTokenName, setBorrowTokenName] = useState("BTC");
  const [token, setToken] = useState(getTokenFromName("BTC"));
  const [loanActionTab, setLoanActionTab] = useState("0");
  const { address: account } = useAccount();

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

  const [addCollateralTransactionReceipt, setAddCollateralTransactionReceipt] =
    useState<UseTransactionReceiptResult>({
      loading: false,
      refresh: () => {},
    });
  const [repayTransactionReceipt, setRepayTransactionReceipt] =
    useState<UseTransactionReceiptResult>({
      loading: false,
      refresh: () => {},
    });
  const [revertSwapTransactionReceipt, setRevertSwapTransactionReceipt] =
    useState<UseTransactionReceiptResult>({
      loading: false,
      refresh: () => {},
    });

  /* =================== add collateral states ======================= */

  const [transWithdrawLoan, setTransWithdrawLoan] = useState("");
  const [transSwapLoanToSecondary, setTransSwapLoanToSecondary] = useState("");

  const withdrawLoanTransactionReceipt = useTransactionReceipt({
    hash: transWithdrawLoan,
    watch: true,
  });
  const swapLoanToSecondaryTransactionReceipt = useTransactionReceipt({
    hash: transSwapLoanToSecondary,
    watch: true,
  });

  function getLoan(loanId: any) {
    for (let i = 0; i < activeLoansData.length; ++i) {
      if (loanId == activeLoansData[i].loanId) {
        return activeLoansData[i];
      }
    }
    return {
      loanMarket: "NA",
    };
  }

  const {
    data: dataBorrow,
    loading: loadingBorrow,
    error: errorBorrow,
    reset: resetBorrow,
    execute: executeBorrow,
  } = useStarknetExecute({
    calls: [
      {
        contractAddress:
          tokenAddressMap[borrowParams.collateralMarket || ""] || "",
        entrypoint: "approve",
        calldata: [
          diamondAddress,
          NumToBN(borrowParams.collateralAmount as number, 18),
          0,
        ],
      },
      {
        contractAddress: diamondAddress,
        entrypoint: "loan_request",
        calldata: [
          tokenAddressMap[tokenName],
          NumToBN(borrowParams.loanAmount as number, 18),
          0,
          borrowParams.commitBorrowPeriod,
          tokenAddressMap[borrowParams.collateralMarket as string],
          NumToBN(borrowParams.collateralAmount as number, 18),
          0,
        ],
      },
    ],
  });
  const { contract } = useContract({
    abi: ERC20Abi as Abi,
    address: tokenAddressMap[borrowParams.collateralMarket as string] as string,
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

  useEffect(() => {
    // console.log(
    //   "withdraw tx receipt",
    //   withdrawLoanTransactionReceipt.data?.transaction_hash,
    //   withdrawLoanTransactionReceipt
    // );
    TxToastManager.handleTxToast(
      withdrawLoanTransactionReceipt,
      `Withdraw partial ${getLoan(loanId).loanMarket} loan`
    );
  }, [withdrawLoanTransactionReceipt]);

  useEffect(() => {
    // console.log(
    //   "swap loan tx receipt",
    //   swapLoanToSecondaryTransactionReceipt.data?.transaction_hash,
    //   swapLoanToSecondaryTransactionReceipt
    // );
    TxToastManager.handleTxToast(
      swapLoanToSecondaryTransactionReceipt,
      `Swap ${getLoan(loanId).loanMarket} Loan`
    );
  }, [swapLoanToSecondaryTransactionReceipt]);

  const [historicalAPRs, setHistoricalAPRs] = useState();

  useEffect(() => {
    OffchainAPI.getHistoricalBorrowRates().then((val) => {
      setHistoricalAPRs(val);
      console.log(val);
    });
  }, []);

  /* =================== add collateral states ======================= */
  const [inputVal1, setInputVal1] = useState(0);
  const [isLoading, setLoading] = useState(false);

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
  const toggleLoanAction = (tab: string) => {
    if (loanActionTab !== tab) {
      setLoanActionTab(tab);
    }
  };

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

  // add collateral
  const [marketToAddCollateral, setMarketToAddCollateral] = useState("");
  const [loanId, setLoanId] = useState<number>();

  // repay
  const [loanMarket, setLoanMarket] = useState("");
  const [commitmentPeriod, setCommitmentPeriod] = useState();

  // swap to market
  const [swapMarket, setSwapMarket] = useState("");
  const [swapIsSet, setSwapIsSet] = useState(false);
  /* ============================== Add Colateral ============================ */
  // Approve amount
  const {
    data: dataApprove,
    loading: loadingApprove,
    error: errorApprove,
    reset: resetApprove,
    execute: approve,
  } = useStarknetExecute({
    calls: {
      contractAddress: tokenAddressMap[marketToAddCollateral] as string,
      entrypoint: "approve",
      calldata: [diamondAddress, NumToBN(inputVal1 as number, 18), 0],
    },
  });
  // Adding collateral

  /* ============================== Withdraw Loan ============================ */
  const {
    data: dataWithdraw,
    loading: loadingWithdraw,
    error: errorWithdraw,
    reset: resetWithdraw,
    execute: executeWithdraw,
  } = useStarknetExecute({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "withdraw_partial_loan",
      calldata: [loanId, NumToBN(inputVal1 as number, 18), 0],
    },
  });
  /* ============================== Swap To Secondary Market ============================ */
  const {
    data: dataSwapToMarket,
    loading: loadingSwapToMarket,
    error: errorSwapToMarket,
    reset: resetSwapToMarket,
    execute: executeSwapToMarket,
  } = useStarknetExecute({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "swap_loan_market_to_secondary",
      calldata: [loanId, swapMarket],
    },
  });

  const handleWithdrawLoan = async (asset: any) => {
    if (asset.isSwapped) {
      toast.error(`${GetErrorText(`Cannot withdraw swapped loan`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }

    if (!inputVal1 && !loanId && !diamondAddress) {
      console.log("error");
      return;
    }
    console.log(diamondAddress, loanId, inputVal1);

    try {
      const val = await executeWithdraw();
      if (val) {
        setTransWithdrawLoan(val.transaction_hash);
      }
    } catch (err) {
      toast.error(
        `${GetErrorText(`Withdraw Loan ${asset.loanMarket} failed`)}`,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          closeOnClick: true,
        }
      );
    }
    // if (errorWithdraw) {
    // }
  };

  const tog_borrow = async () => {
    setmodal_borrow(!modal_borrow);
    // removeBodyCss();
  };

  const handleSwap = async () => {
    console.log(swapMarket, " ", loanId, " ", diamondAddress);
    if (!swapMarket && !loanId && !diamondAddress) {
      console.log("error");
      return;
    }

    const val = await executeSwapToMarket();
    if (val) {
      try {
        setTransSwapLoanToSecondary(val.transaction_hash);
      } catch (err) {
        console.error("error trans swap to secondary", err);
      }
    }
    if (errorSwapToMarket) {
      console.log(errorSwapToMarket);
      toast.error(`${GetErrorText(`Swap to ${swapMarket} failed`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
    }
  };

  const handleMax = async (
    _collateralAmount: any,
    _loanAmount: any,
    loanMarket: any,
    collateralMarket: string
  ) => {
    setLoading(true);
    const collateralAmount: any = parseFloat(
      BNtoNum(Number(_collateralAmount))
    ).toFixed(6);
    const loanAmount: any = parseFloat(BNtoNum(Number(_loanAmount))).toFixed(6);

    const loanPrice = await getPrice(loanMarket);
    const collateralPrice = await getPrice(collateralMarket);

    const totalLoanPriceUSD = loanAmount * loanPrice;
    const totalCollateralPrice = collateralAmount * collateralPrice;
    const maxPermisableUSD = (70 / 100) * totalCollateralPrice;
    const maxPermisableWithdrawal = maxPermisableUSD / loanPrice;

    setInputVal1(maxPermisableWithdrawal);
    // console.log("max loan withdrawal", maxPermisableWithdrawal);
    setLoading(false);
  };

  function isValidColleteralAmount() {
    if (!borrowParams.collateralAmount) return false;
    return (
      Number(borrowParams.collateralAmount) <
      Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) / 10 ** 18
    );
  }

  function isLoanAmountValid() {
    if (!borrowParams.loanAmount) return false;
    return borrowParams.loanAmount >= MinimumAmount[asset];
  }

  function isValid() {
    return isValidColleteralAmount() && isLoanAmountValid();
  }

  function handleBorrow(tokenName: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="table-responsive  mt-3" style={{ overflow: "hidden" }}>
      <UncontrolledAccordion
        defaultOpen="0"
        open="false"
        style={{
          margin: "10px",
          color: "black",
          textAlign: "left",
        }}
      >
        {Array.isArray(activeLoansData) && activeLoansData.length > 0 ? (
          <>
            <Table>
              {/* <Table className="table table-nowrap  mb-0"> */}
              <Row
                style={{
                  borderStyle: "hidden",
                  color: "black",
                  fontWeight: "600",
                  margin: "1px 1px 1px 10px",
                  alignItems: "center",
                  gap: "50px",
                  fontSize: "11px",
                }}
              >
                <Col
                  style={{
                    width: "10px",
                    padding: "20px 10px",
                  }}
                >
                  Borrow ID
                </Col>
                <Col
                  style={{
                    width: "100px",
                    padding: "20px 10px",
                  }}
                >
                  Market
                </Col>
                <Col style={{ width: "100px", padding: "20px 10px" }}>
                  Borrow Amount
                </Col>
                <Col
                  scope="col"
                  style={{ width: "100px", padding: "20px 10px" }}
                >
                  APR
                </Col>
                <Col
                  scope="col"
                  style={{ width: "100px", padding: "20px 10px" }}
                >
                  Risk Premium
                </Col>
                <Col
                  scope="col"
                  style={{ width: "100px", padding: "20px 10px" }}
                >
                  MCP
                </Col>

                <Col
                  scope="col"
                  style={{ width: "100px", padding: "20px 20px" }}
                >
                  Actions
                </Col>
              </Row>
              {/* </Table> */}
            </Table>

            {activeLoansData.map((asset, key) => {
              return (
                <BorrowData
                  asset={asset}
                  historicalAPRs={historicalAPRs}
                  key={key}
                  customActiveTabs={customActiveTabs}
                  loanActionTab={loanActionTab}
                  toggleLoanAction={toggleLoanAction}
                  account={account}
                  tog_collateral_active_loan={tog_collateral_active_loan}
                  collateral_active_loan={collateral_active_loan}
                  repay_active_loan={repay_active_loan}
                  tog_repay_active_loan={tog_repay_active_loan}
                  withdraw_active_loan={withdraw_active_loan}
                  tog_withdraw_active_loan={tog_withdraw_active_loan}
                  swap_active_loan={swap_active_loan}
                  tog_swap_active_loan={tog_swap_active_loan}
                  swap_to_active_loan={swap_to_active_loan}
                  tog_swap_to_active_loan={tog_swap_to_active_loan}
                  depositRequestSel={depositRequestSel}
                  inputVal1={inputVal1}
                  setInputVal1={setInputVal1}
                  setLoanId={setLoanId}
                  handleMax={handleMax}
                  isLoading={isLoading}
                  handleWithdrawLoanTransactionDone={
                    handleWithdrawLoanTransactionDone
                  }
                  handleWithdrawLoan={handleWithdrawLoan}
                  setSwapMarket={setSwapMarket}
                  handleSwapTransactionDone={handleSwapTransactionDone}
                  handleSwap={handleSwap}
                  setAddCollateralTransactionReceipt={
                    setAddCollateralTransactionReceipt
                  }
                  setRepayTransactionReceipt={setRepayTransactionReceipt}
                  withdrawLoanTransactionReceipt={
                    withdrawLoanTransactionReceipt
                  }
                  swapLoanToSecondaryTransactionReceipt={
                    swapLoanToSecondaryTransactionReceipt
                  }
                  setRevertSwapTransactionReceipt={
                    setRevertSwapTransactionReceipt
                  }
                  repayTransactionReceipt={repayTransactionReceipt}
                  addCollateralTransactionReceipt={
                    addCollateralTransactionReceipt
                  }
                  revertSwapTransactionReceipt={revertSwapTransactionReceipt}
                />
              );
            })}
          </>
        ) : (
          <>
            <div style={{ textAlign: "center", margin: "185px auto" }}>
              <div>Your Ethereum wallet is empty. </div>
              <div
                style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => {
                  setmodal_borrow(true);
                }}
              >
                <u>Purchase or Supply assets.</u>
              </div>
            </div>

            <Modal
              style={{ width: "548px", height: "945px" }}
              isOpen={modal_borrow}
              toggle={() => {
                tog_borrow();
              }}
              centered
            >
              <div
                className="modal-body"
                style={{
                  backgroundColor: "white",
                  color: "black",
                  padding: "40px",
                }}
              >
                {!account ? (
                  <Form>
                    {/* <div className="row mb-4"> */}
                    <Col sm={8}>
                      <h3 style={{ color: "black" }}>Borrow</h3>
                    </Col>
                    <div style={{ fontSize: "8px", fontWeight: "600" }}>
                      Collateral Market
                    </div>
                    <label
                      style={{
                        width: "420px",
                        margin: "5px auto",
                        marginBottom: "20px",
                        padding: "5px 10px",
                        fontSize: "18px",
                        borderRadius: "5px",
                        border: "2px solid #00000050",
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
                            src={`./${tokenName}.svg`}
                            width="30px"
                            height="30px"
                          ></img>
                          &nbsp;&nbsp;{tokenName}
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
                            // onClick={toggleDropdown}
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
                        fontSize: "8px",
                        fontWeight: "600",
                        margin: "-5px 0 5px 0",
                      }}
                    >
                      Collateral Amount
                    </div>
                    <InputGroup>
                      <Input
                        style={{
                          backgroundColor: "white",
                          borderRight: "1px solid #FFF",
                        }}
                        type="number"
                        className="form-control"
                        id="amount"
                        placeholder="Amount"
                        // onChange={handleCollateralInputChange}
                        // value={
                        //   borrowParams.collateralAmount
                        //     ? (borrowParams.collateralAmount as number)
                        //     : 0
                        // }
                        // valid={isValidColleteralAmount()}
                      />
                      {
                        <>
                          <Button
                            outline
                            type="button"
                            className="btn btn-md w-xs"
                            // onClick={handleMax}
                            // disabled={balance ? false : true}
                            style={{
                              background: "white",
                              color: "black",
                              border: "1px solid black",
                              borderLeft: "none",
                            }}
                          >
                            <span style={{ borderBottom: "2px dotted #fff" }}>
                              MAX
                            </span>
                          </Button>
                        </>
                      }
                    </InputGroup>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        fontSize: "10px",
                        margin: "5px 0",
                      }}
                    >
                      Wallet Balance :{" "}
                      {dataBalance ? (
                        (
                          Number(uint256.uint256ToBN(dataBalance[0])) /
                          10 ** 18
                        ).toString()
                      ) : (
                        <MySpinner />
                      )}
                    </div>
                    <div style={{ marginLeft: "-10px", marginTop: "15px" }}>
                      <Slider
                        handlerActiveColor="black"
                        stepSize={5}
                        value={value}
                        trackColor="#ADB5BD"
                        handlerShape="rounded"
                        handlerColor="black"
                        fillColor="black"
                        trackLength={420}
                        grabCursor={false}
                        showMarkers="hidden"
                        onChange={(value: any) => {
                          setBorrowParams({
                            ...borrowParams,
                            collateralAmount:
                              (value *
                                (Number(uint256.uint256ToBN(dataBalance[0])) /
                                  10 ** 18)) /
                              100,
                          });
                          setValue(value);
                        }}
                        valueRenderer={(value: any) => `${value}%`}
                        showValue={false}
                      />
                      {/* </div> */}
                    </div>{" "}
                    <div
                      style={{
                        fontSize: "10px",
                        position: "absolute",
                        right: "38px",
                        top: "275px",
                      }}
                    >
                      {value}%
                    </div>
                    {/* {dropDown ? (
                      <>
                        <div
                          style={{
                            borderRadius: "5px",
                            position: "absolute",
                            zIndex: "100",
                            top: "140px",
                            left: "39px",
                            // top: "-10px",

                            width: "420px",
                            margin: "0px auto",
                            marginBottom: "20px",
                            padding: "5px 10px",
                            backgroundColor: "#F8F8F8",
                            boxShadow: "0px 0px 10px #00000020",
                          }}
                        >
                          {coins.map((coin, index) => {
                            if (coin.name === tokenName) return <></>;
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
                                  setTokenName(`${coin.name}`);
                                  setDropDown(false);
                                  setDropDownArrow(arrowDown);
                                  handleCollateralChange(`${coin.name}`);
                                  // handleMinLoan(`${coin.name}`);
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
                    )} */}
                    {/* {borrowDropDown ? (
                <>
                  <div
                    style={{
                      borderRadius: "5px",
                      position: "absolute",
                      zIndex: "100",
                      top: "340px",
                      left: "39px",
                      // top: "-10px",

                      width: "420px",
                      margin: "0px auto",
                      marginBottom: "20px",
                      padding: "5px 10px",
                      backgroundColor: "#F8F8F8",
                      boxShadow: "0px 0px 10px #00000020",
                    }}
                  >
                    {coins.map((coin, index) => {
                      if (coin.name === borrowTokenName) return <></>;
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
                            setBorrowTokenName(`${coin.name}`);
                            setBorrowDropDown(false);
                            setBorrowArrow(arrowDown);
                            handleLoanInputChange(`${coin.name}`);
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
              {commitmentDropDown ? (
                <>
                  <div
                    style={{
                      borderRadius: "5px",
                      position: "absolute",
                      zIndex: "100",
                      top: "420px",
                      left: "39px",
                      // top: "-10px",

                      width: "420px",
                      margin: "0px auto",
                      marginBottom: "20px",
                      padding: "5px 10px",
                      backgroundColor: "#F8F8F8",
                      boxShadow: "0px 0px 10px #00000020",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "15px",
                        margin: "10px 0",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setCommitmentValue("1 month");
                        setCommitmentDropDown(false);
                        setCommitmentArrow(arrowDown);
                        handleCommitChange(2);
                      }}
                    >
                      &nbsp;1 month
                    </div>
                    <div
                      style={{
                        fontSize: "15px",
                        margin: "10px 0",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setCommitmentValue("2 weeks");
                        setCommitmentDropDown(false);
                        setCommitmentArrow(arrowDown);
                        handleCommitChange(1);
                      }}
                    >
                      &nbsp;2 weeks
                    </div>
                    <div
                      style={{
                        fontSize: "15px",
                        margin: "10px 0",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setCommitmentValue("Flexible");
                        setCommitmentDropDown(false);
                        setCommitmentArrow(arrowDown);
                        handleCommitChange(0);
                      }}
                    >
                      &nbsp;Flexible
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )} */}
                    <div style={{ fontSize: "8px", fontWeight: "600" }}>
                      Borrow Market
                    </div>
                    <label
                      style={{
                        width: "420px",
                        margin: "5px auto",
                        marginBottom: "20px",
                        padding: "5px 10px",
                        fontSize: "18px",
                        borderRadius: "5px",
                        border: "2px solid #00000050",
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
                            src={`./${borrowTokenName}.svg`}
                            width="30px"
                            height="30px"
                          ></img>
                          &nbsp;&nbsp;{borrowTokenName}
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
                            // onClick={toggleBorrowDropdown}
                            src={borrowArrow}
                            alt="Picture of the author"
                            width="20px"
                            height="20px"
                          />
                        </div>
                      </div>
                    </label>
                    <FormGroup floating>
                      <div className="row mb-4">
                        <Col sm={12}>
                          <div style={{ fontSize: "8px", fontWeight: "600" }}>
                            Minimum Commitment Period
                          </div>
                          <label
                            style={{
                              width: "420px",
                              margin: "5px auto",
                              padding: "5px 10px",
                              fontSize: "15px",
                              borderRadius: "5px",
                              border: "2px solid #00000050",
                              fontWeight: "400",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginLeft: "10px",
                              }}
                            >
                              <div>{commitmentValue}</div>
                              <div
                                style={{
                                  marginRight: "20px",
                                  marginTop: "3px",
                                  marginBottom: "0",
                                  cursor: "pointer",
                                }}
                              >
                                <Image
                                  onClick={() => {
                                    setCommitmentDropDown(!commitmentDropDown);
                                    setCommitmentArrow(
                                      commitmentDropDown ? arrowDown : arrowUp
                                    );
                                  }}
                                  src={commitmentArrow}
                                  alt="Picture of the author"
                                  width="20px"
                                  height="20px"
                                />
                              </div>
                            </div>
                          </label>
                          {/* <select
                      id="commitment"
                      className="form-select"
                      placeholder="Commitment"
                      onChange={(e) => handleCommitmentChange(e)}
                    >
                      <option value={0}>Flexible</option>
                      <option value={1}>One Month</option>
                    </select> */}
                        </Col>
                      </div>
                      {/* <label style={{}}> */}
                      <div
                        style={{
                          fontSize: "8px",
                          fontWeight: "600",
                          margin: "-10px 0 5px 0",
                        }}
                      >
                        Borrow Amount
                      </div>
                      <InputGroup style={{ marginBottom: "30px" }}>
                        <Input
                          style={{
                            backgroundColor: "white",
                            borderRight: "1px solid #FFF",
                          }}
                          id="loan-amount"
                          type="text"
                          className="form-control"
                          placeholder={`Minimum amount = ${MinimumAmount[tokenName]}`}
                          min={MinimumAmount[tokenName]}
                          value={borrowParams.loanAmount as number}
                          // onChange={handleLoanInputChange}
                          // valid={isLoanAmountValid()}
                        />
                        {
                          <>
                            {/* <Button
                        outline
                        type="button"
                        className="btn btn-md w-xs"
                        onClick={handleMin}
                        // disabled={balance ? false : true}
                        style={{
                          background: "white",
                          color: "black",
                          border: "1px solid black",
                        }}
                      >
                        <span style={{ borderBottom: "2px dotted #fff" }}>
                          Min
                        </span>
                      </Button> */}

                            <Button
                              outline
                              type="button"
                              className="btn btn-md w-xs"
                              // onClick={handleMaxLoan}
                              // disabled={balance ? false : true}
                              style={{
                                background: "white",
                                color: "black",
                                border: "1px solid black",
                                borderLeft: "none",
                              }}
                            >
                              <span style={{ borderBottom: "2px dotted #fff" }}>
                                MAX
                              </span>
                            </Button>
                          </>
                        }
                      </InputGroup>
                      {/* </label> */}
                    </FormGroup>
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
                          <div style={{ color: "#6F6F6F" }}>Spend loan on:</div>
                          <div
                            style={{
                              textAlign: "right",
                              fontWeight: "600",
                              display: "flex",
                              gap: "3px",
                            }}
                          >
                            <Image
                              src={starknetLogo}
                              alt="Picture of the author"
                              width="15px"
                              height="15px"
                            />{" "}
                            <Image
                              src={starknetLogo}
                              alt="Picture of the author"
                              width="15px"
                              height="15px"
                            />{" "}
                            <Image
                              src={starknetLogo}
                              alt="Picture of the author"
                              width="15px"
                              height="15px"
                            />{" "}
                            <Image
                              src={starknetLogo}
                              alt="Picture of the author"
                              width="15px"
                              height="15px"
                            />
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
                            style={{ textAlign: "right", fontWeight: "600" }}
                          >
                            $ 10.91
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
                            Transaction fees:
                          </div>
                          <div
                            style={{ textAlign: "right", fontWeight: "600" }}
                          >
                            $ 10.91
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            margin: "3px 0",
                          }}
                        >
                          <div style={{ color: "#6F6F6F" }}>Fair price:</div>
                          <div
                            style={{ textAlign: "right", fontWeight: "600" }}
                          >
                            $ 10.91
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            margin: "3px 0 0 10px",
                          }}
                        >
                          <div style={{ color: "#6F6F6F" }}>
                            i Collateral market:
                          </div>
                          <div
                            style={{ textAlign: "right", fontWeight: "400" }}
                          >
                            $ 10.91
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            margin: "3px 0 0 10px",
                          }}
                        >
                          <div style={{ color: "#6F6F6F" }}>
                            ii Borrow market:
                          </div>
                          <div
                            style={{ textAlign: "right", fontWeight: "400" }}
                          >
                            $10.91
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            margin: "3px 0",
                          }}
                        >
                          <div style={{ color: "#6F6F6F" }}>Risk premium:</div>
                          <div
                            style={{ textAlign: "right", fontWeight: "600" }}
                          >
                            0.6%
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            margin: "3px 0",
                          }}
                        >
                          <div style={{ color: "#6F6F6F" }}>Debt category:</div>
                          <div
                            style={{ textAlign: "right", fontWeight: "600" }}
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
                            style={{ textAlign: "right", fontWeight: "600" }}
                          >
                            5.6%
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
                            Borrow network:
                          </div>
                          <div
                            style={{ textAlign: "right", fontWeight: "600" }}
                          >
                            starknet
                          </div>
                        </div>
                      </div>

                      <Button
                        color="primary"
                        className="w-md"
                        disabled={
                          borrowParams.commitBorrowPeriod === undefined ||
                          loadingApprove ||
                          loadingBorrow ||
                          !isValid()
                        }
                        style={{ padding: "10px 0" }}
                        onClick={(e) => handleBorrow(tokenName)}
                      >
                        {!(
                          loadingApprove
                          // || isTransactionLoading(requestBorrowTransactionReceipt)
                        ) ? (
                          "Borrow"
                        ) : (
                          <MySpinner text="Borrowing token" />
                        )}
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <h2>Please connect your wallet</h2>
                )}
              </div>
            </Modal>
          </>
        )}
      </UncontrolledAccordion>
    </div>
  );
};

export default BorrowTab;
