import { useStarknetExecute } from "@starknet-react/core";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Form } from "reactstrap";
import { diamondAddress } from "../../../../blockchain/stark-constants";
import { GetErrorText } from "../../../../blockchain/utils";

const SwapToLoan = ({ loan }: { loan: any }) => {
  const [loanId, setLoanId] = useState("");
  useEffect(() => {
    setLoanId(loan);
  }, []);

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

  const handleSwapToLoan = async () => {
    console.log(loanId, " ", diamondAddress);
    if (!loanId && !diamondAddress) {
      console.log("error");
      return;
    }
    await executeSwapToLoan();
    if (errorSwapToLoan) {
      console.log(errorSwapToLoan);
      toast.error(`${GetErrorText(`Swap to loan failed`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
    }
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
          Swap To Loan
        </Button>
      </div>
    </Form>
  );
};

export default SwapToLoan;
