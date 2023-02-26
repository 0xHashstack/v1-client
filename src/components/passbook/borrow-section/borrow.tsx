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
  tokenDecimalsMap,
} from "../../../blockchain/stark-constants";
import starknetLogo from "../../../assets/images/starknetLogo.svg";
import Slider from "react-custom-slider";
import { BNtoNum, GetErrorText, NumToBN } from "../../../blockchain/utils";
import { getPrice } from "../../../blockchain/priceFeed";
import { TxToastManager } from "../../../blockchain/txToastManager";
import BorrowData from "./borrow-data";
import OffchainAPI from "../../../services/offchainapi.service";
import Image from "next/image";
import Downarrow from "../../../assets/images/ArrowDownDark.svg";
import UpArrow from "../../../assets/images/ArrowUpDark.svg";
import { Abi, uint256 } from "starknet";
import { ICoin } from "../../dashboard/dashboard-body";
import MySpinner from "../../mySpinner";
import { MinimumAmount } from "../../../blockchain/constants";
import useMaxloan from "../../../blockchain/hooks/Max_loan_given_collat";
import ToastModal from "../../toastModals/customToastModal";
import loanABI from "../../../../starknet-artifacts/contracts/modules/loan.cairo/loan_abi.json";
import TransactionFees from "../../../../TransactionFees.json";

