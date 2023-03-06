import { useContext, useEffect } from "react";
import { IdentifierContext } from "../../blockchain/hooks/context/identifierContext";
import useMyAccount from "../../blockchain/hooks/walletDetails/getAddress";
import GetBalance from "../../blockchain/hooks/walletDetails/getBalance";
export default function ConnectionDetails() {
  const value = useContext(IdentifierContext);

  const addressData = useMyAccount();
  // console.log("address", addressData.address);

  let data = GetBalance(
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    addressData.address
  );

  useEffect(() => {
    // console.log("address", addressData.address);
    if (value) {
      value.setState({
        walletName: `${addressData.walletName}`,
        address: `${addressData.address}`,
        balance: `${data.balance}`,
      });
    }
  }, [addressData.address, data.balance]);

  return (
    <>
      <p>Wallet: {value?.state?.walletName}</p>
      <p>Address {value?.state?.address} </p>
      <p>Balance {value?.state?.balance}</p>
    </>
  );
}
