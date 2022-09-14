import React, { useState, useContext, useCallback, useEffect } from "react";
// import { Link } from "react-router-dom";
import Link from "next/link";
import { Col, Modal, Button, Form, Spinner } from "reactstrap";
// import { Web3ModalContext } from "../../contexts/Web3ModalProvider";
// import { Web3WrapperContext } from "../../contexts/Web3WrapperProvider";
// import { GetErrorText, BNtoNum } from "../../blockchain/utils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useStarknetCall,
  useStarknet,
  useConnectors,
  useStarknetInvoke,
} from "@starknet-react/core";
import { ConnectWallet } from "../wallet";

// toast.configure({ autoClose: 4000 });

const Header = ({
  handleDisconnectWallet,
  handleConnectWallet,
}: {
  handleDisconnectWallet: () => void;
  handleConnectWallet: (connector: any) => void;
}) => {
  const [get_token, setGet_token] = useState(false);
  const [isTransactionDone, setIsTransactionDone] = useState(false);
  const [currentProcessingToken, setCurrentProcessingToken] = useState(null);

  const { available, connect, disconnect } = useConnectors();
  const { account } = useStarknet();

  // useEffect(() => {
  //   setAvailabe(available);
  //   setConnect(connect);
  //   setDisconnect(disconnect);
  // }, []);

  // const handleConnectWallet = useCallback(() => {
  //   connect();
  // }, [connect]);

  async function handleGetToken(event: any) {
    // try {
    //   setIsTransactionDone(true);
    //   const tokenName = event.target.textContent;
    //   setCurrentProcessingToken(event.target.textContent);
    //   const tx1 = await wrapper?.getFaucetInstance().getTokens(tokenName);
    //   const tx = await tx1.wait();
    //   onSuccessCallback(tx.events, tokenName);
    // } catch (error) {
    //   setIsTransactionDone(false);
    //   setCurrentProcessingToken(null);
    //   toast.error(`${GetErrorText(error)}`, {
    //     position: toast.POSITION.BOTTOM_RIGHT,
    //     closeOnClick: true,
    //   });
    // }
  }

  const onSuccessCallback = (data: any, tokenName: any) => {
    // setIsTransactionDone(false);
    // setCurrentProcessingToken(null);
    // let _amount;
    // data.forEach((e) => {
    //   if (e.event == "TokensIssued") {
    //     _amount = e.args.amount.toBigInt();
    //   }
    // });
    // const amount = BNtoNum(_amount, 8);
    // toast.success(`${amount} ${tokenName} tokens Received Successfully.`, {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    //   closeOnClick: true,
    // });
  };

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  function tog_token() {
    setGet_token(!get_token);
    removeBodyCss();
  }

  console.log(available);
  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header" style={{ paddingRight: "2%" }}>
          <div className="d-flex">
            <div className="navbar-brand-box">
              {/* className="logo logo-dark" */}
              <Link href="/">
                <div>
                  <img
                    src="./main_logo.png"
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  ></img>
                  <span className="logo-sm">
                    <strong
                      style={{
                        color: "white",
                        fontSize: "22px",
                        fontWeight: "600",
                      }}
                    >
                      Hashstack
                    </strong>
                  </span>
                </div>
              </Link>
              {/* className="logo logo-light" */}
            </div>
          </div>

          <div className="d-flex flex-wrap gap-4">
            <Button
              color="light"
              outline
              className="btn-outline"
              style={{ float: "right" }}
              disabled={account === null}
              onClick={() => {
                tog_token();
              }}
            >
              Get Tokens
            </Button>
            <Modal
              isOpen={get_token}
              toggle={() => {
                tog_token();
              }}
              centered
            >
              <div className="modal-body">
                <Form>
                  <h5 style={{ textAlign: "center" }}>Get Token</h5>
                  <hr />
                  <div className="row mb-4">
                    <Col sm={3}>
                      <Button
                        className="btn-block btn-lg"
                        color="light"
                        outline
                        onClick={handleGetToken}
                      >
                        {isTransactionDone &&
                        currentProcessingToken === "BTC" ? (
                          <Spinner>Loading...</Spinner>
                        ) : (
                          "BTC"
                        )}
                      </Button>
                    </Col>
                    <Col sm={3}>
                      <Button
                        color="light"
                        className="btn-block btn-lg"
                        outline
                        onClick={handleGetToken}
                      >
                        {isTransactionDone &&
                        currentProcessingToken === "BNB" ? (
                          <Spinner>Loading...</Spinner>
                        ) : (
                          "BNB"
                        )}
                      </Button>
                    </Col>
                    <Col sm={3}>
                      <Button
                        color="light"
                        className="btn-block btn-lg"
                        outline
                        onClick={handleGetToken}
                      >
                        {isTransactionDone &&
                        currentProcessingToken === "USDC" ? (
                          <Spinner>Loading...</Spinner>
                        ) : (
                          "USDC"
                        )}
                      </Button>
                    </Col>
                    <Col sm={3}>
                      <Button
                        color="light"
                        className="btn-block btn-lg"
                        outline
                        onClick={handleGetToken}
                      >
                        {isTransactionDone &&
                        currentProcessingToken === "USDT" ? (
                          <Spinner>Loading...</Spinner>
                        ) : (
                          "USDT"
                        )}
                      </Button>
                    </Col>
                  </div>
                </Form>
              </div>
            </Modal>
            <Button
              color="light"
              outline
              className="btn-outline"
              style={{ float: "right" }}
              disabled={account === null}
              onClick={() => {
                window.open(
                  "https://discord.com/channels/907151419650482217/907151709485277214"
                );
              }}
            >
              Join Discord
            </Button>
            {account ? (
              <>
                <Button
                  color="success"
                  outline
                  className="btn-outline"
                  onClick={handleDisconnectWallet}
                >
                  <i className="fas fa-wallet font-size-16 align-middle me-2"></i>{" "}
                  Disconnect
                </Button>
              </>
            ) : (
              <ConnectWallet
                available={available}
                handleConnectWallet={handleConnectWallet}
              />
            )}
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;
