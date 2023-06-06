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

const useRemoveLiquidity = (loanIdParam: number, integrationAddress: any, minTokenRec: any) => {
    const [loanId, setLoanId] = useState<number>(loanIdParam);

    const { address: account } = useAccount();
    const [transApprove, setTransApprove] = useState("");
    const [transRepayHash, setTransRepayHash] = useState("");
    const [transRemoveLiquidityHash, setIsRemoveLiquidityHash] = useState("");

    const repayTransactionReceipt = useWaitForTransaction({
        hash: transRepayHash,
        watch: true,
    });

    const selfLiquidateTransactionReceipt = useWaitForTransaction({
        hash: transRemoveLiquidityHash,
        watch: true,
    });

    const {
        data: dataRemoveLiquidity,
        error: errorRemoveLiquidity,
        reset: resetRemoveLiquidity,
        write: writeRemoveLiquidity,
        writeAsync: writeAsyncRemoveLiquidity,
        isError: isErrorRemoveLiquidity,
        isIdle: isIdleRemoveLiquidity,
        isLoading: isLoadingRemoveLiquidity,
        isSuccess: isSuccessRemoveLiquidity,
        status: statusRemoveLiquidity,
    } = useContractWrite({
        calls: [
            {
                contractAddress: diamondAddress,
                entrypoint: "remove_liquidity_revert_spend",
                calldata: [
                    integrationAddress,
                    loanId,
                    minTokenRec
                ],
            },
        ],
    });

    return {
        dataRemoveLiquidity,
        errorRemoveLiquidity,
        resetRemoveLiquidity,
        writeRemoveLiquidity,
        writeAsyncRemoveLiquidity,
        isErrorRemoveLiquidity,
        isIdleRemoveLiquidity,
        isLoadingRemoveLiquidity,
        isSuccessRemoveLiquidity,
        statusRemoveLiquidity,
    };
};

export default useRemoveLiquidity;
