import { useContract, useStarknetCall, useStarknetExecute } from "@starknet-react/core";
import { tokenAddressMap } from "../../stark-constants";
import { GetErrorText, NumToBN } from "../../utils";
import JediSwapAbi from "../../../../starknet-artifacts/contracts/integrations/modules/jedi_swap.cairo/jedi_swap_abi.json";
import JediSwapAbi2 from "../../../../starknet-artifacts/contracts/integrations/modules/jedi_swap.cairo/jedi_swap.json"
import { Abi } from "starknet";
import { useEffect } from "react";
import { toast } from "react-toastify";

const useSpendBorrow = (diamondAddress: string, asset: any, toTokenName: any) => {
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
    method: 'get_supported_pools_myswap',
    args: [],
    options: {
      watch: false
    }
  })

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
    } catch (err) {
      console.log(err, "err repay");
    }
    if (errorJediSwap) {
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
    handleJediSwap
  }

}

export default useSpendBorrow;