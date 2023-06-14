import BorrowDashboard from "@/components/layouts/borrowDashboard";
import NavButtons from "@/components/layouts/navButtons";
import Navbar from "@/components/layouts/navbar/Navbar";
import PageCard from "@/components/layouts/pageCard";
import StatsBoard from "@/components/layouts/statsBoard";
import SupplyDashboard from "@/components/layouts/supplyDashboard";
import LatestSyncedBlock from "@/components/uiElements/latestSyncedBlock";
import Pagination from "@/components/uiElements/pagination";
import { Box, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Coins } from "@/utils/constants/coin";
import YourSupplyModal from "@/components/modals/yourSupply";
import { useDispatch } from "react-redux/es/hooks/useDispatch";
import { useConnectors } from "@starknet-react/core";
import { setSpendBorrowSelectedDapp } from "@/store/slices/userAccountSlice";
const YourSupply = () => {
  const [currentPagination, setCurrentPagination] = useState<number>(1);
  const columnItems = [
    "rToken amount",
    "Exchange rate",
    "Supply APR",
    "Effective APR",
    "Status",
    "Actions",
  ];
  const { available, disconnect, connect, connectors, refresh } =
    useConnectors();
  // useEffect(()=>{
  //   const walletConnected = localStorage.getItem('lastUsedConnector');
  //   if(walletConnected=="braavos"){
  //     connect(connectors[0]);
  //   }else if(walletConnected=="argentx"){
  //     connect(connectors[1]);
  //   }
  // },[])
  return (
    <PageCard pt="6.5rem">
      <HStack
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        width="95%"
        pr="3rem"
        mb="1rem"
      >
        <NavButtons width={70} marginBottom={"0rem"} />
        <HStack
          width="13.5rem"
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <VStack
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={"3px"}
          >
            <Text color="#6e7681" fontSize="14px" alignItems="center">
              Total Supply
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
      <SupplyDashboard
        width={"95%"}
        currentPagination={currentPagination}
        Coins={Coins}
        columnItems={columnItems}
      />
      <Box
        paddingY="1rem"
        width="95%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Pagination
            currentPagination={currentPagination}
            setCurrentPagination={(x: any) => setCurrentPagination(x)}
            max={Coins.length}
            rows={6}
          />
        </Box>
        {/* <LatestSyncedBlock width="16rem" height="100%" block={83207} /> */}
      </Box>
      {/* <SupplyModal /> */}
    </PageCard>
  );
};

export default YourSupply;
