import useClaimStrk from '@/Blockchain/hooks/Writes/useStrkClaim'
import { getUserSTRKClaimedAmount } from '@/Blockchain/scripts/Rewards'
import { etherToWeiBN, parseAmount } from '@/Blockchain/utils/utils'
import ArrowUp from '@/assets/icons/arrowup'
import DropdownUp from '@/assets/icons/dropdownUpIcon'
import InfoIcon from '@/assets/icons/infoIcon'
import LowhealthFactor from '@/assets/icons/lowhealthFactor'
import MediumHeathFactor from '@/assets/icons/mediumHeathFactor'
import LiquidityProvisionModal from '@/components/modals/LiquidityProvision'
import SupplyModal from '@/components/modals/SupplyModal'
import TradeModal from '@/components/modals/tradeModal'
import {
  selectModalDropDowns,
  selectNavDropdowns,
  setModalDropdown,
  setNavDropdown,
} from '@/store/slices/dropdownsSlice'
import {
  selectEffectiveApr,
  selectHealthFactor,
  selectJediswapPoolAprs,
  selectOraclePrices,
  selectProtocolStats,
  selectUserDeposits,
} from '@/store/slices/readDataSlice'
import {
  selectActiveTransactions,
  selectJedistrkTokenAllocation,
  selectStrkAprData,
  selectUserUnspentLoans,
  selectnetSpendBalance,
  setActiveTransactions,
} from '@/store/slices/userAccountSlice'
import numberFormatter from '@/utils/functions/numberFormatter'
import numberFormatterPercentage from '@/utils/functions/numberFormatterPercentage'
import {
  Box,
  Button,
  HStack,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tooltip,
  Tr,
  VStack,
} from '@chakra-ui/react'
import { useAccount } from '@starknet-react/core'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import posthog from 'posthog-js'
import React, { useEffect, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import PageCard from '../pageCard'
import dataStrkRewards from '../strkDashboard/round_25.json'
import dataStrkRewardsZklend from '../strkDashboard/zkLend_25.json'
import { processAddress } from '@/Blockchain/stark-constants'
export interface ICoin {
  name: string
  symbol: string
  icon: string
}
export const Coins: ICoin[] = [
  { name: 'STRK', icon: 'mdi-strk', symbol: 'STRK' },
  { name: 'USDT', icon: 'mdi-bitcoin', symbol: 'USDT' },
  { name: 'USDC', icon: 'mdi-ethereum', symbol: 'USDC' },
  // { name: "BTC", icon: "mdi-bitcoin", symbol: "WBTC" },
  { name: 'ETH', icon: 'mdi-ethereum', symbol: 'WETH' },
]
const StrkDashboard = () => {
  const dispatch = useDispatch()
  const handleDropdownClick = (dropdownName: any) => {
    // Dispatches an action called setModalDropdown with the dropdownName as the payload
    dispatch(setNavDropdown(dropdownName))
  }
  const navDropdowns = useSelector(selectModalDropDowns)
  const activeModal = Object.keys(navDropdowns).find(
    (key) => navDropdowns[key] === true
  )
  const userLoans = useSelector(selectUserUnspentLoans)
  const columnItems = [
    'Borrow ID',
    'Borrowed',
    'Effective APR',
    'LTV',
    'Health factor',
  ]
  const [showWarning, setShowWarning] = useState(true)
  const [currentBorrow, setCurrentBorrow] = useState(-1)
  const [selectedDapp, setSelectedDapp] = useState('')
  const [tradeNote, setTradeNote] = useState(false)
  const handleClick = () => {
    //   onClick={setShowWarning(() => false)}
    setShowWarning(false)
  }
  const oraclePrices = useSelector(selectOraclePrices)
  const reduxProtocolStats = useSelector(selectProtocolStats)
  // const avgs = useSelector(selectAprAndHealthFactor);
  const avgs = useSelector(selectEffectiveApr)
  const avgsLoneHealth = useSelector(selectHealthFactor)
  const [ltv, setLtv] = useState<any>([])
  const [borrowId, setborrowId] = useState('Select Existing borrow')
  const [currentPool, setcurrentPool] = useState('Select a pool')
  const [hashstackStrkReward, setHashstackStrkReward] = useState<number>()

  const [borrowIDCoinMap, setBorrowIDCoinMap] = useState([])
  const [currentBorrowData, setcurrentBorrowData] = useState()
  const [borrowIds, setBorrowIds] = useState([])
  const [currentId, setCurrentId] = useState('')
  const [currentMarketCoin, setCurrentMarketCoin] = useState('')
  const [currentSwap, setCurrentSwap] = useState('')
  const [borrowAmount, setBorrowAmount] = useState<number>(0)
  const [coins, setCoins] = useState([])
  const [currentPagination, setCurrentPagination] = useState<number>(1)
  const [tabIndex, setTabIndex] = useState(0)
  const [selectedIndex, setselectedIndex] = useState(0)
  const [currentLoanAmount, setCurrentLoanAmount] = useState('')
  const [currentLoanMarket, setCurrentLoanMarket] = useState('')
  const [borrowAPRs, setBorrowAPRs] = useState<any>([])
  const [currentBorrowAPR, setCurrentBorrowAPR] = useState<number>(0)
  const [currentSupplyAPR, setCurrentSupplyAPR] = useState<number>(0)
  const [collateralCoin, setcollateralCoin] = useState('')
  const [poolNumber, setpoolNumber] = useState(false)
  const [currentBorrowMarketCoin, setCurrentBorrowMarketCoin] = useState('BTC')
  const coin = { name: 'USDC', icon: 'mdi-ethereum', symbol: 'USDC' }
  const [supplyAPRs, setSupplyAPRs]: any = useState<(undefined | number)[]>([])
  const [validRTokens, setValidRTokens] = useState([])
  const userDeposits = useSelector(selectUserDeposits)
  const { account,address } = useAccount()
  const poolApr = useSelector(selectJediswapPoolAprs)
  const strkTokenAlloactionData = useSelector(selectJedistrkTokenAllocation)
  const strkData = useSelector(selectStrkAprData)
  const [uniqueID, setUniqueID] = useState(0)
  const getUniqueId = () => uniqueID
  const [toastId, setToastId] = useState<any>()
  const [strkRewards, setstrkRewards] = useState<any>()
  const [totalStrkRewards, settotalStrkRewards] = useState<any>()
  const [strkRewardsZklend, setstrkRewardsZklend] = useState<any>()
  const [strkClaimedRewards, setstrkClaimedRewards] = useState<any>()
  const router = useRouter()
  let activeTransactions = useSelector(selectActiveTransactions)
  const {
    round,
    setRound,
    strkAmount,
    setstrkAmount,
    proof,
    setProof,
    datastrkClaim,
    errorstrkClaim,
    resetstrkClaim,
    writestrkClaim,
    writeAsyncstrkClaim,
    isErrorstrkClaim,
    isIdlestrkClaim,
    isSuccessstrkClaim,
    statusstrkClaim,
  } = useClaimStrk()

  useEffect(() => {
    const fetchClaimedBalance = async () => {
      if (address) {
        const data: any = await getUserSTRKClaimedAmount(processAddress(address))
        const dataAmount: any = (dataStrkRewards as any)[processAddress(address)]
        if (dataAmount) {
          setstrkAmount(dataAmount?.amount)
          setProof(dataAmount?.proofs)
          setstrkRewards(parseAmount(String(dataAmount?.amount), 18) - data)
          settotalStrkRewards(parseAmount(String(dataAmount?.amount), 18))
          if(data){
            setstrkClaimedRewards(data)
          }else{
            setstrkClaimedRewards(0);
          }
        } else {
          if(data){
            setstrkClaimedRewards(data)
          }else{
            setstrkClaimedRewards(0);
          }
          setstrkRewards(0)
          settotalStrkRewards(0)
        }
      }
    }
    fetchClaimedBalance()
  }, [address])

  useEffect(() => {
    const fetchstrkrewards = async () => {
      if (address) {
        const dataAmount: any = (dataStrkRewards as any)[processAddress(address)]
        const matchedUser = dataStrkRewardsZklend.find(
          (userObj) => userObj.user === processAddress(address)
        )
        if (dataAmount && !matchedUser) {
          setHashstackStrkReward(
            parseAmount(String(BigInt(dataAmount.amount)), 18)
          )
          setstrkRewardsZklend(0)
        } else if (matchedUser && dataAmount) {
          setstrkRewardsZklend(parseAmount(String(matchedUser?.strk), 18))
          setHashstackStrkReward(
            parseAmount(
              String(BigInt(dataAmount.amount) - BigInt(matchedUser?.strk)),
              18
            )
          )
        } else {
          setstrkRewardsZklend(0)
          setHashstackStrkReward(0)
        }
      }
    }
    if (address) {
      fetchstrkrewards()
    }
  }, [address])

  const handleClaimStrk = async () => {
    try {
      const getTokens = await writeAsyncstrkClaim()
      posthog.capture('Claim Strk', {
        'Clicked Claim': true,
      })
      if (getTokens?.transaction_hash) {
        const toastid = toast.info(
          // `Please wait, your transaction is running in background ${coin} `,
          `Transaction pending`,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: false,
          }
        )
        setToastId(toastId)
        if (!activeTransactions) {
          activeTransactions = [] // Initialize activeTransactions as an empty array if it's not defined
        } else if (
          Object.isFrozen(activeTransactions) ||
          Object.isSealed(activeTransactions)
        ) {
          // Check if activeTransactions is frozen or sealed
          activeTransactions = activeTransactions.slice() // Create a shallow copy of the frozen/sealed array
        }
        const uqID = getUniqueId()
        const trans_data = {
          transaction_hash: getTokens?.transaction_hash.toString(),
          message: `Successfully Claimed STRKToken`,
          // message: `Transaction successful`,
          toastId: toastid,
          setCurrentTransactionStatus: () => {},
          uniqueID: uqID,
        }
        // addTransaction({ hash: deposit?.transaction_hash });
        posthog.capture('Get Tokens Status', {
          Status: 'Success',
        })
        activeTransactions?.push(trans_data)

        dispatch(setActiveTransactions(activeTransactions))
      }
      // console.log(getTokens)
      // dispatch(setTransactionStatus("success"));
    } catch (err: any) {
      console.log(err)
      // dispatch(setTransactionStatus("failed"));
      posthog.capture('Get Claim Status', {
        Status: 'Failure',
      })
      // dispatch(setTransactionStartedAndModalClosed(true));
      const toastContent = (
        <div>
          Failed to Claim $STRK
          <CopyToClipboard text={err}>
            <Text as="u">copy error!</Text>
          </CopyToClipboard>
        </div>
      )
      toast.error(toastContent, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      })
    }
  }


  // useEffect(()=>{
  //   try{
  //     const fetchEstimatedClaim=async()=>{
  //       const today = new Date();
  //       const year = today.getFullYear();
  //       const month = String(today.getMonth() + 1).padStart(2, '0');
  //       const day = String(today.getDate()).padStart(2, '0');

  //       const formattedDate = `${year}-${month}-${day}`;
  //       const res=await axios.get(`https://hyena-social-oarfish.ngrok-free.app/api/defi-spring/alloc/${address}/2/${formattedDate}`)
  //       console.log(res,"data")
  //     }
  //     if(address){
  //       fetchEstimatedClaim();
  //     }
  //   }catch(err){
  //     console.log(err,'err in estimate strk')
  //   }
  // },[address])

  const getStrkAlloaction = (pool: any) => {
    try {
      if (strkTokenAlloactionData[pool]) {
        return strkTokenAlloactionData[pool][
          strkTokenAlloactionData[pool].length - 1
        ]?.allocation
      } else {
        return 0
      }
    } catch (err) {
      return 0
    }
  }

  const getAprByPool = (dataArray: any[], pool: string, dapp: string) => {
    const matchedObject = dataArray.find((item) => {
      if (item.name === 'USDT/USDC') {
        return (
          item.amm ===
            (dapp == 'Select a dapp'
              ? 'jedi'
              : dapp == 'Jediswap'
                ? 'jedi'
                : 'myswap') && 'USDC/USDT' === pool
        )
      } else if (item.name == 'ETH/STRK') {
        return (
          item.amm ===
            (dapp == 'Select a dapp'
              ? 'jedi'
              : dapp == 'Jediswap'
                ? 'jedi'
                : 'myswap') && 'STRK/ETH' === pool
        )
      } else if (item.name === 'ETH/DAI') {
        return (
          item.amm ===
            (dapp == 'Select a dapp'
              ? 'jedi'
              : dapp == 'Jediswap'
                ? 'jedi'
                : 'myswap') && 'DAI/ETH' === pool
        )
      } else {
        return (
          item.name === pool &&
          item.amm ===
            (dapp == 'Select a dapp'
              ? 'jedi'
              : dapp == 'Jediswap'
                ? 'jedi'
                : 'myswap')
        )
      }
    })

    return matchedObject ? matchedObject.apr * 100 : 0
  }
  const getTvlByPool = (dataArray: any[], pool: string, dapp: string) => {
    const matchedObject = dataArray.find((item) => {
      if (item.name === 'USDT/USDC') {
        return (
          item.amm ===
            (dapp == 'Select a dapp'
              ? 'jedi'
              : dapp == 'Jediswap'
                ? 'jedi'
                : 'myswap') && 'USDC/USDT' === pool
        )
      } else if (item.name == 'ETH/STRK') {
        return (
          item.amm ===
            (dapp == 'Select a dapp'
              ? 'jedi'
              : dapp == 'Jediswap'
                ? 'jedi'
                : 'myswap') && 'STRK/ETH' === pool
        )
      } else if (item.name === 'ETH/DAI') {
        return (
          item.amm ===
            (dapp == 'Select a dapp'
              ? 'jedi'
              : dapp == 'Jediswap'
                ? 'jedi'
                : 'myswap') && 'DAI/ETH' === pool
        )
      } else {
        return (
          item.name === pool &&
          item.amm ===
            (dapp == 'Select a dapp'
              ? 'jedi'
              : dapp == 'Jediswap'
                ? 'jedi'
                : 'myswap')
        )
      }
    })

    return matchedObject ? matchedObject.tvl : 0
  }
  useEffect(() => {
    if (validRTokens.length === 0) {
      fetchUserDeposits()
    }
  }, [userDeposits, validRTokens, address])

  const fetchUserDeposits = async () => {
    try {
      if (!account || userDeposits?.length <= 0) return
      // const reserves = await getUserDeposits(address as string);
      const reserves = userDeposits
      ////console.log("got reservers", reserves);

      const rTokens: any = []
      if (reserves) {
        reserves.map((reserve: any) => {
          if (reserve.rTokenFreeParsed > 0) {
            rTokens.push({
              rToken: reserve.rToken,
              rTokenAmount: reserve.rTokenFreeParsed,
            })
          }
        })
      }
      ////console.log("rtokens", rTokens);
      if (rTokens.length === 0) return
      setValidRTokens(rTokens)
      ////console.log("valid rtoken", validRTokens);
      ////console.log("market page -user supply", reserves);
    } catch (err) {
      ////console.log("Error fetching protocol reserves", err);
    }
  }
  useEffect(() => {
    fetchProtocolStats()
  }, [reduxProtocolStats])

  const fetchProtocolStats = async () => {
    try {
      const stats = reduxProtocolStats
      ////console.log("fetchprotocolstats", stats); //23014
      setBorrowAPRs([
        stats?.[5]?.borrowRate,
        stats?.[2]?.borrowRate,
        stats?.[3]?.borrowRate,
        stats?.[0]?.borrowRate,
        stats?.[1]?.borrowRate,
        stats?.[4]?.borrowRate,
      ])
      setSupplyAPRs([
        stats?.[5].supplyRate,
        stats?.[2].supplyRate,
        stats?.[3].supplyRate,
        stats?.[1].supplyRate,
        stats?.[0].supplyRate,
        stats?.[4].supplyRate,
      ])
    } catch (error) {
      //console.log("error on getting protocol stats");
    }
  }
  useEffect(() => {
    if (userLoans) {
      let temp1: any = []
      let temp2: any = []
      let temp3: any = []
      let healths: any = []
      if (userLoans?.length != 0) {
        for (let i = 0; i < userLoans?.length; i++) {
          // const factor=await getExistingLoanHealth(userLoans[i]?.loanId)
          // healths.push({
          //   id:userLoans[i]?.loanId,
          //   apr:factor
          // });
          temp1.push({
            id: userLoans[i]?.loanId,
            name: userLoans[i]?.loanMarket,
          })
          temp2.push(userLoans[i]?.loanId)
          temp3.push(userLoans[i]?.loanMarket)
        }
      }
      setBorrowIDCoinMap(temp1)
      setBorrowIds(temp2)
      setCoins(temp3)
      if (
        userLoans?.length <= (currentPagination - 1) * 3 &&
        currentPagination > 1
      ) {
        setCurrentPagination(currentPagination - 1)
      }
      ////console.log("faisal coin mapping", borrowIDCoinMap);
    }
  }, [userLoans])

  useEffect(() => {
    if (userLoans && oraclePrices) {
      const ltv_ratio = []
      for (const loan of userLoans) {
        const loan_ltv1 =
          loan?.currentLoanAmountParsed *
          oraclePrices?.find((val: any) => val?.name == loan?.underlyingMarket)
            ?.price
        const loan_ltv2 =
          loan?.collateralAmountParsed *
          oraclePrices?.find(
            (val: any) =>
              val?.name ==
              (loan?.collateralMarket[0] == 'r'
                ? loan?.collateralMarket.slice(1)
                : loan?.collateralMarket)
          )?.price
        ltv_ratio.push([
          loan?.loanId,
          // loan_ltv1,
          // loan_ltv2,
          loan_ltv1 / loan_ltv2,
        ])
      }
      setLtv(ltv_ratio)
      ////console.log("spendtable ltv ", ltv);
    }
  }, [userLoans, oraclePrices])
  const rewardPools = ['STRK/ETH', 'USDC/USDT', 'ETH/USDC']
  return (
    <VStack
      w="95%"
      h="30%"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      mt="1rem"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection="row"
        width="100%"
      >
        <Box display="flex">
          <Text fontSize="26px" color="white" fontWeight="600">
            Participate in a
          </Text>
          <Text fontSize="26px" color="#7956EC" fontWeight="600" ml="0.5rem">
            90M $STRK
          </Text>
          <Text fontSize="26px" color="white" fontWeight="600" ml="0.5rem">
            Incentive Program!
          </Text>
        </Box>
        <Box display="flex" gap="2rem" mr="1rem">
          <Box gap="0.2rem">
            <Text fontSize="14px" fontWeight="400" color="#B1B0B5">
              Total STRK Reward
            </Text>
            <Tooltip
              hasArrow
              label={
                <Box>
                  <Box display="flex" justifyContent="space-between" gap={3}>
                    <Text>Hashstack Rewards:</Text>
                    <Text>{numberFormatter(hashstackStrkReward)} STRK</Text>
                  </Box>
                  <Box display="flex" justifyContent="space-between" gap={3}>
                    <Text>ZKlend Rewards:</Text>
                    <Text>{numberFormatter(strkRewardsZklend)} STRK</Text>
                  </Box>
                </Box>
              }
              placement={'bottom'}
              rounded="md"
              boxShadow="dark-lg"
              bg="#02010F"
              fontSize={'13px'}
              fontWeight={'400'}
              borderRadius={'lg'}
              padding={'2'}
              color="#F0F0F5"
              border="1px solid"
              borderColor="#23233D"
              arrowShadowColor="#676D9A4D"
              // maxW="222px"
              // mt="28px"
            >
              {totalStrkRewards == null ? (
                <Skeleton
                  width="6rem"
                  height="1.2rem"
                  startColor="#101216"
                  endColor="#2B2F35"
                  borderRadius="6px"
                />
              ) : (
                <Text
                  fontSize="16px"
                  fontWeight="500"
                  color="white"
                  textAlign="left"
                >
                  {numberFormatter(totalStrkRewards)} STRK
                </Text>
              )}
            </Tooltip>
          </Box>
          {strkRewards>=0 &&<Box gap="0.2rem">
            <Text fontSize="14px" fontWeight="400" color="#B1B0B5">
              Claimed STRK Reward
            </Text>
            <Tooltip
              hasArrow
              label={''}
              placement={'bottom'}
              rounded="md"
              boxShadow="dark-lg"
              bg="#02010F"
              fontSize={'13px'}
              fontWeight={'400'}
              borderRadius={'lg'}
              padding={'2'}
              color="#F0F0F5"
              border="1px solid"
              borderColor="#23233D"
              arrowShadowColor="#676D9A4D"
              textAlign="left"
              // maxW="222px"
              // mt="28px"
            >
              {strkClaimedRewards == null ? (
                <Skeleton
                  width="6rem"
                  height="1.2rem"
                  startColor="#101216"
                  endColor="#2B2F35"
                  borderRadius="6px"
                />
              ) : (
                <Text
                  fontSize="16px"
                  fontWeight="500"
                  color="white"
                  textAlign="left"
                >
                  {numberFormatter(strkClaimedRewards)} STRK
                </Text>
              )}
            </Tooltip>
          </Box>}
          <Button
            height={'2rem'}
            fontSize={'12px'}
            mt="0.5rem"
            padding="6px 12px"
            border="1px solid #BDBFC1"
            color="#BDBFC1"
            bgColor="transparent"
            // isDisabled={strkRewards == 0 ? true : false}
            _disabled={{
              color: '#2B2F35',
              bgColor: '#101216',
              border: '1px solid #2B2F35',
              _hover: { bgColor: '#101216', color: '#2B2F35' },
            }}
            _hover={{
              bgColor: 'white',
              color: 'black',
            }}
            fontWeight="semibold"
            borderRadius={'6px'}
            isDisabled={strkRewards<=0}
            onClick={() => {
              if (strkRewards <= 0) {
              } else {
                handleClaimStrk()
              }
            }}
          >
            Claim
          </Button>
        </Box>
      </Box>
      <Box
        mt="1rem"
        background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
        width="100%"
        // height={"37rem"}
        borderRadius="8px"
        padding="32px"
      >
        <Box>
          <Text
            fontWeight="500"
            fontSize="16px"
            color="white"
            lineHeight="30px"
          >
            Spending pools
          </Text>
          <Text fontSize="12px" fontWeight="400" color="#BDBFC1" mt="0.4rem">
            Spend your borrowed funds on these Jediswap pools to receive the
            rewards.
          </Text>
          {userLoans?.length > 0 && (
            <Box display="flex" mt="2rem">
              <Text fontSize="12px" fontWeight="400" color="#BDBFC1">
                Exisiting Borrow
              </Text>
              <Box mt="0.25rem" ml="0.2rem" cursor="pointer">
                <InfoIcon />
              </Box>
            </Box>
          )}

          {userLoans?.length > 0 && (
            <Box
              display="flex"
              bg="#34345633"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              justifyContent="space-between"
              py="2"
              pl="3"
              pr="3"
              mb="1rem"
              mt="0.3rem"
              borderRadius="md"
              className="navbar"
              cursor="pointer"
              onClick={() => {
                dispatch(setModalDropdown('borrowDropdown'))
              }}
            >
              <Box display="flex" gap="1">
                <Text color="white">{borrowId}</Text>
              </Box>

              <Box pt="1" className="navbar-button">
                {activeModal ? <ArrowUp /> : <DropdownUp />}
              </Box>
              {navDropdowns.borrowDropdown && (
                <Box
                  w="full"
                  left="0"
                  bg="#03060B"
                  border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                  py="2"
                  className="dropdown-container"
                  boxShadow="dark-lg"
                >
                  <TableContainer
                    //   bg="#101216"
                    // py="6"
                    color="white"
                    //   h="283px"
                    borderRadius="md"
                    w="100%"
                    // px="3"
                    p="2rem 1rem 24px"
                  >
                    <Table variant="unstyled">
                      {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                      <Thead width={'100%'}>
                        <Tr width={'100%'} height="2rem">
                          {columnItems.map((val: any, idx1: any) => (
                            <Td
                              key={idx1}
                              width={'12.5%'}
                              fontSize={'12px'}
                              fontWeight={400}
                              p={0}
                              // bgColor="red"
                            >
                              <Text
                                whiteSpace="pre-wrap"
                                overflowWrap="break-word"
                                width={'100%'}
                                height={'2rem'}
                                fontSize="12px"
                                textAlign={
                                  idx1 == 0
                                    ? 'left'
                                    : idx1 == columnItems.length - 1
                                      ? 'right'
                                      : 'center'
                                }
                                pl={idx1 == 0 ? '3rem' : 0}
                                pr={idx1 == columnItems.length - 1 ? 35 : 0}
                                color={'#BDBFC1'}
                                cursor="context-menu"
                              >
                                <Tooltip
                                  hasArrow
                                  // label={'df'}
                                  placement={
                                    (idx1 === 0 && 'bottom-start') ||
                                    (idx1 === columnItems.length - 1 &&
                                      'bottom-end') ||
                                    'bottom'
                                  }
                                  rounded="md"
                                  boxShadow="dark-lg"
                                  bg="#02010F"
                                  fontSize={'13px'}
                                  fontWeight={'400'}
                                  borderRadius={'lg'}
                                  padding={'2'}
                                  color="#F0F0F5"
                                  border="1px solid"
                                  borderColor="#23233D"
                                  arrowShadowColor="#676D9A4D"
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

                      <Tbody bg="inherit" position="relative">
                        {userLoans.map((borrow: any, index: number) => {
                          return (
                            <>
                              <Tr
                                _hover={{
                                  // backgroundColor: "#676D9A4D",
                                  // width: "80%",
                                  borderRadius: '0px',
                                }}
                                position="relative"
                                height="4rem"
                                key={borrow.idx}
                                cursor="pointer"
                                bgColor={
                                  currentBorrow == borrow.loanId
                                    ? '#676D9A4D'
                                    : 'none '
                                }
                                // bgColor="green"
                                onClick={() => {
                                  setSelectedDapp('trade')
                                  setCurrentBorrow(borrow.loanId)
                                  setcurrentBorrowData(borrow)
                                  setcollateralCoin(borrow?.collateralMarket)
                                  setBorrowAmount(
                                    borrow.currentLoanAmountParsed
                                  )
                                  setCurrentMarketCoin(borrow.currentLoanMarket)
                                  setCurrentLoanAmount(
                                    borrow?.currentLoanAmount
                                  )
                                  setCurrentLoanMarket(
                                    borrow?.currentLoanMarket
                                  )
                                  setCurrentMarketCoin(borrow.currentLoanMarket)
                                  setCurrentId('ID - ' + borrow.loanId)
                                  setborrowId('Borrow ID ' + borrow?.loanId)
                                  //   setcurrentBorrowData(borrow)
                                  //   setCurrentBorrow(borrow.loanId);
                                  //   setBorrowAmount(borrow.currentLoanAmountParsed);
                                  //   setCurrentId("ID - " + borrow.loanId);
                                  //   setCurrentMarketCoin(borrow.currentLoanMarket);
                                  //   dispatch(setSpendBorrowSelectedDapp("trade"));
                                  //   setCurrentLoanAmount(borrow?.currentLoanAmount);
                                  //   setCurrentLoanMarket(borrow?.currentLoanMarket);
                                }}
                              >
                                <Td borderLeftRadius="6px" pl="3rem">
                                  <Box
                                    position="absolute"
                                    height="24px"
                                    width="4px"
                                    // borderRadius="6px"
                                    bgColor="#676D9A4D"
                                    left={-2}
                                    display={
                                      currentBorrow == borrow.loanId
                                        ? 'block'
                                        : 'none'
                                    }
                                  />
                                  <Box
                                    display="flex"
                                    gap="2"
                                    // bgColor="blue"
                                    justifyContent="flex-start"
                                  >
                                    <Text
                                      fontSize="14px"
                                      fontWeight="400"
                                      fontStyle="normal"
                                      lineHeight="22px"
                                      color="#E6EDF3"
                                      textAlign="left"
                                    >
                                      {`Borrow ID${
                                        borrow.loanId < 10
                                          ? '0' + borrow.loanId
                                          : borrow.loanId
                                      }`}{' '}
                                    </Text>
                                  </Box>
                                </Td>
                                <Td textAlign="center">
                                  <Box
                                    display="flex"
                                    gap="1"
                                    justifyContent="center"
                                    h="full"
                                    alignItems="center"
                                  >
                                    <Box my="1">
                                      <Image
                                        src={`/${borrow.currentLoanMarket}.svg`}
                                        alt="Picture of the author"
                                        width={16}
                                        height={16}
                                      />
                                    </Box>
                                    <Text
                                      fontSize="14px"
                                      fontWeight="400"
                                      fontStyle="normal"
                                      lineHeight="22px"
                                      color="#E6EDF3"
                                    >
                                      d{borrow.currentLoanMarket}
                                    </Text>
                                  </Box>
                                </Td>
                                <Td
                                  textAlign="center"
                                  color="#E6EDF3"
                                  fontSize="14px"
                                  fontWeight="400"
                                  fontStyle="normal"
                                  lineHeight="22px"
                                >
                                  {avgs?.find(
                                    (item: any) =>
                                      item?.loanId == borrow?.loanId
                                  )?.avg
                                    ? avgs?.find(
                                        (item: any) =>
                                          item?.loanId == borrow?.loanId
                                      )?.avg
                                    : '3.2'}
                                  %
                                </Td>
                                <Td textAlign="center">
                                  <Box
                                    display="flex"
                                    gap="2"
                                    justifyContent="center"
                                    h="full"
                                    alignItems="center"
                                  >
                                    <Text
                                      fontSize="14px"
                                      fontWeight="400"
                                      fontStyle="normal"
                                      lineHeight="22px"
                                      color="#E6EDF3"
                                    >
                                      {oraclePrices
                                        ? ltv
                                            ?.find(
                                              (val: any) =>
                                                val?.[0] == borrow?.loanId
                                            )?.[1]
                                            ?.toFixed(3)
                                        : '-'}
                                    </Text>
                                  </Box>
                                </Td>
                                <Td p={0} borderRightRadius="6px">
                                  <Box
                                    display="flex"
                                    // gap="2"
                                    // bgColor="blue"
                                    justifyContent="flex-end"
                                    pr="40px"
                                    // pl="30px"
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
                                            Health Factor :{' '}
                                            {
                                              avgsLoneHealth?.find(
                                                (item: any) =>
                                                  item?.loanId == borrow?.loanId
                                              )?.loanHealth
                                            }
                                            <br />
                                            Liquidates below : 1.06
                                          </Box>
                                        }
                                        // arrowPadding={-5420}
                                        placement="bottom"
                                        rounded="md"
                                        boxShadow="dark-lg"
                                        bg="#02010F"
                                        fontSize={'13px'}
                                        fontWeight={'400'}
                                        borderRadius={'lg'}
                                        padding={'2'}
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
                                          (item: any) =>
                                            item?.loanId == borrow?.loanId
                                        )?.loanHealth ? (
                                          avgsLoneHealth?.find(
                                            (item: any) =>
                                              item?.loanId == borrow?.loanId
                                          )?.loanHealth
                                        ) : (
                                          <Skeleton
                                            width="6rem"
                                            height="1.2rem"
                                            startColor="#101216"
                                            endColor="#2B2F35"
                                            borderRadius="6px"
                                          />
                                        )}
                                      </Tooltip>
                                    </Box>
                                  </Box>
                                </Td>
                              </Tr>
                            </>
                          )
                        })}
                        {/* {(() => {
                const rows2 = [];
                for (
                  let i: number = 0;
                  i < 3 - (upper_bound - lower_bound + 1);
                  i++
                ) {
                  rows2.push(<Tr height="4rem"></Tr>);
                }
                return rows2;
              })()} */}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          )}
          <Box display="flex" gap="1.5rem" mt="2rem">
            {rewardPools.map((pool: string, idx: number) => (
              <Box
                key={idx}
                bg="#34345633"
                paddingX="2rem"
                paddingY="2rem"
                borderRadius="8px"
                justifyContent="center"
                textAlign="center"
                onClick={() => {
                  setcurrentPool(pool)
                }}
              >
                <Box display="flex" width="100%" justifyContent="center">
                  <Image
                    src={`/${pool.split('/')[0]}.svg`}
                    alt="Picture of the author"
                    width="32"
                    height="32"
                  />
                  <Image
                    src={`/${pool.split('/')[1]}.svg`}
                    alt="Picture of the author"
                    width="32"
                    height="32"
                  />
                </Box>
                <Box mt="0.5rem">
                  <Text fontWeight="500" fontSize="16px" color="white">
                    {pool}
                  </Text>
                </Box>
                <Box display="flex" justifyContent="center" mt="0.5rem" gap="0.8rem" width="150px">
                  <Text fontSize="10px" color="#BDBFC1" fontWeight="400">
                    Pool APR:{' '}
                    {numberFormatterPercentage(
                      getAprByPool(poolApr, pool, 'Jediswap')
                    )}
                    %
                  </Text>
                  {/* <Text fontSize="10px" color="#BDBFC1" fontWeight="400">
                    $STRK APR:{' '}
                    {numberFormatterPercentage(
                      String(
                        (100 *
                          365 *
                          (getStrkAlloaction(pool) *
                            oraclePrices?.find(
                              (curr: any) => curr.name === 'STRK'
                            )?.price)) /
                          getTvlByPool(poolApr, pool, 'Jediswap')
                      )
                    )}
                    %
                  </Text> */}
                </Box>
                <Box
                  mt="0.5rem"
                  onClick={() => {
                    setpoolNumber(!poolNumber)
                  }}
                >
                  {userLoans?.length > 0 ? (
                    borrowId === 'Select Existing borrow' ? (
                      <Button
                        cursor="pointer"
                        height={'2rem'}
                        fontSize={'12px'}
                        mt="0.5rem"
                        padding="6px 12px"
                        bg="linear-gradient(to right, #7956EC,#1B29AE);"
                        _hover={{ bg: 'white', color: 'black' }}
                        borderRadius={'6px'}
                        color="white"
                        onClick={() => {
                          const toastContent = (
                            <div>
                              Select Loan to Spend{' '}
                              <CopyToClipboard text="Enter Loan ID">
                                <Text as="u">copy error!</Text>
                              </CopyToClipboard>
                            </div>
                          )
                          toast.error(toastContent, {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: false,
                          })
                        }}
                      >
                        Spend
                      </Button>
                    ) : (
                      <LiquidityProvisionModal
                        borrowIDCoinMap={borrowIDCoinMap}
                        coins={coins}
                        borrow={currentBorrowData}
                        borrowIds={borrowIds}
                        currentId={currentId}
                        currentMarketCoin={currentMarketCoin}
                        BorrowBalance={borrowAmount}
                        currentSwap={currentSwap}
                        setCurrentSwap={setCurrentSwap}
                        currentLoanAmount={currentLoanAmount}
                        currentLoanMarket={currentLoanMarket}
                        setCurrentLoanAmount={setCurrentLoanAmount}
                        setCurrentLoanMarket={setCurrentLoanMarket}
                        borrowAPRs={borrowAPRs}
                        currentSelectedDapp={'Jediswap'}
                        currentSelectedPool={pool}
                        poolNumber={poolNumber}
                        collateralMarket={collateralCoin}
                      />
                    )
                  ) : (
                    <TradeModal
                      coin={coin}
                      borrowAPRs={borrowAPRs}
                      currentBorrowAPR={currentBorrowAPR}
                      supplyAPRs={supplyAPRs}
                      currentSupplyAPR={currentSupplyAPR}
                      setCurrentBorrowAPR={setCurrentBorrowAPR}
                      validRTokens={validRTokens}
                      currentBorrowMarketCoin={currentBorrowMarketCoin}
                      currentSelectedDapp={'Jediswap'}
                      currentSelectedPool={pool}
                      poolNumber={poolNumber}
                    />
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box
        mt="2rem"
        background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
        width="100%"
        // height={"37rem"}
        borderRadius="8px"
        padding="32px"
      >
        <Box>
          <Text
            fontWeight="500"
            fontSize="16px"
            color="white"
            lineHeight="30px"
          >
            Supply Markets
          </Text>
          <Text fontSize="12px" fontWeight="400" color="#BDBFC1" mt="0.4rem">
            Supply your funds on these markets to receive the rewards.
          </Text>
          <Box display="flex" gap="1.5rem" mt="2rem">
            {Coins.map((supplyCoin: any, idx: number) => (
              <Box
                key={idx}
                bg="#34345633"
                paddingX="2rem"
                paddingY="2rem"
                borderRadius="8px"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
              >
                <Box display="flex" width="100%" justifyContent="center">
                  <Image
                    src={
                      supplyCoin?.name == 'DAI'
                        ? `/${supplyCoin?.name}Disabled.svg`
                        : `/${supplyCoin?.name}.svg`
                    }
                    alt={`Picture of the supplyCoin that I want to access ${supplyCoin?.name}`}
                    width="32"
                    height="32"
                  />
                </Box>
                <Box mt="0.5rem">
                  <Text fontWeight="500" fontSize="16px" color="white">
                    {supplyCoin?.name}
                  </Text>
                </Box>
                <Box display="flex" mt="0.5rem" gap="0.8rem">
                  <Text fontSize="10px" color="#BDBFC1" fontWeight="400">
                    Supply APR: {numberFormatterPercentage(supplyAPRs[idx])}%
                  </Text>
                  <Text fontSize="10px" color="#BDBFC1" fontWeight="400">
                    $STRK APR:{' '}
                    {numberFormatterPercentage(
                      strkData
                        ? (365 *
                            100 *
                            strkData[supplyCoin?.name][
                              strkData[supplyCoin?.name].length - 1
                            ]?.allocation *
                            0.7 *
                            oraclePrices?.find(
                              (curr: any) => curr.name === 'STRK'
                            )?.price) /
                            strkData[supplyCoin?.name][
                              strkData[supplyCoin?.name].length - 1
                            ]?.supply_usd
                        : 0
                    )}
                    {/* {numberFormatterPercentage(
                      String(
                        (100 *
                          365 *
                          (getStrkAlloaction(pool) *
                            oraclePrices?.find(
                              (curr: any) => curr.name === "STRK"
                            )?.price)) /
                        getTvlByPool(poolApr, pool, "Jediswap")
                      )
                    )} */}
                    %
                  </Text>
                </Box>
                <Box
                  mt="1rem"
                  color="white"
                  onClick={() => {
                    if (idx == 3) {
                      setCurrentSupplyAPR(idx + 1)
                    } else {
                      setCurrentSupplyAPR(idx)
                    }
                  }}
                >
                  <SupplyModal
                    buttonText="Supply"
                    cursor="pointer"
                    height={'2rem'}
                    fontSize={'12px'}
                    mt="0.5rem"
                    padding="6px 12px"
                    bg="linear-gradient(to right, #7956EC,#1B29AE);"
                    _hover={{ bg: 'white', color: 'black' }}
                    borderRadius={'6px'}
                    color="white"
                    backGroundOverLay="rgba(244, 242, 255, 0.5)"
                    coin={supplyCoin}
                    supplyAPRs={supplyAPRs}
                    currentSupplyAPR={currentSupplyAPR}
                    setCurrentSupplyAPR={setCurrentSupplyAPR}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </VStack>
  )
}

export default StrkDashboard
