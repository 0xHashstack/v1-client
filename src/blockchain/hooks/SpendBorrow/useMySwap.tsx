import { useContract, useStarknetCall, useStarknetExecute, useTransactionReceipt } from "@starknet-react/core";
import { tokenAddressMap } from "../../stark-constants";
import { GetErrorText, NumToBN } from "../../utils";
import { toast } from "react-toastify";
import MySwapAbi from '../../../../starknet-artifacts/contracts/integrations/modules/my_swap.cairo/my_swap_abi.json'
import useMyAccount from "../walletDetails/getAddress";
import { useEffect, useState } from "react";
import { Abi, number } from "starknet";
import { l3DiamondAddress } from "../../stark-constants";
import { TxToastManager } from "../../txToastManager";

const useMySwap = (diamondAddress: string, asset: any, toTokenName: any) => {
  const [toastMyswapParam, setToastMyswapParam] = useState({});
  const [isMyswapToastOpen, setIsToastMyswapOpen] = useState(false);
  const [poolIdtoTokens, setPoolIdtoTokens] = useState();

  const [transMySwapHash, setTransMySwapHash] = useState("");

  const mySwapTransReceipt = useTransactionReceipt({
    hash: transMySwapHash,
    watch: true
  })

  useEffect(() => {
    TxToastManager.handleTxToast(
      mySwapTransReceipt,
      `Spend Borrow: ${asset?.loanId}`,
      true
    );
  }, [mySwapTransReceipt]);

  const [supportedPoolsMySwap, setSupportedPoolsMySwap] = useState();

  const { contract: l3Contract } = useContract({
    abi: MySwapAbi as Abi,
    address: l3DiamondAddress,
  });

  const {
    data: mySwapSupportedPoolsData,
    loading: loadingMySwapSupportedPools,
    error: errorMySwapSupportedPools,
    refresh: refreshMySwapSupportedPools,
  } = useStarknetCall({
    contract: l3Contract,
    method: 'get_supported_pools_myswap',
    args: [],
    options: {
      watch: false
    }
  })

  useEffect(() => {
    const setValue = (map: Map<string, Array<string>>, firstVal: string, secondVal: string) => {
      if (map.get(firstVal))
        map.set(firstVal, [...map.get(firstVal), secondVal]);
      else map.set(firstVal, [secondVal]);
    }

    // console.log("loading jedi", loadingMySwapSupportedPools);
    const poolsData = new Map();
    const poolIdtoTokensMap = new Map();
    if (!loadingMySwapSupportedPools) {
      // console.log(
      //   "MySwapSupportedPoolsData",
      //   mySwapSupportedPoolsData,
      //   errorMySwapSupportedPools
      // );
      const pools = mySwapSupportedPoolsData?.pools;
      for (let i = 0; i < pools?.length; i++) {
        const firstTokenAddress = number.toHex(pools[i].tokenA)
        const secondTokenAddress = number.toHex(pools[i].tokenB);
        const poolId = pools[i].pool.toNumber();
        setValue(poolsData, firstTokenAddress, secondTokenAddress);
        setValue(poolsData, secondTokenAddress, firstTokenAddress);
        poolIdtoTokensMap.set(poolId, [firstTokenAddress, secondTokenAddress])
      }
      // console.log("pooldata myswap", poolsData);
      setSupportedPoolsMySwap(poolsData)
      setPoolIdtoTokens(poolIdtoTokensMap)
    }
  }, [
    mySwapSupportedPoolsData,
    loadingMySwapSupportedPools,
    errorMySwapSupportedPools,
  ]);


  const {
    data: dataMySwap,
    loading: loadingMySwap,
    error: errorMySwap,
    reset: resetMySwap,
    execute: executeMySwap,
  } = useStarknetExecute({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: 'interact_with_l3',
      calldata: ["30814223327519088", 2, asset?.loanId, tokenAddressMap[toTokenName]],
    },
  });

  const handleMySwap = async () => {
    try {
      const val = await executeMySwap();
      setTransMySwapHash(val.transaction_hash);
      const toastParamValue = {
        success: true,
        heading: "Success",
        desc: "Copy the Transaction Hash",
        textToCopy: val.transaction_hash,
      };
      setToastMyswapParam(toastParamValue);
      setIsToastMyswapOpen(true);
    } catch (err) {
      // console.log(err, "err repay");
      const toastParamValue = {
        success: false,
        heading: "Swap Transaction Failed",
        desc: "Copy the error",
        textToCopy: err,
      };
      setToastMyswapParam(toastParamValue);
      setIsToastMyswapOpen(true);
      toast.error(`${GetErrorText(`Swap for Loan ID${asset.loanId} failed`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
  }

  return {
    executeMySwap,
    loadingMySwap,
    dataMySwap,
    errorMySwap,
    handleMySwap,
    mySwapTransReceipt,

    supportedPoolsMySwap,
    loadingMySwapSupportedPools,
    errorMySwapSupportedPools,
    refreshMySwapSupportedPools,
    mySwapSupportedPoolsData,
    poolIdtoTokens,

    isMyswapToastOpen,
    setIsToastMyswapOpen,
    toastMyswapParam
  }
}

export default useMySwap;