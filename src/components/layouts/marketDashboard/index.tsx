import { HStack } from "@chakra-ui/react";
import React from "react";
import { useState, useEffect } from "react";
import DashboardLeft from "../dashboardLeft";
import DashboardRight from "../dashboardRight";
import { getOraclePrices } from "@/Blockchain/scripts/getOraclePrices";
const MarketDashboard = () => {
  const [oraclePrices, setOraclePrices]: any = useState([]);
  useEffect(() => {
    fetchOraclePrices();
  }, []);

  const fetchOraclePrices = async () => {
    try {
      const prices = await getOraclePrices();
      console.log(prices);
      setOraclePrices(prices);
    } catch (error) {
      console.error("Error fetching Oracle prices:", error);
    }
  };
  return (
    <HStack
      w="95%"
      h="30%"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
    >
      <DashboardLeft
        width={"49%"}
        oraclePrices={oraclePrices}
        // columnItems={dashboardItems1}
        // gap={"16.6"}
        // rowItems={rowItems1}
      />
      <DashboardRight
        width={"49%"}
        oraclePrices={oraclePrices}
        // gap={"14.2"}
        // columnItems={dashboardItems2}
        // rowItems={rowItems2}
      />
    </HStack>
  );
};
export default MarketDashboard;
