import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import AssetUtilizationChart from "../charts/AssetUtilization";
import AssetUtilizationRateChart from "../charts/AssetUtilizationRate";
import SupplyAprChart from "../charts/SupplyApr";
import BorrowAprChart from "../charts/BorrowApr";
import RiskPremiumChart from "../charts/RiskPremium";

const RiskMetrics = () => {
  const [supplyAPRChartPeriod, setSupplyAPRChartPeriod] = useState(0);
  const [liquidityProviderChartPeriod, setLiquidityProviderChartPeriod] =
    useState(0);
  return (
    <Box display="flex" gap="30px">
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
            <Box mt="auto">Supply APR:</Box>
            <Box display="flex" gap="2">
              <Button
                color="#2B2F35"
                size="sm"
                border={
                  supplyAPRChartPeriod === 0 ? "none" : "1px solid #2B2F35"
                }
                variant={supplyAPRChartPeriod === 0 ? "solid" : "outline"}
                onClick={() => {
                  setSupplyAPRChartPeriod(0);
                }}
              >
                1D
              </Button>
              <Button
                color="#2B2F35"
                size="sm"
                border={
                  supplyAPRChartPeriod === 1 ? "none" : "1px solid #2B2F35"
                }
                variant={supplyAPRChartPeriod === 1 ? "solid" : "outline"}
                onClick={() => {
                  setSupplyAPRChartPeriod(1);
                }}
              >
                1M
              </Button>
              <Button
                color="#2B2F35"
                size="sm"
                border={
                  supplyAPRChartPeriod === 2 ? "none" : "1px solid #2B2F35"
                }
                variant={supplyAPRChartPeriod === 2 ? "solid" : "outline"}
                onClick={() => {
                  setSupplyAPRChartPeriod(2);
                }}
              >
                3M
              </Button>

              <Button
                color="#2B2F35"
                size="sm"
                border={
                  supplyAPRChartPeriod === 3 ? "none" : "1px solid #2B2F35"
                }
                variant={supplyAPRChartPeriod === 3 ? "solid" : "outline"}
                onClick={() => {
                  setSupplyAPRChartPeriod(3);
                }}
              >
                ALL
              </Button>
            </Box>
          </Box>
        </Box>
        <AssetUtilizationChart />
      </Box>
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
            <Box mt="auto">Liquidity Provider:</Box>
            <Box display="flex" gap="2">
              <Button
                color="#2B2F35"
                size="sm"
                border={
                  liquidityProviderChartPeriod === 0
                    ? "none"
                    : "1px solid #2B2F35"
                }
                variant={
                  liquidityProviderChartPeriod === 0 ? "solid" : "outline"
                }
                onClick={() => {
                  setLiquidityProviderChartPeriod(0);
                }}
              >
                1D
              </Button>
              <Button
                color="#2B2F35"
                size="sm"
                border={
                  liquidityProviderChartPeriod === 1
                    ? "none"
                    : "1px solid #2B2F35"
                }
                variant={
                  liquidityProviderChartPeriod === 1 ? "solid" : "outline"
                }
                onClick={() => {
                  setLiquidityProviderChartPeriod(1);
                }}
              >
                1M
              </Button>
              <Button
                color="#2B2F35"
                size="sm"
                border={
                  liquidityProviderChartPeriod === 2
                    ? "none"
                    : "1px solid #2B2F35"
                }
                variant={
                  liquidityProviderChartPeriod === 2 ? "solid" : "outline"
                }
                onClick={() => {
                  setLiquidityProviderChartPeriod(2);
                }}
              >
                3M
              </Button>

              <Button
                color="#2B2F35"
                size="sm"
                border={
                  liquidityProviderChartPeriod === 3
                    ? "none"
                    : "1px solid #2B2F35"
                }
                variant={
                  liquidityProviderChartPeriod === 3 ? "solid" : "outline"
                }
                onClick={() => {
                  setLiquidityProviderChartPeriod(3);
                }}
              >
                ALL
              </Button>
            </Box>
          </Box>
        </Box>
        <AssetUtilizationChart />
      </Box>
    </Box>
  );
};

export default RiskMetrics;
