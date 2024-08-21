import { AnyAction } from '@reduxjs/toolkit';
import { useWaitForTransaction } from '@starknet-react/core';
import { useWaitForTransactionReceipt } from 'wagmi';

function useTransactionStatus  ({transactionHash,protocolNetwork}:{transactionHash:any,protocolNetwork:string})  {
  const {
        data,
        error,
        isLoading,
        isError,
        isSuccess,
        isPending,

      } =protocolNetwork==='Starknet'?  useWaitForTransaction({
        hash:transactionHash ? transactionHash:"",
        watch: true,
        enabled:true,
        refetchInterval:4000,
        retry:true,
        retryDelay:4000,
      }):useWaitForTransactionReceipt({
        hash:transactionHash ? transactionHash:"",
        retryCount:3,
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