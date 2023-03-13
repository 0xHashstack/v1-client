import {
  useAccount,
  useContract,
  useStarknet,
  useStarknetCall,
  useStarknetExecute,
  useTransactionReceipt,
} from "@starknet-react/core";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Table, Spinner, TabPane } from "reactstrap";
import { Abi, number, uint256 } from "starknet";
import { CoinClassNames, EventMap } from "../../blockchain/constants";
import {
  ComptrollerAbi,
  diamondAddress,
  ERC20Abi,
  getTokenFromName,
  isTransactionLoading,
  LiquidateAbi,
  tokenAddressMap
} from "../../blockchain/stark-constants";
import { TxToastManager } from "../../blockchain/txToastManager";
import { BNtoNum, weiToEtherNumber } from "../../blockchain/utils";
import MySpinner from "../mySpinner";

const LiquidationButton = ({
  loan,
  isTransactionDone,
}: {
  loan: any;
  isTransactionDone: any;
}) => {
  const [shouldApprove, setShouldApprove] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Loading...");
  const [canLiquidate, setCanLiquidate] = useState(false);
  const [allowance, setAllowance] = useState<string>("");
  const { address: _account } = useAccount();
  const [account, setAccount] = useState<string>("");

  const [transApprove, setTransApprove] = useState("");
  const [transLiquidate, setTransLiquidate] = useState("");

  const approveTransactionReceipt = useTransactionReceipt({
    hash: transApprove,
    watch: true,
  });
  const liquidateTransactionReceipt = useTransactionReceipt({
    hash: transLiquidate,
    watch: true,
  });

  useEffect(() => {
    // console.log(
    //   "approve tx receipt",
    //   approveTransactionReceipt.data?.transaction_hash,
    //   approveTransactionReceipt
    // );
    TxToastManager.handleTxToast(
      approveTransactionReceipt,
      `Liquidate: Approve ${loan?.loanMarketSymbol}`,
      true
    );
  }, [approveTransactionReceipt]);

  useEffect(() => {
    // console.log(
    //   "liquidate tx receipt",
    //   liquidateTransactionReceipt.data?.transaction_hash,
    //   liquidateTransactionReceipt
    // );
    TxToastManager.handleTxToast(liquidateTransactionReceipt, `Liquidate loan`);
  }, [liquidateTransactionReceipt]);

  let loanTokenAddress = getTokenFromName(loan.loanMarket)?.address || "";
  useEffect(() => {
    setAccount(number.toHex(number.toBN(number.toFelt(_account || ""))));
  }, [_account]);

  const { contract: erc20Contract } = useContract({
    abi: ERC20Abi as Abi,
    address: loanTokenAddress,
  });
 
  const { contract: loanContract } = useContract({
    abi: LiquidateAbi as Abi,
    address: diamondAddress,
  });
 

  const {
    data: dataAllowance,
    loading: loadingAllowance,
    error: errorAllowance,
    refresh: refreshAllowance,
  } = useStarknetCall({
    contract: erc20Contract,
    method: "allowance",
    args: [account, diamondAddress],
    options: {
      watch: true,
    },
  });

  // Approve
  const {
    data: dataToken,
    loading: loadingToken,
    error: errorToken,
    reset: resetToken,
    execute: approveToken,
  } = useStarknetExecute({
    calls:[ {
      contractAddress: loanTokenAddress,
      entrypoint: "approve",
      calldata: [diamondAddress, loan.loanAmount, 0],
    },
     {
      contractAddress: diamondAddress,
      entrypoint: "liquidate",
      calldata: [loan.id],
    }]
  });

  const {
    data: dataLiquidate,
    loading: liquidating,
    error: errorLiquidate,
    reset: reset,
    execute: liquidate,
  } = useStarknetExecute({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "liquidate",
      calldata: [(loan.id).toString()],
    },
  });
  
  

  const {
    data: is_liquidable,
    loading: loadingliquidable,
    error: errorliquidable,
    refresh: refreshliquidable,
  } = useStarknetCall({
    contract: loanContract,
    method: "is_loan_liquidable",
    args: [loan.id],
    options: {
      watch: true,
    },
  });
  // console.log("isLiquid",is_liquidable);
  // // console.log(BNtoNum(is_liquidable));

  function handleToast(isError: boolean, tag: string, msg: string) {
    if (!isError) {
      toast.success(`${tag}: ${msg}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
    } else {
      toast.error(`${tag} Error: ${msg}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
    }
  }

  // check allowance
  useEffect(() => {
    // console.log("check allownace", {
    //   dataAllowance,
    //   loadingAllowance,
    //   errorAllowance,
    //   refreshAllowance,
    // });
    if (!loadingAllowance) {
      if (dataAllowance) {
        let data: any = dataAllowance;
        let _allowance = uint256.uint256ToBN(data.remaining);
        // console.log({
        //   _allowance: _allowance.toString(),
        //   loanAmount: loan.loanAmount,
        // });
        if (_allowance.gte(number.toBN(loan.loanAmount))) {
          setCanLiquidate(true);
          setLoadingMsg("");
          setShouldApprove(false);
        } else {
          setShouldApprove(true);
          setCanLiquidate(false);
          setLoadingMsg("");
        }
      } else if (errorAllowance) {
        handleToast(true, "Check allowance", errorAllowance);
      }
    }
  }, [dataAllowance, loadingAllowance, errorAllowance, refreshAllowance]);

  useEffect(() => {
    // console.log("check token approve", {
    //   dataToken,
    //   loadingToken,
    //   errorToken,
    //   loanId: loan,
    // });
    if (!loadingToken) {
      if (dataToken) {
        refreshAllowance();
        handleToast(false, "Approve", "Successful");
        setLoadingMsg("Loading...");
      } else if (errorToken) {
        setShouldApprove(true);
        handleToast(true, "Approve", errorToken);
      }
    } else {
      setLoadingMsg("Approving...");
      setShouldApprove(false);
    }
  }, [dataToken, loadingToken, errorToken]);

  useEffect(() => {
    // console.log("handleLiquidation", {
    //   dataLiquidate,
    //   liquidate,
    //   errorLiquidate,
    //   reset,
    //   loanId: loan,
    // });
    if (!liquidating) {
      if (loadingMsg == "Liquidating...") {
        if (dataLiquidate) {
          setLoadingMsg("Liquidated");
        } else if (errorLiquidate) {
          handleToast(true, "Liquidation", errorLiquidate);
          setCanLiquidate(true);
          setLoadingMsg("");
        }
      }
    } else {
      setCanLiquidate(false);
      setLoadingMsg("Liquidating...");
    }
  }, [dataLiquidate, liquidate, errorLiquidate]);
   
  return (
    <>
      {loadingMsg ? <>{loadingMsg}</> : <></>}
      {shouldApprove ? (
        <Button
          disabled={BNtoNum(is_liquidable) === "1"? false :true}
          // className="text-muted"
          color="light"
          style={{ color: "white", backgroundColor: "rgb(57, 61, 79)" }}
          outline
          onClick={async () => {
            // reset()
            try {
              const val = await approveToken() ;
              setTransApprove(val.transaction_hash);
            } catch (err) {
              // console.log(err, "err approve for liquidation or Liquidation");
            }
          }}
        >
          {isTransactionLoading(approveTransactionReceipt) && isTransactionLoading(liquidateTransactionReceipt) ? (
            <MySpinner text="Approving & Liquidating token" />
          ) : (
              
            <>
            {BNtoNum(is_liquidable) === "1"?  "Approve & Liquidate": "Not Liquidable"}
           
            </>
          )}
        </Button>
      ) : (
        <></>
      )}
      {canLiquidate ? (
        <Button
          className="text-muted"
          color="light"
          style={{ backgroundColor: "rgb(57, 61, 79)" }}
          outline
          onClick={async () => {
            // reset()
            try {
              const val = await liquidate();
              setTransLiquidate(val.transaction_hash);
            } catch (err) {
              // console.log(err, "err liquidation");
            }
          }}
        >
          {isTransactionLoading(liquidateTransactionReceipt) ? (
            <MySpinner text="Liquidating" />
          ) : (
            <>Liquidate</>
          )}
        </Button>
      ) : (
        <></>
      )}
    </>
  );
};

