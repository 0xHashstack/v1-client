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
} from "reactstrap";

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
import { Abi, Contract, uint256, number } from "starknet";
import { TxToastManager } from "../blockchain/txToastManager";
import MySpinner from "./mySpinner";

let Deposit: any = ({ asset }: { asset: string }) => {
  const [token, setToken] = useState(getTokenFromName(asset));

  const [modal_deposit, setmodal_deposit] = useState(false);

  const [depositAmount, setDepositAmount] = useState(0);
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
    calls: [{
      contractAddress: tokenAddressMap[asset] as string,
      entrypoint: "approve",
      calldata: [diamondAddress, NumToBN(depositAmount, 18), 0],
    },{
      contractAddress: diamondAddress,
      entrypoint: "deposit_request",
      calldata: [
        tokenAddressMap[asset],
        commitPeriod,
        NumToBN(depositAmount, 18),
        0,
      ],
    }],
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
    setCommitPeriod(e.target.value);
  };

  const handleDepositAmountChange = (e: any) => {
    if (e.target.value) setDepositAmount(Number(e.target.value));
    else setDepositAmount("");
  };

  const handleMax = async () => {
    setDepositAmount(
      Number(uint256.uint256ToBN(dataBalance[0] || 0)) / 10 ** 18
    );
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
      setTransDeposit(val.transaction_hash)
    } catch(err) {
      console.log(err, 'err deposit')
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
    return depositAmount < MinimumAmount[asset] || depositAmount > Number(uint256.uint256ToBN(dataBalance? dataBalance[0] : 0)) /
                        10 ** 18
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-dark btn-sm w-xs"
        onClick={tog_center}
      >
        Deposit
      </button>
      <Modal
        isOpen={modal_deposit}
        toggle={() => {
          tog_center();
        }}
        centered
      >
        <div className="modal-body">
          {account ? (
            <Form>
              <div className="row mb-4">
                <Col sm={8}>
                  <h5> {asset}</h5>
                </Col>
                <Col sm={4}>
                  <div>
                    Balance {asset}:{" "}
                    {dataBalance
                      ? (
                          Number(uint256.uint256ToBN(dataBalance[0])) /
                          10 ** 18
                        ).toString()
                      : <MySpinner/>}
                  </div>
                </Col>
              </div>
              <FormGroup>
                <div className="row mb-4">
                  <Col sm={12}>

                    <Label for="amount">
                      Amount
                    </Label>
                    <InputGroup
                      style={{
                        border:
                          depositAmount == 0 ||
                          depositAmount >= MinimumAmount[asset]
                            ? "1px solid #556EE6"
                            : "",
                      }}
                    >
                      <Input
                        type="number"
                        className="form-control"
                        id="amount"
                        min={MinimumAmount[asset]}
                        placeholder={`Minimum amount = ${MinimumAmount[asset]}`}
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
                            onClick={handleMin}
                            // disabled={balance ? false : true}
                            style={{ background: "#2e3444", border: "#2e3444" }}
                          >
                            <span style={{ borderBottom: "2px dotted #fff" }}>
                              Min
                            </span>
                          </Button>

                          <Button
                            outline
                            type="button"
                            className="btn btn-md w-xs"
                            onClick={handleMax}
                            // disabled={balance ? false : true}
                            style={{ background: "#2e3444", border: "#2e3444" }}
                          >
                            <span style={{ borderBottom: "2px dotted #fff" }}>
                              Max
                            </span>
                          </Button>
                        </>
                      }
                    </InputGroup>
                    {depositAmount != 0 &&
                      depositAmount < MinimumAmount[asset] && (
                        <FormText style={{color: '#e97272 !important'}}>
                          {`Please enter amount more than minimum amount = ${MinimumAmount[asset]} ${asset}`}
                        </FormText>
                      )}
                    {depositAmount != 0 &&
                      depositAmount > (Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
                      10 ** 18) && (
                        <FormText style={{color: '#e97272 !important'}}>
                          {`Amount is greater than your balance`}
                        </FormText>
                      )}

                  </Col>
                </div>
              </FormGroup>
              <FormGroup floating>
                <div className="row mb-4">
                  <Col sm={12}>

                    <Label for="commitment">
                      Commitment
                    </Label>
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
              </FormGroup>
              <UncontrolledAlert color="primary">
                <b>Note:</b> You need not make a deposit to borrow. Collateral will be taken from you when you borrow.
              </UncontrolledAlert>
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
                      "Deposit"
                    ) : (
                      <MySpinner text="Depositing token" />
                    )}
                  </Button>
                {/* )} */}
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
