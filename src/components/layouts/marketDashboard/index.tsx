import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import React from "react";
// import Dashboard from "../dashboard";
import SupplyModal from "@/components/modals/SupplyModal";
import BorrowModal from "@/components/modals/borrowModal";
import DashboardLeft from "../dashboardLeft";
import DashboardRight from "../dashboardRight";
import YourBorrowModal from "@/components/modals/yourBorrowModal";
import TradeModal from "@/components/modals/tradeModal";

const MarketDashboard = () => {
  const dashboardItems1 = [
    ["Market", "Price", "Total supply", "Supply APR"],
    ["Supply", "Details"],
  ];

  const dashboardItems2 = [
    ["Market", "Price", "Total borrowed", "Utillization", "Borrow APR"],
    ["Borrow", "Trade"],
  ];

  // const rowItems2 = [
  //   [
  //     <HStack>
  //       <Box></Box>
  //       <VStack>
  //         <Text>USDT</Text>
  //         <Text>Wallet Bal. $900</Text>
  //       </VStack>
  //     </HStack>,
  //     "000.00",
  //     "0000.000",
  //     "4%",
  //     "7%",
  //   ],
  //   [
  //     <BorrowModal />,
  //     <Text
  //       key="borrow-details"
  //       as="span"
  //       position="relative"
  //       color="#0969DA"
  //       fontSize="14px"
  //       _hover={{
  //         "::before": {
  //           content: '""',
  //           position: "absolute",
  //           left: 0,
  //           bottom: "-0px",
  //           width: "100%",
  //           height: "1px",
  //           backgroundColor: "#0969DA",
  //         },
  //       }}
  //     >
  //       Trade
  //     </Text>,
  //   ],
  // ];
  // const gap2 = [
  //   ["20", "20", "20", "8", "8"],
  //   ["2.5", "2.5"],
  // ];
  return (
    <HStack
      w="95%"
      // backgroundColor="red"
      h="30%"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
    >
      <DashboardLeft
        width={"49%"}
        // columnItems={dashboardItems1}
        // gap={"16.6"}
        // rowItems={rowItems1}
      />
      <DashboardRight
        width={"49%"}
        // gap={"14.2"}
        // columnItems={dashboardItems2}
        // rowItems={rowItems2}
      />
    </HStack>
  );
};

export default MarketDashboard;
