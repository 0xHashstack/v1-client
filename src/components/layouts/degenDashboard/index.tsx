import {
  Box,
  Button,
  HStack,
  NumberInput,
  NumberInputField,
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
import axios from 'axios'
import Image from 'next/image'
import posthog from 'posthog-js'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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
  selectYourSupply,
  setNetAprLoans,
} from '@/store/slices/readDataSlice'
import {
  selectActiveTransactions,
  selectJedistrkTokenAllocation,
  selectMySplit,
  selectStrkAprData,
  selectnetSpendBalance,
  setActiveTransactions,
  setTransactionStarted,
  setTransactionStartedAndModalClosed,
  setTransactionStatus,
} from '@/store/slices/userAccountSlice'
import dollarConvertor from '@/utils/functions/dollarConvertor'
import numberFormatter from '@/utils/functions/numberFormatter'
import numberFormatterPercentage from '@/utils/functions/numberFormatterPercentage'
import TableInfoIcon from '../table/tableIcons/infoIcon'
import DegenModal from '@/components/modals/degenModal'
import SupplyModal from '@/components/modals/SupplyModal'
import useBorrowAndSpend from '@/Blockchain/hooks/Writes/useBorrowAndSpend'
import { toast } from 'react-toastify'
import CopyToClipboard from 'react-copy-to-clipboard'
import {
  selectModalDropDowns,
  setModalDropdown,
} from '@/store/slices/dropdownsSlice'
import DropdownUp from '@/assets/icons/dropdownUpIcon'
import TransactionCancelModal from '@/components/modals/TransactionCancelModal'
import useBalanceOf from '@/Blockchain/hooks/Reads/useBalanceOf'
import {
  tokenAddressMap,
  tokenDecimalsMap,
} from '@/Blockchain/utils/addressServices'
import { parseAmount } from '@/Blockchain/utils/utils'
import { uint256 } from 'starknet'

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
  Borrows: any
  userLoans: any
  supplyAPRs: any
  borrowAPRs: any
  supplies: any
}

const tooltips = [
  '',
  '',
  'Tokens held as security for borrowed funds.',
  'Collateral you will be using to execute the strategy.',
  'Leverage you will be getting. If you increase the collateral amount the leverage will be reduced and vice versa.',
  'The quantity of tokens you want to borrow from the protocol.',
  'Estimated maximum return you may receive from the strategy.',
  'Loan risk metric comparing collateral value to borrowed amount to check potential liquidation.',
]

