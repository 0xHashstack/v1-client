import { RToken } from "@/Blockchain/interfaces/interfaces";
import { diamondAddress } from "@/Blockchain/stark-constants";
import { tokenAddressMap } from "@/Blockchain/utils/addressServices";
import { etherToWeiBN } from "@/Blockchain/utils/utils";
import { useAccount, useContractWrite } from "@starknet-react/core";
import React, { useState } from "react";

const useWithdrawStake = () => {
  const [unstakeRToken, setUnstakeRToken] = useState<RToken>("rBTC");
  const [rTokenToWithdraw, setRTokenToWithdraw] = useState<number>(0);
  const { address: owner } = useAccount();

  const {
    data: dataWithdrawStake,
    error: errorWithdrawStake,
    reset: resetWithdrawStake,
    write: writeWithdrawStake,
    writeAsync: writeAsyncWithdrawStake,
    isError: isErrorWithdrawStake,
    isIdle: isIdleWithdrawStake,
    isSuccess: isSuccessWithdrawStake,
    status: statusWithdrawStake,
  } = useContractWrite({
    calls: [{
      contractAddress: diamondAddress,
      entrypoint: "withdraw_stake",
      calldata: [
        tokenAddressMap[unstakeRToken],
        owner,
        etherToWeiBN(rTokenToWithdraw, unstakeRToken).toString(),
        "0",
      ],
    }],
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
    isSuccessWithdrawStake,
    statusWithdrawStake,
  };
};

export default useWithdrawStake;
