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
} from '@chakra-ui/react'
import { useAccount } from '@starknet-react/core'
import Image from 'next/image'
import posthog from 'posthog-js'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { ILoan } from '@/Blockchain/interfaces/interfaces'
import ExpandedCoinIcon from '@/assets/expanded/ExpandedCoins'
import ExpandedMarketIcon from '@/assets/expanded/ExpandedMarket'
import DollarActiveRadioButton from '@/assets/icons/dollarActiveRadioButton'
import DollarNonActiveRadioButton from '@/assets/icons/dollarNonActiveRadioButton'
import LowhealthFactor from '@/assets/icons/lowhealthFactor'
import MediumHeathFactor from '@/assets/icons/mediumHeathFactor'
import BorrowModal from '@/components/modals/borrowModal'
import YourBorrowModal from '@/components/modals/yourBorrowModal'
import {
  selectEffectiveApr,
  selectHealthFactor,
  selectJediswapPoolAprs,
  selectOraclePrices,
  selectProtocolStats,
  selectUserDeposits,
  selectUserLoans,
  selectZklendSpends,
} from '@/store/slices/readDataSlice'
import {
  selectBorrowEffectiveAprs,
  selectJedistrkTokenAllocation,
  selectMySplit,
  selectStrkAprData,
  selectnetSpendBalance,
} from '@/store/slices/userAccountSlice'
import dollarConvertor from '@/utils/functions/dollarConvertor'
import numberFormatter from '@/utils/functions/numberFormatter'
import numberFormatterPercentage from '@/utils/functions/numberFormatterPercentage'
import TableInfoIcon from '../table/tableIcons/infoIcon'
import { getZklendusdSpendValue } from '@/Blockchain/scripts/l3interaction'

export interface ICoin {
  name: string
  symbol: string
  icon: string
}

interface BorrowDashboardProps {
  width: string
  currentPagination: any
  setCurrentPagination: any
  Coins: any
  columnItems: any
  Borrows: ILoan[]
  userLoans: any
}

const tooltips = [
  'A unique ID number assigned to a specific borrow within the protocol.',
  'The unit of tokens borrowed from the protocol.',
  'The annual interest rate charged on borrowed tokens from the protocol.',
  'If positive, This is the yield earned by your loan at present. If negative, This is the interest you are paying.',
  'Collateral are the tokens held as security for borrowed amount.',
  'Shows if borrowed amount was used in other pools or dapps within the protocol.',
  'This is return you would make if you closed the loan now. ROE is Return on equity.',
  'Loan risk metric comparing collateral value to borrowed amount to check potential liquidation.',
]

