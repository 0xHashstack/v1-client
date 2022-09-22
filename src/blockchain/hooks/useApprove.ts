import { useStarknetExecute } from "@starknet-react/core";
import { useState } from "react";
import { tokenAddressMap, diamondAddress } from "../stark-constants";

const useApprove = ({
  token,
  commitPeriod,
  depositAmount,
}: {
  token: string;
  commitPeriod: number;
  depositAmount: number;
}) => {
  const [something, setSomething] = useState(0);
  const {
    data: dataUSDC,
    loading: loadingUSDC,
    error: errorUSDC,
    reset: resetUSDC,
    execute: USDC,
  } = useStarknetExecute({
    calls: {
      contractAddress: tokenAddressMap[token] as string,
      entrypoint: "approve",
      calldata: [diamondAddress, depositAmount, 0],
    },
  });

  const {
    data: dataUSDT,
    loading: loadingUSDT,
    error: errorUSDT,
    reset: resetUSDT,
    execute: USDT,
  } = useStarknetExecute({
    calls: {
      contractAddress: tokenAddressMap[token] as string,
      entrypoint: "approve",
      calldata: [diamondAddress, depositAmount, 0],
    },
  });

  const {
    data: dataBNB,
    loading: loadingBNB,
    error: errorBNB,
    reset: resetBNB,
    execute: BNB,
  } = useStarknetExecute({
    calls: {
      contractAddress: tokenAddressMap[token] as string,
      entrypoint: "approve",
      calldata: [diamondAddress, depositAmount, 0],
    },
  });

  const {
    data: dataBTC,
    loading: loadingBTC,
    error: errorBTC,
    reset: resetBTC,
    execute: BTC,
  } = useStarknetExecute({
    calls: {
      contractAddress: tokenAddressMap[token] as string,
      entrypoint: "approve",
      calldata: [diamondAddress, depositAmount, 0],
    },
  });

  const handleApprove = async () => {
    let val;
    if (token === "BTC") {
      val = await BTC();
    }
    if (token === "BNB") {
      val = await BNB();
    }
    if (token === "USDC") {
      val = await USDC();
    }
    if (token === "USDT") {
      val = await USDT();
    }
  };

  const returnTransactionParameters = () => {
    let data, loading, reset, error;
    if (token === "BTC") {
      [data, loading, reset, error] = [dataBTC, loadingBTC, resetBTC, errorBTC];
    }
    if (token === "BNB") {
      [data, loading, reset, error] = [dataBNB, loadingBNB, resetBNB, errorBNB];
    }
    if (token === "USDC") {
      [data, loading, reset, error] = [
        dataUSDC,
        loadingUSDC,
        resetUSDC,
        errorUSDC,
      ];
    }
    if (token === "USDT") {
      [data, loading, reset, error] = [
        dataUSDT,
        loadingUSDT,
        resetUSDT,
        errorUSDT,
      ];
    }
    return { data, loading, reset, error };
  };

  return {
    handleApprove,
    returnTransactionParameters,
  };
};

export default useApprove;
