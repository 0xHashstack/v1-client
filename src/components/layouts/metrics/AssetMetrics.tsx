import React from "react";
import { Box } from "@chakra-ui/react";
import AssetUtilizationChart from "../charts/AssetUtilization";
import AssetUtilizationRateChart from "../charts/AssetUtilizationRate";

const AssetMetrics = () => {
  return (
    <Box display="flex" flexDir="column" gap="4rem">
      <Box display="flex" flexDirection="column" gap="8px" width="100%">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          height="72px"
          border="1px solid #2B2F35"
          color="#E6EDF3"
          padding="24px 24px 16px"
          fontSize="20px"
          fontStyle="normal"
          fontWeight="600"
          lineHeight="30px"
          borderRadius="6px"
        >
          Total Value Locked: $8932.14
        </Box>
        <AssetUtilizationChart
          series={[
            {
              name: "Series 1",
              data: [
                11, 21, 39, 65, 50, 22, 45, 23, 39, 67, 50, 22, 35, 23, 70, 67,
              ],
            },
          ]}
          formatter={function (value: any) {
            return value + "%";
          }}
          color={"#0FCA7A"}
        />
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
            padding="24px 24px 16px"
            fontSize="20px"
            fontStyle="normal"
            fontWeight="600"
            lineHeight="30px"
            borderRadius="6px"
          >
            Media Supply:
          </Box>
          <AssetUtilizationChart color={"#4c60ee"} />
        </Box>
        <Box display="flex" flexDirection="column" gap="8px" width="100%">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            height="72px"
            border="1px solid #2B2F35"
            color="#E6EDF3"
            padding="24px 24px 16px"
            fontSize="20px"
            fontStyle="normal"
            fontWeight="600"
            lineHeight="30px"
            borderRadius="6px"
          >
            Media Borrow:
          </Box>
          <AssetUtilizationChart color={"#4852a4"} />
        </Box>
      </Box>
    </Box>
  );
};

export default AssetMetrics;

{
  /* <Box display="flex" flexDirection="column" gap="8px" width="100%">
<Box
  display="flex"
  flexDirection="column"
  alignItems="flex-start"
  height="72px"
  border="1px solid #2B2F35"
  color="#E6EDF3"
  padding="24px 24px 16px"
  fontSize="20px"
  fontStyle="normal"
  fontWeight="600"
  lineHeight="30px"
  borderRadius="6px"
>
  Asset Utilization rate:
  </Box>
<AssetUtilizationRateChart />
</Box> */
}
