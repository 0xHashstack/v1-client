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
    diamondAddress
} from "../../stark-constants";
import { etherToWeiBN, weiToEtherNumber } from "../../utils/utils";
import { tokenAddressMap } from "@/Blockchain/utils/addressServices";
import { NativeToken, RToken } from "@/Blockchain/interfaces/interfaces";

const useAddCollateral  = () => {
    const [loanId, setLoanId] = useState("");
    const [collateralAsset, setCollateralAsset] = useState<NativeToken>("USDT");
    const [collateralAmount, setCollateralAmount] = useState(0);

    const [rToken, setRToken] = useState<RToken>("rUSDT");
    const [rTokenAmount, setRTokenAmount] = useState<number>(0);


    //     data: dataLoanRequest,
    //     error: errorLoanRequest,
    //     reset: resetLoanRequest,
    //     write: writeLoanRequest,
    //     writeAsync: writeAsyncLoanRequest,
    //     isError: isErrorLoanRequest,
    //     isIdle: isIdleLoanRequest,
    //     isLoading: isLoadingLoanRequest,
    //     isSuccess: isSuccessLoanRequest,
    //     status: statusLoanRequest,
    const {
        data: dataAddCollateral,
        error: errorAddCollateral,
        reset: resetAddCollateral,
        write: writeAddCollateral,
        writeAsync: writeAsyncAddCollateral,
        isError: isErrorAddCollateral,
        isIdle: isIdleAddCollateral,
        isLoading: isLoadingAddCollateral,
        isSuccess: isSuccessAddCollateral,
        status: statusAddCollateral,
    } = useContractWrite({
        calls: [
            {
                contractAddress: tokenAddressMap[collateralAsset] || "",
                entrypoint: "approve",
                calldata: [
                    diamondAddress,
                    etherToWeiBN(
                        collateralAmount,
                        collateralAsset
                    ).toString(),
                    "0" 
                ],
            },
            {
                contractAddress: diamondAddress,
                entrypoint: "add_collateral",
                calldata: [
                    loanId,
                    tokenAddressMap[collateralAsset],
                    etherToWeiBN(
                        collateralAmount as number,
                        collateralAsset
                    ).toString(),
                    "0"
                ],
            }
        ],
    });

      const {
        data: dataAddCollateralRToken,
        error: errorAddCollateralRToken,
        reset: resetAddCollateralRToken,
        write: writeAddCollateralRToken,
        writeAsync: writeAsyncAddCollateralRToken,
        isError: isErrorAddCollateralRToken,
        isIdle: isIdleAddCollateralRToken,
        isLoading: isLoadingAddCollateralRToken,
        isSuccess: isSuccessAddCollateralRToken,
        status: statusAddCollateralRToken,
    } = useContractWrite({
        calls: [
            {
                contractAddress: diamondAddress,
                entrypoint: "add_rToken_collateral",
                calldata: [
                    loanId,
                    tokenAddressMap[rToken],
                    etherToWeiBN(
                        rTokenAmount,
                        collateralAsset
                    ).toString(),
                    "0"
                ],
            }
        ],
    });

    return {
        loanId,
        setLoanId,
        collateralAsset,
        setCollateralAsset,
        collateralAmount,
        setCollateralAmount,

        rToken,
        setRToken,
        rTokenAmount,
        setRTokenAmount,
        
        dataAddCollateral,
        errorAddCollateral,
        resetAddCollateral,
        writeAddCollateral,
        writeAsyncAddCollateral,
        isErrorAddCollateral,
        isIdleAddCollateral,
        isLoadingAddCollateral,
        isSuccessAddCollateral,
        statusAddCollateral,


        dataAddCollateralRToken,
        errorAddCollateralRToken,
        resetAddCollateralRToken,
        writeAddCollateralRToken,
        writeAsyncAddCollateralRToken,
        isErrorAddCollateralRToken,
        isIdleAddCollateralRToken,
        isLoadingAddCollateralRToken,
        isSuccessAddCollateralRToken,
        statusAddCollateralRToken,
    };
};

export default useAddCollateral;
