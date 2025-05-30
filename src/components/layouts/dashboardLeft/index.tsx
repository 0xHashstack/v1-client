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
import { useAccount } from "@starknet-react/core";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uint256 } from "starknet";

import useBalanceOf from "@/Blockchain/hooks/Reads/useBalanceOf";
import {
  tokenAddressMap,
  tokenDecimalsMap,
} from "@/Blockchain/utils/addressServices";
import { parseAmount } from "@/Blockchain/utils/utils";
import StrkIcon from "@/assets/icons/strkIcon";
import StakeUnstakeModal from "@/components/modals/StakeUnstakeModal";
import SupplyModal from "@/components/modals/SupplyModal";
import { selectStrkAprData } from "@/store/slices/userAccountSlice";
import numberFormatter from "@/utils/functions/numberFormatter";
import numberFormatterPercentage from "@/utils/functions/numberFormatterPercentage";

export interface ICoin {
  name: string;
  symbol: string;
  icon: string;
}

interface DashboardLeftProps {
  width: string;
  oraclePrices: any;
  totalSupplies: any;
  supplyAPRs: any;
  validRTokens: any;
}

const tooltips = [
  "Available markets.",
  "Market value of the token",
  "The number of tokens that currently exists in the protocol.",
  "Annual interest rate earned on supplied funds.",
];

const columnItems = ["Market", "Price", "Total Supply", "Supply APR", "", ""];

export const Coins: ICoin[] = [
  { name: "STRK", icon: "mdi-strk", symbol: "STRK" },
  { name: "USDT", icon: "mdi-bitcoin", symbol: "USDT" },
  { name: "USDC", icon: "mdi-ethereum", symbol: "USDC" },
  { name: "ETH", icon: "mdi-ethereum", symbol: "WETH" },
  { name: "BTC", icon: "mdi-bitcoin", symbol: "WBTC" },
  // { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
];

