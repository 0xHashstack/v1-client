import { NativeToken } from "@/Blockchain/interfaces/interfaces";
import { faucetAddress } from "@/Blockchain/stark-constants";
import { tokenAddressMap } from "@/Blockchain/utils/addressServices";
import { useContractWrite } from "@starknet-react/core";
import { useState } from "react";

const useGetTokens = (tokenParam: NativeToken = "BTC") => {
  const [token, setToken] = useState<NativeToken>(tokenParam);

  const {
    data: dataGetTokens,
    error: errorGetTokens,
    reset: resetGetTokens,
    write: writeGetTokens,
    writeAsync: writeAsyncGetTokens,
    isError: isErrorGetTokens,
    isIdle: isIdleGetTokens,
    isLoading: isLoadingGetTokens,
    isSuccess: isSuccessGetTokens,
    status: statusGetTokens,
  } = useContractWrite({
    calls: {
      contractAddress: faucetAddress,
      entrypoint: "get_tokens",
      calldata: [tokenAddressMap[token]],
    },
  });

  return {
    token,
    setToken,

    dataGetTokens,
    errorGetTokens,
    resetGetTokens,
    writeGetTokens,
    writeAsyncGetTokens,
    isErrorGetTokens,
    isIdleGetTokens,
    isLoadingGetTokens,
    isSuccessGetTokens,
    statusGetTokens,
  };
};

export default useGetTokens;
