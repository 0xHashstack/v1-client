import {
  useAccount,
  useStarknetExecute,
  useTransactionReceipt,
  UseTransactionReceiptResult,
} from "@starknet-react/core";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Table } from "reactstrap";
import {
  diamondAddress,
  tokenAddressMap,
} from "../../../blockchain/stark-constants";
import { BNtoNum, GetErrorText, NumToBN } from "../../../blockchain/utils";
import { getPrice } from "../../../blockchain/priceFeed";
import { TxToastManager } from "../../../blockchain/txToastManager";
import ActiveLoan from "./active-loans/active-loan";
import OffchainAPI from "../../../services/offchainapi.service";

const ActiveLoansTab = ({
  activeLoansData,
  customActiveTabs,
  isTransactionDone,
  depositRequestSel,
  // inputVal1,
  removeBodyCss,
  setCustomActiveTabs,
}: {
  activeLoansData: any;
  customActiveTabs: any;
  isTransactionDone: any;
  depositRequestSel: any;
  // inputVal1: any;
  removeBodyCss: () => void;
  setCustomActiveTabs: any;
}) => {
  const [loanActionTab, setLoanActionTab] = useState("0");
  const { address: account } = useAccount();

  const [handleRepayTransactionDone, setHandleRepayTransactionDone] =
    useState(false);
  const [
    handleWithdrawLoanTransactionDone,
    setHandleWithdrawLoanTransactionDone,
  ] = useState(false);
  const [swapOption, setSwapOption] = useState();
  const [handleSwapTransactionDone, setHandleSwapTransactionDone] =
    useState(false);
  const [handleSwapToLoanTransactionDone, setHandleSwapToLoanTransactionDone] =
    useState(false);
  const [modal_add_collateral, setmodal_add_collateral] = useState(false);

  const [collateral_active_loan, setCollateralActiveLoan] = useState(true);
  const [withdraw_active_loan, setWithdrawActiveLoan] = useState(false);
  const [repay_active_loan, setReapyActiveLoan] = useState(false);
  const [swap_to_active_loan, setSwapToActiveLoan] = useState(false);
  const [swap_active_loan, setSwapActiveLoan] = useState(true);

  const [addCollateralTransactionReceipt, setAddCollateralTransactionReceipt] =
    useState<UseTransactionReceiptResult>({
      loading: false,
      refresh: () => {},
    });
  const [repayTransactionReceipt, setRepayTransactionReceipt] =
    useState<UseTransactionReceiptResult>({
      loading: false,
      refresh: () => {},
    });
  const [revertSwapTransactionReceipt, setRevertSwapTransactionReceipt] =
    useState<UseTransactionReceiptResult>({
      loading: false,
      refresh: () => {},
    });

  /* =================== add collateral states ======================= */

  const [transWithdrawLoan, setTransWithdrawLoan] = useState("");
  const [transSwapLoanToSecondary, setTransSwapLoanToSecondary] = useState("");

  const withdrawLoanTransactionReceipt = useTransactionReceipt({
    hash: transWithdrawLoan,
    watch: true,
  });
  const swapLoanToSecondaryTransactionReceipt = useTransactionReceipt({
    hash: transSwapLoanToSecondary,
    watch: true,
  });

  function getLoan(loanId: any) {
    for (let i = 0; i < activeLoansData.length; ++i) {
      if (loanId == activeLoansData[i].loanId) {
        return activeLoansData[i];
      }
    }
    return {
      loanMarket: "NA",
    };
  }
  useEffect(() => {
    // console.log(
    //   "withdraw tx receipt",
    //   withdrawLoanTransactionReceipt.data?.transaction_hash,
    //   withdrawLoanTransactionReceipt
    // );
    TxToastManager.handleTxToast(
      withdrawLoanTransactionReceipt,
      `Withdraw partial ${getLoan(loanId).loanMarket} loan`
    );
  }, [withdrawLoanTransactionReceipt]);

  useEffect(() => {
    // console.log(
    //   "swap loan tx receipt",
    //   swapLoanToSecondaryTransactionReceipt.data?.transaction_hash,
    //   swapLoanToSecondaryTransactionReceipt
    // );
    TxToastManager.handleTxToast(
      swapLoanToSecondaryTransactionReceipt,
      `Swap ${getLoan(loanId).loanMarket} Loan`
    );
  }, [swapLoanToSecondaryTransactionReceipt]);

  const [historicalAPRs, setHistoricalAPRs] = useState();

  useEffect(() => {
    OffchainAPI.getHistoricalBorrowRates().then((val) => {
      setHistoricalAPRs(val);
      console.log(val);
    });
  }, []);

  /* =================== add collateral states ======================= */
  const [inputVal1, setInputVal1] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const toggleCustoms = (tab: string) => {
    if (customActiveTabs !== tab) {
      setCustomActiveTabs(tab);
    }
  };
  function tog_repay_active_loan() {
    setCollateralActiveLoan(false);
    setReapyActiveLoan(true);
    setWithdrawActiveLoan(false);
    setSwapToActiveLoan(false);
    setSwapActiveLoan(false);
    removeBodyCss();
  }

  function tog_add_collateral() {
    setmodal_add_collateral(!modal_add_collateral);
    removeBodyCss();
  }
  function tog_collateral_active_loan() {
    setCollateralActiveLoan(true);
    setReapyActiveLoan(false);
    setWithdrawActiveLoan(false);
    setSwapToActiveLoan(false);
    setSwapActiveLoan(false);
    //setmodal_add_active_deposit(false)
    removeBodyCss();
  }

  function tog_withdraw_active_loan() {
    setCollateralActiveLoan(false);
    setReapyActiveLoan(false);
    setWithdrawActiveLoan(true);
    setSwapToActiveLoan(false);
    setSwapActiveLoan(false);
    //setmodal_add_active_deposit(false)
    removeBodyCss();
  }
  const toggleLoanAction = (tab: string) => {
    if (loanActionTab !== tab) {
      setLoanActionTab(tab);
    }
  };

  function tog_swap_active_loan() {
    setCollateralActiveLoan(false);
    setReapyActiveLoan(false);
    setWithdrawActiveLoan(true);
    setSwapToActiveLoan(false);

    setSwapActiveLoan(true);
    //setmodal_add_active_deposit(false)
    removeBodyCss();
  }
  function tog_swap_to_active_loan() {
    setCollateralActiveLoan(false);
    setReapyActiveLoan(false);
    setWithdrawActiveLoan(false);
    setSwapToActiveLoan(true);
    setSwapActiveLoan(false);
    //setmodal_add_active_deposit(false)
    removeBodyCss();
  }
  const handleSwapOptionChange = (e: any) => {
    setSwapOption(e.target.value);
  };

  // add collateral
  const [marketToAddCollateral, setMarketToAddCollateral] = useState("");
  const [loanId, setLoanId] = useState<number>();

  // repay
  const [loanMarket, setLoanMarket] = useState("");
  const [commitmentPeriod, setCommitmentPeriod] = useState();

  // swap to market
  const [swapMarket, setSwapMarket] = useState("");
  const [swapIsSet, setSwapIsSet] = useState(false);
  /* ============================== Add Colateral ============================ */
  // Approve amount
  const {
    data: dataApprove,
    loading: loadingApprove,
    error: errorApprove,
    reset: resetApprove,
    execute: approve,
  } = useStarknetExecute({
    calls: {
      contractAddress: tokenAddressMap[marketToAddCollateral] as string,
      entrypoint: "approve",
      calldata: [diamondAddress, NumToBN(inputVal1 as number, 18), 0],
    },
  });
  // Adding collateral

  /* ============================== Withdraw Loan ============================ */
  const {
    data: dataWithdraw,
    loading: loadingWithdraw,
    error: errorWithdraw,
    reset: resetWithdraw,
    execute: executeWithdraw,
  } = useStarknetExecute({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "withdraw_partial_loan",
      calldata: [loanId, NumToBN(inputVal1 as number, 18), 0],
    },
  });
  /* ============================== Swap To Secondary Market ============================ */
  const {
    data: dataSwapToMarket,
    loading: loadingSwapToMarket,
    error: errorSwapToMarket,
    reset: resetSwapToMarket,
    execute: executeSwapToMarket,
  } = useStarknetExecute({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "swap_loan_market_to_secondary",
      calldata: [loanId, swapMarket],
    },
  });

  const handleWithdrawLoan = async (asset: any) => {
    if (asset.isSwapped) {
      toast.error(`${GetErrorText(`Cannot withdraw swapped loan`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }

    if (!inputVal1 && !loanId && !diamondAddress) {
      console.log("error");
      return;
    }
    console.log(diamondAddress, loanId, inputVal1);

    await executeWithdraw();
    if (errorWithdraw) {
      toast.error(`${GetErrorText(`Withdraw ${asset.loanMarket} failed`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
    }
  };

  const handleSwap = async () => {
    console.log(swapMarket, " ", loanId, " ", diamondAddress);
    if (!swapMarket && !loanId && !diamondAddress) {
      console.log("error");
      return;
    }

    await executeSwapToMarket();
    if (errorSwapToMarket) {
      console.log(errorSwapToMarket);
      toast.error(`${GetErrorText(`Swap to ${swapMarket} failed`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
    }
  };

  const handleMax = async (
    _collateralAmount: any,
    _loanAmount: any,
    loanMarket: any,
    collateralMarket: string
  ) => {
    setLoading(true);
    const collateralAmount: any = parseFloat(
      BNtoNum(Number(_collateralAmount))
    ).toFixed(6);
    const loanAmount: any = parseFloat(BNtoNum(Number(_loanAmount))).toFixed(6);

    const loanPrice = await getPrice(loanMarket);
    const collateralPrice = await getPrice(collateralMarket);

    const totalLoanPriceUSD = loanAmount * loanPrice;
    const totalCollateralPrice = collateralAmount * collateralPrice;
    const maxPermisableUSD = (70 / 100) * totalCollateralPrice;
    const maxPermisableWithdrawal = maxPermisableUSD / loanPrice;

    setInputVal1(maxPermisableWithdrawal);
    // console.log("max loan withdrawal", maxPermisableWithdrawal);
    setLoading(false);
  };

  return (
    <div className="table-responsive  mt-3" style={{ overflow: "hidden" }}>
      <Table className="table table-nowrap align-middle mb-0">
        <thead>
          <tr>
            <th scope="col"> &nbsp; &nbsp; &nbsp; Borrow Market</th>
            <th scope="col"> &nbsp; &nbsp; &nbsp;Interest</th>
            <th scope="col"> &nbsp; &nbsp; &nbsp;Collateral</th>
            <th scope="col"> &nbsp; &nbsp; &nbsp;Current Balance</th>
            <th scope="col"> &nbsp; &nbsp; &nbsp;Commitment</th>
            {/* <th scope="col" colSpan={2}>Interest</th> */}
          </tr>
        </thead>
      </Table>
      {Array.isArray(activeLoansData) && activeLoansData.length > 0 ? (
        activeLoansData.map((asset, key) => {
          return (
            <ActiveLoan
              asset={asset}
              historicalAPRs={historicalAPRs}
              key={key}
              customActiveTabs={customActiveTabs}
              loanActionTab={loanActionTab}
              toggleLoanAction={toggleLoanAction}
              account={account}
              tog_collateral_active_loan={tog_collateral_active_loan}
              collateral_active_loan={collateral_active_loan}
              repay_active_loan={repay_active_loan}
              tog_repay_active_loan={tog_repay_active_loan}
              withdraw_active_loan={withdraw_active_loan}
              tog_withdraw_active_loan={tog_withdraw_active_loan}
              swap_active_loan={swap_active_loan}
              tog_swap_active_loan={tog_swap_active_loan}
              swap_to_active_loan={swap_to_active_loan}
              tog_swap_to_active_loan={tog_swap_to_active_loan}
              depositRequestSel={depositRequestSel}
              inputVal1={inputVal1}
              setInputVal1={setInputVal1}
              setLoanId={setLoanId}
              handleMax={handleMax}
              isLoading={isLoading}
              handleWithdrawLoanTransactionDone={
                handleWithdrawLoanTransactionDone
              }
              handleWithdrawLoan={handleWithdrawLoan}
              setSwapMarket={setSwapMarket}
              handleSwapTransactionDone={handleSwapTransactionDone}
              handleSwap={handleSwap}
              setAddCollateralTransactionReceipt={
                setAddCollateralTransactionReceipt
              }
              setRepayTransactionReceipt={setRepayTransactionReceipt}
              withdrawLoanTransactionReceipt={withdrawLoanTransactionReceipt}
              swapLoanToSecondaryTransactionReceipt={
                swapLoanToSecondaryTransactionReceipt
              }
              setRevertSwapTransactionReceipt={setRevertSwapTransactionReceipt}
              repayTransactionReceipt={repayTransactionReceipt}
              addCollateralTransactionReceipt={addCollateralTransactionReceipt}
              revertSwapTransactionReceipt={revertSwapTransactionReceipt}
            />
          );
        })
      ) : (
        <Table>
          <tbody>
            <tr>
              <td colSpan={5}>No Records Found.</td>
            </tr>
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ActiveLoansTab;
