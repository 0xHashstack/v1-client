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
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import TransactionFees from '../../../TransactionFees.json'
/* Coins logo import  */
import DAILogo from '@/assets/icons/coins/dai'
import ETHLogo from '@/assets/icons/coins/eth'
import SmallEth from '@/assets/icons/coins/smallEth'
import SmallUsdt from '@/assets/icons/coins/smallUsdt'
import USDCLogo from '@/assets/icons/coins/usdc'
import USDTLogo from '@/assets/icons/coins/usdt'
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
import {
  resetModalDropdowns,
  selectModalDropDowns,
  selectNavDropdowns,
  setModalDropdown,
} from '@/store/slices/dropdownsSlice'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BTCLogo from '../../assets/icons/coins/btc'
import DropdownUp from '../../assets/icons/dropdownUpIcon'
import InfoIcon from '../../assets/icons/infoIcon'
import AnimatedButton from '../uiElements/buttons/AnimationButton'

import useBalanceOf from '@/Blockchain/hooks/Reads/useBalanceOf'
import useAddCollateral from '@/Blockchain/hooks/Writes/useAddCollateral'
import useLiquidity from '@/Blockchain/hooks/Writes/useLiquidity'
import useRepay from '@/Blockchain/hooks/Writes/useRepay'
import useRevertInteractWithL3 from '@/Blockchain/hooks/Writes/useRevertInteractWithL3'
import { ILoan, NativeToken } from '@/Blockchain/interfaces/interfaces'
import { getExistingLoanHealth } from '@/Blockchain/scripts/LoanHealth'
import { getrTokensMinted } from '@/Blockchain/scripts/Rewards'
import { effectivAPRLoan } from '@/Blockchain/scripts/userStats'
import { getTokenFromAddress } from '@/Blockchain/stark-constants'
import {
  getTokenFromName,
  tokenAddressMap,
  tokenDecimalsMap,
} from '@/Blockchain/utils/addressServices'
import { BNtoNum, parseAmount } from '@/Blockchain/utils/utils'
import ArrowUp from '@/assets/icons/arrowup'
import STRKLogo from '@/assets/icons/coins/strk'
import WarningIcon from '@/assets/icons/coins/warningIcon'
import MySwap from '@/assets/icons/dapps/mySwap'
import InfoIconBig from '@/assets/icons/infoIconBig'
import BtcToDai from '@/assets/icons/pools/btcToDai'
import BtcToUsdc from '@/assets/icons/pools/btcToUsdc'
import StrkToEth from '@/assets/icons/pools/strkToEth'
import UsdcToDai from '@/assets/icons/pools/usdcToDai'
import UsdtToDai from '@/assets/icons/pools/usdtToDai'
import SmallErrorIcon from '@/assets/icons/smallErrorIcon'
import {
  selectAprAndHealthFactor,
  selectEffectiveApr,
  selectFees,
  selectHealthFactor,
  selectJediSwapPoolsSupported,
  selectJediswapPoolAprs,
  selectMaximumDepositAmounts,
  selectMinimumDepositAmounts,
  selectMySwapPoolsSupported,
  selectOraclePrices,
  selectProtocolStats,
  selectUserDeposits,
  selectUserLoans,
} from '@/store/slices/readDataSlice'
import {
  selectActiveTransactions,
  selectJedistrkTokenAllocation,
  selectStrkAprData,
  selectWalletBalance,
  selectnetSpendBalance,
  setActiveTransactions,
  // setCurrentTransactionStatus,
  setInputYourBorrowModalRepayAmount,
  setTransactionStartedAndModalClosed,
  setTransactionStatus,
} from '@/store/slices/userAccountSlice'
import dollarConvertor from '@/utils/functions/dollarConvertor'
import numberFormatter from '@/utils/functions/numberFormatter'
import numberFormatterPercentage from '@/utils/functions/numberFormatterPercentage'
import { useAccount, useWaitForTransaction } from '@starknet-react/core'
import axios from 'axios'
import { getAddress } from 'ethers/lib/utils'
import mixpanel from 'mixpanel-browser'
import Image from 'next/image'
import posthog from 'posthog-js'
import CopyToClipboard from 'react-copy-to-clipboard'
import { toast } from 'react-toastify'
import { Account, uint256 } from 'starknet'
import useSwap from '../../Blockchain/hooks/Writes/useSwap'
import {
  getJediEstimateLiquiditySplit,
  getJediEstimatedLiqALiqBfromLp,
  getJediEstimatedLpAmountOut,
  getJediSwapLiquidityRevertCalldata,
  getJediSwapRevertCalldata,
  getJediswapCallData,
  getJediswapLiquidityCallData,
  getMySwapEstimateLiquiditySplit,
  getMySwapEstimatedLpAmountOut,
  getMySwapLiquidityRevertCalldata,
  getMySwapRevertCalldata,
  getMyswapCallData,
  getMyswapLiquidityCallData,
  getzklendRevertCallData,
} from '../../Blockchain/scripts/l3interaction'
import ErrorButton from '../uiElements/buttons/ErrorButton'
import SuccessButton from '../uiElements/buttons/SuccessButton'
import SliderTooltip from '../uiElements/sliders/sliderTooltip'

