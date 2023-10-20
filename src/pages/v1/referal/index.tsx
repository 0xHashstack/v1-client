
import Image from "next/image";
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
import CopyIcon from "@/assets/icons/copyIcon";
import Stats from "@/components/layouts/stats";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";
const Referal = () => {
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
        id: 0, start: "1 Mar", end: "1 April", ref: 28, liq: 500, pts: 100, est: 232
    }, {
        id: 1, start: "1 Mar", end: "1 April", ref: 28, liq: 500, pts: 100, est: 232
    }, {
        id: 2, start: "1 Mar", end: "1 April", ref: 28, liq: 500, pts: 100, est: 232
    }, {
        id: 3, start: "1 Mar", end: "1 April", ref: 28, liq: 500, pts: 100, est: 232
    }, {
        id: 4, start: "1 Mar", end: "1 April", ref: 28, liq: 500, pts: 100, est: 232
    }, {
        id: 5, start: "1 Mar", end: "1 April", ref: 28, liq: 500, pts: 100, est: 232
    }, {
        id: 6, start: "1 Mar", end: "1 April", ref: 28, liq: 500, pts: 100, est: 232
    }, {
        id: 7, start: "1 Mar", end: "1 April", ref: 28, liq: 500, pts: 100, est: 232
    }, {
        id: 8, start: "1 Mar", end: "1 April", ref: 28, liq: 500, pts: 100, est: 232
    }]
    const sampleDataLeaderBoard = [{
        id: 0, start: "1 Mar", end: "1 April", rank: 28, wallet: "Braavos", liq: 500, pts: 100, est: 232
    }, {
        id: 1, start: "1 Mar", end: "1 April", rank: 28, wallet: "Braavos", liq: 500, pts: 100, est: 232
    }, {
        id: 2, start: "1 Mar", end: "1 April", rank: 28, wallet: "Braavos", liq: 500, pts: 100, est: 232
    }, {
        id: 3, start: "1 Mar", end: "1 April", rank: 28, wallet: "Braavos", liq: 500, pts: 100, est: 232
    }, {
        id: 4, start: "1 Mar", end: "1 April", rank: 28, wallet: "Braavos", liq: 500, pts: 100, est: 232
    }, {
        id: 5, start: "1 Mar", end: "1 April", rank: 28, wallet: "Braavos", liq: 500, pts: 100, est: 232
    }, {
        id: 6, start: "1 Mar", end: "1 April", rank: 28, wallet: "Braavos", liq: 500, pts: 100, est: 232
    }, {
        id: 7, start: "1 Mar", end: "1 April", rank: 28, wallet: "Braavos", liq: 500, pts: 100, est: 232
    }, {
        id: 8, start: "1 Mar", end: "1 April", rank: 28, wallet: "Braavos", liq: 500, pts: 100, est: 232
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
                        onClick={() => { setCampaignSelected(2) }}
                    >
                        Referrals
                    </Button>
                </HStack>
                <Box mt="3rem" display="flex" flexDirection="column">
                    <Box display="flex" mt="0">
                    <InputGroup size='sm'mt="0rem" border="1px solid #676D9A" borderRight="0px" borderRadius="6px 0px 0px 6px" height="4rem">
                        <InputLeftAddon children='https://app.hashatack.finance/r/' height="60px" border="none" bg="none" color="#4D59E8" paddingInlineEnd="0" />
                        <Input  height="60px" border="none" color="#F0F0F5" value={refferal} paddingInlineStart="0" _focus={{
                        outline: "0",
                        boxShadow: "none",
                      }}
                      onChange={handleChange}
                      />
                    </InputGroup>
                    <Box cursor="pointer" onClick={()=>{
                        handleCopyClick();
                        toast.success("Copied",{
                            position: toast.POSITION.BOTTOM_RIGHT,
                        })
                    }}>
                        <CopyToClipboard text="Kaisi ho">
                            <CopyIcon/>
                        </CopyToClipboard>
                    </Box>
                    </Box>
                    <Box color="#676D9A" fontSize="14px" fontStyle="normal" fontWeight="500" lineHeight="20px" letterSpacing="-0.15px" mt="0.3rem">
                    You can edit your link only once
                    </Box>
                </Box>
            </HStack>
            <Flex
                      display="flex"
                      flexDirection="column"
                      // mt="2rem"
                      h="6.4rem"
                      w="95%"
                      flexWrap="wrap"
                      mt="2rem"
                      marginBottom="4rem"
                >
                <HStack
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        w="100%"
                        h="100%"
                        // bg="#101216"
                        flexWrap="wrap">          
                <Stats
          header={[
            "Referred",
            "Points earned",
            "Rewards Claimed",
          ]}
          statsData={[15,15,200]}
          onclick={() => {
            console.log("hi")
          }}
          arrowHide={process.env.NEXT_PUBLIC_NODE_ENV=="testnet"?false:true}
        />
                        <Stats
          header={[
            "Overall refered by community",
            "Rewards claimed by community"
          ]}
          statsData={[400,3200]}
          onclick={() => {
            // handleRouteChange("/v1/protocol-metrics");
          }}
          arrowHide={process.env.NEXT_PUBLIC_NODE_ENV=="testnet"?false:true}
        />
                </HStack>
            </Flex>
        </PageCard>
    );
};

export default Referal;
