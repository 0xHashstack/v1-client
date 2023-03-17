import { useAccount, useContract, useStarknetCall, useStarknetExecute, useTransactionReceipt } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Abi, uint256 } from "starknet";
import { ERC20Abi, tokenAddressMap, tokenDecimalsMap } from "../../stark-constants";
import { TxToastManager } from "../../txToastManager";
import { BNtoNum, GetErrorText, NumToBN } from "../../utils";
import { etherToWeiBN ,weiToEtherNumber} from "../../utils";

const useRepay = ( asset: any, diamondAddress: string ) => {
  const [repayAmount, setRepayAmount] = useState<number>();
  const [commitmentPeriod, setCommitmentPeriod] = useState();
  const [loanId, setLoanId] = useState<number>();

  const [allowanceVal, setAllowance] = useState(0);
  const [isAllowed, setAllowed] = useState(false);
  const [shouldApprove, setShouldApprove] = useState(false);

  const { address: account } = useAccount();
  const [transApprove, setTransApprove] = useState("");
  const [transRepayHash, setTransRepayHash] = useState("");
  const [transSelfLiquidateHash, setIsSelfLiquidateHash] = useState("");

  const repayTransactionReceipt = useTransactionReceipt({
    hash: transRepayHash,
    watch: true
  })

  const selfLiquidateTransactionReceipt = useTransactionReceipt({
    hash: transSelfLiquidateHash,
    watch: true
  });

  const { contract } = useContract({
    abi: ERC20Abi as Abi,
    address: tokenAddressMap[asset.loanMarket] as string,
  });

  const {
    data: dataAllowance,
    loading: loadingAllowance,
    error: errorAllowance,
    refresh: refreshAllowance,
  } = useStarknetCall({
    contract: contract,
    method: "allowance",
    args: [account, diamondAddress],
    options: {
      watch: true,
    },
  });

  const {
    data: dataApprove,
    loading: loadingApprove,
    error: errorApprove,
    reset: resetApprove,
    execute: executeApprove,
  } = useStarknetExecute({
    calls: {
      contractAddress: tokenAddressMap[asset.loanMarket] as string,
      entrypoint: "approve",
      calldata: [diamondAddress, etherToWeiBN(repayAmount as number, tokenAddressMap[asset.loanMarket] || "").toString(), 0],
    },
  });

  const {
    data: dataRepay,
    loading: loadingRepay,
    error: errorRepay,
    reset: resetRepay,
    execute: executeRepay,
  } = useStarknetExecute({
    calls: [
      {
        contractAddress: tokenAddressMap[asset.loanMarket] as string,
        entrypoint: "approve",
        calldata: [diamondAddress, etherToWeiBN(repayAmount as number, tokenAddressMap[asset.loanMarket]|| "").toString(), 0],
      },
      {
        contractAddress: diamondAddress,
        entrypoint: "loan_repay",
        calldata: [
          tokenAddressMap[asset.loanMarket],
          asset.commitmentIndex,
          etherToWeiBN(repayAmount as number, tokenAddressMap[asset.loanMarket]|| "").toString(),
          0,
        ],
      }
    ]
  });

  const {
    data: dataSelfLiquidate,
    loading: loadingSelfLiquidate,
    error: errorSelfLiquidate,
    reset: resetSelfLiquidate,
    execute: executeSelfLiquidate,
  } = useStarknetExecute({
    calls: [
      {
        contractAddress: diamondAddress,
        entrypoint: "loan_repay",
        calldata: [
          tokenAddressMap[asset.loanMarket],
          asset.commitmentIndex,
          0,
          0,
        ],
      }
    ]
  });

  useEffect(() => {
    // console.log("check allownace", {
    //   dataAllowance,
    //   errorAllowance,
    //   refreshAllowance,
    //   loadingAllowance,
    // });
    if (dataAllowance) {
      // console.log("yo", Number(BNtoNum(dataAllowance[0]?.low, 18)));
    }
    if (!loadingAllowance) {
      if (dataAllowance) {
        let data: any = dataAllowance;
        let _allowance = uint256.uint256ToBN(data.remaining);
        // // console.log({ _allowance: _allowance.toString(), depositAmount });
        setAllowance(Number(weiToEtherNumber(dataAllowance[0]?.low, tokenAddressMap[asset.loanMarket]|| "").toString()));
        if (allowanceVal > (repayAmount as number)) {
          setAllowed(true);
          setShouldApprove(false);
        } else {
          setShouldApprove(true);
          setAllowed(false);
        }
      } else if (errorAllowance) {
        // handleToast(true, "Check allowance", errorAllowance)
      }
    }
  }, [dataAllowance, errorAllowance, refreshAllowance, loadingAllowance]);

  const handleApprove = async (asset: string) => {
    try {
      const val = await executeApprove();
      setTransApprove(val.transaction_hash);
    } catch (err) {
      // console.log(err, "err approve token repay");
    }
  };

  return {
    repayAmount, 
    setRepayAmount,
    handleApprove,
    executeRepay,
    transRepayHash,
    setTransRepayHash,
    repayTransactionReceipt,
    loadingRepay,
    errorRepay,

    //SelfLiquidate - Repay with 0 amount
    executeSelfLiquidate, 
    loadingSelfLiquidate,
    errorSelfLiquidate,
    selfLiquidateTransactionReceipt, 
    setIsSelfLiquidateHash
  };
}

export default useRepay;