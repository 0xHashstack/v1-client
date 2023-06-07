import { ERC20Abi } from "@/Blockchain/stark-constants";
import { useAccount, useContractRead } from "@starknet-react/core";
import { useState } from "react";

const useBalanceOf = ( asset: string) => {
    const { address: accountAddress } = useAccount();
    console.log("dataaaa balance of", asset, accountAddress)
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
        args: ["0x0465e14a806a77cd284873e17b9f067400d90b8169cbd8bcac6430805ca87f69"],
        watch: false,
    })

  return {
    dataBalanceOf,
    errorBalanceOf,
    isFetchingBalanceOf,
    refetchBalanceOf,
    statusBalanceOf,
  };
};

export default useBalanceOf;
