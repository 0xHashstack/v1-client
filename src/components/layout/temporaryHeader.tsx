import React, { useState } from "react";
import Link from "next/link";
import { Modal, Button, Form, Row, Container, Navbar } from "reactstrap";
import arrowDown from "../../assets/images/arrowDown.svg";
import arrowUp from "../../assets/images/arrowUp.svg";
import starknetLogo from "../../assets/images/starknetLogo.svg";
import ethLogo from "../../assets/images/ethLogo.svg";
import braavosWallet from "../../assets/images/braavosWallet.svg";
import crossButton from "../../assets/images/crossButton.svg";
import hashstackLogo from "../../assets/images/hashstackLogo.svg";
import connectWalletArrowDown from "../../assets/images/connectWalletArrowDown.svg";
import starknetLogoBordered from "../../assets/images/starknetLogoBordered.svg";
import transferDeposit from "../../assets/images/transferDeposit.svg";
import spendLoans from "../../assets/images/spendLoans.svg";
import settingIcon from "../../assets/images/settingIcon.svg";
import dashboardIcon from "../../assets/images/dashboardIcon.svg";
import contributeEarnIcon from "../../assets/images/contributeEarnIcon.svg";
import moreIcon from "../../assets/images/moreIcon.svg";
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
  const [settingDropDown, setSettingDropDown] = useState(false);
  const [dropDownOpen, setdropDownOpen] = useState(false);
  const [networkSelected, setnetworkSelected] = useState({
    network: "",
    starknet: false,
    walletName: "Braavos",
    walletLogo: {},
    redirectLink: "#",
  });
  const [connectWalletArrowState, setConnectWalletArrowState] = useState({
    bool: false,
    direction: { connectWalletArrowDown },
  });

  const [network, setNetwork] = useState("Select Network");

  const { address: account } = useAccount();

  const { disconnect } = useDisconnect();
  const { address: evmAddress } = useAccount();

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  function handleButtonConnectWallet() {
    setSettingDropDown(false);
    available.length > 0
      ? available.map((connector) => {
          setnetworkSelected({
            network: "Etherium Goerli",
            starknet: true,
            walletName: "Braavos",
            walletLogo: braavosWallet,
            redirectLink: "/",
          });
        })
      : setnetworkSelected({
          network: "",
          starknet: true,
          walletName: "Download Braavos",
          walletLogo: braavosWallet,
          redirectLink: "https://braavos.app/",
        });
    setNetwork("Select Network");
    setConnectWallet(!connectWallet);
    removeBodyCss();
  }

  const toggleDropdown = () => {
    setdropDownOpen(!dropDownOpen);
    setDropDownArrow(dropDownOpen ? arrowDown : arrowUp);
    // disconnectEvent(), connect(connector);
  };

  const disconnectEvent = () => {
    if (evmAddress) {
      disconnect();
    }
  };

  const handleConnectBraavosWallet = () => {
    {
      available.length > 0
        ? available.map((connector) => {
            if (network === "Starknet") {
              disconnectEvent(), connect(connector);
            }
          })
        : window.open("https://braavos.app/", "_blank");
    }
  };

  const selectStarKnetNetwork = () => {
    {
      setNetwork("Starknet");
      setdropDownOpen(!dropDownOpen);
      setDropDownArrow(dropDownOpen ? arrowDown : arrowUp);
    }
  };
  return (
    // <Container className="headerContainer">
    <div style={{ overflowX: "hidden" }}>
      <Row>
        <Navbar style={{ backgroundColor: "#FFF", width: "100%" }}>
          <div className="d-flex">
            <div>
              <Link href="/">
                <div>
                  <Image
                    src={hashstackLogo}
                    alt="Navbar Logo"
                    style={{ marginLeft: "20px" }}
                    height="40px"
                  />
                </div>
              </Link>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-4 ">
            <Modal
              isOpen={connectWallet && !account}
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

                    {/* <a href={networkSelected.redirectLink} target=""> */}
                    <label
                      onClick={handleConnectBraavosWallet}
                      style={{
                        backgroundColor: "#000",
                        width: "100%",
                        marginBottom: "10px",
                        padding: "15px 10px",
                        fontSize: "18px",
                        borderRadius: "5px",
                        border: "2px solid #00000050",
                        cursor: "pointer",
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
                        <div style={{ marginRight: "10px", marginTop: "2px" }}>
                          <Image
                            src={braavosWallet}
                            alt="Picture of the author"
                            width="25px"
                            height="25px"
                          />
                        </div>
                      </div>
                    </label>
                    {/* </a> */}
                    <EthWalletButton />
                  </div>

                  {/* <p>
                    Don’t have a supporting wallet.{" "}
                    <a
                      href="https://braavos.app/"
                      target="_blank"
                      style={{ color: "#2563EB" }}
                    >
                      Download Braavos from here
                    </a>
                  </p> */}

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

            <div style={{ display: "flex", gap: "20px" }}>
              <label
                style={{
                  padding: "15px",
                  fontSize: "12px",
                  borderRadius: "5px",
                  color: "#000",
                  cursor: "pointer",
                  margin: "0",
                }}
                className="button"
              >
                <span
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  <Image
                    src={dashboardIcon}
                    alt="Picture of the author"
                    width="15px"
                    height="15px"
                    style={{ cursor: "pointer" }}
                  />
                  &nbsp;&nbsp;Dashboard
                </span>
              </label>{" "}
              <label
                style={{
                  padding: "15px",
                  fontSize: "12px",
                  borderRadius: "5px",
                  color: "#000",
                  cursor: "pointer",
                  margin: "0",
                }}
                className="button"
              >
                <span
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  <Image
                    src={contributeEarnIcon}
                    alt="Picture of the author"
                    width="15px"
                    height="15px"
                    style={{ cursor: "pointer" }}
                  />
                  &nbsp;&nbsp;Contribute-2-Earn
                </span>
              </label>{" "}
              <label
                style={{
                  padding: "15px",
                  fontSize: "12px",
                  borderRadius: "5px",
                  color: "#000",
                  cursor: "pointer",
                  margin: "0",
                }}
                className="button"
              >
                <span
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  <Image
                    src={spendLoans}
                    alt="Picture of the author"
                    width="15px"
                    height="15px"
                    style={{ cursor: "pointer" }}
                  />
                  &nbsp;&nbsp;Spend Loan
                </span>
              </label>
              <label
                style={{
                  padding: "15px",
                  fontSize: "12px",
                  borderRadius: "5px",
                  color: "#000",
                  cursor: "pointer",
                  margin: "0",
                }}
                className="button"
              >
                <span
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  <Image
                    src={moreIcon}
                    alt="Picture of the author"
                    width="15px"
                    height="15px"
                    style={{ cursor: "pointer" }}
                  />
                  &nbsp;&nbsp;More
                </span>
              </label>
              <label
                style={{
                  backgroundColor: "#000",
                  padding: "15px",
                  fontSize: "12px",
                  borderRadius: "5px",
                  color: "#FFF",
                  cursor: "pointer",
                  margin: "0",
                }}
                className="button"
              >
                <span
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  <Image
                    // onClick={() => {
                    //   setConnectWallet(false);
                    // }}
                    src={transferDeposit}
                    alt="Picture of the author"
                    width="15px"
                    height="15px"
                    style={{ cursor: "pointer" }}
                  />
                  &nbsp;&nbsp;&nbsp;Transfer Deposit
                </span>
              </label>
              <label
                style={{
                  backgroundColor: "#000",
                  padding: "15px",
                  fontSize: "12px",
                  borderRadius: "5px",
                  color: "#FFF",
                  marginBottom: "0px",
                  cursor: "pointer",
                }}
                className="button"
                onClick={() => {
                  handleButtonConnectWallet();
                }}
              >
                <span
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {account ? (
                    <>
                      &nbsp;
                      <Image
                        // onClick={() => {
                        //   setConnectWallet(false);
                        // }}
                        src={starknetLogoBordered}
                        width="18px"
                        height="18px"
                        style={{ cursor: "pointer" }}
                      />
                      <div>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        {`${account.substring(0, 3)}...${account.substring(
                          account.length - 10,
                          account.length
                        )}`}{" "}
                        &nbsp;&nbsp;&nbsp;
                      </div>
                    </>
                  ) : (
                    <>
                      {" "}
                      <span
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        Connect Wallet&nbsp;&nbsp;&nbsp;
                      </span>
                    </>
                  )}
                  <Image
                    onClick={() => {
                      setConnectWallet(false);
                      setConnectWalletArrowState({
                        bool: !connectWalletArrowState.bool,
                        direction: { connectWalletArrowDown },
                      });
                    }}
                    src={connectWalletArrowDown}
                    alt="Picture of the author"
                    width="15px"
                    height="15px"
                    style={{ cursor: "pointer" }}
                  />
                </span>
              </label>
              <Image
                onClick={() => {
                  setSettingDropDown(!settingDropDown);
                  setConnectWalletArrowState({
                    bool: false,
                    direction: { connectWalletArrowDown },
                  });
                }}
                src={settingIcon}
                alt="Picture of the author"
                width="30px"
                height="30px"
                style={{
                  cursor: "pointer",
                  // marginRight: "10px",
                }}
              />
              <div></div>
            </div>
          </div>
        </Navbar>
      </Row>
      {/* // </Container> */}
      {account && connectWalletArrowState.bool ? (
        <div style={{ zIndex: "1000" }}>
          <div
            style={{
              position: "absolute",
              right: "65px",
              backgroundColor: "#E7E7E7",
              width: "195px",
              height: "110px",
              borderRadius: "5px",
              boxShadow: "0px 0px 10px #00000050",
              zIndex: "1000",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 12px",
                gap: "2px",
                fontSize: "10.5px",
              }}
            >
              <button style={{ padding: "7px 6px", borderRadius: "5px" }}>
                Switch Wallet
              </button>
              <button
                style={{ padding: "7px 6px", borderRadius: "5px" }}
                onClick={handleDisconnectWallet}
              >
                Disconnect
              </button>
            </div>
            <hr style={{ margin: "0 10px" }} />
            <div>
              <div
                style={{
                  position: "absolute",
                  right: "0.7vw",
                  bottom: "10px",
                  color: "#636779",
                  textAlign: "right",
                }}
              >
                Network
                <br />
                <div style={{ color: "#000" }}>{networkSelected.network}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}

      {settingDropDown ? (
        <>
          <div style={{ zIndex: "1000" }}>
            <div
              style={{
                position: "absolute",
                right: "30px",
                backgroundColor: "#E7E7E7",
                width: "195px",
                height: "110px",
                borderRadius: "5px",
                boxShadow: "0px 0px 10px #00000050",
                zIndex: "1000",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  gap: "2px",
                  fontSize: "10.5px",
                }}
              >
                <button style={{ padding: "7px 6px", borderRadius: "5px" }}>
                  Switch Wallet
                </button>
                <button
                  style={{ padding: "7px 6px", borderRadius: "5px" }}
                  onClick={handleDisconnectWallet}
                >
                  Disconnect
                </button>
              </div>
              <hr style={{ margin: "0 10px" }} />
              <div>
                <div
                  style={{
                    position: "absolute",
                    right: "0.7vw",
                    bottom: "10px",
                    color: "#636779",
                    textAlign: "right",
                  }}
                >
                  Network
                  <br />
                  <div style={{ color: "#000" }}>{networkSelected.network}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SecondaryHeader;
