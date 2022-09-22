import { useState, useContext, MemoExoticComponent, useEffect } from "react";

import {
  Col,
  Button,
  Form,
  Input,
  Modal,
  Spinner,
  InputGroup,
} from "reactstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { BorrowInterestRates, MinimumAmount } from "../blockchain/constants";
import {
  useConnectors,
  useContract,
  useStarknet,
  useStarknetCall,
  useStarknetExecute,
} from "@starknet-react/core";
import {
  diamondAddress,
  ERC20Abi,
  tokenAddressMap,
} from "../blockchain/stark-constants";
import { BNtoNum, GetErrorText, NumToBN } from "../blockchain/utils";

import { Abi } from "starknet";

interface IBorrowParams {
  loanAmount: number | null;
  collateralAmount: number | null;
  commitBorrowPeriod: number | null;
  collateralMarket: string | null;
}

let Borrow: any = ({ asset, title }: { asset: string; title: string }) => {
  const [modal_borrow, setmodal_borrow] = useState(false);

  const [borrowParams, setBorrowParams] = useState<IBorrowParams>({
    loanAmount: null,
    collateralAmount: null,
    commitBorrowPeriod: null,
    collateralMarket: null,
  });

  useEffect(() => {
    const refresh = async () => {
      await refreshBalance();
    };
    refresh();
  }, [borrowParams.collateralMarket]);

  const { account } = useStarknet();

  /* ======================= Approve ================================= */
  const {
    data: dataUSDC,
    loading: loadingUSDC,
    error: errorUSDC,
    reset: resetUSDC,
    execute: USDC,
  } = useStarknetExecute({
    calls: {
      contractAddress: tokenAddressMap[
        borrowParams.collateralMarket as string
      ] as string,
      entrypoint: "approve",
      calldata: [
        diamondAddress,
        NumToBN(borrowParams.collateralAmount as number, 18),
        0,
      ],
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
      contractAddress: tokenAddressMap[
        borrowParams.collateralMarket as string
      ] as string,
      entrypoint: "approve",
      calldata: [
        diamondAddress,
        NumToBN(borrowParams.collateralAmount as number, 18),
        0,
      ],
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
      contractAddress: tokenAddressMap[
        borrowParams.collateralMarket as string
      ] as string,
      entrypoint: "approve",
      calldata: [
        diamondAddress,
        NumToBN(borrowParams.collateralAmount as number, 18),
        0,
      ],
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
      contractAddress: tokenAddressMap[
        borrowParams.collateralMarket as string
      ] as string,
      entrypoint: "approve",
      calldata: [
        diamondAddress,
        NumToBN(borrowParams.collateralAmount as number, 18),
        0,
      ],
    },
  });

  /* ========================== Borrow Request ============================ */

  const {
    data: dataBorrow,
    loading: loadingBorrow,
    error: errorBorrow,
    reset: resetBorrow,
    execute: executeBorrow,
  } = useStarknetExecute({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "loan_request",
      calldata: [
        tokenAddressMap[asset],
        NumToBN(borrowParams.loanAmount as number, 18),
        0,
        borrowParams.commitBorrowPeriod,
        tokenAddressMap[borrowParams.collateralMarket as string],
        NumToBN(borrowParams.collateralAmount as number, 18),
        0,
      ],
    },
  });

  /* ========================= Balance ================================*/

  const { contract } = useContract({
    abi: ERC20Abi as Abi,
    address: tokenAddressMap[borrowParams.collateralMarket as string] as string,
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

  const handleCommitmentChange = (e: any) => {
    console.log(e.target.value);
    setBorrowParams({
      ...borrowParams,
      commitBorrowPeriod: e.target.value,
    });
  };

  const handleCollateralChange = async (e: any) => {
    // setCollateralMarket(e.target.value)
    // const getCurrentBalnce = await wrapper
    //   ?.getMockBep20Instance()
    //   .balanceOf(SymbolsMap[e.target.value], account)
    // setBalance(BNtoNum(Number(getCurrentBalnce)));
    console.log(`setting collateral market to ${e.target.value}`);
    setBorrowParams({
      ...borrowParams,
      collateralMarket: e.target.value,
    });
    await refreshBalance();
  };

  const handleLoanInputChange = (e: any) => {
    setBorrowParams({
      ...borrowParams,
      loanAmount: Number(e.target.value),
    });
  };

  const handleCollateralInputChange = (e: any) => {
    setBorrowParams({
      ...borrowParams,
      collateralAmount: Number(e.target.value),
    });
  };

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  const tog_borrow = async () => {
    setmodal_borrow(!modal_borrow);
    removeBodyCss();
  };

  const handleMax = async () => {
    // await refreshBalance();
    // console.log(uint256ToBN(dataBalance![0]).toNumber());
  };

  const handleBorrow = async () => {
    if (borrowParams.collateralAmount === 0) {
      toast.error(`${GetErrorText(`Can't use collateral 0 of ${asset}`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
    }
    try {
      // approve collateral spending
      await handleApprove();
      if (errorApprove) {
        toast.error(`${GetErrorText(`Approve for token ${asset} failed`)}`, {
          position: toast.POSITION.BOTTOM_RIGHT,
          closeOnClick: true,
        });
        return;
      }

      await executeBorrow();
      if (errorBorrow) {
        toast.error(`${GetErrorText(`Borrow request for ${asset} failed`)}`, {
          position: toast.POSITION.BOTTOM_RIGHT,
          closeOnClick: true,
        });
        return;
      }
    } catch (err) {
      toast.error(`${GetErrorText(err)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary btn-sm w-xs"
        onClick={() => {
          tog_borrow();
        }}
      >
        Borrow
      </button>
      <Modal
        isOpen={modal_borrow}
        toggle={() => {
          tog_borrow();
        }}
        centered
      >
        <div className="modal-body">
          {account ? (
            <Form>
              <div className="row mb-4">
                <h6>{title}</h6>
              </div>
              <div className="row mb-4">
                <Col sm={12}>
                  <Input
                    type="text"
                    className="form-control"
                    id="horizontal-password-Input"
                    placeholder={`Minimum amount = ${MinimumAmount[asset]}`}
                    onChange={handleLoanInputChange}
                  />
                </Col>
              </div>
              <div className="row mb-4">
                <Col sm={12}>
                  <select
                    className="form-select"
                    placeholder="Commitment"
                    onChange={(e) => handleCommitmentChange(e)}
                  >
                    <option hidden>Commitment</option>
                    <option value={0}>None</option>
                    <option value={1}>One Month</option>
                  </select>
                </Col>
              </div>
              <div className="row mb-4">
                <Col sm={8}>
                  <h6>Collateral</h6>
                </Col>
                <Col sm={4}>
                  {borrowParams.collateralMarket && (
                    // <div align="right">
                    <div>
                      {" "}
                      Balance :{" "}
                      {dataBalance
                        ? BNtoNum(dataBalance[0].low, 18).toString()
                        : " Loading"}
                    </div>
                  )}
                </Col>
              </div>
              <div className="row mb-4">
                <Col sm={12}>
                  <select
                    className="form-select"
                    onChange={handleCollateralChange}
                  >
                    <option hidden>Collateral market</option>
                    <option value={"USDT"}>USDT</option>
                    <option value={"USDC"}>USDC</option>
                    <option value={"BTC"}>BTC</option>
                    <option value={"BNB"}>BNB</option>
                  </select>
                </Col>
              </div>
              <div className="row mb-4">
                <Col sm={12}>
                  <InputGroup>
                    <Input
                      type="number"
                      className="form-control"
                      id="amount"
                      placeholder="Amount"
                      onChange={handleCollateralInputChange}
                      value={
                        borrowParams.collateralAmount
                          ? (borrowParams.collateralAmount as number)
                          : "Amount"
                      }
                    />
                    {borrowParams.collateralMarket && (
                      <Button
                        outline
                        type="button"
                        className="btn btn-md w-xs"
                        onClick={handleMax}
                        disabled={dataBalance ? false : true}
                        style={{ background: "#2e3444", border: "#2e3444" }}
                      >
                        <span style={{ borderBottom: "2px dotted #fff" }}>
                          Max
                        </span>
                      </Button>
                    )}
                  </InputGroup>
                </Col>
              </div>
              <div className="row mb-4">
                <Col sm={6}>
                  <p>
                    Borrow APR{" "}
                    <strong>
                      {BorrowInterestRates[
                        borrowParams.commitBorrowPeriod || "NONE"
                      ] || "15%"}
                    </strong>
                  </p>
                </Col>
                <Col sm={6}>
                  <p style={{ float: "right" }}>
                    Collateral APY <strong>0%</strong>
                  </p>
                </Col>
              </div>

              <div className="d-grid gap-2">
                <Button
                  color="primary"
                  className="w-md"
                  disabled={
                    borrowParams.commitBorrowPeriod === undefined ||
                    loadingApprove ||
                    loadingBorrow
                  }
                  onClick={handleBorrow}
                >
                  {!(loadingApprove || loadingBorrow) ? (
                    "Request Loan"
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

export default Borrow = React.memo(Borrow);
