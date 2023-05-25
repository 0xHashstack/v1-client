import {
  useConnectors,
  useStarknet,
  useStarknetExecute,
} from "@starknet-react/core";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { number } from "starknet";
import { tokenAddressMap, tokenDecimalsMap } from "../../stark-constants";
import { GetErrorText, NumToBN, etherToWeiBN } from "../../utils";

const useWithdrawDeposit = (asset: any, diamondAddress: string) => {
  const [withdrawAmount, setWithdrawAmount] = useState<number>();
  const [transWithdraw, setTransWithdraw] = useState("");
  const [withdrawAllorNot, setWithdrawAllorNot] = useState(false);

  const [toastDepWithdrawParam, setDepWithdrawToastParam] = useState({});
  const [isDepWithdrawToastOpen, setIsDepWithdrawToastOpen] = useState(false);

  const {
    data: dataWithdrawDeposit,
    loading: loadingWithdrawDeposit,
    error: errorWithdrawDeposit,
    reset: resetWithdrawDeposit,
    execute: executeWithdrawDep,
  } = useStarknetExecute({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "withdraw_deposit",
      calldata: [
        asset.depositId,
        etherToWeiBN(
          withdrawAmount as number,
          tokenAddressMap[asset.market] || ""
        ).toString(),
        0,
      ],
    },
  });

  const {
    data: withdrawDepositAll,
    loading: loadingWithdrawDepositAll,
    error: errorWithdrawDepositAll,
    reset: resetWithdrawDepositAll,
    execute: executeWithdrawDepositAll,
  } = useStarknetExecute({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "withdraw_all_deposit",
      calldata: [asset.depositId],
    },
  });

  const handleWithdrawDeposit = async () => {
    // console.log(`${withdrawAmount} ${asset.depositId} ${diamondAddress}`);

    try {
      let val;
      if (withdrawAllorNot) val = await executeWithdrawDepositAll();
      else val = await executeWithdrawDep();
      setTransWithdraw(val.transaction_hash);
      const toastParamValue = {
        success: true,
        heading: "Success",
        desc: "Copy the Transaction Hash",
        textToCopy: val.transaction_hash,
      };
      setDepWithdrawToastParam(toastParamValue);
      setIsDepWithdrawToastOpen(true);
    } catch (err) {
      // console.log(err, 'withdraw deposit')
      const toastParamValue = {
        success: false,
        heading: "Deposit Transaction Failed",
        desc: "Copy the error",
        textToCopy: err,
      };
      setDepWithdrawToastParam(toastParamValue);
      setIsDepWithdrawToastOpen(true);
      toast.error(
        `${GetErrorText(`Withdraw for ID:${asset.depositId} failed`)}`,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          closeOnClick: true,
        }
      );
    }
  };

  return {
    handleWithdrawDeposit,
    setWithdrawAmount,
    withdrawAmount,
    setWithdrawAllorNot,
    transWithdraw,
    executeWithdrawDep,
    loadingWithdrawDeposit,
    errorWithdrawDeposit,

    isDepWithdrawToastOpen,
    setIsDepWithdrawToastOpen,
    toastDepWithdrawParam,
  };
};

export default useWithdrawDeposit;