const Liquidation = ({
  activeLiquidationsData,
  isTransactionDone,
}: {
  activeLiquidationsData: any;
  isTransactionDone: any;
}) => {
  
  return (
    <TabPane tabId="3">
      <div
        className="table-responsive"
        style={{ backgroundColor: "rgb(42, 46, 63)" }}
      >
        <Table className="table table-nowrap align-middle mb-0">
          <thead>
            <tr style={{ color: "rgb(140, 140, 140)" }}>
              <th scope="col">Debt Market</th>
              <th scope="col">Amount</th>
              <th scope="col">Collateral Market</th>
              <th scope="col">Collateral Balance</th>
              <th scope="col">Risk Premium</th>
              <th scope="col">Debt Converted</th>
              <th scope="col">Converted Market </th>
              <th scope="col">Amount</th>
              <th scope="col">Current Discount</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(activeLiquidationsData) &&
            activeLiquidationsData.length > 0 ? (
              activeLiquidationsData.map((asset, key) => {
                // console.log("asset in li", asset);
                return (
                  <tr key={key} style={{ color: "white" }}>
                    <th scope="row">
                      <div className="d-flex align-items-center">
                        <div className="avatar-xs me-3">
                          <img
                            src={
                              CoinClassNames[
                                EventMap[asset.loanMarket.toUpperCase()]
                              ] || asset.loanMarket.toUpperCase()
                            }
                          />
                        </div>
                        <span>{EventMap[asset.loanMarketSymbol.toUpperCase()]}</span>
                      </div>
                    </th>
                    <td>
                      <div>
                        {/* {// console.log(asset.loanAmount)} */}
                        {weiToEtherNumber(asset.loanAmount,tokenAddressMap[asset.loanMarket]||"")}
                        {/* {BNtoNum(Number(asset.loanAmount))} */}
                        <div>
                          <img
                            style={{ scale: "0.7" }}
                            src={
                              CoinClassNames[
                                EventMap[asset.loanMarket.toUpperCase()]
                              ] || asset.collateralMarket.toUpperCase()
                            }
                          />
                          <span style={{ scale: "0.7" }}>
                            {EventMap[asset.loanMarket.toUpperCase()]}
                          </span>
                        </div>
                      </div>
                    </td>
                    <th scope="row">
                      <div className="d-flex align-items-center">
                        <div className="avatar-xs me-3">
                          <img
                            src={
                              CoinClassNames[
                                EventMap[asset.collateralMarket.toUpperCase()]
                              ] || asset.collateralMarket.toUpperCase()
                            }
                          />
                        </div>
                        <span>
                          {EventMap[asset.collateralMarketSymbol.toUpperCase()]}
                        </span>
                      </div>
                    </th>
                    <td>
                      <div>{BNtoNum(Number(asset.collateralAmount))}</div>
                    </td>
                    <td>
                      <div>
                        {/* {EventMap[asset.commitment]}
                      {// console.log(EventMap[asset.commitment])
                      } Risk Premium value */}
                        N/A
                      </div>
                    </td>
                    <td>
                      <div>
                        {/* {EventMap[asset.commitment]}
                      {// console.log(EventMap[asset.commitment])
                      } Debt Converted*/}
                        NO
                      </div>
                    </td>
                    <td>
                      <div>
                        {/* {EventMap[asset.commitment]}
                      {// console.log(EventMap[asset.commitment])
                      } Converted Market*/}
                        {/* <img
                        src={
                          CoinClassNames[
                            EventMap[asset.collateralMarket.toUpperCase()]
                          ] || asset.collateralMarket.toUpperCase()
                        }
                      /> */}
                        -
                      </div>
                    </td>
                    <td>
                      <div>
                        {/* {EventMap[asset.commitment]}
                      {// console.log(EventMap[asset.commitment])
                      } Amount*/}
                        -
                      </div>
                    </td>
                    <td>
                      <div>
                        {/* {EventMap[asset.commitment]}
                      {// console.log(EventMap[asset.commitment])
                      } Amount*/}
                        10%
                      </div>
                    </td>
                    <td>
                      <LiquidationButton
                        loan={asset}
                        isTransactionDone={isTransactionDone}
                      ></LiquidationButton>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5}>No Records Found.</td>
              </tr>
            )}
          </tbody>
        </Table>
        {activeLiquidationsData.length ? (
          <Button
            className="d-flex align-items-center"
            color="light"
            style={{
              color: "white",
              margin: "2px 0px",
              backgroundColor: "rgb(57, 61, 79)",
            }}
            outline
            onClick={() => {
              // increaseLiquidationIndex;
            }}
          >
            Show More
          </Button>
        ) : (
          <></>
        )}
      </div>
    </TabPane>
  );
};

export default Liquidation;
