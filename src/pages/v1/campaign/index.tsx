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
const Campaign = () => {
  const [currentPagination, setCurrentPagination] = useState<number>(1);
  const columnItems = [
    "Traders Referred",
    "Referees liquidity (in $)",
    "Points earned",
    "Est.token earning \n $HASH (i)"
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
  }]
  const { available, disconnect, connect, connectors, refresh } =
    useConnectors();

  const dispatch = useDispatch();
  const { account, address } = useAccount();
  useDataLoader();
  const UserLoans = useSelector(selectUserLoans);
  useEffect(() => {
    if (UserLoans) {
      if (UserLoans?.length <= (currentPagination - 1) * 6) {
        console.log("pagination", Pagination, UserLoans);
        if (currentPagination > 1) {
          setCurrentPagination(currentPagination - 1);
        }
      }
    }
  }, [UserLoans]);

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
  const [tabValue, setTabValue] = useState(1);
 
  return (
    <PageCard pt="6.5rem">
      {/* <StatsBoard /> */}
<Box borderRadius={'lg'} width={'90%'}  background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
    border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
    
      alignItems={'center'}
       >
      <Box marginTop={'7'} width={'100%'}  display='flex' justifyContent={'center'} alignContent={'center'}  position="relative" pl="5px">
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
                      color="#6E7681"
                      fontSize="sm"
                      border="1px"
                      borderColor="#2B2F35"
                      borderLeftRadius="md"
                      fontWeight="normal"
                      opacity="100%"
                      _selected={{
                        color: "white",
                        bg: "#0969DA",
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
                      color="#6E7681"
                      fontSize="sm"
                      border="1px"
                      borderColor="#2B2F35"
                      borderRightRadius="md"
                      fontWeight="normal"
                      opacity="100%"
                      _selected={{
                        color: "white",
                        bg: "#0969DA",
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
         {tabValue==1? <LeaderboardDashboard   width={"95%"}
        currentPagination={currentPagination}
        setCurrentPagination={setCurrentPagination}
        leaderBoardData={sampleDate}
        columnItems={columnItems} /> : <></>}
      {/* <SupplyModal /> */}
      </Box>
    </PageCard>
  );
};

export default Campaign;
