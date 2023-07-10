import React, { useEffect, useState } from "react";
import PageCard from "@/components/layouts/pageCard";
import { Box, HStack, Skeleton, Text, Tooltip, VStack } from "@chakra-ui/react";
import CancelIcon from "@/assets/icons/cancelIcon";
import InfoIcon from "@/assets/icons/infoIcon";
import BTCLogo from "@/assets/icons/coins/btc";
import InfoIconBig from "@/assets/icons/infoIconBig";
import DropdownUp from "@/assets/icons/dropdownUpIcon";
import getCoin from "@/utils/functions/getCoin";
import { useDispatch, useSelector } from "react-redux";
import _coins from "@/utils/constants/coins";
import {
  selectMetricsDropdowns,
  setMetricsDropdown,
  resetModalDropdowns,
} from "@/store/slices/dropdownsSlice";
import { useAccount, useConnectors } from "@starknet-react/core";
import TotalRevenueChart from "@/components/layouts/charts/TotalRevenue";
import Link from "next/link";
import { getProtocolStats } from "@/Blockchain/scripts/protocolStats";
import YourMetricsSupplyBorrow from "@/components/layouts/charts/yourMetricsSupplyBorrow";
import {
  selectAvgBorrowAPR,
  selectAvgSupplyAPR,
} from "@/store/slices/userAccountSlice";
import {
  selectProtocolReserves,
  selectProtocolStats,
  selectNetAPR,
  selectYourSupply,
  selectYourBorrow,
} from "@/store/slices/readDataSlice";
import numberFormatter from "@/utils/functions/numberFormatter";
import useDataLoader from "@/hooks/useDataLoader";
const YourMetrics = () => {
  //   const [metricsCancel, setMetricsCancel] = useState(false);
  const [currentMarketCoin, setCurrentMarketCoin] = useState("BTC");
  const dispatch = useDispatch();
  const { available, disconnect, connect, connectors, refresh } =
    useConnectors();
  const { account: _account } = useAccount();
  useDataLoader();
  // useEffect(() => {
  //   if (!_account) {
  //     const walletConnected = localStorage.getItem("lastUsedConnector");
  //     if (walletConnected == "braavos") {
  //       disconnect();
  //       connect(connectors[0]);
  //     } else if (walletConnected == "argentx") {
  //       disconnect();
  //       connect(connectors[0]);
  //     }
  // }
  // }, []);
  const [protocolStats, setProtocolStats] = useState<any>([]);
  const totalSupply = useSelector(selectYourSupply);
  const netAPR = useSelector(selectNetAPR);
  const totalBorrow = useSelector(selectYourBorrow);
  const avgBorrowApr = useSelector(selectAvgBorrowAPR);
  const avgSupplyApr = useSelector(selectAvgSupplyAPR);
  const protocolStatsRedux = useSelector(selectProtocolStats);
  useEffect(() => {
    try {
      const fetchProtocolStats = async () => {
        const stats = protocolStatsRedux;
        setProtocolStats([
          stats?.[2],
          stats?.[3],
          stats?.[0],
          stats?.[1],
          stats?.[4],
        ]);
      };
      fetchProtocolStats();
    } catch (err: any) {}
  }, [protocolStatsRedux]);
  return (
    <PageCard pt="8rem">
      {/* {!metricsCancel && ( */}
      <Box
        width="95%"
        p="2rem 4rem"
        bgColor="#101216"
        display="flex"
        borderRadius="5px"
        border="1px solid #2b2f35"
      >
        <Box
          // bgColor="blue"
          width="100%"
        >
          <HStack justifyContent="space-between" mb="4rem">
            <Text color="#E6EDF3" fontSize="28px">
              Your metrics
            </Text>
            <Link href={"/v1/market"}>
              <Box cursor="pointer">
                <CancelIcon />
              </Box>
            </Link>
          </HStack>
          <Box
            // bgColor="cyan"
            width="80%"
            display="flex"
            justifyContent="space-between"
            mb="3rem"
          >
            {/* <HStack bgColor="green" justifyContent="space-between"> */}
            <Box display="flex" flexDirection="row" gap="22px">
              <VStack
                display="flex"
                justifyContent="center"
                alignItems="flex-start"
                gap={"3px"}
                p="13px 25px"
                // bgColor="pink"
              >
                <Text color="#6e7681" fontSize="14px" alignItems="center">
                  Total Supply
                </Text>
                {!totalSupply ? (
                  <Skeleton
                    width="6rem"
                    height="1.9rem"
                    startColor="#101216"
                    endColor="#2B2F35"
                    borderRadius="6px"
                  />
                ) : (
                  <Text color="#e6edf3" fontSize="20px">
                    ${numberFormatter(totalSupply)}
                  </Text>
                )}
              </VStack>
              <VStack
                display="flex"
                justifyContent="center"
                alignItems="flex-start"
                gap={"3px"}
                p="13px 25px"
                // bgColor="pink"
              >
                <Text color="#6e7681" fontSize="14px" alignItems="center">
                  Average Supply APR
                </Text>
                {!avgSupplyApr ? (
                  <Skeleton
                    width="6rem"
                    height="1.9rem"
                    startColor="#101216"
                    endColor="#2B2F35"
                    borderRadius="6px"
                  />
                ) : (
                  <Text color="#e6edf3" fontSize="20px">
                    {avgSupplyApr?.toFixed(2)}%
                  </Text>
                )}
              </VStack>
            </Box>
            <Box display="flex" flexDirection="column" gap="22px">
              <HStack
                // width="13.5rem"
                display="flex"
                // bgColor="yellow"
                // flexGrow={1}
                gap="2rem"
              >
                <VStack
                  display="flex"
                  justifyContent="center"
                  alignItems="flex-start"
                  gap={"3px"}
                  p="13px 25px"
                >
                  <Text color="#6e7681" fontSize="14px" alignItems="center">
                    Your borrow
                  </Text>
                  {!totalBorrow ? (
                    <Skeleton
                      width="6rem"
                      height="1.9rem"
                      startColor="#101216"
                      endColor="#2B2F35"
                      borderRadius="6px"
                    />
                  ) : (
                    <Text color="#e6edf3" fontSize="20px">
                      ${numberFormatter(totalBorrow)}
                    </Text>
                  )}
                </VStack>
                <VStack
                  gap={"3px"}
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  // p="13px 25px"
                >
                  <Text color="#6e7681" fontSize="14px" alignItems="center">
                    Average borrow apr
                  </Text>
                  {!avgBorrowApr ? (
                    <Skeleton
                      width="6rem"
                      height="1.9rem"
                      startColor="#101216"
                      endColor="#2B2F35"
                      borderRadius="6px"
                    />
                  ) : (
                    <Text color="#e6edf3" fontSize="20px">
                      {avgBorrowApr?.toFixed(2)}%
                    </Text>
                  )}
                </VStack>
                <VStack
                  gap={"3px"}
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  // p="13px 25px"
                >
                  <Text color="#6e7681" fontSize="14px" alignItems="center">
                    Effective apr
                  </Text>
                  {!netAPR ? (
                    <Skeleton
                      width="6rem"
                      height="1.9rem"
                      startColor="#101216"
                      endColor="#2B2F35"
                      borderRadius="6px"
                    />
                  ) : (
                    <Text color="#e6edf3" fontSize="20px">
                      {netAPR}%
                    </Text>
                  )}
                </VStack>
              </HStack>
            </Box>
            {/* </HStack> */}
          </Box>
          <Box>
            <YourMetricsSupplyBorrow currentMarketCoin={currentMarketCoin} />
          </Box>
          {/* <Box
            //   bgColor="green"
            borderRadius="6px"
            border="1px solid #2B2F35"
          >
            <Box p="1.5rem" borderBottom="1px solid #2B2F35">
              <Box>
                <VStack
                  display="flex"
                  justifyContent="center"
                  alignItems="flex-start"
                  gap={"3px"}
                  //   bgColor="yellow"
                  //   p="13px 25px"
                >
                  <HStack>
                    <Text fontSize="14px" color="#6E7681">
                      Total Revenue
                    </Text>
                    <Tooltip
                      hasArrow
                      placement="right"
                      boxShadow="dark-lg"
                      label="Total revenue"
                      bg="#24292F"
                      fontSize={"smaller"}
                      fontWeight={"thin"}
                      borderRadius={"lg"}
                      padding={"2"}
                      // bgColor="green"
                    >
                      <Box>
                        <InfoIconBig />
                      </Box>
                    </Tooltip>
                  </HStack>
                  <Text color="#E6EDF3" fontSize="20px">
                    $190,090.36
                  </Text>
                </VStack>
              </Box>
            </Box>
            <Box>
              <TotalRevenueChart />
            </Box>
          </Box> */}
        </Box>
      </Box>
      {/* )} */}
    </PageCard>
  );
};

export default YourMetrics;
