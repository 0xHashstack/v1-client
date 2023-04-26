// @ts-nocheck

import { useState, useContext, MemoExoticComponent, useEffect } from "react";

import {
  Col,
  Button,
  Form,
  Input,
  Modal,
  Spinner,
  InputGroup,
  FormGroup,
  Label,
  FormText,
  FormFeedback,
  NavLink,
} from "reactstrap";

import Slider from "react-custom-slider";
import starknetLogo from "../assets/images/starknetLogo.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import {
  BorrowInterestRates,
  MinimumAmount,
  MinimumBorrowAmount,
} from "../blockchain/constants";
import {
  useAccount,
  useContract,
  useStarknetCall,
  useStarknetExecute,
  useTransactionReceipt,
} from "@starknet-react/core";
import {
  diamondAddress,
  ERC20Abi,
  getTokenFromName,
  isTransactionLoading,
  tokenAddressMap,
  tokenDecimalsMap,
} from "../blockchain/stark-constants";
import {
  etherToWeiBN,
  GetErrorText,
  NumToBN,
  weiToEtherNumber,
} from "../blockchain/utils";
import Image from "next/image";
import { Abi, uint256, number } from "starknet";
import { getPrice } from "../blockchain/priceFeed";
import { TxToastManager } from "../blockchain/txToastManager";
import MySpinner from "./mySpinner";
import OffchainAPI from "../services/offchainapi.service";
import { ceil, round } from "../services/utils.service";

// import Downarrow from "../assets/images/Downarrow.svg";
// import UpArrow from "../assets/images/UpArrow.svg";
import { Coins, ICoin } from "./dashboard/dashboard-body";
import Downarrow from "../assets/images/ArrowDownDark.svg";
import UpArrow from "../assets/images/ArrowUpDark.svg";
import _ from "lodash";
import Maxloan from "../blockchain/hooks/Max_loan_given_collat";
import { BNtoNum } from "../blockchain/utils";
import useMaxloan from "../blockchain/hooks/Max_loan_given_collat";
import ToastModal from "./toastModals/customToastModal";
import loanABI from "../../starknet-artifacts/contracts/modules/loan.cairo/loan_abi.json";
import TransactionFees from "../../TransactionFees.json";
import BorrowModal from "./modals/borrowModal";

interface IBorrowParams {
  loanAmount: number | null;
  collateralAmount: number | null;
  commitBorrowPeriod: number | null;
  collateralMarket: string | null;
}

