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

import Image from "next/image";
import SupplyModal from "@/components/modals/SupplyModal";
import StakeUnstakeModal from "@/components/modals/StakeUnstakeModal";
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

const DashboardLeft = ({
  width,
}: {
  width: string;
  // columnItems: Array<Array<string>>;
  // gap: string;
  // rowItems: any;
}) => {
  const columnItems = ["Market", "Price", "Total Supply", "Supply APR", "", ""];
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
    >
      <Table variant="unstyled" width="100%" height="100%">
        <Thead width={"100%"} height={"2.7rem"}>
          <Tr width={"100%"}>
            {columnItems.map((val, idx) => (
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
                  color={"#BDBFC1"}
                  padding={0}
                  // pl={idx == 0 ? "7.2%" : 0}
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
                  width={"17%"}
                  // maxWidth={`${gap[idx1][idx2]}%`}
                  fontSize={"12px"}
                  fontWeight={400}
                  padding={0}
                >
                  <HStack
                    gap="3px"
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                    // bgColor="red"
                  >
                    <Box height="2rem" width="2rem">
                      <Image
                        src={`./${coin.name}.svg`}
                        alt="Picture of the author"
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
                      <Text fontSize="14px" fontWeight="400">
                        {coin.name}
                      </Text>
                      <Text fontSize="9px" fontWeight="400" color="#8C8C8C">
                        Wallet Bal. $900
                      </Text>
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
                  width={"18%"}
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
                  width={"18%"}
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
                  >
                    <SupplyModal
                      buttonText="Supply"
                      height={"2rem"}
                      fontSize={"12px"}
                      padding="6px 12px"
                      border="1px solid #6E6E6E"
                      bgColor="#101216"
                      _hover={{ bg: "white", color: "black" }}
                      borderRadius={"6px"}
                      color="#6e6e6e"
                    />
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
                    <StakeUnstakeModal />
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

export default DashboardLeft;
