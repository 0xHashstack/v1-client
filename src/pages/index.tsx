import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Navbar from '@/components/Navbar'
import { Box,Text,Card, Skeleton, Button } from '@chakra-ui/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAccount, useConnectors } from '@starknet-react/core'
import BravosIcon from '@/assets/bravosIcon'
import { useRouter } from 'next/router'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const [availableDataLoading, setAvailableDataLoading] = useState(true);
    const { account, address, status, isConnected } = useAccount();
    const router=useRouter();
    const { available, disconnect, connect, connectors, refresh } =
    useConnectors();
    useEffect(() => {
        const timeout = setTimeout(() => {
          setAvailableDataLoading(false);
        }, 600);
    
        return () => clearTimeout(timeout);
      }, []);
      useEffect(() => {
        const interval = setInterval(refresh, 200);
        return () => clearInterval(interval);
      }, [refresh]);
      useEffect(() => {
        // alert(status)
        // const storedAccount = localStorage.getItem("account");
        const hasVisited = localStorage.getItem("visited");
        const walletConnected = localStorage.getItem("lastUsedConnector");
        localStorage.setItem("transactionCheck", JSON.stringify([]));
        if (walletConnected == "braavos") {
            disconnect();
            connect(connectors[0]);
          if(!account){
            return;
          }else{
            router.replace("/form");
          }
          // dispatch(setTransactionRefresh("reset"));
        } else if (walletConnected == "argentX") {
            disconnect();
            connect(connectors[1]);
          if(!account){
            return;
          }else{
              router.replace("/form");
          }
          // dispatch(setTransactionRefresh("reset"));
        }else{
          return
        }
        if (walletConnected) {
          localStorage.setItem("connected", walletConnected);
        }
        if (!hasVisited) {
          // Set a local storage item to indicate the user has visited
          localStorage.setItem("visited", "true");
        }
        // if (storedAccount) {
        //   router.push('./market')
        // }

          
    
          // if (!isWhiteListed) {
          //   router.replace(whitelistHref);
          // } else if (isWaitListed) {
          //   router.replace(waitlistHref);
          // }
          // {
          //   router.replace(marketHref2);
          // }
        
        // console.log("account home", address, status);
      }, [status, isConnected]);
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
          {available?.[0]?.options?.id == "braavos" ||
          available?.[1]?.options?.id == "braavos" ? (
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
                connect(connectors[0]);
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
                ) : available?.[0]?.options?.id == "braavos" ||
                  available?.[1]?.options?.id == "braavos" ? (
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
                  ) : available[0]?.options?.id == "braavos" ||
                    available[1]?.options?.id == "braavos" ? (
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

          {available[1]?.options.id == "argentX" ||
          available[0]?.options.id == "argentX" ? (
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
                connect(connectors[1]);
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
                ) : available[1]?.options.id == "argentX" ||
                  available[0]?.options.id == "argentX" ? (
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
                  ) : available[1]?.options.id == "argentX" ||
                    available[0]?.options.id == "argentX" ? (
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
  )
}
