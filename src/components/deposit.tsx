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
  UncontrolledAlert,
  FormText,
  FormFeedback,
  Label,
  NavLink,
} from "reactstrap";
// import { estimateFee } from "starknet/account";

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
  tokenDecimalsMap,
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
import OffchainAPI from "../services/offchainapi.service";
import Downarrow from "../assets/images/ArrowDownDark.svg";
import UpArrow from "../assets/images/ArrowUpDark.svg";
import ToastModal from "./toastModals/customToastModal";

interface ICoin {
  name: string;
  icon: string;
}

let Deposit: any = ({
  asset: assetParam,
  depositLoanRates: depositLoanRatesParam,
}: {
  asset: string;
  depositLoanRates: any;
}) => {
  const Coins: ICoin[] = [
    { name: "USDT", icon: "mdi-bitcoin" },
    { name: "USDC", icon: "mdi-ethereum" },
    { name: "BTC", icon: "mdi-bitcoin" },
    { name: "ETH", icon: "mdi-ethereum" },
    { name: "DAI", icon: "mdi-dai" },
  ];

  const [asset, setAsset] = useState(assetParam);
  const [value, setValue] = useState(50);
  const [tokenName, setTokenName] = useState(asset);
  const [tokenIcon, setTokenIcon] = useState("mdi-bitcoin");

  const [token, setToken] = useState(getTokenFromName(asset));
  const [dropDown, setDropDown] = useState(false);
  const [dropDownArrow, setDropDownArrow] = useState(Downarrow);

  const [depositLoanRates, setDepositLoanRates] = useState(
    depositLoanRatesParam
  );

  const [commitmentValue, setCommitmentValue] = useState("Flexible");
  const [commitmentDropDown, setCommitmentDropDown] = useState(false);
  const [commitmentArrow, setCommitmentArrow] = useState(Downarrow);

  const [modal_deposit, setmodal_deposit] = useState(false);

  const [depositAmount, setDepositAmount] = useState<number>();
  const [commitPeriod, setCommitPeriod] = useState(0);

  const [isLoadingApprove, setLoadingApprove] = useState(false);
  const [isLoadingDeposit, setLoadingDeposit] = useState(false);

  const [allowanceVal, setAllowance] = useState(0);

  const { account, address: accountAddress, status } = useAccount();
  const [transApprove, setTransApprove] = useState("");
  const [transDeposit, setTransDeposit] = useState("");
  const [toastParam, setToastParam] = useState({});
  const [isToastOpen, setIsToastOpen] = useState(false);

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
    OffchainAPI.getProtocolDepositLoanRates().then((val) => {
      console.log("deposit rates in supply", val);
      setDepositLoanRates(val);
    });
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
    args: [accountAddress],
    options: {
      watch: true,
    },
  });

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
    args: [accountAddress, diamondAddress],
    options: {
      watch: true,
    },
  });

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
    setDepositAmount(e.target.value);
    const balance =
      Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
      10 ** (tokenDecimalsMap[asset] || 18);
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

  const handleBalanceChange = async () => {
    const allow = await refreshAllowance();
    const bal = await refreshBalance();
    console.log("updated on toggle", allow, bal, asset);
  };

  const handleMax = async () => {
    setDepositAmount(
      Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
        10 ** (tokenDecimalsMap[asset] || 18)
    );
    setValue(100);
  };

  const handleMin = async () => {
    setDepositAmount(MinimumAmount[asset]);
  };

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  const toggleDropdown = async () => {
    setDropDown(!dropDown);
    setDropDownArrow(dropDown ? Downarrow : UpArrow);
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
    try {
      let val = await executeDeposit();
      setTransDeposit(val.transaction_hash);
      const toastParamValue = {
        success: true,
        heading: "Success",
        desc: "Copy the Transaction Hash",
        textToCopy: val.transaction_hash,
      };
      setToastParam(toastParamValue);
      setIsToastOpen(true);
    } catch (err) {
      console.log(err, "err deposit");
      const toastParamValue = {
        success: false,
        heading: "Deposit Transaction Failed",
        desc: "Copy the error",
        textToCopy: err,
      };
      setToastParam(toastParamValue);
      setIsToastOpen(true);
      toast.error(`${GetErrorText(`Deposit for ${asset} failed`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
  };

  useEffect(() => {
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
    if (!depositAmount) return true;
    return (
      depositAmount < MinimumAmount[asset] ||
      depositAmount >
        Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
          10 ** (tokenDecimalsMap[asset] || 18)
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
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
          {accountAddress ? (
            <Form>
              <div className="row mb-4">
                <Col
                  sm={8}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <h5 style={{ color: "white", fontSize: "24px" }}>Supply</h5>
                  <img
                    src="./cross.svg"
                    onClick={() => {
                      setmodal_deposit(false);
                    }}
                    style={{ marginTop: "5px", cursor: "pointer" }}
                    height="15px"
                  />
                </Col>

                <label
                  style={{
                    width: "420px",
                    margin: "10px auto",
                    marginBottom: "20px",
                    padding: "5px 10px",
                    fontSize: "18px",
                    borderRadius: "5px",
                    border: "1px solid rgb(57, 61, 79)",
                    fontWeight: "200",
                  }}
                >
                  <div
                    onClick={toggleDropdown} // for the token of loanMarket
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
                        width="20px"
                        height="20px"
                      />
                    </div>
                  </div>
                </label>

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
                    margin: "0 auto",
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
                        commitmentDropDown ? arrowDown : arrowUp
                      );
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginLeft: "10px",
                      height: "35px",
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
                        top: "132px",
                        left: "39px",
                        width: "420px",
                        margin: "0px auto",
                        marginBottom: "20px",
                        padding: "10px 10px",
                        backgroundColor: "#1D2131",
                        boxShadow: "0px 0px 10px #00000020",
                      }}
                    >
                      {Coins.map((coin, index) => {
                        if (coin.name === tokenName) return <></>;
                        return (
                          <>
                            <div
                              key={index}
                              style={{
                                margin: "0px 0",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                fontSize: "16px",
                              }}
                              onClick={() => {
                                setTokenName(`${coin.name}`);
                                setDropDown(false);
                                setDropDownArrow(Downarrow);
                                setAsset(`${coin.name}`);
                                handleBalanceChange();
                                // handleDepositAmountChange(0);
                              }}
                            >
                              <Image
                                src={`/${coin.name}.svg`}
                                width="15px"
                                height="15px"
                                alt="coin image"
                              />
                              <div>&nbsp;&nbsp;&nbsp;{coin.name}</div>
                            </div>
                            <hr />
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
                        top: "210px",
                        left: "39px",
                        width: "420px",
                        margin: "0px auto",
                        marginBottom: "20px",
                        padding: "5px 10px",
                        backgroundColor: "rgb(42, 46, 63)",
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
                          setCommitmentArrow(Downarrow);
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
                          setCommitmentArrow(Downarrow);
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
                    <InputGroup>
                      <Input
                        style={{
                          backgroundColor: "#1D2131",
                          borderRight: "1px solid #1D2131",
                          height: "45px",
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
                      <Button
                        outline
                        type="button"
                        className="btn btn-md w-xs"
                        onClick={handleMax}
                        style={{
                          background: "#1D2131",
                          color: "rgb(111, 111, 111)",
                          border: "1px solid rgb(57, 61, 79)",
                          borderLeft: "none",
                        }}
                      >
                        <span style={{ borderBottom: "2px  #fff" }}>MAX</span>
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
                      {dataBalance ? (
                        (
                          Number(uint256.uint256ToBN(dataBalance[0])) /
                          10 ** (tokenDecimalsMap[asset] || 18)
                        ).toFixed(4)
                      ) : (
                        <MySpinner />
                      )}
                      <div style={{ color: "#8b8b8b" }}>&nbsp;{asset} </div>
                    </div>

                    <div style={{ marginLeft: "-10px", marginTop: "15px" }}>
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
                          setDepositAmount(
                            (value *
                              (Number(
                                uint256.uint256ToBN(
                                  dataBalance ? dataBalance[0] : "-"
                                )
                              ) /
                                10 ** (tokenDecimalsMap[asset] || 18))) /
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
                        top: "94px",
                      }}
                    >
                      {value}%
                    </div>
                    {depositAmount != 0 &&
                      depositAmount >
                        Number(
                          uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)
                        ) /
                          10 ** (tokenDecimalsMap[asset] || 18) && (
                        <FormText style={{ color: "#e97272 !important" }}>
                          {`Amount is greater than your balance`}
                        </FormText>
                      )}
                  </Col>
                </div>
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
                    <div style={{ color: "#6F6F6F" }}>Gas Estimate:</div>
                    <div
                      style={{
                        textAlign: "right",
                        fontWeight: "600",
                        color: "rgb(111, 111, 111)",
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
                    <div style={{ color: "#6F6F6F" }}>Supply APR:</div>
                    <div
                      style={{
                        textAlign: "right",
                        fontWeight: "600",
                        color: "rgb(111, 111, 111)",
                      }}
                    >
                      {depositLoanRates && commitPeriod < 3 ? (
                        `${parseFloat(
                          depositLoanRates[
                            `${
                              getTokenFromName(asset as string)?.address
                            }__${commitPeriod}`
                          ]?.depositAPR?.apr100x as string
                        )} %`
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
                      Asset Utilization Rate:
                    </div>
                    <div
                      style={{
                        textAlign: "right",
                        fontWeight: "600",
                        color: "rgb(111, 111, 111)",
                      }}
                    >
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
                    <div
                      style={{
                        textAlign: "right",
                        fontWeight: "600",
                        color: "rgb(111, 111, 111)",
                      }}
                    >
                      Starknet
                    </div>
                  </div>
                </div>
                <Button
                  color="white"
                  style={{
                    backgroundColor: "rgb(57, 61, 79)",
                    color: "white",
                    padding: "10px 0",
                    boxShadow: "rgba(0, 0, 0, 0.5) 3.4px 3.4px 5.2px 0px",
                  }}
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
    </div>
  );
};

export default Deposit = React.memo(Deposit);
