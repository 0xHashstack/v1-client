import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Wrap,
  Text,
  Box,
  HStack,
  VStack,
} from "@chakra-ui/react";

import BTCLogo from "@/assets/images/stakeIcon.svg";
import USDTLogo from "@/assets/images/stakeIcon.svg";
import Image from "next/image";
import BorrowModal from "@/components/modals/borrowModal";
import SupplyModal from "@/components/modals/SupplyModal";

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
  const columnItems = [
    "Market",
    "Price",
    "Total Supply",
    "Supply APR",
    "Supply",
    "Details",
  ];
  // const rowItems1 = [
  //   ["abc", "00000", "0000.000", "5%"],
  //   [
  //     <SupplyModal />,
  //     <Text
  //       key="supply-details"
  //       as="span"
  //       position="relative"
  //       color="#0969DA"
  //       fontSize="14px"
  //       _hover={{
  //         "::before": {
  //           content: '""',
  //           position: "absolute",
  //           left: 0,
  //           bottom: "-0px",
  //           width: "100%",
  //           height: "1px",
  //           backgroundColor: "#0969DA",
  //         },
  //       }}
  //     >
  //       Details
  //     </Text>,
  //   ],
  // ];
  // const gap1 = ["22", "20", "20", "20", "2.5", "2.5"];

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
      paddingX={"18px"}
      pt={"1.4rem"}
      pb={"0.5rem"}
      overflowX="hidden"
    >
      <Table variant="unstyled" width="100%" height="100%">
        <Thead width={"100%"} height={"2.7rem"}>
          <Tr width={"100%"}>
            {columnItems.map((val, idx) => (
              <Td
                key={idx}
                width={"17%"}
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
                  pl={idx == 0 ? 3 : 0}
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
                  padding={2}
                >
                  <HStack
                    gap="3px"
                    display="flex"
                    justifyContent="center"
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
                    00000.00
                  </Text>
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
                    7.00%
                  </Text>
                </Td>
                <Td
                  width={"17%"}
                  maxWidth={"5rem"}
                  fontSize={"14px"}
                  fontWeight={400}
                  //   overflow={"hidden"}
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
                    <SupplyModal />
                  </Box>
                </Td>
                <Td
                  width={"17%"}
                  //   maxWidth={"3rem"}
                  fontSize={"14px"}
                  fontWeight={400}
                  //   overflow={"hidden"}
                  textAlign={"center"}
                  //   bgColor="red"
                >
                  <Box position="relative" display="inline-block">
                    <Text
                      key="borrow-details"
                      as="span"
                      position="relative"
                      color="#0969DA"
                      fontSize="14px"
                      width="100%"
                      //   display="flex"
                      //   alignItems="center"
                      //   justifyContent="center"
                      fontWeight="400"
                      _hover={{
                        "::before": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          bottom: "-0px",
                          width: "100%",
                          height: "1px",
                          backgroundColor: "#0969DA",
                        },
                      }}
                    >
                      Details
                    </Text>
                  </Box>
                </Td>
              </Tr>
              <hr
                style={{
                  position: "absolute",
                  height: "1px",
                  borderWidth: "0",
                  backgroundColor: "#2b2f35",
                  width: "97%",
                  left: "1%",
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
