import {
  useAccount,
  useContract,
  useStarknetCall,
  useStarknetExecute,
  useTransactionReceipt,
} from "@starknet-react/core";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
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
} from "reactstrap";
import useAddDeposit from "../../../blockchain/hooks/active-deposits/useAddDeposit";

import Image from "next/image";
import arrowDown from "../../../assets/images/ArrowDownDark.svg";
import arrowUp from "../../../assets/images/ArrowUpDark.svg";
import { Coins, ICoin } from "../../dashboard/dashboard-body";
import { Abi, uint256 } from "starknet";
import { toast } from "react-toastify";
import classnames from "classnames";
import {
  diamondAddress,
  ERC20Abi,
  getTokenFromAddress,
  getTokenFromName,
  l3DiamondAddress,
  tokenAddressMap,
  tokenDecimalsMap,
} from "../../../blockchain/stark-constants";
import JediSwapAbi from "../../../../starknet-artifacts/contracts/integrations/modules/jedi_swap.cairo/jedi_swap_abi.json";
import MySwapAbi from "../../../../starknet-artifacts/contracts/integrations/modules/my_swap.cairo/my_swap_abi.json";
import { currentBorrowInterestRate, etherToWeiBN, NumToBN } from "../../../blockchain/utils";
import { MinimumAmount } from "../../../blockchain/constants";
import { TabContext } from "../../../hooks/contextHooks/TabContext";
import useJediSwap from "../../../blockchain/hooks/SpendBorrow/useJediSwap";
import useMySwap from "../../../blockchain/hooks/SpendBorrow/useMySwap";
import ToastModal from "../../toastModals/customToastModal";
import MySpinner from "../../mySpinner";
import { number } from "starknet";
import { SecTabContext } from "../../../hooks/contextHooks/SecTabContext"


