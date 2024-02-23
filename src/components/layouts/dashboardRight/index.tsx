import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Text,
  Box,
  HStack,
  useMediaQuery,
  Tooltip,
  Button,
} from "@chakra-ui/react";
import { Skeleton } from "@chakra-ui/react";
import Image from "next/image";
import BorrowModal from "@/components/modals/borrowModal";
import TradeModal from "@/components/modals/tradeModal";
import numberFormatter from "@/utils/functions/numberFormatter";
import numberFormatterPercentage from "@/utils/functions/numberFormatterPercentage";
import html2canvas from "html2canvas";
export interface ICoin {
  name: string;
  symbol: string;
  icon: string;
}

export const Coins: ICoin[] = [
  { name: "USDT", icon: "mdi-bitcoin", symbol: "USDT" },
  { name: "USDC", icon: "mdi-ethereum", symbol: "USDC" },
  { name: "BTC", icon: "mdi-bitcoin", symbol: "WBTC" },
  { name: "ETH", icon: "mdi-ethereum", symbol: "WETH" },
  { name: "DAI", icon: "mdi-dai", symbol: "DAI" },
  { name: "STRK", icon: "mdi-dai", symbol: "STRK" },
];

const DashboardRight = ({
  width,
  oraclePrices,
  utilization,
  totalBorrows,
  availableReserves,
  borrowAPRs,
  supplyAPRs,
  validRTokens,
  protocolStats,
}: {
  width: string;
  oraclePrices: any;
  utilization: any;
  totalBorrows: any;
  availableReserves: any;
  borrowAPRs: any;
  validRTokens: any;
  supplyAPRs: any;
  protocolStats: any;
  // gap: string;
  // columnItems: Array<Array<string>>;
  // rowItems: any;
}) => {
  const columnItems = [
    "Market",
    "Total borrow",
    "Available",
    "Utillization",
    "Borrow APR",
    "",
    "",
  ];
  const coinPrices = Coins.map((coin) => {
    const matchingCoin = oraclePrices?.find(
      (c: { name: string }) =>
        c?.name?.toLowerCase() === coin?.name.toLowerCase()
    );
    if (matchingCoin) {
      const formattedPrice = matchingCoin?.price.toFixed(3); // Format price to 3 decimal places
      return { name: coin?.name, price: formattedPrice };
    }
    return null;
  });

  // const handleCaptureClick = async () => {
  //   const element:any = document.getElementById('buttonclick');
  //   html2canvas(element).then((canvas) => {
  //     const screenshotDataUrl = canvas.toDataURL('image/png');
  //    //console.log(screenshotDataUrl,"url")

  //     // Now you have the screenshot in a data URL format
  //     // You can send it to the backend using an HTTP request.
  //   });
  // };

  const [isLargerThan1280] = useMediaQuery("(min-width: 1248px)");
  const [currentBorrowAPR, setCurrentBorrowAPR] = useState<number>();
  const [currentSupplyAPR, setCurrentSupplyAPR] = useState<number>();
  const [currentBorrowMarketCoin, setCurrentBorrowMarketCoin] = useState("BTC");



  useEffect(() => {
    ////console.log("currentBorrowMarketCoin", currentBorrowMarketCoin);
  }, [currentBorrowMarketCoin]);
  const tooltips = [
    "Available markets.",
    "The number of tokens that are currently borrowed from the protocol.",
    "The number of tokens that can be borrowed from the protocol.",
    "Represents how much of a pool has been borrowed",
    "The annual interest rate charged on borrowed funds from the protocol.",
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
    >
      <Table variant="unstyled" width="100%" height="100%">
        <Thead width={"100%"} height={"2.7rem"}>
          <Tr width={"100%"}>
            {columnItems.map((val, idx) => (
              <Td
                key={idx}
                // width={`${gap2[idx]}%`}
                // maxWidth={`${gap[idx1][idx2]}%`}
                fontSize={"12px"}
                fontWeight={400}
                // border="1px solid blue"
                padding={0}
              >
                <Text
                  whiteSpace="pre-wrap"
                  overflowWrap="break-word"
                  //   bgColor={"red"}
                  width={"100%"}
                  height={"2rem"}
                  // textAlign="center"
                  textAlign={idx == 0 ? "left" : "center"}
                  color={"#BDBFC1"}
                  padding={0}
                // pl={idx == 0 ? 5 : 0}
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
          {Coins?.map((coin, idx) => (
            <>
              <Tr
                key={idx}
                width={"100%"}
                height={"5rem"}
                // bgColor="blue"
                // borderBottom="1px solid #2b2f35"
                position="relative"
              >
                <Td
                  width={"14%"}
                  // maxWidth={`${gap[idx1][idx2]}%`}
                  fontSize={"12px"}
                  fontWeight={400}
                  padding={0}
                  textAlign="left"
                // bgColor={"red"}
                >
                  <HStack gap="10px">
                    <Box height="32px" width="32px">
                      <Image
                        src={coin?.name == "DAI" ? `/${coin?.name}Disabled.svg` : `/${coin?.name}.svg`}
                        alt="Picture of the author"
                        width="32"
                        height="32"
                      />
                    </Box>
                    <Box gap="0.2rem" display={coin?.name=="DAI" ?"flex":""}>
                    <Text fontSize="14px">{(coin?.name == "BTC" || coin?.name == "ETH") ? "w" + coin?.name : coin?.name}</Text>
                    {coin?.name=="DAI" &&                      <Image
                        src={`/paused.svg`}
                        alt={`Picture of the coin that I want to access ${coin?.name}`}
                        width="48"
                        height="16"
                      />}
                      {coin?.name=="STRK" && 
                      <Image
                        src={`/comingsoon.svg`}
                        alt={`Picture of the coin that I want to access ${coin?.name}`}
                        width="72"
                        height="16"
                      />
                      }
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
                    color={coin?.name == "DAI" || coin?.name=="STRK" ? "#3E415C" : "white"}
                  // bgColor={"blue"}
                  >
                    {/* {checkGap(idx1, idx2)} */}
                    {coin?.name=="STRK" ? numberFormatter(0): totalBorrows[idx] == null ? (
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
                    color={coin?.name == "DAI" || coin?.name=="STRK" ? "#3E415C" : "white"}
                  // bgColor={"blue"}
                  >
                    {/* {checkGap(idx1, idx2)} */}
                    {coin?.name=="STRK" ? numberFormatter(0): availableReserves[idx] == null ? (
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
                    color={coin?.name == "DAI" || coin?.name=="STRK" ? "#3E415C" : "white"}
                  // bgColor={"blue"}
                  >
                    {/* {checkGap(idx1, idx2)} */}
                    {coin?.name=="STRK" ? numberFormatter(0): utilization[idx] == null ? (
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
                    color={coin?.name == "DAI" || coin?.name=="STRK" ? "#3E415C" : "white"}
                  // bgColor={"blue"}
                  >
                    {/* {checkGap(idx1, idx2)} */}
                    {coin?.name=="STRK" ? numberFormatter(0): borrowAPRs[idx] == null ? (
                      <Skeleton
                        width="6rem"
                        height="1.4rem"
                        startColor="#101216"
                        endColor="#2B2F35"
                        borderRadius="6px"
                      />
                    ) : (
                      numberFormatterPercentage(borrowAPRs[idx]) + "%"
                    )}
                  </Box>
                </Td>
                <Td
                  width={"8%"}
                  maxWidth={"5rem"}
                  fontSize={"14px"}
                  fontWeight={400}
                  //   overflow={"hidden"}
                  textAlign={"center"}
                  // bgColor={"red"}
                  // p="0 2 0 0"
                  p={1.5}
                // pr={3}
                // pl={1}
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
                  // bgColor={"blue"}
                  >
                    {coin?.name == "DAI" || coin?.name=="STRK" ?
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
                      : <BorrowModal
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
                    }

                  </Box>
                </Td>
                <Td
                  width={"8%"}
                  //   maxWidth={"3rem"}
                  fontSize={"14px"}
                  fontWeight={400}
                  //   overflow={"hidden"}
                  textAlign={"center"}
                  // bgColor={"green"}
                  // p="0px 0px 12px 0px"
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
                    {coin?.name == "DAI" || coin?.name=="STRK" ?
                   <Text color="#3E415C" borderBottom="1px solid #3E415C" cursor="pointer">
                   Spend
                 </Text>:                      <TradeModal
                      coin={coin}
                      borrowAPRs={borrowAPRs}
                      currentBorrowAPR={currentBorrowAPR}
                      supplyAPRs={supplyAPRs}
                      currentSupplyAPR={currentSupplyAPR}
                      setCurrentBorrowAPR={setCurrentBorrowAPR}
                      validRTokens={validRTokens}
                      currentBorrowMarketCoin={currentBorrowMarketCoin}
                    />
                  }

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
                  // left: "1.75%",
                  display: `${idx == Coins.length - 1 ? "none" : "block"}`,
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
