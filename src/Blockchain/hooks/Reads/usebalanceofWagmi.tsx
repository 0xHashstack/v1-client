import { useAccount, useBalance } from "wagmi";
const useBalanceofWagmi = (asset: string) => {
    const { address: accountAddress } = useAccount();
    ////console.log("dataaaa balance of", asset, accountAddress)
    const {
      data: dataBalanceOf,

      error: errorBalanceOf,

      isLoading: isLoadingBalanceOf,
      isSuccess: isSuccessBalanceOf,
      isFetching: isFetchingBalanceOf,
      refetch: refetchBalanceOf,
      status: statusBalanceOf,
    } = useBalance({
        address: accountAddress,
        token:asset as any,
      })

  return {
    dataBalanceOf,
    errorBalanceOf,
    isFetchingBalanceOf,
    refetchBalanceOf,
    statusBalanceOf,
  };
};

export default useBalanceofWagmi;
