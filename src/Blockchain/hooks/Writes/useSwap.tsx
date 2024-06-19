import { diamondAddress } from "@/Blockchain/stark-constants";
import { useContractWrite } from "@starknet-react/core";
import { useState } from "react";
import { constants } from "../../utils/constants";
import { tokenAddressMap } from "@/Blockchain/utils/addressServices";
import { Token } from "@/Blockchain/interfaces/interfaces";

const useSwap = () => {
  const [swapLoanId, setSwapLoanId] = useState<string>("");
  const [toMarket, setToMarket] = useState<Token | any>("BTC");
  const [callDataSwap, setcallDataSwap] = useState<any>()

  const {
    data: dataJediSwap_swap,
    error: errorJediSwap_swap,
    write: writeJediSwap_swap,
    writeAsync: writeAsyncJediSwap_swap,
    isIdle: isIdleJediSwap_swap,
    status: statusJediSwap_swap,
  } = useContractWrite({
    calls: [{
      contractAddress: diamondAddress,
      entrypoint: "interact_with_l3",
      calldata: [
        callDataSwap
      ],
    }],
  });

  const {
    data: datamySwap_swap,
    error: errormySwap_swap,
    write: writemySwap_swap,
    writeAsync: writeAsyncmySwap_swap,
    isIdle: isIdlemySwap_swap,
    status: statusmySwap_swap,
  } = useContractWrite({
    calls: [{
      contractAddress: diamondAddress,
      entrypoint: "interact_with_l3",
      calldata: [
        callDataSwap
      ],
    }],
  });

  return {
    swapLoanId,
    setSwapLoanId,
    toMarket,
    setToMarket,
    callDataSwap,
    setcallDataSwap,

    dataJediSwap_swap,
    errorJediSwap_swap,
    writeJediSwap_swap,
    writeAsyncJediSwap_swap,
    isIdleJediSwap_swap,
    statusJediSwap_swap,

    datamySwap_swap,
    errormySwap_swap,
    writemySwap_swap,
    writeAsyncmySwap_swap,
    isIdlemySwap_swap,
    statusmySwap_swap,
  };
};

export default useSwap;
