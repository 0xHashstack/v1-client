import React, { useEffect, useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import YourMetricsSupply from "./YourMetricsSupply";
import YourMetricsBorrow from "./YourMetricsBorrow";
import Image from "next/image";
import GraphContainer from "../../../../public/Graph container.png";
import { selectProtocolStats } from "@/store/slices/readDataSlice";
import { useSelector } from "react-redux";
import SupplyModal from "@/components/modals/SupplyModal";
import BorrowModal from "@/components/modals/borrowModal";
const YourMetricsSupplyBorrow = ({
  currentMarketCoin,
  totalSupply,
  totalBorrow,
}: any) => {
  const series1: any = {
    wBTC: [
      {
        name: "Series 1",
        data: [30000, 40000, 60000, 80000, 35000, 50000, 49000],
      },
    ],
    USDT: [
      {
        name: "Series 1",
        data: [50000, 49000, 60000, 80000, 30000, 40000, 35000],
      },
    ],
    USDC: [
      {
        name: "Series 1",
        data: [12300, 40000, 35000, 55000, 49000, 64340, 80000],
      },
    ],
    ETH: [
      {
        name: "Series 1",
        data: [30000, 40000, 15000, 50000, 12300, 60000, 80000],
      },
    ],
    DAI: [
      {
        name: "Series 1",
        data: [30000, 40000, 12300, 50000, 49800, 60000, 80000],
      },
    ],
    STRK: [
      {
        name: "Series 1",
        data: [30000, 40000, 12300, 50000, 49800, 60000, 80000],
      },
    ],
  };

  const series2: any = {
    BTC: [
      {
        name: "Series 1",
        data: [30000, 40000, 12300, 50000, 49800, 60000, 80000],
      },
    ],
    USDT: [
      {
        name: "Series 1",
        data: [12300, 40000, 35000, 55000, 49000, 64340, 80000],
      },
    ],
    USDC: [
      {
        name: "Series 1",
        data: [50000, 49000, 60000, 80000, 30000, 40000, 35000],
      },
    ],
    ETH: [
      {
        name: "Series 1",
        data: [30000, 40000, 15000, 50000, 12300, 60000, 80000],
      },
    ],
    DAI: [
      {
        name: "Series 1",
        data: [30000, 40000, 60000, 80000, 35000, 50000, 49000],
      },
    ],
  };
  let reduxProtocolStats = useSelector(selectProtocolStats);

  const [supplyAPRs, setSupplyAPRs]: any = useState([]);
  useEffect(() => {
    const getMarketData = async () => {
      try {
        const stats = reduxProtocolStats;

        // const stats = await getProtocolStats();
        if (stats) {
          // dispatch(setProtocolStats(stats));
        }
        ////console.log("SupplyDashboard fetchprotocolstats ", stats); //23014
        // const temp: any = ;
        setSupplyAPRs([
          stats?.[2].supplyRate,
          stats?.[3].supplyRate,
          stats?.[0].supplyRate,
          stats?.[1].supplyRate,
          stats?.[4].supplyRate,
          stats?.[5].supplyRate,
        ]);
        setBorrowAPRs([
          stats?.[2].borrowRate,
          stats?.[3].borrowRate,
          stats?.[0].borrowRate,
          stats?.[1].borrowRate,
          stats?.[4].borrowRate,
          stats?.[5].borrowRate,
        ]);
      } catch (error) {
       //console.log("error on getting protocol stats");
      }
    };
    getMarketData();
  }, [reduxProtocolStats]);
  const [currentSupplyAPR, setCurrentSupplyAPR] = useState<Number>(2);
  const [coinPassed, setCoinPassed] = useState({
    name: "BTC",
    icon: "mdi-bitcoin",
    symbol: "WBTC",
  });

  const [borrowAPRs, setBorrowAPRs] = useState<(number | undefined)[]>([]);
  const [currentBorrowAPR, setCurrentBorrowAPR] = useState<Number>(2);

  return (
    // <Box display="flex" gap="30px">
    //   <Box display="flex" flexDirection="column" gap="8px" width="50%">
    //     <Box
    //       display="flex"
    //       flexDirection="column"
    //       alignItems="flex-start"
    //       // width="723px"
    //       height="72px"
    //       border="1px solid #2B2F35"
    //       color="#E6EDF3"
    //       padding="24px 24px 16px"
    //       fontSize="20px"
    //       fontStyle="normal"
    //       fontWeight="600"
    //       lineHeight="30px"
    //       borderRadius="6px"
    //     >
    //       Supply APR:
    //     </Box>
    //     <SupplyAprChart />
    //   </Box>
    //   <Box display="flex" flexDirection="column" gap="8px" width="50%">
    //     <Box
    //       display="flex"
    //       flexDirection="column"
    //       alignItems="flex-start"
    //       // width="723px"
    //       height="72px"
    //       border="1px solid #2B2F35"
    //       color="#E6EDF3"
    //       padding="24px 24px 16px"
    //       fontSize="20px"
    //       fontStyle="normal"
    //       fontWeight="600"
    //       lineHeight="30px"
    //       borderRadius="6px"
    //     >
    //       Borrow APR:
    //     </Box>
    //     <BorrowAprChart />
    //   </Box>
    // </Box>
    <Box display="flex" gap="30px">
      <Box display="flex" flexDirection="column" gap="8px" width="100%">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          height="72px"
          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
          color={totalSupply!==0 ?"#E6EDF3":"#3E415C"}
          padding="24px 24px 16px"
          fontSize="20px"
          fontStyle="normal"
          fontWeight="600"
          lineHeight="30px"
          borderRadius="6px"
        >
          Supply:
        </Box>
        {totalSupply !== 0 ? (
          <YourMetricsSupply
            color={"#61a6a5"}
            series={series1[currentMarketCoin]}
          />
        ) : (
          <Box w="full" h="full" pos="relative" height="423px">
            <Image
              height={100}
              width={100}
              alt="disable chart"
              src={GraphContainer}
              style={{ margin: 0, height: "100%", width: "100%" }}
            />
            <Box
              pos="absolute"
              top="36"
              left="0"
              w="full"
              h="full"
              zIndex="2"
              display="flex"
              flexDir="column"
              textAlign="center"
            >
              <Text textColor="white" fontWeight="bold" fontSize="18px">
                No data source for this report
              </Text>
              <Text textColor="#6E7681" fontSize="18px" mb="1rem">
                Supply assets to uncover insights from this report
              </Text>
              {/* <Button w="70px" h="32px" fontSize="14px" p="12px" mx="auto">
                Supply
              </Button> */}
              <SupplyModal
                buttonText="Supply from metrics"
                variant="link"
                fontSize="16px"
                fontWeight="400"
                display="inline"
                color="#0969DA"
                cursor="pointer"
                ml="0.3rem"
                lineHeight="24px"
                backGroundOverLay={"rgba(244, 242, 255, 0.5);"}
                supplyAPRs={supplyAPRs}
                currentSupplyAPR={currentSupplyAPR}
                setCurrentSupplyAPR={setCurrentSupplyAPR}
                coin={coinPassed}
              />
            </Box>
          </Box>
        )}
        {/* <TrialChart
                  color={"#61a6a5"}
                  series={series1[currentMarketCoin]}
        /> */}
      </Box>
      <Box display="flex" flexDirection="column" gap="8px" width="100%" >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          height="72px"
          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
          color={totalBorrow!==0 ?"#E6EDF3":"#3E415C"}
          padding="24px 24px 16px"
          fontSize="20px"
          fontStyle="normal"
          fontWeight="600"
          lineHeight="30px"
          borderRadius="6px"
        >
          Borrow:
        </Box>
        {totalBorrow !== 0 ? (
          <YourMetricsBorrow color={"#4c60ee"} />
        ) : (
          <Box w="full" h="full" pos="relative" height="423px" >
            <Image
              height={100}
              width={100}
              alt="disable chart"
              src={GraphContainer}
              style={{ margin: 0, height: "100%", width: "100%" }}
            />
            <Box
              pos="absolute"
              
              top="36"
              left="0"
              w="full"
              h="full"
              zIndex="2"
              display="flex"
              flexDir="column"
              textAlign="center"
            >
              <Text textColor="white" fontWeight="bold" fontSize="18px">
                No data source for this report
              </Text>
              <Text textColor="#6E7681" fontSize="18px" mb="1rem">
                Borrow assets to uncover insights from this report
              </Text>
              {/* <Button w="70px" h="32px" fontSize="14px" p="12px" mx="auto">
                Borrow
              </Button> */}
              <BorrowModal
                buttonText="Borrow from metrics"
                variant="link"
                fontSize="16px"
                fontWeight="400"
                display="inline"
                color="#0969DA"
                cursor="pointer"
                ml="0.3rem"
                lineHeight="24px"
                backGroundOverLay={"rgba(244, 242, 255, 0.5);"}
                borrowAPRs={borrowAPRs}
                currentBorrowAPR={currentBorrowAPR}
                setCurrentBorrowAPR={setCurrentBorrowAPR}
                coin={coinPassed}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default YourMetricsSupplyBorrow;
