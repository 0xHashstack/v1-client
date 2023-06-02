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

const useGetLoanRecord = (loanId: number) => {
    const [loanIdState, setLoanId] = useState<number>(loanId);

    const { 
        data: dataLoanRecord,
        error: errorLoanRecord,
        isIdle: isIdleLoanRecord,
        isLoading: loadingLoanRecord,
        isSuccess: isSuccessLoanRecord,
        isError: isErrorLoanRecord,
        refetch: refetchLoanRecord,
        status: statusLoanRecord,
    } = useContractRead({
        abi: LoanAbi as Abi,
        address: diamondAddress,
        functionName: "get_loan_record",
        args: [loanIdState]
    });

    return {
        dataLoanRecord,
        errorLoanRecord,
        isIdleLoanRecord,
        loadingLoanRecord,
        isSuccessLoanRecord,
        isErrorLoanRecord,
        refetchLoanRecord,
        statusLoanRecord,
    };

}

export default useGetLoanRecord;
    