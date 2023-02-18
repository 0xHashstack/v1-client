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
import { ICoin } from "../../dashboard/dashboard-body";
import { Abi, uint256 } from "starknet";
import { toast } from "react-toastify";
import classnames from "classnames";
import {
  diamondAddress,
  ERC20Abi,
  tokenAddressMap,
} from "../../../blockchain/stark-constants";
import { currentBorrowInterestRate, NumToBN } from "../../../blockchain/utils";
import { MinimumAmount } from "../../../blockchain/constants";
import { TabContext } from "../../../hooks/contextHooks/TabContext";
import useSpendBorrow from "../../../blockchain/hooks/SpendBorrow/useSpendBorrow";

const SpendLoanNav = () => {
  const [tokenName, setTokenName] = useState("BTC");
  const { title, setTitle, selectedLoan, setSelectedLoan } =
    useContext(TabContext);
  const {
    executeJediSwap,
    dataJediSwap,
    loadingJediSwap,
    errorJediSwap,
    handleSwap,
  } = useSpendBorrow(diamondAddress, selectedLoan, tokenName);

  const Coins: ICoin[] = [
    { name: "USDT", icon: "mdi-bitcoin" },
    { name: "USDC", icon: "mdi-ethereum" },
    { name: "BTC", icon: "mdi-bitcoin" },
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
  } = useAddDeposit(tokenName, diamondAddress);

  const { address: account } = useAccount();

  const [isCollateralActions, setIsCollateralActions] = useState(false);
  const [isSelfLiquidate, setIsSelfLiquidate] = useState(false);
  const [customActiveTab, setCustomActiveTab] = useState("1");
  const [modal_deposit, setmodal_deposit] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [dropDownArrow, setDropDownArrow] = useState(arrowDown);
  const [yagiDownArrow, setyagiDownArrow] = useState(arrowDown);
  const [dropDownTwo, setDropDownTwo] = useState(false);
  const [stakeDropDownArrow, setStakeDropDownArrow] = useState(arrowDown);
  const [idDropDown, setIdDropDown] = useState(false);
  const [idDropDownArrow, setIdDropDownArrow] = useState(arrowDown);

  const [borrowInterest, setBorrowInterest] = useState<string>("");
  const [currentBorrowInterest, setCurrentBorrowInterest] = useState<string>();

  const [selection, setSelection] = useState("Withdraw Partial Borrow");
  const [selectionTwo, setSelectionTwo] = useState("Add Collateral");

  const [value, setValue] = useState(0);
  const [commitPeriod, setCommitPeriod] = useState(0);
  // const [transDeposit, setTransDeposit] = useState("");
  const [SpendLoan, setSpendLoan] = useState("1");
  const dappsArray = ["1", "2", "3", "4", "5", "6"];
  const yagitimes = ["1", "2", "3", "4"];
  const [yagiselection, setyagiselection] = useState("1");
  const [Yagidrop, setYagidrop] = useState(false);

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
      calldata: [diamondAddress, NumToBN(depositAmount, 18), 0],
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
        calldata: [diamondAddress, NumToBN(depositAmount, 18), 0],
      },
      {
        contractAddress: diamondAddress,
        entrypoint: "deposit_request",
        calldata: [
          tokenAddressMap[tokenName],
          commitPeriod,
          NumToBN(depositAmount, 18),
          0,
        ],
      },
    ],
  });

  const requestDepositTransactionReceipt = useTransactionReceipt({
    hash: transDeposit,
    watch: true,
  });

  const tog_center = async () => {
    setmodal_deposit(!modal_deposit);
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

  const toggleyagi = () => {
    setYagidrop(!Yagidrop);
    setyagiDownArrow(Yagidrop ? arrowDown : arrowUp);
  };

  function isInvalid() {
    return (
      depositAmount < MinimumAmount[tokenName] ||
      depositAmount >
        Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) / 10 ** 18
    );
  }

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
              setSpendLoan("1");
            }}
          >
            <NavLink
              style={{
                cursor: "pointer",
                color: "black",
                border: "1px solid #000",
                borderRadius: "5px",
                boxShadow: "rgba(0, 0, 0, 0.5) 3.4px 3.4px 5.2px 0px",
              }}
              className={classnames({
                active: SpendLoan === "1",
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
              setSpendLoan("2");
            }}
          >
            <NavLink
              style={{
                cursor: "pointer",
                color: "black",
                border: "1px solid #000",
                borderRadius: "5px",
                boxShadow: "rgba(0, 0, 0, 0.5) 3.4px 3.4px 5.2px 0px",
              }}
              className={classnames({
                active: SpendLoan === "2",
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
              setSpendLoan("3");
            }}
          >
            <NavLink
              style={{
                cursor: "pointer",
                color: "black",
                border: "1px solid #000",
                borderRadius: "5px",
                boxShadow: "rgba(0, 0, 0, 0.5) 3.4px 3.4px 5.2px 0px",
              }}
              className={classnames({
                active: SpendLoan === "3",
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
          return (
            <div
              key={index}
              onClick={() => {
                setmodal_deposit(true);
              }}
            >
              <img
                src={`./dapps/${dapp}.svg`}
                height="90px"
                style={{ cursor: "pointer" }}
              />
            </div>
          );
        })}
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
          return (
            <div
              key={index}
              onClick={() => {
                setmodal_deposit(true);
              }}
            >
              <img src={`./dapps/${dapp}.svg`} height="90px" />
            </div>
          );
        })}
      </div>

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
            Supply Borrow
            <div
              style={{
                fontSize: "11px",
                color: "#8B8B8B",
                padding: "5px 0 10px 0",
                display: "flex",
                gap: "10px",
              }}
            >
              <div>Loan ID - {selectedLoan.loanId}</div>
              <Image
                style={{ cursor: "pointer" }}
                src={idDropDownArrow}
                alt="Picture of the author"
                width="14px"
                height="14px"
                onClick={() => {
                  setIdDropDown(!idDropDown);
                  setIdDropDownArrow(idDropDown ? arrowDown : arrowUp);
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
                        width="20px"
                        height="20px"
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
                            src={`./yagilogo.svg`}
                            width="60px"
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
                              toggleyagi();
                            }}
                            src={yagiDownArrow}
                            alt="Picture of the author"
                            width="20px"
                            height="20px"
                          />
                        </div>

                        {Yagidrop ? (
                          <>
                            <div
                              style={{
                                borderRadius: "5px",
                                position: "absolute",
                                zIndex: "100",
                                top: "156px",
                                left: "160px",

                                width: "300px",
                                margin: "0px auto",
                                marginBottom: "20px",
                                padding: "5px 10px",
                                backgroundColor: "#1D2131",
                                boxShadow: "0px 0px 10px #00000020",
                              }}
                            >
                              {yagitimes.map((select, index) => {
                                if (yagiselection === select) {
                                  return <></>;
                                }
                                return (
                                  <div
                                    style={{
                                      margin: "10px 0",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      fontSize: "16px",
                                    }}
                                    key={index}
                                    onClick={() => {
                                      setyagiselection(select);
                                      toggleyagi();
                                    }}
                                  >
                                    <img
                                      src={`./yagilogo.svg`}
                                      width="60px"
                                      height="30px"
                                    ></img>
                                  </div>
                                );
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
                                top: "156px",
                                left: "40px",

                                width: "100px",
                                margin: "0px auto",
                                marginBottom: "20px",
                                padding: "5px 10px",
                                backgroundColor: "#1D2131",
                                boxShadow: "0px 0px 10px #00000020",
                              }}
                            >
                              {labels.map((word, index) => {
                                if (title.label === word) {
                                  return <></>;
                                }
                                return (
                                  <div
                                    style={{
                                      margin: "10px 0",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      fontSize: "14px",
                                    }}
                                    key={index}
                                    onClick={() => {
                                      setTitle({ label: word });
                                      setDropDownTwo(!dropDownTwo);
                                      setStakeDropDownArrow(arrowDown);
                                    }}
                                  >
                                    {word}
                                  </div>
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
                                top: "105px",
                                left: "40px",
                                width: "115px",
                                margin: "0px auto",
                                marginBottom: "20px",
                                padding: "5px 10px",
                                backgroundColor: "#393D4F",
                                // boxShadow: "0px 0px 10px rgb(57, 61, 79)",
                              }}
                            >
                              {["1223222", "2378289"].map((asset, index) => {
                                return (
                                  <div
                                    key={index}
                                    style={{
                                      margin: "10px 0",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      fontSize: "0.6rem",
                                      color: "#6F6F6F",
                                    }}
                                    // onClick={() => {
                                    //   setAsset(asset);
                                    //   setTokenName(asset.market);
                                    //   setIdDropDown(!idDropDown);
                                    //   setIdDropDownArrow(Downarrow);
                                    // }}
                                  >
                                    {`Supply ID: ${asset}`}
                                  </div>
                                );
                              })}
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
                              color: "#8B8B8B",
                            }}
                          >
                            <div>Borrowed Market :</div>
                            <div>
                              <img
                                src={`./${tokenName}.svg`}
                                width="24px"
                                height="24px"
                              ></img>
                              &nbsp;&nbsp;
                              <span style={{ color: "white" }}>
                                {tokenName}
                              </span>
                            </div>
                          </div>
                          <div>
                            <img
                              src={`./${selectedLoan.loanMarket}.svg`}
                              width="24px"
                              height="24px"
                            ></img>
                            &nbsp;&nbsp;
                            <span style={{ color: "white" }}>
                              {selectedLoan.loanMarket}
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
                            00.00 &nbsp;&nbsp;{tokenName}
                          </div>
                        </div>
                        <div style={{ color: "white" }}>
                          {(selectedLoan.loanAmount / 10 ** 18).toFixed(4)}{" "}
                          &nbsp;&nbsp;{selectedLoan.loanMarket}
                        </div>
                      </label>

                      <div style={{ fontSize: "11px", color: "#8B8B8B" }}>
                        To
                      </div>

                      <label
                        style={{
                          width: "420px",
                          marginBottom: "25px",
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
                      {dropDown ? (
                        <>
                          <div
                            style={{
                              borderRadius: "5px",
                              position: "absolute",
                              zIndex: "100",
                              top: "306px",
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
                              return (
                                <div
                                  style={{
                                    margin: "10px 0",
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
                    </>
                  ) : (
                    <label
                      style={{
                        width: "420px",
                        // marginBottom: "25px",
                        // padding: "5px 10px",
                        fontSize: "16px",
                        // borderRadius: "5px",
                        // border: "2px solid rgb(57, 61, 79)",
                        fontWeight: "50",
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
                            <img
                              src={`./${tokenName}.svg`}
                              width="24px"
                              height="24px"
                            ></img>
                            &nbsp;&nbsp;
                            <span style={{ color: "white" }}>{tokenName}</span>
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
                            00.00 &nbsp;&nbsp;{tokenName}
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
                        1BCT = 21,000 USDT
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
                      commitPeriod === undefined ||
                      loadingApprove ||
                      loadingJediSwap ||
                      isInvalid()
                    }
                    onClick={handleSwap}
                  >
                    {title.label}
                    {/* {!(
                    loadingApprove ||
                    isTransactionLoading(requestDepositTransactionReceipt)
                  ) ? (
                    <>{selection}</>
                  ) : (
                    <MySpinner text="Depositing token" />
                  )} */}
                  </Button>
                </div>
              </Form>
            ) : (
              <h2 style={{ color: "white" }}>Please connect your wallet</h2>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SpendLoanNav;
