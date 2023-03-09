import { Form, Modal } from "reactstrap";
import EthWalletButton from "./ethConnectWalletButton";
import Image from "next/image";
import { useAccount, useConnectors } from "@starknet-react/core";
import { useState } from "react";
import arrowDown from "../../assets/images/ArrowDownDark.svg";
import arrowUp from "../../assets/images/ArrowUpDark.svg";
import braavosWallet from "../../assets/images/braavosWallet.svg";
import crossButton from "../../assets/images/crossButton.svg";
import starknetLogo from "../../assets/images/starknetLogo.svg";
import { useDisconnect } from "wagmi";
import ethLogo from "../../assets/images/ethLogo.svg";
import ArgentXlogo from "../../assets/images/ArgentXlogo.svg"
import { useEffect } from "react";

const ConnectWalletModal = () => {
  const [connectWallet, setConnectWallet] = useState(false);
  const [dropDownOpen, setdropDownOpen] = useState(false);
  const [network, setNetwork] = useState("Select Network");
  const [dropDownArrow, setDropDownArrow] = useState(arrowDown);
  const { disconnect } = useDisconnect();
  const { address: evmAddress } = useAccount();
  const [networkSelected, setnetworkSelected] = useState({
    network: "",
    starknet: false,
    walletName: "Braavos",
    walletLogo: {},
    redirectLink: "#",
  });
  const { address: account } = useAccount();
  const { available, connect } = useConnectors();
  
  // console.log(available);

  // function handleButtonConnectWallet() {
  //   available.length > 0
  //     ? available.map((connector) => {
  //       // console.log(connector);

  //       setnetworkSelected({
  //         network: "Starknet",
  //         starknet: true,
  //         walletName: "Braavos",
  //         walletLogo: braavosWallet,
  //         redirectLink: "/",
  //       });
  //     })
  //     : setnetworkSelected({
  //       network: "",
  //       starknet: true,
  //       walletName: "Download Braavos",
  //       walletLogo: braavosWallet,
  //       redirectLink: "https://braavos.app/",
  //     });
  //   // setNetwork("Select Network");
  //   setConnectWallet(!connectWallet);
  //   // removeBodyCss();
  // }
  
  const selectStarKnetNetwork = () => {
    {
      setNetwork("Starknet");
      setdropDownOpen(!dropDownOpen);
      setDropDownArrow(dropDownOpen ? arrowDown : arrowUp);
    }
  };

  const disconnectEvent = () => {
    if (evmAddress) {
      disconnect();
    }
  };

  const toggleDropdown = () => {
    setdropDownOpen(!dropDownOpen);
    setDropDownArrow(dropDownOpen ? arrowDown : arrowUp);
    // disconnectEvent(), connect(connector);
  };

  const handleConnectBraavosWallet = () => {
    {
      available.length > 0
        ? available.map((connector, id) => {
          // console.log(id,connector.options.id);
          if (network === "Starknet" && connector.options.id === "braavos") {
            disconnectEvent(), connect(connector);
          }
        })
        : window.open("https://braavos.app/", "_blank");
    }
  };

  const handleConnectArgentXWallet = () => {
    {
      available.length > 0
        ? available.map((connector, id) => {
          // // console.log(id);
          if (network === "Starknet" && connector.options.id === "argentX") {
            disconnectEvent(), connect(connector);
          }

        })
        : window.open("https://www.argent.xyz/argent-x/", "_blank");
    }
  };
  return (
    <Modal
      isOpen={true}
      // toggle={() => {
      //   handleButtonConnectWallet();
      // }}
      centered
    >
      <div
        className="modal-body"
        style={{
          backgroundColor: "#1D2131",
          color: "white",
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
            <h4 style={{ color: "white", paddingBottom: "10px" }}>
              Connect a wallet
            </h4>
            {/* <div style={{ marginTop: "-10px", cursor: "pointer" }}>
              <Image
                onClick={() => {
                  setConnectWallet(false);
                }}
                src={crossButton}
                alt="Picture of the author"
                width="20px"
                height="20px"
              />
            </div> */}
          </span>
          <div>
            <label
              style={{
                width: "100%",
                marginBottom: "7px",
                padding: "15px 15px",
                fontSize: "18px",
                borderRadius: "5px",
                border: "1px solid #393D4F",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems:"center"
                }}>
               
                  {network === "Starknet" ? (
                    <img
                      src="./starknetconnectlogo.svg"
                      alt="Picture of the author"
                      width="22px"
                      height="22px"
                    />
                  ) : null}
                  <div style={{marginLeft: "8px"}}>{network}</div>
                </div>
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
                    width="14px"
                    height="14px"
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
                      alignItems:"center"
                    }}
                  >
                    <img
                      src="./starknetconnectlogo.svg"
                      alt="Picture of the author"
                      width="15px"
                      height="15px"
                    />
                    <div style={{ fontSize: "15px", marginTop: "1px" }}>
                      &nbsp;Starknet
                    </div>
                  </div>
                  <div style={{ display: "flex" ,alignItems:"center"}}>
                    <img
                      src="./ethconnectlogo.svg"
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
                      &nbsp;Ethereum (Coming Soon)
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
                backgroundColor: "#2A2E3F",
                width: "100%",
                marginBottom: "5px",
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
                  &nbsp; Braavos Wallet
                </div>
                <div style={{ marginRight: "10px", marginTop: "2px" }}>
                  <img
                    src="./braavosWallet.svg"
                    alt="Picture of the author"
                    width="25px"
                    height="25px"
                  />
                </div>
              </div>
            </label>

            {/*  */}
            <label
              onClick={handleConnectArgentXWallet}
              style={{
                backgroundColor: "#2A2E3F",
                width: "100%",
                marginBottom: "5px",
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
                  {/* &nbsp;{networkSelected.walletName} Wallet */}
                  &nbsp; Argent X Wallet

                </div>
                <div style={{ marginRight: "10px", marginTop: "2px" }}>
                  <img
                    src="./ArgentXlogo.svg"
                    alt="Picture of the author"
                    width="25px"
                    height="25px"
                  />
                </div>
              </div>
            </label>
            {/* </a> */}
            {
              network !== "Starknet" ? <EthWalletButton /> : null
            }

          </div>

          <p style={{ fontSize: "14px" }}>
            By connecting your wallet, you agree to Hashstack’s &nbsp;
            <br />
            <a
              href="https://braavos.app/"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#2563EB" }}
            >
              terms of service & disclaimer
            </a>
          </p>
          <p style={{ fontSize: "10px", color: "#8C8C8C" }}>
            This mainnet is currently in alpha with limitations on the maximum
            supply & borrow amount. This is done in consideration of the current
            network and liquidity constraints of the Starknet. We urge the users
            to use the dapp with caution. Hashstack will not cover any
            accidental loss of user funds.
            <br />
            <br />
            Wallets are provided by External Providers and by selecting you
            agree to Terms of those Providers. Your access to the wallet might
            be reliant on the External Provider being operational.
          </p>
        </Form>
      </div>
    </Modal>
  );
};

export default ConnectWalletModal;
