import useBalanceOf from '@/Blockchain/hooks/Reads/useBalanceOf'
import useDeposit from '@/Blockchain/hooks/Writes/useDeposit'
import useWithdrawDeposit from '@/Blockchain/hooks/Writes/useWithdrawDeposit'
import { NativeToken, Token } from '@/Blockchain/interfaces/interfaces'
import { getUserLoans } from '@/Blockchain/scripts/Loans'
import {
  tokenAddressMap,
  tokenDecimalsMap,
} from '@/Blockchain/utils/addressServices'
import {
  BNtoNum,
  etherToWeiBN,
  parseAmount,
  weiToEtherNumber,
} from '@/Blockchain/utils/utils'
import ArrowUp from '@/assets/icons/arrowup'
import CancelIcon from '@/assets/icons/cancelIcon'
import CancelSuccessToast from '@/assets/icons/cancelSuccessToast'
import DAILogo from '@/assets/icons/coins/dai'
import ETHLogo from '@/assets/icons/coins/eth'
import USDCLogo from '@/assets/icons/coins/usdc'
import USDTLogo from '@/assets/icons/coins/usdt'
import WarningIcon from '@/assets/icons/coins/warningIcon'
import DropdownUp from '@/assets/icons/dropdownUpIcon'
import InfoIcon from '@/assets/icons/infoIcon'
import SliderPointer from '@/assets/icons/sliderPointer'
import SliderPointerWhite from '@/assets/icons/sliderPointerWhite'
import SmallErrorIcon from '@/assets/icons/smallErrorIcon'
import SuccessTick from '@/assets/icons/successTick'
import {
  resetModalDropdowns,
  selectCurrentModalDropdown,
  selectModalDropDowns,
  setModalDropdown,
} from '@/store/slices/dropdownsSlice'
import {
  selectActiveTransactions,
  selectAssetWalletBalance,
  selectInputSupplyAmount,
  selectStrkAprData,
  selectTransactionStartedAndModalClosed,
  selectTransactionStatus,
  selectWalletBalance,
  setActiveTransactions,
  setCoinSelectedSupplyModal,
  setInputSupplyAmount,
  setToastTransactionStarted,
  setTransactionStartedAndModalClosed,
  setTransactionStatus,
} from '@/store/slices/userAccountSlice'
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
  Portal,
  Skeleton,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  background,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import {
  useAccount,
  useBalance,
} from '@starknet-react/core'
import React, { useEffect, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { uint256 } from 'starknet'
import BTCLogo from '../../assets/icons/coins/btc'
import AnimatedButton from '../uiElements/buttons/AnimationButton'
import ErrorButton from '../uiElements/buttons/ErrorButton'
import SuccessButton from '../uiElements/buttons/SuccessButton'
import ErrorToast from '../uiElements/toasts/ErrorToast'
import SuccessToast from '../uiElements/toasts/SuccessToast'
// import { useFetchToastStatus } from "../layouts/toasts";
import {
  getExchangeRate,
  getFees,
  getMaximumDepositAmount,
  getMinimumDepositAmount,
  getNFTBalance,
  getNFTMaxAmount,
  getSupplyunlocked,
  getSupplyunlockedBase,
} from '@/Blockchain/scripts/Rewards'
import { get_user_holding_zklend } from '@/Blockchain/scripts/liquidityMigration'
import STRKLogo from '@/assets/icons/coins/strk'
import InfoIconBig from '@/assets/icons/infoIconBig'
import {
  selectFees,
  selectMaximumDepositAmounts,
  selectMinimumDepositAmounts,
  selectNftBalance,
  selectOraclePrices,
  selectProtocolNetworkSelected,
  selectProtocolStats,
  selectTransactionRefresh,
  setMaximumDepositAmounts,
  setTransactionRefresh,
} from '@/store/slices/readDataSlice'
import numberFormatter from '@/utils/functions/numberFormatter'
import numberFormatterPercentage from '@/utils/functions/numberFormatterPercentage'
import mixpanel from 'mixpanel-browser'
import posthog from 'posthog-js'
import TransactionFees from '../../../TransactionFees.json'
import useBalanceofWagmi from '@/Blockchain/hooks/Reads/usebalanceofWagmi'
import { diamondAddress, getTokenFromAddress } from '@/Blockchain/stark-constants'
import { multicall } from '@wagmi/core'
import { config } from '@/services/wagmi/config'
import { useWaitForTransactionReceipt, useWriteContract ,useAccount as useAccountWagmi} from 'wagmi'
import { erc20Abi } from 'viem'
import { baseSepolia } from 'viem/chains'
import { trialabi } from '@/Blockchain/abis_mainnet/trialabi'
import supplyproxyAbi from '../../Blockchain/abis_base_sepolia/supply_proxy_abi.json'
// import useFetchToastStatus from "../layouts/toasts/transactionStatus";
const SupplyModal = ({
  buttonText,
  coin,
  backGroundOverLay,
  currentSupplyAPR,
  setCurrentSupplyAPR,
  supplyAPRs,

  ...restProps
}: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  // const toastHandler = () => {
  //  //console.log("toast called");
  // };
  const [currentTransactionStatus, setCurrentTransactionStatus] = useState('')
  const [transactionStarted, setTransactionStarted] = useState(false)
  const [collateralMarketHoverIndex, setcollateralMarketHoverIndex] =
    useState<Number>(-1)
  const [toastId, setToastId] = useState<any>()
  const [uniqueID, setUniqueID] = useState(0)
  const protocolNetwork = useSelector(selectProtocolNetworkSelected)
  const [withdrawAmount, setwithdrawAmount] = useState(0)
  const {
    depositAmount,
    setDepositAmount,
    asset,
    setAsset,
    dataDeposit,
    errorDeposit,
    resetDeposit,
    // depositTransHash,
    // setDepositTransHash,
    writeAsyncDeposit,
    writeAsyncDepositStake,

    isErrorDeposit,
    isIdleDeposit,
    isSuccessDeposit,
    statusDeposit,
  } = useDeposit()
  useEffect(() => {
    setAsset(coin ? coin?.name : 'BTC')
  }, [coin])

  const [currentSelectedCoin, setCurrentSelectedCoin] = useState(
    coin ? coin?.name : 'BTC'
  )
  ////console.log("wallet balance",typeof Number(walletBalance))
  ////console.log("deposit amount", typeof depositAmount);
  const [inputAmount, setinputAmount] = useState<number>(0)
  const [sliderValue, setSliderValue] = useState(0)
  const [sliderWithdrawValue, setsliderWithdrawValue] = useState(0)
  const [buttonId, setButtonId] = useState(0)

  const coinIndex: any = [
    { token: 'USDT', idx: 1 },
    { token: 'USDC', idx: 2 },
    { token: 'BTC', idx: 3 },
    { token: 'ETH', idx: 4 },
    { token: 'DAI', idx: 5 },
    { token: 'STRK', idx: 0 },
  ]

  // useEffect(() => {
  //   // setCurrentSupplyAPR(
  //   //   coinIndex.map(({ curr }: any) => curr?.token === currentSelectedCoin)?.idx
  //   // );
  //   ////console.log("currentSupplyAPR", currentSupplyAPR);
  // }, [currentSupplyAPR]);

  const getUniqueId = () => uniqueID

  interface assetB {
    USDT: any
    USDC: any
    BTC: any
    ETH: any
    DAI: any
  }
  /* eslint-disable react-hooks/rules-of-hooks */
  const walletBalances: assetB | any =
    protocolNetwork === 'Starknet'
      ? {
          USDT: useBalanceOf(tokenAddressMap['USDT']),
          USDC: useBalanceOf(tokenAddressMap['USDC']),
          BTC: useBalanceOf(tokenAddressMap['BTC']),
          ETH: useBalanceOf(tokenAddressMap['ETH']),
          DAI: useBalanceOf(tokenAddressMap['DAI']),
          STRK: useBalanceOf(tokenAddressMap['STRK']),
        }
      : {
        USDT:useBalanceofWagmi(tokenAddressMap['USDT']),
        USDC:useBalanceofWagmi(tokenAddressMap['USDC']),
        DAI:useBalanceofWagmi(tokenAddressMap['DAI']),
        }
  const assetBalance: assetB | any =
    protocolNetwork === 'Starknet'
      ? {
          USDT: useBalanceOf(tokenAddressMap['USDT']),
          USDC: useBalanceOf(tokenAddressMap['USDC']),
          BTC: useBalanceOf(tokenAddressMap['BTC']),
          ETH: useBalanceOf(tokenAddressMap['ETH']),
          DAI: useBalanceOf(tokenAddressMap['DAI']),
          STRK: useBalanceOf(tokenAddressMap['STRK']),
        }
      : {
        USDT:useBalanceofWagmi(tokenAddressMap['USDT']),
        USDC:useBalanceofWagmi(tokenAddressMap['USDC']),
        DAI:useBalanceofWagmi(tokenAddressMap['DAI']),
        }
  const withdrawBalances:any={
    USDT:useBalanceofWagmi(tokenAddressMap['rUSDT']),
    USDC:useBalanceofWagmi(tokenAddressMap['rUSDC']),
    DAI:useBalanceofWagmi(tokenAddressMap['rDAI']),
  }
  /* eslint-enable react-hooks/rules-of-hooks */
  const { writeContractAsync:writeContractAsyncApprove, data:dataApprove, error,status:statusApprove } = useWriteContract({
    config,
  })
  const { writeContractAsync:writeContractAsyncDeposit, data:dataDepositBase } = useWriteContract({
    config,
  })
  const { writeContractAsync:writeContractAsyncWithdraw, data:dataWithdraw } = useWriteContract({
    config,
  })
  ////console.log(walletBalances,"wallet balances in supply modal")

  // const transactionStarted = useSelector(selectTransactionStarted);
  // const currentTransactionStatus = useSelector(selectCurrentTransactionStatus);

  // const [transactionStarted, setTransactionStarted] = useState(false);
  // const [toastTransactionStarted, setToastTransactionStarted] = useState(false);
  ////console.log(Number(
  //   BNtoNum(
  //     uint256.uint256ToBN(
  //       walletBalances["ETH"]?.dataBalanceOf?.balance
  //     ),tokenDecimalsMap["ETH"]
  //   )
  // ))

  const dispatch = useDispatch()
  const modalDropdowns = useSelector(selectModalDropDowns)

  // const walletBalances = useSelector(selectAssetWalletBalance);
  // const transactionRefresh=useSelector(selectTransactionRefresh);
  const strkData = useSelector(selectStrkAprData)
  const oraclePrices = useSelector(selectOraclePrices)
  const fees = useSelector(selectFees)
  const [walletBalance, setwalletBalance] = useState(
    walletBalances[coin?.name]?.statusBalanceOf === 'success'
      ? protocolNetwork === 'Starknet'
        ? parseAmount(
            String(
              uint256.uint256ToBN(
                walletBalances[coin?.name]?.dataBalanceOf?.balance
              )
            ),
            tokenDecimalsMap[coin?.name]
          )
        : Number(walletBalances[coin?.name]?.dataBalanceOf?.formatted)
      : 0
  )
  const [withdrawwalletBalance, setwithdrawwalletBalance] = useState(
    withdrawBalances[coin?.name]?.statusBalanceOf === 'success'
        ? Number(withdrawBalances[coin?.name]?.dataBalanceOf?.formatted)
      : 0
  )
  const getBoostedApr = (coin: any) => {
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

  // useEffect(()=>{
  //  //console.log(
  //     Number(parseAmount(
  //       uint256.uint256ToBN(
  //         walletBalances[coin?.name]?.dataBalanceOf?.balance
  //       ),
  //       tokenDecimalsMap[coin?.name]
  //     )),currentSelectedCoin,"coin bug"
  //   );
  // },[currentSelectedCoin,coin])
  useEffect(() => {
    setwalletBalance(
      walletBalances[coin?.name]?.statusBalanceOf === 'success'
        ? protocolNetwork === 'Starknet'
          ? parseAmount(
              String(
                uint256.uint256ToBN(
                  walletBalances[coin?.name]?.dataBalanceOf?.balance
                )
              ),
              tokenDecimalsMap[coin?.name]
            )
          : Number(walletBalances[coin?.name]?.dataBalanceOf?.formatted)
        : 0
    )
    ////console.log("supply modal status wallet balance",walletBalances[coin?.name]?.statusBalanceOf)
  }, [walletBalances[coin?.name]?.statusBalanceOf])

  useEffect(()=>{
    setwithdrawwalletBalance(Number(withdrawBalances[coin?.name]?.dataBalanceOf?.formatted))
  },[withdrawBalances[coin?.name]?.statusBalanceOf])
  // useEffect(()=>{

  // },[currentSelectedCoin])
  ////console.log(walletBalances['BTC']);
  // const walletBalance = JSON.parse(useSelector(selectWalletBalance))
  // const [transactionFailed, setTransactionFailed] = useState(false);

  // const showToast = () => {};

  // // const recieptData = useWaitForTransaction({
  // //   hash: depositTransHash,
  // //   watch: true,
  // //   onPending: showToast,
  // // });

  // // const showToast = () => {

  // // }
  // const { address: account } = useAccount();
  const [ischecked, setIsChecked] = useState(false)
  const [depositTransHash, setDepositTransHash] = useState('')
  const [isToastDisplayed, setToastDisplayed] = useState(false)
  const [txStatus , settxStatus  ] = useState(false);
  const [txloading, setTxloading] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [enteredtransaction, setenteredtransaction] = useState(false)
  const {address:addressbase}=useAccountWagmi()
  let activeTransactions = useSelector(selectActiveTransactions)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let data: any = localStorage.getItem('transactionCheck')
      let values = data.split(',')
      let lastValue = values[values.length - 1]
      if (
        String(activeTransactions[activeTransactions.length - 1]?.uniqueID) ===
        lastValue.replace(/\[|\]/g, '')
      ) {
        if (
          activeTransactions[activeTransactions.length - 1]
            ?.transaction_hash === ''
        ) {
          resetStates()
          onClose()
        }
      }
    }, 15000) // 5000 milliseconds = 5 seconds

    return () => clearTimeout(timeoutId) // Cleanup function to clear the timeout when component unmounts or when activeTransactions changes
  }, [activeTransactions])
  // useEffect(() => {
  //   if (activeTransactions)
  //    //console.log("activeTransactions ", activeTransactions);
  // }, [activeTransactions]);
  // const [toastId, setToastId] = useState<any>();
  // const recieptData = useWaitForTransaction({
  //   hash: depositTransHash,
  //   watch: true,
  //   onReceived: () => {
  //    //console.log("trans received");
  //   },
  //   onPending: () => {
  //     setCurrentTransactionStatus(true);
  //     toast.dismiss(toastId);
  //    //console.log("trans pending");
  //     if (isToastDisplayed == false) {
  //       toast.success(
  //         `You have successfully supplied ${inputAmount} ${currentSelectedCoin}`,
  //         {
  //           position: toast.POSITION.BOTTOM_RIGHT,
  //         }
  //       );
  //       setToastDisplayed(true);
  //     }
  //   },
  //   onRejected(transaction) {
  //     toast.dismiss(toastId);
  //    //console.log("treans rejected", transaction);
  //   },
  //   onAcceptedOnL1: () => {
  //     setCurrentTransactionStatus(true);
  //    //console.log("trans onAcceptedOnL1");
  //   },
  //   onAcceptedOnL2(transaction) {
  //     setCurrentTransactionStatus(true);
  //     if (!isToastDisplayed) {
  //       toast.success(
  //         `You have successfully supplied ${inputAmount} ${currentSelectedCoin}`,
  //         {
  //           position: toast.POSITION.BOTTOM_RIGHT,
  //         }
  //       );
  //       setToastDisplayed(true);
  //     }
  //    //console.log("trans onAcceptedOnL2 - ", transaction);
  //   },
  // });
  // useEffect(() => {
  //   // const status = recieptData?.data?.status;
  //  //console.log("trans supply modal ", recieptData?.data?.status);
  //   if (recieptData?.data?.status == "PENDING") {
  //     setCurrentTransactionStatus(true);
  //     toast.dismiss(toastId);
  //    //console.log("trans pending - - -");
  //     if (isToastDisplayed == false) {
  //       toast.success(
  //         `You have successfully supplied ${inputAmount} ${currentSelectedCoin}`,
  //         {
  //           position: toast.POSITION.BOTTOM_RIGHT,
  //         }
  //       );
  //       setToastDisplayed(true);
  //     }
  //   } else if (recieptData?.data?.status == "RECEIVED") {
  //    //console.log("trans received - - -");
  //   } else if (recieptData?.data?.status == "REJECTED") {
  //     toast.dismiss(toastId);
  //    //console.log("treans rejected - - -");
  //   } else if (recieptData?.data?.status == "ACCEPTED_ON_L2") {
  //     setCurrentTransactionStatus(true);
  //     if (!isToastDisplayed) {
  //       toast.success(
  //         `You have successfully supplied ${inputAmount} ${currentSelectedCoin}`,
  //         {
  //           position: toast.POSITION.BOTTOM_RIGHT,
  //         }
  //       );
  //       setToastDisplayed(true);
  //     }
  //    //console.log("trans onAcceptedOnL2 - - -");
  //   } else if (status == "ACCEPTED_ON_L1") {
  //     setCurrentTransactionStatus(true);
  //    //console.log("trans onAcceptedOnL1 - - -");
  //   }
  // }, [recieptData?.data?.status]);
  // setInterval(() =>//console.log("recieptData", recieptData), 5000);

  // const recieptData2 = useWaitForTransaction({
  //   hash: depositTransHash,
  //   watch: true,
  //   onReceived: () => {
  //    //console.log("trans received");
  //   },
  //   onPending: () => {
  //     setCurrentTransactionStatus(true);
  //    //console.log("trans pending");
  //     if (isToastDisplayed==false) {
  //       toast.success(`You have successfully supplied ${inputAmount} ${currentSelectedCoin}`, {
  //         position: toast.POSITION.BOTTOM_RIGHT
  //       });
  //       setToastDisplayed(true);
  //     }
  //   },
  //   onRejected(transaction) {
  //    //console.log("treans rejected");
  //   },
  //   onAcceptedOnL1: () => {
  //     setCurrentTransactionStatus(true);
  //    //console.log("trans onAcceptedOnL1");
  //   },
  //   onAcceptedOnL2(transaction) {
  //     setCurrentTransactionStatus(true);
  //     if (!isToastDisplayed) {
  //       toast.success(`You have successfully supplied ${inputAmount} ${currentSelectedCoin}`, {
  //         position: toast.POSITION.BOTTOM_RIGHT
  //       });
  //       setToastDisplayed(true);
  //     }
  //    //console.log("trans onAcceptedOnL2 - ", transaction);
  //   },
  // });

  const [failureToastDisplayed, setFailureToastDisplayed] = useState(false)
  // const recieptData = useFetchToastStatus({
  //   hash: depositTransHash,
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
  //         `You have successfully supplied ${inputAmount} ${currentSelectedCoin}`,
  //         {
  //           position: toast.POSITION.BOTTOM_RIGHT,
  //         }
  //       );
  //       setToastDisplayed(true);
  //     }
  //   },
  //   onRejected(transaction: any) {
  //     setCurrentTransactionStatus("Failed");
  //     toast.dismiss(toastId);
  //     if (!failureToastDisplayed) {
  //      //console.log("treans rejected", transaction);
  //       dispatch(setTransactionStatus("failed"));
  //       const toastContent = (
  //         <div>
  //           Transaction failed{" "}
  //           <CopyToClipboard text={"Transaction failed"}>
  //             <Text as="u">copy error!</Text>
  //           </CopyToClipboard>
  //         </div>
  //       );
  //       setFailureToastDisplayed(true);
  //       toast.error(toastContent, {
  //         position: toast.POSITION.BOTTOM_RIGHT,
  //         autoClose: false,
  //       });
  //     }
  //   },
  //   onAcceptedOnL1: () => {
  //     setCurrentTransactionStatus("success");
  //    //console.log("trans onAcceptedOnL1");
  //   },
  //   onAcceptedOnL2(transaction: any) {
  //     toast.dismiss(toastId);
  //     setCurrentTransactionStatus("success");
  //     if (!isToastDisplayed) {
  //       toast.success(
  //         `You have successfully supplied ${inputAmount} ${currentSelectedCoin}`,
  //         {
  //           position: toast.POSITION.BOTTOM_RIGHT,
  //         }
  //       );
  //       setToastDisplayed(true);
  //     }
  //    //console.log("trans onAcceptedOnL2 - ", transaction);
  //   },
  // });
  // const { hashes, addTransaction } = useTransactionManager();
  // const transactionStartedAndModalClosed=useSelector(selectTransactionStartedAndModalClosed);
  let protocolStats = useSelector(selectProtocolStats)
  const handleTransaction = async () => {
    try {
      if (ischecked) {
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
            message: `Successfully staked ${inputAmount} ${currentSelectedCoin}`,
            // message: `Transaction successful`,
            toastId: toastid,
            setCurrentTransactionStatus: setCurrentTransactionStatus,
            uniqueID: uqID,
          }
          // addTransaction({ hash: deposit?.transaction_hash });
          activeTransactions?.push(trans_data)

          dispatch(setActiveTransactions(activeTransactions))
        }
        posthog.capture('Supply Market Status', {
          Status: 'Success Deposit and Stake',
          Token: currentSelectedCoin,
          TokenAmount: inputAmount,
        })
        setDepositTransHash(depositStake?.transaction_hash)
        const uqID = getUniqueId()
        let data: any = localStorage.getItem('transactionCheck')
        data = data ? JSON.parse(data) : []
        if (data && data.includes(uqID)) {
          dispatch(setTransactionStatus('success'))
        }
        ////console.log("Status transaction", deposit);
        //console.log(isSuccessDeposit, "success ?");
      } else {
        posthog.capture('Action Selected', {
          Action: 'Deposit',
        })
        const deposit = await writeAsyncDeposit()
        if (deposit?.transaction_hash) {
          const toastid = toast.info(
            // `Please wait your transaction is running in background : supplying - ${inputAmount} ${currentSelectedCoin} `,
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
            transaction_hash: deposit?.transaction_hash.toString(),
            message: `Successfully supplied ${inputAmount} ${currentSelectedCoin}`,
            // message: `Transaction successful`,
            toastId: toastid,
            setCurrentTransactionStatus: setCurrentTransactionStatus,
            uniqueID: uqID,
          }
          // addTransaction({ hash: deposit?.transaction_hash });
          activeTransactions?.push(trans_data)

          dispatch(setActiveTransactions(activeTransactions))
        }
        // const deposit = await writeAsyncDepositStake();
        posthog.capture('Supply Market Status', {
          Status: 'Success',
          Token: currentSelectedCoin,
          TokenAmount: inputAmount,
        })
        setDepositTransHash(deposit?.transaction_hash)
        // if (recieptData?.data?.status == "ACCEPTED_ON_L2") {
        // }
        const uqID = getUniqueId()
        let data: any = localStorage.getItem('transactionCheck')
        data = data ? JSON.parse(data) : []
        if (data && data.includes(uqID)) {
          dispatch(setTransactionStatus('success'))
        }
        ////console.log("Status transaction", deposit);
        //console.log(isSuccessDeposit, "success ?");
      }
    } catch (err: any) {
      // setTransactionFailed(true);
      posthog.capture('Supply Market Status', {
        Status: 'Failure',
      })
      const uqID = getUniqueId()
      let data: any = localStorage.getItem('transactionCheck')
      data = data ? JSON.parse(data) : []
      if (data && data.includes(uqID)) {
        setTransactionStarted(false)
        // dispatch(setTransactionStatus("failed"));
      }
      //console.log(uqID, "transaction check supply transaction failed : ", err);

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
      //console.log("supply", err);
      // toast({
      //   description: "An error occurred while handling the transaction. " + err,
      //   variant: "subtle",
      //   position: "bottom-right",
      //   status: "error",
      //   isClosable: true,
      // });
      // toast({
      //   variant: "subtle",
      //   position: "bottom-right",
      //   render: () => (
      //     <Box
      //       display="flex"
      //       flexDirection="row"
      //       justifyContent="center"
      //       alignItems="center"
      //       bg="rgba(40, 167, 69, 0.5)"
      //       height="48px"
      //       borderRadius="6px"
      //       border="1px solid rgba(74, 194, 107, 0.4)"
      //       padding="8px"
      //     >
      //       <Box>
      //         <SuccessTick />
      //       </Box>
      //       <Text>You have successfully supplied 1000USDT to check go to </Text>
      //       <Button variant="link">Your Supply</Button>
      //       <Box>
      //         <CancelSuccessToast />
      //       </Box>
      //     </Box>
      //   ),
      //   isClosable: true,
      // });
    }
  }
  const handleTransactionApprove = async () => {
    try {
      {
        const approve=await writeContractAsyncApprove({
          abi:trialabi,
          address: tokenAddressMap[currentSelectedCoin],
          functionName: 'approve',
          args: [
            diamondAddress,
            BigInt(etherToWeiBN(depositAmount, currentSelectedCoin).toString())
          ],
          chain:baseSepolia
       })
       const toastid = toast.info(
        // `Please wait your transaction is running in background : supply and staking - ${inputAmount} ${currentSelectedCoin} `,
        `Transaction pending`,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: false,
        }
      )
      setToastId(toastid)
        setDepositTransHash(approve as any)
        // const uqID = getUniqueId()
        // let data: any = localStorage.getItem('transactionCheck')
        // data = data ? JSON.parse(data) : []
        // if (data && data.includes(uqID)) {
        //   dispatch(setTransactionStatus('success'))
        // }
        ////console.log("Status transaction", deposit);
        //console.log(isSuccessDeposit, "success ?");
      }
    } catch (err: any) {
      console.log(err,"err approve")
      // setTransactionFailed(true);
      // console.log(err,"approve err")
      const uqID = getUniqueId()
      let data: any = localStorage.getItem('transactionCheck')
      data = data ? JSON.parse(data) : []
      if (data && data.includes(uqID)) {
        setTransactionStarted(false)
        // dispatch(setTransactionStatus("failed"));
      }
      //console.log(uqID, "transaction check supply transaction failed : ", err);

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
      //console.log("supply", err);
      // toast({
      //   description: "An error occurred while handling the transaction. " + err,
      //   variant: "subtle",
      //   position: "bottom-right",
      //   status: "error",
      //   isClosable: true,
      // });
      // toast({
      //   variant: "subtle",
      //   position: "bottom-right",
      //   render: () => (
      //     <Box
      //       display="flex"
      //       flexDirection="row"
      //       justifyContent="center"
      //       alignItems="center"
      //       bg="rgba(40, 167, 69, 0.5)"
      //       height="48px"
      //       borderRadius="6px"
      //       border="1px solid rgba(74, 194, 107, 0.4)"
      //       padding="8px"
      //     >
      //       <Box>
      //         <SuccessTick />
      //       </Box>
      //       <Text>You have successfully supplied 1000USDT to check go to </Text>
      //       <Button variant="link">Your Supply</Button>
      //       <Box>
      //         <CancelSuccessToast />
      //       </Box>
      //     </Box>
      //   ),
      //   isClosable: true,
      // });
    }
  }
  const handleTransactionDeposit = async () => {
    try {
      {
        const approve=await writeContractAsyncDeposit({
          abi:supplyproxyAbi,
          address: diamondAddress as any,
          functionName: 'deposit',
          args: [
            tokenAddressMap[currentSelectedCoin],
            BigInt(etherToWeiBN(depositAmount, currentSelectedCoin).toString()),
            addressbase,
          ],
          chain:baseSepolia
       },
      )
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
        transaction_hash: approve,
        message: `Successfully deposited ${depositAmount} ${currentSelectedCoin}`,
        // message: `Transaction successful`,
        toastId: 2,
        setCurrentTransactionStatus: setCurrentTransactionStatus,
        uniqueID: uqID,
      }
      activeTransactions?.push(trans_data)
      dispatch(setActiveTransactions(activeTransactions))
        let data: any = localStorage.getItem('transactionCheck')
        data = data ? JSON.parse(data) : []
        if (data && data.includes(uqID)) {
          dispatch(setTransactionStatus('success'))
        }
        ////console.log("Status transaction", deposit);
        //console.log(isSuccessDeposit, "success ?");
      }
    } catch (err: any) {
      console.log(err,"err deposit")
      setDeclined(true)
      setTransactionStarted(false)
      // setTransactionFailed(true);
      //console.log(uqID, "transaction check supply transaction failed : ", err);

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
      //console.log("supply", err);
      // toast({
      //   description: "An error occurred while handling the transaction. " + err,
      //   variant: "subtle",
      //   position: "bottom-right",
      //   status: "error",
      //   isClosable: true,
      // });
      // toast({
      //   variant: "subtle",
      //   position: "bottom-right",
      //   render: () => (
      //     <Box
      //       display="flex"
      //       flexDirection="row"
      //       justifyContent="center"
      //       alignItems="center"
      //       bg="rgba(40, 167, 69, 0.5)"
      //       height="48px"
      //       borderRadius="6px"
      //       border="1px solid rgba(74, 194, 107, 0.4)"
      //       padding="8px"
      //     >
      //       <Box>
      //         <SuccessTick />
      //       </Box>
      //       <Text>You have successfully supplied 1000USDT to check go to </Text>
      //       <Button variant="link">Your Supply</Button>
      //       <Box>
      //         <CancelSuccessToast />
      //       </Box>
      //     </Box>
      //   ),
      //   isClosable: true,
      // });
    }
  }
  const handleTransactionWithdraw = async () => {
    try {
      {
        const dataWithdraw=await writeContractAsyncWithdraw({
          abi:supplyproxyAbi,
          address: diamondAddress as any,
          functionName: 'withdrawDeposit',
          args: [
            tokenAddressMap[asset],
            BigInt(etherToWeiBN(withdrawAmount, asset).toString()),
            addressbase,
            addressbase
          ],
          chain:baseSepolia
       },
      )

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
        transaction_hash: dataWithdraw,
        message: `Successfully withdraw ${withdrawAmount} ${currentSelectedCoin}`,
        // message: `Transaction successful`,
        toastId: toastid,
        setCurrentTransactionStatus: setCurrentTransactionStatus,
        uniqueID: uqID,
      }
      activeTransactions?.push(trans_data)

      dispatch(setActiveTransactions(activeTransactions))
      setDepositTransHash(dataWithdraw)
        let data: any = localStorage.getItem('transactionCheck')
        data = data ? JSON.parse(data) : []
        if (data && data.includes(uqID)) {
          dispatch(setTransactionStatus('success'))
        }
        ////console.log("Status transaction", deposit);
        //console.log(isSuccessDeposit, "success ?");
      }
    } catch (err: any) {
      // setTransactionFailed(true);
      console.log(err,"withdraw err")
      const uqID = getUniqueId()
      let data: any = localStorage.getItem('transactionCheck')
      data = data ? JSON.parse(data) : []
      if (data && data.includes(uqID)) {
        setTransactionStarted(false)
        // dispatch(setTransactionStatus("failed"));
      }
      //console.log(uqID, "transaction check supply transaction failed : ", err);

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
      // toast({
      //   description: "An error occurred while handling the transaction. " + err,
      //   variant: "subtle",
      //   position: "bottom-right",
      //   status: "error",
      //   isClosable: true,
      // });
      // toast({
      //   variant: "subtle",
      //   position: "bottom-right",
      //   render: () => (
      //     <Box
      //       display="flex"
      //       flexDirection="row"
      //       justifyContent="center"
      //       alignItems="center"
      //       bg="rgba(40, 167, 69, 0.5)"
      //       height="48px"
      //       borderRadius="6px"
      //       border="1px solid rgba(74, 194, 107, 0.4)"
      //       padding="8px"
      //     >
      //       <Box>
      //         <SuccessTick />
      //       </Box>
      //       <Text>You have successfully supplied 1000USDT to check go to </Text>
      //       <Button variant="link">Your Supply</Button>
      //       <Box>
      //         <CancelSuccessToast />
      //       </Box>
      //     </Box>
      //   ),
      //   isClosable: true,
      // });
    }
  }

  const { isLoading:approveLoading, isSuccess:approveSuccess,data } = useWaitForTransactionReceipt({
    hash: dataApprove,
  })

  const { isLoading:approveLoadingDeposit, isSuccess:approveSuccessDeposit } = useWaitForTransactionReceipt({
    hash: dataDepositBase,
  })

  useEffect(()=>{
    if(approveSuccess && !approveLoading){
      settxStatus(true);
      setTxloading(false);
    }
  
  },[approveSuccess]);

  // useEffect(()=>{
  //   if(approveSuccessDeposit &&!approveLoadingDeposit){
  //     console.log('2nd')
  //     dispatch(setTransactionStatus("success"))
  //     toast.success(`Successfully supplied ${depositAmount} ${currentSelectedCoin}`,            
  //       {
  //       position: toast.POSITION.BOTTOM_RIGHT,
  //     })
  //   }
  // },[approveSuccessDeposit])

  useEffect(()=>{
    if((approveSuccess ) && txStatus && !txloading && !declined &&!enteredtransaction){
      setenteredtransaction(true)
      handleTransactionDeposit()
    }
  },[approveSuccess,txStatus,txloading])

  

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
      default:
        break
    }
  }

  const [estSupply, setEstSupply] = useState<any>()

  useEffect(() => {
    const fetchSupplyUnlocked = async () => {
      try {
        if (asset && withdrawAmount > 0) {
          if(protocolNetwork==='Starknet'){
            const data = await getSupplyunlocked(
              asset,
              withdrawAmount
            )
            ////console.log(data, "data in your supply");
            setEstSupply(data)
          }else{
            const data = await getSupplyunlockedBase(
              asset,
              withdrawAmount
            )
            ////console.log(data, "data in your supply");
            setEstSupply(data)
          }
        }
      } catch (err) {
        //console.log(err, "err in you supply");
      }
    }
    fetchSupplyUnlocked()
  }, [asset, withdrawAmount])

  // useEffect(() => {
  //   getUserLoans("0x05f2a945005c66ee80bc3873ade42f5e29901fc43de1992cd902ca1f75a1480b");
  // }, [])
  ////console.log(inputAmount);
  const [minimumDepositAmount, setMinimumDepositAmount] = useState<any>(0)
  const [maximumDepositAmount, setmaximumDepositAmount] = useState<any>(20000)
  const minAmounts = useSelector(selectMinimumDepositAmounts)
  const maxAmounts = useSelector(selectMaximumDepositAmounts)
  useEffect(() => {
    if(protocolNetwork==='Starknet'){
      setMinimumDepositAmount(minAmounts['r' + currentSelectedCoin])
      setmaximumDepositAmount(maxAmounts['r' + currentSelectedCoin])
    }
  }, [currentSelectedCoin, minAmounts, maxAmounts])

  const [exchangeRate, setexchangeRate] = useState<any>()

  useEffect(()=>{
    const fetchData=async()=>{
      const res=await getExchangeRate(asset)
      if(res){
        setexchangeRate(res)
      }
    }
    fetchData()
  },[asset])
  ////console.log(nft,"nft")
  // useEffect(()=>{
  //     const data=useSelector(selectMinimumDepositAmounts);
  //     setMinimumDepositAmount(data(currentSelectedCoin));
  //   const fetchMaxDeposit=async()=>{
  //     const data=await getMaximumDepositAmount("r"+currentSelectedCoin);
  //     setmaximumDepositAmount(data);
  //   }
  //   fetchMaxDeposit();

  // },[currentSelectedCoin])

  //This Function handles the modalDropDowns
  const handleDropdownClick = (dropdownName: any) => {
    // Dispatches an action called setModalDropdown with the dropdownName as the payload
    dispatch(setModalDropdown(dropdownName))
  }
  const activeModal = Object.keys(modalDropdowns).find(
    (key) => modalDropdowns[key] === true
  )
  ////console.log(activeModal)

  //This function is used to find the percentage of the slider from the input given by the user
  const handleChange = (newValue: any) => {
    // Calculate the percentage of the new value relative to the wallet balance
    if (newValue > 9_000_000_000) return
    // check if newValue is float, if it is then round off to 6 decimals

    var percentage = (newValue * 100) / walletBalance
    // if (walletBalance == 0) {
    //   setDepositAmount(0);
    //   setinputAmount(0);
    // }
    percentage = Math.max(0, percentage)
    if (percentage > 100) {
      setSliderValue(100)
      setDepositAmount(newValue)
      setinputAmount(newValue)
      dispatch(setInputSupplyAmount(newValue))
    } else {
      percentage = Math.round(percentage)
      if (isNaN(percentage)) {
      } else {
        setSliderValue(percentage)
        setDepositAmount(newValue)
        setinputAmount(newValue)
        dispatch(setInputSupplyAmount(newValue))
      }
    }
  }

  const handleWithdrawChange = (newValue: any) => {
    // Calculate the percentage of the new value relative to the wallet balance
    if (newValue > 9_000_000_000) return
    // check if newValue is float, if it is then round off to 6 decimals

    var percentage = (newValue * 100) / withdrawwalletBalance
    // if (walletBalance == 0) {
    //   setDepositAmount(0);
    //   setinputAmount(0);
    // }
    percentage = Math.max(0, percentage)
    if (percentage > 100) {
      setsliderWithdrawValue(100)
      setwithdrawAmount(newValue)
      setinputAmount(newValue)
    } else {
      percentage = Math.round(percentage)
      if (isNaN(percentage)) {
      } else {
        setsliderWithdrawValue(percentage)
        setwithdrawAmount(newValue)
        setinputAmount(newValue)
      }
    }
  }

  const coins: NativeToken[] =protocolNetwork==='Starknet'? ['BTC', 'USDT', 'USDC', 'ETH', 'STRK']:[ 'USDT', 'USDC','DAI']
  const [selectedTab, setSelectedTab] = useState('supply')
  const resetStates = () => {
    setDepositAmount(0)
    setwithdrawAmount(0)
    setSliderValue(0)
    setsliderWithdrawValue(0)
    setToastDisplayed(false)
    settxStatus(false)
    setTxloading(false)
    setDeclined(false)
    setenteredtransaction(false)
    setEstSupply(undefined)
    setAsset(coin ? coin?.name : 'BTC')
    setCurrentSelectedCoin(coin ? coin?.name : 'BTC')
    setIsChecked(true)
    setwalletBalance(
      walletBalances[coin?.name]?.statusBalanceOf === 'success'
        ? protocolNetwork === 'Starknet'
          ? parseAmount(
              String(
                uint256.uint256ToBN(
                  walletBalances[coin?.name]?.dataBalanceOf?.balance
                )
              ),
              tokenDecimalsMap[coin?.name]
            )
          : Number(walletBalances[coin?.name]?.dataBalanceOf?.formatted)
        : 0
    )
    setwithdrawwalletBalance(Number(withdrawBalances[coin?.name]?.dataBalanceOf?.formatted))

    // if (transactionStarted) dispatch(setTransactionStarted(""));
    setTransactionStarted(false)
    dispatch(resetModalDropdowns())
    dispatch(setTransactionStatus(''))
    setCurrentTransactionStatus('')
    setDepositTransHash('')
  }

  useEffect(() => {
    setDepositAmount(0)
    setwithdrawAmount(0)
    setinputAmount(0)
    setSliderValue(0)
  }, [currentSelectedCoin])

  return (
    <div>
      <Button
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
          dispatch(setToastTransactionStarted(false))
        }}
        {...restProps}
      >
        {buttonText !== 'Click here to supply' ? (
          buttonText === 'Supply from metrics' ? (
            <Button w="70px" h="32px" fontSize="14px" p="12px" mx="auto">
              Supply
            </Button>
          ) : (
            buttonText
          )
        ) : (
          <Text fontSize="sm">Click here to supply</Text>
        )}
      </Button>
      <Portal>
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
            dispatch(setTransactionStartedAndModalClosed(true))
            resetStates()
            onClose()
          }}
          size={{ width: '700px', height: '100px' }}
          isCentered
          scrollBehavior="inside"
        >
          <ModalOverlay bg={backGroundOverLay} mt="3.8rem" />
          <ModalContent
            background="var(--Base_surface, #02010F)"
            color="white"
            borderRadius="md"
            maxW="462px"
            zIndex={1}
            mt="8rem"
            className="modal-content"
          >
            <ModalHeader
              mt="1rem"
              fontSize="14px"
              fontWeight="600"
              fontStyle="normal"
              lineHeight="20px"
              display="flex"
              alignItems="center"
              gap="2"
            >
              {selectedTab==='supply'?'Supply':'Withdraw'}
              <Tooltip
                hasArrow
                arrowShadowColor="#2B2F35"
                placement="right"
                boxShadow="dark-lg"
                label="Supply the tokens and receive the supply APR."
                bg="#02010F"
                fontSize={'13px'}
                fontWeight={'400'}
                borderRadius={'lg'}
                padding={'2'}
                color="#F0F0F5"
                border="1px solid"
                borderColor="#23233D"
              >
                <Box>
                  <InfoIconBig />
                </Box>
              </Tooltip>
            </ModalHeader>
            <ModalCloseButton mt="1rem" mr="1rem" />
            <ModalBody>
              <Tabs variant="unstyled">
                <TabPanels>
                  <TabPanel p="0" m="0">
                    <Card
                      background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                      mb="0.5rem"
                      p="1rem"
                      mt="-1.5"
                    >
                      <Text color="#676D9A" display="flex" alignItems="center">
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontStyle="normal"
                          fontWeight="400"
                        >
                          Supply Market
                        </Text>
                        <Box>
                          <Tooltip
                            hasArrow
                            arrowShadowColor="#2B2F35"
                            placement="right"
                            boxShadow="dark-lg"
                            label="The tokens selected to supply on the protocol."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
                            color="#F0F0F5"
                            border="1px solid"
                            borderColor="#23233D"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Box>
                      </Text>
                      <Box
                        display="flex"
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
                          if (transactionStarted) {
                            return
                          } else {
                            handleDropdownClick('supplyModalDropdown')
                          }
                        }}
                      >
                        <Box display="flex" gap="1">
                          <Box p="1">{getCoin(currentSelectedCoin)}</Box>
                          <Text color="white">
                            {currentSelectedCoin == 'BTC' ||
                            currentSelectedCoin == 'ETH'
                              ? 'w' + currentSelectedCoin
                              : protocolNetwork==='Starknet'?''+currentSelectedCoin:'t'+ currentSelectedCoin}
                          </Text>
                        </Box>

                        <Box pt="1" className="navbar-button">
                          {activeModal ? <ArrowUp /> : <DropdownUp />}
                        </Box>
                        {modalDropdowns.supplyModalDropdown && (
                          <Box
                            w="full"
                            left="0"
                            bg="#03060B"
                            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                            py="2"
                            className="dropdown-container"
                            boxShadow="dark-lg"
                          >
                            {coins?.map((coin: NativeToken, index: number) => {
                              return (
                                <Box
                                  key={index}
                                  as="button"
                                  w="full"
                                  // display="flex"
                                  alignItems="center"
                                  gap="1"
                                  pr="2"
                                  display={
                                    (protocolNetwork === 'Starknet'
                                      ? assetBalance[coin]?.dataBalanceOf
                                          ?.balance
                                      : assetBalance[coin]?.dataBalanceOf
                                          ?.formatted) && 'flex'
                                  }
                                  onMouseEnter={() => {
                                    setcollateralMarketHoverIndex(index)
                                  }}
                                  onMouseLeave={() => {
                                    setcollateralMarketHoverIndex(-1)
                                  }}
                                  onClick={() => {
                                    setCurrentSelectedCoin(coin)
                                    setAsset(coin)
                                    setCurrentSupplyAPR(
                                      coinIndex.find(
                                        (curr: any) => curr?.token === coin
                                      )?.idx
                                    )
                                    setcollateralMarketHoverIndex(-1)
                                    ////console.log(coin,"coin in supply modal")
                                    setwalletBalance(
                                      protocolNetwork==='Starknet'? walletBalances[coin]?.statusBalanceOf ===
                                        'success'
                                        ? parseAmount(
                                            String(
                                              uint256.uint256ToBN(
                                                walletBalances[coin]
                                                  ?.dataBalanceOf?.balance
                                              )
                                            ),
                                            tokenDecimalsMap[coin]
                                          )
                                        : 0:Number(walletBalances[coin]?.dataBalanceOf?.formatted)
                                    )
                                    dispatch(setCoinSelectedSupplyModal(coin))
                                  }}
                                >
                                  {(collateralMarketHoverIndex === -1
                                    ? coin === currentSelectedCoin
                                    : collateralMarketHoverIndex === index) && (
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
                                    pl={`${(coin === currentSelectedCoin && collateralMarketHoverIndex === -1) || collateralMarketHoverIndex === index ? '1' : '5'}`}
                                    pr="6px"
                                    gap="1"
                                    justifyContent="space-between"
                                    transition="ease .1s"
                                    bg={`${
                                      (coin === currentSelectedCoin &&
                                        collateralMarketHoverIndex === -1) ||
                                      collateralMarketHoverIndex === index
                                        ? '#4D59E8'
                                        : 'inherit'
                                    }`}
                                    borderRadius="md"
                                  >
                                    <Box display="flex">
                                      <Box p="1">{getCoin(coin)}</Box>
                                      <Text color="white">
                                        {coin == 'BTC' || coin == 'ETH'
                                          ? 'w' + coin
                                          : protocolNetwork==='Starknet'?''+coin:'t'+ coin}
                                      </Text>
                                    </Box>
                                    {protocolNetwork === 'Starknet' ? (
                                      <Box
                                        fontSize="9px"
                                        color="#E6EDF3"
                                        mt="6px"
                                        fontWeight="thin"
                                      >
                                        Wallet Balance:{' '}
                                        {assetBalance[coin]?.dataBalanceOf
                                          ?.balance
                                          ? numberFormatter(
                                              parseAmount(
                                                String(
                                                  uint256.uint256ToBN(
                                                    assetBalance[coin]
                                                      ?.dataBalanceOf?.balance
                                                  )
                                                ),
                                                tokenDecimalsMap[coin]
                                              )
                                            )
                                          : '-'}
                                      </Box>
                                    ) : (
                                      <Box
                                        fontSize="9px"
                                        color="#E6EDF3"
                                        mt="6px"
                                        fontWeight="thin"
                                      >
                                        Wallet Balance:{' '}
                                        {assetBalance[coin]?.dataBalanceOf
                                          ?.formatted
                                          ? numberFormatter(
                                              assetBalance[coin]?.dataBalanceOf
                                                ?.formatted
                                            )
                                          : '-'}
                                      </Box>
                                    )}
                                  </Box>
                                </Box>
                              )
                            })}
                          </Box>
                        )}
                      </Box>

                      <Text color="#676D9A" display="flex" alignItems="center">
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontStyle="normal"
                          fontWeight="400"
                        >
                          Amount
                        </Text>
                        <Tooltip
                          hasArrow
                          placement="right"
                          boxShadow="dark-lg"
                          label="The unit of tokens being supplied."
                          bg="#02010F"
                          fontSize={'13px'}
                          fontWeight={'400'}
                          borderRadius={'lg'}
                          padding={'2'}
                          color="#F0F0F5"
                          border="1px solid"
                          borderColor="#23233D"
                          arrowShadowColor="#2B2F35"
                          // maxW="222px"
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
                          depositAmount > walletBalance
                            ? '1px solid #CF222E'
                            : process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                                depositAmount > maximumDepositAmount
                              ? '1px solid #CF222E'
                              : depositAmount < 0
                                ? '1px solid #CF222E'
                                : isNaN(depositAmount)
                                  ? '1px solid #CF222E'
                                  : process.env.NEXT_PUBLIC_NODE_ENV ==
                                        'mainnet' &&
                                      depositAmount < minimumDepositAmount &&
                                      depositAmount > 0
                                    ? '1px solid #CF222E'
                                    : depositAmount > 0 &&
                                        depositAmount <= walletBalance
                                      ? '1px solid #00D395'
                                      : '1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
                        }`}
                        borderRadius="6px"
                        display="flex"
                        justifyContent="space-between"
                        mt="0.3rem"
                      >
                        <NumberInput
                          border="0px"
                          min={0}
                          keepWithinRange={true}
                          onChange={handleChange}
                          value={depositAmount ? depositAmount : ''}
                          outline="none"
                          // precision={1}
                          step={parseFloat(
                            `${depositAmount <= 99999 ? 0.1 : 0}`
                          )}
                          isDisabled={transactionStarted == true}
                          _disabled={{ cursor: 'pointer' }}
                        >
                          <NumberInputField
                            placeholder={
                              process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
                                ? `0.01536 ${currentSelectedCoin}`
                                : `min ${
                                    minimumDepositAmount == null
                                      ? 0
                                      : minimumDepositAmount
                                  } ${currentSelectedCoin}`
                            }
                            color={`${
                              depositAmount > walletBalance
                                ? '#CF222E'
                                : process.env.NEXT_PUBLIC_NODE_ENV ==
                                      'mainnet' &&
                                    depositAmount > maximumDepositAmount
                                  ? '#CF222E'
                                  : isNaN(depositAmount)
                                    ? '#CF222E'
                                    : process.env.NEXT_PUBLIC_NODE_ENV ==
                                          'mainnet' &&
                                        depositAmount < minimumDepositAmount &&
                                        depositAmount > 0
                                      ? '#CF222E'
                                      : depositAmount < 0
                                        ? '#CF222E'
                                        : depositAmount == 0
                                          ? 'white'
                                          : '#00D395'
                            }`}
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
                        <Button
                          variant="ghost"
                          color={`${
                            depositAmount > walletBalance
                              ? '#CF222E'
                              : process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                                  depositAmount > maximumDepositAmount
                                ? '#CF222E'
                                : isNaN(depositAmount)
                                  ? '#CF222E'
                                  : process.env.NEXT_PUBLIC_NODE_ENV ==
                                        'mainnet' &&
                                      depositAmount < minimumDepositAmount &&
                                      depositAmount > 0
                                    ? '#CF222E'
                                    : depositAmount < 0
                                      ? '#CF222E'
                                      : depositAmount == 0
                                        ? '#4D59E8'
                                        : '#00D395'
                          }`}
                          // color="#4D59E8"
                          _hover={{
                            bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
                          }}
                          onClick={() => {
                            setDepositAmount(walletBalance)
                            setinputAmount(walletBalance)
                            setSliderValue(100)
                            dispatch(setInputSupplyAmount(walletBalance))
                          }}
                          isDisabled={transactionStarted == true}
                          _disabled={{ cursor: 'pointer' }}
                        >
                          MAX
                        </Button>
                      </Box>
                      {depositAmount > walletBalance ||
                      (process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                        depositAmount > maximumDepositAmount) ||
                      depositAmount < 0 ||
                      (depositAmount < minimumDepositAmount &&
                        process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                        depositAmount > 0) ||
                      isNaN(depositAmount) ? (
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
                          <Text
                            color="#CF222E"
                            display="flex"
                            flexDirection="row"
                          >
                            <Text mt="0.2rem">
                              <SmallErrorIcon />{' '}
                            </Text>
                            <Text ml="0.3rem">
                              {depositAmount > walletBalance
                                ? 'Amount exceeds balance'
                                : process.env.NEXT_PUBLIC_NODE_ENV ==
                                      'mainnet' &&
                                    depositAmount > maximumDepositAmount
                                  ? 'More than max amount'
                                  : process.env.NEXT_PUBLIC_NODE_ENV ==
                                        'mainnet' &&
                                      depositAmount < minimumDepositAmount
                                    ? 'Less than min amount'
                                    : ''}
                            </Text>
                          </Text>
                          <Text
                            color="#C7CBF6"
                            display="flex"
                            justifyContent="flex-end"
                            flexDirection="row"
                          >
                            Wallet Balance:{' '}
                            {walletBalance.toFixed(5).replace(/\.?0+$/, '')
                              .length > 5
                              ? numberFormatter(walletBalance)
                              : numberFormatter(walletBalance)}
                            <Text color="#676D9A" ml="0.2rem">
                              {`${protocolNetwork!=='Starknet'?'t':''}${currentSelectedCoin}`}
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
                          Wallet Balance:{' '}
                          {walletBalance.toFixed(5).replace(/\.?0+$/, '')
                            .length > 5
                            ? numberFormatter(walletBalance)
                            : numberFormatter(walletBalance)}
                          <Text color="#676D9A" ml="0.2rem">
                            {` ${protocolNetwork!=='Starknet'?'t':''}${currentSelectedCoin}`}
                          </Text>
                        </Text>
                      )}

                      <Box
                        pt={5}
                        pb={2}
                        pr="0.5"
                        mt="1rem"
                        // width={`${sliderValue > 86 ? "96%" : "100%"}`}
                        // mr="auto"
                        // transition="ease-in-out"
                        display="flex"
                      >
                        <Slider
                          aria-label="slider-ex-6"
                          defaultValue={sliderValue}
                          value={sliderValue}
                          onChange={(val) => {
                            setSliderValue(val)
                            var ans = (val / 100) * walletBalance
                            ////console.log(ans);
                            if (val == 100) {
                              setDepositAmount(walletBalance)
                              setinputAmount(walletBalance)
                            } else {
                              // ans = Math.round(ans * 100) / 100;
                              if (ans < 10) {
                                setDepositAmount(parseFloat(ans.toFixed(7)))
                                setinputAmount(parseFloat(ans.toFixed(7)))
                              } else {
                                ans = Math.round(ans * 100) / 100
                                setDepositAmount(ans)
                                setinputAmount(ans)
                              }

                              ////console.log(ans)
                              // dispatch(setInputSupplyAmount(ans));
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

                    <Box
                      color="#676D9A"
                      display="flex"
                      alignItems="center"
                      mt="1rem"
                    >
                      <Text
                        mr="0.3rem"
                        fontSize="12px"
                        fontStyle="normal"
                        fontWeight="400"
                      >
                        You will receive
                      </Text>
                      <Tooltip
                        hasArrow
                        placement="right"
                        boxShadow="dark-lg"
                        label="rTokens are the representation of your share in the pool. These tokens can be used to generate yield by staking or to withdraw your supply."
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
                      alignItems="center"
                      px="4"
                      py="1.5"
                      mt="0.3rem"
                      border="1px solid #676D9A4D"
                      backgroundColor="#676D9A4D"
                    >
                      <Box
                        border="0px"
                        color="#676D9A"
                        fontSize="md"
                        opacity="0.8"
                      >
                        {depositAmount *
                          (protocolNetwork==='Starknet'? protocolStats?.find(
                            (stat: any) =>
                              stat.token ==
                              (currentSelectedCoin[0] == 'r'
                                ? currentSelectedCoin.slice(1)
                                : currentSelectedCoin)
                          )?.exchangeRateUnderlyingToRtoken:exchangeRate)}
                      </Box>
                      <Text color="#676D9A" fontSize="md" opacity="0.8">
                        r{currentSelectedCoin}
                      </Text>
                    </Box>

                    {protocolNetwork==='Starknet'&&<Box
                      display="flex"
                      gap="2"
                      mb="1rem"
                      mt="1rem"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Checkbox
                        size="md"
                        colorScheme="customPurple"
                        borderColor="#2B2F35"
                        isDisabled={transactionStarted == true}
                        onChange={() => {
                          setIsChecked(!ischecked)
                        }}
                        _disabled={{ backgroundColor: 'transparent' }}
                        isChecked={ischecked}
                      />
                      <Text
                        fontSize="14px"
                        fontWeight="400"
                        color="#B1B0B5"
                        lineHeight="22px"
                        width="100%"
                        onClick={() => setIsChecked(!ischecked)}
                        cursor="pointer"
                        userSelect="none"
                      >
                        I would like to stake the rTokens.
                      </Text>
                    </Box>}

                    {<Card
                      background=" var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                      mt="1rem"
                      p="1rem"
                      border=" 1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
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
                          font-size="12px"
                          color="#676D9A"
                        >
                          {fees?.supply}%
                        </Text>
                      </Text>
                      {/* <Text
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
                  <Text
                    font-style="normal"
                    font-weight="400"
                    font-size="12px"
                    color="#676D9A"
                  >
                    $ 0.90
                  </Text>
                </Text> */}
                      {protocolNetwork==='Starknet' &&<Text
                        color="#8B949E"
                        display="flex"
                        justifyContent="space-between"
                        fontSize="12px"
                        mb={'0.1rem'}
                      >
                        <Text display="flex" alignItems="center">
                          <Text
                            mr="0.2rem"
                            font-style="normal"
                            font-weight="400"
                            font-size="12px"
                            color="#676D9A"
                          >
                            APR:
                          </Text>
                          <Tooltip
                            hasArrow
                            placement="right-end"
                            boxShadow="dark-lg"
                            label="Annual interest rate earned on supplied tokens."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
                            color="#F0F0F5"
                            border="1px solid"
                            borderColor="#23233D"
                            arrowShadowColor="#2B2F35"
                            // arrowPadding={2}
                            maxW="222px"
                            // marginTop={20}
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Text>
                        <Text
                          font-style="normal"
                          font-weight="400"
                          font-size="12px"
                          color="#676D9A"
                        >
                          {!supplyAPRs ||
                          supplyAPRs.length === 0 ||
                          supplyAPRs[currentSupplyAPR] == null ? (
                            <Box pt="3px">
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
                              supplyAPRs[currentSupplyAPR] +
                                getBoostedApr(currentSelectedCoin)
                            ) + '%'
                          )}
                          {/* 5.566% */}
                        </Text>
                      </Text>}
                      {protocolNetwork==='Starknet' &&<Text
                        color="#8B949E"
                        display="flex"
                        justifyContent="space-between"
                        fontSize="12px"
                        // mb={ischecked ?"0.4rem":"0rem"}
                        mb={'0.1rem'}
                        ml={'0.5rem'}
                      >
                        <Text display="flex" alignItems="center">
                          <Text
                            mr="0.2rem"
                            font-style="normal"
                            font-weight="400"
                            font-size="12px"
                            color="#676D9A"
                          >
                            Supply APR:
                          </Text>
                        </Text>
                        <Text
                          font-style="normal"
                          font-weight="400"
                          font-size="12px"
                          color="#676D9A"
                        >
                          {!supplyAPRs ||
                          supplyAPRs.length === 0 ||
                          supplyAPRs[currentSupplyAPR] == null ? (
                            <Box pt="3px">
                              <Skeleton
                                width="2.3rem"
                                height=".85rem"
                                startColor="#2B2F35"
                                endColor="#101216"
                                borderRadius="6px"
                              />
                            </Box>
                          ) : (
                            supplyAPRs[currentSupplyAPR] + '%'
                          )}
                          {/* 5.566% */}
                        </Text>
                      </Text>}
                      {protocolNetwork==='Starknet' &&
                        <Text
                          color="#8B949E"
                          display="flex"
                          justifyContent="space-between"
                          fontSize="12px"
                          // mt={ischecked ?"0rem": "0.4rem"}
                          mb={ischecked ? '0.4rem' : '0rem'}
                          ml={'0.5rem'}
                        >
                          <Text display="flex" alignItems="center">
                            <Text
                              mr="0.2rem"
                              font-style="normal"
                              font-weight="400"
                              font-size="12px"
                              color="#676D9A"
                            >
                              STRK APR:
                            </Text>
                          </Text>
                          <Text color="#676D9A">
                            {strkData?.[currentSelectedCoin]
                              ? numberFormatterPercentage(
                                  getBoostedApr(currentSelectedCoin)
                                )
                              : 0}
                            %
                            {/* {protocolStats?.[0]?.stakingRate ? (
                              protocolStats?.[0]?.stakingRate
                            ) : (
                              <Skeleton
                                width="6rem"
                                height="1.4rem"
                                startColor="#101216"
                                endColor="#2B2F35"
                                borderRadius="6px"
                              />
                            )} */}
                          </Text>
                        </Text>
                      }
                      {ischecked&& protocolNetwork==='Starknet' && (
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
                            +
                            {protocolStats?.find(
                              (stat: any) =>
                                stat.token ==
                                (currentSelectedCoin[0] == 'r'
                                  ? currentSelectedCoin.slice(1)
                                  : currentSelectedCoin)
                            )?.stakingRate
                              ? (
                                  protocolStats?.find(
                                    (stat: any) =>
                                      stat.token ==
                                      (currentSelectedCoin[0] == 'r'
                                        ? currentSelectedCoin.slice(1)
                                        : currentSelectedCoin)
                                  )?.stakingRate - supplyAPRs[currentSupplyAPR]
                                ).toFixed(2)
                              : '1.2'}
                            %
                            {/* {protocolStats?.[0]?.stakingRate ? (
                              protocolStats?.[0]?.stakingRate
                            ) : (
                              <Skeleton
                                width="6rem"
                                height="1.4rem"
                                startColor="#101216"
                                endColor="#2B2F35"
                                borderRadius="6px"
                              />
                            )} */}
                          </Text>
                        </Text>
                      )}
                      {ischecked &&protocolNetwork==='Starknet'  && (
                        <Text
                          display="flex"
                          justifyContent="space-between"
                          fontSize="12px"
                          mt="0.5rem"
                          // mb="0.4rem"
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
                              Note: Staked assets cannot be used as collateral
                            </Text>
                          </Text>
                        </Text>
                      )}
                    </Card>}

                    {depositAmount > 0 &&
                    depositAmount <= walletBalance &&
                    ((depositAmount > 0 && depositAmount >= minimumDepositAmount) ||
                      process.env.NEXT_PUBLIC_NODE_ENV == 'testnet') &&
                    (process.env.NEXT_PUBLIC_NODE_ENV == 'testnet' ||
                      depositAmount <= maximumDepositAmount) ? (
                      buttonId == 1 ? (
                        <SuccessButton successText="Supply success" />
                      ) : buttonId == 2 ? (
                        <ErrorButton errorText="Copy error!" />
                      ) : (
                        <Box
                          onClick={() => {
                            // dispatch(setTransactionStarted(""));
                            setTransactionStarted(true)
                            if (transactionStarted === false) {
                              dispatch(
                                setTransactionStartedAndModalClosed(false)
                              )
                             if(protocolNetwork==='Starknet'){
                               handleTransaction()
                               posthog.capture('Supply Market Clicked Button', {
                                 'Supply Clicked': true,
                               })
                             }else{
                                  handleTransactionApprove()
                             }
                            }
                            // handleTransaction();
                            // dataDeposit();
                            // if(transactionStarted){
                            //   return;
                            // }
                            ////console.log(isSuccessDeposit, "status deposit")
                          }}
                        >
                          <AnimatedButton
                            background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                            // bgColor="red"
                            // p={0}
                            color="#8B949E"
                            size="sm"
                            width="100%"
                            mt="1.5rem"
                            mb="1.5rem"
                            labelSuccessArray={[
                              'Deposit Amount approved',
                              'Successfully transferred to Hashstack’s supply vault.',
                              'Determining the rToken amount to mint.',
                              'rTokens have been minted successfully.',
                              'Transaction complete.',
                              // <ErrorButton errorText="Transaction failed" />,
                              // <ErrorButton errorText="Copy error!" />,
                              <SuccessButton
                                key={'successButton'}
                                successText={'Supply success'}
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
                            // transactionStarted={(depostiTransactionHash!="" || transactionFailed==true)}
                            _disabled={{ bgColor: 'white', color: 'black' }}
                            isDisabled={transactionStarted == true}
                            // transactionStarted={toastTransactionStarted}
                            // onClick={}
                            currentTransactionStatus={currentTransactionStatus}
                            setCurrentTransactionStatus={
                              setCurrentTransactionStatus
                            }
                          >
                            Supply
                          </AnimatedButton>
                        </Box>
                      )
                    ) : (
                      <Button
                        background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                        color="#6E7681"
                        size="sm"
                        width="100%"
                        mt="1.5rem"
                        mb="1.5rem"
                        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                        _hover={{
                          bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
                        }}
                      >
                        Supply
                      </Button>
                    )}
                  </TabPanel>
                  <TabPanel p="0" m="0">
                    <Card
                      background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                      mb="0.5rem"
                      p="1rem"
                      mt="-1.5"
                    >
                      <Text color="#676D9A" display="flex" alignItems="center">
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontStyle="normal"
                          fontWeight="400"
                        >
                          Supply Market
                        </Text>
                        <Box>
                          <Tooltip
                            hasArrow
                            arrowShadowColor="#2B2F35"
                            placement="right"
                            boxShadow="dark-lg"
                            label="The tokens selected to supply on the protocol."
                            bg="#02010F"
                            fontSize={'13px'}
                            fontWeight={'400'}
                            borderRadius={'lg'}
                            padding={'2'}
                            color="#F0F0F5"
                            border="1px solid"
                            borderColor="#23233D"
                          >
                            <Box>
                              <InfoIcon />
                            </Box>
                          </Tooltip>
                        </Box>
                      </Text>
                      <Box
                        display="flex"
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
                          if (transactionStarted) {
                            return
                          } else {
                            handleDropdownClick('supplyModalDropdown')
                          }
                        }}
                      >
                        <Box display="flex" gap="1">
                          <Box p="1">{getCoin(currentSelectedCoin)}</Box>
                          <Text color="white">
                            {currentSelectedCoin == 'BTC' ||
                            currentSelectedCoin == 'ETH'
                              ? 'w' + currentSelectedCoin
                              : 'r'+currentSelectedCoin}
                          </Text>
                        </Box>

                        <Box pt="1" className="navbar-button">
                          {activeModal ? <ArrowUp /> : <DropdownUp />}
                        </Box>
                        {modalDropdowns.supplyModalDropdown && (
                          <Box
                            w="full"
                            left="0"
                            bg="#03060B"
                            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                            py="2"
                            className="dropdown-container"
                            boxShadow="dark-lg"
                          >
                            {coins?.map((coin: NativeToken, index: number) => {
                              return (
                                <Box
                                  key={index}
                                  as="button"
                                  w="full"
                                  // display="flex"
                                  alignItems="center"
                                  gap="1"
                                  pr="2"
                                  display={
                                    (protocolNetwork === 'Starknet'
                                      ? assetBalance[coin]?.dataBalanceOf
                                          ?.balance
                                      : assetBalance[coin]?.dataBalanceOf
                                          ?.formatted) && 'flex'
                                  }
                                  onMouseEnter={() => {
                                    setcollateralMarketHoverIndex(index)
                                  }}
                                  onMouseLeave={() => {
                                    setcollateralMarketHoverIndex(-1)
                                  }}
                                  onClick={() => {
                                    setCurrentSelectedCoin(coin)
                                    setAsset(coin)
                                    setCurrentSupplyAPR(
                                      coinIndex.find(
                                        (curr: any) => curr?.token === coin
                                      )?.idx
                                    )
                                    setcollateralMarketHoverIndex(-1)
                                    ////console.log(coin,"coin in supply modal")
                                    setwithdrawwalletBalance(Number(withdrawBalances[coin]?.dataBalanceOf?.formatted)
                                    )
                                    dispatch(setCoinSelectedSupplyModal(coin))
                                  }}
                                >
                                  {(collateralMarketHoverIndex === -1
                                    ? coin === currentSelectedCoin
                                    : collateralMarketHoverIndex === index) && (
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
                                    pl={`${(coin === currentSelectedCoin && collateralMarketHoverIndex === -1) || collateralMarketHoverIndex === index ? '1' : '5'}`}
                                    pr="6px"
                                    gap="1"
                                    justifyContent="space-between"
                                    transition="ease .1s"
                                    bg={`${
                                      (coin === currentSelectedCoin &&
                                        collateralMarketHoverIndex === -1) ||
                                      collateralMarketHoverIndex === index
                                        ? '#4D59E8'
                                        : 'inherit'
                                    }`}
                                    borderRadius="md"
                                  >
                                    <Box display="flex">
                                      <Box p="1">{getCoin(coin)}</Box>
                                      <Text color="white">
                                        {coin == 'BTC' || coin == 'ETH'
                                          ? 'w' + coin
                                          : 'r'+coin}
                                      </Text>
                                    </Box>
                                    {protocolNetwork === 'Starknet' ? (
                                      <Box
                                        fontSize="9px"
                                        color="#E6EDF3"
                                        mt="6px"
                                        fontWeight="thin"
                                      >
                                        Available:{' '}
                                        {assetBalance[coin]?.dataBalanceOf
                                          ?.balance
                                          ? numberFormatter(
                                              parseAmount(
                                                String(
                                                  uint256.uint256ToBN(
                                                    assetBalance[coin]
                                                      ?.dataBalanceOf?.balance
                                                  )
                                                ),
                                                tokenDecimalsMap[coin]
                                              )
                                            )
                                          : '-'}
                                      </Box>
                                    ) : (
                                      <Box
                                        fontSize="9px"
                                        color="#E6EDF3"
                                        mt="6px"
                                        fontWeight="thin"
                                      >
                                        Available:{' '}
                                        {withdrawBalances[coin]?.dataBalanceOf
                                          ?.formatted
                                          ? numberFormatter(
                                              withdrawBalances[coin]?.dataBalanceOf
                                                ?.formatted
                                            )
                                          : '-'}
                                      </Box>
                                    )}
                                  </Box>
                                </Box>
                              )
                            })}
                          </Box>
                        )}
                      </Box>

                      <Text color="#676D9A" display="flex" alignItems="center">
                        <Text
                          mr="0.3rem"
                          fontSize="12px"
                          fontStyle="normal"
                          fontWeight="400"
                        >
                         Withdraw Amount
                        </Text>
                        <Tooltip
                          hasArrow
                          placement="right"
                          boxShadow="dark-lg"
                          label="The unit of tokens being supplied."
                          bg="#02010F"
                          fontSize={'13px'}
                          fontWeight={'400'}
                          borderRadius={'lg'}
                          padding={'2'}
                          color="#F0F0F5"
                          border="1px solid"
                          borderColor="#23233D"
                          arrowShadowColor="#2B2F35"
                          // maxW="222px"
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
                          withdrawAmount > withdrawwalletBalance
                            ? '1px solid #CF222E'
                            : process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                                withdrawAmount > maximumDepositAmount
                              ? '1px solid #CF222E'
                              : withdrawAmount < 0
                                ? '1px solid #CF222E'
                                : isNaN(withdrawAmount)
                                  ? '1px solid #CF222E'
                                  : process.env.NEXT_PUBLIC_NODE_ENV ==
                                        'mainnet' &&
                                      withdrawAmount < minimumDepositAmount &&
                                      withdrawAmount > 0
                                    ? '1px solid #CF222E'
                                    : withdrawAmount > 0 &&
                                        withdrawAmount <= withdrawwalletBalance
                                      ? '1px solid #00D395'
                                      : '1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
                        }`}
                        borderRadius="6px"
                        display="flex"
                        justifyContent="space-between"
                        mt="0.3rem"
                      >
                        <NumberInput
                          border="0px"
                          min={0}
                          keepWithinRange={true}
                          onChange={handleWithdrawChange}
                          value={withdrawAmount? withdrawAmount : ''}
                          outline="none"
                          // precision={1}
                          step={parseFloat(
                            `${withdrawAmount <= 99999 ? 0.1 : 0}`
                          )}
                          isDisabled={transactionStarted == true}
                          _disabled={{ cursor: 'pointer' }}
                        >
                          <NumberInputField
                            placeholder={
                              process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
                                ? `0.01536 ${currentSelectedCoin}`
                                : `min ${
                                    minimumDepositAmount == null
                                      ? 0
                                      : minimumDepositAmount
                                  } ${currentSelectedCoin}`
                            }
                            color={`${
                              withdrawAmount > withdrawwalletBalance
                                ? '#CF222E'
                                : process.env.NEXT_PUBLIC_NODE_ENV ==
                                      'mainnet' &&
                                    withdrawAmount > maximumDepositAmount
                                  ? '#CF222E'
                                  : isNaN(withdrawAmount)
                                    ? '#CF222E'
                                    : process.env.NEXT_PUBLIC_NODE_ENV ==
                                          'mainnet' &&
                                        withdrawAmount < minimumDepositAmount &&
                                        withdrawAmount > 0
                                      ? '#CF222E'
                                      : withdrawAmount < 0
                                        ? '#CF222E'
                                        : withdrawAmount == 0
                                          ? 'white'
                                          : '#00D395'
                            }`}
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
                        <Button
                          variant="ghost"
                          color={`${
                            withdrawAmount > withdrawwalletBalance
                              ? '#CF222E'
                              : process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                                  withdrawAmount > maximumDepositAmount
                                ? '#CF222E'
                                : isNaN(withdrawAmount)
                                  ? '#CF222E'
                                  : process.env.NEXT_PUBLIC_NODE_ENV ==
                                        'mainnet' &&
                                      withdrawAmount < minimumDepositAmount &&
                                      withdrawAmount > 0
                                    ? '#CF222E'
                                    : withdrawAmount < 0
                                      ? '#CF222E'
                                      : withdrawAmount == 0
                                        ? '#4D59E8'
                                        : '#00D395'
                          }`}
                          // color="#4D59E8"
                          _hover={{
                            bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
                          }}
                          onClick={() => {
                            setwithdrawAmount(withdrawwalletBalance)
                            setinputAmount(withdrawwalletBalance)
                            setsliderWithdrawValue(100)
                            dispatch(setInputSupplyAmount(withdrawwalletBalance))
                          }}
                          isDisabled={transactionStarted == true}
                          _disabled={{ cursor: 'pointer' }}
                        >
                          MAX
                        </Button>
                      </Box>
                      {withdrawAmount > withdrawwalletBalance ||
                      withdrawAmount < 0 ||
                      isNaN(withdrawAmount) ? (
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
                          <Text
                            color="#CF222E"
                            display="flex"
                            flexDirection="row"
                          >
                            <Text mt="0.2rem">
                              <SmallErrorIcon />{' '}
                            </Text>
                            <Text ml="0.3rem">
                              {withdrawAmount > withdrawwalletBalance
                                ? 'Amount exceeds balance'
                                : process.env.NEXT_PUBLIC_NODE_ENV ==
                                      'mainnet' &&
                                    withdrawAmount > maximumDepositAmount
                                  ? 'More than max amount'
                                    : ''}
                            </Text>
                          </Text>
                          <Text
                            color="#C7CBF6"
                            display="flex"
                            justifyContent="flex-end"
                            flexDirection="row"
                          >
                            Available:{' '}
                            {withdrawwalletBalance.toFixed(5).replace(/\.?0+$/, '')
                              .length > 5
                              ? numberFormatter(withdrawwalletBalance)
                              : numberFormatter(withdrawwalletBalance)}
                            <Text color="#676D9A" ml="0.2rem">
                              {` r${currentSelectedCoin}`}
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
                          Available:{' '}
                          {withdrawwalletBalance.toFixed(5).replace(/\.?0+$/, '')
                            .length > 5
                            ? numberFormatter(withdrawwalletBalance)
                            : numberFormatter(withdrawwalletBalance)}
                          <Text color="#676D9A" ml="0.2rem">
                            {` r${currentSelectedCoin}`}
                          </Text>
                        </Text>
                      )}

                      <Box
                        pt={5}
                        pb={2}
                        pr="0.5"
                        mt="1rem"
                        // width={`${sliderValue > 86 ? "96%" : "100%"}`}
                        // mr="auto"
                        // transition="ease-in-out"
                        display="flex"
                      >
                        <Slider
                          aria-label="slider-ex-6"
                          defaultValue={sliderWithdrawValue}
                          value={sliderWithdrawValue}
                          onChange={(val) => {
                            setsliderWithdrawValue(val)
                            var ans = (val / 100) * withdrawwalletBalance
                            ////console.log(ans);
                            if (val == 100) {
                              setwithdrawAmount(withdrawwalletBalance)
                              setinputAmount(withdrawwalletBalance)
                            } else {
                              // ans = Math.round(ans * 100) / 100;
                              if (ans < 10) {
                                setwithdrawAmount(parseFloat(ans.toFixed(7)))
                                setinputAmount(parseFloat(ans.toFixed(7)))
                              } else {
                                ans = Math.round(ans * 100) / 100
                                setwithdrawAmount(ans)
                                setinputAmount(ans)
                              }

                              ////console.log(ans)
                              // dispatch(setInputSupplyAmount(ans));
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
                            {sliderWithdrawValue >= 0 ? (
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
                            {sliderWithdrawValue >= 25 ? (
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
                            {sliderWithdrawValue >= 50 ? (
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
                            {sliderWithdrawValue >= 75 ? (
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
                            {sliderWithdrawValue == 100 ? (
                              <SliderPointerWhite />
                            ) : (
                              <SliderPointer />
                            )}
                          </SliderMark>

                          <SliderMark
                            value={sliderWithdrawValue}
                            textAlign="center"
                            color="white"
                            mt="-8"
                            ml={sliderWithdrawValue !== 100 ? '-5' : '-6'}
                            w="12"
                            fontSize="12px"
                            fontWeight="400"
                            lineHeight="20px"
                            letterSpacing="0.25px"
                          >
                            {sliderWithdrawValue}%
                          </SliderMark>

                          <SliderTrack bg="#3E415C">
                            <SliderFilledTrack
                              bg="white"
                              w={`${sliderWithdrawValue}`}
                              _disabled={{ bg: 'white' }}
                            />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                      </Box>
                    </Card>
                    <Card
                        mt="1.5rem"
                        p="1rem"
                        background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                        mb="0.5rem"
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
                              est. supply unlocked:
                            </Text>
                            <Tooltip
                              hasArrow
                              placement="right"
                              boxShadow="dark-lg"
                              label="Estimated amount available for withdrawal from the deposited tokens."
                              bg="#02010F"
                              fontSize={'13px'}
                              fontWeight={'400'}
                              borderRadius={'lg'}
                              padding={'2'}
                              border="1px solid"
                              borderColor="#23233D"
                              arrowShadowColor="#2B2F35"
                              maxW="247px"
                              // mt="15px"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Text>
                          {!estSupply ? (
                            <Skeleton
                              width="3rem"
                              height="1rem"
                              startColor="#2B2F35"
                              endColor="#101216"
                              borderRadius="6px"
                              ml={2}
                            />
                          ) : (
                            <Text color="#676D9A"> {estSupply}</Text>
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
                              Earned APR:
                            </Text>
                            <Tooltip
                              hasArrow
                              placement="right"
                              bg="#101216"
                              padding="16px"
                              border="1px solid #2B2F35"
                              borderRadius="6px"
                              label={
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  justifyContent="space-between"
                                  width="226px"
                                  gap="6px"
                                >
                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    fontSize="12px"
                                    fontStyle="normal"
                                    fontWeight="500"
                                  >
                                    <Box display="flex">
                                      <ETHLogo height={"16px"} width={"16px"} />
                                      rETH =
                                    </Box>
                                    <Text>x</Text>
                                  </Box>
                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    fontSize="12px"
                                    fontStyle="normal"
                                    fontWeight="500"
                                  >
                                    <Box display="flex">
                                      1
                                      <ETHLogo height={"16px"} width={"16px"} />
                                      rETH =
                                    </Box>
                                    <Box display="flex">
                                      y
                                      <ETHLogo height={"16px"} width={"16px"} />
                                    </Box>
                                  </Box>
                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    fontSize="12px"
                                    fontStyle="normal"
                                    fontWeight="500"
                                  >
                                    <Box display="flex">1X =</Box>
                                    <Box display="flex">
                                      z USD{" "}
                                      <USDTLogo
                                        height={"16px"}
                                        width={"16px"}
                                      />
                                    </Box>
                                  </Box>
                                  <Box
                                    fontSize="12px"
                                    fontStyle="normal"
                                    fontWeight="500"
                                    width="142px"
                                    mt="4px"
                                  >
                                    est. collateral value in usd = x * y * z =
                                    us $ a.
                                  </Box>
                                  <Box></Box>
                                </Box>
                              }
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Text>
                          <Text color="#676D9A">1.240 rETH</Text>
                        </Text> */}
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
                              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                              arrowShadowColor="#2B2F35"
                              maxW="222px"
                            >
                              <Box>
                                <InfoIcon />
                              </Box>
                            </Tooltip>
                          </Text>
                          <Text color="#676D9A">{fees.withdrawSupply}%</Text>
                        </Text>
                      </Card>

                    {withdrawAmount > 0 &&
                    withdrawAmount <= withdrawwalletBalance  &&
                    (withdrawAmount > 0 ||
                      process.env.NEXT_PUBLIC_NODE_ENV == 'testnet')  ? (
                      buttonId == 1 ? (
                        <SuccessButton successText="Supply success" />
                      ) : buttonId == 2 ? (
                        <ErrorButton errorText="Copy error!" />
                      ) : (
                        <Box
                          onClick={() => {
                            //   writeContractAsync({
                            //     abi:trialabi,
                            //     address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
                            //     functionName: 'approve',
                            //     args: [
                            //       '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
                            //       BigInt(etherToWeiBN(depositAmount, asset).toString())
                            //     ],
                            //     chain:baseSepolia
                            //  })
                            // dispatch(setTransactionStarted(""));
                            setTransactionStarted(true)
                            if (transactionStarted === false) {
                              dispatch(
                                setTransactionStartedAndModalClosed(false)
                              )
                              handleTransactionWithdraw()


                              // handleTransaction()
                              posthog.capture('Supply Market Clicked Button', {
                                'Supply Clicked': true,
                              })
                            }
                            // handleTransaction();
                            // dataDeposit();
                            // if(transactionStarted){
                            //   return;
                            // }
                            ////console.log(isSuccessDeposit, "status deposit")
                          }}
                        >
                          <AnimatedButton
                            background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                            // bgColor="red"
                            // p={0}
                            color="#8B949E"
                            size="sm"
                            width="100%"
                            mt="1.5rem"
                            mb="1.5rem"
                            labelSuccessArray={[
                              'Checking if sufficient rTokens are available',
                              <Text key={0} display="flex">
                                Fetching the exchange between{' '}
                                <Text ml="0.4rem" mr="0.1rem">
                                  {getCoin(asset)}
                                </Text>{' '}
                                {'r'+asset} &
                                <Text key={1} ml="0.3rem" mr="0.1rem">
                                  {getCoin(asset)}
                                </Text>
                                {asset}
                              </Text>,
                              <Text key={2} display="flex">
                                Burning {withdrawAmount}
                                <Text ml="0.5rem" mr="0.1rem">
                                  {getCoin(asset)}
                                </Text>{' '}
                                {'r'+asset}
                              </Text>,
                              'Processing Withdrawal',
                              // <ErrorButton errorText="Transaction failed" />,
                              // <ErrorButton errorText="Copy error!" />,
                              <SuccessButton
                                key={'successButton'}
                                successText={'Withdrawal Succesful'}
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
                            // transactionStarted={(depostiTransactionHash!="" || transactionFailed==true)}
                            _disabled={{ bgColor: 'white', color: 'black' }}
                            isDisabled={transactionStarted == true}
                            // transactionStarted={toastTransactionStarted}
                            // onClick={}
                            currentTransactionStatus={currentTransactionStatus}
                            setCurrentTransactionStatus={
                              setCurrentTransactionStatus
                            }
                          >
                            Withdraw
                          </AnimatedButton>
                        </Box>
                      )
                    ) : (
                      <Button
                        background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                        color="#6E7681"
                        size="sm"
                        width="100%"
                        mt="1.5rem"
                        mb="1.5rem"
                        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                        _hover={{
                          bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
                        }}
                      >
                        Withdraw
                      </Button>
                    )}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Portal>
    </div>
  )
}
export default SupplyModal
