import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Form,
  Input,
  Table,
  Spinner,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  UncontrolledAccordion,
  CardTitle,
  CardSubtitle,
  Modal,
  Nav,
  NavItem,
  NavLink,
  FormGroup,
  InputGroup,
  FormText,
} from "reactstrap";
import RangeSlider from "react-bootstrap-range-slider";
import {
  CoinClassNames,
  EventMap,
  MinimumAmount,
} from "../../../../blockchain/constants";
import useAddDeposit from "../../../../blockchain/hooks/active-deposits/useAddDeposit";
import useWithdrawDeposit from "../../../../blockchain/hooks/active-deposits/useWithdrawDeposit";
import {
  diamondAddress,
  isTransactionLoading,
  tokenAddressMap,
  ERC20Abi,
  getTokenFromName,
} from "../../../../blockchain/stark-constants";
import {
  BNtoNum,
  currentDepositInterestRate,
  depositInterestAccrued,
} from "../../../../blockchain/utils";
import TxHistoryTable from "../../../dashboard/tx-history-table";
import { useTransactionReceipt } from "@starknet-react/core";
import MySpinner from "../../../mySpinner";
import { TxToastManager } from "../../../../blockchain/txToastManager";
import Deposit from "../../../deposit";
import { toast } from "react-toastify";

import Slider from "react-custom-slider";
import arrowDown from "../../../../assets/images/ArrowDownDark.svg";
import arrowUp from "../../../../assets/images/ArrowUpDark.svg";
import Downarrow from "../../../../assets/images/ArrowDownDark.svg";
import UpArrow from "../../../../assets/images/ArrowUpDark.svg";
import OffchainAPI from "../../../../services/offchainapi.service";
import Image from "next/image";
import {
  useAccount,
  useContract,
  useStarknetCall,
  useStarknetExecute,
} from "@starknet-react/core";
import { Abi, uint256 } from "starknet";
import { ICoin } from "../../../dashboard/dashboard-body";
import { GetErrorText, NumToBN } from "../../../../blockchain/utils";
import classnames from "classnames";
import { IDepositLoanRates } from "../../../borrow";

