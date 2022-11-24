import { useStarknetExecute, useTransactionReceipt } from "@starknet-react/core";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Form } from "reactstrap";
import { diamondAddress, isTransactionLoading } from "../../../../blockchain/stark-constants";
import { TxToastManager } from "../../../../blockchain/txToastManager";
import { GetErrorText } from "../../../../blockchain/utils";
import MySpinner from "../../../mySpinner";

const SwapToLoan = ({ asset, setRevertSwapTransactionReceipt }: { asset: any, setRevertSwapTransactionReceipt: any }) => {
  const [loanId, setLoanId] = useState("");
  useEffect(() => {
    setLoanId(asset.loanId);
  }, [asset]);

  const {
    data: dataSwapToLoan,
    loading: loadingSwapToLoan,
    error: errorSwapToLoan,
    reset: resetSwapToLoan,
    execute: executeSwapToLoan,
  } = useStarknetExecute({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "swap_secondary_market_to_loan",
      calldata: [loanId],
    },
  });

  const [transRevertSwap, setTransRevertSwap] = useState('');

	const revertSwapTransactionReceipt = useTransactionReceipt({hash: transRevertSwap, watch: true})

	useEffect(() => {
		console.log('revert swap tx receipt', revertSwapTransactionReceipt.data?.transaction_hash, revertSwapTransactionReceipt);
		TxToastManager.handleTxToast(revertSwapTransactionReceipt, `Revert Loan to ${asset.loanMarket}`)
    setRevertSwapTransactionReceipt(revertSwapTransactionReceipt)
	}, [revertSwapTransactionReceipt])

  const handleSwapToLoan = async () => {
    console.log(loanId, " ", diamondAddress);
    if (!loanId && !diamondAddress) {
      console.log("error");
      return;
    }
    const val = await executeSwapToLoan();
    setTransRevertSwap(val.transaction_hash)
  };
  useEffect(() => {});
  return (
    <Form>
      <div className="d-grid gap-2">
        <Button
          // color="primary"

          className="w-md mr-2"
          // disabled={
          //   !asset.isSwapped ||
          //   handleSwapToLoanTransactionDone
          // }
          onClick={() => {
            // setLoanId(asset.loanId, );
            handleSwapToLoan();
          }}
          style={{
            color: "#4B41E5",
          }}
        >
          {!isTransactionLoading(revertSwapTransactionReceipt) ?
            "Swap To Loan" : <MySpinner text="Reverting loan"/>}
        </Button>
      </div>
    </Form>
  );
};

export default SwapToLoan;
