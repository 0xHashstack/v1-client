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
import { NativeToken, Token } from "@/Blockchain/interfaces/interfaces";
import { getNFTBalance } from "@/Blockchain/scripts/Rewards";
import { selectNftBalance, setBlock } from "@/store/slices/readDataSlice";
import { useSelector } from "react-redux";

const useDeposit = () => {
  const { address: account } = useAccount();
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [asset, setAsset] = useState<Token | any>("USDT");
  const balance=useSelector(selectNftBalance)
  // const getdata=async()=>{
  //   const balance=getNFTBalance(account || "");
  //   setbalance(balance);
  // }

  const [messagehash, setMessageHash] = useState("0x414620902fb859afc50b3fdc61b0de3220835a56c9c78166f57403b715b01aa");
  const [signature, setSignature] = useState<any>( [
      '2424746983344360558782209678398788868430455506784152241462455820721485810985',
      '350876922535438032489743797824407964259448734563995516217243112214147331531'
    ])
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
    calls: process.env.NEXT_PUBLIC_NODE_ENV=="mainnet" && balance==0 ?[
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
      {
        contractAddress: "0x0457f6078fd9c9a9b5595c163a7009de1d20cad7a9b71a49c199ddc2ac0f284b",
        entrypoint: "claim_soul_brand",
        calldata: [
          messagehash,
          signature,
        ],
      },
    ]:[
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
      
    ]
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
    calls:process.env.NEXT_PUBLIC_NODE_ENV=="mainnet" && balance==0 ?[
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
      {
        contractAddress: "0x0457f6078fd9c9a9b5595c163a7009de1d20cad7a9b71a49c199ddc2ac0f284b",
        entrypoint: "claim_soul_brand",
        calldata: [
          messagehash,
          signature,
        ],
      },
    ]:[
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
    ]
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
