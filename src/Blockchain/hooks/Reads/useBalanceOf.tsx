import { ERC20Abi } from "../../stark-constants";
import { useAccount, useContractRead } from "@starknet-react/core";
import { useState } from "react";

const useBalanceOf = (asset: string) => {
  const { address: accountAddress } = useAccount();
  const {
    data: dataBalanceOf,

    error: errorBalanceOf,
    isIdle: isIdleBalanceOf,

    isLoading: isLoadingBalanceOf,
    isSuccess: isSuccessBalanceOf,
    isFetching: isFetchingBalanceOf,
    refetch: refetchBalanceOf,
    status: statusBalanceOf,
  } = useContractRead({
    address: asset,
    abi: ERC20Abi,
    functionName: "balanceOf",
    // args: ["0x465e14a806a77cd284873e17b9f067400d90b8169cbd8bcac6430805ca87f69"],
    args: [accountAddress],
  });

  return {
    dataBalanceOf,
    errorBalanceOf,
    isFetchingBalanceOf,
    refetchBalanceOf,
    statusBalanceOf,
  };
};

export default useBalanceOf;