const DashboardLeft: React.FC<DashboardLeftProps> = ({
  width,
  oraclePrices,
  totalSupplies,
  supplyAPRs,
  validRTokens,
}) => {
  const [currentSupplyAPR, setCurrentSupplyAPR] = useState<Number>();

  const strkData = useSelector(selectStrkAprData);

  const [isLargerThan1280] = useMediaQuery("(min-width: 1248px)");

  const assetBalance: any = {
    USDT: useBalanceOf(tokenAddressMap["USDT"]),
    USDC: useBalanceOf(tokenAddressMap["USDC"]),
    BTC: useBalanceOf(tokenAddressMap["BTC"]),
    ETH: useBalanceOf(tokenAddressMap["ETH"]),
    // DAI: useBalanceOf(tokenAddressMap["DAI"]),
    STRK: useBalanceOf(tokenAddressMap["STRK"]),
  };

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
          let value = strkData?.[coin?.name]
            ? (365 *
                100 *
                strkData?.[coin?.name][strkData[coin?.name]?.length - 1]
                  ?.allocation *
                0.7 *
                oraclePrices?.find((curr: any) => curr.name === "STRK")
                  ?.price) /
              strkData?.[coin?.name][strkData[coin?.name].length - 1]
                ?.supply_usd
            : 0;
          return value;
        }
      } else {
        return 0;
      }
    }
  };

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
            {columnItems.map((val: any, idx: any) => (
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
          {Coins.map((coin, idx) => (
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
                  width={"17%"}
                  fontSize={"12px"}
                  fontWeight={400}
                  padding={0}
                >
                  <HStack
                    gap="10px"
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <Box height="2rem" width="2rem">
                      <Image
                        src={
                          coin?.name == "DAI"
                            ? `/${coin?.name}Disabled.svg`
                            : `/${coin?.name}.svg`
                        }
                        alt={`Picture of the coin that I want to access ${coin?.name}`}
                        width="32"
                        height="32"
                      />
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      gap="1px"
                      pt="3px"
                    >
                      <Box display="flex" gap="0.5rem">
                        <Text fontSize="14px" fontWeight="400">
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
                      {!assetBalance[coin?.name]?.dataBalanceOf ? (
                        <Text fontSize="9px" fontWeight="400" color="#8C8C8C">
                          Wallet Bal. -
                        </Text>
                      ) : (
                        <Text fontSize="9px" fontWeight="400" color="#8C8C8C">
                          Wallet Bal. {/* {numberFormatter( */}
                          {numberFormatter(
                            parseAmount(
                              String(
                                uint256.uint256ToBN(
                                  assetBalance[coin?.name]?.dataBalanceOf
                                    ?.balance
                                )
                              ),
                              tokenDecimalsMap[coin?.name]
                            )
                          )}
                          {/* )} */}
                        </Text>
                      )}
                    </Box>
                  </HStack>
                </Td>

                <Td
                  width={"18%"}
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
                    {coinPrices[idx] === null ? (
                      <Skeleton
                        width="6rem"
                        height="1.4rem"
                        startColor="#101216"
                        endColor="#2B2F35"
                        borderRadius="6px"
                      />
                    ) : coinPrices[idx]?.price == 0 ? (
                      0
                    ) : (
                      numberFormatter(coinPrices[idx]?.price)
                    )}
                  </Box>
                </Td>

                <Td
                  width={"18%"}
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
                        totalSupplies[idx] !== null
                          ? idx == 3
                            ? totalSupplies[idx]?.toFixed(4)
                            : totalSupplies[idx]?.toFixed(2)
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
                      {totalSupplies[idx] == null ? (
                        <Skeleton
                          width="6rem"
                          height="1.4rem"
                          startColor="#101216"
                          endColor="#2B2F35"
                          borderRadius="6px"
                        />
                      ) : (
                        numberFormatter(totalSupplies[idx])
                      )}
                    </Tooltip>
                  </Box>
                </Td>

                <Td
                  width={"18%"}
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
                            <Text>Supply APR:</Text>
                            <Text>
                              {numberFormatterPercentage(supplyAPRs[idx])}%
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
                                supplyAPRs[idx] + getBoostedApr(coin)
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
                      {supplyAPRs[idx] == null || oraclePrices?.length == 0 ? (
                        <Skeleton
                          width="6rem"
                          height="1.4rem"
                          startColor="#101216"
                          endColor="#2B2F35"
                          borderRadius="6px"
                        />
                      ) : (
                        supplyAPRs[idx] != null &&
                        (coin.name != "BTC" && coin.name !== "DAI" ? (
                          <Box
                            display="flex"
                            justifyContent="center"
                            flexDirection="column"
                            gap="1"
                          >
                            <Text color="#F0F0F5">
                              {numberFormatterPercentage(supplyAPRs[idx])}%
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
                            {numberFormatterPercentage(supplyAPRs[idx])}%
                          </Text>
                        ))
                      )}
                    </Tooltip>
                  </Box>
                </Td>

                <Td
                  width={"4%"}
                  maxWidth={"5rem"}
                  fontSize={"14px"}
                  fontWeight={400}
                  textAlign={"right"}
                  p={0}
                  pr={3}
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                    onClick={() => {
                      setCurrentSupplyAPR(idx);
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
                        Supply
                      </Button>
                    ) : (
                      <SupplyModal
                        buttonText="Supply"
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
                        supplyAPRs={supplyAPRs}
                        currentSupplyAPR={currentSupplyAPR}
                        setCurrentSupplyAPR={setCurrentSupplyAPR}
                      />
                    )}
                  </Box>
                </Td>

                <Td
                  width={"7%"}
                  fontSize={"14px"}
                  fontWeight={400}
                  textAlign={"center"}
                  p={0}
                  pl={2}
                >
                  <Box position="relative" display="inline-block">
                    {coin?.name == "DAI" ? (
                      <Text
                        color="#3E415C"
                        borderBottom="1px solid #3E415C"
                        cursor="pointer"
                      >
                        Stake
                      </Text>
                    ) : (
                      <StakeUnstakeModal
                        coin={coin}
                        nav={false}
                        validRTokens={validRTokens}
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

export default DashboardLeft;
