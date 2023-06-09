import { diamondAddress } from '@/Blockchain/stark-constants';
import { useAccount, useContractWrite } from '@starknet-react/core';
import React, { useState } from 'react'

const useWithdrawStake = () => {
    const [unstakeRToken, setUnstakeRToken] = useState("")
    const [rTokenToWithdraw, setRTokenToWithdraw] = useState(0)
    const { address: owner } = useAccount();

    const [reciever, setReciever] = useState(owner)


    const {
        data: dataWithdrawStake,
        error: errorWithdrawStake,
        reset: resetWithdrawStake,
        write: writeWithdrawStake,
        writeAsync: writeAsyncWithdrawStake,
        isError: isErrorWithdrawStake,
        isIdle: isIdleWithdrawStake,
        isLoading: isLoadingWithdrawStake,
        isSuccess: isSuccessWithdrawStake,
        status: statusWithdrawStake,
    } = useContractWrite({
        calls: {
            contractAddress: diamondAddress,
            entrypoint: "withdraw_stake",
            calldata: [
                unstakeRToken,
                rTokenToWithdraw,
                reciever,
            ]
        }
    })

    return {
        unstakeRToken,
        setUnstakeRToken,
        rTokenToWithdraw,
        setRTokenToWithdraw,
        reciever,
        setReciever, 
        dataWithdrawStake,
        errorWithdrawStake,
        resetWithdrawStake,
        writeWithdrawStake,
        writeAsyncWithdrawStake,
        isErrorWithdrawStake,
        isIdleWithdrawStake,
        isLoadingWithdrawStake,
        isSuccessWithdrawStake,
        statusWithdrawStake,
    }
}

export default useWithdrawStake