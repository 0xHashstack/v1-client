import {
  useConnectors,
  useStarknet,
  useStarknetExecute,
} from "@starknet-react/core";
import { useState } from "react";
import { uint256 } from "starknet";
import { tokenAddressMap, diamondAddress } from "../stark-constants";

const useDeposit = ({
  token,
  commitPeriod,
  depositAmount,
}: {
  token: string;
  commitPeriod: number;
  depositAmount: number;
}) => {
  //   const [commitPeriod, setCommitPeriod] = useState();
  //   const [depositAmount, setDepositAmount] = useState(0);
  //   const [commitPeriod, setCommitPeriod] = useState(0);

  const { available, connect, disconnect } = useConnectors();
  const { account } = useStarknet();

  const { data, loading, error, reset, execute } = useStarknetExecute({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "deposit_request",
      calldata: [tokenAddressMap[token], commitPeriod, depositAmount, 0],
    },
  });

  //   const handleDeposit = async () => {
  // let val;
  // if (token === "BTC") {
  //   val = await BTC();
  // }
  // if (token === "BNB") {
  //   val = await BNB();
  // }
  // if (token === "USDC") {
  //   val = await USDC();
  // }
  // if (token === "USDT") {
  //   val = await USDT();
  // }
  //   };

  const executeDeposit = async () => {
    await execute();
  };
  return { executeDeposit, loading, error };
};

export default useDeposit;
