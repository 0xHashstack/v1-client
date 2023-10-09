import { ERC20Abi } from "@/Blockchain/stark-constants";
import { useAccount, useContractRead } from "@starknet-react/core";
import { useState } from "react";
const useBalanceOf = (asset: string) => {
    const { address: accountAddress } = useAccount();
    // console.log("dataaaa balance of", asset, accountAddress)
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
      args: ["0x5970da1011e2f8dc15bc12fc1b0eb8e382300a334de06ad17d1404384b168e4"],
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
