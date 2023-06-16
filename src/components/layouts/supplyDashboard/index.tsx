import React, { useEffect, useState } from "react";
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
import YourSupplyModal from "@/components/modals/yourSupply";

export interface ICoin {
  name: string;
  symbol: string;
  icon: string;
}

export interface IDeposit {
  tokenAddress: string;
  rTokenAmount: number;
  underlyingAssetAmount: number;
}

const supplies: any = [
  {
    market: "USDT",
    rTokenAmount: "10,000",
    ExchangeRate: "1.23",
    SupplyApr: "8.22%",
    EffectiveApr: "7.8%",
    Status: "Active",
  },
  {
    market: "BTC",
    rTokenAmount: "10,000",
    ExchangeRate: "1.23",
    SupplyApr: "8.22%",
    EffectiveApr: "7.8%",
    Status: "Active",
  },
  {
    market: "DAI",
    rTokenAmount: "10,000",
    ExchangeRate: "1.23",
    SupplyApr: "8.22%",
    EffectiveApr: "7.8%",
    Status: "Active",
  },
  {
    market: "USDT",
    rTokenAmount: "1000",
    ExchangeRate: "1.23",
    SupplyApr: "8.22%",
    EffectiveApr: "7.8%",
    Status: "Active",
  },
  {
    market: "DAI",
    rTokenAmount: "1000",
    ExchangeRate: "1.23",
    SupplyApr: "8.22%",
    EffectiveApr: "7.8%",
    Status: "Active",
  },
  {
    market: "BTC",
    rTokenAmount: "1000",
    ExchangeRate: "1.23",
    SupplyApr: "8.22%",
    EffectiveApr: "7.8%",
    Status: "Active",
  },
];

const SupplyDashboard = ({
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
  // console.log("aryan " + lower_bound + " " + upper_bound);

  const [currentSelectedSupplyCoin, setCurrentSelectedSupplyCoin] =
    useState("BTC");
  const [currentSelectedWithdrawlCoin, setcurrentSelectedWithdrawlCoin] =
    useState("BTC");
  const [supplyMarkets, setSupplyMarkets] = useState([]);
  useEffect(() => {
    let temp: any = [];
    supplies.map((coin: any) => {
      if (!temp.includes(coin.market)) {
        temp.push(coin.market);
      }
    });
    setSupplyMarkets(temp);
  }, []);

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
      // bgColor={"yellow"}
      // height={"100%"}
      height={"37rem"}
      padding={"1rem 1.5rem"}
      overflowX="hidden"
      // m={0}
      // mt={"3rem"}
      // style={{ marginTop: "0.8rem" }}
    >
      <Table variant="unstyled" width="100%" height="100%">
        <Thead width={"100%"} height={"5rem"}>
          <Tr width={"100%"} height="2rem">
            {columnItems.map((val: any, idx1: any) => (
              <Td
                key={idx1}
                width={"12.5%"}
                // maxWidth={`${gap[idx1][idx2]}%`}
                fontSize={"12px"}
                fontWeight={400}
                textAlign={
                  idx1 == 0
                    ? "left"
                    : idx1 == columnItems.length - 1
                    ? "right"
                    : "center"
                }
                pl={idx1 == 0 ? 22 : 0}
                pr={idx1 == columnItems.length - 1 ? 12 : 0}
                // border="1px solid blue"
              >
                <Text
                  whiteSpace="pre-wrap"
                  overflowWrap="break-word"
                  // bgColor={"red"}
                  width={"100%"}
                  height={"2rem"}
                  // textAlign="center"
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
          {supplies
            .slice(lower_bound, upper_bound + 1)
            .map((supply: any, idx: number) => (
              <>
                <Tr
                  key={idx}
                  width={"100%"}
                  height={"5.1rem"}
                  // bgColor="blue"
                  // borderBottom="1px solid #2b2f35"
                  position="relative"
                >
                  <Td
                    width={"12.5%"}
                    // maxWidth={"3rem"}
                    fontSize={"14px"}
                    fontWeight={400}
                    overflow={"hidden"}
                    // textAlign={"left"}
                    pl={10}
                    // bgColor={"green"}
                  >
                    <Box
                      width="100%"
                      height="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-start"
                      fontWeight="400"
                      // textAlign="left"
                      // bgColor={"blue"}
                    >
                      <VStack
                        // gap="3px"
                        width="100%"
                        display="flex"
                        justifyContent="center"
                        alignItems="flex-start"
                        height="2.5rem"
                        // bgColor="red"
                      >
                        <HStack
                          height="2rem"
                          width="2rem"
                          alignItems="center"
                          // justifyContent="center"
                        >
                          <Image
                            src={`./${supply.market}.svg`}
                            alt="Picture of the author"
                            width="32"
                            height="32"
                          />
                          <Text fontSize="14px" fontWeight="400">
                            {supply.market}
                          </Text>
                        </HStack>
                        <Text fontSize="14px" fontWeight="500" color="#F7BB5B">
                          {supply.rTokenAmount}
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
                      {supply.ExchangeRate}
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
                      {supply.SupplyApr}
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
                      {supply.EffectiveApr}
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
                      {supply.Status}
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
                    <Box
                      width="100%"
                      height="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                      fontWeight="400"
                      pr={2}
                      onClick={() => {
                        setCurrentSelectedSupplyCoin(supply.market);
                        setcurrentSelectedWithdrawlCoin(supply.market);
                      }}
                      // bgColor={"blue"}
                    >
                      <YourSupplyModal
                        currentSelectedSupplyCoin={currentSelectedSupplyCoin}
                        setCurrentSelectedSupplyCoin={
                          setCurrentSelectedSupplyCoin
                        }
                        currentSelectedWithdrawlCoin={
                          currentSelectedWithdrawlCoin
                        }
                        setcurrentSelectedWithdrawlCoin={
                          setcurrentSelectedWithdrawlCoin
                        }
                        coins={supplyMarkets}
                      />
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
                    // left: "3%",
                    display: `${idx == 5 ? "none" : "block"}`,
                  }}
                />
              </>
            ))}
          {(() => {
            const rows = [];
            for (
              let i: number = 0;
              i < 6 - (upper_bound - lower_bound + 1);
              i++
            ) {
              rows.push(<Tr height="4.99rem"></Tr>);
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
        gap="6px"
      >
        <Text color="#FFFFFF">Your Ethereum Wallet is empty</Text>
        <SupplyModal
          buttonText="Supply"
          height={"2rem"}
          fontSize={"14px"}
          fontWeight="500"
          lineHeight="20px"
          padding="6px 12px"
          border="1px solid rgba(27, 31, 36, 0.15)"
          bgColor="#2DA44E"
          _hover={{ bg: "#2DA44E", color: "white" }}
          borderRadius={"6px"}
          color="#fff"
          backGroundOverLay="rgba(244, 242, 255, 0.5)"
        />
      </Box>
    </>
  );
};

export default SupplyDashboard;
