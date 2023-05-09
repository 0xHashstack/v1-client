import MarketDashboard from "@/components/layouts/marketDashboard";
import NavButtons from "@/components/layouts/navButtons";
import Navbar from "@/components/layouts/navbar/Navbar";
import StatsBoard from "@/components/layouts/statsBoard";
import SpendTable from "@/components/layouts/table/spendTable";
import { Stack,HStack,VStack,Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import YourSupplyModal from "@/components/modals/yourSupply";
import SpendBorrowModal from "@/components/modals/SpendBorrow";
import YourBorrowModal from "@/components/modals/yourBorrowModal";
import LatestSyncedBlock from "@/components/uiElements/latestSyncedBlock";
import WalletConnectModal from "@/components/modals/WalletConnectModal";
import StakUnstakeModal from "@/components/modals/StakeUnstakeModal";
import SwapModal from "@/components/modals/SwapModal";
import LiquidityProvisionModal from "@/components/modals/LiquidityProvision";
import StakeModal from "@/components/modals/StakeModal";
const SpendBorrow = () => {
  const [render, setRender] = useState(false);
  useEffect(() => {
    setRender(true);
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
            <SpendTable />
            {/* <MarketDashboard /> */}
            {/* <SupplyModal /> */}
          </Stack>
        </>
      )}
    </>
  );
};

export default SpendBorrow;
