import {
  useConnectors,
  useStarknet,
  useStarknetExecute,
} from "@starknet-react/core";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { number } from "starknet";
import { tokenAddressMap, tokenDecimalsMap } from "../../stark-constants";
import { GetErrorText, NumToBN } from "../../utils";

const useWithdrawDeposit = (
  asset: any,
  diamondAddress: string,
) => {
  const [withdrawAmount, setWithdrawAmount] = useState<number>();
  const [transWithdraw, setTransWithdraw] = useState('');

  const {
    data: dataWithdrawDeposit,
    loading: loadingWithdrawDeposit,
    error: errorWithdrawDeposit,
    reset: resetWithdrawDeposit,
    execute: executeWithdrawDep,
  } = useStarknetExecute({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "withdraw_deposit",
      calldata: [asset.depositId, NumToBN(withdrawAmount as number, tokenDecimalsMap[asset.market]), 0],
    },
  });

  const handleWithdrawDeposit = async () => {
    console.log(`${withdrawAmount} ${asset.depositId} ${diamondAddress}`);
    try {
      const val = await executeWithdrawDep();
      setTransWithdraw(val.transaction_hash);
    } catch(err) {
      console.log(err, 'withdraw deposit')
    }
    if (errorWithdrawDeposit) {
      toast.error(`${GetErrorText(`Withdraw for ID:${asset.depositId} failed`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
  };

  return {
    handleWithdrawDeposit,
    setWithdrawAmount,
    withdrawAmount,
    transWithdraw,
    executeWithdrawDep,
    loadingWithdrawDeposit,
    errorWithdrawDeposit,
  };
};

export default useWithdrawDeposit;
