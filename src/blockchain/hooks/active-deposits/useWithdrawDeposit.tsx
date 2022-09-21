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
import { GetErrorText } from "../../utils";

const useWithdrawDeposit = (
  _token: any,
  _diamondAddress: string,
  _depositId: number
) => {
  const { available, connect, disconnect } = useConnectors();

  const { account } = useStarknet();
  useEffect(() => {
    setToken(_token.market);
    setDiamondAddress(_diamondAddress);
    setDepositId(_depositId);
  });
  const [token, setToken] = useState("");
  const [diamondAddress, setDiamondAddress] = useState("");
  const [depositAmount, setDepositAmount] = useState<number>();
  const [depositId, setDepositId] = useState<number>();

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
      calldata: [depositId, depositAmount, 0],
    },
  });

  const withdrawDeposit = async () => {
    console.log(`${depositAmount} ${depositId} ${diamondAddress}`);
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
    setDepositAmount,
    depositAmount,
  };
};

export default useWithdrawDeposit;
