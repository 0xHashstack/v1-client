import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button, Card, Text, Box, Portal, Skeleton } from "@chakra-ui/react";
import Navbar from "@/components/layouts/navbar/Navbar";
import PageCard from "@/components/layouts/pageCard";
// import WalletConnectModal from "@/components/modals/WalletConnectModal";
import ArgentXLogo from "../assets/images/ArgentXlogo.svg";
import BTCLogo from "@/assets/icons/coins/btc";
import USDCLogo from "@/assets/icons/coins/usdc";
import BravosIcon from "@/assets/icons/wallets/bravos";
import USDTLogo from "@/assets/icons/coins/usdt";
import ETHLogo from "@/assets/icons/coins/eth";
import DAILogo from "@/assets/icons/coins/dai";
import DropdownUp from "@/assets/icons/dropdownUpIcon";
import StarknetLogo from "@/assets/icons/coins/starknet";
import BrowserWalletIcon from "@/assets/icons/wallets/browserwallet";
import EthWalletLogo from "@/assets/icons/coins/ethwallet";
import {
  Connector,
  argent,
  braavos,
  useAccount,
  useConnect,
  useDisconnect,
  // useBalance,
} from "@starknet-react/core";
import { useDispatch, useSelector } from "react-redux";
import {
  selectWalletBalance,
  setAccount,
} from "@/store/slices/userAccountSlice";
import { setReferral, setTransactionRefresh } from "@/store/slices/readDataSlice";
import Banner from "@/components/uiElements/loaders/Banner";
import Banner2 from "@/components/uiElements/loaders/Banner2";
import useTransactionRefresh from "@/hooks/useTransactionRefresh";
import mixpanel from "mixpanel-browser";
import useDataLoader from "@/hooks/useDataLoader";
import { diamondAddress, getProvider } from "@/Blockchain/stark-constants";
import comptrollerAbi from "../../Blockchain/abis_mainnet/comptroller_abi.json";
import { tokenAddressMap } from "@/Blockchain/utils/addressServices";
import { Contract, RpcProvider } from "starknet";
import GetTokensModal from "@/components/modals/getTokens";
import SupplyModal from "@/components/modals/SupplyModal";
import posthog from "posthog-js";
// import AnimatedButton from "@/components/uiElements/buttons/AnimationButton";

