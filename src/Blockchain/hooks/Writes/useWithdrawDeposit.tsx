import { diamondAddress } from "@/Blockchain/stark-constants";
import { useAccount, useContractWrite } from "@starknet-react/core";
import React, { useState } from "react";

const useWithdrawDeposit = (rTokenShares: Number, asset: any) => {
  //   const [asset, setAsset] = useState("");
  //   const [rTokenShares, setRTokenShares] = useState(0);
  const { address: owner } = useAccount();

  const [reciever, setReciever] = useState(owner);

  const {
    data: dataWithdrawDeposit,
    error: errorWithdrawDeposit,
    reset: resetWithdrawDeposit,
    write: writeWithdrawDeposit,
    writeAsync: writeAsyncWithdrawDeposit,
    isError: isErrorWithdrawDeposit,
    isIdle: isIdleWithdrawDeposit,
    isLoading: isLoadingWithdrawDeposit,
    isSuccess: isSuccessWithdrawDeposit,
    status: statusWithdrawDeposit,
  } = useContractWrite({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "withdraw_deposit",
      calldata: [asset, rTokenShares, reciever, owner],
    },
  });

  return {
    // asset,
    // setAsset,
    // rTokenShares,
    // setRTokenShares,
    reciever,
    setReciever,

    dataWithdrawDeposit,
    errorWithdrawDeposit,
    resetWithdrawDeposit,
    writeWithdrawDeposit,
    writeAsyncWithdrawDeposit,
    isErrorWithdrawDeposit,
    isIdleWithdrawDeposit,
    isLoadingWithdrawDeposit,
    isSuccessWithdrawDeposit,
    statusWithdrawDeposit,
  };
};

export default useWithdrawDeposit;
