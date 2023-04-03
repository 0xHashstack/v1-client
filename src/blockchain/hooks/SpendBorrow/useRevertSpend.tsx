import { useStarknetExecute, useTransactionReceipt } from "@starknet-react/core";
import { tokenAddressMap } from "../../stark-constants";
import { GetErrorText, NumToBN } from "../../utils";
import { toast } from "react-toastify";
import Integration from '../../../../starknet-artifacts/contracts/modules/integration.cairo/integration_abi.json'
import { useEffect, useState } from "react";
import { TxToastManager } from "../../txToastManager";

const useRevertSpend = (diamondAddress: string, asset: any) => {
    const [toastRevertSpendParam, setToastRevertSpendParam] = useState({});
    const [isRevertSpendToastOpen, setIsToastRevertSpendOpen] = useState(false);
    const [transHashRevertSpend, setTransHashRevertSpend] = useState<string>();

    const requestRevertSpendReceipt = useTransactionReceipt({
        hash: transHashRevertSpend,
        watch: true,
    });

    useEffect(() => {
        TxToastManager.handleTxToast(
            requestRevertSpendReceipt,
            `Revert Spend: Loan Id: ${asset?.loanId}`,
            true
        );
    }, [requestRevertSpendReceipt]);

    const {
        data: dataRevertSpend,
        loading: loadingRevertSpend,
        error: errorRevertSpend,
        reset: resetRevertSpend,
        execute: executeRevertSpend,
    } = useStarknetExecute({
        calls: {
            contractAddress: diamondAddress,
            entrypoint: 'revert_interaction_with_l3',
            calldata: [ asset?.loanId ],
        },
    });

    const handleRevertSpend = async () => {
        try {
            const val = await executeRevertSpend();
            setTransHashRevertSpend(val.transaction_hash);
            const toastParamValue = {
                success: true,
                heading: "Success",
                desc: "Copy the Transaction Hash",
                textToCopy: val.transaction_hash,
            };
            setToastRevertSpendParam(toastParamValue);
            setIsToastRevertSpendOpen(true);
        } catch (err) {
            // console.log(err, "err repay");
            const toastParamValue = {
                success: false,
                heading: "Rever Spend Failed",
                desc: "Copy the error",
                textToCopy: err,
            };
            setToastRevertSpendParam(toastParamValue);
            setIsToastRevertSpendOpen(true);
            toast.error(`${GetErrorText(`Revert Spend for Loan ID${asset.loanId} failed`)}`, {
                position: toast.POSITION.BOTTOM_RIGHT,
                closeOnClick: true,
            });
            return;
        }
    }

    return {
        executeRevertSpend,
        loadingRevertSpend,
        dataRevertSpend,
        errorRevertSpend,
        handleRevertSpend,
        requestRevertSpendReceipt,

        isRevertSpendToastOpen,
        setIsToastRevertSpendOpen,
        toastRevertSpendParam
    }
}

export default useRevertSpend;