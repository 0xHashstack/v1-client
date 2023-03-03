import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { Modal, Form, Row, Navbar } from "reactstrap";
import arrowDown from "../../assets/images/ArrowDownDark.svg";
import arrowUp from "../../assets/images/ArrowUpDark.svg";
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
import {
  useConnectors,
  useAccount,
  useTransactionManager,
  useBlock,
} from "@starknet-react/core";
import "react-toastify/dist/ReactToastify.css";
import "./header.module.scss";
import Image from "next/image";
import { useDisconnect } from "wagmi";
import EthWalletButton from "./ethConnectWalletButton";
import { TabContext } from "../../hooks/contextHooks/TabContext";
import OffchainAPI from "../../services/offchainapi.service";
import { toast } from "react-toastify";

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
  const { transactions } = useTransactionManager();
  const [selectLanguage, setSelectLanguage] = useState(false);
  const [connectWallet, setConnectWallet] = useState(false);
  const { available, connect } = useConnectors();
  const [dropDownArrow, setDropDownArrow] = useState(arrowDown);
  const [languageChosen, setLanguageChosen] = React.useState("English");
  const [settingDropDown, setSettingDropDown] = useState(false);
  const [dropDownOpen, setdropDownOpen] = useState(false);
  const [liquidateDropDown, setLiquidateDropDown] = useState(false);
  const [offchainCurrentBlock, setOffchainCurrentBlock] = useState("");
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

  const { data: blockInfo } = useBlock();
  const states = ["1", "2", "3", "4", "5", "7"];

  // Context Hook For Tabcontex
  const { customActiveTab, toggleCustom } = useContext(TabContext);

  const [network, setNetwork] = useState("Select Network");

  const { address: account } = useAccount();

  const { disconnect } = useDisconnect();
  const { address: evmAddress } = useAccount();

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }
  const toggleDropdown = () => {
    setdropDownOpen(!dropDownOpen);
    setDropDownArrow(dropDownOpen ? arrowDown : arrowUp);
    // disconnectEvent(), connect(connector);
  };

  useEffect(() => {
    console.log("here");
    if (
      transactions.length > 0 &&
      transactions[transactions.length - 1]?.status === "ACCEPTED_ON_L2"
    ) {
      toast.success(`Token received!`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
    }

    OffchainAPI.getDashboardStats().then(
      (stats) => {
        setOffchainCurrentBlock(stats.lastProcessedBlock?.blockNumber);
      },
      (err) => {
        console.error(err);
      }
    );

    console.log("transactions:::::::::", transactions);
  }, [transactions, blockInfo]);

  // function handleButtonConnectWallet() {
  //   setSettingDropDown(false);
  //   available.length > 0
  //     ? available.map((connector) => {
  //         setnetworkSelected({
  //           network: "Starknet",
  //           starknet: true,
  //           walletName: "Braavos",
  //           walletLogo: braavosWallet,
  //           redirectLink: "/",
  //         });
  //       })
  //     : setnetworkSelected({
  //         network: "",
  //         starknet: true,
  //         walletName: "Download Braavos",
  //         walletLogo: braavosWallet,
  //         redirectLink: "https://braavos.app/",
  //       });
  //   setNetwork("Select Network");
  //   setConnectWallet(!connectWallet);
  //   removeBodyCss();
  // }

  // const disconnectEvent = () => {
  //   if (evmAddress) {
  //     disconnect();
  //   }
  // };

  // const handleConnectBraavosWallet = () => {
  //   {
  //     available.length > 0
  //       ? available.map((connector) => {
  //           if (network === "Starknet") {
  //             disconnectEvent(), connect(connector);
  //           }
  //         })
  //       : window.open("https://braavos.app/", "_blank");
  //   }
  // };

  // const selectStarKnetNetwork = () => {
  //   {
  //     setNetwork("Starknet");
  //     setdropDownOpen(!dropDownOpen);
  //     setDropDownArrow(dropDownOpen ? arrowDown : arrowUp);
  //   }
  // };

  return (
    <div
      style={{
        overflowX: "hidden",
        backgroundColor: "#1C202F",
      }}
    >
     
      <Row>
        <Navbar
          style={{
            zIndex: "10",
            position: "fixed",
            padding: "13px 0",
            backgroundColor: "#1C202F",
            width: "100vw",
            height: "76px",
            color: "white",
            boxShadow:
              "rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px",
          }}
        >
          <div
            className="d-flex"
            style={{
              display: "flex",
              gap: "15px",
              alignItems: "center",
              height: "45px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "5px",
                marginTop: "5px",
              }}
            >
              <Link href="/">
                <div>
                  <Image src={hashstackLogo} alt="Navbar Logo" height="40px" />
                </div>
              </Link>
            </div>

            <label
              style={{
                padding: "10px",
                fontSize: "12px",
                borderRadius: "5px",
                color: "#FFF",
                cursor: "pointer",
                marginBottom: "0px",
                backgroundColor: states.includes(customActiveTab)
                  ? "#393D4F"
                  : "",
              }}
              className="button"
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={() => {
                  toggleCustom("1");
                }}
              >
                <Image
                  src={dashboardIcon}
                  alt="Picture of the author"
                  width="15px"
                  height="15px"
                  style={{ cursor: "pointer" }}
                />
                &nbsp;&nbsp;
                <span style={{ fontSize: "larger" }}>Dashboard</span>
              </span>
            </label>

            <label
              style={{
                padding: "10px",
                fontSize: "12px",
                borderRadius: "5px",
                color: "#FFF",
                cursor: "pointer",
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
                  src={contributeEarnIcon}
                  alt="Picture of the author"
                  width="15px"
                  height="15px"
                  style={{ cursor: "pointer" }}
                />
                &nbsp;&nbsp;
                <span style={{ fontSize: "larger" }}> Contribute-2-Earn </span>
              </span>
            </label>

            <label
              style={{
                padding: "10px",
                fontSize: "12px",
                borderRadius: "5px",
                color: "#FFF",
                cursor: "pointer",
                marginBottom: "0px",
                backgroundColor: customActiveTab === "6" ? "#393D4F" : "",
              }}
              className="button"
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={() => {
                  setSettingDropDown(false);
                  setConnectWalletArrowState({
                    bool: false,
                    direction: { connectWalletArrowDown },
                  });
                  setLiquidateDropDown(!liquidateDropDown);
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
                &nbsp;&nbsp; <span style={{ fontSize: "larger" }}>More </span>
              </span>
            </label>
          </div>

          <div className="d-flex flex-wrap gap-4 ">
            <div style={{ display: "flex", gap: "20px" }}>
              <label
                style={{
                  backgroundColor: "#2A2E3F",
                  padding: "13px 25px",
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
                  &nbsp;&nbsp;&nbsp;{" "}
                  <span style={{ fontSize: "larger" }}>Transfer Deposit</span>
                </span>
              </label>

              <label
                style={{
                  height: "48px",
                  backgroundColor: "#2A2E3F",
                  padding: "15px",
                  fontSize: "12px",
                  borderRadius: "5px",
                  color: "#FFF",
                  marginBottom: "0px",
                  cursor: "pointer",
                }}
                className="button"
                // onClick={() => {
                //   handleButtonConnectWallet();
                // }}
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
                        alt=""
                        src={starknetLogoBordered}
                        width="18px"
                        height="18px"
                        style={{ cursor: "pointer" }}
                      />
                      <div style={{ fontSize: "larger" }}>
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
                      setLiquidateDropDown(false);
                      setSettingDropDown(false);
                      setConnectWallet(false);
                      setConnectWalletArrowState({
                        bool: !connectWalletArrowState.bool,
                        direction: { connectWalletArrowDown },
                      });
                    }}
                    src={connectWalletArrowDown}
                    alt="Picture of the author"
                    width="14px"
                    height="14px"
                    style={{ cursor: "pointer" }}
                  />
                </span>
              </label>
              <Image
                onClick={() => {
                  setLiquidateDropDown(false);
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
      {liquidateDropDown ? (
        <label
          style={{
            zIndex: "1000",
            backgroundColor: "#1D2130",
            position: "absolute",
            top: "56px",
            left: "535px",
            padding: "10px",
            cursor: "pointer",
            color: "white",
            fontSize: "13px",
          }}
          onClick={() => {
            toggleCustom("6");
            setLiquidateDropDown(false);
          }}
        >
          <img src="./money-recive.svg" style={{ marginRight: "5px  " }} />
          Liquidate
        </label>
      ) : null}
      {account && connectWalletArrowState.bool ? (
        <div style={{ zIndex: "1000" }}>
          <div
            style={{
              position: "absolute",
              top: "73px",
              right: "83px",
              backgroundColor: "#1D2131",
              width: "195px",
              height: "150px",
              borderRadius: "5px",
              boxShadow: "0px 0px 10px rgb(57, 61, 79)",
              zIndex: "1000",
            }}
          >
            <div
              style={{
                display: "block",
                padding: "10px 12px",
                fontSize: "10.5px",
              }}
            >
              <button
                style={{
                  marginLeft: "100px",
                  marginBottom: "10px",
                  padding: "7px 6px",
                  borderRadius: "5px",
                  backgroundColor: "rgb(57, 61, 79)",
                  color: "white",
                  border: "none",
                }}
                onClick={handleDisconnectWallet}
              >
                Disconnect
              </button>
              <br />
              <button
                style={{
                  marginLeft: "89px",
                  padding: "7px 6px",
                  borderRadius: "5px",
                  backgroundColor: "rgb(57, 61, 79)",
                  color: "white",
                  border: "none",
                }}
              >
                Switch Wallet
              </button>
            </div>
            <hr style={{ margin: "0 10px" }} />
            <div>
              <div
                style={{
                  position: "absolute",
                  right: "1.5vw",
                  bottom: "10px",
                  color: "#636779",
                  textAlign: "right",
                }}
              >
                Network
                <br />
                <div
                  style={{
                    color: "white",
                    marginRight: "-15px",
                    display: "flex",
                    gap: "5px",
                  }}
                >
                  <img src="./green.svg" />
                  {/* <div>{networkSelected.network} </div> */}
                  <div> Starknet </div>
                  <Image
                    src={dropDownArrow}
                    alt="Picture of the author"
                    width="14px"
                    height="14px"
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
      {settingDropDown && !selectLanguage ? (
        <div style={{ zIndex: "1000" }}>
          <div
            style={{
              position: "absolute",
              top: "75px",
              right: "20px",
              backgroundColor: "#1D2131",
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
              <div style={{ marginLeft: "11px", color: "white" }}>
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
              top: "75px",
              right: "20px",
              backgroundColor: "#1C202F",
              width: "195px",
              height: "500px",
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
              style={{ marginLeft: "10px", color: "white", fontSize: "12px" }}
            >
              {languages.map((language) => {
                let str = language.name.split(" ");
                return (
                  <>
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
                    <hr style={{ width: "95%" }} />
                  </>
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
