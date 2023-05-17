import React, { useState } from "react";
import PageCard from "@/components/layouts/pageCard";
import { Box, HStack, Text, Tooltip, VStack } from "@chakra-ui/react";
import CancelIcon from "@/assets/icons/cancelIcon";
import SliderTooltip from "@/components/uiElements/sliders/sliderTooltip";
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
} from "@/store/slices/dropdownsSlice";
import AssetMetrics from "@/components/layouts/metrics/AssetMetrics";
import SupplyMetrics from "@/components/layouts/metrics/SupplyMetrics";
import RiskMetrics from "@/components/layouts/metrics/RiskMetrics";
import Link from "next/link";
const ProtocolMetrics = () => {
  //   const [metricsCancel, setMetricsCancel] = useState(false);
  const [currentMarketCoin, setCurrentMarketCoin] = useState("BTC");
  const dispatch = useDispatch();
  const metricsDropdowns = useSelector(selectMetricsDropdowns);
  const handleDropdownClick = (dropdownName: any) => {
    // alert(dropdownName);
    dispatch(setMetricsDropdown(dropdownName));
  };
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
              Protocol metrics
            </Text>
            <Link href={"/market"}>
              <Box cursor="pointer">
                <CancelIcon />
              </Box>
            </Link>
          </HStack>

          <Box
            // bgColor="cyan"
            width="100%"
            display="flex"
            justifyContent="space-between"
            mb="2rem"
          >
            <HStack width="50%">
              <VStack
                display="flex"
                justifyContent="center"
                alignItems="flex-start"
                gap={"3px"}
                p="13px 25px"
                //   bgColor="pink"
              >
                <Text color="#6e7681" fontSize="14px" alignItems="center">
                  Supplied liquidity
                </Text>
                <Text color="#e6edf3" fontSize="20px">
                  $8,932.14
                </Text>
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
                  Borrowed liquidity:
                </Text>
                <Text color="#e6edf3" fontSize="20px">
                  $ 1,000,395
                </Text>
              </VStack>
            </HStack>
            <HStack width="50%">
              <VStack
                display="flex"
                justifyContent="center"
                alignItems="flex-start"
                gap={"3px"}
                p="13px 25px"
                //   bgColor="pink"
              >
                <Text color="#6e7681" fontSize="14px" alignItems="center">
                  Supplied liquidity
                </Text>
                <Text color="#e6edf3" fontSize="20px">
                  $8,932.14
                </Text>
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
                  Borrowed liquidity:
                </Text>
                <Text color="#e6edf3" fontSize="20px">
                  $ 1,000,395
                </Text>
              </VStack>
            </HStack>
          </Box>
          <Box mb="4rem">
            <AssetMetrics />
          </Box>
          <Box
            // bgColor="cyan"
            width="100%"
            display="flex"
            justifyContent="space-between"
            mb="2rem"
          >
            <HStack width="50%">
              <VStack
                display="flex"
                justifyContent="center"
                alignItems="flex-start"
                gap={"3px"}
                p="13px 25px"
                //   bgColor="pink"
              >
                <Text color="#6e7681" fontSize="14px" alignItems="center">
                  Average supply APR:
                </Text>
                <Text color="#e6edf3" fontSize="20px">
                  3.6%
                </Text>
              </VStack>
            </HStack>
            <HStack width="50%">
              <VStack
                display="flex"
                justifyContent="center"
                alignItems="flex-start"
                gap={"3px"}
                p="13px 25px"
                //   bgColor="pink"
              >
                <Text color="#6e7681" fontSize="14px" alignItems="center">
                  Average borrow APR:
                </Text>
                <Text color="#e6edf3" fontSize="20px">
                  3.6%
                </Text>
              </VStack>
            </HStack>
          </Box>
          <Box mb="4rem" width="100%">
            <SupplyMetrics />
          </Box>
          <Box>
            <RiskMetrics />
          </Box>
        </Box>
      </Box>
      {/* )} */}
    </PageCard>
  );
};

export default ProtocolMetrics;
