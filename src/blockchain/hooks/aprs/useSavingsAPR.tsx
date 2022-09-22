import { useContract, useStarknetCall } from "@starknet-react/core";
import { Abi } from "starknet";
import {
  ComptrollerAbi,
  diamondAddress,
  tokenAddressMap,
} from "../../stark-constants";

const useSavingsAPR = (token: string) => {
  const { contract } = useContract({
    abi: ComptrollerAbi as Abi,
    address: diamondAddress,
  });
  const { data, loading, error, refresh } = useStarknetCall({
    contract,
    method: "get_savings_apr",
    args: [tokenAddressMap[token], "1"],
  });

  return { data, loading, error, refresh };
};
export default useSavingsAPR;
