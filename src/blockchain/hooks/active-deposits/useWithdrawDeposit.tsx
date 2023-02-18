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
import { tokenAddressMap, tokenDecimalsMap } from "../../stark-constants";
import { GetErrorText, NumToBN } from "../../utils";

const useWithdrawDeposit = (
  _token: any,
  _diamondAddress: string,
  _depositId: number,
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

  const [transWithdraw, setTransWithdraw] = useState('');

  const {
    data: dataDeposit,
    loading: loadingDeposit,
    error: errorDeposit,
    reset: resetDeposit,
    execute: executeWithdrawDep,
  } = useStarknetExecute({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "withdraw_deposit",
      calldata: [depositId, NumToBN(withdrawAmount as number, tokenDecimalsMap[token]), 0],
    },
  });

  const withdrawDeposit = async () => {
    console.log(`${withdrawAmount} ${depositId} ${diamondAddress}`);
    try {
      const val = await executeWithdrawDep();
      setTransWithdraw(val.transaction_hash);
    } catch(err) {
      console.log(err, 'withdraw deposit')
    }
  };

  return {
    withdrawDeposit,
    setWithdrawAmount,
    withdrawAmount,
    transWithdraw,
    executeWithdrawDep,
  };
};

export default useWithdrawDeposit;
