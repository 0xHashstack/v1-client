import MarketDashboard from "@/components/layouts/marketDashboard";
import NavButtons from "@/components/layouts/navButtons";
import Navbar from "@/components/layouts/navbar/Navbar";
import StatsBoard from "@/components/layouts/statsBoard";
import SpendTable from "@/components/layouts/table/spendTable";
import { Box, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import YourSupplyModal from "@/components/modals/yourSupply";
import SpendBorrowModal from "@/components/modals/SpendBorrow";
import YourBorrowModal from "@/components/modals/yourBorrowModal";
import LatestSyncedBlock from "@/components/uiElements/latestSyncedBlock";
import PageCard from "@/components/layouts/pageCard";
import WalletConnectModal from "@/components/modals/WalletConnectModal";
const SpendBorrow = () => {
  const [render, setRender] = useState(false);
  useEffect(() => {
    setRender(true);
  }, []);
  return (
    <PageCard>
      <HStack
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        width="95%"
        // bgColor="green"
        // mt="3rem"
        pr="3rem"
        mb="1rem"
      >
        <NavButtons width={70} marginBottom={"0rem"} />
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
              Total Borrow asset
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
      <SpendTable />
      {/* <WalletConnectModal/> */}
    </PageCard>
  );
};

export default SpendBorrow;
