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
    diamondAddress
} from "../../stark-constants";
import { TxToastManager } from "../../tx-ToastManager";
import { etherToWeiBN, weiToEtherNumber } from "../../utils/utils";
import { tokenAddressMap } from "@/Blockchain/utils/addressServices";

const useLoanRequest = () => {
    const {address: account} = useAccount();

    const [market, setMarket] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    
    // Collateral
    const [rToken, setRToken] = useState<string>("");
    const [rTokenAmount, setRTokenAmount] = useState<number>(0);

    const [transLoanRequestHash, setIsLoanRequestHash] = useState("");

    const loanRequestTransactionReceipt = useWaitForTransaction({
        hash: transLoanRequestHash,
        watch: true,
    });

    const {
        data: dataLoanRequest,
        error: errorLoanRequest,
        reset: resetLoanRequest,
        write: writeLoanRequest,
        writeAsync: writeAsyncLoanRequest,
        isError: isErrorLoanRequest,
        isIdle: isIdleLoanRequest,
        isLoading: isLoadingLoanRequest,
        isSuccess: isSuccessLoanRequest,
        status: statusLoanRequest,
    } = useContractWrite({
        calls: [
            {
                contractAddress: diamondAddress,
                entrypoint: "loan_request",
                calldata: [
                    market,
                    etherToWeiBN(
                        amount as number,
                        tokenAddressMap[market] || ""
                    ).toString(), 
                    0, 
                    rToken,
                    etherToWeiBN(
                        rTokenAmount as number,
                        tokenAddressMap[rToken] || ""
                    ).toString(),
                    0,
                    account
                ],
            },
        ],
    });

    return {
        market,
        setMarket,
        amount,
        setAmount,
        rToken,
        setRToken,
        rTokenAmount,
        setRTokenAmount,
        dataLoanRequest,
        errorLoanRequest,
        resetLoanRequest,
        writeLoanRequest,
        writeAsyncLoanRequest,
        isErrorLoanRequest,
        isIdleLoanRequest,
        isLoadingLoanRequest,
    };
};

export default useLoanRequest;
