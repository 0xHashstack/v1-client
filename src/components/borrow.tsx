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
} from "../blockchain/stark-constants";
import { GetErrorText, NumToBN } from "../blockchain/utils";
import Image from "next/image";
import { Abi, uint256 } from "starknet";
import { getPrice } from "../blockchain/priceFeed";
import { TxToastManager } from "../blockchain/txToastManager";
import MySpinner from "./mySpinner";
import OffchainAPI from "../services/offchainapi.service";
import { ceil, round } from "../services/utils.service";

import arrowDown from "../assets/images/arrowDown.svg";
import arrowUp from "../assets/images/arrowUp.svg";
import { ICoin } from "./dashboard/dashboard-body";

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

let Borrow: any = ({ asset, title }: { asset: string; title: string }) => {
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
    loanAmount: 0,
    collateralAmount: 0,
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

  const [depositLoanRates, setDepositLoanRates] = useState<IDepositLoanRates>({
    "0": {
      borrowAPR: {
        apr100x: "0",
        block: 0,
      },
      depositAPR: {
        apr100x: "0",
        block: 0,
      },
    },
  });

  const [commitPeriod, setCommitPeriod] = useState(0);

  const [dropDown, setDropDown] = useState(false);
  const [dropDownArrow, setDropDownArrow] = useState(arrowDown);

  const [commitmentValue, setCommitmentValue] = useState("Flexible");
  const [commitmentDropDown, setCommitmentDropDown] = useState(false);
  const [commitmentArrow, setCommitmentArrow] = useState(arrowDown);

  const [borrowDropDown, setBorrowDropDown] = useState(false);
  const [borrowArrow, setBorrowArrow] = useState(arrowDown);

  const [collateralMarketToken, setCollateralwMarketToken] = useState("USDT");

  const toggleDropdown = () => {
    setDropDown(!dropDown);
    setDropDownArrow(dropDown ? arrowDown : arrowUp);
    setBorrowDropDown(false);
    setBorrowArrow(arrowDown);
    setCommitmentDropDown(false);
    setCommitmentArrow(arrowDown);
    // disconnectEvent(), connect(connector);
  };

  const toggleBorrowDropdown = () => {
    setBorrowDropDown(!borrowDropDown);
    setBorrowArrow(borrowDropDown ? arrowDown : arrowUp);
    setDropDown(false);
    setDropDownArrow(arrowDown);
    setCommitmentDropDown(false);
    setCommitmentArrow(arrowDown);
    // disconnectEvent(), connect(connector);
  };

  useEffect(() => {
    setToken(getTokenFromName(asset));
    OffchainAPI.getProtocolDepositLoanRates().then((val) => {
      setDepositLoanRates(val);
    });
  }, [asset]);

  useEffect(() => {
    console.log(
      "approve tx receipt",
      approveTransactionReceipt.data?.transaction_hash,
      approveTransactionReceipt
    );
    TxToastManager.handleTxToast(
      approveTransactionReceipt,
      `Borrow: Approve ${borrowParams.collateralAmount?.toFixed(4)} ${
        borrowParams.collateralMarket
      }`,
      true
    );
  }, [approveTransactionReceipt]);

  useEffect(() => {
    console.log(
      "borrow tx receipt",
      requestBorrowTransactionReceipt.data?.transaction_hash,
      requestBorrowTransactionReceipt
    );
    if (borrowParams.loanAmount)
      TxToastManager.handleTxToast(
        requestBorrowTransactionReceipt,
        `Borrow ${borrowParams.loanAmount?.toFixed(4)} ${token?.name}`
      );
  }, [requestBorrowTransactionReceipt]);

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
        NumToBN(borrowParams.collateralAmount as number, 18),
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
          NumToBN(borrowParams.collateralAmount as number, 18),
          0,
        ],
      },
      {
        contractAddress: diamondAddress,
        entrypoint: "loan_request",
        calldata: [
          tokenAddressMap[asset],
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

  const handleCommitmentChange = (e: any) => {
    console.log(e.target.value);
    setBorrowParams({
      ...borrowParams,
      commitBorrowPeriod: e.target.value,
    });
  };

  const handleCollateralChange = async (asset: any) => {
    // console.log(`setting collateral market to ${e.target.value}`);
    // console.log(
    //   "------------------------------------------------------------------collateralMarketToken",
    //   collateralMarketToken
    // );
    setBorrowParams({
      ...borrowParams,
      collateralMarket: asset,
    });

    await refreshAllowance();
    await refreshBalance();
  };

  const handleLoanInputChange = async (asset: any) => {
    if (asset) {
      setBorrowParams({
        ...borrowParams,
        loanAmount: Number(asset),
      });
      await handleMinLoan(asset);
    } else {
      setBorrowParams({
        ...borrowParams,
        loanAmount: 0,
      });
    }
  };

  const handleCollateralInputChange = async (e: any) => {
    setBorrowParams({
      ...borrowParams,
      collateralAmount: Number(e.target.value),
    });
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
        10 ** 18,
    });
    await refreshAllowance();
  };

  const handleMaxLoan = async () => {
    setBorrowParams({
      ...borrowParams,
      loanAmount:
        Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
        10 ** 18,
    });
    await refreshAllowance();
  };

  const handleCommitChange = (e: any) => {
    setCommitPeriod(e);
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
      // approve collateral spending
      // await handleApprove();
      // if (errorApprove) {
      // 	toast.error(`${GetErrorText(`Approve for token ${asset} failed`)}`, {
      // 		position: toast.POSITION.BOTTOM_RIGHT,
      // 		closeOnClick: true,
      // 	});
      // 	return;
      // }

      // setAllowance(Number(BNtoNum(dataAllowance[0]?.low, 18)));
      try {
        let val = await executeBorrow();
        setTransBorrow(val.transaction_hash);
      } catch (err) {
        console.log(err, "err borrow");
      }
      if (errorBorrow) {
        toast.error(`${GetErrorText(`Borrow request for ${asset} failed`)}`, {
          position: toast.POSITION.BOTTOM_RIGHT,
          closeOnClick: true,
        });
        return;
      }
    } catch (err) {
      toast.error(`${GetErrorText(err)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
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

        // if (allowanceVal > (borrowParams?.collateralAmount as number)) {
        //   setAllowed(true);
        //   setShouldApprove(false);
        // } else {
        //   setShouldApprove(true);
        //   setAllowed(false);
        // }
      } else if (errorAllowance) {
        // handleToast(true, "Check allowance", errorAllowance)
      }
    }
  }, [dataAllowance, errorAllowance, refreshAllowance, loadingAllowance]);

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
  // function isValidLoanAmount
  function isValid() {
    return isValidColleteralAmount() && isLoanAmountValid();
  }

  return (
    <>
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
          {account ? (
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
                  onChange={handleCollateralInputChange}
                  value={
                    borrowParams.collateralAmount
                      ? (borrowParams.collateralAmount as number)
                      : 0
                  }
                  valid={isValidColleteralAmount()}
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
                      onClick={handleMax}
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
              {/* {!isValidColleteralAmount() ? (
                <FormText color="#e97272">
                  Collateral amount must be non-zero and {"<="} your balance
                </FormText>
              ) : (
                <></>
              )} */}
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
              {dropDown ? (
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
              )}
              {borrowDropDown ? (
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
              )}
              {/* <FormGroup floating>
                <div className="row mb-4">
                  <Col sm={12}>
                    <Label for="loan-amount">Loan amount</Label>
                    <InputGroup>
                      <Input
                        id="loan-amount"
                        type="text"
                        className="form-control"
                        placeholder={`Minimum amount = ${MinimumAmount[asset]}`}
                        min={MinimumAmount[asset]}
                        value={borrowParams.loanAmount as number}
                        onChange={handleLoanInputChange}
                        valid={isLoanAmountValid()}
                      />
                      {
                        <>
                          <Button
                            outline
                            type="button"
                            className="btn btn-md w-xs"
                            onClick={() => handleMinLoan(asset)}
                            style={{ background: "#2e3444", border: "#2e3444" }}
                          >
                            Min
                          </Button>
                        </>
                      }
                    </InputGroup>
                    {!isLoanAmountValid() ? (
                      <FormText>
                        Loan amount should be {">="} {MinimumAmount[asset]}{" "}
                        {asset}
                      </FormText>
                    ) : (
                      <></>
                    )}
                  </Col>
                </div>
              </FormGroup> */}
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
                      onClick={toggleBorrowDropdown}
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
                    placeholder={`Minimum amount = ${MinimumAmount[asset]}`}
                    min={MinimumAmount[asset]}
                    value={borrowParams.loanAmount as number}
                    onChange={handleLoanInputChange}
                    valid={isLoanAmountValid()}
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
                        onClick={handleMaxLoan}
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
              <div className="row mb-12">
                {/* <Col sm={12}>
                  <p>
                    Borrow APR:{" "}
                    <strong>
                      {depositLoanRates &&
                      borrowParams.commitBorrowPeriod != null &&
                      (borrowParams.commitBorrowPeriod as number) < 4 ? (
                        `${
                          parseFloat(
                            depositLoanRates[
                              `${getTokenFromName(asset as string).address}__${
                                borrowParams.commitBorrowPeriod
                              }`
                            ]?.borrowAPR?.apr100x as string
                          ) / 100
                        } %`
                      ) : (
                        <MySpinner />
                      )}
                    </strong>
                  </p>
                </Col> */}
                {/* <Col sm={6}>
                  <p style={{ float: "right" }}>
                    Collateral APY{" "}
                    <strong>
                      {depositLoanRates &&
                      (borrowParams.commitBorrowPeriod as number) < 4 &&
                      borrowParams.commitBorrowPeriod ? (
                        `${
                          parseFloat(
                            depositLoanRates[
                              `${getTokenFromName(asset as string).address}__${
                                borrowParams.commitBorrowPeriod
                              }`
                            ]?.depositAPR?.apr100x as string
                          ) / 100
                        } %`
                      ) : (
                        <MySpinner />
                      )}
                    </strong>
                  </p>
                </Col> */}
              </div>
              {/* <div className="row mb-4">
                <Col sm={8}>
                  {borrowParams.collateralMarket && (
                    // <div align="right">
                    <div style={{ float: "right" }}>
                      {" "}
                      Balance :{" "}
                      {dataBalance
                        ? (
                            Number(uint256.uint256ToBN(dataBalance[0])) /
                            10 ** 18
                          ).toString()
                        : " Loading"}
                    </div>
                  )}
                </Col>
              </div> */}
              {/* <FormGroup floating>
                <div className="row mb-4">
                  <Col sm={12}>
                    <Label for="collateral-market">Collateral Market</Label>
                    <select
                      id="collteral-market"
                      className="form-select"
                      onChange={handleCollateralChange}
                    >
                      <option hidden>Collateral market</option>
                      <option value={"USDT"}>USDT</option>
                      <option value={"USDC"}>USDC</option>
                      <option value={"BTC"}>BTC</option>
                      <option value={"BNB"}>BNB</option>
                    </select>
                  </Col>
                </div>
              </FormGroup> */}
              {/* <div className="row mb-4">
                <Col sm={12}>
                  <Label for="amount">Collateral Amount</Label>
                  <InputGroup>
                    <Input
                      type="number"
                      className="form-control"
                      id="amount"
                      placeholder="Amount"
                      onChange={handleCollateralInputChange}
                      value={
                        borrowParams.collateralAmount
                          ? (borrowParams.collateralAmount as number)
                          : 0
                      }
                      valid={isValidColleteralAmount()}
                    />
                    {borrowParams.collateralMarket && (
                      <>
                        <Button
                          outline
                          type="button"
                          className="btn btn-md w-xs"
                          onClick={handleMin}
                          // disabled={dataBalance ? false : true}
                          style={{ background: "#2e3444", border: "#2e3444" }}
                        >
                          <span style={{ borderBottom: "2px dotted #fff" }}>
                            {isLoading ? <MySpinner /> : "Min"}
                          </span>
                        </Button>

                        <Button
                          outline
                          type="button"
                          className="btn btn-md w-xs"
                          onClick={handleMax}
                          disabled={dataBalance ? false : true}
                          style={{ background: "#2e3444", border: "#2e3444" }}
                        >
                          <span style={{ borderBottom: "2px dotted #fff" }}>
                            Max
                          </span>
                        </Button>
                      </>
                    )}
                  </InputGroup>
                  {!isValidColleteralAmount() ? (
                    <FormText color="#e97272">
                      Collateral amount must be non-zero and {"<="} your balance
                    </FormText>
                  ) : (
                    <></>
                  )}
                </Col>
              </div> */}
              <div className="d-grid gap-2">
                {/* {allowanceVal < (borrowParams.collateralAmount as number) ? (
                  <Button
                    color="primary"
                    className="w-md"
                    disabled={
                      borrowParams.commitBorrowPeriod === undefined ||
                      loadingApprove ||
                      loadingBorrow || 
                      loadingAllowance
                    }
                    onClick={(e) => handleApprove(asset)}
                  >
                    {!(
                      
                      loadingApprove ||
                      isTransactionLoading(approveTransactionReceipt)
                    ) ? (
                      "Approve"
                    ) : (
                      <MySpinner text="Approving token" />
                    )}
                  </Button>
                ) :  */}
                {/* ( */}

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
                    <div style={{ textAlign: "right", fontWeight: "600" }}>
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
                    <div style={{ color: "#6F6F6F" }}>Transaction fees:</div>
                    <div style={{ textAlign: "right", fontWeight: "600" }}>
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
                    <div style={{ textAlign: "right", fontWeight: "600" }}>
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
                    <div style={{ color: "#6F6F6F" }}>i Collateral market:</div>
                    <div style={{ textAlign: "right", fontWeight: "400" }}>
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
                    <div style={{ color: "#6F6F6F" }}>ii Borrow market:</div>
                    <div style={{ textAlign: "right", fontWeight: "400" }}>
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
                    <div style={{ textAlign: "right", fontWeight: "600" }}>
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
                    <div style={{ textAlign: "right", fontWeight: "600" }}>
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
                    <div style={{ textAlign: "right", fontWeight: "600" }}>
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
                    <div style={{ color: "#6F6F6F" }}>Borrow network:</div>
                    <div style={{ textAlign: "right", fontWeight: "600" }}>
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
                  onClick={(e) => handleBorrow(asset)}
                >
                  {!(
                    loadingApprove ||
                    isTransactionLoading(requestBorrowTransactionReceipt)
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
  );
};

export default Borrow = React.memo(Borrow);
