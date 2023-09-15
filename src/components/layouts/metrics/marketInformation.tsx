import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import UtilisationRateChart from "../charts/utilisationRateChart";
import TotalUtilisationRateByMarketChart from "../charts/totalUtilisationRateByMarketChart";
import ExchangeRatesChart from "../charts/exchangeRatesChart";
import APRByMarketChart from "../charts/aprByMarket";
const MarketInformation = ({ currentMarketCoin }: any) => {
  


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
