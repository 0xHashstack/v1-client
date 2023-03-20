import { useStarknetExecute, useTransactionReceipt } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { tokenAddressMap, tokenDecimalsMap } from "../../stark-constants";
import { TxToastManager } from "../../txToastManager";
import { GetErrorText, NumToBN, etherToWeiBN } from "../../utils";

const useAddCollateral = (diamondAddress: string, asset: any) => {
    const [addCollateralAmount, setAddCollateralAmount] = useState<number>();

    const [transAddCollateral, setTransAddCollateral] = useState('');
    const [toastAddcollatParam, setToastAddcollatParam] = useState({});
    const [isAddcollatToastOpen, setIsToastAddcollatOpen] = useState(false);
    const addCollateralTransactionReceipt = useTransactionReceipt({ 
        hash: transAddCollateral, 
        watch: true 
    })


    useEffect(() => {
        // console.log('withdraw col tx receipt', withdrawCollateralTransactionReceipt.data?.transaction_hash, withdrawCollateralTransactionReceipt);
        TxToastManager.handleTxToast(addCollateralTransactionReceipt, `Add collateral`, true)
    }, [addCollateralTransactionReceipt])

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
                // calldata: [diamondAddress, NumToBN(addCollateralAmount as number, tokenDecimalsMap[asset.collateralMarket]), 0],
                calldata: [diamondAddress, etherToWeiBN(addCollateralAmount as number , tokenAddressMap[asset.collateralMarket] || "").toString(), 0],
            },
            {
                contractAddress: diamondAddress,
                entrypoint: "add_collateral",
                calldata: [
                    asset.loanId,
                    etherToWeiBN(addCollateralAmount as number , tokenAddressMap[asset.collateralMarket] || "").toString(),
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
        // console.log(`${asset.loanId} ${diamondAddress}`);
        try {
            const val = await executeAddCollateral();
            setTransAddCollateral(val.transaction_hash);
            const toastParamValue = {
                success: true,
                heading: "Success",
                desc: "Copy the Transaction Hash",
                textToCopy: val.transaction_hash,
            };
            setToastAddcollatParam(toastParamValue);
            setIsToastAddcollatOpen(true);
        } catch (err) {
            // console.log(err, 'add collateral')
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
        addCollateralTransactionReceipt,

        isAddcollatToastOpen,
        setIsToastAddcollatOpen,
        toastAddcollatParam
    };
};

export default useAddCollateral;
