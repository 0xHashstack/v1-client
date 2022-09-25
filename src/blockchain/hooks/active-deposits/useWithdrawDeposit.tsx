import {
  useConnectors,
  useStarknet,
  useStarknetExecute,
} from "@starknet-react/core";
import { exec } from "child_process";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { number } from "starknet";
import deposit from "../../../components/deposit";
import { tokenAddressMap } from "../../stark-constants";
import { GetErrorText, NumToBN } from "../../utils";

const useWithdrawDeposit = (
  _token: any,
  _diamondAddress: string,
  _depositId: number
) => {
  const [token, setToken] = useState("");
  const [diamondAddress, setDiamondAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState<number>();
  const [depositId, setDepositId] = useState<number>();
  useEffect(() => {
    setToken(_token.market);
    setDiamondAddress(_diamondAddress);
    setDepositId(_depositId);
  }, [_token.market, _diamondAddress, _depositId]);

  const {
    data: dataDeposit,
    loading: loadingDeposit,
    error: errorDeposit,
    reset: resetDeposit,
    execute: executeDeposit,
  } = useStarknetExecute({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "withdraw_deposit",
      calldata: [depositId, NumToBN(withdrawAmount as number, 18), 0],
    },
  });

  const withdrawDeposit = async () => {
    console.log(`${withdrawAmount} ${depositId} ${diamondAddress}`);
    await executeDeposit();
    if (errorDeposit) {
      toast.error(`${GetErrorText(`Couldn't add Deposit to ${token}`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
    toast.success(`${token} Withdrawn!`, {
      position: toast.POSITION.BOTTOM_RIGHT,
      closeOnClick: true,
    });
  };

  return {
    withdrawDeposit,
    setWithdrawAmount,
    withdrawAmount,
  };
};

export default useWithdrawDeposit;
