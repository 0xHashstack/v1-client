import { useContract, useStarknetCall, useStarknetExecute } from "@starknet-react/core";
import { tokenAddressMap } from "../../stark-constants";
import { number } from "starknet";
import { GetErrorText, NumToBN } from "../../utils";
import JediSwapAbi from "../../../../starknet-artifacts/contracts/integrations/modules/jedi_swap.cairo/jedi_swap_abi.json";
import JediSwapAbi2 from "../../../../starknet-artifacts/contracts/integrations/modules/jedi_swap.cairo/jedi_swap.json"
import { Abi } from "starknet";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const useJediSwap = (diamondAddress: string, asset: any, toTokenName: any) => {

  const [toastJediswapParam, setToastJediswapParam] = useState({});
  const [isJediswapToastOpen, setIsToastJediswapOpen] = useState(false);
  const [supportedPoolsJediSwap, setSupportedPoolsJediSwap] = useState();

  const { contract: l3Contract } = useContract({
    abi: JediSwapAbi2.abi as Abi,
    address: "0x1fc40e21ce68f61d538c070cbfea9483243bcdae0072b0f8c2c85fd4ecd28ab",
  });

  const {
    data: jediSwapSupportedPoolsData,
    loading: loadingJediSwapSupportedPools,
    error: errorJediSwapSupportedPools,
    refresh: refreshJediSwapSupportedPools,
  } = useStarknetCall({
    contract: l3Contract,
    method: 'get_supported_pools_jedi_swap',
    args: [],
    options: {
      watch: false
    }
  })

  useEffect(() => {

    const setValue = (map: Map<string, Array<string>>, firstVal: string, secondVal: string) => {
      if(map.get(firstVal))
        map.set(firstVal, [...map.get(firstVal), secondVal]);
      else map.set(firstVal, [secondVal]);
    }

    console.log("loading jedi", loadingJediSwapSupportedPools);
    const poolsData = new Map();
    if (!loadingJediSwapSupportedPools) {
      console.log(
        "jediSwapSupportedPoolsData",
        jediSwapSupportedPoolsData,
        errorJediSwapSupportedPools
      );
      const pools = jediSwapSupportedPoolsData?.pools;
      for(let i = 0; i<pools?.length; i++) {
        const firstTokenAddress = number.toHex(pools[i].tokenA)
        const secondTokenAddress = number.toHex(pools[i].tokenB);
        setValue(poolsData, firstTokenAddress, secondTokenAddress);
        setValue(poolsData, secondTokenAddress, firstTokenAddress);
      }
      console.log("pooldata jediswap", poolsData);
      setSupportedPoolsJediSwap(poolsData);
    }
  }, [
    jediSwapSupportedPoolsData,
    loadingJediSwapSupportedPools,
    errorJediSwapSupportedPools,
  ]);

  const {
    data: dataJediSwap,
    loading: loadingJediSwap,
    error: errorJediSwap,
    reset: resetJediSwap,
    execute: executeJediSwap,
  } = useStarknetExecute({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: 'interact_with_l3',
      calldata: ["1962660952167394271600", 2, asset?.loanId, tokenAddressMap[toTokenName]],
    },
  });

  const handleJediSwap = async () => {
    try {
      const val = await executeJediSwap();
      const toastParamValue = {
        success: true,
        heading: "Success",
        desc: "Copy the Transaction Hash",
        textToCopy: val.transaction_hash,
    };
    setToastJediswapParam(toastParamValue);
    setIsToastJediswapOpen(true);
    } catch (err) {
      console.log(err, "err repay");
      const toastParamValue = {
        success: false,
        heading: "Swap Transaction Failed",
        desc: "Copy the error",
        textToCopy: err,
    };
    setToastJediswapParam(toastParamValue);
    setIsToastJediswapOpen(true);
      toast.error(`${GetErrorText(`Swap for Loan ID${asset.loanId} failed`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
  }

  return {
    jediSwapSupportedPoolsData,
    loadingJediSwapSupportedPools,
    errorJediSwapSupportedPools,
    refreshJediSwapSupportedPools,

    executeJediSwap,
    loadingJediSwap,
    dataJediSwap,
    errorJediSwap,
    handleJediSwap,

    isJediswapToastOpen,
    setIsToastJediswapOpen,
    toastJediswapParam,
  }

}

export default useJediSwap;