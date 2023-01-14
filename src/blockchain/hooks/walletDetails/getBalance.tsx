import * as React from "react";
import { useBalance } from "wagmi";
import { useContract, useStarknetCall } from "@starknet-react/core";
import Moralis from "moralis";
import { useContractRead } from "wagmi";
import {
  diamondAddress,
  ERC20Abi,
  getTokenFromAddress,
  getTokenFromName,
  isTransactionLoading,
  tokenAddressMap,
} from "../../stark-constants";
import { Abi } from "starknet/types";
import { uint256 } from "starknet";
import { erc20ABI } from "wagmi";

const GetBalance = (
  starknetTokenAddress: string,
  evmTokenAddress: string,
  account: string
) => {
  const [balance, setBalance] = React.useState("");
  const [wallet, setWallet] = React.useState("");
  const [token, setToken] = React.useState("");

  const { contract } = useContract({
    abi: ERC20Abi as Abi,
    address: starknetTokenAddress as string,
  });

  const hexToDecimal = (hex: any) => parseInt(hex, 16);

  // contract call to get balance
  const response = useContractRead({
    address: `0x${evmTokenAddress.slice(2, 42)}`,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [`0x${account.slice(2, 42)}`], // we will pass tghe account address here
    // args: ["0x6426114c0c3531d90ed8b9f7c09a0dc115f4aaee"],
  });

  // call to contract for decimals parsing
  const parse = useContractRead({
    address: `0x${evmTokenAddress.slice(2, 42)}`,
    abi: erc20ABI,
    functionName: "decimals",
  });

  const {
    data: dataBalance,
    loading: loadingBalance,
    error: errorBalance,
    refresh: refreshBalance,
  } = useStarknetCall({
    contract: contract,
    method: "balanceOf",
    args: [account],
    options: {
      watch: true,
    },
  });

  React.useEffect(() => {
    if (dataBalance) {
      const balanceData =
        Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
        10 ** 18;
      setBalance(balanceData.toString());
      setToken("ETH");
      setWallet("Braavos");
    } else if (response.data) {
      const decimal: any = parse.data;
      setBalance(
        (hexToDecimal(response.data?._hex) / 10 ** decimal).toString()
      );
      setWallet("MetaMask");
    } else {
      setToken("NA");
      setWallet("NA");
      setBalance("0");
    }
  }, [dataBalance, response.data]);
  return { balance, wallet, token };
};

export default GetBalance;
