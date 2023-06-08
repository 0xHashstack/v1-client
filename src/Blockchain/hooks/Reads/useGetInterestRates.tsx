import { diamondAddress } from "@/Blockchain/stark-constants";
import { useContractRead } from "@starknet-react/core";
import { useState } from "react";
import dialAbi from "@/Blockchain/abis/module_dynamic_interest_abi.json"
import { Abi } from "starknet";

const useGetInterestRates = () => {
    const [market, setMarket] = useState("eth");

// data?: Array<any>;
    // /** Error when performing call. */
    // error?: unknown;
    // isIdle: boolean;
    // /** True when performing call. */
    // isLoading: boolean;
    // isFetching: boolean;
    // isSuccess: boolean;
    // /** False when performing call. */
    // isError: boolean;
    // isFetched: boolean;
    // isFetchedAfterMount: boolean;
    // /** True when performing call. */
    // isRefetching: boolean;
    // /** Manually trigger refresh of data. */
    // refetch: () => void;
    // status: 'idle' | 'error' | 'loading' | 'success';
    const {
        data: dataInterestRates,
        error: errorInterestRates,
        isIdle: isIdleInterestRates,
        isLoading: isLoadingInterestRates,
        isFetching: isFetchingInterestRates,
        isSuccess: isSuccessInterestRates,
        isError: isErrorInterestRates,
        isFetched: isFetchedInterestRates,
        isFetchedAfterMount: isFetchedAfterMountInterestRates,
        isRefetching: isRefetchingInterestRates,
        refetch: refetchInterestRates,
        status: statusInterestRates,
    } = useContractRead({
        address: diamondAddress, 
        abi: dialAbi as Abi,
        functionName: "get_all_interest_rates",
        args: [market],
    })

    const getAllInterestRates = (market: string) => {
        try {
            setMarket(market);
            const result = refetchInterestRates();
            console.log("result", result);
            return result;
        }
        catch (e) {
            console.log("result error", e);
        }
    }

    return {
        dataInterestRates,
        errorInterestRates,
        isIdleInterestRates,
        getAllInterestRates,
        isLoadingInterestRates,
        isFetchingInterestRates,
        isSuccessInterestRates,
        isErrorInterestRates,
        isFetchedInterestRates,
        isFetchedAfterMountInterestRates,
        isRefetchingInterestRates,
        refetchInterestRates,
        statusInterestRates,
    }
}

export default useGetInterestRates