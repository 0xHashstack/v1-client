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
      });
      if (!data) {
        return undefined;
      }
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