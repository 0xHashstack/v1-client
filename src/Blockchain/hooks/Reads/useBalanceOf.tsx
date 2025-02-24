import { ERC20Abi } from "@/Blockchain/stark-constants";
import { useAccount, useContractRead } from "@starknet-react/core";
import { useMemo } from 'react';
const useBalanceOf = (asset: string) => {
    const { address: accountAddress } = useAccount();
    
    // Memoize the contract config to prevent unnecessary re-renders
    const contractConfig = useMemo(() => ({
      functionName: "balanceOf",
      args: [accountAddress as string],
      address: asset,
      abi: ERC20Abi,
      watch: false,
      // Add caching configuration
      cacheTime: 30000, // Cache for 30 seconds
      staleTime: 10000, // Consider data stale after 10 seconds
    }), [accountAddress, asset]);

    const {
      data: dataBalanceOf,
      error: errorBalanceOf,
      isLoading: isLoadingBalanceOf,
      isSuccess: isSuccessBalanceOf,
      isFetching: isFetchingBalanceOf,
      refetch: refetchBalanceOf,
      status: statusBalanceOf,
    } = useContractRead(contractConfig)

  return {
    dataBalanceOf,
    errorBalanceOf,
    isFetchingBalanceOf,
    refetchBalanceOf,
    statusBalanceOf,
  };
};

export default useBalanceOf;
