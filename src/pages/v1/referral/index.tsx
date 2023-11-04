
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
import { selectYourBorrow, selectNetAPR, selectExistingLink } from "@/store/slices/readDataSlice";
import { setUserLoans, selectUserLoans } from "@/store/slices/readDataSlice";
import { getUserLoans } from "@/Blockchain/scripts/Loans";
import { ILoan } from "@/Blockchain/interfaces/interfaces";
import numberFormatter from "@/utils/functions/numberFormatter";
import useDataLoader from "@/hooks/useDataLoader";
import LeaderboardDashboard from "@/components/layouts/leaderboardDashboard";
import PersonalStatsDashboard from "@/components/layouts/personalStatsDashboard";
import CopyToClipboard from "react-copy-to-clipboard";
import CopyIcon from "@/assets/icons/copyIcon";
import Stats from "@/components/layouts/stats";
import { toast } from "react-toastify";
import axios from "axios";
const Referral = () => {
    const [currentPagination, setCurrentPagination] = useState<number>(1);
    const columnItems = [
        "User Action",
        "direct user",
        "If Referred (U1)",
        "If Referred (U2)",
    ];
    const tooltips = [
        "User Action.",
        "Direct User",
        "U1 refer ",
        "U2 refer",
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
    const [dataCommunity, setDataCommunity] = useState([])
    const [dataUser, setDataUser] = useState([0,0,0])
    useDataLoader();
    useEffect(()=>{
        const fetchData=async()=>{
            try{
                const array:any=[];
                const res=await axios.get('https://testnet.hstk.fi/api/get-community-stats');
                if(res?.data){
                    array.push(res?.data?.overall_referred_liq);
                    array.push(res?.data?.rewards_claimed);
                }
                setDataCommunity(array)
            }catch(err){
                console.log(err);
            }

        }
        const fetchUserData=async()=>{
            try{
                if(!address){
                    return;
                }
                const array:any=[];
                const res=await axios.get(`https://testnet.hstk.fi/api/get-user-stats/${address}`);
                if(res?.data){
                    array.push(res?.data?.referred_points);
                    array.push(res?.data?.points_earned);
                    array.push(res?.data?.rewards_claimed)
                }
                setDataUser(array);
                console.log(res,"user")
            }catch(err){
                console.log(err)
            }
        }
        fetchUserData();
        fetchData()
    },[address])
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
    const [refferal, setRefferal] = useState("xyz");
    const exisitingLink=useSelector(selectExistingLink);
    const handleChange = async(e: any) => {
        if(exisitingLink!=null){
            
        }
        else{
            setRefferal(e.target.value);
        }
    }
    const handleCopyClick =  async () => {
        try {
            if(exisitingLink){
                await navigator.clipboard.writeText((process.env.NEXT_PUBLIC_NODE_ENV=="testnet" ?"https://testnet.hstk.fi/":"https://hstk.fi/") + exisitingLink);
            }else{
                await navigator.clipboard.writeText((process.env.NEXT_PUBLIC_NODE_ENV=="testnet" ?"https://testnet.hstk.fi/":"https://hstk.fi/") + refferal);
                axios.post((process.env.NEXT_PUBLIC_NODE_ENV=="testnet" ?"https://testnet.hstk.fi/shorten":'https://hstk.fi/shorten'), { pseudo_name:refferal,address: address })
                .then((response) => {
                  console.log(response, "response refer link"); // Log the response from the backend.
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
            }
            toast.success("Copied",{
                position: toast.POSITION.BOTTOM_RIGHT,
            })
        } catch (error:any) {
            toast.error(error,{
                position: toast.POSITION.BOTTOM_RIGHT,
            })
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
                    <InputGroup size='sm'mt="0rem" border="1px solid #676D9A" borderRight="0px" borderRadius="6px 0px 0px 6px" height="4rem" >
                    <InputLeftAddon height="60px" border="none" bg="none" color="#4D59E8" paddingInlineEnd="0">
                    {process.env.NEXT_PUBLIC_NODE_ENV=="testnet" ?"https://testnet.hstk.fi/":"https://hstk.fi/"}
                    </InputLeftAddon>
                    {exisitingLink ?
                    <Input  height="60px" border="none" color="#F0F0F5" value={exisitingLink} paddingInlineStart="0" _focus={{
                        outline: "0",
                        boxShadow: "none",
                      }}
                      onChange={handleChange}
                      />:<Input  height="60px" border="none" color="#F0F0F5" value={refferal} paddingInlineStart="0" _focus={{
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
          statsData={dataUser}
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
          statsData={dataCommunity}
          onclick={() => {
            // handleRouteChange("/v1/protocol-metrics");
          }}
          arrowHide={process.env.NEXT_PUBLIC_NODE_ENV=="testnet"?false:true}
        />
                </HStack>
            </Flex>
            {/* <HStack
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                flexDirection="row"
                width="95%"
                // pr="3rem"
                mb="1rem"
            // zIndex="1"
            >
                <HStack width="53%" mt="2rem" mr="1rem">
                    <Text
                        color="#B1B0B5"
                        fontFamily="Inter"
                        fontSize="14px"
                        fontStyle="normal"
                        fontWeight="400"
                        lineHeight="20px"
                    >
                        Lorem Ipsum is simply dummy text of the printing and typesetting
                        industry. Lorem Ipsum has been the industrys standard dummy text
                        ever since the 1500s, when an unknown printer took a galley of type
                        and scrambled it to make a type specimen book. It has survived not
                        only five centuries, but also the leap into electronic typesetting,
                        remaining essentially unchanged. It was popularised in the 1960s
                        with the release of Letraset sheets containing Lorem Ipsum passages,
                        and more recently with desktop publishing software like Aldus
                        PageMaker including versions of Lorem Ipsum. <br /><br />dummy text ever since
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
                <HStack width="47%" ml="1rem" >
                    <VStack width={"100%"}>
                      
            <HStack
 display={"flex"}
          width="100%"
                alignItems="flex-start"
                flexDirection="row"
                justifyContent="space-between"
                // pr="3rem"
                mb="1rem"
               
            // zIndex="1"
            >
            <Text
            textAlign={'left'}
            alignItems="flex-start"

            
                color=" var(--white, #FFF)"
                fontFamily="Inter"
                fontSize=" 14px"
                fontStyle=" normal"
                fontWeight=" 700"
                lineHeight=" 20px"
                letterSpacing=" -0.15px"
            >points system: Per $1 liquidity
            </Text></HStack>

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
                                <Thead width={"100%"} height={"3rem"}>
                                    <Tr width={"100%"} height="2rem">
                                        {" "}
                                        {columnItems.map((val: any, idx1: any) => (
                                            <Td
                                                key={idx1}
                                                width={idx1 <= 2 ? "15%" : "55%"}
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
                                                justifyContent="flex-end"
                                                fontWeight="400"
                                                fontSize="14px"
                                                color="#E6EDF3"
                                            >
                                                - 0.1 point if total referred liquidity is ≤$250,000. <br />
                                                - 0.2 point if total referred liquidity is $250,000.

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
                                                height="100%"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                fontWeight="400"
                                                fontSize="14px"
                                                color="#E6EDF3"
                                                width="100%"
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
                                                height="100%"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="flex-end"
                                                fontWeight="400"
                                                fontSize="14px"
                                                color="#E6EDF3"
                                                width="100%"
                                            >
                                                - 0.1 point if total referred liquidity is ≤$250,000. <br />
                                                - 0.2 point if total referred liquidity is $250,000.

                                            </Text>
                                        </Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </VStack>
                </HStack>
            </HStack> */}

            {/* <HStack
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
                <Text color="#B1B0B5"

                    font-family="Inter"
                    font-size="14px"
                    font-style="normal"
                    font-weight="400"
                    line-height="20px" >

                    Terms and conditions <br />
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </Text>
            </HStack> */}
        </PageCard>
    );
};

export default Referral;
