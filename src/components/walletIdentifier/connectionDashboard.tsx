import { useContext } from "react";
import { IdentifierContext } from "../../blockchain/hooks/context/identifierContext";
export default function ConnectionDetails() {
  const value = useContext(IdentifierContext);
  return (
    <>
      <p>Wallet: {value?.state?.walletName}</p>
      <p>Address {value?.state?.address} </p>
      <p>Balance {value?.state?.balance}</p>
    </>
  );
}
