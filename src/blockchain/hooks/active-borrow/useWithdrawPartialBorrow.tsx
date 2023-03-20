import { useAccount, useStarknetExecute, useTransactionReceipt } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { Abi, uint256 } from "starknet";
import { ERC20Abi, tokenDecimalsMap } from "../../stark-constants";
import { NumToBN } from "../../utils";
import { etherToWeiBN } from "../../utils";
import { tokenAddressMap } from "../../stark-constants";
import { TxToastManager } from "../../txToastManager";

const useWithdrawPartialBorrow = (asset: any, diamondAddress: string) => {
  const [partialWithdrawAmount, setPartialWithdrawAmount] = useState<number>();
  const [loanId, setLoanId] = useState<number>(asset.loanId);

  const [transWithdrawPartialBorrowHash, setTransWithdrawPartialBorrowHash] = useState("");

  const partialWithdrawTransReceipt = useTransactionReceipt({
    hash: transWithdrawPartialBorrowHash,
    watch: true
  })

  useEffect(() => {
    TxToastManager.handleTxToast(
      partialWithdrawTransReceipt,
      `Withdraw Partial Borrow: ${asset?.loanId}`,
      true
    );
  }, [partialWithdrawTransReceipt]);

  const {
    data: dataWithdrawPartialBorrow,
    loading: loadingWithdrawPartialBorrow,
    error: errorWithdrawPartialBorrow,
    reset: resetWithdrawPartialBorrow,
    execute: executeWithdrawPartialBorrow,
  } = useStarknetExecute({
    calls:
    {
      contractAddress: diamondAddress,
      entrypoint: "withdraw_partial_loan",
      calldata: [
        loanId,
        etherToWeiBN(partialWithdrawAmount as number, tokenAddressMap[asset.loanMarket] || "").toString(),
        0,
      ],
    }
  });

  return {
    partialWithdrawAmount,
    setPartialWithdrawAmount,
    executeWithdrawPartialBorrow,
    transWithdrawPartialBorrowHash,
    setTransWithdrawPartialBorrowHash,
    partialWithdrawTransReceipt,
    loadingWithdrawPartialBorrow,
  };
}

export default useWithdrawPartialBorrow;
