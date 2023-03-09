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
import arrowDown from "../../assets/images/ArrowDownDark.svg";
import arrowUp from "../../assets/images/ArrowUpDark.svg";
import { MinimumAmount } from "../../blockchain/constants";

import {
  diamondAddress,
  ERC20Abi,
  getTokenFromAddress,
  getTokenFromName,
  isTransactionLoading,
  tokenAddressMap,
  tokenDecimalsMap,
} from "../../blockchain/stark-constants";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

// import dropDownArrow from "../../public/drop-down-arrow.svg";
import { uint256 } from "starknet";
import MySpinner from "../mySpinner";
import Image from "next/image";
import dropDownArrow from "../../assets/images/ArrowDownDark.svg";
import UpArrow from "../../assets/images/ArrowUpDark.svg";
import ToastModal from "../toastModals/customToastModal";

const SupplyModal = ({
  modal_deposit,
  accountAddress,
  toggleDropdown,
  tokenName,
  setmodal_deposit,
  tog_center,
  setCommitmentDropDown,
  commitmentDropDown,
  setCommitmentArrow,
  commitmentValue,
  dropDown,
  Coins,
  setTokenName,
  setDropDown,
  setDropDownArrow,
  setAsset,
  handleBalanceChange,
  handleCommitChange,
  setCommitmentValue,
  handleMax,
  setDepositAmount,
  handleDepositAmountChange,
  depositAmount,
  Downarrow,
  asset,
  isInvalid,
  dataBalance,
  value,
  setValue,
  commitmentArrow,
  depositLoanRates,
  commitPeriod,
  reserves,
  loadingApprove,
  loadingDeposit,
  handleDeposit,
  requestDepositTransactionReceipt,
  isToastOpen,
  setIsToastOpen,
  toastParam,
}: {
  modal_deposit: any;
  accountAddress: any;
  toggleDropdown: any;
  tokenName: any;
  setmodal_deposit: any;
  tog_center: any;
  setCommitmentDropDown: any;
  commitmentDropDown: any;
  setCommitmentArrow: any;
  commitmentValue: any;
  dropDown: any;
  Coins: any;
  setTokenName: any;
  setDropDown: any;
  setDropDownArrow: any;
  setAsset: any;
  handleBalanceChange: any;
  handleCommitChange: any;
  setCommitmentValue: any;
  handleMax: any;
  setDepositAmount: any;
  handleDepositAmountChange: any;
  depositAmount: any;
  Downarrow: any;
  asset: any;
  isInvalid: any;
  dataBalance: any;
  value: any;
  setValue: any;
  commitmentArrow: any;
  depositLoanRates: any;
  commitPeriod: any;
  reserves: any;
  loadingApprove: any;
  loadingDeposit: any;
  handleDeposit: any;
  requestDepositTransactionReceipt: any;
  isToastOpen: any;
  setIsToastOpen: any;
  toastParam: any;
}) => {
  return (
    <>
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
                        width="18px"
                        height="18px"
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
                        top: "210px",
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
                          setCommitmentArrow(Downarrow);
                          handleCommitChange(2);
                        }}
                      >
                        &nbsp;1 month
                      </div>
                      <hr />
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
                      <hr />
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
                      <hr />
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
                          border: `1px solid ${
                            !isInvalid() === true
                              ? "#34c38f"
                              : "rgb(57, 61, 79)"
                          }`,
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
                        ) / 100} %`
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
                      {reserves?.loans ? (
                        (
                          (100 * reserves.loans[tokenName]) /
                          reserves.deposits[tokenName]
                        ).toFixed(2) + "%"
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
                    boxShadow: "rgba(0, 0, 0, 0.5) 3.4px 3.4px 5.2px 0px",
                    border: "none",
                    padding: "12px 0",
                    backgroundColor: "rgb(57, 61, 79)",
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
                  // onClick={getGas}
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
    </>
  );
};

export default SupplyModal;
