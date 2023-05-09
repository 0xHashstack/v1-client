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
  Button,
} from "@chakra-ui/react";

import BTCLogo from "@/assets/images/stakeIcon.svg";
import USDTLogo from "@/assets/images/stakeIcon.svg";
import Image from "next/image";
import BorrowModal from "@/components/modals/borrowModal";
import SupplyModal from "@/components/modals/SupplyModal";
import YourBorrowModal from "@/components/modals/yourBorrowModal";

export interface ICoin {
  name: string;
  symbol: string;
  icon: string;
}

const BorrowDashboard = ({
  width,
  currentPagination,
  Coins,
  columnItems,
}: {
  width: string;
  currentPagination: any;
  Coins: any;
  columnItems: any;
  // columnItems: Array<Array<string>>;
  // gap: string;
  // rowItems: any;
}) => {
  let lower_bound = 6 * (currentPagination - 1);
  let upper_bound = lower_bound + 5;
  upper_bound = Math.min(Coins.length - 1, upper_bound);
  console.log("aryan " + lower_bound + " " + upper_bound);

  return upper_bound >= lower_bound && Coins.length > 0 ? (
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
      // bgColor={"red"}
      // height={"100%"}
      height={"37rem"}
      padding={"1rem 2rem 0rem"}
      overflowX="hidden"
      mt={"3rem"}
    >
      <Table
        variant="unstyled"
        width="100%"
        height="100%"
        // bgColor={"blue"}
        // p={0}
      >
        <Thead width={"100%"} height={"5rem"}>
          <Tr width={"100%"} height="2rem">
            {columnItems.map((val: any, idx1: any) => (
              <Td
                key={idx1}
                width={"12.5%"}
                // maxWidth={`${gap[idx1][idx2]}%`}
                fontSize={"12px"}
                fontWeight={400}
                // textAlign={"left"}
                p={0}
                // bgColor={"pink"}
                // border="1px solid red"
              >
                <Text
                  whiteSpace="pre-wrap"
                  overflowWrap="break-word"
                  width={"100%"}
                  height={"2rem"}
                  fontSize="12px"
                  textAlign={
                    idx1 == 0
                      ? "left"
                      : idx1 == columnItems.length - 1
                      ? "right"
                      : "center"
                  }
                  pl={idx1 == 0 ? 2 : 0}
                  pr={idx1 == columnItems.length - 1 ? 5 : 0}
                  color={"#BDBFC1"}
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
          {Coins.slice(lower_bound, upper_bound + 1).map(
            (coin: any, idx: number) => (
              <>
                <Tr
                  key={idx}
                  width={"100%"}
                  // height={"5rem"}
                  // bgColor="green"
                  // borderBottom="1px solid #2b2f35"
                  position="relative"
                  p={0}
                >
                  <Td
                    width={"12.5%"}
                    // maxWidth={`${gap[idx1][idx2]}%`}
                    fontSize={"14px"}
                    fontWeight={400}
                    padding={2}
                    textAlign="center"
                  >
                    <Text
                      width="100%"
                      height="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-start"
                      fontWeight="400"
                      fontSize="14px"
                      color="#E6EDF3"
                      // bgColor={"blue"}
                    >
                      {/* {checkGap(idx1, idx2)} */}
                      ID 12345
                    </Text>
                  </Td>
                  <Td
                    width={"12.5%"}
                    // maxWidth={"3rem"}
                    fontSize={"14px"}
                    fontWeight={400}
                    overflow={"hidden"}
                    textAlign={"center"}
                    // bgColor={"green"}
                  >
                    <Box
                      width="100%"
                      height="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="400"
                      textAlign="center"
                      // bgColor={"blue"}
                    >
                      <VStack
                        // gap="3px"
                        width="100%"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="2.5rem"
                        // bgColor="red"
                      >
                        <HStack
                          height="2rem"
                          width="2rem"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Image
                            src={`./USDT.svg`}
                            alt="Picture of the author"
                            width="32"
                            height="32"
                          />
                          <Text
                            fontSize="14px"
                            fontWeight="400"
                            color="#E6EDF3"
                          >
                            USDT
                          </Text>
                        </HStack>
                        <Text fontSize="14px" fontWeight="500" color="#F7BB5B">
                          10,000
                        </Text>
                      </VStack>
                    </Box>
                  </Td>
                  <Td
                    width={"12.5%"}
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
                      8%
                    </Text>
                  </Td>
                  <Td
                    width={"12.5%"}
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
                    width={"12.5%"}
                    maxWidth={"5rem"}
                    fontSize={"14px"}
                    fontWeight={400}
                    //   overflow={"hidden"}
                    textAlign={"center"}
                  >
                    <VStack
                      // gap="3px"
                      width="100%"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      height="2.5rem"
                      // bgColor="red"
                    >
                      <HStack
                        height="2rem"
                        width="2rem"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Image
                          src={`./USDT.svg`}
                          alt="Picture of the author"
                          width="32"
                          height="32"
                        />
                        <Text fontSize="14px" fontWeight="400">
                          USDT
                        </Text>
                      </HStack>
                      <Text fontSize="14px" fontWeight="500" color="#F7BB5B">
                        9,868
                      </Text>
                    </VStack>
                  </Td>
                  <Td
                    // width={"13%"}
                    maxWidth={"5rem"}
                    fontSize={"14px"}
                    fontWeight={400}
                    //   overflow={"hidden"}
                    textAlign={"center"}
                  >
                    <Box
                      // gap="3px"
                      width="100%"
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      height="3rem"
                      // bgColor="red"
                      // pl="3.4rem"
                    >
                      <HStack
                        height="50%"
                        width="100%"
                        alignItems="center"
                        justifyContent="flex-start"
                        gap={0.5}
                      >
                        <Box minWidth={"16px"}>
                          <Image
                            src={`./Swap.svg`}
                            alt="Picture of the author"
                            width="16"
                            height="16"
                          />
                        </Box>
                        <Text fontSize="14px" fontWeight="400">
                          Swap
                        </Text>
                      </HStack>
                      <HStack
                        height="50%"
                        width="100%"
                        alignItems="center"
                        justifyContent="flex-start"
                        // bgColor={"red"}
                      >
                        <Box
                          display="flex"
                          gap={0.5}
                          // bgColor={"blue"}
                        >
                          <Box
                            display="flex"
                            gap={0.5}
                            minWidth={"16px"}
                            // bgColor={"blue"}
                          >
                            <Image
                              src={`./USDT.svg`}
                              alt="Picture of the author"
                              width="16"
                              height="16"
                            />
                          </Box>
                          <Box
                            display="flex"
                            gap={0.5}
                            minWidth={"16px"}
                            // bgColor={"blue"}
                          >
                            <Image
                              src={`./ETH.svg`}
                              alt="Picture of the author"
                              width="16"
                              height="16"
                            />
                          </Box>
                        </Box>
                        <Text fontSize="14px" fontWeight="400">
                          1.234/2.23
                        </Text>
                      </HStack>
                    </Box>
                  </Td>
                  <Td
                    width={"12.5%"}
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
                      1,234
                    </Text>
                  </Td>
                  <Td
                    width={"12.5%"}
                    maxWidth={"5rem"}
                    fontSize={"14px"}
                    fontWeight={400}
                    //   overflow={"hidden"}
                    textAlign={"right"}
                    // bgColor={"pink"}
                    p={0}
                  >
                    <Box
                      width="100%"
                      height="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                      fontWeight="400"
                      // bgColor={"blue"}
                    >
                      {/* <Button
                        key="suppy"
                        backgroundColor="#101216"
                        height={"2rem"}
                        padding="0rem 1rem"
                        border="1px solid #2b2f35"
                        fontSize={"12px"}
                        color="#6e6e6e"
                        _hover={{ bgColor: "#2DA44E", color: "#E6EDF3" }}
                        borderRadius={"6px"}
                      > */}
                      <YourBorrowModal />
                      {/* </Button> */}
                    </Box>
                  </Td>
                </Tr>
                <Tr
                  style={{
                    position: "absolute",
                    // left: "0%",
                    width: "100%",
                    height: "1px",
                    borderBottom: "1px solid #2b2f35",
                    display: `${idx == 5 ? "none" : "block"}`,
                  }}
                />
              </>
            )
          )}
          {(() => {
            const rows = [];
            for (
              let i: number = 0;
              i < 6 - (upper_bound - lower_bound + 1);
              i++
            ) {
              rows.push(<Tr height="5.15rem"></Tr>);
            }
            return rows;
          })()}
        </Tbody>
      </Table>
    </TableContainer>
  ) : (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="95%"
        height={"37rem"}
        // height="552px"
        bgColor="#101216"
        borderRadius="8px"
      >
        <Text color="#FFFFFF">You do not have outstanding borrows</Text>
        <Text color="#0969DA">Borrow assets</Text>
      </Box>
    </>
  );
};

export default BorrowDashboard;
