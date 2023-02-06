import { useState, useContext, useEffect, useCallback } from "react";
import {
  Col,
  Button,
  Form,
  Input,
  Modal,
  Spinner,
  InputGroup,
  FormGroup,
  FormText,
  FormFeedback,
  Label,
  NavLink,
} from "reactstrap";

import Slider from "react-custom-slider";

import RangeSlider from "react-bootstrap-range-slider";
import arrowDown from "../assets/images/arrowDown.svg";
import arrowUp from "../assets/images/arrowUp.svg";
import { MinimumAmount } from "../blockchain/constants";
import BigNumber, { ethers } from "ethers";

import {
  diamondAddress,
  ERC20Abi,
  getTokenFromAddress,
  getTokenFromName,
  isTransactionLoading,
  tokenAddressMap,
} from "../blockchain/stark-constants";

import { BNtoNum, GetErrorText, NumToBN } from "../blockchain/utils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

import {
  useAccount,
  useContract,
  useStarknet,
  useStarknetCall,
  useStarknetExecute,
  useStarknetInvoke,
  useTransactionReceipt,
  useTransactions,
} from "@starknet-react/core";
import dropDownArrow from "../public/drop-down-arrow.svg";
import { Abi, Contract, uint256, number } from "starknet";
import { TxToastManager } from "../blockchain/txToastManager";
import MySpinner from "./mySpinner";
import Image from "next/image";
import classnames from "classnames";

interface ICoin {
  name: string;
  icon: string;
}

