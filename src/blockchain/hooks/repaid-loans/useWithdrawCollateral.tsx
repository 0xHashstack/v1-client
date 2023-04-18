import { useStarknetExecute, useTransactionReceipt } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TxToastManager } from "../../txToastManager";
import { GetErrorText, NumToBN } from "../../utils";

const useWithdrawCollateral = (_diamondAddress: string, _loanId: number) => {
  const [diamondAddress, setDiamondAddress] = useState("");
  const [loanId, setLoanId] = useState<number>();
  useEffect(() => {
    setDiamondAddress(_diamondAddress);
    setLoanId(_loanId);
  }, [_diamondAddress, _loanId]);

  const [transWithdrawCollateral, setTransWithdrawCollateral] = useState('');

  const withdrawCollateralTransactionReceipt = useTransactionReceipt({ hash: transWithdrawCollateral, watch: true })


  useEffect(() => {
    // console.log('withdraw col tx receipt', withdrawCollateralTransactionReceipt.data?.transaction_hash, withdrawCollateralTransactionReceipt);
    TxToastManager.handleTxToast(withdrawCollateralTransactionReceipt, `Withdraw collateral`, true)
  }, [withdrawCollateralTransactionReceipt])

  const {
    data: dataWithdrawCollateral,
    loading: loadingWithdrawCollateral,
    error: errorWithdrawCollateral,
    reset: resetWithdrawCollateral,
    execute: executeWithdrawCollateral,
  } = useStarknetExecute({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "withdraw_collateral",
      calldata: [loanId],
    },
  });

  return {
    executeWithdrawCollateral,
    loadingWithdrawCollateral,
    errorWithdrawCollateral,
    withdrawCollateralTransactionReceipt, 
    setTransWithdrawCollateral
  };
};

export default useWithdrawCollateral;
