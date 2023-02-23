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
  Row,
  Table,
  UncontrolledAccordion,
} from "reactstrap";

import Slider from "react-custom-slider";
import arrowDown from "../../../assets/images/ArrowDownDark.svg";
import arrowUp from "../../../assets/images/ArrowUpDark.svg";

import {
  diamondAddress,
  ERC20Abi,
  tokenAddressMap,
  isTransactionLoading,
  tokenDecimalsMap,
  getTokenFromName,
} from "../../../blockchain/stark-constants";
import TxHistoryTable from "../../dashboard/tx-history-table";
import useAddDeposit from "../../../blockchain/hooks/active-deposits/useAddDeposit";
import useWithdrawDeposit from "../../../blockchain/hooks/active-deposits/useWithdrawDeposit";
import ActiveDeposit from "./active-deposts/active-deposit";
import OffchainAPI from "../../../services/offchainapi.service";
import Image from "next/image";
import {
  useAccount,
  useContract,
  useStarknetCall,
  useStarknetExecute,
  useTransactionReceipt,
} from "@starknet-react/core";
import { Abi, uint256 } from "starknet";
import { ICoin } from "../../dashboard/dashboard-body";
import { MinimumAmount } from "../../../blockchain/constants";
import MySpinner from "../../mySpinner";
import { GetErrorText, NumToBN } from "../../../blockchain/utils";
import { toast } from "react-toastify";
import classnames from "classnames";

