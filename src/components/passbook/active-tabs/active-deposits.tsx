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
import arrowDown from "../../../assets/images/arrowDown.svg";
import arrowUp from "../../../assets/images/arrowUp.svg";

import {
  diamondAddress,
  ERC20Abi,
  tokenAddressMap,
  isTransactionLoading,
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
    loading: loadingDeposit,
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
        }}
      >
        {Array.isArray(activeDepositsData) && activeDepositsData.length > 0 ? (
          <>
            <Table>
              <Row
                style={{
                  borderStyle: "hidden",
                  color: "white",
                  fontWeight: "600",
                  margin: "1px 1px 1px 10px",
                  alignItems: "center",
                  gap: "50px",
                  fontSize: "11px",
                }}
              >
                <Col
                  style={{
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

            {activeDepositsData.map((asset, key) => {
              return (
                <ActiveDeposit
                  key={key}
                  asset={asset}
                  modal_add_active_deposit={modal_add_active_deposit}
                  tog_add_active_deposit={tog_add_active_deposit}
                  modal_withdraw_active_deposit={modal_withdraw_active_deposit}
                  tog_withdraw_active_deposit={tog_withdraw_active_deposit}
                  depositRequestSel={depositRequestSel}
                  withdrawDepositTransactionDone={
                    withdrawDepositTransactionDone
                  }
                  historicalAPRs={historicalAPRs}
                />
              );
            })}
          </>
        ) : (
          <>
            <div style={{ textAlign: "center", margin: "200px auto" }}>
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
                  backgroundColor: "white",
                  color: "black",
                  padding: "40px",
                }}
              >
                {!account ? (
                  <Form>
                    <div>
                      <Col sm={8}>
                        <Nav
                          tabs
                          className="nav-tabs-custom"
                          style={{ borderBottom: "0px", gap: "10px" }}
                        >
                          <NavItem>
                            <NavLink
                              style={{
                                cursor: "pointer",
                                color: "black",
                                border: "1px solid #000",
                                borderRadius: "5px",
                              }}
                              className={classnames({
                                active: customActiveTab === "1",
                              })}
                              onClick={() => {
                                setCustomActiveTab("1");
                              }}
                            >
                              <span className="d-none d-sm-block">
                                Add Supply
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
                              onClick={() => {
                                setCustomActiveTab("2");
                              }}
                            >
                              <span className="d-none d-sm-block">
                                Withdraw Supply
                              </span>
                            </NavLink>
                          </NavItem>
                        </Nav>
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

                      {dropDown ? (
                        <>
                          <div
                            style={{
                              borderRadius: "5px",
                              position: "absolute",
                              zIndex: "100",
                              top: "125px",
                              left: "39px",

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
                    </div>
                    <FormGroup>
                      <div className="row mb-4">
                        <Col sm={12}>
                          {/* <Label for="amount">Amount</Label> */}
                          <InputGroup>
                            <Input
                              style={{
                                backgroundColor: "white",
                                padding: "10px ",
                                borderRight: "1px solid #FFF",
                              }}
                              type="number"
                              className="form-control"
                              id="amount"
                              min={MinimumAmount[tokenName]}
                              placeholder={`Minimum ${MinimumAmount[tokenName]} ${tokenName}`}
                              onChange={handleDepositAmountChange}
                              value={depositAmount}
                              valid={!isInvalid()}
                            />

                            {
                              <>
                                <Button
                                  outline
                                  type="button"
                                  className="btn btn-md w-xs"
                                  // onClick={handleMax}
                                  // disabled={balance ? false : true}
                                  style={{
                                    background: "white",
                                    color: "black",
                                    border: "1px solid black",
                                    borderLeft: "none",
                                  }}
                                >
                                  <span
                                    style={{ borderBottom: "2px dotted #fff" }}
                                  >
                                    MAX
                                  </span>
                                </Button>
                              </>
                            }
                          </InputGroup>

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
                            <div style={{ color: "#76809D" }}>
                              &nbsp;{tokenName}{" "}
                            </div>
                          </div>

                          <div
                            style={{ marginLeft: "-10px", marginTop: "15px" }}
                          >
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
                                    (Number(
                                      uint256.uint256ToBN(dataBalance[0])
                                    ) /
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
                                uint256.uint256ToBN(
                                  dataBalance ? dataBalance[0] : 0
                                )
                              ) /
                                10 ** 18 && (
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
                            style={{ textAlign: "right", fontWeight: "600" }}
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
                            style={{ textAlign: "right", fontWeight: "600" }}
                          >
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
                          <div
                            style={{ textAlign: "right", fontWeight: "600" }}
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
                            style={{ textAlign: "right", fontWeight: "600" }}
                          >
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
                          handleDeposit(tokenName);
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
