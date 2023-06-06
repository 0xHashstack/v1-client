import { ERC20Abi } from "../../stark-constants";
import { useAccount,useContractRead } from "@starknet-react/core";
import { useState } from "react";

const useBalanceOf = ( asset: string) => {
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
        args: [accountAddress],
    })

    return {
        dataBalanceOf,
        errorBalanceOf,
        isFetchingBalanceOf,
        refetchBalanceOf,
        statusBalanceOf,
    };
}

export default useBalanceOf;