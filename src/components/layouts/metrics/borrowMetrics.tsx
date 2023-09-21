import React from "react";
import { Box } from "@chakra-ui/react";

import BorrowAprChart from "../charts/BorrowApr";
// import { Button } from "reactstrap";

import BorrowChart from "../charts/borrowChart";
import BorrowerChart from "../charts/borrowerChart";
const BorrowMetrics = ({ currentMarketCoin }: any) => {
 
  return (
    <Box display="flex" flexDir="column" gap="64px">
      <Box display="flex" gap="30px" w="full">
        <BorrowChart />
        <BorrowAprChart />
      </Box>
      <Box display="flex" gap="30px">
        <BorrowerChart />
      </Box>
      <Box display="flex" gap="30px"></Box>
    </Box>
  );
};

export default BorrowMetrics;