const YourBorrowModal = ({
  borrowIDCoinMap,
  currentID,
  currentMarket,
  currentBorrowId1,
  setCurrentBorrowId1,
  currentBorrowMarketCoin1,
  setCurrentBorrowMarketCoin1,
  currentBorrowId2,
  setCurrentBorrowId2,
  currentBorrowMarketCoin2,
  setCurrentBorrowMarketCoin2,
  collateralBalance,
  setCollateralBalance,
  currentLoanAmount,
  setCurrentLoanAmount,
  setCurrentLoanMarket,
  currentLoanMarket,
  borrowIds,
  buttonText,
  BorrowBalance,
  loan,
  borrowAPRs,
  borrow,
  spendType,
  setSpendType,
  allSplit,
  currentLoanAmountParsed,
  ...restProps
}: any) => {
  // useEffect(() => {}, []);
  ////console.log(currentBorrowId1);
  ////console.log(currentID)
  ////console.log(borrowIds);
  ////console.log("took map", borrowIDCoinMap, currentID, currentMarket);
  ////console.log();

  const { isOpen, onOpen, onClose } = useDisclosure()
  // const dispatch = useDispatch();
  const dispatch = useDispatch()
  const [minimumDepositAmount, setMinimumDepositAmount] = useState<any>(0)
  const [maximumDepositAmount, setmaximumDepositAmount] = useState<any>(0)
  const [sliderValue1, setSliderValue1] = useState(0)
  const modalDropdowns = useSelector(selectModalDropDowns)
  const [inputAmount1, setinputAmount1] = useState(0)
  // const [currentBorrowId, setCurrentBorrowId] = useState(currentBorrowId1.slice(currentBorrowId1.indexOf("-") + 1).trim());
  ////console.log(currentBorrowId);
  const [transactionStarted, setTransactionStarted] = useState(false)
  const [collateralTransactionStarted, setCollateralTransactionStarted] =
    useState(false)
  const [borrowAmount, setBorrowAmount] = useState(BorrowBalance)
  const userLoans = useSelector(selectUserLoans)
  const reduxProtocolStats = useSelector(selectProtocolStats)
  const oraclePrices = useSelector(selectOraclePrices)
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
  useEffect(() => {
    const result = userLoans.find(
      (item: any) =>
        item?.loanId ==
        currentBorrowId1.slice(currentBorrowId1.indexOf('-') + 1).trim()
    )
    setBorrowAmount(result?.loanAmountParsed)
    setCurrentLoanMarket(result?.currentLoanMarket)
    setCurrentLoanAmount(result?.currentLoanAmount)
    setCurrentPool('Select a pool')
    setCurrentDapp('Select a dapp')
    setCurrentPoolCoin('Select a pool')
    ////console.log(borrowAmount)
    // Rest of your code using the 'result' variable
  }, [currentBorrowId1])
  // const avgs = useSelector(selectAprAndHealthFactor);
  const avgs = useSelector(selectEffectiveApr)
  const avgsLoneHealth = useSelector(selectHealthFactor)
  const avgsData: any = []
  const { address } = useAccount()
  const [uniqueID, setUniqueID] = useState(0)
  const getUniqueId = () => uniqueID
  let matchedObject = allSplit?.find(
    (obj: { loanId: any }) =>
      obj.loanId ===
      Number(currentBorrowId1.slice(currentBorrowId1.indexOf('-') + 1).trim())
  )
  // useEffect(() => {
  //   const fetchAprs = async () => {
  //     if (avgs?.length == 0) {
  //       for (var i = 0; i < userLoans?.length; i++) {
  //         const avg = await effectivAPRLoan(
  //           userLoans[i],
  //           reduxProtocolStats,
  //           oraclePrices
  //         );
  //         const healthFactor = await getExistingLoanHealth(
  //           userLoans[i]?.loanId
  //         );
  //         const data = {
  //           loanId: userLoans[i]?.loanId,
  //           avg: avg,
  //           loanHealth: healthFactor,
  //         };
  //         // avgs.push(data)
  //         avgsData.push(data);
  //         // avgs.push()
  //       }
  //       //cc
  //       setAvgs(avgsData);
  //     }
  //   };
  //   if (oraclePrices && reduxProtocolStats && userLoans) fetchAprs();
  //  //console.log("running");
  // }, [oraclePrices, reduxProtocolStats, userLoans]);
  const {
    loanId,
    setLoanId,
    collateralAsset,
    setCollateralAsset,
    collateralAmount,
    setCollateralAmount,

    rToken,
    setRToken,
    rTokenAmount,
    setRTokenAmount,

    dataAddCollateral,
    errorAddCollateral,
    resetAddCollateral,
    writeAddCollateral,
    writeAsyncAddCollateral,
    isErrorAddCollateral,
    isIdleAddCollateral,
    isSuccessAddCollateral,
    statusAddCollateral,

    dataAddCollateralRToken,
    errorAddCollateralRToken,
    resetAddCollateralRToken,
    writeAddCollateralRToken,
    writeAsyncAddCollateralRToken,
    isErrorAddCollateralRToken,
    isIdleAddCollateralRToken,
    isSuccessAddCollateralRToken,
    statusAddCollateralRToken,
  } = useAddCollateral()

  const {
    repayAmount,
    setRepayAmount,
    setLoan,
    // handleApprove,
    writeAsyncRepay,
    transRepayHash,
    setTransRepayHash,
    // repayTransactionReceipt,
    errorRepay,

    //SelfLiquidate - Repay with 0 amount
    writeAsyncSelfLiquidate,
    errorSelfLiquidate,
    // selfLiquidateTransactionReceipt,
    setIsSelfLiquidateHash,
  } = useRepay(loan)

  const {
    swapLoanId,
    setSwapLoanId,
    toMarket,
    setToMarket,
    callDataSwap,
    setcallDataSwap,
    dataJediSwap_swap,
    errorJediSwap_swap,
    writeJediSwap_swap,
    writeAsyncJediSwap_swap,
    isIdleJediSwap_swap,
    statusJediSwap_swap,

    datamySwap_swap,
    errormySwap_swap,
    writemySwap_swap,
    writeAsyncmySwap_swap,
    isIdlemySwap_swap,
    statusmySwap_swap,
  } = useSwap()

  const {
    liquidityLoanId,
    setLiquidityLoanId,
    toMarketA,
    setToMarketA,

    toMarketB,
    setToMarketB,
    callDataLiquidity,
    setcallDataLiquidity,
    dataJediSwap_addLiquidity,
    errorJediSwap_addLiquidity,
    writeJediSwap_addLiquidity,
    writeAsyncJediSwap_addLiquidity,
    isIdleJediSwap_addLiquidity,
    statusJediSwap_addLiquidity,

    datamySwap_addLiquidity,
    errormySwap_addLiquidity,
    writemySwap_addLiquidity,
    writeAsyncmySwap_addLiquidity,
    isIdlemySwap_addLiquidity,
    statusmySwap_addLiquidity,
  } = useLiquidity()
  const {
    revertLoanId,
    setRevertLoanId,
    revertcallData,
    setrevertcallData,
    dataRevertInteractWithL3,
    writeAsyncRevertInteractWithL3,
    writeRevertInteractWithL3,
    errorRevertInteractWithL3,
    isIdleRevertInteractWithL3,
  } = useRevertInteractWithL3()
  const poolsPairs = useSelector(selectJediSwapPoolsSupported)
  const mySwapPoolPairs = useSelector(selectMySwapPoolsSupported)
  const handleRepayBorrow = async () => {
    // if (!repayAmount && loan?.loanId! && !diamondAddress) {
    //   return;
    // }
    // if (!repayAmount || repayAmount < 0) {
    if (!repayAmount || repayAmount < 0) {
      return
    }
    try {
      const val = await writeAsyncRepay()
      setTransRepayHash(val?.transaction_hash)
      if (val?.transaction_hash) {
        const toastid = toast.info(`Transaction pending `, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: false,
        })
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
          transaction_hash: val?.transaction_hash.toString(),
          message: `You have successfully repaid`,
          toastId: toastid,
          setCurrentTransactionStatus: setCurrentTransactionStatus,
          uniqueID: uqID,
        }
        // addTransaction({ hash: deposit?.transaction_hash });
        activeTransactions?.push(trans_data)
        posthog.capture('Repay Borrow Status', {
          Status: 'Success',
          'Loan ID': loan?.loanId,
          'Borrow Market': currentBorrowMarketCoin1,
          'Collateral Token': collateralBalance.substring(spaceIndex + 1),
        })

        dispatch(setActiveTransactions(activeTransactions))
        let data: any = localStorage.getItem('transactionCheck')
        data = data ? JSON.parse(data) : []
        if (data && data.includes(uqID)) {
          dispatch(setTransactionStatus('success'))
        }
      }
    } catch (err: any) {
      //console.log(err, "err repay");
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
      toast.error(toastContent, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      })
      posthog.capture('Repay Borrow Status', {
        Status: 'Failure',
      })
      // const toastParamValue = {
      //   success: false,
      //   heading: "Repay Transaction Failed",
      //   desc: "Copy the error",
      //   textToCopy: err,
      // };
      return
    }
  }

  const handleRevertTransaction = async () => {
    try {
      setRevertLoanId(
        currentBorrowId1.slice(currentBorrowId1.indexOf('-') + 1).trim()
      )
      const revert = await writeAsyncRevertInteractWithL3()
      setDepositTransHash(revert?.transaction_hash)
      if (revert?.transaction_hash) {
        const toastid = toast.info(`Transaction pending`, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: false,
        })
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
          transaction_hash: revert?.transaction_hash.toString(),
          message: `You have successfully revert spent for Loan ID : ${currentBorrowId1
            .slice(currentBorrowId1.indexOf('-') + 1)
            .trim()}`,
          toastId: toastid,
          setCurrentTransactionStatus: setCurrentTransactionStatus,
          uniqueID: uqID,
        }
        // addTransaction({ hash: deposit?.transaction_hash });
        activeTransactions?.push(trans_data)
        posthog.capture('Convert to Borrow Market Status', {
          Status: 'Success',
          'Loan ID': revertLoanId,
          'Borrow Market': currentBorrowMarketCoin1,
          'Collateral Token': collateralBalance.substring(spaceIndex + 1),
        })

        dispatch(setActiveTransactions(activeTransactions))
      }
      ////console.log(revert);
      const uqID = getUniqueId()
      let data: any = localStorage.getItem('transactionCheck')
      data = data ? JSON.parse(data) : []
      if (data && data.includes(uqID)) {
        dispatch(setTransactionStatus('success'))
      }
    } catch (err) {
      //console.log(err);
      const uqID = getUniqueId()
      let data: any = localStorage.getItem('transactionCheck')
      data = data ? JSON.parse(data) : []
      if (data && data.includes(uqID)) {
        // dispatch(setTransactionStatus("failed"));
        setTransactionStarted(false)
      }
      posthog.capture('Convert to Borrow Market Status', {
        Status: 'Failure',
      })
    }
  }
  // const [lpamount, setLpamount] = useState([]);
  // useEffect(() => {
  //   const getJediEstimatedLpAmount = async () => {
  //     await getJediEstimatedLpAmountOut();
  //   };
  // }, []);

  interface assetB {
    USDT: any
    USDC: any
    BTC: any
    ETH: any
    DAI: any
    STRK: any
  }
  const walletBalances: assetB = {
    USDT: useBalanceOf(tokenAddressMap['USDT']),
    USDC: useBalanceOf(tokenAddressMap['USDC']),
    BTC: useBalanceOf(tokenAddressMap['BTC']),
    ETH: useBalanceOf(tokenAddressMap['ETH']),
    DAI: useBalanceOf(tokenAddressMap['DAI']),
    STRK: useBalanceOf(tokenAddressMap['STRK']),
  }
  const [currentLoan, setcurrentLoan] = useState<ILoan>()
  const [walletBalance1, setwalletBalance1] = useState(
    walletBalances[currentBorrowMarketCoin1.slice(1) as NativeToken]
      ?.statusBalanceOf === 'success'
      ? parseAmount(
          String(
            uint256.uint256ToBN(
              walletBalances[currentBorrowMarketCoin1.slice(1) as NativeToken]
                ?.dataBalanceOf?.balance
            )
          ),
          tokenDecimalsMap[currentBorrowMarketCoin1.slice(1) as NativeToken]
        )
      : 0
  )
  const minAmounts = useSelector(selectMinimumDepositAmounts)
  const maxAmounts = useSelector(selectMaximumDepositAmounts)
  useEffect(() => {
    setMinimumDepositAmount(minAmounts['r' + collateralAsset])
    setmaximumDepositAmount(maxAmounts['r' + collateralAsset])
  }, [collateralAsset, minAmounts, maxAmounts])
  useEffect(() => {
    setwalletBalance1(
      walletBalances[currentBorrowMarketCoin1.slice(1) as NativeToken]
        ?.statusBalanceOf === 'success'
        ? parseAmount(
            String(
              uint256.uint256ToBN(
                walletBalances[currentBorrowMarketCoin1.slice(1) as NativeToken]
                  ?.dataBalanceOf?.balance
              )
            ),
            tokenDecimalsMap[currentBorrowMarketCoin1.slice(1) as NativeToken]
          )
        : 0
    )
    ////console.log("supply modal status wallet balance",walletBalances[coin?.name]?.statusBalanceOf)
  }, [
    walletBalances[currentBorrowMarketCoin1.slice(1) as NativeToken]
      ?.statusBalanceOf,
    currentBorrowMarketCoin1,
    currentBorrowId1,
  ])

  const [walletBalance2, setwalletBalance2] = useState(
    walletBalances[collateralAsset]?.statusBalanceOf === 'success'
      ? parseAmount(
          String(
            uint256.uint256ToBN(
              walletBalances[collateralAsset]?.dataBalanceOf?.balance
            )
          ),
          tokenDecimalsMap[collateralAsset]
        )
      : 0
  )
  useEffect(() => {
    setwalletBalance2(
      walletBalances[collateralAsset]?.statusBalanceOf === 'success'
        ? parseAmount(
            String(
              uint256.uint256ToBN(
                walletBalances[collateralAsset]?.dataBalanceOf?.balance
              )
            ),
            tokenDecimalsMap[collateralAsset]
          )
        : 0
    )

    ////console.log("supply modal status wallet balance",walletBalances[coin?.name]?.statusBalanceOf)
  }, [
    walletBalances[collateralAsset]?.statusBalanceOf,
    collateralAsset,
    currentBorrowId2,
  ])


  useEffect(() => {
    if (loan) {
      setCollateralAsset(
        loan?.collateralMarket[0] == 'r'
          ? loan?.collateralMarket.slice(1)
          : loan?.collateralMarket
      )
      setRToken(loan?.collateralMarket)
    }
  }, [loan])

  useEffect(() => {
    // setSwapLoanId(currentBorrowId1);
    setSwapLoanId(
      currentBorrowId1.slice(currentBorrowId1.indexOf('-') + 1).trim()
    )
    setLiquidityLoanId(
      currentBorrowId1.slice(currentBorrowId1.indexOf('-') + 1).trim()
    )
    setRevertLoanId(
      currentBorrowId1.slice(currentBorrowId1.indexOf('-') + 1).trim()
    )
    const result = userLoans.find(
      (item: any) =>
        item?.loanId ==
        currentBorrowId1.slice(currentBorrowId1.indexOf('-') + 1).trim()
    )
    setcurrentLoan(result);
    setLoan(result)
  }, [currentBorrowId1])
  ////console.log(userLoans);

  useEffect(() => {
    setLoanId(currentBorrowId2.slice(currentBorrowId2.indexOf('-') + 1).trim())
    ////console.log(currentBorrowMarketCoin2);
    const result = userLoans.find(
      (item: any) =>
        item?.loanId ==
        currentBorrowId2.slice(currentBorrowId2.indexOf('-') + 1).trim()
    )
    setCollateralAsset(
      result?.collateralMarket[0] == 'r'
        ? result?.collateralMarket.slice(1)
        : result?.collateralMarket
    )
    setRToken(result?.collateralMarket)

    ////console.log(rToken);
  }, [currentBorrowId2, currentBorrowMarketCoin2])

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
      case 'DAI':
        return <DAILogo height={'16px'} width={'16px'} />
      case 'STRK':
        return <STRKLogo height={'16px'} width={'16px'} />
      case 'dBTC':
        return <BTCLogo height={'16px'} width={'16px'} />
      case 'dUSDC':
        return <USDCLogo height={'16px'} width={'16px'} />
      case 'dUSDT':
        return <USDTLogo height={'16px'} width={'16px'} />
      case 'dETH':
        return <ETHLogo height={'16px'} width={'16px'} />
      case 'dDAI':
        return <DAILogo height={'16px'} width={'16px'} />
      case 'dSTRK':
        return <STRKLogo height={'16px'} width={'16px'} />
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
  const [radioValue, setRadioValue] = useState('1')
  const [liquiditySplitCoin1, setLiquiditySplitCoin1] = useState('ETH')
  const [liquiditySplitCoin2, setLiquiditySplitCoin2] = useState('USDT')
  useEffect(() => {
    setCurrentPool('Select a pool')
    setCurrentPoolCoin('Select a pool')
  }, [radioValue])
  const userDeposit = useSelector(selectUserDeposits)

  // const [currentBorrowMarketCoin1, setCurrentBorrowMarketCoin1] =
  //   useState(currentMarket);
  // const [currentBorrowMarketCoin2, setCurrentBorrowMarketCoin2] =
  //   useState(currentMarket);
  const [currentPoolCoin, setCurrentPoolCoin] = useState('Select a pool')
  const [currentAction, setCurrentAction] = useState('Select action')
  // const [currentBorrowId1, setCurrentBorrowId1] = useState(`ID - ${currentID}`);
  // const [currentBorrowId2, setCurrentBorrowId2] = useState(`ID - ${currentID}`);
  const [currentDapp, setCurrentDapp] = useState('Select a dapp')
  const [currentPool, setCurrentPool] = useState('Select a pool')

  const getBorrowAPR = (borrowMarket: string) => {
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
  ////console.log(currentDapp)
  ////console.log(currentPool.split('/')[0])
  const [estrTokensMinted, setEstrTokensMinted] = useState<any>()
  const spaceIndex = collateralBalance.indexOf(' ')

  const [depositTransHash, setDepositTransHash] = useState('')

  const [currentTransactionStatus, setCurrentTransactionStatus] = useState('')
  const [isToastDisplayed, setToastDisplayed] = useState(false)
  const [toastId, setToastId] = useState<any>()
  const fees = useSelector(selectFees)
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
  //     toast.dismiss(toastId);
  //     setCurrentTransactionStatus("failed");
  //     dispatch(setTransactionStatus("failed"));
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
      console.log('hi')
      // console.log(err);
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
  const poolAprs = useSelector(selectJediswapPoolAprs)
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

  const handleZeroRepay = async () => {
    try {
      if (!loan?.loanId) {
        throw new Error('loan or loanID issue')
      }
      const zeroRepay = await writeAsyncSelfLiquidate()
      setDepositTransHash(zeroRepay?.transaction_hash)
      if (zeroRepay?.transaction_hash) {
        const toastid = toast.info(`Transaction pending `, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: false,
        })
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
          transaction_hash: zeroRepay?.transaction_hash.toString(),
          message: `Successfully repaid`,
          toastId: toastid,
          setCurrentTransactionStatus: setCurrentTransactionStatus,
          uniqueID: uqID,
        }
        // addTransaction({ hash: deposit?.transaction_hash });
        activeTransactions?.push(trans_data)
        posthog.capture('Zero Repay Status', {
          Status: 'Success',
          'Loan ID': loan?.loanId,
          'Borrow Market': currentBorrowMarketCoin1,
          'Collateral Token': collateralBalance.substring(spaceIndex + 1),
        })

        dispatch(setActiveTransactions(activeTransactions))
      }
      ////console.log(zeroRepay);
      const uqID = getUniqueId()
      let data: any = localStorage.getItem('transactionCheck')
      data = data ? JSON.parse(data) : []
      if (data && data.includes(uqID)) {
        dispatch(setTransactionStatus('success'))
      }
    } catch (err: any) {
      //console.log("zero repay failed - ", err);
      const uqID = getUniqueId()
      let data: any = localStorage.getItem('transactionCheck')
      data = data ? JSON.parse(data) : []
      if (data && data.includes(uqID)) {
        // dispatch(setTransactionStatus("failed"));
        setTransactionStarted(false)
      }
      posthog.capture('Zero Repay Status', {
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
  const hanldeTrade = async () => {
    try {
      // if(currentDapp)
      if (currentDapp == 'Jediswap') {
        const trade = await writeAsyncJediSwap_swap()
        setDepositTransHash(trade?.transaction_hash)
        if (trade?.transaction_hash) {
          const toastid = toast.info(`Transaction pending`, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: false,
          })
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
            transaction_hash: trade?.transaction_hash.toString(),
            message: `Successfully traded for loan ID : ${swapLoanId}`,
            toastId: toastid,
            setCurrentTransactionStatus: setCurrentTransactionStatus,
            uniqueID: uqID,
          }
          // addTransaction({ hash: deposit?.transaction_hash });
          activeTransactions?.push(trans_data)
          posthog.capture('Spend Borrow Status Your Borrow', {
            Status: 'Success',
            Action: 'Trade',
            'Loan Id': swapLoanId,
            'Pool Selected': currentPool,
            'Dapp Selected': currentDapp,
            'Borrow Market': currentBorrowMarketCoin1,
            'Collateral Token': collateralBalance.substring(spaceIndex + 1),
          })
          dispatch(setActiveTransactions(activeTransactions))
        }
        //console.log(trade);
        const uqID = getUniqueId()
        let data: any = localStorage.getItem('transactionCheck')
        data = data ? JSON.parse(data) : []
        if (data && data.includes(uqID)) {
          dispatch(setTransactionStatus('success'))
        }
      } else if (currentDapp == 'mySwap') {
        const tradeMySwap = await writeAsyncmySwap_swap()
        setDepositTransHash(tradeMySwap?.transaction_hash)
        if (tradeMySwap?.transaction_hash) {
          const toastid = toast.info(`Transaction pending`, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: false,
          })
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
            transaction_hash: tradeMySwap?.transaction_hash.toString(),
            message: `Successfully traded for loan ID : ${swapLoanId}`,
            toastId: toastid,
            setCurrentTransactionStatus: setCurrentTransactionStatus,
            uniqueID: uqID,
          }
          // addTransaction({ hash: deposit?.transaction_hash });

          activeTransactions?.push(trans_data)
          posthog.capture('Spend Borrow Status Your Borrow', {
            Status: 'Success',
            Action: 'Trade',
            'Loan Id': swapLoanId,
            'Pool Selected': currentPool,
            'Dapp Selected': currentDapp,
            'Borrow Market': currentBorrowMarketCoin1,
            'Collateral Token': collateralBalance.substring(spaceIndex + 1),
          })

          dispatch(setActiveTransactions(activeTransactions))
        }
        //console.log(tradeMySwap);
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
      posthog.capture('Spend Borrow Status Your Borrow', {
        Status: 'Failure',
      })
      toast.error(toastContent, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      })
    }
  }
  const hanldeLiquidation = async () => {
    try {
      if (currentDapp == 'Jediswap') {
        const liquidity = await writeAsyncJediSwap_addLiquidity()
        setDepositTransHash(liquidity?.transaction_hash)
        if (liquidity?.transaction_hash) {
          const toastid = toast.info(`Transaction pending`, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: false,
          })
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
            transaction_hash: liquidity?.transaction_hash.toString(),
            // message: `You have successfully added Liquidity for loan ID : ${liquidityLoanId}`,
            message: `Successfully added Liquidity`,
            toastId: toastid,
            setCurrentTransactionStatus: setCurrentTransactionStatus,
            uniqueID: uqID,
          }
          // addTransaction({ hash: deposit?.transaction_hash });
          activeTransactions?.push(trans_data)
          posthog.capture('Spend Borrow Status Your Borrow', {
            Status: 'Success',
            'Loan ID': liquidityLoanId,
            Action: 'Liquidity',
            'Pool Selected': currentPool,
            'Dapp Selected': currentDapp,
            'Borrow Market': currentBorrowMarketCoin1,
            'Collateral Token': collateralBalance.substring(spaceIndex + 1),
          })

          dispatch(setActiveTransactions(activeTransactions))
        }
        //console.log(liquidity);
        const uqID = getUniqueId()
        let data: any = localStorage.getItem('transactionCheck')
        data = data ? JSON.parse(data) : []
        if (data && data.includes(uqID)) {
          dispatch(setTransactionStatus('success'))
        }
      } else if (currentDapp == 'mySwap') {
        const mySwapLiquidity = await writeAsyncmySwap_addLiquidity()
        //console.log(mySwapLiquidity);
        setDepositTransHash(mySwapLiquidity?.transaction_hash)
        if (mySwapLiquidity?.transaction_hash) {
          const toastid = toast.info(`Transaction pending`, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: false,
          })
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
            transaction_hash: mySwapLiquidity?.transaction_hash.toString(),
            // message: `You have successfully added Liquidity for loan ID : ${liquidityLoanId}`,
            message: `Successfully added Liquidity`,
            toastId: toastid,
            setCurrentTransactionStatus: setCurrentTransactionStatus,
            uniqueID: uqID,
          }
          // addTransaction({ hash: deposit?.transaction_hash });
          activeTransactions?.push(trans_data)
          posthog.capture('Spend Borrow Status Your Borrow', {
            Status: 'Success',
            'Loan ID': liquidityLoanId,
            Action: 'Liquidity',
            'Pool Selected': currentPool,
            'Dapp Selected': currentDapp,
            'Collateral Token': collateralBalance.substring(spaceIndex + 1),
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
      posthog.capture('Spend Borrow Status Your Borrow', {
        Status: 'Failure',
      })
      toast.error(toastContent, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      })
    }
  }
  const handleAddCollateral = async () => {
    try {
      if (currentTokenSelected == 'rToken') {
        const addCollateral = await writeAsyncAddCollateralRToken()
        if (addCollateral?.transaction_hash) {
          setDepositTransHash(addCollateral?.transaction_hash)
          if (addCollateral?.transaction_hash) {
            const toastid = toast.info(`Transaction pending`, {
              position: toast.POSITION.BOTTOM_RIGHT,
              autoClose: false,
            })
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
              transaction_hash: addCollateral?.transaction_hash.toString(),
              // message: `You have successfully added collateral in Loan ID ${loanId} : ${rTokenAmount} ${rToken} `,
              message: `Successfully added collateral`,
              toastId: toastid,
              setCurrentTransactionStatus: setCurrentTransactionStatus,
              uniqueID: uqID,
            }
            // addTransaction({ hash: deposit?.transaction_hash });
            activeTransactions?.push(trans_data)
            posthog.capture('Add Collateral Your Borrow Status', {
              Status: 'Success',
              'Loan id': currentBorrowId2,
              'Borrow Market': currentBorrowMarketCoin2,
              'Collateral Amount': rTokenAmount,
              'Collateral Token': collateralBalance.substring(spaceIndex + 1),
            })

            dispatch(setActiveTransactions(activeTransactions))
          }
        }

        const uqID = getUniqueId()
        let data: any = localStorage.getItem('transactionCheck')
        data = data ? JSON.parse(data) : []
        if (data && data.includes(uqID)) {
          dispatch(setTransactionStatus('success'))
        }
      } else {
        const addCollateral = await writeAsyncAddCollateral()
        if (addCollateral?.transaction_hash) {
          setDepositTransHash(addCollateral?.transaction_hash)
          if (addCollateral?.transaction_hash) {
            setDepositTransHash(addCollateral?.transaction_hash)
            if (addCollateral?.transaction_hash) {
              const toastid = toast.info(`Transaction pending`, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: false,
              })
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
                transaction_hash: addCollateral?.transaction_hash.toString(),
                // message: `You have successfully added collateral in Loan ID ${loanId} : ${collateralAmount} r${collateralAsset} `,
                message: `Successfully added collateral`,
                toastId: toastid,
                setCurrentTransactionStatus: setCurrentTransactionStatus,
                uniqueID: uqID,
              }
              // addTransaction({ hash: deposit?.transaction_hash });
              activeTransactions?.push(trans_data)
              posthog.capture('Add Collateral Your Borrow Status', {
                Status: 'Success',
                'Loan id': currentBorrowId2,
                'Borrow Market': currentBorrowMarketCoin2,
                'Collateral Amount': collateralAmount,
                'Collateral Token': collateralBalance.substring(spaceIndex + 2),
              })

              dispatch(setActiveTransactions(activeTransactions))
            }
          }
        }

        const uqID = getUniqueId()
        let data: any = localStorage.getItem('transactionCheck')
        data = data ? JSON.parse(data) : []
        if (data && data.includes(uqID)) {
          dispatch(setTransactionStatus('success'))
        }
      }
    } catch (err: any) {
      //console.log("add collateral error",err);
      const uqID = getUniqueId()
      let data: any = localStorage.getItem('transactionCheck')
      data = data ? JSON.parse(data) : []
      if (data && data.includes(uqID)) {
        // dispatch(setTransactionStatus("failed"));
        setCollateralTransactionStarted(false)
      }
      posthog.capture('Add Collateral Your Borrow Status', {
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

  // useEffect(() => {
  //   setToMarketA(currentPool.split("/")[0]);
  //   setToMarketB(currentPool.split("/")[1]);
  //  //console.log("marketsAB", toMarketA, toMarketB);
  // }, [currentPool]);

  const getContainer = (action: string) => {
    switch (action) {
      case 'Spend Borrow':
        return (
          <Box
            background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
            borderRadius="6px"
            p="1rem"
            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
            mt="1.5rem"
            mb="1.5rem"
          >
            {currentPool !== 'Select a pool' &&
              currentDapp != 'Select a dapp' &&
              spendType === 'UNSPENT' && (
                <Box display="flex" justifyContent="space-between" mb="0.2rem">
                  <Box display="flex">
                    <Text
                      color="#676D9A"
                      fontSize="12px"
                      fontWeight="400"
                      fontStyle="normal"
                    >
                      est LP tokens recieved:{' '}
                    </Text>
                    <Tooltip
                      hasArrow
                      placement="right-start"
                      boxShadow="dark-lg"
                      label="Estimated Liquidity Provider Tokens Received: Estimate of LP tokens received by providing liquidity to a pool."
                      rounded="md"
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
                      <Box ml="0.1rem" mt="0.3rem">
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
            {radioValue === '1' &&
              currentPool !== 'Select a pool' &&
              currentDapp != 'Select a dapp' &&
              spendType === 'UNSPENT' && (
                <Box display="flex" justifyContent="space-between" mb="0.2rem">
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
                      placement="right-start"
                      boxShadow="dark-lg"
                      label="Fee for adjusting liquidity allocation across assets within the protocol."
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
                      <Box ml="0.1rem" mt="0.3rem">
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
                      <Box m="2px">
                        {/* <SmallEth /> */}
                        <Image
                          src={`/${liquiditySplitCoin1}.svg`}
                          alt="liquidity split coin1"
                          width="12"
                          height="12"
                        />
                      </Box>
                      <Text>
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
                      <Box m="2px">
                        {/* <SmallUsdt /> */}
                        <Image
                          src={`/${liquiditySplitCoin2}.svg`}
                          alt="liquidity split coin1"
                          width="12"
                          height="12"
                        />
                      </Box>
                      <Text>
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
            <Box display="flex" justifyContent="space-between" mb="0.2rem">
              <Box display="flex">
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
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
                  <Box ml="0.1rem" mt="0.3rem">
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
                {fees.l3interaction}%
              </Text>
            </Box>

            <Box display="flex" justifyContent="space-between" mb="0.2rem">
              <Box display="flex">
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Borrow APR:{' '}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right"
                  boxShadow="dark-lg"
                  label="The annual interest rate charged on borrowed funds from the protocol."
                  rounded="md"
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
                  <Box ml="0.1rem" mt="0.3rem">
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
                {!borrowAPRs ||
                borrowAPRs.length === 0 ||
                !getBorrowAPR(currentBorrowMarketCoin1.slice(1)) ? (
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
                  '-' + getBorrowAPR(currentBorrowMarketCoin1.slice(1)) + '%'
                )}
              </Text>
            </Box>

            {currentAction === 'Spend Borrow' && (
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
                  >
                    <Box p="1">
                      <InfoIcon />
                    </Box>
                  </Tooltip>
                </Box>
                <Text color="#676D9A" fontSize="xs">
                  {!borrowAPRs || borrowAPRs.length === 0 ? (
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
                      getBoostedApr(currentBorrowMarketCoin1.slice(1)) +
                        getBoostedAprSupply(borrow?.collateralMarket.slice(1))
                    ) + '%'
                  )}
                </Text>
              </Box>
            )}

            {/* <Box display="flex" justifyContent="space-between" mb="0.2rem">
              <Box display="flex">
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Gas estimate:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right"
                  boxShadow="dark-lg"
                  label="Estimation of resources & costs for blockchain transactions."
                      bg="#02010F"
                  fontSize={"13px"}
                             fontWeight={"400"}
                  borderRadius={"lg"}
                        padding={"2"}
              border="1px solid"
                    borderColor="#23233D"

                  arrowShadowColor="#2B2F35"
                  maxW="222px"
                >
                  <Box ml="0.1rem" mt="0.3rem">
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
                $ 0.91
              </Text>
            </Box> */}
            <Box display="flex" justifyContent="space-between" mb="0.2rem">
              <Box display="flex">
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Effective APR:{' '}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-end"
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
                  maxW="292px"
                  // mt='20px'
                >
                  <Box ml="0.1rem" mt="0.3rem">
                    <InfoIcon />
                  </Box>
                </Tooltip>
              </Box>
              {radioValue == '1' && currentPool != 'Select a pool' ? (
                <Text
                  color={
                    (dollarConvertor(
                      borrow?.loanAmountParsed,
                      borrow?.loanMarket.slice(1),
                      oraclePrices
                    ) *
                      reduxProtocolStats.find(
                        (val: any) => val?.token == borrow?.loanMarket.slice(1)
                      )?.exchangeRateDTokenToUnderlying *
                      (-reduxProtocolStats?.find(
                        (stat: any) =>
                          stat?.token === currentBorrowMarketCoin1.slice(1)
                      )?.borrowRate +
                        getAprByPool(poolAprs, currentPool, currentDapp) +
                        getBoostedApr(currentBorrowMarketCoin1.slice(1)) +
                        (100 *
                          365 *
                          (poolAllocatedData *
                            oraclePrices.find(
                              (curr: any) => curr.name === 'STRK'
                            )?.price)) /
                          getTvlByPool(poolAprs, currentPool, currentDapp)) +
                      dollarConvertor(
                        borrow?.collateralAmountParsed,
                        borrow?.collateralMarket.slice(1),
                        oraclePrices
                      ) *
                        reduxProtocolStats.find(
                          (val: any) =>
                            val?.token == borrow?.collateralMarket.slice(1)
                        )?.exchangeRateRtokenToUnderlying *
                        (reduxProtocolStats?.find(
                          (stat: any) =>
                            stat?.token === borrow?.collateralMarket.slice(1)
                        )?.supplyRate +
                          getBoostedAprSupply(
                            borrow?.collateralMarket.slice(1)
                          ))) /
                      dollarConvertor(
                        borrow?.collateralAmountParsed,
                        borrow?.collateralMarket.slice(1),
                        oraclePrices
                      ) <
                    0
                      ? 'rgb(255 94 94)'
                      : '#00D395'
                  }
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  {(
                    (dollarConvertor(
                      borrow?.loanAmountParsed,
                      borrow?.loanMarket.slice(1),
                      oraclePrices
                    ) *
                      reduxProtocolStats.find(
                        (val: any) => val?.token == borrow?.loanMarket.slice(1)
                      )?.exchangeRateDTokenToUnderlying *
                      (-reduxProtocolStats?.find(
                        (stat: any) =>
                          stat?.token === currentBorrowMarketCoin1.slice(1)
                      )?.borrowRate +
                        getAprByPool(poolAprs, currentPool, currentDapp) +
                        getBoostedApr(currentBorrowMarketCoin1.slice(1)) +
                        (100 *
                          365 *
                          (poolAllocatedData *
                            oraclePrices.find(
                              (curr: any) => curr.name === 'STRK'
                            )?.price)) /
                          getTvlByPool(poolAprs, currentPool, currentDapp)) +
                      dollarConvertor(
                        borrow?.collateralAmountParsed,
                        borrow?.collateralMarket.slice(1),
                        oraclePrices
                      ) *
                        reduxProtocolStats.find(
                          (val: any) =>
                            val?.token == borrow?.collateralMarket.slice(1)
                        )?.exchangeRateRtokenToUnderlying *
                        (reduxProtocolStats?.find(
                          (stat: any) =>
                            stat?.token === borrow?.collateralMarket.slice(1)
                        )?.supplyRate +
                          getBoostedAprSupply(
                            borrow?.collateralMarket.slice(1)
                          ))) /
                    dollarConvertor(
                      borrow?.collateralAmountParsed,
                      borrow?.collateralMarket.slice(1),
                      oraclePrices
                    )
                  ).toFixed(2)}
                  %
                </Text>
              ) : radioValue == '1' && currentPool == 'Select a pool' ? (
                <Text
                  color={
                    Number(
                      avgs?.find(
                        (item: any) =>
                          item?.loanId ==
                          currentBorrowId1
                            .slice(currentBorrowId1.indexOf('-') + 1)
                            .trim()
                      )?.avg
                    ) +
                      getBoostedAprSupply(
                        collateralBalance.substring(spaceIndex + 2)
                      ) <
                    0
                      ? 'rgb(255 94 94)'
                      : '#00D395'
                  }
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  {avgs?.find(
                    (item: any) =>
                      item?.loanId ==
                      currentBorrowId1
                        .slice(currentBorrowId1.indexOf('-') + 1)
                        .trim()
                  )?.avg
                    ? numberFormatterPercentage(
                        Number(
                          avgs?.find(
                            (item: any) =>
                              item?.loanId ==
                              currentBorrowId1
                                .slice(currentBorrowId1.indexOf('-') + 1)
                                .trim()
                          )?.avg
                        ) +
                          getBoostedAprSupply(
                            collateralBalance.substring(spaceIndex + 2)
                          )
                      )
                    : '3.2'}
                  %
                </Text>
              ) : radioValue == '2' && currentPoolCoin == 'Select a pool' ? (
                <Text
                  color={
                    Number(
                      avgs?.find(
                        (item: any) =>
                          item?.loanId ==
                          currentBorrowId1
                            .slice(currentBorrowId1.indexOf('-') + 1)
                            .trim()
                      )?.avg
                    ) +
                      getBoostedAprSupply(
                        collateralBalance.substring(spaceIndex + 2)
                      ) <
                    0
                      ? 'rgb(255 94 94)'
                      : '#00D395'
                  }
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  {avgs?.find(
                    (item: any) =>
                      item?.loanId ==
                      currentBorrowId1
                        .slice(currentBorrowId1.indexOf('-') + 1)
                        .trim()
                  )?.avg
                    ? numberFormatterPercentage(
                        Number(
                          avgs?.find(
                            (item: any) =>
                              item?.loanId ==
                              currentBorrowId1
                                .slice(currentBorrowId1.indexOf('-') + 1)
                                .trim()
                          )?.avg
                        ) +
                          getBoostedAprSupply(
                            collateralBalance.substring(spaceIndex + 2)
                          )
                      )
                    : '3.2'}
                  %
                </Text>
              ) : (
                <Text
                  color={
                    Number(
                      avgs?.find(
                        (item: any) =>
                          item?.loanId ==
                          currentBorrowId1
                            .slice(currentBorrowId1.indexOf('-') + 1)
                            .trim()
                      )?.avg
                    ) +
                      getBoostedAprSupply(borrow?.collateralMarket.slice(1)) +
                      (getBoostedApr(currentBorrowMarketCoin1.slice(1)) *
                        dollarConvertor(
                          borrow?.loanAmountParsed,
                          borrow?.loanMarket.slice(1),
                          oraclePrices
                        ) *
                        reduxProtocolStats?.find(
                          (val: any) =>
                            val?.token == borrow?.loanMarket.slice(1)
                        )?.exchangeRateDTokenToUnderlying) /
                        (dollarConvertor(
                          borrow?.collateralAmountParsed,
                          borrow?.collateralMarket.slice(1),
                          oraclePrices
                        ) *
                          reduxProtocolStats.find(
                            (val: any) =>
                              val?.token == borrow?.collateralMarket.slice(1)
                          )?.exchangeRateRtokenToUnderlying) <
                    0
                      ? 'rgb(255 94 94)'
                      : '#00D395'
                  }
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  {avgs?.find(
                    (item: any) =>
                      item?.loanId ==
                      currentBorrowId1
                        .slice(currentBorrowId1.indexOf('-') + 1)
                        .trim()
                  )?.avg
                    ? numberFormatterPercentage(
                        Number(
                          avgs?.find(
                            (item: any) =>
                              item?.loanId ==
                              currentBorrowId1
                                .slice(currentBorrowId1.indexOf('-') + 1)
                                .trim()
                          )?.avg
                        ) +
                          getBoostedAprSupply(
                            borrow?.collateralMarket.slice(1)
                          ) +
                          (getBoostedApr(currentBorrowMarketCoin1.slice(1)) *
                            dollarConvertor(
                              borrow?.loanAmountParsed,
                              borrow?.loanMarket.slice(1),
                              oraclePrices
                            ) *
                            reduxProtocolStats?.find(
                              (val: any) =>
                                val?.token == borrow?.loanMarket.slice(1)
                            )?.exchangeRateDTokenToUnderlying) /
                            (dollarConvertor(
                              borrow?.collateralAmountParsed,
                              borrow?.collateralMarket.slice(1),
                              oraclePrices
                            ) *
                              reduxProtocolStats.find(
                                (val: any) =>
                                  val?.token ==
                                  borrow?.collateralMarket.slice(1)
                              )?.exchangeRateRtokenToUnderlying)
                      )
                    : '3.2'}
                  %
                </Text>
              )}
              {/* (100*365*(poolAllocatedData*(oraclePrices.find((curr: any) => curr.name === "STRK")?.price))/getTvlByPool(poolAprs, currentPool, currentDapp)) */}
            </Box>
            {/* <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Health factor:{" "}
                </Text>
                <Tooltip
                  hasArrow
                  placement="right-end"
                  boxShadow="dark-lg"
                  label="Loan risk metric comparing collateral value to borrowed amount to check potential liquidation."
                    bg="#02010F"
                  fontSize={"13px"}
                  fontWeight={"400"}
                  borderRadius={"lg"}
                  padding={"2"}
                  color="#F0F0F5"
                  border="1px solid"
                  borderColor="#23233D"
                  arrowShadowColor="#2B2F35"
                  maxW="222px"
                >
                  <Box ml="0.1rem" mt="0.3rem">
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
                {avgsLoneHealth?.find(
                  (item: any) =>
                    item?.loanId ==
                    currentBorrowId1
                      .slice(currentBorrowId1.indexOf("-") + 1)
                      .trim()
                )?.loanHealth
                  ? avgsLoneHealth?.find(
                    (item: any) =>
                      item?.loanId ==
                      currentBorrowId1
                        .slice(currentBorrowId1.indexOf("-") + 1)
                        .trim()
                  )?.loanHealth
                  : "2.5"}
                %
              </Text>
            </Box> */}
          </Box>
        )

      case 'Repay Borrow':
        return (
          <Box
            p="1rem"
            borderRadius="md"
            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
            background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
            my="6"
          >
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Borrowed market:{' '}
                </Text>
                <Tooltip
                  color="#F0F0F5"
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="The token borrowed from the protocol."
                  bg="#02010F"
                  fontSize={'13px'}
                  fontWeight={'400'}
                  borderRadius={'lg'}
                  padding={'2'}
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
              <Text
                color="#676D9A"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
                {currentBorrowMarketCoin1}
              </Text>
            </Box>
            {/* <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  rTokens unlocked:{" "}
                </Text>
                <Tooltip
    color="#F0F0F5"
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="all the assets to the market"
                  bg="#24292F"
                  fontSize={"smaller"}
                             fontWeight={"400"}
                  borderRadius={"lg"}
                  padding={"2"}
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
                1.23
              </Text>
            </Box> */}
            {/* <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Est collateral value:{" "}
                </Text>
                <Tooltip
    color="#F0F0F5"
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="all the assets to the market"
                  bg="#24292F"
                  fontSize={"smaller"}
                             fontWeight={"400"}
                  borderRadius={"lg"}
                  padding={"2"}
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
                5.56%
              </Text>
            </Box> */}
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Fees:{' '}
                </Text>
                <Tooltip
                  color="#F0F0F5"
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="Fees charged by Hashstack protocol. Additional third-party DApp fees may apply as appropriate."
                  bg="#02010F"
                  fontSize={'13px'}
                  fontWeight={'400'}
                  borderRadius={'lg'}
                  padding={'2'}
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
              <Text
                color="#676D9A"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
                {fees.repayLoan}%
              </Text>
            </Box>
            {/* <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Gas estimate:{" "}
                </Text>
                <Tooltip
    color="#F0F0F5"
                  hasArrow
                  placement="right-end"
                  boxShadow="dark-lg"
                  label="Estimation of resources & costs for blockchain transactions."
                    bg="#02010F"
                  fontSize={"13px"}
                             fontWeight={"400"}
                  borderRadius={"lg"}
                        padding={"2"}
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
              <Text
                color="#676D9A"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
                $ 0.91
              </Text>
            </Box> */}
          </Box>
        )

      case 'Zero Repay':
        return (
          <Box
            p="1rem"
            borderRadius="md"
            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
            background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
            my="6"
          >
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#676D9A" fontSize="xs">
                  Dapp:{' '}
                </Text>
                <Tooltip
                  color="#F0F0F5"
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="Application where the loan was spent."
                  bg="#02010F"
                  fontSize={'13px'}
                  fontWeight={'400'}
                  borderRadius={'lg'}
                  padding={'2'}
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
              <Box display="flex" color="#676D9A" fontSize="xs" gap="2">
                <Box display="flex" gap="2px">
                  <Box>
                    {borrow?.l3App == 'JEDI_SWAP' ? (
                      <JediswapLogo />
                    ) : (
                      <MySwap />
                    )}
                  </Box>
                  <Text>
                    {borrow?.l3App == 'JEDI_SWAP' ? 'Jediswap' : 'Myswap'}
                  </Text>
                </Box>
              </Box>
            </Box>
            {/* <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#676D9A" fontSize="xs">
                  Borrow amount:{" "}
                </Text>
                <Tooltip
                  color="#F0F0F5"
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="The unit of tokens you have borrowed from the protocol."
                  bg="#02010F"
                  fontSize={"13px"}
                  fontWeight={"400"}
                  borderRadius={"lg"}
                  padding={"2"}
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
                {borrowAmount} {currentBorrowMarketCoin1}
              </Text>
            </Box> */}
            {/* <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#676D9A" fontSize="xs">
                  rTokens unlocked:{" "}
                </Text>
                <Tooltip
    color="#F0F0F5"
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="all the assets to the market"
                  bg="#24292F"
                  fontSize={"smaller"}
                             fontWeight={"400"}
                  borderRadius={"lg"}
                  padding={"2"}
                >
                  <Box p="1">
                    <InfoIcon />
                  </Box>
                </Tooltip>
              </Box>
              <Text color="#676D9A" fontSize="xs">
                1.23
              </Text>
            </Box> */}
            {/* <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#676D9A" fontSize="xs">
                  Est collateral value:{" "}
                </Text>
                <Tooltip
    color="#F0F0F5"
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="all the assets to the market"
                  bg="#24292F"
                  fontSize={"smaller"}
                             fontWeight={"400"}
                  borderRadius={"lg"}
                  padding={"2"}
                >
                  <Box p="1">
                    <InfoIcon />
                  </Box>
                </Tooltip>
              </Box>
              <Text color="#676D9A" fontSize="xs">
                5.56%
              </Text>
            </Box> */}
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#676D9A" fontSize="xs">
                  Fees:{' '}
                </Text>
                <Tooltip
                  color="#F0F0F5"
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="Fees charged by Hashstack protocol. Additional third-party DApp fees may apply as appropriate."
                  bg="#02010F"
                  fontSize={'13px'}
                  fontWeight={'400'}
                  borderRadius={'lg'}
                  padding={'2'}
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
                {fees.repayLoan}%
              </Text>
            </Box>
            {/* <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text color="#676D9A" fontSize="xs">
                  Gas estimate:{" "}
                </Text>
                <Tooltip
    color="#F0F0F5"
                  hasArrow
                  placement="right-end"
                  boxShadow="dark-lg"
                  label="Estimation of resources & costs for blockchain transactions."
                    bg="#02010F"
                  fontSize={"13px"}
                             fontWeight={"400"}
                  borderRadius={"lg"}
                        padding={"2"}
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
                $ 0.91
              </Text>
            </Box> */}
          </Box>
        )

      case 'Convert to borrow market':
        return (
          <Box
            background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
            borderRadius="6px"
            p="1rem"
            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
            mt="1.5rem"
            mb="1.5rem"
          >
            {/* <Box display="flex" justifyContent="space-between" mb="0.2rem">
              <Box display="flex">
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  est conversion:{" "}
                </Text>
                <Tooltip
    color="#F0F0F5"
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="all the assets to the market"
                  bg="#24292F"
                  fontSize={"smaller"}
                             fontWeight={"400"}
                  borderRadius={"lg"}
                  padding={"2"}
                >
                  <Box ml="0.1rem" mt="0.1rem">
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
                    <SmallEth />
                  </Box>
                  <Text>1.23</Text>
                </Box>
                <Box display="flex" gap="2px">
                  <Box mt="2px">
                    <SmallUsdt />
                  </Box>
                  <Text>1.23</Text>
                </Box>
              </Box>
            </Box> */}
            <Box display="flex" justifyContent="space-between" mb="0.2rem">
              <Box display="flex">
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Fees:{' '}
                </Text>
                <Tooltip
                  color="#F0F0F5"
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="Fees charged by Hashstack protocol. Additional third-party DApp fees may apply as appropriate."
                  bg="#02010F"
                  fontSize={'13px'}
                  fontWeight={'400'}
                  borderRadius={'lg'}
                  padding={'2'}
                  border="1px solid"
                  borderColor="#23233D"
                  arrowShadowColor="#2B2F35"
                  maxW="222px"
                >
                  <Box ml="0.1rem" mt="0.2rem">
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
                {fees.l3interaction}%
              </Text>
            </Box>
            {/* <Box display="flex" justifyContent="space-between" mb="0.2rem">
              <Box display="flex">
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Gas estimate:{" "}
                </Text>
                <Tooltip
    color="#F0F0F5"
                  hasArrow
                  placement="right-end"
                  boxShadow="dark-lg"
                  label="Estimation of resources & costs for blockchain transactions."
                    bg="#02010F"
                  fontSize={"13px"}
                             fontWeight={"400"}
                  borderRadius={"lg"}
                        padding={"2"}
              border="1px solid"
                    borderColor="#23233D"

                  arrowShadowColor="#2B2F35"
                  maxW="222px"
                >
                  <Box ml="0.1rem" mt="0.1rem">
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
                $ 0.91
              </Text>
            </Box> */}
          </Box>
        )

      case 'Select action':
        return (
          <Box
            p="1rem"
            borderRadius="md"
            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
            background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
            my="6"
          >
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Borrowed market:{' '}
                </Text>
                <Tooltip
                  color="#F0F0F5"
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="The token borrowed from the protocol."
                  bg="#02010F"
                  fontSize={'13px'}
                  fontWeight={'400'}
                  borderRadius={'lg'}
                  padding={'2'}
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
              <Text
                color="#676D9A"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
                {currentBorrowMarketCoin1}
              </Text>
            </Box>
            {/* <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  rTokens unlocked:{" "}
                </Text>
                <Tooltip
    color="#F0F0F5"
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="rTokens unlocked"
                  bg="#24292F"
                  fontSize={"smaller"}
                             fontWeight={"400"}
                  borderRadius={"lg"}
                  padding={"2"}
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
                1.23
              </Text>
            </Box> */}
            {/* <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Est collateral value:{" "}
                </Text>
                <Tooltip
    color="#F0F0F5"
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="all the assets to the market"
                  bg="#24292F"
                  fontSize={"smaller"}
                             fontWeight={"400"}
                  borderRadius={"lg"}
                  padding={"2"}
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
                5.56%
              </Text>
            </Box> */}
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Fees:{' '}
                </Text>
                <Tooltip
                  color="#F0F0F5"
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="Fees charged by Hashstack protocol. Additional third-party DApp fees may apply as appropriate."
                  bg="#02010F"
                  fontSize={'13px'}
                  fontWeight={'400'}
                  borderRadius={'lg'}
                  padding={'2'}
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
              <Text
                color="#676D9A"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
                {fees.repayLoan}%
              </Text>
            </Box>
            {/* <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Text
                  color="#676D9A"
                  fontSize="12px"
                  fontWeight="400"
                  fontStyle="normal"
                >
                  Gas estimate:{" "}
                </Text>
                <Tooltip
    color="#F0F0F5"
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="Estimation of resources & costs for blockchain transactions."
                    bg="#02010F"
                  fontSize={"13px"}
                             fontWeight={"400"}
                  borderRadius={"lg"}
                        padding={"2"}
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
              <Text
                color="#676D9A"
                fontSize="12px"
                fontWeight="400"
                fontStyle="normal"
              >
                $ 0.91
              </Text>
            </Box> */}
          </Box>
        )

      default:
        break
    }
  }

  const handleDropdownClick = (dropdownName: any) => {
    dispatch(setModalDropdown(dropdownName))
  }
  const coins = ['BTC', 'USDT', 'USDC', 'ETH', 'STRK']
  const actions = [
    'Spend Borrow',
    'Convert to borrow market',
    'Repay Borrow',
    'Zero Repay',
  ]
  // const borrowIds = [
  //   "ID - 123456",
  //   "ID - 123457",
  //   "ID - 123458",
  //   "ID - 123459",
  //   "ID - 1234510",
  // ];

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
  // const pools = [
  //   ["ETH", "USDT"],
  //   ["USDC", "USDT"],
  //   ["ETH", "USDC"],
  //   ["DAI", "ETH"],
  //   ["BTC", "ETH"],
  //   ["BTC", "USDT"],
  //   ["BTC", "USDC"],
  //   ["BTC", "DAI"],
  //   ["USDT", "DAI"],
  //   ["USDC", "AI"],
  // ];

  // useEffect(() => {
  //  //console.log("got", currentID, currentMarket);
  // }, [currentBorrowId1]);

  const [sliderValue, setSliderValue] = useState(0)
  // const dispatch = useDispatch();

  const [inputAmount, setinputAmount] = useState(0)
  const [inputCollateralAmount, setinputCollateralAmount] = useState(0)
  const [sliderValue2, setSliderValue2] = useState(0)
  const [inputRepayAmount, setinputRepayAmount] = useState(0)

  const handleChange = (newValue: any) => {
    if (newValue > 9_000_000_000) return
    var percentage = (newValue * 100) / walletBalance1
    percentage = Math.max(0, percentage)
    if (percentage > 100) {
      setSliderValue(100)
      setRepayAmount(newValue)
      dispatch(setInputYourBorrowModalRepayAmount(newValue))
    } else {
      percentage = Math.round(percentage)
      if (isNaN(percentage)) {
      } else {
        setSliderValue(percentage)
        setRepayAmount(newValue)
        dispatch(setInputYourBorrowModalRepayAmount(newValue))
      }
      // dispatch((newValue));
    }
  }
  ////console.log(typeof walletBalance2, "balance borrow");

  const handleCollateralChange = (newValue: any) => {
    if (newValue > 9_000_000_000) return

    if (currentTokenSelected === 'rToken') {
      var percentage =
        (newValue * 100) /
        userDeposit?.find(
          (item: any) =>
            item?.rToken == collateralBalance.substring(spaceIndex + 1)
        )?.rTokenFreeParsed
    } else {
      if (newValue > walletBalance2) {
        var percentage = 100
      } else {
        var percentage = (newValue * 100) / walletBalance2
      }
    }
    percentage = Math.max(0, percentage)
    if (percentage > 100) {
      setSliderValue2(100)
      setinputCollateralAmount(newValue)
      setCollateralAmount(newValue)
      setRTokenAmount(newValue)
      // dispatch(setInputYourBorrowModalRepayAmount(newValue));
    } else {
      percentage = Math.round(percentage)
      if (isNaN(percentage)) {
      } else {
        setSliderValue2(percentage)
        setinputCollateralAmount(newValue)
        setCollateralAmount(newValue)
        setRTokenAmount(newValue)
      }
      // dispatch(setInputYourBorrowModalRepayAmount(newValue));
      // dispatch((newValue));
    }
  }

  const handleBorrowMarketCoinChange1 = (id: string) => {
    ////console.log("got id", id);
    for (let i = 0; i < borrowIDCoinMap.length; i++) {
      if (borrowIDCoinMap[i].id === id) {
        setCurrentBorrowMarketCoin1(borrowIDCoinMap[i].name)
        setSpendType(borrowIDCoinMap[i].spendType)
        setSpendType(borrowIDCoinMap[i].spendType)
        return
      }
    }
  }

  const handleBorrowMarketCoinChange2 = (id: string) => {
    ////console.log("got id", id);
    for (let i = 0; i < borrowIDCoinMap.length; i++) {
      if (borrowIDCoinMap[i].id === id) {
        setCurrentBorrowMarketCoin2(borrowIDCoinMap[i].name)
        setCollateralBalance(borrowIDCoinMap[i].collateralBalance)
        return
      }
    }
  }
  const activeModal = Object.keys(modalDropdowns).find(
    (key) => modalDropdowns[key] === true
  )
  ////console.log(activeModal)

  // const handleBorrowMarketIDChange1 = (coin: string) => {
  //   ////console.log("got coin", coin);
  //   for (let i = 0; i < borrowIDCoinMap.length; i++) {
  //     if (borrowIDCoinMap[i].name === coin) {
  //       setCurrentBorrowId1(`ID - ${borrowIDCoinMap[i].id}`);
  //       return;
  //     }
  //   }
  // };

  // const handleBorrowMarketIDChange2 = (coin: string) => {
  //   ////console.log("got coin", coin);
  //   for (let i = 0; i < borrowIDCoinMap.length; i++) {
  //     if (borrowIDCoinMap[i].name === coin) {
  //       setCurrentBorrowId2(`ID - ${borrowIDCoinMap[i].id}`);
  //       return;
  //     }
  //   }
  // };

  // const walletBalance = JSON.parse(useSelector(selectWalletBalance))
  const [currentSelectedCoin, setCurrentSelectedCoin] = useState('BTC')
  const [tabValue, setTabValue] = useState(1)
  const [currentTokenSelected, setcurrentTokenSelected] = useState('rToken')
  const [refereshCallData, setrefereshCallData] = useState(true)
  const tokensArray = ['rToken', 'Native Token']
  useEffect(() => {
    setCurrentPool('Select a pool')
    setCurrentPoolCoin('Select a pool')
  }, [currentDapp])
  const resetStates = () => {
    try {
      setRadioValue('1')
      setCurrentAction('Select action')
      setrefereshCallData(true);
      setCurrentBorrowMarketCoin1('BTC')
      setCurrentBorrowMarketCoin2('BTC')
      setCurrentBorrowId1('ID - ')
      setCurrentBorrowId2('ID - 123456')
      setCurrentDapp('Select a dapp')
      setCurrentPool('Select a pool')
      setCurrentPoolCoin('Select a pool')
      setinputCollateralAmount(0)
      setCollateralAmount(0)
      setRTokenAmount(0)
      setSliderValue(0)
      setSliderValue2(0)
      setRepayAmount(0)
      setTabValue(1)
      setEstrTokensMinted(undefined)
      setCollateralTransactionStarted(false)
      setTransactionStarted(false)
      dispatch(resetModalDropdowns())
      setcurrentTokenSelected('rToken')
      dispatch(setTransactionStatus(''))
    } catch (err) {
      //console.log("yourBorrowModal reset states - ", err);
    }
    setCurrentTransactionStatus('')
    setDepositTransHash('')
  }

  useEffect(() => {
    setinputCollateralAmount(0)
    setSliderValue2(0)
  }, [currentBorrowMarketCoin2])

  useEffect(() => {
    setToMarket(currentPoolCoin)
    ////console.log(toMarket);
  }, [currentPoolCoin])

  useEffect(() => {
    setinputCollateralAmount(0)
    setSliderValue2(0)
  }, [currentTokenSelected])

  // useEffect(() => {
  //  //console.log("spendType", spendType);
  // }, [spendType]);

  const [currentLPTokenAmount, setCurrentLPTokenAmount] = useState<
    Number | undefined | null
  >()
  const [currentSplit, setCurrentSplit] = useState<
    Number[] | undefined | null
  >()

  useEffect(() => {
    ////console.log(
    //   "toMarketSplitConsole",
    //   currentLoanMarket,
    //   currentLoanAmount,
    //   toMarketA,
    //   toMarketB
    //   // borrow
    // );
    setCurrentSplit(null)
    fetchLiquiditySplit()
  }, [toMarketA, currentBorrowId1, toMarketB, currentPool, currentDapp])

  useEffect(() => {
    setCurrentLPTokenAmount(null)
    fetchLPAmount()
  }, [toMarketA, currentBorrowId1, toMarketB, currentPool, currentDapp])

  const fetchLiquiditySplit = async () => {
    if (
      spendType !== 'UNSPENT' ||
      !toMarketA ||
      !toMarketB ||
      !currentBorrowId1 ||
      !currentBorrowId2 ||
      currentPool === 'Select a pool' ||
      currentDapp === 'Select a dapp'
    )
      return

    if (currentDapp === 'Jediswap' ) {
      const split = await getJediEstimateLiquiditySplit(
        currentLoanMarket,
        currentLoanAmount,
        toMarketA,
        toMarketB
        // "USDT",
        // 99,
        // "ETH",
        // "USDT"
      )
      setCurrentSplit(split)
    } else if (currentDapp === 'mySwap') {
      const split = await getMySwapEstimateLiquiditySplit(
        currentLoanMarket,
        currentLoanAmount,
        toMarketA,
        toMarketB
        // "USDT",
        // 99,
        // "ETH",
        // "USDT"
      )
      setCurrentSplit(split)
    }
  }
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
      findSideForMember(mySwapPoolPairs, currentBorrowMarketCoin1.slice(1))
    }
  }, [currentBorrowMarketCoin1, mySwapPoolPairs])

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
      findSideForMember(poolsPairs, currentBorrowMarketCoin1.slice(1))
    }
  }, [currentBorrowMarketCoin1, poolsPairs])
  const fetchLPAmount = async () => {
    if (
      spendType !== 'UNSPENT' ||
      !toMarketA ||
      !toMarketB ||
      !currentBorrowId1 ||
      !currentBorrowId2 ||
      currentPool === 'Select a pool' ||
      currentDapp === 'Select a dapp'
    )
      return
    if (currentDapp === 'Jediswap' ) {
      const lp_tokon = await getJediEstimatedLpAmountOut(
        currentLoanMarket,
        currentLoanAmount,
        toMarketA,
        toMarketB
        // "USDT",
        // "99",
        // "ETH",
        // "USDT"
      )
      setCurrentLPTokenAmount(lp_tokon)
    } else if (currentDapp === 'mySwap') {
      const lp_tokon = await getMySwapEstimatedLpAmountOut(
        currentLoanMarket,
        currentLoanAmount,
        toMarketA,
        toMarketB
        // "USDT",
        // "99",
        // "ETH",
        // "USDT"
      )
      setCurrentLPTokenAmount(lp_tokon)
    }
  }
  useEffect(() => {
    const fetchEstrTokens = async () => {
      const data = await getrTokensMinted(
        collateralBalance.substring(spaceIndex + 1),
        inputCollateralAmount
      )
      ////console.log(data, "data in your borrow");
      setEstrTokensMinted(data)
    }
    fetchEstrTokens()
  }, [collateralBalance, inputCollateralAmount])

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

  useEffect(()=>{
    const fetchRevertData=async()=>{
      if(currentAction==="Convert to borrow market"){
        setrefereshCallData(true);
        if(currentLoan){
          if(currentLoan?.l3App==="JEDI_SWAP"){
            if(currentLoan?.spendType==="LIQUIDITY"){
              const res=await getJediSwapLiquidityRevertCalldata(liquidityLoanId)
              if(res){
                setrefereshCallData(false);
                setrevertcallData(res)
              }
            }else if(currentLoan?.spendType==='SWAP'){
              const res=await getJediSwapRevertCalldata(liquidityLoanId);
              if(res){
                setrefereshCallData(false);
                setrevertcallData(res)
              }
            }
          }else if(currentLoan?.l3App==="MY_SWAP"){
            if(currentLoan?.spendType==="LIQUIDITY"){
              const res=await getMySwapLiquidityRevertCalldata(liquidityLoanId)
              if(res){
                setrefereshCallData(false);
                setrevertcallData(res)
              }
            }else if(currentLoan?.spendType==='SWAP'){
              const res=await getMySwapRevertCalldata(liquidityLoanId);
              if(res){
                setrefereshCallData(false);
                setrevertcallData(res)
              }
            }
          }else if(currentLoan?.l3App==='ZKLEND'){
            const res=await getzklendRevertCallData(liquidityLoanId)
            if(res){
              setrefereshCallData(false);
              setrevertcallData(res)
            }
          }
        }
      }
    }
    fetchRevertData();
  },[currentLoan,currentAction])

  useEffect(()=>{
    const fetchData=async()=>{
      if(currentAction==="Spend Borrow"){
        setrefereshCallData(true);
        if(radioValue==='1'){
          if(currentDapp==="Jediswap"){
            if(currentPool!=="Select a pool"){
              const res=await getJediswapLiquidityCallData(currentLoan,toMarketA,toMarketB)
              if(res){
                setrefereshCallData(false);
                setcallDataLiquidity(res);
              }
            }
          }else if(currentDapp=="mySwap"){
            if(currentPool!=="Select a pool"){
              const res=await getMyswapLiquidityCallData(currentLoan,toMarketA,toMarketB)
              if(res){
                setrefereshCallData(true);
                setcallDataLiquidity(res);
              }
            }
          }
        }else{
          if(currentDapp==="Jediswap"){
            if(currentPoolCoin!=="Select a pool"){
              const res=await getJediswapCallData(currentLoan,toMarket)
              if(res){
                setrefereshCallData(false)
                setcallDataSwap(res);
              }
            }
          }else if(currentDapp=="mySwap"){
            if(currentPoolCoin!=="Select a pool"){
              const res=await getMyswapCallData(currentLoan,toMarket)
              if(res){
                setrefereshCallData(false)
                setcallDataSwap(res);
              }
            }
          }
        }
      }
    }
    fetchData()
  },[swapLoanId,liquidityLoanId,currentPool,currentPoolCoin,currentAction,currentDapp])

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

  return (
    <Box>
      <Button
        key="suppy"
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
        {...restProps}
      >
        {buttonText}
      </Button>

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
          resetStates()
          if (transactionStarted || collateralTransactionStarted) {
            dispatch(setTransactionStartedAndModalClosed(true))
          }
          onClose()
        }}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay mt="3.8rem" bg="rgba(244, 242, 255, 0.5);" />

        <ModalContent
          mt="6rem"
          bg={'var(--Base_surface, #02010F);'}
          maxW="464px"
          overflow="hidden"
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
            Borrow Actions
            <Tooltip
              hasArrow
              placement="right"
              boxShadow="dark-lg"
              label="Select the desired option on how you want to spend your borrowings."
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

          <ModalBody color={'#E6EDF3'} pt={1} px={7}>
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              fontSize={'sm'}
              mb="1.5rem"
            >
              <Tabs variant="unstyled">
                <TabList borderRadius="md" top="9.5rem" width="100%" zIndex="1">
                  <Box display="flex" width="300px">
                    <Tab
                      py="1"
                      px="3"
                      color="#676D9A"
                      fontSize="sm"
                      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                      borderLeftRadius="md"
                      fontWeight="normal"
                      opacity="100%"
                      _selected={{
                        color: 'white',
                        bg: '#4D59E8',
                        border: 'none',
                      }}
                      isDisabled={collateralTransactionStarted == true}
                      onClick={() => {
                        setTabValue(1)
                      }}
                    >
                      Borrow Actions
                    </Tab>

                    <Tab
                      py="1"
                      px="3"
                      color="#676D9A"
                      fontSize="sm"
                      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                      borderRightRadius="md"
                      fontWeight="normal"
                      opacity="100%"
                      _selected={{
                        color: 'white',
                        bg: '#4D59E8',
                        border: 'none',
                      }}
                      isDisabled={transactionStarted == true}
                      onClick={() => {
                        setTabValue(2)
                      }}
                    >
                      Add Collateral
                    </Tab>
                  </Box>
                </TabList>
              </Tabs>
            </Box>

            <Box
              display={'flex'}
              justifyContent={'space-between'}
              fontSize={'sm'}
              mt=".4rem"
            >
              <Box w="full">
                {tabValue == 1 ? (
                  <Box p="0" m="0" overflowY="auto">
                    <Box
                      display="flex"
                      flexDirection="column"
                      background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                      p="5"
                      // my="4"
                      borderRadius="md"
                      gap="3"
                    >
                      {currentAction === 'Spend Borrow' &&
                        spendType !== 'UNSPENT' && (
                          <Box
                            // display="flex"
                            // justifyContent="left"
                            w="100%"
                            pb="4"
                          >
                            <Box
                              display="flex"
                              bg="#FFF8C5"
                              color="black"
                              fontSize="xs"
                              p="4"
                              fontStyle="normal"
                              fontWeight="500"
                              borderRadius="6px"
                              // textAlign="center"
                            >
                              <Box pr="3" my="auto" cursor="pointer">
                                <WarningIcon />
                              </Box>
                              Selected loan is already spent. first convert to
                              borrow market to spend or select the unspent loans
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
                      <Box display="flex" flexDirection="column" gap="1">
                        <Box display="flex">
                          <Text fontSize="xs" color="#676D9A">
                            Action
                          </Text>
                          <Tooltip
                            color="#F0F0F5"
                            hasArrow
                            placement="right-start"
                            boxShadow="dark-lg"
                            label="Dropdown menu for loan-related operations within protocol."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
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
                              handleDropdownClick(
                                'yourBorrowModalActionDropdown'
                              )
                            }
                          }}
                          as="button"
                        >
                          <Text display="flex" gap="1">
                            {currentAction}
                          </Text>
                          <Box pt="1" className="navbar-button">
                            {activeModal == 'yourBorrowModalActionDropdown' ? (
                              <ArrowUp />
                            ) : (
                              <DropdownUp />
                            )}
                          </Box>
                          {modalDropdowns.yourBorrowModalActionDropdown && (
                            <Box
                              w="full"
                              left="0"
                              bg="#03060B"
                              py="2"
                              className="dropdown-container"
                              boxShadow="dark-lg"
                            >
                              {actions.map((action, index) => {
                                if (
                                  (action === 'Convert to borrow market' &&
                                    spendType === 'UNSPENT') ||
                                  (action === 'Spend Borrow' &&
                                    spendType !== 'UNSPENT')
                                )
                                  return
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
                                      if (action === 'Zero Repay') {
                                        setRepayAmount(0)
                                        setSliderValue(0)
                                      }
                                      setCurrentAction(action)
                                    }}
                                  >
                                    {action === currentAction && (
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
                                        action === currentAction ? '2' : '5'
                                      }`}
                                      gap="1"
                                      bg={`${
                                        action === currentAction
                                          ? '#4D59E8'
                                          : 'inherit'
                                      }`}
                                      borderRadius="md"
                                    >
                                      {/* <Box p="1">{getCoin(action)}</Box> */}
                                      <Text>{action}</Text>
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
                          <Text
                            fontSize="12px"
                            fontWeight="400"
                            fontStyle="normal"
                            color="#676D9A"
                          >
                            Borrow ID
                          </Text>
                          <Tooltip
                            color="#F0F0F5"
                            hasArrow
                            placement="right-start"
                            boxShadow="dark-lg"
                            label="A unique ID number assigned to a specific borrow within the protocol."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
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
                        {currentAction == 'Convert to borrow market' ? (
                          <Box
                            display="flex"
                            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                            justifyContent="space-between"
                            py="2"
                            pl="3"
                            pr="3"
                            borderRadius="md"
                            className="navbar"
                            as="button"
                          >
                            <Box display="flex" gap="1">
                              {currentBorrowId1}
                            </Box>
                          </Box>
                        ) : (
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
                                handleDropdownClick(
                                  'yourBorrowBorrowIDsDropdown1'
                                )
                              }
                            }}
                            as="button"
                          >
                            <Box display="flex" gap="1">
                              {currentBorrowId1}
                            </Box>
                            <Text pt="1" className="navbar-button">
                              {activeModal == 'yourBorrowBorrowIDsDropdown1' ? (
                                <ArrowUp />
                              ) : (
                                <DropdownUp />
                              )}
                            </Text>
                            {modalDropdowns.yourBorrowBorrowIDsDropdown1 && (
                              <Box
                                w="full"
                                left="0"
                                bg="#03060B"
                                py="2"
                                className="dropdown-container onlyScroll"
                                boxShadow="dark-lg"
                                height={`${
                                  borrowIds.length >= 5 ? '182px' : 'none'
                                }`}
                                overflowY="scroll"
                              >
                                {borrowIds.map(
                                  (coin: string, index: number) => {
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
                                          setCurrentBorrowId1('ID - ' + coin)

                                          handleBorrowMarketCoinChange1(coin)
                                          setLoanId(coin)
                                          setSwapLoanId(coin)
                                          ////console.log(swapLoanId,"swap loan id")
                                          setLiquidityLoanId(coin)
                                          //console.log(liquidityLoanId);
                                        }}
                                      >
                                        {'ID - ' + coin ===
                                          currentBorrowId1 && (
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
                                            'ID - ' + coin === currentBorrowId1
                                              ? '2'
                                              : '5'
                                          }`}
                                          gap="1"
                                          bg={`${
                                            'ID - ' + coin === currentBorrowId1
                                              ? '#4D59E8'
                                              : 'inherit'
                                          }`}
                                          borderRadius="md"
                                        >
                                          {/* <Box p="1">{getCoin(coin)}</Box> */}
                                          <Text>ID - {coin}</Text>
                                        </Box>
                                      </Box>
                                    )
                                  }
                                )}
                              </Box>
                            )}
                          </Box>
                        )}
                      </Box>
                      <Box display="flex" flexDirection="column" gap="1">
                        <Box display="flex">
                          <Text
                            fontSize="12px"
                            fontWeight="400"
                            fontStyle="normal"
                            color="#676D9A"
                          >
                            Borrow Market
                          </Text>
                          <Tooltip
                            color="#F0F0F5"
                            hasArrow
                            placement="right-start"
                            boxShadow="dark-lg"
                            label="The token borrowed from the protocol."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
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
                          // onClick={() =>
                          //   handleDropdownClick(
                          //     "yourBorrowModalBorrowMarketDropdown1"
                          //   )
                          // }
                          as="button"
                        >
                          <Box display="flex" gap="1">
                            <Box p="1">{getCoin(currentBorrowMarketCoin1)}</Box>
                            <Text mt="0.15rem">{currentBorrowMarketCoin1}</Text>
                          </Box>
                          {/* <Box pt="1" className="navbar-button">
                              <DropdownUp />
                            </Box> */}
                          {/* {modalDropdowns.yourBorrowModalBorrowMarketDropdown1 && (
                              <Box
                                w="full"
                                left="0"
                                bg="#03060B"
                                py="2"
                                className="dropdown-container"
                                boxShadow="dark-lg"
                              >
                                {coins.map((coin: string, index: number) => {
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
                                        setCurrentBorrowMarketCoin1(coin);
                                        handleBorrowMarketIDChange1(coin);
                                      }}
                                    >
                                      {coin === currentBorrowMarketCoin1 && (
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
                                          coin === currentBorrowMarketCoin1
                                            ? "1"
                                            : "5"
                                        }`}
                                        gap="1"
                                        bg={`${
                                          coin === currentBorrowMarketCoin1
                                            ? "#4D59E8"
                                            : "inherit"
                                        }`}
                                        borderRadius="md"
                                      >
                                        <Box p="1">{getCoin(coin)}</Box>
                                        <Text>{coin}</Text>
                                      </Box>
                                    </Box>
                                  );
                                })}
                              </Box>
                            )} */}
                        </Box>
                        {currentAction == 'Convert to borrow market' ? (
                          ''
                        ) : (
                          <Text
                            textAlign="right"
                            fontFamily={'Inter'}
                            fontSize="xs"
                            mt="0.2rem"
                          >
                            Borrow Balance: {borrowAmount}
                            <Text
                              as="span"
                              fontFamily={'Inter'}
                              color="#676D9A"
                              ml="0.2rem"
                            >
                              {currentBorrowMarketCoin1}
                            </Text>
                          </Text>
                        )}
                      </Box>
                      {currentAction == 'Repay Borrow' && (
                        <Box
                          display="flex"
                          flexDirection="column"
                          gap="1"
                          mt="0"
                        >
                          <Box display="flex">
                            <Text fontSize="xs" color="#676D9A">
                              Repay Amount
                            </Text>
                            <Tooltip
                              color="#F0F0F5"
                              hasArrow
                              placement="right-start"
                              boxShadow="dark-lg"
                              label="The amount to repay for a loan within protocol."
                              bg="#02010F"
                              fontSize={'13px'}
                              fontWeight={'400'}
                              borderRadius={'lg'}
                              padding={'2'}
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
                            borderRadius="6px"
                            display="flex"
                            justifyContent="space-between"
                            border={`${
                              repayAmount > walletBalance1
                                ? '1px solid #CF222E'
                                : repayAmount < 0
                                  ? '1px solid #CF222E'
                                  : isNaN(repayAmount)
                                    ? '1px solid #CF222E'
                                    : repayAmount > 0 &&
                                        repayAmount <= walletBalance1
                                      ? '1px solid #00D395'
                                      : '1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
                            }`}
                          >
                            <NumberInput
                              border="0px"
                              min={0}
                              keepWithinRange={true}
                              onChange={handleChange}
                              value={repayAmount ? repayAmount : ''}
                              isDisabled={transactionStarted == true}
                              step={parseFloat(
                                `${repayAmount <= 99999 ? 0.1 : 0}`
                              )}
                              _disabled={{ cursor: 'pointer' }}
                            >
                              <NumberInputField
                                placeholder={`0.01536 ${currentBorrowMarketCoin1.slice(
                                  1
                                )}`}
                                color={`${
                                  repayAmount > walletBalance1
                                    ? '#CF222E'
                                    : isNaN(repayAmount)
                                      ? '#CF222E'
                                      : repayAmount < 0
                                        ? '#CF222E'
                                        : repayAmount == 0
                                          ? 'white'
                                          : '#00D395'
                                }`}
                                border="0px"
                                _disabled={{ color: '#00D395' }}
                                _placeholder={{
                                  color: '#393D4F',
                                  fontSize: '.89rem',
                                  fontWeight: '600',
                                  outline: '0',
                                }}
                                // _disabled={{ color: "#1A7F37" }}
                                _focus={{
                                  outline: '0',
                                  boxShadow: 'none',
                                }}
                              />
                            </NumberInput>
                            <Button
                              variant="ghost"
                              color={`${
                                repayAmount > walletBalance1
                                  ? '#CF222E'
                                  : isNaN(repayAmount)
                                    ? '#CF222E'
                                    : repayAmount < 0
                                      ? '#CF222E'
                                      : repayAmount == 0
                                        ? '#4D59E8'
                                        : '#00D395'
                              }`}
                              _hover={{
                                bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
                              }}
                              onClick={() => {
                                setRepayAmount(walletBalance1)
                                setSliderValue(100)
                                dispatch(
                                  setInputYourBorrowModalRepayAmount(
                                    walletBalance1
                                  )
                                )
                              }}
                              isDisabled={transactionStarted == true}
                              _disabled={{ cursor: 'pointer' }}
                            >
                              MAX
                            </Button>
                          </Box>
                          {repayAmount > walletBalance1 ||
                          repayAmount < 0 ||
                          isNaN(repayAmount) ? (
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
                                  {repayAmount > walletBalance1
                                    ? 'Amount exceeds balance'
                                    : 'Invalid Input'}
                                </Text>
                              </Text>
                              <Text
                                color="#E6EDF3"
                                display="flex"
                                justifyContent="flex-end"
                              >
                                Wallet Balance:{' '}
                                {numberFormatter(walletBalance1)}
                                <Text color="#6E7781" ml="0.2rem">
                                  {` ${currentBorrowMarketCoin1.slice(1)}`}
                                </Text>
                              </Text>
                            </Text>
                          ) : (
                            <Text
                              color="#E6EDF3"
                              display="flex"
                              justifyContent="flex-end"
                              mt="0.4rem"
                              fontSize="12px"
                              fontWeight="500"
                              fontStyle="normal"
                              fontFamily="Inter"
                            >
                              Wallet Balance: {numberFormatter(walletBalance1)}
                              <Text color="#6E7781" ml="0.2rem">
                                {` ${currentBorrowMarketCoin1.slice(1)}`}
                              </Text>
                            </Text>
                          )}
                          {currentAction === 'Repay Borrow' && (
                            <Slider
                              mt="9"
                              mb="2"
                              aria-label="slider-ex-6"
                              defaultValue={sliderValue}
                              value={sliderValue}
                              onChange={(val) => {
                                setSliderValue(val)
                                var ans = (val / 100) * walletBalance1
                                if (val == 100) {
                                  setRepayAmount(walletBalance1)
                                } else {
                                  if (ans < 10) {
                                    dispatch(
                                      setInputYourBorrowModalRepayAmount(
                                        parseFloat(ans.toFixed(7))
                                      )
                                    )
                                    setRepayAmount(parseFloat(ans.toFixed(7)))
                                  } else {
                                    ans = Math.round(ans * 100) / 100
                                    dispatch(
                                      setInputYourBorrowModalRepayAmount(ans)
                                    )
                                    setRepayAmount(ans)
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
                          )}
                        </Box>
                      )}
                    </Box>
                    {currentAction === 'Spend Borrow' && (
                      <Box display="flex" flexDir="column" p="3" gap="1">
                        <Box display="flex">
                          <Text fontSize="xs" color="#676D9A">
                            Purpose
                          </Text>
                          <Tooltip
                            color="#F0F0F5"
                            hasArrow
                            placement="right-start"
                            boxShadow="dark-lg"
                            label="Borrow purpose refers to the options given to spend loans which is borrowed from the protocol."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
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
                        <Box>
                          <RadioGroup
                            onChange={setRadioValue}
                            value={radioValue}
                            cursor="pointer"
                            isDisabled={
                              currentAction === 'Spend Borrow' &&
                              spendType !== 'UNSPENT'
                            }
                          >
                            <Stack spacing={4} direction="row">
                              <Radio
                                value="1"
                                borderColor="#2B2F35"
                                colorScheme="customPurple"
                                bg="#676D9A1A"
                                // bg="black"
                                _checked={{
                                  bg: 'black',
                                  color: 'white',
                                  borderWidth: '5px',
                                  borderColor: '#4D59E8',
                                }}
                                _focus={{ boxShadow: 'none', outline: '0' }}
                                isDisabled={
                                  currentAction === 'Spend Borrow' &&
                                  spendType !== 'UNSPENT'
                                }
                                cursor="pointer"
                              >
                                Liquidity provisioning
                              </Radio>
                              <Radio
                                fontSize="sm"
                                value="2"
                                borderColor="#2B2F35"
                                colorScheme="customPurple"
                                bg="#676D9A1A"
                                // bg="black"
                                _checked={{
                                  bg: 'black',
                                  color: 'white',
                                  borderWidth: '5px',
                                  borderColor: '#4D59E8',
                                }}
                                _focus={{ boxShadow: 'none', outline: '0' }}
                                isDisabled={
                                  currentAction === 'Spend Borrow' &&
                                  spendType !== 'UNSPENT'
                                }
                                cursor="pointer"
                              >
                                {process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
                                  ? 'Trade'
                                  : 'Swap'}
                              </Radio>
                            </Stack>
                          </RadioGroup>
                        </Box>
                      </Box>
                    )}
                    {currentAction === 'Spend Borrow' && (
                      <Box
                        display="flex"
                        flexDirection="column"
                        background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                        p="3"
                        // my="4"
                        borderRadius="md"
                        gap="3"
                      >
                        <Box display="flex" flexDirection="column" gap="1">
                          <Box display="flex">
                            <Text fontSize="xs" color="#676D9A">
                              Dapp
                            </Text>
                            <Tooltip
                              color="#F0F0F5"
                              hasArrow
                              placement="right-start"
                              boxShadow="dark-lg"
                              label="Choose a decentralized application to spend the borrowed tokens on the protocol."
                              bg="#02010F"
                              fontSize={'13px'}
                              fontWeight={'400'}
                              borderRadius={'lg'}
                              padding={'2'}
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
                              if (
                                transactionStarted ||
                                (currentAction === 'Spend Borrow' &&
                                  spendType !== 'UNSPENT')
                              ) {
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

                              <Text mt="0.10rem" color="white">
                                {currentDapp}
                              </Text>
                              {/* {currentDapp == "Jediswap" &&
                                radioValue == "1" && (
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
                                      onClick={() => {
                                        setCurrentDapp(dapp.name)
                                      }}
                                      fontSize="sm"
                                      _hover={{ background: 'inherit' }}
                                      isDisabled={dapp.status === 'disable'}
                                    >
                                      {dapp.name === currentDapp && (
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
                                          dapp.name === currentDapp ? '1' : '5'
                                        }`}
                                        gap="1"
                                        bg={`${
                                          dapp.name === currentDapp
                                            ? '#4D59E8'
                                            : 'inherit'
                                        }`}
                                        borderRadius="md"
                                      >
                                        <Box p="1">{getCoin(dapp.name)}</Box>
                                        <Text pt="1" color="white">
                                          {dapp.name}
                                        </Text>
                                        {/* {dapp.name == "Jediswap" &&
                                          radioValue == "1" && (
                                            <Image
                                              src={"/strkReward.svg"}
                                              alt={`Strk reward`}
                                              width="74"
                                              height="15"
                                              style={{ marginTop: "0.3rem" }}
                                            />
                                          )} */}
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
                              color="#F0F0F5"
                              hasArrow
                              placement="right-start"
                              boxShadow="dark-lg"
                              label="Choose a specific liquidity pool within the protocol."
                              bg="#02010F"
                              fontSize={'13px'}
                              fontWeight={'400'}
                              borderRadius={'lg'}
                              padding={'2'}
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
                              if (
                                transactionStarted ||
                                (currentAction === 'Spend Borrow' &&
                                  spendType !== 'UNSPENT')
                              ) {
                                return
                              } else {
                                handleDropdownClick('yourBorrowPoolDropdown')
                              }
                            }}
                            as="button"
                          >
                            <Box display="flex" gap="1">
                              {getCoin(
                                radioValue === '1'
                                  ? currentPool
                                  : currentPoolCoin
                              ) ? (
                                <Box p="1">
                                  {getCoin(
                                    radioValue === '1'
                                      ? currentPool
                                      : currentPoolCoin
                                  )}
                                </Box>
                              ) : (
                                ''
                              )}

                              <Text mt="0.2rem">
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
                                      borderBottom={
                                        index == 2 && currentDapp == 'Jediswap'
                                          ? '1px solid #30363D'
                                          : ''
                                      }
                                      onClick={() => {
                                        setCurrentPool(pool)
                                        setToMarketA(pool.split('/')[0])
                                        setToMarketB(pool.split('/')[1])
                                        setLiquiditySplitCoin1(
                                          pool.split('/')[0]
                                        )
                                        setLiquiditySplitCoin2(
                                          pool.split('/')[1]
                                        )
                                      }}
                                    >
                                      {pool === currentPool && (
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
                                        justifyContent="space-between"
                                        pl={`${
                                          pool === currentPool ? '1' : '4'
                                        }`}
                                        pr="2"
                                        gap="1"
                                        bg={`${
                                          pool === currentPool
                                            ? '#4D59E8'
                                            : 'inherit'
                                        }`}
                                        borderRadius="md"
                                      >
                                        <Box
                                          display="flex"
                                          mt={
                                            index <= 2 &&
                                            currentDapp == 'Jediswap'
                                              ? '0.5rem'
                                              : ''
                                          }
                                        >
                                          <Box p="1">{getCoin(pool)}</Box>
                                          <Tooltip
                                            hasArrow
                                            placement="right"
                                            boxShadow="dark-lg"
                                            label={
                                              index <= 2 &&
                                              currentDapp == 'Jediswap'
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
                                                  : pool.split('/')[1] ==
                                                        'BTC' ||
                                                      pool.split('/')[1] ==
                                                        'ETH'
                                                    ? pool.split('/')[0] +
                                                      '/w' +
                                                      pool.split('/')[1]
                                                    : pool}
                                            </Text>
                                          </Tooltip>
                                          {/* <Text mt="-0.1rem">
                                            {index <= 2 &&
                                            currentDapp == "Jediswap"
                                              ? "✨"
                                              : ""}
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
                                            mt={index <= 2 ? '5px' : '0px'}
                                            fontWeight="medium"
                                            display="flex"
                                            justifyContent="flex-end"
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
                                                        oraclePrices.find(
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
                                {coins?.map((coin: string, index: number) => {
                                  const matchingPair = myswapPools?.find(
                                    (pair: any) => pair === coin
                                  )
                                  const matchingPairJedi = jediswapPools?.find(
                                    (pair: any) => pair === coin
                                  )
                                  if (
                                    coin ===
                                      currentBorrowMarketCoin1.slice(1) ||
                                    (process.env.NEXT_PUBLIC_NODE_ENV ==
                                      'mainnet' &&
                                      currentDapp == 'mySwap' &&
                                      !matchingPair)
                                  ) {
                                    return
                                  }
                                  if (
                                    coin ===
                                      currentBorrowMarketCoin1.slice(1) ||
                                    (process.env.NEXT_PUBLIC_NODE_ENV ==
                                      'mainnet' &&
                                      currentDapp == 'Jediswap' &&
                                      !matchingPairJedi)
                                  ) {
                                    return
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
                                      onClick={() => {
                                        setCurrentPoolCoin(coin)
                                        setToMarket(coin)
                                        ////console.log(toMarket);
                                      }}
                                    >
                                      {coin === currentPoolCoin && (
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
                                          coin === currentPoolCoin ? '1' : '5'
                                        }`}
                                        gap="1"
                                        bg={`${
                                          coin === currentPoolCoin
                                            ? '#4D59E8'
                                            : 'inherit'
                                        }`}
                                        borderRadius="md"
                                      >
                                        <Box p="1">{getCoin(coin)}</Box>
                                        <Text mt="0.5">{coin}</Text>
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
                    )}
                    {getContainer(currentAction)}
                    {currentAction === 'Select action' ? (
                      <Button
                        background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                        color="#676D9A"
                        size="sm"
                        width="100%"
                        mb="2rem"
                        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                        _hover={{
                          bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
                        }}
                      >
                        Select action
                      </Button>
                    ) : (
                      ''
                    )}
                    {currentAction == 'Spend Borrow' ? (
                      currentDapp != 'Select a dapp' &&
                      (currentBorrowMarketCoin1 === 'dUSDT'
                        ? currentPool !== 'STRK/ETH'
                        : currentBorrowMarketCoin1 === 'dBTC'
                          ? currentPool !== 'STRK/ETH'
                          : true) &&
                      (currentPool != 'Select a pool' ||
                        currentPoolCoin != 'Select a pool') &&
                      spendType === 'UNSPENT' ? (
                        <Box
                          onClick={() => {
                            if(!refereshCallData){
                              setTransactionStarted(true)
                              posthog.capture(
                                'Spend Borrow Button Clicked Your Borrow',
                                {
                                  Clicked: true,
                                }
                              )
                              if (transactionStarted == false) {
                                dispatch(
                                  setTransactionStartedAndModalClosed(false)
                                )
                                if (radioValue == '2') {
                                  hanldeTrade()
                                } else {
                                  hanldeLiquidation()
                                }
                              }
                            }
                          }}
                        >
                          <AnimatedButton
                            background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                            // bgColor="red"
                            // p={0}
                            color="#676D9A"
                            size="sm"
                            width="100%"
                            mb="1.5rem"
                            border="1px solid #676D9A"
                            labelSuccessArray={[
                              'Performing pre-checks',
                              'Processing the spend borrow',
                              'Updating the l3 records.',
                              // <ErrorButton errorText="Transaction failed" />,
                              // <ErrorButton errorText="Copy error!" />,
                              <SuccessButton
                                key={'successButton'}
                                successText={'Spend borrow successful.'}
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
                            _disabled={{ bgColor: 'white', color: 'black' }}
                            isDisabled={transactionStarted == true}
                            currentTransactionStatus={currentTransactionStatus}
                            setCurrentTransactionStatus={
                              setCurrentTransactionStatus
                            }
                          >
                  {refereshCallData &&<Spinner/>}
                  {!refereshCallData && `Spend Borrow`}
                          </AnimatedButton>
                        </Box>
                      ) : (
                        <Button
                          background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                          color="#676D9A"
                          size="sm"
                          width="100%"
                          mb="2rem"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          _hover={{
                            bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
                          }}
                        >
                          Spend
                        </Button>
                      )
                    ) : (
                      ''
                    )}

                    {currentAction == 'Repay Borrow' ? (
                      repayAmount > 0 && repayAmount <= walletBalance1 ? (
                        <Box
                          onClick={() => {
                            setTransactionStarted(true)
                            posthog.capture('Repay Borrow Button Clicked', {
                              Clicked: true,
                            })
                            if (transactionStarted == false) {
                              dispatch(
                                setTransactionStartedAndModalClosed(false)
                              )
                              handleRepayBorrow()
                            }
                          }}
                        >
                          <AnimatedButton
                            background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                            // bgColor="red"
                            // p={0}
                            color="#676D9A"
                            size="sm"
                            width="100%"
                            mb="1.5rem"
                            border="1px solid #676D9A"
                            labelSuccessArray={[
                              'Calculating the outstanding borrow amount.',
                              'transferring the repay amount to the borrow vault.',
                              'Burning the rTokens.',
                              'Covering the debt to the debt market.',
                              'Unlocking rTokens.',
                              'Transferring rtokens to the user account.',
                              // <ErrorButton errorText="Transaction failed" />,
                              // <ErrorButton errorText="Copy error!" />,
                              <SuccessButton
                                key={'successButton'}
                                successText={'Repay loan success'}
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
                            isDisabled={transactionStarted == true}
                          >
                            Repay borrow
                          </AnimatedButton>
                        </Box>
                      ) : (
                        <Button
                          background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                          color="#676D9A"
                          size="sm"
                          width="100%"
                          mb="2rem"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          _hover={{
                            bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
                          }}
                        >
                          Repay borrow
                        </Button>
                      )
                    ) : (
                      ''
                    )}
                    {currentAction == 'Convert to borrow market' ? (
                      <Box
                        onClick={() => {
                          setTransactionStarted(true)
                          posthog.capture(
                            'Convert Borrow Market Button Clicked',
                            {
                              Clicked: true,
                            }
                          )
                          dispatch(setTransactionStartedAndModalClosed(false))
                          if (transactionStarted == false) {
                            handleRevertTransaction()
                          }
                        }}
                      >
                        <AnimatedButton
                          background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                          // bgColor="red"
                          // p={0}
                          color="#676D9A"
                          size="sm"
                          width="100%"
                          mb="1.5rem"
                          border="1px solid #676D9A"
                          // _active={{color:"black",bg:"white"}}
                          labelSuccessArray={[
                            'Performing prechecks.',
                            'Processing borrow.',
                            // <ErrorButton errorText="Transaction failed" />,
                            // <ErrorButton errorText="Copy error!" />,
                            <SuccessButton
                              key={'successButton'}
                              successText={'Convert to borrow successfull.'}
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
                          _disabled={{ bgColor: 'white', color: 'black' }}
                          isDisabled={transactionStarted == true}
                          currentTransactionStatus={currentTransactionStatus}
                          setCurrentTransactionStatus={
                            setCurrentTransactionStatus
                          }
                        >
                                            {refereshCallData &&<Spinner/>}
                                            {!refereshCallData && `Convert to borrow market`}
                        </AnimatedButton>
                      </Box>
                    ) : (
                      ''
                    )}
                    {currentAction == 'Zero Repay' ? (
                      repayAmount == 0 ? (
                        <Box
                          onClick={() => {
                            setTransactionStarted(true)
                            posthog.capture('Zero Repay Button Clicked', {
                              Clicked: true,
                            })
                            dispatch(setTransactionStartedAndModalClosed(false))
                            if (transactionStarted == false) {
                              handleZeroRepay()
                            }
                          }}
                        >
                          <AnimatedButton
                            background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                            // bgColor="red"
                            // p={0}
                            color="#676D9A"
                            size="sm"
                            width="100%"
                            mb="1.5rem"
                            border="1px solid #676D9A"
                            // _active={{color:"black",bg:"white"}}
                            labelSuccessArray={[
                              'Performing prechecks.',
                              'Processing zero repay.',
                              'Transferring rtokens to your account.',
                              // <ErrorButton errorText="Transaction failed" />,
                              // <ErrorButton errorText="Copy error!" />,
                              <SuccessButton
                                key={'successButton'}
                                successText={'Zero repay successfull.'}
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
                            _disabled={{ bgColor: 'white', color: 'black' }}
                            isDisabled={transactionStarted == true}
                            currentTransactionStatus={currentTransactionStatus}
                            setCurrentTransactionStatus={
                              setCurrentTransactionStatus
                            }
                          >
                            Zero repay
                          </AnimatedButton>
                        </Box>
                      ) : (
                        <Button
                          background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                          color="#676D9A"
                          size="sm"
                          width="100%"
                          mb="2rem"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          _hover={{
                            bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
                          }}
                        >
                          Zero repay
                        </Button>
                      )
                    ) : (
                      ''
                    )}
                  </Box>
                ) : (
                  <Box m="0" p="0" overflowY="auto">
                    <Box
                      display="flex"
                      flexDirection="column"
                      background="var(--surface-of-10, rgba(103, 109, 154, 0.10));"
                      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                      p="5"
                      // my="4"
                      borderRadius="md"
                      gap="3"
                    >
                      <Box display="flex" flexDirection="column" gap="1">
                        <Text
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontStyle="normal"
                            fontWeight="400"
                          >
                            Borrow ID
                          </Text>
                          <Tooltip
                            color="#F0F0F5"
                            hasArrow
                            placement="right-start"
                            boxShadow="dark-lg"
                            label="A unique ID number assigned to a specific borrow within the protocol."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
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
                          display="flex"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          justifyContent="space-between"
                          py="2"
                          pl="3"
                          pr="3"
                          borderRadius="md"
                          className="navbar"
                          onClick={() => {
                            if (collateralTransactionStarted) {
                              return
                            } else {
                              handleDropdownClick(
                                'yourBorrowBorrowIDsDropdown2'
                              )
                            }
                          }}
                          as="button"
                        >
                          <Box display="flex" gap="1" pt="1">
                            {currentBorrowId2}
                          </Box>
                          <Text pt="1" className="navbar-button">
                            {activeModal == 'yourBorrowBorrowIDsDropdown2' ? (
                              <ArrowUp />
                            ) : (
                              <DropdownUp />
                            )}
                          </Text>
                          {modalDropdowns.yourBorrowBorrowIDsDropdown2 && (
                            <Box
                              w="full"
                              left="0"
                              bg="#03060B"
                              py="2"
                              className="dropdown-container"
                              boxShadow="dark-lg"
                              height={`${
                                borrowIds.length >= 5 ? '182px' : 'none'
                              }`}
                              overflowY="scroll"
                            >
                              {borrowIds.map((coin: string, index: number) => {
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
                                      setCurrentBorrowId2('ID - ' + coin)
                                      handleBorrowMarketCoinChange2(coin)
                                      setCollateralAsset(
                                        currentBorrowMarketCoin2.slice(1)
                                      )
                                      setRToken(
                                        currentBorrowMarketCoin2.slice(1)
                                      )
                                    }}
                                  >
                                    {'ID - ' + coin === currentBorrowId2 && (
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
                                        'ID - ' + coin === currentBorrowId2
                                          ? '2'
                                          : '5'
                                      }`}
                                      gap="1"
                                      bg={`${
                                        'ID - ' + coin === currentBorrowId2
                                          ? '#4D59E8'
                                          : 'inherit'
                                      }`}
                                      borderRadius="md"
                                    >
                                      {/* <Box p="1">{getCoin(coin)}</Box> */}
                                      <Text>ID - {coin}</Text>
                                    </Box>
                                  </Box>
                                )
                              })}
                            </Box>
                          )}
                        </Box>
                      </Box>
                      <Box display="flex" flexDirection="column" gap="1">
                        <Text
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontStyle="normal"
                            fontWeight="400"
                          >
                            Borrow Market
                          </Text>
                          <Tooltip
                            color="#F0F0F5"
                            hasArrow
                            placement="right-start"
                            boxShadow="dark-lg"
                            label="The token borrowed from the protocol."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
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
                          display="flex"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          justifyContent="space-between"
                          py="2"
                          pl="3"
                          pr="3"
                          mt="-0.1rem"
                          borderRadius="md"
                          className="navbar"
                          cursor="pointer"
                          onClick={() => {
                            if (collateralTransactionStarted) {
                              return
                            } else {
                              handleDropdownClick(
                                'yourBorrowModalBorrowMarketDropdown2'
                              )
                            }
                          }}
                        >
                          <Box display="flex" gap="1">
                            <Box p="1">{getCoin(currentBorrowMarketCoin2)}</Box>
                            <Text color="white" mt="0.12rem">
                              {currentBorrowMarketCoin2}
                            </Text>
                          </Box>

                          {/* <Box pt="1" className="navbar-button">
                              {activeModal ==
                              "yourBorrowModalBorrowMarketDropdown2" ? (
                                <ArrowUp />
                              ) : (
                                <DropdownUp />
                              )}
                            </Box> */}
                          {/* {modalDropdowns.yourBorrowModalBorrowMarketDropdown2 && (
                              <Box
                                w="full"
                                left="0"
                                bg="#03060B"
                                py="2"
                                className="dropdown-container"
                                boxShadow="dark-lg"
                              >
                                {coins.map((coin: string, index: number) => {
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
                                        setCurrentBorrowMarketCoin2(coin);
                                        // handleBorrowMarketIDChange2(coin);
                                        // dispatch(setCoinSelectedSupplyModal(coin))
                                      }}
                                    >
                                      {coin === currentBorrowMarketCoin2 && (
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
                                          coin === currentBorrowMarketCoin2
                                            ? "1"
                                            : "5"
                                        }`}
                                        gap="1"
                                        bg={`${
                                          coin === currentBorrowMarketCoin2
                                            ? "#4D59E8"
                                            : "inherit"
                                        }`}
                                        borderRadius="md"
                                      >
                                        <Box p="1">{getCoin(coin)}</Box>
                                        <Text color="white">{coin}</Text>
                                      </Box>
                                    </Box>
                                  );
                                })}
                              </Box>
                            )} */}
                        </Box>
                      </Box>
                      <Box display="flex" flexDirection="column" gap="1">
                        <Text
                          color="#676D9A"
                          display="flex"
                          alignItems="center"
                        >
                          <Text
                            mr="0.3rem"
                            fontSize="12px"
                            fontStyle="normal"
                            fontWeight="400"
                          >
                            Select Token
                          </Text>
                          <Tooltip
                            color="#F0F0F5"
                            hasArrow
                            placement="right-start"
                            boxShadow="dark-lg"
                            label="Select from which token you want to add collateral."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
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
                          display="flex"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          justifyContent="space-between"
                          py="2"
                          pl="3"
                          pr="3"
                          // mb="1rem"
                          // mt="0.3rem"
                          borderRadius="md"
                          className="navbar"
                          cursor="pointer"
                          onClick={() => {
                            if (collateralTransactionStarted) {
                              return
                            } else {
                              handleDropdownClick('yourBorrowTokenDropdown')
                            }
                          }}
                        >
                          <Box display="flex" gap="1">
                            <Box p="1">
                              {currentTokenSelected == 'rToken'
                                ? getCoin(
                                    collateralBalance.substring(spaceIndex + 1)
                                  )
                                : getCoin(
                                    collateralBalance.substring(spaceIndex + 2)
                                  )}
                            </Box>
                            <Text color="white" mt="0.5">
                              {currentTokenSelected == 'rToken'
                                ? collateralBalance.substring(spaceIndex + 1)
                                : collateralBalance.substring(spaceIndex + 2)}
                            </Text>
                          </Box>
                          <Box pt="1" className="navbar-button">
                            {activeModal ? <ArrowUp /> : <DropdownUp />}
                          </Box>
                          {modalDropdowns.yourBorrowTokenDropdown && (
                            <Box
                              w="full"
                              left="0"
                              bg="#03060B"
                              py="2"
                              className="dropdown-container"
                              boxShadow="dark-lg"
                            >
                              {tokensArray.map(
                                (coin: string, index: number) => {
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
                                        setcurrentTokenSelected(coin)
                                      }}
                                    >
                                      {coin === currentTokenSelected && (
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
                                          coin === currentTokenSelected
                                            ? '2'
                                            : '5'
                                        }`}
                                        gap="1"
                                        justifyContent="space-between"
                                        bg={`${
                                          coin === currentTokenSelected
                                            ? '#4D59E8'
                                            : 'inherit'
                                        }`}
                                        borderRadius="md"
                                      >
                                        <Box display="flex">
                                          <Box p="1">
                                            {coin == 'rToken'
                                              ? getCoin(
                                                  collateralBalance.substring(
                                                    spaceIndex + 1
                                                  )
                                                )
                                              : getCoin(
                                                  collateralBalance.substring(
                                                    spaceIndex + 2
                                                  )
                                                )}
                                          </Box>
                                          <Text color="white">
                                            {coin == 'rToken'
                                              ? collateralBalance.substring(
                                                  spaceIndex + 1
                                                )
                                              : collateralBalance.substring(
                                                  spaceIndex + 2
                                                )}
                                          </Text>
                                        </Box>

                                        <Box
                                          fontSize="9px"
                                          color="white"
                                          mt="6px"
                                          fontWeight="thin"
                                          display="flex"
                                        >
                                          Wallet Balance:{' '}
                                          {coin == 'Native Token' ? (
                                            walletBalance2 != null ? (
                                              numberFormatter(walletBalance2)
                                            ) : (
                                              <Skeleton
                                                width="3rem"
                                                height="1rem"
                                                startColor="#1E212F"
                                                endColor="#03060B"
                                                borderRadius="6px"
                                                ml={2}
                                              />
                                            )
                                          ) : userDeposit?.find(
                                              (item: any) =>
                                                item?.rToken ==
                                                collateralBalance.substring(
                                                  spaceIndex + 1
                                                )
                                            )?.rTokenFreeParsed != null ? (
                                            numberFormatter(
                                              userDeposit?.find(
                                                (item: any) =>
                                                  item?.rToken ==
                                                  collateralBalance.substring(
                                                    spaceIndex + 1
                                                  )
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
                                }
                              )}
                            </Box>
                          )}
                        </Box>
                      </Box>
                      <Text color="#676D9A" display="flex" alignItems="center">
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontWeight="400"
                          fontStyle="normal"
                        >
                          Collateral Balance
                        </Text>
                        <Tooltip
                          color="#F0F0F5"
                          hasArrow
                          placement="right"
                          boxShadow="dark-lg"
                          label="Hashstack self liquidates your collateral
                            & debt positions to repay the borrow.
                            The balance will be updated into rTokens."
                          bg="#02010F"
                          fontSize={'13px'}
                          fontWeight={'400'}
                          borderRadius={'lg'}
                          padding={'2'}
                          border="1px solid"
                          borderColor="#23233D"
                          maxW="222px"
                        >
                          <Box>
                            <InfoIcon />
                          </Box>
                        </Tooltip>
                      </Text>
                      <Box
                        w="full"
                        background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                        py="2"
                        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                        borderRadius="6px"
                        mt="-0.5rem"
                      >
                        <Text ml="1rem" color="white">
                          {collateralBalance}
                        </Text>
                      </Box>
                      <Text color="#676D9A" display="flex" alignItems="center">
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontWeight="400"
                          fontStyle="normal"
                        >
                          Collateral Amount
                        </Text>
                        <Tooltip
                          color="#F0F0F5"
                          hasArrow
                          placement="bottom-start"
                          boxShadow="dark-lg"
                          label="The amount of tokens used as security for borrowed funds."
                          bg="#02010F"
                          fontSize={'13px'}
                          fontWeight={'400'}
                          borderRadius={'lg'}
                          padding={'2'}
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
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
                          inputCollateralAmount >
                          (currentTokenSelected == 'Native Token'
                            ? walletBalance2
                            : userDeposit?.find(
                                (item: any) =>
                                  item?.rToken ==
                                  collateralBalance.substring(spaceIndex + 1)
                              )?.rTokenFreeParsed)
                            ? '1px solid #CF222E'
                            : inputCollateralAmount < 0
                              ? '1px solid #CF222E'
                              : process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                                  currentTokenSelected == 'Native Token' &&
                                  inputCollateralAmount > 0 &&
                                  (inputCollateralAmount <
                                    minimumDepositAmount ||
                                    inputCollateralAmount >
                                      maximumDepositAmount)
                                ? '1px solid #CF222E'
                                : inputCollateralAmount > 0 &&
                                    inputAmount <= walletBalance2
                                  ? '1px solid #00D395'
                                  : inputCollateralAmount >
                                      userDeposit?.find(
                                        (item: any) =>
                                          item?.rToken ==
                                          collateralBalance.substring(
                                            spaceIndex + 1
                                          )
                                      )?.rTokenFreeParsed
                                    ? '1px solid #CF22E'
                                    : '1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
                        }`}
                        borderRadius="6px"
                        display="flex"
                        justifyContent="space-between"
                        mt="-0.5rem"
                      >
                        <NumberInput
                          border="0px"
                          min={0}
                          color={`${
                            inputCollateralAmount >
                            (currentTokenSelected == 'Native Token'
                              ? walletBalance2
                              : userDeposit?.find(
                                  (item: any) =>
                                    item?.rToken ==
                                    collateralBalance.substring(spaceIndex + 1)
                                )?.rTokenFreeParsed)
                              ? '#CF222E'
                              : inputCollateralAmount < 0
                                ? '#CF222E'
                                : process.env.NEXT_PUBLIC_NODE_ENV ==
                                      'mainnet' &&
                                    currentTokenSelected == 'Native Token' &&
                                    inputCollateralAmount > 0 &&
                                    (inputCollateralAmount <
                                      minimumDepositAmount ||
                                      inputCollateralAmount >
                                        maximumDepositAmount)
                                  ? '#CF222E'
                                  : inputCollateralAmount == 0
                                    ? 'white'
                                    : '#00D395'
                          }`}
                          keepWithinRange={true}
                          onChange={handleCollateralChange}
                          value={
                            inputCollateralAmount ? inputCollateralAmount : ''
                          }
                          outline="none"
                          step={parseFloat(
                            `${inputCollateralAmount <= 99999 ? 0.1 : 0}`
                          )}
                          isDisabled={collateralTransactionStarted == true}
                          _disabled={{ cursor: 'pointer' }}
                        >
                          <NumberInputField
                            placeholder={
                              process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
                                ? `0.01536 ${
                                    currentTokenSelected == 'Native Token'
                                      ? collateralAsset
                                      : `r${collateralAsset}`
                                  }`
                                : currentTokenSelected == 'Native Token'
                                  ? `min ${
                                      minimumDepositAmount == null
                                        ? 0
                                        : minimumDepositAmount
                                    } ${
                                      currentTokenSelected == 'Native Token'
                                        ? collateralAsset
                                        : `r${collateralAsset}`
                                    }`
                                  : `0.01536 ${
                                      currentTokenSelected == 'Native Token'
                                        ? collateralAsset
                                        : `r${collateralAsset}`
                                    }`
                            }
                            border="0px"
                            _placeholder={{
                              color: '#393D4F',
                              fontSize: '.89rem',
                              fontWeight: '600',
                              outline: 'none',
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
                            inputCollateralAmount >
                            (currentTokenSelected == 'Native Token'
                              ? walletBalance2
                              : userDeposit?.find(
                                  (item: any) =>
                                    item?.rToken ==
                                    collateralBalance.substring(spaceIndex + 1)
                                )?.rTokenFreeParsed)
                              ? '#CF222E'
                              : inputCollateralAmount < 0
                                ? '#CF222E'
                                : process.env.NEXT_PUBLIC_NODE_ENV ==
                                      'mainnet' &&
                                    currentTokenSelected == 'Native Token' &&
                                    inputCollateralAmount > 0 &&
                                    (inputCollateralAmount <
                                      minimumDepositAmount ||
                                      inputCollateralAmount >
                                        maximumDepositAmount)
                                  ? '#CF222E'
                                  : inputCollateralAmount == 0
                                    ? '#4D59E8'
                                    : '#00D395'
                          }`}
                          _hover={{
                            bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
                          }}
                          onClick={() => {
                            if (currentTokenSelected === 'rToken') {
                              setinputCollateralAmount(
                                userDeposit?.find(
                                  (item: any) =>
                                    item?.rToken ==
                                    collateralBalance.substring(spaceIndex + 1)
                                )?.rTokenFreeParsed
                              )
                              setCollateralAmount(
                                userDeposit?.find(
                                  (item: any) =>
                                    item?.rToken ==
                                    collateralBalance.substring(spaceIndex + 1)
                                )?.rTokenFreeParsed
                              )
                              setRTokenAmount(
                                userDeposit?.find(
                                  (item: any) =>
                                    item?.rToken ==
                                    collateralBalance.substring(spaceIndex + 1)
                                )?.rTokenFreeParsed
                              )
                              setSliderValue2(100)
                            } else {
                              setinputCollateralAmount(walletBalance2)
                              setCollateralAmount(walletBalance2)
                              setRTokenAmount(walletBalance2)
                              setSliderValue2(100)
                            }
                          }}
                          isDisabled={collateralTransactionStarted == true}
                          _disabled={{ cursor: 'pointer' }}
                        >
                          MAX
                        </Button>
                      </Box>
                      {inputCollateralAmount >
                        (currentTokenSelected == 'Native Token'
                          ? walletBalance2
                          : userDeposit?.find(
                              (item: any) =>
                                item?.rToken ==
                                collateralBalance.substring(spaceIndex + 1)
                            )?.rTokenFreeParsed) ||
                      (process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                        currentTokenSelected == 'Native Token' &&
                        inputCollateralAmount > 0 &&
                        (inputCollateralAmount < minimumDepositAmount ||
                          inputCollateralAmount > maximumDepositAmount)) ||
                      inputCollateralAmount < 0 ? (
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
                              {process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                              currentTokenSelected == 'Native Token' &&
                              inputCollateralAmount > 0 &&
                              inputCollateralAmount < minimumDepositAmount
                                ? 'less than min amount'
                                : process.env.NEXT_PUBLIC_NODE_ENV ==
                                      'mainnet' &&
                                    currentTokenSelected == 'Native Token' &&
                                    inputCollateralAmount > 0 &&
                                    inputCollateralAmount > maximumDepositAmount
                                  ? 'more than max amount'
                                  : inputCollateralAmount >
                                        (currentTokenSelected == 'Native Token'
                                          ? walletBalance2
                                          : userDeposit?.find(
                                              (item: any) =>
                                                item?.rToken ==
                                                collateralBalance.substring(
                                                  spaceIndex + 1
                                                )
                                            )?.rTokenFreeParsed) ||
                                      inputCollateralAmount >
                                        userDeposit?.find(
                                          (item: any) =>
                                            item?.rToken ==
                                            collateralBalance.substring(
                                              spaceIndex + 1
                                            )
                                        )?.rTokenFreeParsed
                                    ? 'Amount exceeds balance'
                                    : 'Invalid Input'}{' '}
                            </Text>
                          </Text>
                          <Text
                            color="#E6EDF3"
                            display="flex"
                            justifyContent="flex-end"
                          >
                            Wallet Balance:{' '}
                            {currentTokenSelected == 'Native Token'
                              ? numberFormatter(walletBalance2)
                              : numberFormatter(
                                  userDeposit?.find(
                                    (item: any) =>
                                      item?.rToken ==
                                      collateralBalance.substring(
                                        spaceIndex + 1
                                      )
                                  )?.rTokenFreeParsed
                                )}
                            <Text color="#6E7781" ml="0.2rem">
                              {currentTokenSelected == 'Native Token'
                                ? collateralAsset
                                : `r${collateralAsset}`}
                            </Text>
                          </Text>
                        </Text>
                      ) : (
                        <Text
                          color="#E6EDF3"
                          display="flex"
                          justifyContent="flex-end"
                          fontSize="12px"
                          fontWeight="500"
                          fontStyle="normal"
                          fontFamily="Inter"
                        >
                          Wallet Balance:{' '}
                          {currentTokenSelected == 'Native Token'
                            ? numberFormatter(walletBalance2)
                            : numberFormatter(
                                userDeposit?.find(
                                  (item: any) =>
                                    item?.rToken ==
                                    collateralBalance.substring(spaceIndex + 1)
                                )?.rTokenFreeParsed
                              )}
                          <Text color="#6E7781" ml="0.2rem">
                            {currentTokenSelected == 'Native Token'
                              ? collateralAsset
                              : `r${collateralAsset}`}
                          </Text>
                        </Text>
                      )}
                      <Box pt={5} pb={2} mt="1.5rem">
                        <Slider
                          aria-label="slider-ex-6"
                          defaultValue={sliderValue2}
                          value={sliderValue2}
                          onChange={(val) => {
                            setSliderValue2(val)
                            if (currentTokenSelected == 'Native Token') {
                              var ans = (val / 100) * walletBalance2
                              if (val == 100) {
                                setinputCollateralAmount(walletBalance2)
                                setCollateralAmount(walletBalance2)
                                setRTokenAmount(walletBalance2)
                              } else {
                                if (ans < 10) {
                                  setinputCollateralAmount(
                                    parseFloat(ans.toFixed(7))
                                  )
                                  setCollateralAmount(
                                    parseFloat(ans.toFixed(7))
                                  )
                                  setRTokenAmount(parseFloat(ans.toFixed(7)))
                                } else {
                                  ans = Math.round(ans * 100) / 100
                                  // dispatch(setInputSupplyAmount(ans))
                                  setinputCollateralAmount(ans)
                                  setCollateralAmount(ans)
                                  setRTokenAmount(ans)
                                }
                              }
                            } else {
                              var ans =
                                (val / 100) *
                                userDeposit?.find(
                                  (item: any) =>
                                    item?.rToken ==
                                    collateralBalance.substring(spaceIndex + 1)
                                )?.rTokenFreeParsed
                              if (val == 100) {
                                setinputCollateralAmount(
                                  userDeposit?.find(
                                    (item: any) =>
                                      item?.rToken ==
                                      collateralBalance.substring(
                                        spaceIndex + 1
                                      )
                                  )?.rTokenFreeParsed
                                )
                                setCollateralAmount(
                                  userDeposit?.find(
                                    (item: any) =>
                                      item?.rToken ==
                                      collateralBalance.substring(
                                        spaceIndex + 1
                                      )
                                  )?.rTokenFreeParsed
                                )
                                setRTokenAmount(
                                  userDeposit?.find(
                                    (item: any) =>
                                      item?.rToken ==
                                      collateralBalance.substring(
                                        spaceIndex + 1
                                      )
                                  )?.rTokenFreeParsed
                                )
                              } else {
                                if (ans < 10) {
                                  setinputCollateralAmount(ans)
                                  setCollateralAmount(ans)
                                  setRTokenAmount(ans)
                                } else {
                                  ans = Math.round(ans * 100) / 100
                                  // dispatch(setInputSupplyAmount(ans))
                                  setinputCollateralAmount(ans)
                                  setCollateralAmount(ans)
                                  setRTokenAmount(ans)
                                }
                              }
                            }
                            // ans = Math.round(ans * 100) / 100;
                            // // dispatch(setInputSupplyAmount(ans))
                            // setinputCollateralAmount(ans);
                            // setCollateralAmount(ans);
                            // setRTokenAmount(ans);
                          }}
                          isDisabled={collateralTransactionStarted == true}
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
                    <Card
                      background="var(--surface-of-10, rgba(103, 109, 154, 0.10));"
                      mt="2rem"
                      p="1rem"
                      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                    >
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
                            font-size="12px"
                            lineHeight="16px"
                            color="#676D9A"
                          >
                            Borrow amount:
                          </Text>
                          <Tooltip
                            color="#F0F0F5"
                            hasArrow
                            placement="right-start"
                            boxShadow="dark-lg"
                            label="The quantity of tokens you want to borrow from the protocol."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
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
                        <Text color="#676D9A">
                          {numberFormatter(borrowAmount)}{' '}
                          {currentBorrowMarketCoin2}
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
                            font-size="12px"
                            lineHeight="16px"
                            color="#676D9A"
                          >
                            est rTokens minted:
                          </Text>
                          <Tooltip
                            color="#F0F0F5"
                            hasArrow
                            placement="right-start"
                            boxShadow="dark-lg"
                            label="Adding amount as collateral will mint
                             r tokens.
                            These tokens will accrue supply apr
                            and remain locked till the debt is repaid."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
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
                        <Text color="#676D9A">$ {estrTokensMinted}</Text>
                      </Text>
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
                            Fees:
                          </Text>
                          <Tooltip
                            color="#F0F0F5"
                            hasArrow
                            placement="right-start"
                            boxShadow="dark-lg"
                            label="Fees charged by Hashstack protocol. Additional third-party DApp fees may apply as appropriate."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
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
                        <Text color="#676D9A">{fees.supply}%</Text>
                      </Text>

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
                            Borrow APR:
                          </Text>
                          <Tooltip
                            color="#F0F0F5"
                            hasArrow
                            placement="right-start"
                            boxShadow="dark-lg"
                            label="The annual interest rate charged on borrowed funds from the protocol."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
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
                        <Text color="#676D9A">
                          {!borrowAPRs ||
                          borrowAPRs.length === 0 ||
                          !getBorrowAPR(currentBorrowMarketCoin2.slice(1)) ? (
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
                            '-' +
                            getBorrowAPR(currentBorrowMarketCoin2.slice(1)) +
                            '%'
                          )}
                        </Text>
                      </Text>

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
                          >
                            <Box p="1">
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Box>
                        <Text color="#676D9A" fontSize="xs">
                          {!borrowAPRs || borrowAPRs.length === 0 ? (
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
                              getBoostedApr(currentBorrowMarketCoin1.slice(1)) +
                                getBoostedAprSupply(
                                  borrow?.collateralMarket.slice(1)
                                )
                            ) + '%'
                          )}
                        </Text>
                      </Box>
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
                            font-size="12px"
                            lineHeight="16px"
                            color="#676D9A"
                          >
                            Effective APR:
                          </Text>
                          <Tooltip
                            color="#F0F0F5"
                            hasArrow
                            placement="right-start"
                            boxShadow="dark-lg"
                            label="If positive, This is the yield earned by your loan at present. If negative, This is the interest you are paying."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
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
                          color={
                            Number(
                              avgs?.find(
                                (item: any) =>
                                  item?.loanId ==
                                  currentBorrowId1
                                    .slice(currentBorrowId2.indexOf('-') + 1)
                                    .trim()
                              )?.avg
                            ) +
                              getBoostedAprSupply(
                                collateralBalance.substring(spaceIndex + 2)
                              ) <
                            0
                              ? 'rgb(255 94 94)'
                              : '#00D395'
                          }
                          fontSize="12px"
                          fontWeight="400"
                          fontStyle="normal"
                        >
                          {avgs?.find(
                            (item: any) =>
                              item?.loanId ==
                              currentBorrowId2
                                .slice(currentBorrowId2.indexOf('-') + 1)
                                .trim()
                          )?.avg
                            ? numberFormatterPercentage(
                                Number(
                                  avgs?.find(
                                    (item: any) =>
                                      item?.loanId ==
                                      currentBorrowId2
                                        .slice(
                                          currentBorrowId2.indexOf('-') + 1
                                        )
                                        .trim()
                                  )?.avg
                                ) +
                                  getBoostedAprSupply(
                                    collateralBalance.substring(spaceIndex + 2)
                                  )
                              )
                            : '3.2'}
                          %
                        </Text>
                      </Text>
                    </Card>
                    {inputCollateralAmount > 0 &&
                    collateralAsset != 'DAI' &&
                    //123456
                    (process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet'
                      ? currentTokenSelected == 'Native Token'
                        ? inputCollateralAmount > 0 &&
                          inputCollateralAmount >= minimumDepositAmount &&
                          inputCollateralAmount <= maximumDepositAmount
                        : inputCollateralAmount > 0
                      : true) &&
                    (currentTokenSelected == 'Native Token'
                      ? inputCollateralAmount <= walletBalance2
                      : inputCollateralAmount <=
                        userDeposit?.find(
                          (item: any) =>
                            item?.rToken ==
                            collateralBalance.substring(spaceIndex + 1)
                        )?.rTokenFreeParsed) ? (
                      <Box
                        onClick={() => {
                          setCollateralTransactionStarted(true)
                          posthog.capture(
                            'Add Collateral Button Clicked Your Borrow',
                            {
                              Clicked: true,
                            }
                          )
                          dispatch(setTransactionStartedAndModalClosed(false))
                          if (collateralTransactionStarted == false) {
                            handleAddCollateral()
                          }
                        }}
                      >
                        <AnimatedButton
                          background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                          // bgColor="red"
                          // p={0}
                          color="#676D9A"
                          size="sm"
                          width="100%"
                          mt="1.5rem"
                          mb="1.5rem"
                          border="1px solid #676D9A"
                          labelSuccessArray={[
                            'Processing',
                            'Transferring collateral to supply vault.',
                            'Minting & transferring rTokens to the user account.',
                            'Locking rTokens.',
                            'Updating collateral records',
                            // <ErrorButton errorText="Transaction failed" />,
                            // <ErrorButton errorText="Copy error!" />,
                            <SuccessButton
                              key={'successButton'}
                              successText={'Add collateral successful.'}
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
                          isDisabled={collateralTransactionStarted == true}
                        >
                          Add Collateral
                        </AnimatedButton>
                      </Box>
                    ) : (
                      <Button
                        background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                        color="#676D9A"
                        size="sm"
                        width="100%"
                        mt="1.5rem"
                        mb="1.5rem"
                        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                        _hover={{
                          bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
                        }}
                      >
                        Add Collateral
                      </Button>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default YourBorrowModal
