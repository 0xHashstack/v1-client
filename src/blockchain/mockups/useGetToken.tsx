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
} from "../stark-constants";

const useGetToken = ({ token }: { token: string }) => {
  console.log("get token", token);
  const [_account, setAccount] = useState<string>("");

  // useEffect(() => {
  //   console.log(number.toHex(number.toBN(number.toFelt(_account || ""))));
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

  const handleGetToken = async () => {
	try {
		const val = await Token();
    	return val;
	} catch(err) {
		console.log(err, 'err get token')
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