const ActiveDepositsTab = ({
  activeDepositsData,
  modal_add_active_deposit,
  tog_add_active_deposit,
  modal_withdraw_active_deposit,
  tog_withdraw_active_deposit,
  depositRequestSel,
  setInputVal1,
  handleDepositTransactionDone,
  withdrawDepositTransactionDone,
  isTransactionDone,
  inputVal1,
}: {
  activeDepositsData: any;
  modal_add_active_deposit: any;
  tog_add_active_deposit: any;
  modal_withdraw_active_deposit: any;
  tog_withdraw_active_deposit: any;
  depositRequestSel: any;
  setInputVal1: any;
  handleDepositTransactionDone: any;
  withdrawDepositTransactionDone: any;
  isTransactionDone: any;
  inputVal1: any;
}) => {
  const Coins: ICoin[] = [
    { name: "USDT", icon: "mdi-bitcoin" },
    { name: "USDC", icon: "mdi-ethereum" },
    { name: "BTC", icon: "mdi-bitcoin" },
    { name: "ETH", icon: "mdi-ethereum" },
    { name: "DAI", icon: "mdi-dai" },
  ];
  const [asset, setAsset] = useState<any>();
  const [historicalAPRs, setHistoricalAPRs] = useState();
  const [tokenName, setTokenName] = useState("BTC");
  const [customActiveTab, setCustomActiveTab] = useState("1");
  const [modal_deposit, setmodal_deposit] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [dropDownArrow, setDropDownArrow] = useState(arrowDown);
  const [depositAmount, setDepositAmount] = useState<number>();
  const [value, setValue] = useState(0);
  const { address: account } = useAccount();
  const [commitPeriod, setCommitPeriod] = useState(0);
  const [transDeposit, setTransDeposit] = useState("");
  const [commitmentDropDown, setCommitmentDropDown] = useState(false);
  const [commitmentArrow, setCommitmentArrow] = useState(arrowDown);
  const [commitmentValue, setCommitmentValue] = useState("Flexible");
  const [depositLoanRates, setDepositLoanRates] = useState<any>();

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
      calldata: [
        diamondAddress,
        NumToBN(depositAmount as number, tokenDecimalsMap[tokenName]),
        0,
      ],
    },
  });

  const {
    data: dataDeposit,
    loading: loadingDeposit,
    error: errorDeposit,
    reset: resetDeposit,
    execute: executeDeposit,
  } = useStarknetExecute({
    calls: [
      {
        contractAddress: tokenAddressMap[tokenName] as string,
        entrypoint: "approve",
        calldata: [
          diamondAddress,
          NumToBN(depositAmount as number, tokenDecimalsMap[tokenName]),
          0,
        ],
      },
      {
        contractAddress: diamondAddress,
        entrypoint: "deposit_request",
        calldata: [
          tokenAddressMap[tokenName],
          commitPeriod,
          NumToBN(depositAmount as number, tokenDecimalsMap[tokenName]),
          0,
        ],
      },
    ],
  });

  const requestDepositTransactionReceipt = useTransactionReceipt({
    hash: transDeposit,
    watch: true,
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

  useEffect(() => {
    OffchainAPI.getProtocolDepositLoanRates().then((val) => {
      console.log("got them", val);
      setDepositLoanRates(val);
    });
  }, []);

  const tog_center = async () => {
    setmodal_deposit(!modal_deposit);
    // removeBodyCss();
  };

  const handleCommitChange = (e: any) => {
    setCommitPeriod(e);
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
    setDepositAmount(e.target.value);
    const balance =
      Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
      10 ** (tokenDecimalsMap[tokenName] || 18);
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

  function isInvalid() {
    return (
      depositAmount < MinimumAmount[tokenName] ||
      depositAmount >
        Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
          10 ** (tokenDecimalsMap[tokenName] || 18)
    );
  }

  const handleMax = async () => {
    setDepositAmount(
      Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
        10 ** (tokenDecimalsMap[asset] || 18)
    );
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

  const {
    data: dataApprove,
    loading: loadingApprove,
    reset: resetApprove,
    error: errorApprove,
  } = returnTransactionParameters();

  useEffect(() => {
    OffchainAPI.getHistoricalDepositRates().then((val) => {
      setHistoricalAPRs(val);
    });
  }, []);
  return (
    // Active Deposits
    <div style={{ borderTop: "5px" }}>
      <UncontrolledAccordion
        defaultOpen="0"
        open="false"
        style={{
          margin: "10px",
          color: "black",
          textAlign: "left",
          marginLeft: "30px",
        }}
      >
        {Array.isArray(activeDepositsData) && activeDepositsData.length > 0 ? (
          <>
            <Table>
              <Row
                style={{
                  width: "100%",
                  borderStyle: "hidden",
                  fontWeight: "300",
                  alignItems: "center",
                  textAlign: "center",
                  color: "#8C8C8C",
                  verticalAlign: "middle",
                  fontSize: "14px",
                }}
              >
                <Col
                  style={{
                    marginLeft: "-15px",
                    width: "10px",
                    padding: "20px 10px",
                  }}
                >
                  Supply ID
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
                  Supply Amount
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
                  MCP
                </Col>
                <Col
                  scope="col"
                  style={{ width: "100px", padding: "20px 10px" }}
                >
                  Status
                </Col>

                <Col
                  scope="col"
                  style={{ width: "100px", padding: "20px 20px" }}
                >
                  Actions
                </Col>
              </Row>
            </Table>

            {activeDepositsData.map((asset, key, allAssets) => {
              return (
                <ActiveDeposit
                  key={key}
                  asset={asset}
                  historicalAPRs={historicalAPRs}
                  allAssets={allAssets}
                />
              );
            })}
          </>
        ) : (
          <>
            <div
              style={{
                textAlign: "center",
                margin: "200px auto",
                color: "white",
              }}
            >
              <div>Your Ethereum wallet is empty. </div>
              <div
                style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => {
                  setmodal_deposit(true);
                }}
              >
                <u>Purchase or Supply assets.</u>
              </div>
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
                {account ? (
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
                        <h5 style={{ color: "white", fontSize: "24px" }}>
                          Supply
                        </h5>
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
                                  commitmentDropDown ? arrowDown : arrowUp
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
                              padding: "5px 10px",
                              backgroundColor: "#1D2131",
                              boxShadow: "0px 0px 10px #00000020",
                            }}
                          >
                            {Coins.map((coin, index) => {
                              if (coin.name === tokenName) return <></>;
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
                                    setTokenName(`${coin.name}`);
                                    setDropDown(false);
                                    setDropDownArrow(arrowDown);
                                    setAsset(`${coin.name}`);
                                    handleBalanceChange();
                                    // handleDepositAmountChange(0);
                                  }}
                                >
                                  <Image
                                    src={`/${coin.name}.svg`}
                                    width="24px"
                                    height="24px"
                                    alt="coin image"
                                  />
                                  <div>&nbsp;&nbsp;&nbsp;{coin.name}</div>
                                </div>
                              );
                            })}
                          </div>
                          <hr />
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
                              top: "212px",
                              left: "39px",
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
                            {dataBalance ? (
                              (
                                Number(uint256.uint256ToBN(dataBalance[0])) /
                                10 ** (tokenDecimalsMap[asset] || 18)
                              ).toString()
                            ) : (
                              <MySpinner />
                            )}
                            <div style={{ color: "#8b8b8b" }}>
                              &nbsp;{asset}{" "}
                            </div>
                          </div>

                          <div
                            style={{ marginLeft: "-10px", marginTop: "15px" }}
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
                                uint256.uint256ToBN(
                                  dataBalance ? dataBalance[0] : 0
                                )
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
                          marginTop: "-25px",
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
                          <div style={{ color: "#6F6F6F" }}>
                            Supply Network:
                          </div>
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
                  <h2 style={{ color: "black" }}>Please connect your wallet</h2>
                )}
              </div>
            </Modal>
          </>
        )}
      </UncontrolledAccordion>
    </div>
  );
};

export default ActiveDepositsTab;
