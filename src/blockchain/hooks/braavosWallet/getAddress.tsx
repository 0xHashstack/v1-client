import { useAccount } from "@starknet-react/core";

export function getBraavosAddress() {
  const { address } = useAccount();

  return address;
}
