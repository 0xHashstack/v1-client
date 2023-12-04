import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "@starknet-react/core";
import { useEffect, useState } from "react";
import { Abi, uint256 } from "starknet";
import { ERC20Abi, diamondAddress,nftAddress } from "../../stark-constants";
import { etherToWeiBN, weiToEtherNumber } from "../../utils/utils";
import { tokenAddressMap } from "@/Blockchain/utils/addressServices";
import { NativeToken, Token } from "@/Blockchain/interfaces/interfaces";
import { getNFTBalance } from "@/Blockchain/scripts/Rewards";
import { selectMessageHash, selectNftBalance, selectNftCurrentAmount, selectNftMaxAmount, selectSignature, selectUserType, selectYourSupply, setBlock } from "@/store/slices/readDataSlice";
import { useSelector } from "react-redux";
import axios from "axios";

const useDeposit = () => {
  const { address: account } = useAccount();
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [asset, setAsset] = useState<Token | any>("USDT");
  const balance=useSelector(selectNftBalance)
  const user=useSelector(selectUserType);
  const totalSupply=useSelector(selectYourSupply);
  const nftMaxAmount=useSelector(selectNftMaxAmount);
  const nftCurrentAmount=useSelector(selectNftCurrentAmount);
  // const getdata=async()=>{
  //   const balance=getNFTBalance(account || "");
  //   setbalance(balance);
  // }

  const messagehash=useSelector(selectMessageHash)
  const signature=useSelector(selectSignature)
  //   const [depositTransHash, setDepositTransHash] = useState("");

  //   const recieptData = useWaitForTransaction({ hash: depositTransHash });
  //  //console.log("useDeposit", depositAmount, asset);
  const {
    data: dataDeposit,
    error: errorDeposit,
    reset: resetDeposit,
    write: writeDeposit,
    writeAsync: writeAsyncDeposit,
    isError: isErrorDeposit,
    isIdle: isIdleDeposit,
    isSuccess: isSuccessDeposit,
    status: statusDeposit,
  } = useContractWrite({
    calls: balance==0   && user=="U1" && (depositAmount>25) && nftCurrentAmount<nftMaxAmount ?[
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
        contractAddress: nftAddress,
        entrypoint: "claim_nft",
        calldata: [
          messagehash,
          "2",
          signature?.[0],
          signature?.[1],
          tokenAddressMap["r"+asset]
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
    isSuccess: isSuccessDepositStake,
    status: statusDepositStake,
  } = useContractWrite({
    calls: balance==0 && user=="U1" && ( depositAmount>25) && nftCurrentAmount<nftMaxAmount ?[
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
        contractAddress: nftAddress,
        entrypoint: "claim_nft",
        calldata: [
          messagehash,
          "2",
          signature?.[0],
          signature?.[1],
          tokenAddressMap["r"+asset]
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
    isSuccessDeposit,
    statusDeposit,
  };
};

export default useDeposit;
