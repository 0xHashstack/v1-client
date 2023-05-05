import { Button, HStack, Text } from "@chakra-ui/react";
import React from "react";
import Dashboard from "../dashboard";
import SupplyModal from "@/components/modals/SupplyModal";
import BorrowModal from "@/components/modals/borrowModal";
import YourBorrowModal from "@/components/modals/yourBorrowModal";
import SpendBorrowModal from "@/components/modals/SpendBorrow";


const MarketDashboard = () => {
  const dashboardItems1 = [
    ["Market", "Price", "Total supply", "Supply APR"],
    ["Supply", "Details"],
  ];
  const rowItems1 = [
    ["USDT", "00000", "0000.000", "5%"],
    [
      <SupplyModal />,
      <Text
        key="supply-details"
        as="span"
        position="relative"
        color="#0969DA"
        fontSize="14px"
        _hover={{
          "::before": {
            content: '""',
            position: "absolute",
            left: 0,
            bottom: "-0px",
            width: "100%",
            height: "1px",
            backgroundColor: "#0969DA",
          },
        }}
        cursor="pointer"
      >
        Details
      </Text>,
    ],
  ];
  const gap1 = [
    ["22", "20", "20", "20"],
    ["2.5", "2.5"],
  ];
  const dashboardItems2 = [
    ["Market", "Price", "Total borrowed", "Utillization rate", "Borrow APR"],
    ["Borrow", "Trade"],
  ];
  const rowItems2 = [
    ["USDT", "000.00", "0000.000", "4%", "7%"],
    [
      <BorrowModal />,
      <Text
        key="borrow-details"
        as="span"
        position="relative"
        color="#0969DA"
        fontSize="14px"
        _hover={{
          "::before": {
            content: '""',
            position: "absolute",
            left: 0,
            bottom: "-0px",
            width: "100%",
            height: "1px",
            backgroundColor: "#0969DA",
          },
        }}
      >
        Trade
      </Text>,
    ],
  ];
  const gap2 = [
    ["20", "20", "20", "8", "8"],
    ["2.5", "2.5"],
  ];
  return (
    <HStack
      w="95%"
      // backgroundColor="red"
      h="30%"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
    >
      <Dashboard
        width={"49%"}
        columnItems={dashboardItems1}
        gap={"16.6"}
        rowItems={rowItems1}
      />
      <Dashboard
        width={"49%"}
        columnItems={dashboardItems2}
        gap={"14.2"}
        rowItems={rowItems2}
      />
      <YourBorrowModal/>
      <SpendBorrowModal/>
    </HStack>
  );
};

export default MarketDashboard;