export interface IDepositLoanRates {
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

let Borrow: any = ({
  asset: assetParam,
  assetSymbol: assetSymbolParam,
  title,
  depositLoanRates: depositLoanRatesParam,
  fairPriceArray,
}: {
  asset: string;
  title: string;
  depositLoanRates: IDepositLoanRates;
  fairPriceArray: any;
}) => {
  // console.log("the asset you get from borrow popup", assetParam);

  const [value, setValue] = useState<any>(0);
  const [asset, setAsset] = useState(assetParam);
  const [tokenName, setTokenName] = useState(assetParam);
  const [tokenSymbol, setTokenSymbol] = useState(assetSymbolParam);
  const [borrowTokenName, setBorrowTokenName] = useState(assetParam);
  const [borrowTokenSymbol, setBorrowTokenSymbol] = useState(assetSymbolParam);
  const [token, setToken] = useState(getTokenFromName(asset));
  const [modal_borrow, setmodal_borrow] = useState(false);
  const [allowanceVal, setAllowance] = useState(0);
  //   const [collateralAmount, setcollateralAmount] = useState(0);
  //   const [isAllowed, setAllowed] = useState(false);
  //   const [shouldApprove, setShouldApprove] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [borrowParams, setBorrowParams] = useState<IBorrowParams>({
    loanAmount: null,
    collateralAmount: null,
    commitBorrowPeriod: 0,
    collateralMarket: null,
  });

  const { address: account } = useAccount();

  const [transApprove, setTransApprove] = useState("");
  const [transBorrow, setTransBorrow] = useState("");

  const approveTransactionReceipt = useTransactionReceipt({
    hash: transApprove,
    watch: true,
  });
  const requestBorrowTransactionReceipt = useTransactionReceipt({
    hash: transBorrow,
    watch: true,
  });

  const [depositLoanRates, setDepositLoanRates] = useState<IDepositLoanRates>(
    depositLoanRatesParam
  );

  const [toastParam, setToastParam] = useState({});
  const [isToastOpen, setIsToastOpen] = useState(false);

  const [dropDown, setDropDown] = useState(false);
  const [dropDownArrow, setDropDownArrow] = useState(Downarrow);

  const [commitmentValue, setCommitmentValue] = useState("Flexible");
  const [commitmentDropDown, setCommitmentDropDown] = useState(false);
  const [commitmentArrow, setCommitmentArrow] = useState(Downarrow);

  const [borrowDropDown, setBorrowDropDown] = useState(false);
  const [borrowArrow, setBorrowArrow] = useState(Downarrow);

  const [collateralMarketToken, setCollateralwMarketToken] = useState("USDT");
  const [MaxloanData, setMaxloanData] = useState(0);

  const processOracleFairPrices = (coinName: string, arr: any) => {
    if (!arr) return;
    const oraclePrice = arr.find((ele: any) => {
      return ele.name === coinName;
    });
    return oraclePrice?.price?.toFixed(3);
  };

  const toggleDropdown = () => {
    setDropDown(!dropDown);
    setDropDownArrow(dropDown ? Downarrow : UpArrow);
    setBorrowDropDown(false);
    setBorrowArrow(Downarrow);
    setCommitmentDropDown(false);
    setCommitmentArrow(Downarrow);
    // disconnectEvent(), connect(connector);
  };

  const toggleBorrowDropdown = () => {
    setBorrowDropDown(!borrowDropDown);
    setBorrowArrow(borrowDropDown ? Downarrow : UpArrow);
    setDropDown(false);
    setDropDownArrow(Downarrow);
    setCommitmentDropDown(false);
    setCommitmentArrow(Downarrow);
    // disconnectEvent(), connect(connector);
  };

  useEffect(() => {
    setToken(getTokenFromName(asset));
    OffchainAPI.getProtocolDepositLoanRates().then((val) => {
      // console.log("loan rates", val);
      setDepositLoanRates(val);
    });
  }, [asset]);

  useEffect(() => {
    // console.log(
    //   "approve tx receipt",
    //   approveTransactionReceipt.data?.transaction_hash,
    //   approveTransactionReceipt
    // );
    if (!isValid()) return;
    TxToastManager.handleTxToast(
      approveTransactionReceipt,
      `Borrow: Approve ${borrowParams.collateralAmount} ${borrowParams.collateralMarket}`,
      true
    );
  }, [approveTransactionReceipt]);

  useEffect(() => {
    // console.log(
    //   "borrow tx receipt",
    //   requestBorrowTransactionReceipt.data?.transaction_hash,
    //   requestBorrowTransactionReceipt
    // );
    if (!isValid()) return;
    if (borrowParams.loanAmount)
      TxToastManager.handleTxToast(
        requestBorrowTransactionReceipt,
        `Borrow ${borrowParams.loanAmount} ${token?.name}`
      );
  }, [requestBorrowTransactionReceipt]);

  /* ======================== Get Debt Category ======================== */

  const [debtCategory, setDebtCategory] = useState<any>("N/A");

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
      [
        etherToWeiBN(borrowParams.loanAmount as string, tokenAddressMap[asset]),
        0,
      ],
      [
        etherToWeiBN(
          borrowParams.collateralAmount as string,
          tokenAddressMap[borrowParams.collateralMarket]
        ),
        0,
      ],
    ],
    options: {
      watch: true,
    },
  });

  useEffect(() => {
    if (!borrowParams.loanAmount || !borrowParams.collateralAmount) return;
    // console.log(
    //   "debt category",
    //   BNtoNum(dataDebtCategory?.debt_category, 0),
    //   errorDebtCategory,
    //   loadingDebtCategory
    // );
    if (loadingDebtCategory === false && !errorDebtCategory)
      setDebtCategory(BNtoNum(dataDebtCategory?.debt_category, 0));
  }, [errorDebtCategory, dataDebtCategory, loadingDebtCategory]);

  /* ======================= Approve ================================= */
  const {
    data: dataToken,
    loading: loadingToken,
    error: errorToken,
    reset: resetToken,
    execute: ApproveToken,
  } = useStarknetExecute({
    calls: {
      contractAddress:
        tokenAddressMap[borrowParams.collateralMarket || ""] || "",
      entrypoint: "approve",
      calldata: [
        diamondAddress,
        etherToWeiBN(
          borrowParams.collateralAmount as number,
          tokenAddressMap[borrowParams.collateralMarket || ""] || ""
        ).toString(),
        0,
      ],
    },
  });

  /* ========================== Borrow Request ============================ */

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
          etherToWeiBN(
            borrowParams.collateralAmount as number,
            tokenAddressMap[borrowParams.collateralMarket || ""] || ""
          ).toString(),
          0,
        ],
      },
      {
        contractAddress: diamondAddress,
        entrypoint: "loan_request",
        calldata: [
          tokenAddressMap[asset],
          etherToWeiBN(
            borrowParams.loanAmount as number,
            tokenAddressMap[asset] || ""
          ).toString(),
          0,
          borrowParams.commitBorrowPeriod,
          tokenAddressMap[borrowParams.collateralMarket as string],
          etherToWeiBN(
            borrowParams.collateralAmount as number,
            tokenAddressMap[borrowParams.collateralMarket]
          ).toString(),
          0,
        ],
      },
    ],
  });

  /* ========================= Balance ================================*/

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

  // =======================================================================================

  // ==========================================================================================
  const { contract: loanMarketContract } = useContract({
    abi: ERC20Abi as Abi,
    address: tokenAddressMap[asset as string] as string,
  });
  const {
    data: loanAssetBalance,
    loading: loadingAssetBalance,
    error: errorAssetBalance,
    refresh: refreshAssetBalance,
  } = useStarknetCall({
    contract: loanMarketContract,
    method: "balanceOf",
    args: [account],
    options: {
      watch: true,
    },
  });

  useEffect(() => {
    const refresh = async () => {
      await refreshBalance();
    };
    refresh();
  }, [borrowParams.collateralMarket, refreshBalance]);

  const returnTransactionParameters = () => {
    return {
      data: dataToken,
      loading: loadingToken,
      reset: resetToken,
      error: errorToken,
    };
  };

  // console.log(borrowParams.collateralAmount);
  // {borrowParams.collateralAmount ?(
  // @todo Write a standard function to convert the number to BN with decimal adjusted
  const { dataMaxLoan, errorMaxLoan, loadingMaxLoan, refreshMaxLoan } =
    useMaxloan(
      asset,
      borrowParams.collateralMarket,
      etherToWeiBN(
        borrowParams.collateralAmount as number,
        tokenAddressMap[borrowParams.collateralMarket as string]
      ).toString()
    );
  useEffect(() => {
    if (loadingMaxLoan === false && !errorMaxLoan) {
      console.log(
        "printing",
        dataMaxLoan,
        errorMaxLoan,
        loadingMaxLoan,
        Number(BNtoNum(dataMaxLoan?.max_loan_amount.low, 1))
      );
      const Data = dataMaxLoan?.max_loan_amount
        ? weiToEtherNumber(
            uint256.uint256ToBN(dataMaxLoan?.max_loan_amount).toString(),
            tokenAddressMap[asset] || ""
          )
        : "0";
      setMaxloanData(Data);
    }
  }, [errorMaxLoan, dataMaxLoan, loadingMaxLoan]);

  const handleApprove = async (asset: string) => {
    try {
      const val = await ApproveToken();
      setTransApprove(val.transaction_hash);
    } catch (err) {
      // console.log(err, "err approve token borrow");
    }
  };

  const {
    data: dataApprove,
    loading: loadingApprove,
    reset: resetApprove,
    error: errorApprove,
  } = returnTransactionParameters();

  const handleCommitmentChange = (commitPeriod: number) => {
    setBorrowParams({
      ...borrowParams,
      commitBorrowPeriod: commitPeriod,
    });
  };

  const handleCollateralChange = async (asset: any) => {
    setBorrowParams({
      ...borrowParams,
      collateralMarket: asset,
    });

    await refreshAllowance();
    await refreshBalance();
  };

  const handleLoanInputChange = async (e: any) => {
    // console.log("asset ajeeb", e.target.value);
    setBorrowParams({
      ...borrowParams,
      loanAmount: e.target.value,
    });
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

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  const tog_borrow = async () => {
    setmodal_borrow(!modal_borrow);
    removeBodyCss();
  };

  const handleMax = async () => {
    setBorrowParams({
      ...borrowParams,
      collateralAmount:
        Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
        10 ** (tokenDecimalsMap[borrowParams.collateralMarket || ""] || 18),
    });
    setValue(100);
    await refreshAllowance();
  };

  const handleMaxLoan = async () => {
    setBorrowParams({
      ...borrowParams,
      loanAmount: MaxloanData,
    });

    await refreshAllowance();
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
      // console.log(err, "err borrow");
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
    // console.log(
    // "check borrow allownace",
    // token?.name,
    // borrowParams.collateralMarket,
    // {
    //   dataAllowance,
    //   remaining: dataAllowance
    //     ? uint256.uint256ToBN(dataAllowance[0]).toString()
    //     : "0",
    //   errorAllowance,
    //   refreshAllowance,
    //   loadingAllowance,
    // }
    // );
    if (!loadingAllowance) {
      if (dataAllowance) {
        let data: any = dataAllowance;
        let _allowance = uint256.uint256ToBN(data.remaining);
        // console.log(
        //   "borrow allowance",
        //   token?.name,
        //   _allowance.toString(),
        //   borrowParams
        // );
        setAllowance(Number(uint256.uint256ToBN(dataAllowance[0])) / 10 ** 18);
      } else if (errorAllowance) {
        // handleToast(true, "Check allowance", errorAllowance)
      }
    }
  }, [dataAllowance, errorAllowance, refreshAllowance, loadingAllowance]);

  function isValidColleteralAmount() {
    if (!borrowParams.collateralAmount) return false;
    return (
      Number(borrowParams.collateralAmount) <=
      Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
        10 ** tokenDecimalsMap[borrowParams?.collateralMarket as string]
    );
  }

  function isLoanAmountValid() {
    if (!borrowParams.loanAmount) return false;
    return borrowParams.loanAmount >= MinimumBorrowAmount[asset];
  }
  // function isValidLoanAmount
  function isValid() {
    console.log(
      "collateral amount",
      `${borrowParams.collateralAmount}`,
      isValidColleteralAmount(),
      "loan amount",
      `${borrowParams.loanAmount}`,
      `${MinimumBorrowAmount[asset]}`,
      isLoanAmountValid()
    );
    return isLoanAmountValid();
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <NavLink
          type="button"
          onClick={() => {
            tog_borrow();
            // setTokenName(asset);
            handleCollateralChange(`${asset}`);
          }}
          style={{
            backgroundColor: "#393D4F",
            color: "white",
            padding: "10px 18px",
            borderRadius: "5px",
            border: "none",
            fontSize: "11px",
            width: "75px",
          }}
        >
          Borrow
        </NavLink>
      </div>

      <BorrowModal
        modal_borrow={modal_borrow}
        account={account}
        toggleDropdown={toggleDropdown}
        tokenName={tokenName}
        setTokenName={setTokenName}
        tokenSymbol={tokenSymbol}
        borrowTokenName={borrowTokenName}
        setBorrowTokenName={setBorrowTokenName}
        borrowTokenSymbol={borrowTokenSymbol}
        setBorrowTokenSymbol={setBorrowTokenSymbol}
        setTokenSymbol={setTokenSymbol}
        setmodal_borrow={setmodal_borrow}
        tog_borrow={tog_borrow}
        setCommitmentDropDown={setCommitmentDropDown}
        commitmentDropDown={commitmentDropDown}
        setCommitmentArrow={setCommitmentArrow}
        commitmentValue={commitmentValue}
        dropDown={dropDown}
        Coins={Coins}
        setDropDown={setDropDown}
        setDropDownArrow={setDropDownArrow}
        setAsset={setAsset}
        borrowParams={borrowParams}
        handleCollateralChange={handleCollateralChange}
        setCommitmentValue={setCommitmentValue}
        handleMax={handleMax}
        setBorrowParams={setBorrowParams}
        handleCollateralInputChange={handleCollateralInputChange}
        Downarrow={Downarrow}
        asset={asset}
        isValidCollateralAmount={isValidColleteralAmount}
        dataBalance={dataBalance}
        value={value}
        setValue={setValue}
        commitmentArrow={commitmentArrow}
        depositLoanRates={depositLoanRates}
        loadingApprove={loadingApprove}
        isToastOpen={isToastOpen}
        setIsToastOpen={setIsToastOpen}
        requestBorrowTransactionReceipt={requestBorrowTransactionReceipt}
        isValid={isValid}
        handleBorrow={handleBorrow}
        loadingBorrow={loadingBorrow}
        debtCategory={debtCategory}
        loadingDebtCategory={loadingDebtCategory}
        fairPriceArray={fairPriceArray}
        processOracleFairPrices={processOracleFairPrices}
        TransactionFees={TransactionFees}
        loadingMaxLoan={loadingMaxLoan}
        handleMaxLoan={handleMaxLoan}
        isLoanAmountValid={isLoanAmountValid}
        handleLoanInputChange={handleLoanInputChange}
        MinimumAmount={MinimumAmount}
        borrowArrow={borrowArrow}
        toggleBorrowDropdown={toggleBorrowDropdown}
        handleCommitmentChange={handleCommitmentChange}
        setBorrowArrow={setBorrowArrow}
        setBorrowDropDown={setBorrowDropDown}
        borrowDropDown={borrowDropDown}
        toastParam={toastParam}
      />
    </>
  );
};

export default Borrow = React.memo(Borrow);
