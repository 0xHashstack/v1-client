import { RToken } from "@/Blockchain/interfaces/interfaces";
import { diamondAddress } from "@/Blockchain/stark-constants";
import { tokenAddressMap } from "@/Blockchain/utils/addressServices";
import { etherToWeiBN } from "@/Blockchain/utils/utils";
import { useAccount, useContractWrite } from "@starknet-react/core";
import { useState } from "react";

const useStakeRequest = () => {
  const [rToken, setRToken] = useState<RToken>("rBTC");
  const [rTokenAmount, setRTokenAmount] = useState<number>(0);
  const { address: owner } = useAccount();
  // console.log("rToken stake request - ", rToken);

  const {
    data: dataStakeRequest,
    error: errorStakeRequest,
    reset: resetStakeRequest,
    write: writeStakeRequest,
    writeAsync: writeAsyncStakeRequest,
    isError: isErrorStakeRequest,
    isIdle: isIdleStakeRequest,
    isLoading: isLoadingStakeRequest,
    isSuccess: isSuccessStakeRequest,
    status: statusStakeRequest,
  } = useContractWrite({
    calls: [
      {
        contractAddress: tokenAddressMap[rToken] || "",
        entrypoint: "approve",
        calldata: [
          diamondAddress,
          etherToWeiBN(rTokenAmount, rToken).toString(),
          "0",
        ],
      },
      {
        contractAddress: diamondAddress,
        entrypoint: "stake_request",
        calldata: [
          tokenAddressMap[rToken] || "",
          etherToWeiBN(rTokenAmount, rToken).toString(),
          "0",
          owner,
        ],
      },
    ],
  });

  return {
    rToken,
    setRToken,
    rTokenAmount,
    setRTokenAmount,
    dataStakeRequest,
    errorStakeRequest,
    resetStakeRequest,
    writeStakeRequest,
    writeAsyncStakeRequest,
    isErrorStakeRequest,
    isIdleStakeRequest,
    isLoadingStakeRequest,
    isSuccessStakeRequest,
    statusStakeRequest,
  };
};

export default useStakeRequest;
