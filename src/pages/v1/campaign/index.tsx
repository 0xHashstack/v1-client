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
const Campaign = () => {
  const [currentPagination, setCurrentPagination] = useState<number>(1);
  const columnItemsLeaderBoard = [
    "Rank",
    "Wallet",
    "Referees Liquidity",
    "Points earned",
    "Est.token earning \n $STRK"
  ];
  const columnItemsLeaderBoardReferalCampaign = [
    "Rank",
    "Wallet",
    "Liquidity Provided (in $)",
    "Points earned",
    "Est.token earning \n $HASH"
  ];
  const columnItemsPersonalStats = [
    "Liquidity Provided",
    "Referees liquidity (in $)",
    "Points earned",
    "Est.token earning \n $STRK"
  ];
  const columnItemsPersonalStatsReferalCampaign = [
    "Traders Referred",
    "Referees liquidity (in $)",
    "Points earned",
    "Est.token earning \n $HASH"
  ];
  const sampleDate = [{
    id:0,start:"1 Mar",end:"1 April",ref:28,liq:500,pts:100,est:232
  },{
    id:1,start:"1 Mar",end:"1 April",ref:28,liq:500,pts:100,est:232
  },{
    id:2,start:"1 Mar",end:"1 April",ref:28,liq:500,pts:100,est:232
  },{
    id:3,start:"1 Mar",end:"1 April",ref:28,liq:500,pts:100,est:232
  },{
    id:4,start:"1 Mar",end:"1 April",ref:28,liq:500,pts:100,est:232
  },{
    id:5,start:"1 Mar",end:"1 April",ref:28,liq:500,pts:100,est:232
  },{
    id:6,start:"1 Mar",end:"1 April",ref:28,liq:500,pts:100,est:232
  },{
    id:7,start:"1 Mar",end:"1 April",ref:28,liq:500,pts:100,est:232
  },{
    id:8,start:"1 Mar",end:"1 April",ref:28,liq:500,pts:100,est:232
  }]
  const sampleDataLeaderBoard = [{
    id:0,start:"1 Mar",end:"1 April",rank:28,wallet:"Braavos",liq:500,pts:100,est:232
  },{
    id:1,start:"1 Mar",end:"1 April",rank:28,wallet:"Braavos",liq:500,pts:100,est:232
  },{
    id:2,start:"1 Mar",end:"1 April",rank:28,wallet:"Braavos",liq:500,pts:100,est:232
  },{
    id:3,start:"1 Mar",end:"1 April",rank:28,wallet:"Braavos",liq:500,pts:100,est:232
  },{
    id:4,start:"1 Mar",end:"1 April",rank:28,wallet:"Braavos",liq:500,pts:100,est:232
  },{
    id:5,start:"1 Mar",end:"1 April",rank:28,wallet:"Braavos",liq:500,pts:100,est:232
  },{
    id:6,start:"1 Mar",end:"1 April",rank:28,wallet:"Braavos",liq:500,pts:100,est:232
  },{
    id:7,start:"1 Mar",end:"1 April",rank:28,wallet:"Braavos",liq:500,pts:100,est:232
  },{
    id:8,start:"1 Mar",end:"1 April",rank:28,wallet:"Braavos",liq:500,pts:100,est:232
  }]
  const { available, disconnect, connect, connectors, refresh } =
    useConnectors();

  const dispatch = useDispatch();
  const { account, address } = useAccount();
  useDataLoader();
  const UserLoans = useSelector(selectUserLoans);
  useEffect(() => {
    // if (UserLoans) {
    //   if (UserLoans?.length <= (currentPagination - 1) * 6) {
    //    //console.log("pagination", Pagination, UserLoans);
    //     if (currentPagination > 1) {
    //       setCurrentPagination(currentPagination - 1);
    //     }
    //   }
    // }
       if (sampleDate) {
      if (sampleDate.length <= (currentPagination - 1) * 6) {
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
  //       ////console.log(loans,"Loans from your borrow index page")

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
  //      //console.log("your-borrow : unable to fetch user loans");
  //     }
  //     ////console.log("loans", loans);
  //   };
  //   if (account) {
  //     loan();
  //   }
  // }, [account, UserLoans]);
  const totalBorrow = useSelector(selectYourBorrow);
  const netAPR = useSelector(selectNetAPR);
  const [campaignSelected, setCampaignSelected] = useState(2);
  const [tabValue, setTabValue] = useState(1);

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
            color={campaignSelected==2 ?"#fff":"#676D9A"}
            borderBottom={campaignSelected==2 ?"2px solid #4D59E8":""}
            borderRadius="0px"
            _hover={{ bg: "transparent", color: "#E6EDF3" }}
            onClick={()=>{setCampaignSelected(2)}}
          >
            Referal mining Campign
          </Button>
        </HStack>
             <HStack mt="2.5rem" display="flex" flexDirection="column" alignItems="flex-start" width="100%">
              {campaignSelected==1 ?          <Box display="flex">
            <Text color="#B1B0B5" fontSize="16px" fontWeight="400" lineHeight="20px" fontStyle="normal">
              Liquidity mining campaign -
            </Text>
            <Text color="#00D395" fontSize="16px" fontStyle="normal" fontWeight="400" lineHeight="20px">
                &nbsp;99 days 11 hours left
            </Text>
          </Box>:
                    <Box display="flex">
                    <Text color="#B1B0B5" fontSize="16px" fontWeight="400" lineHeight="20px" fontStyle="normal">
                      Referal campaign - 
                    </Text>
                    <Text color="#00D395" fontSize="16px" fontStyle="normal" fontWeight="400" lineHeight="20px">
                      &nbsp;99 days 11 hours left
                    </Text>
                  </Box>
          }
          <HStack display="flex" justifyContent="space-between" width="100%">
            <HStack
                    // width="13.5rem"
                    display="flex"
                    // bgColor="yellow"
                    // flexGrow={1}
                    p="25px 32px"
                    border= "1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
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
            {campaignSelected==1 ?
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
            :
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
    </HStack>}
          </HStack>
        </HStack>
        <Box borderRadius={'lg'} width={'100%'} 
              background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
          mt="1rem"
        >
          <Box marginTop={'7'} width={'100%'} display='flex' justifyContent={'center'} alignContent={'center'} position="relative" pl="5px">
            <Tabs variant="unstyled" marginBlock={'lg'} alignContent={"center"}>
              <TabList
                borderRadius="md"
                top="9.5rem"
                width="100%"
                zIndex="1"
              >
                <Box display="flex" width="300px" position="relative">
                  <Tab
                    py="1"
                    px="3"
                    color="#B1B0B5"
                    fontSize="sm"
                    border="1px"
                    borderColor="#2B2F35"
                    borderLeftRadius="md"
                    fontWeight="normal"
                    opacity="100%"
                    _selected={{
                      color: "white",
                      bg: "#4D59E8",
                      border: "none",
                    }}
                    isDisabled={false}
                    onClick={() => {
                      setTabValue(1);
                    }}
                  >
                    LeaderBoard
                  </Tab>
                  <Tab
                    py="1"
                    px="3"
                    color="#B1B0B5"
                    fontSize="sm"
                    border="1px"
                    borderColor="#2B2F35"
                    borderRightRadius="md"
                    fontWeight="normal"
                    opacity="100%"
                    _selected={{
                      color: "white",
                      bg: "#4D59E8",
                      border: "none",
                    }}
                    isDisabled={false}
                    onClick={() => {
                      setTabValue(2);
                    }}
                  >
                    Personal Stats
                  </Tab>
                </Box>
              </TabList>
            </Tabs>
          </Box>
          {tabValue == 1 ? <LeaderboardDashboard width={"95%"}
            currentPagination={currentPagination}
            setCurrentPagination={setCurrentPagination}
            leaderBoardData={sampleDataLeaderBoard}
            columnItems={campaignSelected==1 ?columnItemsLeaderBoard:columnItemsLeaderBoardReferalCampaign} /> :
            <PersonalStatsDashboard width={"95%"}
            currentPagination={currentPagination}
            setCurrentPagination={setCurrentPagination}
            leaderBoardData={sampleDate}
            columnItems={campaignSelected==1?columnItemsPersonalStats:columnItemsPersonalStatsReferalCampaign} />
            }
          {/* <SupplyModal /> */}
         </Box> 
         <Box mt="1rem">
         <Pagination
          currentPagination={currentPagination}
          setCurrentPagination={(x: any) => setCurrentPagination(x)}
          max={sampleDate?.length || 0}
          rows={6}
        />
         </Box>
      </HStack>
    </PageCard>
  );
};

export default Campaign;
