import { useAccount, useContract, useStarknetCall, useStarknetExecute, useTransactionReceipt } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Abi, uint256 } from "starknet";
import { ERC20Abi, tokenAddressMap } from "../../stark-constants";
import { TxToastManager } from "../../txToastManager";
import { BNtoNum, GetErrorText, NumToBN } from "../../utils";

const useRepay = (diamondAddress: string, asset: any, repayAmount: inputValParam = 0) => {
  const [inputVal, setInputVal] = useState<number>(inputValParam);
  const [commitmentPeriod, setCommitmentPeriod] = useState();
  const [loanId, setLoanId] = useState<number>();

  const [allowanceVal, setAllowance] = useState(0);
  const [isAllowed, setAllowed] = useState(false);
  const [shouldApprove, setShouldApprove] = useState(false);

  const { address: account } = useAccount();
  const [transApprove, setTransApprove] = useState("");
  const [transRepay, setTransRepay] = useState("");

  const approveTransactionReceipt = useTransactionReceipt({
    hash: transApprove,
    watch: true,
  });
  const repayTransactionReceipt = useTransactionReceipt({
    hash: transRepay,
    watch: true,
  });

  useEffect(() => {
    console.log(
      "approve tx receipt",
      approveTransactionReceipt.data?.transaction_hash,
      approveTransactionReceipt
    );
    TxToastManager.handleTxToast(
      approveTransactionReceipt,
      `Repay: Approve ${asset.loanMarket}`,
      true
    );
  }, [approveTransactionReceipt]);

  useEffect(() => {
    console.log(
      "repay tx receipt",
      repayTransactionReceipt.data?.transaction_hash,
      repayTransactionReceipt
    );
    TxToastManager.handleTxToast(
      repayTransactionReceipt,
      `Repay ${asset.loanMarket} Loan`
    );
    // setRepayTransactionReceipt(repayTransactionReceipt);
  }, [repayTransactionReceipt]);

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
      calldata: [diamondAddress, NumToBN(inputVal as number, 18), 0],
    },
  });

  const {
    data: dataRepay,
    loading: loadingRepay,
    error: errorRepay,
    reset: resetRepay,
    execute: executeRepay,
  } = useStarknetExecute({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "loan_repay",
      calldata: [
        tokenAddressMap[asset.loanMarket],
        asset.commitmentIndex,
        NumToBN(inputVal as number, 18),
        0,
      ],
    },
  });

  useEffect(() => {
    console.log("check allownace", {
      dataAllowance,
      errorAllowance,
      refreshAllowance,
      loadingAllowance,
    });
    if (dataAllowance) {
      console.log("yo", Number(BNtoNum(dataAllowance[0]?.low, 18)));
    }
    if (!loadingAllowance) {
      if (dataAllowance) {
        let data: any = dataAllowance;
        let _allowance = uint256.uint256ToBN(data.remaining);
        // console.log({ _allowance: _allowance.toString(), depositAmount });
        setAllowance(Number(BNtoNum(dataAllowance[0]?.low, 18)));
        if (allowanceVal > (inputVal as number)) {
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
      console.log(err, "err approve token repay");
    }
  };

  return {
    handleApprove,
  };
}

export default useRepay;