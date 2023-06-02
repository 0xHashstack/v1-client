import {
    AddressFromStarkNameArgs,
    useAccount,
    useContractRead,
    useContractWrite,
    useWaitForTransaction,
} from "@starknet-react/core";
import { useEffect, useState } from "react";
import { Abi, uint256 } from "starknet";
import {
    ERC20Abi,
    tokenAddressMap,
    diamondAddress
} from "../../stark-constants";
import { TxToastManager } from "../../tx-ToastManager";
import { etherToWeiBN, weiToEtherNumber } from "../../utils/utils";

const useSwapSpend = (loanIdParam: number, integrationAddress: any, minTokenRec: any) => {
    const [loanId, setLoanId] = useState<number>(loanIdParam);

    const { address: account } = useAccount();
    const [transSwapSpendHash, setIsSwapSpendHash] = useState("");

    const swapSpendTransactionReceipt = useWaitForTransaction({
        hash: transSwapSpendHash,
        watch: true,
    });

    const {
        data: dataSwapSpend,
        error: errorSwapSpend,
        reset: resetSwapSpend,
        write: writeSwapSpend,
        writeAsync: writeAsyncSwapSpend,
        isError: isErrorSwapSpend,
        isIdle: isIdleSwapSpend,
        isLoading: isLoadingSwapSpend,
        isSuccess: isSuccessSwapSpend,
        status: statusSwapSpend,
    } = useContractWrite({
        calls: [
            {
                contractAddress: diamondAddress,
                entrypoint: "swap_spend",
                calldata: [
                    integrationAddress,
                    loanId,
                    minTokenRec
                ],
            },
        ],
    });

    return {
        
    };
};

export default useSwapSpend;
