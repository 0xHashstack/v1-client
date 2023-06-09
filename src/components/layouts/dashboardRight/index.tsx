import React from "react";
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
} from "@chakra-ui/react";
import { Skeleton } from "@chakra-ui/react";
import Image from "next/image";
import BorrowModal from "@/components/modals/borrowModal";
import TradeModal from "@/components/modals/tradeModal";
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
];

const DashboardRight = ({
  width,
  oraclePrices,
}: {
  width: string;
  oraclePrices: any;
  // gap: string;
  // columnItems: Array<Array<string>>;
  // rowItems: any;
}) => {
  const columnItems = [
    "Market",
    "Price",
    "Total borrow",
    "Utillization",
    "Borrow APR",
    "",
    "",
  ];
  const coinPrices = Coins.map((coin) => {
    const matchingCoin = oraclePrices.find(
      (c: { name: string }) =>
        c?.name?.toLowerCase() === coin.name.toLowerCase()
    );
    if (matchingCoin) {
      const formattedPrice = matchingCoin.price.toFixed(3); // Format price to 3 decimal places
      return { name: coin.name, price: formattedPrice };
    }
    return null;
  });

  const [isLargerThan1280] = useMediaQuery("(min-width: 1248px)");

  return (
    <TableContainer
      bg="#101216"
      border="1px"
      borderColor="#2B2F35"
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
                  {val}
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
                  <HStack gap={1.5}>
                    <Box height="32px" width="32px">
                      <Image
                        src={`./${coin.name}.svg`}
                        alt="Picture of the author"
                        width="32"
                        height="32"
                      />
                    </Box>
                    <Text fontSize="14px">{coin.name}</Text>
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
                    // bgColor={"blue"}
                  >
                    {/* {checkGap(idx1, idx2)} */}
                    {/* {!coinPrices[idx] ? (
                      <Skeleton
                        width="6rem"
                        height="1.4rem"
                        startColor="#101216"
                        endColor="#2B2F35"
                        borderRadius="6px"
                      />
                    ) : (
                      coinPrices[idx]?.price
                    )} */}
                    000
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
                  <Text
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                    // bgColor={"blue"}
                  >
                    {/* {checkGap(idx1, idx2)} */}
                    000.00
                  </Text>
                </Td>
                <Td
                  width={"15%"}
                  maxWidth={"3rem"}
                  fontSize={"14px"}
                  fontWeight={400}
                  overflow={"hidden"}
                  textAlign={"center"}
                >
                  <Text
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                    // bgColor={"blue"}
                  >
                    {/* {checkGap(idx1, idx2)} */}
                    7.00%
                  </Text>
                </Td>
                <Td
                  width={"15%"}
                  maxWidth={"3rem"}
                  fontSize={"14px"}
                  fontWeight={400}
                  overflow={"hidden"}
                  textAlign={"center"}
                >
                  <Text
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                    // bgColor={"blue"}
                  >
                    {/* {checkGap(idx1, idx2)} */}
                    19.00%
                  </Text>
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
                    // bgColor={"blue"}
                  >
                    <BorrowModal
                      buttonText="Borrow"
                      height={"2rem"}
                      fontSize={"12px"}
                      padding="6px 12px"
                      border="1px solid #BDBFC1"
                      bgColor="#101216"
                      _hover={{ bg: "white", color: "black" }}
                      borderRadius={"6px"}
                      color="#BDBFC1;"
                      backGroundOverLay="rgba(244, 242, 255, 0.5)"
                      coin={coin}
                    />
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
                  <Box position="relative" display="inline-block">
                    <TradeModal coin={coin} />
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
