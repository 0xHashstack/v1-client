import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  ModalBody,
  ModalCloseButton,
  Card,
  Text,
  Checkbox,
  Tooltip,
  Box,
  NumberInput,
  NumberInputField,
  Portal,
  SliderThumb,
  Spinner,
  Skeleton,
} from "@chakra-ui/react";
import ArrowUp from "@/assets/icons/arrowup";
import { useDisclosure } from "@chakra-ui/react";
import InfoIcon from "@/assets/icons/infoIcon";
import BTCLogo from "../../assets/icons/coins/btc";
import USDCLogo from "@/assets/icons/coins/usdc";
import USDTLogo from "@/assets/icons/coins/usdt";
import ETHLogo from "@/assets/icons/coins/eth";
import DAILogo from "@/assets/icons/coins/dai";
import DropdownUp from "@/assets/icons/dropdownUpIcon";
import SmallErrorIcon from "@/assets/icons/smallErrorIcon";
import SuccessButton from "../uiElements/buttons/SuccessButton";
import ErrorToast from "../uiElements/toasts/ErrorToast";
import {
  selectInputSupplyAmount,
  setCoinSelectedSupplyModal,
  selectWalletBalance,
  setInputSupplyAmount,
  selectTransactionStatus,
  setTransactionStatus,
  selectAssetWalletBalance,
  setToastTransactionStarted,
  selectActiveTransactions,
  setActiveTransactions,
  setTransactionStartedAndModalClosed,
  selectTransactionStartedAndModalClosed,
  // selectTransactionStarted,
  // setTransactionStarted,
  // selectCurrentTransactionStatus,
  // setCurrentTransactionStatus,
} from "@/store/slices/userAccountSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setModalDropdown,
  selectModalDropDowns,
  resetModalDropdowns,
  selectCurrentModalDropdown,
} from "@/store/slices/dropdownsSlice";
import AnimatedButton from "../uiElements/buttons/AnimationButton";
import ErrorButton from "../uiElements/buttons/ErrorButton";
import {
  useAccount,
  useBalance,
  useTransactionManager,
  useWaitForTransaction,
} from "@starknet-react/core";
import useDeposit from "@/Blockchain/hooks/Writes/useDeposit";
import SliderPointer from "@/assets/icons/sliderPointer";
import SliderPointerWhite from "@/assets/icons/sliderPointerWhite";
import { useToast } from "@chakra-ui/react";
import { BNtoNum, parseAmount } from "@/Blockchain/utils/utils";
import { uint256 } from "starknet";
import { getUserLoans } from "@/Blockchain/scripts/Loans";
import useWithdrawDeposit from "@/Blockchain/hooks/Writes/useWithdrawDeposit";
import SuccessToast from "../uiElements/toasts/SuccessToast";
import SuccessTick from "@/assets/icons/successTick";
import CancelIcon from "@/assets/icons/cancelIcon";
import CancelSuccessToast from "@/assets/icons/cancelSuccessToast";
import useBalanceOf from "@/Blockchain/hooks/Reads/useBalanceOf";
import {
  tokenAddressMap,
  tokenDecimalsMap,
} from "@/Blockchain/utils/addressServices";
import { NativeToken, Token } from "@/Blockchain/interfaces/interfaces";
import WarningIcon from "@/assets/icons/coins/warningIcon";
import { toast } from "react-toastify";
import CopyToClipboard from "react-copy-to-clipboard";
// import { useFetchToastStatus } from "../layouts/toasts";
import TransactionFees from "../../../TransactionFees.json";
import mixpanel from "mixpanel-browser";
import numberFormatter from "@/utils/functions/numberFormatter";
import { selectFees, selectMaximumDepositAmounts, selectMinimumDepositAmounts, selectNftBalance, selectProtocolStats, selectTransactionRefresh, setMaximumDepositAmounts } from "@/store/slices/readDataSlice";
import { getFees, getMaximumDepositAmount, getMinimumDepositAmount, getNFTBalance, getNFTMaxAmount } from "@/Blockchain/scripts/Rewards";
import { getDTokenFromAddress, getTokenFromAddress } from "@/Blockchain/stark-constants";
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const toastHandler = () => {
  //   console.log("toast called");
  // };
  const [currentTransactionStatus, setCurrentTransactionStatus] = useState("");
  const [transactionStarted, setTransactionStarted] = useState(false);
  const [toastId, setToastId] = useState<any>();
  const [uniqueID, setUniqueID] = useState(0);
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
    isLoadingDeposit,
    isSuccessDeposit,
    statusDeposit,
  } = useDeposit();
  useEffect(() => {
    setAsset(coin ? coin?.name : "BTC");
  }, [coin]);

  const [currentSelectedCoin, setCurrentSelectedCoin] = useState(
    coin ? coin?.name : "BTC"
  );
  // console.log("wallet balance",typeof Number(walletBalance))
  // console.log("deposit amount", typeof depositAmount);
  const [inputAmount, setinputAmount] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [buttonId, setButtonId] = useState(0);
  const [stakeCheck, setStakeCheck] = useState(true);

  const coinIndex: any = [
    { token: "USDT", idx: 0 },
    { token: "USDC", idx: 1 },
    { token: "BTC", idx: 2 },
    { token: "ETH", idx: 3 },
    { token: "DAI", idx: 4 },
  ];

  // useEffect(() => {
  //   // setCurrentSupplyAPR(
  //   //   coinIndex.map(({ curr }: any) => curr?.token === currentSelectedCoin)?.idx
  //   // );
  //   // console.log("currentSupplyAPR", currentSupplyAPR);
  // }, [currentSupplyAPR]);

  const getUniqueId = () => uniqueID;

  interface assetB {
    USDT: any;
    USDC: any;
    BTC: any;
    ETH: any;
    DAI: any;
  }
  const walletBalances: assetB | any = {
    USDT: useBalanceOf(tokenAddressMap["USDT"]),
    USDC: useBalanceOf(tokenAddressMap["USDC"]),
    BTC: useBalanceOf(tokenAddressMap["BTC"]),
    ETH: useBalanceOf(tokenAddressMap["ETH"]),
    DAI: useBalanceOf(tokenAddressMap["DAI"]),
  };

  const assetBalance: assetB | any = {
    USDT: useBalanceOf(tokenAddressMap["USDT"]),
    USDC: useBalanceOf(tokenAddressMap["USDC"]),
    BTC: useBalanceOf(tokenAddressMap["BTC"]),
    ETH: useBalanceOf(tokenAddressMap["ETH"]),
    DAI: useBalanceOf(tokenAddressMap["DAI"]),
  };
  // console.log(walletBalances,"wallet balances in supply modal")

  // const transactionStarted = useSelector(selectTransactionStarted);
  // const currentTransactionStatus = useSelector(selectCurrentTransactionStatus);

  // const [transactionStarted, setTransactionStarted] = useState(false);
  // const [toastTransactionStarted, setToastTransactionStarted] = useState(false);
  // console.log(Number(
  //   BNtoNum(
  //     uint256.uint256ToBN(
  //       walletBalances["ETH"]?.dataBalanceOf?.balance
  //     ),tokenDecimalsMap["ETH"]
  //   )
  // ))

  const dispatch = useDispatch();
  const modalDropdowns = useSelector(selectModalDropDowns);
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_KEY || "", {
    debug: true,
    track_pageview: true,
    persistence: "localStorage",
  });
  // const walletBalances = useSelector(selectAssetWalletBalance);
  // const transactionRefresh=useSelector(selectTransactionRefresh);

  const fees = useSelector(selectFees);
  const [walletBalance, setwalletBalance] = useState(
    walletBalances[coin?.name]?.statusBalanceOf === "success"
      ? parseAmount(
        uint256.uint256ToBN(
          walletBalances[coin?.name]?.dataBalanceOf?.balance
        ),
        tokenDecimalsMap[coin?.name]
      )
      : 0
  );
  // useEffect(()=>{
  //   console.log(
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
      walletBalances[coin?.name]?.statusBalanceOf === "success"
        ? parseAmount(
          uint256.uint256ToBN(
            walletBalances[coin?.name]?.dataBalanceOf?.balance
          ),
          tokenDecimalsMap[coin?.name]
        )
        : 0
    );
    // console.log("supply modal status wallet balance",walletBalances[coin?.name]?.statusBalanceOf)
  }, [walletBalances[coin?.name]?.statusBalanceOf]);
  // useEffect(()=>{

  // },[currentSelectedCoin])
  // console.log(walletBalances['BTC']);
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
  const [ischecked, setIsChecked] = useState(true);
  const [depositTransHash, setDepositTransHash] = useState("");
  const [isToastDisplayed, setToastDisplayed] = useState(false);

  let activeTransactions = useSelector(selectActiveTransactions);
  // useEffect(() => {
  //   if (activeTransactions)
  //     console.log("activeTransactions ", activeTransactions);
  // }, [activeTransactions]);
  // const [toastId, setToastId] = useState<any>();
  // const recieptData = useWaitForTransaction({
  //   hash: depositTransHash,
  //   watch: true,
  //   onReceived: () => {
  //     console.log("trans received");
  //   },
  //   onPending: () => {
  //     setCurrentTransactionStatus(true);
  //     toast.dismiss(toastId);
  //     console.log("trans pending");
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
  //     console.log("treans rejected", transaction);
  //   },
  //   onAcceptedOnL1: () => {
  //     setCurrentTransactionStatus(true);
  //     console.log("trans onAcceptedOnL1");
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
  //     console.log("trans onAcceptedOnL2 - ", transaction);
  //   },
  // });
  // useEffect(() => {
  //   // const status = recieptData?.data?.status;
  //   console.log("trans supply modal ", recieptData?.data?.status);
  //   if (recieptData?.data?.status == "PENDING") {
  //     setCurrentTransactionStatus(true);
  //     toast.dismiss(toastId);
  //     console.log("trans pending - - -");
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
  //     console.log("trans received - - -");
  //   } else if (recieptData?.data?.status == "REJECTED") {
  //     toast.dismiss(toastId);
  //     console.log("treans rejected - - -");
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
  //     console.log("trans onAcceptedOnL2 - - -");
  //   } else if (status == "ACCEPTED_ON_L1") {
  //     setCurrentTransactionStatus(true);
  //     console.log("trans onAcceptedOnL1 - - -");
  //   }
  // }, [recieptData?.data?.status]);
  // setInterval(() => console.log("recieptData", recieptData), 5000);

  // const recieptData2 = useWaitForTransaction({
  //   hash: depositTransHash,
  //   watch: true,
  //   onReceived: () => {
  //     console.log("trans received");
  //   },
  //   onPending: () => {
  //     setCurrentTransactionStatus(true);
  //     console.log("trans pending");
  //     if (isToastDisplayed==false) {
  //       toast.success(`You have successfully supplied ${inputAmount} ${currentSelectedCoin}`, {
  //         position: toast.POSITION.BOTTOM_RIGHT
  //       });
  //       setToastDisplayed(true);
  //     }
  //   },
  //   onRejected(transaction) {
  //     console.log("treans rejected");
  //   },
  //   onAcceptedOnL1: () => {
  //     setCurrentTransactionStatus(true);
  //     console.log("trans onAcceptedOnL1");
  //   },
  //   onAcceptedOnL2(transaction) {
  //     setCurrentTransactionStatus(true);
  //     if (!isToastDisplayed) {
  //       toast.success(`You have successfully supplied ${inputAmount} ${currentSelectedCoin}`, {
  //         position: toast.POSITION.BOTTOM_RIGHT
  //       });
  //       setToastDisplayed(true);
  //     }
  //     console.log("trans onAcceptedOnL2 - ", transaction);
  //   },
  // });

  const [failureToastDisplayed, setFailureToastDisplayed] = useState(false);
  // const recieptData = useFetchToastStatus({
  //   hash: depositTransHash,
  //   watch: true,
  //   onReceived: () => {
  //     console.log("trans received");
  //   },
  //   onPending: () => {
  //     setCurrentTransactionStatus("success");
  //     toast.dismiss(toastId);
  //     console.log("trans pending");
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
  //       console.log("treans rejected", transaction);
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
  //     console.log("trans onAcceptedOnL1");
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
  //     console.log("trans onAcceptedOnL2 - ", transaction);
  //   },
  // });
  // const { hashes, addTransaction } = useTransactionManager();
  // const transactionStartedAndModalClosed=useSelector(selectTransactionStartedAndModalClosed);
  let protocolStats = useSelector(selectProtocolStats);
  const handleTransaction = async () => {
    try {
      if (ischecked) {
        mixpanel.track("Action Selected", {
          Action: "Deposit and Stake",
        });
        const depositStake = await writeAsyncDepositStake();
        if (depositStake?.transaction_hash) {

          const toastid = toast.info(
            // `Please wait your transaction is running in background : supply and staking - ${inputAmount} ${currentSelectedCoin} `,
            `Transaction pending`,
            {
              position: toast.POSITION.BOTTOM_RIGHT,
              autoClose: false,
            }
          );
          setToastId(toastid);
          if (!activeTransactions) {
            activeTransactions = []; // Initialize activeTransactions as an empty array if it's not defined
          } else if (
            Object.isFrozen(activeTransactions) ||
            Object.isSealed(activeTransactions)
          ) {
            // Check if activeTransactions is frozen or sealed
            activeTransactions = activeTransactions.slice(); // Create a shallow copy of the frozen/sealed array
          }
          const uqID = getUniqueId();
          const trans_data = {
            transaction_hash: depositStake?.transaction_hash.toString(),
            message: `Successfully staked ${inputAmount} ${currentSelectedCoin}`,
            // message: `Transaction successful`,
            toastId: toastid,
            setCurrentTransactionStatus: setCurrentTransactionStatus,
            uniqueID: uqID,
          };
          // addTransaction({ hash: deposit?.transaction_hash });
          activeTransactions?.push(trans_data);

          dispatch(setActiveTransactions(activeTransactions));
        }
        mixpanel.track("Supply Market Status", {
          Status: "Success Deposit and Stake",
          Token: currentSelectedCoin,
          TokenAmount: inputAmount,
        });
        setDepositTransHash(depositStake?.transaction_hash);
        const uqID = getUniqueId();
        let data: any = localStorage.getItem("transactionCheck");
        data = data ? JSON.parse(data) : [];
        if (data && data.includes(uqID)) {
          dispatch(setTransactionStatus("success"));
        }
        // console.log("Status transaction", deposit);
        console.log(isSuccessDeposit, "success ?");
      } else {
        mixpanel.track("Action Selected", {
          Action: "Deposit",
        });
        const deposit = await writeAsyncDeposit();
        if (deposit?.transaction_hash) {
          console.log(
            "trans transaction hash created ",
            deposit?.transaction_hash
          );
          const toastid = toast.info(
            // `Please wait your transaction is running in background : supplying - ${inputAmount} ${currentSelectedCoin} `,
            `Transaction pending`,
            {
              position: toast.POSITION.BOTTOM_RIGHT,
              autoClose: false,
            }
          );
          setToastId(toastid);
          if (!activeTransactions) {
            activeTransactions = []; // Initialize activeTransactions as an empty array if it's not defined
          } else if (
            Object.isFrozen(activeTransactions) ||
            Object.isSealed(activeTransactions)
          ) {
            // Check if activeTransactions is frozen or sealed
            activeTransactions = activeTransactions.slice(); // Create a shallow copy of the frozen/sealed array
          }
          const uqID = getUniqueId();
          const trans_data = {
            transaction_hash: deposit?.transaction_hash.toString(),
            message: `Successfully supplied ${inputAmount} ${currentSelectedCoin}`,
            // message: `Transaction successful`,
            toastId: toastid,
            setCurrentTransactionStatus: setCurrentTransactionStatus,
            uniqueID: uqID,
          };
          // addTransaction({ hash: deposit?.transaction_hash });
          activeTransactions?.push(trans_data);

          dispatch(setActiveTransactions(activeTransactions));
        }
        // const deposit = await writeAsyncDepositStake();
        mixpanel.track("Supply Market Status", {
          Status: "Success",
          Token: currentSelectedCoin,
          TokenAmount: inputAmount,
        });
        setDepositTransHash(deposit?.transaction_hash);
        // if (recieptData?.data?.status == "ACCEPTED_ON_L2") {
        // }
        const uqID = getUniqueId();
        let data: any = localStorage.getItem("transactionCheck");
        data = data ? JSON.parse(data) : [];
        if (data && data.includes(uqID)) {
          dispatch(setTransactionStatus("success"));
        }
        // console.log("Status transaction", deposit);
        console.log(isSuccessDeposit, "success ?");
      }
    } catch (err: any) {
      // setTransactionFailed(true);
      mixpanel.track("Supply Market Status", {
        Status: "Failure",
      });
      const uqID = getUniqueId();
      let data: any = localStorage.getItem("transactionCheck");
      data = data ? JSON.parse(data) : [];
      if (data && data.includes(uqID)) {
        setTransactionStarted(false);
        // dispatch(setTransactionStatus("failed"));
      }
      console.log(uqID, "transaction check supply transaction failed : ", err);

      const toastContent = (
        <div>
          Transaction declined{" "}
          <CopyToClipboard text={err}>
            <Text as="u">copy error!</Text>
          </CopyToClipboard>
        </div>
      );
      toast.error(toastContent, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      });
      console.log("supply", err);
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
  };

  const getCoin = (CoinName: string) => {
    switch (CoinName) {
      case "BTC":
        return <BTCLogo height={"16px"} width={"16px"} />;
        break;
      case "USDC":
        return <USDCLogo height={"16px"} width={"16px"} />;
        break;
      case "USDT":
        return <USDTLogo height={"16px"} width={"16px"} />;
        break;
      case "ETH":
        return <ETHLogo height={"16px"} width={"16px"} />;
        break;
      case "DAI":
        return <DAILogo height={"16px"} width={"16px"} />;
        break;
      default:
        break;
    }
  };

  // useEffect(() => {
  //   getUserLoans("0x05f2a945005c66ee80bc3873ade42f5e29901fc43de1992cd902ca1f75a1480b");
  // }, [])
  // console.log(inputAmount);
  const [minimumDepositAmount, setMinimumDepositAmount] = useState<any>(0)
  const [maximumDepositAmount, setmaximumDepositAmount] = useState<any>(0)
  const minAmounts = useSelector(selectMinimumDepositAmounts);
  const maxAmounts = useSelector(selectMaximumDepositAmounts);
  useEffect(() => {
    setMinimumDepositAmount(minAmounts["r" + currentSelectedCoin])
    setmaximumDepositAmount(maxAmounts["r" + currentSelectedCoin])
  }, [currentSelectedCoin, minAmounts, maxAmounts])
  // console.log(nft,"nft")
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
    dispatch(setModalDropdown(dropdownName));
  };
  const activeModal = Object.keys(modalDropdowns).find(
    (key) => modalDropdowns[key] === true
  );
  // console.log(activeModal)

  //This function is used to find the percentage of the slider from the input given by the user
  const handleChange = (newValue: any) => {
    // Calculate the percentage of the new value relative to the wallet balance
    if (newValue > 9_000_000_000) return;
    // check if newValue is float, if it is then round off to 6 decimals

    var percentage = (newValue * 100) / walletBalance;
    // if (walletBalance == 0) {
    //   setDepositAmount(0);
    //   setinputAmount(0);
    // }
    percentage = Math.max(0, percentage);
    if (percentage > 100) {
      setSliderValue(100);
      setDepositAmount(newValue);
      setinputAmount(newValue);
      dispatch(setInputSupplyAmount(newValue));
    } else {
      percentage = Math.round(percentage);
      if (isNaN(percentage)) {
      } else {
        setSliderValue(percentage);
        setDepositAmount(newValue);
        setinputAmount(newValue);
        dispatch(setInputSupplyAmount(newValue));
      }
    }
  };

  const coins: NativeToken[] = ["BTC", "USDT", "USDC", "ETH", "DAI"];

  const resetStates = () => {
    setDepositAmount(0);
    setSliderValue(0);
    setToastDisplayed(false);
    setAsset(coin ? coin?.name : "BTC");
    setCurrentSelectedCoin(coin ? coin?.name : "BTC");
    setIsChecked(true);
    setwalletBalance(
      walletBalances[coin?.name]?.statusBalanceOf === "success"
        ? parseAmount(
          uint256.uint256ToBN(
            walletBalances[coin?.name]?.dataBalanceOf?.balance
          ),
          tokenDecimalsMap[coin?.name]
        )
        : 0
    );

    // if (transactionStarted) dispatch(setTransactionStarted(""));
    setTransactionStarted(false);
    dispatch(resetModalDropdowns());
    dispatch(setTransactionStatus(""));
    setCurrentTransactionStatus("");
    setDepositTransHash("");
  };

  useEffect(() => {
    setDepositAmount(0);
    setinputAmount(0);
    setSliderValue(0);
  }, [currentSelectedCoin]);

  return (
    <div>
      <Button
        onClick={() => {
          const uqID = Math.random();
          setUniqueID(uqID);
          let data: any = localStorage.getItem("transactionCheck");
          data = data ? JSON.parse(data) : [];
          if (data && !data.includes(uqID)) {
            data.push(uqID);
            localStorage.setItem("transactionCheck", JSON.stringify(data));
          }
          onOpen();
          dispatch(setToastTransactionStarted(false));
        }}
        {...restProps}
      >
        {buttonText !== "Click here to supply" ? (
          buttonText === "Supply from metrics" ? (
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
            const uqID = getUniqueId();
            let data: any = localStorage.getItem("transactionCheck");
            data = data ? JSON.parse(data) : [];
            // console.log(uqID, "data here", data);
            if (data && data.includes(uqID)) {
              data = data.filter((val: any) => val != uqID);
              localStorage.setItem("transactionCheck", JSON.stringify(data));
            }
            dispatch(setTransactionStartedAndModalClosed(true));
            resetStates();
            onClose();
          }}
          size={{ width: "700px", height: "100px" }}
          isCentered
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
            >
              Supply
            </ModalHeader>
            <ModalCloseButton
              // onClick={() => {
              //   if (setIsOpenCustom) setIsOpenCustom(false);
              // }}
              mt="1rem"
              mr="1rem"
            />
            <ModalBody>
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
                      fontSize={"13px"}
                      fontWeight={"400"}
                      borderRadius={"lg"}
                      padding={"2"}
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
                      return;
                    } else {
                      handleDropdownClick("supplyModalDropdown");
                    }
                  }}
                >
                  <Box display="flex" gap="1">
                    <Box p="1">{getCoin(currentSelectedCoin)}</Box>
                    <Text color="white">{(currentSelectedCoin=="BTC" || currentSelectedCoin=="ETH")? "w"+currentSelectedCoin:currentSelectedCoin}</Text>
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
                              assetBalance[coin]?.dataBalanceOf?.balance &&
                              "flex"
                            }
                            onClick={() => {
                              setCurrentSelectedCoin(coin);
                              setAsset(coin);
                              setCurrentSupplyAPR(
                                coinIndex.find(
                                  (curr: any) => curr?.token === coin
                                )?.idx
                              );
                              // console.log(coin,"coin in supply modal")
                              setwalletBalance(
                                walletBalances[coin]?.statusBalanceOf ===
                                  "success"
                                  ? Number(
                                    BNtoNum(
                                      uint256.uint256ToBN(
                                        walletBalances[coin]?.dataBalanceOf
                                          ?.balance
                                      ),
                                      tokenDecimalsMap[coin]
                                    )
                                  )
                                  : 0
                              );
                              dispatch(setCoinSelectedSupplyModal(coin));
                            }}
                          >
                            {coin === currentSelectedCoin && (
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
                              pl={`${coin === currentSelectedCoin ? "1" : "5"}`}
                              pr="6px"
                              gap="1"
                              justifyContent="space-between"
                              bg={`${coin === currentSelectedCoin
                                  ? "#4D59E8"
                                  : "inherit"
                                }`}
                              borderRadius="md"
                            >
                              <Box display="flex">
                                <Box p="1">{getCoin(coin)}</Box>
                                <Text color="white">{(coin=="BTC" || coin=="ETH")? "w"+coin:coin}</Text>
                              </Box>
                              <Box
                                fontSize="9px"
                                color="#E6EDF3"
                                mt="6px"
                                fontWeight="thin"
                              >
                                Wallet Balance:{" "}
                                {assetBalance[coin]?.dataBalanceOf?.balance
                                  ? numberFormatter(
                                    Number(
                                      BNtoNum(
                                        uint256.uint256ToBN(
                                          assetBalance[coin]?.dataBalanceOf
                                            ?.balance
                                        ),
                                        tokenDecimalsMap[coin]
                                      )
                                    )
                                  )
                                  : "-"}
                              </Box>
                            </Box>
                          </Box>
                        );
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
                    fontSize={"13px"}
                    fontWeight={"400"}
                    borderRadius={"lg"}
                    padding={"2"}
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
                  border={`${depositAmount > walletBalance
                      ? "1px solid #CF222E"
                      : process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" && depositAmount > maximumDepositAmount ?
                        "1px solid #CF222E"
                        : depositAmount < 0
                          ? "1px solid #CF222E"
                          : isNaN(depositAmount)
                            ? "1px solid #CF222E"
                            : process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" && depositAmount < minimumDepositAmount && depositAmount > 0
                              ? "1px solid #CF222E"
                              : depositAmount > 0 && depositAmount <= walletBalance
                                ? "1px solid #00D395"
                                : "1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
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
                    value={depositAmount ? depositAmount : ""}
                    outline="none"
                    // precision={1}
                    step={parseFloat(`${depositAmount <= 99999 ? 0.1 : 0}`)}
                    isDisabled={transactionStarted == true}
                    _disabled={{ cursor: "pointer" }}
                  >
                    <NumberInputField
                      placeholder={process.env.NEXT_PUBLIC_NODE_ENV == "testnet" ? `0.01536 ${currentSelectedCoin}` : `min ${minimumDepositAmount == null ? 0 : minimumDepositAmount} ${currentSelectedCoin}`}
                      color={`${depositAmount > walletBalance
                          ? "#CF222E"
                          : process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" && depositAmount > maximumDepositAmount ?
                            "#CF222E"
                            : isNaN(depositAmount)
                              ? "#CF222E"
                              : process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" && depositAmount < minimumDepositAmount && depositAmount > 0
                                ? "#CF222E"
                                : depositAmount < 0
                                  ? "#CF222E"
                                  : depositAmount == 0
                                    ? "white"
                                    : "#00D395"
                        }`}
                      _disabled={{ color: "#00D395" }}
                      border="0px"
                      _placeholder={{
                        color: "#3E415C",
                        fontSize: ".89rem",
                        fontWeight: "600",
                        outline: "none",
                      }}
                      _focus={{
                        outline: "0",
                        boxShadow: "none",
                      }}
                    />
                  </NumberInput>
                  <Button
                    variant="ghost"
                    color={`${depositAmount > walletBalance
                        ? "#CF222E"
                        : process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" && depositAmount > maximumDepositAmount ?
                          "#CF222E"
                          : isNaN(depositAmount)
                            ? "#CF222E"
                            : process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" && depositAmount < minimumDepositAmount && depositAmount > 0
                              ? "#CF222E"
                              : depositAmount < 0
                                ? "#CF222E"
                                : depositAmount == 0
                                  ? "#4D59E8"
                                  : "#00D395"
                      }`}
                    // color="#4D59E8"
                    _hover={{ bg: "var(--surface-of-10, rgba(103, 109, 154, 0.10))" }}
                    onClick={() => {
                      setDepositAmount(walletBalance);
                      setinputAmount(walletBalance);
                      setSliderValue(100);
                      dispatch(setInputSupplyAmount(walletBalance));
                    }}
                    isDisabled={transactionStarted == true}
                    _disabled={{ cursor: "pointer" }}
                  >
                    MAX
                  </Button>
                </Box>
                {depositAmount > walletBalance || (process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" && depositAmount > maximumDepositAmount) ||
                  depositAmount < 0 || (depositAmount < minimumDepositAmount && process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" && depositAmount > 0) ||
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
                    <Text color="#CF222E" display="flex" flexDirection="row">
                      <Text mt="0.2rem">
                        <SmallErrorIcon />{" "}
                      </Text>
                      <Text ml="0.3rem">
                        {depositAmount > walletBalance
                          ? "Amount exceeds balance"
                          : process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" && depositAmount > maximumDepositAmount
                            ? "More than max amount"
                            : process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" && depositAmount < minimumDepositAmount
                              ? "Less than min amount" :
                              ""
                        }
                      </Text>
                    </Text>
                    <Text
                      color="#C7CBF6"
                      display="flex"
                      justifyContent="flex-end"
                      flexDirection="row"
                    >
                      Wallet Balance:{" "}
                      {walletBalance.toFixed(5).replace(/\.?0+$/, "").length > 5
                        ? numberFormatter(walletBalance)
                        : numberFormatter(walletBalance)}
                      <Text color="#676D9A" ml="0.2rem">
                        {` ${currentSelectedCoin}`}
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
                    Wallet Balance:{" "}
                    {walletBalance.toFixed(5).replace(/\.?0+$/, "").length > 5
                      ? numberFormatter(walletBalance)
                      : numberFormatter(walletBalance)}
                    <Text color="#676D9A" ml="0.2rem">
                      {` ${currentSelectedCoin}`}
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
                      setSliderValue(val);
                      var ans = (val / 100) * walletBalance;
                      // console.log(ans);
                      if (val == 100) {
                        setDepositAmount(walletBalance);
                        setinputAmount(walletBalance);
                      } else {
                        // ans = Math.round(ans * 100) / 100;
                        if (ans < 10) {
                          setDepositAmount(parseFloat(ans.toFixed(7)));
                          setinputAmount(parseFloat(ans.toFixed(7)));
                        } else {
                          ans = Math.round(ans * 100) / 100;
                          setDepositAmount(ans);
                          setinputAmount(ans);
                        }

                        // console.log(ans)
                        // dispatch(setInputSupplyAmount(ans));

                      }
                    }}
                    isDisabled={transactionStarted == true}
                    _disabled={{ cursor: "pointer" }}
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
                      ml={sliderValue !== 100 ? "-5" : "-6"}
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
                        _disabled={{ bg: "white" }}
                      />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </Box>
              </Card>
              <Box display="flex" gap="2">
                <Checkbox
                  size="md"
                  colorScheme="customPurple"
                  defaultChecked
                  mb="auto"
                  mt="0.7rem"
                  borderColor="#2B2F35"
                  isDisabled={transactionStarted == true}
                  // disabledColor="red"

                  // _disabled={{
                  //   colorScheme:"black",
                  //   cursor: "pointer",
                  //   iconColor: "black",
                  //   bg: "black",
                  // }}
                  onChange={() => {
                    setIsChecked(!ischecked);
                  }}
                />
                <Text
                  fontSize="14px"
                  fontWeight="400"
                  color="#B1B0B5"
                  mt="0.5rem"
                  lineHeight="22px"
                  width="100%"
                >
                  I would like to stake the rTokens.
                </Text>
              </Box>

              <Card background=" var(--surface-of-10, rgba(103, 109, 154, 0.10))" mt="1rem" p="1rem" border=" 1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))">
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
                      label="Cost incurred during transactions."
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
                <Text
                  color="#8B949E"
                  display="flex"
                  justifyContent="space-between"
                  fontSize="12px"
                  mb={ischecked ?"0.4rem":"0rem"}
                >
                  <Text display="flex" alignItems="center">
                    <Text
                      mr="0.2rem"
                      font-style="normal"
                      font-weight="400"
                      font-size="12px"
                      color="#676D9A"
                    >
                      Supply apr:
                    </Text>
                    <Tooltip
                      hasArrow
                      placement="right-end"
                      boxShadow="dark-lg"
                      label="Annual interest rate earned on supplied tokens."
                      bg="#02010F"
                      fontSize={"13px"}
                      fontWeight={"400"}
                      borderRadius={"lg"}
                      padding={"2"}
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
                      supplyAPRs[currentSupplyAPR] + "%"
                    )}
                    {/* 5.566% */}
                  </Text>
                </Text>
                {ischecked &&                <Text
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
                      fontSize={"13px"}
                      fontWeight={"400"}
                      borderRadius={"lg"}
                      padding={"2"}
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
                    +{protocolStats?.find(
                      (stat: any) =>
                        stat.token ==
                        (currentSelectedCoin[0] == "r"
                          ? currentSelectedCoin.slice(1)
                          : currentSelectedCoin)
                    )?.stakingRate
                      ? ((protocolStats?.find(
                        (stat: any) =>
                          stat.token ==
                          (currentSelectedCoin[0] == "r"
                            ? currentSelectedCoin.slice(1)
                            : currentSelectedCoin)
                      )?.stakingRate)-supplyAPRs[currentSupplyAPR]).toFixed(2)
                      : "1.2"}
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
                </Text>}

              </Card>
              {depositAmount > 0 && depositAmount <= walletBalance && ((depositAmount > 0 && depositAmount >= minimumDepositAmount) || process.env.NEXT_PUBLIC_NODE_ENV == "testnet") && (process.env.NEXT_PUBLIC_NODE_ENV == "testnet" || depositAmount <= maximumDepositAmount) ? (
                buttonId == 1 ? (
                  <SuccessButton successText="Supply success" />
                ) : buttonId == 2 ? (
                  <ErrorButton errorText="Copy error!" />
                ) : (
                  <Box
                    onClick={() => {
                      // dispatch(setTransactionStarted(""));
                      setTransactionStarted(true);
                      if (transactionStarted === false) {
                        dispatch(setTransactionStartedAndModalClosed(false));

                        handleTransaction();
                        mixpanel.track("Supply Market Clicked Button", {
                          "Supply Clicked": true,
                        });
                      }
                      // handleTransaction();
                      // dataDeposit();
                      // if(transactionStarted){
                      //   return;
                      // }
                      // console.log(isSuccessDeposit, "status deposit")
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
                        "Deposit Amount approved",
                        "Successfully transferred to Hashstack’s supply vault.",
                        "Determining the rToken amount to mint.",
                        "rTokens have been minted successfully.",
                        "Transaction complete.",
                        // <ErrorButton errorText="Transaction failed" />,
                        // <ErrorButton errorText="Copy error!" />,
                        <SuccessButton
                          key={"successButton"}
                          successText={"Supply success"}
                        />,
                      ]}
                      labelErrorArray={[
                        <ErrorButton
                          errorText="Transaction failed"
                          key={"error1"}
                        />,
                        <ErrorButton errorText="Copy error!" key={"error2"} />,
                      ]}
                      // transactionStarted={(depostiTransactionHash!="" || transactionFailed==true)}
                      _disabled={{ bgColor: "white", color: "black" }}
                      isDisabled={transactionStarted == true}
                      // transactionStarted={toastTransactionStarted}
                      // onClick={}
                      currentTransactionStatus={currentTransactionStatus}
                      setCurrentTransactionStatus={setCurrentTransactionStatus}
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
                  _hover={{ bg: "var(--surface-of-10, rgba(103, 109, 154, 0.10))" }}
                >
                  Supply
                </Button>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Portal>
    </div>
  );
};
export default SupplyModal;
