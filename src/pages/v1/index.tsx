import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button, Card, Text, Box, Portal } from "@chakra-ui/react";
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
  useAccount,
  useConnectors,
  // useBalance,
} from "@starknet-react/core";
import { useDispatch, useSelector } from "react-redux";
import {
  selectWalletBalance,
  setAccount,
  setTransactionRefresh,
} from "@/store/slices/userAccountSlice";
import Banner from "@/components/uiElements/loaders/Banner";
import Banner2 from "@/components/uiElements/loaders/Banner2";
import useTransactionRefresh from "@/hooks/useTransactionRefresh";
import mixpanel from "mixpanel-browser";
// import AnimatedButton from "@/components/uiElements/buttons/AnimationButton";

const inter = Inter({ subsets: ["latin"] });
export default function Home() {
  const { account, address, status, isConnected } = useAccount();
  // const { data, isLoading, error, refetch } = useBalance({
  //   address
  // })
  // console.log(data);
  const { available, disconnect, connect, connectors, refresh } =
    useConnectors();
  const [render, setRender] = useState(true);
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_KEY, { debug: true, track_pageview: true, persistence: 'localStorage' });
  const [lastusedConnector, setLastusedConnector] = useState("");
  const [isWhiteListed, setIsWhiteListed] = useState(false);
  const [isWaitListed, setIsWaitListed] = useState(true);
  const router = useRouter();
  const waitlistHref = "/v1/waitlist";
  const marketHref2 = "/v1/market";
  const whitelistHref = "/v1/whitelist";
  const dispatch = useDispatch();
  const walletBalance = useSelector(selectWalletBalance);
  // mixpanel.identify("13793");
  const refreshCallWrapper = () => {
    console.log("refresh called");
    refresh();
  };

  useEffect(() => {
    const interval = setInterval(refresh, 1000);
    return () => clearInterval(interval);
  }, [refresh]);
  const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];
  const networks = [
    { name: "Starknet", status: "enable" },
    { name: "Ethereum (Coming soon)", status: "disable" },
  ];
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
  // console.log(account ,"index page")
  // console.log("Index reload check",account);
  useEffect(() => {
    // alert(status)
    // const storedAccount = localStorage.getItem("account");
    const hasVisited = localStorage.getItem("visited");
    const walletConnected = localStorage.getItem("lastUsedConnector");
    if (walletConnected == "braavos") {
      disconnect();
      connect(connectors[0]);
    } else if (walletConnected == "argentX") {
      disconnect();
      connect(connectors[1]);
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
      //   mixpanel.track('Signed Up')
      // }
      mixpanel.identify(address)
      mixpanel.track('Connect Wallet', {
        'Wallet address': address,
        'Wallet Connected':walletConnected
      })
      if (!isWaitListed) {
        router.replace(waitlistHref);
      } else {
        router.replace(marketHref2);
      }
      // if (!isWhiteListed) {
      //   router.replace(whitelistHref);
      // } else if (isWaitListed) {
      //   router.replace(waitlistHref);
      // }
      // {
      //   router.replace(marketHref2);
      // }
    }
    // console.log("account home", address, status);
  }, [status, isConnected]);
  useTransactionRefresh();
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
        background="#010409"
        flexDirection="column"
        alignItems="flex-start"
        padding="32px"
        width="462px"
        height="567px"
        border="1px solid #30363D"
        borderRadius="8px"
      >
        <Text color="#fff">Connect a wallet</Text>
        <Card
          bg="#101216"
          p="1rem"
          border="1px solid #2B2F35"
          width="400px"
          mt="8px"
        >
          <Box
            display="flex"
            border="1px"
            borderColor="#2B2F35"
            justifyContent="space-between"
            py="1"
            pl="3"
            pr="3"
            mb="1rem"
            mt="0.5rem"
            borderRadius="md"
            className="navbar"
            cursor="pointer"
            // onClick={() => handleDropdownClick("walletConnectDropDown")}
          >
            <Box display="flex" gap="1">
              <Box p="1">{getCoin("Starknet")}</Box>
              <Text color="white" p="1">
                Starknet
              </Text>
            </Box>
          </Box>
          {available?.[0]?.options?.id == "braavos" ||
          available?.[1]?.options?.id == "braavos" ? (
            <Box
              w="full"
              backgroundColor="#101216"
              py="2"
              border="1px solid #2B2F35"
              borderRadius="6px"
              gap="3px"
              display="flex"
              justifyContent="space-between"
              cursor="pointer"
              // onClick={() => router.push("/market")}
              onClick={() => {
                connect(connectors[0]);
                dispatch(setTransactionRefresh(""));
                localStorage.setItem("lastUsedConnector", "braavos");
              }}
            >
              <Text ml="1rem" color="white">
                {available?.[0]?.options?.id == "braavos"
                  ? "Braavos Wallet"
                  : "Download Braavos Wallet"}
              </Text>
              <Box p="1" mr="16px">
                <BravosIcon />
              </Box>
            </Box>
          ) : (
            <Link href="https://braavos.app" target="_blank">
              <Box
                w="full"
                backgroundColor="#101216"
                py="2"
                border="1px solid #2B2F35"
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
                <Text ml="1rem" color="white">
                  {available[0]?.options?.id == "braavos"
                    ? "Braavos Wallet"
                    : "Download Braavos Wallet"}
                </Text>
                <Box p="1" mr="16px">
                  <BravosIcon />
                </Box>
              </Box>
            </Link>
          )}

          {available[1]?.options.id == "argentX" ||
          available[0]?.options.id == "argentX" ? (
            <Box
              w="full"
              backgroundColor="#101216"
              py="2"
              border="1px solid #2B2F35"
              borderRadius="6px"
              gap="3px"
              mt="1rem"
              display="flex"
              justifyContent="space-between"
              cursor="pointer"
              onClick={() => {
                connect(connectors[1]);
                dispatch(setTransactionRefresh(""));
                localStorage.setItem("lastUsedConnector", "argentX");
              }}
            >
              <Text ml="1rem" color="white">
                {available[1]?.options.id == "argentX" ||
                available[0]?.options.id == "argentX"
                  ? "Argent X Wallet"
                  : "Download Argent X Wallet"}
              </Text>
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
                backgroundColor="#101216"
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
                <Text ml="1rem" color="white">
                  {available[1]?.options.id == "argentX" ||
                  available[0]?.options.id == "argentX"
                    ? "Argent X Wallet"
                    : "Download Argent X Wallet"}
                </Text>
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
            color="#0969DA"
            cursor="pointer"
            lineHeight="22px"
          >
            terms of service & disclaimer
          </Button>
        </Box>

        <Box mt="16px" display="flex" flexDirection="column" pb="32px">
          <Text
            fontSize="12px"
            lineHeight="18px"
            fontWeight="400"
            color="#8C8C8C"
          >
            This mainnet is currently in alpha with limitations on the maximum
            supply & borrow amount. This is done in consideration of the current
            network and liquidity constraints of the Starknet. We urge the users
            to use the dapp with caution. Hashstack will not cover any
            accidental loss of user funds.
          </Text>
          <Text
            fontSize="12px"
            lineHeight="18px"
            fontWeight="400"
            color="#8C8C8C"
            mt="1rem"
          >
            Wallets are provided by External Providers and by selecting you
            agree to Terms of those Providers. Your access to the wallet might
            be reliant on the External Provider being operational.
          </Text>
        </Box>
      </Box>
      {/* </PageCard> */}
    </Box>
  );
}
