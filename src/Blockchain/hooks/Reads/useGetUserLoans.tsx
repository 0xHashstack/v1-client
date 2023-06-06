import { diamondAddress } from "@/Blockchain/stark-constants";
import routerAbi from "@/Blockchain/abis/router_abi.json";
import { useAccount, useContractRead } from "@starknet-react/core";

const useGetUserLoans = () => {
    const { address: user } = useAccount();

    const {
        data: dataGetUserLoans,

        error: errorGetUserLoans,
        isIdle: isIdleGetUserLoans,

        isLoading: isLoadingGetUserLoans,
        isFetching: isFetchingGetUserLoans,
        isSuccess: isSuccessGetUserLoans,

        isError: isErrorGetUserLoans,
        isFetched: isFetchedGetUserLoans,

        refetch: refetchGetUserLoans,
        status: statusGetUserLoans,
    } = useContractRead({
        abi: routerAbi, 
        address: diamondAddress,
        functionName: "get_user_loans",
        args: [user]
    })

    return {
        dataGetUserLoans,
        errorGetUserLoans,
        isIdleGetUserLoans,
        isLoadingGetUserLoans,
        isFetchingGetUserLoans,
        isSuccessGetUserLoans,
        isErrorGetUserLoans,
        isFetchedGetUserLoans,
        refetchGetUserLoans,
        statusGetUserLoans,
    }
}

export default useGetUserLoans