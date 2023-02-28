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
import { BorrowInterestRates, MinimumAmount } from "../blockchain/constants";
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
import { ICoin } from "./dashboard/dashboard-body";
import Downarrow from "../assets/images/ArrowDownDark.svg";
import UpArrow from "../assets/images/ArrowUpDark.svg";
import _ from "lodash";
import Maxloan from "../blockchain/hooks/Max_loan_given_collat";
import { BNtoNum } from "../blockchain/utils";
import useMaxloan from "../blockchain/hooks/Max_loan_given_collat";
import ToastModal from "./toastModals/customToastModal";
import loanABI from "../../starknet-artifacts/contracts/modules/loan.cairo/loan_abi.json";
import TransactionFees from "../../TransactionFees.json";

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
  title,
  depositLoanRates: depositLoanRatesParam,
  fairPriceArray,
}: {
  asset: string;
  title: string;
  depositLoanRates: IDepositLoanRates;
  fairPriceArray: any;
}) => {
  console.log("the asset you get from borrow popup", assetParam);
  const Coins: ICoin[] = [
    { name: "USDT", icon: "mdi-bitcoin" },
    { name: "USDC", icon: "mdi-ethereum" },
    { name: "BTC", icon: "mdi-bitcoin" },
    { name: "ETH", icon: "mdi-ethereum" },
    { name: "DAI", icon: "mdi-dai" },
  ];

  const [value, setValue] = useState<any>(0);
  const [asset, setAsset] = useState(assetParam);
  const [tokenName, setTokenName] = useState(asset);
  const [borrowTokenName, setBorrowTokenName] = useState(asset);
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

  const processOracleFairPrices = (coinName: string, arr) => {
    if (!arr) return;
    const oraclePrice = arr.find((ele) => {
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
      console.log("loan rates", val);
      setDepositLoanRates(val);
    });
  }, [asset]);

  useEffect(() => {
    console.log(
      "approve tx receipt",
      approveTransactionReceipt.data?.transaction_hash,
      approveTransactionReceipt
    );
    if (!isValid()) return;
    TxToastManager.handleTxToast(
      approveTransactionReceipt,
      `Borrow: Approve ${borrowParams.collateralAmount} ${borrowParams.collateralMarket}`,
      true
    );
  }, [approveTransactionReceipt]);

  useEffect(() => {
    console.log(
      "borrow tx receipt",
      requestBorrowTransactionReceipt.data?.transaction_hash,
      requestBorrowTransactionReceipt
    );
    if (!isValid()) return;
    if (borrowParams.loanAmount)
      TxToastManager.handleTxToast(
        requestBorrowTransactionReceipt,
        `Borrow ${borrowParams.loanAmount} ${token?.name}`
      );
  }, [requestBorrowTransactionReceipt]);

  /* ======================== Get Debt Category ======================== */

  const [debtCategory, setDebtCategory] = useState(0);

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
          etherToWeiBN(borrowParams.loanAmount as number, tokenAddressMap[asset]||"").toString(),
          0,
          borrowParams.commitBorrowPeriod,
          tokenAddressMap[borrowParams.collateralMarket as string],
          etherToWeiBN(
            borrowParams.collateralAmount as number,
            tokenAddressMap[asset] || ""
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

  console.log(borrowParams.collateralAmount);
  // {borrowParams.collateralAmount ?(
  // @todo Write a standard function to convert the number to BN with decimal adjusted
  const { dataMaxLoan, errorMaxLoan, loadingMaxLoan, refreshMaxLoan } =
    useMaxloan(
      asset,
      tokenName,
      etherToWeiBN(
        borrowParams.collateralAmount as number,
        borrowParams.collateralMarket as string
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
            uint256.uint256ToBN(dataMaxLoan?.max_loan_amount).toString()
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
      console.log(err, "err approve token borrow");
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
    console.log("asset ajeeb", e.target.value);
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
    await refreshAllowance();
  };

  const handleMaxLoan = async () => {
    setBorrowParams({
      ...borrowParams,
      loanAmount: MaxloanData,
    });

    await refreshAllowance();
  };

  const handleMin = async () => {
    setLoading(true);
    const loanPrice = await getPrice(asset);
    const collateralPrice = await getPrice(borrowParams?.collateralMarket);

    const totalLoanPriceUSD = (borrowParams?.loanAmount as number) * loanPrice;
    // const totalCollateralPrice = borrowParams.collateralAmount * collateralPrcie;

    const minCollateralAmountUSD = totalLoanPriceUSD / 3;

    const minCollateral = minCollateralAmountUSD / collateralPrice;

    setBorrowParams({
      ...borrowParams,
      collateralAmount: minCollateral,
    });
    setLoading(false);
  };

  const handleMinLoan = async (asset: string) => {
    setBorrowParams({
      ...borrowParams,
      loanAmount: MinimumAmount[asset],
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
    console.log(
      "check borrow allownace",
      token?.name,
      borrowParams.collateralMarket,
      {
        dataAllowance,
        remaining: dataAllowance
          ? uint256.uint256ToBN(dataAllowance[0]).toString()
          : "0",
        errorAllowance,
        refreshAllowance,
        loadingAllowance,
      }
    );
    if (!loadingAllowance) {
      if (dataAllowance) {
        let data: any = dataAllowance;
        let _allowance = uint256.uint256ToBN(data.remaining);
        console.log(
          "borrow allowance",
          token?.name,
          _allowance.toString(),
          borrowParams
        );
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
        10 ** (tokenDecimalsMap[borrowParams?.collateralMarket as string] || 18)
    );
  }

  function isLoanAmountValid() {
    if (!borrowParams.loanAmount) return false;
    return borrowParams.loanAmount >= MinimumAmount[asset];
  }
  // function isValidLoanAmount
  function isValid() {
    console.log(
      "collateral amount",
      isValidColleteralAmount(),
      "loan amount",
      isLoanAmountValid()
    );
    return isValidColleteralAmount() && isLoanAmountValid();
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <NavLink
          type="button"
          onClick={() => {
            tog_borrow();
            setTokenName(asset);
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
                <h5 style={{ color: "white", fontSize: "24px" }}>Borrow</h5>
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
                      <span style={{ borderBottom: "2px  #fff" }}>MAX</span>
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
                              10 ** (tokenDecimalsMap[asset?.collateralMarket] || 18))) /
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
                        isLoanAmountValid() ? "#34c38f" : "rgb(57, 61, 79)"
                      }`,
                      borderLeft: "none",
                    }}
                  >
                    {!loadingMaxLoan ? (
                      <span style={{ borderBottom: "2px  #fff" }}>MAX</span>
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
                      <img
                        src="./mySwapSmallIcon.svg"
                        alt="Icon 1"
                        width="15px"
                        height="15px"
                      />{" "}
                      <img
                        src="./jediSwapSmallIcon.svg"
                        alt="Icon 2"
                        width="15px"
                        height="15px"
                      />{" "}
                      <img
                        src="./yagiSmallIcon.svg"
                        alt="Icon 3"
                        width="15px"
                        height="15px"
                      />{" "}
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
                    <div style={{ color: "#6F6F6F" }}>Transaction fees:</div>
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
                    <div style={{ color: "#6F6F6F" }}>Collateral market:</div>
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
                      {processOracleFairPrices(borrowTokenName, fairPriceArray)}
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
                      0%
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
                              `${getTokenFromName(asset as string)?.address}__${
                                borrowParams.commitBorrowPeriod
                              }`
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
                    <div style={{ color: "#6F6F6F" }}>Borrow network:</div>
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
  );
};

export default Borrow = React.memo(Borrow);