const inter = Inter({ subsets: ["latin"] });
export default function Home() {
  const { account, address, status, isConnected } = useAccount();
  // const { data, isLoading, error, refetch } = useBalance({
  //   address
  // })
  ////console.log(data);
  // const connectors = [
  //   braavos(),
  //   argent(),
  // ];
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // const { available, refresh } =
  //   useConnectors();
  const [render, setRender] = useState(true);

  const [lastusedConnector, setLastusedConnector] = useState("");
  const [isWhiteListed, setIsWhiteListed] = useState(false);
  const [isWaitListed, setIsWaitListed] = useState(true);
  const [availableDataLoading, setAvailableDataLoading] = useState(true);
  const [walletConnectedRefresh, setWalletConnectedRefresh] = useState(false)

  const router = useRouter();
  const waitlistHref = "/v1/waitlist";
  const marketHref2 = "/v1/market";
  const whitelistHref = "/v1/whitelist";
  const dispatch = useDispatch();
  const walletBalance = useSelector(selectWalletBalance);
  // mixpanel.identify("13793");
 

  // useEffect(() => {
  //   const interval = setInterval(refresh, 200);
  //   return () => clearInterval(interval);
  // }, [refresh]);

  const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];
  const networks = [
    { name: "Starknet", status: "enable" },
    { name: "Ethereum (Coming soon)", status: "disable" },
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAvailableDataLoading(false);
    }, 600);

    return () => clearTimeout(timeout);
  }, []);
  const getCoin = (CoinName: string) => {
    switch (CoinName) {
      case "BTC":
        return <BTCLogo height={"16px"} width={"16px"} />;
        break;
      case "USDC":
        return <USDCLogo height={"16px"} width={"16px"} />;
        break;
      case "USDT":
        return <USDTLogo height={"16px"} width={"16px"} />;
        break;
      case "ETH":
        return <ETHLogo height={"16px"} width={"16px"} />;
        break;
      case "DAI":
        return <DAILogo height={"16px"} width={"16px"} />;
        break;
      case "Starknet":
        return <StarknetLogo />;
        break;
      case "Ethereum (Coming soon)":
        return <EthWalletLogo />;
        break;
      default:
        break;
    }
  };
  ////console.log(account ,"index page")
  ////console.log("Index reload check",account);
  useEffect(() => {
    localStorage.setItem("connected", "");
  }, []);
  const { ref } = router.query;
    if(ref){
      dispatch(setReferral(ref));
    }
  useEffect(() => {
    // alert(status)
    // const storedAccount = localStorage.getItem("account");
    const hasVisited = localStorage.getItem("visited");
    const walletConnected = localStorage.getItem("lastUsedConnector");
    localStorage.setItem("transactionCheck", JSON.stringify([]));
    if (walletConnected == "braavos") {
        disconnect();
        connectors.map((connector:any)=>{
          if(connector.id=="braavos"){
            connect(connector);
          }
        })
        
      if(!account){
        return;
      }else{
        if (!isWaitListed) {
          router.replace(waitlistHref);
        } else {
          router.replace(marketHref2);
        }
      }
      // dispatch(setTransactionRefresh("reset"));
    } else if (walletConnected == "argentX") {
        disconnect();
        connectors.map((connector)=>{
          if(connector.id=="argentX"){
            connect({connector});
          }
        })
      if(!account){
        return;
      }else{
        if (!isWaitListed) {
          router.replace(waitlistHref);
        } else {
          router.replace(marketHref2);
        }
      }
      // dispatch(setTransactionRefresh("reset"));
    }else{
      return
    }
    if (walletConnected) {
      localStorage.setItem("connected", walletConnected);
      posthog.capture("Connect Wallet", {
        "Wallet address": address,
        "Wallet Connected": walletConnected,
      });
    }
    if (!hasVisited) {
      // Set a local storage item to indicate the user has visited
      localStorage.setItem("visited", "true");
    }
    // if (storedAccount) {
    //   router.push('./market')
    // }
    if (status == "connected" || isConnected) {
      // alert(account?.address);
      // localStorage.setItem("account", JSON.stringify(account));
      // dispatch(setAccount(JSON.stringify(account)));
      // if(address){
      //   // mixpanel.identify(address)
      //   mixpanel.identify("13793");
      //   posthog.capture('Signed Up')
      // }

      

      // if (!isWhiteListed) {
      //   router.replace(whitelistHref);
      // } else if (isWaitListed) {
      //   router.replace(waitlistHref);
      // }
      // {
      //   router.replace(marketHref2);
      // }
    }
    ////console.log("account home", address, status);
  }, [status, isConnected]);
  const [bravoosAvailable, setbravoosAvailable] = useState(true);
  const [argentAvailable, setargentAvailable] = useState(true)
  useEffect(()=>{
    (connectors.map((connector)=>{
      if(connector.id=="braavos"){
         setbravoosAvailable(connector.available());
      }else if(connector.id=="argentX"){
        setargentAvailable(connector.available());
      }
      return true;
    }))
  },[])
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      backgroundColor="#191922"
      height="100vh"
    >
      {/* <PageCard
      justifyContent="center"
      alignItems="center"
      backgroundColor="#191922"
      height="100vh"
    > */}

      <Box
        display="flex"
        background="#02010F"
        flexDirection="column"
        alignItems="flex-start"
        padding="32px"
        width="462px"
        // height="567px"
        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
        borderRadius="8px"
        // bgColor="red"
      >
        <Text color="#fff">Connect a wallet</Text>
        <Card
          p="1rem"
          background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
          width="400px"
          mt="8px"
        >
          { (connectors[0]?.id == "braavos" ||
          connectors[1]?.id == "braavos") && bravoosAvailable ? (
            <Box
              w="full"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              py="2"
              borderRadius="6px"
              gap="3px"
              display="flex"
              justifyContent="space-between"
              cursor="pointer"
              // onClick={() => router.push("/market")}
              onClick={() => {
                localStorage.setItem("lastUsedConnector", "braavos");
                localStorage.setItem("connected", "braavos");
                disconnect();
                connectors.map((connector)=>{
                  if(connector.id=="braavos"){
                    connect({connector});
                  }
                })
                dispatch(setTransactionRefresh("reset"));
              }}
            >
              <Box ml="1rem" color="white">
                {availableDataLoading ? (
                  <Skeleton
                    width="6rem"
                    height="1.4rem"
                    startColor="#101216"
                    endColor="#2B2F35"
                    borderRadius="6px"
                  />
                ) : (connectors[0]?.id == "braavos" ||
                  connectors[1]?.id == "braavos") && bravoosAvailable  ? (
                  // || availableDataLoading
                  "Braavos Wallet"
                ) : (
                  "Download Braavos Wallet"
                )}
              </Box>
              <Box p="1" mr="16px">
                <BravosIcon />
              </Box>
            </Box>
          ) : (
            <Link href="https://braavos.app" target="_blank">
              <Box
                w="full"
                border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                py="2"
                borderRadius="6px"
                gap="3px"
                display="flex"
                justifyContent="space-between"
                cursor="pointer"
                // onClick={() => router.push("/market")}
                // onClick={() =>
                //   connect(connectors[0])
                // }
              >
                <Box ml="1rem" color="white">
                  {availableDataLoading ? (
                    <Skeleton
                      width="6rem"
                      height="1.4rem"
                      startColor="#101216"
                      endColor="#2B2F35"
                      borderRadius="6px"
                    />
                  ) : (connectors[0]?.id == "braavos" ||
                  connectors[1]?.id == "braavos") &&bravoosAvailable ? (
                    // || availableDataLoading
                    "Braavos Wallet"
                  ) : (
                    "Download Braavos Wallet"
                  )}
                </Box>
                <Box p="1" mr="16px">
                  <BravosIcon />
                </Box>
              </Box>
            </Link>
          )}

          {(connectors[1]?.id == "argentX" ||
          connectors[0]?.id == "argentX") && argentAvailable ? (
            <Box
              w="full"
              py="2"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              borderRadius="6px"
              gap="3px"
              mt="1rem"
              display="flex"
              justifyContent="space-between"
              cursor="pointer"
              onClick={() => {
                localStorage.setItem("lastUsedConnector", "argentX");
                localStorage.setItem("connected", "argentX");
                disconnect();
                connectors.map((connector)=>{
                  if(connector.id=="argentX"){
                    connect({connector});
                  }
                })
                dispatch(setTransactionRefresh("reset"));
              }}
            >
              <Box ml="1rem" color="white">
                {availableDataLoading ? (
                  <Skeleton
                    width="6rem"
                    height="1.4rem"
                    startColor="#101216"
                    endColor="#2B2F35"
                    borderRadius="6px"
                  />
                ) : (connectors[0]?.id == "argentX" ||
                connectors[1]?.id == "argentX" && argentAvailable) ? (
                  // || availableDataLoading
                  "Argent X Wallet"
                ) : (
                  "Download Argent X Wallet"
                )}
              </Box>
              <Box p="1" mr="16px">
                <Image
                  src="/ArgentXlogo.svg"
                  alt="Picture of the author"
                  width="15"
                  height="15"
                  style={{ cursor: "pointer" }}
                />
              </Box>
            </Box>
          ) : (
            <Link href="https://www.argent.xyz/argent-x" target="_black">
              <Box
                w="full"
                py="2"
                border="1px solid #2B2F35"
                borderRadius="6px"
                gap="3px"
                mt="1rem"
                display="flex"
                justifyContent="space-between"
                cursor="pointer"
                // onClick={() => connect(connectors[1])}
              >
                <Box ml="1rem" color="white">
                  {availableDataLoading ? (
                    <Skeleton
                      width="6rem"
                      height="1.4rem"
                      startColor="#101216"
                      endColor="#2B2F35"
                      borderRadius="6px"
                    />
                  ) : (connectors[1]?.id == "argentX" ||
                  connectors[0]?.id == "argentX")&& argentAvailable ? (
                    // || availableDataLoading
                    "Argent X Wallet"
                  ) : (
                    "Download Argent X Wallet"
                  )}
                </Box>
                <Box p="1" mr="16px">
                  <Image
                    src="/ArgentXlogo.svg"
                    alt="Picture of the author"
                    width="15"
                    height="15"
                    style={{ cursor: "pointer" }}
                  />
                </Box>
              </Box>
            </Link>
          )}
        </Card>
        <Box
          display="flex"
          flexDirection="row"
          fontSize="12px"
          lineHeight="30px"
          fontWeight="400"
          mt="16px"
        ></Box>
        <Box
          alignItems="center"
          fontSize="14px"
          lineHeight="22px"
          fontWeight="400"
          mt="8px"
        >
          <Text fontSize="14px" lineHeight="22px" fontWeight="400" color="#fff">
            By connecting your wallet, you agree to Hashstack&apos;s
          </Text>
          <Button
            variant="link"
            fontSize="14px"
            display="inline"
            color="#4D59E8"
            cursor="pointer"
            lineHeight="22px"
          >
            terms of service & disclaimer
          </Button>
        </Box>

        <Box
          mt="16px"
          display="flex"
          flexDirection="column"
          // pb="32px"
          // bgColor="blue"
        >
          <Text
            fontSize="12px"
            lineHeight="18px"
            fontWeight="400"
            color="#3E415C"
          >
            {/* This mainnet is currently in alpha with limitations on the maximum
            supply & borrow amount. This is done in consideration of the current
            network and liquidity constraints of the Starknet. We urge the users
            to use the dapp with caution. Hashstack will not cover any
            accidental loss of user funds. */}
            Wallets are provided by External Providers and by selecting you
            agree to Terms of those Providers. Your access to the wallet might
            be reliant on the External Provider being operational.
          </Text>
          <Text
            fontSize="12px"
            lineHeight="18px"
            fontWeight="400"
            color="#3E415C"
            mt="1rem"
          >
            We urge the users to use the dapp with caution. Hashstack will not
            cover any accidental loss of user funds.
          </Text>
        </Box>
      </Box>
      {/* </PageCard> */}
    </Box>
  );
}
