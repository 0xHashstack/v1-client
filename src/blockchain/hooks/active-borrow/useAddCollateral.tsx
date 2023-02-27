import { useStarknetExecute, useTransactionReceipt } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { tokenAddressMap, tokenDecimalsMap } from "../../stark-constants";
import { TxToastManager } from "../../txToastManager";
import { GetErrorText, NumToBN } from "../../utils";

const useAddCollateral = (diamondAddress: string, asset: any) => {
    const [addCollateralAmount, setAddCollateralAmount] = useState<number>();

    const [transWithdrawCollateral, setTransWithdrawCollateral] = useState('');
    const [toastAddcollatParam, setToastAddcollatParam] = useState({});
    const [isAddcollatToastOpen, setIsToastAddcollatOpen] = useState(false);
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
                contractAddress: tokenAddressMap[asset.collateralMarket] as string,
                entrypoint: "approve",
                calldata: [diamondAddress, NumToBN(addCollateralAmount as number, tokenDecimalsMap[asset.collateralMarket]), 0],
            },
            {
                contractAddress: diamondAddress,
                entrypoint: "add_collateral",
                calldata: [
                    asset.loanId,
                    NumToBN(addCollateralAmount as number, tokenDecimalsMap[asset.collateralMarket]),
                    0,
                ],
            }
        ]
    });

    const handleAddCollateral = async () => {
        if (asset.loanId === undefined && !diamondAddress) {
            toast.error(`${GetErrorText(`Some inputs missing`)}`, {
                position: toast.POSITION.BOTTOM_RIGHT,
                closeOnClick: true,
            });
            return;
        }
        console.log(`${asset.loanId} ${diamondAddress}`);
        try {
            const val = await executeAddCollateral();
            const toastParamValue = {
                success: true,
                heading: "Success",
                desc: "Copy the Transaction Hash",
                textToCopy: val.transaction_hash,
            };
            setToastAddcollatParam(toastParamValue);
            setIsToastAddcollatOpen(true);
        } catch (err) {
            console.log(err, 'add collateral')
            const toastParamValue = {
                success: false,
                heading: "Add Collateral Failed",
                desc: "Copy the error",
                textToCopy: err,
            };
            setToastAddcollatParam(toastParamValue);
            setIsToastAddcollatOpen(true);
            toast.error(`${GetErrorText(`Failed to add collateral for Loan ID${asset.loanId}`)}`, {
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
        handleAddCollateral,

        isAddcollatToastOpen,
        setIsToastAddcollatOpen,
        toastAddcollatParam
    };
};

export default useAddCollateral;
