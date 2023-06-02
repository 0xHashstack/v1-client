import {
    useAccount,
    useContractRead,
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
import LoanAbi from "../../abis/dToken_abi.json";

const useGetUnderlyingAsset = () => {

    const { 
        data: dataUnderlyingAsset,
        error: errorUnderlyingAsset,
        isIdle: isIdleUnderlyingAsset,
        isLoading: loadingUnderlyingAsset,
        isSuccess: isSuccessUnderlyingAsset,
        isError: isErrorUnderlyingAsset,
        refetch: refetchUnderlyingAsset,
        status: statusUnderlyingAsset,
    } = useContractRead({
        abi: LoanAbi as Abi,
        address: diamondAddress,
        functionName: "get_underlying_asset",
        args: []
    });

    return {
        dataUnderlyingAsset,
        errorUnderlyingAsset,
        isIdleUnderlyingAsset,
        loadingUnderlyingAsset,
        isSuccessUnderlyingAsset,
        isErrorUnderlyingAsset,
        refetchUnderlyingAsset,
        statusUnderlyingAsset,
    };

}
    