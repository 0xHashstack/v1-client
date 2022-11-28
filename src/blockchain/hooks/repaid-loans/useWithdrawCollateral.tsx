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

	const withdrawCollateralTransactionReceipt = useTransactionReceipt({hash: transWithdrawCollateral, watch: true})


	useEffect(() => {
		console.log('withdraw col tx receipt', withdrawCollateralTransactionReceipt.data?.transaction_hash, withdrawCollateralTransactionReceipt);
		TxToastManager.handleTxToast(withdrawCollateralTransactionReceipt, `Withdraw collateral`, true)
	}, [withdrawCollateralTransactionReceipt])

  const {
    data,
    loading,
    error,
    reset,
    execute: executeWithdrawCollateral,
  } = useStarknetExecute({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "withdraw_collateral",
      calldata: [loanId],
    },
  });

  const withdrawCollateral = async () => {
    if (loanId === undefined && !diamondAddress) {
      toast.error(`${GetErrorText(`Some inputs missing`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
    console.log(`${loanId} ${diamondAddress}`);
    try {
      const val = await executeWithdrawCollateral();
      setTransWithdrawCollateral(val.transaction_hash);
    } catch(err) {
      console.log(err, 'withdraw collateral')
    }
  };

  return {
    withdrawCollateral,
  };
};

export default useWithdrawCollateral;
