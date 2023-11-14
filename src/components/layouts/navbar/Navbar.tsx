import React, { memo, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

// import "./navbar.css";

// import transferDeposit from "../../../assets/images/transferDeposit.svg";
// import dashboardIcon from "/assets/images/dashboardIcon.svg";
import hoverDashboardIcon from "../../../assets/images/hoverDashboardIcon.svg";
// import contributeEarnIcon from "../../../assets/images/contributeEarnIcon.svg";
import hoverContributeEarnIcon from "../../../assets/images/hoverContributeEarnIcon.svg";
import tickMark from "../../../assets/images/tickMark.svg";
// import moreIcon from "../../../assets/images/moreIcon.svg";
// import stake from "../../../assets/images/stake.svg";
import hoverStake from "../../../assets/images/hoverStakeIcon.svg";
import darkModeOn from "../../../assets/images/darkModeOn.svg";
import darkModeOff from "../../../assets/images/darkModeOff.svg";
import arrowNavRight from "../../../assets/images/arrowNavRight.svg";
import arrowNavLeft from "../../../assets/images/arrowNavLeft.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentDropdown,
  selectNavDropdowns,
  setNavDropdown,
} from "@/store/slices/dropdownsSlice";
import {
  Box,
  HStack,
  Skeleton,
  Text,
  useOutsideClick,
} from "@chakra-ui/react";
import {
  selectAccountAddress,
  selectLanguage,
  setAccountReset,
  setLanguage,
} from "@/store/slices/userAccountSlice";
import {
  useAccount,
  useConnectors,
} from "@starknet-react/core";
// import useOutsideClickHandler from "../../../utils/functions/clickOutsideDropdownHandler";
import { languages } from "@/utils/constants/languages";
import { useRouter } from "next/router";
import GetTokensModal from "@/components/modals/getTokens";
import StakeUnstakeModal from "@/components/modals/StakeUnstakeModal";
import { Coins } from "../dashboardLeft";
import mixpanel from "mixpanel-browser";
import {
  resetState,
  selectCurrentNetwork,
  selectNftBalance,
  selectUserType,
  selectWhiteListed,
  selectYourBorrow,
  selectYourSupply,

} from "@/store/slices/readDataSlice";
import { AccountInterface, ProviderInterface } from "starknet";
interface ExtendedAccountInterface extends AccountInterface {
  provider?: {
    chainId: string;
  };
}
const Navbar = ({ validRTokens }: any) => {
  const dispatch = useDispatch();
  const navDropdowns = useSelector(selectNavDropdowns);
  const language = useSelector(selectLanguage);
  const currentDropdown = useSelector(selectCurrentDropdown);
  const { account } = useAccount();
  const currentChainId = useSelector(selectCurrentNetwork);
  ////console.log(account, "Navbar");
  // useEffect(() => {
  //   const storedAccount = localStorage.getItem("account");
  //   if (storedAccount) {
  //     setParsedAccount(JSON.parse(storedAccount));
  //   }
  //   ////console.log("Sahitya account",typeof account.address)
  //  //console.log("Sahitya", parsedAccount);
  // }, []);
  const [dashboardHover, setDashboardHover] = useState(false);
  const [campaignHover, setCampaignHover] = useState(false);
  const [contibutionHover, setContibutionHover] = useState(false);
  const [transferDepositHover, setTransferDepositHover] = useState(false);
  const [stakeHover, setStakeHover] = useState(false);
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
  const totalBorrow=useSelector(selectYourBorrow);
  const totalSupply=useSelector(selectYourSupply)
  

  const { connector } = useAccount();

  const router = useRouter();
  const { pathname } = router;
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_KEY || "", {
    debug: true,
    track_pageview: true,
    persistence: "localStorage",
  });
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const nftBalance:any=useSelector(selectNftBalance);
  // useEffect(() => {
  //   if(address && address!=accountAddress)
  //   {

  //   }
  // }, [address]);

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
    // const walletConnected = localStorage.getItem("lastUsedConnector");
    ////console.log(connector);
    if (connector?.options?.id == "braavos") {
      dispatch(resetState(null));
      dispatch(setAccountReset(null));
      localStorage.setItem("lastUsedConnector", "argentX");
      localStorage.setItem("connected", "argentX");
      connect(connectors[1]);
      router.push("/v1/market");
    } else {
      dispatch(resetState(null));
      dispatch(setAccountReset(null));
      localStorage.setItem("lastUsedConnector", "braavos");
      localStorage.setItem("connected", "braavos");
      connect(connectors[0]);
      router.push("/v1/market");
    }
  };
  const extendedAccount = account as ExtendedAccountInterface;
  const [isCorrectNetwork, setisCorrectNetwork] = useState(true);
  const {  address, status, isConnected } = useAccount();

  const [whitelisted, setWhitelisted] = useState(true)
  const [uniqueToken, setUniqueToken] = useState("")
  const [referralLinked, setRefferalLinked] = useState(false)
  const userType=useSelector(selectUserType)
