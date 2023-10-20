
import Image from "next/image";
import BorrowDashboard from "@/components/layouts/borrowDashboard";
import MarketDashboard from "@/components/layouts/marketDashboard";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Tooltip,
    Box,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Td,
    TableContainer,
    TabList,
    Tab,
    TabPanel,
    Tabs,
    TabPanels,
    RadioGroup,
    Radio,
    NumberInput,
    Slider,
    SliderMark,
    SliderTrack,
    SliderThumb,
    SliderFilledTrack,
    NumberInputField,

    Card,
    ModalHeader,
    Skeleton,
    InputGroup,
    InputLeftAddon,
    Input,
    Flex,
} from "@chakra-ui/react";
import NavButtons from "@/components/layouts/navButtons";
import Navbar from "@/components/layouts/navbar/Navbar";
import { Stack } from "@chakra-ui/react";
import StatsBoard from "@/components/layouts/statsBoard";
import LatestSyncedBlock from "@/components/uiElements/latestSyncedBlock";
import Pagination from "@/components/uiElements/pagination";
import YourBorrowModal from "@/components/modals/yourBorrowModal";
import React, { useEffect, useState } from "react";
import { HStack, VStack } from "@chakra-ui/react";
import PageCard from "@/components/layouts/pageCard";
import { Coins } from "@/utils/constants/coin";
import { useDispatch, useSelector } from "react-redux";
import { useAccount, useConnectors } from "@starknet-react/core";
import { selectYourBorrow, selectNetAPR } from "@/store/slices/readDataSlice";
import { setUserLoans, selectUserLoans } from "@/store/slices/readDataSlice";
import { getUserLoans } from "@/Blockchain/scripts/Loans";
import { ILoan } from "@/Blockchain/interfaces/interfaces";
import numberFormatter from "@/utils/functions/numberFormatter";
import useDataLoader from "@/hooks/useDataLoader";
import LeaderboardDashboard from "@/components/layouts/leaderboardDashboard";
import PersonalStatsDashboard from "@/components/layouts/personalStatsDashboard";
const Referal = () => {
  const [currentPagination, setCurrentPagination] = useState<number>(1);
  const columnItems = [
    "User Action",
    "direct user",
    "If Referred (U1)",
    "If Referred (U2)",
  ];
  const tooltips = [
    "Available markets.",
    "Market value of the token",
    "The number of tokens that currently exists in the protocol.",
    "Annual interest rate earned on supplied funds.",
  ];
  const columnItemsLeaderBoard = [
    "Rank",
    "Wallet",
    "Referees Liquidity",
    "Points earned",
    "Est.token earning \n $STRK",
  ];
  const columnItemsLeaderBoardReferalCampaign = [
    "Rank",
    "Wallet",
    "Liquidity Provided (in $)",
    "Points earned",
    "Est.token earning \n $HASH",
  ];
  const columnItemsPersonalStats = [
    "Liquidity Provided",
    "Referees liquidity (in $)",
    "Points earned",
    "Est.token earning \n $STRK",
  ];
  const columnItemsPersonalStatsReferalCampaign = [
    "Traders Referred",
    "Referees liquidity (in $)",
    "Points earned",
    "Est.token earning \n $HASH",
  ];
  const data = [
    { action: "Borrow", directUser: 1, u1: 0.2, referredLiq: 300000 },
  ];
  const sampleDate = [
    {
      id: 0,
      start: "1 Mar",
      end: "1 April",
      ref: 28,
      liq: 500,
      pts: 100,
      est: 232,
    },
    {
      id: 1,
      start: "1 Mar",
      end: "1 April",
      ref: 28,
      liq: 500,
      pts: 100,
      est: 232,
    },
    {
      id: 2,
      start: "1 Mar",
      end: "1 April",
      ref: 28,
      liq: 500,
      pts: 100,
      est: 232,
    },
    {
      id: 3,
      start: "1 Mar",
      end: "1 April",
      ref: 28,
      liq: 500,
      pts: 100,
      est: 232,
    },
    {
      id: 4,
      start: "1 Mar",
      end: "1 April",
      ref: 28,
      liq: 500,
      pts: 100,
      est: 232,
    },
    {
      id: 5,
      start: "1 Mar",
      end: "1 April",
      ref: 28,
      liq: 500,
      pts: 100,
      est: 232,
    },
    {
      id: 6,
      start: "1 Mar",
      end: "1 April",
      ref: 28,
      liq: 500,
      pts: 100,
      est: 232,
    },
    {
      id: 7,
      start: "1 Mar",
      end: "1 April",
      ref: 28,
      liq: 500,
      pts: 100,
      est: 232,
    },
    {
      id: 8,
      start: "1 Mar",
      end: "1 April",
      ref: 28,
      liq: 500,
      pts: 100,
      est: 232,
    },
  ];
  const sampleDataLeaderBoard = [
    {
      id: 0,
      start: "1 Mar",
      end: "1 April",
      rank: 28,
      wallet: "Braavos",
      liq: 500,
      pts: 100,
      est: 232,
    },
    {
      id: 1,
      start: "1 Mar",
      end: "1 April",
      rank: 28,
      wallet: "Braavos",
      liq: 500,
      pts: 100,
      est: 232,
    },
    {
      id: 2,
      start: "1 Mar",
      end: "1 April",
      rank: 28,
      wallet: "Braavos",
      liq: 500,
      pts: 100,
      est: 232,
    },
    {
      id: 3,
      start: "1 Mar",
      end: "1 April",
      rank: 28,
      wallet: "Braavos",
      liq: 500,
      pts: 100,
      est: 232,
    },
    {
      id: 4,
      start: "1 Mar",
      end: "1 April",
      rank: 28,
      wallet: "Braavos",
      liq: 500,
      pts: 100,
      est: 232,
    },
    {
      id: 5,
      start: "1 Mar",
      end: "1 April",
      rank: 28,
      wallet: "Braavos",
      liq: 500,
      pts: 100,
      est: 232,
    },
    {
      id: 6,
      start: "1 Mar",
      end: "1 April",
      rank: 28,
      wallet: "Braavos",
      liq: 500,
      pts: 100,
      est: 232,
    },
    {
      id: 7,
      start: "1 Mar",
      end: "1 April",
      rank: 28,
      wallet: "Braavos",
      liq: 500,
      pts: 100,
      est: 232,
    },
    {
      id: 8,
      start: "1 Mar",
      end: "1 April",
      rank: 28,
      wallet: "Braavos",
      liq: 500,
      pts: 100,
      est: 232,
    },
  ];
  const { available, disconnect, connect, connectors, refresh } =
    useConnectors();

  const dispatch = useDispatch();
  const { account, address } = useAccount();
  useDataLoader();

  const UserLoans = useSelector(selectUserLoans);
  useEffect(() => {
    // if (UserLoans) {
    //   if (UserLoans?.length <= (currentPagination - 1) * 6) {
    //     console.log("pagination", Pagination, UserLoans);
    //     if (currentPagination > 1) {
    //       setCurrentPagination(currentPagination - 1);
    //     }
    //   }
    // }
    if (sampleDate) {
      if (sampleDate.length <= (currentPagination - 1) * 6) {
        console.log("pagination", Pagination, sampleDate);
        if (currentPagination > 1) {
          setCurrentPagination(currentPagination - 1);
        }
      }
    }
  }, []);

    // useEffect(() => {
    //   const loan = async () => {
    //     try {
    //       const loans = await getUserLoans(address || "");
    //       // console.log(loans,"Loans from your borrow index page")

    //       // loans.filter(
    //       //   (loan) =>
    //       //     loan.collateralAmountParsed &&
    //       //     loan.collateralAmountParsed > 0 &&
    //       //     loan.loanAmountParsed &&
    //       //     loan.loanAmountParsed > 0
    //       // );
    //       if (loans) {
    //         setuserLoans(
    //           loans.filter(
    //             (loan) =>
    //               loan?.collateralAmountParsed &&
    //               loan?.collateralAmountParsed > 0 &&
    //               loan?.loanAmountParsed &&
    //               loan?.loanAmountParsed > 0
    //           )
    //         );
    //       }
    //       dispatch(setUserLoans(loans.filter(
    //         (loan) =>
    //           loan.collateralAmountParsed &&
    //           loan.collateralAmountParsed > 0 &&
    //           loan.loanAmountParsed &&
    //           loan.loanAmountParsed > 0
    //       )));
    //     } catch (err) {
    //       console.log("your-borrow : unable to fetch user loans");
    //     }
    //     // console.log("loans", loans);
    //   };
    //   if (account) {
    //     loan();
    //   }
    // }, [account, UserLoans]);
    const totalBorrow = useSelector(selectYourBorrow);
    const netAPR = useSelector(selectNetAPR);
    const [campaignSelected, setCampaignSelected] = useState(2);
    const [tabValue, setTabValue] = useState(1);
    const [refferal, setRefferal] = useState("xyz")
    const handleChange=(e:any)=>{
        setRefferal(e.target.value);
    }

    const handleCopyClick = async () => {
      try {
        await navigator.clipboard.writeText("https://app.hashatack.finance/r/"+refferal);
      } catch (error) {
        console.error('Failed to copy text: ', error);
      }
    };
    return (
        <PageCard pt="6.5rem">
            {/* <StatsBoard /> */}
            <HStack
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                flexDirection="column"
                width="95%"
                pr="3rem"
                mb="1rem"
                zIndex="1"
            >
                <HStack>
                    {/* <Button
            bg="transparent"
            fontStyle="normal"
            fontWeight="600"
            fontSize="14px"
            lineHeight="20px"
            alignItems="center"
            letterSpacing="-0.15px"
            padding="1.125rem 0.4rem"
            margin="2px"
            color={campaignSelected==1 ?"#fff":"#676D9A"}
            borderBottom={campaignSelected==1 ?"2px solid #4D59E8":""}
            borderRadius="0px"
            _hover={{ bg: "transparent", color: "#E6EDF3" }}
            onClick={()=>{setCampaignSelected(1)}}
          >
            Liquidity mining campaign
          </Button> */}
          <Button
            bg="transparent"
            fontStyle="normal"
            fontWeight="600"
            fontSize="14px"
            lineHeight="20px"
            alignItems="center"
            letterSpacing="-0.15px"
            padding="1.125rem 0.4rem"
            margin="2px"
            color={campaignSelected == 2 ? "#fff" : "#676D9A"}
            borderBottom={campaignSelected == 2 ? "2px solid #4D59E8" : ""}
            borderRadius="0px"
            _hover={{ bg: "transparent", color: "#E6EDF3" }}
            onClick={() => {
              setCampaignSelected(2);
            }}
          >
            Referal mining Campign
          </Button>
        </HStack>
        <HStack
          mt="2.5rem"
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          width="100%"
        >
          {campaignSelected == 1 ? (
            <Box display="flex">
              <Text
                color="#B1B0B5"
                fontSize="16px"
                fontWeight="400"
                lineHeight="20px"
                fontStyle="normal"
              >
                Liquidity mining campaign -
              </Text>
              <Text
                color="#00D395"
                fontSize="16px"
                fontStyle="normal"
                fontWeight="400"
                lineHeight="20px"
              >
                &nbsp;99 days 11 hours left
              </Text>
            </Box>
          ) : (
            <Box display="flex">
              <Text
                color="#B1B0B5"
                fontSize="16px"
                fontWeight="400"
                lineHeight="20px"
                fontStyle="normal"
              >
                Referal campaign -
              </Text>
              <Text
                color="#00D395"
                fontSize="16px"
                fontStyle="normal"
                fontWeight="400"
                lineHeight="20px"
              >
                &nbsp;99 days 11 hours left
              </Text>
            </Box>
          )}
          <HStack display="flex" justifyContent="space-between" width="100%">
            <HStack
              // width="13.5rem"
              display="flex"
              // bgColor="yellow"
              // flexGrow={1}
              p="25px 32px"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              borderRadius="8px"
              gap="7rem"
            >
              <VStack
                display="flex"
                justifyContent="center"
                alignItems="flex-start"
                gap={"6px"}
              >
                <Text color="#B1B0B5" fontSize="14px" alignItems="center">
                  Pool Reward
                </Text>
                <Text color="#e6edf3" fontSize="20px">
                  8,932.14 STRK
                </Text>
              </VStack>
              <VStack
                gap={"6px"}
                justifyContent="flex-start"
                alignItems="flex-start"
                // p="13px 25px"
              >
                <Text color="#B1B0B5" fontSize="14px" alignItems="center">
                  Points Accrued
                </Text>
                <Text color="#e6edf3" fontSize="20px">
                  5,536.83
                </Text>
              </VStack>
              <VStack
                gap={"6px"}
                justifyContent="flex-start"
                alignItems="flex-start"
                // p="13px 25px"
              >
                <Text color="#B1B0B5" fontSize="14px" alignItems="center">
                  <Tooltip
                    hasArrow
                    label="Estimated Tokens Earned"
                    // arrowPadding={-5420}
                    placement="bottom"
                    boxShadow="dark-lg"
                    bg="#010409"
                    fontSize={"13px"}
                    fontWeight={"thin"}
                    borderRadius={"lg"}
                    padding={"2"}
                    border="1px solid"
                    borderColor="#2B2F35"
                    arrowShadowColor="#2B2F35"
                    // cursor="context-menu"
                    // marginRight={idx1 === 1 ? "52px" : ""}
                    // maxW="222px"
                    // mt="28px"
                  >
                    est.tokens earned
                  </Tooltip>
                </Text>

                <Text color="#e6edf3" fontSize="20px">
                  536.83 STRK
                </Text>
              </VStack>
            </HStack>
            {campaignSelected == 1 ? (
              <HStack
                // width="13.5rem"
                display="flex"
                // bgColor="yellow"
                // flexGrow={1}
                gap="5rem"
              >
                <VStack
                  display="flex"
                  justifyContent="center"
                  alignItems="flex-start"
                  gap={"6px"}
                  p="13px 25px"
                >
                  <Text color="#B1B0B5" fontSize="14px" alignItems="center">
                    Total $ of tokens staked
                  </Text>
                  <Text color="#e6edf3" fontSize="20px">
                    5,3100.00
                  </Text>
                </VStack>
                <VStack
                  gap={"6px"}
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  // p="13px 25px"
                >
                  <Text color="#B1B0B5" fontSize="14px" alignItems="center">
                    Total $ of tokens borrowed
                  </Text>
                  <Text color="#e6edf3" fontSize="20px">
                    5,3100.00
                  </Text>
                </VStack>
              </HStack>
            ) : (
              <HStack
                // width="13.5rem"
                display="flex"
                // bgColor="yellow"
                // flexGrow={1}
                gap="5rem"
              >
                <VStack
                  display="flex"
                  justifyContent="center"
                  alignItems="flex-start"
                  gap={"6px"}
                  p="13px 25px"
                >
                  <Text color="#B1B0B5" fontSize="14px" alignItems="center">
                    Traders referred
                  </Text>
                  <Text color="#e6edf3" fontSize="20px">
                    5,310
                  </Text>
                </VStack>
                <VStack
                  gap={"6px"}
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  // p="13px 25px"
                >
                  <Text color="#B1B0B5" fontSize="14px" alignItems="center">
                    <Tooltip
                      hasArrow
                      label="Liquidity provided by traders you have referred"
                      // arrowPadding={-5420}
                      placement="bottom"
                      boxShadow="dark-lg"
                      bg="#010409"
                      fontSize={"13px"}
                      fontWeight={"thin"}
                      borderRadius={"lg"}
                      padding={"2"}
                      border="1px solid"
                      borderColor="#2B2F35"
                      arrowShadowColor="#2B2F35"
                      // cursor="context-menu"
                      // marginRight={idx1 === 1 ? "52px" : ""}
                      // maxW="222px"
                      // mt="28px"
                    >
                      Referees liquidity
                    </Tooltip>
                  </Text>
                  <Text color="#e6edf3" fontSize="20px">
                    $5,3100.00
                  </Text>
                </VStack>
                <VStack
                  gap={"6px"}
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  // p="13px 25px"
                >
                  <Text color="#B1B0B5" fontSize="14px" alignItems="center">
                    User slab
                  </Text>
                  <Text color="#e6edf3" fontSize="20px">
                    1
                  </Text>
                </VStack>
              </HStack>
            )}
          </HStack>
        </HStack>
      </HStack>

      <HStack
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        flexDirection="row"
        width="95%"
        // pr="3rem"
        mb="1rem"
        // zIndex="1"
      >
        <HStack width="53%" mt="2rem">
          <Text
            color="#B1B0B5"
            fontFamily="Inter"
            fontSize="14px"
            fontStyle="normal"
            fontWeight="400"
            lineHeight="20px"
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus 
            PageMaker including versions of Lorem Ipsum. <br/><br/>dummy text ever since
            the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only
            five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.dummy text ever since
            the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only
            five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like
          </Text>
        </HStack>
        <HStack width="47%">
          <VStack width={"100%"}>
            <Text
              color=" var(--white, #FFF)"
              font-family="Inter"
              font-size=" 14px"
              font-style=" normal"
              font-weight=" 700"
              line-height=" 20px"
              letter-spacing=" -0.15px"
            >
              points system: Per $1 liquidity
            </Text>

            <TableContainer
      // background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
      bg="var(--surface-of-10, rgba(103, 109, 154, 0.10))"

      color="white"
      borderRadius="md"
      width="100%"
      display="flex"
      justifyContent="flex-start"
      alignItems="flex-start"
      // bgColor={"red"}
      // height={"100%"}
      height={"17rem"}
      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30)) "

      padding={"1rem 2rem 0rem"}
      overflowX="hidden"
    // mt={"3rem"}
    >
            <Table
              variant="unstyled"
              width="100%"
              height="100%"
              mt="0.5rem"
              mb="0.5rem"
              // bgColor={"blue"}
              // p={0}
            >
              <Thead width={"100%"} height={"5rem"}>
                <Tr width={"100%"} height="2rem">
                  {" "}
                  {columnItems.map((val: any, idx1: any) => (
                    <Td
                      key={idx1}
                      width={idx1<=2? "15%":"55%"}
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
                        // overflowWrap="break-word"
                        width={"100%"}
                        height={"2rem"}
                        fontSize="12px"
                        textAlign={
                          idx1 == 0 || idx1 == 1
                            ? "left"
                            : idx1 == columnItems?.length - 1
                              ? "center"
                              : "center"
                        }
                        // textAlign={"center"}
                        // pl={idx1 == 0 ? 2 : idx1 == 1 ? "24%  " : 0}
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
                </Tr>{" "}
              </Thead>
              <Tbody
          position="relative"
          overflowX="hidden"
        //   display="flex"
        //   flexDirection="column"
        //   gap={"1rem"}
        >
              <Tr width={"100%"} position='relative'>
              <Td
                  
                      width={"15%"}
                      // maxWidth={`${gap[idx1][idx2]}%`}
                      fontSize={"12px"}
                      fontWeight={400}
                      // textAlign={"left"}
                      p={0}
                      // bgColor={"pink"}
                      // border="1px solid red"
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
                      >
                   Supply
                   
                      </Text>
                    </Td>

                    <Td
                  
                  width={"15%"}
                  // maxWidth={`${gap[idx1][idx2]}%`}
                  fontSize={"12px"}
                  fontWeight={400}
                  // textAlign={"left"}
                  p={0}
                  // bgColor={"pink"}
                  // border="1px solid red"
                >
                  <Text
                    width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                            fontWeight="400"
                            fontSize="14px"
                            color="#E6EDF3" width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                            fontWeight="400"
                            fontSize="14px"
                            color="#E6EDF3"
                  >
               1 point
               
                  </Text>
                </Td>

                <Td
                  
                  width={"15%"}
                  // maxWidth={`${gap[idx1][idx2]}%`}
                  fontSize={"12px"}
                  fontWeight={400}
                  // textAlign={"left"}
                  p={0}
                  // bgColor={"pink"}
                  // border="1px solid red"
                >
                  <Text
                    width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                            fontWeight="400"
                            fontSize="14px"
                            color="#E6EDF3" width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                               justifyContent="center"
                            fontWeight="400"
                            fontSize="14px"
                            color="#E6EDF3"
                  >
               0.2
               
                  </Text>
                </Td>

                <Td
                  
                  width={"55%"}
                  // maxWidth={`${gap[idx1][idx2]}%`}
                  fontSize={"12px"}
                  fontWeight={400}
                  // textAlign={"left"}
                  p={0}
                  // bgColor={"pink"}
                  // border="1px solid red"
                >
                  <Text
                    width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                            fontWeight="400"
                            fontSize="14px"
                            color="#E6EDF3" width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-end"
                            fontWeight="400"
                            fontSize="14px"
                            color="#E6EDF3"
                  >
             - 0.1 point if total referred liquidity is ≤$250,000. <br/>
- 0.2 point if total referred liquidity is >$250,000.
               
                  </Text>
                </Td>
              </Tr>

              <Tr
                    style={{
                      position: "absolute",
                      // left: "0%",
                      width: "100%",
                      height: "1px",
                      borderBottom: "1px solid #2b2f35",
                      display: `${"block"}`,
                    }}
                  />


              <Tr width={"100%"} position='relative'>
              <Td
                  
                      width={"15%"}
                      // maxWidth={`${gap[idx1][idx2]}%`}
                      fontSize={"12px"}
                      fontWeight={400}
                      // textAlign={"left"}
                      p={0}
                      // bgColor={"pink"}
                      // border="1px solid red"
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
                      >
                   Supply
                   
                      </Text>
                    </Td>

                    <Td
                  
                  width={"15%"}
                  // maxWidth={`${gap[idx1][idx2]}%`}
                  fontSize={"12px"}
                  fontWeight={400}
                  // textAlign={"left"}
                  p={0}
                  // bgColor={"pink"}
                  // border="1px solid red"
                >
                  <Text
                    width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                            fontWeight="400"
                            fontSize="14px"
                            color="#E6EDF3" width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                            fontWeight="400"
                            fontSize="14px"
                            color="#E6EDF3"
                  >
               1 point
               
                  </Text>
                </Td>

                <Td
                  
                  width={"15%"}
                  // maxWidth={`${gap[idx1][idx2]}%`}
                  fontSize={"12px"}
                  fontWeight={400}
                  // textAlign={"left"}
                  p={0}
                  // bgColor={"pink"}
                  // border="1px solid red"
                >
                  <Text
                    width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                            fontWeight="400"
                            fontSize="14px"
                            color="#E6EDF3" width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            textAlign={"center"}
                            fontWeight="400"
                            fontSize="14px"
                            color="#E6EDF3"
                  >
               0.2
               
                  </Text>
                </Td>

                <Td
                  
                  width={"55%"}
                  // maxWidth={`${gap[idx1][idx2]}%`}
                  fontSize={"12px"}
                  fontWeight={400}
                  // textAlign={"left"}
                  p={0}
                  // bgColor={"pink"}
                  // border="1px solid red"
                >
                  <Text
                    width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                            fontWeight="400"
                            fontSize="14px"
                            color="#E6EDF3" width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-end"
                            fontWeight="400"
                            fontSize="14px"
                            color="#E6EDF3"
                  >
             - 0.1 point if total referred liquidity is ≤$250,000. <br/>
- 0.2 point if total referred liquidity is >$250,000.
               
                  </Text>
                </Td>
              </Tr>
              </Tbody>
            </Table>
            </TableContainer>
          </VStack>
        </HStack>
      </HStack>
      
      <HStack
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        flexDirection="row"
        width="95%"
        // pr="3rem"
        mb="1rem"
        mt='2rem'
        // zIndex="1"
      >
        <Text color= "#B1B0B5"

font-family= "Inter"
font-size= "14px"
font-style= "normal"
font-weight= "400"
line-height= "20px" >

Terms and conditions <br/>
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
</Text>
        </HStack>
    </PageCard>
  );
};

export default Referal;
