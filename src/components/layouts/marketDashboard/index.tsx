import { HStack } from "@chakra-ui/react";
import React from "react";
import { useState, useEffect } from "react";
import DashboardLeft from "../dashboardLeft";
import DashboardRight from "../dashboardRight";
import { getOraclePrices } from "@/Blockchain/scripts/getOraclePrices";
import { getProtocolReserves } from "@/Blockchain/scripts/protocolStats";
import { getProtocolStats } from "@/Blockchain/scripts/protocolStats";
import { getUserReserves } from "@/Blockchain/scripts/userStats";
import { getUserDeposits } from "@/Blockchain/scripts/Deposits";
import { useAccount } from "@starknet-react/core";
import { getUserLoans } from "@/Blockchain/scripts/Loans";
const MarketDashboard = () => {
  const [oraclePrices, setOraclePrices]: any = useState([]);
  const { account, address } = useAccount();
  // console.log(account,"Market Page")
  useEffect(() => {
    fetchOraclePrices();
    fetchProtocolStats();
    // fetchProtocolReserves();
    // fetchUserReserves();
    // fetchUserLoans();
  }, []);
  // useEffect(()=>{
  //   fetchUserLoans();
  // },[account])
  const fetchUserDeposits = async () => {
    try {
      const reserves = await getUserDeposits(address || "");
      console.log(reserves, "market page -user supply");
    } catch (err) {
      console.log("Error fetching protocol reserves", err);
    }
  };
  const fetchUserReserves = async () => {
    try {
      const reserves = await getUserReserves();
      console.log(reserves, "market page -user supply");
    } catch (err) {
      console.log("Error fetching protocol reserves", err);
    }
  };
  const fetchUserLoans = async () => {
    try {
      console.log("loans calling");
      const loans = await getUserLoans(address || "");
    } catch (err) {
      console.log("Error fetching protocol reserves", err);
    }
  };

  const fetchOraclePrices = async () => {
    try {
      const prices = await getOraclePrices();
      console.log("oracleprices", prices);
      setOraclePrices(prices);
    } catch (error) {
      console.error("Error fetching Oracle prices:", error);
    }
  };

  const fetchProtocolStats = async () => {
    try {
      const stats = await getProtocolStats();
      console.log("fetchprotocolstats", stats);
    } catch (error) {
      console.log("error on getting protocol stats");
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
