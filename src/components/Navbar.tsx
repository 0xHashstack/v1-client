import HashstackLogo from '@/assets/hashstacklogo'
import SettingsLogo from '@/assets/settingsLogo'
import { HStack,Text,Box, Skeleton } from '@chakra-ui/react'
  import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Router } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
// import "./Navbar.css";

const Navbar = () => {
  const [NavDropdown, setNavDropdown] = useState(false)
  const [addressFetched, setaddressFetched] = useState(false)
  const{address}=useAccount();
  const {disconnect} = useDisconnect();
  const router = useRouter()
  useEffect(()=>{
    if(address){
      setaddressFetched(true)
    }
  },[address])
  // co
  return (
    <HStack
    padding="10px"
    width="100vw"
    display="flex"
    background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
      boxShadow="rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px"
      justifyContent="space-between"
      alignItems="center"
      color="#fff"
      height="3.8125rem"
    >
      <Box  ml="1rem">
        <HashstackLogo/>
      </Box>
        <HStack color="white" mr="1rem">
            {/* <Text color="white">
                Connect Wallet
            </Text> */}
            {address &&  <Box
              position={'relative'}
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
            // ref={ref2}
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
              onClick={() => {
                setNavDropdown(!NavDropdown);
              }}
            >
              {addressFetched && address ? (
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
                  {/* <Image
                    // onClick={() => {
                    //   setConnectWallet(false);
                    // }}
                    alt=""
                    src={"/starknetLogoBordered.svg"}
                    width="16"
                    height="16"
                    style={{ cursor: "pointer" }}
                  /> */}
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
                    {`${address.substring(
                      0,
                      3
                    )}...${address.substring(
                      address.length - 9,
                      address.length
                    )}`}{" "}
                  </Text>
                </Box>
              ) : (
                <>
                  <Skeleton width="7rem" height="100%" borderRadius="2px" />
                </>
              )}
              <Box  right="0.7rem">
                {!NavDropdown ? (
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
            {NavDropdown && (
              <Box
                width="100%"
                display="flex"
                position={"absolute"}
                top= "100%"
    left= "0"
    zIndex= "2"
                justifyContent="center"
                flexDirection="column"
                alignItems="flex-end"
                gap="7px"
                padding="0.5rem 0"
                boxShadow="1px 2px 8px rgba(0, 0, 0, 0.5), 4px 8px 24px #010409"
                borderRadius="6px"
                background="var(--Base_surface, #02010F)"
                border="1px solid rgba(103, 109, 154, 0.30)"
              >
                {address ? (
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
                        setNavDropdown(false);
                        disconnect();
                        router.push("/")

                      }}
                    >
                      Disconnect
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
                      // if (connector?.options?.id == "braavos") {
                      //   disconnect();
                      //   connect(connectors[1]);
                      // } else {
                      //   disconnect();
                      //   connect(connectors[0]);
                      // }
                      ////console.log("navbar", account);
                      // localStorage.setItem("account", JSON.stringify(account));
                    }}
                  >
                    Connect
                  </Box>
                )}
     
              </Box>
            )}
          </Box>}
            <Text color="white">
                <SettingsLogo/>
            </Text>
        </HStack>
    </HStack>
  )
}

export default Navbar