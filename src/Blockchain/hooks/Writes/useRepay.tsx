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
} from "../../stark-constants";
import { TxToastManager } from "../../tx-ToastManager";
import { etherToWeiBN, weiToEtherNumber } from "../../utils/utils";

const useRepay = (asset: any, diamondAddress: string) => {
    const [repayAmount, setRepayAmount] = useState<number>();
    const [loanId, setLoanId] = useState<number>();

    const [allowanceVal, setAllowance] = useState(0);
    const [isAllowed, setAllowed] = useState(false);
    const [shouldApprove, setShouldApprove] = useState(false);

    const { address: account } = useAccount();
    const [transApprove, setTransApprove] = useState("");
    const [transRepayHash, setTransRepayHash] = useState("");
    const [transSelfLiquidateHash, setIsSelfLiquidateHash] = useState("");

    const repayTransactionReceipt = useWaitForTransaction({
        hash: transRepayHash,
        watch: true,
    });

    const selfLiquidateTransactionReceipt = useWaitForTransaction({
        hash: transSelfLiquidateHash,
        watch: true,
    });

    useEffect(() => {
        TxToastManager.handleTxToast(
            repayTransactionReceipt,
            `Repay Loan ID ${asset?.loanId}`
        );
    }, [repayTransactionReceipt]);

    useEffect(() => {
        TxToastManager.handleTxToast(
            selfLiquidateTransactionReceipt,
            `Liquidate Loan ID ${asset?.loanId}`
        );
    }, [selfLiquidateTransactionReceipt]);

    const {
        data: dataAllowance,
        error: errorAllowance,
        isIdle: isIdleAllowance,
        isLoading: loadingAllowance,
        isSuccess: isSuccessAllowance,
        isError: isErrorAllowance,
        refetch: refetchAllowance,
        status: statusAllowance,
    } = useContractRead({
        abi: ERC20Abi as Abi,
        address: tokenAddressMap[asset.loanMarket] as string,
        functionName: "allowance",
        args: [account, diamondAddress],
        watch: true,
    });

    const {
        data: dataApprove,
        error: errorApprove,
        reset: resetApprove,
        write: writeApprove,
        writeAsync: writeAsyncApprove,
        isError: isErrorApprove,
        isIdle: isIdleApprove,
        isLoading: isLoadingApprove,
        isSuccess: isSuccessApprove,
        status: statusApprove,
    } = useContractWrite({
        calls: {
            contractAddress: tokenAddressMap[asset.loanMarket] as string,
            entrypoint: "approve",
            calldata: [
                diamondAddress,
                etherToWeiBN(
                    repayAmount as number,
                    tokenAddressMap[asset.loanMarket] || ""
                ).toString(),
                0,
            ],
        },
    });

    const {
        data: dataRepay,
        error: errorRepay,
        reset: resetRepay,
        write: writeRepay,
        writeAsync: writeAsyncRepay,
        isError: isErrorRepay,
        isIdle: isIdleRepay,
        isLoading: isLoadingRepay,
        isSuccess: isSuccessRepay,
        status: statusRepay,
    } = useContractWrite({
        calls: [
            {
                contractAddress: tokenAddressMap[asset.loanMarket] as string,
                entrypoint: "approve",
                calldata: [
                    diamondAddress,
                    etherToWeiBN(
                        repayAmount as number,
                        tokenAddressMap[asset.loanMarket] || ""
                    ).toString(),
                    0,
                ],
            },
            {
                contractAddress: diamondAddress,
                entrypoint: "loan_repay",
                calldata: [
                    tokenAddressMap[asset.loanMarket],
                    asset.commitmentIndex,
                    etherToWeiBN(
                        repayAmount as number,
                        tokenAddressMap[asset.loanMarket] || ""
                    ).toString(),
                    0,
                ],
            },
        ],
    });

    const {
        data: dataSelfLiquidate,
        error: errorSelfLiquidate,
        reset: resetSelfLiquidate,
        write: writeSelfLiquidate,
        writeAsync: writeAsyncSelfLiquidate,
        isError: isErrorSelfLiquidate,
        isIdle: isIdleSelfLiquidate,
        isLoading: isLoadingSelfLiquidate,
        isSuccess: isSuccessSelfLiquidate,
        status: statusSelfLiquidate,
    } = useContractWrite({
        calls: [
            {
                contractAddress: diamondAddress,
                entrypoint: "loan_repay",
                calldata: [
                    tokenAddressMap[asset.loanMarket],
                    asset.commitmentIndex,
                    0,
                    0,
                ],
            },
        ],
    });

    useEffect(() => {
        if (dataAllowance) {
            // console.log("yo", Number(BNtoNum(dataAllowance[0]?.low, 18)));
        }
        if (!loadingAllowance) {
            if (dataAllowance) {
                let data: any = dataAllowance;
                let _allowance = uint256.uint256ToBN(data.remaining);
                // // console.log({ _allowance: _allowance.toString(), depositAmount });
                setAllowance(
                    Number(
                        weiToEtherNumber(
                            dataAllowance[0]?.low,
                            tokenAddressMap[asset.loanMarket] || ""
                        ).toString()
                    )
                );
                if (allowanceVal > (repayAmount as number)) {
                    setAllowed(true);
                    setShouldApprove(false);
                } else {
                    setShouldApprove(true);
                    setAllowed(false);
                }
            } else if (errorAllowance) {
                // handleToast(true, "Check allowance", errorAllowance)
            }
        }
    }, [dataAllowance, errorAllowance, refetchAllowance, loadingAllowance]);

    const handleRepayBorrow = async () => {
        if (
          !repayAmount &&
          asset.loanId! &&
          !diamondAddress &&
          !asset.commitmentIndex
        ) {
            return;

        }
        if (!tokenAddressMap[asset.loanMarket] && !repayAmount && !diamondAddress) {
          return;
        }
        // if (!repayAmount || repayAmount < 0) {
        if (!repayAmount || repayAmount < 0) {
          return;
        }
        try {
          const val = await writeAsyncRepay();
          setTransRepayHash(val.transaction_hash);
          const toastParamValue = {
            success: true,
            heading: "Success",
            desc: "Copy the Transaction Hash",
            textToCopy: val.transaction_hash,
          };
        } catch (err) {
          // console.log(err, "err repay");
          const toastParamValue = {
            success: false,
            heading: "Repay Transaction Failed",
            desc: "Copy the error",
            textToCopy: err,
          };
          return;
        }
    };

    const handleApprove = async (asset: string) => {
        try {
            const val = await writeAsyncApprove();
            setTransApprove(val.transaction_hash);
        } catch (err) {
            console.log(err, "err approve token repay");
        }
    };

    return {
        repayAmount,
        setRepayAmount,
        handleApprove,
        writeAsyncRepay,
        transRepayHash,
        setTransRepayHash,
        repayTransactionReceipt,
        isLoadingRepay,
        errorRepay,
        handleRepayBorrow,

        //SelfLiquidate - Repay with 0 amount
        writeAsyncSelfLiquidate,
        isLoadingSelfLiquidate,
        errorSelfLiquidate,
        selfLiquidateTransactionReceipt,
        setIsSelfLiquidateHash,
    };
};

export default useRepay;
 