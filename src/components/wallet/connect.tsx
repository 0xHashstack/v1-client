// import { Connector } from '@starknet-react/core';
import { useConnectors } from "@starknet-react/core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import React from "react";
import { Button } from "reactstrap";

const ConnectWallet = () => {
  const { disconnect } = useDisconnect();
  const { address: evmAddress } = useAccount();

  const disconnectEvent = () => {
    if (evmAddress) {
      disconnect();
    }
  };

  const { available, connect } = useConnectors();
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
                  disconnectEvent(), connect(connector);
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
