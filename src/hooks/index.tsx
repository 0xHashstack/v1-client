import { Connector, useConnectors, useStarknet } from "@starknet-react/core";
import { UseConnectors } from "@starknet-react/core/dist/providers/starknet";
import { Networks } from "../constants/networks";
// connectors: Connector[];
// available: Connector[];
// connect: (conn: Connector) => void;
// disconnect: () => void;

interface IStarknetWallet {
  connect: (conn: Connector) => void;
  disconnect: () => void;
  account: string | undefined;
  available: Connector[];
}

interface IMetamaskWallet {
  connect: string;
  disconnect: number;
}
const useAbstractedWalletConnect = (
  network: Networks
): IStarknetWallet | IMetamaskWallet => {
  if (Networks.starknet) {
    const { available, connect, disconnect } = useConnectors();
    const { account } = useStarknet();
    return { connect, disconnect, account, available };
  } else {
    const { available, connect, disconnect } = useConnectors();
    const { account } = useStarknet();
    return { connect, disconnect, account, available };
  }
};

export default useAbstractedWalletConnect;
