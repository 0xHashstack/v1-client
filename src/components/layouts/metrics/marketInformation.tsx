import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import AssetUtilizationChart from "../charts/AssetUtilization";
import AssetUtilizationRateChart from "../charts/AssetUtilizationRate";
import SupplyAprChart from "../charts/SupplyApr";
import BorrowAprChart from "../charts/BorrowApr";
// import { Button } from "reactstrap";
import SupplyAPRLiquidityProvider from "../charts/supplyAPRLiquitityProvider";
const MarketInformation = ({ currentMarketCoin }: any) => {
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
  const [utilisationRate, setUtilisationRate] = useState(0);
  const [totalUtilisationRate, setTotalUtilisationRate] = useState(0);
  const [aprByMarket, setAPRByMarket] = useState(0);
  const [exchangeRates, setExchangeRates] = useState(0);

  return (
    <Box display="flex" flexDir="column" gap="64px">
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
              <Box mt="auto">Utilisation Rate:</Box>
              <Box display="flex" gap="2">
                <Button
                  color="#2B2F35"
                  size="sm"
                  border={utilisationRate === 0 ? "none" : "1px solid #2B2F35"}
                  variant={utilisationRate === 0 ? "solid" : "outline"}
                  onClick={() => {
                    setUtilisationRate(0);
                  }}
                >
                  1D
                </Button>
                <Button
                  color="#2B2F35"
                  size="sm"
                  border={utilisationRate === 1 ? "none" : "1px solid #2B2F35"}
                  variant={utilisationRate === 1 ? "solid" : "outline"}
                  onClick={() => {
                    setUtilisationRate(1);
                  }}
                >
                  1M
                </Button>
                <Button
                  color="#2B2F35"
                  size="sm"
                  border={utilisationRate === 2 ? "none" : "1px solid #2B2F35"}
                  variant={utilisationRate === 2 ? "solid" : "outline"}
                  onClick={() => {
                    setUtilisationRate(2);
                  }}
                >
                  3M
                </Button>

                <Button
                  color="#2B2F35"
                  size="sm"
                  border={utilisationRate === 3 ? "none" : "1px solid #2B2F35"}
                  variant={utilisationRate === 3 ? "solid" : "outline"}
                  onClick={() => {
                    setUtilisationRate(3);
                  }}
                >
                  ALL
                </Button>
              </Box>
            </Box>
          </Box>
          <AssetUtilizationChart
            color={"#846ED4"}
            series={series1[utilisationRate]}
          />
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
              <Box mt="auto">Total utilisation rate by market:</Box>
              <Box display="flex" gap="2">
                <Button
                  color="#2B2F35"
                  size="sm"
                  border={
                    totalUtilisationRate === 0 ? "none" : "1px solid #2B2F35"
                  }
                  variant={totalUtilisationRate === 0 ? "solid" : "outline"}
                  onClick={() => {
                    setTotalUtilisationRate(0);
                  }}
                >
                  1D
                </Button>
                <Button
                  color="#2B2F35"
                  size="sm"
                  border={
                    totalUtilisationRate === 1 ? "none" : "1px solid #2B2F35"
                  }
                  variant={totalUtilisationRate === 1 ? "solid" : "outline"}
                  onClick={() => {
                    setTotalUtilisationRate(1);
                  }}
                >
                  1M
                </Button>
                <Button
                  color="#2B2F35"
                  size="sm"
                  border={
                    totalUtilisationRate === 2 ? "none" : "1px solid #2B2F35"
                  }
                  variant={totalUtilisationRate === 2 ? "solid" : "outline"}
                  onClick={() => {
                    setTotalUtilisationRate(2);
                  }}
                >
                  3M
                </Button>

                <Button
                  color="#2B2F35"
                  size="sm"
                  border={
                    totalUtilisationRate === 3 ? "none" : "1px solid #2B2F35"
                  }
                  variant={totalUtilisationRate === 3 ? "solid" : "outline"}
                  onClick={() => {
                    setTotalUtilisationRate(3);
                  }}
                >
                  ALL
                </Button>
              </Box>
            </Box>
          </Box>
          <AssetUtilizationChart
            color={"#2BA26F"}
            series={series2[totalUtilisationRate]}
          />
        </Box>
      </Box>
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
              <Box mt="auto">APR by market:</Box>
              <Box display="flex" gap="2">
                <Button
                  color="#2B2F35"
                  size="sm"
                  border={aprByMarket === 0 ? "none" : "1px solid #2B2F35"}
                  variant={aprByMarket === 0 ? "solid" : "outline"}
                  onClick={() => {
                    setAPRByMarket(0);
                  }}
                >
                  1D
                </Button>
                <Button
                  color="#2B2F35"
                  size="sm"
                  border={aprByMarket === 1 ? "none" : "1px solid #2B2F35"}
                  variant={aprByMarket === 1 ? "solid" : "outline"}
                  onClick={() => {
                    setAPRByMarket(1);
                  }}
                >
                  1M
                </Button>
                <Button
                  color="#2B2F35"
                  size="sm"
                  border={aprByMarket === 2 ? "none" : "1px solid #2B2F35"}
                  variant={aprByMarket === 2 ? "solid" : "outline"}
                  onClick={() => {
                    setAPRByMarket(2);
                  }}
                >
                  3M
                </Button>

                <Button
                  color="#2B2F35"
                  size="sm"
                  border={aprByMarket === 3 ? "none" : "1px solid #2B2F35"}
                  variant={aprByMarket === 3 ? "solid" : "outline"}
                  onClick={() => {
                    setAPRByMarket(3);
                  }}
                >
                  ALL
                </Button>
              </Box>
            </Box>
          </Box>
          <SupplyAPRLiquidityProvider />
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
              <Box mt="auto">Exchange rates:</Box>
              <Box display="flex" gap="2">
                <Button
                  color="#2B2F35"
                  size="sm"
                  border={exchangeRates === 0 ? "none" : "1px solid #2B2F35"}
                  variant={exchangeRates === 0 ? "solid" : "outline"}
                  onClick={() => {
                    setExchangeRates(0);
                  }}
                >
                  1D
                </Button>
                <Button
                  color="#2B2F35"
                  size="sm"
                  border={exchangeRates === 1 ? "none" : "1px solid #2B2F35"}
                  variant={exchangeRates === 1 ? "solid" : "outline"}
                  onClick={() => {
                    setExchangeRates(1);
                  }}
                >
                  1M
                </Button>
                <Button
                  color="#2B2F35"
                  size="sm"
                  border={exchangeRates === 2 ? "none" : "1px solid #2B2F35"}
                  variant={exchangeRates === 2 ? "solid" : "outline"}
                  onClick={() => {
                    setExchangeRates(2);
                  }}
                >
                  3M
                </Button>

                <Button
                  color="#2B2F35"
                  size="sm"
                  border={exchangeRates === 3 ? "none" : "1px solid #2B2F35"}
                  variant={exchangeRates === 3 ? "solid" : "outline"}
                  onClick={() => {
                    setExchangeRates(3);
                  }}
                >
                  ALL
                </Button>
              </Box>
            </Box>
          </Box>
          <AssetUtilizationChart
            color={"#2BA26F"}
            series={series2[exchangeRates]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MarketInformation;
