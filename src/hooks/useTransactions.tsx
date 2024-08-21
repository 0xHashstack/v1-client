import React, { useState } from 'react';
import { useWaitForTransaction } from '@starknet-react/core';
import useTransactionStatus from './useTransactionStatus';
import { useDispatch, useSelector } from 'react-redux';
import { selectProtocolNetworkSelected } from '@/store/slices/readDataSlice';

const useTransactions = ({ hashes=[] }: { hashes?: string[] }) => {
    // const [status, setStatus] = useState([{}])
    const dispatch=useDispatch();
        const array=[];
        const protocolNetwork=useSelector(selectProtocolNetworkSelected)
        const status = [useTransactionStatus({ transactionHash:hashes[hashes.length-1] ,protocolNetwork:protocolNetwork})]
        // Dispatching an action to update transactionsData in Redux store
        // dispatch(setTransactionsData(updatedTransactionsData));
        // dispatch(updatedTransactionsData);
        return status;
        
        // const transactionStatuses = hashes.map((transactionHash: string) => {
        //   const status = useTransactionStatus({ transactionHash:transactionHash || "" });
        // });
        // return transactionStatuses;

};

export default useTransactions;
