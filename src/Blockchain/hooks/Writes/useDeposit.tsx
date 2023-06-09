import {
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
import { etherToWeiBN, weiToEtherNumber } from "../../utils/utils";

const useDeposit  = () => {
    const { address: account } = useAccount();
    const [depositAmount, setDepositAmount] = useState(0);
    const [asset, setAsset] = useState("");

    const {
        data: dataDeposit,
        error: errorDeposit,
        reset: resetDeposit,
        write: writeDeposit,
        writeAsync: writeAsyncDeposit,
        isError: isErrorDeposit,
        isIdle: isIdleDeposit,
        isLoading: isLoadingDeposit,
        isSuccess: isSuccessDeposit,
        status: statusDeposit,
    } = useContractWrite({
        calls: [
            {
                contractAddress: tokenAddressMap[asset] || "", 
                entrypoint: "approve",
                calldata: [
                    diamondAddress,
                    etherToWeiBN(
                        depositAmount as number,
                        tokenAddressMap[asset] || ""
                    ).toString(),
                ],
            },
            {
                contractAddress: diamondAddress,
                entrypoint: "deposit",
                calldata: [
                    tokenAddressMap[asset],
                    etherToWeiBN(
                        depositAmount as number,
                        tokenAddressMap[asset] || ""
                    ).toString(),
                    account,
                ],
            }
        ],
    });

    return {
        depositAmount,
        setDepositAmount,
        asset,
        setAsset,
        dataDeposit,
        errorDeposit,
        resetDeposit,
        writeAsyncDeposit,
        isErrorDeposit,
        isIdleDeposit,
        isLoadingDeposit,
        isSuccessDeposit,
        statusDeposit,
    };
};

export default useDeposit;