const DegenDashboard: React.FC<BorrowDashboardProps> = ({
  width,
  currentPagination,
  Coins,
  setCurrentPagination,
  supplyAPRs,
  borrowAPRs,
  columnItems,
  Borrows,
  supplies,
}) => {
  const {
    loanMarket,
    setLoanMarket,
    loanAmount,
    setLoanAmount,
    rToken,
    setRToken,
    rTokenAmount,
    setRTokenAmount, // done
    collateralMarket,
    setCollateralMarket,
    collateralAmount,
    setCollateralAmount, // done

    l3App,
    setL3App,
    method,
    setMethod,
    toMarketSwap,
    setToMarketSwap,

    toMarketLiqA,
    setToMarketLiqA,
    toMarketLiqB,
    setToMarketLiqB,

    dataBorrowAndSpend,
    errorBorrowAndSpend,
    resetBorrowAndSpend,
    writeAsyncBorrowAndSpend,
    isErrorBorrowAndSpend,
    isIdleBorrowAndSpend,
    isSuccessBorrowAndSpend,
    statusBorrowAndSpend,

    dataBorrowAndSpendRToken,
    errorBorrowAndSpendRToken,
    resetBorrowAndSpendRToken,
    writeAsyncBorrowAndSpendRToken,
    isErrorBorrowAndSpendRToken,
    isIdleBorrowAndSpendRToken,
    isSuccessBorrowAndSpendRToken,
    statusBorrowAndSpendRToken,
  } = useBorrowAndSpend()

  const [currentCollateralCoin, setCurrentCollateralCoin] = useState('BTC')
  const [depositTransHash, setDepositTransHash] = useState('')
  const [toastId, setToastId] = useState<any>()
  let activeTransactions = useSelector(selectActiveTransactions)
  const [uniqueID, setUniqueID] = useState(0)
  const getUniqueId = () => uniqueID
  const [currentTransactionStatus, setCurrentTransactionStatus] = useState('')
  const dispatch = useDispatch()
  const [currentBorrowAPR, setCurrentBorrowAPR] = useState<number>(0)
  const [currentSupplyAPR, setCurrentSupplyAPR] = useState<number>(0)
  const [currentBorrowMarketCoin, setCurrentBorrowMarketCoin] = useState('BTC')
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
  const [showEmptyNotification, setShowEmptyNotification] = useState(false)
  const avgs = useSelector(selectEffectiveApr)
  const allSplit = useSelector(selectMySplit)
  const [loading, setLoading] = useState(false)
  const [coinPassed, setCoinPassed] = useState({
    name: 'USDT',
    icon: 'mdi-bitcoin',
    symbol: 'USDT',
  })
  const userDeposit = useSelector(selectUserDeposits)
  const [maxSuppliedCoin, setmaxSuppliedCoin] = useState('USDT')
  const modalDropdowns = useSelector(selectModalDropDowns)
  const oraclePrices = useSelector(selectOraclePrices)
  const totalSupply = useSelector(selectYourSupply)
  const stats = useSelector(selectProtocolStats)
  const poolAprs = useSelector(selectJediswapPoolAprs)
  let lower_bound = 6 * (currentPagination - 1)
  let upper_bound = lower_bound + 5
  upper_bound = Math.min(Borrows ? Borrows.length - 1 : 0, upper_bound)
  const [allocationData, setallocationData] = useState<any>()
  const [poolAllocatedData, setpoolAllocatedData] = useState<any>()

  useEffect(() => {
    if (supplies) {
      let maxvalue = 0
      let coinsuppliedvalue = 0
      supplies.map(
        (
          supply: {
            underlyingAssetAmountParsed: number
            token: React.SetStateAction<string>
          },
          idx: any
        ) => {
          if (supply?.underlyingAssetAmountParsed > 0) {
            coinsuppliedvalue =
              supply?.underlyingAssetAmountParsed *
              oraclePrices?.find((curr: any) => curr.name === supply?.token)
                ?.price
            if (coinsuppliedvalue > maxvalue) {
              maxvalue = coinsuppliedvalue
              setmaxSuppliedCoin(supply?.token)
            }
          }
        }
      )
    }
  }, [supplies])

  interface assetB {
    USDT: any
    USDC: any
    BTC: any
    ETH: any
    DAI: any
    STRK: any
  }
  const walletBalances: assetB | any = {
    USDT: useBalanceOf(tokenAddressMap['USDT']),
    USDC: useBalanceOf(tokenAddressMap['USDC']),
    BTC: useBalanceOf(tokenAddressMap['BTC']),
    ETH: useBalanceOf(tokenAddressMap['ETH']),
    DAI: useBalanceOf(tokenAddressMap['DAI']),
    STRK: useBalanceOf(tokenAddressMap['STRK']),
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

  const strkData = useSelector(selectStrkAprData)
  const netSpendBalance = useSelector(selectnetSpendBalance)

  const [netStrkBorrow, setnetStrkBorrow] = useState(0)

  useEffect(() => {
    if (totalSupply) {
      if (totalSupply < 1000) {
        setShowEmptyNotification(true)
      }
    }
  }, [totalSupply])

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

  const [collateralAmounts, setCollateralAmounts] = useState<any>([]) // Initialize with default values
  const [collateralMarkets, setcollateralMarkets] = useState<any>([])
  const [tokenSelection, setTokenSelection] = useState(Array(40).fill(0))
  useEffect(() => {
    // Initialize collateralAmounts with the values from Borrows
    if (Borrows.length > 0 && oraclePrices != null) {
      setCollateralAmounts(
        Borrows.sort((a: { collateral: string }, b: { collateral: string }) => {
          // Check if 'coin' matches 'collateralcoin'
          const isCollateralA = a.collateral === maxSuppliedCoin
          const isCollateralB = b.collateral === maxSuppliedCoin

          if (isCollateralA && !isCollateralB) {
            return -1 // 'a' should come before 'b'
          } else if (!isCollateralA && isCollateralB) {
            return 1 // 'b' should come before 'a'
          } else {
            return 0 // No change in order
          }
        }).map(
          (borrow: {
            collateral: string
            leverage: any
            collateralSuggestedAmount: any
          }) =>
            (
              5000 /
              borrow?.leverage /
              oraclePrices?.find(
                (curr: any) => curr.name === borrow?.collateral
              )?.price
            ).toFixed(4) || 0
        )
      )
    }
  }, [Borrows, maxSuppliedCoin, oraclePrices])

  useEffect(() => {
    if (Borrows.length > 0 && oraclePrices != null) {
      setcollateralMarkets(
        Borrows.sort((a: { collateral: string }, b: { collateral: string }) => {
          // Check if 'coin' matches 'collateralcoin'
          const isCollateralA = a.collateral === maxSuppliedCoin
          const isCollateralB = b.collateral === maxSuppliedCoin

          if (isCollateralA && !isCollateralB) {
            return -1 // 'a' should come before 'b'
          } else if (!isCollateralA && isCollateralB) {
            return 1 // 'b' should come before 'a'
          } else {
            return 0 // No change in order
          }
        }).map((borrow: { collateral: string }) => borrow?.collateral)
      )
    }
  }, [Borrows, maxSuppliedCoin, oraclePrices])

  const handleTokenChange = (value: any, index: number) => {
    const newTokenSelections = [...tokenSelection]
    newTokenSelections[index] = value || 0 // Convert value to float or default to 0 if it's not a valid number
    setTokenSelection(newTokenSelections)
  }

  const handleInputChange = (value: any, index: number) => {
    if (value > 9_000_000_000) return
    const newCollateralAmounts = [...collateralAmounts]
    newCollateralAmounts[index] = value || 0 // Convert value to float or default to 0 if it's not a valid number
    setCollateralAmounts(newCollateralAmounts)
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
  const [selectedIndex, setselectedIndex] = useState(null)
  const [openDropdown, setOpenDropdown] = useState(null)

  const handleDropdownClick = (dropdownId: any) => {
    if (openDropdown === dropdownId) {
      setOpenDropdown(null) // Close the dropdown if it's already open
    } else {
      setOpenDropdown(dropdownId) // Open the clicked dropdown
    }
  }
  const handleBorrowAndSpend = async () => {
    try {
      if (tokenSelection[selectedIndex ? selectedIndex : 0] != 1) {
        const borrowAndSpend = await writeAsyncBorrowAndSpend()
        setDepositTransHash(borrowAndSpend?.transaction_hash)
        if (borrowAndSpend?.transaction_hash) {
          const toastid = toast.info(
            // `Please wait your transaction is running in background`,
            `Transaction pending`,
            {
              position: toast.POSITION.BOTTOM_RIGHT,
              autoClose: false,
            }
          )
          setToastId(toastid)
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
            transaction_hash: borrowAndSpend?.transaction_hash.toString(),
            // message: `You have successfully traded`,
            message: `Transaction successful`,
            toastId: toastid,
            setCurrentTransactionStatus: setCurrentTransactionStatus,
            uniqueID: uqID,
          }
          posthog.capture('Degen Spend Successfully', {
            Status: 'Success',
            transaction_hash: borrowAndSpend?.transaction_hash.toString(),
          })
          // addTransaction({ hash: deposit?.transaction_hash });
          activeTransactions?.push(trans_data)

          dispatch(setActiveTransactions(activeTransactions))
          dispatch(setTransactionStatus('success'))
        }
        // const uqID = getUniqueId();
        // let data: any = localStorage.getItem("transactionCheck");
        // data = data ? JSON.parse(data) : [];
        // if (data && data.includes(uqID)) {
        //   dispatch(setTransactionStatus("success"));
        // }
      } else if (tokenSelection[selectedIndex ? selectedIndex : 0] == 1) {
        const borrowAndSpendR = await writeAsyncBorrowAndSpendRToken()
        setDepositTransHash(borrowAndSpendR?.transaction_hash)
        if (borrowAndSpendR?.transaction_hash) {
          const toastid = toast.info(
            // `Please wait your transaction is running in background`,
            `Transaction pending`,
            {
              position: toast.POSITION.BOTTOM_RIGHT,
              autoClose: false,
            }
          )
          setToastId(toastid)
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
            transaction_hash: borrowAndSpendR?.transaction_hash.toString(),
            // message: `You have successfully traded`,
            message: `Transaction successful`,
            toastId: toastid,
            setCurrentTransactionStatus: setCurrentTransactionStatus,
            uniqueID: uqID,
          }
          // addTransaction({ hash: deposit?.transaction_hash });
          posthog.capture('Degen Spend Successfully', {
            Status: 'Success',
            transaction_hash: borrowAndSpendR?.transaction_hash.toString(),
          })
          activeTransactions?.push(trans_data)

          dispatch(setActiveTransactions(activeTransactions))
          dispatch(setTransactionStatus('success'))
        }
        // const uqID = getUniqueId();
        // let data: any = localStorage.getItem("transactionCheck");
        // data = data ? JSON.parse(data) : [];
        // if (data && data.includes(uqID)) {
        //   dispatch(setTransactionStatus("success"));
        // }
      }
    } catch (err: any) {
      //console.log(err);
      const uqID = getUniqueId()
      let data: any = localStorage.getItem('transactionCheck')
      data = data ? JSON.parse(data) : []
      if (data && data.includes(uqID)) {
        // dispatch(setTransactionStatus("failed"));
        setTransactionStarted(false)
      }
      const toastContent = (
        <div>
          Transaction declined{' '}
          <CopyToClipboard text={err}>
            <Text as="u">copy error!</Text>
          </CopyToClipboard>
        </div>
      )
      posthog.capture('Degen Spend failed', {
        Status: 'Failure',
      })
      setselectedIndex(null)
      toast.error(toastContent, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      })
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
          item.amm === (l3App == 'JEDI_SWAP' ? 'jedi' : 'myswap')
        )
      }
    })
    return matchedObject ? matchedObject.apr * 100 : 0
  }

  const ddRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedIndex != null) {
      handleBorrowAndSpend()
    }
  }, [selectedIndex])

  const strkTokenAlloactionData: any = useSelector(
    selectJedistrkTokenAllocation
  )
  const coin = { name: 'ETH', icon: 'mdi-ethereum', symbol: 'WETH' }
  const borrowcoin = { name: 'BTC', icon: 'mdi-bitcoin', symbol: 'WBTC' }
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
          item.amm === (l3App == 'JEDI_SWAP' ? 'jedi' : 'myswap')
        )
      }
    })
    return matchedObject ? matchedObject.tvl : 1
  }
  // console.log(strkTokenAlloactionData["STRK/ETH"][strkTokenAlloactionData["STRK/ETH"].length-1].allocation,"allocat")

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
  ) : upper_bound >= lower_bound &&
    Borrows &&
    Borrows?.length > 0 &&
    totalSupply >= 0 ? (
    <Box
      bg="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
      color="white"
      borderRadius="md"
      w={width}
      display="flex"
      flexDirection="column"
      height={'39rem'}
      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30)) "
      padding={'1rem 2rem 0rem'}
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
        height={'37rem'}
        overflowX="visible"
        overflowY="visible"
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
                  <Text
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
                    pl={idx1 == 0 ? 2 : idx1 == 1 ? '55%' : '29%'}
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
                  </Text>
                </Td>
              ))}
            </Tr>
          </Thead>
          <Tbody position="relative" overflowX="hidden">
            {Borrows.sort(
              (
                a: { collateralCoin: string },
                b: { collateralCoin: string }
              ) => {
                // Check if 'coin' matches 'collateralcoin'
                const isCollateralA = a.collateralCoin === maxSuppliedCoin
                const isCollateralB = b.collateralCoin === maxSuppliedCoin

                if (isCollateralA && !isCollateralB) {
                  return -1 // 'a' should come before 'b'
                } else if (!isCollateralA && isCollateralB) {
                  return 1 // 'b' should come before 'a'
                } else {
                  return 0 // No change in order
                }
              }
            )
              .slice(lower_bound, upper_bound + 1)
              // .sort((a: { maxApr: number; }, b: { maxApr: number; }) => b.maxApr - a.maxApr)
              .map((borrow: any, idx: any) => {
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
                              src={`/${borrow?.dappName}.svg`}
                              alt="Picture of the author"
                              width="32"
                              height="32"
                            />
                            <Text fontSize="14px" fontWeight="400">
                              {borrow?.dappName}
                            </Text>
                          </HStack>
                          <Tooltip
                            hasArrow
                            label={
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                gap="2rem"
                                padding="8px"
                              >
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  gap="0.5rem"
                                >
                                  <Text>Collateral</Text>
                                  <Box display="flex" gap="0.2rem">
                                    <Image
                                      src={`/${borrow?.collateral}.svg`}
                                      alt="Picture of the author"
                                      width="14"
                                      height="14"
                                    />
                                    <Text fontSize="14px" fontWeight="400">
                                      {tokenSelection[lower_bound + idx] == 0
                                        ? borrow?.collateral
                                        : 'r' + borrow?.collateral}
                                    </Text>
                                  </Box>
                                  <Text color="#00D395">
                                    {
                                      stats?.find(
                                        (stat: any) =>
                                          stat?.token === borrow?.collateral
                                      )?.supplyRate
                                    }
                                    %
                                  </Text>
                                </Box>
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  gap="0.5rem"
                                >
                                  <Text>Borowed</Text>
                                  <Box display="flex" gap="0.2rem">
                                    <Image
                                      src={`/${borrow?.debt}.svg`}
                                      alt="Picture of the author"
                                      width="14"
                                      height="14"
                                    />
                                    <Text fontSize="14px" fontWeight="400">
                                      {borrow?.debt}
                                    </Text>
                                  </Box>
                                  <Text color="#FF4240">
                                    -
                                    {
                                      stats?.find(
                                        (stat: any) =>
                                          stat?.token === borrow?.debt
                                      )?.borrowRate
                                    }
                                    %
                                  </Text>
                                </Box>
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  gap="0.5rem"
                                >
                                  <Text>Dapp</Text>
                                  <Box display="flex" gap="0.2rem">
                                    <Image
                                      src={`/${borrow?.dappName}.svg`}
                                      alt="Picture of the author"
                                      width="14"
                                      height="14"
                                    />
                                    <Text fontSize="14px" fontWeight="400">
                                      {borrow?.dappName}
                                    </Text>
                                  </Box>
                                </Box>
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  gap="0.5rem"
                                >
                                  <Text>Rewards</Text>
                                  <Box display="flex" gap="0.2rem">
                                    <Image
                                      src={`/${'STRK'}.svg`}
                                      alt="Picture of the author"
                                      width="14"
                                      height="14"
                                    />
                                    <Text fontSize="14px" fontWeight="400">
                                      STRK
                                    </Text>
                                  </Box>
                                  <Text color="#00D395">
                                    {numberFormatterPercentage(
                                      borrow?.leverage *
                                        getBoostedApr(borrow?.debt) +
                                        getBoostedAprSupply(borrow?.collateral)
                                    )}
                                    %
                                  </Text>
                                </Box>
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  gap="0.5rem"
                                >
                                  <Text>Total Rewards</Text>
                                  <Box display="flex" gap="0.2rem">
                                    <Text
                                      fontSize="14px"
                                      fontWeight="400"
                                      color="#00D395"
                                    >
                                      {numberFormatterPercentage(
                                        Number(
                                          borrow?.leverage *
                                            (-stats?.find(
                                              (stat: any) =>
                                                stat?.token === borrow?.debt
                                            )?.borrowRate +
                                              getAprByPool(
                                                poolAprs,
                                                borrow?.secondary,
                                                'JEDI_SWAP'
                                              ) +
                                              getBoostedApr(borrow?.debt) +
                                              (100 *
                                                365 *
                                                (getStrkAlloaction(
                                                  borrow?.secondary
                                                ) *
                                                  oraclePrices?.find(
                                                    (curr: any) =>
                                                      curr.name === 'STRK'
                                                  )?.price)) /
                                                getTvlByPool(
                                                  poolAprs,
                                                  borrow?.secondary,
                                                  'JEDI_SWAP'
                                                )) +
                                            (stats?.find(
                                              (stat: any) =>
                                                stat?.token ===
                                                borrow?.collateral
                                            )?.supplyRate +
                                              getBoostedAprSupply(
                                                borrow?.collateral
                                              ))
                                        )
                                      )}
                                      %
                                    </Text>
                                  </Box>
                                </Box>
                              </Box>
                            }
                            placement={'bottom'}
                            ml="4rem"
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
                            maxWidth="100rem"
                          >
                            <Box color="#B1B0B5" fontSize="12px">
                              {borrow.format.slice(9)}
                            </Box>
                          </Tooltip>
                        </VStack>
                      </Td>

                      <Td
                        width={'12.5%'}
                        fontSize={'14px'}
                        fontWeight={400}
                        overflow={'hidden'}
                        textAlign={'center'}
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
                              {borrow.type == 'LP'
                                ? 'Liquidity Provision'
                                : 'Swap'}
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
                        width={'12.5%'}
                        maxWidth={'5rem'}
                        fontSize={'14px'}
                        fontWeight={400}
                        textAlign={'center'}
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
                            // width="2rem"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Box
                              display="flex"
                              border="1px"
                              borderColor="#2B2F35"
                              justifyContent="space-between"
                              ml="2rem"
                              py="2"
                              pl="3"
                              pr="3"
                              width="7rem"
                              borderRadius="md"
                              className="navbar"
                              cursor="pointer"
                              ref={ddRef}
                              // gap="2rem"
                              onClick={() => {
                                handleDropdownClick(idx)
                              }}
                            >
                              <Box display="flex" gap="1">
                                <Image
                                  src={`/${borrow?.collateral}.svg`}
                                  alt="Picture of the author"
                                  width="16"
                                  height="16"
                                />
                                <Text fontSize="14px" fontWeight="400">
                                  {tokenSelection[lower_bound + idx] == 0
                                    ? borrow?.collateral
                                    : 'r' + borrow?.collateral}
                                </Text>
                              </Box>

                              <Box pt="0.5" className="navbar-button">
                                <DropdownUp />
                              </Box>

                              {openDropdown === idx && (
                                <Box
                                  w="full"
                                  left="0"
                                  bg="#03060B"
                                  py="2"
                                  className="dropdown-container"
                                  boxShadow="dark-lg"
                                >
                                  {[
                                    borrow?.collateral,
                                    'r' + borrow?.collateral,
                                  ].map((item: string, index: number) => {
                                    return (
                                      <Box
                                        key={index}
                                        as="button"
                                        w="full"
                                        display="flex"
                                        alignItems="center"
                                        gap="1"
                                        pr="2"
                                        onClick={() => {
                                          // setCurrentSelectedDrop(item);
                                          handleTokenChange(
                                            index,
                                            lower_bound + idx
                                          )
                                        }}
                                        _hover={{
                                          bg: '#171026',
                                        }}
                                      >
                                        {index ===
                                          tokenSelection[lower_bound + idx] && (
                                          <Box
                                            w="3px"
                                            h="28px"
                                            bg="#4954DC"
                                            borderRightRadius="md"
                                          ></Box>
                                        )}
                                        <Box
                                          w="full"
                                          display="flex"
                                          py="5px"
                                          px={`${
                                            index ===
                                            tokenSelection[lower_bound + idx]
                                              ? '3'
                                              : '5'
                                          }`}
                                          bg={`${
                                            index ===
                                            tokenSelection[lower_bound + idx]
                                              ? '#4D59E8'
                                              : 'inherit'
                                          }`}
                                          gap="1"
                                          borderRadius="md"
                                        >
                                          <Image
                                            src={`/${borrow?.collateral}.svg`}
                                            alt="Picture of the author"
                                            width="16"
                                            height="16"
                                          />
                                          <Text color="white">{item}</Text>
                                        </Box>
                                      </Box>
                                    )
                                  })}
                                </Box>
                              )}
                            </Box>
                          </HStack>
                        </VStack>
                      </Td>
                      <Td
                        width={'12.5%'}
                        maxWidth={'5rem'}
                        fontSize={'14px'}
                        fontWeight={400}
                        textAlign={'center'}
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
                            // width="2rem"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Box
                              width="7rem"
                              color="white"
                              borderRadius="6px"
                              // display="flex"
                              border="1px solid #2B2F35"
                              // bg="black"
                              justifyContent="space-between"
                              mt="0.3rem"
                              onClick={() => {
                                // setselectedIndex(idx)
                              }}
                            >
                              <NumberInput
                                paddingInlineEnd="0px"
                                border="0px"
                                min={0}
                                keepWithinRange={true}
                                color="white"
                                // onChange={handleChange}
                                value={
                                  collateralAmounts[lower_bound + idx]
                                    ? collateralAmounts[lower_bound + idx]
                                    : ''
                                }
                                onChange={(e: any) =>
                                  handleInputChange(e, lower_bound + idx)
                                }
                                step={parseFloat(
                                  `${collateralAmounts[lower_bound + idx] <= 99999 ? 0.1 : 0}`
                                )}
                                // defaultValue={borrow?.collateralSuggestedAmount}
                                // value={depositAmount ? depositAmount : ""}
                                outline="none"
                                precision={4}
                                _disabled={{ cursor: 'pointer' }}
                              >
                                <NumberInputField
                                  paddingInlineEnd="0px"
                                  placeholder={'min 1000$'}
                                  _disabled={{ color: '#00D395' }}
                                  border="0px"
                                  _placeholder={{
                                    color: '#3E415C',
                                    fontSize: '.89rem',
                                    fontWeight: '600',
                                    outline: 'none',
                                  }}
                                  _focus={{
                                    outline: '0',
                                    boxShadow: 'none',
                                  }}
                                />
                              </NumberInput>
                              {/* <Text fontSize="14px" fontWeight="400">
                              {borrow?.collateralSuggestedAmount}
                            </Text> */}
                            </Box>
                          </HStack>
                        </VStack>
                      </Td>
                      <Td
                        width={'12.5%'}
                        maxWidth={'3rem'}
                        fontSize={'14px'}
                        fontWeight={400}
                        overflow={'hidden'}
                        textAlign={'center'}
                        pl="5rem"
                      >
                        {borrow.leverage}x
                      </Td>
                      <Td
                        width={'12.5%'}
                        maxWidth={'3rem'}
                        fontSize={'14px'}
                        fontWeight={400}
                        overflow={'hidden'}
                        textAlign={'center'}
                        pl="5rem"
                      >
                      {oraclePrices === null ? 
                            <Skeleton
                              width="6rem"
                              height="2rem"
                              startColor="#101216"
                              endColor="#2B2F35"
                              borderRadius="6px"
                            />:
                        <HStack
                          height="2rem"
                          width="2rem"
                          alignItems="center"
                          justifyContent="flex-start"
                        >
                          <Image
                            src={`/${borrow?.debt}.svg`}
                            alt="Picture of the author"
                            width="32"
                            height="32"
                          />
                            <Text fontSize="14px" fontWeight="400" ml="-1">
                              {numberFormatter(
                                5000 /
                                  oraclePrices?.find(
                                    (curr: any) => curr.name === borrow?.debt
                                  )?.price
                              )}
                            </Text>
                        </HStack>
                       } 
                      </Td>
                      <Td
                        maxWidth={'5rem'}
                        fontSize={'14px'}
                        fontWeight={400}
                        textAlign={'center'}
                        pl="5rem"
                      >
                                              {oraclePrices === null ? 
                            <Skeleton
                              width="6rem"
                              height="2rem"
                              startColor="#101216"
                              endColor="#2B2F35"
                              borderRadius="6px"
                            />:
                        <Tooltip
                          hasArrow
                          arrowShadowColor="#2B2F35"
                          placement="bottom"
                          boxShadow="dark-lg"
                          label={
                            <Box>
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                gap={10}
                              >
                                <Text>Borrow APR ({borrow?.leverage}x):</Text>
                                <Text>
                                  -
                                  {numberFormatterPercentage(
                                    stats?.find(
                                      (stat: any) =>
                                        stat?.token === borrow?.debt
                                    )?.borrowRate * borrow?.leverage
                                  )}
                                  %
                                </Text>
                              </Box>
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                gap={10}
                              >
                                <Text>Supply APR:</Text>
                                <Text>
                                  {numberFormatterPercentage(
                                    stats?.find(
                                      (stat: any) =>
                                        stat?.token === borrow?.collateral
                                    )?.supplyRate +
                                      getBoostedAprSupply(borrow?.collateral)
                                  )}
                                  %
                                </Text>
                              </Box>
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                gap={10}
                              >
                                <Text>Pool APR ({borrow?.leverage}x):</Text>
                                <Text>
                                  {numberFormatterPercentage(
                                    getAprByPool(
                                      poolAprs,
                                      borrow?.secondary,
                                      'JEDI_SWAP'
                                    ) * borrow?.leverage
                                  )}
                                  %
                                </Text>
                              </Box>
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                gap={10}
                              >
                                <Text>$STRK APR ({borrow?.leverage}x):</Text>
                                <Text>
                                  {numberFormatterPercentage(
                                    getBoostedApr(borrow?.debt) *
                                      borrow?.leverage
                                  )}
                                  %
                                </Text>
                              </Box>
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                gap={10}
                                mb="2"
                              >
                                <Text>
                                  Jedi STRK APR ({borrow?.leverage}x):
                                </Text>
                                <Text>
                                  {numberFormatterPercentage(
                                    ((100 *
                                      365 *
                                      (getStrkAlloaction(borrow?.secondary) *
                                        oraclePrices?.find(
                                          (curr: any) => curr.name === 'STRK'
                                        )?.price)) /
                                      getTvlByPool(
                                        poolAprs,
                                        borrow?.secondary,
                                        'JEDI_SWAP'
                                      )) *
                                      borrow?.leverage
                                  )}
                                  %
                                </Text>
                              </Box>
                              <hr />
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                gap={10}
                                mt="2"
                              >
                                <Text>Effective APR:</Text>
                                <Text>
                                  {numberFormatterPercentage(
                                    Number(
                                      borrow?.leverage *
                                        (-stats?.find(
                                          (stat: any) =>
                                            stat?.token === borrow?.debt
                                        )?.borrowRate +
                                          getAprByPool(
                                            poolAprs,
                                            borrow?.secondary,
                                            'JEDI_SWAP'
                                          ) +
                                          getBoostedApr(borrow?.debt) +
                                          (100 *
                                            365 *
                                            (getStrkAlloaction(
                                              borrow?.secondary
                                            ) *
                                              oraclePrices?.find(
                                                (curr: any) =>
                                                  curr.name === 'STRK'
                                              )?.price)) /
                                            getTvlByPool(
                                              poolAprs,
                                              borrow?.secondary,
                                              'JEDI_SWAP'
                                            )) +
                                        (stats?.find(
                                          (stat: any) =>
                                            stat?.token === borrow?.collateral
                                        )?.supplyRate +
                                          getBoostedAprSupply(
                                            borrow?.collateral
                                          ))
                                    )
                                  )}
                                  
                                  %
                                </Text>
                              </Box>
                            </Box>
                          }
                          bg="#02010F"
                          fontSize={'13px'}
                          fontWeight={'400'}
                          borderRadius={'lg'}
                          padding={'2'}
                          color="#F0F0F5"
                          border="1px solid"
                          borderColor="#23233D"
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
                              setCurrentSpendStatus(borrow.spendType)
                              setCurrentLoanAmount(borrow?.currentLoanAmount)
                              setCurrentLoanMarket(borrow?.currentLoanMarket)
                            }}
                          >
                            {numberFormatterPercentage(
                              Number(
                                borrow?.leverage *
                                  (-stats?.find(
                                    (stat: any) => stat?.token === borrow?.debt
                                  )?.borrowRate +
                                    getAprByPool(
                                      poolAprs,
                                      borrow?.secondary,
                                      'JEDI_SWAP'
                                    ) +
                                    getBoostedApr(borrow?.debt) +
                                    (100 *
                                      365 *
                                      (getStrkAlloaction(borrow?.secondary) *
                                        oraclePrices?.find(
                                          (curr: any) => curr.name === 'STRK'
                                        )?.price)) /
                                      getTvlByPool(
                                        poolAprs,
                                        borrow?.secondary,
                                        'JEDI_SWAP'
                                      )) +
                                  (stats?.find(
                                    (stat: any) =>
                                      stat?.token === borrow?.collateral
                                  )?.supplyRate +
                                    getBoostedAprSupply(borrow?.collateral))
                              )
                            )}
                            %
                          </Box>
                        </Tooltip>}
                      </Td>

                      <Td
                        width={'12.5%'}
                        maxWidth={'5rem'}
                        fontSize={'14px'}
                        fontWeight={400}
                        textAlign={'right'}
                        pr="1rem"
                      >
                        <Box
                          width="100%"
                          height="100%"
                          display="flex"
                          alignItems="center"
                          justifyContent="flex-end"
                          fontWeight="400"
                        >
                          <Box
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
                              if (
                                collateralAmounts[lower_bound + idx] *
                                  oraclePrices.find(
                                    (curr: any) =>
                                      curr.name ===
                                      collateralMarkets[lower_bound + idx]
                                  )?.price >=
                                  10 &&
                                ((walletBalances[borrow?.collateral]
                                  ?.statusBalanceOf === 'success'
                                  ? parseAmount(
                                      String(
                                        uint256.uint256ToBN(
                                          walletBalances[borrow?.collateral]
                                            ?.dataBalanceOf?.balance
                                        )
                                      ),
                                      tokenDecimalsMap[borrow?.collateral]
                                    )
                                  : 0) *
                                  oraclePrices?.find(
                                    (curr: any) =>
                                      curr.name === borrow?.collateral
                                  )?.price >=
                                  10 ||
                                  userDeposit?.find(
                                    (item: any) =>
                                      item?.rToken == 'r' + borrow?.collateral
                                  )?.rTokenFreeParsed *
                                    oraclePrices?.find(
                                      (curr: any) =>
                                        curr.name === borrow?.collateral
                                    )?.price >=
                                    10)
                              ) {
                                setRTokenAmount(
                                  collateralAmounts[lower_bound + idx]
                                )
                                setCurrentSpendStatus(borrow.spendType)
                                setCurrentLoanAmount(borrow?.currentLoanAmount)
                                setCurrentLoanMarket(borrow?.debt)
                                setselectedIndex(lower_bound + idx)
                                setLoanMarket(borrow?.debt)
                                setLoanAmount(
                                  110 /
                                    oraclePrices.find(
                                      (curr: any) => curr.name === borrow?.debt
                                    )?.price
                                )
                                setCollateralMarket(
                                  collateralMarkets[lower_bound + idx]
                                )
                                let rtoken: any =
                                  'r' + collateralMarkets[lower_bound + idx]
                                setRToken(rtoken)
                                setCollateralAmount(
                                  collateralAmounts[lower_bound + idx]
                                )
                                if(borrow?.dappName==="Jediswap"){
                                  setL3App('JEDI_SWAP')
                                }else if(borrow?.dappName=="ZKlend"){
                                  setL3App("ZKLEND")
                                }
                                setMethod('ADD_LIQUIDITY')
                                setToMarketLiqA(borrow?.secondary.split('/')[0])
                                setToMarketLiqB(borrow?.secondary.split('/')[1])
                              } else {

                              }
                            }}
                          >
                            {collateralAmounts[lower_bound + idx] *
                              oraclePrices?.find(
                                (curr: any) =>
                                  curr.name ===
                                  collateralMarkets[lower_bound + idx]
                              )?.price >=
                              10 &&
                            ((walletBalances[borrow?.collateral]
                              ?.statusBalanceOf === 'success'
                              ? parseAmount(
                                  String(
                                    uint256.uint256ToBN(
                                      walletBalances[borrow?.collateral]
                                        ?.dataBalanceOf?.balance
                                    )
                                  ),
                                  tokenDecimalsMap[borrow?.collateral]
                                )
                              : 0) *
                              oraclePrices?.find(
                                (curr: any) => curr.name === borrow?.collateral
                              )?.price >=
                              10 ||
                              userDeposit?.find(
                                (item: any) =>
                                  item?.rToken == 'r' + borrow?.collateral
                              )?.rTokenFreeParsed *
                                oraclePrices?.find(
                                  (curr: any) =>
                                    curr.name === borrow?.collateral
                                )?.price >=
                                10) ? (
                              <DegenModal
                                coin={coin}
                                borrowAPRs={borrowAPRs}
                                currentBorrowAPR={currentBorrowAPR}
                                supplyAPRs={supplyAPRs}
                                currentSupplyAPR={currentSupplyAPR}
                                setCurrentBorrowAPR={setCurrentBorrowAPR}
                                validRTokens={validRTokens}
                                currentBorrowMarketCoin={
                                  currentBorrowMarketCoin
                                }
                                suggestedBorrow={borrow?.debt}
                                suggestedCollateral={borrow?.collateral}
                                collateralSuggestedAmount={
                                  collateralAmounts[lower_bound + idx]
                                }
                                suggestedLeverage={borrow?.leverage}
                                borrowSuggestedAmount={
                                  5000 /
                                  oraclePrices?.find(
                                    (curr: any) => curr.name === borrow?.debt
                                  )?.price
                                }
                                spendAction={'1'}
                                pool={borrow?.secondary}
                                suggestedStrategy={borrow?.format}
                                suggestedProtocol={borrow?.dappName}
                              />
                            ) : (
                              <TransactionCancelModal
                                supplyAPRs={supplyAPRs}
                                currentSupplyAPR={currentSupplyAPR}
                                setCurrentSupplyAPR={setCurrentSupplyAPR}
                                coinPassed={coin}
                              />
                            )}
                            {/* <TransactionCancelModal/> */}
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
                        display: `${idx == 5 ? 'none' : 'block'}`,
                      }}
                    />
                  </>
                )
              })}
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
      {/* {showEmptyNotification && (
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
            To access the Degen page, please add more supplies as your current
            value is less than $1000.
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
                backGroundOverLay={'rgba(244, 242, 255, 0.5);'}
                supplyAPRs={supplyAPRs}
                currentSupplyAPR={currentSupplyAPR}
                setCurrentSupplyAPR={setCurrentSupplyAPR}
                coin={coinPassed}
              />
            </Box>
          </Box>
        </Box>
      )} */}
    </>
  )
}

export default DegenDashboard
