import { AnyAction } from '@reduxjs/toolkit';
import { useWaitForTransaction } from '@starknet-react/core';
import { useWaitForTransactionReceipt } from 'wagmi';

function useTransactionStatus  ({transactionHash,protocolNetwork}:{transactionHash:string | undefined,protocolNetwork:string})  {
  let walletConnected: string | null = null;
  if (typeof window !== "undefined") {
    walletConnected = localStorage.getItem("lastUsedConnector");
  }
  if(walletConnected===''){
    return;
  }
  const {
        data,
        error,
        isLoading,
        isError,
        isSuccess,
        isPending,

      } =walletConnected!=='MetaMask'?  useWaitForTransaction({
        hash:transactionHash ? transactionHash:"",
        watch: true,
        enabled:true,
        refetchInterval:4000,
        retry:true,
        retryDelay:4000,
      }):useWaitForTransactionReceipt({  
        hash:`0x${transactionHash?.slice(2)}`,
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