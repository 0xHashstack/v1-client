import { diamondAddress } from "@/Blockchain/stark-constants";
import { useContractWrite } from "@starknet-react/core";
import { useState } from "react";
import { constants } from "../../utils/constants";
import { tokenAddressMap } from "@/Blockchain/utils/addressServices";
import { NativeToken, Token } from "@/Blockchain/interfaces/interfaces";

const useLiquidity = () => {
  const [liquidityLoanId, setLiquidityLoanId] = useState<string>("");
  const [toMarketA, setToMarketA] = useState<NativeToken | any>("ETH");
  const [toMarketB, setToMarketB] = useState<NativeToken | any>("USDT");
  const [callDataLiquidity, setcallDataLiquidity] = useState<any>()

  const {
    data: dataJediSwap_addLiquidity,
    error: errorJediSwap_addLiquidity,
    write: writeJediSwap_addLiquidity,
    writeAsync: writeAsyncJediSwap_addLiquidity,
    isIdle: isIdleJediSwap_addLiquidity,
    status: statusJediSwap_addLiquidity,
  } = useContractWrite({
    calls: [{
      contractAddress: diamondAddress,
      entrypoint: "interact_with_l3",
      calldata: [
          callDataLiquidity
      ],
    }],
  });

  const {
    data: datamySwap_addLiquidity,
    error: errormySwap_addLiquidity,
    write: writemySwap_addLiquidity,
    writeAsync: writeAsyncmySwap_addLiquidity,
    isIdle: isIdlemySwap_addLiquidity,
    status: statusmySwap_addLiquidity,
  } = useContractWrite({
    calls: [{
      contractAddress: diamondAddress,
      entrypoint: "interact_with_l3",
      calldata: [
        callDataLiquidity
      ],
    }],
  });

  return {
    liquidityLoanId,
    setLiquidityLoanId,
    toMarketA,
    setToMarketA,

    toMarketB,
    setToMarketB,
    callDataLiquidity,
    setcallDataLiquidity,

    dataJediSwap_addLiquidity,
    errorJediSwap_addLiquidity,
    writeJediSwap_addLiquidity,
    writeAsyncJediSwap_addLiquidity,
    isIdleJediSwap_addLiquidity,
    statusJediSwap_addLiquidity,

    datamySwap_addLiquidity,
    errormySwap_addLiquidity,
    writemySwap_addLiquidity,
    writeAsyncmySwap_addLiquidity,
    isIdlemySwap_addLiquidity,
    statusmySwap_addLiquidity,
  };
};

export default useLiquidity;
