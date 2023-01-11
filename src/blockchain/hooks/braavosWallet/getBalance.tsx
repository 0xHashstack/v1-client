import { useBlock } from "@starknet-react/core";

export function getBraavosBalance() {
  const { data } = useBlock({
    refetchInterval: false,
    blockIdentifier: "latest",
  });

  return data;
}
