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
  useAccount,
  useContract,
  useStarknetCall,
  useStarknetExecute,
  useTransactionReceipt,
} from "@starknet-react/core";
import {
  diamondAddress,
  ERC20Abi,
  getTokenFromName,
  isTransactionLoading,
  tokenAddressMap,
} from "../blockchain/stark-constants";
import { GetErrorText, NumToBN } from "../blockchain/utils";

import { Abi, uint256 } from "starknet";
import { getPrice } from "../blockchain/priceFeed";
import { TxToastManager } from "../blockchain/txToastManager";
import MySpinner from "./mySpinner";
import OffchainAPI from "../services/offchainapi.service";

interface IBorrowParams {
  loanAmount: number;
  collateralAmount: number;
  commitBorrowPeriod: number | null;
  collateralMarket: string | null;
}

interface IDepositLoanRates {
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

let Borrow: any = ({ asset, title }: { asset: string; title: string }) => {
  const [token, setToken] = useState(getTokenFromName(asset));
  const [modal_borrow, setmodal_borrow] = useState(false);
  const [allowanceVal, setAllowance] = useState(0);
  //   const [collateralAmount, setcollateralAmount] = useState(0);
  //   const [isAllowed, setAllowed] = useState(false);
  //   const [shouldApprove, setShouldApprove] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [borrowParams, setBorrowParams] = useState<IBorrowParams>({
    loanAmount: 0,
    collateralAmount: 0,
    commitBorrowPeriod: null,
    collateralMarket: null,
  });

  const { address: account } = useAccount();

  const [transApprove, setTransApprove] = useState("");
  const [transBorrow, setTransBorrow] = useState("");

  const approveTransactionReceipt = useTransactionReceipt({
    hash: transApprove,
    watch: true,
  });
  const requestBorrowTransactionReceipt = useTransactionReceipt({
    hash: transBorrow,
    watch: true,
  });

  const [depositLoanRates, setDepositLoanRates] = useState<IDepositLoanRates>({
    "0": {
      borrowAPR: {
        apr100x: "0",
        block: 0,
      },
      depositAPR: {
        apr100x: "0",
        block: 0,
      },
    },
  });

  useEffect(() => {
    setToken(getTokenFromName(asset));
    OffchainAPI.getProtocolDepositLoanRates().then((val) => {
      setDepositLoanRates(val);
    });
  }, [asset]);

  useEffect(() => {
    console.log(
      "approve tx receipt",
      approveTransactionReceipt.data?.transaction_hash,
      approveTransactionReceipt
    );
    TxToastManager.handleTxToast(
      approveTransactionReceipt,
      `Borrow: Approve ${borrowParams.collateralAmount?.toFixed(4)} ${
        borrowParams.collateralMarket
      }`,
      true
    );
  }, [approveTransactionReceipt]);

  useEffect(() => {
    console.log(
      "borrow tx receipt",
      requestBorrowTransactionReceipt.data?.transaction_hash,
      requestBorrowTransactionReceipt
    );
    TxToastManager.handleTxToast(
      requestBorrowTransactionReceipt,
      `Borrow ${borrowParams.loanAmount?.toFixed(4)} ${token?.name}`
    );
  }, [requestBorrowTransactionReceipt]);

  /* ======================= Approve ================================= */
  const {
    data: dataToken,
    loading: loadingToken,
    error: errorToken,
    reset: resetToken,
    execute: ApproveToken,
  } = useStarknetExecute({
    calls: {
      contractAddress:
        tokenAddressMap[borrowParams.collateralMarket || ""] || "",
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

  const { contract: loanMarketContract } = useContract({
    abi: ERC20Abi as Abi,
    address: tokenAddressMap[asset as string] as string,
  });
  const {
    data: loanAssetBalance,
    loading: loadingAssetBalance,
    error: errorAssetBalance,
    refresh: refreshAssetBalance,
  } = useStarknetCall({
    contract: loanMarketContract,
    method: "balanceOf",
    args: [account],
    options: {
      watch: true,
    },
  });

  useEffect(() => {
    const refresh = async () => {
      await refreshBalance();
    };
    refresh();
  }, [borrowParams.collateralMarket, refreshBalance]);

  const returnTransactionParameters = () => {
    return {
      data: dataToken,
      loading: loadingToken,
      reset: resetToken,
      error: errorToken,
    };
  };

  const handleApprove = async (asset: string) => {
    try {
      const val = await ApproveToken();
      setTransApprove(val.transaction_hash);
    } catch (err) {
      console.log(err, "err approve token borrow");
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
    if (e.target.value)
      setBorrowParams({
        ...borrowParams,
        loanAmount: Number(e.target.value),
      });
    else {
      setBorrowParams({
        ...borrowParams,
        loanAmount: 0,
      });
    }
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
    setBorrowParams({
      ...borrowParams,
      collateralAmount:
        Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
        10 ** 18,
    });
  };

  const handleMin = async () => {
    setLoading(true);
    const loanPrice = await getPrice(asset);
    const collateralPrice = await getPrice(borrowParams?.collateralMarket);

    const totalLoanPriceUSD = (borrowParams?.loanAmount as number) * loanPrice;
    // const totalCollateralPrice = borrowParams.collateralAmount * collateralPrcie;

    const minCollateralAmountUSD = totalLoanPriceUSD / 3;

    const minCollateral = minCollateralAmountUSD / collateralPrice;

    setBorrowParams({
      ...borrowParams,
      collateralAmount: minCollateral,
    });
    setLoading(false);
  };

  const handleMinLoan = (asset: string) => {
    setBorrowParams({
      ...borrowParams,
      loanAmount: MinimumAmount[asset],
    });
  };

  const handleBorrow = async (asset: string) => {
    if (
      !tokenAddressMap[asset] ||
      !borrowParams.loanAmount ||
      (!borrowParams.commitBorrowPeriod && !diamondAddress)
    ) {
      toast.error(`${GetErrorText(`Invalid request`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
    if (borrowParams.collateralAmount === 0) {
      toast.error(`${GetErrorText(`Can't use collateral 0 of ${asset}`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
    }
    try {
      // approve collateral spending
      // await handleApprove();
      // if (errorApprove) {
      // 	toast.error(`${GetErrorText(`Approve for token ${asset} failed`)}`, {
      // 		position: toast.POSITION.BOTTOM_RIGHT,
      // 		closeOnClick: true,
      // 	});
      // 	return;
      // }

      // setAllowance(Number(BNtoNum(dataAllowance[0]?.low, 18)));
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

  useEffect(() => {
    console.log(
      "approeve info",
      dataApprove,
      loadingApprove,
      resetApprove,
      errorApprove
    );

    if (dataApprove) {
      setTransApprove(dataApprove?.transaction_hash);
    }
    if (dataBorrow) {
      setTransBorrow(dataBorrow?.transaction_hash);
    }
  }, [dataApprove, loadingApprove, resetApprove, errorApprove, dataBorrow]);

  useEffect(() => {
    console.log(
      "check borrow allownace",
      token?.name,
      borrowParams.collateralMarket,
      {
        dataAllowance,
        remaining: dataAllowance
          ? uint256.uint256ToBN(dataAllowance[0]).toString()
          : "0",
        errorAllowance,
        refreshAllowance,
        loadingAllowance,
      }
    );
    if (!loadingAllowance) {
      if (dataAllowance) {
        let data: any = dataAllowance;
        let _allowance = uint256.uint256ToBN(data.remaining);
        console.log("borrow allowance", token?.name, _allowance, borrowParams);
        setAllowance(Number(uint256.uint256ToBN(dataAllowance[0])) / 10 ** 18);

        // if (allowanceVal > (borrowParams?.collateralAmount as number)) {
        //   setAllowed(true);
        //   setShouldApprove(false);
        // } else {
        //   setShouldApprove(true);
        //   setAllowed(false);
        // }
      } else if (errorAllowance) {
        // handleToast(true, "Check allowance", errorAllowance)
      }
    }
  }, [dataAllowance, errorAllowance, refreshAllowance, loadingAllowance]);

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
                <Col sm={8}>
                  <h6>{title}</h6>
                </Col>
                <Col sm={4}>
                  {borrowParams.collateralMarket && (
                    <div>
                      {" "}
                      Balance :{" "}
                      {loanAssetBalance
                        ? (
                            Number(uint256.uint256ToBN(loanAssetBalance[0])) /
                            10 ** 18
                          ).toString()
                        : " Loading"}
                    </div>
                  )}
                </Col>
              </div>
              <div className="row mb-4">
                <Col sm={12}>
                  <InputGroup>
                    <Input
                      type="text"
                      className="form-control"
                      id="horizontal-password-Input"
                      placeholder={`Minimum amount = ${MinimumAmount[asset]}`}
                      min={MinimumAmount[asset]}
                      value={borrowParams.loanAmount as number}
                      onChange={handleLoanInputChange}
                    />
                    {
                      <>
                        <Button
                          outline
                          type="button"
                          className="btn btn-md w-xs"
                          onClick={() => handleMinLoan(asset)}
                          style={{ background: "#2e3444", border: "#2e3444" }}
                        >
                          Min
                        </Button>
                      </>
                    }
                  </InputGroup>
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
                        ? (
                            Number(uint256.uint256ToBN(dataBalance[0])) /
                            10 ** 18
                          ).toString()
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
                      <>
                        <Button
                          outline
                          type="button"
                          className="btn btn-md w-xs"
                          onClick={handleMin}
                          // disabled={dataBalance ? false : true}
                          style={{ background: "#2e3444", border: "#2e3444" }}
                        >
                          <span style={{ borderBottom: "2px dotted #fff" }}>
                            {isLoading ? <MySpinner /> : "Min"}
                          </span>
                        </Button>

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
                      </>
                    )}
                  </InputGroup>
                </Col>
              </div>
              <div className="row mb-4">
                <Col sm={6}>
                  <p>
                    Borrow APR{" "}
                    <strong>
                      {/* {BorrowInterestRates[
                        borrowParams.commitBorrowPeriod || "NONE"
                      ] || "15%"} */}
                      {depositLoanRates &&
                      (borrowParams.commitBorrowPeriod as number) < 4 &&
                      borrowParams.commitBorrowPeriod ? (
                        `${
                          parseFloat(
                            depositLoanRates[
                              `${getTokenFromName(asset as string).address}__${
                                borrowParams.commitBorrowPeriod
                              }`
                            ]?.borrowAPR?.apr100x as string
                          ) / 100
                        } %`
                      ) : (
                        <MySpinner />
                      )}
                    </strong>
                  </p>
                </Col>
                <Col sm={6}>
                  <p style={{ float: "right" }}>
                    Collateral APY{" "}
                    <strong>
                      {depositLoanRates &&
                      (borrowParams.commitBorrowPeriod as number) < 4 &&
                      borrowParams.commitBorrowPeriod ? (
                        `${
                          parseFloat(
                            depositLoanRates[
                              `${getTokenFromName(asset as string).address}__${
                                borrowParams.commitBorrowPeriod
                              }`
                            ]?.depositAPR?.apr100x as string
                          ) / 100
                        } %`
                      ) : (
                        <MySpinner />
                      )}
                    </strong>
                  </p>
                </Col>
              </div>

              <div className="d-grid gap-2">
                {allowanceVal < (borrowParams.collateralAmount as number) ? (
                  <Button
                    color="primary"
                    className="w-md"
                    disabled={
                      borrowParams.commitBorrowPeriod === undefined ||
                      loadingApprove ||
                      loadingBorrow
                    }
                    onClick={(e) => handleApprove(asset)}
                  >
                    {!(
                      loadingApprove ||
                      isTransactionLoading(approveTransactionReceipt)
                    ) ? (
                      "Approve"
                    ) : (
                      <MySpinner text="Approving token" />
                    )}
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    className="w-md"
                    disabled={
                      borrowParams.commitBorrowPeriod === undefined ||
                      loadingApprove ||
                      loadingBorrow
                    }
                    onClick={(e) => handleBorrow(asset)}
                  >
                    {!(
                      loadingApprove ||
                      isTransactionLoading(requestBorrowTransactionReceipt)
                    ) ? (
                      "Request Loan"
                    ) : (
                      <MySpinner text="Borrowing token" />
                    )}
                  </Button>
                )}
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
