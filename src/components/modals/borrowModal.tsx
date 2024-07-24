import {
  Box,
  Button,
  Card,
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
  Tab,
  TabList,
  Tabs,
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

import DAILogo from '@/assets/icons/coins/dai'
import ETHLogo from '@/assets/icons/coins/eth'
import USDCLogo from '@/assets/icons/coins/usdc'
import USDTLogo from '@/assets/icons/coins/usdt'

import {
  selectActiveTransactions,
  selectAssetWalletBalance,
  selectJedistrkTokenAllocation,
  selectnetSpendBalance,
  selectStrkAprData,
  selectWalletBalance,
  setActiveTransactions,
  setInputBorrowModalBorrowAmount,
  setInputBorrowModalCollateralAmount,
  setToastTransactionStarted,
  setTransactionStartedAndModalClosed,
  setTransactionStatus,
} from '@/store/slices/userAccountSlice'
import { useDispatch, useSelector } from 'react-redux'
import DropdownUp from '../../assets/icons/dropdownUpIcon'
import InfoIcon from '../../assets/icons/infoIcon'

import useBalanceOf from '@/Blockchain/hooks/Reads/useBalanceOf'
import useLoanRequest from '@/Blockchain/hooks/Writes/useLoanRequest'
import { NativeToken, RToken } from '@/Blockchain/interfaces/interfaces'
import {
  getLoanHealth_NativeCollateral,
  getLoanHealth_RTokenCollateral,
} from '@/Blockchain/scripts/LoanHealth'
import {
  getMaximumLoanAmount,
  getMinimumLoanAmount,
} from '@/Blockchain/scripts/Rewards'
import { getJediEstimatedLpAmountOut, getJediEstimateLiquiditySplit, getMySwapEstimatedLpAmountOut, getMySwapEstimateLiquiditySplit, getUSDValue } from '@/Blockchain/scripts/l3interaction'
import { getProtocolStats } from '@/Blockchain/scripts/protocolStats'
import {
  tokenAddressMap,
  tokenDecimalsMap,
} from '@/Blockchain/utils/addressServices'
import { BNtoNum, parseAmount } from '@/Blockchain/utils/utils'
import ArrowUp from '@/assets/icons/arrowup'
import BlueInfoIcon from '@/assets/icons/blueinfoicon'
import BugIcon from '@/assets/icons/bugIcon'
import STRKLogo from '@/assets/icons/coins/strk'
import WarningIcon from '@/assets/icons/coins/warningIcon'
import InfoIconBig from '@/assets/icons/infoIconBig'
import RedinfoIcon from '@/assets/icons/redinfoicon'
import SliderPointer from '@/assets/icons/sliderPointer'
import SliderPointerWhite from '@/assets/icons/sliderPointerWhite'
import SmallErrorIcon from '@/assets/icons/smallErrorIcon'
import {
  resetModalDropdowns,
  selectModalDropDowns,
  setModalDropdown,
} from '@/store/slices/dropdownsSlice'
import {
  selectFees,
  selectJediswapPoolAprs,
  selectJediSwapPoolsSupported,
  selectMaximumDepositAmounts,
  selectMaximumLoanAmounts,
  selectMinimumDepositAmounts,
  selectMinimumLoanAmounts,
  selectMySwapPoolsSupported,
  selectOraclePrices,
  selectProtocolStats,
} from '@/store/slices/readDataSlice'
import dollarConvertor from '@/utils/functions/dollarConvertor'
import numberFormatter from '@/utils/functions/numberFormatter'
import { useWaitForTransaction } from '@starknet-react/core'
import mixpanel from 'mixpanel-browser'
import posthog from 'posthog-js'
import { memo, useEffect, useRef, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { toast } from 'react-toastify'
import { uint256 } from 'starknet'
import AnimatedButton from '../uiElements/buttons/AnimationButton'
import ErrorButton from '../uiElements/buttons/ErrorButton'
import SuccessButton from '../uiElements/buttons/SuccessButton'
import SliderTooltip from '../uiElements/sliders/sliderTooltip'
import Image from 'next/image'
import useBorrowAndSpend from '@/Blockchain/hooks/Writes/useBorrowAndSpend'
import { getAprByPool, getStrkAlloaction, getTvlByPool, getBoostedApr } from '@/Blockchain/scripts/userStats'
import numberFormatterPercentage from '@/utils/functions/numberFormatterPercentage'
import JediswapLogo from '@/assets/icons/dapps/jediswapLogo'
import MySwap from '@/assets/icons/dapps/mySwap'
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
const BorrowModal = ({
  buttonText,
  coin,
  borrowAPRs,
  currentBorrowAPR,
  setCurrentBorrowAPR,
  supplyAPRs,
  currentSupplyAPR,
  validRTokens,
  ...restProps
}: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [sliderValue, setSliderValue] = useState<number>(0)
  const [sliderValue2, setsliderValue2] = useState<number>(0)
  const dispatch = useDispatch()
  const [inputCollateralAmount, setinputCollateralAmount] = useState(0)
  const [inputBorrowAmount, setinputBorrowAmount] = useState(0)
  const [currentParsedInputBorrowAmount, setCurrentParsedInputBorrowAmount] =
    useState(0)

  const modalDropdowns = useSelector(selectModalDropDowns)
  // const walletBalances = useSelector(selectAssetWalletBalance);
  const [walletBalance, setwalletBalance] = useState(0)
  const [actionSelected, setactionSelected] = useState("Borrow")
  const [radioValue, setRadioValue] = useState('1')
  const [currentDapp, setCurrentDapp] = useState(
     'Select a dapp'
  )
  const dapps = [
    { name: 'Jediswap', status: 'enable' },
    { name: 'mySwap', status: 'enable' },
  ]
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
  const poolAprs = useSelector(selectJediswapPoolAprs)
  const poolsPairs = useSelector(selectJediSwapPoolsSupported)
  const mySwapPoolPairs = useSelector(selectMySwapPoolsSupported)
  const stats = useSelector(selectProtocolStats)
  const [myswapPools, setmyswapPools] = useState([])
  const [jediswapPools, setjediswapPools] = useState([])
  const [currentPool, setCurrentPool] = useState('Select a pool')
  const [currentPoolCoin, setCurrentPoolCoin] = useState('Select a pool')
  const [currentLPTokenAmount, setCurrentLPTokenAmount] = useState<
  Number | undefined | null
>()
const [currentSplit, setCurrentSplit] = useState<
  Number[] | undefined | null
>()
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

    if (currentDapp === 'Jediswap' || currentDapp==='mySwap') {
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
    } 
    else if (currentDapp === 'mySwap') {
      console.log('enter')
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
  useEffect(() => {
    ////console.log(
    //   "coin here - ",
    //   coin,
    //   walletBalances[coin?.name]?.statusBalanceOf
    // );
    setwalletBalance(
      walletBalances[coin?.name]?.statusBalanceOf === 'success'
        ? parseAmount(
            String(
              uint256.uint256ToBN(
                walletBalances[coin?.name]?.dataBalanceOf?.balance
              )
            ),
            tokenDecimalsMap[coin?.name]
          )
        : 0
    )
    ////console.log("supply modal status wallet balance",walletBalances[coin?.name]?.statusBalanceOf)
  }, [walletBalances[coin?.name]?.statusBalanceOf])

  const {
    market,
    setMarket,
    amount,
    setAmount,

    rTokenCollateral,
    setRTokenCollateral,
    rTokenAmountCollateral,
    setRTokenAmountCollateral,

    collateralMarketNative,
    setCollateralMarketNative,
    collateralAmountNative,
    setCollateralAmountNative,
    transLoanRequestHash,
    setIsLoanRequestHash,

    dataLoanRequestrToken,
    errorLoanRequestrToken,
    resetLoanRequestrToken,
    writeLoanRequestrToken,
    writeAsyncLoanRequestrToken,
    isErrorLoanRequestrToken,
    isIdleLoanRequestrToken,

    dataLoanRequest,
    errorLoanRequest,
    resetLoanRequest,
    writeLoanRequest,
    writeAsyncLoanRequest,
    isErrorLoanRequest,
    isIdleLoanRequest,
  } = useLoanRequest()
  
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
  useEffect(() => {
    setMarket(coin ? coin?.name : 'BTC')
    setLoanMarket(coin ? coin?.name : 'BTC')
    setRToken(coin ? coin?.name : 'rBTC')
    setRTokenCollateral(coin ? coin?.name : 'rBTC')
    setCollateralMarket(coin ? coin?.name : 'BTC')
    setCollateralMarketNative(coin ? coin?.name : 'BTC')
  }, [coin])

  const coinIndex: any = [
    { token: 'USDT', idx: 0 },
    { token: 'USDC', idx: 1 },
    { token: 'BTC', idx: 2 },
    { token: 'ETH', idx: 3 },
    { token: 'DAI', idx: 4 },
  ]

  const [borrowTransHash, setBorrowTransHash] = useState('')
  const [currentTransactionStatus, setCurrentTransactionStatus] = useState('')
  const [collateralMarketIndex, setcollateralMarketIndex] = useState<Number>(-1)
  const [borrowMarketIndex, setborrowMarketIndex] = useState<Number>(-1)
  const [dappHoverIndex, setdappHoverIndex] = useState<Number>(-1)
  const [poolHoverIndex, setpoolHoverIndex] = useState<Number>(-1)
  const [isToastDisplayed, setToastDisplayed] = useState(false)
  const [showToast, setShowToast] = useState('true')
  const [toastId, setToastId] = useState<any>()
  const [minimumLoanAmount, setMinimumLoanAmount] = useState<any>(0)
  const [maximumLoanAmount, setMaximumLoanAmount] = useState<any>(0)
  // const recieptData = useWaitForTransaction({
  //   hash: borrowTransHash,
  //   watch: true,
  //   onReceived: () => {
  //    //console.log("trans received");
  //   },
  //   onPending: () => {
  //     setCurrentTransactionStatus("success");
  //     toast.dismiss(toastId);
  //    //console.log("trans pending");
  //     if (isToastDisplayed == false) {
  //       toast.success(
  //         `You have successfully borrowed ${inputBorrowAmount} d${currentBorrowCoin}`,
  //         {
  //           position: toast.POSITION.BOTTOM_RIGHT,
  //         }
  //       );
  //       setToastDisplayed(true);
  //     }
  //   },
  //   onRejected(transaction: any) {
  //     setCurrentTransactionStatus("failed");
  //     // dispatch(setTransactionStatus("failed"));
  //     // toast.dismiss(toastId);
  //    //console.log("treans rejected");
  //     dispatch(setTransactionStatus("failed"));
  //    //console.log("handle borrow", transaction?.status);
  //     const toastContent = (
  //       <div>
  //         Transaction failed{" "}
  //         <CopyToClipboard text={transaction?.status}>
  //           <Text as="u">copy error!</Text>
  //         </CopyToClipboard>
  //       </div>
  //     );
  //     toast.error(toastContent, {
  //       position: toast.POSITION.BOTTOM_RIGHT,
  //       autoClose: false,
  //     });
  //   },
  //   onAcceptedOnL1: () => {
  //     setCurrentTransactionStatus("success");

  //    //console.log("trans onAcceptedOnL1");
  //   },
  //   onAcceptedOnL2(transaction) {
  //     setCurrentTransactionStatus("success");
  //     // if (isToastDisplayed == false) {
  //     //   toast.success(
  //     //     `You have successfully borrowed ${inputBorrowAmount} d${currentBorrowCoin} `,
  //     //     {
  //     //       position: toast.POSITION.BOTTOM_RIGHT,
  //     //     }
  //     //   );
  //     //   setToastDisplayed(true);
  //     // }
  //    //console.log("trans onAcceptedOnL2 - ", transaction);
  //   },
  // });
  let activeTransactions = useSelector(selectActiveTransactions)


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let data: any = localStorage.getItem('transactionCheck')
      let values = data.split(",");
      let lastValue = values[values.length - 1];
      if (String(activeTransactions[activeTransactions.length - 1]?.uniqueID)===lastValue.replace(/\[|\]/g, '')) {
        if (activeTransactions[activeTransactions.length - 1]?.transaction_hash === '') {
          resetStates();
          onClose();
        }
      }
    }, 7000); // 5000 milliseconds = 5 seconds
  
    return () => clearTimeout(timeoutId); // Cleanup function to clear the timeout when component unmounts or when activeTransactions changes
  }, [activeTransactions]);
  const coinAlign = ['BTC', 'USDT', 'USDC', 'ETH', 'DAI', 'STRK']
  const [currentBorrowCoin, setCurrentBorrowCoin] = useState(
    coin ? coin?.name : 'BTC'
  )
  const [currentCollateralCoin, setCurrentCollateralCoin] = useState(
    coin ? coin?.name : 'BTC'
  )
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
  //    //console.log("minimum value",data)
  //     setMinimumDepositAmount(data);
  //   }
  //   const fetchMaxDeposit=async()=>{
  //     const data=await getMaximumDepositAmount("r"+currentCollateralCoin);
  //     setmaximumDepositAmount(data);
  //   }
  //   fetchMaxDeposit();

  //   fetchMinDeposit();

  //     // setMinimumDepositAmount(2);

  // },[currentCollateralCoin])
  const [protocolStats, setProtocolStats] = useState<any>([])
  const protocolStatsRedux = useSelector(selectProtocolStats)
  const [currentAvailableReserves, setCurrentAvailableReserves] = useState(
    protocolStats?.find((stat: any) => stat?.token == currentBorrowCoin)
      ?.availableReserves * 0.895
  )
  const netSpendBalance = useSelector(selectnetSpendBalance)
  const [netStrkBorrow, setnetStrkBorrow] = useState(0)
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
  const fetchProtocolStats = async () => {
    // const stats = await getProtocolStats();
    const stats = protocolStatsRedux
    ////console.log("stats in your borrow", stats);

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
  useEffect(() => {
    try {
      fetchProtocolStats()
      ////console.log("protocolStats", protocolStats);
    } catch (err: any) {
      //console.log("borrow modal : error fetching protocolStats");
    }
  }, [protocolStatsRedux])
  // useEffect(() => {
  //  //console.log("currentAvailableReserve", currentAvailableReserves);
  // }, [currentAvailableReserves]);
  const [allocationData, setallocationData] = useState<any>()
  const [poolAllocatedData, setpoolAllocatedData] = useState<any>()
  const strkTokenAlloactionData: any = useSelector(
    selectJedistrkTokenAllocation
  )
  const oraclePrices = useSelector(selectOraclePrices)
  const marketInfo = useSelector(selectProtocolStats)
  const [uniqueID, setUniqueID] = useState(0)
  const getUniqueId = () => uniqueID
  const [healthFactor, setHealthFactor] = useState<number>()


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
    if (radioValue === '1') {
      setMethod('ADD_LIQUIDITY')
    } else if (radioValue === '2') {
      setMethod('SWAP')
    }
    ////console.log("radio value", radioValue, method);
  }, [radioValue])

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

  useEffect(() => {
    try {
      const fetchHealthFactor = async () => {
        if (tokenTypeSelected == 'Native') {
          if (
            amount > 0 &&
            market &&
            collateralAmount > 0 &&
            collateralMarket
          ) {
            const data = await getLoanHealth_NativeCollateral(
              amount,
              market,
              collateralAmount,
              collateralMarket,
              oraclePrices
            )
            setHealthFactor(data)
          }
        } else if (tokenTypeSelected == 'rToken') {
          if (amount > 0 && market && rTokenAmount > 0 && rToken) {
            const data = await getLoanHealth_RTokenCollateral(
              amount,
              market,
              rTokenAmount,
              rToken,
              oraclePrices,
              marketInfo
            )
            setHealthFactor(data)
          }
        }
      }
      fetchHealthFactor()
    } catch (err) {
      //console.log(err);
    }
  }, [amount, collateralAmount, collateralMarket, market, rToken, rTokenAmount])
  const strkData = useSelector(selectStrkAprData)
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

  useEffect(() => {
    fetchParsedUSDValueCollateral()
  }, [collateralAmount, currentCollateralCoin, rToken, rTokenAmount])

  useEffect(() => {
    setCurrentPool('Select a pool')
    setCurrentPoolCoin('Select a pool')
    setCurrentDapp('Select a dapp')
  }, [radioValue])

  const fees = useSelector(selectFees)

  const fetchParsedUSDValueBorrow = async () => {
    try {
      if (!oraclePrices || oraclePrices?.length === 0) {
        setInputBorrowAmountUSD(0)
        return
      }

      const parsedBorrowAmount =
        oraclePrices.find((curr: any) => curr.name === currentBorrowCoin)
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

  const fetchParsedUSDValueCollateral = async () => {
    try {
      if (!oraclePrices || oraclePrices?.length === 0) {
        setInputCollateralAmountUSD(0)
        ////console.log("got parsed zero collateral");

        return
      }

      if (tokenTypeSelected === 'Native') {
        const parsedBorrowAmount =
          oraclePrices.find((curr: any) => curr.name === currentCollateralCoin)
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
        const parsedBorrowAmount =
          oraclePrices.find((curr: any) => curr.name === rToken.slice(1))
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
    if (currentDapp === 'Jediswap' || currentDapp === 'mySwap') {
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

  useEffect(() => {
    setCurrentAvailableReserves(
      protocolStats[coinAlign?.indexOf(currentBorrowCoin)]?.availableReserves *
        0.895
    )
    ////console.log(coinAlign?.indexOf(currentBorrowCoin));
  }, [protocolStats, currentBorrowCoin])

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

  const [depositTransHash, setDepositTransHash] = useState('')

  const handleBorrow = async () => {
    try {
      ////console.log("borrowing", amount, market, rToken, rTokenAmount);
      if (currentCollateralCoin[0] === 'r') {
        const borrow = await writeAsyncLoanRequestrToken()
        if (borrow?.transaction_hash) {
          // setShowToast("true");
          ////console.log();
          // if (showToast == "true") {
          const toastid = toast.info(
            // `Please wait your transaction is running in background : ${inputBorrowAmount} d${currentBorrowCoin} `,
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
            transaction_hash: borrow?.transaction_hash.toString(),
            message: `Successfully borrowed : ${inputBorrowAmount} d${currentBorrowCoin}`,
            toastId: toastid,
            setCurrentTransactionStatus: setCurrentTransactionStatus,
            uniqueID: uqID,
          }
          posthog.capture('Borrow Market Status', {
            Status: 'Success',
            'Borrow Amount': inputBorrowAmount,
            'Borrow Token': currentBorrowCoin,
          })
          // addTransaction({ hash: deposit?.transaction_hash });
          activeTransactions?.push(trans_data)

          dispatch(setActiveTransactions(activeTransactions))
          // }
        }
        setIsLoanRequestHash(borrow?.transaction_hash)
        setBorrowTransHash(borrow?.transaction_hash)
        const uqID = getUniqueId()
        let data: any = localStorage.getItem('transactionCheck')
        data = data ? JSON.parse(data) : []
        if (data && data.includes(uqID)) {
          dispatch(setTransactionStatus('success'))
        }
      } else {
        const borrow = await writeAsyncLoanRequest()
        if (borrow?.transaction_hash) {
          // setShowToast("true");
          if (showToast == 'true') {
            const toastid = toast.info(
              // `Please wait your transaction is running in background : ${inputBorrowAmount} d${currentBorrowCoin} `,
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
              transaction_hash: borrow?.transaction_hash.toString(),
              message: `Successfully borrowed : ${inputBorrowAmount} d${currentBorrowCoin}`,
              toastId: toastid,
              setCurrentTransactionStatus: setCurrentTransactionStatus,
              uniqueID: uqID,
            }
            // addTransaction({ hash: deposit?.transaction_hash });
            activeTransactions?.push(trans_data)

            dispatch(setActiveTransactions(activeTransactions))
          }
        }
        posthog.capture('Borrow Market Status', {
          Status: 'Success',
          'Collateral Amount': inputCollateralAmount,
          'Collateral Market': currentCollateralCoin,
          'Borrow Amount': inputBorrowAmount,
          'Borrow Token': currentBorrowCoin,
        })
        setIsLoanRequestHash(borrow?.transaction_hash)
        const uqID = getUniqueId()
        let data: any = localStorage.getItem('transactionCheck')
        data = data ? JSON.parse(data) : []
        if (data && data.includes(uqID)) {
          dispatch(setTransactionStatus('success'))
        }
        setBorrowTransHash(borrow?.transaction_hash)
      }
    } catch (err: any) {
      const uqID = getUniqueId()
      let data: any = localStorage.getItem('transactionCheck')
      data = data ? JSON.parse(data) : []
      if (data && data.includes(uqID)) {
        // dispatch(setTransactionStatus("failed"));
        setTransactionStarted(false)
      }
      //console.log("handle borrow", err);
      posthog.capture('Borrow Market Status', {
        Status: 'Failure',
      })
      const toastContent = (
        <div>
          Transaction declined{' '}
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

  const getBalance = (coin: string) => {
    const amount = validRTokens.find(({ rToken, rTokenAmount }: any) => {
      if (rToken == coin) return rTokenAmount
    })
    return amount ? numberFormatter(amount.rTokenAmount) : 0
  }

  // const {  market,
  //   setMarket,
  //   amount,
  //   setAmount,
  //   rToken,
  //   setRToken, } = useLoanRequest();

  // const {  market,
  //   setMarket,
  //   amount,
  //   setAmount,
  //   rToken,
  //   setRToken, } = useLoanRequest();

  ////console.log("loadingg", isLoadingLoanRequest);

  const [buttonId, setButtonId] = useState(0)
  const [transactionStarted, setTransactionStarted] = useState(false)
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

  const handleDropdownClick = (dropdownName: any) => {
    dispatch(setModalDropdown(dropdownName))
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
      console.log(err, 'er in strk alloc')
      return 0
    }
  }
  const handleChange = (newValue: any) => {
    if (newValue > 9_000_000_000) return
    // newValue = Math.round((newValue * 1000_000) / 1000_000);
    // const =parseFloat(newValue)
    ////console.log(typeof a,"new val")
    var percentage = (newValue * 100) / walletBalance
    percentage = Math.max(0, percentage)
    if (percentage > 100) {
      setSliderValue(100)
      setRTokenAmount(newValue)
      setRTokenAmountCollateral(newValue)
      setinputCollateralAmount(newValue)
      setCollateralAmount(newValue)
      setCollateralAmountNative(newValue)
      dispatch(setInputBorrowModalCollateralAmount(newValue))
    } else {
      percentage = Math.round(percentage)
      if (isNaN(percentage)) {
      } else {
        setSliderValue(percentage)
        setRTokenAmount(newValue)
        setRTokenAmountCollateral(newValue)
        setCollateralAmount(newValue)
        setinputCollateralAmount(newValue)
        setCollateralAmountNative(newValue)
        dispatch(setInputBorrowModalCollateralAmount(newValue))
      }
      // dispatch((newValue));
    }
  }

  const handleBorrowChange = (newValue: any) => {
    if (newValue > 9_000_000_000) return
    ////console.log(inputCollateralAmountUSD, "amount");
    if (inputCollateralAmountUSD > 0) {
      var percentage =
        (newValue * 100) /
        ((4.98 * inputCollateralAmountUSD) /
          oraclePrices.find((curr: any) => curr.name === currentBorrowCoin)
            ?.price)
    } else {
      var percentage = (newValue * 100) / currentAvailableReserves
    }
    percentage = Math.max(0, percentage)
    ////console.log(percentage,"percent")
    if (percentage > 100) {
      setsliderValue2(100)
      setAmount(newValue)
      setLoanAmount(newValue)
      setinputBorrowAmount(newValue)
      dispatch(setInputBorrowModalCollateralAmount(newValue))
    } else {
      percentage = Math.round(percentage)
      if (isNaN(percentage)) {
      } else {
        setsliderValue2(percentage)
        setAmount(newValue)
        setLoanAmount(newValue)
        setinputBorrowAmount(newValue)
        dispatch(setInputBorrowModalCollateralAmount(newValue))
      }
      // dispatch((newValue));
    }
  }

  const moreOptions = ['Liquidations', 'Dummy1', 'Dummy2', 'Dummy3']
  const coins: NativeToken[] = ['BTC', 'USDT', 'USDC', 'ETH', 'DAI', 'STRK']
  const minLoanAmounts = useSelector(selectMinimumLoanAmounts)
  const maxLoanAmounts = useSelector(selectMaximumLoanAmounts)

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

  useEffect(() => {
    const fecthLoanAmount = async () => {
      const dynamicdata = await getMaximumDynamicLoanAmount(
        amount,
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
  const activeModal = Object.keys(modalDropdowns).find(
    (key) => modalDropdowns[key] === true
  )
  useEffect(() => {
    setCurrentPool('Select a pool')
    setCurrentPoolCoin('Select a pool')
  }, [currentDapp])
  const resetStates = () => {
    setCurrentCollateralCoin(coin?.name ? coin?.name : 'BTC')
    setRToken(coin?.name ? coin?.name : 'rBTC')
    setRTokenCollateral(coin ? coin?.name : 'rBTC')
    setCollateralMarket(coin?.name ? coin.name : 'BTC')
    setCollateralMarketNative(coin?.name ? coin.name : 'BTC')
    setCurrentBorrowCoin(coin?.name ? coin?.name : 'BTC')
    setMarket(coin?.name ? coin?.name : 'BTC')
    setLoanMarket(coin ? coin?.name : 'BTC')
    setAmount(0)
    setLoanAmount(0)
    setRTokenAmount(0)
    setRTokenAmountCollateral(0)
    setinputCollateralAmount(0)
    setSliderValue(0)
    setsliderValue2(0)
    setToastDisplayed(false)
    setTransactionStarted(false)
    setHealthFactor(undefined)
    setCollateralAmount(0)
    setCollateralAmountNative(0)
    dispatch(resetModalDropdowns())
    dispatch(setTransactionStatus(''))
    setCurrentTransactionStatus('')
    setTokenTypeSelected('Native')
    setBorrowTransHash('')
    setInputCollateralAmountUSD(0)
    setInputBorrowAmountUSD(0)
    setinputBorrowAmount(0)
    setwalletBalance(
      walletBalances[coin?.name]?.statusBalanceOf === 'success'
        ? parseAmount(
            String(
              uint256.uint256ToBN(
                walletBalances[coin?.name]?.dataBalanceOf?.balance
              )
            ),
            tokenDecimalsMap[coin?.name]
          )
        : 0
    )
    setactionSelected('Borrow')
    setCurrentDapp('Select a dapp')
    setCurrentPool('Select a pool')
    setCurrentPoolCoin('Select a pool')
    setRadioValue('1')
    // setDepositTransHash("")
  }
  useEffect(() => {
    setRTokenAmount(0)
    setRTokenAmountCollateral(0)
    setinputCollateralAmount(0)
    setSliderValue(0)
    setCollateralAmount(0)
    setCollateralAmountNative(0)
  }, [currentCollateralCoin])
  useEffect(() => {
    setAmount(0)
    setLoanAmount(0)
    setsliderValue2(0)
    setinputBorrowAmount(0)
  }, [currentBorrowCoin])
  ////console.log(currentCollateralCoin,"collateral coin")
  // useEffect(() => {
  //   setCollateralMarket("DAI");
  //   setCollateralAmount("4000");
  // }, []);
  const [tokenTypeSelected, setTokenTypeSelected] = useState('Native')
  ////console.log(amount < 5 * inputCollateralAmountUSD, typeof collateralAmount, collateralAmount, "amount")
  ////console.log(inputBorrowAmountUSD, inputCollateralAmountUSD, "coins");
  const rTokens: RToken[] = ['rBTC', 'rUSDT', 'rETH']
  return (
    <Box>
      <Button
        {...restProps}
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
        {buttonText !== 'Click here to borrow' ? (
          buttonText === 'Borrow from metrics' ? (
            <Button w="70px" h="32px" fontSize="14px" p="12px" mx="auto">
              Borrow
            </Button>
          ) : (
            buttonText
          )
        ) : (
          <Text fontSize="sm">Click here to borrow</Text>
        )}
      </Button>
      {/* <Button onClick={onOpen}>Open Modal</Button> */}

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
            dispatch(setToastTransactionStarted(''))
          }
        }}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay bg="rgba(244, 242, 255, 0.5);" mt="3.8rem" />
        <ModalContent mt="8rem" bg={'#02010F'} maxW="464px">
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
            {actionSelected === 'Borrow' ? 'Borrow' : 'Trade'}
            <Tooltip
              hasArrow
              placement="right"
              boxShadow="dark-lg"
              label="Select the collateral token and the token you want to borrow, and spend."
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
          {/* <ModalHeader>Borrow</ModalHeader> */}
          <ModalBody overflowY="auto" color={'#E6EDF3'}>
            {/* <ModalCloseButton mt="1rem" mr="1rem" color="white" /> */}
            {/* <button onClick={onClose}>Cancel</button> */}
            <Tabs variant="unstyled" mb="1rem">
              <TabList borderRadius="md">
                <Tab
                  py="1"
                  px="3"
                  color="#676D9A"
                  fontSize="sm"
                  border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                  borderLeftRadius="md"
                  fontWeight="normal"
                  _selected={{
                    color: 'white',
                    bg: '#4D59E8',
                    border: 'none',
                  }}
                  isDisabled={transactionStarted == true}
                  onClick={() => {
                    setactionSelected('Borrow')
                  }}
                >
                  Borrow
                </Tab>
                <Tab
                  py="1"
                  px="3"
                  color="#676D9A"
                  fontSize="sm"
                  border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                  borderRightRadius="md"
                  fontWeight="normal"
                  _selected={{
                    color: 'white',
                    bg: '#4D59E8',
                    border: 'none',
                  }}
                  onClick={() => {
                    setactionSelected('Trade')
                  }}
                >
                  Trade
                </Tab>
              </TabList>
            </Tabs>
            <Box
              display="flex"
              flexDirection="column"
              background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              p="1rem"
              mt="-1.5"
              borderRadius="md"
              gap="3"
            >
              <Box display="flex" flexDirection="column" gap="1">
                <Box display="flex">
                  <Text fontSize="xs" color="#676D9A">
                    Collateral Market
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="right"
                    boxShadow="dark-lg"
                    label="Token held as security for borrowed funds."
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
                    // mt="28px"
                  >
                    <Box p="1">
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Box>
                <Box
                  display="flex"
                  border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                  justifyContent="space-between"
                  py="2"
                  pl="3"
                  pr="3"
                  cursor="pointer"
                  borderRadius="md"
                  className="navbar"
                  onClick={() => {
                    if (transactionStarted) {
                      return
                    } else {
                      handleDropdownClick('borrowModalCollateralMarketDropdown')
                    }
                  }}
                  as="button"
                >
                  <Box display="flex" gap="1">
                    <Box p="1">{getCoin(currentCollateralCoin)}</Box>
                    <Text>
                      {currentCollateralCoin == 'BTC' ||
                      currentCollateralCoin == 'ETH'
                        ? 'w' + currentCollateralCoin
                        : currentCollateralCoin}
                    </Text>
                  </Box>
                  <Box pt="1" className="navbar-button">
                    {activeModal == 'borrowModalCollateralMarketDropdown' ? (
                      <ArrowUp />
                    ) : (
                      <DropdownUp />
                    )}
                  </Box>
                  {modalDropdowns.borrowModalCollateralMarketDropdown && (
                    <Box
                      w="full"
                      left="0"
                      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                      bg="#03060B"
                      py="2"
                      className="dropdown-container"
                      boxShadow="dark-lg"
                    >
                      {validRTokens &&
                        validRTokens.length > 0 &&
                        validRTokens.map(
                          (
                            { rToken: coin, rTokenAmount: amount }: any,
                            index: number
                          ) => {
                            return (
                              <Box
                                key={index}
                                as="button"
                                w="full"
                                display="flex"
                                alignItems="center"
                                gap="1"
                                pr="2"
                                onMouseEnter={()=>{
                                  setcollateralMarketIndex(index+6);
                                }}
                                onMouseLeave={()=>{
                                  setcollateralMarketIndex(-1);
                                }}
                                onClick={() => {
                                  setCurrentCollateralCoin(coin)
                                  setRToken(coin)
                                  setRTokenCollateral(coin)
                                  setTokenTypeSelected('rToken')
                                  setwalletBalance(amount)
                                  setcollateralMarketIndex(-1);
                                  // setCurrentBorrowAPR(
                                  //   coinIndex.find(
                                  //     (curr: any) =>
                                  //       curr?.token === coin.slice(1)
                                  //   )?.idx
                                  // );
                                  // dispatch(setCoinSelectedSupplyModal(coin))
                                }}
                              >
                                {(collateralMarketIndex===-1 ?coin === currentCollateralCoin:collateralMarketIndex===(index+6)) && (
                                  <Box
                                    w="3px"
                                    h="28px"
                                    bg="#4D59E8"
                                    borderRightRadius="md"
                                  ></Box>
                                )}
                                <Box
                                  w="full"
                                  display="flex"
                                  py="5px"
                                  pl={`${
                                    (coin === currentCollateralCoin && collateralMarketIndex===-1) || collateralMarketIndex===(index+6) ? '1' : '5'
                                  }`}
                                  pr="6px"
                                  gap="1"
                                  justifyContent="space-between"
                                  transition="ease .1s"
                                  bg={`${
                                    (coin === currentCollateralCoin && collateralMarketIndex===-1) || collateralMarketIndex===(index+6)
                                      ? '#4D59E8'
                                      : 'inherit'
                                  }`}
                                  borderRadius="md"
                                >
                                  <Box display="flex">
                                    <Box p="1">{getCoin(coin)}</Box>
                                    <Text color="white">{coin}</Text>
                                  </Box>
                                  <Box
                                    fontSize="9px"
                                    color="white"
                                    mt="6px"
                                    fontWeight="thin"
                                  >
                                    rToken Balance:{' '}
                                    {validRTokens && validRTokens.length > 0 ? (
                                      numberFormatter(amount)
                                    ) : (
                                      <Skeleton
                                        width="3rem"
                                        height="1rem"
                                        startColor="#1E212F"
                                        endColor="#03060B"
                                        borderRadius="6px"
                                        ml={2}
                                      />
                                    )}
                                  </Box>
                                </Box>
                              </Box>
                            )
                          }
                        )}
                      {validRTokens && validRTokens.length > 0 && (
                        <hr
                          style={{
                            height: '1px',
                            borderWidth: '0',
                            backgroundColor: '#2B2F35',
                            width: '96%',
                            marginTop: '7px',
                            // marginRight: "5px",
                            marginLeft: '5px',
                          }}
                        />
                      )}
                      {coins?.map((coin: NativeToken, index: number) => {
                        if (coin === 'DAI') {
                          return null // Skip rendering for "dai"
                        }
                        return (
                          <Box
                            key={index}
                            as="button"
                            w="full"
                            display="flex"
                            alignItems="center"
                            gap="1"
                            pr="2"
                            onMouseEnter={()=>{
                              setcollateralMarketIndex(index);
                            }}
                            onMouseLeave={()=>{
                              setcollateralMarketIndex(-1);
                            }}
                            onClick={() => {
                              setCurrentCollateralCoin(coin)
                              setCollateralMarket(coin)
                              setCollateralMarketNative(coin)
                              setTokenTypeSelected('Native')
                              setcollateralMarketIndex(-1);
                              // setCurrentBorrowAPR(
                              //   coinIndex.find(
                              //     (curr: any) => curr?.token === coin
                              //   )?.idx
                              // );
                              // setRToken(coin);
                              setwalletBalance(
                                walletBalances[coin]?.statusBalanceOf ===
                                  'success'
                                  ? parseAmount(
                                      String(
                                        uint256.uint256ToBN(
                                          walletBalances[coin]?.dataBalanceOf
                                            ?.balance
                                        )
                                      ),
                                      tokenDecimalsMap[coin]
                                    )
                                  : 0
                              )
                            }}
                          >
                            {(collateralMarketIndex===-1 ?coin === currentCollateralCoin:collateralMarketIndex===index) && (
                              <Box
                                w="3px"
                                h="28px"
                                bg="#4D59E8"
                                borderRightRadius="md"
                              ></Box>
                            )}
                            <Box
                              w="full"
                              display="flex"
                              py="5px"
                              pl={`${
                                (coin === currentCollateralCoin && collateralMarketIndex===-1) || collateralMarketIndex===index ? '1' : '5'
                              }`}
                              pr="6px"
                              gap="1"
                              transition="ease .1s"
                              bg={`${
                                (coin === currentCollateralCoin && collateralMarketIndex===-1) || collateralMarketIndex===index
                                  ? '#4D59E8'
                                  : 'inherit'
                              }`}
                              borderRadius="md"
                              justifyContent="space-between"
                            >
                              <Box display="flex">
                                <Box p="1">{getCoin(coin)}</Box>
                                <Text color="white">
                                  {coin == 'BTC' || coin == 'ETH'
                                    ? 'w' + coin
                                    : coin}
                                </Text>
                              </Box>
                              <Box
                                fontSize="9px"
                                color="white"
                                mt="6px"
                                fontWeight="thin"
                              >
                                Wallet Balance:{' '}
                                {walletBalances[coin]?.dataBalanceOf
                                  ?.balance ? (
                                  numberFormatter(
                                    parseAmount(
                                      String(
                                        uint256.uint256ToBN(
                                          walletBalances[coin]?.dataBalanceOf
                                            ?.balance
                                        )
                                      ),
                                      tokenDecimalsMap[coin]
                                    )
                                  )
                                ) : (
                                  <Skeleton
                                    width="3rem"
                                    height="1rem"
                                    startColor="#1E212F"
                                    endColor="#03060B"
                                    borderRadius="6px"
                                    ml={2}
                                  />
                                )}
                              </Box>
                            </Box>
                          </Box>
                        )
                      })}
                    </Box>
                  )}
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" gap="1">
                <Box display="flex">
                  <Text fontSize="xs" color="#676D9A">
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
                    maxW="222px"
                  >
                    <Box p="1">
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Box>
                <Box
                  width="100%"
                  color={`${
                    rTokenAmount > walletBalance
                      ? '#CF222E'
                      : rTokenAmount < 0
                        ? '#CF222E'
                        : process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                            rTokenAmount > 0 &&
                            (rTokenAmount < minimumDepositAmount ||
                              rTokenAmount > maximumDepositAmount)
                          ? '#CF222E'
                          : rTokenAmount == 0
                            ? 'white'
                            : '#00D395'
                  }`}
                  border={`${
                    rTokenAmount > walletBalance
                      ? '1px solid #CF222E'
                      : rTokenAmount < 0
                        ? '1px solid #CF222E'
                        : process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                            rTokenAmount > 0 &&
                            (rTokenAmount < minimumDepositAmount ||
                              rTokenAmount > maximumDepositAmount)
                          ? '1px solid #CF222E'
                          : // DO MAX CHECK 1209
                            rTokenAmount > 0 && rTokenAmount <= walletBalance
                            ? '1px solid #00D395'
                            : '1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
                  }`}
                  borderRadius="6px"
                  display="flex"
                  justifyContent="space-between"
                >
                  <NumberInput
                    border="0px"
                    min={0}
                    keepWithinRange={true}
                    onChange={handleChange}
                    value={rTokenAmount ? rTokenAmount : ''}
                    // outline="none"
                    // precision={1}
                    step={parseFloat(`${rTokenAmount <= 99999 ? 0.1 : 0}`)}
                    isDisabled={transactionStarted == true}
                    _disabled={{ cursor: 'pointer' }}
                  >
                    <NumberInputField
                      placeholder={
                        process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
                          ? `0.01536 ${currentCollateralCoin}`
                          : `min ${
                              minimumDepositAmount == null
                                ? 0
                                : minimumDepositAmount
                            } ${currentCollateralCoin}`
                      }
                      border="0px"
                      _disabled={{ color: '#00D395' }}
                      _placeholder={{
                        color: '#393D4F',
                        fontSize: '.89rem',
                        fontWeight: '600',
                        outline: '0',
                      }}
                      _focus={{
                        outline: '0',
                        boxShadow: 'none',
                      }}
                    />
                  </NumberInput>
                  <Button
                    variant="ghost"
                    color={`${
                      rTokenAmount > walletBalance
                        ? '#CF222E'
                        : rTokenAmount < 0
                          ? '#CF222E'
                          : process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                              rTokenAmount > 0 &&
                              (rTokenAmount < minimumDepositAmount ||
                                rTokenAmount > maximumDepositAmount)
                            ? '#CF222E'
                            : rTokenAmount == 0
                              ? '#4D59E8'
                              : '#00D395'
                    }`}
                    _hover={{
                      bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
                    }}
                    onClick={() => {
                      // setRTokenAmount(walletBalance);
                      // setAmount(walletBalance);
                      setCollateralAmount(walletBalance)
                      setinputCollateralAmount(walletBalance)
                      setCollateralAmountNative(walletBalance)
                      setRTokenAmount(walletBalance)
                      setRTokenAmountCollateral(walletBalance)
                      setSliderValue(100)
                      dispatch(
                        setInputBorrowModalCollateralAmount(walletBalance)
                      )
                    }}
                    isDisabled={transactionStarted == true}
                    _disabled={{ cursor: 'pointer' }}
                  >
                    MAX
                  </Button>
                </Box>
                {rTokenAmount > walletBalance ||
                rTokenAmount < 0 ||
                (rTokenAmount > 0 &&
                  process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                  (rTokenAmount < minimumDepositAmount ||
                    rTokenAmount > maximumDepositAmount)) ? (
                  <Text
                    display="flex"
                    justifyContent="space-between"
                    color="#E6EDF3"
                    mt="0.2rem"
                    fontSize="12px"
                    fontWeight="500"
                    fontStyle="normal"
                    fontFamily="Inter"
                  >
                    <Text color="#CF222E" display="flex">
                      <Text mt="0.2rem">
                        <SmallErrorIcon />{' '}
                      </Text>
                      <Text ml="0.3rem">
                        {rTokenAmount > walletBalance
                          ? 'Amount exceeds balance'
                          : process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                              rTokenAmount < minimumDepositAmount
                            ? `less than min amount`
                            : process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                                rTokenAmount > maximumDepositAmount
                              ? 'more than max amount'
                              : 'Invalid'}
                      </Text>
                    </Text>
                    <Text
                      color="#C7CBF6"
                      display="flex"
                      justifyContent="flex-end"
                    >
                      Wallet Balance:{' '}
                      {walletBalance.toFixed(5).replace(/\.?0+$/, '').length > 5
                        ? numberFormatter(walletBalance)
                        : numberFormatter(walletBalance)}
                      <Text color="#676D9A" ml="0.2rem">
                        {` ${currentCollateralCoin}`}
                      </Text>
                    </Text>
                  </Text>
                ) : (
                  <Text
                    color="#C7CBF6"
                    display="flex"
                    justifyContent="flex-end"
                    mt="0.2rem"
                    fontSize="12px"
                    fontWeight="500"
                    fontStyle="normal"
                    fontFamily="Inter"
                  >
                    {currentCollateralCoin && currentCollateralCoin[0] == 'r'
                      ? 'rToken Balance: ' + getBalance(currentCollateralCoin)
                      : 'Wallet Balance: ' +
                        (walletBalance.toFixed(5).replace(/\.?0+$/, '').length >
                        5
                          ? numberFormatter(walletBalance)
                          : numberFormatter(walletBalance))}
                    {/* Wallet Balance:{" "}
                    {walletBalance.toFixed(5).replace(/\.?0+$/, "").length > 5
                      ? Math.floor(walletBalance)
                      : walletBalance} */}
                    <Text color="#676D9A" ml="0.2rem">
                      {` ${currentCollateralCoin}`}
                    </Text>
                  </Text>
                )}
                <Box pt={5} pb={2} mt="0.8rem">
                  <Slider
                    aria-label="slider-ex-6"
                    defaultValue={sliderValue}
                    value={sliderValue}
                    onChange={(val) => {
                      setSliderValue(val)
                      if (val == 100) {
                        setCollateralAmount(walletBalance)
                        setinputCollateralAmount(walletBalance)
                        setCollateralAmountNative(walletBalance)
                        setRTokenAmount(walletBalance)
                        setRTokenAmountCollateral(walletBalance)
                      } else {
                        var ans = (val * walletBalance) / 100
                        if (ans < 10) {
                          dispatch(setInputBorrowModalCollateralAmount(ans))
                          // setRTokenAmount(ans);
                          // setAmount(ans);
                          setCollateralAmount(parseFloat(ans.toFixed(7)))
                          setinputCollateralAmount(parseFloat(ans.toFixed(7)))
                          setCollateralAmountNative(parseFloat(ans.toFixed(7)))
                          setRTokenAmount(parseFloat(ans.toFixed(7)))
                          setRTokenAmountCollateral(parseFloat(ans.toFixed(7)))
                        } else {
                          ans = Math.round(ans * 100) / 100
                          dispatch(setInputBorrowModalCollateralAmount(ans))
                          // setRTokenAmount(ans);
                          // setAmount(ans);
                          setCollateralAmount(ans)
                          setinputCollateralAmount(ans)
                          setCollateralAmountNative(ans)
                          setRTokenAmount(ans)
                          setRTokenAmountCollateral(ans)
                        }
                      }
                    }}
                    isDisabled={transactionStarted == true}
                    _disabled={{ cursor: 'pointer' }}
                    focusThumbOnChange={false}
                  >
                    <SliderMark
                      value={0}
                      mt="-1.5"
                      ml="-1.5"
                      fontSize="sm"
                      zIndex="1"
                    >
                      {sliderValue >= 0 ? (
                        <SliderPointerWhite />
                      ) : (
                        <SliderPointer />
                      )}
                    </SliderMark>
                    <SliderMark
                      value={25}
                      mt="-1.5"
                      ml="-1.5"
                      fontSize="sm"
                      zIndex="1"
                    >
                      {sliderValue >= 25 ? (
                        <SliderPointerWhite />
                      ) : (
                        <SliderPointer />
                      )}
                    </SliderMark>
                    <SliderMark
                      value={50}
                      mt="-1.5"
                      ml="-1.5"
                      fontSize="sm"
                      zIndex="1"
                    >
                      {sliderValue >= 50 ? (
                        <SliderPointerWhite />
                      ) : (
                        <SliderPointer />
                      )}
                    </SliderMark>
                    <SliderMark
                      value={75}
                      mt="-1.5"
                      ml="-1.5"
                      fontSize="sm"
                      zIndex="1"
                    >
                      {sliderValue >= 75 ? (
                        <SliderPointerWhite />
                      ) : (
                        <SliderPointer />
                      )}
                    </SliderMark>
                    <SliderMark
                      value={100}
                      mt="-1.5"
                      ml="-1.5"
                      fontSize="sm"
                      zIndex="1"
                    >
                      {sliderValue == 100 ? (
                        <SliderPointerWhite />
                      ) : (
                        <SliderPointer />
                      )}
                    </SliderMark>
                    <SliderMark
                      value={sliderValue}
                      textAlign="center"
                      // bg='blue.500'
                      color="white"
                      mt="-8"
                      ml={sliderValue !== 100 ? '-5' : '-6'}
                      w="12"
                      fontSize="12px"
                      fontWeight="400"
                      lineHeight="20px"
                      letterSpacing="0.25px"
                    >
                      {sliderValue}%
                    </SliderMark>
                    <SliderTrack bg="#3E415C">
                      <SliderFilledTrack
                        bg="white"
                        w={`${sliderValue}`}
                        _disabled={{ bg: 'white' }}
                      />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </Box>
                {/* {currentCollateralCoin != "rBTC" &&
                  currentCollateralCoin != "rUSDT" && (
                    <Box display="flex" gap="2">
                      <Checkbox
                        size="md"
                        colorScheme="customBlue"
                        defaultChecked
                        mb="auto"
                        mt="0.5rem"
                        borderColor="#2B2F35"
                        isDisabled={transactionStarted == true}
                        _disabled={{
                          cursor: "pointer",
                          iconColor: "blue.400",
                          bg: "blue",
                        }}
                      />
                      <Text
                        fontSize="12px"
                        fontWeight="400"
                        color="#6E7681"
                        mt="0.3rem"
                        lineHeight="20px"
                      >
                        Ticking would stake the received rTokens. unchecking
                        woudn&apos;t stake rTokens
                      </Text>
                    </Box>
                  )} */}
              </Box>
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              p="1rem"
              my="4"
              borderRadius="md"
              gap="3"
            >
              <Box display="flex" flexDirection="column" gap="1">
                <Box display="flex">
                  <Text fontSize="xs" color="#676D9A">
                    Borrow Market
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
                    // mt="12px"
                  >
                    <Box p="1">
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Box>
                <Box
                  display="flex"
                  border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                  justifyContent="space-between"
                  py="2"
                  pl="2"
                  pr="3"
                  borderRadius="md"
                  className="navbar"
                  cursor="pointer"
                  onClick={() => {
                    if (transactionStarted) {
                      return
                    } else {
                      handleDropdownClick('borrowModalBorrowMarketDropdown')
                    }
                  }}
                  as="button"
                >
                  <Box display="flex" gap="1">
                    <Box p="1">{getCoin(currentBorrowCoin)}</Box>
                    <Text>
                      {currentBorrowCoin == 'BTC' || currentBorrowCoin == 'ETH'
                        ? 'w' + currentBorrowCoin
                        : currentBorrowCoin}
                    </Text>
                  </Box>
                  <Box pt="1" className="navbar-button">
                    {activeModal == 'borrowModalBorrowMarketDropdown' ? (
                      <ArrowUp />
                    ) : (
                      <DropdownUp />
                    )}
                  </Box>
                  {modalDropdowns.borrowModalBorrowMarketDropdown && (
                    <Box
                      w="full"
                      left="0"
                      bg="#03060B"
                      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                      py="2"
                      className="dropdown-container"
                      boxShadow="dark-lg"
                    >
                      {coins?.map((coin: string, index: number) => {
                        if (coin === 'DAI') {
                          return null // Skip rendering for "dai"
                        }
                        return (
                          <Box
                            key={index}
                            as="button"
                            w="full"
                            display="flex"
                            alignItems="center"
                            gap="1"
                            pr="2"
                            onMouseEnter={()=>{
                              setborrowMarketIndex(index)
                            }}
                            onMouseLeave={()=>{
                              setborrowMarketIndex(-1)
                            }}
                            onClick={() => {
                              setCurrentBorrowCoin(coin)
                              setCurrentAvailableReserves(
                                protocolStats?.[index]?.availableReserves *
                                  0.895
                              )
                              setborrowMarketIndex(-1)
                              // setMarket(coin);
                              setMarket(coin)
                              setLoanMarket(coin as NativeToken)
                              setCurrentBorrowAPR(
                                coinIndex.find(
                                  (curr: any) => curr?.token === coin
                                )?.idx
                              )
                            }}
                          >
                            {(borrowMarketIndex===-1 ? coin === currentBorrowCoin:borrowMarketIndex===index) && (
                              <Box
                                w="3px"
                                h="28px"
                                bg="#4D59E8"
                                borderRightRadius="md"
                              ></Box>
                            )}
                            <Box
                              w="full"
                              display="flex"
                              py="5px"
                              pl={`${(coin === currentBorrowCoin && borrowMarketIndex===-1) || borrowMarketIndex===index ? '1' : '5'}`}
                              pr="6px"
                              gap="1"
                              bg={`${
                                (coin === currentBorrowCoin && borrowMarketIndex===-1) || borrowMarketIndex===index
                                  ? '#4D59E8'
                                  : 'inherit'
                              }`}
                              transition="ease .1s"
                              borderRadius="md"
                              justifyContent="space-between"
                            >
                              <Box display="flex">
                                <Box p="1">{getCoin(coin)}</Box>
                                <Text color="white">
                                  {coin == 'BTC' || coin == 'ETH'
                                    ? 'w' + coin
                                    : coin}
                                </Text>
                              </Box>
                              <Box
                                fontSize="9px"
                                color="white"
                                mt="6px"
                                fontWeight="thin"
                                display="flex"
                              >
                                Available reserves:{' '}
                                {(protocolStats?.[index]?.availableReserves &&
                                  numberFormatter(
                                    protocolStats?.[index]?.availableReserves *
                                      0.895
                                  )) || (
                                  <Skeleton
                                    width="3rem"
                                    height="1rem"
                                    startColor="#1E212F"
                                    endColor="#03060B"
                                    borderRadius="6px"
                                    ml={2}
                                  />
                                )}
                              </Box>
                            </Box>
                          </Box>
                        )
                      })}
                    </Box>
                  )}
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" gap="1">
                <Box display="flex">
                  <Text fontSize="xs" color="#676D9A">
                    Borrow Amount
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
                    maxW="222px"
                  >
                    <Box p="1">
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Box>
                <Box
                  width="100%"
                  color="white"
                  border={`${
                    inputCollateralAmountUSD &&
                    inputBorrowAmountUSD > 4.98 * inputCollateralAmountUSD
                      ? '1px solid #CF222E'
                      : inputBorrowAmountUSD < 0 ||
                          inputBorrowAmount > currentAvailableReserves
                        ? '1px solid #CF222E'
                        : process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                            inputBorrowAmount > 0 &&
                            inputBorrowAmount < minimumLoanAmount
                          ? '1px solid #CF222E'
                          : process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                              inputBorrowAmount > maximumLoanAmount
                            ? '1px solid #CF222E'
                            : isNaN(amount)
                              ? '1px solid #CF222E'
                              : amount > 0
                                ? '1px solid #00D395'
                                : '1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30)) '
                  }`}
                  borderRadius="6px"
                  display="flex"
                  justifyContent="space-between"
                >
                  <NumberInput
                    border="0px"
                    min={0}
                    keepWithinRange={true}
                    onChange={handleBorrowChange}
                    value={amount ? amount : ''}
                    step={parseFloat(`${amount <= 99999 ? 0.1 : 0}`)}
                    isDisabled={
                      transactionStarted == true || protocolStats.length === 0
                    }
                    _disabled={{ cursor: 'pointer' }}
                  >
                    <NumberInputField
                      placeholder={
                        process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
                          ? `0.01536 ${currentBorrowCoin}`
                          : `min ${
                              minimumLoanAmount == null ? 0 : minimumLoanAmount
                            } ${currentBorrowCoin}`
                      }
                      color={`${
                        inputCollateralAmountUSD &&
                        inputBorrowAmountUSD > 4.98 * inputCollateralAmountUSD
                          ? '#CF222E'
                          : isNaN(amount)
                            ? '#CF222E'
                            : process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                                inputBorrowAmount > 0 &&
                                inputBorrowAmount < minimumLoanAmount
                              ? '#CF222E'
                              : process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                                  inputBorrowAmount > maximumLoanAmount
                                ? '#CF222E'
                                : inputBorrowAmount < 0 ||
                                    inputBorrowAmount > currentAvailableReserves
                                  ? '#CF222E'
                                  : amount > 0
                                    ? '#00D395'
                                    : inputBorrowAmountUSD == 0
                                      ? 'white'
                                      : '#00D395'
                      }`}
                      border="0px"
                      _placeholder={{
                        color: '#393D4F',
                        fontSize: '.89rem',
                        fontWeight: '600',
                        outline: '0',
                      }}
                      _disabled={{ color: '#00D395' }}
                      _focus={{
                        outline: '0',
                        boxShadow: 'none',
                      }}
                    />
                  </NumberInput>
                  <Button
                    variant="ghost"
                    color={`${
                      inputCollateralAmountUSD &&
                      inputBorrowAmountUSD > 4.98 * inputCollateralAmountUSD
                        ? '#CF222E'
                        : isNaN(amount)
                          ? '#CF222E'
                          : process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                              inputBorrowAmount > 0 &&
                              inputBorrowAmount < minimumLoanAmount
                            ? '#CF222E'
                            : process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                                inputBorrowAmount > maximumLoanAmount
                              ? '#CF222E'
                              : inputBorrowAmount < 0 ||
                                  inputBorrowAmount > currentAvailableReserves
                                ? '#CF222E'
                                : inputBorrowAmountUSD == 0
                                  ? '#4D59E8'
                                  : '#00D395'
                    }`}
                    _hover={{
                      bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
                    }}
                    onClick={() => {
                      if (inputCollateralAmountUSD > 0) {
                        if (
                          (4.98 * inputCollateralAmountUSD) /
                            oraclePrices.find(
                              (curr: any) => curr.name === currentBorrowCoin
                            )?.price >
                          currentAvailableReserves
                        ) {
                          setAmount(currentAvailableReserves)
                          setLoanAmount(currentAvailableReserves)
                          setsliderValue2(100)
                          setinputBorrowAmount(currentAvailableReserves)
                        } else {
                          setAmount(
                            (4.98 * inputCollateralAmountUSD) /
                              oraclePrices.find(
                                (curr: any) => curr.name === currentBorrowCoin
                              )?.price
                          )
                          setLoanAmount((4.98 * inputCollateralAmountUSD) /
                          oraclePrices.find(
                            (curr: any) => curr.name === currentBorrowCoin
                          )?.price)
                          setinputBorrowAmount(
                            (4.98 * inputCollateralAmountUSD) /
                              oraclePrices.find(
                                (curr: any) => curr.name === currentBorrowCoin
                              )?.price
                          )
                          setsliderValue2(100)
                        }
                      } else {
                        setAmount(currentAvailableReserves)
                        setLoanAmount(currentAvailableReserves)
                        setinputBorrowAmount(currentAvailableReserves)
                        setsliderValue2(100)
                      }
                      // 1BTC == 30,000USD
                      // 10USD == 5*10*1/30,000
                      // dispatch(
                      //   setInputBorrowModalBorrowAmount(
                      //     5*inputCollateralAmountUSD
                      //   )
                      // );
                    }}
                    isDisabled={
                      transactionStarted == true || protocolStats.length === 0
                    }
                    _disabled={{ cursor: 'pointer' }}
                  >
                    MAX
                  </Button>
                </Box>
                {amount > currentAvailableReserves ||
                (process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                  inputBorrowAmount > 0 &&
                  (inputBorrowAmount < minimumLoanAmount ||
                    inputBorrowAmount > maximumLoanAmount)) ||
                (amount > 0 &&
                  inputCollateralAmountUSD &&
                  inputBorrowAmountUSD > 4.98 * inputCollateralAmountUSD) ? (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    color="#E6EDF3"
                    mt="0.2rem"
                    fontSize="12px"
                    fontWeight="500"
                    fontStyle="normal"
                    fontFamily="Inter"
                  >
                    <Text color="#CF222E" display="flex">
                      <Text mt="0.2rem">
                        <SmallErrorIcon />{' '}
                      </Text>
                      <Text ml="0.3rem">
                        {amount > currentAvailableReserves
                          ? 'Amount exceeds balance'
                          : process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                              inputBorrowAmount < minimumLoanAmount
                            ? 'Less than min Amount'
                            : process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                                inputBorrowAmount > maximumLoanAmount
                              ? 'More than max Amount'
                              : inputBorrowAmountUSD >
                                  4.98 * inputCollateralAmountUSD
                                ? 'Debt higher than permitted'
                                : ''}
                      </Text>
                    </Text>
                    <Box
                      color="#C7CBF6"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      Available reserves:{' '}
                      {availableReserves == null ? (
                        <Skeleton
                          width="4rem"
                          height=".85rem"
                          startColor="#2B2F35"
                          endColor="#101216"
                          borderRadius="4px"
                          m={1}
                        />
                      ) : (
                        numberFormatter(currentAvailableReserves)
                      )}
                      <Text color="#676D9A" ml="0.2rem">
                        {` ${currentBorrowCoin}`}
                      </Text>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    color="#C7CBF6"
                    display="flex"
                    justifyContent="flex-end"
                    mt="0.2rem"
                    fontSize="12px"
                    fontWeight="500"
                    fontStyle="normal"
                    fontFamily="Inter"
                  >
                    Available reserves:{' '}
                    {availableReserves == null ? (
                      <Skeleton
                        width="4rem"
                        height=".85rem"
                        startColor="#2B2F35"
                        endColor="#101216"
                        borderRadius="4px"
                        m={1}
                      />
                    ) : (
                      numberFormatter(currentAvailableReserves)
                    )}
                    <Text color="#676D9A" ml="0.2rem">
                      {` ${currentBorrowCoin}`}
                    </Text>
                  </Box>
                )}
                <Box pt={5} pb={2} mt="0.9rem">
                  <Slider
                    aria-label="slider-ex-6"
                    defaultValue={sliderValue2}
                    value={sliderValue2}
                    onChange={(val) => {
                      setsliderValue2(val)
                      if (inputCollateralAmountUSD > 0) {
                        var ans =
                          (val / 100) *
                          ((4.98 * inputCollateralAmountUSD) /
                            oraclePrices.find(
                              (curr: any) => curr.name === currentBorrowCoin
                            )?.price)
                      } else {
                        var ans = (val / 100) * currentAvailableReserves
                      }
                      if (val == 100) {
                        if (inputCollateralAmountUSD > 0) {
                          setAmount(
                            (4.98 * inputCollateralAmountUSD) /
                              oraclePrices.find(
                                (curr: any) => curr.name === currentBorrowCoin
                              )?.price
                          )
                          setLoanAmount((4.98 * inputCollateralAmountUSD) /
                          oraclePrices.find(
                            (curr: any) => curr.name === currentBorrowCoin
                          )?.price)
                          setinputBorrowAmount(
                            (4.98 * inputCollateralAmountUSD) /
                              oraclePrices.find(
                                (curr: any) => curr.name === currentBorrowCoin
                              )?.price
                          )
                        } else {
                          setAmount(currentAvailableReserves)
                          setLoanAmount(currentAvailableReserves)
                          setinputBorrowAmount(currentAvailableReserves)
                        }
                      } else {
                        if (ans < 10) {
                          dispatch(setInputBorrowModalBorrowAmount(ans))
                          setAmount(parseFloat(ans.toFixed(7)))
                          setLoanAmount(parseFloat(ans.toFixed(7)))
                          setinputBorrowAmount(parseFloat(ans.toFixed(7)))
                        } else {
                          ans = Math.round(ans * 100) / 100
                          dispatch(setInputBorrowModalBorrowAmount(ans))
                          setAmount(ans)
                          setLoanAmount(ans)
                          setinputBorrowAmount(ans)
                        }
                      }
                    }}
                    isDisabled={
                      transactionStarted == true || protocolStats.length === 0
                    }
                    _disabled={{ cursor: 'pointer' }}
                    focusThumbOnChange={false}
                  >
                    <SliderMark
                      value={0}
                      mt="-1.5"
                      ml="-1.5"
                      fontSize="sm"
                      zIndex="1"
                    >
                      {sliderValue2 >= 0 ? (
                        <SliderPointerWhite />
                      ) : (
                        <SliderPointer />
                      )}
                    </SliderMark>
                    <SliderMark
                      value={25}
                      mt="-1.5"
                      ml="-1.5"
                      fontSize="sm"
                      zIndex="1"
                    >
                      {sliderValue2 >= 25 ? (
                        <SliderPointerWhite />
                      ) : (
                        <SliderPointer />
                      )}
                    </SliderMark>
                    <SliderMark
                      value={50}
                      mt="-1.5"
                      ml="-1.5"
                      fontSize="sm"
                      zIndex="1"
                    >
                      {sliderValue2 >= 50 ? (
                        <SliderPointerWhite />
                      ) : (
                        <SliderPointer />
                      )}
                    </SliderMark>
                    <SliderMark
                      value={75}
                      mt="-1.5"
                      ml="-1.5"
                      fontSize="sm"
                      zIndex="1"
                    >
                      {sliderValue2 >= 75 ? (
                        <SliderPointerWhite />
                      ) : (
                        <SliderPointer />
                      )}
                    </SliderMark>
                    <SliderMark
                      value={100}
                      mt="-1.5"
                      ml="-1.5"
                      fontSize="sm"
                      zIndex="1"
                    >
                      {sliderValue2 == 100 ? (
                        <SliderPointerWhite />
                      ) : (
                        <SliderPointer />
                      )}
                    </SliderMark>
                    <SliderMark
                      value={sliderValue2}
                      textAlign="center"
                      // bg='blue.500'
                      color="white"
                      mt="-8"
                      ml={sliderValue2 !== 100 ? '-5' : '-6'}
                      w="12"
                      fontSize="12px"
                      fontWeight="400"
                      lineHeight="20px"
                      letterSpacing="0.25px"
                    >
                      {sliderValue2}%
                    </SliderMark>
                    <SliderTrack bg="#3E415C">
                      <SliderFilledTrack
                        bg="white"
                        w={`${sliderValue2}`}
                        _disabled={{ bg: 'white' }}
                      />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </Box>
              </Box>
            </Box>
            {actionSelected==='Trade' &&<Box >
                <Box display="flex" flexDir="column" p="3" gap="1">
                  <Box>
                    <RadioGroup onChange={setRadioValue} value={radioValue}>
                      <Stack spacing={4} direction="row">
                        <Radio
                          // variant="primary"
                          value="1"
                          // border

                          borderColor="#2B2F35"
                          colorScheme="customPurple"
                          // bg="black"
                          _checked={{
                            bg: 'black',
                            color: 'white',
                            borderWidth: '5px',
                            borderColor: '#4D59E8',
                          }}
                          bg="#676D9A1A"
                          _focus={{ boxShadow: 'none', outline: '0' }}
                          // onClick={() => {
                          //   setMethod("ADD_LIQUIDITY");
                          // }}
                        >
                          Liquidity provisioning
                        </Radio>
                        <Radio
                          fontSize="sm"
                          value="2"
                          // bg="#2B2F35"
                          borderColor="#2B2F35"
                          colorScheme="customPurple"
                          // bg="black"
                          _checked={{
                            bg: 'black',
                            color: 'white',
                            borderWidth: '5px',
                            borderColor: '#4D59E8',
                          }}
                          bg="#676D9A1A"
                          _focus={{ boxShadow: 'none', outline: '0' }}
                          // onClick={() => {
                          //   setMethod("SWAP");
                          // }}
                        >
                          {process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
                            ? 'Trade'
                            : 'Swap'}
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                  background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                  p="3"
                  // my="4"
                  borderRadius="md"
                  gap="3"
                >
                  <Box display="flex" flexDirection="column" gap="1">
                    <Box display="flex">
                      <Text fontSize="xs" color="#676D9A">
                        Select Dapp
                      </Text>
                      <Tooltip
                        hasArrow
                        placement="right"
                        boxShadow="dark-lg"
                        label="Choosing a Dapp to utilize the borrow tokens on the protocol."
                        bg="#02010F"
                        fontSize={'13px'}
                        fontWeight={'400'}
                        borderRadius={'lg'}
                        padding={'2'}
                        color="#F0F0F5"
                        border="1px solid"
                        borderColor="#23233D"
                        arrowShadowColor="#2B2F35"
                        maxW="242px"
                        // mt="5px"
                      >
                        <Box p="1">
                          <InfoIcon />
                        </Box>
                      </Tooltip>
                    </Box>
                    <Box
                      display="flex"
                      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                      justifyContent="space-between"
                      py="2"
                      pl="3"
                      pr="3"
                      borderRadius="md"
                      className="navbar"
                      onClick={() => {
                        if (transactionStarted) {
                          return
                        } else {
                          handleDropdownClick('yourBorrowDappDropdown')
                        }
                      }}
                      as="button"
                    >
                      <Box display="flex" gap="1">
                        {currentDapp != 'Select a dapp' ? (
                          <Box p="1">{getCoin(currentDapp)}</Box>
                        ) : (
                          ''
                        )}
                        <Text>{currentDapp}</Text>
                        {/* {currentDapp == "Jediswap" && radioValue == "1" && (
                          <Image
                            src={"/strkReward.svg"}
                            alt={`Strk reward`}
                            width="74"
                            height="15"
                            style={{ marginTop: "0.2rem" }}
                          />
                        )} */}
                      </Box>
                      <Box pt="1" className="navbar-button">
                        {activeModal == 'yourBorrowDappDropdown' ? (
                          <ArrowUp />
                        ) : (
                          <DropdownUp />
                        )}
                      </Box>
                      {modalDropdowns.yourBorrowDappDropdown && (
                        <Box
                          w="full"
                          left="0"
                          bg="#03060B"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          py="2"
                          className="dropdown-container"
                          boxShadow="dark-lg"
                        >
                          {dapps.map((dapp, index) => {
                            return (
                              <Button
                                // as="button"
                                key={index}
                                w="full"
                                m="0"
                                pl="0"
                                display="flex"
                                alignItems="center"
                                gap="1"
                                pr="2"
                                bg="inherit"
                                onMouseEnter={()=>{
                                  setdappHoverIndex(index)
                                }}
                                onMouseDown={()=>{
                                  setdappHoverIndex(-1);
                                }}
                                onClick={() => {
                                  setCurrentDapp(dapp.name)
                                  if (dapp.name === 'Jediswap') {
                                    setL3App('JEDI_SWAP')
                                  } else if (dapp.name === 'mySwap') {
                                    setL3App('MY_SWAP')
                                  }
                                }}
                                fontSize="sm"
                                _hover={{ background: 'inherit' }}
                                _disabled={{ cursor: 'pointer' }}
                                isDisabled={dapp.status === 'disable'}
                              >
                                {(dappHoverIndex===-1 ? dapp.name === currentDapp:dappHoverIndex===index) && (
                                  <Box
                                    w="3px"
                                    h="28px"
                                    bg="#4D59E8"
                                    borderRightRadius="md"
                                  ></Box>
                                )}
                                <Box
                                  w="full"
                                  display="flex"
                                  py="5px"
                                  px={`${
                                    (dapp.name === currentDapp && dappHoverIndex===-1) || dappHoverIndex===index ? '1' : '5'
                                  }`}
                                  gap="1"
                                  bg={`${
                                    (dapp.name === currentDapp && dappHoverIndex===-1) || dappHoverIndex===index
                                      ? '#4D59E8'
                                      : 'inherit'
                                  }`}
                                  borderRadius="md"
                                >
                                  <Box p="1">{getCoin(dapp.name)}</Box>
                                  <Text pt="1" color="white">
                                    {dapp.name}
                                  </Text>
                                  {/* <Box>
                                    {dapp.name == "Jediswap" && (
                                      <Image
                                        src={"/strkReward.svg"}
                                        alt={`Strk reward`}
                                        width="74"
                                        height="15"
                                        style={{ marginTop: "0.3rem" }}
                                      />
                                    )}
                                  </Box> */}
                                </Box>
                                {dapp.status === 'disable' && (
                                  <Text
                                    pt="1"
                                    pr="3"
                                    fontSize=".6rem"
                                    fontWeight="thin"
                                  >
                                    paused
                                  </Text>
                                )}
                              </Button>
                            )
                          })}
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="column" gap="1">
                    <Box display="flex">
                      <Text fontSize="xs" color="#676D9A">
                        Select Pool
                      </Text>
                      <Tooltip
                        hasArrow
                        placement="right"
                        boxShadow="dark-lg"
                        label="Choose a specific liquidity pool within the protocol."
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
                        <Box p="1">
                          <InfoIcon />
                        </Box>
                      </Tooltip>
                    </Box>
                    <Box
                      display="flex"
                      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                      justifyContent="space-between"
                      py="2"
                      pl="3"
                      pr="3"
                      borderRadius="md"
                      className="navbar"
                      onClick={() => {
                        if (transactionStarted) {
                          return
                        } else {
                          handleDropdownClick('yourBorrowPoolDropdown')
                        }
                      }}
                      as="button"
                    >
                      <Box display="flex" gap="1">
                        {getCoin(
                          radioValue === '1' ? currentPool : currentPoolCoin
                        ) ? (
                          <Box p="1">
                            {getCoin(
                              radioValue === '1' ? currentPool : currentPoolCoin
                            )}
                          </Box>
                        ) : (
                          ''
                        )}

                        <Text>
                          {radioValue === '1'
                            ? (currentPool.split('/')[0] == 'BTC' ||
                                currentPool.split('/')[0] == 'ETH') &&
                              (currentPool.split('/')[1] == 'BTC' ||
                                currentPool.split('/')[1] == 'ETH')
                              ? 'w' +
                                currentPool.split('/')[0] +
                                '/w' +
                                currentPool.split('/')[1]
                              : currentPool.split('/')[0] == 'BTC' ||
                                  currentPool.split('/')[0] == 'ETH'
                                ? 'w' +
                                  currentPool.split('/')[0] +
                                  '/' +
                                  currentPool.split('/')[1]
                                : currentPool.split('/')[1] == 'BTC' ||
                                    currentPool.split('/')[1] == 'ETH'
                                  ? currentPool.split('/')[0] +
                                    '/w' +
                                    currentPool.split('/')[1]
                                  : currentPool
                            : currentPoolCoin == 'BTC' ||
                                currentPoolCoin == 'ETH'
                              ? 'w' + currentPoolCoin
                              : currentPoolCoin}
                        </Text>
                      </Box>
                      <Box pt="1" className="navbar-button">
                        {activeModal == 'yourBorrowPoolDropdown' ? (
                          <ArrowUp />
                        ) : (
                          <DropdownUp />
                        )}
                      </Box>
                      {modalDropdowns.yourBorrowPoolDropdown &&
                      radioValue === '1' ? (
                        <Box
                          w="full"
                          left="0"
                          bg="#03060B"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          py="2"
                          className="dropdown-container"
                          boxShadow="dark-lg"
                          height="198px"
                          overflow="scroll"
                        >
                          {pools.map((pool, index) => {
                            const matchingPair =
                              currentDapp == 'Jediswap'
                                ? poolsPairs.find(
                                    (pair: any) => pair.keyvalue === pool
                                  )
                                : mySwapPoolPairs.find(
                                    (pair: any) => pair.keyvalue === pool
                                  )

                            if (
                              !matchingPair &&
                              currentDapp != 'Select a dapp'
                            ) {
                              return null // Skip rendering for pools with keyvalue "null"
                            }
                            return (
                              <Box
                                key={index}
                                as="button"
                                w="full"
                                display="flex"
                                alignItems="center"
                                gap="1"
                                pr="2"
                                onMouseEnter={()=>{
                                  setpoolHoverIndex(index);
                                }}
                                onMouseLeave={()=>{
                                  setpoolHoverIndex(-1);
                                }}
                                onClick={() => {
                                  setCurrentPool(pool)
                                  setpoolHoverIndex(-1);
                                  //set type for pools as native token[]
                                  //@ts-ignore
                                  setToMarketLiqA(pool.split('/')[0])
                                  //@ts-ignore
                                  setToMarketLiqB(pool.split('/')[1])
                                }}
                                borderBottom={
                                  index == 2 && currentDapp == 'Jediswap'
                                    ? '1px solid #30363D'
                                    : ''
                                }
                              >
                                {(poolHoverIndex===-1? pool === currentPool:poolHoverIndex===index) && (
                                  <Box
                                    w="3px"
                                    h="28px"
                                    bg="#4D59E8"
                                    borderRightRadius="md"
                                  ></Box>
                                )}
                                <Box
                                  w="full"
                                  display="flex"
                                  justifyContent="space-between"
                                  py="5px"
                                  pr="2"
                                  pl={`${(pool === currentPool && poolHoverIndex===-1) || poolHoverIndex===index ? '1' : '4'}`}
                                  gap="1"
                                  bg={`${
                                    (pool === currentPool && poolHoverIndex===-1) || poolHoverIndex===index ? '#4D59E8' : 'inherit'
                                  }`}
                                  transition="ease .1s"
                                  borderRadius="md"
                                >
                                  <Box
                                    display="flex"
                                    mt={
                                      index <= 2 && currentDapp == 'Jediswap'
                                        ? '0.2rem'
                                        : ''
                                    }
                                  >
                                    <Box p="1">{getCoin(pool)}</Box>
                                    <Tooltip
                                      hasArrow
                                      placement="right"
                                      boxShadow="dark-lg"
                                      label={
                                        index <= 2 && currentDapp == 'Jediswap'
                                          ? 'Earn $STRK Rewards.'
                                          : ''
                                      }
                                      bg="#02010F"
                                      fontSize={'13px'}
                                      fontWeight={'400'}
                                      borderRadius={'lg'}
                                      padding={'2'}
                                      color="#F0F0F5"
                                      border="1px solid"
                                      borderColor="#23233D"
                                      arrowShadowColor="#2B2F35"
                                      maxW="232px"
                                      // mt="50px"
                                    >
                                      <Text>
                                        {(pool.split('/')[0] == 'BTC' ||
                                          pool.split('/')[0] == 'ETH') &&
                                        (pool.split('/')[1] == 'BTC' ||
                                          pool.split('/')[1] == 'ETH')
                                          ? 'w' +
                                            pool.split('/')[0] +
                                            '/w' +
                                            pool.split('/')[1]
                                          : pool.split('/')[0] == 'BTC' ||
                                              pool.split('/')[0] == 'ETH'
                                            ? 'w' +
                                              pool.split('/')[0] +
                                              '/' +
                                              pool.split('/')[1]
                                            : pool.split('/')[1] == 'BTC' ||
                                                pool.split('/')[1] == 'ETH'
                                              ? pool.split('/')[0] +
                                                '/w' +
                                                pool.split('/')[1]
                                              : pool}
                                      </Text>
                                    </Tooltip>
                                    {/* <Text mt="-0.1rem">
                                      {(index <= 2 && currentDapp == "Jediswap") ? "✨" : ""}
                                    </Text> */}
                                  </Box>
                                  <Box
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="flex-end"
                                  >
                                    <Box
                                      fontSize="10px"
                                      color="#B1B0B5"
                                      mt="5px"
                                      fontWeight="medium"
                                    >
                                      Pool APR:{' '}
                                      {numberFormatterPercentage(
                                        getAprByPool(
                                          poolAprs,
                                          pool,
                                          currentDapp
                                        )
                                      )}
                                      %
                                    </Box>
                                    {index <= 2 &&
                                      currentDapp == 'Jediswap' && (
                                        <Box
                                          fontSize="10px"
                                          color="#B1B0B5"
                                          mt="5px"
                                          fontWeight="medium"
                                        >
                                          Jedi STRK APR:{' '}
                                          {numberFormatterPercentage(
                                            String(
                                              (100 *
                                                365 *
                                                (getStrkAlloaction(pool) *
                                                  oraclePrices?.find(
                                                    (curr: any) =>
                                                      curr.name === 'STRK'
                                                  )?.price)) /
                                                getTvlByPool(
                                                  poolAprs,
                                                  pool,
                                                  currentDapp
                                                )
                                            )
                                          )}
                                          %
                                        </Box>
                                      )}
                                  </Box>
                                </Box>
                              </Box>
                            )
                          })}
                        </Box>
                      ) : modalDropdowns.yourBorrowPoolDropdown &&
                        radioValue === '2' ? (
                        <Box
                          w="full"
                          left="0"
                          bg="#03060B"
                          py="2"
                          className="dropdown-container"
                          boxShadow="dark-lg"
                        >
                          {coins?.map((coin: NativeToken, index: number) => {
                            if (coin === 'DAI') {
                              return null
                            }
                            const matchingPair = myswapPools?.find(
                              (pair: any) => pair === coin
                            )
                            const matchingPairJedi = jediswapPools?.find(
                              (pair: any) => pair === coin
                            )
                            if (
                              coin == currentBorrowCoin ||
                              (process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                                currentDapp == 'mySwap' &&
                                !matchingPair)
                            ) {
                              return null
                            }
                            if (
                              coin == currentBorrowCoin ||
                              (process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                                currentDapp == 'Jediswap' &&
                                !matchingPairJedi)
                            ) {
                              return null
                            }
                            return (
                              <Box
                                key={index}
                                as="button"
                                w="full"
                                display="flex"
                                alignItems="center"
                                gap="1"
                                pr="2"
                                onMouseEnter={()=>{
                                  setpoolHoverIndex(index)
                                }}
                                onMouseLeave={()=>{
                                  setpoolHoverIndex(-1);
                                }}

                                onClick={() => {
                                  setCurrentPoolCoin(coin)
                                  setToMarketSwap(coin)
                                  setpoolHoverIndex(-1);
                                }}
                              >
                                {(poolHoverIndex===-1? coin === currentPoolCoin:poolHoverIndex===index) && (
                                  <Box
                                    w="3px"
                                    h="28px"
                                    bg="#4D59E8"
                                    borderRightRadius="md"
                                  ></Box>
                                )}
                                <Box
                                  w="full"
                                  display="flex"
                                  py="5px"
                                  px={`${(coin === currentPoolCoin && poolHoverIndex===-1) || poolHoverIndex===index ? '1' : '5'}`}
                                  gap="1"
                                  bg={`${
                                    (coin === currentPoolCoin && poolHoverIndex===-1) || poolHoverIndex===index
                                      ? '#4D59E8'
                                      : 'inherit'
                                  }`}
                                  transition="ease .1s"
                                  borderRadius="md"
                                >
                                  <Box p="1">{getCoin(coin)}</Box>
                                  <Text>
                                    {coin == 'BTC' || coin == 'ETH'
                                      ? 'w' + coin
                                      : coin}
                                  </Text>
                                </Box>
                              </Box>
                            )
                          })}
                        </Box>
                      ) : (
                        <Box display="none"></Box>
                      )}
                    </Box>
                  </Box>
                </Box>
                <Box
                  p="4"
                  borderRadius="6px"
                  border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                  background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                  my="4"
                >
                  {radioValue == '1' &&
                    currentPool !== 'Select a pool' &&
                    collateralAmount > 0 &&
                    inputBorrowAmount > 0 && (
                      <Box display="flex" justifyContent="space-between" mb="1">
                        <Box display="flex">
                          <Text color="#676D9A" fontSize="xs">
                            est LP tokens recieved:{' '}
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right"
                            boxShadow="dark-lg"
                            label="Estimated Liquidity Provider Tokens Received: Estimate of LP tokens received by providing liquidity to a pool."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
                            color="#F0F0F5"
                            border="1px solid"
                            borderColor="#23233D"
                            arrowShadowColor="#2B2F35"
                            maxW="232px"
                            // mt="50px"
                          >
                            <Box p="1">
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Box>
                        <Text
                          color="#676D9A"
                          fontSize="12px"
                          fontWeight="400"
                          fontStyle="normal"
                        >
                          {currentLPTokenAmount == undefined ||
                          currentLPTokenAmount === null ? (
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
                            numberFormatter(currentLPTokenAmount)
                          )}
                          {/* $ 10.91 */}
                        </Text>
                      </Box>
                    )}
                  {radioValue == '1' &&
                    currentPool !== 'Select a pool' &&
                    collateralAmount > 0 &&
                    inputBorrowAmount > 0 && (
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mb="0.3rem"
                      >
                        <Box display="flex">
                          <Text
                            color="#676D9A"
                            fontSize="12px"
                            fontWeight="400"
                            fontStyle="normal"
                          >
                            Liquidity split:{' '}
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right"
                            boxShadow="dark-lg"
                            label="The fee for reallocating liquidity across assets in a protocol."
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
                            <Box ml="0.2rem" mt="0.2rem">
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Box>
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
                              {currentSplit?.[0].toString() ? (
                                numberFormatter(currentSplit?.[0].toString())
                              ) : (
                                <Skeleton
                                  width="2.3rem"
                                  height=".85rem"
                                  startColor="#2B2F35"
                                  endColor="#101216"
                                  borderRadius="6px"
                                />
                              )}
                            </Text>
                          </Box>
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
                              {/* {currentSplit?.[1].toString() || (
                              <Skeleton
                                width="2.3rem"
                                height=".85rem"
                                startColor="#2B2F35"
                                endColor="#101216"
                                borderRadius="6px"
                              />
                            )} */}
                              {currentSplit?.[1].toString() ? (
                                numberFormatter(currentSplit?.[1].toString())
                              ) : (
                                <Skeleton
                                  width="2.3rem"
                                  height=".85rem"
                                  startColor="#2B2F35"
                                  endColor="#101216"
                                  borderRadius="6px"
                                />
                              )}
                            </Text>
                          </Box>
                        </Box>
                      </Box>
                    )}
                  {/* {radioValue == "2" && (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      mb="0.3rem"
                    >
                      <Box display="flex">
                        <Box display="flex" gap="2px">
                          <Text
                            color="#6A737D"
                            fontSize="12px"
                            fontWeight="400"
                            fontStyle="normal"
                          >
                            est
                          </Text>
                          <Box mt="2px">
                            <SmallEth />
                          </Box>
                        </Box>
                        <Tooltip
                          hasArrow
                          placement="right"
                          boxShadow="dark-lg"
                          label="estimated"
                          bg="#24292F"
                          fontSize={"smaller"}
                          fontWeight={"thin"}
                          borderRadius={"lg"}
                          padding={"2"}
                        >
                          <Box ml="0.2rem" mt="0.2rem">
                            <InfoIcon />
                          </Box>
                        </Tooltip>
                      </Box>
                      <Text
                        color="#6A737D"
                        fontSize="12px"
                        fontWeight="400"
                        fontStyle="normal"
                      >
                        $10.91
                      </Text>
                    </Box>
                  )} */}
                  <Box display="flex" justifyContent="space-between" mb="1">
                    <Box display="flex">
                      <Text color="#676D9A" fontSize="xs">
                        Fees:{' '}
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
                        <Box p="1">
                          <InfoIcon />
                        </Box>
                      </Tooltip>
                    </Box>
                    <Text color="#676D9A" fontSize="xs">
                      {fees.borrowTrade}%
                    </Text>
                  </Box>
                  {/* 
                  <Box display="flex" justifyContent="space-between" mb="1">
                    <Box display="flex">
                      <Text color="#676D9A" fontSize="xs">
                        Gas estimate:{" "}
                      </Text>
                      <Tooltip
                        hasArrow
                        placement="right"
                        boxShadow="dark-lg"
                        label="Estimation of resources & costs for blockchain transactions."
                        bg="#010409"
                        fontSize={"13px"}
                        fontWeight={"thin"}
                        borderRadius={"lg"}
                        padding={"2"}
                        border="1px solid"
                        borderColor="#2B2F35"
                        arrowShadowColor="#2B2F35"
                        maxW="222px"
                      >
                        <Box padding="0.25rem">
                          <InfoIcon />
                        </Box>
                      </Tooltip>
                    </Box>
                    <Text color="#676D9A" fontSize="xs">
                      $0.91
                    </Text>
                  </Box> */}
                  <Box display="flex" justifyContent="space-between" mb="1">
                    <Box display="flex">
                      <Text color="#676D9A" fontSize="xs">
                        Borrow APR:{' '}
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
                        maxW="274px"
                        // mb="10px"
                      >
                        <Box p="1">
                          <InfoIcon />
                        </Box>
                      </Tooltip>
                    </Box>
                    <Text color="#676D9A" fontSize="xs">
                      {!borrowAPRs ||
                      borrowAPRs.length === 0 ||
                      !borrowAPRs[currentBorrowAPR] ? (
                        <Box pt="1px">
                          <Skeleton
                            width="2.3rem"
                            height=".85rem"
                            startColor="#2B2F35"
                            endColor="#101216"
                            borderRadius="6px"
                          />
                        </Box>
                      ) : (
                        '-' + borrowAPRs[currentBorrowAPR] + '%'
                      )}
                      {/* 5.56% */}
                    </Text>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb="1">
                    <Box display="flex">
                      <Text color="#676D9A" fontSize="xs">
                        STRK APR:{' '}
                      </Text>
                      <Tooltip
                        hasArrow
                        placement="right"
                        boxShadow="dark-lg"
                        label="The annual percentage rate in which STRK is rewarded."
                        bg="#02010F"
                        fontSize={'13px'}
                        fontWeight={'400'}
                        borderRadius={'lg'}
                        padding={'2'}
                        color="#F0F0F5"
                        border="1px solid"
                        borderColor="#23233D"
                        arrowShadowColor="#2B2F35"
                        maxW="274px"
                        // mb="10px"
                      >
                        <Box p="1">
                          <InfoIcon />
                        </Box>
                      </Tooltip>
                    </Box>
                    <Text color="#676D9A" fontSize="xs">
                      {!borrowAPRs ||
                      borrowAPRs.length === 0 ||
                      !borrowAPRs[currentBorrowAPR] ? (
                        <Box pt="1px">
                          <Skeleton
                            width="2.3rem"
                            height=".85rem"
                            startColor="#2B2F35"
                            endColor="#101216"
                            borderRadius="6px"
                          />
                        </Box>
                      ) : (
                        numberFormatterPercentage(
                          getBoostedApr(currentBorrowCoin) +
                            getBoostedAprSupply(currentCollateralCoin)
                        ) + '%'
                      )}
                      {/* 5.56% */}
                    </Text>
                  </Box>
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
                          ) : currentPool == 'Select a pool' ? (
                            <Text
                              color={
                                Number(
                                  (inputBorrowAmountUSD *
                                    (-protocolStats?.find(
                                      (stat: any) =>
                                        stat?.token === currentBorrowCoin
                                    )?.borrowRate +
                                      getBoostedApr(currentBorrowCoin)) +
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
                                (inputBorrowAmountUSD *
                                  (-protocolStats?.find(
                                    (stat: any) =>
                                      stat?.token === currentBorrowCoin
                                  )?.borrowRate +
                                    getBoostedApr(currentBorrowCoin)) +
                                  inputCollateralAmountUSD *
                                    (protocolStats?.find(
                                      (stat: any) =>
                                        stat?.token === currentCollateralCoin
                                    )?.supplyRate +
                                      getBoostedAprSupply(
                                        currentCollateralCoin
                                      ))) /
                                  inputCollateralAmountUSD
                              ).toFixed(2)}
                              %
                            </Text>
                          ) : (
                            <Text
                              color={
                                Number(
                                  (inputBorrowAmountUSD *
                                    (-protocolStats?.find(
                                      (stat: any) =>
                                        stat?.token === currentBorrowCoin
                                    )?.borrowRate +
                                      getAprByPool(
                                        poolAprs,
                                        currentPool,
                                        currentDapp
                                      ) +
                                      getBoostedApr(currentBorrowCoin) +
                                      (100 *
                                        365 *
                                        (poolAllocatedData *
                                          oraclePrices.find(
                                            (curr: any) => curr.name === 'STRK'
                                          )?.price)) /
                                        getTvlByPool(
                                          poolAprs,
                                          currentPool,
                                          currentDapp
                                        )) +
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
                                  : 'rgb(3 211 148)'
                              }
                            >
                              {/* (100*365*(poolAllocatedData*(oraclePrices.find((curr: any) => curr.name === "STRK")?.price))/getTvlByPool(poolAprs, currentPool, currentDapp)) */}
                              {/* 5.56% */}
                              {/* loan_usd_value * loan_apr - collateral_usd_value * collateral_apr) / loan_usd_value */}
                              {}
                              {/* {
                        protocolStats?.find(
                          (stat: any) => stat?.token === currentCollateralCoin
                        )?.supplyRate
                      } */}
                              {Number(
                                (inputBorrowAmountUSD *
                                  (-protocolStats?.find(
                                    (stat: any) =>
                                      stat?.token === currentBorrowCoin
                                  )?.borrowRate +
                                    getAprByPool(
                                      poolAprs,
                                      currentPool,
                                      currentDapp
                                    ) +
                                    getBoostedApr(currentBorrowCoin) +
                                    (100 *
                                      365 *
                                      (poolAllocatedData *
                                        oraclePrices.find(
                                          (curr: any) => curr.name === 'STRK'
                                        )?.price)) /
                                      getTvlByPool(
                                        poolAprs,
                                        currentPool,
                                        currentDapp
                                      )) +
                                  (inputCollateralAmountUSD *
                                    protocolStats?.find(
                                      (stat: any) =>
                                        stat?.token === currentCollateralCoin
                                    )?.supplyRate +
                                    getBoostedAprSupply(
                                      currentCollateralCoin
                                    ))) /
                                  inputCollateralAmountUSD
                              ).toFixed(2)}
                              %
                            </Text>
                          )
                        ) : // (100*365*(poolAllocatedData*(oraclePrices.find((curr: any) => curr.name === "STRK")?.price))/getTvlByPool(poolAprs, currentPool, currentDapp))
                        // protocolStats.length === 0 ||
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
                        ) : currentPool == 'Select a pool' ? (
                          <Text
                            color={
                              Number(
                                (inputBorrowAmountUSD *
                                  (-protocolStats?.find(
                                    (stat: any) =>
                                      stat?.token === currentBorrowCoin
                                  )?.borrowRate +
                                    getBoostedApr(currentBorrowCoin)) +
                                  inputCollateralAmountUSD *
                                    (protocolStats?.find(
                                      (stat: any) =>
                                        stat?.token === rToken.slice(1)
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
                            {Number(
                              (inputBorrowAmountUSD *
                                (-protocolStats?.find(
                                  (stat: any) =>
                                    stat?.token === currentBorrowCoin
                                )?.borrowRate +
                                  getBoostedApr(currentBorrowCoin)) +
                                inputCollateralAmountUSD *
                                  (protocolStats?.find(
                                    (stat: any) =>
                                      stat?.token === rToken.slice(1)
                                  )?.supplyRate +
                                    getBoostedAprSupply(
                                      currentCollateralCoin
                                    ))) /
                                inputCollateralAmountUSD
                            ).toFixed(2)}
                            %
                            {/* {
                            protocolStats?.find(
                              (stat: any) => stat?.token === currentCollateralCoin
                            )?.supplyRate
                          } */}
                          </Text>
                        ) : (
                          <Text
                            color={
                              Number(
                                (inputBorrowAmountUSD *
                                  (-protocolStats?.find(
                                    (stat: any) =>
                                      stat?.token === currentBorrowCoin
                                  )?.borrowRate +
                                    getAprByPool(
                                      poolAprs,
                                      currentPool,
                                      currentDapp
                                    ) +
                                    getBoostedApr(currentBorrowCoin) +
                                    (100 *
                                      365 *
                                      (poolAllocatedData *
                                        oraclePrices.find(
                                          (curr: any) => curr.name === 'STRK'
                                        )?.price)) /
                                      getTvlByPool(
                                        poolAprs,
                                        currentPool,
                                        currentDapp
                                      )) +
                                  inputCollateralAmountUSD *
                                    (protocolStats?.find(
                                      (stat: any) =>
                                        stat?.token === rToken.slice(1)
                                    )?.supplyRate +
                                      getBoostedAprSupply(rToken.slice(1)))) /
                                  inputCollateralAmountUSD
                              ) < 0
                                ? 'rgb(255 94 94)'
                                : '#00D395'
                            }
                          >
                            {/* (100*365*(poolAllocatedData*(oraclePrices.find((curr: any) => curr.name === "STRK")?.price))/getTvlByPool(poolAprs, currentPool, currentDapp)) */}
                            {/* 5.56% */}
                            {/* loan_usd_value * loan_apr - collateral_usd_value * collateral_apr) / loan_usd_value */}
                            {Number(
                              (inputBorrowAmountUSD *
                                (-protocolStats?.find(
                                  (stat: any) =>
                                    stat?.token === currentBorrowCoin
                                )?.borrowRate +
                                  getAprByPool(
                                    poolAprs,
                                    currentPool,
                                    currentDapp
                                  ) +
                                  getBoostedApr(currentBorrowCoin) +
                                  (100 *
                                    365 *
                                    (poolAllocatedData *
                                      oraclePrices.find(
                                        (curr: any) => curr.name === 'STRK'
                                      )?.price)) /
                                    getTvlByPool(
                                      poolAprs,
                                      currentPool,
                                      currentDapp
                                    )) +
                                inputCollateralAmountUSD *
                                  (protocolStats?.find(
                                    (stat: any) =>
                                      stat?.token === rToken.slice(1)
                                  )?.supplyRate +
                                    getBoostedAprSupply(rToken.slice(1)))) /
                                inputCollateralAmountUSD
                            ).toFixed(2)}
                            %
                            {/* (100*365*(poolAllocatedData*(oraclePrices.find((curr: any) => curr.name === "STRK")?.price))/getTvlByPool(poolAprs, currentPool, currentDapp)) */}
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
                    <Box display="flex" justifyContent="space-between">
                      <Box display="flex">
                        <Text color="#676D9A" fontSize="xs">
                          Health factor:{' '}
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
                          maxW="222px"
                        >
                          <Box padding="0.25rem">
                            <InfoIcon />
                          </Box>
                        </Tooltip>
                      </Box>
                      <Text color="#676D9A" fontSize="xs">
                        {healthFactor?.toFixed(2)}
                      </Text>
                    </Box>
                  ) : (
                    ''
                  )}
                </Box>
                {currentCollateralCoin &&
                  currentCollateralCoin[0] !== 'r' &&
                  stats && (
                    <Box
                      // display="flex"
                      // justifyContent="left"
                      w="100%"
                      // pb="4"
                      height="64px"
                      display="flex"
                      alignItems="center"
                      mt="2rem"
                      // mb="1rem"
                    >
                      <Box
                        display="flex"
                        bg={
                          dollarConvertor(
                            maximumLoanAmount,
                            currentBorrowCoin,
                            oraclePrices
                          ) < 100 ||
                          (tokenTypeSelected == 'Native'
                            ? currentBorrowCoin == 'BTC' &&
                              currentCollateralCoin == 'STRK'
                            : currentBorrowCoin == 'BTC' && rToken == 'rSTRK') || (currentBorrowCoin === 'USDT'
                            && currentPool == 'STRK/ETH') ||
                            (currentBorrowCoin === 'BTC'
                              && currentPool == 'STRK/ETH')
                            ? '#480C104D'
                            : '#676D9A4D'
                        }
                        color="#F0F0F5"
                        fontSize="12px"
                        p="4"
                        border={
                          dollarConvertor(
                            maximumLoanAmount,
                            currentBorrowCoin,
                            oraclePrices
                          ) < 100 ||
                          (tokenTypeSelected == 'Native'
                            ? currentBorrowCoin == 'BTC' &&
                              currentCollateralCoin == 'STRK'
                            : currentBorrowCoin == 'BTC' && rToken == 'rSTRK') || (currentBorrowCoin === 'USDT'
                            && currentPool == 'STRK/ETH') ||
                            (currentBorrowCoin === 'BTC'
                              && currentPool == 'STRK/ETH')
                            ? '1px solid #9B1A23'
                            : '1px solid #3841AA'
                        }
                        fontStyle="normal"
                        fontWeight="400"
                        lineHeight="18px"
                        borderRadius="6px"
                        // textAlign="center"
                      >
                        <Box pr="3" mt="0.5" cursor="pointer">
                          {dollarConvertor(
                            maximumLoanAmount,
                            currentBorrowCoin,
                            oraclePrices
                          ) < 100 ||
                          (tokenTypeSelected == 'Native'
                            ? currentBorrowCoin == 'BTC' &&
                              currentCollateralCoin == 'STRK'
                            : currentBorrowCoin == 'BTC' &&
                              rToken == 'rSTRK') || ((currentBorrowCoin === 'USDT'
                              && currentPool == 'STRK/ETH') ||
                              (currentBorrowCoin === 'BTC'
                                && currentPool == 'STRK/ETH')) ? (
                            <RedinfoIcon />
                          ) : (
                            <BlueInfoIcon />
                          )}
                        </Box>
                        {dollarConvertor(
                          maximumLoanAmount,
                          currentBorrowCoin,
                          oraclePrices
                        ) < 100 ||
                        (tokenTypeSelected == 'Native'
                          ? currentBorrowCoin == 'BTC' &&
                            currentCollateralCoin == 'STRK'
                          : currentBorrowCoin == 'BTC' && rToken == 'rSTRK')
                          ? `The current collateral and borrowing market combination isn't allowed at this moment.`
                          :
                          (currentBorrowCoin === 'USDT'
                  && currentPool == 'STRK/ETH') ||
                  (currentBorrowCoin === 'BTC'
                    && currentPool == 'STRK/ETH')
                    ?"The current borrow market and spend pool isn't allowed at this moment"
                          : `You have selected a native token as collateral which will be
                    converted to rtokens 1r${currentCollateralCoin} =
                    ${
                      (stats.find(
                        (val: any) =>
                          val?.token == currentCollateralCoin.split(1)
                      )?.exchangeRateRtokenToUnderlying
                        ? numberFormatter(
                            stats.find(
                              (val: any) =>
                                val?.token == currentCollateralCoin.split(1)
                            )?.exchangeRateRtokenToUnderlying
                          )
                        : '') + currentCollateralCoin?.split(1)
                    }`}
                        {/* <Box
                                py="1"
                                pl="4"
                                cursor="pointer"
                                // onClick={handleClick}
                              >
                                <TableClose />
                              </Box> */}
                      </Box>
                    </Box>
                  )}
                {(tokenTypeSelected == 'rToken' ? rTokenAmount > 0 : true) &&
                (tokenTypeSelected == 'Native'
                  ? !(
                      currentBorrowCoin == 'BTC' &&
                      currentCollateralCoin == 'STRK'
                    )
                  : !(currentBorrowCoin == 'BTC' && rToken == 'rSTRK')) &&
                (tokenTypeSelected == 'Native' ? collateralAmount > 0 : true) &&
                ((inputBorrowAmount >= minimumLoanAmount &&
                  inputBorrowAmount <= maximumLoanAmount) ||
                  process.env.NEXT_PUBLIC_NODE_ENV == 'testnet') &&
                inputBorrowAmount <= currentAvailableReserves &&
                (currentBorrowCoin === 'USDT'
                  ? currentPool !== 'STRK/ETH'
                  : currentBorrowCoin === 'BTC'
                    ? currentPool !== 'STRK/ETH'
                    : true) &&
                inputBorrowAmount > 0 &&
                ((tokenTypeSelected == 'Native'
                  ? inputCollateralAmount >= minimumDepositAmount &&
                    inputCollateralAmount <= maximumDepositAmount
                  : true) ||
                  process.env.NEXT_PUBLIC_NODE_ENV == 'testnet') &&
                inputCollateralAmount <= walletBalance &&
                inputBorrowAmountUSD <= 4.98 * inputCollateralAmountUSD &&
                currentDapp != 'Select a dapp' &&
                (currentPool != 'Select a pool' ||
                  currentPoolCoin != 'Select a pool') ? (
                  <Box
                    onClick={() => {
                      setTransactionStarted(true)
                      ////console.log(
                      //   "trade clicked",
                      //   "rToken",
                      //   rToken,
                      //   "rTokenAmount",
                      //   rTokenAmount,
                      //   "collateralMarket",
                      //   collateralMarket,
                      //   "collateralAmount",
                      //   collateralAmount,
                      //   "loanMarket",
                      //   loanMarket,
                      //   "loanAmount",
                      //   loanAmount,
                      //   "method",
                      //   method,
                      //   "l3App",
                      //   l3App,
                      //   "toMarketSwap",
                      //   toMarketSwap,
                      //   "toMarketLiqA",
                      //   toMarketLiqA,
                      //   "toMarketLiqB",
                      //   toMarketLiqB
                      // );

                      if (transactionStarted == false) {
                        posthog.capture('Trade Button Clicked Market page', {
                          Clicked: true,
                        })
                        dispatch(setTransactionStartedAndModalClosed(false))
                        handleBorrowAndSpend()
                      }
                    }}
                  >
                    <AnimatedButton
                      // bgColor="red"
                      // p={0}
                      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                      background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                      color="#676D9A"
                      size="sm"
                      width="100%"
                      mt="1.5rem"
                      mb="1.5rem"
                      labelSuccessArray={[
                        'Performing Checks',
                        'Processing',
                        'Collateral received',
                        'Processing the borrow request.',
                        'Checking the reserves for sufficient liquidity',
                        'Reserves are sufficient',
                        'Borrow successful.',
                        <SuccessButton
                          key={'successButton'}
                          successText={'Borrow successful'}
                        />,
                      ]}
                      labelErrorArray={[
                        <ErrorButton
                          errorText="Transaction failed"
                          key={'error1'}
                        />,
                        <ErrorButton errorText="Copy error!" key={'error2'} />,
                      ]}
                      _disabled={{ bgColor: 'white', color: 'black' }}
                      isDisabled={transactionStarted == true}
                      currentTransactionStatus={currentTransactionStatus}
                      setCurrentTransactionStatus={setCurrentTransactionStatus}
                    >
                      Spend
                    </AnimatedButton>
                  </Box>
                ) : (
                  <Button
                    border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                    background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                    color="#676D9A"
                    size="sm"
                    width="100%"
                    mt="1.5rem"
                    mb="1.5rem"
                    _hover={{
                      bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
                    }}
                  >
                    Spend
                  </Button>
                )}
              </Box>}

            {actionSelected==='Borrow'&&<Card
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
            </Card>}

            {currentCollateralCoin &&
              currentCollateralCoin[0] !== 'r' &&
              protocolStatsRedux && actionSelected==='Borrow'  && (
                <Box
                  // display="flex"
                  // justifyContent="left"
                  w="100%"
                  // pb="4"
                  height="64px"
                  display="flex"
                  alignItems="center"
                  mt="2rem"
                  // mb="1rem"
                >
                  <Box
                    display="flex"
                    bg={
                      dollarConvertor(
                        maximumLoanAmount,
                        currentBorrowCoin,
                        oraclePrices
                      ) < 100 ||
                      (tokenTypeSelected == 'Native'
                        ? currentBorrowCoin == 'BTC' &&
                          currentCollateralCoin == 'STRK'
                        : currentBorrowCoin == 'BTC' && rToken == 'rSTRK')
                        ? '#480C104D'
                        : '#676D9A4D'
                    }
                    color="#F0F0F5"
                    fontSize="12px"
                    p="4"
                    border={
                      dollarConvertor(
                        maximumLoanAmount,
                        currentBorrowCoin,
                        oraclePrices
                      ) < 100 ||
                      (tokenTypeSelected == 'Native'
                        ? currentBorrowCoin == 'BTC' &&
                          currentCollateralCoin == 'STRK'
                        : currentBorrowCoin == 'BTC' && rToken == 'rSTRK')
                        ? '1px solid #9B1A23'
                        : '1px solid #3841AA'
                    }
                    fontStyle="normal"
                    fontWeight="400"
                    lineHeight="18px"
                    borderRadius="6px"
                    // textAlign="center"
                  >
                    <Box pr="3" mt="0.5" cursor="pointer">
                      {dollarConvertor(
                        maximumLoanAmount,
                        currentBorrowCoin,
                        oraclePrices
                      ) < 100 ||
                      (tokenTypeSelected == 'Native'
                        ? currentBorrowCoin == 'BTC' &&
                          currentCollateralCoin == 'STRK'
                        : currentBorrowCoin == 'BTC' && rToken == 'rSTRK') ? (
                        <RedinfoIcon />
                      ) : (
                        <BlueInfoIcon />
                      )}
                    </Box>
                    {dollarConvertor(
                      maximumLoanAmount,
                      currentBorrowCoin,
                      oraclePrices
                    ) < 100 ||
                    (tokenTypeSelected == 'Native'
                      ? currentBorrowCoin == 'BTC' &&
                        currentCollateralCoin == 'STRK'
                      : currentBorrowCoin == 'BTC' && rToken == 'rSTRK')
                      ? `The current collateral and borrowing market combination isn't allowed at this moment.`
                      : `You have selected a native token as collateral which will be
                    converted to rtokens 1r${currentCollateralCoin} =
                    ${
                      (protocolStatsRedux.find(
                        (val: any) =>
                          val?.token == currentCollateralCoin.split(1)
                      )?.exchangeRateRtokenToUnderlying
                        ? numberFormatter(
                            protocolStatsRedux.find(
                              (val: any) =>
                                val?.token == currentCollateralCoin.split(1)
                            )?.exchangeRateRtokenToUnderlying
                          )
                        : '') + currentCollateralCoin?.split(1)
                    }`}
                    {/* <Box
                                py="1"
                                pl="4"
                                cursor="pointer"
                                // onClick={handleClick}
                              >
                                <TableClose />
                              </Box> */}
                  </Box>
                </Box>
              )}

            {
            
            (actionSelected==='Borrow'&&((tokenTypeSelected == 'rToken' ? rTokenAmount > 0 : true) &&
            (tokenTypeSelected == 'Native' ? collateralAmount > 0 : true) &&
            (tokenTypeSelected == 'Native'
              ? !(currentBorrowCoin == 'BTC' && currentCollateralCoin == 'STRK')
              : !(currentBorrowCoin == 'BTC' && rToken == 'rSTRK')) &&
            amount > 0 &&
            (process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet'
              ? inputBorrowAmount >= minimumLoanAmount &&
                inputBorrowAmount <= maximumLoanAmount
              : true) &&
            rTokenAmount <= walletBalance &&
            // rTokenAmount<
            rTokenAmount > 0 &&
            (process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
            tokenTypeSelected == 'Native'
              ? rTokenAmount >= minimumDepositAmount &&
                rTokenAmount <= maximumDepositAmount
              : true) &&
            // do max 1209
            inputBorrowAmount <= currentAvailableReserves &&
            inputBorrowAmountUSD <= 4.98 * inputCollateralAmountUSD ? (
              // (currentCollateralCoin[0]=="r" ? rTokenAmount<=walletBalance :true) &&
              // (validRTokens.length>0 ? rTokenAmount <= walletBalance:true) &&
              // inputBorrowAmountUSD <= 5 * inputCollateralAmountUSD ? (
              buttonId == 1 ? (
                <SuccessButton successText="Borrow successful." />
              ) : buttonId == 2 ? (
                <ErrorButton errorText="Copy error!" />
              ) : (
                <Box
                  onClick={() => {
                    setTransactionStarted(true)
                    if (transactionStarted == false) {
                      dispatch(setTransactionStartedAndModalClosed(false))
                      posthog.capture('Borrow Market Button Clicked', {
                        'Borrow Clicked': true,
                      })
                      handleBorrow()
                    }
                  }}
                >
                  <AnimatedButton
                    border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                    background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                    // bgColor="red"
                    // p={0}
                    color="#8B949E"
                    size="sm"
                    width="100%"
                    mt="1.5rem"
                    mb="1.5rem"
                    labelSuccessArray={[
                      'Collateral received',
                      'Processing the borrow request.',
                      // <ErrorButton errorText="Transaction failed" />,
                      // <ErrorButton errorText="Copy error!" />,
                      <SuccessButton
                        key={'successButton'}
                        successText={'Borrow successful.'}
                      />,
                    ]}
                    labelErrorArray={[
                      <ErrorButton
                        errorText="Transaction failed"
                        key={'error1'}
                      />,
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
              )
            ) : (
              <Button
                border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                color="#6E7681"
                size="sm"
                width="100%"
                mt="1.5rem"
                mb="1.5rem"
                _hover={{
                  bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
                }}
              >
                Borrow
              </Button>
            )))
            }
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default memo(BorrowModal)
