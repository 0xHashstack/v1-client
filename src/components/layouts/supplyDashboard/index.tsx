import React, { use, useEffect, useState } from "react";
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
  Spinner,
  useTimeout,
  Skeleton,
  Tooltip,
} from "@chakra-ui/react";

import Image from "next/image";
import SupplyModal from "@/components/modals/SupplyModal";
import YourSupplyModal from "@/components/modals/yourSupply";
import { useAccount } from "@starknet-react/core";
import { IDeposit } from "@/Blockchain/interfaces/interfaces";
import numberFormatter from "@/utils/functions/numberFormatter";
import { useDispatch, useSelector } from "react-redux";
import { selectProtocolStats } from "@/store/slices/readDataSlice";
import { selectUserDeposits } from "@/store/slices/readDataSlice";
import { effectiveAprDeposit } from "@/Blockchain/scripts/userStats";

import TableInfoIcon from "../table/tableIcons/infoIcon";
import numberFormatterPercentage from "@/utils/functions/numberFormatterPercentage";

export interface ICoin {
  name: string;
  symbol: string;
  icon: string;
}

// export interface IDeposit {
//   tokenAddress: string;
//   rTokenAmount: number;
//   underlyingAssetAmount: number;
// }

// const supplies: any = [
//   {
//     market: "USDT",
//     rTokenAmount: "10,000",
//     ExchangeRate: "1.23",
//     SupplyApr: "8.22%",
//     EffectiveApr: "7.8%",
//     Status: "Active",
//   },
//   {
//     market: "BTC",
//     rTokenAmount: "10,000",
//     ExchangeRate: "1.23",
//     SupplyApr: "8.22%",
//     EffectiveApr: "7.8%",
//     Status: "Active",
//   },
//   {
//     market: "DAI",
//     rTokenAmount: "10,000",
//     ExchangeRate: "1.23",
//     SupplyApr: "8.22%",
//     EffectiveApr: "7.8%",
//     Status: "Active",
//   },
//   {
//     market: "USDT",
//     rTokenAmount: "1000",
//     ExchangeRate: "1.23",
//     SupplyApr: "8.22%",
//     EffectiveApr: "7.8%",
//     Status: "Active",
//   },
//   {
//     market: "DAI",
//     rTokenAmount: "1000",
//     ExchangeRate: "1.23",
//     SupplyApr: "8.22%",
//     EffectiveApr: "7.8%",
//     Status: "Active",
//   },
//   {
//     market: "BTC",
//     rTokenAmount: "1000",
//     ExchangeRate: "1.23",
//     SupplyApr: "8.22%",
//     EffectiveApr: "7.8%",
//     Status: "Active",
//   },
// ];
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
  const { address } = useAccount();
  const [showEmptyNotification, setShowEmptyNotification] = useState(true);

  const [currentSelectedSupplyCoin, setCurrentSelectedSupplyCoin] =
    useState("BTC");
  const [currentSelectedWithdrawlCoin, setcurrentSelectedWithdrawlCoin] =
    useState("rBTC");
  const [supplyMarkets, setSupplyMarkets] = useState([]);
  const [currentActionMarket, setCurrentActionMarket] = useState("rBTC");
  const [statusHoverIndex, setStatusHoverIndex] = useState("-1");

  const [supplies, setSupplies] = useState<IDeposit[]>([]);
  let userDeposits = useSelector(selectUserDeposits);
  let reduxProtocolStats = useSelector(selectProtocolStats);
  const [coinPassed, setCoinPassed] = useState({
    name: "BTC",
    icon: "mdi-bitcoin",
    symbol: "WBTC",
  });
  const dispatch = useDispatch();
  const handleStatusHover = (idx: string) => {
    setStatusHoverIndex(idx);
  };

  const handleStatusHoverLeave = () => {
    setStatusHoverIndex("-1");
  };
  const [avgs, setAvgs] = useState<any>([]);
  const avgsData: any = [];

  useEffect(() => {
    const getSupply = async () => {
      if (!userDeposits || !reduxProtocolStats) {
        return;
      }
      // console.log("all deposits calling started");
      // console.log("all deposits calling started");
      try {
        const supply = userDeposits;
        // console.log("users deposits - ", userDeposits);

        // const supply = await getUserDeposits(address);

        // console.log("supply in supply dash: ", supply);
        if (!supply) return;
        // let data: any = [];
        // let indexes: any = [2, 3, 0, 1, 4];

        // data = indexes.map((index: number) => {
        //   if (
        //     supply?.[index].rTokenAmountParsed !== 0 ||
        //     supply?.[index].rTokenFreeParsed !== 0 ||
        //     supply?.[index].rTokenLockedParsed !== 0 ||
        //     supply?.[index].rTokenStakedParsed !== 0
        //   )
        //     return supply[index];
        // });

        // supply.map((currSupply: any) => {
        //   if (
        //     currSupply.rTokenAmountParsed !== 0 ||
        //     currSupply.rTokenFreeParsed !== 0 ||
        //     currSupply.rTokenLockedParsed !== 0 ||
        //     currSupply.rTokenStakedParsed !== 0
        //   )
        //     temp.push(currSupply);
        // });
        // setSupplies(data);
        // console.log(supplies,"supply dash");
        // console.log(reduxProtocolStats,"supply stats")
        if (avgs.length == 0) {
          for (var i = 0; i < supply?.length; i++) {
            const avg = await effectiveAprDeposit(
              supply[i],
              reduxProtocolStats
            );
            // console.log(avg, "avg in supply dash");
            const data = {
              token: supply[i].token,
              avg: avg?.toFixed(2),
            };
            // avgs.push(data)
            avgsData.push(data);
            // avgs.push()
          }
          setAvgs(avgsData);
        }
        // console.log(avgs, "avgs in supply");

        // dispatch(setUserDeposits(supply));
      } catch (err) {
        console.log("supplies", err);
      }
    };
    getSupply();
  }, [userDeposits, reduxProtocolStats]);
  // useEffect(()=>{
  //   const fetchEffectiveApr=async()=>{
  //     try{
  //       const supply=userDeposits;
  //       if(avgs.length==0){
  //         for(var i=0;i<supply?.length;i++){
  //           const avg=await effectiveAprDeposit(supply[i],reduxProtocolStats);
  //           const data={
  //             token:supply[i].token,
  //             avg:avg
  //           }
  //           // avgs.push(data)
  //           avgsData.push(data);
  //           // avgs.push()
  //         }
  //         setAvgs(avgsData);
  //       }
  //     }catch(err){
  //       console.log(err);
  //     }

  //     fetchEffectiveApr();
  //     console.log(avgs,"avgs in suppply")
  //   }
  // },[userDeposits])
  const [protocolStats, setProtocolStats]: any = useState([]);
  const [supplyAPRs, setSupplyAPRs]: any = useState([]);
  const [currentSupplyAPR, setCurrentSupplyAPR] = useState<Number>(2);

  useEffect(() => {
    const getMarketData = async () => {
      try {
        const stats = reduxProtocolStats;

        // const stats = await getProtocolStats();
        if (stats) {
          // dispatch(setProtocolStats(stats));
        }
        // console.log("SupplyDashboard fetchprotocolstats ", stats); //23014
        // const temp: any = ;
        setProtocolStats([
          stats?.[2],
          stats?.[3],
          stats?.[0],
          stats?.[1],
          stats?.[4],
        ]);
        setSupplyAPRs([
          stats?.[2].supplyRate,
          stats?.[3].supplyRate,
          stats?.[0].supplyRate,
          stats?.[1].supplyRate,
          stats?.[4].supplyRate,
        ]);
      } catch (error) {
        console.log("error on getting protocol stats");
      }
    };
    getMarketData();
  }, [reduxProtocolStats]);
  // console.log(protocolStats,"data protocol stats in supply")

  useEffect(() => {
    let temp: any = [];
    supplies.map((coin: any) => {
      if (coin?.rTokenAmountParsed != 0 || coin?.rTokenStakedParsed !== 0) {
        temp.push(coin?.rToken);
      }
    });
    setSupplyMarkets(temp);
  }, [supplies]);
  let lower_bound = 6 * (currentPagination - 1);
  let upper_bound = lower_bound + 5;
  // console.log(userDeposits?.length,"length supply");
  upper_bound = Math.min(userDeposits?.length - 1, upper_bound);
  // useEffect(() => {
  //   try {
  //     const supply = async () => {
  //       const userSupply = await getUserDeposits(address || "");
  //       // console.log("userDeposits", userSupply);
  //     };
  //     // supply();
  //   } catch (err) {
  //     console.log("userDeposits", err);
  //   }
  // }, []);
  const [loading, setLoading] = useState(true);
  // const loadingTimeout = useTimeout(() => setLoading(false), 1800);
  useEffect(() => {
    if (userDeposits) {
      const supply = userDeposits;
      // console.log("users deposits - ", userDeposits);

      // const supply = await getUserDeposits(address);

      // console.log("supply in supply dash: ", supply);
      if (!supply) return;
      let data: any = [];
      let indexes: any = [2, 3, 0, 1, 4];

      indexes.forEach((index: number) => {
        if (
          supply?.[index]?.rTokenAmountParsed !== 0 ||
          supply?.[index]?.rTokenFreeParsed !== 0 ||
          supply?.[index]?.rTokenLockedParsed !== 0 ||
          supply?.[index]?.rTokenStakedParsed !== 0
        ) {
          if (index == 2 || index == 3) {
            if (supply?.[index]?.rTokenAmountParsed > 0.000001 ||
              supply?.[index]?.rTokenFreeParsed > 0.000001 ||
              supply?.[index]?.rTokenLockedParsed > 0.000001 ||
              supply?.[index]?.rTokenStakedParsed > 0.000001) {
              data[index] = supply[index];
            }
          } else {
            data[index] = supply[index];
          }

        }
      });
      setSupplies(data);
      console.log(data, "loading - ", userDeposits);
      setLoading(false);
    }
  }, [userDeposits]);

  const tooltips = [
    "Allocated quantity of rTokens for a market after supplying funds to the protocol.",
    "Conversion rate of rTokens to underlying assets.",
    "Annual interest rate earned on supplied tokens.",
    " Annualised interest rate depending on the staked, unstaked and locked supply quantities .",
    "Track the borrowed amount's progress and key details within the protocol.",
  ];

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
        background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
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
  ) : upper_bound >= lower_bound && supplies?.length > 0 ? (
    <Box
      height={"37rem"}
      w={width}
      background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"

      color="white"
      borderRadius="md"
    >
      <TableContainer
        display="flex"
        justifyContent="flex-start"
        alignItems="flex-start"
        // bgColor={"yellow"}
        // height={"100%"}
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
                    cursor="context-menu"
                  >
                    <Tooltip
                      hasArrow
                      label={tooltips[idx1]}
                      placement={
                        (idx1 === 0 && "bottom-start") ||
                        (idx1 === columnItems.length - 1 && "bottom-end") ||
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
            {supplies
              ?.slice(lower_bound, upper_bound + 1)
              .map((supply: any, idx: number) => (
                <>
                  <Tr
                    key={lower_bound + idx}
                    width={"100%"}
                    // height={"5.2rem"}
                    height={"6rem"}
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
                    >
                      <Box
                        width="100%"
                        height="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-start"
                        fontWeight="400"
                      >
                        <VStack
                          // gap="3px"
                          width="100%"
                          display="flex"
                          justifyContent="center"
                          alignItems="flex-start"
                          height="2.5rem"
                        >
                          <HStack
                            height="2rem"
                            width="2rem"
                            alignItems="center"
                          >
                            <Image
                              src={`/${supply?.rToken?.slice(1)}.svg`}
                              alt="Picture of the author"
                              width="32"
                              height="32"
                            />
                            <Text fontSize="14px" fontWeight="400">
                              {supply?.rToken}
                            </Text>
                          </HStack>
                          <Tooltip
                            hasArrow
                            label={`Underlying Amount: ${(reduxProtocolStats.find(
                              (val: any) => val?.token == supply?.rToken.slice(1)
                            )?.exchangeRateRtokenToUnderlying * (supply?.rTokenAmountParsed + supply?.rTokenStakedParsed)).toFixed(4)}`}
                            // arrowPadding={-5420}
                            placement="right"
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
                          // cursor="context-menu"
                          // marginRight={idx1 === 1 ? "52px" : ""}
                          // maxW="222px"
                          // mt="28px"
                          >
                            <Text
                              fontSize="14px"
                              fontWeight="500"
                              color="#F7BB5B"
                            >
                              {numberFormatter(
                                supply?.rTokenAmountParsed + supply?.rTokenStakedParsed
                                // supply?.rTokenLockedParsed
                              )}
                            </Text>
                          </Tooltip>
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
                      >
                        {/* {checkGap(idx1, idx2)} */}
                        {!protocolStats || !protocolStats[idx] ? (
                          <Skeleton
                            width="4rem"
                            height="1.4rem"
                            startColor="#101216"
                            endColor="#2B2F35"
                            borderRadius="6px"
                          />
                        ) : (
                          Number(
                            protocolStats.find((stat: any) => {
                              if (stat?.token === supply?.rToken?.slice(1))
                                return stat.supplyRate;
                            })?.exchangeRateRtokenToUnderlying
                          )?.toFixed(3)
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
                      <Box
                        width="100%"
                        height="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontWeight="400"
                      >
                        {/* {checkGap(idx1, idx2)} */}
                        {!protocolStats || !protocolStats[idx] ? (
                          <Skeleton
                            width="4rem"
                            height="1.4rem"
                            startColor="#101216"
                            endColor="#2B2F35"
                            borderRadius="6px"
                          />
                        ) : (
                          // protocolStats[idx]?.supplyRate + "%"
                          Number(
                            protocolStats.find((stat: any) => {
                              if (stat?.token === supply?.rToken?.slice(1))
                                return stat?.supplyRate;
                            })?.supplyRate
                          )?.toFixed(3) + "%"
                        )}
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
                      >
                        {/* {checkGap(idx1, idx2)} */}
                        {/* {(!avgs?.token==supply?.token) ? avgs.avg :  "2.00%"} */}
                        {/* {avgs[2]} */}
                        {/* { avgs.length>0? <Skeleton
                            width="4rem"
                            height="1.4rem"
                            startColor="#101216"
                            endColor="#2B2F35"
                            borderRadius="6px"
                          />: */}
                        {avgs && avgs?.length > 0 ? (
                          avgs?.find(
                            (item: any) => item?.token == supply?.token
                          )?.avg + "%"
                        ) : (
                          <Skeleton
                            width="4rem"
                            height="1.4rem"
                            startColor="#101216"
                            endColor="#2B2F35"
                            borderRadius="6px"
                          />
                        )}
                        {/* {supply?.token} */}
                      </Text>
                    </Td>
                    <Td
                      width={"12.5%"}
                      maxWidth={"3rem"}
                      fontSize={"14px"}
                      fontWeight={400}
                      // overflow={"hidden"}
                      textAlign={"center"}
                    >
                      <Box
                        width="90%"
                        height="100%"
                        display="flex"
                        flexDirection="column"
                        // alignItems="center"
                        justifyContent="center"
                        fontWeight="400"
                        // bgColor={"blue"}
                        margin="0 auto"
                        gap={2}
                        pl="1.1rem"
                      >
                        {/* {checkGap(idx1, idx2)} */}
                        <HStack
                          // bgColor="red"
                          justifyContent="flex-start"
                        // display={
                        //   supply?.rTokenStakedParsed > 0 ||
                        //   supply?.rTokenFreeParsed > 0
                        //     ? "flex"
                        //     : "none"
                        // }
                        // mx={
                        //   supply?.rTokenStakedParsed <= 0 ||
                        //   supply?.rTokenFreeParsed <= 0
                        //     ? "30%"
                        //     : "0"
                        // }
                        >
                          <HStack
                            onMouseEnter={() => handleStatusHover("0" + idx)}
                            onMouseLeave={() => handleStatusHoverLeave()}
                            _hover={{ cursor: "pointer" }}
                            // display={
                            //   supply?.rTokenStakedParsed > 0 ? "flex" : "none"
                            // }
                            // bgColor="red"
                            mr="16px"
                            pl={2}
                            cursor="pointer"
                          >
                            {statusHoverIndex != "0" + idx ? (
                              <Image
                                src={`/stakeStatus.svg`}
                                alt="Picture of the author"
                                width="18"
                                height="18"
                              />
                            ) : (
                              <Text
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                borderRadius="22px"
                                bgColor="#0C521F"
                                p="0px 12px"
                                fontSize="12px"
                              >
                                Staked
                              </Text>
                            )}
                            <Text>
                              {numberFormatter(supply?.rTokenStakedParsed)}
                            </Text>
                          </HStack>
                          <HStack
                            // display={
                            //   supply?.rTokenFreeParsed > 0 ? "flex" : "none"
                            // }
                            onMouseEnter={() => handleStatusHover("1" + idx)}
                            onMouseLeave={() => handleStatusHoverLeave()}
                            cursor="pointer"
                          >
                            {statusHoverIndex != "1" + idx ? (
                              <Image
                                src={`/freeStatus.svg`}
                                alt="Picture of the author"
                                width="18"
                                height="18"
                              />
                            ) : (
                              <Text
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                borderRadius="22px"
                                bgColor="#340c7e"
                                p="0px 12px"
                                fontSize="12px"
                              >
                                Unstaked
                              </Text>
                            )}
                            <Text>
                              {numberFormatter(supply?.rTokenFreeParsed)}
                            </Text>
                          </HStack>
                        </HStack>
                        <HStack
                        // display={
                        //   supply?.rTokenLockedParsed > 0 ? "flex" : "none"
                        // }
                        // mx={
                        //   supply?.rTokenStakedParsed <= 0 ||
                        //   supply?.rTokenFreeParsed <= 0
                        //     ? "30%"
                        //     : "0"
                        // }
                        >
                          <HStack
                            pl={2}
                            onMouseEnter={() => handleStatusHover("2" + idx)}
                            onMouseLeave={() => handleStatusHoverLeave()}
                            cursor="pointer"
                          >
                            {statusHoverIndex != "2" + idx ? (
                              <Image
                                src={`/lockedStatus.svg`}
                                alt="Picture of the author"
                                width="18"
                                height="18"
                              />
                            ) : (
                              <Text
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                borderRadius="22px"
                                bgColor="#404953"
                                p="0px 12px"
                                fontSize="12px"
                              >
                                Locked
                              </Text>
                            )}
                            <Text>
                              {numberFormatter(supply?.rTokenLockedParsed)}
                            </Text>
                          </HStack>
                        </HStack>
                        {/* {supply?.Status || "ACTIVE"} */}
                      </Box>
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
                          setCurrentSelectedSupplyCoin(supply?.token);
                          setcurrentSelectedWithdrawlCoin(supply?.rToken);
                          setCurrentActionMarket(supply?.rToken);
                        }}
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
                          currentActionMarket={currentActionMarket}
                          coins={supplyMarkets}
                          protocolStats={protocolStats}
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
                      display: `${idx == 4 ? "none" : "block"}`,
                    }}
                  />
                </>
              ))}
            {(() => {
              const rows = [];
              for (
                let i: number = 0;
                // i < 6 - (upper_bound - lower_bound + 1);
                i < 0;
                i++
              ) {
                rows.push(<Tr height="4rem"></Tr>);
              }
              return rows;
            })()}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  ) : (
    <>
      {showEmptyNotification && (
        <Box display="flex" justifyContent="left" w="94%" pb="2">
          <Box
            display="flex"
            bg="#222766"
            fontSize="14px"
            p="4"
            fontStyle="normal"
            fontWeight="400"
            borderRadius="6px"
            border="1px solid #3841AA"
            // textAlign="center"
            color="#F0F0F5"
          >
            <Box mt="0.1rem" mr="0.7rem" cursor="pointer">
              <TableInfoIcon />
            </Box>
            You do not have active supply.
            <Box
              // ml="1"
              mr="1"
              as="span"
              textDecoration="underline"
              color="#0C6AD9"
              cursor="pointer"
            >
              <SupplyModal
                buttonText="Click here to supply"
                variant="link"
                fontSize="16px"
                fontWeight="400"
                display="inline"
                color="#4D59E8"
                cursor="pointer"
                ml="0.3rem"
                lineHeight="22px"
                backGroundOverLay={"rgba(244, 242, 255, 0.5);"}
                supplyAPRs={supplyAPRs}
                currentSupplyAPR={currentSupplyAPR}
                setCurrentSupplyAPR={setCurrentSupplyAPR}
                coin={coinPassed}
              />
            </Box>
            {/* <Box
              py="1"
              pl="4"
              cursor="pointer"
              onClick={() => setShowEmptyNotification(!showEmptyNotification)}
            >
              <TableClose />
            </Box> */}
          </Box>
        </Box>
      )}
      {/* <Box
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
        <Text color="#FFFFFF">You do not have active supply</Text>
        
      </Box> */}
    </>
  );
};

export default SupplyDashboard;
