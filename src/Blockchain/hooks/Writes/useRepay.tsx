import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "@starknet-react/core";
import { useEffect, useState } from "react";
import { Abi, uint256 } from "starknet";
import { ERC20Abi, diamondAddress } from "../../stark-constants";
import { TxToastManager } from "../../tx-ToastManager";
import { etherToWeiBN, weiToEtherNumber } from "../../utils/utils";
import {
  tokenAddressMap,
  tokenDecimalsMap,
} from "@/Blockchain/utils/addressServices";
import { ILoan, Token } from "@/Blockchain/interfaces/interfaces";

const useRepay = (loanParam: any) => {
  const [repayAmount, setRepayAmount] = useState<number>(0);
  const [loan, setLoan] = useState<ILoan>(loanParam);
  const [allowanceVal, setAllowance] = useState(0);
  // console.log(repayAmount, "loan here", loanParam);

  const [transApprove, setTransApprove] = useState("");
  const [transRepayHash, setTransRepayHash] = useState("");
  const [transSelfLiquidateHash, setIsSelfLiquidateHash] = useState("");

  const repayTransactionReceipt = useWaitForTransaction({
    hash: transRepayHash,
    watch: true,
  });

  const selfLiquidateTransactionReceipt = useWaitForTransaction({
    hash: transSelfLiquidateHash,
    watch: true,
  });

  // useEffect(() => {
  //   TxToastManager.handleTxToast(
  //     repayTransactionReceipt,
  //     `Repay Loan ID ${loan?.loanId}`
  //   );
  // }, [repayTransactionReceipt]);

  // useEffect(() => {
  //   TxToastManager.handleTxToast(
  //     selfLiquidateTransactionReceipt,
  //     `Liquidate Loan ID ${loan?.loanId}`
  //   );
  // }, [selfLiquidateTransactionReceipt]);

  const {
    data: dataRepay,
    error: errorRepay,
    reset: resetRepay,
    write: writeRepay,
    writeAsync: writeAsyncRepay,
    isError: isErrorRepay,
    isIdle: isIdleRepay,
    isLoading: isLoadingRepay,
    isSuccess: isSuccessRepay,
    status: statusRepay,
  } = useContractWrite({
    calls: [
      {
        contractAddress: loan?.underlyingMarketAddress as string,
        entrypoint: "approve",
        calldata: [
          diamondAddress,
          etherToWeiBN(
            repayAmount as number,
            loan?.underlyingMarket as Token
          ).toString(),
          0,
        ],
      },
      {
        contractAddress: diamondAddress,
        entrypoint: "repay_loan",
        calldata: [
          loan?.loanId,
          etherToWeiBN(
            repayAmount as number,
            loan?.underlyingMarket as Token
          ).toString(),
          0,
        ],
      },
    ],
  });

  const {
    data: dataSelfLiquidate,
    error: errorSelfLiquidate,
    reset: resetSelfLiquidate,
    write: writeSelfLiquidate,
    writeAsync: writeAsyncSelfLiquidate,
    isError: isErrorSelfLiquidate,
    isIdle: isIdleSelfLiquidate,
    isLoading: isLoadingSelfLiquidate,
    isSuccess: isSuccessSelfLiquidate,
    status: statusSelfLiquidate,
  } = useContractWrite({
    calls: [
      {
        contractAddress: diamondAddress,
        entrypoint: "repay_loan",
        calldata: [loan?.loanId, 0, 0],
      },
    ],
  });

  const handleRepayBorrow = async () => {
    if (!repayAmount && loan?.loanId! && !diamondAddress) {
      return;
    }
    // if (!repayAmount || repayAmount < 0) {
    if (!repayAmount || repayAmount < 0) {
      return;
    }
    try {
      const val = await writeAsyncRepay();
      setTransRepayHash(val?.transaction_hash);
      const toastParamValue = {
        success: true,
        heading: "Success",
        desc: "Copy the Transaction Hash",
        textToCopy: val.transaction_hash,
      };
    } catch (err) {
      // console.log(err, "err repay");
      const toastParamValue = {
        success: false,
        heading: "Repay Transaction Failed",
        desc: "Copy the error",
        textToCopy: err,
      };
      return;
    }
  };

  return {
    repayAmount,
    setRepayAmount,
    // handleApprove,
    writeAsyncRepay,
    transRepayHash,
    setTransRepayHash,
    repayTransactionReceipt,
    isLoadingRepay,
    errorRepay,
    handleRepayBorrow,

    //SelfLiquidate - Repay with 0 amount
    writeAsyncSelfLiquidate,
    isLoadingSelfLiquidate,
    errorSelfLiquidate,
    selfLiquidateTransactionReceipt,
    setIsSelfLiquidateHash,
  };
};

export default useRepay;
