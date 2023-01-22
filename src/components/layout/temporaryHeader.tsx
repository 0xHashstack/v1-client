import React, { useState } from "react";
import Link from "next/link";
import { Modal, Form, Row, Navbar } from "reactstrap";
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
import languageArrow from "../../assets/images/languageArrow.svg";
import settingIcon from "../../assets/images/settingIcon.svg";
import dashboardIcon from "../../assets/images/dashboardIcon.svg";
import contributeEarnIcon from "../../assets/images/contributeEarnIcon.svg";
import tickMark from "../../assets/images/tickMark.svg";
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
  const languages = [
    {
      name: "English",
      icon: require("../../assets/images/languages/unitedKingdom.svg"),
      id: 1,
    },
    {
      name: "हिंदी",
      icon: require("../../assets/images/languages/india.svg"),
      id: 2,
    },
    {
      name: "русский [Coming soon]",
      icon: require("../../assets/images/languages/russia.svg"),
      id: 3,
    },
    {
      name: "中國人 [Coming soon]",
      icon: require("../../assets/images/languages/china.svg"),
      id: 4,
    },
    {
      name: "Türk [Coming soon]",
      icon: require("../../assets/images/languages/turkey.svg"),
      id: 5,
    },
    {
      name: "日本 [Coming soon]",
      icon: require("../../assets/images/languages/japan.svg"),
      id: 6,
    },
    {
      name: "한국어 [Coming soon]",
      icon: require("../../assets/images/languages/southKorea.svg"),
      id: 7,
    },
    {
      name: "Indonesia [Coming soon]",
      icon: require("../../assets/images/languages/indonesia.svg"),
      id: 8,
    },
    {
      name: "Tiếng-Việt [Coming soon]",
      icon: require("../../assets/images/languages/vietnam.svg"),
      id: 9,
    },
  ];
  const [selectLanguage, setSelectLanguage] = useState(false);
  const [connectWallet, setConnectWallet] = useState(false);
  const { available, connect } = useConnectors();
  const [dropDownArrow, setDropDownArrow] = useState(arrowDown);
  const [languageChosen, setLanguageChosen] = React.useState("English");
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
                  backgroundColor: "#D9D9D970",
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
              {/* <label
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
              </label> */}
              <label
                style={{
                  padding: "15px",
                  fontSize: "12px",
                  borderRadius: "5px",
                  color: "#000",
                  cursor: "pointer",
                  marginRight: "100px",
                  marginBottom: "0px",
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
                width="25px"
                height="25px"
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
              <button
                style={{
                  padding: "7px 6px",
                  borderRadius: "5px",
                  backgroundColor: "#E7E7E7",
                }}
              >
                Switch Wallet
              </button>
              <button
                style={{
                  padding: "7px 6px",
                  borderRadius: "5px",
                  backgroundColor: "#E7E7E7",
                }}
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

      {settingDropDown && !selectLanguage ? (
        <div style={{ zIndex: "1000" }}>
          <div
            style={{
              position: "absolute",
              right: "20px",
              backgroundColor: "#F8F8F8",
              width: "195px",
              height: "100px",
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
              <h6 style={{ color: "#636779" }}>General Settings</h6>
            </div>
            <div>
              <div style={{ marginLeft: "11px", color: "black" }}>
                Dark Mode
                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    width: "100%",
                  }}
                >
                  Langauge
                  <div
                    style={{
                      margin: " 0.5px 8px 0 30px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      // setLanguage("English");
                      setSelectLanguage(true);
                      setSettingDropDown(false);
                    }}
                  >
                    {languageChosen}
                  </div>
                  <Image
                    src={languageArrow}
                    alt="Picture of the author"
                    width="5px"
                    height="5px"
                    style={{
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {selectLanguage ? (
        <div style={{ zIndex: "1000" }}>
          <div
            style={{
              position: "absolute",
              right: "20px",
              backgroundColor: "#F8F8F8",
              width: "195px",
              height: "300px",
              borderRadius: "5px",
              boxShadow: "0px 0px 10px #00000050",
              zIndex: "1000",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "6px",
                padding: "10px 12px",
                fontSize: "12px",
                color: "#636779",
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectLanguage(false);
                setSettingDropDown(true);
              }}
            >
              {/* <h6 style={{ color: "#636779" }}>General Settings</h6> */}
              <Image
                src={languageArrow}
                alt="Picture of the author"
                width="6px"
                height="6px"
                style={{
                  rotate: "180deg",
                  cursor: "pointer",
                }}
              />
              <div>Select Language</div>
            </div>
            <div
              style={{ marginLeft: "10px", color: "black", fontSize: "12px" }}
            >
              {languages.map((language) => {
                let str = language.name.split(" ");
                return (
                  <div
                    style={{
                      display: "flex",
                      gap: "7px",
                      marginBottom: "10px",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      src={language.icon}
                      alt="Picture of the author"
                      width="15px"
                      height="15px"
                      style={{ cursor: "pointer" }}
                    />
                    <div>{str[0]}</div>
                    {str[0] == languageChosen ? (
                      <div style={{ position: "absolute", right: "20px" }}>
                        <Image src={tickMark} />
                      </div>
                    ) : (
                      <></>
                    )}
                    {str.length > 1 ? (
                      <div style={{ fontSize: "8px", color: "#ADB5BD" }}>
                        {str[1]}&nbsp;
                        {str[2]}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SecondaryHeader;
