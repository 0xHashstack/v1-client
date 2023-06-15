import { RToken } from "@/Blockchain/interfaces/interfaces";
import { diamondAddress } from "@/Blockchain/stark-constants";
import { tokenAddressMap } from "@/Blockchain/utils/addressServices";
import { etherToWeiBN } from "@/Blockchain/utils/utils";
import { useAccount, useContractWrite } from "@starknet-react/core";
import React, { useState } from "react";

const useWithdrawStake = () => {
  const [unstakeRToken, setUnstakeRToken] = useState<RToken>("rBTC");
  const [rTokenToWithdraw, setRTokenToWithdraw] = useState(0);
  const { address: owner } = useAccount();

  const {
    data: dataWithdrawStake,
    error: errorWithdrawStake,
    reset: resetWithdrawStake,
    write: writeWithdrawStake,
    writeAsync: writeAsyncWithdrawStake,
    isError: isErrorWithdrawStake,
    isIdle: isIdleWithdrawStake,
    isLoading: isLoadingWithdrawStake,
    isSuccess: isSuccessWithdrawStake,
    status: statusWithdrawStake,
  } = useContractWrite({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "withdraw_stake",
      calldata: [
        tokenAddressMap[unstakeRToken],
        owner,
      ],
    },
  });

  return {
    unstakeRToken,
    setUnstakeRToken,
    rTokenToWithdraw,
    setRTokenToWithdraw,
    dataWithdrawStake,
    errorWithdrawStake,
    resetWithdrawStake,
    writeWithdrawStake,
    writeAsyncWithdrawStake,
    isErrorWithdrawStake,
    isIdleWithdrawStake,
    isLoadingWithdrawStake,
    isSuccessWithdrawStake,
    statusWithdrawStake,
  };
};

export default useWithdrawStake;
