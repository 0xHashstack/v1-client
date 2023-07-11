import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import AssetUtilizationChart from "../charts/AssetUtilization";
import AssetUtilizationRateChart from "../charts/AssetUtilizationRate";
import SupplyAprChart from "../charts/SupplyApr";
import BorrowAprChart from "../charts/BorrowApr";
// import { Button } from "reactstrap";
import SupplyAPRLiquidityProvider from "../charts/supplyAPRLiquitityProvider";
import UtilisationRateChart from "../charts/utilisationRateChart";
import TotalUtilisationRateByMarketChart from "../charts/totalUtilisationRateByMarketChart";
import ExchangeRatesChart from "../charts/exchangeRatesChart";
import APRByMarketChart from "../charts/aprByMarket";
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
        <UtilisationRateChart />
        <TotalUtilisationRateByMarketChart />
      </Box>
      <Box display="flex" gap="30px">
        <APRByMarketChart />
        <ExchangeRatesChart />
      </Box>
    </Box>
  );
};

export default MarketInformation;
