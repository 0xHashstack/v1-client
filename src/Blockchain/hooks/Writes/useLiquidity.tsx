import { diamondAddress } from "@/Blockchain/stark-constants";
import { useContractWrite } from "@starknet-react/core";
import { useState } from "react";
import { constants } from "../../utils/constants";
import { tokenAddressMap } from "@/Blockchain/utils/addressServices";
import { NativeToken, Token } from "@/Blockchain/interfaces/interfaces";

const useLiquidity = () => {
  const [liquidityLoanId, setLiquidityLoanId] = useState<string>("");
  const [toMarketA, setToMarketA] = useState<NativeToken>("USDT");
  const [toMarketB, setToMarketB] = useState<NativeToken>("USDT");

  const {
    data: dataJediSwap_addLiquidity,
    error: errorJediSwap_addLiquidity,
    write: writeJediSwap_addLiquidity,
    writeAsync: writeAsyncJediSwap_addLiquidity,
    isIdle: isIdleJediSwap_addLiquidity,
    isLoading: isLoadingJediSwap_addLiquidity,
    status: statusJediSwap_addLiquidity,
  } = useContractWrite({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "interact_with_l3",
      calldata: [
        constants.JEDI_SWAP,
        "4",
        liquidityLoanId,
        constants.ADD_LIQUIDITY,
        tokenAddressMap[toMarketA],
        tokenAddressMap[toMarketB],
      ],
    },
  });

  const {
    data: datamySwap_addLiquidity,
    error: errormySwap_addLiquidity,
    write: writemySwap_addLiquidity,
    writeAsync: writeAsyncmySwap_addLiquidity,
    isIdle: isIdlemySwap_addLiquidity,
    isLoading: isLoadingmySwap_addLiquidity,
    status: statusmySwap_addLiquidity,
  } = useContractWrite({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "interact_with_l3",
      calldata: [
        constants.MY_SWAP,
        "4",
        liquidityLoanId,
        constants.ADD_LIQUIDITY,
        tokenAddressMap[toMarketA],
        tokenAddressMap[toMarketB],
      ],
    },
  });

  return {
    liquidityLoanId,
    setLiquidityLoanId,
    toMarketA,
    setToMarketA,

    toMarketB,
    setToMarketB,

    dataJediSwap_addLiquidity,
    errorJediSwap_addLiquidity,
    writeJediSwap_addLiquidity,
    writeAsyncJediSwap_addLiquidity,
    isIdleJediSwap_addLiquidity,
    isLoadingJediSwap_addLiquidity,
    statusJediSwap_addLiquidity,

    datamySwap_addLiquidity,
    errormySwap_addLiquidity,
    writemySwap_addLiquidity,
    writeAsyncmySwap_addLiquidity,
    isIdlemySwap_addLiquidity,
    isLoadingmySwap_addLiquidity,
    statusmySwap_addLiquidity,
  };
};

export default useLiquidity;
