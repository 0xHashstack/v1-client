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

const useRevertSwapSpend = (loanIdParam: number) => {
    const [loanId, setLoanId] = useState<number>(loanIdParam);

    const { address: account } = useAccount();
    const [transRevertSwapSpendHash, setIsRevertSwapSpendHash] = useState("");

    const swapSpendTransactionReceipt = useWaitForTransaction({
        hash: transRevertSwapSpendHash,
        watch: true,
    });

    const {
        data: dataRevertSwapSpend,
        error: errorRevertSwapSpend,
        reset: resetRevertSwapSpend,
        write: writeRevertSwapSpend,
        writeAsync: writeAsyncRevertSwapSpend,
        isError: isErrorRevertSwapSpend,
        isIdle: isIdleRevertSwapSpend,
        isLoading: isLoadingRevertSwapSpend,
        isSuccess: isSuccessRevertSwapSpend,
        status: statusRevertSwapSpend,
    } = useContractWrite({
        calls: [
            {
                contractAddress: diamondAddress,
                entrypoint: "swap_revert_spend",
                calldata: [
                    loanId,
                ],
            },
        ],
    });

    return {
        dataRevertSwapSpend,
        errorRevertSwapSpend,
        resetRevertSwapSpend,
        writeRevertSwapSpend,
        writeAsyncRevertSwapSpend,
        isErrorRevertSwapSpend,
        isIdleRevertSwapSpend,
        isLoadingRevertSwapSpend,
        isSuccessRevertSwapSpend,
        statusRevertSwapSpend
    };
};

export default useRevertSwapSpend;
