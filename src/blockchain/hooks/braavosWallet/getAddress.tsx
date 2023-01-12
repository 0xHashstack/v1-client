import { useAccount, useContract } from "@starknet-react/core";
import { Abi } from "starknet/types";
import { ERC20Abi, tokenAddressMap } from "../../stark-constants";

export function getBraavosAddress() {
  const { address: account } = useAccount();
  console.log("Hello from getBraavosAddress", account);

  return account;
}
