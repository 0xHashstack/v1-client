import {
  useAccount,
  useConnectors,
  useStarknet,
  useStarknetExecute,
} from "@starknet-react/core";
import { useEffect, useState } from "react";
import {
  tokenAddressMap,
  diamondAddress,
  contractsEnv,
  getTokenFromName,
  getTokenFromAddress,
} from "../stark-constants";
import { TxToastManager } from "../txToastManager";

const useGetToken = ({ token }: { token: string }) => {
  // console.log("get token", token);
  const [_account, setAccount] = useState<string>("");

  // useEffect(() => {
  //   // console.log(number.toHex(number.toBN(number.toFelt(_account || ""))));
  //   setAccount(number.toHex(number.toBN(number.toFelt(_account || ""))));
  // }, [account]);

  const {
    data: dataToken,
    loading: loadingToken,
    error: errorToken,
    reset: resetToken,
    execute: Token,
  } = useStarknetExecute({
    calls: {
      contractAddress: contractsEnv.FAUCET_ADDRESS as string,
      entrypoint: "get_tokens",
      calldata: [token],
    },
  });

  // useEffect(() => {
  //   // TxToastManager.handleTxToast(`Mint Testnet tokens: ${token}`);
  //   // console.log(errorToken);
  // }, [errorToken]);

  const handleGetToken = async () => {
    try {
      const val = await Token();
      return val;
    } catch (err) {
      TxToastManager.nonTransactionToast(
        `Failed to mint Testnet token: ${getTokenFromAddress(token).name}`,
        "error",
        "REJECTED"
      );
      // console.log(err, "err get token");
    }
  };

  const returnTransactionParameters = () => {
    return {
      data: dataToken,
      loading: loadingToken,
      reset: resetToken,
      error: errorToken,
    };
  };
  return { handleGetToken, returnTransactionParameters };
};

export default useGetToken;
