import * as React from "react";
import { useAccount } from "wagmi";
import { getBraavosAddress } from "../braavosWallet/getAddress";
import { useAccount as useAccountStarknet } from "@starknet-react/core";

const GetAccount = () => {
  const [userAddress, setUserAddress] = React.useState("");
  const { address, isConnecting, isDisconnected } = useAccount();
  const meta = address;

  // const braavos = getBraavosAddress();
  const starknetAccount = useAccountStarknet();

  React.useEffect(() => {
    console.log("starknetaccount", starknetAccount);
  }, [starknetAccount]);
  // React.useEffect(() => {
  //   console.log("Hello from GetAccount");
  //   console.log(meta, braavos);
  //   if (meta) {
  //     setUserAddress(meta);
  //   } else if (braavos) {
  //     setUserAddress(braavos);
  //   } else {
  //     setUserAddress("");
  //   }
  // }, [meta, star]);
  return userAddress;
};

export default GetAccount;