const BorrowDashboard: React.FC<BorrowDashboardProps> = ({
  width,
  currentPagination,
  Coins,
  setCurrentPagination,
  columnItems,
}) => {
  const [borrowIDCoinMap, setBorrowIDCoinMap] = useState([])
  const [borrowIds, setBorrowIds] = useState([])
  const [borrowAmount, setBorrowAmount] = useState<number>(0)
  const [currentBorrowId1, setCurrentBorrowId1] = useState('')
  const [currentBorrowMarketCoin1, setCurrentBorrowMarketCoin1] =
    useState('BTC')
  const [currentBorrowId2, setCurrentBorrowId2] = useState('')
  const [currentBorrowMarketCoin2, setCurrentBorrowMarketCoin2] =
    useState('BTC')
  const [validRTokens, setValidRTokens] = useState([])
  const [collateralBalance, setCollateralBalance] = useState('123 eth')
  const [currentSpendStatus, setCurrentSpendStatus] = useState('')
  const [currentLoanAmount, setCurrentLoanAmount] = useState('')
  const [currentLoanMarket, setCurrentLoanMarket] = useState('')
  const [showEmptyNotification, setShowEmptyNotification] = useState(true)
  const avgs = useSelector(selectEffectiveApr)
  const allSplit = useSelector(selectMySplit)
  const [loading, setLoading] = useState(true)
  const [coinPassed, setCoinPassed] = useState({
    name: 'BTC',
    icon: 'mdi-bitcoin',
    symbol: 'WBTC',
  })
  const [borrowAPRs, setBorrowAPRs] = useState<(number | undefined)[]>([])
  const [statusHoverIndex, setStatusHoverIndex] = useState('-1')
  const [currentBorrowAPR, setCurrentBorrowAPR] = useState<Number>(2)
  const [dollarConversions, setDollarConversions] = useState(false)
  const [netStrkBorrow, setnetStrkBorrow] = useState(0)

  const Borrows = useSelector(selectUserLoans)
  const userDeposits = useSelector(selectUserDeposits)
  const reduxProtocolStats = useSelector(selectProtocolStats)
  const oraclePrices = useSelector(selectOraclePrices)
  const avgsLoneHealth = useSelector(selectHealthFactor)
  const stats = useSelector(selectProtocolStats)
  const poolAprs = useSelector(selectJediswapPoolAprs)
  const strkData = useSelector(selectStrkAprData)
  const netSpendBalance = useSelector(selectnetSpendBalance)
  const strkTokenAlloactionData: any = useSelector(
    selectJedistrkTokenAllocation
  )
  const { account, address } = useAccount()

  let lower_bound = 6 * (currentPagination - 1)
  let upper_bound = lower_bound + 5
  upper_bound = Math.min(Borrows ? Borrows.length - 1 : 0, upper_bound)

  const fetchUserDeposits = async () => {
    try {
      if (!account || userDeposits?.length <= 0) return
      const reserves = userDeposits

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
      if (rTokens.length === 0) return
      setValidRTokens(rTokens)
    } catch (err) {}
  }

  const handleStatusHover = (idx: string) => {
    setStatusHoverIndex(idx)
  }

  const handleStatusHoverLeave = () => {
    setStatusHoverIndex('-1')
  }

  const fetchProtocolStats = async () => {
    try {
      setBorrowAPRs([
        stats?.[2].borrowRate,
        stats?.[3].borrowRate,
        stats?.[0].borrowRate,
        stats?.[1].borrowRate,
        stats?.[4].borrowRate,
        stats?.[5].borrowRate,
      ])
    } catch (error) {}
  }

  const getBorrowAPR: any = (borrowMarket: string) => {
    switch (borrowMarket) {
      case 'USDT':
        return borrowAPRs[0]
      case 'USDC':
        return borrowAPRs[1]
      case 'BTC':
        return borrowAPRs[2]
      case 'ETH':
        return borrowAPRs[3]
      case 'DAI':
        return borrowAPRs[4]
      case 'STRK':
        return borrowAPRs[5]

      default:
        break
    }
  }

  const getBoostedAprSupply = (coin: any) => {
    if (strkData == null) {
      return 0
    } else {
      if (strkData?.[coin]) {
        if (oraclePrices == null) {
          return 0
        } else {
          let value = strkData?.[coin]
            ? (365 *
                100 *
                strkData?.[coin][strkData[coin]?.length - 1]?.allocation *
                0.7 *
                oraclePrices?.find((curr: any) => curr.name === 'STRK')
                  ?.price) /
              strkData?.[coin][strkData[coin].length - 1]?.supply_usd
            : 0
          return value
        }
      } else {
        return 0
      }
    }
  }

  const getBoostedApr = (coin: any) => {
    if (strkData == null) {
      return 0
    } else {
      if (strkData?.[coin]) {
        if (oraclePrices == null) {
          return 0
        } else {
          if (netStrkBorrow != 0) {
            if (netSpendBalance) {
              let value =
                (365 *
                  100 *
                  netStrkBorrow *
                  oraclePrices?.find((curr: any) => curr.name === 'STRK')
                    ?.price) /
                netSpendBalance
              return value
            } else {
              return 0
            }
          } else {
            return 0
          }
        }
      } else {
        return 0
      }
    }
  }

  const getAprByPool = (dataArray: any[], pool: string, l3App: string) => {
    const matchedObject = dataArray.find((item) => {
      if (item.name === 'USDT/USDC') {
        return item.amm === 'jedi' && 'USDC/USDT' === pool
      } else if (item.name == 'ETH/STRK') {
        return item.amm === 'jedi' && 'STRK/ETH' === pool
      } else if (item.name === 'ETH/DAI') {
        return item.amm === 'jedi' && 'DAI/ETH' === pool
      } else {
        return (
          item.name === pool &&
          item.amm === (l3App == 'JEDI_SWAP' ? 'jedi' : l3App=='ZKLEND' ?'zklend': 'myswap')
        )
      }
    })
    return matchedObject ? matchedObject.apr * 100 : 0
  }

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

  const getTvlByPool = (dataArray: any[], pool: string, l3App: string) => {
    const matchedObject = dataArray.find((item) => {
      if (item.name === 'USDT/USDC') {
        return item.amm === 'jedi' && 'USDC/USDT' === pool
      } else if (item.name == 'ETH/STRK') {
        return item.amm === 'jedi' && 'STRK/ETH' === pool
      } else if (item.name === 'ETH/DAI') {
        return item.amm === 'jedi' && 'DAI/ETH' === pool
      } else {
        return (
          item.name === pool &&
          item.amm === (l3App == 'JEDI_SWAP' ? 'jedi' : l3App=='ZKLEND' ?'zklend': 'myswap')
        )
      }
    })
    return matchedObject ? matchedObject.tvl : 0
  }

  useEffect(() => {
    let temp1: any = []
    let temp2: any = []

    for (let i = 0; i < (Borrows ? Borrows?.length : 0); i++) {
      if (Borrows) {
        temp1.push({
          id: Borrows[i].loanId,
          name: Borrows[i].loanMarket,
          collateralBalance:
            Borrows[i].collateralAmountParsed +
            ' ' +
            Borrows[i].collateralMarket,
          spendType: Borrows[i].spendType,
        })
        temp2.push(Borrows[i].loanId)
      }
    }
    setBorrowIDCoinMap(temp1)
    setBorrowIds(temp2)
  }, [Borrows])

  useEffect(() => {
    if (validRTokens.length === 0) {
      fetchUserDeposits()
    }
  }, [userDeposits, validRTokens, address])

  useEffect(() => {
    fetchProtocolStats()
  }, [stats])

  useEffect(() => {
    let netApr: number = 0
    if (Borrows?.length > 0 && avgs) {
      Borrows.map((borrow: any, idx: any) => {
        let aprs =
          borrow?.spendType == 'LIQUIDITY'
            ? Number(
                avgs?.find((item: any) => item?.loanId == borrow?.loanId)?.avg
              ) +
              getBoostedAprSupply(borrow?.collateralMarket.slice(1)) +
              (((getAprByPool(
                poolAprs,
                allSplit?.[lower_bound + idx]?.tokenA +
                  '/' +
                  allSplit?.[lower_bound + idx]?.tokenB,
                borrow?.l3App
              ) +
                getBoostedApr(borrow?.loanMarket.slice(1)) +
                (100 *
                  365 *
                  oraclePrices.find((curr: any) => curr.name === 'STRK')
                    ?.price *
                  getStrkAlloaction(
                    allSplit?.[lower_bound + idx]?.tokenA +
                      '/' +
                      allSplit?.[lower_bound + idx]?.tokenB
                  )) /
                  getTvlByPool(
                    poolAprs,
                    allSplit?.[lower_bound + idx]?.tokenA +
                      '/' +
                      allSplit?.[lower_bound + idx]?.tokenB,
                    borrow?.l3App
                  )) *
                (dollarConvertor(
                  allSplit?.[lower_bound + idx]?.amountA,
                  allSplit?.[lower_bound + idx]?.tokenA,
                  oraclePrices
                ) +
                  dollarConvertor(
                    allSplit?.[lower_bound + idx]?.amountB,
                    allSplit?.[lower_bound + idx]?.tokenB,
                    oraclePrices
                  ))) /
                dollarConvertor(
                  borrow?.collateralAmountParsed,
                  borrow?.collateralMarket.slice(1),
                  oraclePrices
                )) *
                reduxProtocolStats?.find(
                  (val: any) => val?.token == borrow?.collateralMarket.slice(1)
                )?.exchangeRateRtokenToUnderlying
            : borrow?.spendType == 'UNSPENT'
              ? Number(
                  avgs?.find((item: any) => item?.loanId == borrow?.loanId)?.avg
                ) +
                (getBoostedAprSupply(borrow?.collateralMarket.slice(1)) /
                  dollarConvertor(
                    borrow?.collateralAmountParsed,
                    borrow?.collateralMarket.slice(1),
                    oraclePrices
                  )) *
                  reduxProtocolStats?.find(
                    (val: any) =>
                      val?.token == borrow?.collateralMarket.slice(1)
                  )?.exchangeRateRtokenToUnderlying
              : borrow?.spendType == 'SWAP'
                ? Number(
                    avgs?.find((item: any) => item?.loanId == borrow?.loanId)
                      ?.avg
                  ) +
                  ((getBoostedAprSupply(borrow?.collateralMarket.slice(1)) *
                    dollarConvertor(
                      borrow?.collateralAmountParsed,
                      borrow?.collateralMarket.slice(1),
                      oraclePrices
                    ) *
                    reduxProtocolStats?.find(
                      (val: any) =>
                        val?.token == borrow?.collateralMarket.slice(1)
                    )?.exchangeRateRtokenToUnderlying) /
                    dollarConvertor(
                      borrow?.loanAmountParsed,
                      borrow?.loanMarket.slice(1),
                      oraclePrices
                    )) *
                    reduxProtocolStats?.find(
                      (val: any) => val?.token == borrow?.loanMarket.slice(1)
                    )?.exchangeRateDTokenToUnderlying +
                  getBoostedApr(borrow?.loanMarket.slice(1))
                : 0
        netApr = netApr + aprs
      })
      if (netApr != 0) {
        if (isNaN(netApr / Borrows?.length)) {
        } else {
          // dispatch(setNetAprLoans((netApr / Borrows?.length).toFixed(2)));
        }
      }
    } else if (Borrows?.length == 0) {
      // dispatch(setNetAprLoans(0));
    }
  }, [avgs, poolAprs, Borrows, allSplit])

  useEffect(() => {
    if (Borrows || Borrows?.length > 0) {
      setLoading(false)
    }
  }, [Borrows])

  useEffect(() => {
    if (strkData != null) {
      let netallocation = 0
      for (let token in strkData) {
        if (strkData.hasOwnProperty(token)) {
          const array = strkData[token]
          const lastObject = array[array.length - 1]
          netallocation += 0.3 * lastObject.allocation
        }
      }
      setnetStrkBorrow(netallocation)
    } else {
      setnetStrkBorrow(0)
    }
  }, [strkData])


  const zkLendSpend=useSelector(selectZklendSpends)
  console.log(zkLendSpend,"spend")

  return loading ? (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="95%"
      height={'37rem'}
      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30)) "
      bg={' var(--surface-of-10, rgba(103, 109, 154, 0.10)); '}
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
  ) : upper_bound >= lower_bound && Borrows && Borrows?.length > 0 ? (
    <Box
      bg="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
      color="white"
      borderRadius="md"
      w={width}
      display="flex"
      flexDirection="column"
      height={'40rem'}
      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30)) "
      padding={'1rem 2rem 0rem'}
      overflowX="hidden"
    >
      <Box width="100%" display="flex" justifyContent="flex-end">
        <Box
          mr="0.3rem"
          mt="0.09rem"
          cursor="pointer"
          onClick={() => {
            setDollarConversions(!dollarConversions)
          }}
        >
          {dollarConversions == true ? (
            <DollarActiveRadioButton />
          ) : (
            <DollarNonActiveRadioButton />
          )}
        </Box>
        <Text
          color="#F0F0F5"
          fontSize="14px"
          fontStyle="normal"
          fontWeight="400"
          lineHeight="20px"
          letterSpacing="-0.15px"
        >
          Convert to Dollar value
        </Text>
      </Box>

      <TableContainer
        bg="transparent"
        color="white"
        borderRadius="md"
        w="100%"
        display="flex"
        justifyContent="flex-start"
        alignItems="flex-start"
        height={'37rem'}
        overflow="none"
      >
        <Table variant="unstyled" width="100%" height="100%" mb="0.5rem">
          <Thead width={'100%'} height={'5rem'}>
            <Tr width={'100%'} height="2rem">
              {columnItems.map((val: any, idx1: any) => (
                <Td
                  key={idx1}
                  width={'12.5%'}
                  fontSize={'12px'}
                  fontWeight={400}
                  p={0}
                >
                  <Box
                    whiteSpace="pre-wrap"
                    overflowWrap="break-word"
                    width={'100%'}
                    height={'2rem'}
                    fontSize="12px"
                    textAlign={
                      idx1 == 0 || idx1 == 1
                        ? 'left'
                        : idx1 == columnItems?.length - 1
                          ? 'right'
                          : 'center'
                    }
                    pl={idx1 == 0 ? 2 : idx1 == 1 ? '24%  ' : 0}
                    pr={idx1 == columnItems.length - 1 ? 5 : 0}
                    color={'#BDBFC1'}
                    cursor="context-menu"
                  >
                    <Tooltip
                      hasArrow
                      label={tooltips[idx1]}
                      placement={
                        (idx1 === 0 && 'bottom-start') ||
                        (idx1 === columnItems.length - 1 && 'bottom-end') ||
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
                      arrowShadowColor="#2B2F35"
                    >
                      {val}
                    </Tooltip>
                  </Box>
                </Td>
              ))}
            </Tr>
          </Thead>

          <Tbody position="relative" overflowX="hidden">
            {Borrows?.slice(lower_bound, upper_bound + 1).map(
              (borrow: any, idx: any) => {
                return (
                  <>
                    <Tr
                      key={lower_bound + borrow.idx}
                      width={'100%'}
                      position="relative"
                      p={0}
                    >
                      <Td
                        width={'12.5%'}
                        fontSize={'14px'}
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
                        >
                          {`${
                            borrow?.spendType == 'LIQUIDITY' &&
                            (allSplit?.[lower_bound + idx]?.tokenA +
                              '/' +
                              allSplit?.[lower_bound + idx]?.tokenB ===
                              'STRK/ETH' ||
                              allSplit?.[lower_bound + idx]?.tokenA +
                                '/' +
                                allSplit?.[lower_bound + idx]?.tokenB ===
                                'ETH/USDC' ||
                              allSplit?.[lower_bound + idx]?.tokenA +
                                '/' +
                                allSplit?.[lower_bound + idx]?.tokenB ===
                                'USDC/USDT')
                              ? '🥇 ID'
                              : 'ID'
                          }
                          ${
                            borrow?.loanId < 10
                              ? '0' + borrow?.loanId
                              : borrow?.loanId
                          }`}
                        </Text>
                      </Td>

                      <Td
                        width={'12.5%'}
                        fontSize={'14px'}
                        fontWeight={400}
                        overflow={'hidden'}
                        textAlign={'center'}
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
                            <HStack
                              height="2rem"
                              width="2rem"
                              alignItems="center"
                              justifyContent="center"
                              pl={4}
                            >
                              <Image
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
                              <Box
                                fontSize="14px"
                                fontWeight="500"
                                color="#F7BB5B"
                                width="4.6rem"
                              >
                                <Box textAlign="left">
                                  <Tooltip
                                    hasArrow
                                    label={
                                      <Box>
                                        Exchange rate:{' '}
                                        {reduxProtocolStats?.find(
                                          (val: any) =>
                                            val?.token ==
                                            borrow?.loanMarket.slice(1)
                                        )?.exchangeRateDTokenToUnderlying
                                          ? reduxProtocolStats
                                              ?.find(
                                                (val: any) =>
                                                  val?.token ==
                                                  borrow?.loanMarket.slice(1)
                                              )
                                              ?.exchangeRateDTokenToUnderlying.toFixed(
                                                4
                                              )
                                          : ''}{' '}
                                        {borrow?.loanMarket.slice(1)} /
                                        {borrow?.loanMarket}
                                        <br />
                                        Underlying Amount:{' '}
                                        {reduxProtocolStats?.find(
                                          (val: any) =>
                                            val?.token ==
                                            borrow?.loanMarket.slice(1)
                                        )?.exchangeRateDTokenToUnderlying
                                          ? (
                                              reduxProtocolStats?.find(
                                                (val: any) =>
                                                  val?.token ==
                                                  borrow?.loanMarket.slice(1)
                                              )
                                                ?.exchangeRateDTokenToUnderlying *
                                              borrow?.loanAmountParsed
                                            ).toFixed(4)
                                          : ''}{' '}
                                        {borrow?.loanMarket.slice(1)}
                                      </Box>
                                    }
                                    placement="right"
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
                                  >
                                    {dollarConversions == true
                                      ? '$' +
                                        numberFormatter(
                                          dollarConvertor(
                                            borrow?.loanAmountParsed,
                                            borrow?.loanMarket.slice(1),
                                            oraclePrices
                                          ) *
                                            reduxProtocolStats?.find(
                                              (val: any) =>
                                                val?.token ==
                                                borrow?.loanMarket.slice(1)
                                            )?.exchangeRateDTokenToUnderlying
                                        )
                                      : numberFormatter(
                                          borrow?.loanAmountParsed
                                        )}
                                  </Tooltip>
                                </Box>
                              </Box>
                            </HStack>
                          </VStack>
                        </Box>
                      </Td>

                      <Td
                        width={'12.5%'}
                        maxWidth={'3rem'}
                        fontSize={'14px'}
                        fontWeight={400}
                        overflow={'hidden'}
                        textAlign={'center'}
                      >
                        <Text
                          width="100%"
                          height="100%"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontWeight="400"
                        >
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
                            -numberFormatterPercentage(
                              getBorrowAPR(borrow?.loanMarket.slice(1))
                            ) + '%'
                          )}
                        </Text>
                      </Td>

                      <Td
                        width={'12.5%'}
                        maxWidth={'3rem'}
                        fontSize={'14px'}
                        fontWeight={400}
                        overflow={'hidden'}
                        textAlign={'center'}
                      >
                        {avgs?.find(
                          (item: any) => item?.loanId == borrow?.loanId
                        )?.avg ? (
                          borrow?.spendType == 'LIQUIDITY' ? (
                            <Box
                              width="100%"
                              height="100%"
                              display="flex"
                              color={
                                  Number(
                                    avgs?.find(
                                      (item: any) =>
                                        item?.loanId == borrow?.loanId
                                    )?.avg
                                  ) +
                                  +(
                                    ((getBoostedApr(
                                      borrow?.loanMarket.slice(1)
                                    ) *
                                      dollarConvertor(
                                        borrow?.loanAmountParsed,
                                        borrow?.loanMarket.slice(1),
                                        oraclePrices
                                      ) *
                                      reduxProtocolStats?.find(
                                        (val: any) =>
                                          val?.token ==
                                          borrow?.loanMarket.slice(1)
                                      )
                                        ?.exchangeRateDTokenToUnderlying) /
                                      dollarConvertor(
                                        borrow?.collateralAmountParsed,
                                        borrow?.collateralMarket.slice(
                                          1
                                        ),
                                        oraclePrices
                                      )) *
                                    reduxProtocolStats?.find(
                                      (val: any) =>
                                        val?.token ==
                                        borrow?.collateralMarket.slice(
                                          1
                                        )
                                    )?.exchangeRateRtokenToUnderlying
                                  ) +
                                  getBoostedAprSupply(
                                    borrow?.collateralMarket.slice(1)
                                  ) +
                                  (((getAprByPool(
                                    poolAprs,
                                    borrow?.l3App=="ZKLEND" ?borrow?.loanMarket.slice(1):allSplit?.[lower_bound + idx]
                                      ?.tokenA +
                                      '/' +
                                      allSplit?.[lower_bound + idx]
                                        ?.tokenB,
                                    borrow?.l3App
                                  ) +
                                    (100 *
                                      365 *
                                      oraclePrices.find(
                                        (curr: any) =>
                                          curr.name === 'STRK'
                                      )?.price *
                                      getStrkAlloaction(
                                        allSplit?.[lower_bound + idx]
                                          ?.tokenA +
                                          '/' +
                                          allSplit?.[lower_bound + idx]
                                            ?.tokenB
                                      )) /
                                      getTvlByPool(
                                        poolAprs,
                                        borrow?.l3App=="ZKLEND" ?borrow?.loanMarket.slice(1): allSplit?.[lower_bound + idx]
                                          ?.tokenA +
                                          '/' +
                                          allSplit?.[lower_bound + idx]
                                            ?.tokenB,
                                        borrow?.l3App
                                      )) *
                                    (borrow?.l3App=="ZKLEND" ?
                                    zkLendSpend?.find(
                                      (val: any) =>
                                        val?.BorrowId ==
                                        borrow?.loanId
                                    )?.SpendValue:(dollarConvertor(
                                      allSplit?.[lower_bound + idx]
                                        ?.amountA,
                                      allSplit?.[lower_bound + idx]
                                        ?.tokenA,
                                      oraclePrices
                                    ) +
                                      dollarConvertor(
                                        allSplit?.[lower_bound + idx]
                                          ?.amountB,
                                        allSplit?.[lower_bound + idx]
                                          ?.tokenB,
                                        oraclePrices
                                      )))) /
                                    dollarConvertor(
                                      borrow?.collateralAmountParsed,
                                      borrow?.collateralMarket.slice(1),
                                      oraclePrices
                                    )) *
                                    reduxProtocolStats?.find(
                                      (val: any) =>
                                        val?.token ==
                                        borrow?.collateralMarket.slice(
                                          1
                                        )
                                    )?.exchangeRateRtokenToUnderlying
                                 <
                                0
                                  ? 'rgb(255 94 94)'
                                  : '#00D395'
                              }
                              alignItems="center"
                              justifyContent="center"
                              fontWeight="400"
                            >
                              <Tooltip
                                hasArrow
                                label={
                                  <Box
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="space-between"
                                  >
                                    <Box
                                      display="flex"
                                      justifyContent="space-between"
                                      gap="10px"
                                    >
                                      Borrow (
                                      {(
                                        ((dollarConvertor(
                                          borrow?.loanAmountParsed,
                                          borrow?.loanMarket.slice(1),
                                          oraclePrices
                                        ) *
                                          reduxProtocolStats?.find(
                                            (val: any) =>
                                              val?.token ==
                                              borrow?.loanMarket.slice(1)
                                          )?.exchangeRateDTokenToUnderlying) /
                                          dollarConvertor(
                                            borrow?.collateralAmountParsed,
                                            borrow?.collateralMarket.slice(1),
                                            oraclePrices
                                          )) *
                                        reduxProtocolStats?.find(
                                          (val: any) =>
                                            val?.token ==
                                            borrow?.collateralMarket.slice(1)
                                        )?.exchangeRateRtokenToUnderlying
                                      ).toFixed(1)}
                                      x):
                                      <Text>
                                        -
                                        {(
                                          ((dollarConvertor(
                                            borrow?.loanAmountParsed,
                                            borrow?.loanMarket.slice(1),
                                            oraclePrices
                                          ) *
                                            reduxProtocolStats?.find(
                                              (val: any) =>
                                                val?.token ==
                                                borrow?.loanMarket.slice(1)
                                            )?.exchangeRateDTokenToUnderlying *
                                            reduxProtocolStats?.find(
                                              (stat: any) =>
                                                stat?.token ===
                                                borrow?.loanMarket.slice(1)
                                            )?.borrowRate) /
                                            dollarConvertor(
                                              borrow?.collateralAmountParsed,
                                              borrow?.collateralMarket.slice(1),
                                              oraclePrices
                                            )) *
                                          reduxProtocolStats?.find(
                                            (val: any) =>
                                              val?.token ==
                                              borrow?.collateralMarket.slice(1)
                                          )?.exchangeRateRtokenToUnderlying
                                        ).toFixed(2)}
                                        %
                                      </Text>
                                    </Box>
                                    <Box
                                      display="flex"
                                      justifyContent="space-between"
                                      gap="10px"
                                    >
                                      Boosted (
                                      {(
                                        ((dollarConvertor(
                                          borrow?.loanAmountParsed,
                                          borrow?.loanMarket.slice(1),
                                          oraclePrices
                                        ) *
                                          reduxProtocolStats?.find(
                                            (val: any) =>
                                              val?.token ==
                                              borrow?.loanMarket.slice(1)
                                          )?.exchangeRateDTokenToUnderlying) /
                                          dollarConvertor(
                                            borrow?.collateralAmountParsed,
                                            borrow?.collateralMarket.slice(1),
                                            oraclePrices
                                          )) *
                                        reduxProtocolStats?.find(
                                          (val: any) =>
                                            val?.token ==
                                            borrow?.collateralMarket.slice(1)
                                        )?.exchangeRateRtokenToUnderlying
                                      ).toFixed(1)}
                                      x):
                                      <Text>
                                        +
                                        {(
                                          ((dollarConvertor(
                                            borrow?.loanAmountParsed,
                                            borrow?.loanMarket.slice(1),
                                            oraclePrices
                                          ) *
                                            reduxProtocolStats?.find(
                                              (val: any) =>
                                                val?.token ==
                                                borrow?.loanMarket.slice(1)
                                            )?.exchangeRateDTokenToUnderlying *
                                            getBoostedApr(
                                              borrow?.loanMarket.slice(1)
                                            )) /
                                            dollarConvertor(
                                              borrow?.collateralAmountParsed,
                                              borrow?.collateralMarket.slice(1),
                                              oraclePrices
                                            )) *
                                          reduxProtocolStats?.find(
                                            (val: any) =>
                                              val?.token ==
                                              borrow?.collateralMarket.slice(1)
                                          )?.exchangeRateRtokenToUnderlying
                                        ).toFixed(2)}
                                        %
                                      </Text>
                                    </Box>
                                    <Box
                                      display="flex"
                                      justifyContent="space-between"
                                    >
                                      <Text>
                                        Pool (
                                        {borrow?.l3App=="ZKLEND" ?
                                        (zkLendSpend?.find(
                                          (val: any) =>
                                            val?.BorrowId ==
                                            borrow?.loanId
                                        )?.SpendValue/dollarConvertor(
                                          borrow?.collateralAmountParsed,
                                          borrow?.collateralMarket.slice(1),
                                          oraclePrices
                                        ) *
                                      reduxProtocolStats?.find(
                                        (val: any) =>
                                          val?.token ==
                                          borrow?.collateralMarket.slice(1)
                                      )?.exchangeRateRtokenToUnderlying).toFixed(1):(
                                          ((dollarConvertor(
                                            allSplit?.[lower_bound + idx]
                                              ?.amountA,
                                            allSplit?.[lower_bound + idx]
                                              ?.tokenA,
                                            oraclePrices
                                          ) +
                                            dollarConvertor(
                                              allSplit?.[lower_bound + idx]
                                                ?.amountB,
                                              allSplit?.[lower_bound + idx]
                                                ?.tokenB,
                                              oraclePrices
                                            )) /
                                            dollarConvertor(
                                              borrow?.collateralAmountParsed,
                                              borrow?.collateralMarket.slice(1),
                                              oraclePrices
                                            )) *
                                          reduxProtocolStats?.find(
                                            (val: any) =>
                                              val?.token ==
                                              borrow?.collateralMarket.slice(1)
                                          )?.exchangeRateRtokenToUnderlying
                                        ).toFixed(1)}
                                        x):
                                      </Text>
                                      <Text>
                                        +
                                        {borrow?.l3App==="ZKLEND" ?(
                                          ((getAprByPool(
                                            poolAprs,
                                            borrow?.loanMarket.slice(1),
                                            borrow?.l3App
                                          ) *
                                          zkLendSpend?.find(
                                            (val: any) =>
                                              val?.BorrowId ==
                                              borrow?.loanId
                                          )?.SpendValue) /
                                            dollarConvertor(
                                              borrow?.collateralAmountParsed,
                                              borrow?.collateralMarket.slice(1),
                                              oraclePrices
                                            )) *
                                          reduxProtocolStats?.find(
                                            (val: any) =>
                                              val?.token ==
                                              borrow?.collateralMarket.slice(1)
                                          )?.exchangeRateRtokenToUnderlying
                                        ).toFixed(2): (
                                          ((getAprByPool(
                                            poolAprs,
                                            allSplit?.[lower_bound + idx]
                                              ?.tokenA +
                                              '/' +
                                              allSplit?.[lower_bound + idx]
                                                ?.tokenB,
                                            borrow?.l3App
                                          ) *
                                            (dollarConvertor(
                                              allSplit?.[lower_bound + idx]
                                                ?.amountA,
                                              allSplit?.[lower_bound + idx]
                                                ?.tokenA,
                                              oraclePrices
                                            ) +
                                              dollarConvertor(
                                                allSplit?.[lower_bound + idx]
                                                  ?.amountB,
                                                allSplit?.[lower_bound + idx]
                                                  ?.tokenB,
                                                oraclePrices
                                              ))) /
                                            dollarConvertor(
                                              borrow?.collateralAmountParsed,
                                              borrow?.collateralMarket.slice(1),
                                              oraclePrices
                                            )) *
                                          reduxProtocolStats?.find(
                                            (val: any) =>
                                              val?.token ==
                                              borrow?.collateralMarket.slice(1)
                                          )?.exchangeRateRtokenToUnderlying
                                        ).toFixed(2)}
                                        %
                                      </Text>
                                    </Box>
                                    {borrow?.l3App!=="ZKLEND" &&<Box
                                      display="flex"
                                      justifyContent="space-between"
                                    >
                                      <Text>
                                         Jedi STRK (
                                        {borrow?.l3App=="ZKLEND" ?
                                        (zkLendSpend?.find(
                                          (val: any) =>
                                            val?.BorrowId ==
                                            borrow?.loanId
                                        )?.SpendValue/dollarConvertor(
                                          borrow?.collateralAmountParsed,
                                          borrow?.collateralMarket.slice(1),
                                          oraclePrices
                                        ) *
                                      reduxProtocolStats?.find(
                                        (val: any) =>
                                          val?.token ==
                                          borrow?.collateralMarket.slice(1)
                                      )?.exchangeRateRtokenToUnderlying).toFixed(1)
                                        : (
                                          ((dollarConvertor(
                                            allSplit?.[lower_bound + idx]
                                              ?.amountA,
                                            allSplit?.[lower_bound + idx]
                                              ?.tokenA,
                                            oraclePrices
                                          ) +
                                            dollarConvertor(
                                              allSplit?.[lower_bound + idx]
                                                ?.amountB,
                                              allSplit?.[lower_bound + idx]
                                                ?.tokenB,
                                              oraclePrices
                                            )) /
                                            dollarConvertor(
                                              borrow?.collateralAmountParsed,
                                              borrow?.collateralMarket.slice(1),
                                              oraclePrices
                                            )) *
                                          reduxProtocolStats?.find(
                                            (val: any) =>
                                              val?.token ==
                                              borrow?.collateralMarket.slice(1)
                                          )?.exchangeRateRtokenToUnderlying
                                        ).toFixed(1)}
                                        x):
                                      </Text>
                                      <Text>
                                        +
                                        {borrow?.l3App=="ZKLEND" ?numberFormatterPercentage(0): (
                                          ((((100 *
                                            365 *
                                            oraclePrices.find(
                                              (curr: any) =>
                                                curr.name === 'STRK'
                                            )?.price *
                                            getStrkAlloaction(
                                              allSplit?.[lower_bound + idx]
                                                ?.tokenA +
                                                '/' +
                                                allSplit?.[lower_bound + idx]
                                                  ?.tokenB
                                            )) /
                                            getTvlByPool(
                                              poolAprs,
                                              allSplit?.[lower_bound + idx]
                                                ?.tokenA +
                                                '/' +
                                                allSplit?.[lower_bound + idx]
                                                  ?.tokenB,
                                              borrow?.l3App
                                            )) *
                                            (dollarConvertor(
                                              allSplit?.[lower_bound + idx]
                                                ?.amountA,
                                              allSplit?.[lower_bound + idx]
                                                ?.tokenA,
                                              oraclePrices
                                            ) +
                                              dollarConvertor(
                                                allSplit?.[lower_bound + idx]
                                                  ?.amountB,
                                                allSplit?.[lower_bound + idx]
                                                  ?.tokenB,
                                                oraclePrices
                                              ))) /
                                            dollarConvertor(
                                              borrow?.collateralAmountParsed,
                                              borrow?.collateralMarket.slice(1),
                                              oraclePrices
                                            )) *
                                          reduxProtocolStats?.find(
                                            (val: any) =>
                                              val?.token ==
                                              borrow?.collateralMarket.slice(1)
                                          )?.exchangeRateRtokenToUnderlying
                                        ).toFixed(2)}
                                        %
                                      </Text>
                                    </Box>}
                                    <Box
                                      display="flex"
                                      justifyContent="space-between"
                                      mb="2"
                                    >
                                      <Text>Collateral:</Text>
                                      <Text>
                                        +
                                        {numberFormatterPercentage(
                                          Number(
                                            reduxProtocolStats?.find(
                                              (stat: any) =>
                                                stat?.token ===
                                                borrow?.collateralMarket.slice(
                                                  1
                                                )
                                            )?.supplyRate
                                          ) +
                                            getBoostedAprSupply(
                                              borrow?.collateralMarket.slice(1)
                                            )
                                        )}
                                        %
                                      </Text>
                                    </Box>
                                    <hr />
                                    <Box
                                      display="flex"
                                      mt="2"
                                      justifyContent="space-between"
                                      mb="2"
                                      gap="10px"
                                    >
                                      <Text>Effective APR:</Text>
                                      <Text>
                                        {(
                                          Number(
                                            avgs?.find(
                                              (item: any) =>
                                                item?.loanId == borrow?.loanId
                                            )?.avg
                                          ) +
                                          +(
                                            ((getBoostedApr(
                                              borrow?.loanMarket.slice(1)
                                            ) *
                                              dollarConvertor(
                                                borrow?.loanAmountParsed,
                                                borrow?.loanMarket.slice(1),
                                                oraclePrices
                                              ) *
                                              reduxProtocolStats?.find(
                                                (val: any) =>
                                                  val?.token ==
                                                  borrow?.loanMarket.slice(1)
                                              )
                                                ?.exchangeRateDTokenToUnderlying) /
                                              dollarConvertor(
                                                borrow?.collateralAmountParsed,
                                                borrow?.collateralMarket.slice(
                                                  1
                                                ),
                                                oraclePrices
                                              )) *
                                            reduxProtocolStats?.find(
                                              (val: any) =>
                                                val?.token ==
                                                borrow?.collateralMarket.slice(
                                                  1
                                                )
                                            )?.exchangeRateRtokenToUnderlying
                                          ) +
                                          getBoostedAprSupply(
                                            borrow?.collateralMarket.slice(1)
                                          ) +
                                          (((getAprByPool(
                                            poolAprs,
                                            borrow?.l3App=="ZKLEND" ?borrow?.loanMarket.slice(1):allSplit?.[lower_bound + idx]
                                              ?.tokenA +
                                              '/' +
                                              allSplit?.[lower_bound + idx]
                                                ?.tokenB,
                                            borrow?.l3App
                                          ) +
                                            (100 *
                                              365 *
                                              oraclePrices.find(
                                                (curr: any) =>
                                                  curr.name === 'STRK'
                                              )?.price *
                                              getStrkAlloaction(
                                                allSplit?.[lower_bound + idx]
                                                  ?.tokenA +
                                                  '/' +
                                                  allSplit?.[lower_bound + idx]
                                                    ?.tokenB
                                              )) /
                                              getTvlByPool(
                                                poolAprs,
                                                borrow?.l3App=="ZKLEND" ?borrow?.loanMarket.slice(1): allSplit?.[lower_bound + idx]
                                                  ?.tokenA +
                                                  '/' +
                                                  allSplit?.[lower_bound + idx]
                                                    ?.tokenB,
                                                borrow?.l3App
                                              )) *
                                            (borrow?.l3App=="ZKLEND" ?
                                            zkLendSpend?.find(
                                              (val: any) =>
                                                val?.BorrowId ==
                                                borrow?.loanId
                                            )?.SpendValue:(dollarConvertor(
                                              allSplit?.[lower_bound + idx]
                                                ?.amountA,
                                              allSplit?.[lower_bound + idx]
                                                ?.tokenA,
                                              oraclePrices
                                            ) +
                                              dollarConvertor(
                                                allSplit?.[lower_bound + idx]
                                                  ?.amountB,
                                                allSplit?.[lower_bound + idx]
                                                  ?.tokenB,
                                                oraclePrices
                                              )))) /
                                            dollarConvertor(
                                              borrow?.collateralAmountParsed,
                                              borrow?.collateralMarket.slice(1),
                                              oraclePrices
                                            )) *
                                            reduxProtocolStats?.find(
                                              (val: any) =>
                                                val?.token ==
                                                borrow?.collateralMarket.slice(
                                                  1
                                                )
                                            )?.exchangeRateRtokenToUnderlying
                                        ).toFixed(2) + '%'}
                                      </Text>
                                    </Box>
                                  </Box>
                                }
                                placement="right"
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
                              >
                                        {(
                                          Number(
                                            avgs?.find(
                                              (item: any) =>
                                                item?.loanId == borrow?.loanId
                                            )?.avg
                                          ) +
                                          +(
                                            ((getBoostedApr(
                                              borrow?.loanMarket.slice(1)
                                            ) *
                                              dollarConvertor(
                                                borrow?.loanAmountParsed,
                                                borrow?.loanMarket.slice(1),
                                                oraclePrices
                                              ) *
                                              reduxProtocolStats?.find(
                                                (val: any) =>
                                                  val?.token ==
                                                  borrow?.loanMarket.slice(1)
                                              )
                                                ?.exchangeRateDTokenToUnderlying) /
                                              dollarConvertor(
                                                borrow?.collateralAmountParsed,
                                                borrow?.collateralMarket.slice(
                                                  1
                                                ),
                                                oraclePrices
                                              )) *
                                            reduxProtocolStats?.find(
                                              (val: any) =>
                                                val?.token ==
                                                borrow?.collateralMarket.slice(
                                                  1
                                                )
                                            )?.exchangeRateRtokenToUnderlying
                                          ) +
                                          getBoostedAprSupply(
                                            borrow?.collateralMarket.slice(1)
                                          ) +
                                          (((getAprByPool(
                                            poolAprs,
                                            borrow?.l3App=="ZKLEND" ?borrow?.loanMarket.slice(1):allSplit?.[lower_bound + idx]
                                              ?.tokenA +
                                              '/' +
                                              allSplit?.[lower_bound + idx]
                                                ?.tokenB,
                                            borrow?.l3App
                                          ) +
                                            (100 *
                                              365 *
                                              oraclePrices.find(
                                                (curr: any) =>
                                                  curr.name === 'STRK'
                                              )?.price *
                                              getStrkAlloaction(
                                                allSplit?.[lower_bound + idx]
                                                  ?.tokenA +
                                                  '/' +
                                                  allSplit?.[lower_bound + idx]
                                                    ?.tokenB
                                              )) /
                                              getTvlByPool(
                                                poolAprs,
                                                borrow?.l3App=="ZKLEND" ?borrow?.loanMarket.slice(1): allSplit?.[lower_bound + idx]
                                                  ?.tokenA +
                                                  '/' +
                                                  allSplit?.[lower_bound + idx]
                                                    ?.tokenB,
                                                borrow?.l3App
                                              )) *
                                            (borrow?.l3App=="ZKLEND" ?
                                            zkLendSpend?.find(
                                              (val: any) =>
                                                val?.BorrowId ==
                                                borrow?.loanId
                                            )?.SpendValue:(dollarConvertor(
                                              allSplit?.[lower_bound + idx]
                                                ?.amountA,
                                              allSplit?.[lower_bound + idx]
                                                ?.tokenA,
                                              oraclePrices
                                            ) +
                                              dollarConvertor(
                                                allSplit?.[lower_bound + idx]
                                                  ?.amountB,
                                                allSplit?.[lower_bound + idx]
                                                  ?.tokenB,
                                                oraclePrices
                                              )))) /
                                            dollarConvertor(
                                              borrow?.collateralAmountParsed,
                                              borrow?.collateralMarket.slice(1),
                                              oraclePrices
                                            )) *
                                            reduxProtocolStats?.find(
                                              (val: any) =>
                                                val?.token ==
                                                borrow?.collateralMarket.slice(
                                                  1
                                                )
                                            )?.exchangeRateRtokenToUnderlying
                                        ).toFixed(2) + '%'}
                              </Tooltip>
                            </Box>
                          ) : (
                            <Box
                              width="100%"
                              height="100%"
                              display="flex"
                              color={
                                Number(
                                  avgs?.find(
                                    (item: any) =>
                                      item?.loanId == borrow?.loanId
                                  )?.avg
                                ) +
                                  (borrow?.spendType == 'UNSPENT'
                                    ? getBoostedAprSupply(
                                        borrow?.collateralMarket.slice(1)
                                      )
                                    : getBoostedAprSupply(
                                        borrow?.collateralMarket.slice(1)
                                      ) +
                                      ((getBoostedApr(
                                        borrow?.loanMarket.slice(1)
                                      ) *
                                        dollarConvertor(
                                          borrow?.loanAmountParsed,
                                          borrow?.loanMarket.slice(1),
                                          oraclePrices
                                        ) *
                                        reduxProtocolStats?.find(
                                          (val: any) =>
                                            val?.token ==
                                            borrow?.loanMarket.slice(1)
                                        )?.exchangeRateDTokenToUnderlying) /
                                        dollarConvertor(
                                          borrow?.collateralAmountParsed,
                                          borrow?.collateralMarket.slice(1),
                                          oraclePrices
                                        )) *
                                        reduxProtocolStats?.find(
                                          (val: any) =>
                                            val?.token ==
                                            borrow?.collateralMarket.slice(1)
                                        )?.exchangeRateRtokenToUnderlying) <
                                0
                                  ? 'rgb(255 94 94)'
                                  : '#00D395'
                              }
                              alignItems="center"
                              justifyContent="center"
                              fontWeight="400"
                            >
                              <Tooltip
                                hasArrow
                                label={
                                  <Box
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="space-between"
                                  >
                                    <Box
                                      display="flex"
                                      justifyContent="space-between"
                                      gap="10px"
                                    >
                                      Borrow (
                                      {(
                                        ((dollarConvertor(
                                          borrow?.loanAmountParsed,
                                          borrow?.loanMarket.slice(1),
                                          oraclePrices
                                        ) *
                                          reduxProtocolStats?.find(
                                            (val: any) =>
                                              val?.token ==
                                              borrow?.loanMarket.slice(1)
                                          )?.exchangeRateDTokenToUnderlying) /
                                          dollarConvertor(
                                            borrow?.collateralAmountParsed,
                                            borrow?.collateralMarket.slice(1),
                                            oraclePrices
                                          )) *
                                        reduxProtocolStats?.find(
                                          (val: any) =>
                                            val?.token ==
                                            borrow?.collateralMarket.slice(1)
                                        )?.exchangeRateRtokenToUnderlying
                                      ).toFixed(1)}
                                      x):
                                      <Text>
                                        -
                                        {numberFormatterPercentage(
                                          ((getBorrowAPR(
                                            borrow?.loanMarket.slice(1)
                                          ) *
                                            dollarConvertor(
                                              borrow?.loanAmountParsed,
                                              borrow?.loanMarket.slice(1),
                                              oraclePrices
                                            ) *
                                            reduxProtocolStats?.find(
                                              (val: any) =>
                                                val?.token ==
                                                borrow?.loanMarket.slice(1)
                                            )?.exchangeRateDTokenToUnderlying) /
                                            dollarConvertor(
                                              borrow?.collateralAmountParsed,
                                              borrow?.collateralMarket.slice(1),
                                              oraclePrices
                                            )) *
                                            reduxProtocolStats?.find(
                                              (val: any) =>
                                                val?.token ==
                                                borrow?.collateralMarket.slice(
                                                  1
                                                )
                                            )?.exchangeRateRtokenToUnderlying
                                        )}
                                        %
                                      </Text>
                                    </Box>
                                    {borrow?.spendType != 'UNSPENT' && (
                                      <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        gap="10px"
                                      >
                                        Boosted (
                                        {(
                                          ((dollarConvertor(
                                            borrow?.loanAmountParsed,
                                            borrow?.loanMarket.slice(1),
                                            oraclePrices
                                          ) *
                                            reduxProtocolStats?.find(
                                              (val: any) =>
                                                val?.token ==
                                                borrow?.loanMarket.slice(1)
                                            )?.exchangeRateDTokenToUnderlying) /
                                            dollarConvertor(
                                              borrow?.collateralAmountParsed,
                                              borrow?.collateralMarket.slice(1),
                                              oraclePrices
                                            )) *
                                          reduxProtocolStats?.find(
                                            (val: any) =>
                                              val?.token ==
                                              borrow?.collateralMarket.slice(1)
                                          )?.exchangeRateRtokenToUnderlying
                                        ).toFixed(1)}
                                        x):
                                        <Text>
                                          +
                                          {numberFormatterPercentage(
                                            ((getBoostedApr(
                                              borrow?.loanMarket.slice(1)
                                            ) *
                                              dollarConvertor(
                                                borrow?.loanAmountParsed,
                                                borrow?.loanMarket.slice(1),
                                                oraclePrices
                                              ) *
                                              reduxProtocolStats?.find(
                                                (val: any) =>
                                                  val?.token ==
                                                  borrow?.loanMarket.slice(1)
                                              )
                                                ?.exchangeRateDTokenToUnderlying) /
                                              dollarConvertor(
                                                borrow?.collateralAmountParsed,
                                                borrow?.collateralMarket.slice(
                                                  1
                                                ),
                                                oraclePrices
                                              )) *
                                              reduxProtocolStats?.find(
                                                (val: any) =>
                                                  val?.token ==
                                                  borrow?.collateralMarket.slice(
                                                    1
                                                  )
                                              )?.exchangeRateRtokenToUnderlying
                                          )}
                                          %
                                        </Text>
                                      </Box>
                                    )}
                                    <Box
                                      display="flex"
                                      justifyContent="space-between"
                                      mb="2"
                                      gap="10px"
                                    >
                                      <Text>Collateral:</Text>
                                      <Text>
                                        +
                                        {(
                                          ((dollarConvertor(
                                            borrow?.collateralAmountParsed,
                                            borrow?.collateralMarket.slice(1),
                                            oraclePrices
                                          ) *
                                            reduxProtocolStats?.find(
                                              (val: any) =>
                                                val?.token ==
                                                borrow?.collateralMarket.slice(
                                                  1
                                                )
                                            )?.exchangeRateRtokenToUnderlying *
                                            (reduxProtocolStats?.find(
                                              (stat: any) =>
                                                stat?.token ===
                                                borrow?.collateralMarket.slice(
                                                  1
                                                )
                                            )?.supplyRate +
                                              getBoostedAprSupply(
                                                borrow?.collateralMarket.slice(
                                                  1
                                                )
                                              ))) /
                                            dollarConvertor(
                                              borrow?.collateralAmountParsed,
                                              borrow?.collateralMarket.slice(1),
                                              oraclePrices
                                            )) *
                                          reduxProtocolStats?.find(
                                            (val: any) =>
                                              val?.token ==
                                              borrow?.collateralMarket.slice(1)
                                          )?.exchangeRateRtokenToUnderlying
                                        ).toFixed(2)}
                                        %
                                      </Text>
                                    </Box>
                                    <hr />
                                    <Box
                                      display="flex"
                                      mt="2"
                                      justifyContent="space-between"
                                      mb="2"
                                      gap="10px"
                                    >
                                      <Text>Effective APR:</Text>
                                      <Text>
                                        {(
                                          Number(
                                            avgs?.find(
                                              (item: any) =>
                                                item?.loanId == borrow?.loanId
                                            )?.avg
                                          ) +
                                          (borrow?.spendType == 'UNSPENT'
                                            ? getBoostedAprSupply(
                                                borrow?.collateralMarket.slice(
                                                  1
                                                )
                                              )
                                            : getBoostedAprSupply(
                                                borrow?.collateralMarket.slice(
                                                  1
                                                )
                                              ) +
                                              ((getBoostedApr(
                                                borrow?.loanMarket.slice(1)
                                              ) *
                                                dollarConvertor(
                                                  borrow?.loanAmountParsed,
                                                  borrow?.loanMarket.slice(1),
                                                  oraclePrices
                                                ) *
                                                reduxProtocolStats?.find(
                                                  (val: any) =>
                                                    val?.token ==
                                                    borrow?.loanMarket.slice(1)
                                                )
                                                  ?.exchangeRateDTokenToUnderlying) /
                                                dollarConvertor(
                                                  borrow?.collateralAmountParsed,
                                                  borrow?.collateralMarket.slice(
                                                    1
                                                  ),
                                                  oraclePrices
                                                )) *
                                                reduxProtocolStats?.find(
                                                  (val: any) =>
                                                    val?.token ==
                                                    borrow?.collateralMarket.slice(
                                                      1
                                                    )
                                                )
                                                  ?.exchangeRateRtokenToUnderlying)
                                        )?.toFixed(2) + '%'}
                                      </Text>
                                    </Box>
                                  </Box>
                                }
                                placement="right"
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
                              >
                                {(
                                  Number(
                                    avgs?.find(
                                      (item: any) =>
                                        item?.loanId == borrow?.loanId
                                    )?.avg
                                  ) +
                                  (borrow?.spendType == 'UNSPENT'
                                    ? getBoostedAprSupply(
                                        borrow?.collateralMarket.slice(1)
                                      )
                                    : getBoostedAprSupply(
                                        borrow?.collateralMarket.slice(1)
                                      ) +
                                      ((getBoostedApr(
                                        borrow?.loanMarket.slice(1)
                                      ) *
                                        dollarConvertor(
                                          borrow?.loanAmountParsed,
                                          borrow?.loanMarket.slice(1),
                                          oraclePrices
                                        ) *
                                        reduxProtocolStats?.find(
                                          (val: any) =>
                                            val?.token ==
                                            borrow?.loanMarket.slice(1)
                                        )?.exchangeRateDTokenToUnderlying) /
                                        dollarConvertor(
                                          borrow?.collateralAmountParsed,
                                          borrow?.collateralMarket.slice(1),
                                          oraclePrices
                                        )) *
                                        reduxProtocolStats?.find(
                                          (val: any) =>
                                            val?.token ==
                                            borrow?.collateralMarket.slice(1)
                                        )?.exchangeRateRtokenToUnderlying)
                                )?.toFixed(2) + '%'}
                              </Tooltip>
                            </Box>
                          )
                        ) : (
                          <Skeleton
                            width="6rem"
                            height="1.4rem"
                            startColor="#101216"
                            endColor="#2B2F35"
                            borderRadius="6px"
                          />
                        )}
                      </Td>

                      <Td
                        width={'12.5%'}
                        maxWidth={'5rem'}
                        fontSize={'14px'}
                        fontWeight={400}
                        textAlign={'center'}
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
                              src={`/${borrow?.collateralMarket.slice(1)}.svg`}
                              alt="Picture of the author"
                              width="32"
                              height="32"
                            />
                            <Text fontSize="14px" fontWeight="400">
                              {borrow?.collateralMarket}
                            </Text>
                          </HStack>

                          <Box
                            fontSize="14px"
                            fontWeight="500"
                            color="#F7BB5B"
                            width="4.6rem"
                          >
                            <Tooltip
                              hasArrow
                              label={
                                <Box>
                                  Exchange rate:{' '}
                                  {reduxProtocolStats?.find(
                                    (val: any) =>
                                      val?.token ==
                                      borrow?.collateralMarket.slice(1)
                                  )?.exchangeRateRtokenToUnderlying
                                    ? reduxProtocolStats
                                        ?.find(
                                          (val: any) =>
                                            val?.token ==
                                            borrow?.collateralMarket.slice(1)
                                        )
                                        ?.exchangeRateRtokenToUnderlying.toFixed(
                                          4
                                        )
                                    : ''}{' '}
                                  {borrow?.collateralMarket.slice(1)} /
                                  {borrow?.collateralMarket}
                                  <br />
                                  Underlying Amount:{' '}
                                  {reduxProtocolStats?.find(
                                    (val: any) =>
                                      val?.token ==
                                      borrow?.collateralMarket.slice(1)
                                  )?.exchangeRateRtokenToUnderlying
                                    ? (
                                        reduxProtocolStats?.find(
                                          (val: any) =>
                                            val?.token ==
                                            borrow?.collateralMarket.slice(1)
                                        )?.exchangeRateRtokenToUnderlying *
                                        borrow?.collateralAmountParsed
                                      ).toFixed(4)
                                    : ''}{' '}
                                  {borrow?.collateralMarket.slice(1)}
                                </Box>
                              }
                              placement="right"
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
                            >
                              <Text>
                                {dollarConversions == true
                                  ? '$' +
                                    numberFormatter(
                                      dollarConvertor(
                                        borrow?.collateralAmountParsed,
                                        borrow?.collateralMarket.slice(1),
                                        oraclePrices
                                      ) *
                                        reduxProtocolStats?.find(
                                          (val: any) =>
                                            val?.token ==
                                            borrow?.collateralMarket.slice(1)
                                        )?.exchangeRateRtokenToUnderlying
                                    )
                                  : numberFormatter(
                                      borrow?.collateralAmountParsed
                                    )}
                              </Text>
                            </Tooltip>
                          </Box>
                        </VStack>
                      </Td>

                      <Td
                        maxWidth={'5rem'}
                        fontSize={'14px'}
                        fontWeight={400}
                        textAlign={'center'}
                      >
                        {borrow.loanState == 'ACTIVE' ? (
                          <Box
                            width="100%"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height="3rem"
                          >
                            <HStack
                              height="50%"
                              width="150%"
                              alignItems="center"
                              onMouseEnter={() => handleStatusHover('0' + idx)}
                              onMouseLeave={() => handleStatusHoverLeave()}
                              _hover={{ cursor: 'pointer' }}
                              justifyContent="center"
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
                            >
                              <Box display="flex">
                                <Box
                                  onMouseEnter={() =>
                                    handleStatusHover('3' + idx)
                                  }
                                  onMouseLeave={() => handleStatusHoverLeave()}
                                  _hover={{ cursor: 'pointer' }}
                                  display="flex"
                                  gap={0.5}
                                  minWidth={'16px'}
                                >
                                  {statusHoverIndex != '3' + idx ? (
                                    <Image
                                      src={`/${borrow.currentLoanMarket}.svg`}
                                      alt="Picture of the author"
                                      width="16"
                                      height="16"
                                    />
                                  ) : (
                                    <ExpandedCoinIcon
                                      asset={borrow.currentLoanMarket}
                                    />
                                  )}
                                </Box>
                              </Box>
                              <Text fontSize="14px" fontWeight="400">
                                {dollarConversions == true
                                  ? '$' +
                                    numberFormatter(
                                      dollarConvertor(
                                        borrow?.currentLoanAmountParsed,
                                        borrow.currentLoanMarket,
                                        oraclePrices
                                      )
                                    )
                                  : numberFormatter(
                                      borrow?.currentLoanAmountParsed
                                    )}
                              </Text>
                            </HStack>
                          </Box>
                        ) : borrow.loanState == 'REPAID' ||
                          borrow.loanState == 'LIQUIDATED' ? (
                          <Box
                            width="100%"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height="3rem"
                          >
                            {borrow.loanState}
                          </Box>
                        ) : (
                          <Box
                            width="100%"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height="3rem"
                          >
                            <HStack
                              height="50%"
                              width="150%"
                              alignItems="center"
                              onMouseEnter={() => handleStatusHover('0' + idx)}
                              onMouseLeave={() => handleStatusHoverLeave()}
                              _hover={{ cursor: 'pointer' }}
                              justifyContent="center"
                            >
                              {statusHoverIndex != '0' + idx ? (
                                <Image
                                  src={borrow.l3App!=="ZKLEND" ? `/${borrow.l3App}.svg`:'/Zklend.svg'}
                                  alt="Picture of the author"
                                  width="16"
                                  height="16"
                                />
                              ) : (
                                <ExpandedMarketIcon asset={borrow.l3App} />
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
                            >
                              <Box display="flex">
                                {borrow.spendType == 'LIQUIDITY' &&borrow?.l3App!=="ZKLEND" ? (
                                  allSplit?.[lower_bound + idx]?.tokenA &&
                                  allSplit?.[lower_bound + idx]?.tokenB && (
                                     <>
                                      <Box
                                        onMouseEnter={() =>
                                          handleStatusHover('1' + idx)
                                        }
                                        display="flex"
                                        gap={0.5}
                                        _hover={{ cursor: 'pointer' }}
                                        maxHeight="16px"
                                        minWidth={'16px'}
                                      >
                                        {statusHoverIndex != '1' + idx ? (
                                          <Image
                                            src={`/${
                                              allSplit?.[lower_bound + idx]
                                                ?.tokenA
                                            }.svg`}
                                            alt="Picture of the author"
                                            width="16"
                                            height="16"
                                          />
                                        ) : (
                                          <ExpandedCoinIcon
                                            asset={
                                              allSplit?.[lower_bound + idx]
                                                ?.tokenA
                                            }
                                          />
                                        )}
                                      </Box>
                                      <Box
                                        onMouseEnter={() =>
                                          handleStatusHover('2' + idx)
                                        }
                                        onMouseLeave={() =>
                                          handleStatusHoverLeave()
                                        }
                                        display="flex"
                                        gap={0.5}
                                        _hover={{ cursor: 'pointer' }}
                                        minWidth={'16px'}
                                      >
                                        {statusHoverIndex != '2' + idx ? (
                                          <Image
                                            src={ `/${
                                              allSplit?.[lower_bound + idx]
                                                ?.tokenB
                                            }.svg`}
                                            alt="Picture of the author"
                                            width="16"
                                            height="16"
                                          />
                                        ) : (
                                          <ExpandedCoinIcon
                                            asset={
                                              allSplit?.[lower_bound + idx]
                                                ?.tokenB
                                            }
                                          />
                                        )}
                                      </Box>
                                    </>
                                  )
                                ) : (
                                  <Box
                                    onMouseEnter={() =>
                                      handleStatusHover('3' + idx)
                                    }
                                    onMouseLeave={() =>
                                      handleStatusHoverLeave()
                                    }
                                    _hover={{ cursor: 'pointer' }}
                                    display="flex"
                                    gap={0.5}
                                    minWidth={'16px'}
                                  >
                                    {statusHoverIndex != '3' + idx ? (
                                      <Image
                                        src={borrow?.l3App==="ZKLEND" ?`/${borrow?.loanMarket.slice(1)}.svg`:`/${borrow.currentLoanMarket}.svg`}
                                        alt="Picture of the author"
                                        width="16"
                                        height="16"
                                      />
                                    ) : (
                                      // </Box>
                                      <ExpandedCoinIcon
                                        asset={borrow?.l3App==="ZKLEND" ?borrow.loanMarket.slice(1):borrow.currentLoanMarket}
                                      />
                                      
                                    )}
                                  </Box>
                                )}
                              </Box>
                              

                              <Box fontSize="14px" fontWeight="400">
                                {borrow.spendType == 'LIQUIDITY' &&borrow?.l3App!=="ZKLEND" ? (
                                  allSplit?.length === 0 ? (
                                    <Skeleton
                                      width="6rem"
                                      height="1.2rem"
                                      startColor="#101216"
                                      endColor="#2B2F35"
                                      borderRadius="6px"
                                    />
                                  ) : allSplit &&
                                    allSplit[lower_bound + idx] === 'empty' ? (
                                    '-'
                                  ) : dollarConversions == true ? (
                                    '$' +

                                    (numberFormatter(
                                      dollarConvertor(
                                        allSplit?.[lower_bound + idx]?.amountA,
                                        allSplit?.[lower_bound + idx]?.tokenA,
                                        oraclePrices
                                      )
                                    ) +
                                    '/$' +
                                    numberFormatter(
                                      dollarConvertor(
                                        allSplit?.[lower_bound + idx]?.amountB,
                                        allSplit?.[lower_bound + idx]?.tokenB,
                                        oraclePrices
                                      )
                                    ))
                                  ) : (
                                    numberFormatter(
                                      allSplit?.[lower_bound + idx]?.amountA
                                    ) +
                                    '/' +
                                    numberFormatter(
                                      allSplit?.[lower_bound + idx]?.amountB
                                    )
                                  )
                                ) : dollarConversions == true ? (
                                  '$' +
                                  (borrow?.l3App=="ZKLEND" ?numberFormatter(zkLendSpend?.find(
                                    (val: any) =>
                                      val?.BorrowId ==
                                      borrow?.loanId
                                  )?.SpendValue):numberFormatter(
                                    dollarConvertor(
                                      borrow?.currentLoanAmountParsed,
                                      borrow.currentLoanMarket,
                                      oraclePrices
                                    )
                                  ))
                                ) : (
                                   borrow?.l3App==="ZKLEND" ?numberFormatter(zkLendSpend?.find(
                                    (val: any) =>
                                      val?.BorrowId ==
                                      borrow?.loanId
                                  )?.SpendValue/oraclePrices?.find((curr: any) => curr.name === borrow?.loanMarket.slice(1))
                                  ?.price): numberFormatter(
                                    borrow?.currentLoanAmountParsed
                                  )
                                )}
                              </Box>
                            </HStack>
                          </Box>
                        )}
                      </Td>

                      <Td>
                        {oraclePrices !== null ? (
                          <Box
                            width="100%"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height="3rem"
                          >
                            <Tooltip
                              hasArrow
                              label={
                                <Box>
                                  Return:
                                  {borrow.spendType == 'UNSPENT'
                                    ? dollarConvertor(
                                        borrow.currentLoanAmountParsed,
                                        borrow?.loanMarket.slice(1),
                                        oraclePrices
                                      ) -
                                        reduxProtocolStats?.find(
                                          (val: any) =>
                                            val?.token ==
                                            borrow?.loanMarket.slice(1)
                                        )?.exchangeRateDTokenToUnderlying *
                                          dollarConvertor(
                                            borrow.loanAmountParsed,
                                            borrow?.loanMarket.slice(1),
                                            oraclePrices
                                          ) >=
                                      0
                                      ? '$'
                                      : '-$'
                                    : borrow.spendType == 'LIQUIDITY'
                                      ? borrow?.l3App==="ZKLEND" ?
                                      zkLendSpend?.find(
                                        (val: any) =>
                                          val?.BorrowId ==
                                          borrow?.loanId
                                      )?.SpendValue-dollarConvertor(
                                        borrow.loanAmountParsed,
                                        borrow?.loanMarket.slice(1),
                                        oraclePrices
                                      ) *
                                        reduxProtocolStats?.find(
                                          (val: any) =>
                                            val?.token ==
                                            borrow?.loanMarket.slice(1)
                                        )?.exchangeRateDTokenToUnderlying>=0 ?'$':'-$'
                                      : dollarConvertor(
                                          allSplit?.[lower_bound + idx]
                                            ?.amountA,
                                          allSplit?.[lower_bound + idx]?.tokenA,
                                          oraclePrices
                                        ) +
                                          dollarConvertor(
                                            allSplit?.[lower_bound + idx]
                                              ?.amountB,
                                            allSplit?.[lower_bound + idx]
                                              ?.tokenB,
                                            oraclePrices
                                          ) -
                                          dollarConvertor(
                                            borrow.loanAmountParsed,
                                            borrow?.loanMarket.slice(1),
                                            oraclePrices
                                          ) *
                                            reduxProtocolStats?.find(
                                              (val: any) =>
                                                val?.token ==
                                                borrow?.loanMarket.slice(1)
                                            )?.exchangeRateDTokenToUnderlying >=
                                        0
                                        ? '$'
                                        : '-$'
                                      : borrow.spendType == 'SWAP'
                                        ? dollarConvertor(
                                            borrow.currentLoanAmountParsed,
                                            borrow?.currentLoanMarket,
                                            oraclePrices
                                          ) -
                                            dollarConvertor(
                                              borrow.loanAmountParsed,
                                              borrow?.loanMarket.slice(1),
                                              oraclePrices
                                            ) *
                                              reduxProtocolStats?.find(
                                                (val: any) =>
                                                  val?.token ==
                                                  borrow?.loanMarket.slice(1)
                                              )
                                                ?.exchangeRateDTokenToUnderlying >=
                                          0
                                          ? '$'
                                          : '-$'
                                        : ''}
                                  {borrow.spendType == 'UNSPENT'
                                    ? numberFormatter(
                                        Math.abs(
                                          dollarConvertor(
                                            borrow.currentLoanAmountParsed,
                                            borrow?.loanMarket.slice(1),
                                            oraclePrices
                                          ) -
                                            reduxProtocolStats?.find(
                                              (val: any) =>
                                                val?.token ==
                                                borrow?.loanMarket.slice(1)
                                            )?.exchangeRateDTokenToUnderlying *
                                              dollarConvertor(
                                                borrow.loanAmountParsed,
                                                borrow?.loanMarket.slice(1),
                                                oraclePrices
                                              )
                                        )
                                      )
                                    : borrow.spendType == 'LIQUIDITY'
                                      ?borrow?.l3App==="ZKLEND" ?
                                      numberFormatter(Math.abs(zkLendSpend?.find(
                                        (val: any) =>
                                          val?.BorrowId ==
                                          borrow?.loanId
                                      )?.SpendValue-(dollarConvertor(
                                        borrow.loanAmountParsed,
                                        borrow?.loanMarket.slice(1),
                                        oraclePrices
                                      ) *
                                        reduxProtocolStats?.find(
                                          (val: any) =>
                                            val?.token ==
                                            borrow?.loanMarket.slice(1)
                                        )?.exchangeRateDTokenToUnderlying))): numberFormatter(
                                          Math.abs(
                                            dollarConvertor(
                                              borrow.loanAmountParsed,
                                              borrow?.loanMarket.slice(1),
                                              oraclePrices
                                            ) *
                                              reduxProtocolStats?.find(
                                                (val: any) =>
                                                  val?.token ==
                                                  borrow?.loanMarket.slice(1)
                                              )
                                                ?.exchangeRateDTokenToUnderlying -
                                              (dollarConvertor(
                                                allSplit?.[lower_bound + idx]
                                                  ?.amountA,
                                                allSplit?.[lower_bound + idx]
                                                  ?.tokenA,
                                                oraclePrices
                                              ) +
                                                dollarConvertor(
                                                  allSplit?.[lower_bound + idx]
                                                    ?.amountB,
                                                  allSplit?.[lower_bound + idx]
                                                    ?.tokenB,
                                                  oraclePrices
                                                ))
                                          )
                                        )
                                      : borrow.spendType == 'SWAP'
                                        ? numberFormatter(
                                            Math.abs(
                                              dollarConvertor(
                                                borrow.loanAmountParsed,
                                                borrow?.loanMarket.slice(1),
                                                oraclePrices
                                              ) *
                                                reduxProtocolStats?.find(
                                                  (val: any) =>
                                                    val?.token ==
                                                    borrow?.loanMarket.slice(1)
                                                )
                                                  ?.exchangeRateDTokenToUnderlying -
                                                dollarConvertor(
                                                  borrow.currentLoanAmountParsed,
                                                  borrow?.currentLoanMarket,
                                                  oraclePrices
                                                )
                                            )
                                          )
                                        : ''}
                                </Box>
                              }
                              placement="right"
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
                            >
                              <Text
                                color={
                                  borrow?.spendType == 'UNSPENT'
                                    ? dollarConvertor(
                                        borrow.currentLoanAmountParsed,
                                        borrow?.loanMarket.slice(1),
                                        oraclePrices
                                      ) -
                                        reduxProtocolStats?.find(
                                          (val: any) =>
                                            val?.token ==
                                            borrow?.loanMarket.slice(1)
                                        )?.exchangeRateDTokenToUnderlying *
                                          dollarConvertor(
                                            borrow.loanAmountParsed,
                                            borrow?.loanMarket.slice(1),
                                            oraclePrices
                                          ) >=
                                      0
                                      ? '#00D395'
                                      : 'rgb(255 94 94)'
                                    : borrow?.spendType == 'LIQUIDITY'
                                      ? borrow?.l3App=="ZKLEND" ? zkLendSpend?.find(
                                        (val: any) =>
                                          val?.BorrowId ==
                                          borrow?.loanId
                                      )?.SpendValue-(dollarConvertor(
                                        borrow.loanAmountParsed,
                                        borrow?.loanMarket.slice(1),
                                        oraclePrices
                                      ) *
                                        reduxProtocolStats?.find(
                                          (val: any) =>
                                            val?.token ==
                                            borrow?.loanMarket.slice(1)
                                        )?.exchangeRateDTokenToUnderlying)>=0?'#00D395':'rgb(255 94 94)' : dollarConvertor(
                                          allSplit?.[lower_bound + idx]
                                            ?.amountA,
                                          allSplit?.[lower_bound + idx]?.tokenA,
                                          oraclePrices
                                        ) +
                                          dollarConvertor(
                                            allSplit?.[lower_bound + idx]
                                              ?.amountB,
                                            allSplit?.[lower_bound + idx]
                                              ?.tokenB,
                                            oraclePrices
                                          ) -
                                          dollarConvertor(
                                            borrow.loanAmountParsed,
                                            borrow?.loanMarket.slice(1),
                                            oraclePrices
                                          ) *
                                            reduxProtocolStats?.find(
                                              (val: any) =>
                                                val?.token ==
                                                borrow?.loanMarket.slice(1)
                                            )?.exchangeRateDTokenToUnderlying >=
                                        0
                                        ? '#00D395'
                                        : 'rgb(255 94 94)'
                                      : borrow.spendType == 'SWAP'
                                        ? dollarConvertor(
                                            borrow.currentLoanAmountParsed,
                                            borrow?.currentLoanMarket,
                                            oraclePrices
                                          ) -
                                            dollarConvertor(
                                              borrow.loanAmountParsed,
                                              borrow?.loanMarket.slice(1),
                                              oraclePrices
                                            ) *
                                              reduxProtocolStats?.find(
                                                (val: any) =>
                                                  val?.token ==
                                                  borrow?.loanMarket.slice(1)
                                              )
                                                ?.exchangeRateDTokenToUnderlying >=
                                          0
                                          ? '#00D395'
                                          : 'rgb(255 94 94)'
                                        : ''
                                }
                              >
                                {borrow.spendType == 'UNSPENT'
                                  ? dollarConvertor(
                                      borrow.currentLoanAmountParsed,
                                      borrow?.loanMarket.slice(1),
                                      oraclePrices
                                    ) -
                                      reduxProtocolStats?.find(
                                        (val: any) =>
                                          val?.token ==
                                          borrow?.loanMarket.slice(1)
                                      )?.exchangeRateDTokenToUnderlying *
                                        dollarConvertor(
                                          borrow.loanAmountParsed,
                                          borrow?.loanMarket.slice(1),
                                          oraclePrices
                                        ) >=
                                    0
                                    ? '+'
                                    : '-'
                                  : borrow.spendType == 'LIQUIDITY'
                                    ? borrow?.l3App==="ZKLEND" ? zkLendSpend?.find(
                                      (val: any) =>
                                        val?.BorrowId ==
                                        borrow?.loanId
                                    )?.SpendValue-(dollarConvertor(
                                      borrow.loanAmountParsed,
                                      borrow?.loanMarket.slice(1),
                                      oraclePrices
                                    ) *
                                      reduxProtocolStats?.find(
                                        (val: any) =>
                                          val?.token ==
                                          borrow?.loanMarket.slice(1)
                                      )?.exchangeRateDTokenToUnderlying)>=0 ?'+':'-': dollarConvertor(
                                        allSplit?.[lower_bound + idx]?.amountA,
                                        allSplit?.[lower_bound + idx]?.tokenA,
                                        oraclePrices
                                      ) +
                                        dollarConvertor(
                                          allSplit?.[lower_bound + idx]
                                            ?.amountB,
                                          allSplit?.[lower_bound + idx]?.tokenB,
                                          oraclePrices
                                        ) -
                                        dollarConvertor(
                                          borrow.loanAmountParsed,
                                          borrow?.loanMarket.slice(1),
                                          oraclePrices
                                        ) *
                                          reduxProtocolStats?.find(
                                            (val: any) =>
                                              val?.token ==
                                              borrow?.loanMarket.slice(1)
                                          )?.exchangeRateDTokenToUnderlying >=
                                      0
                                      ? '+'
                                      : '-'
                                    : borrow.spendType == 'SWAP'
                                      ? dollarConvertor(
                                          borrow.currentLoanAmountParsed,
                                          borrow?.currentLoanMarket,
                                          oraclePrices
                                        ) -
                                          dollarConvertor(
                                            borrow.loanAmountParsed,
                                            borrow?.loanMarket.slice(1),
                                            oraclePrices
                                          ) *
                                            reduxProtocolStats?.find(
                                              (val: any) =>
                                                val?.token ==
                                                borrow?.loanMarket.slice(1)
                                            )?.exchangeRateDTokenToUnderlying >=
                                        0
                                        ? '+'
                                        : '-'
                                      : ''}
                                {borrow.spendType == 'UNSPENT'
                                  ? numberFormatterPercentage(
                                      (100 *
                                        Math.abs(
                                          dollarConvertor(
                                            borrow.currentLoanAmountParsed,
                                            borrow?.loanMarket.slice(1),
                                            oraclePrices
                                          ) -
                                            reduxProtocolStats?.find(
                                              (val: any) =>
                                                val?.token ==
                                                borrow?.loanMarket.slice(1)
                                            )?.exchangeRateDTokenToUnderlying *
                                              dollarConvertor(
                                                borrow.loanAmountParsed,
                                                borrow?.loanMarket.slice(1),
                                                oraclePrices
                                              )
                                        )) /
                                        dollarConvertor(
                                          borrow?.collateralAmountParsed,
                                          borrow?.collateralMarket.slice(1),
                                          oraclePrices
                                        )
                                    )
                                  : borrow.spendType == 'LIQUIDITY'
                                    ? borrow?.l3App==="ZKLEND" ?numberFormatterPercentage(100*Math.abs((zkLendSpend?.find(
                                      (val: any) =>
                                        val?.BorrowId ==
                                        borrow?.loanId
                                    )?.SpendValue-(dollarConvertor(
                                      borrow.loanAmountParsed,
                                      borrow?.loanMarket.slice(1),
                                      oraclePrices
                                    ) *
                                      reduxProtocolStats?.find(
                                        (val: any) =>
                                          val?.token ==
                                          borrow?.loanMarket.slice(1)
                                      )?.exchangeRateDTokenToUnderlying))/
                                      dollarConvertor(
                                        borrow?.collateralAmountParsed,
                                        borrow?.collateralMarket.slice(1),
                                        oraclePrices
                                      ))): numberFormatterPercentage(
                                        (100 *
                                          Math.abs(
                                            dollarConvertor(
                                              borrow.loanAmountParsed,
                                              borrow?.loanMarket.slice(1),
                                              oraclePrices
                                            ) *
                                              reduxProtocolStats?.find(
                                                (val: any) =>
                                                  val?.token ==
                                                  borrow?.loanMarket.slice(1)
                                              )
                                                ?.exchangeRateDTokenToUnderlying -
                                              (dollarConvertor(
                                                allSplit?.[lower_bound + idx]
                                                  ?.amountA,
                                                allSplit?.[lower_bound + idx]
                                                  ?.tokenA,
                                                oraclePrices
                                              ) +
                                                dollarConvertor(
                                                  allSplit?.[lower_bound + idx]
                                                    ?.amountB,
                                                  allSplit?.[lower_bound + idx]
                                                    ?.tokenB,
                                                  oraclePrices
                                                ))
                                          )) /
                                          dollarConvertor(
                                            borrow?.collateralAmountParsed,
                                            borrow?.collateralMarket.slice(1),
                                            oraclePrices
                                          )
                                      )
                                    : borrow.spendType == 'SWAP'
                                      ? numberFormatterPercentage(
                                          (100 *
                                            Math.abs(
                                              dollarConvertor(
                                                borrow.loanAmountParsed,
                                                borrow?.loanMarket.slice(1),
                                                oraclePrices
                                              ) *
                                                reduxProtocolStats?.find(
                                                  (val: any) =>
                                                    val?.token ==
                                                    borrow?.loanMarket.slice(1)
                                                )
                                                  ?.exchangeRateDTokenToUnderlying -
                                                dollarConvertor(
                                                  borrow.currentLoanAmountParsed,
                                                  borrow?.currentLoanMarket,
                                                  oraclePrices
                                                )
                                            )) /
                                            dollarConvertor(
                                              borrow?.collateralAmountParsed,
                                              borrow?.collateralMarket.slice(1),
                                              oraclePrices
                                            )
                                        )
                                      : ''}
                                %
                              </Text>
                            </Tooltip>
                          </Box>
                        ) : (
                          <Box
                            width="100%"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height="3rem"
                          >
                            <Skeleton
                              width="6rem"
                              height="1.2rem"
                              startColor="#101216"
                              endColor="#2B2F35"
                              borderRadius="6px"
                            />
                          </Box>
                        )}
                      </Td>

                      <Td
                        width={'12.5%'}
                        maxWidth={'3rem'}
                        fontSize={'14px'}
                        fontWeight={400}
                        overflow={'hidden'}
                        textAlign={'center'}
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
                          >
                            {avgsLoneHealth?.find(
                              (item: any) => item?.loanId == borrow?.loanId
                            )?.loanHealth ? (
                              avgsLoneHealth?.find(
                                (item: any) => item?.loanId == borrow?.loanId
                              )?.loanHealth > 1.15 ? (
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
                              ) : avgsLoneHealth?.find(
                                  (item: any) => item?.loanId === borrow?.loanId
                                )?.loanHealth > 1.09 &&
                                avgsLoneHealth?.find(
                                  (item: any) => item?.loanId === borrow?.loanId
                                )?.loanHealth <= 1.15 ? (
                                <Box>
                                  <MediumHeathFactor />
                                </Box>
                              ) : (
                                <Box>
                                  <LowhealthFactor />
                                </Box>
                              )
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
                      </Td>

                      <Td
                        width={'12.5%'}
                        maxWidth={'5rem'}
                        fontSize={'14px'}
                        fontWeight={400}
                        textAlign={'right'}
                        p={0}
                      >
                        <Box
                          width="100%"
                          height="100%"
                          display="flex"
                          alignItems="center"
                          justifyContent="flex-end"
                          fontWeight="400"
                          onClick={() => {
                            setCurrentBorrowId1('ID - ' + borrow.loanId)
                            setCurrentBorrowMarketCoin1(borrow.loanMarket)
                            setCurrentBorrowId2('ID - ' + borrow.loanId)
                            setCurrentBorrowMarketCoin2(borrow.loanMarket)
                            setBorrowAmount(borrow.loanAmountParsed)
                            setCollateralBalance(
                              borrow.collateralAmountParsed +
                                ' ' +
                                borrow.collateralMarket
                            )
                            posthog.capture('Your Borrow Actions Clicked', {
                              Clicked: true,
                            })
                            setCurrentSpendStatus(borrow.spendType)
                            setCurrentLoanAmount(borrow?.currentLoanAmount)
                            setCurrentLoanMarket(borrow?.currentLoanMarket)
                          }}
                        >
                          <Box>
                            <YourBorrowModal
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
                              height={'2rem'}
                              fontSize={'12px'}
                              padding="6px 12px"
                              border="1px solid #BDBFC1"
                              bgColor="#101216"
                              _hover={{ bg: 'white', color: 'black' }}
                              borderRadius={'6px'}
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
                        position: 'absolute',
                        width: '100%',
                        height: '1px',
                        borderBottom: '1px solid #2b2f35',
                        display: `${borrow.idx == 5 ? 'none' : 'block'}`,
                      }}
                    />
                  </>
                )
              }
            )}

            {(() => {
              const rows = []
              for (
                let i: number = 0;
                i < 6 - (upper_bound - lower_bound + 1);
                i++
              ) {
                rows.push(<Tr height="5.15rem" bgColor="red"></Tr>)
              }
              return rows
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
            bg="#676D9A4D"
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
            You do not have active borrow.
            <Box
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
                backGroundOverLay={'rgba(244, 242, 255, 0.5);'}
                borrowAPRs={borrowAPRs}
                currentBorrowAPR={currentBorrowAPR}
                validRTokens={validRTokens}
                setCurrentBorrowAPR={setCurrentBorrowAPR}
                coin={coinPassed}
              />
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}

export default BorrowDashboard