const ActiveDeposit = ({
  asset,
  modal_add_active_deposit,
  tog_add_active_deposit,
  modal_withdraw_active_deposit,
  tog_withdraw_active_deposit,
  depositRequestSel,
  withdrawDepositTransactionDone,
  historicalAPRs,
}: {
  asset: any;
  modal_add_active_deposit: any;
  tog_add_active_deposit: any;
  modal_withdraw_active_deposit: any;
  tog_withdraw_active_deposit: any;
  depositRequestSel: any;
  withdrawDepositTransactionDone: any;
  historicalAPRs: any;
}) => {
  console.log("your supply action asset", asset);
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
  } = useAddDeposit(asset, diamondAddress);

  const [action, setAction] = useState(false);

  const { withdrawDeposit, withdrawAmount, setWithdrawAmount, transWithdraw } =
    useWithdrawDeposit(asset, diamondAddress, asset.depositId);

  const approveTransactionReceipt = useTransactionReceipt({
    hash: transApprove,
    watch: true,
  });
  const addDepositTransactionReceipt = useTransactionReceipt({
    hash: transDeposit,
    watch: true,
  });
  const withdrawTransactionReceipt = useTransactionReceipt({
    hash: transWithdraw,
    watch: true,
  });

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

  const [tokenName, setTokenName] = useState<string>(asset.market);
  const [depositLoanRates, setDepositLoanRates] = useState<IDepositLoanRates>();
  const [customActiveTab, setCustomActiveTab] = useState("1");
  const [modal_deposit, setmodal_deposit] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [dropDownArrow, setDropDownArrow] = useState(Downarrow);
  const [idDropDown, setIdDropDown] = useState(false);
  const [idDropDownArrow, setIdDropDownArrow] = useState(Downarrow);
  // const [depositAmount, setDepositAmount] = useState<number>();
  const [value, setValue] = useState(0);
  const { address: account } = useAccount();
  const [commitPeriod, setCommitPeriod] = useState(asset.commitmentIndex);
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
      calldata: [diamondAddress, NumToBN(depositAmount as number, 18), 0],
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
        calldata: [diamondAddress, NumToBN(depositAmount as number, 18), 0],
      },
      {
        contractAddress: diamondAddress,
        entrypoint: "deposit_request",
        calldata: [
          tokenAddressMap[tokenName],
          commitPeriod,
          NumToBN(depositAmount as number, 18),
          0,
        ],
      },
    ],
  });

  const {
    data: dataWithdraw, 
    error: errorWithdraw,
    reset: resetWithdraw, 
    execute: executeWithdraw
  } = useStarknetExecute({
    calls: [
      {
        contractAddress: diamondAddress,
        entrypoint: "withdraw_request",
        calldata: [
          asset.depositId,
          NumToBN(depositAmount as number, 18),
        ],
      }
    ]
  })


  // useEffect(() => {
  //   async function name() {
  //     console.log("execute withdraw");

  //     await executeWithdraw()
  //   }
  //   name()
  
  // }, [])
  

  useEffect(() => {
    OffchainAPI.getProtocolDepositLoanRates().then((val) => {
      console.log("loan rates", val);
      setDepositLoanRates(val);
    });
  }, [asset]);

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
    setDepositAmount(e.target.value);
  };

  const handleMax = () => {
    setDepositAmount(
      Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) / 10 ** 18
    )
  }

  function isInvalid() {
    return (
      depositAmount < MinimumAmount[tokenName] ||
      depositAmount >
      Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) / 10 ** 18
    );
  }

  const handleWithdrawDeposit = async (asset: string) => {
    
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
      // setTransDeposit(val.transaction_hash);
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
    console.log(
      "approve tx receipt",
      approveTransactionReceipt.data?.transaction_hash,
      approveTransactionReceipt
    );
    TxToastManager.handleTxToast(
      approveTransactionReceipt,
      `Add Deposit: Approve ${Number(depositAmount)?.toFixed(4)} ${asset.market}`,
      true
    );
  }, [approveTransactionReceipt]);

  useEffect(() => {
    console.log(
      "borrow tx receipt",
      addDepositTransactionReceipt.data?.transaction_hash,
      addDepositTransactionReceipt
    );
    TxToastManager.handleTxToast(
      addDepositTransactionReceipt,
      `Deposit ${Number(depositAmount)?.toFixed(4)} ${asset.market}`
    );
  }, [addDepositTransactionReceipt]);

  useEffect(() => {
    console.log(
      "borrow tx receipt",
      withdrawTransactionReceipt.data?.transaction_hash,
      withdrawTransactionReceipt
    );
    TxToastManager.handleTxToast(
      withdrawTransactionReceipt,
      `Withdraw ${withdrawAmount?.toFixed(4)} ${asset.market}`
    );
  }, [withdrawTransactionReceipt]);

  useEffect(() => {
    const currentBalance =
      parseFloat(BNtoNum(Number(asset.amount))) +
      parseFloat(BNtoNum(Number(asset.acquiredYield)));
    console.log("currentBalance", (value / 100) * currentBalance);
    setWithdrawAmount(Number((value / 100) * currentBalance));
  }, [value]);

  return (
    <div style={{ borderTop: "5px" }}>
      <UncontrolledAccordion
        defaultOpen="0"
        open="false"
        style={{
          margin: "10px",
          color: "white",
          textAlign: "left",
        }}
      >
        <Row
          style={{
            margin: "15px 1px 15px 10px",
            alignItems: "center",
            gap: "50px",
          }}
        >
          {/* <AccordionItem style={{ padding: "20px" }}> */}
          {/* <AccordionHeader targetId="1"> */}
          <Col style={{ marginLeft: "-10px" }}>{`ID${asset.depositId}` ?? 'N/a'}</Col>

          <Col style={{}}>
            <div>
              <img
                src={
                  asset
                    ? CoinClassNames[EventMap[asset.market.toUpperCase()]] ||
                    asset.market.toUpperCase()
                    : null
                }
                height="24px"
              />
              <div
                className="mr-6"
                style={{
                  display: "inline-block",
                  fontSize: "13px",
                }}
              // align="right"
              >
                &nbsp; &nbsp;
                {EventMap[asset.market.toUpperCase()]}
              </div>
            </div>
            <CardTitle tag="h5"></CardTitle>
          </Col>

          <Col>
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              {BNtoNum(Number(asset.amount))}
            </span>
            <div>
              <img
                src={
                  asset
                    ? CoinClassNames[EventMap[asset.market.toUpperCase()]] ||
                    asset.market.toUpperCase()
                    : null
                }
                height="18px"
              />

              <div
                className="mr-6"
                style={{
                  display: "inline-block",
                  fontSize: "13px",
                }}
              >
                &nbsp;
                {EventMap[asset.market.toUpperCase()]}
              </div>
            </div>
          </Col>

          <Col className="mr-4 ">
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              {asset &&
                historicalAPRs &&
                depositInterestAccrued(asset, historicalAPRs)}
              &nbsp;
              {EventMap[asset.market.toUpperCase()]}
            </span>
            <div
              className="mr-6"
              style={{
                display: "inline-block",
                fontSize: "13px",
              }}
            >
              <span style={{ fontSize: "14px" }}>
                {asset &&
                  historicalAPRs &&
                  currentDepositInterestRate(asset, historicalAPRs)}
                %APR
              </span>
            </div>
          </Col>

          <Col className="mr-4 ">
            <div
              className="mr-6"
              style={{
                display: "inline-block",
                fontSize: "14px",
              }}
            >
              {asset.commitment.toLowerCase()}
            </div>
            <CardTitle tag="h5"></CardTitle>
          </Col>

          <Col>Active</Col>

          <Col>
            <button
              style={{
                backgroundColor: "rgb(57, 61, 79)",
                borderRadius: "5px",
                padding: "8px 15px",
                color: "white",
                border: "none",
              }}
              onClick={() => {
                // setAction(!action);
                setmodal_deposit(!modal_deposit);
              }}
            >
              Actions
            </button>
          </Col>

          {action ? (
            <div style={{ borderWidth: 1 }}>
              <CardBody>
                <div>
                  <div className="mb-4 ">
                    <Row>
                      <Col lg="4 mb-3">
                        <div
                          className="block-example border"
                          style={{
                            padding: "15px",
                            borderRadius: "5px",
                          }}
                        >
                          <div className="mb-3">
                            {/* <label className="card-radio-label mb-2"> */}
                            <Button
                              className="btn-block btn-md"
                              color={
                                modal_add_active_deposit === true
                                  ? "light"
                                  : "outline-light"
                              }
                              onClick={() => {
                                tog_add_active_deposit();
                              }}
                            >
                              Add to Deposit
                            </Button>
                            &nbsp; &nbsp;
                            <Button
                              className="btn-block btn-md"
                              color={
                                modal_withdraw_active_deposit === true
                                  ? "light"
                                  : "outline-light"
                              }
                              onClick={() => {
                                tog_withdraw_active_deposit();
                              }}
                            >
                              Withdraw Deposit
                            </Button>
                          </div>
                          {modal_add_active_deposit && (
                            <Form>
                              <div className="row mb-4">
                                <Col sm={12}>
                                  <Input
                                    type="number"
                                    className="form-control"
                                    id="horizontal-password-Input"
                                    placeholder={
                                      depositRequestSel
                                        ? `Minimum amount =  ${MinimumAmount[depositRequestSel]}`
                                        : "Amount"
                                    }
                                    onChange={(event) => {
                                      setDepositAmount(
                                        Number(event.target.value)
                                      );
                                      setDepositCommit(asset.commitmentIndex);
                                      setDepositMarket(asset.marketAddress);
                                    }}
                                  />
                                </Col>
                              </div>

                              <div className="d-grid gap-2">
                                {allowanceVal < (depositAmount as number) ? (
                                  <Button
                                    color="primary"
                                    className="w-md"
                                    disabled={
                                      depositCommit === undefined ||
                                      loadingApprove ||
                                      loadingDeposit ||
                                      (depositAmount as number) <
                                      MinimumAmount[asset]
                                    }
                                    onClick={(e) => handleApprove(asset)}
                                  >
                                    {/* setApproveStatus(transactions[0]?.status); */}
                                    {!(
                                      loadingApprove ||
                                      isTransactionLoading(
                                        approveTransactionReceipt
                                      )
                                    ) ? (
                                      "Approve"
                                    ) : (
                                      <MySpinner text="Approvin token" />
                                    )}
                                  </Button>
                                ) : (
                                  <Button
                                    color="primary"
                                    className="w-md"
                                    disabled={
                                      depositCommit === undefined ||
                                      loadingApprove ||
                                      loadingDeposit ||
                                      (depositAmount as number) <
                                      MinimumAmount[asset]
                                    }
                                    onClick={(e) => DepositAmount(asset)}
                                  >
                                    {!(
                                      loadingApprove ||
                                      isTransactionLoading(
                                        addDepositTransactionReceipt
                                      )
                                    ) ? (
                                      "Deposit"
                                    ) : (
                                      <MySpinner text="Adding Deposit" />
                                    )}
                                  </Button>
                                )}
                              </div>
                            </Form>
                          )}
                          {modal_withdraw_active_deposit && (
                            <Form>
                              <div className="row mb-4">
                                <Col sm={12}>
                                  <Input
                                    type="number"
                                    className="form-control"
                                    id="horizontal-password-Input"
                                    placeholder="Amount"
                                    onChange={(event) => {
                                      setWithdrawAmount(
                                        Number(event.target.value)
                                      );
                                    }}
                                    value={withdrawAmount}
                                  />
                                  <RangeSlider
                                    value={value}
                                    step={25}
                                    tooltip="on"
                                    tooltipLabel={(v) => `${v} %`}
                                    onChange={(changeEvent) =>
                                      setValue(
                                        parseFloat(changeEvent.target.value)
                                      )
                                    }
                                    style={{
                                      width: "100%",
                                      marginTop: "12px",
                                    }}
                                  />
                                </Col>
                              </div>

                              <div className="d-grid gap-2">
                                <Button
                                  className="w-md"
                                  disabled={(depositAmount as number) <= 0}
                                  onClick={() => {
                                    handleWithdrawDeposit(withdrawDeposit);
                                  }}
                                  style={{
                                    color: "#4B41E5",
                                  }}
                                >
                                  {!isTransactionLoading(
                                    withdrawTransactionReceipt
                                  ) ? (
                                    "Withdraw Deposit"
                                  ) : (
                                    <MySpinner text="Withdrawing Deposit" />
                                  )}
                                </Button>
                              </div>
                            </Form>
                          )}
                        </div>
                      </Col>
                      {/* <Col lg="8">
                        {
                          <TxHistoryTable
                            asset={asset}
                            type="deposits"
                            market={asset.market}
                            observables={[
                              withdrawTransactionReceipt,
                              addDepositTransactionReceipt,
                            ]}
                          />
                        }
                      </Col> */}
                    </Row>
                  </div>
                </div>
              </CardBody>
            </div>
          ) : null}
        </Row>
        <hr style={{ color: "#00000080" }} />
      </UncontrolledAccordion>

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
                        <span className="d-none d-sm-block">Add Supply</span>
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
                <div
                  style={{
                    fontSize: "9px",
                    paddingTop: "10px",
                    color: "rgb(111, 111, 111)",
                    display: "flex",
                    gap: "10px",
                    width: "100%",
                  }}
                >
                  {/* Loan ID = {asset.loanId} */}
                  Supply ID = ID123665
                  <Image
                    style={{ cursor: "pointer" }}
                    src={idDropDownArrow}
                    alt="Picture of the author"
                    width="14px"
                    height="14px"
                    onClick={() => {
                      setIdDropDown(!idDropDown);
                      setIdDropDownArrow(idDropDown ? Downarrow : UpArrow);
                    }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      paddingTop: "10px",
                      color: "rgb(111, 111, 111)",
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    Supply Market:
                    <span style={{ display: "flex", alignItems: "center" }}>
                      &nbsp;
                      <img
                        src={`./${tokenName}.svg`}
                        width="13px"
                        height="13px"
                      ></img>
                      &nbsp;
                      <div style={{ color: "white" }}>{tokenName}</div>
                    </span>
                  </div>
                </div>

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
                        backgroundColor: "#1D2131",
                        boxShadow: "0px 0px 10px #00000020",
                      }}
                    >
                      {coins.map((coin, index) => {
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
                          backgroundColor: "#1D2131",
                          padding: "10px ",
                          borderRight: "1px solid rgb(57, 61, 79)",
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
                            onClick={handleMax}
                            // disabled={balance ? false : true}
                            style={{
                              background: "#1D2131",
                              color: "white",
                              border: "1px solid rgb(57, 61, 79)",
                              borderLeft: "none",
                            }}
                          >
                            <span
                              style={{
                                borderBottom: "2px  #fff",
                                 color:  "rgb(111, 111, 111)",
                              }}
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
                      <div style={{ color: "#76809D" }}>&nbsp;{tokenName} </div>
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

              <div className="d-grid gap-2">
                {customActiveTab === "1"?<div
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
                    <div style={{ textAlign: "right", fontWeight: "600", color: "rgb(111, 111, 111)" }}>
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
                    <div style={{ textAlign: "right", fontWeight: "600", color: "rgb(111, 111, 111)" }}>
                      {
                        depositLoanRates && commitPeriod < 3 ? (
                          `${parseFloat(
                            depositLoanRates[
                              `${getTokenFromName(tokenName).address}__${commitPeriod}`
                            ]?.depositAPR?.apr100x as string
                          )} %`
                        ) : (
                          <MySpinner />
                        )
                      }
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
                    <div style={{ textAlign: "right", fontWeight: "600", color: "rgb(111, 111, 111)" }}>
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
                    <div style={{ textAlign: "right", fontWeight: "600", color: "rgb(111, 111, 111)" }}>
                      Starknet
                    </div>
                  </div>
                </div>:customActiveTab === "2"?
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
                    <div style={{ textAlign: "right", fontWeight: "600",color:"rgb(111, 111, 111)"  }}>
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
                    <div style={{ color: "#6F6F6F" }}>Transaction fees</div>
                    <div style={{ textAlign: "right", fontWeight: "600",color:"rgb(111, 111, 111)"  }}>
                      0.1 %
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
                      Pre closure charges
                    </div>
                    <div style={{ textAlign: "right", fontWeight: "600" ,color:"rgb(111, 111, 111)" }}>
                      0.02%
                    </div>
                  </div>
                  <div
                    style={{
                      margin: "3px 0",
                    }}
                  >
                   <div style={{padding:"15px"}}>

                   </div>
                    <div style={{ color: "#6F6F6F" }}>You Are Pre-Closing This Supply Earlier Than Its Minumum Commitment Period. A Timelock Of 3 Days Is Applied On Such Withdrawals. When You Place Withdrawal Requests.The Timelock is Activated. It Will Be Processed On Your Second Attempt To Withdraw Supply.After The Timelock Expiry In 72hrs</div>
                  </div>
                  </div> : null}
                {customActiveTab === "1" ? (
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
                ) : customActiveTab === "2" ? (
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
                      <div style={{ color: "#6F6F6F" }}>Transaction fees</div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "rgb(111, 111, 111)",
                        }}
                      >
                        0.1 %
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
                        Pre closure charges
                      </div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "rgb(111, 111, 111)",
                        }}
                      >
                        0.02%
                      </div>
                    </div>
                    <div
                      style={{
                        margin: "3px 0",
                      }}
                    >
                      <div style={{ padding: "15px" }}></div>
                      <div style={{ color: "#6F6F6F", fontSize: "9px" }}>
                        You Are Pre-Closing This Supply Earlier Than Its Minumum
                        Commitment Period. A Timelock Of 3 Days Is Applied On
                        Such Withdrawals. When You Place Withdrawal Requests.The
                        Timelock is Activated. It Will Be Processed On Your
                        Second Attempt To Withdraw Supply.After The Timelock
                        Expiry In 72hrs
                      </div>
                    </div>
                  </div>
                ) : null}
                <Button
                  style={{
                     backgroundColor:  "rgb(57, 61, 79)",
                     color:  "white",
                     border:  "none",
                   }}
                  color="white"
                  className="w-md"
                  disabled={
                    commitPeriod === undefined ||
                    loadingApprove ||
                    loadingDeposit ||
                    isInvalid()
                  }
                  onClick={(e) => {
                    if(customActiveTab === "1")
                    handleDeposit(tokenName);
                    else handleWithdrawDeposit(tokenName)
                  }}
                >
                  {!(
                    loadingApprove ||
                    isTransactionLoading(requestDepositTransactionReceipt)
                  ) ? (
                    customActiveTab === "1" ? (
                      "Add Supply"
                    ) : customActiveTab === "2" ? (
                      "Withdraw Supply"
                    ) : (
                      ""
                    )
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
        {idDropDown ? (
          <>
            <div
              style={{
                borderRadius: "5px",
                position: "absolute",
                zIndex: "100",
                top: "100px",
                left: "40px",
                width: "115px",
                margin: "0px auto",
                marginBottom: "20px",
                padding: "5px 10px",
                backgroundColor: "#393D4F",
                // boxShadow: "0px 0px 10px rgb(57, 61, 79)",
              }}
            >
              <div
                style={{
                  margin: "10px 0",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "10px",
                  color: "#6F6F6F",
                }}
              >
                Supply ID - 123665
              </div>{" "}
              <div
                style={{
                  margin: "10px 0",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "10px",
                  color: "#6F6F6F",
                }}
              >
                Supply ID - 123665
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </Modal>
    </div>
  );
};
export default ActiveDeposit;
