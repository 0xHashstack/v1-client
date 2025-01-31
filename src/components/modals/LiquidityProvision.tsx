import useLiquidity from '@/Blockchain/hooks/Writes/useLiquidity';
import useSwap from '@/Blockchain/hooks/Writes/useSwap';
import {
	getJediEstimateLiquiditySplit,
	getJediEstimatedLpAmountOut,
	getMySwapEstimateLiquiditySplit,
	getMySwapEstimatedLpAmountOut,
} from '@/Blockchain/scripts/l3interaction';
import ArrowUp from '@/assets/icons/arrowup';
import DAILogo from '@/assets/icons/coins/dai';
import ETHLogo from '@/assets/icons/coins/eth';
import SmallEth from '@/assets/icons/coins/smallEth';
import SmallJediswapLogo from '@/assets/icons/coins/smallJediswap';
import SmallUsdt from '@/assets/icons/coins/smallUsdt';
import USDCLogo from '@/assets/icons/coins/usdc';
import USDTLogo from '@/assets/icons/coins/usdt';
import JediswapLogo from '@/assets/icons/dapps/jediswapLogo';
import DropdownUp from '@/assets/icons/dropdownUpIcon';
import InfoIcon from '@/assets/icons/infoIcon';
import BtcToDai from '@/assets/icons/pools/btcToDai';
import BtcToEth from '@/assets/icons/pools/btcToEth';
import BtcToUsdc from '@/assets/icons/pools/btcToUsdc';
import BtcToUsdt from '@/assets/icons/pools/btcToUsdt';
import DaiToEth from '@/assets/icons/pools/daiToEth';
import EthToUsdc from '@/assets/icons/pools/ethToUsdc';
import EthToUsdt from '@/assets/icons/pools/ethToUsdt';
import StrkToEth from '@/assets/icons/pools/strkToEth';
import UsdcToDai from '@/assets/icons/pools/usdcToDai';
import UsdcToUsdt from '@/assets/icons/pools/usdcToUsdt';
import UsdtToDai from '@/assets/icons/pools/usdtToDai';
import {
	resetModalDropdowns,
	selectModalDropDowns,
	setModalDropdown,
} from '@/store/slices/dropdownsSlice';
import {
	selectAprAndHealthFactor,
	selectEffectiveApr,
	selectFees,
	selectHealthFactor,
	selectJediSwapPoolsSupported,
	selectJediswapPoolAprs,
	selectMySwapPoolsSupported,
	selectOraclePrices,
	selectProtocolStats,
	selectUserLoans,
} from '@/store/slices/readDataSlice';
import {
	selectActiveTransactions,
	selectInputSupplyAmount,
	selectJedistrkTokenAllocation,
	selectOracleAndFairPrices,
	selectSelectedDapp,
	selectStrkAprData,
	selectUserUnspentLoans,
	selectWalletBalance,
	selectnetSpendBalance,
	setActiveTransactions,
	setCoinSelectedSupplyModal,
	setInputSupplyAmount,
	setTransactionStartedAndModalClosed,
	setTransactionStatus,
} from '@/store/slices/userAccountSlice';
import dollarConvertor from '@/utils/functions/dollarConvertor';
import numberFormatter from '@/utils/functions/numberFormatter';
import numberFormatterPercentage from '@/utils/functions/numberFormatterPercentage';
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
	Portal,
	Skeleton,
	Text,
	Tooltip,
	useDisclosure,
} from '@chakra-ui/react';
import { useWaitForTransaction } from '@starknet-react/core';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';
import React, { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import TransactionFees from '../../../TransactionFees.json';
import BTCLogo from '../../assets/icons/coins/btc';
import TableJediswapLogo from '../layouts/table/tableIcons/jediswapLogo';
import TableJediswapLogoDull from '../layouts/table/tableIcons/jediswapLogoDull';
import TableMySwap from '../layouts/table/tableIcons/mySwap';
import TableMySwapDull from '../layouts/table/tableIcons/mySwapDull';
import TableYagiLogo from '../layouts/table/tableIcons/yagiLogo';
import TableYagiLogoDull from '../layouts/table/tableIcons/yagiLogoDull';
import AnimatedButton from '../uiElements/buttons/AnimationButton';
import ErrorButton from '../uiElements/buttons/ErrorButton';
import SuccessButton from '../uiElements/buttons/SuccessButton';
import SliderTooltip from '../uiElements/sliders/sliderTooltip';
import STRKLogo from '@/assets/icons/coins/strk';
const LiquidityProvisionModal = ({
	borrowIDCoinMap,
	borrowIds,
	borrow,
	coins,
	currentId,
	BorrowBalance,
	currentMarketCoin,
	currentSwap,
	setCurrentSwap,
	currentLoanAmount,
	currentLoanMarket,
	setCurrentLoanAmount,
	setCurrentLoanMarket,
	borrowAPRs,
	currentSelectedPool,
	currentSelectedDapp,
	poolNumber,
	collateralMarket,
}: any) => {
	////console.log("liquidity found map: ", borrowIDCoinMap);
	////console.log("liquidity found borrow ids: ", borrowIds);
	////console.log("liquidity found coins: ", coins);
	////console.log("liquidity found current coin: ", currentId);
	////console.log("liquidity found current id: ", currentMarketCoin);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		liquidityLoanId,
		setLiquidityLoanId,
		toMarketA,
		setToMarketA,

		toMarketB,
		setToMarketB,

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
	} = useLiquidity();

	const [currentSelectedCoin, setCurrentSelectedCoin] = useState('BTC');
	const [currentBorrowMarketCoin, setCurrentBorrowMarketCoin] =
		useState(currentMarketCoin);
	const [currentBorrowId, setCurrentBorrowId] = useState(currentId);
	const [currentPool, setCurrentPool] = useState('Select a pool');
	const [inputAmount, setinputAmount] = useState(0);
	const [sliderValue, setSliderValue] = useState(0);
	const selectedDapp = useSelector(selectSelectedDapp);
	const [transactionStarted, setTransactionStarted] = useState(false);

	const dispatch = useDispatch();
	const modalDropdowns = useSelector(selectModalDropDowns);
	const [walletBalance, setwalletBalance] = useState(BorrowBalance);
	const inputAmount1 = useSelector(selectInputSupplyAmount);
	const [borrowAmount, setBorrowAmount] = useState(BorrowBalance);
	const [uniqueID, setUniqueID] = useState(0);
	const strkTokenAlloactionData = useSelector(selectJedistrkTokenAllocation);
	const [allocationData, setallocationData] = useState<any>();
	const [poolAllocatedData, setpoolAllocatedData] = useState<any>();
	const getUniqueId = () => uniqueID;

	let activeTransactions = useSelector(selectActiveTransactions);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			let data: any = localStorage.getItem('transactionCheck');
			let values = data.split(',');
			let lastValue = values[values.length - 1];
			if (
				String(
					activeTransactions[activeTransactions.length - 1]?.uniqueID
				) === lastValue.replace(/\[|\]/g, '')
			) {
				if (
					activeTransactions[activeTransactions.length - 1]
						?.transaction_hash === ''
				) {
					resetStates();
					onClose();
				}
			}
		}, 7000); // 5000 milliseconds = 5 seconds

		return () => clearTimeout(timeoutId); // Cleanup function to clear the timeout when component unmounts or when activeTransactions changes
	}, [activeTransactions]);
	// const avgs=useSelector(selectAprAndHealthFactor)
	const avgs = useSelector(selectEffectiveApr);
	// useEffect(() => {
	//  //console.log("liquidity user loans", userLoans);
	// }, [userLoans]);
	////console.log(userLoans)
	////console.log(currentId.slice(currentId.indexOf("-") + 1).trim())

	useEffect(() => {
		try {
			if (currentPool !== 'Select a pool') {
				if (strkTokenAlloactionData[currentPool]) {
					setallocationData(strkTokenAlloactionData[currentPool]);
				}
			}
		} catch (err) {
			console.log('hi');
			// console.log(err);
		}
	}, [strkTokenAlloactionData, currentPool]);

	useEffect(() => {
		if (allocationData?.length > 0) {
			if (
				currentPool === 'STRK/ETH' ||
				currentPool == 'USDC/USDT' ||
				currentPool == 'ETH/USDC'
			) {
				setpoolAllocatedData(
					allocationData[allocationData.length - 1]?.allocation
				);
			} else {
				setpoolAllocatedData(0);
			}
		}
	}, [allocationData, currentPool]);

	useEffect(() => {
		const result = userLoans?.find(
			(item: any) =>
				item?.loanId ==
				currentId?.slice(currentId?.indexOf('-') + 1)?.trim()
		);
		setBorrowAmount(result?.loanAmountParsed);
		////console.log(borrowAmount)
		// Rest of your code using the 'result' variable
	}, [currentId]);
	useEffect(() => {
		setLiquidityLoanId(
			currentBorrowId?.slice(currentBorrowId?.indexOf('-') + 1)?.trim()
		);
		setCurrentPool('Select a pool');
		setCurrentLoanAmount(
			userLoans?.find(
				(loan: any) =>
					loan?.loanId ==
					currentBorrowId
						.slice(currentBorrowId?.indexOf('-') + 1)
						?.trim()
			)?.currentLoanAmount
		);
		setCurrentLoanMarket(
			userLoans?.find(
				(loan: any) =>
					loan?.loanId ==
					currentBorrowId
						.slice(currentBorrowId?.indexOf('-') + 1)
						?.trim()
			)?.currentLoanMarket
		);
		////console.log(
		//   "loanAmount",
		//   currentLoanAmount,
		//   ", loanMarket",
		//   currentLoanMarket,
		//   " currentBorrowId",
		//   currentBorrowId
		// );
	}, [currentBorrowId]);
	useEffect(() => {
		setToMarketA(currentPool?.split('/')[0]);
		setToMarketB(currentPool?.split('/')[1]);
	}, [currentPool]);

	const getCoin = (CoinName: string) => {
		switch (CoinName) {
			case 'BTC':
				return (
					<BTCLogo
						height={'16px'}
						width={'16px'}
					/>
				);
			case 'USDC':
				return (
					<USDCLogo
						height={'16px'}
						width={'16px'}
					/>
				);
			case 'USDT':
				return (
					<USDTLogo
						height={'16px'}
						width={'16px'}
					/>
				);
			case 'ETH':
				return (
					<ETHLogo
						height={'16px'}
						width={'16px'}
					/>
				);
			case 'DAI':
				return (
					<DAILogo
						height={'16px'}
						width={'16px'}
					/>
				);
			case 'STRK':
				return (
					<STRKLogo
						height={'16px'}
						width={'16px'}
					/>
				);
			case 'Jediswap':
				return <JediswapLogo />;
			case 'ETH/USDT':
				return <EthToUsdt />;
			case 'USDC/USDT':
				return <UsdcToUsdt />;
			case 'ETH/USDC':
				return <EthToUsdc />;
			case 'DAI/ETH':
				return <DaiToEth />;
			case 'BTC/ETH':
				return <BtcToEth />;
			case 'BTC/USDT':
				return <BtcToUsdt />;
			case 'BTC/USDC':
				return <BtcToUsdc />;
			case 'BTC/DAI':
				return <BtcToDai />;
			case 'USDT/DAI':
				return <UsdtToDai />;
			case 'USDC/DAI':
				return <UsdcToDai />;
			case 'STRK/ETH':
				return <StrkToEth />;
			default:
				break;
		}
	};
	// const borrowIds = [
	//   "ID - 123456",
	//   "ID - 123457",
	//   "ID - 123458",
	//   "ID - 123459",
	//   "ID - 1234510",
	// ];
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
	];

	//This Function handles the modalDropDowns
	const handleDropdownClick = (dropdownName: any) => {
		// Dispatches an action called setModalDropdown with the dropdownName as the payload
		dispatch(setModalDropdown(dropdownName));
	};
	const getStrkAlloaction = (pool: any) => {
		try {
			if (strkTokenAlloactionData[pool]) {
				return strkTokenAlloactionData[pool][
					strkTokenAlloactionData[pool].length - 1
				]?.allocation;
			} else {
				return 0;
			}
		} catch (err) {
			return 0;
		}
	};
	//This function is used to find the percentage of the slider from the input given by the user
	const handleChange = (newValue: any) => {
		// Calculate the percentage of the new value relative to the wallet balance
		if (newValue > 9_000_000_000) return;
		var percentage = (newValue * 100) / walletBalance;
		percentage = Math.max(0, percentage);
		if (percentage > 100) {
			setSliderValue(100);
			setinputAmount(newValue);
			dispatch(setInputSupplyAmount(newValue));
		} else {
			percentage = Math.round(percentage * 100) / 100;
			setSliderValue(percentage);
			setinputAmount(newValue);
			dispatch(setInputSupplyAmount(newValue));
		}
	};

	const [depositTransHash, setDepositTransHash] = useState('');
	const [currentTransactionStatus, setCurrentTransactionStatus] =
		useState('');
	const [isToastDisplayed, setToastDisplayed] = useState(false);
	const [toastId, setToastId] = useState<any>();
	const [hoverPoolIndex, sethoverPoolIndex] = useState<Number>(-1);
	const [hoverBorrowIdIndex, sethoverBorrowIdIndex] = useState<Number>(-1);
	const poolsPairs = useSelector(selectJediSwapPoolsSupported);
	const mySwapPoolPairs = useSelector(selectMySwapPoolsSupported);
	// const recieptData = useWaitForTransaction({
	//   hash: depositTransHash,
	//   watch: true,
	//   onReceived: () => {
	//    //console.log("trans received");
	//     if (!isToastDisplayed) {
	//       toast.success(`You have successfully supplied `, {
	//         position: toast.POSITION.BOTTOM_RIGHT,
	//       });
	//       setToastDisplayed(true);
	//     }
	//   },
	//   onPending: () => {
	//     setCurrentTransactionStatus("success");
	//     toast.dismiss(toastId);
	//    //console.log("trans pending");
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
	//       toast.success(`You have successfully supplied `, {
	//         position: toast.POSITION.BOTTOM_RIGHT,
	//       });
	//       setToastDisplayed(true);
	//     }
	//   },
	// });
	const router = useRouter();
	const { pathname } = router;
	const fees = useSelector(selectFees);

	const strkData = useSelector(selectStrkAprData);
	const netSpendBalance = useSelector(selectnetSpendBalance);

	const [netStrkBorrow, setnetStrkBorrow] = useState(0);
	const [currentCollateralCoin, setcurrentCollateralCoin] =
		useState(collateralMarket);
	const userLoans = useSelector(selectUserUnspentLoans);
	useEffect(() => {
		const result = userLoans.find(
			(item: any) =>
				item?.loanId ==
				currentBorrowId.slice(currentBorrowId.indexOf('-') + 1).trim()
		);
		setcurrentCollateralCoin(result?.collateralMarket);
	}, [currentBorrowId]);
	useEffect(() => {
		if (strkData != null) {
			let netallocation = 0;
			for (let token in strkData) {
				if (strkData.hasOwnProperty(token)) {
					const array = strkData[token];
					const lastObject = array[array.length - 1];
					netallocation += 0.3 * lastObject.allocation;
				}
			}
			setnetStrkBorrow(netallocation);
		} else {
			setnetStrkBorrow(0);
		}
	}, [strkData]);

	const getBoostedAprSupply = (coin: any) => {
		if (strkData == null) {
			return 0;
		} else {
			if (strkData?.[coin]) {
				if (oraclePrices == null) {
					return 0;
				} else {
					let value =
						strkData?.[coin] ?
							(365 *
								100 *
								strkData?.[coin][strkData[coin]?.length - 1]
									?.allocation *
								0.7 *
								oraclePrices?.find(
									(curr: any) => curr.name === 'STRK'
								)?.price) /
							strkData?.[coin][strkData[coin].length - 1]
								?.supply_usd
						:	0;
					return value;
				}
			} else {
				return 0;
			}
		}
	};

	const getBoostedApr = (coin: any) => {
		if (strkData == null) {
			return 0;
		} else {
			if (strkData?.[coin]) {
				if (oraclePrices == null) {
					return 0;
				} else {
					if (netStrkBorrow != 0) {
						if (netSpendBalance) {
							let value =
								(365 *
									100 *
									netStrkBorrow *
									oraclePrices?.find(
										(curr: any) => curr.name === 'STRK'
									)?.price) /
								netSpendBalance;
							return value;
						} else {
							return 0;
						}
					} else {
						return 0;
					}
				}
			} else {
				return 0;
			}
		}
	};

	useEffect(() => {
		if (pathname === '/v1/strk-rewards') {
			setCurrentPool(currentSelectedPool);
			setToMarketA(currentSelectedPool.split('/')[0]);
			//@ts-ignore
			setToMarketB(currentSelectedPool.split('/')[1]);
		}
	}, [poolNumber]);

	const handleLiquidity = async () => {
		try {
			if (currentSwap == 'Jediswap') {
				const liquidity = await writeAsyncJediSwap_addLiquidity();
				if (liquidity?.transaction_hash) {
					const toastid = toast.info(
						// `Please wait your transaction is running in background`,
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
						transaction_hash:
							liquidity?.transaction_hash.toString(),
						// message: `You have successfully Liquidated for Loan ID : ${liquidityLoanId}`,
						message: `Transaction successful`,
						toastId: toastid,
						setCurrentTransactionStatus:
							setCurrentTransactionStatus,
						uniqueID: uqID,
					};
					// addTransaction({ hash: deposit?.transaction_hash });
					activeTransactions?.push(trans_data);
					posthog.capture('Liquidity Spend Borrow Status', {
						Status: 'Success',
						PoolSelected: currentPool,
						BorrowId: currentBorrowId,
						BorrowedMarket: currentBorrowMarketCoin,
					});

					dispatch(setActiveTransactions(activeTransactions));
				}
				//console.log(liquidity);
				setDepositTransHash(liquidity?.transaction_hash);
				const uqID = getUniqueId();
				let data: any = localStorage.getItem('transactionCheck');
				data = data ? JSON.parse(data) : [];
				if (data && data.includes(uqID)) {
					dispatch(setTransactionStatus('success'));
				}
			} else if (currentSwap == 'MySwap') {
				const liquidity = await writeAsyncmySwap_addLiquidity();
				if (liquidity?.transaction_hash) {
					const toastid = toast.info(
						// `Please wait your transaction is running in background`,
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
						transaction_hash:
							liquidity?.transaction_hash.toString(),
						// message: `You have successfully Liquidated for Loan ID : ${liquidityLoanId}`,
						message: `Transaction successful`,
						toastId: toastid,
						setCurrentTransactionStatus:
							setCurrentTransactionStatus,
						uniqueID: uqID,
					};
					// addTransaction({ hash: deposit?.transaction_hash });
					activeTransactions?.push(trans_data);
					posthog.capture('Liquidity Spend Borrow Status', {
						Status: 'Success',
						PoolSelected: currentPool,
						BorrowId: currentBorrowId,
						BorrowedMarket: currentBorrowMarketCoin,
					});

					dispatch(setActiveTransactions(activeTransactions));
				}
				//console.log(liquidity);
				setDepositTransHash(liquidity?.transaction_hash);
				const uqID = getUniqueId();
				let data: any = localStorage.getItem('transactionCheck');
				data = data ? JSON.parse(data) : [];
				if (data && data.includes(uqID)) {
					dispatch(setTransactionStatus('success'));
				}
			}
		} catch (err: any) {
			//console.log(err);
			const uqID = getUniqueId();
			let data: any = localStorage.getItem('transactionCheck');
			data = data ? JSON.parse(data) : [];
			if (data && data.includes(uqID)) {
				// dispatch(setTransactionStatus("failed"));
				setTransactionStarted(false);
			}
			const toastContent = (
				<div>
					Transaction declined{' '}
					<CopyToClipboard text={err}>
						<Text as='u'>copy error!</Text>
					</CopyToClipboard>
				</div>
			);
			posthog.capture('Liquidity Spend Borrow Status', {
				Status: 'Failure',
			});
			toast.error(toastContent, {
				position: toast.POSITION.BOTTOM_RIGHT,
				autoClose: false,
			});
		}
	};

	// const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];
	const resetStates = () => {
		setCurrentBorrowId(currentId);
		setCurrentPool('Select a pool');
		setCurrentBorrowMarketCoin(currentMarketCoin);
		setTransactionStarted(false);
		dispatch(resetModalDropdowns());
		const result = userLoans.find(
			(item: { loanId: any }): any =>
				item?.loanId ==
				currentId.slice(currentId.indexOf('-') + 1).trim()
		);
		setBorrowAmount(result?.loanAmountParsed);
		setToastDisplayed(false);
		dispatch(setTransactionStatus(''));
		setCurrentTransactionStatus('');
		setDepositTransHash('');
	};

	useEffect(() => {
		setCurrentBorrowId(currentId);
		setCurrentBorrowMarketCoin(currentMarketCoin);
	}, [currentId, currentMarketCoin]);

	const handleBorrowMarketCoinChange = (id: string) => {
		////console.log("got id", id);
		for (let i = 0; i < borrowIDCoinMap.length; i++) {
			if (borrowIDCoinMap[i].id === id) {
				setCurrentBorrowMarketCoin(borrowIDCoinMap[i].name);
				return;
			}
		}
	};
	const activeModal = Object.keys(modalDropdowns).find(
		(key) => modalDropdowns[key] === true
	);
	const handleBorrowMarketIDChange = (coin: string) => {
		////console.log("got coin", coin);
		for (let i = 0; i < borrowIDCoinMap.length; i++) {
			if (borrowIDCoinMap[i].name === coin) {
				setCurrentBorrowId(borrowIDCoinMap[i].id);
				return;
			}
		}
	};

	// const getIndex = (borrowMarket: string) => {
	const getBorrowAPR = (borrowMarket: string) => {
		switch (borrowMarket) {
			case 'USDT':
				return borrowAPRs[0];
			case 'USDC':
				return borrowAPRs[1];
			case 'BTC':
				return borrowAPRs[2];
			case 'ETH':
				return borrowAPRs[3];
			case 'DAI':
				return borrowAPRs[4];
			case 'STRK':
				return borrowAPRs[5];

			default:
				break;
		}
	};

	const [currentLPTokenAmount, setCurrentLPTokenAmount] = useState<
		Number | undefined | null
	>();
	const [currentSplit, setCurrentSplit] = useState<
		Number[] | undefined | null
	>();

	useEffect(() => {
		////console.log(
		//   "toMarketSplitConsole",
		//   currentLoanMarket,
		//   currentLoanAmount,
		//   toMarketA,
		//   toMarketB
		//   // borrow
		// );
		setCurrentSplit(null);
		fetchLiquiditySplit();
	}, [toMarketA, currentLoanAmount, currentLoanMarket, toMarketB]);

	useEffect(() => {
		setCurrentLPTokenAmount(null);
		fetchLPAmount();
	}, [toMarketA, currentLoanAmount, currentLoanMarket, toMarketB]);

	const fetchLiquiditySplit = async () => {
		if (!toMarketA || !toMarketB || currentPool === 'Select a pool') return;
		if (currentSwap === 'Jediswap' || currentSwap === 'MySwap') {
			const split = await getJediEstimateLiquiditySplit(
				currentLoanMarket,
				currentLoanAmount,
				toMarketA,
				toMarketB
				// "USDT",
				// 99,
				// "ETH",
				// "USDT"
			);
			setCurrentSplit(split);
		} else if (currentSwap === 'MySwap') {
			const split = await getMySwapEstimateLiquiditySplit(
				currentLoanMarket,
				currentLoanAmount,
				toMarketA,
				toMarketB
				// "USDT",
				// 99,
				// "ETH",
				// "USDT"
			);
			setCurrentSplit(split);
		}
	};
	const poolApr = useSelector(selectJediswapPoolAprs);
	const getAprByPool = (dataArray: any[], pool: string, dapp: string) => {
		const matchedObject = dataArray.find((item) => {
			if (item.name === 'USDT/USDC') {
				return (
					item.amm ===
						(dapp == 'Select a dapp' ? 'jedi'
						: dapp == 'Jediswap' ? 'jedi'
						: 'myswap') && 'USDC/USDT' === pool
				);
			} else if (item.name == 'ETH/STRK') {
				return (
					item.amm ===
						(dapp == 'Select a dapp' ? 'jedi'
						: dapp == 'Jediswap' ? 'jedi'
						: 'myswap') && 'STRK/ETH' === pool
				);
			} else if (item.name === 'ETH/DAI') {
				return (
					item.amm ===
						(dapp == 'Select a dapp' ? 'jedi'
						: dapp == 'Jediswap' ? 'jedi'
						: 'myswap') && 'DAI/ETH' === pool
				);
			} else {
				return (
					item.name === pool &&
					item.amm ===
						(dapp == 'Select a dapp' ? 'jedi'
						: dapp == 'Jediswap' ? 'jedi'
						: 'myswap')
				);
			}
		});

		return matchedObject ? matchedObject.apr * 100 : 0;
	};
	const getTvlByPool = (dataArray: any[], pool: string, dapp: string) => {
		const matchedObject = dataArray.find((item) => {
			if (item.name === 'USDT/USDC') {
				return (
					item.amm ===
						(dapp == 'Select a dapp' ? 'jedi'
						: dapp == 'Jediswap' ? 'jedi'
						: 'myswap') && 'USDC/USDT' === pool
				);
			} else if (item.name == 'ETH/STRK') {
				return (
					item.amm ===
						(dapp == 'Select a dapp' ? 'jedi'
						: dapp == 'Jediswap' ? 'jedi'
						: 'myswap') && 'STRK/ETH' === pool
				);
			} else if (item.name === 'ETH/DAI') {
				return (
					item.amm ===
						(dapp == 'Select a dapp' ? 'jedi'
						: dapp == 'Jediswap' ? 'jedi'
						: 'myswap') && 'DAI/ETH' === pool
				);
			} else {
				return (
					item.name === pool &&
					item.amm ===
						(dapp == 'Select a dapp' ? 'jedi'
						: dapp == 'Jediswap' ? 'jedi'
						: 'myswap')
				);
			}
		});

		return matchedObject ? matchedObject.tvl : 0;
	};
	const reduxProtocolStats = useSelector(selectProtocolStats);
	const oraclePrices = useSelector(selectOraclePrices);
	const fetchLPAmount = async () => {
		if (!toMarketA || !toMarketB || currentPool === 'Select a pool') return;
		if (currentSwap === 'Jediswap' || currentSwap === 'MySwap') {
			const lp_tokon = await getJediEstimatedLpAmountOut(
				currentLoanMarket,
				currentLoanAmount,
				toMarketA,
				toMarketB
				// "USDT",
				// "99",
				// "ETH",
				// "USDT"
			);
			setCurrentLPTokenAmount(lp_tokon);
		} else if (currentSwap === 'MySwap') {
			const lp_tokon = await getMySwapEstimatedLpAmountOut(
				currentLoanMarket,
				currentLoanAmount,
				toMarketA,
				toMarketB
				// "USDT",
				// "99",
				// "ETH",
				// "USDT"
			);
			setCurrentLPTokenAmount(lp_tokon);
		}
	};

	return (
		<div>
			{pathname !== '/v1/strk-rewards' ?
				<Box
					display='flex'
					gap='4rem'
					mt='1rem'>
					<Box
						cursor='pointer'
						onClick={() => {
							if (selectedDapp == '') {
								////console.log("hi");
							} else {
								posthog.capture('Liquidity Modal Selected', {
									Clicked: true,
									'Dapp Selected': currentSwap,
								});
								// onOpen();
							}
						}}>
						<Box onClick={() => setCurrentSwap('Yagi')}>
							<TableYagiLogoDull />
						</Box>
					</Box>
					<Box
						cursor='pointer'
						onClick={() => {
							if (selectedDapp == '') {
								////console.log("hi");
							} else {
								const uqID = Math.random();
								setUniqueID(uqID);
								let data: any =
									localStorage.getItem('transactionCheck');
								data = data ? JSON.parse(data) : [];
								if (data && !data.includes(uqID)) {
									data.push(uqID);
									localStorage.setItem(
										'transactionCheck',
										JSON.stringify(data)
									);
								}
								onOpen();
								posthog.capture('Liquidity Modal Selected', {
									Clicked: true,
									'Dapp Selected': currentSwap,
								});
							}
						}}>
						<Box onClick={() => setCurrentSwap('MySwap')}>
							{selectedDapp !== '' ?
								<TableMySwap />
							:	<TableMySwapDull />}
						</Box>
					</Box>
					<Box
						cursor='pointer'
						onClick={() => {
							if (selectedDapp == '') {
								////console.log("hi");
							} else {
								const uqID = Math.random();
								setUniqueID(uqID);
								let data: any =
									localStorage.getItem('transactionCheck');
								data = data ? JSON.parse(data) : [];
								if (data && !data.includes(uqID)) {
									data.push(uqID);
									localStorage.setItem(
										'transactionCheck',
										JSON.stringify(data)
									);
								}
								onOpen();
								posthog.capture('Liquidity Modal Selected', {
									Clicked: true,
									'Dapp Selected': currentSwap,
								});
							}
						}}>
						<Box onClick={() => setCurrentSwap('Jediswap')}>
							{selectedDapp != '' ?
								<TableJediswapLogo />
							:	<TableJediswapLogoDull />}
						</Box>
					</Box>
				</Box>
			:	<Button
					cursor='pointer'
					height={'2rem'}
					fontSize={'12px'}
					mt='0.5rem'
					padding='6px 12px'
					bg='linear-gradient(to right, #7956EC,#1B29AE);'
					_hover={{ bg: 'white', color: 'black' }}
					borderRadius={'6px'}
					color='white'
					onClick={() => {
						setCurrentSwap('Jediswap');
						const uqID = Math.random();
						setUniqueID(uqID);
						let data: any =
							localStorage.getItem('transactionCheck');
						data = data ? JSON.parse(data) : [];
						if (data && !data.includes(uqID)) {
							data.push(uqID);
							localStorage.setItem(
								'transactionCheck',
								JSON.stringify(data)
							);
						}
						onOpen();
						posthog.capture('Liquidity Modal Selected', {
							Clicked: true,
							'Dapp Selected': currentSwap,
						});
					}}>
					Spend
				</Button>
			}
			<Portal>
				<Modal
					isOpen={isOpen}
					onClose={() => {
						const uqID = getUniqueId();
						let data: any =
							localStorage.getItem('transactionCheck');
						data = data ? JSON.parse(data) : [];
						////console.log(uqID, "data here", data);
						if (data && data.includes(uqID)) {
							data = data.filter((val: any) => val != uqID);
							localStorage.setItem(
								'transactionCheck',
								JSON.stringify(data)
							);
						}
						if (transactionStarted) {
							dispatch(setTransactionStartedAndModalClosed(true));
						}
						onClose();
						resetStates();
					}}
					isCentered
					scrollBehavior='inside'>
					<ModalOverlay
						bg='rgba(244, 242, 255, 0.5);'
						mt='3.8rem'
					/>
					<ModalContent
						background='var(--Base_surface, #02010F)'
						color='white'
						borderRadius='md'
						maxW='464px'
						zIndex={1}
						mt='8rem'
						className='modal-content'>
						<ModalHeader
							mt='1rem'
							fontSize='14px'
							fontWeight='600'
							fontStyle='normal'
							lineHeight='20px'>
							Liquidity Provision
						</ModalHeader>
						<ModalCloseButton
							mt='1rem'
							mr='1rem'
						/>
						<ModalBody>
							<Card
								background='var(--surface-of-10, rgba(103, 109, 154, 0.10))'
								border='1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
								mb='0.5rem'
								p='1rem'>
								<Text
									color='#676D9A'
									display='flex'
									alignItems='center'>
									<Text
										mr='0.3rem'
										fontSize='12px'>
										Select Liquidity Pool
									</Text>
									<Tooltip
										hasArrow
										placement='right-start'
										boxShadow='dark-lg'
										label='Choose a liquidity pool for trading, providing liquidity, or accessing DeFi services within the protocol.'
										bg='#02010F'
										fontSize={'13px'}
										fontWeight={'400'}
										borderRadius={'lg'}
										padding={'2'}
										color='#F0F0F5'
										border='1px solid'
										borderColor='#23233D'
										arrowShadowColor='#2B2F35'
										maxW='257px'
										// mt="48px"
									>
										<Box>
											<InfoIcon />
										</Box>
									</Tooltip>
								</Text>
								<Box
									display='flex'
									border='1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
									justifyContent='space-between'
									py='2'
									pl='3'
									mb='1rem'
									pr='3'
									mt='0.2rem'
									borderRadius='md'
									className='navbar'
									color='white'
									fontSize='16px'
									onClick={() => {
										if (transactionStarted) {
											return;
										} else {
											handleDropdownClick(
												'liquidityProvisionPoolDropDown'
											);
										}
									}}
									as='button'>
									<Box
										display='flex'
										gap='1'>
										{currentPool != 'Select a pool' ?
											<Box p='1'>
												{getCoin(currentPool)}
											</Box>
										:	''}

										<Text mt='0.1rem'>
											{(
												currentPool.split('/')[0] ==
													'BTC' &&
												currentPool.split('/')[1] ==
													'BTC'
											) ?
												'w' +
												currentPool.split('/')[0] +
												'/w' +
												currentPool.split('/')[1]
											: (
												currentPool.split('/')[0] ==
												'BTC'
											) ?
												'w' +
												currentPool.split('/')[0] +
												'/' +
												currentPool.split('/')[1]
											: (
												currentPool.split('/')[1] ==
												'BTC'
											) ?
												currentPool.split('/')[0] +
												'/w' +
												currentPool.split('/')[1]
											:	currentPool}
										</Text>
									</Box>
									<Box
										pt='1'
										className='navbar-button'>
										{(
											activeModal ==
											'liquidityProvisionPoolDropDown'
										) ?
											<ArrowUp />
										:	<DropdownUp />}
									</Box>
									{modalDropdowns.liquidityProvisionPoolDropDown && (
										<Box
											w='full'
											left='0'
											bg='#03060B'
											border='1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
											py='2'
											className='dropdown-container'
											boxShadow='dark-lg'
											height='198px'
											overflow='scroll'>
											{pools.map((pool, index) => {
												const matchingPair =
													currentSwap == 'Jediswap' ?
														poolsPairs.find(
															(pair: any) =>
																pair.keyvalue ===
																pool
														)
													:	mySwapPoolPairs.find(
															(pair: any) =>
																pair.keyvalue ===
																pool
														);
												if (!matchingPair) {
													return null; // Skip rendering for pools with keyvalue "null"
												}
												return (
													<Box
														key={index}
														as='button'
														w='full'
														display='flex'
														alignItems='center'
														gap='1'
														pr='2'
														// borderBottom={
														//   index == 2 && currentSwap == "Jediswap"
														//     ? "1px solid #30363D"
														//     : ""
														// }
														onMouseEnter={() => {
															sethoverPoolIndex(
																index
															);
														}}
														onMouseLeave={() => {
															sethoverPoolIndex(
																-1
															);
														}}
														onClick={() => {
															setCurrentPool(
																pool
															);
															sethoverPoolIndex(
																-1
															);
															////console.log(pool)
															setToMarketA(
																pool.split(
																	'/'
																)[0]
															);
															setToMarketB(
																pool.split(
																	'/'
																)[1]
															);
														}}>
														{((
															hoverPoolIndex ===
															-1
														) ?
															pool === currentPool
														:	hoverPoolIndex ===
															index) && (
															<Box
																w='3px'
																h='28px'
																bg='#4D59E8'
																borderRightRadius='md'></Box>
														)}
														<Box
															w='full'
															display='flex'
															justifyContent='space-between'
															py='5px'
															pr='2'
															pl={`${(pool === currentPool && hoverPoolIndex === -1) || hoverPoolIndex === index ? '1' : '4'}`}
															gap='1'
															bg={`${
																(
																	(pool ===
																		currentPool &&
																		hoverPoolIndex ===
																			-1) ||
																	hoverPoolIndex ===
																		index
																) ?
																	'#4D59E8'
																:	'inherit'
															}`}
															transition='ease .1s'
															borderRadius='md'>
															<Box
																display='flex'
																mt={
																	(
																		index <=
																			2 &&
																		currentSwap ==
																			'Jediswap'
																	) ?
																		'0.2rem'
																	:	''
																}>
																<Box p='1'>
																	{getCoin(
																		pool
																	)}
																</Box>
																<Tooltip
																	hasArrow
																	placement='right'
																	boxShadow='dark-lg'
																	label={
																		(
																			index <=
																				2 &&
																			currentSwap ==
																				'Jediswap'
																		) ?
																			'Earn $STRK Rewards.'
																		:	''
																	}
																	bg='#02010F'
																	fontSize={
																		'13px'
																	}
																	fontWeight={
																		'400'
																	}
																	borderRadius={
																		'lg'
																	}
																	padding={
																		'2'
																	}
																	color='#F0F0F5'
																	border='1px solid'
																	borderColor='#23233D'
																	arrowShadowColor='#2B2F35'
																	maxW='232px'
																	// mt="50px"
																>
																	<Text>
																		{(
																			pool.split(
																				'/'
																			)[0] ==
																				'BTC' &&
																			pool.split(
																				'/'
																			)[1] ==
																				'BTC'
																		) ?
																			'w' +
																			pool.split(
																				'/'
																			)[0] +
																			'/w' +
																			pool.split(
																				'/'
																			)[1]
																		: (
																			pool.split(
																				'/'
																			)[0] ==
																			'BTC'
																		) ?
																			'w' +
																			pool.split(
																				'/'
																			)[0] +
																			'/' +
																			pool.split(
																				'/'
																			)[1]
																		: (
																			pool.split(
																				'/'
																			)[1] ==
																			'BTC'
																		) ?
																			pool.split(
																				'/'
																			)[0] +
																			'/w' +
																			pool.split(
																				'/'
																			)[1]
																		:	pool}
																	</Text>
																</Tooltip>
																{/* <Text mt="-0.1rem">
                                        {(index<=2 && currentSwap=="Jediswap") ?"✨":"" }
                                    </Text> */}
															</Box>
															<Box
																display='flex'
																flexDirection='column'
																justifyContent='center'
																alignItems='flex-end'>
																<Box
																	fontSize='10px'
																	color='#B1B0B5'
																	mt='5px'
																	fontWeight='medium'>
																	Pool APR:{' '}
																	{numberFormatterPercentage(
																		getAprByPool(
																			poolApr,
																			pool,
																			currentSwap
																		)
																	)}
																	%
																</Box>
																{/* {index <= 2 && currentSwap == "Jediswap" && (
                                  <Box
                                    fontSize="10px"
                                    color="#B1B0B5"
                                    mt="5px"
                                    fontWeight="medium"
                                  >
                                    Jedi STRK APR:{" "}
                                    {numberFormatterPercentage(
                                      String(
                                        (100 *
                                          365 *
                                          (getStrkAlloaction(pool) *
                                            oraclePrices.find(
                                              (curr: any) =>
                                                curr.name === "STRK"
                                            )?.price)) /
                                          getTvlByPool(
                                            poolApr,
                                            pool,
                                            currentSwap
                                          )
                                      )
                                    )}
                                    %
                                  </Box>
                                )} */}
															</Box>
														</Box>
													</Box>
												);
											})}
										</Box>
									)}
								</Box>
								<Text
									color='#676D9A'
									display='flex'
									alignItems='center'>
									<Text
										mr='0.3rem'
										fontSize='12px'>
										Borrow ID
									</Text>
									<Tooltip
										hasArrow
										placement='right'
										boxShadow='dark-lg'
										label='A unique ID number assigned to a specific borrow within the protocol'
										bg='#02010F'
										fontSize={'13px'}
										fontWeight={'400'}
										borderRadius={'lg'}
										padding={'2'}
										color='#F0F0F5'
										border='1px solid'
										borderColor='#23233D'
										arrowShadowColor='#2B2F35'
										maxW='222px'>
										<Box>
											<InfoIcon />
										</Box>
									</Tooltip>
								</Text>
								<Box
									display='flex'
									border='1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
									justifyContent='space-between'
									py='2'
									pl='3'
									pr='3'
									mt='0.2rem'
									borderRadius='md'
									color='white'
									className='navbar'
									onClick={() => {
										if (transactionStarted == true) {
											return;
										} else {
											handleDropdownClick(
												'liquidityProvisionBorrowIDDropDown'
											);
										}
									}}
									as='button'>
									<Box
										display='flex'
										gap='1'
										ml='0.2rem'>
										{currentBorrowId}
									</Box>
									<Text
										pt='1'
										className='navbar-button'>
										{(
											activeModal ==
											'liquidityProvisionBorrowIDDropDown'
										) ?
											<ArrowUp />
										:	<DropdownUp />}
									</Text>
									{modalDropdowns.liquidityProvisionBorrowIDDropDown && (
										<Box
											w='full'
											left='0'
											bg='#03060B'
											border='1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
											py='2'
											className='dropdown-container'
											boxShadow='dark-lg'
											height={`${borrowIds.length >= 5 ? '198px' : 'none'}`}
											overflowY='scroll'>
											{borrowIds.map(
												(
													coin: string,
													index: number
												) => {
													return (
														<Box
															key={index}
															as='button'
															w='full'
															display='flex'
															alignItems='center'
															gap='1'
															px='2'
															onMouseEnter={() => {
																sethoverBorrowIdIndex(
																	index
																);
															}}
															onMouseLeave={() => {
																sethoverBorrowIdIndex(
																	-1
																);
															}}
															onClick={() => {
																setCurrentBorrowId(
																	'ID - ' +
																		coin
																);
																handleBorrowMarketCoinChange(
																	coin
																);
																sethoverBorrowIdIndex(
																	-1
																);
																////console.log(typeof coin,"coin")
																const borrowIdString =
																	String(
																		coin
																	);
																const result =
																	userLoans.find(
																		(item: {
																			loanId: string;
																		}): any =>
																			item?.loanId ==
																			borrowIdString
																				.slice(
																					borrowIdString.indexOf(
																						'-'
																					) +
																						1
																				)
																				.trim()
																	);
																////console.log(result)
																setBorrowAmount(
																	result?.loanAmountParsed
																);
															}}>
															{((
																hoverBorrowIdIndex ===
																-1
															) ?
																coin ===
																currentBorrowId
															:	hoverBorrowIdIndex ===
																index) && (
																<Box
																	w='3px'
																	h='28px'
																	bg='#4D59E8'
																	borderRightRadius='md'></Box>
															)}
															<Box
																w='full'
																display='flex'
																py='5px'
																px={`${
																	(
																		'ID - ' +
																			(coin ===
																				currentBorrowId &&
																				hoverBorrowIdIndex ===
																					-1) ||
																		hoverBorrowIdIndex ===
																			index
																	) ?
																		'2'
																	:	'5'
																}`}
																gap='1'
																bg={`${
																	(
																		'ID - ' +
																			(coin ===
																				currentBorrowId &&
																				hoverBorrowIdIndex ===
																					-1) ||
																		hoverBorrowIdIndex ===
																			index
																	) ?
																		'#4D59E8'
																	:	'inherit'
																}`}
																borderRadius='md'>
																{/* <Box p="1">{getCoin(coin)}</Box> */}
																<Text>
																	ID - {coin}
																</Text>
															</Box>
														</Box>
													);
												}
											)}
										</Box>
									)}
								</Box>
								<Text
									color='#676D9A'
									display='flex'
									alignItems='center'
									mt='1rem'>
									<Text
										mr='0.3rem'
										fontSize='12px'>
										Borrow Market
									</Text>
									<Tooltip
										hasArrow
										placement='right'
										boxShadow='dark-lg'
										label='The unit of tokens you have borrowed from the protocol.'
										bg='#02010F'
										fontSize={'13px'}
										fontWeight={'400'}
										borderRadius={'lg'}
										padding={'2'}
										color='#F0F0F5'
										border='1px solid'
										borderColor='#23233D'
										arrowShadowColor='#2B2F35'
										maxW='222px'>
										<Box>
											<InfoIcon />
										</Box>
									</Tooltip>
								</Text>
								<Box
									display='flex'
									border='1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
									justifyContent='space-between'
									py='2'
									pl='3'
									pr='3'
									mt='0.2rem'
									borderRadius='md'
									className='navbar'
									// onClick={() =>
									//   handleDropdownClick(
									//     "liquidityProvisionBorrowMarketDropDown"
									//   )
									// }
								>
									<Box
										display='flex'
										gap='1'>
										<Box p='1'>
											{(
												currentBorrowMarketCoin[0] ===
												'd'
											) ?
												getCoin(
													currentBorrowMarketCoin.slice(
														1
													)
												)
											:	getCoin(currentBorrowMarketCoin)}
										</Box>
										<Text color='white'>
											{(
												currentBorrowMarketCoin[0] !==
												'd'
											) ?
												'd' + currentBorrowMarketCoin
											:	currentBorrowMarketCoin}
										</Text>
									</Box>
								</Box>
								<Text
									color='#C7CBF6'
									display='flex'
									justifyContent='flex-end'
									mt='0.4rem'
									fontSize='12px'
									fontWeight='500'
									fontStyle='normal'
									fontFamily='Inter'>
									Borrow Balance: {borrowAmount}
									<Text
										color='#676D9A'
										ml='0.2rem'>
										{` ${currentBorrowMarketCoin}`}
									</Text>
								</Text>
							</Card>

							<Box
								borderRadius='6px'
								p='1rem'
								background='var(--surface-of-10, rgba(103, 109, 154, 0.10))'
								border='1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
								mt='1.5rem'>
								<Box
									display='flex'
									justifyContent='space-between'
									mb='0.3rem'>
									<Box display='flex'>
										<Text
											color='#676D9A'
											fontSize='12px'
											fontWeight='400'
											fontStyle='normal'>
											Dapp:
										</Text>
										<Tooltip
											hasArrow
											placement='right'
											boxShadow='dark-lg'
											label='Refers to the app where loan should be spent.'
											bg='#02010F'
											fontSize={'13px'}
											fontWeight={'400'}
											borderRadius={'lg'}
											padding={'2'}
											color='#F0F0F5'
											border='1px solid'
											borderColor='#23233D'
											arrowShadowColor='#2B2F35'
											maxW='222px'>
											<Box
												ml='0.1rem'
												mt='0.2rem'>
												<InfoIcon />
											</Box>
										</Tooltip>
									</Box>
									<Box
										display='flex'
										gap='2px'>
										<Box mt='2px'>
											{/* <SmallJediswapLogo /> */}
											<Image
												src={`/${currentSwap}.svg`}
												alt='liquidity split coin1'
												width='12'
												height='12'
											/>
										</Box>
										<Text
											color='#676D9A'
											fontSize='12px'
											fontWeight='400'
											fontStyle='normal'>
											{currentSwap}
										</Text>
									</Box>
								</Box>
								{currentPool != 'Select a pool' && (
									<Box
										display='flex'
										justifyContent='space-between'
										mb='0.3rem'>
										<Box display='flex'>
											<Box
												display='flex'
												gap='2px'>
												<Text
													color='#676D9A'
													fontSize='12px'
													fontWeight='400'
													fontStyle='normal'>
													est LP tokens received:
												</Text>
											</Box>
											<Tooltip
												hasArrow
												placement='right'
												boxShadow='dark-lg'
												label='Estimated Liquidity Provider Tokens Received: Estimate of LP tokens received by providing liquidity to a pool.'
												bg='#02010F'
												fontSize={'13px'}
												fontWeight={'400'}
												borderRadius={'lg'}
												padding={'2'}
												color='#F0F0F5'
												border='1px solid'
												borderColor='#23233D'
												arrowShadowColor='#2B2F35'
												maxW='222px'>
												<Box
													ml='0.2rem'
													mt='0.2rem'>
													<InfoIcon />
												</Box>
											</Tooltip>
										</Box>
										<Text
											color='#676D9A'
											fontSize='12px'
											fontWeight='400'
											fontStyle='normal'>
											{(
												currentLPTokenAmount ==
													undefined ||
												currentLPTokenAmount === null
											) ?
												<Box pt='2px'>
													<Skeleton
														width='2.3rem'
														height='.85rem'
														startColor='#2B2F35'
														endColor='#101216'
														borderRadius='6px'
													/>
												</Box>
											:	numberFormatter(
													currentLPTokenAmount
												)
											}
											{/* $ 10.91 */}
										</Text>
									</Box>
								)}
								{currentPool != 'Select a pool' && (
									<Box
										display='flex'
										justifyContent='space-between'
										mb='0.3rem'>
										<Box display='flex'>
											<Text
												color='#676D9A'
												fontSize='12px'
												fontWeight='400'
												fontStyle='normal'>
												Liquidity split:{' '}
											</Text>
											<Tooltip
												hasArrow
												placement='right'
												boxShadow='dark-lg'
												label='The fee for reallocating liquidity across assets within a protocol.'
												bg='#02010F'
												fontSize={'13px'}
												fontWeight={'400'}
												borderRadius={'lg'}
												padding={'2'}
												color='#F0F0F5'
												border='1px solid'
												borderColor='#23233D'
												arrowShadowColor='#2B2F35'
												maxW='222px'>
												<Box
													ml='0.2rem'
													mt='0.2rem'>
													<InfoIcon />
												</Box>
											</Tooltip>
										</Box>
										<Box
											display='flex'
											gap='2'
											color='#676D9A'
											fontSize='12px'
											fontWeight='400'
											fontStyle='normal'>
											<Box
												display='flex'
												gap='2px'>
												<Box m='2px'>
													{/* <SmallEth /> */}
													<Image
														src={`/${toMarketA}.svg`}
														alt='liquidity split coin1'
														width='12'
														height='12'
													/>
												</Box>
												<Text>
													{(
														currentSplit?.[0].toString()
													) ?
														numberFormatter(
															currentSplit?.[0].toString()
														)
													:	<Skeleton
															width='2.3rem'
															height='.85rem'
															startColor='#2B2F35'
															endColor='#101216'
															borderRadius='6px'
														/>
													}
												</Text>
											</Box>
											<Box
												display='flex'
												gap='2px'>
												<Box m='2px'>
													{/* <SmallUsdt /> */}
													<Image
														src={`/${toMarketB}.svg`}
														alt='liquidity split coin1'
														width='12'
														height='12'
													/>
												</Box>
												<Text>
													{(
														currentSplit?.[1].toString()
													) ?
														numberFormatter(
															currentSplit?.[1].toString()
														)
													:	<Skeleton
															width='2.3rem'
															height='.85rem'
															startColor='#2B2F35'
															endColor='#101216'
															borderRadius='6px'
														/>
													}
												</Text>
											</Box>
										</Box>
									</Box>
								)}
								<Box
									display='flex'
									justifyContent='space-between'
									mb='0.3rem'>
									<Box display='flex'>
										<Text
											color='#676D9A'
											fontSize='12px'
											fontWeight='400'
											fontStyle='normal'>
											Fees:
										</Text>
										<Tooltip
											hasArrow
											placement='right'
											boxShadow='dark-lg'
											label='Fees charged by Hashstack protocol. Additional third-party DApp fees may apply as appropriate.'
											bg='#02010F'
											fontSize={'13px'}
											fontWeight={'400'}
											borderRadius={'lg'}
											padding={'2'}
											color='#F0F0F5'
											border='1px solid'
											borderColor='#23233D'
											arrowShadowColor='#2B2F35'
											maxW='222px'>
											<Box
												ml='0.2rem'
												mt='0.2rem'>
												<InfoIcon />
											</Box>
										</Tooltip>
									</Box>
									<Text
										color='#676D9A'
										fontSize='12px'
										fontWeight='400'
										fontStyle='normal'>
										{fees.l3interaction}%
									</Text>
								</Box>
								{/* <Box display="flex" justifyContent="space-between" mb="0.3rem">
                  <Box display="flex">
                    <Text
                      color="#676D9A"
                      fontSize="12px"
                      fontWeight="400"
                      fontStyle="normal"
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
                      <Box ml="0.2rem" mt="0.2rem">
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
								<Box
									display='flex'
									justifyContent='space-between'
									mb='0.3rem'>
									<Box display='flex'>
										<Text
											color='#676D9A'
											fontSize='12px'
											fontWeight='400'
											fontStyle='normal'>
											Borrow APR:{' '}
										</Text>
										<Tooltip
											hasArrow
											placement='right'
											boxShadow='dark-lg'
											label='The annual interest rate charged on borrowed funds from the protocol.'
											bg='#02010F'
											fontSize={'13px'}
											fontWeight={'400'}
											borderRadius={'lg'}
											padding={'2'}
											color='#F0F0F5'
											border='1px solid'
											borderColor='#23233D'
											arrowShadowColor='#2B2F35'
											maxW='222px'>
											<Box
												ml='0.2rem'
												mt='0.2rem'>
												<InfoIcon />
											</Box>
										</Tooltip>
									</Box>
									<Text
										color='#676D9A'
										fontSize='12px'
										fontWeight='400'
										fontStyle='normal'>
										{(
											!borrowAPRs ||
											borrowAPRs.length === 0 ||
											(!getBorrowAPR(
												currentBorrowMarketCoin
											) &&
												!getBorrowAPR(
													currentBorrowMarketCoin.slice(
														1
													)
												))
										) ?
											<Box pt='2px'>
												<Skeleton
													width='2.3rem'
													height='.85rem'
													startColor='#2B2F35'
													endColor='#101216'
													borderRadius='6px'
												/>
											</Box>
										: (
											getBorrowAPR(
												currentBorrowMarketCoin
											)
										) ?
											'-' +
											getBorrowAPR(
												currentBorrowMarketCoin
											) +
											'%'
										:	'-' +
											getBorrowAPR(
												currentBorrowMarketCoin.slice(1)
											) +
											'%'
										}
										{/* 5.56% */}
									</Text>
								</Box>
								<Box
									display='flex'
									justifyContent='space-between'
									mb='0.3rem'>
									<Box display='flex'>
										<Text
											color='#676D9A'
											fontSize='12px'
											fontWeight='400'
											fontStyle='normal'>
											STRK APR:{' '}
										</Text>
										<Tooltip
											hasArrow
											placement='right'
											boxShadow='dark-lg'
											label='The annual percentage rate in which STRK is rewarded.'
											bg='#02010F'
											fontSize={'13px'}
											fontWeight={'400'}
											borderRadius={'lg'}
											padding={'2'}
											color='#F0F0F5'
											border='1px solid'
											borderColor='#23233D'
											arrowShadowColor='#2B2F35'
											maxW='222px'>
											<Box
												ml='0.2rem'
												mt='0.2rem'>
												<InfoIcon />
											</Box>
										</Tooltip>
									</Box>
									<Text
										color='#676D9A'
										fontSize='12px'
										fontWeight='400'
										fontStyle='normal'>
										{(
											!borrowAPRs ||
											borrowAPRs.length === 0 ||
											(!getBorrowAPR(
												currentBorrowMarketCoin
											) &&
												!getBorrowAPR(
													currentBorrowMarketCoin.slice(
														1
													)
												))
										) ?
											<Box pt='2px'>
												<Skeleton
													width='2.3rem'
													height='.85rem'
													startColor='#2B2F35'
													endColor='#101216'
													borderRadius='6px'
												/>
											</Box>
										: (
											numberFormatterPercentage(
												getBoostedApr(
													currentBorrowMarketCoin
												) +
													getBoostedAprSupply(
														currentCollateralCoin?.slice(
															1
														)
													)
											)
										) ?
											'' +
											numberFormatterPercentage(
												getBoostedApr(
													currentBorrowMarketCoin
												) +
													getBoostedAprSupply(
														currentCollateralCoin?.slice(
															1
														)
													)
											) +
											'%'
										:	'' +
											numberFormatterPercentage(
												getBoostedApr(
													currentBorrowMarketCoin.slice(
														1
													)
												) +
													getBoostedAprSupply(
														currentCollateralCoin?.slice(
															1
														)
													)
											) +
											'%'
										}
										{/* 5.56% */}
									</Text>
								</Box>
								<Box
									display='flex'
									justifyContent='space-between'
									mb='0.3rem'>
									<Box display='flex'>
										<Text
											color='#676D9A'
											fontSize='12px'
											fontWeight='400'
											fontStyle='normal'>
											Effective APR:{' '}
										</Text>
										<Tooltip
											hasArrow
											placement='right-end'
											boxShadow='dark-lg'
											label='If positive, This is the yield earned by your loan at present. If negative, This is the interest you are paying.'
											bg='#02010F'
											fontSize={'13px'}
											fontWeight={'400'}
											borderRadius={'lg'}
											padding={'2'}
											color='#F0F0F5'
											border='1px solid'
											borderColor='#23233D'
											arrowShadowColor='#2B2F35'
											maxW='252px'
											// mt="56px"
										>
											<Box
												ml='0.2rem'
												mt='0.2rem'>
												<InfoIcon />
											</Box>
										</Tooltip>
									</Box>
									{currentPool != 'Select a pool' ?
										<Text
											color={
												(
													(dollarConvertor(
														borrow?.loanAmountParsed,
														borrow?.loanMarket.slice(
															1
														),
														oraclePrices
													) *
														reduxProtocolStats.find(
															(val: any) =>
																val?.token ==
																borrow?.loanMarket.slice(
																	1
																)
														)
															?.exchangeRateDTokenToUnderlying *
														(-reduxProtocolStats?.find(
															(stat: any) =>
																stat?.token ===
																borrow?.loanMarket.slice(
																	1
																)
														)?.borrowRate +
															getBoostedApr(
																borrow?.collateralMarket.slice(
																	1
																)
															) +
															getAprByPool(
																poolApr,
																currentPool,
																currentSwap
															) +
															(100 *
																365 *
																(poolAllocatedData *
																	oraclePrices.find(
																		(
																			curr: any
																		) =>
																			curr.name ===
																			'STRK'
																	)?.price)) /
																getTvlByPool(
																	poolApr,
																	currentPool,
																	currentSwap
																)) +
														dollarConvertor(
															borrow?.collateralAmountParsed,
															borrow?.collateralMarket.slice(
																1
															),
															oraclePrices
														) *
															reduxProtocolStats.find(
																(val: any) =>
																	val?.token ==
																	borrow?.collateralMarket.slice(
																		1
																	)
															)
																?.exchangeRateRtokenToUnderlying *
															reduxProtocolStats?.find(
																(stat: any) =>
																	stat?.token ===
																	borrow?.collateralMarket.slice(
																		1
																	)
															)?.supplyRate) /
														dollarConvertor(
															borrow?.collateralAmountParsed,
															borrow?.collateralMarket.slice(
																1
															),
															oraclePrices
														) <
													0
												) ?
													'rgb(255 94 94)'
												:	'#00D395'
											}
											fontSize='12px'
											fontWeight='400'
											fontStyle='normal'>
											{(
												(dollarConvertor(
													borrow?.loanAmountParsed,
													borrow?.loanMarket.slice(1),
													oraclePrices
												) *
													reduxProtocolStats.find(
														(val: any) =>
															val?.token ==
															borrow?.loanMarket.slice(
																1
															)
													)
														?.exchangeRateDTokenToUnderlying *
													(-reduxProtocolStats?.find(
														(stat: any) =>
															stat?.token ===
															borrow?.loanMarket.slice(
																1
															)
													)?.borrowRate +
														getBoostedApr(
															borrow?.collateralMarket.slice(
																1
															)
														) +
														getAprByPool(
															poolApr,
															currentPool,
															currentSwap
														) +
														(100 *
															365 *
															(poolAllocatedData *
																oraclePrices.find(
																	(
																		curr: any
																	) =>
																		curr.name ===
																		'STRK'
																)?.price)) /
															getTvlByPool(
																poolApr,
																currentPool,
																currentSwap
															)) +
													dollarConvertor(
														borrow?.collateralAmountParsed,
														borrow?.collateralMarket.slice(
															1
														),
														oraclePrices
													) *
														reduxProtocolStats.find(
															(val: any) =>
																val?.token ==
																borrow?.collateralMarket.slice(
																	1
																)
														)
															?.exchangeRateRtokenToUnderlying *
														reduxProtocolStats?.find(
															(stat: any) =>
																stat?.token ===
																borrow?.collateralMarket.slice(
																	1
																)
														)?.supplyRate) /
												dollarConvertor(
													borrow?.collateralAmountParsed,
													borrow?.collateralMarket.slice(
														1
													),
													oraclePrices
												)
											).toFixed(2)}
											%
										</Text>
									:	<Text
											color={
												(
													Number(
														avgs?.find(
															(item: any) =>
																item?.loanId ==
																currentBorrowId
																	.slice(
																		currentBorrowId?.indexOf(
																			'-'
																		) + 1
																	)
																	?.trim()
														)?.avg
													) +
														getBoostedAprSupply(
															currentCollateralCoin?.slice(
																1
															)
														) <
													0
												) ?
													'rgb(255 94 94)'
												:	'#00D395'
											}
											fontSize='12px'
											fontWeight='400'
											fontStyle='normal'>
											{(
												avgs?.find(
													(item: any) =>
														item?.loanId ==
														currentBorrowId
															.slice(
																currentBorrowId?.indexOf(
																	'-'
																) + 1
															)
															?.trim()
												)?.avg
											) ?
												numberFormatterPercentage(
													Number(
														avgs?.find(
															(item: any) =>
																item?.loanId ==
																currentBorrowId
																	.slice(
																		currentBorrowId?.indexOf(
																			'-'
																		) + 1
																	)
																	?.trim()
														)?.avg
													) +
														getBoostedAprSupply(
															currentCollateralCoin?.slice(
																1
															)
														)
												)
											:	'3.2'}
											%
										</Text>
									}
								</Box>
								{/* (100*365*(poolAllocatedData*(oraclePrices.find((curr: any) => curr.name === "STRK")?.price))/getTvlByPool(poolApr, currentPool, currentSwap)) */}
								{/* (100*365*(poolAllocatedData*(oraclePrices.find((curr: any) => curr.name === "STRK")?.price))/getTvlByPool(poolApr, currentPool, currentSwap)) */}
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
                      maxW="262px"
                    >
                      <Box ml="0.2rem" mt="0.2rem">
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
                    {avgs?.find(
                      (item: any) =>
                        item?.loanId ==
                        currentBorrowId
                          .slice(currentBorrowId?.indexOf("-") + 1)
                          ?.trim()
                    )?.avg
                      ? avgs?.find(
                          (item: any) =>
                            item?.loanId ==
                            currentBorrowId
                              .slice(currentBorrowId?.indexOf("-") + 1)
                              ?.trim()
                        )?.loanHealth
                      : "2.5"}
                    %
                  </Text>
                </Box> */}
							</Box>
							{(
								currentPool != 'Select a pool' &&
								(currentBorrowMarketCoin === 'USDT' ?
									currentPool !== 'STRK/ETH'
								: currentBorrowMarketCoin === 'BTC' ?
									currentPool !== 'STRK/ETH'
								:	true)
							) ?
								<Box
									onClick={() => {
										setTransactionStarted(true);
										if (transactionStarted == false) {
											posthog.capture(
												'Liquidity Button Clicked Spend Borrow',
												{
													Clicked: true,
												}
											);
											dispatch(
												setTransactionStartedAndModalClosed(
													false
												)
											);
											handleLiquidity();
										}
									}}>
									<AnimatedButton
										// bgColor="red"
										// p={0}
										color='#676D9A'
										size='sm'
										width='100%'
										mt='1.5rem'
										mb='1.5rem'
										background='var(--surface-of-10, rgba(103, 109, 154, 0.10))'
										border='1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
										labelSuccessArray={[
											'Performing pre-checks',
											'Processing the spend borrow',
											'Updating the l3 records.',
											// <ErrorButton errorText="Transaction failed" />,
											// <ErrorButton errorText="Copy error!" />,
											<SuccessButton
												key={'successButton'}
												successText={
													'Spend successful.'
												}
											/>,
										]}
										_disabled={{
											bgColor: 'white',
											color: 'black',
										}}
										isDisabled={transactionStarted == true}
										labelErrorArray={[
											<ErrorButton
												errorText='Transaction failed'
												key={'error1'}
											/>,
											<ErrorButton
												errorText='Copy error!'
												key={'error2'}
											/>,
										]}
										currentTransactionStatus={
											currentTransactionStatus
										}
										setCurrentTransactionStatus={
											setCurrentTransactionStatus
										}>
										Spend Borrow
									</AnimatedButton>
								</Box>
							:	<Button
									color='#6E7681'
									size='sm'
									width='100%'
									mt='1.5rem'
									mb='1.5rem'
									background='var(--surface-of-10, rgba(103, 109, 154, 0.10))'
									border='1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
									_hover={{
										bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
									}}>
									Spend Borrow
								</Button>
							}
						</ModalBody>
					</ModalContent>
				</Modal>
			</Portal>
		</div>
	);
};
export default LiquidityProvisionModal;
