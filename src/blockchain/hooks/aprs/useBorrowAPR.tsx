import { useContract, useStarknetCall } from "@starknet-react/core";
import { Abi } from "starknet";
import {
  ComptrollerAbi,
  diamondAddress,
  tokenAddressMap,
} from "../../stark-constants";

const useBorrowAPR = (token: string, borrowCommitment: string) => {
  const { contract } = useContract({
    abi: ComptrollerAbi as Abi,
    address: diamondAddress,
  });
  const { data } = useStarknetCall({
    contract,
    method: "get_borrow_apr",
    args: [tokenAddressMap[token], borrowCommitment],
  });

  return { data };
};
export default useBorrowAPR;