const [Render, setRender] = useState(true);
const userWhitelisted=useSelector(selectWhiteListed);
  useEffect(() => {
    function isCorrectNetwork() {
      const walletConnected = localStorage.getItem("lastUsedConnector");
      const network = process.env.NEXT_PUBLIC_NODE_ENV;

      if (walletConnected == "braavos") {
        if (network == "testnet") {
          return (
            // account?.baseUrl?.includes("https://alpha4.starknet.io") ||
            // account?.provider?.baseUrl?.includes("https://alpha4.starknet.io")
            extendedAccount.provider?.chainId == process.env.NEXT_PUBLIC_TESTNET_CHAINID
          );
        } else {
          return (
            // account?.baseUrl?.includes("https://alpha4.starknet.io") ||
            // account?.provider?.baseUrl?.includes("https://alpha4.starknet.io")
            extendedAccount.provider?.chainId == process.env.NEXT_PUBLIC_MAINNET_CHAINID
          );
        }
      } else if (walletConnected == "argentX") {
        // Your code here
        if (network == "testnet") {
          return (
            // account?.baseUrl?.includes("https://alpha4.starknet.io") ||
            // account?.provider?.baseUrl?.includes("https://alpha4.starknet.io")

            extendedAccount.provider?.chainId === process.env.NEXT_PUBLIC_TESTNET_CHAINID
          );
        } else {
          return (
            // account?.baseUrl?.includes("https://alpha4.starknet.io") ||
            // account?.provider?.baseUrl?.includes("https://alpha4.starknet.io")

            extendedAccount.provider?.chainId === process.env.NEXT_PUBLIC_MAINNET_CHAINID
          );
        }
      }
      ////console.log("starknetAccount", account?.provider?.chainId);
    }

    const isWhiteListed = async () => {
      try {
        if (!address) {
          return;
        }
        const url = `https://hstk.fi/is-whitelisted/${address}`;
        const response = await axios.get(url);
        setWhitelisted(response.data?.isWhitelisted);

      } catch (err) {
       //console.log(err, "err in whitelist")
      }
    }
    isWhiteListed()
    
   
    if ((account && !isCorrectNetwork())) {
        setRender(false);
    } else {
      if(!userWhitelisted){
        setRender(false);
      }else{
        setRender(true);
      }
    }
  }, [account,whitelisted,userWhitelisted,referralLinked]);
  const [allowedReferral, setAllowedReferral] = useState(false)
  useEffect(()=>{
    const fetchUsers=async()=>{
      const res=await axios.get('https://hstk.fi/api/get-interactive-addresses')
      const fetched=res?.data.includes(address);
      setAllowedReferral(fetched)
    }
    fetchUsers();
  },[address])
  return (
    <HStack
      zIndex="100"
      pt={"4px"}
      background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
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
        <Link
          href={
            router.pathname != "/v1/waitlist" ? "/v1/market" : "/v1/waitlist"
          }
        >
          <Box
            height="100%"
            display="flex"
            alignItems="center"
            minWidth={"140px"}
            marginRight="1.4em"
          >
            <Image
              src="/hashstackLogo.svg"
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
          color={pathname !== "/v1/campaign" && pathname !== "/v1/referral" ? "#00D395" : "#676D9A"}
          // _hover={{
          //   color: `${router.pathname != "/waitlist" ? "#6e7681" : ""}`,
          // }}
          onClick={() => {
            if (router.pathname != "/waitlist") {
              router.push("/v1/market");
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
            {router.pathname == "/v1/campaign" || router.pathname=="/v1/referral" ? (
                <Image
                  src={hoverDashboardIcon}
                  alt="Picture of the author"
                  width="16"
                  height="16"
                  style={{ cursor: "pointer" }}
                />
            ) : (
              <Image
              src={"/dashboardIcon.svg"}
              alt="Picture of the author"
              width="16"
              height="16"
              style={{ cursor: "pointer" }}
            />
            )}

            <Text fontSize="14px">Dashboard</Text>
          </Box>
        </Box>
        {userType=="U1" ?
       <Box
          padding="16px 12px"
          fontSize="12px"
          borderRadius="5px"
          cursor={Render ? "pointer" :"not-allowed"}
          marginBottom="0px"
          // className="button"
          // backgroundColor={"blue"}
          _hover={{ color: "#6e7681" }}
          onMouseEnter={() => setContibutionHover(true)}
          onMouseLeave={() => setContibutionHover(false)}
        >
            <Box
              display="flex"
              justifyContent="space-between"
              cursor={Render ? "pointer" :"not-allowed"}
              alignItems="center"
              gap={"8px"}
              color={`${pathname == "/v1/referral" ? "#00D395" : "#676D9A"}`}
              onClick={()=>{
                Render && router.push('/v1/referral')
              }}
            >
              {pathname=="/v1/referral" ? (
                <Image
                  src={hoverContributeEarnIcon}
                  alt="Picture of the author"
                  width="16"
                  height="16"
                  style={{ cursor: Render ? "pointer" :"not-allowed"}}

                />
              ) : (
                <Image
                  src={"/contributeEarnIcon.svg"}
                  alt="Picture of the author"
                  width="16"
                  height="16"
                  style={{ cursor: Render ? "pointer" :"not-allowed"}}

                />
              )}

              <Text fontSize="14px">Referral</Text>
            </Box>
        </Box>
        :
        (totalBorrow>0 || totalSupply>0) ?
        <Box
        padding="16px 12px"
        fontSize="12px"
        borderRadius="5px"
        cursor={Render ? "pointer" :"not-allowed"}
        marginBottom="0px"
        // className="button"
        // backgroundColor={"blue"}
        _hover={{ color: "#6e7681" }}
        onMouseEnter={() => setContibutionHover(true)}
        onMouseLeave={() => setContibutionHover(false)}
      >
          <Box
            display="flex"
            justifyContent="space-between"
            cursor={Render ? "pointer" :"not-allowed"}
            alignItems="center"
            gap={"8px"}
            color={`${pathname == "/v1/referral" ? "#00D395" : "#676D9A"}`}
            onClick={()=>{
              Render && router.push('/v1/referral')
            }}
          >
            {pathname=="/v1/referral" ? (
              <Image
                src={hoverContributeEarnIcon}
                alt="Picture of the author"
                width="16"
                height="16"
                style={{ cursor: Render ? "pointer" :"not-allowed"}}

              />
            ) : (
              <Image
                src={"/contributeEarnIcon.svg"}
                alt="Picture of the author"
                width="16"
                height="16"
                style={{ cursor: Render ? "pointer" :"not-allowed"}}

              />
            )}

            <Text fontSize="14px">Referral</Text>
          </Box>
      </Box>:<></>
        }
   {     <Box
          padding="16px 12px"
          fontSize="12px"
          borderRadius="5px"
          cursor={Render ? "pointer" :"not-allowed"}
          marginBottom="0px"
          // className="button"
          _hover={{
            color: `${router.pathname != "/waitlist" ? "#6e7681" : ""}`,
          }}
          onMouseEnter={() => setStakeHover(true)}
          onMouseLeave={() => setStakeHover(false)}
          onClick={() => {
            mixpanel.track("Stake Button Clicked Navbar", {
              Clicked: true,
            });
          }}
        >
          {/* <Box
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
                src="/stake.svg"
                alt="Picture of the author"
                width="16"
                height="16"
                style={{ cursor: "pointer" }}
              />
            )}
            <Box fontSize="14px">
              <Box position="relative" display="inline-block">
                <StakeUnstakeModal coin={Coins} nav={true} stakeHover={stakeHover} />
              </Box>
            </Box>
          </Box> */}
          <StakeUnstakeModal
            coin={Coins}
            isCorrectNetwork={Render}
            nav={true}
            stakeHover={stakeHover}
            setStakeHover={setStakeHover}
            validRTokens={validRTokens}
          />
        </Box>}
        {/* {currentChainId == process.env.NEXT_PUBLIC_MAINNET_CHAINID ?        <Box
          padding="16px 12px"
          fontSize="12px"
          borderRadius="5px"
          cursor="pointer"
          marginBottom="0px"
          // className="button"
          // backgroundColor={"blue"}
          color={`${pathname == "/v1/campaign" ? "#00D395" : "#676D9A"}`}
          _hover={{ color: "#6e7681" }}
          onMouseEnter={() => setCampaignHover(true)}
          onMouseLeave={() => setCampaignHover(false)}
          onClick={()=>{router.push('/v1/campaign')}}
        >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              gap={"8px"}
            >
              {pathname == "/v1/campaign" ? (
                <Image
                  src={hoverStake}
                  alt="Picture of the author"
                  width="16"
                  height="16"
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <Image
                  src={"/stake.svg"}
                  alt="Picture of the author"
                  width="16"
                  height="16"
                  style={{ cursor: "pointer" }}
                />
              )}

              <Text fontSize="14px" >Campaign</Text>
            </Box>
        </Box>:""} */}

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
              src={".moreIcon.svg"}
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
        width="50%"
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
      >
        <HStack
          display="flex"
          gap="8px"
          justifyContent="center"
          alignItems="center"
          marginRight="1.2rem"
        >
          {process.env.NEXT_PUBLIC_NODE_ENV=="mainnet" ?"":          <GetTokensModal
            buttonText="Get Tokens"
            height={"2rem"}
            fontSize={"14px"}
            lineHeight="14px"
            padding="6px 12px"
            border="1px solid #676D9A"
            // borderColor="#B1B05"
            // bgColor="#101216"
            bgColor="transparent"
            _hover={{ bg: "white", color: "black" }}
            borderRadius={"6px"}
            color="#E6EDF3"
            backGroundOverLay="rgba(244, 242, 255, 0.5)"
          />}

          {/* <Box
            borderRadius="6px"
            cursor={Render ? "pointer" :"not-allowed"}
            margin="0"
            height="2rem"
            border="1px solid #676D9A"
            // border={`0.5px solid ${
            //   router.pathname != "/waitlist" && transferDepositHover
            //     ? "#6e6e6e"
            //     : "#FFF"
            // }`}
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
            // onMouseEnter={() => setTransferDepositHover(true)}
            // onMouseLeave={() => setTransferDepositHover(false)}
          >
            {/* <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              gap="8px"
              margin="6px 12px"
            >
              <Image
                src={"/transferDepositDisabled.svg"}
                alt="Picture of the author"
                width="20"
                height="20"
                style={{ cursor: Render ? "pointer" : "not-allowed" }}

              />
              {/* {router.pathname == "/waitlist" || !transferDepositHover ? (
                <Image
                  src={"/transferDeposit.svg"}
                  alt="Picture of the author"
                  width="20"
                  height="20"
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <Image
                  src={"/transferDepositDull.svg"}
                  alt="Picture of the author"
                  width="20"
                  height="20"
                  style={{ cursor: "pointer" }}
                />
              )} */}
              {/* <Text fontSize="14px" lineHeight="14px" color="#676D9A">
                {"Transfer Deposit"}
              </Text>
            </Box>  */}
          {/* </Box>  */}

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
              // backgroundColor="#2DA44E"
              display="flex"
              border="1px solid var(--secondary, #00D395)"
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
                    src={"/starknetLogoBordered.svg"}
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
                    src={"/connectWalletArrowDown.svg"}
                    alt="arrow"
                    width="16"
                    height="16"
                    style={{
                      cursor: "pointer",
                    }}
                  />
                ) : (
                  <Image
                    src={"/connectWalletArrowDown.svg"}
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
                background="var(--Base_surface, #02010F)"
                border="1px solid rgba(103, 109, 154, 0.30)"
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
                      background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                      border="1px solid #2B2F35"
                      onClick={() => {
                        dispatch(resetState(null));
                        dispatch(setAccountReset(null));
                        localStorage.setItem("lastUsedConnector", "");
                        localStorage.setItem("connected", "");
                        dispatch(setNavDropdown(""));
                        router.push("./");
                        disconnect();
                        // localStorage.setItem("account", "");
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
                      background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
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
                    background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                    onClick={() => {
                      // alert("hey");
                      // const walletConnected =
                      //   localStorage.getItem("lastUsedConnector");
                      if (connector?.options?.id == "braavos") {
                        disconnect();
                        connect(connectors[1]);
                      } else {
                        disconnect();
                        connect(connectors[0]);
                      }
                      ////console.log("navbar", account);
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
                {/* <hr
                  style={{
                    height: "1px",
                    borderWidth: "0",
                    backgroundColor: "#2B2F35",
                    width: "96%",
                    marginRight: "5px",
                    // marginLeft: "10px",
                  }}
                /> */}
                {/* <Box marginRight="14px">
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
                      src="/green.svg"
                      alt="Picture of the author"
                      height="6"
                      width="6"
                    />
                    Ethereum Goerli

                    <Image
                      src={"/connectWalletArrowDown.svg"}
                      alt="arrow"
                      width="16"
                      height="16"
                      style={{
                        cursor: "pointer",
                      }}
                    />
                  </Box>
                </Box> */}
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
            ml="0.4rem"

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
                src="/settingIcon.svg"
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
                gap="5px"
                padding="0.5rem 0"
                boxShadow="1px 2px 8px rgba(0, 0, 0, 0.5), 4px 8px 24px #010409"
                borderRadius="6px"
                background="var(--Base_surface, #02010F)"
                border="1px solid rgba(103, 109, 154, 0.30)"
                right="0px"
                top="150%"
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
                  {/* <Text fontSize="14px">Dark mode</Text> */}
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
                  {/* <Box
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
                  </Box> */}
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
                top="150%"
                background="var(--Base_surface, #02010F)"
                border="1px solid rgba(103, 109, 154, 0.30)"
                padding="0.7rem 0.6rem"
                pb="1.5rem"
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
                  color="#B1B0B5"
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
