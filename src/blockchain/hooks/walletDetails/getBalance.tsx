import * as React from "react";
import { useBalance } from "wagmi";
import { useContract, useStarknetCall } from "@starknet-react/core";
import GetAccount from "./getAddress";
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

const GetBalance = (account: any) => {
  const [balance, setBalance] = React.useState("");
  const [wallet, setWallet] = React.useState("");
  const [token, setToken] = React.useState("");

  const { data } = useBalance({
    address: account,
  });

  const { contract } = useContract({
    abi: ERC20Abi as Abi,
    address: account as string,
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

  console.log("account", account);
  console.log("dataBalance", dataBalance);

  React.useEffect(() => {
    console.log(
      "drone-------------------------------------------------------",
      data
    );
    if (dataBalance) {
      const balanceData =
        Number(uint256.uint256ToBN(dataBalance ? dataBalance[0] : 0)) /
        10 ** 18;
      setBalance(balanceData.toString());
      setToken("ETH");
      setWallet("Braavos");
    } else if (data) {
      setBalance(data.formatted);
      setToken(data.symbol);
      setWallet("MetaMask");
    } else {
      setToken("NA");
      setWallet("NA");
      setBalance("0");
    }
  }, [dataBalance, data]);
  return { balance, wallet, token };
};

export default GetBalance;
