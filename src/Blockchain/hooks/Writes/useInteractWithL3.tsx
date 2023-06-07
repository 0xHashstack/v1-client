import { diamondAddress } from "@/Blockchain/stark-constants"
import { useContractWrite } from "@starknet-react/core"
import { useState } from "react"

const useInteractWithL3 = (loanIdParam: string) => {
  const [loanId, setLoanId] = useState<string>(loanIdParam)
  const [calldataLen, setCalldataLen] = useState<number>()
  const [calldata, setCalldata] = useState()

  const {
    data: dataInteractWithL3,
    error: errorInteractWithL3,
    isIdle: isIdleInteractWithL3,
    isLoading: isLoadingInteractWithL3,
  } = useContractWrite({
    calls: {
      contractAddress: diamondAddress, 
      entrypoint: "interact_with_l3", 
      calldata: [
        calldataLen,
        calldata,
      ]
    }
  })

  return {
    dataInteractWithL3,
    errorInteractWithL3,
    isIdleInteractWithL3,
    isLoadingInteractWithL3,
    calldataLen,
    setCalldataLen,
    calldata,
    setCalldata,
  }
}

export default useInteractWithL3