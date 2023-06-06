import { diamondAddress } from "@/Blockchain/stark-constants";
import { useContractWrite } from "@starknet-react/core";
import { useState } from "react";

const useRevertInteractWithL3 = (loanIdParam: string) => {
  const [loanId, setLoanId] = useState<string>(loanIdParam)

  const {
    data: dataRevertInteractWithL3,
    error: errorRevertInteractWithL3,
    isIdle: isIdleRevertInteractWithL3,
    isLoading: isLoadingRevertInteractWithL3,
  } = useContractWrite({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "revert_interaction_with_l3",
      calldata: [loanId],
    }
  })

  return {
    dataRevertInteractWithL3,
    errorRevertInteractWithL3,
    isIdleRevertInteractWithL3,
    isLoadingRevertInteractWithL3,
  }
}

export default useRevertInteractWithL3;