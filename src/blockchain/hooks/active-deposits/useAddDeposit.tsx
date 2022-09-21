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

const useAddDeposit = (_token: any, _diamondAddress: string) => {
  const { available, connect, disconnect } = useConnectors();

  const { account } = useStarknet();
  useEffect(() => {
    setToken(_token.market);
    setDiamondAddress(_diamondAddress);
  });
  const [token, setToken] = useState("");
  const [diamondAddress, setDiamondAddress] = useState("");

  const [depositMarket, setDepositMarket] = useState<string>("");
  const [depositAmount, setDepositAmount] = useState<number>();
  const [depositCommit, setDepositCommit] = useState();

  const {
    data: dataUSDC,
    loading: loadingUSDC,
    error: errorUSDC,
    reset: resetUSDC,
    execute: USDC,
  } = useStarknetExecute({
    calls: {
      contractAddress: depositMarket as string,
      entrypoint: "approve",
      calldata: [diamondAddress, NumToBN(depositAmount as number, 18), 0],
    },
  });

  const {
    data: dataUSDT,
    loading: loadingUSDT,
    error: errorUSDT,
    reset: resetUSDT,
    execute: USDT,
  } = useStarknetExecute({
    calls: {
      contractAddress: depositMarket as string,
      entrypoint: "approve",
      calldata: [diamondAddress, NumToBN(depositAmount as number, 18), 0],
    },
  });

  const {
    data: dataBNB,
    loading: loadingBNB,
    error: errorBNB,
    reset: resetBNB,
    execute: BNB,
  } = useStarknetExecute({
    calls: {
      contractAddress: depositMarket as string,
      entrypoint: "approve",
      calldata: [diamondAddress, NumToBN(depositAmount as number, 18), 0],
    },
  });

  const {
    data: dataBTC,
    loading: loadingBTC,
    error: errorBTC,
    reset: resetBTC,
    execute: BTC,
  } = useStarknetExecute({
    calls: {
      contractAddress: depositMarket as string,
      entrypoint: "approve",
      calldata: [diamondAddress, NumToBN(depositAmount as number, 18), 0],
    },
  });

  const {
    data: dataDeposit,
    loading: loadingDeposit,
    error: errorDeposit,
    reset: resetDeposit,
    execute: executeDeposit,
  } = useStarknetExecute({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "deposit_request",
      calldata: [
        tokenAddressMap[token],
        depositCommit,
        NumToBN(depositAmount as number, 18),
        0,
      ],
    },
  });

  const approveToken = async (token: string) => {
    console.log(
      `${depositAmount} ${depositCommit} ${depositMarket} ${
        tokenAddressMap[depositMarket as string] as string
      }`
    );
    let val;
    if (token === "BTC") {
      val = await BTC();
    }
    if (token === "BNB") {
      val = await BNB();
    }
    if (token === "USDC") {
      val = await USDC();
    }
    if (token === "USDT") {
      val = await USDT();
    }
  };

  // contractAddress: diamondAddress,
  // entrypoint: "deposit_request",
  // calldata: [
  //   tokenAddressMap[token],
  //   depositCommit,
  //   (depositAmount as number) * 10 ** 8,
  //   0,
  const DepositAmount = async () => {
    console.log(`${depositAmount} ${depositCommit} ${depositMarket}`);
    await executeDeposit();
    if (errorDeposit) {
      toast.error(`${GetErrorText(`Couldn't add Deposit to ${token}`)}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
      return;
    }
    toast.success(`${token} Deposited!`, {
      position: toast.POSITION.BOTTOM_RIGHT,
      closeOnClick: true,
    });
  };

  const returnTransactionParameters = (token: string) => {
    let data, loading, reset, error;
    if (token === "BTC") {
      [data, loading, reset, error] = [dataBTC, loadingBTC, resetBTC, errorBTC];
    }
    if (token === "BNB") {
      [data, loading, reset, error] = [dataBNB, loadingBNB, resetBNB, errorBNB];
    }
    if (token === "USDC") {
      [data, loading, reset, error] = [
        dataUSDC,
        loadingUSDC,
        resetUSDC,
        errorUSDC,
      ];
    }
    if (token === "USDT") {
      [data, loading, reset, error] = [
        dataUSDT,
        loadingUSDT,
        resetUSDT,
        errorUSDT,
      ];
    }
    return { data, loading, reset, error };
  };
  return {
    approveToken,
    returnTransactionParameters,
    DepositAmount,
    setDepositAmount,
    setDepositCommit,
    setDepositMarket,
  };
};

export default useAddDeposit;
