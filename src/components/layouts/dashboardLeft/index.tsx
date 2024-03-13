import React, { useEffect, useState } from "react";

import useBalanceOf from "@/Blockchain/hooks/Reads/useBalanceOf";
import { getOraclePrices } from "@/Blockchain/scripts/getOraclePrices";
import { BNtoNum, parseAmount } from "@/Blockchain/utils/utils";
import StakeUnstakeModal from "@/components/modals/StakeUnstakeModal";
import SupplyModal from "@/components/modals/SupplyModal";
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
import { uint256 } from "starknet";

import {
  tokenAddressMap,
  tokenDecimalsMap,
} from "@/Blockchain/utils/addressServices";
import FireIcon from "@/assets/icons/fireIcon";
import { selectStrkAprData } from "@/store/slices/userAccountSlice";
import numberFormatter from "@/utils/functions/numberFormatter";
import numberFormatterPercentage from "@/utils/functions/numberFormatterPercentage";
import { useAccount } from "@starknet-react/core";
import { useDispatch, useSelector } from "react-redux";
export interface ICoin {
  name: string;
  symbol: string;
  icon: string;
}

export const Coins: ICoin[] = [
  { name: "STRK", icon: "mdi-strk", symbol: "STRK" },
  { name: "USDT", icon: "mdi-bitcoin", symbol: "USDT" },
  { name: "USDC", icon: "mdi-ethereum", symbol: "USDC" },
  { name: "BTC", icon: "mdi-bitcoin", symbol: "WBTC" },
  { name: "ETH", icon: "mdi-ethereum", symbol: "WETH" },
  { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
];

const DashboardLeft = ({
  width,
  oraclePrices,
  totalSupplies,
  supplyAPRs,
  validRTokens,
}: {
  width: string;
  oraclePrices: any;
  totalSupplies: any;
  supplyAPRs: any;
  validRTokens: any;
  // columnItems: Array<Array<string>>;
  // gap: string;
  // rowItems: any;
}) => {
  ////console.log(totalSupplies,"total supply");
  ////console.log(oraclePrices)
  const coinPrices = Coins.map((coin) => {
    const matchingCoin = oraclePrices?.find(
      (c: { name: string }) =>
        c?.name?.toLowerCase() === coin?.name.toLowerCase()
    );
    if (matchingCoin) {
      const formattedPrice = matchingCoin?.price.toFixed(3);
      ////console.log("coinprice",matchingCoin) // Format price to 3 decimal places
      return { name: coin?.name, price: formattedPrice };
    }
    return null;
  });
  // const { dataInterestRates } = useGetInterestRates();
  // const { dataUnderlyingAsset } = useGetUnderlyingAsset();
  ////console.log(dataUnderlyingAsset, "data underlying assets");
  ////console.log(dataInterestRates,"dataIntrestRates");

  ////console.log(coinPrices)

  const columnItems = ["Market", "Price", "Total Supply", "Supply APR", "", ""];
  const [isLargerThan1280] = useMediaQuery("(min-width: 1248px)");
  const [isOpenCustom, setIsOpenCustom] = useState(false);
  const { account } = useAccount();
  const dispatch = useDispatch();
  const [currentSupplyAPR, setCurrentSupplyAPR] = useState<Number>();
  // const {
  //   dataBalanceOf,
  //   errorBalanceOf,
  //   isFetchingBalanceOf,
  //   refetchBalanceOf,
  //   statusBalanceOf,
  // }: {
  //   dataBalanceOf: any;
  //   errorBalanceOf: any;
  //   isFetchingBalanceOf: any;
  //   refetchBalanceOf: any;
  //   statusBalanceOf: any;
  // } = useBalanceOf(
  //   "0x03e590241775f3b6b9e0579526eb4103d372b7832521160321eb9a767816199a"
  // );
  // useEffect(() => {
  //   if (errorBalanceOf || isFetchingBalanceOf) {
  //    //console.log("return", errorBalanceOf, statusBalanceOf);
  //     return;
  //   }
  //   if (dataBalanceOf) {
  //    //console.log(
  //       "return",
  //       dataBalanceOf,
  //       BNtoNum(uint256.uint256ToBN(dataBalanceOf?.balance))
  //     );
  //   }
  // }, [dataBalanceOf]);

  // const {
  //   dataBalanceOf,
  //   isFetchingBalanceOf,
  //   errorBalanceOf,
  //   statusBalanceOf,
  // } = useBalanceOf(
  //   "0x457f2ecab58ceb7ffd3ca658f8ce65820fda4fb9cd2878dd2e001d8d2753503"
  // );
  ////console.log(
  //   "balance ret",
  //   dataBalanceOf,
  //   isFetchingBalanceOf,
  //   errorBalanceOf,
  //   statusBalanceOf
  // );

  // function isJSON(str) {
  //   try {
  //     JSON.parse(str);
  //     return true;
  //   } catch (error) {
  //     return false;
  //   }
  // }
  // const assetBalance = useSelector(selectAssetWalletBalance);
  interface assetB {
    USDT: any;
    USDC: any;
    BTC: any;
    ETH: any;
    DAI: any;
  }
  const assetBalance: any = {
    USDT: useBalanceOf(tokenAddressMap["USDT"]),
    USDC: useBalanceOf(tokenAddressMap["USDC"]),
    BTC: useBalanceOf(tokenAddressMap["BTC"]),
    ETH: useBalanceOf(tokenAddressMap["ETH"]),
    DAI: useBalanceOf(tokenAddressMap["DAI"]),
    STRK: useBalanceOf(tokenAddressMap["STRK"]),
  };
  const strkData = useSelector(selectStrkAprData);

  useEffect(() => {
    ////console.log("supply apr", currentSupplyAPR);
  }, [supplyAPRs, currentSupplyAPR]);

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

  // useEffect(() => {
  //   if (isJSON(assetBalance)) {
  //     assetBalance = JSON.parse(assetBalance);
  //   }
  // }, [assetBalance]);

  // useEffect(() => {
  //   for (let i of Coins) {
  //   }
  // }, []);

  // useEffect(() => {
  //   if (errorBalanceOf || isFetchingBalanceOf) {
  //    //console.log("return error", errorBalanceOf, statusBalanceOf);
  //     return;
  //   }
  //   if (dataBalanceOf) {
  //     ////console.log(
  //     //   "return",
  //     //   dataBalanceOf,
  //     //   JSON.stringify(dataBalanceOf),
  //     //   BNtoNum(uint256.uint256ToBN(dataBalanceOf?.balance))
  //     // );
  //   }
  // }, [dataBalanceOf]);

  const tooltips = [
    "Available markets.",
    "Market value of the token",
    "The number of tokens that currently exists in the protocol.",
    "Annual interest rate earned on supplied funds.",
  ];

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
      // bgColor={"yellow"}
      height={"100%"}
      paddingX={isLargerThan1280 ? "2rem" : "1rem"}
      pt={"1.7rem"}
      // pb={"0.5rem"}
      overflowX="hidden"
      // bgColor={"red"}
      // px={"1.5rem"}
    >
      <Table variant="unstyled" width="100%" height="100%">
        <Thead width={"100%"} height={"2.7rem"}>
          <Tr width={"100%"}>
            {columnItems.map((val: any, idx: any) => (
              <Td
                key={idx}
                fontSize={"12px"}
                fontWeight={400}
                // border="1px solid blue"
                padding={0}
                // bgColor={"red"}
              >
                <Text
                  whiteSpace="pre-wrap"
                  overflowWrap="break-word"
                  //   bgColor={"red"}
                  width={"100%"}
                  height={"2rem"}
                  // textAlign="center"
                  textAlign={idx == 0 ? "left" : "center"}
                  color={"#CBCBD1"}
                  padding={0}
                  // pl={idx == 0 ? "7.2%" : 0}
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
                    // maxW="222px"
                    // mt="28px"
                  >
                    {val}
                  </Tooltip>
                </Text>
              </Td>
            ))}
          </Tr>
        </Thead>
        <Tbody
          position="relative"
          overflowX="hidden"

          //   display="flex"
          //   flexDirection="column"
          //   gap={"1rem"}
        >
          {Coins.map((coin, idx) => (
            <>
              <Tr
                key={idx}
                width={"100%"}
                height={"5rem"}
                // bgColor="blue"
                // borderBottom="1px solid #2b2f35"
                position="relative"
                bg={
                  coin?.name === "STRK"
                    ? "linear-gradient(90deg, #34345600 0%, #34345688 50%, #34345600 100%, #34345600 100%)"
                    : ""
                }
              >
                <Td
                  width={"17%"}
                  // maxWidth={`${gap[idx1][idx2]}%`}
                  fontSize={"12px"}
                  fontWeight={400}
                  padding={0}
                >
                  <HStack
                    gap="10px"
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                    // bgColor="red"
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
                      //   bgColor="blue"
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
                        // <Skeleton
                        //   width="3rem"
                        //   height="0.8rem"
                        //   startColor="#101216"
                        //   endColor="#2B2F35"
                        //   borderRadius="6px"
                        //   mt="4px"
                        // />
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
                    // bgColor={"blue"}
                  >
                    {/* {checkGap(idx1, idx2)} */}
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
                    {/* 0000.00 */}
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
                    // bgColor={"blue"}
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
                    // bgColor={"blue"}
                  >
                    {/* {checkGap(idx1, idx2)} */}
                    <Tooltip
                      hasArrow
                      arrowShadowColor="#2B2F35"
                      placement="bottom"
                      boxShadow="dark-lg"
                      label={
                        <Box>
                          <Box display="flex" justifyContent="space-between">
                            <Text>APR</Text>
                            <Text>
                              {numberFormatterPercentage(
                                supplyAPRs[idx] + getBoostedApr(coin)
                              )}
                              %
                            </Text>
                          </Box>
                          <Box display="flex" justifyContent="space-between">
                            <Text>Supply APR</Text>
                            <Text>
                              {numberFormatterPercentage(supplyAPRs[idx])}%
                            </Text>
                          </Box>
                          <Box display="flex" justifyContent="space-between">
                            <Text>Boosted APR</Text>
                            <Text>
                              {numberFormatterPercentage(getBoostedApr(coin))}%
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
                        <Box>
                          {numberFormatterPercentage(
                            supplyAPRs[idx] + getBoostedApr(coin)
                          )}
                          %
                        </Box>
                      )}
                    </Tooltip>
                    {supplyAPRs[idx] != null ? (
                      coin.name != "BTC" &&
                      coin.name !== "DAI" && (
                        <Box ml="0.4rem">
                          <FireIcon />
                        </Box>
                      )
                    ) : (
                      <></>
                    )}
                  </Box>
                </Td>
                <Td
                  width={"4%"}
                  maxWidth={"5rem"}
                  fontSize={"14px"}
                  fontWeight={400}
                  //   overflow={"hidden"}
                  textAlign={"right"}
                  // bgColor={"blue"}
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
                      setIsOpenCustom(false);
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
                        // walletBalance={assetBalance[coin?.name]?.statusBalanceOf === "success" ?Number(BNtoNum(uint256.uint256ToBN(assetBalance[coin?.name]?.dataBalanceOf?.balance))) : 0}
                      />
                    )}
                  </Box>
                </Td>
                <Td
                  width={"7%"}
                  //   maxWidth={"3rem"}
                  fontSize={"14px"}
                  fontWeight={400}
                  //   overflow={"hidden"}
                  textAlign={"center"}
                  // bgColor="red"
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
                  // left: "0%",
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
