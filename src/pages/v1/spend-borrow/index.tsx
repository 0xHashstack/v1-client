import MarketDashboard from "@/components/layouts/marketDashboard";
import NavButtons from "@/components/layouts/navButtons";
import Navbar from "@/components/layouts/navbar/Navbar";
import StatsBoard from "@/components/layouts/statsBoard";
import SpendTable from "@/components/layouts/table/spendTable";
import { Box, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import YourSupplyModal from "@/components/modals/yourSupply";
import YourBorrowModal from "@/components/modals/yourBorrowModal";
import LatestSyncedBlock from "@/components/uiElements/latestSyncedBlock";
import PageCard from "@/components/layouts/pageCard";
import Pagination from "@/components/uiElements/pagination";
import { useConnectors } from "@starknet-react/core";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { Skeleton } from "@chakra-ui/react";
import {
  selectNetAPR,
  selectYourBorrow,
} from "@/store/slices/userAccountSlice";
import numberFormatter from "@/utils/functions/numberFormatter";
import useDataLoader from "@/hooks/useDataLoader";
// import WalletConnectModal from "@/components/modals/WalletConnectModal";
const SpendBorrow = () => {
  const { available, disconnect, connect, connectors, refresh } =
    useConnectors();
  useDataLoader();
  // useEffect(() => {
  //   const walletConnected = localStorage.getItem("lastUsedConnector");
  //   if (walletConnected == "braavos") {
  //     connect(connectors[0]);
  //   } else if (walletConnected == "argentx") {
  //     connect(connectors[1]);
  //   }
  // }, []);
  const totalBorrow = useSelector(selectYourBorrow);
  const netAPR = useSelector(selectNetAPR);
  return (
    <PageCard pt="6.5rem">
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
            {!totalBorrow ? (
              <Skeleton
                width="6rem"
                height="1.9rem"
                startColor="#101216"
                endColor="#2B2F35"
                borderRadius="6px"
              />
            ) : (
              <Text color="#e6edf3" fontSize="20px">
                ${numberFormatter(totalBorrow)}
              </Text>
            )}
            {/* <Text color="#e6edf3" fontSize="20px">
              ${numberFormatter(totalBorrow)}
            </Text> */}
          </VStack>
          <VStack gap={"3px"}>
            <Text color="#6e7681" fontSize="14px" alignItems="center">
              Net APR
            </Text>
            {!netAPR ? (
              <Skeleton
                width="6rem"
                height="1.9rem"
                startColor="#101216"
                endColor="#2B2F35"
                borderRadius="6px"
              />
            ) : (
              <Text color="#e6edf3" fontSize="20px">
                {netAPR}%
              </Text>
            )}
          </VStack>
        </HStack>
      </HStack>
      <SpendTable />
      {/* <ToastContainer theme="dark"/> */}

      {/* <WalletConnectModal/> */}
    </PageCard>
  );
};

export default SpendBorrow;
