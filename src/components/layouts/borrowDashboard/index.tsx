import React, { useEffect, useState } from "react";

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
  VStack,
  useTimeout,
  Spinner,
  Skeleton,
} from "@chakra-ui/react";

import Image from "next/image";
import YourBorrowModal from "@/components/modals/yourBorrowModal";
import { Coins } from "../dashboardLeft";
import BorrowModal from "@/components/modals/borrowModal";
import { ILoan } from "@/Blockchain/interfaces/interfaces";
import { getProtocolStats } from "@/Blockchain/scripts/protocolStats";

export interface ICoin {
  name: string;
  symbol: string;
  icon: string;
}

// export interface ILoan {
//   loanId: number; // loan id
//   borrower: string; // borrower address

//   loanMarket: string | undefined; // dToken like dBTC
//   loanMarketAddress: string | undefined; // dToken Address
//   underlyingMarket: string | undefined; // BTC
//   underlyingMarketAddress: string | undefined; // BTC Address
//   currentLoanMarket: string | undefined; // USDT, will be native only
//   currentLoanMarketAddress: string | undefined; // USDT Address
//   collateralMarket: string | undefined; // rToken like rUSDC
//   collateralMarketAddress: string | undefined; // rToken Address

//   loanAmount: number; // dToken amount
//   currentLoanAmount: number; // native tokens
//   collateralAmount: number; // rToken amount

//   createdAt: Date;
//   state: string | null;

//   l3_integration: string;
//   l3App: string | null;

//   l3_category: string;
// }

// export const Borrows = [
//   {
//     loanId: "123456",
//     loanMarket: "BTC",
//     loanAmount: "1000",
//     collateralMarket: "USDT",
//     collateralAmount: "9,868",
//   },
//   {
//     loanId: "123457",
//     loanMarket: "USDT",
//     loanAmount: "1000",
//     collateralMarket: "USDT",
//     collateralAmount: "9,868",
//   },
//   {
//     loanId: "123458",
//     loanMarket: "USDC",
//     loanAmount: "1000",
//     collateralMarket: "USDT",
//     collateralAmount: "9,868",
//   },
//   {
//     loanId: "123459",
//     loanMarket: "ETH",
//     loanAmount: "1000",
//     collateralMarket: "USDT",
//     collateralAmount: "9,868",
//   },
//   {
//     loanId: "1234510",
//     loanMarket: "DAI",
//     loanAmount: "1000",
//     collateralMarket: "USDT",
//     collateralAmount: "9,868",
//   },
//   {
//     loanId: "1234511",
//     loanMarket: "BTC",
//     loanAmount: "1000",
//     collateralMarket: "USDT",
//     collateralAmount: "9,868",
//   },
//   {
//     loanId: "1234512",
//     loanMarket: "USDT",
//     loanAmount: "1000",
//     collateralMarket: "USDT",
//     collateralAmount: "9,868",
//   },
//   {
//     loanId: "1234513",
//     loanMarket: "USDC",
//     loanAmount: "1000",
//     collateralMarket: "USDT",
//     collateralAmount: "9,868",
//   },
//   {
//     loanId: "1234514",
//     loanMarket: "ETH",
//     loanAmount: "1000",
//     collateralMarket: "USDT",
//     collateralAmount: "9,868",
//   },
//   {
//     loanId: "1234515",
//     loanMarket: "DAI",
//     loanAmount: 1000,
//     collateralMarket: "USDT",
//     collateralAmount: "9,868",
//   },
// ];

