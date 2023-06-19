import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "@starknet-react/core";
import { useEffect, useState } from "react";
import { Abi, uint256 } from "starknet";
import { ERC20Abi, diamondAddress } from "../../stark-constants";
import { etherToWeiBN, weiToEtherNumber } from "../../utils/utils";
import { tokenAddressMap } from "@/Blockchain/utils/addressServices";
import { Token } from "@/Blockchain/interfaces/interfaces";

const useDeposit = () => {
  const { address: account } = useAccount();
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [asset, setAsset] = useState<Token>("USDT");
  //   const [depositTransHash, setDepositTransHash] = useState("");

  //   const recieptData = useWaitForTransaction({ hash: depositTransHash });
  //   console.log("useDeposit", depositAmount, asset);
  const {
    data: dataDeposit,
    error: errorDeposit,
    reset: resetDeposit,
    write: writeDeposit,
    writeAsync: writeAsyncDeposit,
    isError: isErrorDeposit,
    isIdle: isIdleDeposit,
    isLoading: isLoadingDeposit,
    isSuccess: isSuccessDeposit,
    status: statusDeposit,
  } = useContractWrite({
    calls: [
      {
        contractAddress: tokenAddressMap[asset] || "",
        entrypoint: "approve",
        calldata: [
          diamondAddress,
          etherToWeiBN(depositAmount, asset).toString(),
          "0",
        ],
      },
      {
        contractAddress: diamondAddress,
        entrypoint: "deposit",
        calldata: [
          tokenAddressMap[asset],
          etherToWeiBN(depositAmount, asset).toString(),
          0,
          account,
        ],
      },
    ],
  });

  const {
    data: dataDepositStake,
    error: errorDepositStake,
    reset: resetDepositStake,
    write: writeDepositStake,
    writeAsync: writeAsyncDepositStake,
    isError: isErrorDepositStake,
    isIdle: isIdleDepositStake,
    isLoading: isLoadingDepositStake,
    isSuccess: isSuccessDepositStake,
    status: statusDepositStake,
  } = useContractWrite({
    calls: [
      {
        contractAddress: tokenAddressMap[asset] || "",
        entrypoint: "approve",
        calldata: [
          diamondAddress,
          etherToWeiBN(depositAmount, asset).toString(),
          "0",
        ],
      },
      {
        contractAddress: diamondAddress,
        entrypoint: "deposit_and_stake",
        calldata: [
          tokenAddressMap[asset],
          etherToWeiBN(depositAmount, asset).toString(),
          "0",
          account,
        ],
      },
    ],
  });

  return {
    depositAmount,
    setDepositAmount,
    asset,
    setAsset,

    dataDepositStake,
    errorDepositStake,
    resetDepositStake,
    writeAsyncDepositStake,
    isErrorDepositStake,
    isIdleDepositStake,
    isLoadingDepositStake,
    isSuccessDepositStake,
    statusDepositStake,

    dataDeposit,
    errorDeposit,
    resetDeposit,
    // depositTransHash,
    // setDepositTransHash,
    writeAsyncDeposit,
    isErrorDeposit,
    isIdleDeposit,
    isLoadingDeposit,
    isSuccessDeposit,
    statusDeposit,
  };
};

export default useDeposit;
