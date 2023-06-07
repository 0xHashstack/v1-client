import React, { memo, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// import "./navbar.css";

import arrowDown from "../../../assets/images/ArrowDownDark.svg";
import arrowUp from "../../../assets/images/ArrowUpDark.svg";
import starknetLogoBordered from "../../../assets/images/starknetLogoBordered.svg";
// import transferDeposit from "../../../assets/images/transferDeposit.svg";
import languageArrow from "../../../assets/images/languageArrow.svg";
// import dashboardIcon from "/assets/images/dashboardIcon.svg";
import hoverDashboardIcon from "../../../assets/images/hoverDashboardIcon.svg";
// import contributeEarnIcon from "../../../assets/images/contributeEarnIcon.svg";
import hoverContributeEarnIcon from "../../../assets/images/hoverContributeEarnIcon.svg";
import tickMark from "../../../assets/images/tickMark.svg";
// import moreIcon from "../../../assets/images/moreIcon.svg";
import hoverMoreIcon from "../../../assets/images/hoverMoreIcon.svg";
// import stake from "../../../assets/images/stake.svg";
import hoverStake from "../../../assets/images/hoverStakeIcon.svg";
import starknetIcon from "../../../assets/images/starknetWallet.svg";
import darkModeOn from "../../../assets/images/darkModeOn.svg";
import darkModeOff from "../../../assets/images/darkModeOff.svg";
import darkModeIcon from "../../../assets/images/darkModeIcon.svg";
import darkIcon from "../../../assets/images/darkIcon.svg";
import arrowNavRight from "../../../assets/images/arrowNavRight.svg";
import arrowNavLeft from "../../../assets/images/arrowNavLeft.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentDropdown,
  selectNavDropdowns,
  setNavDropdown,
  resetModalDropdowns,
} from "@/store/slices/dropdownsSlice";
import {
  Box,
  Button,
  Center,
  HStack,
  LinkOverlay,
  Skeleton,
  Text,
  background,
  useOutsideClick,
} from "@chakra-ui/react";
import {
  selectAccount,
  selectLanguage,
  setLanguage,
} from "@/store/slices/userAccountSlice";
import {
  useAccount,
  useConnectors,
  useStarknet,
  useBlock,
} from "@starknet-react/core";
// import useOutsideClickHandler from "../../../utils/functions/clickOutsideDropdownHandler";
import { languages } from "@/utils/constants/languages";
import { useRouter } from "next/router";
import { type } from "os";
const Navbar = () => {
  const dispatch = useDispatch();
  const navDropdowns = useSelector(selectNavDropdowns);
  const language = useSelector(selectLanguage);
  const [parsedAccount, setParsedAccount] = useState<any>();
  const currentDropdown = useSelector(selectCurrentDropdown);
  const { account } = useAccount();
  console.log(account, "Navbar");
  // useEffect(() => {
  //   const storedAccount = localStorage.getItem("account");
  //   if (storedAccount) {
  //     setParsedAccount(JSON.parse(storedAccount));
  //   }
  //   // console.log("Sahitya account",typeof account.address)
  //   console.log("Sahitya", parsedAccount);
  // }, []);
  const [dashboardHover, setDashboardHover] = useState(false);
  const [contibutionHover, setContibutionHover] = useState(false);
  const [transferDepositHover, setTransferDepositHover] = useState(false);
  const [stakeHover, setStakeHover] = useState(false);
  const [connected, setConnected] = useState(true);
  const { available, disconnect, connect, connectors } = useConnectors();
  const handleDropdownClick = (dropdownName: string) => {
    dispatch(setNavDropdown(dropdownName));
  };
  const [justifyContent, setJustifyContent] = useState("flex-start");
  const [toggleDarkMode, setToggleDarkMode] = useState(true);
  const toggleMode = () => {
    setJustifyContent(
      justifyContent === "flex-start" ? "flex-end" : "flex-start"
    );
  };
  const moreOptions = ["Liquidations", "Dummy1", "Dummy2", "Dummy3"];
  const walletConnectionDropdown = ["Disconnect", "Switch wallet"];

  const { connector } = useAccount();

  const router = useRouter();
  const { pathname } = router;

  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref: ref1,
    handler: (e) => {
      if (
        ref1.current &&
        ref2.current &&
        !ref1.current.contains(e.target as Node) &&
        !ref2.current.contains(e.target as Node) &&
        currentDropdown != ""
      ) {
        dispatch(setNavDropdown(""));
      }
    },
  });
  useOutsideClick({
    ref: ref2,
    handler: (e) => {
      if (
        ref1.current &&
        ref2.current &&
        !ref1.current.contains(e.target as Node) &&
        !ref2.current.contains(e.target as Node) &&
        currentDropdown != ""
      ) {
        dispatch(setNavDropdown(""));
      }
    },
  });

  const switchWallet = () => {
    console.log(connector);
    if (connector?.options?.id == "braavos") {
      connect(connectors[1]);
    } else {
      connect(connectors[0]);
    }
  };

  return (
    <HStack
      zIndex="10"
      position="fixed"
      pt={"4px"}
      backgroundColor="#161B22"
      width="100vw"
      boxShadow="rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      color="#FFF"
      height="3.8125rem"
      className="navbar"
    >
      <HStack
        display="flex"
        // bgColor={"red"}
        justifyContent={"flex-start"}
        alignItems="center"
        width="60%"
        gap={"4px"}
        marginLeft="2rem"
      >
        <Link href={router.pathname != "/waitlist" ? "/market" : "/waitlist"}>
          <Box
            height="100%"
            display="flex"
            alignItems="center"
            minWidth={"140px"}
            marginRight="1.4em"
          >
            <Image
              src="./hashstackLogo.svg"
              alt="Navbar Logo"
              height="32"
              width="140"
            />
          </Box>
        </Link>

        <Box
          padding="16px 12px"
          fontSize="14px"
          borderRadius="5px"
          cursor="pointer"
          marginBottom="0px"
          className="button"
          color={`${pathname == "/market" ? "#6e7681" : "white"}`}
          _hover={{
            color: `${router.pathname != "/waitlist" ? "#6e7681" : ""}`,
          }}
          onClick={() => {
            if (router.pathname != "/waitlist") {
              router.push("/market");
            }
          }}
          onMouseEnter={() => setDashboardHover(true)}
          onMouseLeave={() => setDashboardHover(false)}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap={"8px"}
          >
            {router.pathname != "/market" ? (
              dashboardHover ? (
                <Image
                  src={hoverDashboardIcon}
                  alt="Picture of the author"
                  width="16"
                  height="16"
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <Image
                  src={"./dashboardIcon.svg"}
                  alt="Picture of the author"
                  width="16"
                  height="16"
                  style={{ cursor: "pointer" }}
                />
              )
            ) : (
              <Image
                src={hoverDashboardIcon}
                alt="Picture of the author"
                width="16"
                height="16"
                style={{ cursor: "pointer" }}
              />
            )}

            <Text fontSize="14px">Dashboard</Text>
          </Box>
        </Box>
        <Box
          padding="16px 12px"
          fontSize="12px"
          borderRadius="5px"
          cursor="pointer"
          marginBottom="0px"
          // className="button"
          // backgroundColor={"blue"}
          _hover={{ color: "#6e7681" }}
          onMouseEnter={() => setContibutionHover(true)}
          onMouseLeave={() => setContibutionHover(false)}
        >
          <Link href="https://hashstack.crew3.xyz/questboard" target="_blank">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              gap={"8px"}
            >
              {contibutionHover ? (
                <Image
                  src={hoverContributeEarnIcon}
                  alt="Picture of the author"
                  width="16"
                  height="16"
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <Image
                  src={"./contributeEarnIcon.svg"}
                  alt="Picture of the author"
                  width="16"
                  height="16"
                  style={{ cursor: "pointer" }}
                />
              )}

              <Text fontSize="14px">Contribute-2-Earn</Text>
            </Box>
          </Link>
        </Box>
        <Box
          padding="16px 12px"
          fontSize="12px"
          borderRadius="5px"
          cursor="pointer"
          marginBottom="0px"
          // className="button"
          _hover={{
            color: `${router.pathname != "/waitlist" ? "#6e7681" : ""}`,
          }}
          onMouseEnter={() => setStakeHover(true)}
          onMouseLeave={() => setStakeHover(false)}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap={"8px"}
          >
            {router.pathname != "/waitlist" && stakeHover ? (
              <Image
                src={hoverStake}
                alt="Picture of the author"
                width="16"
                height="16"
                style={{ cursor: "pointer" }}
              />
            ) : (
              <Image
                src="./stake.svg"
                alt="Picture of the author"
                width="16"
                height="16"
                style={{ cursor: "pointer" }}
              />
            )}
            <Text fontSize="14px">Stake</Text>
          </Box>
        </Box>
        {/* <Box
          style={{
            padding: "3px 0px",
            fontSize: "12px",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "0px",
            display: "flex",
            flexDirection: "column",
            // backgroundColor: "#393D4F",
          }}
          className="button navbar"
          onClick={() => handleDropdownClick("moreButtonDropdown")}
          _hover={{ color: "#6e7681" }}
          // ref={ref}
        >
          <span
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            className="navbar-button"
          >
            {" "}
            <Image
              src={"./moreIcon.svg"}
              alt="Picture of the author"
              width="20"
              height="20"
              style={{ cursor: "pointer" }}
            />
            &nbsp;&nbsp; <span style={{ fontSize: "larger" }}>More </span>
          </span>
          {navDropdowns.moreButtonDropdown && (
            <div
              style={{
                width: "200%",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                gap: "7px",
                padding: "0.5rem 0",
              }}
              className="dropdown-container"
            >
              {moreOptions.map((val, idx) => {
                return (
                  <div
                    key={idx}
                    style={{
                      width: "100%",
                      textAlign: "center",
                      backgroundColor: `${idx == 0 ? "#0366d6" : "none"}`,
                    }}
                  >
                    {val}
                  </div>
                );
              })}
            </div>
          )}
        </Box> */}
      </HStack>
      <HStack
        width="40%"
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
      >
        <HStack
          display="flex"
          gap="6px"
          justifyContent="center"
          alignItems="center"
          marginRight="1rem"
        >
          <Box
            borderRadius="6px"
            cursor="pointer"
            margin="0"
            height="2rem"
            // border="0.5px solid #6e6e6e"
            border={`0.5px solid ${
              router.pathname != "/waitlist" && transferDepositHover
                ? "#6e6e6e"
                : "#FFF"
            }`}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap="3"
            className="button"
            // color="#6E6E6E"
            color={
              router.pathname != "/waitlist" && transferDepositHover
                ? "#6e6e6e"
                : "#FFF"
            }
            // _hover={{ color: "#010409", bgColor: "#f6f8fa" }}
            onMouseEnter={() => setTransferDepositHover(true)}
            onMouseLeave={() => setTransferDepositHover(false)}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              gap="8px"
              margin="6px 12px"
            >
              {/* <Image
                src={"./transferDepositDisabled.svg"}
                alt="Picture of the author"
                width="20"
                height="20"
                style={{ cursor: "pointer" }}
              /> */}
              {router.pathname == "/waitlist" || !transferDepositHover ? (
                <Image
                  src={"./transferDeposit.svg"}
                  alt="Picture of the author"
                  width="20"
                  height="20"
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <Image
                  src={"./transferDepositDull.svg"}
                  alt="Picture of the author"
                  width="20"
                  height="20"
                  style={{ cursor: "pointer" }}
                />
              )}
              <Text fontSize="14px" lineHeight="14px">
                Transfer Deposit
              </Text>
            </Box>
          </Box>

          <Box
            fontSize="12px"
            color="#FFF"
            // width="13rem"
            height="2rem"
            cursor="pointer"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap="1px"
            flexGrow="1"
            className="button navbar"
            ref={ref2}
          >
            <Box
              backgroundColor="#2DA44E"
              display="flex"
              border="0.5px solid #57606A"
              borderRadius="6px"
              flexDirection="row"
              paddingY="6px"
              pr="2.2rem"
              pl="1rem"
              justifyContent="flex-start"
              alignItems="center"
              width="100%"
              height="100%"
              // bgColor="blue"
              className="navbar-button"
              onClick={() => {
                dispatch(setNavDropdown("walletConnectionDropdown"));
              }}
            >
              {account ? (
                <Box
                  // bgColor="red"
                  width="100%"
                  // gap={1}
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                  // pl={5}
                  gap={2.5}
                >
                  <Image
                    // onClick={() => {
                    //   setConnectWallet(false);
                    // }}
                    alt=""
                    src={"./starknetLogoBordered.svg"}
                    width="16"
                    height="16"
                    style={{ cursor: "pointer" }}
                  />
                  <Text
                    fontSize="14px"
                    fontWeight="500"
                    color="#FFFFFF"
                    lineHeight="20px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    // bgColor="blue"
                  >
                    {/* {`${account.substring(0, 3)}...${account.substring(
                      account.length - 10,
                      account.length
                    )}`}{" "} */}
                    {`${account.address.substring(
                      0,
                      3
                    )}...${account.address.substring(
                      account.address.length - 9,
                      account.address.length
                    )}`}{" "}
                  </Text>
                </Box>
              ) : (
                <>
                  {/* <Text
                    fontSize="14px"
                    width="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems={"center"}
                    // bgColor={"red"}
                  >
                    Connect Wallet
                  </Text> */}
                  <Skeleton width="7rem" height="100%" borderRadius="2px" />
                  {/* 8.25rem */}
                </>
              )}
              <Box position="absolute" right="0.7rem">
                {!navDropdowns.walletConnectionDropdown ? (
                  <Image
                    src={"./connectWalletArrowDown.svg"}
                    alt="arrow"
                    width="16"
                    height="16"
                    style={{
                      cursor: "pointer",
                    }}
                  />
                ) : (
                  <Image
                    src={"./connectWalletArrowDown.svg"}
                    alt="arrow"
                    width="16"
                    height="16"
                    style={{
                      cursor: "pointer",
                    }}
                  />
                )}
              </Box>
            </Box>
            {navDropdowns.walletConnectionDropdown && (
              <Box
                width="100%"
                display="flex"
                justifyContent="center"
                flexDirection="column"
                alignItems="flex-end"
                gap="7px"
                padding="0.5rem 0"
                boxShadow="1px 2px 8px rgba(0, 0, 0, 0.5), 4px 8px 24px #010409"
                borderRadius="6px"
                className="dropdown-container"
              >
                {account ? (
                  // walletConnectionDropdown.map((val, idx) => {
                  //   return (
                  <>
                    <Box
                      // key={idx}
                      padding="4px 11px"
                      marginRight="8px"
                      borderRadius="6px"
                      border="1px solid #2B2F35"
                      onClick={() => {
                        dispatch(setNavDropdown(""));
                        disconnect();
                        localStorage.setItem("lastUsedConnector", "");
                        // localStorage.setItem("account", "");

                        router.push("./");
                      }}
                    >
                      Disconnect
                    </Box>
                    <Box
                      // key={idx}
                      padding="4px 11px"
                      marginRight="8px"
                      borderRadius="6px"
                      border="1px solid #2B2F35"
                      onClick={() => {
                        dispatch(setNavDropdown(""));
                        switchWallet();
                        // disconnect();
                        // router.push("./");
                      }}
                    >
                      Switch Wallet
                    </Box>
                  </>
                ) : (
                  //   );
                  // })
                  <Box
                    padding="4px 11px"
                    marginRight="8px"
                    borderRadius="6px"
                    border="1px solid #2B2F35"
                    onClick={() => {
                      // alert("hey");
                      connect(connectors[1]);
                      console.log("navbar", account);
                      // localStorage.setItem("account", JSON.stringify(account));
                    }}
                  >
                    Connect
                  </Box>
                )}
                {/* <hr />
                <div>
                  <div>Network</div>
                  <div></div>
                </div> */}
                <hr
                  style={{
                    height: "1px",
                    borderWidth: "0",
                    backgroundColor: "#2B2F35",
                    width: "96%",
                    marginRight: "5px",
                    // marginLeft: "10px",
                  }}
                />
                <Box marginRight="14px">
                  <Text float="right">Network</Text>
                  <Box
                    color="white"
                    // backgroundColor: "blue",
                    // marginRight: "-15px",
                    // marginLeft: "50px",
                    display="flex"
                    width="100%"
                    justifyContent="flex-end"
                    alignItems="center"
                    gap="5px"
                    marginRight="10px"
                  >
                    <Image
                      src="./green.svg"
                      alt="Picture of the author"
                      height="6"
                      width="6"
                    />
                    Ethereum Goerli
                    {/* <img
                    src={`${dropDownArrow}`}
                    alt="Picture of the author"
                    width="14px"
                    height="14px"
                    style={{
                      marginTop: "3px",
                      cursor: "pointer",
                    }}
                  /> */}
                    <Image
                      src={"./connectWalletArrowDown.svg"}
                      alt="arrow"
                      width="16"
                      height="16"
                      style={{
                        cursor: "pointer",
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
          <Box
            borderRadius="6px"
            width="fit-content"
            padding="1px"
            cursor="pointer"
            // border: "0.5px solid #57606A",
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap="8px"
            flexGrow="1"
            className="button navbar"
            ref={ref1}

            // onClick={() => {
            //   handleButtonConnectWallet();
            // }}
            // onClick={() => {
            //   setLiquidateDropDown(false);
            //   setSettingDropDown(false);
            //   setConnectWallet(false);
            //   setConnectWalletArrowState({
            //     bool: !connectWalletArrowState.bool,
            //     direction: "./connectWalletArrowDown.svg",
            //   });
            // }}
          >
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              className="navbar-button"
              mr="0.5rem"
              onClick={() => {
                dispatch(setNavDropdown("settingsDropdown"));
              }}
            >
              <Image
                // onClick={() => {
                //   setLiquidateDropDown(false);
                //   setSettingDropDown(!settingDropDown);
                //   setConnectWalletArrowState({
                //     bool: false,
                //     direction: "./connectWalletArrowDown.svg",
                //   });
                // }}
                src="./settingIcon.svg"
                alt="Picture of the author"
                width="18"
                height="18"
                style={{
                  cursor: "pointer",
                }}
              />
            </Box>
            {navDropdowns.settingsDropdown && (
              <Box
                style={{}}
                width="10rem"
                display="flex"
                justifyContent="center"
                flexDirection="column"
                alignItems="flex-start"
                gap="7px"
                padding="0.5rem 0"
                boxShadow="1px 2px 8px rgba(0, 0, 0, 0.5), 4px 8px 24px #010409"
                borderRadius="6px"
                right="0px"
                top="140%"
                className="dropdown-container"
                // bgColor="white"
              >
                <Text
                  color="#6e7681"
                  fontSize="12px"
                  // textAlign="left"
                  paddingX="8px"
                >
                  General settings
                </Text>
                <HStack
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  // backgroundColor="red"
                  width={"100%"}
                  paddingX="8px"
                >
                  <Text fontSize="14px">Dark mode</Text>
                  {/* <Box
                    // height="fit-content"
                    display="flex"
                    // padding="0.5px"
                    justifyContent={`${justifyContent}`}
                    alignItems="flex-start"
                    backgroundColor="#060c20"
                    width="3rem"
                    borderRadius="100px"
                    onClick={toggleMode}
                  > */}
                  <Box
                    onClick={() => setToggleDarkMode(!toggleDarkMode)}
                    // bgColor="blue"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Image
                      src={toggleDarkMode ? darkModeOn : darkModeOff}
                      alt="Picture of the author"
                      width="44"
                      height="22"
                      style={{ cursor: "pointer" }}
                    />
                  </Box>
                  {/* </Box> */}
                </HStack>
                {/* <hr />
                <div>
                  <div>Network</div>
                  <div></div>
                </div> */}
                <hr
                  style={{
                    height: "1px",
                    borderWidth: "0",
                    backgroundColor: "#2B2F35",
                    width: "96%",
                    marginRight: "5.1px",
                    // marginLeft: "10px",
                  }}
                />
                <HStack
                  display="flex"
                  justifyContent="space-around"
                  alignItems="center"
                  padding="2px 6px"
                  gap="1.5rem"
                >
                  <Text
                    fontStyle="normal"
                    fontWeight="400"
                    fontSize="14px"
                    lineHeight="20px"
                  >
                    Language
                  </Text>
                  {/* <HStack
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    // bgColor="red"
                    // width="35%"
                  > */}
                  <Text
                    fontSize={"12px"}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    onClick={() => {
                      dispatch(setNavDropdown("languagesDropdown"));
                    }}
                  >
                    {language}
                    <Image
                      src={arrowNavRight}
                      alt="Picture of the author"
                      width="16"
                      height="16"
                      style={{ cursor: "pointer" }}
                    />
                  </Text>
                  {/* </HStack> */}
                </HStack>
              </Box>
            )}
            {navDropdowns.languagesDropdown && (
              <Box
                width="16rem"
                display="flex"
                justifyContent="center"
                flexDirection="column"
                alignItems="flex-start"
                gap="15px"
                // padding: "0.5rem 0",
                boxShadow="1px 2px 8px rgba(0, 0, 0, 0.5), 4px 8px 24px #010409"
                borderRadius="6px"
                right="0px"
                top="140%"
                padding="0.7rem 0.6rem"
                // backgroundColor: "red",
                className="dropdown-container"
              >
                <Text
                  fontSize={"12px"}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  onClick={() => {
                    dispatch(setNavDropdown("settingsDropdown"));
                  }}
                  gap="8px"
                  padding="0.5rem 0.7rem"
                  color="#6E7681"
                >
                  <Image
                    src={arrowNavLeft}
                    alt="Picture of the author"
                    width="7"
                    height="7"
                    style={{ cursor: "pointer" }}
                  />
                  Select Language
                </Text>
                {languages.map((val, idx) => (
                  <>
                    <HStack
                      color="#6e7681"
                      fontSize="12px"
                      paddingX="8px"
                      key={idx}
                      justifyContent="space-between"
                      // backgroundColor="red"
                      width="100%"
                      onClick={() => {
                        if (!val.name.includes("Coming soon"))
                          dispatch(setLanguage(`${val.name}`));
                      }}
                    >
                      <Box
                        display={"flex"}
                        justifyContent={"flex-start"}
                        gap={4}
                        alignItems={"center"}
                      >
                        <Image
                          src={val.icon}
                          alt="Picture of the author"
                          width="20"
                          height="20"
                          style={{ cursor: "pointer" }}
                        />
                        <Text>{val.name}</Text>
                      </Box>
                      {language === val.name && (
                        <Image
                          src={tickMark}
                          alt="Picture of the author"
                          width="15"
                          height="15"
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </HStack>
                    <hr
                      style={{
                        height: "1px",
                        borderWidth: "0",
                        backgroundColor: "#2B2F35",
                        width: "95%",
                        marginLeft: "6px",
                        color: "#2A2E3F",
                        display: `${
                          idx == languages.length - 1 ? "none" : "block"
                        }`,
                      }}
                    />
                  </>
                ))}
              </Box>
            )}
          </Box>
        </HStack>
      </HStack>
    </HStack>
  );
};

export default memo(Navbar);
