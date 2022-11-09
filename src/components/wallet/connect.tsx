// import { Connector } from '@starknet-react/core';
import { useStarknet, useConnectors } from "@starknet-react/core";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import { GetErrorText } from "../../blockchain/utils";

const ConnectWallet = () => {
  const { available, connect } = useConnectors();
  useEffect(() => {
    console.log(available);
  });
  return (
    <div>
      {available.length > 0 ? (
        available.map((connector) => {
          return (
            <Button
              color="dark"
              outline
              className="btn-outline"
              style={{
                margin: '18px'
              }}
              onClick={(e) => connect(connector)}
              key={connector.id()}
            >
              <i className="fas fa-wallet font-size-16 align-middle me-2"></i>{" "}
              Connect to {`${connector.name()}`}
            </Button>
          );
        })
      ) : (
        <Button
          color="dark"
          outline
          className="btn-outline"
          onClick={() => {
                      window.open(
                        "https://braavos.app/download/"
                      );
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
