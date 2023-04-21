// @ts-nocheck

import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Modal,
} from "reactstrap";
import ToastModal from "../toastModals/customToastModal";
import Image from "next/image";
import { ICoin } from "../dashboard/dashboard-body";
import { useEffect, useState } from "react";
import {
  getTokenFromName,
  isTransactionLoading,
  tokenDecimalsMap,
} from "../../blockchain/stark-constants";
import { useAccount, useTransactionReceipt } from "@starknet-react/core";

import Slider from "react-custom-slider";

import dropDownArrow from "../../assets/images/ArrowDownDark.svg";
import UpArrow from "../../assets/images/ArrowUpDark.svg";
import OffchainAPI from "../../services/offchainapi.service";
import MySpinner from "../mySpinner";
import { uint256 } from "starknet";
import { MinimumBorrowAmount } from "../../blockchain/constants";
import { Tooltip } from "@mui/material";

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

const BorrowModal: any = ({
  modal_borrow,
  account,
  toggleDropdown,
  tokenName,
  setTokenName,
  tokenSymbol,
  setTokenSymbol,
  borrowTokenName,
  setBorrowTokenName,
  borrowTokenSymbol,
  setBorrowTokenSymbol,
  setmodal_borrow,
  tog_borrow,
  setCommitmentDropDown,
  commitmentDropDown,
  setCommitmentArrow,
  commitmentValue,
  dropDown,
  Coins,
  setDropDown,
  setDropDownArrow,
  setAsset,
  borrowParams,
  handleCollateralChange,
  setCommitmentValue,
  handleMax,
  setBorrowParams,
  handleCollateralInputChange,
  Downarrow,
  asset,
  isValidCollateralAmount,
  dataBalance,
  value,
  setValue,
  commitmentArrow,
  depositLoanRates,
  loadingApprove,
  isToastOpen,
  setIsToastOpen,
  requestBorrowTransactionReceipt,
  isValid,
  handleBorrow,
  loadingBorrow,
  debtCategory,
  loadingDebtCategory,
  fairPriceArray,
  processOracleFairPrices,
  TransactionFees,
  loadingMaxLoan,
  handleMaxLoan,
  isLoanAmountValid,
  handleLoanInputChange,
  MinimumAmount,
  borrowArrow,
  toggleBorrowDropdown,
  handleCommitmentChange,
  setBorrowArrow,
  setBorrowDropDown,
  borrowDropDown,
  toastParam,
}: {
  modal_borrow: any;
  account: any;
  toggleDropdown: any;
  tokenName: any;
  setTokenName: any;
  tokenSymbol: any;
  setTokenSymbol: any;
  borrowTokenName: any;
  setBorrowTokenName: any;
  borrowTokenSymbol: any;
  setBorrowTokenSymbol: any;
  setmodal_borrow: any;
  tog_borrow: any;
  setCommitmentDropDown: any;
  commitmentDropDown: any;
  setCommitmentArrow: any;
  commitmentValue: any;
  dropDown: any;
  Coins: any;
  setDropDown: any;
  setDropDownArrow: any;
  borrowParams: any;
  handleCollateralChange: any;
  setAsset: any;
  setCommitmentValue: any;
  handleMax: any;
  setBorrowParams: any;
  handleCollateralInputChange: any;
  Downarrow: any;
  asset: any;
  isValidCollateralAmount: any;
  dataBalance: any;
  value: any;
  setValue: any;
  commitmentArrow: any;
  depositLoanRates: any;
  loadingApprove: any;
  isToastOpen: any;
  setIsToastOpen: any;
  requestBorrowTransactionReceipt: any;
  isValid: any;
  handleBorrow: any;
  loadingBorrow: any;
  debtCategory: any;
  loadingDebtCategory: any;
  fairPriceArray: any;
  processOracleFairPrices: any;
  TransactionFees: any;
  loadingMaxLoan: any;
  handleMaxLoan: any;
  isLoanAmountValid: any;
  handleLoanInputChange: any;
  MinimumAmount: any;
  borrowArrow: any;
  toggleBorrowDropdown: any;
  handleCommitmentChange: any;
  setBorrowArrow: any;
  setBorrowDropDown: any;
  borrowDropDown: any;
  toastParam: any;
}) => {
  // console.log("Thisasset",asset);

  return (
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
                    width="18px"
                    height="18px"
                  ></img>
                  &nbsp;&nbsp;{tokenSymbol}
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
                    src={dropDown ? UpArrow : dropDownArrow}
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
                  borderRight: "none",
                }}
                type="number"
                className="form-control"
                id="amount"
                placeholder="Amount"
                onChange={handleCollateralInputChange}
                value={borrowParams.collateralAmount}
                valid={isValidCollateralAmount()}
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
                        isValidCollateralAmount()
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
              <div style={{ color: "#76809D" }}>&nbsp;{tokenSymbol} </div>
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
                            10 ** (tokenDecimalsMap[tokenName] || 18))) /
                        100,
                    });
                  }
                  {
                    // console.log("assets",asset);
                  }
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
                  onMouseLeave={() => {
                    setDropDown(!dropDown);
                  }}
                >
                  {Coins.map((coin: any, index: number) => {
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
                            setTokenSymbol(`${coin.symbol}`);
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
                          <div>&nbsp;&nbsp;&nbsp;{coin.symbol}</div>
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
                    width: "420px",
                    margin: "0px auto",
                    marginBottom: "20px",
                    padding: "5px 10px",
                    backgroundColor: "#1D2131",
                    boxShadow: "0px 0px 10px #00000020",
                  }}
                  onMouseLeave={() => {
                    setBorrowDropDown(!borrowDropDown);
                    setBorrowArrow(dropDownArrow);
                  }}
                >
                  {Coins.map((coin: any, index: number) => {
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
                            setBorrowTokenSymbol(`${coin.symbol}`);
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
                          <div>&nbsp;&nbsp;&nbsp;{coin.symbol}</div>
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
                  onMouseLeave={() => {
                    setCommitmentDropDown(!commitmentDropDown);
                    setCommitmentArrow(Downarrow);
                  }}
                >
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
                  <hr />
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
                  &nbsp;&nbsp;{borrowTokenSymbol}
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
                    borderRight: "none",
                  }}
                  id="loan-amount"
                  type="number"
                  className="form-control"
                  placeholder={`Minimum amount = ${MinimumBorrowAmount[asset]}`}
                  min={MinimumBorrowAmount[asset]}
                  value={borrowParams.loanAmount}
                  onChange={handleLoanInputChange}
                  valid={isLoanAmountValid()}
                />
                <Button
                  outline
                  type="button"
                  className="btn btn-md w-xs"
                  onClick={handleMaxLoan}
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
                    <Tooltip title="mySwap" arrow>
                      <img
                        src="./mySwapSmallIcon.svg"
                        alt="Icon 1"
                        width="15px"
                        height="15px"
                      />
                    </Tooltip>{" "}
                    <Tooltip title="jediSwap" arrow>
                      <img
                        src="./jediSwapSmallIcon.svg"
                        alt="Icon 2"
                        width="15px"
                        height="15px"
                      />
                    </Tooltip>{" "}
                    <Tooltip title="yagi" arrow>
                      <img
                        src="./yagiSmallIcon.svg"
                        alt="Icon 3"
                        width="15px"
                        height="15px"
                      />
                    </Tooltip>{" "}
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
                    $1.5
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
              {/* <div style={{backgroundColor:"#393D4F",borderRadius:"5px",padding:"10px"}}>
                  <span style={{fontWeight:"200px"}}>
                    Note : 
                  </span>
                     This is the note where you are supposed to do some information of the given user and something
                </div> */}
              <br />

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
          <h2 style={{ color: "white" }}>Please connect your wallet</h2>
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
  );
};

export default BorrowModal;
