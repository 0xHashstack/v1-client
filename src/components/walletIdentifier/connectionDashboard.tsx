import { useContext, useEffect } from "react";
import { IdentifierContext } from "../../blockchain/hooks/context/identifierContext";
import useMyAccount from "../../blockchain/hooks/walletDetails/getAddress";
import GetBalance from "../../blockchain/hooks/walletDetails/getBalance";
export default function ConnectionDetails() {
  const value = useContext(IdentifierContext);

  const addressData = useMyAccount();
  console.log("address", addressData.address);

  let data = GetBalance(addressData.address);
  // console.log(
  //   "data -------------------------------------------------------------",
  //   { data }
  // );

  useEffect(() => {
    console.log("address", addressData.address);
    if (value) {
      if (!addressData.address) {
        value.setState({
          walletName: `NA`,
          address: `NA`,
          balance: `NA`,
        });
        console.log(
          "address----------------------------------------------------"
        );
        console.log(value);
      }
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
