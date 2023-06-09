import { diamondAddress } from "@/Blockchain/stark-constants";
import {
    useAccount,
    useContractWrite
} from "@starknet-react/core"
import { useState } from "react";

const useStakeRequest = () => {
    const [rToken, setRToken] = useState("")
    const [rTokenAmount, setRTokenAmount] = useState(0)
    const { address: owner } = useAccount();
    const [reciever, setReciever] = useState(owner)

    const {
        data: dataStakeRequest,
        error: errorStakeRequest,
        reset: resetStakeRequest,
        write: writeStakeRequest,
        writeAsync: writeAsyncStakeRequest,
        isError: isErrorStakeRequest,
        isIdle: isIdleStakeRequest,
        isLoading: isLoadingStakeRequest,
        isSuccess: isSuccessStakeRequest,
        status: statusStakeRequest,
    } = useContractWrite({
        calls: {
            contractAddress: diamondAddress,
            entrypoint: "stake_request",
            calldata: [
                rToken,
                rTokenAmount,
                reciever,
            ]
        }
    })

    return {
        rToken,
        setRToken,
        rTokenAmount,
        setRTokenAmount,
        reciever,
        setReciever,
        dataStakeRequest,
        errorStakeRequest,
        resetStakeRequest,
        writeStakeRequest,
        writeAsyncStakeRequest,
        isErrorStakeRequest,
        isIdleStakeRequest,
        isLoadingStakeRequest,
        isSuccessStakeRequest,
        statusStakeRequest,
    }
}

export default useStakeRequest