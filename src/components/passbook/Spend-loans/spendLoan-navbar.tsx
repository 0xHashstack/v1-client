import {
  useAccount,
  useContract,
  useStarknetCall,
  useStarknetExecute,
  useTransactionReceipt,
} from "@starknet-react/core";
import React, { useEffect, useState } from "react";
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
import MySpinner from "../../mySpinner";

import Image from "next/image";
import Slider from "react-custom-slider";
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

const SpendLoanNav = () => {
  const [tokenName, setTokenName] = useState("BTC");

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

  const [title, setTitle] = useState({
    label: "Stake",
  });

  const { address: account } = useAccount();

  const [isCollateralActions, setIsCollateralActions] = useState(false);
  const [isSelfLiquidate, setIsSelfLiquidate] = useState(false);
  const [customActiveTab, setCustomActiveTab] = useState("1");
  const [modal_deposit, setmodal_deposit] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [dropDownArrow, setDropDownArrow] = useState(arrowDown);

  const [borrowInterest, setBorrowInterest] = useState<string>("");
  const [currentBorrowInterest, setCurrentBorrowInterest] = useState<string>();

  const [selection, setSelection] = useState("Withdraw Partial Borrow");
  const [selectionTwo, setSelectionTwo] = useState("Add Collateral");

  const [value, setValue] = useState(0);
  const [commitPeriod, setCommitPeriod] = useState(0);
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
              setmodal_deposit(true);
              setTitle({
                label: "Stake",
              });
            }}
          >
            <NavLink
              style={{
                cursor: "pointer",
                color: "black",
                border: "1px solid #000",
                borderRadius: "5px",
              }}
            >
              <span className="d-none d-sm-block">Stake</span>
            </NavLink>
          </NavItem>

          <NavItem
            onClick={() => {
              setmodal_deposit(true);
              setTitle({
                label: "Swap",
              });
            }}
          >
            <NavLink
              style={{
                cursor: "pointer",
                color: "black",
                border: "1px solid #000",
                borderRadius: "5px",
              }}
            >
              <span className="d-none d-sm-block">Swap</span>
            </NavLink>
          </NavItem>

          <NavItem
            onClick={() => {
              setmodal_deposit(true);
              setTitle({
                label: "Trade",
              });
            }}
          >
            <NavLink
              style={{
                cursor: "pointer",
                color: "black",
                border: "1px solid #000",
                borderRadius: "5px",
              }}
            >
              <span className="d-none d-sm-block">Trade</span>
            </NavLink>
          </NavItem>
        </Nav>
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
                      // onClick={togglesDropdown}
                      style={{ cursor: "pointer" }}
                      src={dropDownArrow}
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

                {title.label === "Swap" || title.label === "Trade" ? (
                  <>
                    <div>From</div>

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
                        ></div>
                      </div>
                    </label>

                    <div>To</div>

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
                        ></div>
                      </div>
                    </label>
                  </>
                ) : (
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
                      ></div>
                    </div>
                  </label>
                )}

                {/* {dropDown ? (
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
                        backgroundColor: "#F8F8F8",
                        boxShadow: "0px 0px 10px #00000020",
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
                        // onClick={() => {
                        //   setTokenName(`${coin.name}`);
                        //   setDropDown(false);
                        //   setDropDownArrow(arrowDown);
                        //   handleBalanceChange();
                        // }}
                      >
                        {!isCollateralActions ? (
                          selection === "Withdraw Partial Borrow" ? (
                            <div
                              onClick={() => {
                                selectionAction("Self Liquidate");
                              }}
                            >
                              &nbsp;Self Liquidate
                            </div>
                          ) : (
                            <div
                              onClick={() => {
                                selectionAction("Withdraw Partial Borrow");
                              }}
                            >
                              &nbsp;Withdraw Partial Borrow
                            </div>
                          )
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
                )} */}
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
                    <div style={{ textAlign: "right", fontWeight: "600",color: "#6F6F6F" }}>
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
                    <div style={{ textAlign: "right", fontWeight: "600",color: "#6F6F6F" }}>
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
                    <div style={{ textAlign: "right", fontWeight: "600",color: "#6F6F6F" }}>
                      Starknet
                    </div>
                  </div>
                </div>
                <Button
                  color="white"
                  className="w-md"
                  style={{backgroundColor:"rgb(57, 61, 79)"}}
                  disabled={
                    commitPeriod === undefined ||
                    loadingApprove ||
                    loadingDeposit ||
                    isInvalid()
                  }
                  //   onClick={(e) => {
                  //     handleDeposit(tokenName);
                  //   }}
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
            <h2 style={{ color: "black" }}>Please connect your wallet</h2>
          )}
        </div>
      </Modal>
    </>
  );
};

export default SpendLoanNav;