let Deposit: any = ({ asset }: { asset: string }) => {
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

  const [value, setValue] = useState(50);
  const [tokenName, setTokenName] = useState(asset);
  const [tokenIcon, setTokenIcon] = useState("mdi-bitcoin");

  const [token, setToken] = useState(getTokenFromName(asset));
  const [dropDown, setDropDown] = useState(false);
  const [dropDownArrow, setDropDownArrow] = useState(arrowDown);

  const [commitmentValue, setCommitmentValue] = useState("Flexible");
  const [commitmentDropDown, setCommitmentDropDown] = useState(false);
  const [commitmentArrow, setCommitmentArrow] = useState(arrowDown);

  const [modal_deposit, setmodal_deposit] = useState(false);

  const [depositAmount, setDepositAmount] = useState<number>();
  const [commitPeriod, setCommitPeriod] = useState(0);

  const [isLoadingApprove, setLoadingApprove] = useState(false);
  const [isLoadingDeposit, setLoadingDeposit] = useState(false);

  const [allowanceVal, setAllowance] = useState(0);

  const { address: account } = useAccount();
  const [transApprove, setTransApprove] = useState("");
  const [transDeposit, setTransDeposit] = useState("");

  const approveTransactionReceipt = useTransactionReceipt({
    hash: transApprove,
    watch: true,
  });
  const requestDepositTransactionReceipt = useTransactionReceipt({
    hash: transDeposit,
    watch: true,
  });

  useEffect(() => {
    setToken(getTokenFromName(asset));
  }, [asset]);

  useEffect(() => {
    // console.log('approve tx receipt', approveTransactionReceipt.data?.transaction_hash, approveTransactionReceipt);
    TxToastManager.handleTxToast(
      approveTransactionReceipt,
      `Deposit: Approve ${token?.name}`,
      true
    );
  }, [approveTransactionReceipt]);

  useEffect(() => {
    // console.log('deposit tx receipt', requestDepositTransactionReceipt.data?.transaction_hash, requestDepositTransactionReceipt);
    TxToastManager.handleTxToast(
      requestDepositTransactionReceipt,
      `Deposit ${token?.name}`
    );
  }, [requestDepositTransactionReceipt]);

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
    args: [account],
    options: {
      watch: true,
    },
  });

  // useEffect(() => {
  //   // console.log('balance', {
  //   //   dataBalance, loadingBalance, errorBalance, refreshBalance, contract, account
  //   // })
  // }, [dataBalance, loadingBalance, errorBalance, refreshBalance]);

  // Approve

  const [customActiveTab, setCustomActiveTab] = useState("9");

  const {
    data: dataUSDC,
    loading: loadingUSDC,
    error: errorUSDC,
    reset: resetUSDC,
    execute: USDC,
  } = useStarknetExecute({
    calls: {
      contractAddress: tokenAddressMap[asset] as string,
      entrypoint: "approve",
      calldata: [diamondAddress, NumToBN(depositAmount, 18), 0],
    },
  });

  // Deposit Hook
  const {
    data: dataDeposit,
    loading: loadingDeposit,
    error: errorDeposit,
    reset: resetDeposit,
    execute: executeDeposit,
  } = useStarknetExecute({
    calls: [
      {
        contractAddress: tokenAddressMap[asset] as string,
        entrypoint: "approve",
        calldata: [diamondAddress, NumToBN(depositAmount, 18), 0],
      },
      {
        contractAddress: diamondAddress,
        entrypoint: "deposit_request",
        calldata: [
          tokenAddressMap[asset],
          commitPeriod,
          NumToBN(depositAmount, 18),
          0,
        ],
      },
    ],
  });

  const returnTransactionParameters = () => {
    let data, loading, reset, error;
    [data, loading, reset, error] = [
      dataUSDC,
      loadingUSDC,
      resetUSDC,
      errorUSDC,
    ];
    return { data, loading, reset, error };
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

  // const handleApprove = async () => {
  //   let val = await USDC();
  // };

  const {
    data: dataApprove,
    loading: loadingApprove,
    reset: resetApprove,
    error: errorApprove,
  } = returnTransactionParameters();

  const tog_center = async () => {
    setmodal_deposit(!modal_deposit);
    removeBodyCss();
  };

  const handleCommitChange = (e: any) => {
    setCommitPeriod(e);
  };

  const handleDepositAmountChange = (e: any) => {
    if (e.target.value) setDepositAmount(Number(e.target.value));
    else setDepositAmount(0);
  };

  const handleBalanceChange = async () => {
    await refreshAllowance();
    await refreshBalance();
  };

  const handleMax = async () => {
    // if (dataBalance) {
    setDepositAmount(
      Number(uint256.uint256ToBN(dataBalance[0] || 0)) / 10 ** 18
    );
    // }
  };

  const handleMin = async () => {
    setDepositAmount(MinimumAmount[asset]);
  };

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  const handleApprove = async (asset: string) => {
    try {
      const val = await USDC();
      // console.log('valll', val.transaction_hash);
    } catch (err) {
      console.log(err, "err approve token deposit");
    }
  };

  const toggleDropdown = () => {
    setDropDown(!dropDown);
    setDropDownArrow(dropDown ? arrowDown : arrowUp);
    // disconnectEvent(), connect(connector);
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
    // console.log(diamondAddress, depositAmount);
    // await handleApprove();
    // run deposit function

    // console.log('allowance', BNtoNum(dataAllowance[0]?.low, 18).toString());
    // console.log('amountin -: ', depositAmount);

    // setAllowance(Number(BNtoNum(dataAllowance[0]?.low, 18)));
    try {
      let val = await executeDeposit();
      setTransDeposit(val.transaction_hash);
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

  useEffect(() => {
    // console.log('check deposit allownace', token?.name, {
    // 	dataAllowance,
    // 	remaining: (dataAllowance ? uint256.uint256ToBN(dataAllowance[0]).toString() : '0'),
    // 	errorAllowance,
    // 	refreshAllowance,
    // 	loadingAllowance,
    // });
    if (!loadingAllowance) {
      if (dataAllowance) {
        let data: any = dataAllowance;
        let _allowanceBN = uint256.uint256ToBN(data.remaining);
        const _allowance = ethers.utils.formatEther(_allowanceBN.toString());
        // console.log('deposit allowance', token?.name, _allowance, depositAmount)
        setAllowance(Number(_allowance));
      } else if (errorAllowance) {
        // handleToast(true, "Check allowance", errorAllowance)
      }
    }
  }, [dataAllowance, errorAllowance, refreshAllowance, loadingAllowance]);

  function isInvalid() {
    return (
      depositAmount < MinimumAmount[asset] ||
      depositAmount >
        Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) / 10 ** 18
    );
  }

  return (
    <>
      <NavLink
        type="button"
        // className="btn btn-dark btn-sm w-xs"
        onClick={tog_center}
        style={{
          backgroundColor: "#393D4F",
          color: "white",
          padding: "10px 18px",
          borderRadius: "5px",
          border: "none",
          fontSize: "11px",
          width: "75px",
        }}
        className={classnames({
          active: customActiveTab === "2",
        })}
      >
        Supply
      </NavLink>
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
            backgroundColor: "white",
            color: "black",
            padding: "40px",
          }}
        >
          {account ? (
            <Form>
              <div className="row mb-4">
                <Col sm={8}>
                  <h5 style={{ color: "black" }}>Supply</h5>
                </Col>

                <label
                  style={{
                    width: "420px",
                    margin: "10px auto",
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
                    fontSize: "10px",
                    fontWeight: "600",
                    marginBottom: "5px",
                  }}
                >
                  Minimum Commitment Period
                </div>

                <label
                  style={{
                    width: "420px",
                    margin: "0 auto",
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

                {dropDown ? (
                  <>
                    <div
                      style={{
                        borderRadius: "5px",
                        position: "absolute",
                        zIndex: "100",
                        top: "125px",
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

                {commitmentDropDown ? (
                  <>
                    <div
                      style={{
                        borderRadius: "5px",
                        position: "absolute",
                        zIndex: "100",
                        top: "210px",
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
              </div>
              <FormGroup>
                <div className="row mb-4">
                  <Col sm={12}>
                    {/* <Label for="amount">Amount</Label> */}
                    <InputGroup>
                      <Input
                        style={{
                          backgroundColor: "white",
                          borderRight: "1px solid #FFF",
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
                    {/* {depositAmount != 0 &&
                      depositAmount < MinimumAmount[asset] && (
                        <FormText style={{ color: "#e97272 !important" }}>
                          {`Please enter amount more than minimum amount = ${MinimumAmount[asset]} ${asset}`}
                        </FormText>
                      )} */}
                    <div
                      style={{
                        display: "flex",
                        fontSize: "10px",
                        justifyContent: "end",
                        marginTop: "4px",
                      }}
                    >
                      Available:&nbsp;
                      {dataBalance ? (
                        (
                          Number(uint256.uint256ToBN(dataBalance[0])) /
                          10 ** 18
                        ).toString()
                      ) : (
                        <MySpinner />
                      )}
                      <div style={{ color: "#76809D" }}>&nbsp;{asset} </div>
                    </div>

                    <div style={{ marginLeft: "-10px", marginTop: "15px" }}>
                      <Slider
                        handlerActiveColor="black"
                        stepSize={10}
                        value={value}
                        trackColor="#ADB5BD"
                        handlerShape="rounded"
                        handlerColor="black"
                        fillColor="black"
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
                    {depositAmount != 0 &&
                      depositAmount >
                        Number(
                          uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)
                        ) /
                          10 ** 18 && (
                        <FormText style={{ color: "#e97272 !important" }}>
                          {`Amount is greater than your balance`}
                        </FormText>
                      )}
                  </Col>
                </div>
              </FormGroup>

              {/* <FormGroup floating>
                <div className="row mb-4">
                  <Col sm={12}>
                    <Label for="commitment">Commitment</Label>
                    <select
                      id="commitment"
                      className="form-select"
                      placeholder="Commitment"
                      onChange={handleCommitChange}
                    >
                      <option value={0}>Flexible</option>
                      <option value={1}>Two Weeks</option>
                      <option value={2}>One Month</option>
                      <option value={3}>Three Months</option>
                    </select>
                  </Col>
                </div>
              </FormGroup> */}
              <div className="d-grid gap-2">
                {/* {allowanceVal < (depositAmount as number) ? (
                  <Button
                    color="primary"
                    className="w-md"
                    disabled={
                      commitPeriod === undefined ||
                      loadingApprove ||
                      loadingDeposit ||
                      depositAmount < MinimumAmount[asset]
                    }
                    onClick={(e) => handleApprove(asset)}
                  >
                    {!(
                      loadingApprove ||
                      isTransactionLoading(approveTransactionReceipt)
                    ) ? (
                      "Approve"
                    ) : (
                      <div>
                        <MySpinner text="Approving token" />
                      </div>
                    )}
                  </Button>
                ) : ( */}

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
                    <div style={{ textAlign: "right", fontWeight: "600" }}>
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
                    <div style={{ color: "#6F6F6F" }}>Supply APR:</div>
                    <div style={{ textAlign: "right", fontWeight: "600" }}>
                      7.75 %
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
                      Asset Utilization Rate:
                    </div>
                    <div style={{ textAlign: "right", fontWeight: "600" }}>
                      0.43
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
                    <div style={{ textAlign: "right", fontWeight: "600" }}>
                      Starknet
                    </div>
                  </div>
                </div>
                <Button
                  color="primary"
                  className="w-md"
                  disabled={
                    commitPeriod === undefined ||
                    loadingApprove ||
                    loadingDeposit ||
                    isInvalid()
                  }
                  onClick={(e) => {
                    handleDeposit(asset);
                  }}
                >
                  {!(
                    loadingApprove ||
                    isTransactionLoading(requestDepositTransactionReceipt)
                  ) ? (
                    "Supply"
                  ) : (
                    <MySpinner text="Depositing token" />
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

export default Deposit = React.memo(Deposit);
