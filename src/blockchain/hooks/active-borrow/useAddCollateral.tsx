import { useStarknetExecute, useTransactionReceipt } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { tokenAddressMap, tokenDecimalsMap } from "../../stark-constants";
import { TxToastManager } from "../../txToastManager";
import { GetErrorText, NumToBN } from "../../utils";

const useAddCollateral = (diamondAddress: string, asset: any) => {
    const [loanId, setLoanId] = useState<number>(asset.loanId);
    const [addCollateralAmount, setAddCollateralAmount] = useState<number>();

    const [transWithdrawCollateral, setTransWithdrawCollateral] = useState('');

    const withdrawCollateralTransactionReceipt = useTransactionReceipt({ hash: transWithdrawCollateral, watch: true })


    useEffect(() => {
        console.log('withdraw col tx receipt', withdrawCollateralTransactionReceipt.data?.transaction_hash, withdrawCollateralTransactionReceipt);
        TxToastManager.handleTxToast(withdrawCollateralTransactionReceipt, `Withdraw collateral`, true)
    }, [withdrawCollateralTransactionReceipt])

    const {
        data: dataAddCollateral,
        loading: loadingAddCollateral,
        error: errorAddCollateral,
        reset: resetAddCollateral,
        execute: executeAddCollateral,
    } = useStarknetExecute({
        calls: [
            {
                contractAddress: tokenAddressMap[asset.loanMarket] as string,
                entrypoint: "approve",
                calldata: [diamondAddress, NumToBN(addCollateralAmount as number, tokenDecimalsMap[asset.collateralMarket]), 0],
            },
            {
                contractAddress: diamondAddress,
                entrypoint: "add_collateral",
                calldata: [
                    loanId,
                    NumToBN(addCollateralAmount as number, tokenDecimalsMap[asset.collateralMarket]),
                    0,
                ],
            }
        ]
    });

    const handleAddCollateral = async () => {
        if (loanId === undefined && !diamondAddress) {
            toast.error(`${GetErrorText(`Some inputs missing`)}`, {
                position: toast.POSITION.BOTTOM_RIGHT,
                closeOnClick: true,
            });
            return;
        }
        console.log(`${loanId} ${diamondAddress}`);
        try {
            const val = await executeAddCollateral();
            setTransWithdrawCollateral(val.transaction_hash);
        } catch (err) {
            console.log(err, 'withdraw collateral')
        }
        if (errorAddCollateral) {
            toast.error(`${GetErrorText(`Adding collateral for Loan ID${asset.loanId} failed`)}`, {
                position: toast.POSITION.BOTTOM_RIGHT,
                closeOnClick: true,
            });
            return;
        }
    };

    return {
        addCollateralAmount,
        setAddCollateralAmount,
        dataAddCollateral,
        executeAddCollateral,
        loadingAddCollateral,
        errorAddCollateral,
        handleAddCollateral
    };
};

export default useAddCollateral;
