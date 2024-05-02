import { useWaitForTransaction } from '@starknet-react/core';

function useTransactionStatus  ({transactionHash}:{transactionHash:string})  {
  const {
        data,
        error,
        isLoading,
        isError,
        isSuccess,
        isPending,
        
      } = useWaitForTransaction({
        hash:transactionHash ? transactionHash:"",
        watch: true,
        enabled:true,
        refetchInterval:4000,
        retry:true,
        retryDelay:4000,
      });
  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
    isPending
  }
}

export default useTransactionStatus