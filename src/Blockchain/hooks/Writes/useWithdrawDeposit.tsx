import { NativeToken } from "@/Blockchain/interfaces/interfaces";
import { diamondAddress } from "@/Blockchain/stark-constants";
import { tokenAddressMap } from "@/Blockchain/utils/addressServices";
import { etherToWeiBN } from "@/Blockchain/utils/utils";
import { useAccount, useContractWrite } from "@starknet-react/core";
import React, { useEffect, useState } from "react";

const useWithdrawDeposit = () => {
  const [asset, setAsset] = useState<NativeToken>("BTC");
  const [rTokenShares, setRTokenShares] = useState(0);
  const { address: owner } = useAccount();

  useEffect(() => {
    // console.log("withdrawing", asset, rTokenShares);
  }, [asset, rTokenShares]);

  // console.log(asset, rTokenShares);
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
      calldata: [
        tokenAddressMap[asset],
        etherToWeiBN(
          rTokenShares,
          asset
        ).toString(),
        "0",
        owner,
        owner
      ],
    },
  });

  return {
    asset,
    setAsset,
    rTokenShares,
    setRTokenShares,

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
