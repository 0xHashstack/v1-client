import * as React from "react";
import { useAccount } from "wagmi";
import { useAccount as useAccountStarknet } from "@starknet-react/core";

function useMyAccount() {
  const [state, setState] = React.useState("NA");
  const [wallet, setWallet] = React.useState("NA");
  const { address: evmAddress, isConnecting, isDisconnected } = useAccount();
  const { address: starknetAddress } = useAccountStarknet();

  const refreshState = React.useCallback(async () => {
    // console.log("Hello from GetAccountt", evmAddress, starknetAddress, {
    //   final: state,
    // });
    const address = evmAddress || starknetAddress || "NA";
    setState(address);
    if (evmAddress) {
      setWallet("MetaMask");
    } else if (starknetAddress) {
      setWallet("Braavos");
    }
  }, [setState, evmAddress, starknetAddress]);

  React.useEffect(() => {
    refreshState();
  }, [refreshState]);

  return { address: state, walletName: wallet };
}

export default useMyAccount;
