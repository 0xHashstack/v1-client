import { HStack } from "@chakra-ui/react";
import React from "react";
import { useState, useEffect } from "react";
import DashboardLeft from "../dashboardLeft";
import DashboardRight from "../dashboardRight";

import { useAccount } from "@starknet-react/core";
import { useDispatch, useSelector } from "react-redux";

import {
  selectProtocolStats,
  selectOraclePrices,
} from "@/store/slices/readDataSlice";
import { selectUserDeposits } from "@/store/slices/readDataSlice";
const MarketDashboard = () => {
  // const [oraclePrices, setOraclePrices]: any = useState<(undefined | number)[]>(
  //   []
  // );
  const [totalSupplies, setTotalSupplies]: any = useState<
    (undefined | number)[]
  >([]);
  const [totalBorrows, setTotalBorrows]: any = useState<(undefined | number)[]>(
    []
  );
  const [availableReserves, setAvailableReserves]: any = useState<(undefined | number)[]>(
    []
  );
  const [supplyAPRs, setSupplyAPRs]: any = useState<(undefined | number)[]>([]);
  const [borrowAPRs, setBorrowAPRs]: any = useState<(undefined | number)[]>([]);
  const [utilization, setUtilizations]: any = useState<(undefined | number)[]>(
    []
  );
  const { account, address } = useAccount();
  const userDeposits = useSelector(selectUserDeposits);
  const oraclePrices = useSelector(selectOraclePrices);
  ////console.log(account,"Market Page")

  // useEffect(()=>{
  //   fetchUserLoans();
  // },[account])

  const [validRTokens, setValidRTokens] = useState([]);
  useEffect(() => {
    if (validRTokens.length === 0) {
      fetchUserDeposits();
    }
  }, [userDeposits, validRTokens, address]);

  const fetchUserDeposits = async () => {
    try {
      if (!account || userDeposits?.length <= 0) return;
      // const reserves = await getUserDeposits(address as string);
      const reserves = userDeposits;
      ////console.log("got reservers", reserves);

      const rTokens: any = [];
      if (reserves) {
        reserves.map((reserve: any) => {
          if (reserve.rTokenFreeParsed > 0) {
            rTokens.push({
              rToken: reserve.rToken,
              rTokenAmount: reserve.rTokenFreeParsed,
            });
          }
        });
      }
      ////console.log("rtokens", rTokens);
      if (rTokens.length === 0) return;
      setValidRTokens(rTokens);
      ////console.log("valid rtoken", validRTokens);
      ////console.log("market page -user supply", reserves);
    } catch (err) {
      ////console.log("Error fetching protocol reserves", err);
    }
  };
  // const fetchUserReserves = async () => {
  //   try {
  //     const reserves = await getUserReserves();
  //    //console.log(reserves, "market page -user supply");
  //   } catch (err) {
  //    //console.log("Error fetching protocol reserves", err);
  //   }
  // };

  // const fetchOraclePrices = async () => {
  //   try {
  //     const prices = await getOraclePrices();
  //     if (prices) {
  //       dispatch(setOraclePrices(prices));
  //     }

  //    //console.log("oracleprices", prices);
  //     setOraclePrices(prices);
  //   } catch (error) {
  //     console.error("Error fetching Oracle prices:", error);
  //   }
  // };
  const [protocolStats, setProtocolStats]: any = useState([]);

  const stats = useSelector(selectProtocolStats);
  useEffect(() => {
    // fetchOraclePrices();
    fetchProtocolStats();
    // fetchProtocolReserves();
    // fetchUserReserves();
    // fetchUserLoans();
  }, [stats]);
  const fetchProtocolStats = async () => {
    try {
      ////console.log("fetchprotocolstats", stats); //23014
      // const temp: any = ;
      setProtocolStats([
        stats?.[4],
        stats?.[2],
        stats?.[3],
        stats?.[1],
        stats?.[0],
        // stats?.[4],
      ]);
      setTotalSupplies([
        stats?.[4].totalSupply,
        stats?.[2].totalSupply,
        stats?.[3].totalSupply,
        stats?.[1].totalSupply,
        stats?.[0].totalSupply,
        // stats?.[4].totalSupply,
      ]);
      setTotalBorrows([
        stats?.[4].totalBorrow,
        stats?.[2].totalBorrow,
        stats?.[3].totalBorrow,
        stats?.[1].totalBorrow,
        stats?.[0].totalBorrow,
        // stats?.[4].totalBorrow,
      ]);
      setBorrowAPRs([
        stats?.[4].borrowRate,
        stats?.[2].borrowRate,
        stats?.[3].borrowRate,
        stats?.[1].borrowRate,
        stats?.[0].borrowRate,
        // stats?.[4].borrowRate,
      ]);
      setAvailableReserves([
        stats?.[4].availableReserves,
        stats?.[2].availableReserves,
        stats?.[3].availableReserves,
        stats?.[1].availableReserves,
        stats?.[0].availableReserves,
        // stats?.[4].availableReserves,
      ])
      const avg =
        (stats?.[4].borrowRate +
          stats?.[3].borrowRate +
          stats?.[2].borrowRate +
          stats?.[1].borrowRate +
          stats?.[0].borrowRate) /
        5;
      ////console.log(avg,"avg borrow")
      // dispatch(setAvgBorrowAPR(avg));
      setSupplyAPRs([
        stats?.[4].supplyRate,
        stats?.[2].supplyRate,
        stats?.[3].supplyRate,
        stats?.[1].supplyRate,
        stats?.[0].supplyRate,
        // stats?.[4].supplyRate,
      ]);
     
      // dispatch(setAvgSupplyAPR(avgSupply));
      setUtilizations([
        stats?.[4].utilisationPerMarket,
        stats?.[2].utilisationPerMarket,
        stats?.[3].utilisationPerMarket,
        stats?.[1].utilisationPerMarket,
        stats?.[0].utilisationPerMarket,
        // stats?.[4].utilisationPerMarket,
      ]);
    } catch (error) {
      ////console.log("error on getting protocol stats");
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
        totalSupplies={totalSupplies}
        supplyAPRs={supplyAPRs}
        validRTokens={validRTokens}
        // columnItems={dashboardItems1}
        // gap={"16.6"}
        // rowItems={rowItems1}
      />
      <DashboardRight
        width={"49%"}
        oraclePrices={oraclePrices}
        borrowAPRs={borrowAPRs}
        totalBorrows={totalBorrows}
        availableReserves={availableReserves}
        utilization={utilization}
        supplyAPRs={supplyAPRs}
        validRTokens={validRTokens}
        protocolStats={protocolStats}

        // gap={"14.2"}
        // columnItems={dashboardItems2}
        // rowItems={rowItems2}
      />
    </HStack>
  );
};
export default MarketDashboard;