const BorrowTab = ({
  asset: assetParam,
  activeLoansData,
  customActiveTabs,
  isTransactionDone,
  depositRequestSel,
  // inputVal1,
  removeBodyCss,
  setCustomActiveTabs,
  fairPriceArray,
}: {
  asset: string;
  activeLoansData: any;
  customActiveTabs: any;
  isTransactionDone: any;
  depositRequestSel: any;
  // inputVal1: any;
  removeBodyCss: () => void;
  setCustomActiveTabs: any;
  fairPriceArray: any;
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
  const Coins: ICoin[] = [
    { name: "USDT", icon: "mdi-bitcoin" },
    { name: "USDC", icon: "mdi-ethereum" },
    { name: "BTC", icon: "mdi-bitcoin" },
    { name: "ETH", icon: "mdi-ethereum" },
    { name: "DAI", icon: "mdi-dai" },
  ];

  // const loanTypes = ["Repaid", "Active"];
  // const [typeOfLoansDropDownArrowType, setTypeOfLoansDropDownArrowType] =
  //   useState(Downarrow);
  // const [typeOfLoans, setTypeOfLoans] = useState("Active");
  const [isDropDownOpenTypeOfLoans, setIsDropDownOpenTypeOfLoans] =
    useState(false);
  const [value, setValue] = useState<any>(0);
  const [dropDown, setDropDown] = useState(false);
  const [dropDownArrow, setDropDownArrow] = useState(Downarrow);
  const [asset, setAsset] = useState(assetParam);
  const [commitmentValue, setCommitmentValue] = useState("Flexible");
  const [commitmentDropDown, setCommitmentDropDown] = useState(false);
  const [commitmentArrow, setCommitmentArrow] = useState(Downarrow);
  const [borrowParams, setBorrowParams] = useState<IBorrowParams>({
    loanAmount: 0,
    collateralAmount: 0,
    commitBorrowPeriod: 0,
    collateralMarket: null,
  });

  const [modal_borrow, setmodal_borrow] = useState(false);

  const [borrowDropDown, setBorrowDropDown] = useState(false);
  const [borrowArrow, setBorrowArrow] = useState(Downarrow);

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

  const [toastParam, setToastParam] = useState({});
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [MaxloanData, setMaxloanData] = useState(0);

  const [addCollateralTransactionReceipt, setAddCollateralTransactionReceipt] =
    useState<UseTransactionReceiptResult>({
      loading: false,
      refresh: () => {},
    });
  // const [repayTransactionReceipt, setRepayTransactionReceipt] =
  //   useState<UseTransactionReceiptResult>({
  //     loading: false,
  //     refresh: () => {},
  //   });
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
          NumToBN(
            borrowParams.loanAmount as number,
            tokenDecimalsMap[tokenName]
          ),
          0,
          borrowParams.commitBorrowPeriod,
          tokenAddressMap[borrowParams.collateralMarket as string],
          NumToBN(
            borrowParams.collateralAmount as number,
            tokenDecimalsMap[borrowParams.collateralMarket as string]
          ),
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

  useEffect(() => {
    OffchainAPI.getProtocolDepositLoanRates().then((val) => {
      setDepositLoanRates(val);
      setHistoricalAPRs(val);
    });
  }, []);

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

  const toggleDropdown = () => {
    setDropDown(!dropDown);
    setDropDownArrow(dropDown ? Downarrow : UpArrow);
  };

  /* =================== add collateral states ======================= */
  const [inputVal1, setInputVal1] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const [transBorrow, setTransBorrow] = useState("");
  const requestBorrowTransactionReceipt = useTransactionReceipt({
    hash: transBorrow,
    watch: true,
  });

  const { dataMaxLoan, errorMaxLoan, loadingMaxLoan, refreshMaxLoan } =
    useMaxloan(tokenName, asset, Number(borrowParams.collateralAmount));
  let l = setTimeout(() => {
    if (loadingMaxLoan === false && !errorMaxLoan) {
      console.log(
        "printing",
        Number(BNtoNum(dataMaxLoan?.max_loan_amount.low, 1))
      );
      const Data = Number(BNtoNum(dataMaxLoan?.max_loan_amount.low, 1));
      setMaxloanData(Data);
    }
    clearTimeout(l);
  }, 1000);

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

  const handleLoanInputChange = async (e: any) => {
    console.log("asset ajeeb", e.target.value);
    setBorrowParams({
      ...borrowParams,
      loanAmount: e.target.value,
    });
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

  const processOracleFairPrices = (coinName: string, arr: any) => {
    if (!arr) return;
    const oraclePrice = arr.find((ele: any) => {
      return ele.name === coinName;
    });
    return oraclePrice?.price?.toFixed(3);
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

  const [depositLoanRates, setDepositLoanRates] = useState<IDepositLoanRates>();
  const [debtCategory, setDebtCategory] = useState(0);
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
  };

  const { contract: loanContract } = useContract({
    address: diamondAddress,
    abi: loanABI as Abi,
  });

  const {
    data: dataDebtCategory,
    loading: loadingDebtCategory,
    error: errorDebtCategory,
    refresh: refreshDebtCategory,
  } = useStarknetCall({
    contract: loanContract,
    method: "get_debt_category",
    args: [
      tokenAddressMap[asset],
      tokenAddressMap[borrowParams.collateralMarket || ""],
      [Number(borrowParams.loanAmount as string), 0],
      [Number(borrowParams.collateralAmount as string), 0],
    ],
    options: {
      watch: true,
    },
  });

  useEffect(() => {
    if (!borrowParams.loanAmount || !borrowParams.collateralAmount) return;
    console.log(
      "debt category",
      BNtoNum(dataDebtCategory?.debt_category, 0),
      errorDebtCategory,
      loadingDebtCategory
    );
    if (loadingDebtCategory === false && !errorDebtCategory)
      setDebtCategory(BNtoNum(dataDebtCategory?.debt_category, 0));
  }, [errorDebtCategory, dataDebtCategory, loadingDebtCategory]);

  const tog_borrow = async () => {
    setmodal_borrow(!modal_borrow);
  };

  const handleMax = async () => {
    setBorrowParams({
      ...borrowParams,
      collateralAmount:
        Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
        10 ** (tokenDecimalsMap[borrowParams.collateralMarket || ""] || 18),
    });
    await refreshAllowance();
  };

  const handleMaxLoan = async () => {
    setBorrowParams({
      ...borrowParams,
      loanAmount: MaxloanData,
    });

    await refreshAllowance();
  };

  const handleCollateralInputChange = async (e: any) => {
    setBorrowParams({
      ...borrowParams,
      collateralAmount: e.target.value,
    });
    const balance =
      Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
      10 ** (tokenDecimalsMap[borrowParams.collateralMarket || ""] || 18);
    if (!balance) return;
    // calculate percentage of collateral of balance
    var percentage = (e.target.value / balance) * 100;
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setValue("Greater than 100");
      return;
    }
    // Round off percentage to 2 decimal places
    percentage = Math.round(percentage * 100) / 100;
    setValue(percentage);
    await refreshAllowance();
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

  const handleCommitmentChange = (commitPeriod: number) => {
    setBorrowParams({
      ...borrowParams,
      commitBorrowPeriod: commitPeriod,
    });
  };

  function isValidColleteralAmount() {
    if (!borrowParams.collateralAmount) return false;
    return (
      Number(borrowParams.collateralAmount) <
      Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
        10 ** (tokenDecimalsMap[borrowParams.collateralMarket as string] || 18)
    );
  }

  function isLoanAmountValid() {
    if (!borrowParams.loanAmount) return false;
    return borrowParams.loanAmount >= MinimumAmount[asset];
  }

  function isValid() {
    return isValidColleteralAmount() && isLoanAmountValid();
  }

  const toggleBorrowDropdown = () => {
    setBorrowDropDown(!borrowDropDown);
    setBorrowArrow(borrowDropDown ? Downarrow : UpArrow);
    setDropDown(false);
    setDropDownArrow(Downarrow);
    setCommitmentDropDown(false);
    setCommitmentArrow(Downarrow);
  };

  const handleBorrow = async (asset: string) => {
    if (
      !tokenAddressMap[asset] ||
      !borrowParams.loanAmount ||
      (!borrowParams.commitBorrowPeriod && !diamondAddress)
    ) {
      toast.error(`${GetErrorText(`Invalid request`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
    if (borrowParams.collateralAmount === 0) {
      toast.error(`${GetErrorText(`Can't use collateral 0 of ${asset}`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
    }
    try {
      let val = await executeBorrow();
      setTransBorrow(val.transaction_hash);
      const toastParamValue = {
        success: true,
        heading: "Success",
        desc: "Copy the Transaction Hash",
        textToCopy: val.transaction_hash,
      };
      setToastParam(toastParamValue);
      setIsToastOpen(true);
    } catch (err) {
      console.log(err, "err borrow");
      const toastParamValue = {
        success: false,
        heading: "Borrow Transaction Failed",
        desc: "Copy the error",
        textToCopy: err,
      };
      setToastParam(toastParamValue);
      setIsToastOpen(true);
      toast.error(`${GetErrorText(`Borrow request for ${asset} failed`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
  };

  const handleCollateralChange = async (asset: any) => {
    setBorrowParams({
      ...borrowParams,
      collateralMarket: asset,
    });

    await refreshAllowance();
    await refreshBalance();
  };

  return (
    <div className="table-responsive  mt-3" style={{ overflow: "hidden" }}>
      <UncontrolledAccordion
        defaultOpen="0"
        open="false"
        style={{
          margin: "10px",
          textAlign: "left",
          marginLeft: "20px",
        }}
      >
        {Array.isArray(activeLoansData) && activeLoansData.length > 0 ? (
          <>
            <Table>
              {/* <Table className="table table-nowrap  mb-0"> */}
              <Row
                style={{
                  marginTop: "-20px",
                  marginLeft: "10px",
                  borderStyle: "hidden",
                  color: "rgb(140, 140, 140)",
                  fontWeight: "300",
                  alignItems: "center",
                  gap: "30px",
                  fontSize: "14px",
                }}
              >
                <Col
                  style={{
                    width: "10px",
                    padding: "20px 10px 20px 30px",
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
                  style={{ width: "100px", padding: "20px 10px" }}
                >
                  Collateral Market
                </Col>
                <Col
                  scope="col"
                  style={{ width: "100px", padding: "20px 10px" }}
                >
                  Collateral Amount
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

            {activeLoansData.map((asset, key, allAssets) => {
              console.log("activeLoansData", asset);
              return (
                <BorrowData
                  allAssets={allAssets}
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
                  // setRepayTransactionReceipt={setRepayTransactionReceipt}
                  withdrawLoanTransactionReceipt={
                    withdrawLoanTransactionReceipt
                  }
                  swapLoanToSecondaryTransactionReceipt={
                    swapLoanToSecondaryTransactionReceipt
                  }
                  setRevertSwapTransactionReceipt={
                    setRevertSwapTransactionReceipt
                  }
                  // repayTransactionReceipt={repayTransactionReceipt}
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
            <div
              style={{
                textAlign: "center",
                margin: "185px auto",
                color: "white",
              }}
            >
              <div>Your Wallet is empty. </div>
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
                  backgroundColor: "#1D2131",
                  color: "white",
                  padding: "40px",
                }}
              >
                {account ? (
                  <Form>
                    {/* <div className="row mb-4"> */}
                    <Col
                      sm={8}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <h5 style={{ color: "white", fontSize: "24px" }}>
                        Borrow
                      </h5>
                      <img
                        src="./cross.svg"
                        onClick={() => {
                          setmodal_borrow(false);
                        }}
                        style={{ marginTop: "5px", cursor: "pointer" }}
                        height="15px"
                      />
                    </Col>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#8b8b8b",
                      }}
                    >
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
                        border: "1px solid rgb(57, 61, 79)",
                        fontWeight: "200",
                      }}
                    >
                      <div
                        onClick={toggleDropdown}
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
                            width="24px"
                            height="24px"
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
                            src={dropDownArrow}
                            alt="Picture of the author"
                            width="14px"
                            height="14px"
                          />
                        </div>
                      </div>
                    </label>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        margin: "-5px 0 5px 0",
                        color: "#8b8b8b",
                      }}
                    >
                      Collateral Amount
                    </div>
                    <InputGroup>
                      <Input
                        style={{
                          height: "40px",
                          backgroundColor: "#1D2131",
                          // borderRight: "1px solid rgb(57, 61, 79)",
                          borderRight: "none",
                        }}
                        type="number"
                        className="form-control"
                        id="amount"
                        placeholder="Amount"
                        onChange={handleCollateralInputChange}
                        value={borrowParams.collateralAmount}
                        valid={isValidColleteralAmount()}
                      />
                      {
                        <>
                          <Button
                            outline
                            type="button"
                            className="btn btn-md w-xs"
                            onClick={handleMax}
                            style={{
                              background: "#1D2131",
                              color: "rgb(111, 111, 111)",
                              border: `1px solid ${
                                isValidColleteralAmount()
                                  ? "#34c38f"
                                  : "rgb(57, 61, 79)"
                              }`,
                              borderLeft: "none",
                            }}
                          >
                            <span style={{ borderBottom: "2px  #fff" }}>
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
                          10 ** (tokenDecimalsMap[tokenName] || 18)
                        ).toFixed(4)
                      ) : (
                        <MySpinner />
                      )}
                      <div style={{ color: "#76809D" }}>&nbsp;{tokenName} </div>
                    </div>
                    <div style={{ marginLeft: "-10px", marginTop: "15px" }}>
                      <Slider
                        handlerActiveColor="#1D2131"
                        stepSize={0.5}
                        value={value}
                        trackColor="rgb(57, 61, 79)"
                        handlerShape="rounded"
                        handlerColor="white"
                        fillColor="white"
                        trackLength={420}
                        grabCursor={false}
                        showMarkers="hidden"
                        onChange={(value: any) => {
                          if (value == 100) handleMax();
                          else {
                            setBorrowParams({
                              ...borrowParams,
                              collateralAmount:
                                (value *
                                  (Number(
                                    uint256.uint256ToBN(
                                      dataBalance ? dataBalance[0] : 0
                                    )
                                  ) /
                                    10 ** 18)) /
                                100,
                            });
                          }
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
                        right: "39px",
                        top: "267px",
                      }}
                    >
                      {value}%
                    </div>
                    {dropDown ? (
                      <>
                        <div
                          style={{
                            borderRadius: "5px",
                            position: "absolute",
                            zIndex: "100",
                            top: "145px",
                            left: "39px",
                            width: "420px",
                            margin: "0px auto",
                            marginBottom: "20px",
                            padding: "5px 10px",
                            backgroundColor: "#1D2131",
                            boxShadow: "0px 0px 10px #0020",
                          }}
                        >
                          {Coins.map((coin, index) => {
                            if (coin.name === tokenName) return <></>;
                            return (
                              <>
                                <div
                                  key={index}
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
                                    setDropDownArrow(Downarrow);
                                    handleCollateralChange(`${coin.name}`);
                                  }}
                                >
                                  <img
                                    src={`./${coin.name}.svg`}
                                    width="15px"
                                    height="15px"
                                  ></img>
                                  <div>&nbsp;&nbsp;&nbsp;{coin.name}</div>
                                </div>
                                {coin.name !== "DAI" ? <hr /> : null}
                              </>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                    {borrowDropDown ? (
                      <>
                        <div
                          style={{
                            borderRadius: "5px",
                            position: "absolute",
                            zIndex: "100",
                            top: "358px",
                            left: "39px",
                            // top: "-10px",

                            width: "420px",
                            margin: "0px auto",
                            marginBottom: "20px",
                            padding: "5px 10px",
                            backgroundColor: "#1D2131",
                            boxShadow: "0px 0px 10px #00000020",
                          }}
                        >
                          {Coins.map((coin, index) => {
                            if (coin.name === borrowTokenName) return <></>;
                            return (
                              <>
                                <div
                                  key={index}
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
                                    setBorrowArrow(Downarrow);
                                    setAsset(`${coin.name}`);
                                  }}
                                >
                                  <img
                                    src={`./${coin.name}.svg`}
                                    width="15px"
                                    height="15px"
                                  ></img>
                                  <div>&nbsp;&nbsp;&nbsp;{coin.name}</div>
                                </div>
                                {coin.name !== "DAI" ? <hr /> : null}
                              </>
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
                            top: "443px",
                            left: "39px",
                            // top: "-10px",

                            width: "420px",
                            margin: "0px auto",
                            marginBottom: "20px",
                            padding: "5px 10px",
                            backgroundColor: "#1D2131",
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
                              setCommitmentArrow(Downarrow);
                              handleCommitmentChange(1);
                            }}
                          >
                            &nbsp;1 month
                          </div>
                          <hr />
                          <div
                            style={{
                              fontSize: "15px",
                              margin: "10px 0",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setCommitmentValue("Flexible");
                              setCommitmentDropDown(false);
                              setCommitmentArrow(Downarrow);
                              handleCommitmentChange(0);
                            }}
                          >
                            &nbsp;Flexible
                          </div>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#8b8b8b",
                      }}
                    >
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
                        border: "1px solid rgb(57, 61, 79)",
                        fontWeight: "200",
                      }}
                    >
                      <div
                        onClick={toggleBorrowDropdown}
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
                            width="24px"
                            height="24px"
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
                            src={borrowArrow}
                            alt="Picture of the author"
                            width="14px"
                            height="14px"
                          />
                        </div>
                      </div>
                    </label>
                    <FormGroup floating>
                      <div className="row mb-4">
                        <Col sm={12}>
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: "600",
                              color: "#8b8b8b",
                            }}
                          >
                            Minimum Commitment Period
                          </div>
                          <label
                            style={{
                              width: "420px",
                              margin: "5px auto",
                              padding: "5px 10px",
                              fontSize: "15px",
                              borderRadius: "5px",
                              border: "1px solid rgb(57, 61, 79)",
                              fontWeight: "400",
                            }}
                          >
                            <div
                              onClick={() => {
                                setCommitmentDropDown(!commitmentDropDown);
                                setCommitmentArrow(
                                  commitmentDropDown ? Downarrow : UpArrow
                                );
                              }}
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
                                      commitmentDropDown ? Downarrow : UpArrow
                                    );
                                  }}
                                  src={commitmentArrow}
                                  alt="Picture of the author"
                                  width="14px"
                                  height="14px"
                                />
                              </div>
                            </div>
                          </label>
                        </Col>
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          color: "#8b8b8b",
                          margin: "-10px 0 5px 0",
                        }}
                      >
                        Borrow Amount
                      </div>
                      <InputGroup style={{ marginBottom: "30px" }}>
                        <Input
                          style={{
                            height: "40px",
                            backgroundColor: "#1D2131",
                            // borderRight: "1px solid rgb(57, 61, 79)",
                            borderRight: "none",
                          }}
                          id="loan-amount"
                          type="number"
                          className="form-control"
                          placeholder={`Minimum amount = ${MinimumAmount[asset]}`}
                          min={MinimumAmount[asset]}
                          value={borrowParams.loanAmount as number}
                          onChange={handleLoanInputChange}
                          valid={isLoanAmountValid()}
                        />
                        <Button
                          outline
                          type="button"
                          className="btn btn-md w-xs"
                          onClick={handleMaxLoan}
                          // disabled={balance ? false : true}
                          style={{
                            background: "#1D2131",
                            color: "rgb(111, 111, 111)",
                            border: `1px solid ${
                              isLoanAmountValid()
                                ? "#34c38f"
                                : "rgb(57, 61, 79)"
                            }`,
                            borderLeft: "none",
                          }}
                        >
                          {!loadingMaxLoan ? (
                            <span style={{ borderBottom: "2px  #fff" }}>
                              MAX
                            </span>
                          ) : (
                            <MySpinner text="" />
                          )}
                        </Button>
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
                          <div style={{ color: "#6F6F6F" }}>Gas estimate:</div>
                          <div
                            style={{
                              textAlign: "right",
                              fontWeight: "600",
                              color: "#6F6F6F",
                            }}
                          >
                            NA
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
                            style={{
                              textAlign: "right",
                              fontWeight: "600",
                              color: "#6F6F6F",
                            }}
                          >
                            {TransactionFees.loan.newLoan}%
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
                            style={{
                              textAlign: "right",
                              fontWeight: "600",
                              color: "#6F6F6F",
                            }}
                          ></div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            margin: "3px 0 0 0px",
                          }}
                        >
                          <div style={{ color: "#6F6F6F" }}>
                            Collateral market:
                          </div>
                          <div
                            style={{
                              textAlign: "right",
                              fontWeight: "400",
                              color: "#6F6F6F",
                            }}
                          >
                            {processOracleFairPrices(tokenName, fairPriceArray)}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            margin: "3px 0 0 0px",
                          }}
                        >
                          <div style={{ color: "#6F6F6F" }}>Borrow market:</div>
                          <div
                            style={{
                              textAlign: "right",
                              fontWeight: "400",
                              color: "#6F6F6F",
                            }}
                          >
                            {processOracleFairPrices(
                              borrowTokenName,
                              fairPriceArray
                            )}
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
                            style={{
                              textAlign: "right",
                              fontWeight: "600",
                              color: "#6F6F6F",
                            }}
                          >
                            0.0%
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
                            style={{
                              textAlign: "right",
                              fontWeight: "600",
                              color: "#6F6F6F",
                            }}
                          >
                            {loadingDebtCategory ? (
                              <MySpinner text="" />
                            ) : (
                              `DC ${Number(debtCategory).toFixed(0)}`
                            )}
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
                            {depositLoanRates &&
                            borrowParams.commitBorrowPeriod != null &&
                            (borrowParams.commitBorrowPeriod as number) < 2 ? (
                              `${
                                parseFloat(
                                  depositLoanRates[
                                    `${
                                      getTokenFromName(asset as string)?.address
                                    }__${borrowParams.commitBorrowPeriod}`
                                  ]?.borrowAPR?.apr100x as string
                                ) / 100
                              } %`
                            ) : (
                              <MySpinner />
                            )}
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
                        color="white"
                        className="w-md"
                        disabled={
                          borrowParams.commitBorrowPeriod === undefined ||
                          loadingApprove ||
                          loadingBorrow ||
                          !isValid()
                        }
                        style={{
                          boxShadow: "rgba(0, 0, 0, 0.5) 3.4px 3.4px 5.2px 0px",
                          border: "none",
                          padding: "12px 0",
                          backgroundColor: "rgb(57, 61, 79)",
                        }}
                        onClick={(e) => handleBorrow(asset)}
                      >
                        {!(
                          loadingApprove ||
                          isTransactionLoading(requestBorrowTransactionReceipt)
                        ) ? (
                          `Borrow`
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
              {isToastOpen ? (
                <ToastModal
                  isOpen={isToastOpen}
                  setIsOpen={setIsToastOpen}
                  success={toastParam.success}
                  heading={toastParam.heading}
                  desc={toastParam.desc}
                  textToCopy={toastParam.textToCopy}
                />
              ) : (
                <></>
              )}
            </Modal>
          </>
        )}
      </UncontrolledAccordion>
    </div>
  );
};

export default BorrowTab;
