import React, { useState } from "react";
import Link from "next/link";
import { Modal, Button, Form, Row, Container, Navbar } from "reactstrap";
import arrowDown from "../../assets/images/arrowDown.svg";
import arrowUp from "../../assets/images/arrowUp.svg";
import starknetLogo from "../../assets/images/starknetLogo.svg";
import ethLogo from "../../assets/images/ethLogo.svg";
import braavosWallet from "../../assets/images/braavosWallet.svg";
import crossButton from "../../assets/images/crossButton.svg";
import "react-toastify/dist/ReactToastify.css";
import { useConnectors, useAccount } from "@starknet-react/core";
import "react-toastify/dist/ReactToastify.css";
import "./header.module.scss";
import Image from "next/image";
import { useDisconnect } from "wagmi";
import EthWalletButton from "./ethConnectWalletButton";

const SecondaryHeader = ({
  handleDisconnectWallet,
  handleConnectWallet,
}: {
  handleDisconnectWallet: () => void;
  handleConnectWallet: (connector: any) => void;
}) => {
  const [connectWallet, setConnectWallet] = useState(false);
  const { available, connect } = useConnectors();
  const [dropDownArrow, setDropDownArrow] = useState(arrowDown);
  const [dropDownOpen, setdropDownOpen] = useState(false);
  const [networkSelected, setnetworkSelected] = useState({
    starknet: false,
    walletName: "",
    walletLogo: {},
  });

  const [network, setNetwork] = useState("Select Network");

  const { address: account } = useAccount();

  const { disconnect } = useDisconnect();
  const { address: evmAddress } = useAccount();

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  function handleButtonConnectWallet() {
    setnetworkSelected({
      starknet: false,
      walletName: "",
      walletLogo: braavosWallet,
    });
    setNetwork("Select Network");
    setConnectWallet(!connectWallet);
    removeBodyCss();
  }

  const toggleDropdown = () => {
    setdropDownOpen(!dropDownOpen);
    setDropDownArrow(dropDownOpen ? arrowDown : arrowUp);
  };

  const disconnectEvent = () => {
    if (evmAddress) {
      disconnect();
    }
  };

  const selectStarKnetNetwork = () => {
    {
      available.length > 0
        ? available.map((connector) => {
            setNetwork("Starknet");
            setnetworkSelected({
              starknet: true,
              walletName: "Braavos",
              walletLogo: braavosWallet,
            });
            disconnectEvent(), connect(connector);
          })
        : null;
    }
  };
  return (
    <Container className="headerContainer">
      <Row>
        <Navbar>
          <div className="d-flex">
            <div>
              <Link href="/">
                <div>
                  <img
                    src="https://common-static-assets.s3.ap-southeast-1.amazonaws.com/1111-44.png"
                    alt=""
                    style={{
                      height: "40px",
                    }}
                  ></img>
                </div>
              </Link>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-4 ">
            <Modal
              isOpen={connectWallet}
              toggle={() => {
                handleButtonConnectWallet();
              }}
              centered
            >
              <div
                className="modal-body"
                style={{
                  backgroundColor: "white",
                  color: "#6F6F6F",
                  padding: "40px",
                }}
              >
                <Form>
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "black",
                    }}
                  >
                    <h4 style={{ color: "black", paddingBottom: "10px" }}>
                      Connect a wallet
                    </h4>
                    <div style={{ marginTop: "-10px", cursor: "pointer" }}>
                      <Image
                        onClick={() => {
                          setConnectWallet(false);
                        }}
                        src={crossButton}
                        alt="Picture of the author"
                        width="20px"
                        height="20px"
                      />
                    </div>
                  </span>
                  <div>
                    <label
                      style={{
                        width: "100%",
                        marginBottom: "10px",
                        padding: "15px 10px",
                        fontSize: "18px",
                        borderRadius: "5px",
                        border: "2px solid #00000050",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>{network}</div>
                        <div
                          style={{
                            marginRight: "20px",
                            marginTop: "3px",
                            marginBottom: "0",
                            cursor: "pointer",
                          }}
                        >
                          <Image
                            onClick={toggleDropdown}
                            src={dropDownArrow}
                            alt="Picture of the author"
                            width="20px"
                            height="20px"
                          />
                        </div>
                      </div>
                      {dropDownOpen ? (
                        <>
                          <hr />
                          <div
                            onClick={selectStarKnetNetwork}
                            style={{
                              display: "flex",
                              marginBottom: "10px",
                              cursor: "pointer",
                            }}
                          >
                            <Image
                              src={starknetLogo}
                              alt="Picture of the author"
                              width="15px"
                              height="15px"
                            />
                            <div style={{ fontSize: "15px", marginTop: "1px" }}>
                              &nbsp;Starknet
                            </div>
                          </div>
                          <div style={{ display: "flex" }}>
                            <Image
                              src={ethLogo}
                              alt="Picture of the author"
                              width="15px"
                              height="15px"
                            />
                            <div
                              style={{
                                fontSize: "15px",
                                marginTop: "1px",
                                color: "#ADB5BD",
                              }}
                            >
                              &nbsp;Ethereum (Comming Soon)
                            </div>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </label>
                    {networkSelected.starknet ? (
                      <label
                        style={{
                          backgroundColor: "#000",
                          width: "100%",
                          marginBottom: "10px",
                          padding: "15px 10px",
                          fontSize: "18px",
                          borderRadius: "5px",
                          border: "2px solid #00000050",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "15px",
                              marginTop: "6px",
                              color: "#FFF",
                            }}
                          >
                            &nbsp;{networkSelected.walletName} Wallet
                          </div>
                          <div
                            style={{ marginRight: "10px", marginTop: "2px" }}
                          >
                            <Image
                              src={braavosWallet}
                              alt="Picture of the author"
                              width="25px"
                              height="25px"
                            />
                          </div>
                        </div>
                      </label>
                    ) : (
                      <></>
                    )}
                    <EthWalletButton />
                  </div>

                  <p>
                    Don’t have a supporting wallet.{" "}
                    <a
                      href="https://braavos.app/"
                      target="_blank"
                      style={{ color: "#2563EB" }}
                    >
                      Download Braavos from here
                    </a>
                  </p>

                  <p>
                    By connecting your wallet, you agree to Hashstack’s &nbsp;
                    <br />
                    <a
                      href="https://braavos.app/"
                      target="_blank"
                      style={{ color: "#2563EB" }}
                    >
                      terms of service & disclaimer
                    </a>
                  </p>
                  <p style={{ fontSize: "10px" }}>
                    This mainnet is currently in alpha with limitations on the
                    maximum supply & borrow amount. This is done in
                    consideration of the current network and liquidity
                    constraints of the Starknet. We urge the users to use the
                    dapp with caution. Hashstack will not cover any accidental
                    loss of user funds.
                    <br />
                    <br />
                    Wallets are provided by External Providers and by selecting
                    you agree to Terms of those Providers. Your access to the
                    wallet might be reliant on the External Provider being
                    operational.
                  </p>
                </Form>
              </div>
            </Modal>

            {account ? (
              <>
                <Button
                  color="success"
                  outline
                  className="btn-outline"
                  onClick={handleDisconnectWallet}
                >
                  <i className="fas fa-wallet font-size-16 align-middle me-2"></i>{" "}
                  {`${account.substring(0, 3)}...${account.substring(
                    account.length - 3,
                    account.length
                  )}`}{" "}
                  | Disconnect
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="success"
                  outline
                  className="btn-outline"
                  onClick={() => {
                    handleButtonConnectWallet();
                  }}
                >
                  <i className="fas fa-wallet font-size-16 align-middle me-2"></i>{" "}
                  Connect Wallet
                </Button>
              </>
            )}
          </div>
        </Navbar>
      </Row>
    </Container>
  );
};

export default SecondaryHeader;
