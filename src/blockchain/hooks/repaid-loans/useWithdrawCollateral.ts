import { useStarknetExecute } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { GetErrorText, NumToBN } from "../../utils";

const useWithdrawCollateral = (_diamondAddress: string, _loanId: number) => {
  const [diamondAddress, setDiamondAddress] = useState("");
  const [loanId, setLoanId] = useState<number>();
  useEffect(() => {
    setDiamondAddress(_diamondAddress);
    setLoanId(_loanId);
  });
  const initWithdrawDeposit = () => {};

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
    console.log(`${loanId} ${diamondAddress}`);
    await executeWithdrawCollateral();
    if (error) {
      toast.error(`${GetErrorText(`Couldn't withdaw Collateral`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    } else {
      toast.success(`Collteral Withdrawn!`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
    }
  };

  return {
    withdrawCollateral,
  };
};

export default useWithdrawCollateral;