const BorrowDashboard = ({
  width,
  currentPagination,
  Coins,
  columnItems,
  Borrows,
}: // userLoans,
{
  width: string;
  currentPagination: any;
  Coins: any;
  columnItems: any;
  Borrows: ILoan[];
  userLoans: any;
  // columnItems: Array<Array<string>>;
  // gap: string;
  // rowItems: any;
}) => {
  // console.log(Borrows, "Borrow loans in borrow dashboard");
  let lower_bound = 6 * (currentPagination - 1);
  let upper_bound = lower_bound + 5;
  upper_bound = Math.min(Borrows ? Borrows.length - 1 : 0, upper_bound);
  const [borrowIDCoinMap, setBorrowIDCoinMap] = useState([]);
  const [borrowIds, setBorrowIds] = useState([]);
  const [borrowAmount, setBorrowAmount] = useState<number>(0);
  const [currentBorrowId1, setCurrentBorrowId1] = useState("");
  const [currentBorrowMarketCoin1, setCurrentBorrowMarketCoin1] =
    useState("BTC");
  const [currentBorrowId2, setCurrentBorrowId2] = useState("");
  const [currentBorrowMarketCoin2, setCurrentBorrowMarketCoin2] =
    useState("BTC");
  const [collateralBalance, setCollateralBalance] = useState("123 eth");

  useEffect(() => {
    let temp1: any = [];
    let temp2: any = [];

    for (let i = 0; i < (Borrows ? Borrows?.length : 0); i++) {
      if (Borrows) {
        temp1.push({
          id: Borrows[i].loanId,
          name: Borrows[i].loanMarket,
          collateralBalance:
            Borrows[i].collateralAmountParsed +
            " " +
            Borrows[i].collateralMarket,
        });
        temp2.push(Borrows[i].loanId);
      }
    }
    setBorrowIDCoinMap(temp1);
    setBorrowIds(temp2);
  }, [Borrows]);
  const [loading, setLoading] = useState(true);
  const loadingTimeout = useTimeout(() => setLoading(false), 1800);

  const [borrowAPRs, setBorrowAPRs] = useState<(number|undefined)[]>([]);

  useEffect(() => {
    fetchProtocolStats();
  }, []);

  const fetchProtocolStats = async () => {
    try {
      const stats = await getProtocolStats();
      console.log("fetchprotocolstats", stats); //23014
      setBorrowAPRs([
        stats?.[2].borrowRate,
        stats?.[3].borrowRate,
        stats?.[0].borrowRate,
        stats?.[1].borrowRate,
        stats?.[4].borrowRate,
      ]);
    } catch (error) {
      console.log("error on getting protocol stats");
    }
  };

  const getBorrowAPR = (borrowMarket: string) => {
    switch (borrowMarket) {
      case "USDT":
        return borrowAPRs[0];
        break;
      case "USDC":
        return borrowAPRs[1];
        break;
      case "BTC":
        return borrowAPRs[2];
        break;
      case "ETH":
        return borrowAPRs[3];
        break;
      case "DAI":
        return borrowAPRs[4];
        break;

      default:
        break;
    }
  };

  // console.log("Borrows", loading, Borrows);
  return loading ? (
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
        {/* <Text color="#FFFFFF" fontSize="20px">
          Loading...
        </Text> */}
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="#010409"
          size="xl"
        />
        {/* <YourBorrowModal
          buttonText="Borrow assets"
          variant="link"
          fontSize="16px"
          fontWeight="400"
          display="inline"
          color="#0969DA"
          cursor="pointer"
          ml="0.4rem"
          lineHeight="24px"
        /> */}
      </Box>
    </>
  ) : upper_bound >= lower_bound && Borrows && Borrows?.length > 0 ? (
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
          {Borrows?.slice(lower_bound, upper_bound + 1).map(
            (borrow: any, idx: any) => {
              // console.log("faisal coin check", coin);
              // borrowIDCoinMap.push([coin.id, coin.name]);
              return (
                <>
                  <Tr
                    key={borrow.idx}
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
                        {borrow.loanId}{" "}
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
                              // src={`./BTC.svg`}
                              src={`/${borrow.loanMarket.slice(1)}.svg`}
                              alt="Picture of the author"
                              width="32"
                              height="32"
                            />
                            <Text
                              fontSize="14px"
                              fontWeight="400"
                              color="#E6EDF3"
                            >
                              {borrow.loanMarket}
                            </Text>
                          </HStack>
                          <Text
                            fontSize="14px"
                            fontWeight="500"
                            color="#F7BB5B"
                          >
                            {borrow.loanAmountParsed}
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
                        {borrowAPRs.length === 0 ? (
                          <Skeleton
                            width="6rem"
                            height="1.4rem"
                            startColor="#101216"
                            endColor="#2B2F35"
                            borderRadius="6px"
                          />
                        ) : (
                          getBorrowAPR(borrow.loanMarket.slice(1)) + "%"
                        )}
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
                            src={`/${borrow.collateralMarket.slice(1)}.svg`}
                            alt="Picture of the author"
                            width="32"
                            height="32"
                          />
                          <Text fontSize="14px" fontWeight="400">
                            {borrow.collateralMarket}
                          </Text>
                        </HStack>
                        <Text fontSize="14px" fontWeight="500" color="#F7BB5B">
                          {borrow.collateralAmountParsed}
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
                      {borrow.loanState == "ACTIVE" ? (
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
                          {borrow.spendType}
                        </Box>
                      ) : borrow.loanState == "REPAID" ||
                        borrow.loanState == "LIQUIDATED" ? (
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
                          {borrow.loanState}
                        </Box>
                      ) : (
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
                            justifyContent="center"
                            // gap={0.2}
                          >
                            <Box minWidth={"16px"}>
                              <Image
                                src={`/${borrow.l3App}.svg`}
                                alt="Picture of the author"
                                width="16"
                                height="16"
                              />
                            </Box>
                            <Text fontSize="14px" fontWeight="400">
                              {borrow.spendType}
                            </Text>
                          </HStack>
                          <HStack
                            height="50%"
                            width="100%"
                            alignItems="center"
                            justifyContent="center"
                            // bgColor={"red"}
                          >
                            <Box
                              display="flex"
                              // gap={0.5}
                              // bgColor={"blue"}
                            >
                              <Box
                                display="flex"
                                gap={0.5}
                                minWidth={"16px"}
                                // bgColor={"blue"}
                              >
                                <Image
                                  src={`/${borrow.underlyingMarket}.svg`}
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
                                  src={`/${borrow.underlyingMarket}.svg`}
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
                      )}
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
                        N/A
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
                        onClick={() => {
                          setCurrentBorrowId1("ID - " + borrow.loanId);
                          setCurrentBorrowMarketCoin1(borrow.loanMarket);
                          setCurrentBorrowId2("ID - " + borrow.loanId);
                          setCurrentBorrowMarketCoin2(borrow.loanMarket);
                          setBorrowAmount(borrow.loanAmountParsed);
                          setCollateralBalance(
                            borrow.collateralAmountParsed +
                              " " +
                              borrow.collateralMarket
                          );
                        }}
                        // bgColor={"blue"}
                      >
                        <YourBorrowModal
                          currentID={borrow.loanId}
                          currentMarket={borrow.loanMarket}
                          borrowIDCoinMap={borrowIDCoinMap}
                          currentBorrowId1={currentBorrowId1}
                          setCurrentBorrowId1={setCurrentBorrowId1}
                          currentBorrowMarketCoin1={currentBorrowMarketCoin1}
                          setCurrentBorrowMarketCoin1={
                            setCurrentBorrowMarketCoin1
                          }
                          currentBorrowId2={currentBorrowId2}
                          setCurrentBorrowId2={setCurrentBorrowId2}
                          currentBorrowMarketCoin2={currentBorrowMarketCoin2}
                          setCurrentBorrowMarketCoin2={
                            setCurrentBorrowMarketCoin2
                          }
                          collateralBalance={collateralBalance}
                          setCollateralBalance={setCollateralBalance}
                          loan={borrow}
                          borrowIds={borrowIds}
                          BorrowBalance={borrowAmount}
                          buttonText="Actions"
                          height={"2rem"}
                          fontSize={"12px"}
                          padding="6px 12px"
                          border="1px solid #BDBFC1"
                          bgColor="#101216"
                          _hover={{ bg: "white", color: "black" }}
                          borderRadius={"6px"}
                          color="#BDBFC1;"
                        />
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
                      display: `${borrow.idx == 5 ? "none" : "block"}`,
                    }}
                  />
                </>
              );
            }
          )}
          {(() => {
            const rows = [];
            for (
              let i: number = 0;
              i < 6 - (upper_bound - lower_bound + 1);
              i++
            ) {
              rows.push(<Tr height="5.15rem" bgColor="red"></Tr>);
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
        <BorrowModal
          buttonText="Borrow assets"
          variant="link"
          fontSize="16px"
          fontWeight="400"
          display="inline"
          color="#0969DA"
          cursor="pointer"
          ml="0.4rem"
          lineHeight="24px"
          coin={"BTC"}
        />
      </Box>
    </>
  );
};

export default BorrowDashboard;
