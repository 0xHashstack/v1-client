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
  l3DiamondAddress,
  ERC20Abi,
  isTransactionLoading,
  tokenAddressMap,
  tokenDecimalsMap,
  getTokenFromName,
  getTokenFromAddress,
} from "../../../blockchain/stark-constants";
import { TxToastManager } from "../../../blockchain/txToastManager";
import {
  BNtoNum,
  borrowInterestAccrued,
  currentBorrowInterestRate,
  GetErrorText,
  NumToBN,
  weiToEtherNumber,
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
import { Abi, uint256, number } from "starknet";
import useAddDeposit from "../../../blockchain/hooks/active-deposits/useAddDeposit";
import { toast } from "react-toastify";
import classnames from "classnames";
import useWithdrawCollateral from "../../../blockchain/hooks/repaid-loans/useWithdrawCollateral";
import useRepay from "../../../blockchain/hooks/active-borrow/useRepay";
import useWithdrawPartialBorrow from "../../../blockchain/hooks/active-borrow/useWithdrawPartialBorrow";
import useAddCollateral from "../../../blockchain/hooks/active-borrow/useAddCollateral";
import useJediSwap from "../../../blockchain/hooks/SpendBorrow/useJediSwap";
import JediSwapAbi from "../../../../starknet-artifacts/contracts/integrations/modules/jedi_swap.cairo/jedi_swap_abi.json";
import MySwapAbi from "../../../../starknet-artifacts/contracts/integrations/modules/my_swap.cairo/my_swap_abi.json";
import LoanAbi from "../../../../starknet-artifacts/contracts/modules/loan.cairo/loan_abi.json";
import TransactionFees from "../../../../TransactionFees.json";
import useMySwap from "../../../blockchain/hooks/SpendBorrow/useMySwap";
import ToastModal from "../../toastModals/customToastModal";
import { StrictButtonGroupProps } from "semantic-ui-react";

const BorrowData = ({
  asset: assetParam,
  allAssets,
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
  isLoading,
  handleWithdrawLoanTransactionDone,
  handleWithdrawLoan,
  setSwapMarket,
  handleSwapTransactionDone,
  setAddCollateralTransactionReceipt,
  // setRepayTransactionReceipt,
  withdrawLoanTransactionReceipt,
  swapLoanToSecondaryTransactionReceipt,
  setRevertSwapTransactionReceipt,
  // repayTransactionReceipt,
  addCollateralTransactionReceipt,
  revertSwapTransactionReceipt,
}: {
  asset: any;
  allAssets: any;
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
  const [asset, setAsset] = useState(assetParam);
  console.log("asset borrow data", asset);
  const [marketTokenName, setMarketTokenName] = useState("USDT");

  const Coins: ICoin[] = [
    { name: "USDT", icon: "mdi-bitcoin" },
    { name: "USDC", icon: "mdi-ethereum" },
    { name: "BTC", icon: "mdi-bitcoin" },
    { name: "ETH", icon: "mdi-ethereum" },
    { name: "DAI", icon: "mdi-dai" },
  ];

  const {
    handleDepositAmount,
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
    handleDepositAmount: any;
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

  const {
    repayAmount,
    setRepayAmount,
    executeRepay,
    loadingRepay,
    transRepayHash,
    setTransRepayHash,
    repayTransactionReceipt,
    errorRepay,
  } = useRepay(asset, diamondAddress);
  const { executeSelfLiquidate, loadingSelfLiquidate, errorSelfLiquidate } =
    useRepay(asset, diamondAddress);
  const {
    executeWithdrawCollateral,
    loadingWithdrawCollateral,
    errorWithdrawCollateral,
  } = useWithdrawCollateral(diamondAddress, asset.loanId);
  const {
    partialWithdrawAmount,
    setPartialWithdrawAmount,
    executeWithdrawPartialBorrow,
    transWithdrawPartialBorrowHash,
    setTransWithdrawPartialBorrowHash,
    partialWithdrawTransReceipt,
    loadingWithdrawPartialBorrow,
  } = useWithdrawPartialBorrow(asset, diamondAddress);
  const {
    handleAddCollateral,
    loadingAddCollateral,
    errorAddCollateral,
    addCollateralAmount,
    setAddCollateralAmount,

    isAddcollatToastOpen,
    setIsToastAddcollatOpen,
    toastAddcollatParam,
  } = useAddCollateral(diamondAddress, asset);
  const {
    jediSwapSupportedPoolsData,
    loadingJediSwapSupportedPools,
    errorJediSwapSupportedPools,
    supportedPoolsJediSwap,

    handleJediSwap,
    dataJediSwap,
    loadingJediSwap,
    errorJediSwap,

    isJediswapToastOpen,
    setIsToastJediswapOpen,
    toastJediswapParam,
  } = useJediSwap(diamondAddress, asset, marketTokenName);

  const {
    handleMySwap,
    loadingMySwap,
    errorMySwap,
    supportedPoolsMySwap,
    isMyswapToastOpen,
    setIsToastMyswapOpen,
    toastMyswapParam,
  } = useMySwap(diamondAddress, asset, marketTokenName);

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
  const [maxPartialWithdrawAmount, setMaxPartialWithdrawAmount] = useState(0);
  const [borrowInterest, setBorrowInterest] = useState<string>("");
  const [currentBorrowInterest, setCurrentBorrowInterest] = useState<any>();

  const [selection, setSelection] = useState("Spend Borrow");
  const [selectionTwo, setSelectionTwo] = useState("Add Collateral");

  const [idDropDown, setIdDropDown] = useState(false);
  const [idDropDownArrow, setIdDropDownArrow] = useState(Downarrow);

  const [value, setValue] = useState<any>(0);
  const [commitPeriod, setCommitPeriod] = useState(0);
  const [stakeDropDown, setStakeDropDown] = useState(false);

  const [toastParam, setToastParam] = useState({});
  const [isToastOpen, setIsToastOpen] = useState(false);

  const [appsImage, setappsImage] = useState("yagi");
  const apps = ["mySwap", "jediSwap", "yagi"];

  const dappsArray = [
    { name: "jediSwap", supportedActions: ["Swap"] },
    { name: "mySwap", supportedActions: ["Swap"] },
    { name: "yagi", supportedActions: ["Stake"] },
  ];

  const [yagiDownArrow, setyagiDownArrow] = useState(Downarrow);
  const [yagiselection, setyagiselection] = useState("0");

  const { address: accountAddress, status } = useAccount();

  const [Yagidrop, setYagidrop] = useState(false);

  useEffect(() => {
    console.log(
      "repay tx receipt",
      repayTransactionReceipt.data?.transaction_hash,
      repayTransactionReceipt
    );
    TxToastManager.handleTxToast(
      repayTransactionReceipt,
      `Repay ${asset.loanMarket} Loan`
    );
    // setRepayTransactionReceipt(repayTransactionReceipt);
  }, [repayTransactionReceipt]);

  const { contract: loanMarketContract } = useContract({
    abi: ERC20Abi as Abi,
    address: tokenAddressMap[asset.loanMarket] as string,
  });

  const { contract: collateralMarketContract } = useContract({
    address: tokenAddressMap[asset.collateralMarket] as string,
    abi: ERC20Abi as Abi,
  });

  const {
    data: loanMarketAllowance,
    loading: loadingLoanMarketAllowance,
    error: errorLoanMarketAllowance,
    refresh: refreshLoanMarketAllowance,
  } = useStarknetCall({
    contract: loanMarketContract,
    method: "allowance",
    args: [account, diamondAddress],
    options: {
      watch: true,
    },
  });

  const {
    data: collateralMarketAllowance,
    loading: loadingCollateralMarketAllowance,
    error: errorCollateralMarketAllowance,
    refresh: refreshCollateralMarketAllowance,
  } = useStarknetCall({
    contract: collateralMarketContract,
    method: "allowance",
    args: [account, diamondAddress],
    options: {
      watch: true,
    },
  });

  const { contract: l3JediContract } = useContract({
    abi: JediSwapAbi as Abi,
    address:
      "0x1fc40e21ce68f61d538c070cbfea9483243bcdae0072b0f8c2c85fd4ecd28ab",
  });

  console.log(
    "borrowdata",
    tokenAddressMap[asset.loanMarket],
    tokenAddressMap[marketTokenName],
    uint256.uint256ToBN(asset.currentLoanAmount || "0")
  );
  const getAmount = () => {
    let amountOut = asset.currentLoanAmount || "0";
    console.log("getAmount", amountOut);
    return amountOut;
  };

  const handleMax = async () => {
    setDepositAmount(
      Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
        10 ** (tokenDecimalsMap[asset] || 18)
    );
    setValue(100);
  };

  const { contract: loanContract } = useContract({
    address: diamondAddress,
    abi: LoanAbi as Abi,
  });

  const {
    data: partialWithdrawData,
    loading: partialWithdrawLoading,
    error: partialWithdrawError,
    refresh: partialWithdrawRefresh,
  } = useStarknetCall({
    contract: loanContract,
    method: "get_max_withdrawal_amount",
    args: [asset.loanId],
    options: {
      watch: true,
    },
  });

  useEffect(() => {
    console.log('partialWithdraw', partialWithdrawData, partialWithdrawLoading, partialWithdrawError)
    const amount = partialWithdrawData ? uint256.uint256ToBN(partialWithdrawData.amount).toString() : "0";
    const amountWei = weiToEtherNumber(amount, asset.loanMarket);
    setMaxPartialWithdrawAmount(amountWei);
  }, [partialWithdrawData, partialWithdrawLoading, partialWithdrawError])

  // const {
  //   data: getAmountOutData,
  //   loading: loadingGetAmountOut,
  //   error: errorGetAmountOut,
  //   refresh: refreshGetAmountOut,
  // } = useStarknetCall({
  //   contract: l3Contract,
  //   method: "get_amount_out_jedi_swap",
  //   args: [
  //     // "0x38be05dde4b01e92d12a62f5dfa6584b5cad8e7b2295e2cb488f2b0385ff34f",
  //     // "0x5b2a7c089e36c6caf4724d2df5bd7687fcdc9bd76d280ecb1e411410811b54e",
  //     // uint256.bnToUint256(number.toBN("10").pow(number.toBN("25"))),
  //     tokenAddressMap[asset.loanMarket],
  //     tokenAddressMap[marketTokenName],
  //     uint256.bnToUint256(number.toBN(getAmount().toString())),
  //   ],
  //   options: {
  //     watch: true,
  //   },
  // });

  // useEffect(() => {
  //   console.log(
  //     "getamount",
  //     tokenAddressMap[asset.loanMarket],
  //     tokenAddressMap[marketTokenName],
  //     asset.currentLoanAmount || "0",
  //     getTokenFromName(asset.loanMarket)?.name,
  //     getTokenFromName(marketTokenName)?.name
  //   );
  //   console.log(
  //     "getAmountOutData",
  //     getAmountOutData,
  //     getAmountOutData?.amount_to
  //       ? uint256.uint256ToBN(getAmountOutData?.amount_to).toString()
  //       : "NA",
  //     loadingGetAmountOut,
  //     errorGetAmountOut
  //   );
  // }, [getAmountOutData, loadingGetAmountOut, errorGetAmountOut]);

  const { contract: l3MySwapContract } = useContract({
    abi: MySwapAbi as Abi,
    address:
      "0x1fc40e21ce68f61d538c070cbfea9483243bcdae0072b0f8c2c85fd4ecd28ab",
  });

  const {
    data: getAmountOutDataMySwap,
    loading: loadingGetAmountOutMySwap,
    error: errorGetAmountOutMySwap,
    refresh: refreshGetAmountOutMySwap,
  } = useStarknetCall({
    contract: l3MySwapContract,
    method: "get_amount_out_myswap",
    args: [
      // "0x38be05dde4b01e92d12a62f5dfa6584b5cad8e7b2295e2cb488f2b0385ff34f",
      // "0x5b2a7c089e36c6caf4724d2df5bd7687fcdc9bd76d280ecb1e411410811b54e",
      // uint256.bnToUint256(number.toBN("10").pow(number.toBN("25"))),
      tokenAddressMap[asset.loanMarket],
      tokenAddressMap[marketTokenName],
      uint256.bnToUint256(number.toBN(getAmount().toString())),
      2, // use pool id of respective pool. get from supported pools function
    ],
    options: {
      watch: true,
    },
  });

  useEffect(() => {
    console.log(
      "getamountmyswap",
      tokenAddressMap[asset.loanMarket],
      tokenAddressMap[marketTokenName],
      asset.currentLoanAmount || "0",
      getTokenFromName(asset.loanMarket)?.name,
      getTokenFromName(marketTokenName)?.name
    );
    console.log(
      "getAmountOutDataMyswap",
      getAmountOutDataMySwap,
      getAmountOutDataMySwap?.amount_to
        ? uint256.uint256ToBN(getAmountOutDataMySwap?.amount_to).toString()
        : "NA",
      loadingGetAmountOutMySwap,
      errorGetAmountOutMySwap
    );
  }, [
    getAmountOutDataMySwap,
    loadingGetAmountOutMySwap,
    errorGetAmountOutMySwap,
  ]);

  const {
    data: loanMarketBalance,
    loading: loadingLoanMarketBalance,
    error: errorLoanMarketBalance,
    refresh: refreshLoanMarketBalance,
  } = useStarknetCall({
    contract: loanMarketContract,
    method: "balanceOf",
    args: [account],
    options: {
      watch: true,
    },
  });

  const { contract } = useContract({
    abi: ERC20Abi as Abi,
    address: tokenAddressMap[asset] as string,
  });

  const {
    data: dataBalance,
    loading: loadingBalance,
    error: errorBalance,
    refresh: refreshBalance,
  } = useStarknetCall({
    contract: contract,
    method: "balanceOf",
    args: [accountAddress],
    options: {
      watch: true,
    },
  });

  const {
    data: collateralMarketBalance,
    loading: loadingCollateralMarketBalance,
    error: errorCollateralMarketBalance,
    refresh: refreshCollateralMarketBalance,
  } = useStarknetCall({
    contract: collateralMarketContract,
    method: "balanceOf",
    args: [account],
    options: {
      watch: true,
    },
  });

  const requestDepositTransactionReceipt = useTransactionReceipt({
    hash: transDeposit,
    watch: true,
  });

  const handleCollateralInputChangeAddCollateralAction = (e) => {
    setAddCollateralAmount(e.target.value);
    const balance =
      Number(
        uint256.uint256ToBN(
          collateralMarketBalance ? collateralMarketBalance[0] : 0
        )
      ) /
      10 ** (tokenDecimalsMap[asset?.collateralMarket as string] || 18);
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
  };

  const handleWithdrawCollateral = async () => {
    try {
      const val = await executeWithdrawCollateral();
      // setTransWithdrawCollateral(val.transaction_hash);
      const toastParamValue = {
        success: true,
        heading: "Success",
        desc: "Copy the Transaction Hash",
        textToCopy: val.transaction_hash,
      };
      setToastParam(toastParamValue);
      setIsToastOpen(true);
    } catch (err) {
      console.log(err, "withdraw collateral");
      const toastParamValue = {
        success: false,
        heading: "Withdraw Collateral Failed",
        desc: "Copy the error",
        textToCopy: err,
      };
      setToastParam(toastParamValue);
      setIsToastOpen(true);
      toast.error(
        `${GetErrorText(
          `Failed to withdraw collateral for ID${asset.loanId}`
        )}`,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          closeOnClick: true,
        }
      );
    }
  };

  const handleSpendBorrowCTAButton = () => {
    if (actionLabel === "Swap") {
      appsImage === "mySwap"
        ? handleMySwap()
        : appsImage === "jediSwap"
        ? handleJediSwap()
        : null;
    } else return null;
  };

  const handleWithdrawPartialBorrow = async () => {
    if (!partialWithdrawAmount && !asset.loanId && !diamondAddress) {
      toast.error(`${GetErrorText(`Invalid request`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
    }
    if (!partialWithdrawAmount && !diamondAddress) {
      toast.error(`${GetErrorText(`Invalid request`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
    if (!partialWithdrawAmount || partialWithdrawAmount <= 0) {
      toast.error(
        `${GetErrorText(`Invalid Withdraw amount of ${asset.loanMarket}`)}`,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          closeOnClick: true,
        }
      );
      return;
    }
    try {
      const val = await executeWithdrawPartialBorrow();
      setTransRepayHash(val.transaction_hash);
      const toastParamValue = {
        success: true,
        heading: "Success",
        desc: "Copy the Transaction Hash",
        textToCopy: val.transaction_hash,
      };
      setToastParam(toastParamValue);
      setIsToastOpen(true);
    } catch (err) {
      console.log(err, "err repay");
      const toastParamValue = {
        success: false,
        heading: "Withdraw Transaction Failed",
        desc: "Copy the error",
        textToCopy: err,
      };
      setToastParam(toastParamValue);
      setIsToastOpen(true);
      toast.error(
        `${GetErrorText(`Repay for Loan ID${asset.loanId} failed`)}`,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          closeOnClick: true,
        }
      );
      return;
    }
  };

  const handleSelfLiquidate = async () => {
    try {
      const val = await executeSelfLiquidate();
      const toastParamValue = {
        success: true,
        heading: "Success",
        desc: "Copy the Transaction Hash",
        textToCopy: val.transaction_hash,
      };
      setToastParam(toastParamValue);
      setIsToastOpen(true);
    } catch (err) {
      console.log("err self liquidate", err);
      const toastParamValue = {
        success: false,
        heading: "Self Liquidate Transaction Failed",
        desc: "Copy the error",
        textToCopy: err,
      };
      setToastParam(toastParamValue);
      setIsToastOpen(true);
      toast.error(
        `${GetErrorText(`Self Liquidation for Loan ID${asset.loanId} failed`)}`,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          closeOnClick: true,
        }
      );
      return;
    }
  };

  const handleRepayBorrow = async () => {
    if (
      !repayAmount &&
      asset.loanId! &&
      !diamondAddress &&
      !asset.commitmentIndex
    ) {
      toast.error(`${GetErrorText(`Invalid request`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
    }
    if (!tokenAddressMap[asset.loanMarket] && !repayAmount && !diamondAddress) {
      toast.error(`${GetErrorText(`Invalid request`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
    if (!repayAmount || repayAmount < 0) {
      toast.error(
        `${GetErrorText(`Can't withdraw < 0 of ${asset.loanMarket}`)}`,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          closeOnClick: true,
        }
      );
      return;
    }
    try {
      const val = await executeRepay();
      setTransRepayHash(val.transaction_hash);
      const toastParamValue = {
        success: true,
        heading: "Success",
        desc: "Copy the Transaction Hash",
        textToCopy: val.transaction_hash,
      };
      setToastParam(toastParamValue);
      setIsToastOpen(true);
    } catch (err) {
      console.log(err, "err repay");
      const toastParamValue = {
        success: false,
        heading: "Repay Transaction Failed",
        desc: "Copy the error",
        textToCopy: err,
      };
      setToastParam(toastParamValue);
      setIsToastOpen(true);
      toast.error(
        `${GetErrorText(`Repay for Loan ID${asset.loanId} failed`)}`,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          closeOnClick: true,
        }
      );
      return;
    }
  };

  const toggleyagi = () => {
    setYagidrop(!Yagidrop);
    setyagiDownArrow(Yagidrop ? Downarrow : UpArrow);
  };

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

  const handleLoanMarketBalanceChange = async () => {
    await refreshLoanMarketAllowance();
    await refreshLoanMarketBalance();
  };

  const handleDepositAmountChange = (e: any) => {
    setDepositAmount(e.target.value);
  };

  function isInvalid() {
    return (
      depositAmount < MinimumAmount[asset.loanMarket] ||
      depositAmount >
        Number(
          uint256.uint256ToBN(loanMarketBalance ? loanMarketBalance[0] : 0)
        ) /
          10 ** (tokenDecimalsMap[asset?.loanMarket as string] || 18)
    );
  }

  const handleSliderValue = (e) => {
    const balance =
      Number(
        uint256.uint256ToBN(loanMarketBalance ? loanMarketBalance[0] : 0)
      ) /
      10 ** (tokenDecimalsMap[asset?.loanMarket as string] || 18);
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
  };

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
    setIdDropDown(false);
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
    let dapp = "";
    if (value === "Swap") dapp = "jediSwap";
    else if (value === "Stake") dapp = "yagi";
    setappsImage(dapp);
  };

  useEffect(() => {
    setBorrowInterest(borrowInterestAccrued(asset));
    if (asset && historicalAPRs) {
      setCurrentBorrowInterest(
        // @todo this is actually recent aprs
        currentBorrowInterestRate(asset, historicalAPRs)
      );
      console.log("currentBorrowInterest", currentBorrowInterest);
    }
    console.log("currentBorrowInterest", asset, historicalAPRs);
  }, [asset, historicalAPRs]);

  return (
    <div key={key} style={{ borderTop: "5px" }}>
      <UncontrolledAccordion
        defaultOpen="0"
        open="false"
        style={{
          color: "white",
          textAlign: "left",
          marginLeft: "20px",
        }}
      >
        <Row
          style={{
            margin: "15px 0px 15px 20px",
            alignItems: "center",
            gap: "30px",
          }}
        >
          <Col style={{ marginLeft: "-10px", textAlign: "left" }}>
            ID{assetParam.loanId}
          </Col>

          <Col>
            <div style={{ marginTop: "10px" }}>
              <img
                src={
                  assetParam
                    ? CoinClassNames[
                        EventMap[assetParam.loanMarket.toUpperCase()]
                      ] || assetParam.loanMarket.toUpperCase()
                    : null
                }
                height="15px"
              />
              <div
                className="mr-6"
                style={{
                  display: "inline-block",
                  fontSize: "13px",
                }}
              >
                &nbsp; &nbsp;
                {EventMap[assetParam.loanMarket.toUpperCase()]}
              </div>{" "}
              {["SWAPPED", "STAKED", "TRADED"].includes(asset.state) ? (
                <div>
                  <img
                    style={{ marginLeft: "25px" }}
                    src={`./${
                      asset.state === "SWAPPED"
                        ? "swap"
                        : asset.state === "STAKED"
                        ? "stake"
                        : "trade"
                    }.svg`}
                    height="15px"
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
            <CardTitle tag="h5"></CardTitle>
          </Col>

          <Col className="mr-4 ">
            <div>
              <img
                src={
                  asset
                    ? CoinClassNames[
                        EventMap[assetParam.loanMarket.toUpperCase()]
                      ] || assetParam.loanMarket.toUpperCase()
                    : null
                }
                height="15px"
              />
              &nbsp;&nbsp;
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
                {parseFloat(BNtoNum(Number(assetParam.loanAmount)))}
              </span>
            </div>
          </Col>

          <Col>
            <div style={{ fontSize: "14px", fontWeight: "600" }}>
              {parseFloat(BNtoNum(Number(assetParam.loanInterest))).toFixed(6)}
              &nbsp;
              {EventMap[assetParam.loanMarket.toUpperCase()]}
            </div>
            <div
              className="mr-6"
              style={{
                display: "inline-block",
                fontSize: "13px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "#8B8B8B",
                }}
              >
                {parseFloat(currentBorrowInterest).toFixed(2)}% APR
              </div>
            </div>
          </Col>

          <Col>0.00</Col>

          <Col>{assetParam?.commitment}</Col>

          <Col>
            <div>
              <img
                src={
                  assetParam
                    ? CoinClassNames[
                        EventMap[assetParam.collateralMarket.toUpperCase()]
                      ] || assetParam.collateralMarket.toUpperCase()
                    : null
                }
                height="15px"
              />
              <div
                className="mr-6"
                style={{
                  display: "inline-block",
                  fontSize: "13px",
                }}
              >
                &nbsp; &nbsp;
                {EventMap[assetParam.collateralMarket.toUpperCase()]}
              </div>
            </div>
          </Col>

          <Col>
            <div>
              <img
                src={
                  asset
                    ? CoinClassNames[
                        EventMap[assetParam.collateralMarket.toUpperCase()]
                      ] || assetParam.collateralMarket.toUpperCase()
                    : null
                }
                height="15px"
              />
              &nbsp;&nbsp;
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
                {parseFloat(BNtoNum(Number(assetParam.collateralAmount)))}
              </span>
            </div>
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
                if (assetParam?.state === "REPAID") {
                  setCustomActiveTab("2");
                  setSelection("Withdraw Collateral");
                  setIsCollateralActions(true);
                }
                setmodal_deposit(true);
              }}
            >
              {assetParam?.state === "REPAID" ? (
                <>Withdraw Collateral</>
              ) : (
                <>Actions</>
              )}
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
                              ></Button>
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
                                  // onClick={() => {
                                  //   handleSwap();
                                  // }}
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
        <hr style={{ color: "#00000080" }} />
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
                          color: "white",
                          border: "1px solid #000",
                          borderRadius: "5px",
                          backgroundColor:
                          assetParam.state === "REPAID" ? "grey" : "white",
                        }}
                        className={classnames({
                          active: customActiveTab === "1",
                        })}
                        disabled={assetParam.state === "REPAID"}
                        onClick={() => {
                          setCustomActiveTab("1");
                          setIsCollateralActions(false);
                          setSelection("Spend Borrow");
                        }}
                      >
                        <span
                          // style={{
                          //   backgroundColor:
                          //     assetParam.state === "REPAID" ? "grey" : "white",
                          // }}
                          className="d-none d-sm-block"
                        >
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
                        disabled={assetParam.state === "REPAID"}
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
                    </NavItem>{" "}
                    <img
                      src="./cross.svg"
                      onClick={() => {
                        setmodal_deposit(false);
                      }}
                      style={{
                        position: "absolute",
                        top: "55px",
                        right: "40px",
                        marginTop: "5px",
                        cursor: "pointer",
                      }}
                      height="15px"
                    />
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
                              width="14px"
                              height="14px"
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
                              width="14px"
                              height="14px"
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
                                  src={`./${appsImage}.svg`}
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
                                  onClick={toggleyagi}
                                  src={yagiDownArrow}
                                  alt="Picture of the author"
                                  width="14px"
                                  height="14px"
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
                              src={`./${asset.loanMarket}.svg`}
                              width="12px"
                              height="12px"
                            ></img>
                            &nbsp;
                            <div style={{ color: "white" }}>
                              {asset.loanMarket}
                            </div>
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
                          Available borrowed amount:
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "white",
                            }}
                          >
                            &nbsp;
                            {parseFloat(BNtoNum(Number(asset.loanAmount)))}{" "}
                            {/* {asset.loanMarket} */}
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
                              marginBottom: !asset.isSwapped ? "1rem" : "0rem",
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
                              &nbsp;{asset.isSwapped ? "Yes" : "No"}
                            </span>
                          </div>
                          {asset.isSwapped ? (
                            <>
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
                                  <img
                                    src={`./${asset.l3App}.svg`}
                                    width="50px"
                                  />
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
                                  &nbsp;&nbsp;
                                  <img
                                    src={`./${asset.currentLoanMarket}.svg`}
                                    height="15px"
                                  />
                                  &nbsp; {asset.currentLoanMarket}
                                </span>
                              </div>
                            </>
                          ) : null}
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
                            fontSize: "11px",
                            color: "rgb(111, 111, 111)",
                            marginTop: "0px",
                            marginBottom: "7px",
                          }}
                        >
                          {selection === "Repay Borrow"
                            ? "Repayment Amount"
                            : "Withdraw Amount"}
                        </div>
                        <FormGroup>
                          <div className="row mb-4" style={{ width: "440px" }}>
                            <Col sm={12}>
                              <InputGroup>
                                <Input
                                  style={{
                                    backgroundColor: "#1D2131",
                                    // borderRight: "2px solid #393D4F",
                                    borderRight: "none",
                                    height: "40px",
                                  }}
                                  type="number"
                                  className="form-control"
                                  placeholder={`Amount in ${asset.loanMarket}`}
                                  id="amount"
                                  onChange={(e) => {
                                    if (selection === "Repay Borrow")
                                      setRepayAmount(e.target.value);
                                    else
                                      setPartialWithdrawAmount(e.target.value);
                                    handleSliderValue(e);
                                  }}
                                  value={
                                    selection === "Repay Borrow"
                                      ? repayAmount
                                      : partialWithdrawAmount
                                  }
                                  valid={!(!repayAmount || repayAmount <= 0)}
                                />
                                <Button
                                  outline
                                  type="button"
                                  className="btn btn-md w-xs"
                                  onClick={() => {
                                    if (selection === "Repay Borrow") {
                                      let amount = loanMarketBalance?.length
                                        ? uint256.uint256ToBN(
                                            loanMarketBalance[0]
                                          )
                                        : 0;
                                      amount = weiToEtherNumber(
                                        amount,
                                        asset.loanMarket
                                      );
                                      setRepayAmount(amount);
                                      setValue(100)
                                    } else {
                                      partialWithdrawRefresh();
                                      setPartialWithdrawAmount(maxPartialWithdrawAmount);
                                    }
                                  }}
                                  // disabled={balance ? false : true}
                                  style={{
                                    background: "#1D2131",
                                    color: "rgb(111, 111, 111)",
                                    border: `1px solid ${
                                      !(!repayAmount || repayAmount <= 0)
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
                              </InputGroup>

                              <div
                                style={{
                                  display: "flex",
                                  fontSize: "10px",
                                  justifyContent: "end",
                                  marginTop: "4px",
                                }}
                              >
                                {selection === "Withdraw Partial Borrow" ? (
                                  <>Borrow Balance:&nbsp;</>
                                ) : (
                                  <>Wallet Balance:&nbsp;</>
                                )}

                                {loanMarketAllowance ? (
                                  (
                                    Number(
                                      uint256.uint256ToBN(loanMarketBalance[0])
                                    ) /
                                    10 **
                                      (tokenDecimalsMap[
                                        asset?.loanMarket as string
                                      ] || 18)
                                  ).toFixed(4)
                                ) : (
                                  <MySpinner />
                                )}
                                <div style={{ color: "#76809D" }}>
                                  &nbsp;{asset.loanMarket}
                                </div>
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
                                      setRepayAmount(
                                        (value *
                                          (Number(
                                            uint256.uint256ToBN(
                                              loanMarketBalance?.[0] || 0
                                            )
                                          ) /
                                            10 **
                                              tokenDecimalsMap[
                                                asset.loanMarket
                                              ])) /
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

                              {repayAmount !== 0 &&
                                repayAmount >
                                  Number(
                                    uint256.uint256ToBN(
                                      loanMarketBalance
                                        ? loanMarketBalance[0]
                                        : 0
                                    )
                                  ) /
                                    10 **
                                      (tokenDecimalsMap[
                                        asset?.loanMarket as string
                                      ] || 18) && (
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
                        <label
                          style={{
                            marginRight: "20px",
                            marginTop: "3px",
                            marginBottom: "0",
                            backgroundColor: "transparent",
                          }}
                        >
                          {assetParam.state === "REPAID" ? (
                            <></>
                          ) : (
                            <Image
                              style={{ cursor: "pointer" }}
                              onClick={toggleDropdown}
                              src={dropDownArrow}
                              alt="Picture of the author"
                              width="14px"
                              height="14px"
                            />
                          )}
                        </label>
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
                          Borrowed Market:
                          <span
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            &nbsp;
                            <img
                              src={`./${asset.loanMarket}.svg`}
                              width="12px"
                              height="12px"
                            ></img>
                            &nbsp;
                            <div style={{ color: "white" }}>
                              {asset.loanMarket}
                            </div>
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
                          Borrowed Amount:
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "white",
                            }}
                          >
                            &nbsp;
                            {parseFloat(BNtoNum(Number(asset.loanAmount)))}{" "}
                            {asset.loanMarket}
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
                              marginTop: "-3px",
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
                              &nbsp;{`${asset.state}`}
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
                              src={`./${asset.collateralMarket}.svg`}
                              width="12px"
                              height="12px"
                            />
                            &nbsp;
                            <div style={{ color: "white" }}>
                              {asset.collateralMarket}
                            </div>
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
                                  placeholder={`Amount in ${asset.collateralMarket}`}
                                  onChange={
                                    handleCollateralInputChangeAddCollateralAction
                                  }
                                  value={addCollateralAmount}
                                  valid={!isInvalid()}
                                />
                                <Button
                                  outline
                                  type="button"
                                  className="btn btn-md w-xs"
                                  onClick={() => {
                                    let amount = collateralMarketBalance?.length
                                      ? uint256.uint256ToBN(
                                          collateralMarketBalance[0]
                                        )
                                      : 0;
                                    amount = weiToEtherNumber(
                                      amount,
                                      asset.collateralMarket
                                    );
                                    setAddCollateralAmount(amount);
                                    setValue(100)
                                  }}
                                  style={{
                                    background: "#1D2131",
                                    color: "rgb(111, 111, 111)",
                                    border: `1px solid ${
                                      !isInvalid() === true
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
                                {collateralMarketBalance ? (
                                  (
                                    Number(
                                      uint256.uint256ToBN(
                                        collateralMarketBalance[0]
                                      )
                                    ) /
                                    10 **
                                      (tokenDecimalsMap[
                                        asset?.collateralMarket as string
                                      ] || 18)
                                  )
                                    .toFixed(4)
                                    .toString()
                                ) : (
                                  <MySpinner />
                                )}
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

                              {addCollateralAmount ? (
                                addCollateralAmount >
                                  Number(
                                    uint256.uint256ToBN(
                                      collateralMarketBalance
                                        ? collateralMarketBalance[0]
                                        : 0
                                    )
                                  ) /
                                    10 **
                                      (tokenDecimalsMap[
                                        asset?.collateralMarket
                                      ] || 18) && (
                                  <FormText
                                    style={{ color: "#e97272 !important" }}
                                  >
                                    {`Amount is greater than your balance`}
                                  </FormText>
                                )
                              ) : (
                                <></>
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
                              setAddCollateralAmount(
                                (value *
                                  (Number(
                                    uint256.uint256ToBN(
                                      collateralMarketBalance?.[0] || 0
                                    )
                                  ) /
                                    10 **
                                      (tokenDecimalsMap[
                                        asset.collateralMarket
                                      ] || 18))) /
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
                            Available Collateral:
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                color: "white",
                              }}
                            >
                              &nbsp;{" "}
                              {parseFloat(
                                BNtoNum(Number(asset.collateralAmount))
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {stakeDropDown && (
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
                )}

                {dropDown && (
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
                )}

                {marketDropDown && (
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
                        const borrowMarketAddress =
                          tokenAddressMap[asset.loanMarket];
                        const supportedMarkets =
                          appsImage === "jediSwap"
                            ? supportedPoolsJediSwap?.get(borrowMarketAddress)
                            : supportedPoolsMySwap?.get(borrowMarketAddress);
                        const isSupported = supportedMarkets.includes(
                          tokenAddressMap[coin.name]
                        );
                        if (!isSupported) return <></>;
                        return (
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
                              setMarketTokenName(`${coin.name}`);
                              setMarketDropDown(false);
                              setDropDownArrowThree(Downarrow);
                              handleLoanMarketBalanceChange();

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
                )}

                {Yagidrop ? (
                  <>
                    <div
                      style={{
                        borderRadius: "5px",
                        position: "absolute",
                        zIndex: "100",
                        top: "244px",
                        left: "160px",

                        width: "300px",
                        margin: "0px auto",
                        marginBottom: "20px",
                        padding: "5px 10px",
                        backgroundColor: "#1D2131",
                        boxShadow: "0px 0px 10px #00000020",
                      }}
                    >
                      {dappsArray.map((dapp, index) => {
                        if (
                          dapp.supportedActions.find(
                            (action: string) => action === actionLabel
                          )
                        ) {
                          return (
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
                                // if (!activeLoansData) return;
                                // setmodal_deposit(true);
                                setappsImage(dapp.name);
                                toggleyagi();
                              }}
                            >
                              <img
                                src={`./${dapp.name}.svg`}
                                width="60px"
                                height="30px"
                                style={{ cursor: "pointer" }}
                              />
                            </div>
                          );
                        }
                        return null;
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
                              width="14px"
                              height="14px"
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
                      (appsImage === "mySwap" && loadingJediSwap) ||
                      (appsImage === "jediSwap" && loadingMySwap) ||
                      appsImage === "yagiLogo" ||
                      actionLabel === "Trade" ||
                      actionLabel === "Stake"
                    }
                    onClick={handleSpendBorrowCTAButton}
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
                        DC{asset.debtCategory}
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
                          src={`./${asset.collateralMarket}.svg`}
                          style={{ marginTop: "-2px" }}
                          width="11px"
                        />
                        &nbsp;<div>{BNtoNum(asset.collateralAmount)}</div>
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
                      loadingApprove ||
                      loadingRepay ||
                      !repayAmount ||
                      repayAmount < 0
                    }
                    onClick={handleRepayBorrow}
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
                        {TransactionFees.loan.withdrawal}%
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
                    // disabled={
                    //   // commitPeriod === undefined ||
                    //   // loadingApprove ||
                    //   // loadingDeposit ||
                    //   // !addCollateralAmount ||
                    //   // addCollateralAmount < 0
                    // }
                    onClick={handleWithdrawPartialBorrow}
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
                        {TransactionFees?.loan?.repayLoan}%
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
                        {TransactionFees?.loan?.SelfLiquidationFee}%
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
                        {/* <img
                          src="./LabelIcon.svg"
                          style={{ marginTop: "-2px" }}
                        />
                        &nbsp;<div>1</div> */}
                        <img
                          src={`./${asset.collateralMarket}.svg`}
                          style={{ marginTop: "-2px" }}
                          width="11px"
                        />
                        &nbsp;<div>{BNtoNum(asset.collateralAmount)}</div>
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
                      loadingApprove || loadingSelfLiquidate || isInvalid()
                    }
                    onClick={handleSelfLiquidate}
                  >
                    {!isTransactionLoading(requestDepositTransactionReceipt) ? (
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
                      Self liquidation allows borrowers to secure a borrow thats
                      closer to its liquidation price. This helps borrower to
                      recover a portion of their collateral, which otherwise
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
                        DC{asset.debtCategory}
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
                      loadingApprove || loadingAddCollateral || isInvalid()
                    }
                    onClick={handleAddCollateral}
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
                        {TransactionFees.loan.withdrawCollateral}%
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
                        {TransactionFees.loan.preClosureLoan}%
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
                    disabled={loadingApprove || loadingDeposit || isInvalid()}
                    onClick={handleWithdrawCollateral}
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

        {idDropDown && (
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
              }}
            >
              {allAssets.map((eleAsset, index) => {
                if (eleAsset.loanId === asset.loanId) return <></>;
                return (
                  <>
                    <div
                      key={index}
                      style={{
                        margin: "10px 0",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "12px",
                        color: "#6F6F6F",
                      }}
                      onClick={() => {
                        setAsset(eleAsset);
                        setIdDropDownArrow(idDropDown ? Downarrow : UpArrow);
                        setIdDropDown(false);
                        setMarketTokenName((prev) => {
                          if (appsImage === "jediSwap") {
                            return getTokenFromAddress(
                              supportedPoolsJediSwap.get(
                                tokenAddressMap[eleAsset.loanMarket]
                              )[0] as string
                            ).name;
                          } else if (appsImage === "mySwap") {
                            return getTokenFromAddress(
                              supportedPoolsMySwap.get(
                                tokenAddressMap[eleAsset.loanMarket]
                              )[0] as string
                            ).name;
                          } else return prev;
                        });
                      }}
                    >
                      Borrow ID - {eleAsset.loanId}
                    </div>{" "}
                  </>
                );
              })}
            </div>
          </>
        )}
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
        {isAddcollatToastOpen ? (
          <ToastModal
            isOpen={isAddcollatToastOpen}
            setIsOpen={setIsToastAddcollatOpen}
            success={toastAddcollatParam.success}
            heading={toastAddcollatParam.heading}
            desc={toastAddcollatParam.desc}
            textToCopy={toastAddcollatParam.textToCopy}
          />
        ) : (
          <></>
        )}
        {isJediswapToastOpen ? (
          <ToastModal
            isOpen={isJediswapToastOpen}
            setIsOpen={setIsToastJediswapOpen}
            success={toastJediswapParam.success}
            heading={toastJediswapParam.heading}
            desc={toastJediswapParam.desc}
            textToCopy={toastJediswapParam.textToCopy}
          />
        ) : (
          <></>
        )}
        {isMyswapToastOpen ? (
          <ToastModal
            isOpen={isMyswapToastOpen}
            setIsOpen={setIsToastMyswapOpen}
            success={toastMyswapParam.success}
            heading={toastMyswapParam.heading}
            desc={toastMyswapParam.desc}
            textToCopy={toastMyswapParam.textToCopy}
          />
        ) : (
          <></>
        )}
      </Modal>
    </div>
  );
};

export default BorrowData;
