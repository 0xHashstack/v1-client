import {
  Box,
  HStack,
  Skeleton,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tooltip,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import axios from "axios";
import Image from "next/image";
import posthog from "posthog-js";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ILoan } from "@/Blockchain/interfaces/interfaces";
import ExpandedCoinIcon from "@/assets/expanded/ExpandedCoins";
import ExpandedMarketIcon from "@/assets/expanded/ExpandedMarket";
import DollarActiveRadioButton from "@/assets/icons/dollarActiveRadioButton";
import DollarNonActiveRadioButton from "@/assets/icons/dollarNonActiveRadioButton";
import LowhealthFactor from "@/assets/icons/lowhealthFactor";
import MediumHeathFactor from "@/assets/icons/mediumHeathFactor";
import BorrowModal from "@/components/modals/borrowModal";
import YourBorrowModal from "@/components/modals/yourBorrowModal";
import {
  selectEffectiveApr,
  selectHealthFactor,
  selectJediswapPoolAprs,
  selectOraclePrices,
  selectProtocolStats,
  selectUserDeposits,
  selectUserLoans,
  selectYourSupply,
  setNetAprLoans,
} from "@/store/slices/readDataSlice";
import {
  selectJedistrkTokenAllocation,
  selectMySplit,
  selectStrkAprData,
  selectnetSpendBalance,
} from "@/store/slices/userAccountSlice";
import dollarConvertor from "@/utils/functions/dollarConvertor";
import numberFormatter from "@/utils/functions/numberFormatter";
import numberFormatterPercentage from "@/utils/functions/numberFormatterPercentage";
import TableInfoIcon from "../table/tableIcons/infoIcon";
import DegenModal from "@/components/modals/degenModal";
import SupplyModal from "@/components/modals/SupplyModal";

export interface ICoin {
  name: string;
  symbol: string;
  icon: string;
}

interface BorrowDashboardProps {
  width: string;
  currentPagination: any;
  setCurrentPagination: any;
  Coins: any;
  columnItems: any;
  Borrows: any;
  userLoans: any;
  supplyAPRs:any,
  borrowAPRs:any,
}

const tooltips = [
  "A unique ID number assigned to a specific borrow within the protocol.",
  "The unit of tokens borrowed from the protocol.",
  "The annual interest rate charged on borrowed tokens from the protocol.",
  "If positive, This is the yield earned by your loan at present. If negative, This is the interest you are paying.",
  "Collateral are the tokens held as security for borrowed amount.",
  "Shows if borrowed amount was used in other pools or dapps within the protocol.",
  "This is return you would make if you closed the loan now. ROE is Return on equity.",
  "Loan risk metric comparing collateral value to borrowed amount to check potential liquidation.",
];

