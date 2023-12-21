import { diamondAddress } from "@/Blockchain/stark-constants";
import { useContractWrite } from "@starknet-react/core";
import { useState } from "react";

const useRevertInteractWithL3 = () => {
  const [ revertLoanId, setRevertLoanId] = useState<string>("");

  const {
    data: dataRevertInteractWithL3,
    error: errorRevertInteractWithL3,
    write: writeRevertInteractWithL3,
    writeAsync: writeAsyncRevertInteractWithL3,
    isIdle: isIdleRevertInteractWithL3,
  } = useContractWrite({
    calls: [{
      contractAddress: diamondAddress,
      entrypoint: "revert_interaction_with_l3",
      calldata: [revertLoanId],
    }],
  });

  return {
    revertLoanId,
    setRevertLoanId,
    dataRevertInteractWithL3,
    writeAsyncRevertInteractWithL3,
    writeRevertInteractWithL3,
    errorRevertInteractWithL3,
    isIdleRevertInteractWithL3,
  };
};

export default useRevertInteractWithL3;
