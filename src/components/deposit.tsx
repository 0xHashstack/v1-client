import { useState, useContext, useEffect } from "react";
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
} from "reactstrap";

import { MinimumAmount } from "../blockchain/constants";

import {
  diamondAddress,
  ERC20Abi,
  tokenAddressMap,
} from "../blockchain/stark-constants";
import { BNtoNum, GetErrorText, NumToBN } from "../blockchain/utils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

import {
  useContract,
  useStarknet,
  useStarknetCall,
  useStarknetExecute,
  useStarknetInvoke,
} from "@starknet-react/core";
import { Abi, Contract } from "starknet";
import { uint256ToBN } from "starknet/dist/utils/uint256";

let Deposit: any = ({ asset }: { asset: string }) => {
  const [modal_deposit, setmodal_deposit] = useState(false);

  const [depositAmount, setDepositAmount] = useState(0);
  const [commitPeriod, setCommitPeriod] = useState(0);

  const { account } = useStarknet();

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
      calldata: [diamondAddress, depositAmount, 0],
    },
  });

  const {
    data: dataUSDT,
    loading: loadingUSDT,
    error: errorUSDT,
    reset: resetUSDT,
    execute: USDT,
  } = useStarknetExecute({
    calls: {
      contractAddress: tokenAddressMap[asset] as string,
      entrypoint: "approve",
      calldata: [diamondAddress, depositAmount, 0],
    },
  });

  const {
    data: dataBNB,
    loading: loadingBNB,
    error: errorBNB,
    reset: resetBNB,
    execute: BNB,
  } = useStarknetExecute({
    calls: {
      contractAddress: tokenAddressMap[asset] as string,
      entrypoint: "approve",
      calldata: [diamondAddress, depositAmount, 0],
    },
  });

  const {
    data: dataBTC,
    loading: loadingBTC,
    error: errorBTC,
    reset: resetBTC,
    execute: BTC,
  } = useStarknetExecute({
    calls: {
      contractAddress: tokenAddressMap[asset] as string,
      entrypoint: "approve",
      calldata: [diamondAddress, depositAmount, 0],
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
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "deposit_request",
      calldata: [tokenAddressMap[asset], commitPeriod, depositAmount, 0],
    },
  });

  const returnTransactionParameters = () => {
    let data, loading, reset, error;
    if (asset === "BTC") {
      [data, loading, reset, error] = [dataBTC, loadingBTC, resetBTC, errorBTC];
    }
    if (asset === "BNB") {
      [data, loading, reset, error] = [dataBNB, loadingBNB, resetBNB, errorBNB];
    }
    if (asset === "USDC") {
      [data, loading, reset, error] = [
        dataUSDC,
        loadingUSDC,
        resetUSDC,
        errorUSDC,
      ];
    }
    if (asset === "USDT") {
      [data, loading, reset, error] = [
        dataUSDT,
        loadingUSDT,
        resetUSDT,
        errorUSDT,
      ];
    }
    return { data, loading, reset, error };
  };

  const handleApprove = async () => {
    let val;
    if (asset === "BTC") {
      val = await BTC();
    }
    if (asset === "BNB") {
      val = await BNB();
    }
    if (asset === "USDC") {
      val = await USDC();
    }
    if (asset == "USDT") {
      val = await USDT();
    }
  };

  const {
    data: dataApprove,
    loading: loadingApprove,
    reset: resetApprove,
    error: errorApprove,
  } = returnTransactionParameters();

  const tog_center = async () => {
    setmodal_deposit(!modal_deposit);
    removeBodyCss();
    // const getCurrentBalnce = await wrapper
    //   ?.getMockBep20Instance()
    //   .balanceOf(SymbolsMap[props.asset], account);
    // setBalance(BNtoNum(Number(getCurrentBalnce)));
  };

  const handleCommitChange = (e: any) => {
    setCommitPeriod(e.target.value);
  };

  const handleDepositAmountChange = (e: any) => {
    setDepositAmount(Number(e.target.value));
  };

  const handleMax = async () => {
    // await refreshBalance();
    // console.log(uint256ToBN(dataBalance![0]).toNumber());
  };

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  const handleDeposit = async (asset: string) => {
    // approve the transfer
    if (depositAmount === 0) {
      toast.error(`${GetErrorText(`Can't deposit 0 of ${asset}`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
    await handleApprove();
    if (errorApprove) {
      toast.error(`${GetErrorText(`Approve for token ${asset} failed`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
    // run deposit function

    await executeDeposit();
    if (errorDeposit) {
      toast.error(`${GetErrorText(`Deposit for ${asset} failed`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
  };

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
                      ? uint256ToBN(dataBalance[0]).toString()
                      : " Loading"}
                  </div>
                </Col>
              </div>
              <FormGroup>
                <div className="row mb-4">
                  <Col sm={12}>
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
                        placeholder={`Minimum amount = ${MinimumAmount[asset]}`}
                        onChange={handleDepositAmountChange}
                        value={
                          depositAmount !== 0
                            ? depositAmount
                            : `Minimum amount = ${MinimumAmount[asset]}`
                        }
                        // value={depositAmount}
                        invalid={
                          depositAmount !== 0 &&
                          depositAmount < MinimumAmount[asset]
                            ? true
                            : false
                        }
                      />

                      {
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
                      }
                    </InputGroup>
                    {depositAmount != 0 &&
                      depositAmount < MinimumAmount[asset] && (
                        <FormText>
                          {`Please enter amount more than minimum amount = ${MinimumAmount[asset]}`}
                        </FormText>
                      )}
                  </Col>
                </div>
              </FormGroup>
              <div className="row mb-4">
                <Col sm={12}>
                  <select
                    className="form-select"
                    placeholder="Commitment"
                    onChange={handleCommitChange}
                  >
                    <option hidden>Commitment</option>
                    <option value={0}>None</option>
                    <option value={1209600}>Two Weeks</option>
                    <option value={2592000}>One Month</option>
                    <option value={7776000}>Three Months</option>
                  </select>
                </Col>
              </div>
              <div className="d-grid gap-2">
                <Button
                  color="primary"
                  className="w-md"
                  disabled={
                    commitPeriod === undefined ||
                    loadingApprove ||
                    loadingDeposit ||
                    depositAmount < MinimumAmount[asset]
                  }
                  onClick={(e) => handleDeposit(asset)}
                >
                  {!(loadingApprove || loadingDeposit) ? (
                    "Deposit"
                  ) : (
                    <Spinner>Loading...</Spinner>
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