const SpendLoanNav = ({ activeLoansData, modal_deposit, setmodal_deposit }) => {

  const { selectedLoan, setSelectedLoan, setTitle, title } = useContext(TabContext)
  // const {appsImage, setAppsImage} = 
  // const [modal_deposit, setmodal_deposit] = useState(false);
  const { appsImage, setAppsImage } = useContext(SecTabContext);
  const [tokenName, setTokenName] = useState("BTC");


  const {
    executeJediSwap,
    dataJediSwap,
    loadingJediSwap,
    errorJediSwap,
    handleJediSwap,

    supportedPoolsJediSwap,

    isJediswapToastOpen,
    setIsToastJediswapOpen,
    toastJediswapParam,
  } = useJediSwap(diamondAddress, selectedLoan, tokenName);

  const {
    handleMySwap,
    loadingMySwap,
    errorMySwap,
    isMyswapToastOpen,
    supportedPoolsMySwap,
    setIsToastMyswapOpen,
    toastMyswapParam,
    poolIdtoTokens,
  } = useMySwap(diamondAddress, selectedLoan, tokenName);

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
  } = useAddDeposit(tokenName, diamondAddress);

  const { address: account } = useAccount();

  // const [isCollateralActions, setIsCollateralActions] = useState(false);
  // const [isSelfLiquidate, setIsSelfLiquidate] = useState(false);
  // const [customActiveTab, setCustomActiveTab] = useState("1");

  const [dropDown, setDropDown] = useState(false);
  const [dropDownArrow, setDropDownArrow] = useState(arrowDown);
  const [dappDownArrow, setDappDownArrow] = useState(arrowDown);
  const [dropDownTwo, setDropDownTwo] = useState(false);
  const [stakeDropDownArrow, setStakeDropDownArrow] = useState(arrowDown);
  const [idDropDown, setIdDropDown] = useState(false);
  const [idDropDownArrow, setIdDropDownArrow] = useState(arrowDown);



  // const [borrowInterest, setBorrowInterest] = useState<string>("");
  // const [currentBorrowInterest, setCurrentBorrowInterest] = useState<string>();

  // const [selection, setSelection] = useState("Withdraw Partial Borrow");
  // const [selectionTwo, setSelectionTwo] = useState("Add Collateral");

  const [poolId, setPoolId] = useState(0);

  const [totalAmountOutmySwap, setTotalAmountOutmySwap] = useState("N/A");
  const [totalAmountOutJediSwap, setTotalAmountOutJediSwap] = useState("N/A");

  const [value, setValue] = useState(0);
  const [commitPeriod, setCommitPeriod] = useState(0);
  // const [transDeposit, setTransDeposit] = useState("");
  // const [SpendLoan, setSpendLoan] = useState<any>();
  const dappsArray = [
    { name: "jediSwap", supportedActions: ["Swap"] },
    { name: "mySwap", supportedActions: ["Swap"] },
    { name: "yagi", supportedActions: ["Stake"] },
  ];
  const [dappDropdown, setDappDropdown] = useState(false);

  const { contract } = useContract({
    abi: ERC20Abi as Abi,
    address: tokenAddressMap[tokenName] as string,
  });

  const labels = ["Stake", "Swap", "Trade"];

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
      calldata: [diamondAddress, etherToWeiBN(depositAmount, tokenAddressMap[tokenName] || "").toString(), 0],
    },
  });

  const {
    data: dataDeposit,
    error: errorDeposit,
    reset: resetDeposit,
    execute: executeDeposit,
  } = useStarknetExecute({
    calls: [
      {
        contractAddress: tokenAddressMap[tokenName] as string,
        entrypoint: "approve",
        calldata: [diamondAddress, etherToWeiBN(depositAmount, tokenAddressMap[tokenName] || "").toString(), 0],
      },
      {
        contractAddress: diamondAddress,
        entrypoint: "deposit_request",
        calldata: [
          tokenAddressMap[tokenName],
          commitPeriod,
          etherToWeiBN(depositAmount, tokenAddressMap[tokenName] || "").toString(),
          0,
        ],
      },
    ],
  });

  const changeTo18Decimals = (value: any, market: any) => {
    if (!tokenDecimalsMap[market]) return value;
    const decimalsDeficit = 18 - tokenDecimalsMap[market];
    console.log('changeTo18Decimals', value, market, decimalsDeficit)
    return number.toBN(value).mul(number.toBN(10 ** decimalsDeficit)).toString();
  }

  const requestDepositTransactionReceipt = useTransactionReceipt({
    hash: transDeposit,
    watch: true,
  });

  useEffect(() => {
    let currentPoolId = 0;
    if (!poolIdtoTokens) return;
    for (const [poolId, tokens] of poolIdtoTokens.entries()) {
      if (
        tokens.includes(tokenAddressMap[selectedLoan?.loanMarket]) &&
        tokens.includes(tokenAddressMap[tokenName])
      ) {
        currentPoolId = poolId;
        // console.log("poolId", poolId);
        break;
      }
    }
    setPoolId(currentPoolId);
  }, [selectedLoan, poolIdtoTokens, tokenName]);

  const { contract: l3JediContract } = useContract({
    abi: JediSwapAbi as Abi,
    address:
      l3DiamondAddress,
  });

  const getAmount = () => {
    let amountOut = selectedLoan?.currentLoanAmount || "0";
    // console.log("getAmount", amountOut);
    return amountOut;
  };

  const {
    data: getAmountOutData,
    loading: loadingGetAmountOut,
    error: errorGetAmountOut,
    refresh: refreshGetAmountOut,
  } = useStarknetCall({
    contract: l3JediContract,
    method: "get_amount_out_jedi_swap",
    args: [
      // "0x38be05dde4b01e92d12a62f5dfa6584b5cad8e7b2295e2cb488f2b0385ff34f",
      // "0x5b2a7c089e36c6caf4724d2df5bd7687fcdc9bd76d280ecb1e411410811b54e",
      // uint256.bnToUint256(number.toBN("10").pow(number.toBN("25"))),
      tokenAddressMap[selectedLoan?.loanMarket],
      tokenAddressMap[tokenName],
      uint256.bnToUint256(number.toBN(getAmount().toString())),
    ],
    options: {
      watch: true,
    },
  });

  useEffect(() => {
    // console.log(
    //   "getamount",
    //   tokenAddressMap[selectedLoan?.loanMarket],
    //   tokenAddressMap[tokenName],
    //   selectedLoan?.currentLoanAmount || "0",
    //   getTokenFromName(selectedLoan?.loanMarket)?.name,
    //   getTokenFromName(tokenName)?.name
    // );
    // console.log(
    //   "getAmountOutDataJediSwap",
    //   getAmountOutData,
    //   getAmountOutData?.amount_to
    //     ? uint256.uint256ToBN(getAmountOutData?.amount_to).toString()
    //     : "NA",
    //   loadingGetAmountOut,
    //   errorGetAmountOut
    // );
    const decimalsDeficit = 18 - tokenDecimalsMap[tokenName];
    const amount = getAmountOutData?.amount_to
      ? uint256.uint256ToBN(getAmountOutData?.amount_to)
        .mul(number.toBN(10).pow(number.toBN(decimalsDeficit))).toString()
      : "NA";
    setTotalAmountOutJediSwap(amount);
  }, [getAmountOutData, loadingGetAmountOut, errorGetAmountOut]);

  const { contract: l3MySwapContract } = useContract({
    abi: MySwapAbi as Abi,
    address:
      l3DiamondAddress,
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
      tokenAddressMap[selectedLoan?.loanMarket],
      tokenAddressMap[tokenName],
      uint256.bnToUint256(number.toBN(getAmount().toString())),
      poolId, // use pool id of respective pool. get from supported pools function
    ],
    options: {
      watch: true,
    },
  });

  useEffect(() => {
    // console.log(
    //   "getamountmyswap",
    //   tokenAddressMap[selectedLoan?.loanMarket],
    //   tokenAddressMap[tokenName],
    //   selectedLoan?.currentLoanAmount || "0",
    //   getTokenFromName(selectedLoan?.loanMarket)?.name,
    //   getTokenFromName(tokenName)?.name
    // );
    // console.log(
    //   "getAmountOutDataMyswap",
    //   getAmountOutDataMySwap,
    //   getAmountOutDataMySwap?.amount_to
    //     ? uint256.uint256ToBN(getAmountOutDataMySwap?.amount_to).toString()
    //     : "NA",
    //   loadingGetAmountOutMySwap,
    //   errorGetAmountOutMySwap
    // );
    const decimalsDeficit = 18 - tokenDecimalsMap[tokenName];
    const amount = getAmountOutDataMySwap?.amount_to
      ? uint256.uint256ToBN(getAmountOutDataMySwap?.amount_to)
        .mul(number.toBN(10).pow(number.toBN(decimalsDeficit))).toString()
      : "NA";
    setTotalAmountOutmySwap(amount);
  }, [
    getAmountOutDataMySwap,
    loadingGetAmountOutMySwap,
    errorGetAmountOutMySwap,
  ]);

  const tog_center = async () => {
    console.log("Here hai apun");
    setmodal_deposit(!modal_deposit);
    console.log(modal_deposit);

    // removeBodyCss();
  };

  const toggleDropdown = () => {
    setDropDown(!dropDown);
    setDropDownArrow(dropDown ? arrowDown : arrowUp);
    // disconnectEvent(), connect(connector);
  };

  const handleBalanceChange = async () => {
    await refreshAllowance();
    await refreshBalance();
  };

  const handleDepositAmountChange = (e: any) => {
    if (e.target.value) setDepositAmount(Number(e.target.value));
    else setDepositAmount(0);
  };

  const toggleDappDropdown = () => {
    setDappDropdown(!dappDropdown);
    setDappDownArrow(dappDropdown ? arrowDown : arrowUp);
  };

  const handleCTAButton = () => {
    if (title.label === "Swap") {
      appsImage === "mySwap"
        ? handleMySwap()
        : appsImage === "jediSwap"
          ? handleJediSwap()
          : null;
    } else return null;
  };

  const selectionAction = (value: string) => {
    setSelection(value);
    setDropDown(false);
    setDropDownArrow(arrowDown);

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

  return (
    <>
      <div style={{ margin: "40px 15px" }}>
        <Nav
          tabs
          className="nav-tabs-custom"
          style={{ borderBottom: "0px", gap: "10px" }}
        >
          <NavItem
            onClick={() => {
              setTitle({
                label: "Stake",
              });
            }}
          >
            <NavLink
              style={{
                cursor: "pointer",
                color: "black",
                borderRadius: "5px",
                boxShadow:
                  "5px 10px 5px -5px rgba(20, 23, 38, 0.15), 5px 5px 5px -5px rgba(20, 23, 38, 0.3)",
              }}
              className={classnames({
                active: title.label === "Stake",
              })}
            >
              <span className="d-none d-sm-block">Stake</span>
            </NavLink>
          </NavItem>

          <NavItem
            onClick={() => {
              setTitle({
                label: "Swap",
              });
            }}
          >
            <NavLink
              style={{
                cursor: "pointer",
                color: "black",
                borderRadius: "5px",
                boxShadow:
                  "5px 10px 5px -5px rgba(20, 23, 38, 0.15), 5px 5px 5px -5px rgba(20, 23, 38, 0.3)",
              }}
              className={classnames({
                active: title.label === "Swap",
              })}
            >
              <span className="d-none d-sm-block">Swap</span>
            </NavLink>
          </NavItem>

          <NavItem
            onClick={() => {
              setTitle({
                label: "Trade",
              });
            }}
          >
            <NavLink
              style={{
                cursor: "pointer",
                color: "black",
                borderRadius: "5px",
                boxShadow:
                  "5px 10px 5px -5px rgba(20, 23, 38, 0.15), 5px 5px 5px -5px rgba(20, 23, 38, 0.3)",
              }}
              className={classnames({
                active: title.label === "Trade",
              })}
            >
              <span className="d-none d-sm-block">Trade</span>
            </NavLink>
          </NavItem>
        </Nav>
      </div>
      <div
        style={{
          fontSize: "16px",
          marginLeft: "15px",
          color: "white",
        }}
      >
        Select Dapp to begin with the spend
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-betwwen",
          gap: "120px",
          margin: "10px 15px",
        }}
      >
        {dappsArray.map((dapp, index) => {
          if (
            dapp.supportedActions.find(
              (action: string) =>
                action === title.label || title.label === "None"
            )
          ) {
            return (
              <div
                key={index}
                onClick={() => {
                  if (!activeLoansData) return;

                  setmodal_deposit(true);
                  // tog_center()
                  if (!selectedLoan) setSelectedLoan(activeLoansData?.[0]);
                  setTokenName((prev) => {
                    if (dapp.name === "jediSwap") {
                      return getTokenFromAddress(
                        supportedPoolsJediSwap.get(
                          tokenAddressMap[selectedLoan?.loanMarket]
                        )?.[0] as string
                      )?.symbol;
                    } else if (dapp.name === "mySwap") {
                      return getTokenFromAddress(
                        supportedPoolsMySwap.get(
                          tokenAddressMap[selectedLoan?.loanMarket]
                        )?.[0] as string
                      )?.symbol;
                    } else return prev;
                  });
                  setAppsImage(dapp.name);
                  setTitle({
                    label: dapp.supportedActions[0],
                  });
                  // setSpendLoan(
                  //   dapp.supportedActions[0] === "Swap"
                  //     ? "2"
                  //     : dapp.supportedActions[0] === "Stake"
                  //     ? "1"
                  //     : "3"
                  // );
                }}
              >
                <img
                  src={`./dapps/${dapp.name}.svg`}
                  height="90px"
                  style={{ cursor: "pointer" }}
                />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-betwwen",
          gap: "120px",
          margin: "10px 15px",
        }}
      ></div>

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
          {" "}
          <div
            style={{ margin: "10px 0", fontSize: "20px", fontWeight: "400" }}
          >
            <Col
              sm={8}
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <h5 style={{ color: "white", fontSize: "24px" }}>Spend Borrow</h5>
              <img
                src="./cross.svg"
                onClick={() => {
                  setmodal_deposit(false);
                }}
                style={{ marginTop: "5px", cursor: "pointer" }}
                height="15px"
              />
            </Col>
            <div
              style={{
                fontSize: "11px",
                color: "#8B8B8B",
                padding: "5px 0 10px 0",
                display: "flex",
                gap: "10px",
              }}
            >
              <div>Borrow ID - {selectedLoan?.loanId}</div>
              <Image
                style={{ cursor: "pointer" }}
                src={idDropDownArrow}
                alt="Picture of the author"
                width="14px"
                height="14px"
                onClick={() => {
                  setIdDropDownArrow(idDropDown ? arrowDown : arrowUp);
                  setIdDropDown(!idDropDown);
                  // setTokenName((prev) => {
                  //   if (appsImage === "jediSwap") {
                  //     return getTokenFromAddress(supportedPoolsJediSwap.get(tokenAddressMap[dapp.loanMarket])[0] as string).name;
                  //   }
                  //   else if (appsImage === "mySwap") {
                  //     return getTokenFromAddress(supportedPoolsMySwap.get(tokenAddressMap[dapp.loanMarket])[0] as string).name;
                  //   }
                  //   else return prev;
                  // });
                }}
              />
            </div>
            {account ? (
              <Form>
                <div style={{ minWidth: "30vw" }}>
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
                        marginBottom: "20px",
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
                      <div style={{ textAlign: "center" }}>{title.label}</div>
                      <Image
                        onClick={() => {
                          setStakeDropDownArrow(
                            dropDownTwo ? arrowDown : arrowUp
                          );
                          setDropDownTwo(!dropDownTwo);
                        }}
                        style={{ cursor: "pointer" }}
                        src={stakeDropDownArrow}
                        alt="Picture of the author"
                        width="14px"
                        height="14px"
                      />
                    </label>

                    <label
                      style={{
                        width: "300px",
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
                          &nbsp;&nbsp;
                          <img
                            src={`./${appsImage}.svg`}
                            width={`${appsImage === "mySwap" ? "60px" : "100px"
                              }`}
                            height="30px"
                          ></img>
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
                            onClick={() => {
                              toggleDappDropdown();
                            }}
                            src={dappDownArrow}
                            alt="Picture of the author"
                            width="14px"
                            height="14px"
                          />
                        </div>

                        {dappDropdown ? (
                          <>
                            <div
                              style={{
                                borderRadius: "5px",
                                position: "absolute",
                                zIndex: "100",
                                top: "162px",
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
                                  dapp.supportedActions.includes(title.label)
                                ) {
                                  if (appsImage === dapp.name) {
                                    return <></>;
                                  }
                                  return (
                                    <div
                                      style={{
                                        margin: "10px 15px",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        fontSize: "16px",
                                      }}
                                      key={index}
                                      onClick={() => {
                                        setAppsImage(`${dapp.name}`);
                                        toggleDappDropdown();
                                        setTokenName((prev) => {
                                          if (dapp.name === "jediSwap") {
                                            return getTokenFromAddress(
                                              supportedPoolsJediSwap?.get(
                                                tokenAddressMap[
                                                selectedLoan?.loanMarket
                                                ]
                                              )?.[0] as string
                                            )?.symbol;
                                          } else if (dapp.name === "mySwap") {
                                            return getTokenFromAddress(
                                              supportedPoolsMySwap?.get(
                                                tokenAddressMap[
                                                selectedLoan?.loanMarket
                                                ]
                                              )?.[0] as string
                                            )?.symbol;
                                          } else return prev;
                                        });
                                      }}
                                    >
                                      <img
                                        src={`./${dapp.name}.svg`}
                                        width={`${dapp.name === "mySwap"
                                          ? "60px"
                                          : "100px"
                                          }`}
                                        height="30px"
                                      ></img>
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

                        {dropDownTwo ? (
                          <>
                            <div
                              style={{
                                borderRadius: "5px",
                                position: "absolute",
                                zIndex: "100",
                                top: "162px",
                                left: "40px",

                                width: "100px",
                                margin: "0px auto",
                                marginBottom: "20px",
                                padding: "5px 10px",
                                backgroundColor: "#1D2131",
                                boxShadow: "0px 0px 10px #00000020",
                              }}
                            >
                              {labels.map((word, index, labels) => {
                                if (title.label === word) {
                                  return <></>;
                                }
                                return (
                                  <>
                                    <div
                                      style={{
                                        margin: "10px 0",
                                        cursor: word !== "Trade" ? "pointer" : "",
                                        display: "flex",
                                        alignItems: "center",
                                        fontSize: "14px",
                                      }}
                                      key={index}

                                      onClick={() => {
                                        {
                                          if (word !== "Trade") {
                                            setTitle({ label: word });
                                            setDropDownTwo(!dropDownTwo);
                                            setStakeDropDownArrow(arrowDown);
                                            setAppsImage((prev) =>
                                              word === "Swap"
                                                ? "jediSwap"
                                                : word === "Stake"
                                                  ? "yagi"
                                                  : prev
                                            );
                                          }
                                        }
                                      }
                                      }
                                    >
                                      {word}
                                    </div>{" "}
                                    {index < labels.length - 1 ? <hr /> : null}
                                  </>
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          <></>
                        )}

                        {idDropDown ? (
                          <>
                            <div
                              style={{
                                borderRadius: "5px",
                                position: "absolute",
                                zIndex: "100",
                                top: "108px",
                                left: "40px",
                                width: "100px",
                                margin: "0px auto",
                                marginBottom: "20px",
                                padding: "5px 10px",
                                backgroundColor: "#393D4F",
                              }}
                            >
                              {activeLoansData.map(
                                (loan: any, index: number) => {
                                  return (
                                    <div
                                      key={index}
                                      style={{
                                        margin: "10px 0",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        fontSize: "0.7rem",
                                        color: "#6F6F6F",
                                      }}
                                      onClick={() => {
                                        setSelectedLoan(loan);
                                        setIdDropDownArrow(arrowDown);
                                        setIdDropDown(!idDropDown);
                                        setTokenName((prev) => {
                                          if (appsImage === "jediSwap") {
                                            return getTokenFromAddress(
                                              supportedPoolsJediSwap.get(
                                                tokenAddressMap[loan.loanMarket]
                                              )[0] as string
                                            )?.symbol;
                                          } else if (appsImage === "mySwap") {
                                            return getTokenFromAddress(
                                              supportedPoolsMySwap.get(
                                                tokenAddressMap[loan.loanMarket]
                                              )[0] as string
                                            )?.symbol;
                                          } else return prev;
                                        });
                                      }}
                                    >
                                      {`Borrow ID: ${loan.loanId}`}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </label>
                  </div>

                  {title.label === "Swap" || title.label === "Trade" ? (
                    <>
                      <div style={{ fontSize: "11px", color: "#8B8B8B" }}>
                        From
                      </div>

                      <label
                        style={{
                          width: "420px",
                          // marginBottom: "25px",
                          // padding: "5px 10px",
                          fontSize: "14px",
                          // borderRadius: "5px",
                          // border: "2px solid rgb(57, 61, 79)",
                          fontWeight: "200",
                        }}
                      >
                        <div
                          style={{
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              marginBottom: "10px",
                              color: "#8B8B8B",
                            }}
                          >
                            <div>Borrowed Market :</div>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              {selectedLoan ? (
                                <Image
                                  alt="hello"
                                  src={`/${selectedLoan?.loanMarket}.svg`}
                                  width="17px"
                                  height="17px"
                                />
                              ) : <span style={{ color: "white" }}>
                                N/A
                              </span>}
                              &nbsp;&nbsp;
                              <span style={{ color: "white" }}>
                                {selectedLoan?.loanMarketSymbol}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            color: "#8B8B8B",
                            marginTop: "-5px",
                          }}
                        >
                          <div>Availabe Borrowed Amount :</div>
                          <div style={{ color: "white" }}>
                            {selectedLoan ? (
                              selectedLoan?.currentLoanAmount /
                              10 **
                              (tokenDecimalsMap[selectedLoan?.loanMarket] ||
                                18)
                            ).toFixed(4) || 0 : <span style={{ color: "white" }}>
                              N/A
                            </span>}
                            &nbsp;{selectedLoan?.loanMarketSymbol}
                          </div>
                        </div>
                      </label>

                      <div
                        style={{
                          fontSize: "11px",
                          color: "#8B8B8B",
                          marginTop: "5px",
                        }}
                      >
                        To
                      </div>

                      <label
                        style={{
                          width: "420px",
                          marginBottom: "25px",
                          padding: "5px 10px",
                          fontSize: "16px",
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
                              onClick={toggleDropdown}
                              src={dropDownArrow}
                              alt="Picture of the author"
                              width="14px"
                              height="14px"
                            />
                          </div>
                        </div>
                      </label>
                      {dropDown ? (
                        <>
                          <div
                            style={{
                              borderRadius: "5px",
                              position: "absolute",
                              zIndex: "100",
                              top: "326px",
                              left: "40px",

                              width: "420px",
                              margin: "0px auto",
                              marginBottom: "20px",
                              padding: "5px 10px",
                              backgroundColor: "#1D2131",
                              boxShadow: "0px 0px 10px #00000020",
                            }}
                          >
                            {Coins.map((coin, index) => {
                              if (coin.name === tokenName) return <></>;
                              const borrowMarketAddress =
                                tokenAddressMap[selectedLoan?.loanMarket];
                              const supportedMarkets =
                                appsImage === "jediSwap"
                                  ? supportedPoolsJediSwap?.get(
                                    borrowMarketAddress
                                  )
                                  : supportedPoolsMySwap?.get(
                                    borrowMarketAddress
                                  );
                              const isSupported = supportedMarkets?.includes(
                                tokenAddressMap[coin.name]
                              );
                              if (!isSupported) return <></>;
                              return (
                                <>
                                  <div
                                    style={{
                                      margin: "7px 0",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      fontSize: "16px",
                                    }}
                                    key={index}
                                    onClick={() => {
                                      setTokenName(`${coin.name}`);
                                      setDropDown(false);
                                      setDropDownArrow(arrowDown);
                                      handleBalanceChange();
                                    }}
                                  >
                                    <img
                                      src={`./${coin.name}.svg`}
                                      width="18px"
                                      height="20px"
                                    ></img>
                                    <div>&nbsp;&nbsp;&nbsp;{coin.name}</div>
                                  </div>
                                  {index < supportedMarkets?.length ? (
                                    <hr />
                                  ) : null}
                                </>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <label
                      style={{
                        width: "420px",
                        // marginBottom: "25px",
                        // padding: "5px 10px",
                        fontSize: "14px",
                        // borderRadius: "5px",
                        // border: "2px solid rgb(57, 61, 79)",
                        fontWeight: "200",
                      }}
                    >
                      <div
                        style={{
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0px 0 12px 0",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            color: "#8B8B8B",
                          }}
                        >
                          <div>Borrowed Market :</div>
                          <div>
                            {
                              selectedLoan ? (
                                <img
                                  src={`./${selectedLoan?.loanMarket}.svg`}
                                  width="24px"
                                  height="24px"
                                />
                              ) : <span style={{ color: "white" }}>N/A</span>
                            }
                            &nbsp;&nbsp;
                            <span style={{ color: "white" }}>
                              {selectedLoan?.loanMarket}
                            </span>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            color: "#8B8B8B",
                          }}
                        >
                          <div>Availabe Borrowed Amount :</div>
                          <div style={{ color: "white" }}>
                            {selectedLoan ? (
                              selectedLoan?.currentLoanAmount /
                              10 **
                              (tokenDecimalsMap[selectedLoan?.loanMarket] ||
                                18)
                            ).toFixed(4) :
                              <span style={{ color: "white" }}>N/A</span>
                            }
                            &nbsp;&nbsp;{selectedLoan?.loanMarket}
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
                    </label>
                  )}
                </div>

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
                      <div style={{ color: "#6F6F6F" }}>Est. conversion:</div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#6F6F6F",
                        }}
                      >
                        {/* 1 BTC = 21,000 USDT */}
                        {selectedLoan ? (appsImage === "mySwap" ? (
                          totalAmountOutmySwap !== "NA" ? (
                            totalAmountOutmySwap >
                              changeTo18Decimals(selectedLoan?.currentLoanAmount, selectedLoan.loanMarket) ? (
                              `1 ${selectedLoan?.loanMarket} = ${(
                                totalAmountOutmySwap /
                                changeTo18Decimals(selectedLoan?.currentLoanAmount, selectedLoan.loanMarket)
                              ).toFixed(4)} ${tokenName}`
                            ) : (
                              `1 ${tokenName} = ${(
                                changeTo18Decimals(selectedLoan?.currentLoanAmount, selectedLoan.loanMarket) /
                                totalAmountOutmySwap
                              ).toFixed(4)} ${selectedLoan?.loanMarket}`
                            )
                          ) : (
                            <MySpinner />
                          )
                        ) : appsImage === "jediSwap" ? (
                          totalAmountOutJediSwap !== "NA" ? (
                            totalAmountOutJediSwap >
                              changeTo18Decimals(selectedLoan?.currentLoanAmount, selectedLoan?.loanMarket) ? (
                              `1 ${selectedLoan?.loanMarket} = ${(
                                totalAmountOutJediSwap /
                                changeTo18Decimals(selectedLoan?.currentLoanAmount, selectedLoan?.loanMarket)
                              ).toFixed(4)} ${tokenName}`
                            ) : (
                              `1 ${tokenName} = ${(
                                changeTo18Decimals(selectedLoan?.currentLoanAmount, selectedLoan?.loanMarket) /
                                totalAmountOutJediSwap
                              ).toFixed(4)} ${selectedLoan?.loanMarket}`
                            )
                          ) : (
                            <MySpinner />
                          )
                        ) : (
                          "-"
                        )) : (
                          "-"
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
                      <div style={{ color: "#6F6F6F" }}>Gas Estimate:</div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "#6F6F6F",
                        }}
                      >
                        $ 0.50
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
                    color="white"
                    className="w-md"
                    style={{ backgroundColor: "rgb(57, 61, 79)" }}
                    disabled={
                      (appsImage === "mySwap" && loadingJediSwap) ||
                      (appsImage === "jediSwap" && loadingMySwap)
                    }
                    onClick={handleCTAButton}
                  >
                    {title.label}
                  </Button>
                </div>
              </Form>
            ) : (
              <h2 style={{ color: "white" }}>Please connect your wallet</h2>
            )}
          </div>
        </div>
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
      </Modal>
    </>
  );
};

export default SpendLoanNav;
