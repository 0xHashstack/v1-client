import {
  Box,
  Button,
  HStack,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tooltip,
  Tr,
  useMediaQuery,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import StrkIcon from "@/assets/icons/strkIcon";
import BorrowModal from "@/components/modals/borrowModal";
import TradeModal from "@/components/modals/tradeModal";
import {
  selectStrkAprData,
  selectnetSpendBalance,
} from "@/store/slices/userAccountSlice";
import numberFormatter from "@/utils/functions/numberFormatter";
import numberFormatterPercentage from "@/utils/functions/numberFormatterPercentage";

export interface ICoin {
  name: string;
  symbol: string;
  icon: string;
}

export const Coins: ICoin[] = [
  { name: "STRK", icon: "mdi-strk", symbol: "STRK" },
  { name: "USDT", icon: "mdi-bitcoin", symbol: "USDT" },
  { name: "USDC", icon: "mdi-ethereum", symbol: "USDC" },
  { name: "ETH", icon: "mdi-ethereum", symbol: "WETH" },
  { name: "BTC", icon: "mdi-bitcoin", symbol: "WBTC" },
  { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
];

interface DashboardRightProps {
  width: string;
  oraclePrices: any;
  utilization: any;
  totalBorrows: any;
  availableReserves: any;
  borrowAPRs: any;
  validRTokens: any;
  supplyAPRs: any;
  protocolStats: any;
}

const columnItems = [
  "Market",
  "Total borrow",
  "Available",
  "Utillization",
  "Borrow APR",
  "",
  "",
];

const tooltips = [
  "Available markets.",
  "The number of tokens that are currently borrowed from the protocol.",
  "The number of tokens that can be borrowed from the protocol.",
  "Represents how much of a pool has been borrowed",
  "The annual interest rate charged on borrowed funds from the protocol.",
];

const DashboardRight: React.FC<DashboardRightProps> = ({
  width,
  oraclePrices,
  utilization,
  totalBorrows,
  availableReserves,
  borrowAPRs,
  supplyAPRs,
  validRTokens,
  protocolStats,
}) => {
  const [currentBorrowAPR, setCurrentBorrowAPR] = useState<number>();
  const [currentSupplyAPR, setCurrentSupplyAPR] = useState<number>();
  const [netStrkBorrow, setnetStrkBorrow] = useState(0);
  const [isLargerThan1280] = useMediaQuery("(min-width: 1248px)");
  const [currentBorrowMarketCoin, setCurrentBorrowMarketCoin] = useState("BTC");

  const strkData = useSelector(selectStrkAprData);
  const netSpendBalance = useSelector(selectnetSpendBalance);

  const coinPrices = Coins.map((coin) => {
    const matchingCoin = oraclePrices?.find(
      (c: { name: string }) =>
        c?.name?.toLowerCase() === coin?.name.toLowerCase()
    );
    if (matchingCoin) {
      const formattedPrice = matchingCoin?.price.toFixed(3);
      return { name: coin?.name, price: formattedPrice };
    }
    return null;
  });

  const getBoostedApr = (coin: any) => {
    if (strkData == null) {
      return 0;
    } else {
      if (strkData?.[coin?.name]) {
        if (oraclePrices == null) {
          return 0;
        } else {
          if (netStrkBorrow != 0) {
            if (netSpendBalance) {
              let value =
                (365 *
                  100 *
                  netStrkBorrow *
                  oraclePrices?.find((curr: any) => curr.name === "STRK")
                    ?.price) /
                netSpendBalance;
              return value;
            } else {
              return 0;
            }
          } else {
            return 0;
          }
        }
      } else {
        return 0;
      }
    }
  };

  useEffect(() => {
    if (strkData != null) {
      let netallocation = 0;
      for (let token in strkData) {
        if (strkData.hasOwnProperty(token)) {
          const array = strkData[token];
          const lastObject = array[array.length - 1];
          netallocation += 0.3 * lastObject.allocation;
        }
      }
      setnetStrkBorrow(netallocation);
    } else {
      setnetStrkBorrow(0);
    }
  }, [strkData]);

  return (
    <TableContainer
      background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
      color="white"
      borderRadius="md"
      w={width}
      display="flex"
      justifyContent="flex-start"
      alignItems="flex-start"
      height={"100%"}
      paddingX={isLargerThan1280 ? "2rem" : "1rem"}
      pt={"1.7rem"}
      overflowX="hidden"
    >
      <Table variant="unstyled" width="100%" height="100%">
        <Thead width={"100%"} height={"2.7rem"}>
          <Tr width={"100%"}>
            {columnItems.map((val, idx) => (
              <Td key={idx} fontSize={"12px"} fontWeight={400} padding={0}>
                <Text
                  whiteSpace="pre-wrap"
                  overflowWrap="break-word"
                  width={"100%"}
                  height={"2rem"}
                  textAlign={idx == 0 ? "left" : "center"}
                  color={"#CBCBD1"}
                  padding={0}
                >
                  <Tooltip
                    hasArrow
                    label={tooltips[idx]}
                    placement={
                      (idx === 0 && "bottom-start") ||
                      (idx === columnItems.length - 1 && "bottom-end") ||
                      "bottom"
                    }
                    rounded="md"
                    boxShadow="dark-lg"
                    bg="#02010F"
                    fontSize={"13px"}
                    fontWeight={"400"}
                    borderRadius={"lg"}
                    padding={"2"}
                    color="#F0F0F5"
                    border="1px solid"
                    borderColor="#23233D"
                    arrowShadowColor="#2B2F35"
                  >
                    {val}
                  </Tooltip>
                </Text>
              </Td>
            ))}
          </Tr>
        </Thead>

        <Tbody position="relative" overflowX="hidden">
          {Coins?.map((coin, idx) => (
            <>
              <Tr
                key={idx}
                width={"100%"}
                height={"5rem"}
                position="relative"
                bg={
                  coin?.name === "STRK"
                    ? "linear-gradient(90deg, #34345600 0%, #34345688 50%, #34345600 100%, #34345600 100%)"
                    : ""
                }
              >
                <Td
                  width={"14%"}
                  fontSize={"12px"}
                  fontWeight={400}
                  padding={0}
                  textAlign="left"
                >
                  <HStack gap="10px">
                    <Box height="32px" width="32px">
                      <Image
                        src={
                          coin?.name == "DAI"
                            ? `/${coin?.name}Disabled.svg`
                            : `/${coin?.name}.svg`
                        }
                        alt="Picture of the author"
                        width="32"
                        height="32"
                      />
                    </Box>
                    <Box gap="0.2rem" display={"flex"} flexDirection="column">
                      <Text fontSize="14px">
                        {coin?.name == "BTC" || coin?.name == "ETH"
                          ? "w" + coin?.name
                          : coin?.name}
                      </Text>
                      {coin?.name == "DAI" && (
                        <Image
                          src={`/paused.svg`}
                          alt={`Picture of the coin that I want to access ${coin?.name}`}
                          width="48"
                          height="16"
                        />
                      )}
                      {coin?.name == "STRK" && (
                        <Image
                          src={`/new.svg`}
                          alt={`Picture of the coin that I want to access ${coin?.name}`}
                          width="36"
                          height="16"
                        />
                      )}
                    </Box>
                  </HStack>
                </Td>

                <Td
                  width={"17%"}
                  maxWidth={"3rem"}
                  fontSize={"14px"}
                  fontWeight={400}
                  overflow={"hidden"}
                  textAlign={"center"}
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                    color={coin?.name == "DAI" ? "#3E415C" : "white"}
                  >
                    <Tooltip
                      hasArrow
                      arrowShadowColor="#2B2F35"
                      placement="right"
                      boxShadow="dark-lg"
                      label={
                        totalBorrows[idx] !== null
                          ? idx == 3
                            ? totalBorrows[idx]?.toFixed(4)
                            : totalBorrows[idx]?.toFixed(2)
                          : ""
                      }
                      bg="#02010F"
                      fontSize={"13px"}
                      fontWeight={"400"}
                      borderRadius={"lg"}
                      padding={"2"}
                      color="#F0F0F5"
                      border="1px solid"
                      borderColor="#23233D"
                    >
                      {totalBorrows[idx] == null ? (
                        <Skeleton
                          width="6rem"
                          height="1.4rem"
                          startColor="#101216"
                          endColor="#2B2F35"
                          borderRadius="6px"
                        />
                      ) : (
                        numberFormatter(totalBorrows[idx])
                      )}
                    </Tooltip>
                  </Box>
                </Td>

                <Td
                  width={"17%"}
                  maxWidth={"3rem"}
                  fontSize={"14px"}
                  fontWeight={400}
                  overflow={"hidden"}
                  textAlign={"center"}
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                    color={coin?.name == "DAI" ? "#3E415C" : "white"}
                  >
                    <Tooltip
                      hasArrow
                      arrowShadowColor="#2B2F35"
                      placement="right"
                      boxShadow="dark-lg"
                      label={
                        availableReserves[idx] !== null
                          ? idx == 3
                            ? availableReserves[idx]?.toFixed(4)
                            : availableReserves[idx]?.toFixed(2)
                          : ""
                      }
                      bg="#02010F"
                      fontSize={"13px"}
                      fontWeight={"400"}
                      borderRadius={"lg"}
                      padding={"2"}
                      color="#F0F0F5"
                      border="1px solid"
                      borderColor="#23233D"
                    >
                      {/* {checkGap(idx1, idx2)} */}
                      {availableReserves[idx] == null ? (
                        <Skeleton
                          width="6rem"
                          height="1.4rem"
                          startColor="#101216"
                          endColor="#2B2F35"
                          borderRadius="6px"
                        />
                      ) : (
                        numberFormatter(availableReserves[idx])
                      )}
                    </Tooltip>
                  </Box>
                </Td>

                <Td
                  width={"15%"}
                  maxWidth={"3rem"}
                  fontSize={"14px"}
                  fontWeight={400}
                  overflow={"hidden"}
                  textAlign={"center"}
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                    color={coin?.name == "DAI" ? "#3E415C" : "white"}
                  >
                    {utilization[idx] == null ? (
                      <Skeleton
                        width="6rem"
                        height="1.4rem"
                        startColor="#101216"
                        endColor="#2B2F35"
                        borderRadius="6px"
                      />
                    ) : (
                      numberFormatterPercentage(utilization[idx]) + "%"
                    )}
                  </Box>
                </Td>

                <Td
                  width={"15%"}
                  maxWidth={"3rem"}
                  fontSize={"14px"}
                  fontWeight={400}
                  overflow={"hidden"}
                  textAlign={"center"}
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                    color={
                      coin?.name == "DAI"
                        ? "#3E415C"
                        : coin?.name == "BTC"
                        ? "white"
                        : "#00D395"
                    }
                  >
                    <Tooltip
                      hasArrow
                      arrowShadowColor="#2B2F35"
                      placement="bottom"
                      boxShadow="dark-lg"
                      label={
                        <Box>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            gap={10}
                          >
                            <Text>Borrow APR:</Text>
                            <Text>
                              -{numberFormatterPercentage(borrowAPRs[idx])}%
                            </Text>
                          </Box>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            gap={10}
                            mb="2"
                          >
                            <Text>STRK APR:</Text>
                            <Text>
                              {numberFormatterPercentage(getBoostedApr(coin))}%
                            </Text>
                          </Box>
                          <hr />
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            gap={10}
                            mt="2"
                          >
                            <Text>Effective APR:</Text>
                            <Text>
                              {numberFormatterPercentage(
                                Math.abs(getBoostedApr(coin) - borrowAPRs[idx])
                              )}
                              %
                            </Text>
                          </Box>
                        </Box>
                      }
                      bg="#02010F"
                      fontSize={"13px"}
                      fontWeight={"400"}
                      borderRadius={"lg"}
                      padding={"2"}
                      color="#F0F0F5"
                      border="1px solid"
                      borderColor="#23233D"
                    >
                      {borrowAPRs[idx] == null ? (
                        <Skeleton
                          width="6rem"
                          height="1.4rem"
                          startColor="#101216"
                          endColor="#2B2F35"
                          borderRadius="6px"
                        />
                      ) : (
                        borrowAPRs[idx] !== null &&
                        (coin.name != "BTC" && coin.name !== "DAI" ? (
                          <Box
                            display="flex"
                            justifyContent="center"
                            flexDirection="column"
                            gap="1"
                          >
                            <Text color={coin?.name=="DAI" ?"#3E415C": "#F0F0F5"}>
                              {numberFormatterPercentage(borrowAPRs[idx])}%
                            </Text>
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              gap="1.5"
                            >
                              <StrkIcon />
                              {numberFormatterPercentage(getBoostedApr(coin))}%
                            </Box>
                          </Box>
                        ) : (
                          <Text color={coin?.name == "DAI"
                          ? "#3E415C"
                          : coin?.name == "BTC"
                          ? "white"
                          : "#00D395"
                      }>
                            {numberFormatterPercentage(borrowAPRs[idx])}%
                          </Text>
                        ))
                      )}
                    </Tooltip>
                  </Box>
                </Td>

                <Td
                  width={"8%"}
                  maxWidth={"5rem"}
                  fontSize={"14px"}
                  fontWeight={400}
                  textAlign={"center"}
                  p={1.5}
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                    onClick={() => {
                      setCurrentBorrowAPR(idx);
                      setCurrentSupplyAPR(idx);
                      setCurrentBorrowMarketCoin(coin?.name);
                    }}
                  >
                    {coin?.name == "DAI" ? (
                      <Button
                        height={"2rem"}
                        fontSize={"12px"}
                        padding="6px 12px"
                        border="1px solid #3E415C"
                        bgColor="transparent"
                        _hover={{ bg: "white", color: "black" }}
                        borderRadius={"6px"}
                        color="#3E415C"
                      >
                        Borrow
                      </Button>
                    ) : (
                      <BorrowModal
                        buttonText="Borrow"
                        height={"2rem"}
                        fontSize={"12px"}
                        padding="6px 12px"
                        border="1px solid #BDBFC1"
                        bgColor="transparent"
                        _hover={{ bg: "white", color: "black" }}
                        borderRadius={"6px"}
                        color="#BDBFC1;"
                        backGroundOverLay="rgba(244, 242, 255, 0.5)"
                        coin={coin}
                        borrowAPRs={borrowAPRs}
                        currentBorrowAPR={currentBorrowAPR}
                        setCurrentBorrowAPR={setCurrentBorrowAPR}
                        validRTokens={validRTokens}
                        currentBorrowMarketCoin={currentBorrowMarketCoin}
                        protocolStats={protocolStats}
                      />
                    )}
                  </Box>
                </Td>

                <Td
                  width={"8%"}
                  fontSize={"14px"}
                  fontWeight={400}
                  textAlign={"center"}
                  p={0}
                  pl={2}
                >
                  <Box
                    position="relative"
                    display="inline-block"
                    onClick={() => {
                      setCurrentBorrowAPR(idx);
                      setCurrentSupplyAPR(idx);
                    }}
                  >
                    {coin?.name == "DAI" ? (
                      <Text
                        color="#3E415C"
                        borderBottom="1px solid #3E415C"
                        cursor="pointer"
                      >
                        Spend
                      </Text>
                    ) : (
                      <TradeModal
                        coin={coin}
                        borrowAPRs={borrowAPRs}
                        currentBorrowAPR={currentBorrowAPR}
                        supplyAPRs={supplyAPRs}
                        currentSupplyAPR={currentSupplyAPR}
                        setCurrentBorrowAPR={setCurrentBorrowAPR}
                        validRTokens={validRTokens}
                        currentBorrowMarketCoin={currentBorrowMarketCoin}
                      />
                    )}
                  </Box>
                </Td>
              </Tr>

              <Tr
                style={{
                  position: "absolute",
                  height: "1px",
                  borderWidth: "0",
                  backgroundColor: "#2b2f35",
                  width: "100%",
                  display: `${
                    idx == Coins.length - 1
                      ? "none"
                      : idx == 0
                      ? "none"
                      : "block"
                  }`,
                }}
              />
            </>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default DashboardRight;
