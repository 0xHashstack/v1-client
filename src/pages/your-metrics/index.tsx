import React, { useState } from "react";
import PageCard from "@/components/layouts/pageCard";
import { Box, HStack, Text, Tooltip, VStack } from "@chakra-ui/react";
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
  resetModalDropdowns
} from "@/store/slices/dropdownsSlice";
import TotalRevenueChart from "@/components/layouts/charts/TotalRevenue";
import Link from "next/link";
const YourMetrics = () => {
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
              Your metrics
            </Text>
            <Link href={"/market"}>
              <Box cursor="pointer">
                <CancelIcon />
              </Box>
            </Link>
          </HStack>
          <Box
            display="flex"
            flexDirection="column"
            mb="2rem"
            gap="8px"
            // bgColor="green"
          >
            <HStack
            // bgColor="blue"
            >
              <Text fontSize="12px" color="#6E7681">
                Market
              </Text>
              <Tooltip
                hasArrow
                placement="bottom-start"
                boxShadow="dark-lg"
                label="Select market"
                bg="#24292F"
                fontSize={"smaller"}
                fontWeight={"thin"}
                borderRadius={"lg"}
                padding={"2"}
                // bgColor="green"
              >
                <Box>
                  <InfoIcon />
                </Box>
              </Tooltip>
            </HStack>
            <Box
              display="flex"
              border="1px"
              borderColor="#2B2F35"
              justifyContent="space-between"
              alignItems="center"
              py="2"
              pl="2"
              pr="3"
              borderRadius="6px"
              className="navbar"
              cursor="pointer"
              w="23rem"
              //   bgColor="red"
              onClick={() => {
                // alert("hey");
                handleDropdownClick("yourMetricsMarketDropdown");
              }}
              as="button"
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap="1"
                // bgColor="red"
              >
                <Box p="1">{getCoin(currentMarketCoin, "16px", "16px")}</Box>
                <Text
                  color="#E6EDF3"
                  fontSize="14px"
                  //   bgColor="blue"
                  //   flexGrow={1}
                  //   display="flex"
                  //   justifyContent="center"
                  //   alignItems="center"
                  pt={1}
                >
                  {currentMarketCoin}
                </Text>
              </Box>
              <Box pt="1" className="navbar-button">
                <DropdownUp />
              </Box>
              {metricsDropdowns.yourMetricsMarketDropdown && (
                <Box
                  w="full"
                  left="0"
                  bg="#03060B"
                  py="2"
                  className="dropdown-container"
                  boxShadow="dark-lg"
                >
                  {_coins.map((coin, index) => {
                    return (
                      <Box
                        key={index}
                        as="button"
                        w="full"
                        display="flex"
                        alignItems="center"
                        gap="1"
                        pr="2"
                        onClick={() => {
                          //   alert(coin);
                          setCurrentMarketCoin(coin);
                        }}
                      >
                        {coin === currentMarketCoin && (
                          <Box
                            w="3px"
                            h="28px"
                            bg="#0C6AD9"
                            borderRightRadius="md"
                          ></Box>
                        )}
                        <Box
                          w="full"
                          display="flex"
                          py="5px"
                          px={`${coin === currentMarketCoin ? "1" : "5"}`}
                          gap="1"
                          bg={`${
                            coin === currentMarketCoin ? "#0C6AD9" : "inherit"
                          }`}
                          borderRadius="md"
                        >
                          <Box>{getCoin(coin, "16px", "16px")}</Box>
                          <Text color="#E6EDF3" >{coin}</Text>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          </Box>
          <Box
            // bgColor="cyan"
            width="70%"
            display="flex"
            justifyContent="space-between"
            mb="4rem"
          >
            {/* <HStack bgColor="green" justifyContent="space-between"> */}
            <Box display="flex" flexDirection="column" gap="22px">
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
                  Active supply markets
                </Text>
                <Box
                  //   bgColor="purple"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  gap="8px"
                >
                  <BTCLogo height={"24px"} width={"24px"} />
                  <Text color="#e6edf3" fontSize="20px">
                    BTC
                  </Text>
                </Box>
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
                  <Text color="#e6edf3" fontSize="20px">
                    $8,932.14
                  </Text>
                </VStack>
                <VStack
                  gap={"3px"}
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  // p="13px 25px"
                >
                  <Text color="#6e7681" fontSize="14px" alignItems="center">
                    Effective borrow apr
                  </Text>
                  <Text color="#e6edf3" fontSize="20px">
                    15.5%
                  </Text>
                </VStack>
              </HStack>
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
                    Active borrow market
                  </Text>
                  <Box
                    // bgColor="purple"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap="8px"
                  >
                    <BTCLogo height={"24px"} width={"24px"} />
                    <Text color="#e6edf3" fontSize="20px">
                      BTC
                    </Text>
                  </Box>
                </VStack>
              </HStack>
            </Box>
            {/* </HStack> */}
          </Box>
          <Box
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
                      placement="bottom-start"
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
          </Box>
        </Box>
      </Box>
      {/* )} */}
    </PageCard>
  );
};

export default YourMetrics;
