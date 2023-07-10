import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import AssetUtilizationChart from "../charts/AssetUtilization";
import AssetUtilizationRateChart from "../charts/AssetUtilizationRate";
import SupplyAprChart from "../charts/SupplyApr";
import BorrowAprChart from "../charts/BorrowApr";
// import { Button } from "reactstrap";
import SupplyAPRLiquidityProvider from "../charts/supplyAPRLiquitityProvider";
import TotalAccountsChart from "../charts/totalAccountsChart";
const TotalCommunityActivity = ({ currentMarketCoin }: any) => {
  const series1: any = [
    [
      {
        name: "Series 1",
        data: [30000, 40000, 60000, 80000, 35000, 50000, 49000],
      },
    ],
    [
      {
        name: "Series 1",
        data: [50000, 49000, 60000, 80000, 30000, 40000, 35000],
      },
    ],
    [
      {
        name: "Series 1",
        data: [12300, 40000, 35000, 55000, 49000, 64340, 80000],
      },
    ],
    [
      {
        name: "Series 1",
        data: [30000, 40000, 15000, 50000, 12300, 60000, 80000],
      },
    ],
  ];

  const series2: any = [
    [
      {
        name: "Series 1",
        data: [30000, 40000, 60000, 80000, 35000, 50000, 49000],
      },
    ],
    [
      {
        name: "Series 1",
        data: [50000, 49000, 60000, 80000, 30000, 40000, 35000],
      },
    ],
    [
      {
        name: "Series 1",
        data: [12300, 40000, 35000, 55000, 49000, 64340, 80000],
      },
    ],
    [
      {
        name: "Series 1",
        data: [30000, 40000, 15000, 50000, 12300, 60000, 80000],
      },
    ],
  ];
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);

  return (
    <Box display="flex" flexDir="column" gap="64px">
      <Box display="flex" gap="30px">
        <TotalAccountsChart />
        <Box display="flex" flexDirection="column" gap="8px" width="100%">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            height="72px"
            border="1px solid #2B2F35"
            color="#E6EDF3"
            // padding="24px 24px 16px"
            px="24px"
            fontSize="20px"
            fontStyle="normal"
            fontWeight="600"
            lineHeight="30px"
            borderRadius="6px"
          >
            <Box
              w="100%"
              display="flex"
              gap="2"
              justifyContent="space-between"
              my="auto"
            >
              <Box mt="auto">Total Transaction:</Box>
              <Box display="flex" gap="2">
                <Button
                  color="#2B2F35"
                  size="sm"
                  border={
                    totalTransactions === 0 ? "none" : "1px solid #2B2F35"
                  }
                  variant={totalTransactions === 0 ? "solid" : "outline"}
                  onClick={() => {
                    setTotalTransactions(0);
                  }}
                >
                  1D
                </Button>
                <Button
                  color="#2B2F35"
                  size="sm"
                  border={
                    totalTransactions === 1 ? "none" : "1px solid #2B2F35"
                  }
                  variant={totalTransactions === 1 ? "solid" : "outline"}
                  onClick={() => {
                    setTotalTransactions(1);
                  }}
                >
                  1M
                </Button>
                <Button
                  color="#2B2F35"
                  size="sm"
                  border={
                    totalTransactions === 2 ? "none" : "1px solid #2B2F35"
                  }
                  variant={totalTransactions === 2 ? "solid" : "outline"}
                  onClick={() => {
                    setTotalTransactions(2);
                  }}
                >
                  3M
                </Button>

                <Button
                  color="#2B2F35"
                  size="sm"
                  border={
                    totalTransactions === 3 ? "none" : "1px solid #2B2F35"
                  }
                  variant={totalTransactions === 3 ? "solid" : "outline"}
                  onClick={() => {
                    setTotalTransactions(3);
                  }}
                >
                  ALL
                </Button>
              </Box>
            </Box>
          </Box>
          <SupplyAPRLiquidityProvider />
        </Box>
      </Box>
    </Box>
  );
};

export default TotalCommunityActivity;
