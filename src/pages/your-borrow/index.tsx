import BorrowDashboard from "@/components/layouts/borrowDashboard";
import MarketDashboard from "@/components/layouts/marketDashboard";
import NavButtons from "@/components/layouts/navButtons";
import Navbar from "@/components/layouts/navbar/Navbar";
import { Stack } from "@chakra-ui/react";
import StatsBoard from "@/components/layouts/statsBoard";
import LatestSyncedBlock from "@/components/uiElements/latestSyncedBlock";
import Pagination from "@/components/uiElements/pagination";
import YourBorrowModal from "@/components/modals/yourBorrowModal";
import React, { useEffect, useState } from "react";
import { HStack,VStack,Text,Box } from "@chakra-ui/react";
const YourBorrow = () => {
  const [render, setRender] = useState(true);
  const [currentPagination, setCurrentPagination] = useState<number>(1);
  const Coins = [
    { name: "USDT", icon: "mdi-bitcoin", symbol: "USDT" },
    { name: "USDC", icon: "mdi-ethereum", symbol: "USDC" },
    { name: "BTC", icon: "mdi-bitcoin", symbol: "WBTC" },
    { name: "ETH", icon: "mdi-ethereum", symbol: "WETH" },
    { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
    { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
    { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
    { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
    { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
    { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
    { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
    { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
    { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
    { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
    { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
    { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
    { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
    { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
    { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
    { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
    { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
    { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
    { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
    { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
    { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
    { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
  ];
  useEffect(() => {
    setRender(true);
    console.log("rendered your borrow");
  }, []);
  return (
    <>
      {render && (
        <>
          <Navbar />
          <Stack
            alignItems="center"
            minHeight={"100vh"}
            pt="7rem"
            backgroundColor="#010409"
            pb="7rem"
          >
            {/* <StatsBoard /> */}
            <HStack
              display="flex"
              justifyContent="space-between"
              alignItems="flex-end"
              width="95%"
              // bgColor="green"
              mt="3rem"
              pr="3rem"
              mb="0.35rem"
            >
              <NavButtons width={70} marginTop={"0rem"} marginBottom={"0rem"} />
              <HStack
                width="13.5rem"
                display="flex"
                justifyContent="space-between"
                alignItems="flex-end"
                // bgColor="blue"
              >
                <VStack
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  gap={"3px"}
                >
                  <Text color="#6e7681" fontSize="14px" alignItems="center">
                    Total borrow
                  </Text>
                  <Text color="#e6edf3" fontSize="20px">
                    $8,932.14
                  </Text>
                </VStack>
                <VStack gap={"3px"}>
                  <Text color="#6e7681" fontSize="14px" alignItems="center">
                    Net APR
                  </Text>
                  <Text color="#e6edf3" fontSize="20px">
                    15.5%
                  </Text>
                </VStack>
              </HStack>
            </HStack>
            <BorrowDashboard
              width={"95%"}
              currentPagination={currentPagination}
              Coins={Coins}
            />
            <Box
              paddingY="1rem"
              // height="2rem"
              // bgColor={"blue"}
              width="95%"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Pagination
                currentPagination={currentPagination}
                setCurrentPagination={(x: any) => setCurrentPagination(x)}
                max={Coins.length}
              />
              <LatestSyncedBlock width="16rem" height="100%" block={83207} />
            </Box>
            {/* <SupplyModal /> */}
          </Stack>
        </>
      )}
    </>
  );
};

export default YourBorrow;
