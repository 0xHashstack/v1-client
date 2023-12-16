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
import { selectYourBorrow, selectNetAPR, selectExistingLink, selectInteractedAddress, selectYourSupply } from "@/store/slices/readDataSlice";
import { setUserLoans, selectUserLoans } from "@/store/slices/readDataSlice";
import { getUserLoans } from "@/Blockchain/scripts/Loans";
import { ILoan } from "@/Blockchain/interfaces/interfaces";
import numberFormatter from "@/utils/functions/numberFormatter";
import useDataLoader from "@/hooks/useDataLoader";
import LeaderboardDashboard from "@/components/layouts/leaderboardDashboard";
import PersonalStatsDashboard from "@/components/layouts/personalStatsDashboard";
import axios from "axios";
import { toast } from "react-toastify";
import CopyToClipboard from "react-copy-to-clipboard";
import CopyIcon from "@/assets/icons/copyIcon";
import BlueInfoIcon from "@/assets/icons/blueinfoicon";
const Campaign = () => {
  const [currentPagination, setCurrentPagination] = useState<number>(1);
  const columnItemsLeaderBoard = [
    "Rank",
    "Account",
    "Referees Liquidity",
    "Points",
    "Est.token earning \n $STRK"
  ];
  const columnItemsLeaderBoardReferalCampaign = [
    "Rank",
    "Account",
    "Liquidity generated in ($)",
    "Points",
    "HASH (est)"
  ];
  const columnItemsPersonalStats = [
    "Liquidity Provided",
    "Liquidity generated in ($)",
    "Points",
    "HASH (est)"
  ];
  const columnItemsPersonalStatsReferalCampaign = [
    "Traders Referred",
    "Liquidity generated in ($)",
    "Points",
    "HASH (est)"
  ];
  const sampleDate: any = [{
    id: 0, start: "1 Mar", end: "1 April", rank: 28, account: "Braavos", liq: 500, pts: 100, est: 232
  }, {
    id: 1, start: "1 Mar", end: "1 April", rank: 28, account: "Braavos", liq: 500, pts: 100, est: 232
  }, {
    id: 2, start: "1 Mar", end: "1 April", rank: 28, account: "Braavos", liq: 500, pts: 100, est: 232
  }, {
    id: 3, start: "1 Mar", end: "1 April", rank: 28, account: "Braavos", liq: 500, pts: 100, est: 232
  }, {
    id: 4, start: "1 Mar", end: "1 April", rank: 28, account: "Braavos", liq: 500, pts: 100, est: 232
  }, {
    id: 5, start: "1 Mar", end: "1 April", rank: 28, account: "Braavos", liq: 500, pts: 100, est: 232
  }, {
    id: 6, start: "1 Mar", end: "1 April", rank: 28, account: "Braavos", liq: 500, pts: 100, est: 232
  },
  {
    id: 7, start: "1 Mar", end: "1 April", rank: 28, account: "Braavos", liq: 500, pts: 100, est: 232
  }, {
    id: 8, start: "1 Mar", end: "1 April", rank: 28, account: "Braavos", liq: 500, pts: 100, est: 232
  },
  {
    id: 10, start: "1 Mar", end: "1 April", rank: 28, account: "Braavos", liq: 500, pts: 100, est: 232
  }, {
    id: 20, start: "1 Mar", end: "1 April", rank: 28, account: "Braavos", liq: 500, pts: 100, est: 232
  }, {
    id: 30, start: "1 Mar", end: "1 April", rank: 28, account: "Braavos", liq: 500, pts: 100, est: 232
  }, {
    id: 40, start: "1 Mar", end: "1 April", rank: 28, account: "Braavos", liq: 500, pts: 100, est: 232
  }, {
    id: 50, start: "1 Mar", end: "1 April", rank: 28, account: "Braavos", liq: 500, pts: 100, est: 232
  }, {
    id: 60, start: "1 Mar", end: "1 April", rank: 28, account: "Braavos", liq: 500, pts: 100, est: 232
  },]
  const sampleDataLeaderBoard = [{
    id: 0, start: "1 Mar", end: "1 April", rank: 28, account: "Braavos", liq: 500, pts: 100, est: 232
  }, {
    id: 1, start: "1 Mar", end: "1 April", rank: 28, account: "Braavos", liq: 500, pts: 100, est: 232
  }, {
    id: 2, start: "1 Mar", end: "1 April", rank: 28, account: "Braavos", liq: 500, pts: 100, est: 232
  }, {
    id: 3, start: "1 Mar", end: "1 April", rank: 28, account: "Braavos", liq: 500, pts: 100, est: 232
  }, {
    id: 4, start: "1 Mar", end: "1 April", rank: 28, account: "Braavos", liq: 500, pts: 100, est: 232
  }, {
    id: 5, start: "1 Mar", end: "1 April", rank: 28, account: "Braavos", liq: 500, pts: 100, est: 232
  }, {
    id: 6, start: "1 Mar", end: "1 April", rank: 28, account: "Braavos", liq: 500, pts: 100, est: 232
  },]
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
  
  const [leaderboardData, setLeaderboardData] = useState([])
  const [communityHash, setCommunityHash] = useState()
  const [communityPoints, setCommunityPoints] = useState()
  const [personalData, setPersonalData] = useState([])
  const [epoch, setepoch] = useState(1)
  const [snapshotNumber, setSnapshotNumber] = useState(0)
  const interactedAddress=useSelector(selectInteractedAddress)
  useEffect(()=>{
    const fetchDetails=async()=>{
      if(address){
        const res=await axios.get(`https://hstk.fi/api/temp-allocation/${address}`)
        setCommunityHash(res?.data?.communityInfo?.estimatedHashTokensCommunity)
        setCommunityPoints(res?.data?.communityInfo?.totalInteractionPoints)
        setepoch(res?.data?.communityInfo?.latestEpoch);
        setSnapshotNumber(res?.data?.communityInfo.latestSnapshotNumber)
        let arr:any=[];
        arr.push({
          id: 0, start: "25th Nov", end: "8th Dec",epoch:res?.data?.userInfo?.epoch, tradders: res?.data?.userInfo?.totalReferredAddresses, liq: res?.data?.userInfo?.selfValue,supplyliq:res?.data?.userInfo?.supplyValue,borrowliq:res?.data?.userInfo?.borrowValue,referredliq:res?.data?.userInfo?.referralValue,
          pts: res?.data?.userInfo?.totalPoints,ptsAllocated:res?.data?.userInfo?.allocatedData?.pointsAllocated, selfpts: res?.data?.userInfo?.selfPoints,referredpts: res?.data?.userInfo?.referralPoints,hashAllocated:res?.data?.userInfo?.allocatedData?.hashAllocated,  est: res?.data?.userInfo?.estimatedHashTokensUser
        })
        setPersonalData(arr);
      }
    }
    fetchDetails();
  },[address])
  useEffect(()=>{
    try{
      const fetchLeaderBoardData=async()=>{
        const res=await axios.get('https://hstk.fi/api/leaderboard');
        setLeaderboardData(res?.data);
      }
      fetchLeaderBoardData();
    }catch(err){
      console.log(err);
    }

  },[])

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
  const totalSupply=useSelector(selectYourSupply);
  const netAPR = useSelector(selectNetAPR);
  const [campaignSelected, setCampaignSelected] = useState(2);
  const [tabValue, setTabValue] = useState(1);
  const exisitingLink = useSelector(selectExistingLink);
  const [refferal, setRefferal] = useState("xyz");
  const handleChange = async (e: any) => {
    if (exisitingLink != null) {

    }
    else {
      if(totalBorrow==0 && totalSupply==0){
        return;
      }else{
        setRefferal(e.target.value);
      }
    }
  }
  const handleCopyClick = async () => {
    try {
      if (exisitingLink) {
        await navigator.clipboard.writeText((process.env.NEXT_PUBLIC_NODE_ENV == "testnet" ? "https://testnet.hstk.fi/" : "https://hstk.fi/") + exisitingLink);
        toast.success("Copied", {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      } else {
        if(totalBorrow>0 || totalSupply>0){
          await navigator.clipboard.writeText((process.env.NEXT_PUBLIC_NODE_ENV == "testnet" ? "https://testnet.hstk.fi/" : "https://hstk.fi/") + refferal);
          axios.post((process.env.NEXT_PUBLIC_NODE_ENV == "testnet" ? "https://testnet.hstk.fi/shorten" : 'https://hstk.fi/shorten'), { pseudo_name: refferal, address: address })
            .then((response) => {
              //console.log(response, "response refer link"); // Log the response from the backend.
              toast.success("Copied", {
                position: toast.POSITION.BOTTOM_RIGHT,
              })
            })
            .catch((error) => {
              toast.error(error?.response?.data?.error, {
                position: toast.POSITION.BOTTOM_RIGHT,
              })
              console.error('Error:', error?.response?.data?.error);
            });
          }
        }


    } catch (error: any) {
      toast.error(error, {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
      console.error('Failed to copy text: ', error);
    }
  };
  const startDate = new Date('2023-11-27'); 
const endDate = new Date(startDate);
endDate.setDate(startDate.getDate() + 55); 

// Function to update the days left
const [daysLeft, setDaysLeft] = useState<number>(56)
function updateDaysLeft() {
  const now = new Date();
  const timeDiff = endDate.getTime() - now.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
  setDaysLeft(daysLeft);
}
useEffect(()=>{
  updateDaysLeft();
},[])

// Update days left on page load and start an interval to update it daily
  useEffect(()=>{
    setCurrentPagination(1);
  },[tabValue])
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
        <HStack display='flex'  width="100%" alignItems="flex-start" justifyContent="space-between">
        <Box mt="2.5rem" display="flex" flexDirection="column">
                    <Text color="#F0F0F5" fontSize="16px" fontWeight="400" lineHeight="20px" fontStyle="normal" mb="0.8rem">
                  Your Referral Link
                </Text>
                    <Box display="flex" mt="0">
                    <InputGroup  width="550px" mt="0rem" border="1px solid #676D9A" borderRight="0px" borderRadius="6px 0px 0px 6px" height="5.3rem" >
                    <InputLeftAddon  height="80px" fontSize="20px"  border="none" bg="none" color="#4D59E8" paddingInlineEnd="0">
                    {process.env.NEXT_PUBLIC_NODE_ENV=="testnet" ?"https://testnet.hstk.fi/":"https://hstk.fi/"}
                    </InputLeftAddon>
                    {exisitingLink ?
                    <Input fontSize="20px"   height="80px" border="none" color="#F0F0F5" value={exisitingLink} paddingInlineStart="0" _focus={{
                        outline: "0",
                        boxShadow: "none",
                      }}
                      onChange={handleChange}
                      />:<Input fontSize="20px"   height="80px" border="none" color="#F0F0F5" value={totalBorrow==0 && totalSupply==0 ? "****": refferal} paddingInlineStart="0" _focus={{
                        outline: "0",
                        boxShadow: "none",
                      }}
                      onChange={handleChange}
                      
                      />
                }
                    </InputGroup>
                    <Box cursor="pointer" onClick={()=>{
                        handleCopyClick();

                    }}>
                        <CopyToClipboard text="Works">
                            <CopyIcon/>
                        </CopyToClipboard>
                    </Box>
                    </Box>
                    {(totalBorrow==0 && totalSupply==0) ?
                    <Box
                    display="flex"
                    bg="#222766"
                    p="4"
                    border="1px solid #3841AA"
                    fontStyle="normal"
                    fontWeight="400"
                    lineHeight="18px"
                    borderRadius="6px"
                    color="#B1B0B5" fontSize="14px" letterSpacing="-0.15px" mt="0.3rem"
                    // textAlign="center"
                  >
                    <Box pr="3" mt="0.5" cursor="pointer">
                      <BlueInfoIcon />
                    </Box>
                    To generate your referral link, you must supply a min of $25, or borrow $100.
                    {/* <Box
                                py="1"
                                pl="4"
                                cursor="pointer"
                                // onClick={handleClick}
                              >
                                <TableClose />
                              </Box> */}
                  </Box>
                    :
                    <Box color="#676D9A" fontSize="14px" fontStyle="normal" fontWeight="500" lineHeight="20px" letterSpacing="-0.15px" mt="0.3rem">
                    You can change this link only once
                    </Box>
                  }
                </Box>
                <HStack mt="2.5rem" display="flex" flexDirection="column" alignItems="flex-start" >
                  <Box>
                  <Text color="#F0F0F5" fontSize="16px" fontWeight="400" lineHeight="20px" fontStyle="normal" mb="0.2rem">
                  Overall campaign stats
                </Text>
                  </Box>
          <HStack display="flex" justifyContent="space-between" >
            <HStack
              // width="13.5rem"
              display="flex"
              // bgColor="yellow"
              // flexGrow={1}
              p="18px 26px"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              borderRadius="8px"
              gap="6.3rem"
            >
              <VStack
                display="flex"
                justifyContent="center"
                alignItems="flex-start"
                gap={"6px"}
              >
                <Text color="#B1B0B5" fontSize="14px" alignItems="center">
                Campaign pool
                </Text>
               <Text color="#e6edf3" fontSize="20px">
                    45M HASH
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
                {communityPoints ?                <Text color="#e6edf3" fontSize="20px">
                {numberFormatter(communityPoints)}
                </Text>:<Skeleton
                        width="6rem"
                        height="1.4rem"
                        startColor="#101216"
                        endColor="#2B2F35"
                        borderRadius="6px"
                      />}
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
                    Epoch Pool 
                  </Tooltip>
                </Text>
                    {!communityHash ? <Skeleton
                        width="6rem"
                        height="1.4rem"
                        startColor="#101216"
                        endColor="#2B2F35"
                        borderRadius="6px"
                      />:                <Text color="#e6edf3" fontSize="20px">
                        11.25M HASH
                      {/* {numberFormatter(communityHash).substring(0,1)}{numberFormatter(communityHash).substring(5,)} HASH */}
                      </Text>}

              </VStack>
            </HStack>
            {/* {campaignSelected == 1 ?
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
              </HStack>} */}
          </HStack>
        </HStack>
        </HStack>
        <HStack display="flex" width="100%" justifyContent="space-between">
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
            mt="4rem"
            color={campaignSelected == 2 ? "#fff" : "#676D9A"}
            borderBottom={campaignSelected == 2 ? "2px solid #4D59E8" : ""}
            borderRadius="0px"
            _hover={{ bg: "transparent", color: "#E6EDF3" }}
            onClick={() => { setCampaignSelected(2) }}
          >
            Airdrop campaign details
          </Button>
          {campaignSelected == 1 ? <Box display="flex" >
            <Text color="#B1B0B5" fontSize="16px" fontWeight="400" lineHeight="20px" fontStyle="normal">
              Liquidity mining campaign -
            </Text>
            <Text color="#00D395" fontSize="16px" fontStyle="normal" fontWeight="400" lineHeight="20px">
              &nbsp;99 days 11 hours left
            </Text>
          </Box> :
            <Box display="flex" gap="4.5rem" mt="5rem">
              <Box display="flex">
                <Text color="#B1B0B5" fontSize="16px" fontWeight="400" lineHeight="20px" fontStyle="normal">
                  Airdrop campaign -
                </Text>
                <Text color="#00D395" fontSize="16px" fontStyle="normal" fontWeight="400" lineHeight="20px">
                  &nbsp;{daysLeft} days left
                </Text>
              </Box>
              <Box display="flex">
              <Text color="#B1B0B5" fontSize="16px" fontWeight="400" lineHeight="20px" fontStyle="normal">
                Epoch -
              </Text>
              <Text color="#00D395" fontSize="16px" fontStyle="normal" fontWeight="400" lineHeight="20px">
                &nbsp;{epoch}/4
              </Text>
              </Box>
              <Box display="flex">
              <Text color="#B1B0B5" fontSize="16px" fontWeight="400" lineHeight="20px" fontStyle="normal">
                Snapshot -
              </Text>
              <Text color="#00D395" fontSize="16px" fontStyle="normal" fontWeight="400" lineHeight="20px">
                &nbsp;{snapshotNumber}/6
              </Text>
              </Box>
            </Box>
          }
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
                    Your Stats
                  </Tab>
                </Box>
              </TabList>
            </Tabs>
          </Box>
          {tabValue == 1 ? <LeaderboardDashboard width={"95%"}
            currentPagination={currentPagination}
            setCurrentPagination={setCurrentPagination}
            leaderBoardData={leaderboardData}
            columnItems={campaignSelected == 1 ? columnItemsLeaderBoard : columnItemsLeaderBoardReferalCampaign} /> :
            <PersonalStatsDashboard width={"95%"}
              currentPagination={currentPagination}
              setCurrentPagination={setCurrentPagination}
              leaderBoardData={personalData}
              columnItems={campaignSelected == 1 ? columnItemsPersonalStats : columnItemsPersonalStatsReferalCampaign} />
          }
          {/* <SupplyModal /> */}
        </Box>
        <Box mt="1rem">
          <Pagination
            currentPagination={currentPagination}
            setCurrentPagination={(x: any) => setCurrentPagination(x)}
            max={tabValue == 1 ? leaderboardData?.length || 0 : personalData?.length || 0}
            rows={6}
          />
        </Box>
      </HStack>
    </PageCard>
  );
};

export default Campaign;