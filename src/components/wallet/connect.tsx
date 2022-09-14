import React from "react";
import { Button } from "reactstrap";

const ConnectWallet = ({
  available,
  handleConnectWallet,
}: {
  available: any;
  handleConnectWallet: any;
}) => {
  return (
    <div>
      {available &&
        available.map((connector: any) => {
          return (
            <Button
              color="dark"
              outline
              className="btn-outline"
              onClick={() => handleConnectWallet(connector)}
              key={connector.id()}
            >
              <i className="fas fa-wallet font-size-16 align-middle me-2"></i>{" "}
              Connect to {`${connector.name()}`}
            </Button>
          );
        })}
    </div>
  );
};

export default ConnectWallet;
