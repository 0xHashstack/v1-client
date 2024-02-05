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
  Tooltip,
  Button,
  Radio,
} from "@chakra-ui/react";

import Image from "next/image";
import YourBorrowModal from "@/components/modals/yourBorrowModal";
import { Coins } from "../dashboardLeft";
import BorrowModal from "@/components/modals/borrowModal";
import { ILoan } from "@/Blockchain/interfaces/interfaces";
import { getProtocolStats } from "@/Blockchain/scripts/protocolStats";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAprAndHealthFactor,
  selectEffectiveApr,
  selectHealthFactor,
  selectJediswapPoolAprs,
  selectOraclePrices,
  selectProtocolStats,
  selectUserLoans,
  setNetAprLoans,
} from "@/store/slices/readDataSlice";
import { effectivAPRLoan } from "@/Blockchain/scripts/userStats";
import { getExistingLoanHealth } from "@/Blockchain/scripts/LoanHealth";
import { getJediEstimatedLiqALiqBfromLp, getMySwapEstimatedLiqALiqBfromLp } from "@/Blockchain/scripts/l3interaction";
import {
  getTokenFromAddress,
  tokenAddressMap,
} from "@/Blockchain/utils/addressServices";
import numberFormatter from "@/utils/functions/numberFormatter";
import { BNtoNum } from "@/Blockchain/utils/utils";
import { processAddress } from "@/Blockchain/stark-constants";
import TableInfoIcon from "../table/tableIcons/infoIcon";
import TableClose from "../table/tableIcons/close";
import { setCurrentPage } from "@/store/slices/userAccountSlice";
import numberFormatterPercentage from "@/utils/functions/numberFormatterPercentage";
import useStakeRequest from "@/Blockchain/hooks/Writes/useStakerequest";
import { selectUserDeposits } from "@/store/slices/readDataSlice";
import { useAccount } from "@starknet-react/core";
import ExpandedCoinIcon from "@/assets/expanded/ExpandedCoins";
import ExpandedMarketIcon from "@/assets/expanded/ExpandedMarket";
import LowhealthFactor from "@/assets/icons/lowhealthFactor";
import MediumHeathFactor from "@/assets/icons/mediumHeathFactor";
import dollarConvertor from "@/utils/functions/dollarConvertor";
import DollarActiveRadioButton from "@/assets/icons/dollarActiveRadioButton";
import DollarNonActiveRadioButton from "@/assets/icons/dollarNonActiveRadioButton";
import posthog from "posthog-js";
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
  setCurrentPagination,
  Coins,
  columnItems,
}: // userLoans,
  {
    width: string;
    currentPagination: any;
    setCurrentPagination: any;
    Coins: any;
    columnItems: any;
    Borrows: ILoan[];
    userLoans: any;
    // columnItems: Array<Array<string>>;
    // gap: string;
    // rowItems: any;
  }) => {
  ////console.log(Borrows, "Borrow loans in borrow dashboard");
  const Borrows = useSelector(selectUserLoans);
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
  const [validRTokens, setValidRTokens] = useState([]);
  const [collateralBalance, setCollateralBalance] = useState("123 eth");
  const [currentSpendStatus, setCurrentSpendStatus] = useState("");
  const [currentLoanAmount, setCurrentLoanAmount] = useState("");
  const [currentLoanMarket, setCurrentLoanMarket] = useState("");
  const [allSplit, setAllSplit] = useState<any>([]);


  const [currentSplitIndex, setCurrentSplitIndex] = useState(0);
  // const avgs = useSelector(selectAprAndHealthFactor);
  const [showEmptyNotification, setShowEmptyNotification] = useState(true);
  const avgs = useSelector(selectEffectiveApr);
  const [coinPassed, setCoinPassed] = useState({
    name: "BTC",
    icon: "mdi-bitcoin",
    symbol: "WBTC",
  });
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
          spendType: Borrows[i].spendType,
        });
        temp2.push(Borrows[i].loanId);
      }
    }
    setBorrowIDCoinMap(temp1);
    setBorrowIds(temp2);
    // if (Borrows && upper_bound > lower_bound && currentPagination > 1) {
    //   setCurrentPagination(currentPagination - 1);
    // }
  }, [Borrows]);
  const { account, address } = useAccount();
  const userDeposits = useSelector(selectUserDeposits);
  const fetchUserDeposits = async () => {
    try {
      if (!account || userDeposits?.length <= 0) return;
      // const reserves = await getUserDeposits(address as string);
      const reserves = userDeposits;
      ////console.log("got reservers", reserves);

      const rTokens: any = [];
      if (reserves) {
        reserves.map((reserve: any) => {
          if (reserve.rTokenFreeParsed > 0) {
            rTokens.push({
              rToken: reserve.rToken,
              rTokenAmount: reserve.rTokenFreeParsed,
            });
          }
        });
      }
      ////console.log("rtokens", rTokens);
      if (rTokens.length === 0) return;
      setValidRTokens(rTokens);
      ////console.log("valid rtoken", validRTokens);
      ////console.log("market page -user supply", reserves);
    } catch (err) {
      ////console.log("Error fetching protocol reserves", err);
    }
  };
  useEffect(() => {
    if (validRTokens.length === 0) {
      fetchUserDeposits();
    }
  }, [userDeposits, validRTokens, address]);
  const [loading, setLoading] = useState(true);
  // const loadingTimeout = useTimeout(() => setLoading(false), 1800);

  const reduxProtocolStats = useSelector(selectProtocolStats);
  const oraclePrices = useSelector(selectOraclePrices);

  // useEffect(() => {
  //   const fetchAprs = async () => {
  //     if (avgs?.length == 0) {
  //       for (var i = 0; i < userLoans?.length; i++) {
  //         const avg = await effectivAPRLoan(
  //           userLoans[i],
  //           reduxProtocolStats,
  //           oraclePrices
  //         );
  //         const healthFactor = await getExistingLoanHealth(
  //           userLoans[i]?.loanId
  //         );
  //         const data = {
  //           loanId: userLoans[i]?.loanId,
  //           avg: avg,
  //           loanHealth: healthFactor,
  //         };
  //         // avgs.push(data)
  //         avgsData.push(data);
  //         // avgs.push()
  //       }
  //       //cc
  //       setAvgs(avgsData);
  //     }
  //   };
  //   if (oraclePrices && reduxProtocolStats && userLoans) fetchAprs();
  //  //console.log("running");
  // }, [oraclePrices, reduxProtocolStats, userLoans]);
  const avgsLoneHealth = useSelector(selectHealthFactor);
  const getSplit = async () => {
    let temp: any = [];
    const promises = [];
    for (let i = 0; i < Borrows?.length; i++) {
      if (Borrows[i]?.spendType === "LIQUIDITY") {

        // if(Borrows[i]?.l3App=="J"){

        // }
        // if(Borrows[i]?.l3App){

        // }
        //console.log(Borrows[i]?.l3App, "app")
        if (Borrows[i]?.l3App == "JEDI_SWAP") {
          const data = getJediEstimatedLiqALiqBfromLp(
            Borrows[i]?.currentLoanAmount,
            Borrows[i]?.loanId,
            Borrows[i]?.currentLoanMarketAddress,
            Borrows[i]?.loanMarket
          );
          promises.push(data);
        } else if (Borrows[i]?.l3App == "MY_SWAP") {
          const data = getMySwapEstimatedLiqALiqBfromLp(
            Borrows[i]?.currentLoanAmount,
            Borrows[i]?.loanId,
            Borrows[i]?.currentLoanMarketAddress,
            Borrows[i]?.loanMarket
          );
          promises.push(data);
        }

        ////console.log(
        //   getTokenFromAddress(processAddress(data?.tokenAAddress)),
        //   "all split amount - ",
        //   // parseInt(Borrows[i]?.currentLoanAmount),
        //   Borrows[i]?.currentLoanMarketAddress,
        //   Borrows[i]?.loanId,

        //   " res -",
        //   data
        // );


        // if (data) {
        //   temp.push({
        //     ...data,
        //     tokenA: getTokenFromAddress(processAddress(data?.tokenAAddress))
        //       ?.name,
        //     tokenB: getTokenFromAddress(processAddress(data?.tokenBAddress))
        //       ?.name,
        //     loanId: Borrows[i]?.loanId,
        //   });
        // } else {
        //   temp.push("empty");
        // }
      } else {
        promises.push(Promise.resolve(null));
        // temp.push("empty");
      }
    }
    Promise.allSettled([...promises]).then((val) => {
      ////console.log("promises here ", val);
      temp = val.map((data, i) => {
        if (data && data?.status == "fulfilled" && data?.value) {
          return {
            ...data?.value,
            tokenA: getTokenFromAddress(
              processAddress(data?.value?.tokenAAddress)
            )?.name,
            tokenB: getTokenFromAddress(
              processAddress(data?.value?.tokenBAddress)
            )?.name,
            loanId: Borrows[i]?.loanId,
          };
        } else {
          return "empty";
        }
      });
      ////console.log("promises heree ", promises);
      setAllSplit(temp);
    });
    // const currentSplit = await getJediEstimatedLiqALiqBfromLp(
    //   liquidity,
    //   pairAddress
    // );
    ////console.log("liquidity split - ", currentSplit);
    // return "Pending";
  };

  // useEffect(() => {
  //   getSplit(
  //     468857759897,
  //     "0x62b1cd273ce4c7967988776fad2a7bbcb21e2b544a111cb48487315810f7f51"
  //   );
  // }, []);

  useEffect(() => {
    if (Borrows) {
      getSplit();
    }
  }, [Borrows]);

  useEffect(() => {
    ////console.log("Borrows here - ", Borrows);
    if (Borrows || Borrows?.length > 0) {
      setLoading(false);
    }
  }, [Borrows]);

  const [borrowAPRs, setBorrowAPRs] = useState<(number | undefined)[]>([]);
  const [statusHoverIndex, setStatusHoverIndex] = useState("-1");

  const stats = useSelector(selectProtocolStats);
  const handleStatusHover = (idx: string) => {


    setStatusHoverIndex(idx);


  };

  const handleStatusHoverLeave = () => {
    setStatusHoverIndex("-1");

    // setStatusHoverIndex("-1");
  };
  useEffect(() => {
    fetchProtocolStats();
  }, [stats]);

  // useEffect(() => {
  //   try {
  //     const fetchJediEstimatedLiqALiqBfromLp = async () => {
  //       const data = await getJediEstimatedLiqALiqBfromLp(0.95946, "USDC");
  //      //console.log("fetchJediEstimatedLiqALiqBfromLp ", data);
  //     };
  //     fetchJediEstimatedLiqALiqBfromLp();
  //   } catch (err) {}
  // }, []);

  const [currentBorrowAPR, setCurrentBorrowAPR] = useState<Number>(2);
  const [dollarConversions, setDollarConversions] = useState(false)
  const fetchProtocolStats = async () => {
    try {
      ////console.log("fetchprotocolstats", stats); //23014
      setBorrowAPRs([
        stats?.[2].borrowRate,
        stats?.[3].borrowRate,
        stats?.[0].borrowRate,
        stats?.[1].borrowRate,
        stats?.[4].borrowRate,
      ]);
    } catch (error) {
      //console.log("error on getting protocol stats");
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
  const poolAprs = useSelector(selectJediswapPoolAprs);
  const dispatch = useDispatch();
  const getAprByPool = (dataArray: any[], pool: string, l3App: string) => {
    const matchedObject = dataArray.find(item => {
      if (item.name === "USDT/USDC") {
        return item.amm === "jedi" && ("USDC/USDT" === pool);
      } else if (item.name === "ETH/DAI") {
        return item.amm === "jedi" && ("DAI/ETH" === pool);
      }
      else {
        return item.name === pool && item.amm === (l3App == "JEDI_SWAP" ? "jedi" : "myswap");
      }
    });
    return matchedObject ? matchedObject.apr * 100 : 0;
  };
  useEffect(() => {
    let netApr: number = 0;
    if (Borrows?.length > 0 && avgs) {
      Borrows.map((borrow: any, idx: any) => {
        let aprs = borrow?.spendType == "LIQUIDITY" ? (Number(
          avgs?.find(
            (item: any) => item?.loanId == borrow?.loanId
          )?.avg
        ) + (getAprByPool(poolAprs, allSplit?.[lower_bound + idx]?.tokenA + "/" + allSplit?.[lower_bound + idx]?.tokenB, borrow?.l3App) * (dollarConvertor(allSplit?.[lower_bound + idx]?.amountA, allSplit?.[lower_bound + idx]?.tokenA, oraclePrices) + dollarConvertor(allSplit?.[lower_bound + idx]?.amountB, allSplit?.[lower_bound + idx]?.tokenB, oraclePrices)) / dollarConvertor(borrow?.collateralAmountParsed, borrow?.collateralMarket.slice(1), oraclePrices) * reduxProtocolStats?.find(
          (val: any) => val?.token == borrow?.collateralMarket.slice(1)
        )?.exchangeRateRtokenToUnderlying)) : Number(
          avgs?.find(
            (item: any) => item?.loanId == borrow?.loanId
          )?.avg
        )
        netApr = netApr + aprs;
      });
      if (netApr != 0) {
        if(isNaN(netApr/Borrows?.length)){
          // dispatch(setNetAprLoans(0))
        }else{
          dispatch(setNetAprLoans((netApr / Borrows?.length).toFixed(2)))
        }
      }
    }else if(Borrows?.length==0){
        dispatch(setNetAprLoans(0))
    }
  }, [avgs, poolAprs, Borrows,allSplit])
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

  ////console.log("Borrows", loading, Borrows);
  return loading ? (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="95%"
        height={"37rem"}
        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30)) "
        // height="552px"
        bg={" var(--surface-of-10, rgba(103, 109, 154, 0.10)); "}
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
    <Box
      bg="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
      color="white"
      borderRadius="md"
      w={width}
      display="flex"
      flexDirection="column"
      // bgColor={"red"}
      // height={"100%"}
      height={"40rem"}
      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30)) "
      padding={"1rem 2rem 0rem"}
      overflowX="hidden"
    >
      <Box
        width="100%"
        display="flex"
        justifyContent="flex-end"
      >
        <Box
          mr="0.3rem"
          mt="0.09rem"
          cursor="pointer"
          onClick={() => {
            setDollarConversions(!dollarConversions)
          }}
        >
          {dollarConversions == true ? <DollarActiveRadioButton /> : <DollarNonActiveRadioButton />}
        </Box>
        <Text
          color="#F0F0F5"
          fontSize="14px"
          fontStyle='normal'
          fontWeight="400"
          lineHeight="20px"
          letterSpacing="-0.15px"
        >
          Convert to Dollar value
        </Text>
      </Box>

      <TableContainer
        // background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
        // bg="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
        bg="transparent"
        color="white"
        borderRadius="md"
        w="100%"
        display="flex"
        justifyContent="flex-start"
        alignItems="flex-start"
        // bgColor={"red"}
        // height={"100%"}
        height={"37rem"}
        // border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30)) "
        // padding={"1rem 2rem 0rem"}

        overflow="none"
      // mt={"3rem"}
      >
        <Table
          variant="unstyled"
          width="100%"
          height="100%"
          mb="0.5rem"
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
                      idx1 == 0 || idx1 == 1
                        ? "left"
                        : idx1 == columnItems?.length - 1
                          ? "right"
                          : "center"
                    }
                    pl={idx1 == 0 ? 2 : idx1 == 1 ? "24%  " : 0}
                    pr={idx1 == columnItems.length - 1 ? 5 : 0}
                    color={"#BDBFC1"}
                    cursor="context-menu"
                  >
                    <Tooltip
                      hasArrow
                      label={tooltips[idx1]}
                      // arrowPadding={-5420}
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
                    // cursor="context-menu"
                    // marginRight={idx1 === 1 ? "52px" : ""}
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
            {Borrows?.slice(lower_bound, upper_bound + 1).map(
              (borrow: any, idx: any) => {
                // let aprs=borrow?.spendType== "LIQUIDITY" ?(Number(
                //   avgs?.find(
                //     (item: any) => item?.loanId == borrow?.loanId
                //   )?.avg
                // )-(getAprByPool(poolAprs,allSplit?.[lower_bound + idx]?.tokenA+"/"+allSplit?.[lower_bound + idx]?.tokenB,borrow?.l3App)*(dollarConvertor(allSplit?.[lower_bound + idx]?.amountA, allSplit?.[lower_bound + idx]?.tokenA, oraclePrices) + dollarConvertor(allSplit?.[lower_bound + idx]?.amountB, allSplit?.[lower_bound + idx]?.tokenB, oraclePrices))/dollarConvertor(borrow?.collateralAmountParsed, borrow?.collateralMarket.slice(1), oraclePrices) * reduxProtocolStats?.find(
                //   (val: any) => val?.token == borrow?.collateralMarket.slice(1)
                // )?.exchangeRateRtokenToUnderlying)):Number(
                //   avgs?.find(
                //     (item: any) => item?.loanId == borrow?.loanId
                //   )?.avg
                // )
                // netApr=netApr+aprs;
                // dispatch(setNetAprLoans(netApr))
                // borrowIDCoinMap.push([coin.id, coin?.name]);
                return (
                  <>
                    <Tr
                      key={lower_bound + borrow.idx}
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
                          {`ID ${borrow?.loanId < 10
                            ? "0" + borrow?.loanId
                            : borrow?.loanId
                            }`}{" "}
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
                          pl="20%"
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
                            alignItems="flex-start"
                            height="2.5rem"
                          // bgColor="red"
                          // p={2}
                          >
                            <HStack
                              height="2rem"
                              width="2rem"
                              alignItems="center"
                              justifyContent="center"
                              pl={4}
                            >
                              <Image
                                // src={`./BTC.svg`}
                                src={`/${borrow?.loanMarket.slice(1)}.svg`}
                                alt="Picture of the author"
                                width="32"
                                height="32"
                              />
                              <Text
                                fontSize="14px"
                                fontWeight="400"
                                color="#E6EDF3"
                              >
                                {borrow?.loanMarket}
                              </Text>
                            </HStack>
                            <HStack>
                              <Text
                                fontSize="14px"
                                fontWeight="500"
                                color="#F7BB5B"
                                width="4.6rem"
                              >
                                <Text textAlign="left">
                                  <Tooltip
                                    hasArrow
                                    label={
                                      <Box>
                                        Exchange rate:  {reduxProtocolStats?.find(
                                          (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                        )?.exchangeRateDTokenToUnderlying ?(reduxProtocolStats?.find(
                                          (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                        )?.exchangeRateDTokenToUnderlying).toFixed(4):""} {borrow?.loanMarket.slice(1)} /{borrow?.loanMarket}
                                        <br />
                                        Underlying Amount: {reduxProtocolStats?.find(
                                          (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                        )?.exchangeRateDTokenToUnderlying ? (reduxProtocolStats?.find(
                                          (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                        )?.exchangeRateDTokenToUnderlying * (borrow?.loanAmountParsed)).toFixed(4):""} {borrow?.loanMarket.slice(1)}
                                      </Box>
                                    }
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
                                    {dollarConversions == true ? "$" + numberFormatter(dollarConvertor(borrow?.loanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices) * reduxProtocolStats?.find(
                                      (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                    )?.exchangeRateDTokenToUnderlying) : numberFormatter(borrow?.loanAmountParsed)}
                                    {/* {numberFormatter(borrow?.loanAmountParsed)} */}
                                    {/* 0.04534 */}
                                  </Tooltip>
                                </Text>
                              </Text>
                            </HStack>
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
                          {!borrowAPRs ||
                            borrowAPRs.length === 0 ||
                            !getBorrowAPR(borrow.loanMarket.slice(1)) ? (
                            <Skeleton
                              width="6rem"
                              height="1.4rem"
                              startColor="#101216"
                              endColor="#2B2F35"
                              borderRadius="6px"
                            />
                          ) : (
                            -
                            numberFormatterPercentage(
                              getBorrowAPR(borrow?.loanMarket.slice(1))
                            ) + "%"
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
                        {avgs?.find(
                          (item: any) => item?.loanId == borrow?.loanId
                        )?.avg ?
                          borrow?.spendType == "LIQUIDITY" ?
                            <Text
                              width="100%"
                              height="100%"
                              display="flex"
                              color=
                              {Number(
                                avgs?.find(
                                  (item: any) => item?.loanId == borrow?.loanId
                                )?.avg
                              ) + (getAprByPool(poolAprs, allSplit?.[lower_bound + idx]?.tokenA + "/" + allSplit?.[lower_bound + idx]?.tokenB, borrow?.l3App) * (dollarConvertor(allSplit?.[lower_bound + idx]?.amountA, allSplit?.[lower_bound + idx]?.tokenA, oraclePrices) + dollarConvertor(allSplit?.[lower_bound + idx]?.amountB, allSplit?.[lower_bound + idx]?.tokenB, oraclePrices)) / dollarConvertor(borrow?.collateralAmountParsed, borrow?.collateralMarket.slice(1), oraclePrices) * reduxProtocolStats?.find(
                                (val: any) => val?.token == borrow?.collateralMarket.slice(1)
                              )?.exchangeRateRtokenToUnderlying) < 0 ? "rgb(255 94 94)" : "#00D395"}
                              alignItems="center"
                              justifyContent="center"
                              fontWeight="400"
                            // bgColor={"blue"}
                            >
                              {/* {checkGap(idx1, idx2)} */}
                              <Tooltip
                                hasArrow
                                label={
                                  <Box display="flex" flexDirection="column" justifyContent="space-between">
                                    <Box display="flex" justifyContent="space-between" gap="10px">
                                      Borrow ({((dollarConvertor(borrow?.loanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices) * (reduxProtocolStats?.find(
                                        (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                      )?.exchangeRateDTokenToUnderlying)
                                      ) / dollarConvertor(borrow?.collateralAmountParsed, borrow?.collateralMarket.slice(1), oraclePrices) * reduxProtocolStats?.find(
                                        (val: any) => val?.token == borrow?.collateralMarket.slice(1)
                                      )?.exchangeRateRtokenToUnderlying).toFixed(1)}x):
                                      <Text>
                                        -{((dollarConvertor(borrow?.loanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices) * (reduxProtocolStats?.find(
                                          (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                        )?.exchangeRateDTokenToUnderlying) *
                                          ((reduxProtocolStats?.find(
                                            (stat: any) =>
                                              stat?.token === borrow?.loanMarket.slice(1)
                                          )?.borrowRate))) / dollarConvertor(borrow?.collateralAmountParsed, borrow?.collateralMarket.slice(1), oraclePrices) * reduxProtocolStats?.find(
                                            (val: any) => val?.token == borrow?.collateralMarket.slice(1)
                                          )?.exchangeRateRtokenToUnderlying).toFixed(2)}%
                                      </Text>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between" >
                                      <Text>
                                        Pool ({((dollarConvertor(allSplit?.[lower_bound + idx]?.amountA, allSplit?.[lower_bound + idx]?.tokenA, oraclePrices) + dollarConvertor(allSplit?.[lower_bound + idx]?.amountB, allSplit?.[lower_bound + idx]?.tokenB, oraclePrices)) / dollarConvertor(borrow?.collateralAmountParsed, borrow?.collateralMarket.slice(1), oraclePrices) * reduxProtocolStats?.find(
                                          (val: any) => val?.token == borrow?.collateralMarket.slice(1)
                                        )?.exchangeRateRtokenToUnderlying).toFixed(1)}x):
                                      </Text>
                                      <Text>
                                        +{(getAprByPool(poolAprs, allSplit?.[lower_bound + idx]?.tokenA + "/" + allSplit?.[lower_bound + idx]?.tokenB, borrow?.l3App) * (dollarConvertor(allSplit?.[lower_bound + idx]?.amountA, allSplit?.[lower_bound + idx]?.tokenA, oraclePrices) + dollarConvertor(allSplit?.[lower_bound + idx]?.amountB, allSplit?.[lower_bound + idx]?.tokenB, oraclePrices)) / dollarConvertor(borrow?.collateralAmountParsed, borrow?.collateralMarket.slice(1), oraclePrices) * reduxProtocolStats?.find(
                                          (val: any) => val?.token == borrow?.collateralMarket.slice(1)
                                        )?.exchangeRateRtokenToUnderlying).toFixed(2)}%
                                      </Text>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between" mb="2">
                                      <Text>
                                        Collateral:
                                      </Text>
                                      <Text>
                                        +{
                                          reduxProtocolStats?.find(
                                            (stat: any) =>
                                              stat?.token === borrow?.collateralMarket.slice(1)
                                          )?.supplyRate}%
                                      </Text>
                                    </Box>
                                    <hr />
                                    <Box display="flex" mt="2" justifyContent="space-between" mb="2" gap="10px">
                                      <Text>
                                        Effective APR:
                                      </Text>
                                      <Text>
                                        {(Number(
                                          avgs?.find(
                                            (item: any) => item?.loanId == borrow?.loanId
                                          )?.avg
                                        ) + (getAprByPool(poolAprs, allSplit?.[lower_bound + idx]?.tokenA + "/" + allSplit?.[lower_bound + idx]?.tokenB, borrow?.l3App) * (dollarConvertor(allSplit?.[lower_bound + idx]?.amountA, allSplit?.[lower_bound + idx]?.tokenA, oraclePrices) + dollarConvertor(allSplit?.[lower_bound + idx]?.amountB, allSplit?.[lower_bound + idx]?.tokenB, oraclePrices)) / dollarConvertor(borrow?.collateralAmountParsed, borrow?.collateralMarket.slice(1), oraclePrices) * reduxProtocolStats?.find(
                                          (val: any) => val?.token == borrow?.collateralMarket.slice(1)
                                        )?.exchangeRateRtokenToUnderlying)).toFixed(2) + "%"
                                        }
                                      </Text>
                                    </Box>
                                  </Box>
                                }
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
                                {(Number(
                                  avgs?.find(
                                    (item: any) => item?.loanId == borrow?.loanId
                                  )?.avg
                                ) + (getAprByPool(poolAprs, allSplit?.[lower_bound + idx]?.tokenA + "/" + allSplit?.[lower_bound + idx]?.tokenB, borrow?.l3App) * (dollarConvertor(allSplit?.[lower_bound + idx]?.amountA, allSplit?.[lower_bound + idx]?.tokenA, oraclePrices) + dollarConvertor(allSplit?.[lower_bound + idx]?.amountB, allSplit?.[lower_bound + idx]?.tokenB, oraclePrices)) / dollarConvertor(borrow?.collateralAmountParsed, borrow?.collateralMarket.slice(1), oraclePrices) * reduxProtocolStats?.find(
                                  (val: any) => val?.token == borrow?.collateralMarket.slice(1)
                                )?.exchangeRateRtokenToUnderlying)).toFixed(3) + "%"

                                }
                              </Tooltip>
                            </Text>
                            : <Text
                              width="100%"
                              height="100%"
                              display="flex"
                              color=
                              {Number(
                                avgs?.find(
                                  (item: any) => item?.loanId == borrow?.loanId
                                )?.avg
                              ) < 0 ? "rgb(255 94 94)" : "#00D395"}
                              alignItems="center"
                              justifyContent="center"
                              fontWeight="400"
                            // bgColor={"blue"}
                            >
                              <Tooltip
                                hasArrow
                                label={
                                  <Box display="flex" flexDirection="column" justifyContent="space-between">
                                    <Box display="flex" justifyContent="space-between" gap="10px">
                                      Borrow:
                                      <Text>
                                        -{getBorrowAPR(borrow?.loanMarket.slice(1))}%
                                      </Text>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between" mb="2" gap="10px">
                                      <Text>
                                        Collateral:
                                      </Text>
                                      <Text>
                                        +{
                                          ((dollarConvertor(borrow?.collateralAmountParsed, borrow?.collateralMarket.slice(1), oraclePrices) * (reduxProtocolStats?.find(
                                            (val: any) => val?.token == borrow?.collateralMarket.slice(1)
                                          )?.exchangeRateRtokenToUnderlying) * reduxProtocolStats?.find(
                                            (stat: any) =>
                                              stat?.token === borrow?.collateralMarket.slice(1)
                                          )?.supplyRate) / dollarConvertor(borrow?.loanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices) * (reduxProtocolStats?.find(
                                            (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                          )?.exchangeRateDTokenToUnderlying)).toFixed(2)}%
                                      </Text>
                                    </Box>
                                    <hr />
                                    <Box display="flex" mt="2" justifyContent="space-between" mb="2" gap="10px">
                                      <Text>
                                        Effective APR:
                                      </Text>
                                      <Text>
                                        {Number(
                                          avgs?.find(
                                            (item: any) => item?.loanId == borrow?.loanId
                                          )?.avg
                                        )?.toFixed(2) + "%"
                                        }
                                      </Text>
                                    </Box>
                                  </Box>
                                }
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
                                {Number(
                                  avgs?.find(
                                    (item: any) => item?.loanId == borrow?.loanId
                                  )?.avg
                                )?.toFixed(3) + "%"
                                }
                              </Tooltip>
                              {/* {checkGap(idx1, idx2)} */}
                            </Text>
                          :
                          <Skeleton
                            width="6rem"
                            height="1.4rem"
                            startColor="#101216"
                            endColor="#2B2F35"
                            borderRadius="6px"
                          />
                        }

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
                          // justifyContent="flex-start"
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
                              src={`/${borrow?.collateralMarket.slice(1)}.svg`}
                              alt="Picture of the author"
                              width="32"
                              height="32"
                            />
                            <Text fontSize="14px" fontWeight="400">
                              {borrow?.collateralMarket}
                            </Text>
                          </HStack>
                          <Text
                            fontSize="14px"
                            fontWeight="500"
                            color="#F7BB5B"
                            width="4.6rem"
                          >
                            <Tooltip
                              hasArrow
                              label={
                                <Box>
                                  Exchange rate: {reduxProtocolStats?.find(
                                    (val: any) => val?.token == borrow?.collateralMarket.slice(1)
                                  )?.exchangeRateRtokenToUnderlying ?(reduxProtocolStats?.find(
                                    (val: any) => val?.token == borrow?.collateralMarket.slice(1)
                                  )?.exchangeRateRtokenToUnderlying).toFixed(4):""} {borrow?.collateralMarket.slice(1)} /{borrow?.collateralMarket}
                                  <br />
                                  Underlying Amount: {reduxProtocolStats?.find(
                                    (val: any) => val?.token == borrow?.collateralMarket.slice(1)
                                  )?.exchangeRateRtokenToUnderlying ?(reduxProtocolStats?.find(
                                    (val: any) => val?.token == borrow?.collateralMarket.slice(1)
                                  )?.exchangeRateRtokenToUnderlying * borrow?.collateralAmountParsed).toFixed(4):""} {borrow?.collateralMarket.slice(1)}
                                </Box>
                              }
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
                              <Text>
                                {dollarConversions == true ? "$" + numberFormatter(dollarConvertor(borrow?.collateralAmountParsed, borrow?.collateralMarket.slice(1), oraclePrices) * reduxProtocolStats?.find(
                                  (val: any) => val?.token == borrow?.collateralMarket.slice(1)
                                )?.exchangeRateRtokenToUnderlying
                                ) : numberFormatter(borrow?.collateralAmountParsed)}
                                {/* 10,000 */}
                              </Text>
                            </Tooltip>
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
                            <HStack
                              height="50%"
                              width="150%"
                              alignItems="center"
                              onMouseEnter={() => handleStatusHover("0" + idx)}
                              onMouseLeave={() => handleStatusHoverLeave()}
                              _hover={{ cursor: "pointer" }}
                              justifyContent="center"
                            // gap={0.2}
                            >
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
                                {/* <Text>{idx}</Text> */}
                                <Box
                                  onMouseEnter={() => handleStatusHover("3" + idx)}
                                  onMouseLeave={() => handleStatusHoverLeave()}
                                  _hover={{ cursor: "pointer" }}

                                  display="flex"
                                  gap={0.5}
                                  minWidth={"16px"}
                                // bgColor={"blue"}
                                >
                                  {statusHoverIndex != "3" + idx ? (
                                    // <Box minWidth={"16px"}>
                                    <Image
                                      src={`/${borrow.currentLoanMarket}.svg`}
                                      alt="Picture of the author"
                                      width="16"
                                      height="16"
                                    />
                                    // </Box>
                                  ) : (
                                    <ExpandedCoinIcon asset={borrow.currentLoanMarket} />
                                  )}
                                </Box>
                                {/* <Box
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
                              src={`/${borrow.currentLoanMarket}.svg`}
                              alt="Picture of the author"
                              width="16"
                              height="16"
                            />
                          </Box> */}
                              </Box>
                              <Text fontSize="14px" fontWeight="400">
                                {dollarConversions == true ? "$" + numberFormatter(dollarConvertor(borrow?.currentLoanAmountParsed, borrow.currentLoanMarket, oraclePrices)) :
                                  numberFormatter(borrow?.currentLoanAmountParsed)
                                }
                              </Text>
                            </HStack>
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
                              width="150%"
                              alignItems="center"
                              onMouseEnter={() => handleStatusHover("0" + idx)}
                              onMouseLeave={() => handleStatusHoverLeave()}
                              _hover={{ cursor: "pointer" }}
                              justifyContent="center"
                            // gap={0.2}
                            >
                              {statusHoverIndex != "0" + idx ? (
                                // <Box minWidth={"16px"}  maxHeight="16">
                                <Image
                                  src={`/${borrow.l3App}.svg`}
                                  alt="Picture of the author"
                                  width="16"
                                  height="16"
                                />
                                // </Box>
                              ) : (
                                < ExpandedMarketIcon asset={borrow.l3App} />

                              )}

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
                                {/* <Text>{idx}</Text> */}
                                {borrow.spendType == "LIQUIDITY" ? (
                                  allSplit?.[lower_bound + idx]?.tokenA &&
                                  allSplit?.[lower_bound + idx]?.tokenB && (
                                    <>
                                      <Box
                                        onMouseEnter={() => handleStatusHover("1" + idx)}
                                        // onMouseLeave={() => handleStatusHoverLeave()}
                                        display="flex"
                                        gap={0.5}
                                        _hover={{ cursor: "pointer" }}
                                        maxHeight="16px"
                                        minWidth={"16px"}
                                      >

                                        {statusHoverIndex != "1" + idx ? (
                                          // <Box minWidth={"16px"}  maxHeight="16px">
                                          <Image src={`/${allSplit?.[lower_bound + idx]?.tokenA}.svg`}
                                            alt="Picture of the author"
                                            width="16"
                                            height="16"
                                          />
                                          // </Box>
                                        ) : (
                                          <ExpandedCoinIcon asset={allSplit?.[lower_bound + idx]?.tokenA} />
                                        )}
                                      </Box>
                                      <Box
                                        onMouseEnter={() => handleStatusHover("2" + idx)}
                                        onMouseLeave={() => handleStatusHoverLeave()}
                                        display="flex"
                                        gap={0.5}
                                        _hover={{ cursor: "pointer" }}

                                        minWidth={"16px"}
                                      >

                                        {statusHoverIndex != "2" + idx ? (
                                          // <Box minWidth={"16px"}>
                                          <Image src={`/${allSplit?.[lower_bound + idx]?.tokenB
                                            }.svg`}
                                            alt="Picture of the author"
                                            width="16"
                                            height="16"
                                          />
                                          // </Box>
                                        ) : (
                                          <ExpandedCoinIcon asset={allSplit?.[lower_bound + idx]?.tokenB} />
                                        )}
                                      </Box>
                                    </>
                                  )
                                ) : (
                                  <Box
                                    onMouseEnter={() => handleStatusHover("3" + idx)}
                                    onMouseLeave={() => handleStatusHoverLeave()}
                                    _hover={{ cursor: "pointer" }}

                                    display="flex"
                                    gap={0.5}
                                    minWidth={"16px"}
                                  // bgColor={"blue"}
                                  >
                                    {statusHoverIndex != "3" + idx ? (
                                      // <Box minWidth={"16px"}>
                                      <Image
                                        src={`/${borrow.currentLoanMarket}.svg`}
                                        alt="Picture of the author"
                                        width="16"
                                        height="16"
                                      />
                                      // </Box>
                                    ) : (
                                      <ExpandedCoinIcon asset={borrow.currentLoanMarket} />
                                    )}
                                  </Box>
                                )}
                                {/* <Box
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
                                  src={`/${borrow.currentLoanMarket}.svg`}
                                  alt="Picture of the author"
                                  width="16"
                                  height="16"
                                />
                              </Box> */}
                              </Box>
                              <Text fontSize="14px" fontWeight="400">
                                {borrow.spendType == "LIQUIDITY" ? (
                                  allSplit.length === 0 ? (
                                    <Skeleton
                                      width="6rem"
                                      height="1.2rem"
                                      startColor="#101216"
                                      endColor="#2B2F35"
                                      borderRadius="6px"
                                    />
                                  ) : allSplit[lower_bound + idx] === "empty" ? (
                                    "-"
                                  ) : (
                                    dollarConversions == true ? "$" +
                                      numberFormatter(dollarConvertor(allSplit?.[lower_bound + idx]?.amountA, allSplit?.[lower_bound + idx]?.tokenA, oraclePrices))
                                      +
                                      "/$" +
                                      numberFormatter(dollarConvertor(allSplit?.[lower_bound + idx]?.amountB, allSplit?.[lower_bound + idx]?.tokenB, oraclePrices))
                                      :
                                      numberFormatter(
                                        allSplit?.[lower_bound + idx]?.amountA
                                      ) +
                                      "/" + numberFormatter(
                                        allSplit[lower_bound + idx]?.amountB
                                      )

                                  )
                                ) : (
                                  dollarConversions == true ? "$" + numberFormatter(dollarConvertor(borrow?.currentLoanAmountParsed, borrow.currentLoanMarket, oraclePrices)) :
                                    numberFormatter(borrow?.currentLoanAmountParsed)
                                )}
                              </Text>
                            </HStack>
                          </Box>
                        )}
                      </Td>
                      <Td>
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
                          <Tooltip
                            hasArrow
                            label={
                              <Box>
                                Return:{borrow.spendType == "UNSPENT" ? dollarConvertor(borrow.currentLoanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices) -
                                  (reduxProtocolStats?.find(
                                    (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                  )?.exchangeRateDTokenToUnderlying *
                                    dollarConvertor(borrow.loanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices)) >= 0 ? "$" : "-$" :
                                  borrow.spendType == "LIQUIDITY" ? (dollarConvertor(allSplit?.[lower_bound + idx]?.amountA, allSplit?.[lower_bound + idx]?.tokenA, oraclePrices) + dollarConvertor(allSplit?.[lower_bound + idx]?.amountB, allSplit?.[lower_bound + idx]?.tokenB, oraclePrices)) - dollarConvertor(borrow.loanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices) * reduxProtocolStats?.find(
                                    (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                  )?.exchangeRateDTokenToUnderlying >= 0 ? "$" : "-$" :
                                    borrow.spendType == "SWAP" ? dollarConvertor(borrow.currentLoanAmountParsed, borrow?.currentLoanMarket, oraclePrices) - dollarConvertor(borrow.loanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices) * reduxProtocolStats?.find(
                                      (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                    )?.exchangeRateDTokenToUnderlying >= 0 ? "$" : "-$" : ""}
                                {borrow.spendType == "UNSPENT" ?
                                  numberFormatter(Math.abs(dollarConvertor(borrow.currentLoanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices) -
                                    (reduxProtocolStats?.find(
                                      (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                    )?.exchangeRateDTokenToUnderlying *
                                      dollarConvertor(borrow.loanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices)))) : borrow.spendType == "LIQUIDITY" ? numberFormatter(Math.abs(dollarConvertor(borrow.loanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices) * reduxProtocolStats?.find(
                                        (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                      )?.exchangeRateDTokenToUnderlying - (dollarConvertor(allSplit?.[lower_bound + idx]?.amountA, allSplit?.[lower_bound + idx]?.tokenA, oraclePrices) + dollarConvertor(allSplit?.[lower_bound + idx]?.amountB, allSplit?.[lower_bound + idx]?.tokenB, oraclePrices)))) : borrow.spendType == "SWAP" ? numberFormatter(Math.abs(dollarConvertor(borrow.loanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices) * reduxProtocolStats?.find(
                                        (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                      )?.exchangeRateDTokenToUnderlying - dollarConvertor(borrow.currentLoanAmountParsed, borrow?.currentLoanMarket, oraclePrices))) : ""}
                              </Box>
                            }
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
                              color={borrow?.spendType == "UNSPENT" ? dollarConvertor(borrow.currentLoanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices) -
                                (reduxProtocolStats?.find(
                                  (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                )?.exchangeRateDTokenToUnderlying *
                                  dollarConvertor(borrow.loanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices)) >= 0 ? "#00D395" : "rgb(255 94 94)" : borrow?.spendType == "LIQUIDITY" ?
                                (dollarConvertor(allSplit?.[lower_bound + idx]?.amountA, allSplit?.[lower_bound + idx]?.tokenA, oraclePrices) + dollarConvertor(allSplit?.[lower_bound + idx]?.amountB, allSplit?.[lower_bound + idx]?.tokenB, oraclePrices)) - dollarConvertor(borrow.loanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices) * reduxProtocolStats?.find(
                                  (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                )?.exchangeRateDTokenToUnderlying >= 0 ? "#00D395" : "rgb(255 94 94)" : borrow.spendType == "SWAP" ? dollarConvertor(borrow.currentLoanAmountParsed, borrow?.currentLoanMarket, oraclePrices) - dollarConvertor(borrow.loanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices) * reduxProtocolStats?.find(
                                  (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                )?.exchangeRateDTokenToUnderlying >= 0 ? "#00D395" : "rgb(255 94 94)" : ""}
                            >
                              {borrow.spendType == "UNSPENT" ? dollarConvertor(borrow.currentLoanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices) -
                                (reduxProtocolStats?.find(
                                  (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                )?.exchangeRateDTokenToUnderlying *
                                  dollarConvertor(borrow.loanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices)) >= 0 ? "+" : "-" :
                                borrow.spendType == "LIQUIDITY" ? (dollarConvertor(allSplit?.[lower_bound + idx]?.amountA, allSplit?.[lower_bound + idx]?.tokenA, oraclePrices) + dollarConvertor(allSplit?.[lower_bound + idx]?.amountB, allSplit?.[lower_bound + idx]?.tokenB, oraclePrices)) - dollarConvertor(borrow.loanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices) * reduxProtocolStats?.find(
                                  (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                )?.exchangeRateDTokenToUnderlying >= 0 ? "+" : "-" :
                                  borrow.spendType == "SWAP" ? dollarConvertor(borrow.currentLoanAmountParsed, borrow?.currentLoanMarket, oraclePrices) - dollarConvertor(borrow.loanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices) * reduxProtocolStats?.find(
                                    (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                  )?.exchangeRateDTokenToUnderlying >= 0 ? "+" : "-" : ""}
                              {borrow.spendType == "UNSPENT" ?
                                numberFormatterPercentage(100 * (Math.abs(dollarConvertor(borrow.currentLoanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices) -
                                  (reduxProtocolStats?.find(
                                    (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                  )?.exchangeRateDTokenToUnderlying *
                                    dollarConvertor(borrow.loanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices)))) / dollarConvertor(borrow?.collateralAmountParsed, borrow?.collateralMarket.slice(1), oraclePrices)) : borrow.spendType == "LIQUIDITY" ? numberFormatterPercentage(100 * (Math.abs(dollarConvertor(borrow.loanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices) * reduxProtocolStats?.find(
                                      (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                    )?.exchangeRateDTokenToUnderlying - (dollarConvertor(allSplit?.[lower_bound + idx]?.amountA, allSplit?.[lower_bound + idx]?.tokenA, oraclePrices) + dollarConvertor(allSplit?.[lower_bound + idx]?.amountB, allSplit?.[lower_bound + idx]?.tokenB, oraclePrices)))) / dollarConvertor(borrow?.collateralAmountParsed, borrow?.collateralMarket.slice(1), oraclePrices)) : borrow.spendType == "SWAP" ? numberFormatterPercentage(100 * (Math.abs(dollarConvertor(borrow.loanAmountParsed, borrow?.loanMarket.slice(1), oraclePrices) * reduxProtocolStats?.find(
                                      (val: any) => val?.token == borrow?.loanMarket.slice(1)
                                    )?.exchangeRateDTokenToUnderlying - dollarConvertor(borrow.currentLoanAmountParsed, borrow?.currentLoanMarket, oraclePrices))) / dollarConvertor(borrow?.collateralAmountParsed, borrow?.collateralMarket.slice(1), oraclePrices)) : ""}
                              %
                            </Text>
                          </Tooltip>
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
                        <Box
                          height="100%"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Tooltip
                            hasArrow
                            label={
                              <Box>
                                Health Factor : {avgsLoneHealth?.find(
                                  (item: any) =>
                                    item?.loanId == borrow?.loanId
                                )?.loanHealth}
                                <br />
                                Liquidates below : 1.06
                              </Box>
                            }
                            // arrowPadding={-5420}
                            placement="bottom"
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
                            {avgsLoneHealth?.find(
                              (item: any) => item?.loanId == borrow?.loanId
                            )?.loanHealth
                              ?
                              (avgsLoneHealth?.find(
                                (item: any) =>
                                  item?.loanId == borrow?.loanId
                              )?.loanHealth) > 1.15 ?
                                <Box
                                  width="68px"
                                  height="10px"
                                  // pl="45%"
                                  fontWeight="400"
                                  borderRadius="100px"
                                  background="linear-gradient(90deg, #00D395 78.68%, #D97008 389.71%, #CF222E 498.53%)"
                                >
                                  {/* {checkGap(idx1, idx2)} */}
                                </Box>
                                : (avgsLoneHealth?.find((item: any) => item?.loanId === borrow?.loanId)?.loanHealth > 1.09 &&
                                  avgsLoneHealth?.find((item: any) => item?.loanId === borrow?.loanId)?.loanHealth <= 1.15) ?
                                  <Box>
                                    <MediumHeathFactor />
                                  </Box>
                                  :
                                  <Box>
                                    <LowhealthFactor />
                                  </Box>
                              : <Skeleton
                                width="6rem"
                                height="1.2rem"
                                startColor="#101216"
                                endColor="#2B2F35"
                                borderRadius="6px"
                              />}
                          </Tooltip>
                        </Box>
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
                          // pr={6}
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
                            posthog.capture(
                              "Your Borrow Actions Clicked",
                              {
                                Clicked: true,
                              }
                            );
                            setCurrentSpendStatus(borrow.spendType);
                            setCurrentLoanAmount(borrow?.currentLoanAmount);
                            setCurrentLoanMarket(borrow?.currentLoanMarket);
                          }}
                        // bgColor={"blue"}
                        >
                          <Box>

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
                              currentLoanAmount={currentLoanAmount}
                              currentLoanAmountParsed={borrow?.currentLoanAmountParsed}
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
                            />
                          </Box>
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
          // textAlign="center"
          >
            <Box mt="0.1rem" mr="0.7rem" cursor="pointer">
              <TableInfoIcon />
            </Box>
            You do not have active borrow.
            <Box
              // ml="1"
              mr="1"
              as="span"
              textDecoration="underline"
              color="#0C6AD9"
              cursor="pointer"
            >
              <BorrowModal
                buttonText="Click here to borrow"
                variant="link"
                fontSize="16px"
                fontWeight="400"
                display="inline"
                color="#4D59E8"
                cursor="pointer"
                ml="0.3rem"
                lineHeight="22px"
                backGroundOverLay={"rgba(244, 242, 255, 0.5);"}
                borrowAPRs={borrowAPRs}
                currentBorrowAPR={currentBorrowAPR}
                validRTokens={validRTokens}
                setCurrentBorrowAPR={setCurrentBorrowAPR}
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
      </Box> */}
    </>
  );
};

export default BorrowDashboard;
