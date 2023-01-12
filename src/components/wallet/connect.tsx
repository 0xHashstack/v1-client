// import { Connector } from '@starknet-react/core';
import { useConnectors } from "@starknet-react/core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect } from "react";

import { Button } from "reactstrap";
import { useContext } from "react";
import { IdentifierContext } from "../../blockchain/hooks/context/identifierContext";
import getAddress from "../../blockchain/hooks/evmWallets/getAddress";
import GetBalance from "../../blockchain/hooks/evmWallets/getBalance";

const ConnectWallet = () => {
  let value = useContext(IdentifierContext);
  // let address =
  //   "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
  let address = getAddress();
  console.log("address", address);
  let data = GetBalance(address);

  const handleWallet = async () => {
    if (value) {
      value.setState({
        walletName: `${data.wallet}`,
        address: `${address}`,
        balance: `${data.balance} ${data.token}`,
      });
    }
  };

  const { available, connect } = useConnectors();

  useEffect(() => {
    console.log(available);
    handleWallet();
  }, [data]);
  return (
    <div>
      {available.length > 0 ? (
        available.map((connector) => {
          return (
            <>
              <Button
                color="dark"
                outline
                className="btn-outline"
                style={{
                  margin: "18px",
                }}
                onClick={(e) => {
                  connect(connector);
                }}
                key={connector.id()}
              >
                <i className="fas fa-wallet font-size-16 align-middle me-2"></i>{" "}
                Connect to {`${connector.name()}`}
              </Button>
              <Button
                color="dark"
                style={{
                  margin: "10px",
                  border: "none",
                  backgroundColor: "transparent",
                }}
              >
                <ConnectButton />
              </Button>
            </>
          );
        })
      ) : (
        <Button
          color="dark"
          outline
          className="btn-outline"
          onClick={() => {
            window.open("https://braavos.app/download/");
          }}
          // onClick={(e) => {
          //   toast.error(
          //     `${GetErrorText(
          //       `Please install a compatible wallet such as ArgentX, Braavos. Try again`
          //     )}`,
          //     {
          //       position: toast.POSITION.BOTTOM_RIGHT,
          //       closeOnClick: true,
          //     }
          //   );
          // }}
        >
          <i className="fas fa-wallet font-size-16 align-middle me-2"></i>{" "}
          Download Braavos Wallet
        </Button>
      )}
    </div>
  );
};

export default ConnectWallet;