const DegenDashboard: React.FC<BorrowDashboardProps> = ({
  width,
  currentPagination,
  Coins,
  setCurrentPagination,
  supplyAPRs ,
  borrowAPRs,
  columnItems,
  Borrows,
}) => {
    const [currentBorrowAPR, setCurrentBorrowAPR] = useState<number>(0);
    const [currentSupplyAPR, setCurrentSupplyAPR] = useState<number>(0);
    const [currentBorrowMarketCoin, setCurrentBorrowMarketCoin] = useState("BTC");
  const [borrowIDCoinMap, setBorrowIDCoinMap] = useState([]);
  const [borrowIds, setBorrowIds] = useState([]);
  const [borrowAmount, setBorrowAmount] = useState<number>(0);
  const [currentBorrowId1, setCurrentBorrowId1] = useState("");
  const [currentBorrowMarketCoin1, setCurrentBorrowMarketCoin1] =
    useState("BTC");
  const [currentBorrowId2, setCurrentBorrowId2] = useState("");
  const [currentBorrowMarketCoin2, setCurrentBorrowMarketCoin2] =
    useState("BTC");
  const [validRTokens, setValidRTokens] = useState([]);
  const [collateralBalance, setCollateralBalance] = useState("123 eth");
  const [currentSpendStatus, setCurrentSpendStatus] = useState("");
  const [currentLoanAmount, setCurrentLoanAmount] = useState("");
  const [currentLoanMarket, setCurrentLoanMarket] = useState("");
  const [showEmptyNotification, setShowEmptyNotification] = useState(false);
  const avgs = useSelector(selectEffectiveApr);
  const allSplit = useSelector(selectMySplit);
  const [loading, setLoading] = useState(true);
  const [coinPassed, setCoinPassed] = useState({ name: "USDT", icon: "mdi-bitcoin", symbol: "USDT" },);
  const oraclePrices = useSelector(selectOraclePrices);
  const totalSupply=useSelector(selectYourSupply);

  let lower_bound = 6 * (currentPagination - 1);
  let upper_bound = lower_bound + 5;
  upper_bound = Math.min(Borrows ? Borrows.length - 1 : 0, upper_bound);

  const getBorrowAPR: any = (borrowMarket: string) => {
    switch (borrowMarket) {
      case "USDT":
        return borrowAPRs[0];
      case "USDC":
        return borrowAPRs[1];
      case "BTC":
        return borrowAPRs[2];
      case "ETH":
        return borrowAPRs[3];
      case "DAI":
        return borrowAPRs[4];
      case "STRK":
        return borrowAPRs[5];

      default:
        break;
    }
  };

  const strkData = useSelector(selectStrkAprData);
  const netSpendBalance = useSelector(selectnetSpendBalance);

  const [netStrkBorrow, setnetStrkBorrow] = useState(0);

  useEffect(()=>{
    if(totalSupply){
        if(totalSupply<1000){
            setShowEmptyNotification(true)
        }
    }
  },[totalSupply])

  useEffect(() => {
    if (strkData != null) {
      let netallocation = 0;
      for (let token in strkData) {
        if (strkData.hasOwnProperty(token)) {
          const array = strkData[token];
          const lastObject = array[array.length - 1];
          netallocation += 0.3 * lastObject.allocation;
        }
      }
      setnetStrkBorrow(netallocation);
    } else {
      setnetStrkBorrow(0);
    }
  }, [strkData]);

  const getBoostedAprSupply = (coin: any) => {
    if (strkData == null) {
      return 0;
    } else {
      if (strkData?.[coin]) {
        if (oraclePrices == null) {
          return 0;
        } else {
          let value = strkData?.[coin]
            ? (365 *
                100 *
                strkData?.[coin][strkData[coin]?.length - 1]?.allocation *
                0.7 *
                oraclePrices?.find((curr: any) => curr.name === "STRK")
                  ?.price) /
              strkData?.[coin][strkData[coin].length - 1]?.supply_usd
            : 0;
          return value;
        }
      } else {
        return 0;
      }
    }
  };

  const getBoostedApr = (coin: any) => {
    if (strkData == null) {
      return 0;
    } else {
      if (strkData?.[coin]) {
        if (oraclePrices == null) {
          return 0;
        } else {
          if (netStrkBorrow != 0) {
            if (netSpendBalance) {
              let value =
                (365 *
                  100 *
                  netStrkBorrow *
                  oraclePrices?.find((curr: any) => curr.name === "STRK")
                    ?.price) /
                netSpendBalance;
              return value;
            } else {
              return 0;
            }
          } else {
            return 0;
          }
        }
      } else {
        return 0;
      }
    }
  };

  const getAprByPool = (dataArray: any[], pool: string, l3App: string) => {
    const matchedObject = dataArray.find((item) => {
      if (item.name === "USDT/USDC") {
        return item.amm === "jedi" && "USDC/USDT" === pool;
      } else if (item.name == "ETH/STRK") {
        return item.amm === "jedi" && "STRK/ETH" === pool;
      } else if (item.name === "ETH/DAI") {
        return item.amm === "jedi" && "DAI/ETH" === pool;
      } else {
        return (
          item.name === pool &&
          item.amm === (l3App == "JEDI_SWAP" ? "jedi" : "myswap")
        );
      }
    });
    return matchedObject ? matchedObject.apr * 100 : 0;
  };

  useEffect(() => {
    if (Borrows || Borrows?.length > 0) {
      setLoading(false);
    }
  }, [Borrows]);

  const strkTokenAlloactionData: any = useSelector(
    selectJedistrkTokenAllocation
  );
  const getStrkAlloaction = (pool: any) => {
    try {
      if (strkTokenAlloactionData[pool]) {
        return strkTokenAlloactionData[pool][
          strkTokenAlloactionData[pool].length - 1
        ]?.allocation;
      } else {
        return 0;
      }
    } catch (err) {
      return 0;
    }
  };
  const coin= { name: "ETH", icon: "mdi-ethereum", symbol: "WETH" };
  const borrowcoin= { name: "BTC", icon: "mdi-bitcoin", symbol: "WBTC" };
  const getTvlByPool = (dataArray: any[], pool: string, l3App: string) => {
    const matchedObject = dataArray.find((item) => {
      if (item.name === "USDT/USDC") {
        return item.amm === "jedi" && "USDC/USDT" === pool;
      } else if (item.name == "ETH/STRK") {
        return item.amm === "jedi" && "STRK/ETH" === pool;
      } else if (item.name === "ETH/DAI") {
        return item.amm === "jedi" && "DAI/ETH" === pool;
      } else {
        return (
          item.name === pool &&
          item.amm === (l3App == "JEDI_SWAP" ? "jedi" : "myswap")
        );
      }
    });
    return matchedObject ? matchedObject.tvl : 0;
  };
  // console.log(strkTokenAlloactionData["STRK/ETH"][strkTokenAlloactionData["STRK/ETH"].length-1].allocation,"allocat")

  return loading ? (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="95%"
      height={"37rem"}
      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30)) "
      bg={" var(--surface-of-10, rgba(103, 109, 154, 0.10)); "}
      borderRadius="8px"
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="#010409"
        size="xl"
      />
    </Box>
  ) : upper_bound >= lower_bound && Borrows && Borrows?.length > 0 && totalSupply>=10 ? (
    <Box
      bg="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
      color="white"
      borderRadius="md"
      w={width}
      display="flex"
      flexDirection="column"
      height={"40rem"}
      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30)) "
      padding={"1rem 2rem 0rem"}
      overflowX="hidden"
    >
      <TableContainer
        bg="transparent"
        color="white"
        borderRadius="md"
        w="100%"
        display="flex"
        justifyContent="flex-start"
        alignItems="flex-start"
        height={"37rem"}
        overflow="none"
      >
        <Table variant="unstyled" width="100%" height="100%" mb="0.5rem">
          <Thead width={"100%"} height={"5rem"}>
            <Tr width={"100%"} height="2rem">
              {columnItems.map((val: any, idx1: any) => (
                <Td
                  key={idx1}
                  width={"12.5%"}
                  fontSize={"12px"}
                  fontWeight={400}
                  p={0}
                >
                  <Text
                    whiteSpace="pre-wrap"
                    overflowWrap="break-word"
                    width={"100%"}
                    height={"2rem"}
                    fontSize="12px"
                    textAlign={
                      idx1 == 0 || idx1 == 1
                        ? "left"
                        : idx1 == columnItems?.length - 1
                        ? "right"
                        : "center"
                    }
                    pl={idx1 == 0 ? 2 : idx1 == 1 ? "52%  " : "20%"}
                    pr={idx1 == columnItems.length - 1 ? 5 : 0}
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
                    >
                      {val}
                    </Tooltip>
                  </Text>
                </Td>
              ))}
            </Tr>
          </Thead>
          <Tbody position="relative" overflowX="hidden">
            {Borrows?.slice(lower_bound, upper_bound + 1)
            // .sort((a: { maxApr: number; }, b: { maxApr: number; }) => b.maxApr - a.maxApr)
            .map(
              (borrow: any, idx: any) => {
                return (
                  <>
                    <Tr
                      key={lower_bound + borrow.idx}
                      width={"100%"}
                      position="relative"
                      p={0}
                    >
                      <Td
                        width={"12.5%"}
                        fontSize={"14px"}
                        fontWeight={400}
                        padding={2}
                        textAlign="center"
                      >
                        <VStack
                          width="100%"
                          display="flex"
                          alignItems="flex-start"
                          height="2.5rem"
                        >
                          <HStack
                            height="2rem"
                            width="2rem"
                            alignItems="center"
                            justifyContent="flex-start"
                          >
                            <Image
                              src={`/${borrow?.protocol}.svg`}
                              alt="Picture of the author"
                              width="32"
                              height="32"
                            />
                            <Text fontSize="14px" fontWeight="400">
                              {borrow?.protocol}
                            </Text>
                          </HStack>
                          <Box color="#B1B0B5" fontSize="12px">
                            {borrow.stratergy}
                          </Box>
                        </VStack>
                      </Td>

                      <Td
                        width={"12.5%"}
                        fontSize={"14px"}
                        fontWeight={400}
                        overflow={"hidden"}
                        textAlign={"center"}
                        pl="5rem"
                      >
                        <Box
                          width="100%"
                          pl="20%"
                          height="100%"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontWeight="400"
                          textAlign="center"
                        >
                          <VStack
                            width="100%"
                            display="flex"
                            justifyContent="center"
                            alignItems="flex-start"
                            height="2.5rem"
                          >
                            <Box
                              bg="#3E415C"
                              lineHeight="20px"
                              letterSpacing="-0.15px"
                              padding="0px 12px"
                              fontSize="12px"
                              borderRightRadius="100px"
                              borderLeftRadius="100px"
                            >
                              {borrow.actionType}
                            </Box>
                            <Box
                              bg="#3E415C"
                              lineHeight="20px"
                              letterSpacing="-0.15px"
                              padding="0px 12px"
                              fontSize="12px"
                              borderRightRadius="100px"
                              borderLeftRadius="100px"
                            >
                              STRK Farming
                            </Box>
                          </VStack>
                        </Box>
                      </Td>

                      <Td
                        width={"12.5%"}
                        maxWidth={"5rem"}
                        fontSize={"14px"}
                        fontWeight={400}
                        textAlign={"center"}
                        pl="5rem"
                      >
                        <VStack
                          width="100%"
                          display="flex"
                          alignItems="center"
                          height="2.5rem"
                        >
                          <HStack
                            height="2rem"
                            width="2rem"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Image
                              src={`/${borrow?.protocol}.svg`}
                              alt="Picture of the author"
                              width="32"
                              height="32"
                            />
                            <Text fontSize="14px" fontWeight="400">
                              {borrow?.protocol}
                            </Text>
                          </HStack>
                        </VStack>
                      </Td>
                      <Td
                        width={"12.5%"}
                        maxWidth={"5rem"}
                        fontSize={"14px"}
                        fontWeight={400}
                        textAlign={"center"}
                        pl="5rem"
                      >
                        <VStack
                          width="100%"
                          display="flex"
                          alignItems="center"
                          height="2.5rem"
                        >
                          <HStack
                            height="2rem"
                            width="2rem"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Image
                              src={`/${borrow?.collateralCoin}.svg`}
                              alt="Picture of the author"
                              width="32"
                              height="32"
                            />
                            <Text fontSize="14px" fontWeight="400">
                              {borrow?.collateralCoin}
                            </Text>
                          </HStack>
                        </VStack>
                      </Td>
                      <Td
                        width={"12.5%"}
                        maxWidth={"3rem"}
                        fontSize={"14px"}
                        fontWeight={400}
                        overflow={"hidden"}
                        textAlign={"center"}
                        pl="5rem"
                      >
                        {borrow.maxLeverage}x
                      </Td>
                      <Td
                        maxWidth={"5rem"}
                        fontSize={"14px"}
                        fontWeight={400}
                        textAlign={"center"}
                        pl="5rem"
                      >
                        <Box
                          width="100%"
                          height="100%"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontWeight="400"
                          color="#00D395"
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
                            posthog.capture("Your Borrow Actions Clicked", {
                              Clicked: true,
                            });
                            setCurrentSpendStatus(borrow.spendType);
                            setCurrentLoanAmount(borrow?.currentLoanAmount);
                            setCurrentLoanMarket(borrow?.currentLoanMarket);
                          }}
                        >
                          {numberFormatterPercentage(borrow.maxApr)}%
                        </Box>
                      </Td>

                      <Td
                        width={"12.5%"}
                        maxWidth={"5rem"}
                        fontSize={"14px"}
                        fontWeight={400}
                        textAlign={"right"}
                        pr="1rem"
                    
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
                            posthog.capture("Your Borrow Actions Clicked", {
                              Clicked: true,
                            });
                            setCurrentSpendStatus(borrow.spendType);
                            setCurrentLoanAmount(borrow?.currentLoanAmount);
                            setCurrentLoanMarket(borrow?.currentLoanMarket);
                          }}
                        >
                          <Box>
                            <DegenModal
                              coin={coin}
                              borrowAPRs={borrowAPRs}
                              currentBorrowAPR={currentBorrowAPR}
                              supplyAPRs={supplyAPRs}
                              currentSupplyAPR={currentSupplyAPR}
                              setCurrentBorrowAPR={setCurrentBorrowAPR}
                              validRTokens={validRTokens}
                              currentBorrowMarketCoin={currentBorrowMarketCoin}
                              suggestedBorrow={borrowcoin}
                              suggestedCollateral={coin}
                              spendAction={borrow?.actionType=="Swap" ?"2":"1"}
                              pool={"USDC/USDT"}
                            />
                            {/* <YourBorrowModal
                                currentID={borrow.loanId}
                                currentMarket={borrow.loanMarket}
                                borrowIDCoinMap={borrowIDCoinMap}
                                currentBorrowId1={currentBorrowId1}
                                setCurrentBorrowId1={setCurrentBorrowId1}
                                currentBorrowMarketCoin1={
                                  currentBorrowMarketCoin1
                                }
                                setCurrentBorrowMarketCoin1={
                                  setCurrentBorrowMarketCoin1
                                }
                                currentBorrowId2={currentBorrowId2}
                                setCurrentBorrowId2={setCurrentBorrowId2}
                                currentBorrowMarketCoin2={
                                  currentBorrowMarketCoin2
                                }
                                setCurrentBorrowMarketCoin2={
                                  setCurrentBorrowMarketCoin2
                                }
                                currentLoanAmount={currentLoanAmount}
                                currentLoanAmountParsed={
                                  borrow?.currentLoanAmountParsed
                                }
                                setCurrentLoanAmount={setCurrentLoanAmount}
                                currentLoanMarket={currentLoanMarket}
                                setCurrentLoanMarket={setCurrentLoanMarket}
                                collateralBalance={collateralBalance}
                                setCollateralBalance={setCollateralBalance}
                                loan={borrow}
                                borrowIds={borrowIds}
                                BorrowBalance={borrowAmount}
                                allSplit={allSplit}
                                buttonText="Actions"
                                height={"2rem"}
                                fontSize={"12px"}
                                padding="6px 12px"
                                border="1px solid #BDBFC1"
                                bgColor="#101216"
                                _hover={{ bg: "white", color: "black" }}
                                borderRadius={"6px"}
                                color="#BDBFC1;"
                                borrowAPRs={borrowAPRs}
                                borrow={borrow}
                                spendType={currentSpendStatus}
                                setSpendType={setCurrentSpendStatus}
                              /> */}
                          </Box>
                        </Box>
                      </Td>
                    </Tr>

                    <Tr
                      style={{
                        position: "absolute",
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
            color="#F0F0F5"
          >
            <Box mt="0.1rem" mr="0.7rem" cursor="pointer">
              <TableInfoIcon />
            </Box>
            To access the Degen page, please add more supplies as your current value is
        less than $1000. 
            <Box
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
          </Box>
        </Box>
      )}
    </>
  );
};

export default DegenDashboard;
