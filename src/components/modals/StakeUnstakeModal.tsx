import {
  Box,
  Button,
  Card,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Skeleton,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'

import hoverStake from '../../assets/images/hoverStakeIcon.svg'
import DAILogo from '@/assets/icons/coins/dai'
import ETHLogo from '@/assets/icons/coins/eth'
import USDCLogo from '@/assets/icons/coins/usdc'
import USDTLogo from '@/assets/icons/coins/usdt'
import { useDispatch, useSelector } from 'react-redux'
import BTCLogo from '../../assets/icons/coins/btc'
import DropdownUp from '../../assets/icons/dropdownUpIcon'
import InfoIcon from '../../assets/icons/infoIcon'
import SliderTooltip from '../uiElements/sliders/sliderTooltip'

import useStakeRequest from '@/Blockchain/hooks/Writes/useStakerequest'
import useWithdrawStake from '@/Blockchain/hooks/Writes/useWithdrawStake'
import { NativeToken, RToken } from '@/Blockchain/interfaces/interfaces'
import ArrowUp from '@/assets/icons/arrowup'
import WarningIcon from '@/assets/icons/coins/warningIcon'
import JediswapLogo from '@/assets/icons/dapps/jediswapLogo'
import MySwapDisabled from '@/assets/icons/dapps/mySwapDisabled'
import BtcToEth from '@/assets/icons/pools/btcToEth'
import BtcToUsdt from '@/assets/icons/pools/btcToUsdt'
import DaiToEth from '@/assets/icons/pools/daiToEth'
import EthToUsdc from '@/assets/icons/pools/ethToUsdc'
import EthToUsdt from '@/assets/icons/pools/ethToUsdt'
import UsdcToUsdt from '@/assets/icons/pools/usdcToUsdt'
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
  selectMaximumDepositAmounts,
  selectMinimumDepositAmounts,
  selectProtocolStats,
  selectStakingShares,
  selectUserDeposits,
} from '@/store/slices/readDataSlice'
import {
  selectActiveTransactions,
  selectTransactionCheck,
  selectWalletBalance,
  setActiveTransactions,
  setTransactionStartedAndModalClosed,
  setTransactionStatus,
} from '@/store/slices/userAccountSlice'
import { useAccount, useWaitForTransaction } from '@starknet-react/core'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { toast } from 'react-toastify'
import AnimatedButton from '../uiElements/buttons/AnimationButton'
import ErrorButton from '../uiElements/buttons/ErrorButton'
import SuccessButton from '../uiElements/buttons/SuccessButton'

import useBalanceOf from '@/Blockchain/hooks/Reads/useBalanceOf'
import useDeposit from '@/Blockchain/hooks/Writes/useDeposit'
import {
  getEstrTokens,
  getUserStakingShares,
} from '@/Blockchain/scripts/Rewards'
import {
  tokenAddressMap,
  tokenDecimalsMap,
} from '@/Blockchain/utils/addressServices'
import { BNtoNum, parseAmount } from '@/Blockchain/utils/utils'
import STRKLogo from '@/assets/icons/coins/strk'
import InfoIconBig from '@/assets/icons/infoIconBig'
import numberFormatter from '@/utils/functions/numberFormatter'
import mixpanel from 'mixpanel-browser'
import posthog from 'posthog-js'
import { uint256 } from 'starknet'
import TransactionFees from '../../../TransactionFees.json'
import TableInfoIcon from '../layouts/table/tableIcons/infoIcon'

