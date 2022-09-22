import { useContract, useStarknetCall } from "@starknet-react/core";
import { Abi } from "starknet";
import {
  ComptrollerAbi,
  diamondAddress,
  tokenAddressMap,
} from "../../stark-constants";

const useSavingsAPR = (token: string, depositCommitment: string) => {
  const { contract } = useContract({
    abi: ComptrollerAbi as Abi,
    address: diamondAddress,
  });
  const { data } = useStarknetCall({
    contract,
    method: "get_savings_apr",
    args: [tokenAddressMap[token], depositCommitment],
  });

  return { data };
};
export default useSavingsAPR;
