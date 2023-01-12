import * as React from "react";
import { useAccount } from "wagmi";
import { getBraavosAddress } from "../braavosWallet/getAddress";
import { useAccount as useAccountStarknet } from "@starknet-react/core";

function useMyAccount(): string {
  console.log('GetAccount')
  const [state, setState] = React.useState("");
  const { address: evmAddress, isConnecting, isDisconnected } = useAccount();
  const { address: starknetAddress } = useAccountStarknet();

  // console.log("Hello from GetAccountt", evmAddress, starknetAddress, {final: evmAddress || starknetAddress || ""});
  const refreshState = React.useCallback(async () => {
    console.log("Hello from GetAccountt", evmAddress, starknetAddress, {final: state});
    const address = evmAddress || starknetAddress || "";
    setState(address);
  }, [setState, evmAddress, starknetAddress])

  React.useEffect(() => {
    refreshState()
  }, [refreshState])

  return state;
};

export default useMyAccount;
