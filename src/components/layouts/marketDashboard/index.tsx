import { Button, HStack, Text } from "@chakra-ui/react";
import React from "react";
import Dashboard from "../dashboard";

const MarketDashboard = () => {
  const dashboardItems1 = [
    ["Market", "Price", "Total supply", "Supply APR"],
    ["Supply", "Details"],
  ];
  const rowItems1 = [
    ["USDT", "00000", "0000.000", "5%"],
    [
      <Button
        key="suppy"
        backgroundColor="#101216"
        height={"2rem"}
        padding="0rem 2.1rem"
        border="1px solid #2b2f35"
        fontSize={"12px"}
        color="#6e6e6e"
        _hover={{ bgColor: "#2DA44E", color: "#E6EDF3" }}
        borderRadius={"6px"}
      >
        Supply
      </Button>,
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
      <Button
        key="borrow"
        height={"2rem"}
        padding="0rem 2.1rem"
        border="1px solid #2b2f35"
        color="#6e6e6e"
        fontSize={"12px"}
        bgColor="#101216"
        _hover={{ bgColor: "#2DA44E", color: "#E6EDF3" }}
        borderRadius={"6px"}
      >
        Borrow
      </Button>,
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
    </HStack>
  );
};

export default MarketDashboard;
