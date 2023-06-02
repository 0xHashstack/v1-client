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

const useGetCollateralRecord = (loanId: number) => {
    const [loanIdState, setCollateralId] = useState<number>(loanId);

    const { 
        data: dataCollateralRecord,
        error: errorCollateralRecord,
        isIdle: isIdleCollateralRecord,
        isLoading: loadingCollateralRecord,
        isSuccess: isSuccessCollateralRecord,
        isError: isErrorCollateralRecord,
        refetch: refetchCollateralRecord,
        status: statusCollateralRecord,
    } = useContractRead({
        abi: LoanAbi as Abi,
        address: diamondAddress,
        functionName: "get_collateral_record",
        args: [loanIdState]
    });

    return {
        dataCollateralRecord,
        errorCollateralRecord,
        isIdleCollateralRecord,
        loadingCollateralRecord,
        isSuccessCollateralRecord,
        isErrorCollateralRecord,
        refetchCollateralRecord,
        statusCollateralRecord,
    };

}
    