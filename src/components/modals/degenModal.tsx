import {
  Box,
  Button,
  Card,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Radio,
  RadioGroup,
  Skeleton,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'

/* Coins logo import  */
import {
  getMaximumDepositAmount,
  getMaximumDynamicLoanAmount,
  getMinimumDepositAmount,
} from '@/Blockchain/scripts/Rewards'
import BTCLogo from '../../assets/icons/coins/btc'

import { constants } from '@/Blockchain/utils/constants'
import DAILogo from '@/assets/icons/coins/dai'
import ETHLogo from '@/assets/icons/coins/eth'
import USDCLogo from '@/assets/icons/coins/usdc'
import USDTLogo from '@/assets/icons/coins/usdt'
import SliderPointer from '@/assets/icons/sliderPointer'
import SliderPointerWhite from '@/assets/icons/sliderPointerWhite'
import {
  resetModalDropdowns,
  selectModalDropDowns,
  selectNavDropdowns,
  setModalDropdown,
  setNavDropdown,
} from '@/store/slices/dropdownsSlice'
import {
  selectFees,
  selectJediSwapPoolsSupported,
  selectJediswapPoolAprs,
  selectMaximumDepositAmounts,
  selectMaximumLoanAmounts,
  selectMinimumDepositAmounts,
  selectMinimumLoanAmounts,
  selectMySwapPoolsSupported,
  selectOraclePrices,
  selectProtocolStats,
} from '@/store/slices/readDataSlice'
import {
  selectActiveTransactions,
  selectAssetWalletBalance,
  selectJedistrkTokenAllocation,
  selectStrkAprData,
  selectWalletBalance,
  selectnetSpendBalance,
  setActiveTransactions,
  setInputTradeModalBorrowAmount,
  setInputTradeModalCollateralAmount,
  setTransactionStartedAndModalClosed,
  setTransactionStatus,
} from '@/store/slices/userAccountSlice'
import { useDispatch, useSelector } from 'react-redux'
import TransactionFees from '../../../TransactionFees.json'
import DropdownUp from '../../assets/icons/dropdownUpIcon'
import InfoIcon from '../../assets/icons/infoIcon'

import useBalanceOf from '@/Blockchain/hooks/Reads/useBalanceOf'
import useBorrowAndSpend from '@/Blockchain/hooks/Writes/useBorrowAndSpend'
import { NativeToken, RToken } from '@/Blockchain/interfaces/interfaces'
import {
  getLoanHealth_NativeCollateral,
  getLoanHealth_RTokenCollateral,
} from '@/Blockchain/scripts/LoanHealth'
import {
  getMaximumLoanAmount,
  getMinimumLoanAmount,
  getSupportedPools,
} from '@/Blockchain/scripts/Rewards'
import {
  getJediEstimateLiquiditySplit,
  getJediEstimatedLpAmountOut,
  getMySwapEstimateLiquiditySplit,
  getMySwapEstimatedLpAmountOut,
  getUSDValue,
} from '@/Blockchain/scripts/l3interaction'
import { getProtocolStats } from '@/Blockchain/scripts/protocolStats'
import {
  tokenAddressMap,
  tokenDecimalsMap,
} from '@/Blockchain/utils/addressServices'
import { BNtoNum, parseAmount } from '@/Blockchain/utils/utils'
import ArrowUp from '@/assets/icons/arrowup'
import BlueInfoIcon from '@/assets/icons/blueinfoicon'
import SmallEth from '@/assets/icons/coins/smallEth'
import SmallUsdt from '@/assets/icons/coins/smallUsdt'
import STRKLogo from '@/assets/icons/coins/strk'
import JediswapLogo from '@/assets/icons/dapps/jediswapLogo'
import MySwap from '@/assets/icons/dapps/mySwap'
import MySwapDisabled from '@/assets/icons/dapps/mySwapDisabled'
import InfoIconBig from '@/assets/icons/infoIconBig'
import BtcToDai from '@/assets/icons/pools/btcToDai'
import BtcToEth from '@/assets/icons/pools/btcToEth'
import BtcToUsdc from '@/assets/icons/pools/btcToUsdc'
import BtcToUsdt from '@/assets/icons/pools/btcToUsdt'
import DaiToEth from '@/assets/icons/pools/daiToEth'
import EthToUsdc from '@/assets/icons/pools/ethToUsdc'
import EthToUsdt from '@/assets/icons/pools/ethToUsdt'
import StrkToEth from '@/assets/icons/pools/strkToEth'
import UsdcToDai from '@/assets/icons/pools/usdcToDai'
import UsdcToUsdt from '@/assets/icons/pools/usdcToUsdt'
import UsdtToDai from '@/assets/icons/pools/usdtToDai'
import RedinfoIcon from '@/assets/icons/redinfoicon'
import SmallErrorIcon from '@/assets/icons/smallErrorIcon'
import dollarConvertor from '@/utils/functions/dollarConvertor'
import numberFormatter from '@/utils/functions/numberFormatter'
import numberFormatterPercentage from '@/utils/functions/numberFormatterPercentage'
import { useWaitForTransaction } from '@starknet-react/core'
import axios from 'axios'
import mixpanel from 'mixpanel-browser'
import Image from 'next/image'
import { useRouter } from 'next/router'
import posthog from 'posthog-js'
import { useEffect, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { toast } from 'react-toastify'
import { uint256 } from 'starknet'
import TableInfoIcon from '../layouts/table/tableIcons/infoIcon'
import AnimatedButton from '../uiElements/buttons/AnimationButton'
import ErrorButton from '../uiElements/buttons/ErrorButton'
import SuccessButton from '../uiElements/buttons/SuccessButton'
import SliderTooltip from '../uiElements/sliders/sliderTooltip'
const DegenModal = ({
  buttonText,
  coin,
  borrowAPRs,
  currentBorrowAPR,
  setCurrentBorrowAPR,
  validRTokens,
  currentSelectedPool,
  currentSelectedDapp,
  poolNumber,
  suggestedCollateral,
  suggestedBorrow,
  spendAction,
  pool,
  collateralSuggestedAmount,
  borrowSuggestedAmount,
  suggestedLeverage,
  ...restProps
}: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
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

  const rTokens: RToken[] = ['rBTC', 'rUSDT', 'rETH']
  // const transactionStarted = useSelector(selectTransactionStarted);

  const [sliderValue, setSliderValue] = useState(0)
  const [sliderValue2, setsliderValue2] = useState(0)
  const dispatch = useDispatch()
  const [inputAmount, setinputAmount] = useState(0)
  const [inputCollateralAmount, setinputCollateralAmount] = useState(
    collateralSuggestedAmount
  )
  const [inputBorrowAmount, setinputBorrowAmount] = useState<any>(
    borrowSuggestedAmount
  )
  const modalDropdowns = useSelector(selectModalDropDowns)
  const [transactionStarted, setTransactionStarted] = useState(false)

  let activeTransactions = useSelector(selectActiveTransactions)

  // const walletBalances=useSelector(selectAssetWalletBalance);
  interface assetB {
    USDT: any
    USDC: any
    BTC: any
    ETH: any
    DAI: any
  }

  const walletBalances: assetB | any = {
    USDT: useBalanceOf(tokenAddressMap['USDT']),
    USDC: useBalanceOf(tokenAddressMap['USDC']),
    BTC: useBalanceOf(tokenAddressMap['BTC']),
    ETH: useBalanceOf(tokenAddressMap['ETH']),
    DAI: useBalanceOf(tokenAddressMap['DAI']),
    STRK: useBalanceOf(tokenAddressMap['STRK']),
    rUSDT: useBalanceOf(tokenAddressMap['rUSDT']),
    rUSDC: useBalanceOf(tokenAddressMap['rUSDC']),
    rBTC: useBalanceOf(tokenAddressMap['rBTC']),
    rETH: useBalanceOf(tokenAddressMap['rETH']),
    rDAI: useBalanceOf(tokenAddressMap['rDAI']),
  }
  const [walletBalance, setwalletBalance] = useState(0)
  useEffect(() => {
    setwalletBalance(
      walletBalances[suggestedCollateral]?.statusBalanceOf === 'success'
        ? parseAmount(
            String(
              uint256.uint256ToBN(
                walletBalances[suggestedCollateral]?.dataBalanceOf?.balance
              )
            ),
            tokenDecimalsMap[suggestedCollateral]
          )
        : 0
    )
    ////console.log("supply modal status wallet balance",walletBalances[coin?.name]?.statusBalanceOf)
  }, [suggestedCollateral])
  const dapps = [
    { name: 'Jediswap', status: 'enable' },
    { name: 'mySwap', status: 'enable' },
  ]
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
  const pools = [
    'STRK/ETH',
    'USDC/USDT',
    'ETH/USDC',
    'ETH/USDT',
    // "DAI/ETH",
    'BTC/ETH',
    'BTC/USDT',
    'BTC/USDC',

    // "BTC/DAI",
    // "USDT/DAI",
    // "USDC/DAI",
  ]

  const [currentDapp, setCurrentDapp] = useState(
    currentSelectedDapp ? currentSelectedDapp : 'Jediswap'
  )
  const [currentPool, setCurrentPool] = useState(pool ? pool : 'STRK/ETH')
  const [currentPoolCoin, setCurrentPoolCoin] = useState('STRK')
  const getCoin = (CoinName: string) => {
    switch (CoinName) {
      case 'BTC':
        return <BTCLogo height={'16px'} width={'16px'} />
      case 'rBTC':
        return <BTCLogo height={'16px'} width={'16px'} />
      case 'USDC':
        return <USDCLogo height={'16px'} width={'16px'} />
      case 'rUSDC':
        return <USDCLogo height={'16px'} width={'16px'} />
      case 'USDT':
        return <USDTLogo height={'16px'} width={'16px'} />
      case 'rUSDT':
        return <USDTLogo height={'16px'} width={'16px'} />
      case 'ETH':
        return <ETHLogo height={'16px'} width={'16px'} />
      case 'rETH':
        return <ETHLogo height={'16px'} width={'16px'} />
      case 'DAI':
        return <DAILogo height={'16px'} width={'16px'} />
      case 'STRK':
        return <STRKLogo height={'16px'} width={'16px'} />
      case 'rSTRK':
        return <STRKLogo height={'16px'} width={'16px'} />
      case 'rDAI':
        return <DAILogo height={'16px'} width={'16px'} />
      case 'Jediswap':
        return <JediswapLogo />
      case 'mySwap':
        return <MySwap />
      case 'ETH/USDT':
        return <EthToUsdt />
      case 'USDC/USDT':
        return <UsdcToUsdt />
      case 'ETH/USDC':
        return <EthToUsdc />
      case 'DAI/ETH':
        return <DaiToEth />
      case 'BTC/ETH':
        return <BtcToEth />
      case 'BTC/USDT':
        return <BtcToUsdt />
      case 'BTC/USDC':
        return <BtcToUsdc />
      case 'BTC/DAI':
        return <BtcToDai />
      case 'USDT/DAI':
        return <UsdtToDai />
      case 'USDC/DAI':
        return <UsdcToDai />
      case 'STRK/ETH':
        return <StrkToEth />
      default:
        break
    }
  }

  const fees = useSelector(selectFees)

  const handleDropdownClick = (dropdownName: any) => {
    dispatch(setModalDropdown(dropdownName))
  }
  const handleChange = (newValue: any) => {
    if (newValue > 9_000_000_000) return
    var percentage = (newValue * 100) / walletBalance
    percentage = Math.max(0, percentage)
    if (percentage > 100) {
      setSliderValue(100)
      setinputCollateralAmount(newValue)
      setCollateralAmount(newValue)
      setRTokenAmount(newValue)
      dispatch(setInputTradeModalCollateralAmount(newValue))
    } else {
      percentage = Math.round(percentage)
      if (isNaN(percentage)) {
      } else {
        setSliderValue(percentage)
        setinputCollateralAmount(newValue)
        setCollateralAmount(newValue)
        setRTokenAmount(newValue)
        dispatch(setInputTradeModalCollateralAmount(newValue))
      }
      // dispatch((newValue));
    }
  }
  const handleBorrowChange = (newValue: any) => {
    if (newValue > 9_000_000_000) return
    if (inputCollateralAmountUSD > 0) {
      var percentage =
        (newValue * 100) /
        ((4.98 * inputCollateralAmountUSD) /
          oraclePrices.find((curr: any) => curr.name === currentBorrowCoin)
            ?.price)
    }
    var percentage = (newValue * 100) / walletBalance
    percentage = Math.max(0, percentage)
    if (percentage > 100) {
      setsliderValue2(100)
      setinputBorrowAmount(newValue)
      setLoanAmount(newValue)
      // dispatch(setInputTradeModalCollateralAmount(newValue));
    } else {
      percentage = Math.round(percentage)
      if (isNaN(percentage)) {
      } else {
        setsliderValue2(percentage)
        setinputBorrowAmount(newValue)
        setLoanAmount(newValue)
      }
      // dispatch(setInputTradeModalCollateralAmount(newValue));
      // dispatch((newValue));
    }
  }
  const coins: NativeToken[] = ['BTC', 'USDT', 'USDC', 'ETH', 'DAI', 'STRK']

  const [currentCollateralCoin, setCurrentCollateralCoin] = useState(
    suggestedCollateral ? suggestedCollateral : 'BTC'
  )

  // const coinAlign = ["BTC", "USDT", "USDC", "ETH", "DAI"];
  const [currentBorrowCoin, setCurrentBorrowCoin] = useState(
    suggestedBorrow ? suggestedBorrow?.name : 'BTC'
  )
  const [uniqueID, setUniqueID] = useState(0)
  const getUniqueId = () => uniqueID
  const [protocolStats, setProtocolStats] = useState<any>([])
  const stats = useSelector(selectProtocolStats)
  const fetchProtocolStats = async () => {
    if (stats)
      setProtocolStats([
        stats?.[0],
        stats?.[2],
        stats?.[3],
        stats?.[1],
        stats?.[4],
        stats?.[5],
      ])
  }
  const poolsPairs = useSelector(selectJediSwapPoolsSupported)
  const mySwapPoolPairs = useSelector(selectMySwapPoolsSupported)
  const [myswapPools, setmyswapPools] = useState([])
  const [jediswapPools, setjediswapPools] = useState([])
  useEffect(() => {
    function findSideForMember(array: any, token: any) {
      const data: any = []
      for (const obj of array) {
        const keyvalue = obj.keyvalue
        const [tokenA, tokenB] = keyvalue.split('/')

        if (tokenA === token) {
          data.push(tokenB)
        } else if (tokenB === token) {
          data.push(tokenA)
        }
      }
      setmyswapPools(data)
      // Token not found in any "keyvalue" pairs
    }
    if (mySwapPoolPairs) {
      findSideForMember(mySwapPoolPairs, currentBorrowCoin)
    }
  }, [currentBorrowCoin, mySwapPoolPairs])

  useEffect(() => {
    function findSideForMember(array: any, token: any) {
      const data: any = []
      for (const obj of array) {
        const keyvalue = obj.keyvalue
        const [tokenA, tokenB] = keyvalue.split('/')

        if (tokenA === token) {
          data.push(tokenB)
        } else if (tokenB === token) {
          data.push(tokenA)
        }
      }
      setjediswapPools(data)
      // Token not found in any "keyvalue" pairs
    }
    if (poolsPairs) {
      findSideForMember(poolsPairs, currentBorrowCoin)
    }
  }, [currentBorrowCoin, poolsPairs])

  // const [poolsPairs,setPoolPairs] = useState<any>([
  //   {
  //     address: "0x4e05550a4899cda3d22ff1db5fc83f02e086eafa37f3f73837b0be9e565369e",
  //     keyvalue: "USDC/USDT"
  //   },
  //   {
  //   address: "0x4b6e4bef4dd1424b06d599a55c464e94cd9f3cb1a305eaa8a3db923519585f7",
  //     keyvalue: "ETH/USDT"
  //   },
  //   {
  //   address: "0x129c74ca4274e3dbf7ab83f5916bebf087ce7af7495b3c648f1d2f2ab302330",
  //     keyvalue: "ETH/USDC"
  //   },
  //   {
  // address: "0x436fd41efe1872ce981331e2f11a50eca547a67f8e4d2bc476f60dc24dd5884",
  //     keyvalue: "DAI/ETH"
  //   },
  //   {
  //   address: "0x1d26e4dd7e42781721577f5f3615aa9f1c5076776b337e968e3194d8af78ea0",
  //     keyvalue: "BTC/USDT"
  //   },
  //   {
  //   address: "0x1d26e4dd7e42781721577f5f3615aa9f1c5076776b337e968e3194d8af78ea0",
  //     keyvalue: "BTC/USDC"
  //   },
  //   {
  // address: "0x51c32e614dd57eaaeed77c3342dd0da177d7200b6adfd8497647f7a5a71a717",
  //     keyvalue: "BTC/DAI"
  //   },
  //   {
  //   address: "0x79ac8e9b3ce75f3294d3be2b361ca7ffa481fe56b0dd36500e43f5ce3f47077",
  //     keyvalue: "USDT/DAI"
  //   },
  //   {
  //   address: "0x3d58a2767ebb27cf36b5fa1d0da6566b6042bd1a9a051c40129bad48edb147b",
  //     keyvalue: "USDC/DAI"
  //   }
  // ])
  // useEffect(()=>{
  //   const fetchPools=async()=>{
  //     const data=await getSupportedPools("0x3d58a2767ebb27cf36b5fa1d0da6566b6042bd1a9a051c40129bad48edb147b","30814223327519088")
  //    //console.log(data,"check");
  //   }
  //   fetchPools();
  // },[])

  useEffect(() => {
    try {
      fetchProtocolStats()
      ////console.log("protocolStats", protocolStats);
    } catch (err: any) {
      //console.log("borrow modal : error fetching protocolStats");
    }
  }, [stats])
  const [currentAvailableReserves, setCurrentAvailableReserves] = useState(
    protocolStats?.find((stat: any) => stat?.token == currentBorrowCoin)
      ?.availableReserves * 0.895
  )
  useEffect(() => {
    ////console.log("currentAvailableReserve", currentAvailableReserves);
  }, [currentAvailableReserves])

  useEffect(() => {
    setCurrentAvailableReserves(
      protocolStats[coins.indexOf(currentBorrowCoin)]?.availableReserves * 0.895
    )
    ////console.log(coins.indexOf(currentBorrowCoin));
  }, [protocolStats, currentBorrowCoin])

  const [radioValue, setRadioValue] = useState('1')

  useEffect(() => {
    if (radioValue === '1') {
      setMethod('ADD_LIQUIDITY')
    } else if (radioValue === '2') {
      setMethod('SWAP')
    }
    ////console.log("radio value", radioValue, method);
  }, [radioValue])
  const [tokenTypeSelected, setTokenTypeSelected] = useState('Native')
  const router = useRouter()
  const { pathname } = router
  useEffect(() => {
    if (pathname == '/v1/strk-rewards') {
      // setLoanMarket(coin ? coin.name : "BTC");
      // setCollateralMarket(coin ? coin.name : "BTC");
    } else {
      setLoanMarket(suggestedBorrow ? suggestedBorrow.name : 'BTC')
      setCollateralMarket(suggestedCollateral ? suggestedCollateral : 'BTC')
    }
  }, [suggestedCollateral])
  const resetStates = () => {
    setSliderValue(0)
    setsliderValue2(0)
    setinputCollateralAmount(0)
    setCollateralAmount(0)
    setRTokenAmount(0)
    setinputBorrowAmount(0)
    setLoanAmount(0)
    // setCurrentDapp("Select a dapp");
    // setCurrentPool("Select a pool");
    setCurrentCollateralCoin(suggestedCollateral ? suggestedCollateral : 'BTC')
    setCollateralMarket(suggestedCollateral ? suggestedCollateral : 'BTC')
    setCurrentBorrowCoin(suggestedBorrow ? suggestedBorrow?.name : 'BTC')
    setLoanMarket(coin ? coin.name : 'BTC')
    // setCurrentPoolCoin("Select a pool");
    setRadioValue(spendAction ? spendAction : '1')
    setHealthFactor(undefined)
    setTokenTypeSelected('Native')
    // setTransactionStarted(false);
    dispatch(resetModalDropdowns())
    setwalletBalance(
      walletBalances[suggestedCollateral]?.statusBalanceOf === 'success'
        ? parseAmount(
            String(
              uint256.uint256ToBN(
                walletBalances[suggestedCollateral]?.dataBalanceOf?.balance
              )
            ),
            tokenDecimalsMap[suggestedCollateral]
          )
        : 0
    )
    // if (transactionStarted) dispatch(setTransactionStarted(""));
    setTransactionStarted(false)
    dispatch(resetModalDropdowns())
    dispatch(setTransactionStatus(''))
    setCurrentTransactionStatus('')
    setDepositTransHash('')
  }
  const activeModal = Object.keys(modalDropdowns).find(
    (key) => modalDropdowns[key] === true
  )

  useEffect(() => {
    setinputBorrowAmount(0)
    setLoanAmount(0)
    // setLoanAmount(0);
    setsliderValue2(0)
    // setCurrentPoolCoin("Select a pool");
    // setHealthFactor(undefined)
  }, [currentBorrowCoin])

  useEffect(() => {
    setinputCollateralAmount(0)
    setCollateralAmount(0)
    setRTokenAmount(0)
    setSliderValue(0)
    // setHealthFactor(undefined)
  }, [currentCollateralCoin])

  const [depositTransHash, setDepositTransHash] = useState('')

  const [currentTransactionStatus, setCurrentTransactionStatus] = useState('')

  const [isToastDisplayed, setToastDisplayed] = useState(false)
  const [toastId, setToastId] = useState<any>()
  // const recieptData = useWaitForTransaction({
  //   hash: depositTransHash,
  //   watch: true,
  //   onReceived: () => {
  //    //console.log("trans received");
  //   },
  //   onPending: () => {
  //     setCurrentTransactionStatus("success");
  //     toast.dismiss(toastId);
  //    //console.log("trans pending");
  //     if (!isToastDisplayed) {
  //       toast.success(`You have successfully spend the loan `, {
  //         position: toast.POSITION.BOTTOM_RIGHT,
  //       });
  //       setToastDisplayed(true);
  //     }
  //   },
  //   onRejected(transaction) {
  //     setCurrentTransactionStatus("failed");
  //     dispatch(setTransactionStatus("failed"));
  //     toast.dismiss(toastId);
  //    //console.log("treans rejected");
  //   },
  //   onAcceptedOnL1: () => {
  //     setCurrentTransactionStatus("success");
  //    //console.log("trans onAcceptedOnL1");
  //   },
  //   onAcceptedOnL2(transaction) {
  //     setCurrentTransactionStatus("success");
  //    //console.log("trans onAcceptedOnL2 - ", transaction);
  //     if (!isToastDisplayed) {
  //       toast.success(`You have successfully supplied spend the loan `, {
  //         position: toast.POSITION.BOTTOM_RIGHT,
  //       });
  //       setToastDisplayed(true);
  //     }
  //   },
  // });
  const oraclePrices = useSelector(selectOraclePrices)
  const marketInfo = useSelector(selectProtocolStats)
  const [healthFactor, setHealthFactor] = useState<number>()

  useEffect(() => {
    try {
      const fetchHealthFactor = async () => {
        if (tokenTypeSelected == 'Native') {
          if (
            inputBorrowAmount > 0 &&
            inputCollateralAmount > 0 &&
            currentBorrowCoin &&
            currentCollateralCoin
          ) {
            const data = await getLoanHealth_NativeCollateral(
              inputBorrowAmount,
              currentBorrowCoin,
              inputCollateralAmount,
              currentCollateralCoin,
              oraclePrices
            )
            setHealthFactor(data)
          }
        } else if (tokenTypeSelected == 'rToken') {
          if (
            inputBorrowAmount > 0 &&
            rTokenAmount > 0 &&
            currentBorrowCoin &&
            currentCollateralCoin
          ) {
            ////console.log("trade",inputBorrowAmount,rTokenAmount,currentBorrowCoin,currentCollateralCoin,marketInfo)
            const data = await getLoanHealth_RTokenCollateral(
              inputBorrowAmount,
              currentBorrowCoin,
              rTokenAmount,
              currentCollateralCoin,
              oraclePrices,
              marketInfo
            )
            ////console.log(data,"data in trade")
            setHealthFactor(data)
          }
        }
      }
      fetchHealthFactor()
    } catch (err) {
      //console.log(err);
    }
  }, [
    inputBorrowAmount,
    inputCollateralAmount,
    currentBorrowCoin,
    currentCollateralCoin,
    rTokenAmount,
  ])
  const [minimumDepositAmount, setMinimumDepositAmount] = useState<any>(0)
  const [maximumDepositAmount, setmaximumDepositAmount] = useState<any>(0)
  const minAmounts = useSelector(selectMinimumDepositAmounts)
  const maxAmounts = useSelector(selectMaximumDepositAmounts)
  useEffect(() => {
    setMinimumDepositAmount(minAmounts['r' + currentCollateralCoin])
    setmaximumDepositAmount(maxAmounts['r' + currentCollateralCoin])
  }, [currentCollateralCoin, minAmounts, maxAmounts])

  // useEffect(()=>{
  //   const fetchMinDeposit=async()=>{
  //     const data=await getMinimumDepositAmount("r"+currentCollateralCoin)
  //     setMinimumDepositAmount(data);
  //   }
  //   const fetchMaxDeposit=async()=>{
  //     const data=await getMaximumDepositAmount("r"+currentCollateralCoin);
  //     setmaximumDepositAmount(data);
  //   }
  //   fetchMaxDeposit();
  //   fetchMinDeposit();
  //   // setMinimumDepositAmount(2)
  // },[currentCollateralCoin])
  const coinIndex: any = [
    { token: 'USDT', idx: 0 },
    { token: 'USDC', idx: 1 },
    { token: 'BTC', idx: 2 },
    { token: 'ETH', idx: 3 },
    { token: 'DAI', idx: 4 },
  ]
  const handleBorrowAndSpend = async () => {
    try {
      if (currentCollateralCoin[0] != 'r') {
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
          // addTransaction({ hash: deposit?.transaction_hash });
          activeTransactions?.push(trans_data)
          posthog.capture('Trade Modal Market Status', {
            Status: 'Failure',
            BorrowToken: currentBorrowCoin,
            BorrowAmount: inputBorrowAmount,
            CollateralToken: currentCollateralCoin,
            CollateralAmount: inputCollateralAmount,
            'Pool Selected': currentPool,
            'Dapp Selected': currentDapp,
          })

          dispatch(setActiveTransactions(activeTransactions))
        }
        const uqID = getUniqueId()
        let data: any = localStorage.getItem('transactionCheck')
        data = data ? JSON.parse(data) : []
        if (data && data.includes(uqID)) {
          dispatch(setTransactionStatus('success'))
        }
      } else if (currentCollateralCoin[0] == 'r') {
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
          activeTransactions?.push(trans_data)
          posthog.capture('Trade Modal Market Status', {
            Status: 'Failure',
            BorrowToken: currentBorrowCoin,
            BorrowAmount: inputBorrowAmount,
            CollateralToken: currentCollateralCoin,
            CollateralAmount: inputCollateralAmount,
            'Pool Selected': currentPool,
            'Dapp Selected': currentDapp,
          })

          dispatch(setActiveTransactions(activeTransactions))
        }
        const uqID = getUniqueId()
        let data: any = localStorage.getItem('transactionCheck')
        data = data ? JSON.parse(data) : []
        if (data && data.includes(uqID)) {
          dispatch(setTransactionStatus('success'))
        }
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
      posthog.capture('Trade Modal Market Status', {
        Status: 'Failure',
      })
      toast.error(toastContent, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      })
    }
  }

  const [inputBorrowAmountUSD, setInputBorrowAmountUSD] = useState<any>(0)
  const availableReserves = protocolStats?.find(
    (stat: any) => stat?.token === currentBorrowCoin
  )?.availableReserves
  const [inputCollateralAmountUSD, setInputCollateralAmountUSD] =
    useState<any>(0)
  useEffect(() => {
    fetchParsedUSDValueBorrow()
  }, [inputBorrowAmount, currentBorrowCoin])

  useEffect(() => {
    fetchParsedUSDValueCollateral()
  }, [collateralAmount, currentCollateralCoin, rToken, rTokenAmount])

  const fetchParsedUSDValueBorrow = async () => {
    try {
      if (!oraclePrices || oraclePrices?.length === 0) {
        ////console.log("got parsed zero borrow");
        setInputBorrowAmountUSD(0)
        return
      }

      const parsedBorrowAmount =
        oraclePrices?.find((curr: any) => curr.name === currentBorrowCoin)
          ?.price * inputBorrowAmount
      // const parsedBorrowAmount = await getUSDValue(
      //   currentBorrowCoin,
      //   inputBorrowAmount
      // );
      ////console.log("got parsed usdt borrow", parsedBorrowAmount);
      setInputBorrowAmountUSD(parsedBorrowAmount)
      ////console.log(
      //   "effective apr values : ",
      //   "loan_usd_value",
      //   parsedBorrowAmount,
      //   "loan_apr",
      //   protocolStats?.find((stat: any) => stat?.token === currentBorrowCoin)
      //     ?.borrowRate,
      //   "collateral_usd_value",
      //   inputCollateralAmountUSD,
      //   "collateral_apr",
      //   protocolStats?.find(
      //     (stat: any) => stat?.token === currentCollateralCoin
      //   )?.supplyRate,
      //   "loan_usd_value",
      //   parsedBorrowAmount
      // );
    } catch (error) {
      //console.log(error);
    }
  }
  // const [poolAprs, setPoolAprs] = useState<any>([])
  const poolAprs = useSelector(selectJediswapPoolAprs)
  // useEffect(()=>{
  //   try{
  //       const fetchPoolData=async()=>{
  //       const res=await axios.get('https://b1ibz9x1s9.execute-api.ap-southeast-1.amazonaws.com/api/amm-aprs');
  //       if(res?.data){
  //         setPoolAprs(res?.data)
  //         // const filteredAmmData = poolAprs.filter((item: { amm: string; }):any => item.amm === 'jedi');
  //         // setPoolAprs(filteredAmmData);
  //       }
  //     }
  //     fetchPoolData()
  //     }catch(err){
  //       console.log(err,"err in pool apr")
  //     }
  // },[currentDapp])

  const strkData = useSelector(selectStrkAprData)
  const netSpendBalance = useSelector(selectnetSpendBalance)

  const [netStrkBorrow, setnetStrkBorrow] = useState(0)

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

  const fetchParsedUSDValueCollateral = async () => {
    try {
      if (!oraclePrices || oraclePrices?.length === 0) {
        setInputCollateralAmountUSD(0)
        ////console.log("got parsed zero collateral");

        return
      }

      if (tokenTypeSelected === 'Native') {
        const parsedBorrowAmount =
          oraclePrices?.find((curr: any) => curr.name === currentCollateralCoin)
            ?.price * collateralAmount
        // const parsedBorrowAmount = await getUSDValue(
        //   currentBorrowCoin,
        //   inputBorrowAmount
        // );
        ////console.log(
        //   "got parsed usdt collateral",
        //   parsedBorrowAmount,
        //   " max should be",
        //   5 * parsedBorrowAmount
        // );
        setInputCollateralAmountUSD(parsedBorrowAmount)
      } else if (tokenTypeSelected === 'rToken') {
        ////console.log(
        //   "rToken parsing",
        //   rToken,
        //   rTokenAmount,
        //   oraclePrices.find((curr: any) => curr.name === rToken.slice(1))
        //     ?.price,
        //   protocolStats.find((curr: any) => curr.token === rToken.slice(1))
        //     ?.exchangeRateRtokenToUnderlying
        // );

        const parsedBorrowAmount =
          oraclePrices?.find((curr: any) => curr.name === rToken.slice(1))
            ?.price *
          rTokenAmount *
          protocolStats.find((curr: any) => curr.token === rToken.slice(1))
            ?.exchangeRateRtokenToUnderlying
        // const parsedBorrowAmount = await getUSDValue(
        //   currentBorrowCoin,
        //   inputBorrowAmount
        // );
        ////console.log(
        //   "got parsed usdt collateral",
        //   parsedBorrowAmount,
        //   " max should be",
        //   5 * parsedBorrowAmount
        // );
        setInputCollateralAmountUSD(parsedBorrowAmount)
      }
    } catch (error) {
      //console.log(error);
    }
  }
  const [currentLPTokenAmount, setCurrentLPTokenAmount] = useState<
    Number | undefined | null
  >()
  const [currentSplit, setCurrentSplit] = useState<
    Number[] | undefined | null
  >()
  const [minimumLoanAmount, setMinimumLoanAmount] = useState<any>(0)
  const [maximumLoanAmount, setMaximumLoanAmount] = useState<any>(0)
  const minLoanAmounts = useSelector(selectMinimumLoanAmounts)
  const maxLoanAmounts = useSelector(selectMaximumLoanAmounts)
  useEffect(() => {
    const fecthLoanAmount = async () => {
      const dynamicdata = await getMaximumDynamicLoanAmount(
        collateralAmount,
        currentBorrowCoin,
        currentCollateralCoin[0] == 'r'
          ? currentCollateralCoin.slice(1)
          : currentCollateralCoin
      )
      if (dynamicdata != undefined) {
        const data = maxLoanAmounts['d' + currentBorrowCoin]
        if (currentBorrowCoin == currentCollateralCoin) {
          setMaximumLoanAmount(maxLoanAmounts['d' + currentBorrowCoin])
        } else if (
          currentCollateralCoin[0] == 'r' &&
          currentCollateralCoin.slice(1) == currentBorrowCoin
        ) {
          setMaximumLoanAmount(maxLoanAmounts['d' + currentBorrowCoin])
        } else {
          setMaximumLoanAmount(Math.min(dynamicdata, data))
        }
      }
    }
    fecthLoanAmount()
    setMinimumLoanAmount(minLoanAmounts['d' + currentBorrowCoin])
  }, [currentBorrowCoin, maxLoanAmounts, minLoanAmounts, currentCollateralCoin])
  // useEffect(()=>{
  //   const fetchMinLoanAmount=async()=>{
  //     const data=await getMinimumLoanAmount("d"+currentBorrowCoin);
  //     setMinimumLoanAmount(data);
  //   }
  //   const fetchMaxLoanAmount=async()=>{
  //     const data=await getMaximumLoanAmount("d"+currentBorrowCoin);
  //     setMaximumLoanAmount(data);
  //   }
  //   fetchMaxLoanAmount();
  //   fetchMinLoanAmount();
  // },[currentBorrowCoin])
  useEffect(() => {
    ////console.log(
    //   "toMarketSplitConsole",
    //   currentBorrowCoin,
    //   inputBorrowAmount,
    //   toMarketLiqA,
    //   toMarketLiqB
    //   // borrow
    // );
    setCurrentSplit(null)
    fetchLiquiditySplit()
  }, [
    inputBorrowAmount,
    currentBorrowCoin,
    toMarketLiqA,
    toMarketLiqB,
    currentDapp,
  ])

  useEffect(() => {
    setCurrentLPTokenAmount(null)
    fetchLPAmount()
  }, [
    inputBorrowAmount,
    currentBorrowCoin,
    toMarketLiqA,
    toMarketLiqB,
    currentDapp,
  ])

  const strkTokenAlloactionData: any = useSelector(
    selectJedistrkTokenAllocation
  )
  const [allocationData, setallocationData] = useState<any>()
  const [poolAllocatedData, setpoolAllocatedData] = useState<any>()

  useEffect(() => {
    try {
      if (currentPool !== 'Select a pool') {
        if (strkTokenAlloactionData[currentPool]) {
          setallocationData(strkTokenAlloactionData[currentPool])
        }
      }
    } catch (err) {
      // console.log("hi");
      console.log(err, 'err in allocating')
    }
  }, [strkTokenAlloactionData, currentPool])

  useEffect(() => {
    if (allocationData?.length > 0) {
      if (
        currentPool === 'STRK/ETH' ||
        currentPool == 'USDC/USDT' ||
        currentPool == 'ETH/USDC'
      ) {
        setpoolAllocatedData(
          allocationData[allocationData.length - 1]?.allocation
        )
      } else {
        setpoolAllocatedData(0)
      }
    }
  }, [allocationData, currentPool])

  const fetchLiquiditySplit = async () => {
    if (
      currentDapp === 'Select a dapp' ||
      !toMarketLiqA ||
      !toMarketLiqB ||
      !currentBorrowCoin ||
      !inputBorrowAmount ||
      currentPool === 'Select a pool'
    )
      return

    if (currentDapp === 'Jediswap') {
      const split = await getJediEstimateLiquiditySplit(
        currentBorrowCoin,
        (
          Math.floor(Number(inputBorrowAmount)) *
          Math.pow(10, tokenDecimalsMap[currentBorrowCoin])
        )?.toString(),
        toMarketLiqA,
        toMarketLiqB
        // "USDT",
        // 99,
        // "ETH",
        // "USDT"
      )
      setCurrentSplit(split)
    } else if (currentDapp === 'mySwap') {
      const split = await getMySwapEstimateLiquiditySplit(
        currentBorrowCoin,
        (
          Math.floor(Number(inputBorrowAmount)) *
          Math.pow(10, tokenDecimalsMap[currentBorrowCoin])
        )?.toString(),
        toMarketLiqA,
        toMarketLiqB
        // "USDT",
        // 99,
        // "ETH",
        // "USDT"
      )
      setCurrentSplit(split)
    }
  }

  const fetchLPAmount = async () => {
    if (
      currentDapp === 'Select a dapp' ||
      !toMarketLiqA ||
      !toMarketLiqB ||
      !currentBorrowCoin ||
      !inputBorrowAmount ||
      currentPool === 'Select a pool'
    )
      return
    ////console.log("inputBorrowAmount", Number(inputBorrowAmount));
    if (currentDapp === 'Jediswap') {
      const lp_tokon = await getJediEstimatedLpAmountOut(
        currentBorrowCoin,
        (
          Number(inputBorrowAmount) *
          Math.pow(10, tokenDecimalsMap[currentBorrowCoin])
        )?.toString(),
        toMarketLiqA,
        toMarketLiqB
        // "USDT",
        // "99",
        // "ETH",
        // "USDT"
      )
      setCurrentLPTokenAmount(lp_tokon)
    } else if (currentDapp === 'mySwap') {
      const lp_tokon = await getMySwapEstimatedLpAmountOut(
        currentBorrowCoin,
        (
          Number(inputBorrowAmount) *
          Math.pow(10, tokenDecimalsMap[currentBorrowCoin])
        )?.toString(),
        toMarketLiqA,
        toMarketLiqB
        // "USDT",
        // "99",
        // "ETH",
        // "USDT"
      )
      setCurrentLPTokenAmount(lp_tokon)
    }
  }
  // useEffect(() => {
  //   const fetchEstrTokens = async () => {
  //     const data = await getrTokensMinted(
  //       collateralBalance.substring(spaceIndex + 1),
  //       inputCollateralAmount
  //     );
  //    //console.log(data, "data in your borrow for est");
  //     ////console.log(data, "data in your borrow");
  //     setEstrTokensMinted(data);
  //   };
  //   fetchEstrTokens();
  // }, [collateralBalance, inputCollateralAmount]);

  useEffect(() => {
    setToMarketLiqA(pool.split('/')[0])
    setToMarketLiqB(pool.split('/')[1])
    if (currentDapp == 'Jediswap') {
      setL3App('JEDI_SWAP')
    } else {
      setL3App('MY_SWAP')
    }
  }, [poolNumber])

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
      console.log(err, 'er in strk alloc')
      return 0
    }
  }
  return (
    <Box>
      <Button
        cursor="pointer"
        height={'2rem'}
        fontSize={'12px'}
        padding="6px 12px"
        border="1px solid white"
        bgColor="transparent"
        _hover={{ bg: 'white', color: 'black' }}
        borderRadius={'6px'}
        color="white"
        onClick={() => {
          const uqID = Math.random()
          setUniqueID(uqID)
          let data: any = localStorage.getItem('transactionCheck')
          data = data ? JSON.parse(data) : []
          if (data && !data.includes(uqID)) {
            data.push(uqID)
            localStorage.setItem('transactionCheck', JSON.stringify(data))
          }
          onOpen()
        }}
      >
        Execute
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          const uqID = getUniqueId()
          let data: any = localStorage.getItem('transactionCheck')
          data = data ? JSON.parse(data) : []
          ////console.log(uqID, "data here", data);
          if (data && data.includes(uqID)) {
            data = data.filter((val: any) => val != uqID)
            localStorage.setItem('transactionCheck', JSON.stringify(data))
          }
          onClose()
          resetStates()
          if (transactionStarted) {
            dispatch(setTransactionStartedAndModalClosed(true))
            // dispatch(setToastTransactionStarted(""));
          }
        }}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay bg="rgba(244, 242, 255, 0.5);" mt="3.8rem" />

        <ModalContent mt="6rem" bg={'#02010F'} maxW="464px">
          <ModalHeader
            mt="1rem"
            fontSize="14px"
            fontWeight="600"
            fontStyle="normal"
            lineHeight="20px"
            color="white"
            display="flex"
            alignItems="center"
            gap="2"
          >
            Strategy
            <Tooltip
              hasArrow
              placement="right"
              boxShadow="dark-lg"
              label="strategy tooltip contents"
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
              <Box>
                <InfoIconBig />
              </Box>
            </Tooltip>
          </ModalHeader>

          <ModalCloseButton color="white" mt="1rem" mr="1rem" />

          <ModalBody overflowY="auto" color={'#E6EDF3'}>
            <Card
              background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              p="0.8rem"
            >
              <Text
                color="#8B949E"
                display="flex"
                justifyContent="space-between"
                fontSize="12px"
                mb="1rem"
                mt="0.5rem"
              >
                <Text display="flex" alignItems="center">
                  <Text
                    mr="0.2rem"
                    font-style="normal"
                    font-weight="400"
                    font-size="14px"
                    color="#676D9A"
                  >
                    Collateral Market:
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
                    boxShadow="dark-lg"
                    label="Tokens held as security for borrowed funds."
                    bg="#02010F"
                    fontSize={'13px'}
                    fontWeight={'400'}
                    borderRadius={'lg'}
                    padding={'2'}
                    color="#F0F0F5"
                    border="1px solid"
                    borderColor="#23233D"
                    arrowShadowColor="#2B2F35"
                    maxW="222px"
                  >
                    <Box>
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Text>
                <Box display="flex" gap="0.2rem">
                  <Image
                    src={`/${suggestedCollateral}.svg`}
                    alt="Picture of the author"
                    width="14"
                    height="14"
                    style={{ marginBottom: '0.1rem' }}
                  />
                  <Text
                    font-style="normal"
                    font-weight="400"
                    font-size="14px"
                    color="#676D9A"
                  >
                    {suggestedCollateral}
                  </Text>
                </Box>
              </Text>
              <Text
                display="flex"
                justifyContent="space-between"
                fontSize="12px"
              >
                <Text display="flex" alignItems="center">
                  <Text
                    mr="0.2rem"
                    font-style="normal"
                    font-weight="400"
                    font-size="14px"
                    lineHeight="16px"
                    color="#676D9A"
                  >
                    Collateral Amount
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
                    boxShadow="dark-lg"
                    label="The amount of tokens used as security for borrowed funds."
                    bg="#02010F"
                    fontSize={'13px'}
                    fontWeight={'400'}
                    borderRadius={'lg'}
                    padding={'2'}
                    color="#F0F0F5"
                    border="1px solid"
                    borderColor="#23233D"
                    arrowShadowColor="#2B2F35"
                    maxW="256px"
                  >
                    <Box>
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Text>
                <Text
                  font-style="normal"
                  font-weight="400"
                  font-size="14px"
                  font-family="Avenir"
                  color="#676D9A"
                >
                  {numberFormatter(collateralSuggestedAmount)}{' '}
                  {suggestedCollateral}
                  {/* 5.56% */}
                </Text>
              </Text>
              {collateralAmount > 0 && inputBorrowAmount > 0 && (
                <Text
                  display="flex"
                  justifyContent="space-between"
                  fontSize="12px"
                  mb="0.4rem"
                >
                  <Text
                    display="flex"
                    alignItems="center"
                    key={'effective apr'}
                  >
                    <Text
                      mr="0.2rem"
                      font-style="normal"
                      font-weight="400"
                      font-size="14px"
                      lineHeight="16px"
                      color="#676D9A"
                    >
                      Effective APR:
                    </Text>
                    <Tooltip
                      hasArrow
                      placement="right"
                      boxShadow="dark-lg"
                      label="If positive, This is the yield earned by your loan at present. If negative, This is the interest you are paying."
                      bg="#02010F"
                      fontSize={'13px'}
                      fontWeight={'400'}
                      borderRadius={'lg'}
                      padding={'2'}
                      color="#F0F0F5"
                      border="1px solid"
                      borderColor="#23233D"
                      arrowShadowColor="#2B2F35"
                      maxW="300px"
                      mt="12px"
                    >
                      <Box>
                        <InfoIcon />
                      </Box>
                    </Tooltip>
                  </Text>
                  <Text
                    font-style="normal"
                    font-weight="400"
                    font-size="14px"
                    color="#676D9A"
                  >
                    {tokenTypeSelected === 'Native' ? (
                      inputBorrowAmount === 0 ||
                      collateralAmount === 0 ||
                      !borrowAPRs[currentBorrowAPR] ? (
                        <Box pt="2px">
                          <Skeleton
                            width="2.3rem"
                            height=".85rem"
                            startColor="#2B2F35"
                            endColor="#101216"
                            borderRadius="6px"
                          />
                        </Box>
                      ) : (
                        <Text
                          color={
                            Number(
                              (-(
                                inputBorrowAmountUSD *
                                protocolStats?.find(
                                  (stat: any) =>
                                    stat?.token === currentBorrowCoin
                                )?.borrowRate
                              ) +
                                inputCollateralAmountUSD *
                                  (protocolStats?.find(
                                    (stat: any) =>
                                      stat?.token === currentCollateralCoin
                                  )?.supplyRate +
                                    getBoostedAprSupply(
                                      currentCollateralCoin
                                    ))) /
                                inputCollateralAmountUSD
                            ) < 0
                              ? 'rgb(255 94 94)'
                              : '#00D395'
                          }
                        >
                          {/* 5.56% */}
                          {/* loan_usd_value * loan_apr - collateral_usd_value * collateral_apr) / loan_usd_value */}
                          {}
                          {/* {
                          protocolStats?.find(
                            (stat: any) => stat?.token === currentCollateralCoin
                          )?.supplyRate
                        } */}
                          {Number(
                            (-(
                              inputBorrowAmountUSD *
                              protocolStats?.find(
                                (stat: any) => stat?.token === currentBorrowCoin
                              )?.borrowRate
                            ) +
                              inputCollateralAmountUSD *
                                (protocolStats?.find(
                                  (stat: any) =>
                                    stat?.token === currentCollateralCoin
                                )?.supplyRate +
                                  getBoostedAprSupply(currentCollateralCoin))) /
                              inputCollateralAmountUSD
                          ).toFixed(2)}
                          %
                        </Text>
                      )
                    ) : // protocolStats.length === 0 ||
                    rTokenAmount === 0 ||
                      inputBorrowAmount === 0 ||
                      !borrowAPRs[currentBorrowAPR] ? (
                      <Box pt="2px">
                        <Skeleton
                          width="2.3rem"
                          height=".85rem"
                          startColor="#2B2F35"
                          endColor="#101216"
                          borderRadius="6px"
                        />
                      </Box>
                    ) : (
                      <Text
                        color={
                          (-(
                            inputBorrowAmountUSD *
                            protocolStats?.find(
                              (stat: any) => stat?.token === currentBorrowCoin
                            )?.borrowRate
                          ) +
                            inputCollateralAmountUSD *
                              (protocolStats?.find(
                                (stat: any) => stat?.token === rToken.slice(1)
                              )?.supplyRate +
                                getBoostedAprSupply(rToken.slice(1)))) /
                            inputCollateralAmountUSD <
                          0
                            ? 'rgb(255 94 94)'
                            : '#00D395'
                        }
                      >
                        {/* 5.56% */}
                        {/* loan_usd_value * loan_apr - collateral_usd_value * collateral_apr) / loan_usd_value */}
                        {(
                          (-(
                            inputBorrowAmountUSD *
                            protocolStats?.find(
                              (stat: any) => stat?.token === currentBorrowCoin
                            )?.borrowRate
                          ) +
                            inputCollateralAmountUSD *
                              (protocolStats?.find(
                                (stat: any) => stat?.token === rToken.slice(1)
                              )?.supplyRate +
                                getBoostedAprSupply(rToken.slice(1)))) /
                          inputCollateralAmountUSD
                        ).toFixed(2)}
                        %
                        {/* {
                            protocolStats?.find(
                              (stat: any) => stat?.token === currentCollateralCoin
                            )?.supplyRate
                          } */}
                      </Text>
                    )}
                  </Text>
                </Text>
              )}
              {/* {healthFactor ? (
                <Text
                  color="#8B949E"
                  display="flex"
                  justifyContent="space-between"
                  fontSize="12px"
                >
                  <Text display="flex" alignItems="center">
                    <Text
                      mr="0.2rem"
                      font-style="normal"
                      font-weight="400"
                      font-size="14px"
                      color="#676D9A"
                    >
                      Health Factor:
                    </Text>
                    <Tooltip
                      hasArrow
                      placement="right"
                      boxShadow="dark-lg"
                      label="Loan risk metric comparing collateral value to borrowed amount to check potential liquidation."
                      bg="#02010F"
                      fontSize={'13px'}
                      fontWeight={'400'}
                      borderRadius={'lg'}
                      padding={'2'}
                      color="#F0F0F5"
                      border="1px solid"
                      borderColor="#23233D"
                      arrowShadowColor="#2B2F35"
                      maxW="300px"
                      mt="12px"
                    >
                      <Box>
                        <InfoIcon />
                      </Box>
                    </Tooltip>
                  </Text>
                  <Text
                    font-style="normal"
                    font-weight="900"
                    font-size="12px"
                    color="#676D9A"
                  >
                    {healthFactor?.toFixed(2)}
                  </Text>
                </Text>
              ) : (
                ''
              )} */}
            </Card>

            <Card
              background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              mt="1.5rem"
              p="0.8rem"
            >
              <Text
                color="#8B949E"
                display="flex"
                justifyContent="space-between"
                fontSize="12px"
                mb="1rem"
                mt="0.5rem"
              >
                <Text display="flex" alignItems="center">
                  <Text
                    mr="0.2rem"
                    font-style="normal"
                    font-weight="400"
                    font-size="14px"
                    color="#676D9A"
                  >
                    Borrow Market:
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
                    boxShadow="dark-lg"
                    label="The token borrowed from the protocol."
                    bg="#02010F"
                    fontSize={'13px'}
                    fontWeight={'400'}
                    borderRadius={'lg'}
                    padding={'2'}
                    color="#F0F0F5"
                    border="1px solid"
                    borderColor="#23233D"
                    arrowShadowColor="#2B2F35"
                    maxW="222px"
                  >
                    <Box>
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Text>
                <Box display="flex" gap="0.2rem">
                  <Image
                    src={`/${suggestedBorrow.name}.svg`}
                    alt="Picture of the author"
                    width="14"
                    height="14"
                    style={{ marginBottom: '0.2rem' }}
                  />
                  <Text
                    font-style="normal"
                    font-weight="400"
                    font-size="14px"
                    color="#676D9A"
                  >
                    {suggestedBorrow.name}
                  </Text>
                </Box>
              </Text>
              <Text
                display="flex"
                justifyContent="space-between"
                fontSize="12px"
                mb="1rem"
              >
                <Text display="flex" alignItems="center">
                  <Text
                    mr="0.2rem"
                    font-style="normal"
                    font-weight="400"
                    font-size="14px"
                    lineHeight="16px"
                    color="#676D9A"
                  >
                    Borrowed Amount
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
                    boxShadow="dark-lg"
                    label="The quantity of tokens you want to borrow from the protocol."
                    bg="#02010F"
                    fontSize={'13px'}
                    fontWeight={'400'}
                    borderRadius={'lg'}
                    padding={'2'}
                    color="#F0F0F5"
                    border="1px solid"
                    borderColor="#23233D"
                    arrowShadowColor="#2B2F35"
                    maxW="256px"
                  >
                    <Box>
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Text>
                <Text
                  font-style="normal"
                  font-weight="400"
                  font-size="14px"
                  font-family="Avenir"
                  color="#676D9A"
                >
                  {numberFormatter(borrowSuggestedAmount)}{' '}
                  {suggestedBorrow.name}
                  {/* 5.56% */}
                </Text>
              </Text>
              <Text
                display="flex"
                justifyContent="space-between"
                fontSize="12px"
              >
                <Text display="flex" alignItems="center">
                  <Text
                    mr="0.2rem"
                    font-style="normal"
                    font-weight="400"
                    font-size="14px"
                    lineHeight="16px"
                    color="#676D9A"
                  >
                    Leverage
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
                    boxShadow="dark-lg"
                    label="Leverage is the proportion of loan amount to collateral value in protocol."
                    bg="#02010F"
                    fontSize={'13px'}
                    fontWeight={'400'}
                    borderRadius={'lg'}
                    padding={'2'}
                    color="#F0F0F5"
                    border="1px solid"
                    borderColor="#23233D"
                    arrowShadowColor="#2B2F35"
                    maxW="256px"
                  >
                    <Box>
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Text>
                <Text
                  font-style="normal"
                  font-weight="400"
                  font-size="14px"
                  font-family="Avenir"
                  color="#676D9A"
                >
                  {numberFormatter(
                    (borrowSuggestedAmount *
                      oraclePrices?.find(
                        (curr: any) => curr.name === suggestedBorrow.name
                      )?.price) /
                      (collateralSuggestedAmount *
                        oraclePrices?.find(
                          (curr: any) => curr.name === suggestedCollateral
                        )?.price)
                  )}
                </Text>
              </Text>
            </Card>

            <Card
              background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              mt="1.5rem"
              p="0.8rem"
            >
              <Text
                color="#8B949E"
                display="flex"
                justifyContent="space-between"
                fontSize="12px"
                mb="1rem"
                mt="0.5rem"
              >
                <Text display="flex" alignItems="center">
                  <Text
                    mr="0.2rem"
                    font-style="normal"
                    font-weight="400"
                    font-size="14px"
                    color="#676D9A"
                  >
                    Strategy Selected:
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
                    boxShadow="dark-lg"
                    label="Describes the specific dapp name, collateral, debt, type, and secondary market involved."
                    bg="#02010F"
                    fontSize={'13px'}
                    fontWeight={'400'}
                    borderRadius={'lg'}
                    padding={'2'}
                    color="#F0F0F5"
                    border="1px solid"
                    borderColor="#23233D"
                    arrowShadowColor="#2B2F35"
                    maxW="222px"
                  >
                    <Box>
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Text>
                <Box>
                <Box display="flex" gap="0.2rem">
                  <Image
                    src={`/${'JEDI_SWAP'}.svg`}
                    alt="Picture of the author"
                    width="14"
                    height="14"
                    style={{ marginBottom: '0.1rem' }}
                  />
                  <Box>
                    <Text
                      font-style="normal"
                      font-weight="400"
                      font-size="14px"
                      color="#676D9A"
                    >
                      Jediswap
                    </Text>
                  </Box>
                </Box>
                  <Text
                      ml="1.2rem" 
                      font-style="normal"
                      font-weight="400"
                      font-size="14px"
                      color="#676D9A">
                    Strt
                  </Text>
                </Box>
              </Text>
              <Text
                display="flex"
                justifyContent="space-between"
                fontSize="12px"
                mb="1rem"
              >
                <Text display="flex" alignItems="center">
                  <Text
                    mr="0.2rem"
                    font-style="normal"
                    font-weight="400"
                    font-size="14px"
                    lineHeight="16px"
                    color="#676D9A"
                  >
                    Selected Dapp
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
                    boxShadow="dark-lg"
                    label="The annual interest rate charged on borrowed funds from the protocol."
                    bg="#02010F"
                    fontSize={'13px'}
                    fontWeight={'400'}
                    borderRadius={'lg'}
                    padding={'2'}
                    color="#F0F0F5"
                    border="1px solid"
                    borderColor="#23233D"
                    arrowShadowColor="#2B2F35"
                    maxW="256px"
                  >
                    <Box>
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Text>
                <Text
                  font-style="normal"
                  font-weight="400"
                  font-size="14px"
                  font-family="Avenir"
                  color="#676D9A"
                >
                  <Box display="flex" gap="0.2rem">
                    <Image
                      src={`/${'JEDI_SWAP'}.svg`}
                      alt="Picture of the author"
                      width="14"
                      height="14"
                      style={{ marginBottom: '0.2rem' }}
                    />
                    <Text
                      font-style="normal"
                      font-weight="400"
                      font-size="14px"
                      color="#676D9A"
                    >
                      Jediswap
                    </Text>
                  </Box>
                </Text>
              </Text>
              <Text
                display="flex"
                justifyContent="space-between"
                fontSize="12px"
              >
                <Text display="flex" alignItems="center">
                  <Text
                    mr="0.2rem"
                    font-style="normal"
                    font-weight="400"
                    font-size="14px"
                    lineHeight="16px"
                    color="#676D9A"
                  >
                    Selected Pool
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
                    boxShadow="dark-lg"
                    label="The annual interest rate charged on borrowed funds from the protocol."
                    bg="#02010F"
                    fontSize={'13px'}
                    fontWeight={'400'}
                    borderRadius={'lg'}
                    padding={'2'}
                    color="#F0F0F5"
                    border="1px solid"
                    borderColor="#23233D"
                    arrowShadowColor="#2B2F35"
                    maxW="256px"
                  >
                    <Box>
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Text>
                <Box
                  display="flex"
                  gap="2"
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  <Box display="flex" gap="2px">
                    <Box mt="2px">
                      {/* <SmallEth /> */}
                      <Image
                        src={`/${toMarketLiqA}.svg`}
                        alt="liquidity split coin1"
                        width="12"
                        height="12"
                      />
                    </Box>
                    <Text>
                      {/* {currentSplit?.[0]?.toString() || (
                              <Skeleton
                                width="2.3rem"
                                height=".85rem"
                                startColor="#2B2F35"
                                endColor="#101216"
                                borderRadius="6px"
                              />
                            )} */}
                      {toMarketLiqA}
                    </Text>
                  </Box>
                  /
                  <Box display="flex" gap="2px">
                    <Box mt="2px">
                      {/* <SmallUsdt /> */}
                      <Image
                        src={`/${toMarketLiqB}.svg`}
                        alt="liquidity split coin1"
                        width="12"
                        height="12"
                      />
                    </Box>
                    <Text>
                      {toMarketLiqB}
                      {/* {currentSplit?.[1].toString() || (
                              <Skeleton
                                width="2.3rem"
                                height=".85rem"
                                startColor="#2B2F35"
                                endColor="#101216"
                                borderRadius="6px"
                              />
                            )} */}
                    </Text>
                  </Box>
                </Box>
              </Text>
            </Card>

            <Card
              background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              mt="1.5rem"
              p="1rem"
            >
              <Text
                color="#8B949E"
                display="flex"
                justifyContent="space-between"
                fontSize="12px"
                mb="0.4rem"
              >
                <Text display="flex" alignItems="center">
                  <Text
                    mr="0.2rem"
                    font-style="normal"
                    font-weight="400"
                    font-size="14px"
                    color="#676D9A"
                  >
                    Fees:
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
                    boxShadow="dark-lg"
                    label="Fees charged by Hashstack protocol. Additional third-party DApp fees may apply as appropriate."
                    bg="#02010F"
                    fontSize={'13px'}
                    fontWeight={'400'}
                    borderRadius={'lg'}
                    padding={'2'}
                    color="#F0F0F5"
                    border="1px solid"
                    borderColor="#23233D"
                    arrowShadowColor="#2B2F35"
                    maxW="222px"
                  >
                    <Box>
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Text>
                <Text
                  font-style="normal"
                  font-weight="400"
                  font-size="14px"
                  color="#676D9A"
                >
                  {fees?.borrow}%
                </Text>
              </Text>
              <Text
                display="flex"
                justifyContent="space-between"
                fontSize="12px"
                mb="0.4rem"
              >
                <Text display="flex" alignItems="center">
                  <Text
                    mr="0.2rem"
                    font-style="normal"
                    font-weight="400"
                    font-size="14px"
                    lineHeight="16px"
                    color="#676D9A"
                  >
                    Borrow APR:
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
                    boxShadow="dark-lg"
                    label="The annual interest rate charged on borrowed funds from the protocol."
                    bg="#02010F"
                    fontSize={'13px'}
                    fontWeight={'400'}
                    borderRadius={'lg'}
                    padding={'2'}
                    color="#F0F0F5"
                    border="1px solid"
                    borderColor="#23233D"
                    arrowShadowColor="#2B2F35"
                    maxW="256px"
                  >
                    <Box>
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Text>
                <Text
                  font-style="normal"
                  font-weight="400"
                  font-size="14px"
                  font-family="Avenir"
                  color="#676D9A"
                >
                  {!borrowAPRs || borrowAPRs[currentBorrowAPR] == null ? (
                    <Box pt="2px">
                      <Skeleton
                        width="2.3rem"
                        height=".85rem"
                        startColor="#2B2F35"
                        endColor="#101216"
                        borderRadius="6px"
                      />
                    </Box>
                  ) : (
                    `-${borrowAPRs[currentBorrowAPR]}%`
                  )}
                  {/* 5.56% */}
                </Text>
              </Text>
              {collateralAmount > 0 && inputBorrowAmount > 0 && (
                <Text
                  display="flex"
                  justifyContent="space-between"
                  fontSize="12px"
                  mb="0.4rem"
                >
                  <Text
                    display="flex"
                    alignItems="center"
                    key={'effective apr'}
                  >
                    <Text
                      mr="0.2rem"
                      font-style="normal"
                      font-weight="400"
                      font-size="14px"
                      lineHeight="16px"
                      color="#676D9A"
                    >
                      Effective APR:
                    </Text>
                    <Tooltip
                      hasArrow
                      placement="right"
                      boxShadow="dark-lg"
                      label="If positive, This is the yield earned by your loan at present. If negative, This is the interest you are paying."
                      bg="#02010F"
                      fontSize={'13px'}
                      fontWeight={'400'}
                      borderRadius={'lg'}
                      padding={'2'}
                      color="#F0F0F5"
                      border="1px solid"
                      borderColor="#23233D"
                      arrowShadowColor="#2B2F35"
                      maxW="300px"
                      mt="12px"
                    >
                      <Box>
                        <InfoIcon />
                      </Box>
                    </Tooltip>
                  </Text>
                  <Text
                    font-style="normal"
                    font-weight="400"
                    font-size="14px"
                    color="#676D9A"
                  >
                    {tokenTypeSelected === 'Native' ? (
                      inputBorrowAmount === 0 ||
                      collateralAmount === 0 ||
                      !borrowAPRs[currentBorrowAPR] ? (
                        <Box pt="2px">
                          <Skeleton
                            width="2.3rem"
                            height=".85rem"
                            startColor="#2B2F35"
                            endColor="#101216"
                            borderRadius="6px"
                          />
                        </Box>
                      ) : (
                        <Text
                          color={
                            Number(
                              (-(
                                inputBorrowAmountUSD *
                                protocolStats?.find(
                                  (stat: any) =>
                                    stat?.token === currentBorrowCoin
                                )?.borrowRate
                              ) +
                                inputCollateralAmountUSD *
                                  (protocolStats?.find(
                                    (stat: any) =>
                                      stat?.token === currentCollateralCoin
                                  )?.supplyRate +
                                    getBoostedAprSupply(
                                      currentCollateralCoin
                                    ))) /
                                inputCollateralAmountUSD
                            ) < 0
                              ? 'rgb(255 94 94)'
                              : '#00D395'
                          }
                        >
                          {/* 5.56% */}
                          {/* loan_usd_value * loan_apr - collateral_usd_value * collateral_apr) / loan_usd_value */}
                          {}
                          {/* {
                          protocolStats?.find(
                            (stat: any) => stat?.token === currentCollateralCoin
                          )?.supplyRate
                        } */}
                          {Number(
                            (-(
                              inputBorrowAmountUSD *
                              protocolStats?.find(
                                (stat: any) => stat?.token === currentBorrowCoin
                              )?.borrowRate
                            ) +
                              inputCollateralAmountUSD *
                                (protocolStats?.find(
                                  (stat: any) =>
                                    stat?.token === currentCollateralCoin
                                )?.supplyRate +
                                  getBoostedAprSupply(currentCollateralCoin))) /
                              inputCollateralAmountUSD
                          ).toFixed(2)}
                          %
                        </Text>
                      )
                    ) : // protocolStats.length === 0 ||
                    rTokenAmount === 0 ||
                      inputBorrowAmount === 0 ||
                      !borrowAPRs[currentBorrowAPR] ? (
                      <Box pt="2px">
                        <Skeleton
                          width="2.3rem"
                          height=".85rem"
                          startColor="#2B2F35"
                          endColor="#101216"
                          borderRadius="6px"
                        />
                      </Box>
                    ) : (
                      <Text
                        color={
                          (-(
                            inputBorrowAmountUSD *
                            protocolStats?.find(
                              (stat: any) => stat?.token === currentBorrowCoin
                            )?.borrowRate
                          ) +
                            inputCollateralAmountUSD *
                              (protocolStats?.find(
                                (stat: any) => stat?.token === rToken.slice(1)
                              )?.supplyRate +
                                getBoostedAprSupply(rToken.slice(1)))) /
                            inputCollateralAmountUSD <
                          0
                            ? 'rgb(255 94 94)'
                            : '#00D395'
                        }
                      >
                        {/* 5.56% */}
                        {/* loan_usd_value * loan_apr - collateral_usd_value * collateral_apr) / loan_usd_value */}
                        {(
                          (-(
                            inputBorrowAmountUSD *
                            protocolStats?.find(
                              (stat: any) => stat?.token === currentBorrowCoin
                            )?.borrowRate
                          ) +
                            inputCollateralAmountUSD *
                              (protocolStats?.find(
                                (stat: any) => stat?.token === rToken.slice(1)
                              )?.supplyRate +
                                getBoostedAprSupply(rToken.slice(1)))) /
                          inputCollateralAmountUSD
                        ).toFixed(2)}
                        %
                        {/* {
                            protocolStats?.find(
                              (stat: any) => stat?.token === currentCollateralCoin
                            )?.supplyRate
                          } */}
                      </Text>
                    )}
                  </Text>
                </Text>
              )}
              {healthFactor ? (
                <Text
                  color="#8B949E"
                  display="flex"
                  justifyContent="space-between"
                  fontSize="12px"
                >
                  <Text display="flex" alignItems="center">
                    <Text
                      mr="0.2rem"
                      font-style="normal"
                      font-weight="400"
                      font-size="14px"
                      color="#676D9A"
                    >
                      Health Factor:
                    </Text>
                    <Tooltip
                      hasArrow
                      placement="right"
                      boxShadow="dark-lg"
                      label="Loan risk metric comparing collateral value to borrowed amount to check potential liquidation."
                      bg="#02010F"
                      fontSize={'13px'}
                      fontWeight={'400'}
                      borderRadius={'lg'}
                      padding={'2'}
                      color="#F0F0F5"
                      border="1px solid"
                      borderColor="#23233D"
                      arrowShadowColor="#2B2F35"
                      maxW="300px"
                      mt="12px"
                    >
                      <Box>
                        <InfoIcon />
                      </Box>
                    </Tooltip>
                  </Text>
                  <Text
                    font-style="normal"
                    font-weight="900"
                    font-size="12px"
                    color="#676D9A"
                  >
                    {healthFactor?.toFixed(2)}
                  </Text>
                </Text>
              ) : (
                ''
              )}
            </Card>

            <Box display="flex" justifyContent="left" w="100%" pb="2" pt="5">
              <Box
                width="full"
                display="flex"
                bg="#676D9A4D"
                fontSize="12px"
                p="4"
                fontStyle="normal"
                fontWeight="400"
                borderRadius="6px"
                border="1px solid #3841AA"
                color="#F0F0F5"
                gap=".7rem"
              >
                <Box mt="3px">
                  <TableInfoIcon />
                </Box>
                Your leverage is set as per the collateral which is 3x
              </Box>
            </Box>

            <Box>
              <AnimatedButton
                border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                background="white"
                opacity="100%"
                size="sm"
                width="100%"
                mt=".8rem"
                mb=".8rem"
                labelSuccessArray={[
                  'Collateral supplied.',
                  `r${suggestedCollateral} locked.`,
                  `Borrow processed`,
                  `d${suggestedBorrow} minted.`,
                  'Adding liquidity to BTC-ETH pool on Jediswap',
                  'Strategy executed successfully.',
                  <SuccessButton
                    key={'successButton'}
                    successText={'Spend successful.'}
                  />,
                ]}
                labelErrorArray={[
                  <ErrorButton errorText="Transaction failed" key={'error1'} />,
                  <ErrorButton errorText="Copy error!" key={'error2'} />,
                ]}
                _disabled={{ bgColor: 'white', color: 'black' }}
                isDisabled={transactionStarted == true}
                currentTransactionStatus={currentTransactionStatus}
                setCurrentTransactionStatus={setCurrentTransactionStatus}
              >
                Borrow
              </AnimatedButton>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default DegenModal