const StakeUnstakeModal = ({
  buttonText,
  coin,
  nav,
  isCorrectNetwork,
  stakeHover,
  setStakeHover,
  validRTokens,
  ...restProps
}: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const dispatch = useDispatch()
  const [sliderValue, setSliderValue] = useState(0)
  const modalDropdowns = useSelector(selectModalDropDowns)
  const [sliderValue2, setSliderValue2] = useState(0)
  const [inputStakeAmount, setInputStakeAmount] = useState<number>(0)
  const [inputUnstakeAmount, setInputUnstakeAmount] = useState(0)
  const [transactionStarted, setTransactionStarted] = useState(false)
  const { address } = useAccount()
  const [unstakeTransactionStarted, setUnstakeTransactionStarted] =
    useState(false)
  let protocolStats = useSelector(selectProtocolStats)
  let activeTransactions = useSelector(selectActiveTransactions)
  let stakingShares = useSelector(selectStakingShares)

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

  const [uniqueID, setUniqueID] = useState(0)
  const getUniqueId = () => uniqueID

  const {
    rToken,
    setRToken,
    rTokenAmount,
    setRTokenAmount,
    dataStakeRequest,
    errorStakeRequest,
    resetStakeRequest,
    writeStakeRequest,
    writeAsyncStakeRequest,
    isErrorStakeRequest,
    isIdleStakeRequest,
    isSuccessStakeRequest,
    statusStakeRequest,
  } = useStakeRequest()

  const {
    depositAmount,
    setDepositAmount,
    asset,
    setAsset,
    dataDeposit,
    errorDeposit,
    resetDeposit,
    writeAsyncDeposit,
    writeAsyncDepositStake,

    isErrorDeposit,
    isIdleDeposit,
    isSuccessDeposit,
    statusDeposit,
  } = useDeposit()
  const {
    unstakeRToken,
    setUnstakeRToken,
    rTokenToWithdraw,
    setRTokenToWithdraw,
    dataWithdrawStake,
    errorWithdrawStake,
    resetWithdrawStake,
    writeWithdrawStake,
    writeAsyncWithdrawStake,
    isErrorWithdrawStake,
    isIdleWithdrawStake,
    isSuccessWithdrawStake,
    statusWithdrawStake,
  } = useWithdrawStake()

  const getCoin = (CoinName: string) => {
    switch (CoinName) {
      case 'BTC':
        return <BTCLogo height={'16px'} width={'16px'} />
      case 'USDC':
        return <USDCLogo height={'16px'} width={'16px'} />
      case 'USDT':
        return <USDTLogo height={'16px'} width={'16px'} />
      case 'ETH':
        return <ETHLogo height={'16px'} width={'16px'} />
      case 'STRK':
        return <STRKLogo height={'16px'} width={'16px'} />
      case 'DAI':
        return <DAILogo height={'16px'} width={'16px'} />
      case 'rBTC':
        return <BTCLogo height={'16px'} width={'16px'} />
      case 'rUSDC':
        return <USDCLogo height={'16px'} width={'16px'} />
      case 'rUSDT':
        return <USDTLogo height={'16px'} width={'16px'} />
      case 'rETH':
        return <ETHLogo height={'16px'} width={'16px'} />
      case 'rDAI':
        return <DAILogo height={'16px'} width={'16px'} />
      case 'rSTRK':
        return <STRKLogo height={'16px'} width={'16px'} />
      case 'Jediswap':
        return <JediswapLogo />
      case 'mySwap':
        return <MySwapDisabled />
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
      default:
        break
    }
  }

  const getBalance = (coin: string) => {
    const amount = validRTokens?.find(({ rToken, rTokenAmount }: any) => {
      if (rToken == coin) return rTokenAmount
    })
    return amount ? amount.rTokenAmount : 0
  }
  const [depositTransHash, setDepositTransHash] = useState('')
  const [currentTransactionStatus, setCurrentTransactionStatus] = useState('')

  const [toastId, setToastId] = useState<any>()

  useEffect(() => {
    if (coin) {
      setAsset(coin ? coin?.name : 'BTC')
    }
  }, [coin])

  const handleStakeTransaction = async () => {
    try {
      posthog.capture('Action Selected', {
        Actions: 'Stake',
      })
      const stake = await writeAsyncStakeRequest()
      setDepositTransHash(stake?.transaction_hash)
      if (stake?.transaction_hash) {
        const toastid = toast.info(
          // `Please wait your transaction is running in background :  ${inputStakeAmount} ${currentSelectedStakeCoin} `,
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
          transaction_hash: stake?.transaction_hash.toString(),
          message: `Successfully staked : ${inputStakeAmount} ${currentSelectedStakeCoin}`,
          // message: `Transaction successful`,
          toastId: toastid,
          setCurrentTransactionStatus: setCurrentTransactionStatus,
          uniqueID: uqID,
        }
        activeTransactions?.push(trans_data)
        posthog.capture('Stake Modal Market Page Status', {
          Status: 'Success',
          Token: currentSelectedStakeCoin,
          TokenAmount: inputStakeAmount,
        })

        dispatch(setActiveTransactions(activeTransactions))
      }
      const uqID = getUniqueId()
      let data: any = localStorage.getItem('transactionCheck')
      data = data ? JSON.parse(data) : []
      if (data && data.includes(uqID)) {
        dispatch(setTransactionStatus('success'))
      }
    } catch (err: any) {
      const uqID = getUniqueId()
      let data: any = localStorage.getItem('transactionCheck')
      data = data ? JSON.parse(data) : []
      if (data && data.includes(uqID)) {
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
      posthog.capture('Stake Modal Market Page Status', {
        Status: 'Failure',
      })
      toast.error(toastContent, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      })
    }
  }
  const hanldeStakeAndSupplyTransaction = async () => {
    try {
      posthog.capture('Action Selected', {
        Action: 'Deposit and Stake',
      })
      const depositStake = await writeAsyncDepositStake()
      if (depositStake?.transaction_hash) {
        const toastid = toast.info(
          // `Please wait your transaction is running in background : supply and staking - ${inputAmount} ${currentSelectedCoin} `,
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
          transaction_hash: depositStake?.transaction_hash.toString(),
          message: `Successfully staked ${inputStakeAmount} ${currentSelectedStakeCoin}`,
          toastId: toastid,
          setCurrentTransactionStatus: setCurrentTransactionStatus,
          uniqueID: uqID,
        }
        activeTransactions?.push(trans_data)

        dispatch(setActiveTransactions(activeTransactions))
      }
      posthog.capture('Supply Market Status', {
        Status: 'Success Deposit and Stake',
        Token: currentSelectedStakeCoin,
        TokenAmount: inputStakeAmount,
      })
      setDepositTransHash(depositStake?.transaction_hash)
      const uqID = getUniqueId()
      let data: any = localStorage.getItem('transactionCheck')
      data = data ? JSON.parse(data) : []
      if (data && data.includes(uqID)) {
        dispatch(setTransactionStatus('success'))
      }
    } catch (err: any) {
      posthog.capture('Stake Market Status', {
        Status: 'Failure',
      })
      const uqID = getUniqueId()
      let data: any = localStorage.getItem('transactionCheck')
      data = data ? JSON.parse(data) : []
      if (data && data.includes(uqID)) {
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
      toast.error(toastContent, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      })
    }
  }

  const hanldeUnstakeTransaction = async () => {
    try {
      const unstake = await writeAsyncWithdrawStake()
      setDepositTransHash(unstake?.transaction_hash)
      if (unstake?.transaction_hash) {
        const toastid = toast.info(
          // `Please wait your transaction is running in background : ${inputStakeAmount} ${currentSelectedStakeCoin} `,
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
          transaction_hash: unstake?.transaction_hash.toString(),
          message: `Successfully unstaked : ${rTokenToWithdraw} ${currentSelectedUnstakeCoin}`,
          toastId: toastid,
          setCurrentTransactionStatus: setCurrentTransactionStatus,
          uniqueID: uqID,
        }
        activeTransactions?.push(trans_data)
        posthog.capture('Unstake Modal Market Page Status', {
          Status: 'Success',
          Token: currentSelectedUnstakeCoin,
          TokenAmount: rTokenToWithdraw,
        })

        dispatch(setActiveTransactions(activeTransactions))
      }
      const uqID = getUniqueId()
      let data: any = localStorage.getItem('transactionCheck')
      data = data ? JSON.parse(data) : []
      if (data && data.includes(uqID)) {
        dispatch(setTransactionStatus('success'))
      }
    } catch (err: any) {
      const uqID = getUniqueId()
      let data: any = localStorage.getItem('transactionCheck')
      data = data ? JSON.parse(data) : []
      if (data && data.includes(uqID)) {
        setUnstakeTransactionStarted(false)
      }
      const toastContent = (
        <div>
          Transaction declined{' '}
          <CopyToClipboard text={err}>
            <Text as="u">copy error!</Text>
          </CopyToClipboard>
        </div>
      )
      posthog.capture('Unstake Modal Market Page Status', {
        Status: 'Failure',
      })
      toast.error(toastContent, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      })
    }
  }

  const handleChange = (newValue: any) => {
    if (newValue > 9_000_000_000) return
    if (rtokenWalletBalance != 0) {
      var balance = Number(getBalance(currentSelectedStakeCoin))
      var percentage = (newValue * 100) / balance
    } else {
      var percentage = (newValue * 100) / walletBalance
    }
    percentage = Math.max(0, percentage)
    if (percentage > 100) {
      setSliderValue(100)
      setRTokenAmount(newValue)
      setInputStakeAmount(newValue)
      setDepositAmount(newValue)
    } else {
      percentage = Math.round(percentage)
      if (isNaN(percentage)) {
      } else {
        setSliderValue(percentage)
        setRTokenAmount(newValue)
        setInputStakeAmount(newValue)
        setDepositAmount(newValue)
      }
    }
  }
  const handleUnstakeChange = (newValue: any) => {
    if (newValue > 9_000_000_000) return

    var percentage = (newValue * 100) / unstakeWalletBalance
    if (percentage == 100) {
      setSliderValue2(100)
      setInputUnstakeAmount(unstakeWalletBalance)
      setRTokenToWithdraw(unstakeWalletBalance)
    } else {
      percentage = Math.max(0, percentage)
      if (unstakeWalletBalance == 0) {
        setSliderValue2(0)
        setInputUnstakeAmount(0)
        setRTokenToWithdraw(0)
      }
      if (percentage > 100) {
        setSliderValue2(100)
        setRTokenToWithdraw(newValue)
      } else {
        percentage = Math.round(percentage)
        if (isNaN(percentage)) {
        } else {
          setSliderValue2(percentage)
          setRTokenToWithdraw(newValue)
        }
      }
    }
  }
  const handleDropdownClick = (dropdownName: any) => {
    dispatch(setModalDropdown(dropdownName))
  }

  const coins = [
    { BTC: 'rBTC' },
    { USDT: 'rUSDT' },
    { USDC: 'rUSDC' },
    { ETH: 'rETH' },
    { DAI: 'rDAI' },
    { STRK: 'rSTRK' },
  ]
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
  }
  const assetBalance: assetB | any = {
    USDT: useBalanceOf(tokenAddressMap['USDT']),
    USDC: useBalanceOf(tokenAddressMap['USDC']),
    BTC: useBalanceOf(tokenAddressMap['BTC']),
    ETH: useBalanceOf(tokenAddressMap['ETH']),
    DAI: useBalanceOf(tokenAddressMap['DAI']),
  }

  const coinsSupplied: any = {
    rBTC: true,
    rUSDT: true,
    rUSDC: true,
    rETH: true,
    rDAI: true,
    rSTRK: true,
  }

  const isValid = (coin: string) => {
    if (validRTokens && validRTokens.length > 0) {
      return validRTokens.find(({ rToken }: any) => rToken === coin)
    }
    return false
  }

  const rcoins: RToken[] = ['rBTC', 'rUSDT', 'rUSDC', 'rETH', 'rDAI', 'rSTRK']
  const coinObj: any = coins?.find((obj) => coin?.name in obj)
  const rcoinValue = coinObj ? coinObj[coin.name] : 'rUSDT'
  const [isSupplied, setIsSupplied] = useState(false)
  const [currentSelectedSupplyCoin, setCurrentSelectedSupplyCoin] =
    useState('BTC')
  const [currentSelectedStakeCoin, setCurrentSelectedStakeCoin] = useState(
    !nav ? rcoinValue : 'rUSDT'
  )
  const [selectedTab, setSelectedTab] = useState('stake')

  const [currentSelectedUnstakeCoin, setcurrentSelectedUnstakeCoin] = useState(
    !nav ? rcoinValue : 'rUSDT'
  )
  const userDeposit = useSelector(selectUserDeposits)
  ////console.log(coin,"coin stake")
  const [walletBalance, setWalletBalance] = useState(
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
  useEffect(() => {
    setWalletBalance(
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
  }, [walletBalances[coin?.name]?.statusBalanceOf, coin])
  const [rtokenWalletBalance, setrTokenWalletBalance] = useState(
    userDeposit?.find((item: any) => item?.rToken == currentSelectedStakeCoin)
      ?.rTokenFreeParsed
  )
  const fees = useSelector(selectFees)
  const [unstakeWalletBalance, setUnstakeWalletBalance] = useState<number>(
    stakingShares[
      currentSelectedUnstakeCoin[0] == 'r'
        ? currentSelectedUnstakeCoin
        : 'r' + currentSelectedUnstakeCoin
    ] != null
      ? stakingShares[
          currentSelectedUnstakeCoin[0] == 'r'
            ? currentSelectedUnstakeCoin
            : 'r' + currentSelectedUnstakeCoin
        ]
      : 0
  )
  useEffect(() => {
    setrTokenWalletBalance(
      userDeposit?.find((item: any) => item?.rToken == currentSelectedStakeCoin)
        ?.rTokenFreeParsed
    )
    setRToken(currentSelectedStakeCoin)
  }, [currentSelectedStakeCoin, userDeposit])

  useEffect(() => {
    setUnstakeWalletBalance(
      stakingShares[
        currentSelectedUnstakeCoin[0] == 'r'
          ? currentSelectedUnstakeCoin
          : 'r' + currentSelectedUnstakeCoin
      ] != null
        ? stakingShares[
            currentSelectedUnstakeCoin[0] == 'r'
              ? currentSelectedUnstakeCoin
              : 'r' + currentSelectedUnstakeCoin
          ]
        : 0
    )
  }, [currentSelectedUnstakeCoin, userDeposit])

  const [buttonId, setButtonId] = useState(0)
  const [isToastDisplayed, setToastDisplayed] = useState(false)

  const resetStates = () => {
    setSliderValue(0)
    setSliderValue2(0)
    setRTokenAmount(0)
    setRTokenToWithdraw(0)
    setEstrTokens(0)
    setToastDisplayed(false)
    setCurrentSelectedStakeCoin(coin ? rcoinValue : 'rBTC')
    setAsset(coin ? rcoinValue.slice(1) : 'BTC')
    setRToken(coin ? rcoinValue : 'rBTC')
    setcurrentSelectedUnstakeCoin(coin ? rcoinValue : 'rBTC')
    setUnstakeRToken(coin ? rcoinValue : 'rBTC')
    setTransactionStarted(false)
    setUnstakeTransactionStarted(false)
    setRTokenAmount(0)
    setDepositAmount(0)
    setUnstakeWalletBalance(
      stakingShares[
        currentSelectedUnstakeCoin[0] == 'r'
          ? currentSelectedUnstakeCoin
          : 'r' + currentSelectedUnstakeCoin
      ] != null
        ? stakingShares[
            currentSelectedUnstakeCoin[0] == 'r'
              ? currentSelectedUnstakeCoin
              : 'r' + currentSelectedUnstakeCoin
          ]
        : 0
    )
    setWalletBalance(
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
    dispatch(resetModalDropdowns())
    dispatch(setTransactionStatus(''))
    setCurrentTransactionStatus('')
    setDepositTransHash('')
  }

  const activeModal = Object.keys(modalDropdowns).find(
    (key) => modalDropdowns[key] === true
  )

  useEffect(() => {
    setRTokenAmount(0)
    setDepositAmount(0)
    setSliderValue(0)
  }, [currentSelectedStakeCoin])

  useEffect(() => {
    setRTokenToWithdraw(0)
    setSliderValue2(0)
  }, [currentSelectedUnstakeCoin])

  useEffect(() => {
    setRToken(coin ? rcoinValue : 'rBTC')
    setUnstakeRToken(coin ? rcoinValue : 'rBTC')
  }, [coin])

  const router = useRouter()
  const { pathname } = router
  const [estrTokens, setEstrTokens] = useState<any>(0)

  const [minimumDepositAmount, setMinimumDepositAmount] = useState<any>(0)
  const [maximumDepositAmount, setmaximumDepositAmount] = useState<any>(0)
  const minAmounts = useSelector(selectMinimumDepositAmounts)
  const maxAmounts = useSelector(selectMaximumDepositAmounts)
  useEffect(() => {
    setMinimumDepositAmount(minAmounts[currentSelectedStakeCoin])
    setmaximumDepositAmount(maxAmounts[currentSelectedStakeCoin])
  }, [currentSelectedStakeCoin, minAmounts, maxAmounts])

  useEffect(() => {
    const fetchestrTokens = async () => {
      const data = await getEstrTokens(
        currentSelectedUnstakeCoin,
        rTokenToWithdraw
      )
      setEstrTokens(data)
    }
    fetchestrTokens()
  }, [rTokenToWithdraw])

  return (
    <Box>
      {nav ? (
        <Box
          cursor={isCorrectNetwork ? 'pointer' : 'not-allowed'}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={'8px'}
          onClick={() => {
            const uqID = Math.random()
            setUniqueID(uqID)
            let data: any = localStorage.getItem('transactionCheck')
            data = data ? JSON.parse(data) : []
            if (data && !data.includes(uqID)) {
              data.push(uqID)
              localStorage.setItem('transactionCheck', JSON.stringify(data))
            }

            {
              isCorrectNetwork && onOpen()
            }
          }}
          color={router.pathname != '/waitlist' && stakeHover ? 'gray' : ''}
        >
          {router.pathname != '/waitlist' && stakeHover ? (
            <Image
              src="/stake.svg"
              alt="Picture of the author"
              width="16"
              height="16"
              style={{ cursor: isCorrectNetwork ? 'pointer' : 'not-allowed' }}
            />
          ) : (
            <Image
              src="/stake.svg"
              alt="Picture of the author"
              width="16"
              height="16"
              style={{ cursor: isCorrectNetwork ? 'pointer' : 'not-allowed' }}
            />
          )}
          <Box fontSize="14px">
            <Box position="relative" display="inline-block">
              <Text color="#676D9A">Stake</Text>
            </Box>
          </Box>
        </Box>
      ) : (
        <Text
          key="borrow-details"
          as="span"
          position="relative"
          color="#B1B0B5"
          borderBottom="1px solid #B1B0B5"
          fontSize="14px"
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight="400"
          cursor="pointer"
          _hover={{
            '::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              bottom: '-0px',
              width: '0%',
              height: '0px',
              backgroundColor: '#0969DA',
            },
          }}
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
          Stake
        </Text>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => {
          const uqID = getUniqueId()
          let data: any = localStorage.getItem('transactionCheck')
          data = data ? JSON.parse(data) : []
          if (data && data.includes(uqID)) {
            data = data.filter((val: any) => val != uqID)
            localStorage.setItem('transactionCheck', JSON.stringify(data))
          }
          onClose()
          if (transactionStarted || unstakeTransactionStarted) {
            dispatch(setTransactionStartedAndModalClosed(true))
          }
          if (setStakeHover) setStakeHover(false)
          resetStates()
        }}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay mt="3.8rem" bg="rgba(244, 242, 255, 0.5);" />

        <ModalContent
          mt="8rem"
          background="var(--Base_surface, #02010F)"
          maxW="464px"
        >
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
            {selectedTab === 'stake' ? 'Stake' : 'Unstake'}
            <Tooltip
              hasArrow
              placement="right"
              boxShadow="dark-lg"
              label={
                selectedTab === 'stake'
                  ? 'Stake the rTokens to generate additional yield.'
                  : 'Unstake the rTokens to use it as a collateral or withdraw your supply.'
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
            >
              <Box>
                <InfoIconBig />
              </Box>
            </Tooltip>
          </ModalHeader>

          <ModalCloseButton mt="1rem" mr="1rem" color="white" />

          <ModalBody color={'#E6EDF3'} pt={1} px={7}>
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              fontSize={'sm'}
            >
              <Box w="full">
                <Tabs variant="unstyled">
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
                      isDisabled={unstakeTransactionStarted == true}
                      onClick={() => {
                        setSelectedTab('stake')
                        resetStates()
                      }}
                    >
                      Stake
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
                      isDisabled={transactionStarted == true}
                      onClick={() => {
                        setSelectedTab('unstake')
                        resetStates()
                      }}
                    >
                      Unstake
                    </Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel p="0" m="0">
                      <Card
                        background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                        mb="0.5rem"
                        p="1rem"
                        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                        mt="1.5rem"
                      >
                        <Text
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontWeight="400"
                            fontStyle="normal"
                          >
                            {`${
                              !isValid(currentSelectedStakeCoin)
                                ? 'Select'
                                : 'Supply'
                            }`}{' '}
                            Market
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right"
                            boxShadow="dark-lg"
                            label="The token selected to stake on the protocol."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
                            color="#F0F0F5"
                            border="1px solid"
                            borderColor="#23233D"
                            arrowShadowColor="#2B2F35"
                            maxW="272px"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Text>
                        <Box
                          display="flex"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          justifyContent="space-between"
                          py="2"
                          pl="3"
                          pr="3"
                          mb="1rem"
                          mt="0.2rem"
                          borderRadius="md"
                          className="navbar"
                          cursor="pointer"
                          onClick={() => {
                            if (transactionStarted) {
                              return
                            } else {
                              handleDropdownClick('stakeMarketDropDown')
                            }
                          }}
                        >
                          <Box display="flex" gap="1">
                            <Box p="1">{getCoin(currentSelectedStakeCoin)}</Box>
                            <Text color="white" mt="0.1rem">
                              {currentSelectedStakeCoin}
                            </Text>
                          </Box>
                          <Box pt="1" className="navbar-button">
                            {activeModal == 'stakeMarketDropDown' ? (
                              <ArrowUp />
                            ) : (
                              <DropdownUp />
                            )}
                          </Box>
                          {modalDropdowns.stakeMarketDropDown && (
                            <Box
                              w="full"
                              left="0"
                              bg="#03060B"
                              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                              py="2"
                              className="dropdown-container"
                              boxShadow="dark-lg"
                            >
                              {rcoins?.map((_coin: RToken, index: number) => {
                                return _coin == 'rDAI' ? (
                                  ''
                                ) : (
                                  <Box
                                    key={index}
                                    as="button"
                                    w="full"
                                    display="flex"
                                    alignItems="center"
                                    gap="1"
                                    pr="2"
                                    onClick={() => {
                                      setCurrentSelectedStakeCoin(_coin)
                                      setRToken(_coin)
                                      setAsset(_coin?.slice(1) as NativeToken)
                                      setWalletBalance(
                                        walletBalances[_coin?.slice(1)]
                                          ?.statusBalanceOf === 'success'
                                          ? parseAmount(
                                              String(
                                                uint256.uint256ToBN(
                                                  walletBalances[
                                                    _coin?.slice(1)
                                                  ]?.dataBalanceOf?.balance
                                                )
                                              ),
                                              tokenDecimalsMap[_coin?.slice(1)]
                                            )
                                          : 0
                                      )
                                      // dispatch(setCoinSelectedSupplyModal(coin))
                                    }}
                                  >
                                    {_coin === currentSelectedStakeCoin && (
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
                                        _coin === currentSelectedStakeCoin
                                          ? '1'
                                          : '5'
                                      }`}
                                      pr="6px"
                                      gap="1"
                                      justifyContent="space-between"
                                      bg={`${
                                        _coin === currentSelectedStakeCoin
                                          ? '#4D59E8'
                                          : 'inherit'
                                      }`}
                                      borderRadius="md"
                                    >
                                      <Box display="flex">
                                        <Box p="1">{getCoin(_coin)}</Box>
                                        <Text color="white">{_coin}</Text>
                                      </Box>
                                      <Box
                                        fontSize="9px"
                                        color="white"
                                        mt="6px"
                                        fontWeight="thin"
                                        display="flex"
                                      >
                                        rToken Balance:{' '}
                                        {userDeposit &&
                                        userDeposit.length > 0 &&
                                        userDeposit?.find(
                                          (item: any) => item?.rToken == _coin
                                        )?.rTokenFreeParsed != null ? (
                                          numberFormatter(
                                            userDeposit?.find(
                                              (item: any) =>
                                                item?.rToken == _coin
                                            )?.rTokenFreeParsed
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
                        <Text
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                          mb="0.2rem"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontWeight="400"
                            fontStyle="normal"
                          >
                            Amount
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right"
                            boxShadow="dark-lg"
                            label="The unit of tokens you will stake on the protocol."
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
                        <Box
                          width="100%"
                          color="white"
                          border={`${
                            (rtokenWalletBalance != 0 &&
                              rTokenAmount >
                                Number(getBalance(currentSelectedStakeCoin))) ||
                            (rtokenWalletBalance == 0 &&
                              rTokenAmount > walletBalance)
                              ? '1px solid #CF222E'
                              : rTokenAmount < 0
                                ? '1px solid #CF222E'
                                : process.env.NEXT_PUBLIC_NODE_ENV ==
                                      'mainnet' &&
                                    rtokenWalletBalance == 0 &&
                                    rTokenAmount > 0 &&
                                    rTokenAmount < minimumDepositAmount
                                  ? '1px solid #CF222E'
                                  : process.env.NEXT_PUBLIC_NODE_ENV ==
                                        'mainnet' &&
                                      rtokenWalletBalance == 0 &&
                                      rTokenAmount > 0 &&
                                      rTokenAmount > maximumDepositAmount
                                    ? '1px solid #CF222E'
                                    : //do max 1209
                                      rtokenWalletBalance == 0 &&
                                        rTokenAmount <= walletBalance &&
                                        rTokenAmount > 0
                                      ? '1px solid #00D395'
                                      : rtokenWalletBalance != 0 &&
                                          rTokenAmount > 0 &&
                                          (rTokenAmount <=
                                            Number(
                                              getBalance(
                                                currentSelectedStakeCoin
                                              )
                                            ) ||
                                            rTokenAmount <= walletBalance)
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
                            outline="none"
                            step={parseFloat(
                              `${rTokenAmount <= 99999 ? 0.1 : 0}`
                            )}
                            isDisabled={transactionStarted == true}
                            _disabled={{ cursor: 'pointer' }}
                          >
                            <NumberInputField
                              placeholder={
                                process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                                rtokenWalletBalance == 0
                                  ? `min ${
                                      minimumDepositAmount == null
                                        ? 0
                                        : minimumDepositAmount
                                    } ${currentSelectedStakeCoin}`
                                  : `0.01536 ${currentSelectedStakeCoin}`
                              }
                              color={`${
                                (rtokenWalletBalance != 0 &&
                                  rTokenAmount >
                                    Number(
                                      getBalance(currentSelectedStakeCoin)
                                    )) ||
                                rTokenAmount < 0
                                  ? '#CF222E'
                                  : process.env.NEXT_PUBLIC_NODE_ENV ==
                                        'mainnet' &&
                                      rtokenWalletBalance == 0 &&
                                      rTokenAmount > 0 &&
                                      rTokenAmount < minimumDepositAmount
                                    ? '#CF222E'
                                    : process.env.NEXT_PUBLIC_NODE_ENV ==
                                          'mainnet' &&
                                        rtokenWalletBalance == 0 &&
                                        rTokenAmount > 0 &&
                                        rTokenAmount > maximumDepositAmount
                                      ? '#CF222E'
                                      : rTokenAmount == 0
                                        ? 'white'
                                        : '#00D395'
                              }`}
                              _disabled={{ color: '#00D395' }}
                              border="0px"
                              _placeholder={{
                                color: '#393D4F',
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
                          <Button
                            variant="ghost"
                            color={`${
                              (rtokenWalletBalance != 0 &&
                                rTokenAmount >
                                  Number(
                                    getBalance(currentSelectedStakeCoin)
                                  )) ||
                              (rtokenWalletBalance == 0 &&
                                rTokenAmount > walletBalance)
                                ? '#CF222E'
                                : rTokenAmount < 0
                                  ? '#CF222E'
                                  : process.env.NEXT_PUBLIC_NODE_ENV ==
                                        'mainnet' &&
                                      rtokenWalletBalance == 0 &&
                                      rTokenAmount > 0 &&
                                      rTokenAmount < minimumDepositAmount
                                    ? '#CF222E'
                                    : process.env.NEXT_PUBLIC_NODE_ENV ==
                                          'mainnet' &&
                                        rtokenWalletBalance == 0 &&
                                        rTokenAmount > 0 &&
                                        rTokenAmount > maximumDepositAmount
                                      ? '#CF222E'
                                      : rTokenAmount == 0
                                        ? '#4D59E8'
                                        : '#00D395'
                            }`}
                            _hover={{
                              bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
                            }}
                            onClick={() => {
                              if (rtokenWalletBalance != 0) {
                                setRTokenAmount(rtokenWalletBalance)
                                setInputStakeAmount(rtokenWalletBalance)
                                setDepositAmount(rtokenWalletBalance)
                                setSliderValue(100)
                              } else {
                                setRTokenAmount(walletBalance)
                                setInputStakeAmount(walletBalance)
                                setDepositAmount(walletBalance)
                                setSliderValue(100)
                              }
                            }}
                            isDisabled={transactionStarted == true}
                            _disabled={{ cursor: 'pointer' }}
                          >
                            MAX
                          </Button>
                        </Box>
                        {(rtokenWalletBalance != 0 &&
                          rTokenAmount >
                            Number(getBalance(currentSelectedStakeCoin))) ||
                        (rtokenWalletBalance == 0 &&
                          rTokenAmount > walletBalance) ||
                        rTokenAmount < 0 ||
                        (process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                          rtokenWalletBalance == 0 &&
                          rTokenAmount > 0 &&
                          rTokenAmount < minimumDepositAmount) ||
                        (rtokenWalletBalance == 0 &&
                          rTokenAmount > 0 &&
                          rTokenAmount > maximumDepositAmount) ? (
                          <Text
                            display="flex"
                            justifyContent="space-between"
                            color="#E6EDF3"
                            mt="0.4rem"
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
                                {(rtokenWalletBalance != 0 &&
                                  rTokenAmount > rtokenWalletBalance) ||
                                (rtokenWalletBalance != 0 &&
                                  rTokenAmount > walletBalance)
                                  ? 'Amount exceeds balance'
                                  : process.env.NEXT_PUBLIC_NODE_ENV ==
                                        'mainnet' &&
                                      rtokenWalletBalance == 0 &&
                                      rTokenAmount > 0 &&
                                      rTokenAmount < minimumDepositAmount
                                    ? 'Less than min amount'
                                    : process.env.NEXT_PUBLIC_NODE_ENV ==
                                          'mainnet' &&
                                        rtokenWalletBalance == 0 &&
                                        rTokenAmount > 0 &&
                                        rTokenAmount > maximumDepositAmount
                                      ? 'More than max amount'
                                      : 'Invalid Input'}{' '}
                              </Text>
                            </Text>
                            <Text
                              color="#C7CBF6"
                              display="flex"
                              justifyContent="flex-end"
                            >
                              {rtokenWalletBalance == 0
                                ? 'Wallet Balance: '
                                : `rToken Balance: `}
                              {rtokenWalletBalance == 0 ? (
                                numberFormatter(walletBalance)
                              ) : rtokenWalletBalance !== undefined ? (
                                numberFormatter(rtokenWalletBalance)
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
                              <Text color="#676D9A" ml="0.2rem">
                                {` ${currentSelectedStakeCoin}`}
                              </Text>
                            </Text>
                          </Text>
                        ) : (
                          <Text
                            color="#C7CBF6"
                            display="flex"
                            justifyContent="flex-end"
                            mt="0.4rem"
                            fontSize="12px"
                            fontWeight="500"
                            fontStyle="normal"
                            fontFamily="Inter"
                          >
                            {rtokenWalletBalance == 0
                              ? 'Wallet Balance: '
                              : `rToken Balance: `}
                            {rtokenWalletBalance == 0 ? (
                              numberFormatter(walletBalance)
                            ) : rtokenWalletBalance !== undefined ? (
                              numberFormatter(rtokenWalletBalance)
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
                            {/* {walletBalance} */}
                            <Text color="#676D9A" ml="0.2rem">
                              {rtokenWalletBalance == 0
                                ? currentSelectedStakeCoin.slice(1)
                                : currentSelectedStakeCoin}
                            </Text>
                          </Text>
                        )}
                        <Box pt={5} pb={2} mt="1rem">
                          <Slider
                            aria-label="slider-ex-6"
                            defaultValue={sliderValue}
                            value={sliderValue}
                            onChange={(val) => {
                              setSliderValue(val)
                              if (rtokenWalletBalance == 0) {
                                var ans = (val / 100) * walletBalance
                              } else {
                                var ans = (val / 100) * rtokenWalletBalance
                              }
                              if (val == 100) {
                                if (rtokenWalletBalance == 0) {
                                  setRTokenAmount(walletBalance)
                                  setInputStakeAmount(walletBalance)
                                  setDepositAmount(walletBalance)
                                } else {
                                  setRTokenAmount(rtokenWalletBalance)
                                  setInputStakeAmount(rtokenWalletBalance)
                                  setDepositAmount(rtokenWalletBalance)
                                }
                              } else {
                                if (ans < 10) {
                                  setRTokenAmount(parseFloat(ans.toFixed(7)))
                                  setInputStakeAmount(
                                    parseFloat(ans.toFixed(7))
                                  )
                                  setDepositAmount(parseFloat(ans.toFixed(7)))
                                } else {
                                  ans = Math.round(ans * 100) / 100
                                  setRTokenAmount(ans)
                                  setInputStakeAmount(ans)
                                  setDepositAmount(ans)
                                }
                                // dispatch(setInputSupplyAmount(ans))
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
                      </Card>

                      <Card
                        background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                        mt="1rem"
                        p="1rem"
                        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                      >
                        <Text
                          color="#676D9A"
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
                              font-size="12px"
                              color="#676D9A"
                            >
                              Staking rewards:
                            </Text>
                            <Tooltip
                              hasArrow
                              placement="right"
                              boxShadow="dark-lg"
                              label="Rewards earned in staking activities within the protocol."
                              bg="#02010F"
                              fontSize={'13px'}
                              fontWeight={'400'}
                              borderRadius={'lg'}
                              padding={'2'}
                              color="#F0F0F5"
                              border="1px solid"
                              borderColor="#23233D"
                              arrowShadowColor="#2B2F35"
                              maxW="282px"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Text>
                          <Text color="#676D9A">
                            {protocolStats?.find(
                              (stat: any) =>
                                stat.token ==
                                (currentSelectedStakeCoin[0] == 'r'
                                  ? currentSelectedStakeCoin.slice(1)
                                  : currentSelectedStakeCoin)
                            )?.stakingRate
                              ? protocolStats?.find(
                                  (stat: any) =>
                                    stat.token ==
                                    (currentSelectedStakeCoin[0] == 'r'
                                      ? currentSelectedStakeCoin.slice(1)
                                      : currentSelectedStakeCoin)
                                )?.stakingRate
                              : '1.2'}
                            %
                          </Text>
                        </Text>
                        <Text
                          color="#676D9A"
                          display="flex"
                          justifyContent="space-between"
                          fontSize="12px"
                        >
                          <Text display="flex" alignItems="center">
                            <Text
                              mr="0.2rem"
                              font-style="normal"
                              font-weight="400"
                              font-size="12px"
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
                          <Text color="#676D9A">{fees.stake}%</Text>
                        </Text>
                      </Card>

                      <Box
                        display="flex"
                        justifyContent="left"
                        w="100%"
                        pb="2"
                        pt="4"
                      >
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
                          The staked rTokens cannot be used as collateral until
                          unstaked.
                        </Box>
                      </Box>

                      {isValid(currentSelectedStakeCoin) &&
                      userDeposit?.find(
                        (item: any) => item?.rToken == currentSelectedStakeCoin
                      )?.rTokenFreeParsed ? (
                        rTokenAmount > 0 &&
                        rTokenAmount <= rtokenWalletBalance ? (
                          buttonId == 1 ? (
                            <SuccessButton successText="Stake success" />
                          ) : buttonId == 2 ? (
                            <ErrorButton errorText="Copy error!" />
                          ) : (
                            <Box
                              onClick={() => {
                                setTransactionStarted(true)
                                if (transactionStarted == false) {
                                  posthog.capture(
                                    'Stake Button Clicked Market page',
                                    {
                                      'Stake Clicked': true,
                                    }
                                  )
                                  dispatch(
                                    setTransactionStartedAndModalClosed(false)
                                  )
                                  handleStakeTransaction()
                                }
                              }}
                            >
                              <AnimatedButton
                                color="#676D9A"
                                size="sm"
                                width="100%"
                                mt=".8rem"
                                mb="1rem"
                                background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                                border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                                labelSuccessArray={[
                                  'Processing',
                                  'Checking for sufficient rtoken balance.',
                                  'Transferring rTokens to the supply vault',
                                  'Updating the supply records.',
                                  <SuccessButton
                                    key={'successButton'}
                                    successText={'Stake successful.'}
                                  />,
                                ]}
                                _disabled={{ bgColor: 'white', color: 'black' }}
                                isDisabled={transactionStarted == true}
                                labelErrorArray={[
                                  <ErrorButton
                                    errorText="Transaction failed"
                                    key={'error1'}
                                  />,
                                  <ErrorButton
                                    errorText="Copy error!"
                                    key={'error2'}
                                  />,
                                ]}
                                currentTransactionStatus={
                                  currentTransactionStatus
                                }
                                setCurrentTransactionStatus={
                                  setCurrentTransactionStatus
                                }
                              >
                                Stake
                              </AnimatedButton>
                            </Box>
                          )
                        ) : (
                          <Button
                            background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                            color="#676D9A"
                            size="sm"
                            width="100%"
                            mt=".8rem"
                            mb="1rem"
                            _hover={{
                              bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
                            }}
                          >
                            {`${
                              !isValid(currentSelectedStakeCoin) &&
                              userDeposit?.find(
                                (item: any) =>
                                  item?.rToken == currentSelectedStakeCoin
                              )?.rTokenFreeParsed != 0
                                ? 'Stake and Supply'
                                : 'Stake'
                            }`}
                          </Button>
                        )
                      ) : rTokenAmount > 0 &&
                        rTokenAmount <= walletBalance &&
                        (process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet'
                          ? rtokenWalletBalance == 0 &&
                            rTokenAmount > minimumDepositAmount
                          : true) &&
                        (process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet'
                          ? rtokenWalletBalance == 0 &&
                            rTokenAmount < maximumDepositAmount
                          : true) ? (
                        buttonId == 1 ? (
                          <SuccessButton successText="Stake success" />
                        ) : buttonId == 2 ? (
                          <ErrorButton errorText="Copy error!" />
                        ) : (
                          <Box
                            onClick={() => {
                              setTransactionStarted(true)
                              if (transactionStarted == false) {
                                posthog.capture(
                                  'Stake Button Clicked Market page',
                                  {
                                    'Stake Clicked': true,
                                  }
                                )
                                dispatch(
                                  setTransactionStartedAndModalClosed(false)
                                )
                                hanldeStakeAndSupplyTransaction()
                              }
                            }}
                          >
                            <AnimatedButton
                              background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                              color="#676D9A"
                              size="sm"
                              width="100%"
                              mt=".8rem"
                              mb="1rem"
                              labelSuccessArray={[
                                'Processing',
                                'Checking for sufficient rtoken balance.',
                                'Transferring rTokens to the supply vault',
                                'Updating the supply records.',
                                <SuccessButton
                                  key={'successButton'}
                                  successText={'Stake successful.'}
                                />,
                              ]}
                              _disabled={{ bgColor: 'white', color: 'black' }}
                              isDisabled={transactionStarted == true}
                              labelErrorArray={[
                                <ErrorButton
                                  errorText="Transaction failed"
                                  key={'error1'}
                                />,
                                <ErrorButton
                                  errorText="Copy error!"
                                  key={'error2'}
                                />,
                              ]}
                              currentTransactionStatus={
                                currentTransactionStatus
                              }
                              setCurrentTransactionStatus={
                                setCurrentTransactionStatus
                              }
                            >
                              Stake and Supply
                            </AnimatedButton>
                          </Box>
                        )
                      ) : (
                        <Button
                          color="#676D9A"
                          size="sm"
                          width="100%"
                          mt=".8rem"
                          mb="1rem"
                          background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          _hover={{
                            bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
                          }}
                        >
                          {`${
                            !isValid(currentSelectedStakeCoin) &&
                            userDeposit?.find(
                              (item: any) =>
                                item?.rToken == currentSelectedStakeCoin
                            )?.rTokenFreeParsed > 0
                              ? 'Stake'
                              : 'Stake and Supply'
                          }`}
                        </Button>
                      )}
                    </TabPanel>

                    <TabPanel p="0" m="0">
                      <Card
                        mb="0.5rem"
                        p="1rem"
                        background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                        mt="1.5rem"
                      >
                        <Text
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontWeight="400"
                            fontStyle="normal"
                          >
                            Select Market
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right"
                            boxShadow="dark-lg"
                            label="The token selected to unstake on the protocol."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
                            color="#F0F0F5"
                            border="1px solid"
                            borderColor="#23233D"
                            arrowShadowColor="#2B2F35"
                            maxW="272px"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Text>

                        <Box
                          display="flex"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          justifyContent="space-between"
                          py="2"
                          pl="3"
                          pr="3"
                          mb="1rem"
                          mt="0.2rem"
                          borderRadius="md"
                          className="navbar"
                          cursor="pointer"
                          onClick={() => {
                            if (unstakeTransactionStarted == true) {
                              return
                            } else {
                              handleDropdownClick('unstakeMarketDropDown')
                            }
                          }}
                        >
                          <Box display="flex" gap="1">
                            <Box p="1">
                              {getCoin(currentSelectedUnstakeCoin)}
                            </Box>
                            <Text color="white" mt="0.1rem">
                              {currentSelectedUnstakeCoin}
                            </Text>
                          </Box>
                          <Box pt="1" className="navbar-button">
                            {activeModal == 'unstakeMarketDropDown' ? (
                              <ArrowUp />
                            ) : (
                              <DropdownUp />
                            )}
                          </Box>

                          {modalDropdowns.unstakeMarketDropDown && (
                            <Box
                              w="full"
                              left="0"
                              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                              bg="#03060B"
                              py="2"
                              className="dropdown-container"
                              boxShadow="dark-lg"
                            >
                              {rcoins?.map((_coin: RToken, index: number) => {
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
                                      setcurrentSelectedUnstakeCoin(_coin)
                                      setUnstakeRToken(_coin)
                                    }}
                                  >
                                    {_coin === currentSelectedUnstakeCoin && (
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
                                        _coin === currentSelectedUnstakeCoin
                                          ? '1'
                                          : '5'
                                      }`}
                                      pr="6px"
                                      gap="1"
                                      justifyContent="space-between"
                                      bg={`${
                                        _coin === currentSelectedUnstakeCoin
                                          ? '#4D59E8'
                                          : 'inherit'
                                      }`}
                                      borderRadius="md"
                                    >
                                      <Box display="flex">
                                        <Box p="1">{getCoin(_coin)}</Box>
                                        <Text color="white">{_coin}</Text>
                                      </Box>
                                      <Box
                                        fontSize="9px"
                                        color="white"
                                        mt="6px"
                                        fontWeight="thin"
                                        display="flex"
                                      >
                                        Staking shares:{' '}
                                        {stakingShares != null &&
                                        stakingShares[_coin] != null &&
                                        stakingShares[_coin] != undefined &&
                                        !isNaN(stakingShares[_coin]) ? (
                                          numberFormatter(stakingShares[_coin])
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

                        <Text
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontWeight="400"
                            fontStyle="normal"
                          >
                            Amount
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right"
                            boxShadow="dark-lg"
                            label="The unit of tokens to unstake from the protocol."
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

                        <Box
                          width="100%"
                          color="white"
                          mt="0.2rem"
                          border={`${
                            rTokenToWithdraw > unstakeWalletBalance
                              ? '1px solid #CF222E'
                              : rTokenToWithdraw < 0
                                ? '1px solid #CF222E'
                                : rTokenToWithdraw > 0 &&
                                    rTokenToWithdraw <= unstakeWalletBalance
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
                            onChange={handleUnstakeChange}
                            value={rTokenToWithdraw ? rTokenToWithdraw : ''}
                            outline="none"
                            step={parseFloat(
                              `${rTokenToWithdraw <= 99999 ? 0.1 : 0}`
                            )}
                            isDisabled={unstakeTransactionStarted == true}
                            _disabled={{ cursor: 'pointer' }}
                          >
                            <NumberInputField
                              placeholder={`0.01536 ${currentSelectedUnstakeCoin}`}
                              color={`${
                                rTokenToWithdraw > unstakeWalletBalance
                                  ? '#CF222E'
                                  : rTokenToWithdraw < 0
                                    ? '#CF222E'
                                    : rTokenToWithdraw == 0
                                      ? 'white'
                                      : '#00D395'
                              }`}
                              _disabled={{ cursor: 'pointer' }}
                              border="0px"
                              _placeholder={{
                                color: '#393D4F',
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

                          <Button
                            variant="ghost"
                            color={`${
                              rTokenToWithdraw > unstakeWalletBalance
                                ? '#CF222E'
                                : rTokenToWithdraw < 0
                                  ? '#CF222E'
                                  : rTokenToWithdraw == 0
                                    ? '#4D59E8'
                                    : '#00D395'
                            }`}
                            _hover={{
                              bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
                            }}
                            onClick={() => {
                              setRTokenToWithdraw(unstakeWalletBalance)
                              setSliderValue2(100)
                            }}
                            isDisabled={unstakeTransactionStarted == true}
                            _disabled={{ cursor: 'pointer' }}
                          >
                            MAX
                          </Button>
                        </Box>

                        {(rTokenToWithdraw > unstakeWalletBalance ||
                          rTokenToWithdraw < 0) &&
                        coinsSupplied[currentSelectedUnstakeCoin] ? (
                          <Text
                            display="flex"
                            justifyContent="space-between"
                            color="#E6EDF3"
                            mt="0.4rem"
                            fontSize="12px"
                            fontWeight="500"
                            fontStyle="normal"
                            fontFamily="Inter"
                            whiteSpace="nowrap"
                          >
                            <Text color="#CF222E" display="flex">
                              <Text mt="0.2rem">
                                <SmallErrorIcon />{' '}
                              </Text>
                              <Text ml="0.3rem">
                                {rTokenToWithdraw > unstakeWalletBalance
                                  ? 'Amount exceeds balance'
                                  : 'Invalid Input'}{' '}
                              </Text>
                            </Text>
                            <Text
                              color="#C7CBF6"
                              display="flex"
                              justifyContent="flex-end"
                            >
                              Staking Shares:{' '}
                              {stakingShares &&
                              stakingShares[
                                currentSelectedUnstakeCoin[0] == 'r'
                                  ? currentSelectedUnstakeCoin
                                  : 'r' + currentSelectedUnstakeCoin
                              ] != null ? (
                                numberFormatter(
                                  stakingShares[
                                    currentSelectedUnstakeCoin[0] == 'r'
                                      ? currentSelectedUnstakeCoin
                                      : 'r' + currentSelectedUnstakeCoin
                                  ]
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
                              <Text color="#6E7781" ml="0.2rem">
                                shares
                              </Text>
                            </Text>
                          </Text>
                        ) : (
                          <Text
                            color="#C7CBF6"
                            display="flex"
                            justifyContent="flex-end"
                            mt="0.4rem"
                            fontSize="12px"
                            fontWeight="500"
                            fontStyle="normal"
                            fontFamily="Inter"
                          >
                            Staking Shares:{' '}
                            {stakingShares &&
                            stakingShares[
                              currentSelectedUnstakeCoin[0] == 'r'
                                ? currentSelectedUnstakeCoin
                                : 'r' + currentSelectedUnstakeCoin
                            ] != null ? (
                              numberFormatter(
                                stakingShares[
                                  currentSelectedUnstakeCoin[0] == 'r'
                                    ? currentSelectedUnstakeCoin
                                    : 'r' + currentSelectedUnstakeCoin
                                ]
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
                            <Text color="#676D9A" ml="0.4rem">
                              {'shares'}
                            </Text>
                          </Text>
                        )}

                        <Box pt={5} pb={2} mt="1rem">
                          <Slider
                            aria-label="slider-ex-6"
                            defaultValue={sliderValue2}
                            value={sliderValue2}
                            onChange={(val) => {
                              setSliderValue2(val)
                              if (val == 100) {
                                setRTokenToWithdraw(unstakeWalletBalance)
                              } else {
                                var ans = (val / 100) * unstakeWalletBalance
                                if (ans < 10) {
                                  setRTokenToWithdraw(
                                    parseFloat(ans.toFixed(7))
                                  )
                                } else {
                                  ans = Math.round(ans * 100) / 100
                                  setRTokenToWithdraw(ans)
                                }
                              }
                            }}
                            isDisabled={unstakeTransactionStarted == true}
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
                      </Card>

                      <Card
                        mt="1rem"
                        p="1rem"
                        background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                      >
                        <Text
                          color="#676D9A"
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
                              font-size="12px"
                              color="#676D9A"
                            >
                              est. rTokens:
                            </Text>
                            <Tooltip
                              hasArrow
                              placement="right"
                              boxShadow="dark-lg"
                              label="Estimation of token amount you may receive after the transaction."
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
                          {unstakeWalletBalance ? (
                            <Text color="#676D9A">
                              {estrTokens?.toFixed(4)}
                            </Text>
                          ) : (
                            <Text color="#676D9A">0</Text>
                          )}
                        </Text>
                        {/* <Text
                          color="#676D9A"
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
                              font-size="12px"
                              color="#676D9A"
                            >
                              Gas estimate:
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
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Text>
                          <Text color="#676D9A">$ 0.91</Text>
                        </Text> */}
                        <Text
                          color="#676D9A"
                          display="flex"
                          justifyContent="space-between"
                          fontSize="12px"
                        >
                          <Text display="flex" alignItems="center">
                            <Text
                              mr="0.2rem"
                              font-style="normal"
                              font-weight="400"
                              font-size="12px"
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
                          <Text color="#676D9A">{fees.unstake}%</Text>
                        </Text>
                      </Card>

                      {rTokenToWithdraw > 0 &&
                      rTokenToWithdraw <= unstakeWalletBalance ? (
                        <Box
                          onClick={() => {
                            setUnstakeTransactionStarted(true)
                            if (unstakeTransactionStarted == false) {
                              posthog.capture(
                                'Unstake Button Clicked Market page',
                                {
                                  'Unstake Clicked': true,
                                }
                              )
                              dispatch(
                                setTransactionStartedAndModalClosed(false)
                              )
                              hanldeUnstakeTransaction()
                            }
                          }}
                        >
                          <AnimatedButton
                            color="#676D9A"
                            size="sm"
                            width="100%"
                            mt="1.5rem"
                            mb="1.5rem"
                            background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                            labelSuccessArray={[
                              'Processing',
                              'Unstake amount matches staked rToken balance',
                              'Unstaking the rTokens.',
                              'Transferring to the user account',
                              <SuccessButton
                                key={'successButton'}
                                successText={'Unstake successful.'}
                              />,
                            ]}
                            labelErrorArray={[
                              <ErrorButton
                                errorText="Transaction failed"
                                key={'error1'}
                              />,
                              <ErrorButton
                                errorText="Copy error!"
                                key={'error2'}
                              />,
                            ]}
                            currentTransactionStatus={currentTransactionStatus}
                            setCurrentTransactionStatus={
                              setCurrentTransactionStatus
                            }
                            _disabled={{ bgColor: 'white', color: 'black' }}
                            isDisabled={unstakeTransactionStarted == true}
                          >
                            Unstake
                          </AnimatedButton>
                        </Box>
                      ) : (
                        <Button
                          color="#676D9A"
                          size="sm"
                          width="100%"
                          mt="1.5rem"
                          mb="1.5rem"
                          background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          _hover={{
                            bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
                          }}
                        >
                          Unstake
                        </Button>
                      )}
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default StakeUnstakeModal
