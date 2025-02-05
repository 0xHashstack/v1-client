import {
	Box,
	Button,
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
} from '@chakra-ui/react';

/* Coins logo import  */
import {
	getMaximumDepositAmount,
	getMaximumDynamicLoanAmount,
	getMinimumDepositAmount,
} from '@/Blockchain/scripts/Rewards';
import BTCLogo from '../../assets/icons/coins/btc';

import { constants } from '@/Blockchain/utils/constants';
import DAILogo from '@/assets/icons/coins/dai';
import ETHLogo from '@/assets/icons/coins/eth';
import USDCLogo from '@/assets/icons/coins/usdc';
import USDTLogo from '@/assets/icons/coins/usdt';
import SliderPointer from '@/assets/icons/sliderPointer';
import SliderPointerWhite from '@/assets/icons/sliderPointerWhite';
import {
	resetModalDropdowns,
	selectModalDropDowns,
	selectNavDropdowns,
	setModalDropdown,
	setNavDropdown,
} from '@/store/slices/dropdownsSlice';
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
} from '@/store/slices/readDataSlice';
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
} from '@/store/slices/userAccountSlice';
import { useDispatch, useSelector } from 'react-redux';
import TransactionFees from '../../../TransactionFees.json';
import DropdownUp from '../../assets/icons/dropdownUpIcon';
import InfoIcon from '../../assets/icons/infoIcon';

import useBalanceOf from '@/Blockchain/hooks/Reads/useBalanceOf';
import useBorrowAndSpend from '@/Blockchain/hooks/Writes/useBorrowAndSpend';
import { NativeToken, RToken } from '@/Blockchain/interfaces/interfaces';
import {
	getLoanHealth_NativeCollateral,
	getLoanHealth_RTokenCollateral,
} from '@/Blockchain/scripts/LoanHealth';
import {
	getMaximumLoanAmount,
	getMinimumLoanAmount,
	getSupportedPools,
} from '@/Blockchain/scripts/Rewards';
import {
	getJediEstimateLiquiditySplit,
	getJediEstimatedLpAmountOut,
	getMySwapEstimateLiquiditySplit,
	getMySwapEstimatedLpAmountOut,
	getUSDValue,
} from '@/Blockchain/scripts/l3interaction';
import { getProtocolStats } from '@/Blockchain/scripts/protocolStats';
import {
	tokenAddressMap,
	tokenDecimalsMap,
} from '@/Blockchain/utils/addressServices';
import { BNtoNum, parseAmount } from '@/Blockchain/utils/utils';
import ArrowUp from '@/assets/icons/arrowup';
import BlueInfoIcon from '@/assets/icons/blueinfoicon';
import SmallEth from '@/assets/icons/coins/smallEth';
import SmallUsdt from '@/assets/icons/coins/smallUsdt';
import STRKLogo from '@/assets/icons/coins/strk';
import JediswapLogo from '@/assets/icons/dapps/jediswapLogo';
import MySwap from '@/assets/icons/dapps/mySwap';
import MySwapDisabled from '@/assets/icons/dapps/mySwapDisabled';
import InfoIconBig from '@/assets/icons/infoIconBig';
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
import RedinfoIcon from '@/assets/icons/redinfoicon';
import SmallErrorIcon from '@/assets/icons/smallErrorIcon';
import dollarConvertor from '@/utils/functions/dollarConvertor';
import numberFormatter from '@/utils/functions/numberFormatter';
import numberFormatterPercentage from '@/utils/functions/numberFormatterPercentage';
import { useWaitForTransaction } from '@starknet-react/core';
import axios from 'axios';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import posthog from 'posthog-js';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import { uint256 } from 'starknet';
import AnimatedButton from '../uiElements/buttons/AnimationButton';
import ErrorButton from '../uiElements/buttons/ErrorButton';
import SuccessButton from '../uiElements/buttons/SuccessButton';
import SliderTooltip from '../uiElements/sliders/sliderTooltip';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
const TradeModal = ({
	buttonText,
	coin,
	borrowAPRs,
	currentBorrowAPR,
	setCurrentBorrowAPR,
	validRTokens,
	currentSelectedPool,
	currentSelectedDapp,
	poolNumber,
	...restProps
}: any) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	//  //console.log("isopen", isOpen, "onopen", onOpen, "onClose", onClose);
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
	} = useBorrowAndSpend();

	const rTokens: RToken[] = ['rBTC', 'rUSDT', 'rETH'];
	// const transactionStarted = useSelector(selectTransactionStarted);

	const [sliderValue, setSliderValue] = useState(0);
	const [sliderValue2, setsliderValue2] = useState(0);
	const dispatch = useDispatch();
	const [inputAmount, setinputAmount] = useState(0);
	const [inputCollateralAmount, setinputCollateralAmount] = useState(0);
	const [inputBorrowAmount, setinputBorrowAmount] = useState<any>(0);
	const modalDropdowns = useSelector(selectModalDropDowns);
	const [transactionStarted, setTransactionStarted] = useState(false);

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

	// const walletBalances=useSelector(selectAssetWalletBalance);
	interface assetB {
		USDT: any;
		USDC: any;
		BTC: any;
		ETH: any;
		DAI: any;
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
	};
	const [walletBalance, setwalletBalance] = useState(0);
	useEffect(() => {
		setwalletBalance(
			walletBalances[coin?.name]?.statusBalanceOf === 'success' ?
				parseAmount(
					String(
						uint256.uint256ToBN(
							walletBalances[coin?.name]?.dataBalanceOf?.balance
						)
					),
					tokenDecimalsMap[coin?.name]
				)
			:	0
		);
		////console.log("supply modal status wallet balance",walletBalances[coin?.name]?.statusBalanceOf)
	}, [walletBalances[coin?.name]?.statusBalanceOf]);
	const dapps = [
		{ name: 'Jediswap', status: 'enable' },
		{ name: 'mySwap', status: 'enable' },
	];
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

	const [currentDapp, setCurrentDapp] = useState(
		currentSelectedDapp ? currentSelectedDapp : 'Select a dapp'
	);
	const [currentPool, setCurrentPool] = useState('Select a pool');
	const [currentPoolCoin, setCurrentPoolCoin] = useState('Select a pool');
	const getCoin = (CoinName: string) => {
		switch (CoinName) {
			case 'BTC':
				return (
					<BTCLogo
						height={'16px'}
						width={'16px'}
					/>
				);
			case 'rBTC':
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
			case 'rUSDC':
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
			case 'rUSDT':
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
			case 'rETH':
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
			case 'rSTRK':
				return (
					<STRKLogo
						height={'16px'}
						width={'16px'}
					/>
				);
			case 'rDAI':
				return (
					<DAILogo
						height={'16px'}
						width={'16px'}
					/>
				);
			case 'Jediswap':
				return <JediswapLogo />;
			case 'mySwap':
				return <MySwap />;
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

	const fees = useSelector(selectFees);

	const handleDropdownClick = (dropdownName: any) => {
		dispatch(setModalDropdown(dropdownName));
	};
	const handleChange = (newValue: any) => {
		if (newValue > 9_000_000_000) return;
		var percentage = (newValue * 100) / walletBalance;
		percentage = Math.max(0, percentage);
		if (percentage > 100) {
			setSliderValue(100);
			setinputCollateralAmount(newValue);
			setCollateralAmount(newValue);
			setRTokenAmount(newValue);
			dispatch(setInputTradeModalCollateralAmount(newValue));
		} else {
			percentage = Math.round(percentage);
			if (isNaN(percentage)) {
			} else {
				setSliderValue(percentage);
				setinputCollateralAmount(newValue);
				setCollateralAmount(newValue);
				setRTokenAmount(newValue);
				dispatch(setInputTradeModalCollateralAmount(newValue));
			}
			// dispatch((newValue));
		}
	};
	const handleBorrowChange = (newValue: any) => {
		if (newValue > 9_000_000_000) return;
		if (inputCollateralAmountUSD > 0) {
			var percentage =
				(newValue * 100) /
				((4.98 * inputCollateralAmountUSD) /
					oraclePrices.find(
						(curr: any) => curr.name === currentBorrowCoin
					)?.price);
		}
		var percentage = (newValue * 100) / walletBalance;
		percentage = Math.max(0, percentage);
		if (percentage > 100) {
			setsliderValue2(100);
			setinputBorrowAmount(newValue);
			setLoanAmount(newValue);
			// dispatch(setInputTradeModalCollateralAmount(newValue));
		} else {
			percentage = Math.round(percentage);
			if (isNaN(percentage)) {
			} else {
				setsliderValue2(percentage);
				setinputBorrowAmount(newValue);
				setLoanAmount(newValue);
			}
			// dispatch(setInputTradeModalCollateralAmount(newValue));
			// dispatch((newValue));
		}
	};
	const coins: NativeToken[] = ['BTC', 'USDT', 'USDC', 'ETH', 'DAI', 'STRK'];

	const [currentCollateralCoin, setCurrentCollateralCoin] = useState(
		coin ? coin?.name : 'BTC'
	);

	// const coinAlign = ["BTC", "USDT", "USDC", "ETH", "DAI"];
	const [currentBorrowCoin, setCurrentBorrowCoin] = useState(
		coin ? coin?.name : 'BTC'
	);
	const [uniqueID, setUniqueID] = useState(0);
	const getUniqueId = () => uniqueID;
	const [protocolStats, setProtocolStats] = useState<any>([]);
	const stats = useSelector(selectProtocolStats);
	const fetchProtocolStats = async () => {
		if (stats)
			setProtocolStats([
				stats?.[0],
				stats?.[2],
				stats?.[3],
				stats?.[1],
				stats?.[4],
				stats?.[5],
			]);
	};
	const poolsPairs = useSelector(selectJediSwapPoolsSupported);
	const mySwapPoolPairs = useSelector(selectMySwapPoolsSupported);
	const [myswapPools, setmyswapPools] = useState([]);
	const [jediswapPools, setjediswapPools] = useState([]);
	const [collateralHoverIndex, setcollateralHoverIndex] =
		useState<Number>(-1);
	const [borrowHoverIndex, setborrowHoverIndex] = useState<Number>(-1);
	const [dappHoverIndex, setdappHoverIndex] = useState<Number>(-1);
	const [poolHoverIndex, setpoolHoverIndex] = useState<Number>(-1);
	useEffect(() => {
		function findSideForMember(array: any, token: any) {
			const data: any = [];
			for (const obj of array) {
				const keyvalue = obj.keyvalue;
				const [tokenA, tokenB] = keyvalue.split('/');

				if (tokenA === token) {
					data.push(tokenB);
				} else if (tokenB === token) {
					data.push(tokenA);
				}
			}
			setmyswapPools(data);
			// Token not found in any "keyvalue" pairs
		}
		if (mySwapPoolPairs) {
			findSideForMember(mySwapPoolPairs, currentBorrowCoin);
		}
	}, [currentBorrowCoin, mySwapPoolPairs]);

	useEffect(() => {
		function findSideForMember(array: any, token: any) {
			const data: any = [];
			for (const obj of array) {
				const keyvalue = obj.keyvalue;
				const [tokenA, tokenB] = keyvalue.split('/');

				if (tokenA === token) {
					data.push(tokenB);
				} else if (tokenB === token) {
					data.push(tokenA);
				}
			}
			setjediswapPools(data);
			// Token not found in any "keyvalue" pairs
		}
		if (poolsPairs) {
			findSideForMember(poolsPairs, currentBorrowCoin);
		}
	}, [currentBorrowCoin, poolsPairs]);

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
			fetchProtocolStats();
			////console.log("protocolStats", protocolStats);
		} catch (err: any) {
			//console.log("borrow modal : error fetching protocolStats");
		}
	}, [stats]);
	const [currentAvailableReserves, setCurrentAvailableReserves] = useState(
		protocolStats?.find((stat: any) => stat?.token == currentBorrowCoin)
			?.availableReserves * 0.895
	);
	useEffect(() => {
		////console.log("currentAvailableReserve", currentAvailableReserves);
	}, [currentAvailableReserves]);

	useEffect(() => {
		setCurrentAvailableReserves(
			protocolStats[coins.indexOf(currentBorrowCoin)]?.availableReserves *
				0.895
		);
		////console.log(coins.indexOf(currentBorrowCoin));
	}, [protocolStats, currentBorrowCoin]);

	const [radioValue, setRadioValue] = useState('1');

	useEffect(() => {
		if (radioValue === '1') {
			setMethod('ADD_LIQUIDITY');
		} else if (radioValue === '2') {
			setMethod('SWAP');
		}
		////console.log("radio value", radioValue, method);
	}, [radioValue]);
	const [tokenTypeSelected, setTokenTypeSelected] = useState('Native');

	const pathname = usePathname();
	useEffect(() => {
		if (pathname == '/v1/strk-rewards/') {
			// setLoanMarket(coin ? coin.name : "BTC");
			// setCollateralMarket(coin ? coin.name : "BTC");
		} else {
			setLoanMarket(coin ? coin.name : 'BTC');
			setCollateralMarket(coin ? coin.name : 'BTC');
		}
	}, [coin]);
	useEffect(() => {
		setCurrentPool('Select a pool');
		setCurrentPoolCoin('Select a pool');
	}, [currentDapp]);
	const resetStates = () => {
		setSliderValue(0);
		setsliderValue2(0);
		setinputCollateralAmount(0);
		setCollateralAmount(0);
		setRTokenAmount(0);
		setinputBorrowAmount(0);
		setLoanAmount(0);
		setCurrentDapp('Select a dapp');
		setCurrentPool('Select a pool');
		setCurrentCollateralCoin(coin ? coin.name : 'BTC');
		setCollateralMarket(coin ? coin.name : 'BTC');
		setCurrentBorrowCoin(coin ? coin.name : 'BTC');
		setLoanMarket(coin ? coin.name : 'BTC');
		setCurrentPoolCoin('Select a pool');
		setRadioValue('1');
		setHealthFactor(undefined);
		setTokenTypeSelected('Native');
		// setTransactionStarted(false);
		dispatch(resetModalDropdowns());
		setwalletBalance(
			walletBalances[coin?.name]?.statusBalanceOf === 'success' ?
				parseAmount(
					String(
						uint256.uint256ToBN(
							walletBalances[coin?.name]?.dataBalanceOf?.balance
						)
					),
					tokenDecimalsMap[coin?.name]
				)
			:	0
		);
		// if (transactionStarted) dispatch(setTransactionStarted(""));
		setTransactionStarted(false);
		dispatch(resetModalDropdowns());
		dispatch(setTransactionStatus(''));
		setCurrentTransactionStatus('');
		setDepositTransHash('');
	};
	const activeModal = Object.keys(modalDropdowns).find(
		(key) => modalDropdowns[key] === true
	);
	useEffect(() => {
		setCurrentPool('Select a pool');
		setCurrentPoolCoin('Select a pool');
	}, [radioValue]);

	useEffect(() => {
		setinputBorrowAmount(0);
		setLoanAmount(0);
		// setLoanAmount(0);
		setsliderValue2(0);
		setCurrentPoolCoin('Select a pool');
		// setHealthFactor(undefined)
	}, [currentBorrowCoin]);

	useEffect(() => {
		setinputCollateralAmount(0);
		setCollateralAmount(0);
		setRTokenAmount(0);
		setSliderValue(0);
		// setHealthFactor(undefined)
	}, [currentCollateralCoin]);

	const [depositTransHash, setDepositTransHash] = useState('');

	const [currentTransactionStatus, setCurrentTransactionStatus] =
		useState('');

	const [isToastDisplayed, setToastDisplayed] = useState(false);
	const [toastId, setToastId] = useState<any>();
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
	const oraclePrices = useSelector(selectOraclePrices);
	const marketInfo = useSelector(selectProtocolStats);
	const [healthFactor, setHealthFactor] = useState<number>();

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
						);
						setHealthFactor(data);
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
						);
						////console.log(data,"data in trade")
						setHealthFactor(data);
					}
				}
			};
			fetchHealthFactor();
		} catch (err) {
			//console.log(err);
		}
	}, [
		inputBorrowAmount,
		inputCollateralAmount,
		currentBorrowCoin,
		currentCollateralCoin,
		rTokenAmount,
	]);
	const [minimumDepositAmount, setMinimumDepositAmount] = useState<any>(0);
	const [maximumDepositAmount, setmaximumDepositAmount] = useState<any>(0);
	const minAmounts = useSelector(selectMinimumDepositAmounts);
	const maxAmounts = useSelector(selectMaximumDepositAmounts);
	useEffect(() => {
		setMinimumDepositAmount(minAmounts['r' + currentCollateralCoin]);
		setmaximumDepositAmount(maxAmounts['r' + currentCollateralCoin]);
	}, [currentCollateralCoin, minAmounts, maxAmounts]);
	const { copyToClipboard } = useCopyToClipboard();

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
	];
	const handleBorrowAndSpend = async () => {
		try {
			if (currentCollateralCoin[0] != 'r') {
				const borrowAndSpend = await writeAsyncBorrowAndSpend();
				setDepositTransHash(borrowAndSpend?.transaction_hash);
				if (borrowAndSpend?.transaction_hash) {
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
							borrowAndSpend?.transaction_hash.toString(),
						// message: `You have successfully traded`,
						message: `Transaction successful`,
						toastId: toastid,
						setCurrentTransactionStatus:
							setCurrentTransactionStatus,
						uniqueID: uqID,
					};
					// addTransaction({ hash: deposit?.transaction_hash });
					activeTransactions?.push(trans_data);
					posthog.capture('Trade Modal Market Status', {
						Status: 'Failure',
						BorrowToken: currentBorrowCoin,
						BorrowAmount: inputBorrowAmount,
						CollateralToken: currentCollateralCoin,
						CollateralAmount: inputCollateralAmount,
						'Pool Selected': currentPool,
						'Dapp Selected': currentDapp,
					});

					dispatch(setActiveTransactions(activeTransactions));
				}
				const uqID = getUniqueId();
				let data: any = localStorage.getItem('transactionCheck');
				data = data ? JSON.parse(data) : [];
				if (data && data.includes(uqID)) {
					dispatch(setTransactionStatus('success'));
				}
			} else if (currentCollateralCoin[0] == 'r') {
				const borrowAndSpendR = await writeAsyncBorrowAndSpendRToken();
				setDepositTransHash(borrowAndSpendR?.transaction_hash);
				if (borrowAndSpendR?.transaction_hash) {
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
							borrowAndSpendR?.transaction_hash.toString(),
						// message: `You have successfully traded`,
						message: `Transaction successful`,
						toastId: toastid,
						setCurrentTransactionStatus:
							setCurrentTransactionStatus,
						uniqueID: uqID,
					};
					// addTransaction({ hash: deposit?.transaction_hash });
					activeTransactions?.push(trans_data);
					posthog.capture('Trade Modal Market Status', {
						Status: 'Failure',
						BorrowToken: currentBorrowCoin,
						BorrowAmount: inputBorrowAmount,
						CollateralToken: currentCollateralCoin,
						CollateralAmount: inputCollateralAmount,
						'Pool Selected': currentPool,
						'Dapp Selected': currentDapp,
					});

					dispatch(setActiveTransactions(activeTransactions));
				}
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

			const handleCopyToClipboard = () => {
				copyToClipboard(err.toString());
			};

			const toastContent = (
				<div>
					Transaction declined{' '}
					<Text
						as='u'
						onClick={handleCopyToClipboard}>
						copy error!
					</Text>
				</div>
			);
			posthog.capture('Trade Modal Market Status', {
				Status: 'Failure',
			});
			toast.error(toastContent, {
				position: toast.POSITION.BOTTOM_RIGHT,
				autoClose: false,
			});
		}
	};

	const [inputBorrowAmountUSD, setInputBorrowAmountUSD] = useState<any>(0);
	const availableReserves = protocolStats?.find(
		(stat: any) => stat?.token === currentBorrowCoin
	)?.availableReserves;
	const [inputCollateralAmountUSD, setInputCollateralAmountUSD] =
		useState<any>(0);
	useEffect(() => {
		fetchParsedUSDValueBorrow();
	}, [inputBorrowAmount, currentBorrowCoin]);

	useEffect(() => {
		fetchParsedUSDValueCollateral();
	}, [collateralAmount, currentCollateralCoin, rToken, rTokenAmount]);

	const fetchParsedUSDValueBorrow = async () => {
		try {
			if (!oraclePrices || oraclePrices?.length === 0) {
				////console.log("got parsed zero borrow");
				setInputBorrowAmountUSD(0);
				return;
			}

			const parsedBorrowAmount =
				oraclePrices.find(
					(curr: any) => curr.name === currentBorrowCoin
				)?.price * inputBorrowAmount;
			// const parsedBorrowAmount = await getUSDValue(
			//   currentBorrowCoin,
			//   inputBorrowAmount
			// );
			////console.log("got parsed usdt borrow", parsedBorrowAmount);
			setInputBorrowAmountUSD(parsedBorrowAmount);
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
	};
	// const [poolAprs, setPoolAprs] = useState<any>([])
	const poolAprs = useSelector(selectJediswapPoolAprs);
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

	const strkData = useSelector(selectStrkAprData);
	const netSpendBalance = useSelector(selectnetSpendBalance);

	const [netStrkBorrow, setnetStrkBorrow] = useState(0);

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

	const fetchParsedUSDValueCollateral = async () => {
		try {
			if (!oraclePrices || oraclePrices?.length === 0) {
				setInputCollateralAmountUSD(0);
				////console.log("got parsed zero collateral");

				return;
			}

			if (tokenTypeSelected === 'Native') {
				const parsedBorrowAmount =
					oraclePrices.find(
						(curr: any) => curr.name === currentCollateralCoin
					)?.price * collateralAmount;
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
				setInputCollateralAmountUSD(parsedBorrowAmount);
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
					oraclePrices.find(
						(curr: any) => curr.name === rToken.slice(1)
					)?.price *
					rTokenAmount *
					protocolStats.find(
						(curr: any) => curr.token === rToken.slice(1)
					)?.exchangeRateRtokenToUnderlying;
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
				setInputCollateralAmountUSD(parsedBorrowAmount);
			}
		} catch (error) {
			//console.log(error);
		}
	};
	const [currentLPTokenAmount, setCurrentLPTokenAmount] = useState<
		Number | undefined | null
	>();
	const [currentSplit, setCurrentSplit] = useState<
		Number[] | undefined | null
	>();
	const [minimumLoanAmount, setMinimumLoanAmount] = useState<any>(0);
	const [maximumLoanAmount, setMaximumLoanAmount] = useState<any>(0);
	const minLoanAmounts = useSelector(selectMinimumLoanAmounts);
	const maxLoanAmounts = useSelector(selectMaximumLoanAmounts);
	useEffect(() => {
		const fecthLoanAmount = async () => {
			const dynamicdata = await getMaximumDynamicLoanAmount(
				collateralAmount,
				currentBorrowCoin,
				currentCollateralCoin[0] == 'r' ?
					currentCollateralCoin.slice(1)
				:	currentCollateralCoin
			);
			if (dynamicdata != undefined) {
				const data = maxLoanAmounts['d' + currentBorrowCoin];
				if (currentBorrowCoin == currentCollateralCoin) {
					setMaximumLoanAmount(
						maxLoanAmounts['d' + currentBorrowCoin]
					);
				} else if (
					currentCollateralCoin[0] == 'r' &&
					currentCollateralCoin.slice(1) == currentBorrowCoin
				) {
					setMaximumLoanAmount(
						maxLoanAmounts['d' + currentBorrowCoin]
					);
				} else {
					setMaximumLoanAmount(Math.min(dynamicdata, data));
				}
			}
		};
		fecthLoanAmount();
		setMinimumLoanAmount(minLoanAmounts['d' + currentBorrowCoin]);
	}, [
		currentBorrowCoin,
		maxLoanAmounts,
		minLoanAmounts,
		currentCollateralCoin,
	]);
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
		setCurrentSplit(null);
		fetchLiquiditySplit();
	}, [
		inputBorrowAmount,
		currentBorrowCoin,
		toMarketLiqA,
		toMarketLiqB,
		currentDapp,
	]);

	useEffect(() => {
		setCurrentLPTokenAmount(null);
		fetchLPAmount();
	}, [
		inputBorrowAmount,
		currentBorrowCoin,
		toMarketLiqA,
		toMarketLiqB,
		currentDapp,
	]);

	const strkTokenAlloactionData: any = useSelector(
		selectJedistrkTokenAllocation
	);
	const [allocationData, setallocationData] = useState<any>();
	const [poolAllocatedData, setpoolAllocatedData] = useState<any>();

	useEffect(() => {
		try {
			if (currentPool !== 'Select a pool') {
				if (strkTokenAlloactionData[currentPool]) {
					setallocationData(strkTokenAlloactionData[currentPool]);
				}
			}
		} catch (err) {
			// console.log("hi");
			console.log(err, 'err in allocating');
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

	const fetchLiquiditySplit = async () => {
		if (
			currentDapp === 'Select a dapp' ||
			!toMarketLiqA ||
			!toMarketLiqB ||
			!currentBorrowCoin ||
			!inputBorrowAmount ||
			currentPool === 'Select a pool'
		)
			return;

		if (currentDapp === 'Jediswap' || currentDapp === 'mySwap') {
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
			);
			setCurrentSplit(split);
		} else if (currentDapp === 'mySwap') {
			console.log('enter');
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
			);
			setCurrentSplit(split);
		}
	};

	const fetchLPAmount = async () => {
		if (
			currentDapp === 'Select a dapp' ||
			!toMarketLiqA ||
			!toMarketLiqB ||
			!currentBorrowCoin ||
			!inputBorrowAmount ||
			currentPool === 'Select a pool'
		)
			return;
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
			);
			setCurrentLPTokenAmount(lp_tokon);
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
			);
			setCurrentLPTokenAmount(lp_tokon);
		}
	};
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
		if (pathname === '/v1/strk-rewards/') {
			setCurrentPool(currentSelectedPool);
			setCurrentDapp('Jediswap');
			setToMarketLiqA(currentSelectedPool.split('/')[0]);
			//@ts-ignore
			setToMarketLiqB(currentSelectedPool.split('/')[1]);
		}
	}, [poolNumber]);
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
			console.log(err, 'er in strk alloc');
			return 0;
		}
	};
	return (
		<Box>
			{pathname !== '/v1/strk-rewards/' ?
				<Text
					key='borrow-details'
					as='span'
					position='relative'
					color='#B1B0B5'
					borderBottom='1px solid #B1B0B5'
					fontSize='14px'
					width='100%'
					display='flex'
					alignItems='center'
					justifyContent='center'
					fontWeight='400'
					cursor='pointer'
					_hover={{
						'::before': {
							content: '""',
							position: 'absolute',
							left: 0,
							bottom: '-0px',
							width: '0%',
							height: '0px',
							backgroundColor: '#B1B0B5',
						},
					}}
					onClick={() => {
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
					}}>
					Spend
				</Text>
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
					}}>
					Spend
				</Button>
			}
			{/* <Button onClick={onOpen}>Open Modal</Button> */}

			<Modal
				isOpen={isOpen}
				onClose={() => {
					const uqID = getUniqueId();
					let data: any = localStorage.getItem('transactionCheck');
					data = data ? JSON.parse(data) : [];
					////console.log(uqID, "data here", data);
					if (data && data.includes(uqID)) {
						data = data.filter((val: any) => val != uqID);
						localStorage.setItem(
							'transactionCheck',
							JSON.stringify(data)
						);
					}
					onClose();
					if (transactionStarted) {
						dispatch(setTransactionStartedAndModalClosed(true));
					}
					resetStates();
				}}
				isCentered
				scrollBehavior='inside'>
				<ModalOverlay
					bg='rgba(244, 242, 255, 0.5);'
					mt='3.8rem'
				/>
				<ModalContent
					mt='8rem'
					bg={'#02010F'}
					maxW='884px'>
					<ModalHeader
						// pt="1rem"
						// mt="1rem"
						fontSize='15px'
						fontWeight='600'
						fontStyle='normal'
						lineHeight='20px'
						color='white'
						my='auto'
						pos='relative'>
						<Text
							color='black'
							mb='1.5rem'></Text>
						<Box
							pos='absolute'
							top='10'
							left='8'
							display='flex'
							alignItems='center'
							gap='2'>
							Spend
							<Tooltip
								hasArrow
								placement='right'
								boxShadow='dark-lg'
								label='Add collateral, borrow, and spend on desired dapps and pools.'
								bg='#02010F'
								fontSize={'13px'}
								fontWeight={'400'}
								borderRadius={'lg'}
								padding={'2'}
								color='#F0F0F5'
								border='1px solid'
								borderColor='#23233D'
								arrowShadowColor='#2B2F35'>
								<Box>
									<InfoIconBig />
								</Box>
							</Tooltip>
						</Box>
					</ModalHeader>
					<ModalCloseButton
						color='white'
						mt='1.3rem'
						mr='1rem'
					/>
					{/* <ModalCloseButton mt="1rem" mr="1rem" color="white" /> */}
					{/* <ModalHeader>Borrow</ModalHeader> */}
					<ModalBody color={'#E6EDF3'}>
						<Box
							display={'flex'}
							justifyContent={'space-between'}
							fontSize={'sm'}
							mb={'2'}>
							{/* <Heading fontSize="md" fontWeight="medium" mt="0.9rem">
                Trade
              </Heading>
              <ModalCloseButton mt="1rem" mr="1rem" color="white" /> */}
						</Box>
						<Box
							display='flex'
							justifyContent='space-around'
							gap='5'
							//   alignItems="center"
						>
							<Box w='48%'>
								<Box
									display='flex'
									flexDirection='column'
									border='1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
									background='var(--surface-of-10, rgba(103, 109, 154, 0.10))'
									p='1rem'
									my='4'
									borderRadius='md'
									gap='3'>
									<Box
										display='flex'
										flexDirection='column'
										gap='1'>
										<Box display='flex'>
											<Text
												fontSize='xs'
												color='#676D9A'>
												Collateral Market
											</Text>
											<Tooltip
												hasArrow
												placement='right'
												boxShadow='dark-lg'
												label='Tokens held as security for borrowed funds.'
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
												// mt="12px"
											>
												<Box p='1'>
													<InfoIcon />
												</Box>
											</Tooltip>
										</Box>
										<Box
											display='flex'
											border='1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
											justifyContent='space-between'
											py='2'
											pl='3'
											pr='3'
											cursor='pointer'
											borderRadius='md'
											className='navbar'
											onClick={() => {
												if (transactionStarted) {
													return;
												} else {
													handleDropdownClick(
														'tradeModalCollateralMarketDropdown'
													);
												}
											}}
											as='button'>
											<Box
												display='flex'
												gap='1'>
												<Box p='1'>
													{getCoin(
														currentCollateralCoin
													)}
												</Box>
												<Text>
													{(
														currentCollateralCoin ==
														'BTC'
													) ?
														'w' +
														currentCollateralCoin
													:	currentCollateralCoin}
												</Text>
											</Box>
											<Box
												pt='1'
												className='navbar-button'>
												{(
													activeModal ==
													'tradeModalCollateralMarketDropdown'
												) ?
													<ArrowUp />
												:	<DropdownUp />}
											</Box>
											{/* {modalDropdowns.tradeModalCollateralMarketDropdown && (
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
                                  setCurrentCollateralCoin(coin);
                                  setwalletBalance(
                                    walletBalances[coin]?.statusBalanceOf ===
                                      "success"
                                      ? Number(
                                          BNtoNum(
                                            uint256.uint256ToBN(
                                              walletBalances[coin]
                                                ?.dataBalanceOf?.balance
                                            ),
                                            tokenDecimalsMap[coin?.name]
                                          )
                                        )
                                      : 0
                                  );
                                }}
                              >
                                {coin === currentCollateralCoin && (
                                  <Box
                                    w="3px"
                                    h="28px"
                                    bg="#0C6AD9"
                                    borderRightRadius="md"
                                  ></Box>
                                )}
                                <Box
                                  w="full"
                                  display="flex"
                                  py="5px"
                                  px={`${
                                    coin === currentCollateralCoin ? "1" : "5"
                                  }`}
                                  gap="1"
                                  bg={`${
                                    coin === currentCollateralCoin
                                      ? "#0C6AD9"
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
											{modalDropdowns.tradeModalCollateralMarketDropdown && (
												<Box
													w='full'
													left='0'
													border='1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
													bg='#03060B'
													py='2'
													className='dropdown-container'
													boxShadow='dark-lg'>
													{validRTokens &&
														validRTokens.length >
															0 &&
														validRTokens.map(
															(
																{
																	rToken: coin,
																	rTokenAmount:
																		amount,
																}: any,
																index: number
															) => {
																return (
																	<Box
																		key={
																			index
																		}
																		as='button'
																		w='full'
																		display='flex'
																		alignItems='center'
																		gap='1'
																		pr='2'
																		onMouseEnter={() => {
																			setcollateralHoverIndex(
																				index +
																					6
																			);
																		}}
																		onMouseLeave={() => {
																			setcollateralHoverIndex(
																				-1
																			);
																		}}
																		onClick={() => {
																			setCurrentCollateralCoin(
																				coin
																			);
																			setCollateralMarket(
																				coin
																			);
																			setTokenTypeSelected(
																				'rToken'
																			);
																			setcollateralHoverIndex(
																				-1
																			);
																			setRToken(
																				coin
																			);
																			setwalletBalance(
																				amount
																			);
																			// dispatch(setCoinSelectedSupplyModal(coin))
																		}}>
																		{((
																			collateralHoverIndex ===
																			-1
																		) ?
																			coin ===
																			currentCollateralCoin
																		:	collateralHoverIndex ===
																			index +
																				6) && (
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
																			pl={`${
																				(
																					(coin ===
																						currentCollateralCoin &&
																						collateralHoverIndex ===
																							-1) ||
																					collateralHoverIndex ===
																						index +
																							6
																				) ?
																					'1'
																				:	'5'
																			}`}
																			pr='6px'
																			gap='1'
																			justifyContent='space-between'
																			bg={`${
																				(
																					(coin ===
																						currentCollateralCoin &&
																						collateralHoverIndex ===
																							-1) ||
																					collateralHoverIndex ===
																						index +
																							6
																				) ?
																					'#4D59E8'
																				:	'inherit'
																			}`}
																			transition='ease .1s'
																			borderRadius='md'>
																			<Box display='flex'>
																				<Box p='1'>
																					{getCoin(
																						coin
																					)}
																				</Box>
																				<Text color='white'>
																					{
																						coin
																					}
																				</Text>
																			</Box>
																			<Box
																				fontSize='9px'
																				color='white'
																				mt='6px'
																				fontWeight='thin'>
																				rToken
																				Balance:{' '}
																				{(
																					validRTokens &&
																					validRTokens.length >
																						0
																				) ?
																					numberFormatter(
																						amount
																					)
																				:	' -'
																				}
																			</Box>
																		</Box>
																	</Box>
																);
															}
														)}
													{validRTokens &&
														validRTokens.length >
															0 && (
															<hr
																style={{
																	height: '1px',
																	borderWidth:
																		'0',
																	backgroundColor:
																		'#2B2F35',
																	width: '96%',
																	marginTop:
																		'7px',
																	// marginRight: "5px",
																	marginLeft:
																		'5px',
																}}
															/>
														)}
													{coins?.map(
														(
															coin: NativeToken,
															index: number
														) => {
															if (
																coin === 'DAI'
															) {
																return null;
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
																	onMouseEnter={() => {
																		setcollateralHoverIndex(
																			index
																		);
																	}}
																	onMouseLeave={() => {
																		setcollateralHoverIndex(
																			-1
																		);
																	}}
																	onClick={() => {
																		setCurrentCollateralCoin(
																			coin
																		);
																		setCollateralMarket(
																			coin
																		);
																		setRToken(
																			'rBTC'
																		);
																		setcollateralHoverIndex(
																			index
																		);
																		setTokenTypeSelected(
																			'Native'
																		);
																		setwalletBalance(
																			(
																				walletBalances[
																					coin
																				]
																					?.statusBalanceOf ===
																					'success'
																			) ?
																				parseAmount(
																					String(
																						uint256.uint256ToBN(
																							walletBalances[
																								coin
																							]
																								?.dataBalanceOf
																								?.balance
																						)
																					),
																					tokenDecimalsMap[
																						coin
																					]
																				)
																			:	0
																		);
																	}}>
																	{((
																		collateralHoverIndex ===
																		-1
																	) ?
																		coin ===
																		currentCollateralCoin
																	:	collateralHoverIndex ===
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
																		pl={`${
																			(
																				(coin ===
																					currentCollateralCoin &&
																					collateralHoverIndex ==
																						-1) ||
																				collateralHoverIndex ===
																					index
																			) ?
																				'1'
																			:	'5'
																		}`}
																		pr='6px'
																		gap='1'
																		bg={`${
																			(
																				(coin ===
																					currentCollateralCoin &&
																					collateralHoverIndex ==
																						-1) ||
																				collateralHoverIndex ===
																					index
																			) ?
																				'#4D59E8'
																			:	'inherit'
																		}`}
																		borderRadius='md'
																		transition='ease .1s'
																		justifyContent='space-between'>
																		<Box display='flex'>
																			<Box p='1'>
																				{getCoin(
																					coin
																				)}
																			</Box>
																			<Text color='white'>
																				{(
																					coin ==
																					'BTC'
																				) ?
																					'w' +
																					coin
																				:	coin
																				}
																			</Text>
																		</Box>
																		<Box
																			fontSize='9px'
																			color='white'
																			mt='6px'
																			fontWeight='thin'>
																			Wallet
																			Balance:{' '}
																			{(
																				walletBalances[
																					coin
																				]
																					?.dataBalanceOf
																					?.balance
																			) ?
																				numberFormatter(
																					parseAmount(
																						String(
																							uint256.uint256ToBN(
																								walletBalances[
																									coin
																								]
																									?.dataBalanceOf
																									?.balance
																							)
																						),
																						tokenDecimalsMap[
																							coin
																						]
																					)
																				)
																			:	'-'
																			}
																		</Box>
																	</Box>
																</Box>
															);
														}
													)}
												</Box>
											)}
										</Box>
									</Box>
									<Box
										display='flex'
										flexDirection='column'
										gap='1'>
										<Box display='flex'>
											<Text
												fontSize='xs'
												color='#676D9A'>
												Collateral Amount
											</Text>
											<Tooltip
												hasArrow
												placement='right'
												boxShadow='dark-lg'
												label='The amount of tokens used as security for borrowed funds.'
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
												<Box p='1'>
													<InfoIcon />
												</Box>
											</Tooltip>
										</Box>
										<Box
											width='100%'
											color='white'
											border={`${
												(
													inputCollateralAmount >
													walletBalance
												) ?
													'1px solid #CF222E'
												: inputCollateralAmount < 0 ?
													'1px solid #CF222E'
												: isNaN(inputCollateralAmount) ?
													'1px solid #CF222E'
												: (
													inputCollateralAmount > 0 &&
													process.env
														.NEXT_PUBLIC_NODE_ENV ==
														'mainnet' &&
													(inputCollateralAmount <
														minimumDepositAmount ||
														inputCollateralAmount >
															maximumDepositAmount)
												) ?
													'1px solid #CF222E'
												: (
													inputCollateralAmount > 0 &&
													inputCollateralAmount <=
														walletBalance
												) ?
													'1px solid #00D395'
												:	'1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30)) '
											}`}
											borderRadius='6px'
											display='flex'
											justifyContent='space-between'>
											<NumberInput
												border='0px'
												min={0}
												keepWithinRange={true}
												onChange={handleChange}
												value={
													inputCollateralAmount ?
														inputCollateralAmount
													:	''
												}
												step={parseFloat(
													`${inputCollateralAmount <= 99999 ? 0.1 : 0}`
												)}
												isDisabled={
													transactionStarted == true
												}
												_disabled={{
													cursor: 'pointer',
												}}>
												<NumberInputField
													placeholder={
														(
															process.env
																.NEXT_PUBLIC_NODE_ENV ==
															'testnet'
														) ?
															`0.01536 ${currentCollateralCoin}`
														:	`min ${
																(
																	minimumDepositAmount ==
																	null
																) ?
																	0
																:	minimumDepositAmount
															} ${currentCollateralCoin}`
													}
													color={`${
														(
															inputCollateralAmount >
															walletBalance
														) ?
															'#CF222E'
														: (
															isNaN(
																inputCollateralAmount
															)
														) ?
															'#CF222E'
														: (
															inputCollateralAmount <
															0
														) ?
															'#CF222E'
														: (
															((process.env
																.NEXT_PUBLIC_NODE_ENV ==
																'mainnet' &&
																inputCollateralAmount <
																	minimumDepositAmount) ||
																(process.env
																	.NEXT_PUBLIC_NODE_ENV ==
																	'mainnet' &&
																	inputCollateralAmount >
																		maximumDepositAmount)) &&
															inputCollateralAmount >
																0
														) ?
															'#CF222E'
														: (
															inputCollateralAmount ==
															0
														) ?
															'white'
														:	'#00D395'
													}`}
													_disabled={{
														color: '#00D395',
													}}
													border='0px'
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
												variant='ghost'
												color={`${
													(
														inputCollateralAmount >
														walletBalance
													) ?
														'#CF222E'
													: (
														isNaN(
															inputCollateralAmount
														)
													) ?
														'#CF222E'
													: (
														(inputCollateralAmount <
															minimumDepositAmount ||
															inputCollateralAmount >
																maximumDepositAmount) &&
														process.env
															.NEXT_PUBLIC_NODE_ENV ==
															'mainnet' &&
														inputCollateralAmount >
															0
													) ?
														'#CF222E'
													: (
														inputCollateralAmount <
														0
													) ?
														'#CF222E'
													: (
														inputCollateralAmount ==
														0
													) ?
														'#4D59E8'
													:	'#00D395'
												}`}
												_hover={{
													bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
												}}
												onClick={() => {
													setinputCollateralAmount(
														walletBalance
													);
													setCollateralAmount(
														walletBalance
													);
													setRTokenAmount(
														walletBalance
													);
													setSliderValue(100);
													dispatch(
														setInputTradeModalCollateralAmount(
															walletBalance
														)
													);
												}}
												isDisabled={
													transactionStarted == true
												}
												_disabled={{
													cursor: 'pointer',
												}}>
												MAX
											</Button>
										</Box>
										{(
											inputCollateralAmount >
												walletBalance ||
											inputCollateralAmount < 0 ||
											((inputCollateralAmount <
												minimumDepositAmount ||
												inputCollateralAmount >
													maximumDepositAmount) &&
												process.env
													.NEXT_PUBLIC_NODE_ENV ==
													'mainnet' &&
												inputCollateralAmount > 0) ||
											isNaN(inputCollateralAmount)
										) ?
											<Text
												display='flex'
												justifyContent='space-between'
												color='#E6EDF3'
												mt='0.4rem'
												fontSize='12px'
												fontWeight='500'
												fontStyle='normal'
												fontFamily='Inter'>
												<Text
													color='#CF222E'
													display='flex'>
													<Text mt='0.2rem'>
														<SmallErrorIcon />{' '}
													</Text>
													<Text ml='0.3rem'>
														{(
															inputCollateralAmount >
															walletBalance
														) ?
															'Amount exceeds balance'
														: (
															process.env
																.NEXT_PUBLIC_NODE_ENV ==
																'mainnet' &&
															inputCollateralAmount <
																minimumDepositAmount
														) ?
															`less than min amount`
														: (
															process.env
																.NEXT_PUBLIC_NODE_ENV ==
																'mainnet' &&
															inputCollateralAmount >
																maximumDepositAmount
														) ?
															'more than max amount'
															//do max 1209
														:	'Invalid Input'}
													</Text>
												</Text>
												<Text
													color='#C7CBF6'
													display='flex'
													justifyContent='flex-end'>
													Wallet Balance:{' '}
													{(
														walletBalance
															?.toFixed(5)
															.replace(
																/\.?0+$/,
																''
															).length > 5
													) ?
														numberFormatter(
															walletBalance
														)
													:	numberFormatter(
															walletBalance
														)
													}
													<Text
														color='#676D9A'
														ml='0.2rem'>
														{` ${currentCollateralCoin}`}
													</Text>
												</Text>
											</Text>
										:	<Text
												color='#C7CBF6'
												display='flex'
												justifyContent='flex-end'
												mt='0.4rem'
												fontSize='12px'
												fontWeight='500'
												fontStyle='normal'
												fontFamily='Inter'>
												Wallet Balance:{' '}
												{(
													walletBalance
														?.toFixed(5)
														.replace(/\.?0+$/, '')
														.length > 5
												) ?
													numberFormatter(
														walletBalance
													)
												:	numberFormatter(walletBalance)}
												<Text
													color='#676D9A'
													ml='0.2rem'>
													{` ${currentCollateralCoin}`}
												</Text>
											</Text>
										}
										<Box
											pt={5}
											pb={2}
											mt='0.4rem'>
											<Slider
												aria-label='slider-ex-6'
												defaultValue={sliderValue}
												value={sliderValue}
												onChange={(val) => {
													setSliderValue(val);
													if (val == 100) {
														setinputCollateralAmount(
															walletBalance
														);
														setCollateralAmount(
															walletBalance
														);
														setRTokenAmount(
															walletBalance
														);
													} else {
														var ans =
															(val / 100) *
															walletBalance;
														if (ans < 10) {
															dispatch(
																setInputTradeModalCollateralAmount(
																	parseFloat(
																		ans.toFixed(
																			7
																		)
																	)
																)
															);
															setinputCollateralAmount(
																parseFloat(
																	ans.toFixed(
																		7
																	)
																)
															);
															setCollateralAmount(
																parseFloat(
																	ans.toFixed(
																		7
																	)
																)
															);
															setRTokenAmount(
																parseFloat(
																	ans.toFixed(
																		7
																	)
																)
															);
														} else {
															ans =
																Math.round(
																	ans * 100
																) / 100;
															dispatch(
																setInputTradeModalCollateralAmount(
																	ans
																)
															);
															setinputCollateralAmount(
																ans
															);
															setCollateralAmount(
																ans
															);
															setRTokenAmount(
																ans
															);
														}
													}
												}}
												isDisabled={
													transactionStarted == true
												}
												_disabled={{
													cursor: 'pointer',
												}}
												focusThumbOnChange={false}>
												<SliderMark
													value={0}
													mt='-1.5'
													ml='-1.5'
													fontSize='sm'
													zIndex='1'>
													{sliderValue >= 0 ?
														<SliderPointerWhite />
													:	<SliderPointer />}
												</SliderMark>
												<SliderMark
													value={25}
													mt='-1.5'
													ml='-1.5'
													fontSize='sm'
													zIndex='1'>
													{sliderValue >= 25 ?
														<SliderPointerWhite />
													:	<SliderPointer />}
												</SliderMark>
												<SliderMark
													value={50}
													mt='-1.5'
													ml='-1.5'
													fontSize='sm'
													zIndex='1'>
													{sliderValue >= 50 ?
														<SliderPointerWhite />
													:	<SliderPointer />}
												</SliderMark>
												<SliderMark
													value={75}
													mt='-1.5'
													ml='-1.5'
													fontSize='sm'
													zIndex='1'>
													{sliderValue >= 75 ?
														<SliderPointerWhite />
													:	<SliderPointer />}
												</SliderMark>
												<SliderMark
													value={100}
													mt='-1.5'
													ml='-1.5'
													fontSize='sm'
													zIndex='1'>
													{sliderValue == 100 ?
														<SliderPointerWhite />
													:	<SliderPointer />}
												</SliderMark>
												<SliderMark
													value={sliderValue}
													textAlign='center'
													// bg='blue.500'
													color='white'
													mt='-8'
													ml={
														sliderValue !== 100 ?
															'-5'
														:	'-6'
													}
													w='12'
													fontSize='12px'
													fontWeight='400'
													lineHeight='20px'
													letterSpacing='0.25px'>
													{sliderValue}%
												</SliderMark>
												<SliderTrack bg='#3E415C'>
													<SliderFilledTrack
														bg='white'
														w={`${sliderValue}`}
														_disabled={{
															bg: 'white',
														}}
													/>
												</SliderTrack>
												<SliderThumb />
											</Slider>
										</Box>
									</Box>
								</Box>

								<Box
									display='flex'
									flexDirection='column'
									border='1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
									background='var(--surface-of-10, rgba(103, 109, 154, 0.10))'
									p='1rem'
									my='4'
									borderRadius='md'
									gap='3'>
									<Box
										display='flex'
										flexDirection='column'
										gap='1'>
										<Box display='flex'>
											<Text
												fontSize='xs'
												color='#676D9A'>
												Borrow Market
											</Text>
											<Tooltip
												hasArrow
												placement='right'
												boxShadow='dark-lg'
												label='The token borrowed from the protocol.'
												bg='#02010F'
												fontSize={'13px'}
												fontWeight={'400'}
												borderRadius={'lg'}
												padding={'2'}
												color='#F0F0F5'
												border='1px solid'
												borderColor='#23233D'
												arrowShadowColor='#2B2F35'
												maxW='242px'>
												<Box p='1'>
													<InfoIcon />
												</Box>
											</Tooltip>
										</Box>
										<Box
											display='flex'
											border='1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
											justifyContent='space-between'
											py='2'
											pl='2'
											pr='3'
											borderRadius='md'
											className='navbar'
											cursor='pointer'
											onClick={() => {
												if (transactionStarted) {
													return;
												} else {
													handleDropdownClick(
														'tradeModalBorrowMarketDropdown'
													);
												}
											}}
											as='button'>
											<Box
												display='flex'
												gap='1'>
												<Box p='1'>
													{getCoin(currentBorrowCoin)}
												</Box>
												<Text>
													{(
														currentBorrowCoin ==
														'BTC'
													) ?
														'w' + currentBorrowCoin
													:	currentBorrowCoin}
												</Text>
											</Box>
											<Box
												pt='1'
												className='navbar-button'>
												{(
													activeModal ==
													'tradeModalBorrowMarketDropdown'
												) ?
													<ArrowUp />
												:	<DropdownUp />}
											</Box>
											{/* {modalDropdowns.tradeModalBorrowMarketDropdown && (
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
                                  setCurrentBorrowCoin(coin);
                                }}
                              >
                                {coin === currentBorrowCoin && (
                                  <Box
                                    w="3px"
                                    h="28px"
                                    bg="#0C6AD9"
                                    borderRightRadius="md"
                                  ></Box>
                                )}
                                <Box
                                  w="full"
                                  display="flex"
                                  py="5px"
                                  px={`${
                                    coin === currentBorrowCoin ? "1" : "5"
                                  }`}
                                  gap="1"
                                  bg={`${
                                    coin === currentBorrowCoin
                                      ? "#0C6AD9"
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
											{modalDropdowns.tradeModalBorrowMarketDropdown && (
												<Box
													w='full'
													left='0'
													bg='#03060B'
													border='1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
													py='2'
													className='dropdown-container'
													boxShadow='dark-lg'>
													{coins?.map(
														(
															coin: NativeToken,
															index: number
														) => {
															if (
																coin === 'DAI'
															) {
																return null;
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
																	onMouseEnter={() => {
																		setborrowHoverIndex(
																			index
																		);
																	}}
																	onMouseLeave={() => {
																		setborrowHoverIndex(
																			-1
																		);
																	}}
																	onClick={() => {
																		setCurrentBorrowCoin(
																			coin
																		);
																		setCurrentAvailableReserves(
																			protocolStats?.[
																				index
																			]
																				?.availableReserves *
																				0.895
																		);
																		setCurrentBorrowAPR(
																			coinIndex.find(
																				(
																					curr: any
																				) =>
																					curr?.token ===
																					coin
																			)
																				?.idx
																		);
																		setborrowHoverIndex(
																			-1
																		);
																		setLoanMarket(
																			coin
																		);
																		// setMarket(coin);
																		// setMarket(coin);
																	}}>
																	{((
																		borrowHoverIndex ===
																		-1
																	) ?
																		coin ===
																		currentBorrowCoin
																	:	borrowHoverIndex ===
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
																		pl={`${
																			(
																				(coin ===
																					currentBorrowCoin &&
																					borrowHoverIndex ===
																						-1) ||
																				borrowHoverIndex ===
																					index
																			) ?
																				'1'
																			:	'5'
																		}`}
																		pr='6px'
																		gap='1'
																		bg={`${
																			(
																				(coin ===
																					currentBorrowCoin &&
																					borrowHoverIndex ===
																						-1) ||
																				borrowHoverIndex ===
																					index
																			) ?
																				'#4D59E8'
																			:	'inherit'
																		}`}
																		transition='ease .1s'
																		borderRadius='md'
																		justifyContent='space-between'>
																		<Box display='flex'>
																			<Box p='1'>
																				{getCoin(
																					coin
																				)}
																			</Box>
																			<Text color='white'>
																				{(
																					coin ==
																					'BTC'
																				) ?
																					'w' +
																					coin
																				:	coin
																				}
																			</Text>
																		</Box>
																		<Box
																			fontSize='9px'
																			color='white'
																			mt='6px'
																			fontWeight='thin'
																			display='flex'>
																			Available
																			reserves:{' '}
																			{(protocolStats?.[
																				index
																			]
																				?.availableReserves &&
																				numberFormatter(
																					protocolStats?.[
																						index
																					]
																						?.availableReserves *
																						0.895
																				)) || (
																				<Skeleton
																					width='3rem'
																					height='1rem'
																					startColor='#1E212F'
																					endColor='#03060B'
																					borderRadius='6px'
																					ml={
																						2
																					}
																				/>
																			)}
																		</Box>
																	</Box>
																</Box>
															);
														}
													)}
												</Box>
											)}
										</Box>
									</Box>
									<Box
										display='flex'
										flexDirection='column'
										gap='1'>
										<Box display='flex'>
											<Text
												fontSize='xs'
												color='#676D9A'>
												Borrow Amount
											</Text>
											<Tooltip
												hasArrow
												placement='right'
												boxShadow='dark-lg'
												label='The quantity of tokens you want to borrow from the protocol.'
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
												<Box p='1'>
													<InfoIcon />
												</Box>
											</Tooltip>
										</Box>
										<Box
											width='100%'
											color='white'
											border={`${
												(
													inputCollateralAmountUSD &&
													inputBorrowAmountUSD >
														4.98 *
															inputCollateralAmountUSD
												) ?
													'1px solid #CF222E'
												: (
													inputBorrowAmount < 0 ||
													inputBorrowAmount >
														currentAvailableReserves
												) ?
													'1px solid #CF222E'
												: (
													process.env
														.NEXT_PUBLIC_NODE_ENV ==
														'mainnet' &&
													inputBorrowAmount <
														minimumLoanAmount &&
													inputBorrowAmount > 0
												) ?
													'1px solid #CF222E'
												: (
													process.env
														.NEXT_PUBLIC_NODE_ENV ==
														'mainnet' &&
													inputBorrowAmount >
														maximumLoanAmount
												) ?
													'1px solid #CF222E'
												: isNaN(inputBorrowAmount) ?
													'1px solid #CF222E'
												: inputBorrowAmount > 0 ?
													'1px solid #00D395'
												:	'1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30)) '
											}`}
											borderRadius='6px'
											display='flex'
											justifyContent='space-between'>
											<NumberInput
												border='0px'
												min={0}
												keepWithinRange={true}
												onChange={handleBorrowChange}
												value={
													inputBorrowAmount ?
														inputBorrowAmount
													:	''
												}
												step={parseFloat(
													`${inputBorrowAmount <= 99999 ? 0.1 : 0}`
												)}
												isDisabled={
													transactionStarted ==
														true ||
													protocolStats.length === 0
												}
												_disabled={{
													cursor: 'pointer',
												}}>
												<NumberInputField
													placeholder={
														(
															process.env
																.NEXT_PUBLIC_NODE_ENV ==
															'testnet'
														) ?
															`0.01536 ${currentBorrowCoin}`
														:	`min ${
																(
																	minimumLoanAmount ==
																	null
																) ?
																	0
																:	minimumLoanAmount
															} ${currentBorrowCoin}`
													}
													color={`${
														(
															inputCollateralAmountUSD &&
															inputBorrowAmountUSD >
																4.98 *
																	inputCollateralAmountUSD
														) ?
															'#CF222E'
														: (
															isNaN(
																inputBorrowAmount
															)
														) ?
															'#CF222E'
														: (
															inputBorrowAmount <
																0 ||
															inputBorrowAmount >
																currentAvailableReserves
														) ?
															'#CF222E'
														: (
															process.env
																.NEXT_PUBLIC_NODE_ENV ==
																'mainnet' &&
															inputBorrowAmount <
																minimumLoanAmount &&
															inputBorrowAmount >
																0
														) ?
															'#CF222E'
														: (
															process.env
																.NEXT_PUBLIC_NODE_ENV ==
																'mainnet' &&
															inputBorrowAmount >
																maximumLoanAmount
														) ?
															'#CF222E'
														: (
															inputBorrowAmount ==
															0
														) ?
															'white'
														:	'#00D395'
													}`}
													border='0px'
													_disabled={{
														color: '#00D395',
													}}
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
												variant='ghost'
												color={`${
													(
														inputCollateralAmountUSD &&
														inputBorrowAmountUSD >
															4.98 *
																inputCollateralAmountUSD
													) ?
														'#CF222E'
													: isNaN(inputBorrowAmount) ?
														'#CF222E'
													: (
														inputBorrowAmount < 0 ||
														inputBorrowAmount >
															currentAvailableReserves
													) ?
														'#CF222E'
													: (
														process.env
															.NEXT_PUBLIC_NODE_ENV ==
															'mainnet' &&
														inputBorrowAmount <
															minimumLoanAmount &&
														inputBorrowAmount > 0
													) ?
														'#CF222E'
													: (
														process.env
															.NEXT_PUBLIC_NODE_ENV ==
															'mainnet' &&
														inputBorrowAmount >
															maximumLoanAmount
													) ?
														'#CF222E'
													: inputBorrowAmount == 0 ?
														'#4D59E8'
													:	'#00D395'
												}`}
												_hover={{
													bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
												}}
												onClick={() => {
													if (
														inputCollateralAmountUSD >
														0
													) {
														if (
															(4.98 *
																inputCollateralAmountUSD) /
																oraclePrices.find(
																	(
																		curr: any
																	) =>
																		curr.name ===
																		currentBorrowCoin
																)?.price >
															currentAvailableReserves
														) {
															setinputBorrowAmount(
																currentAvailableReserves
															);
															setLoanAmount(
																currentAvailableReserves
															);
															setsliderValue2(
																100
															);
														} else {
															setinputBorrowAmount(
																(4.98 *
																	inputCollateralAmountUSD) /
																	oraclePrices.find(
																		(
																			curr: any
																		) =>
																			curr.name ===
																			currentBorrowCoin
																	)?.price
															);
															setLoanAmount(
																(4.98 *
																	inputCollateralAmountUSD) /
																	oraclePrices.find(
																		(
																			curr: any
																		) =>
																			curr.name ===
																			currentBorrowCoin
																	)?.price
															);
															setsliderValue2(
																100
															);
														}
													} else {
														setinputBorrowAmount(
															currentAvailableReserves
														);
														setLoanAmount(
															currentAvailableReserves
														);
														setsliderValue2(100);
													}
													dispatch(
														setInputTradeModalBorrowAmount(
															currentAvailableReserves
														)
													);
												}}
												isDisabled={
													transactionStarted ==
														true ||
													protocolStats.length === 0
												}
												_disabled={{
													cursor: 'pointer',
												}}>
												MAX
											</Button>
										</Box>
										{(
											inputBorrowAmount >
												currentAvailableReserves ||
											(inputBorrowAmount > 0 &&
												process.env
													.NEXT_PUBLIC_NODE_ENV ==
													'mainnet' &&
												inputBorrowAmount <
													minimumLoanAmount) ||
											inputBorrowAmount >
												maximumLoanAmount ||
											(inputBorrowAmount > 0 &&
												inputCollateralAmountUSD &&
												inputBorrowAmountUSD >
													4.98 *
														inputCollateralAmountUSD) ||
											isNaN(inputBorrowAmount)
										) ?
											<Text
												display='flex'
												justifyContent='space-between'
												color='#E6EDF3'
												mt='0.4rem'
												fontSize='12px'
												fontWeight='500'
												fontStyle='normal'
												fontFamily='Inter'
												whiteSpace='nowrap'>
												<Text
													color='#CF222E'
													display='flex'>
													<Text mt='0.2rem'>
														<SmallErrorIcon />{' '}
													</Text>
													<Text ml='0.3rem'>
														{(
															inputBorrowAmount >
															currentAvailableReserves
														) ?
															'Amount exceeds balance'
														: (
															process.env
																.NEXT_PUBLIC_NODE_ENV ==
																'mainnet' &&
															inputBorrowAmount <
																minimumLoanAmount
														) ?
															'Less than min amount'
														: (
															process.env
																.NEXT_PUBLIC_NODE_ENV ==
																'mainnet' &&
															inputBorrowAmount >
																maximumLoanAmount
														) ?
															'More than max amount'
														: (
															inputBorrowAmountUSD >
															4.98 *
																inputCollateralAmountUSD
														) ?
															'Debt higher than permitted'
														:	'Invalid Input'}
													</Text>
												</Text>
												<Text
													color='#C7CBF6'
													display='flex'
													justifyContent='flex-end'>
													Available Reserves:{' '}
													{numberFormatter(
														currentAvailableReserves
													)}
													<Text
														color='#676D9A'
														ml='0.2rem'>
														{` ${currentBorrowCoin}`}
													</Text>
												</Text>
											</Text>
										:	<Text
												color='#C7CBF6'
												display='flex'
												justifyContent='flex-end'
												mt='0.4rem'
												fontSize='12px'
												fontWeight='500'
												fontStyle='normal'
												fontFamily='Inter'>
												Available reserves:{' '}
												{(
													currentAvailableReserves !=
													null
												) ?
													numberFormatter(
														currentAvailableReserves
													)
												:	<Skeleton
														width='4rem'
														height='.85rem'
														startColor='#2B2F35'
														endColor='#101216'
														borderRadius='4px'
														m={1}
													/>
												}
												<Text
													color='#676D9A'
													ml='0.2rem'>
													{` ${currentBorrowCoin}`}
												</Text>
											</Text>
										}
										<Box
											pt={5}
											pb={2}
											mt='0.8rem'>
											<Slider
												aria-label='slider-ex-6'
												defaultValue={sliderValue2}
												value={sliderValue2}
												onChange={(val) => {
													setsliderValue2(val);
													if (val == 100) {
														if (
															inputCollateralAmountUSD >
															0
														) {
															setinputBorrowAmount(
																(4.98 *
																	inputCollateralAmountUSD) /
																	oraclePrices.find(
																		(
																			curr: any
																		) =>
																			curr.name ===
																			currentBorrowCoin
																	)?.price
															);
															setLoanAmount(
																(4.98 *
																	inputCollateralAmountUSD) /
																	oraclePrices.find(
																		(
																			curr: any
																		) =>
																			curr.name ===
																			currentBorrowCoin
																	)?.price
															);
														} else {
															setinputBorrowAmount(
																currentAvailableReserves
															);
															setLoanAmount(
																currentAvailableReserves
															);
														}
													} else {
														if (
															inputCollateralAmountUSD >
															0
														) {
															var ans =
																(val / 100) *
																((4.98 *
																	inputCollateralAmountUSD) /
																	oraclePrices.find(
																		(
																			curr: any
																		) =>
																			curr.name ===
																			currentBorrowCoin
																	)?.price);
														} else {
															var ans =
																(val / 100) *
																currentAvailableReserves;
														}
														if (ans < 10) {
															dispatch(
																setInputTradeModalBorrowAmount(
																	parseFloat(
																		ans.toFixed(
																			7
																		)
																	)
																)
															);
															setinputBorrowAmount(
																parseFloat(
																	ans.toFixed(
																		7
																	)
																)
															);
															setLoanAmount(
																parseFloat(
																	ans.toFixed(
																		7
																	)
																)
															);
														} else {
															ans =
																Math.round(
																	ans * 100
																) / 100;
															dispatch(
																setInputTradeModalBorrowAmount(
																	ans
																)
															);
															setinputBorrowAmount(
																ans
															);
															setLoanAmount(ans);
														}
													}
												}}
												isDisabled={
													transactionStarted ==
														true ||
													protocolStats.length === 0
												}
												_disabled={{
													cursor: 'pointer',
												}}
												focusThumbOnChange={false}>
												<SliderMark
													value={0}
													mt='-1.5'
													ml='-1.5'
													fontSize='sm'
													zIndex='1'>
													{sliderValue2 >= 0 ?
														<SliderPointerWhite />
													:	<SliderPointer />}
												</SliderMark>
												<SliderMark
													value={25}
													mt='-1.5'
													ml='-1.5'
													fontSize='sm'
													zIndex='1'>
													{sliderValue2 >= 25 ?
														<SliderPointerWhite />
													:	<SliderPointer />}
												</SliderMark>
												<SliderMark
													value={50}
													mt='-1.5'
													ml='-1.5'
													fontSize='sm'
													zIndex='1'>
													{sliderValue2 >= 50 ?
														<SliderPointerWhite />
													:	<SliderPointer />}
												</SliderMark>
												<SliderMark
													value={75}
													mt='-1.5'
													ml='-1.5'
													fontSize='sm'
													zIndex='1'>
													{sliderValue2 >= 75 ?
														<SliderPointerWhite />
													:	<SliderPointer />}
												</SliderMark>
												<SliderMark
													value={100}
													mt='-1.5'
													ml='-1.5'
													fontSize='sm'
													zIndex='1'>
													{sliderValue2 == 100 ?
														<SliderPointerWhite />
													:	<SliderPointer />}
												</SliderMark>
												<SliderMark
													value={sliderValue2}
													textAlign='center'
													// bg='blue.500'
													color='white'
													mt='-8'
													ml={
														sliderValue2 !== 100 ?
															'-5'
														:	'-6'
													}
													w='12'
													fontSize='12px'
													fontWeight='400'
													lineHeight='20px'
													letterSpacing='0.25px'>
													{sliderValue2}%
												</SliderMark>
												<SliderTrack bg='#3E415C'>
													<SliderFilledTrack
														bg='white'
														w={`${sliderValue2}`}
														_disabled={{
															bg: 'white',
														}}
													/>
												</SliderTrack>
												<SliderThumb />
											</Slider>
										</Box>
									</Box>
								</Box>
							</Box>

							<Box w='48%'>
								<Box
									display='flex'
									flexDir='column'
									p='3'
									gap='1'>
									<Box>
										<RadioGroup
											onChange={setRadioValue}
											value={radioValue}>
											<Stack
												spacing={4}
												direction='row'>
												<Radio
													// variant="primary"
													value='1'
													// border

													borderColor='#2B2F35'
													colorScheme='customPurple'
													// bg="black"
													_checked={{
														bg: 'black',
														color: 'white',
														borderWidth: '5px',
														borderColor: '#4D59E8',
													}}
													bg='#676D9A1A'
													_focus={{
														boxShadow: 'none',
														outline: '0',
													}}
													// onClick={() => {
													//   setMethod("ADD_LIQUIDITY");
													// }}
												>
													Liquidity provisioning
												</Radio>
												<Radio
													fontSize='sm'
													value='2'
													// bg="#2B2F35"
													borderColor='#2B2F35'
													colorScheme='customPurple'
													// bg="black"
													_checked={{
														bg: 'black',
														color: 'white',
														borderWidth: '5px',
														borderColor: '#4D59E8',
													}}
													bg='#676D9A1A'
													_focus={{
														boxShadow: 'none',
														outline: '0',
													}}
													// onClick={() => {
													//   setMethod("SWAP");
													// }}
												>
													{(
														process.env
															.NEXT_PUBLIC_NODE_ENV ==
														'testnet'
													) ?
														'Trade'
													:	'Swap'}
												</Radio>
											</Stack>
										</RadioGroup>
									</Box>
								</Box>
								<Box
									display='flex'
									flexDirection='column'
									border='1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
									background='var(--surface-of-10, rgba(103, 109, 154, 0.10))'
									p='3'
									// my="4"
									borderRadius='md'
									gap='3'>
									<Box
										display='flex'
										flexDirection='column'
										gap='1'>
										<Box display='flex'>
											<Text
												fontSize='xs'
												color='#676D9A'>
												Select Dapp
											</Text>
											<Tooltip
												hasArrow
												placement='right'
												boxShadow='dark-lg'
												label='Choosing a Dapp to utilize the borrow tokens on the protocol.'
												bg='#02010F'
												fontSize={'13px'}
												fontWeight={'400'}
												borderRadius={'lg'}
												padding={'2'}
												color='#F0F0F5'
												border='1px solid'
												borderColor='#23233D'
												arrowShadowColor='#2B2F35'
												maxW='242px'
												// mt="5px"
											>
												<Box p='1'>
													<InfoIcon />
												</Box>
											</Tooltip>
										</Box>
										<Box
											display='flex'
											border='1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
											justifyContent='space-between'
											py='2'
											pl='3'
											pr='3'
											borderRadius='md'
											className='navbar'
											onClick={() => {
												if (transactionStarted) {
													return;
												} else {
													handleDropdownClick(
														'yourBorrowDappDropdown'
													);
												}
											}}
											as='button'>
											<Box
												display='flex'
												gap='1'>
												{(
													currentDapp !=
													'Select a dapp'
												) ?
													<Box p='1'>
														{getCoin(currentDapp)}
													</Box>
												:	''}
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
											<Box
												pt='1'
												className='navbar-button'>
												{(
													activeModal ==
													'yourBorrowDappDropdown'
												) ?
													<ArrowUp />
												:	<DropdownUp />}
											</Box>
											{modalDropdowns.yourBorrowDappDropdown && (
												<Box
													w='full'
													left='0'
													bg='#03060B'
													border='1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
													py='2'
													className='dropdown-container'
													boxShadow='dark-lg'>
													{dapps.map(
														(dapp, index) => {
															return (
																<Button
																	// as="button"
																	key={index}
																	w='full'
																	m='0'
																	pl='0'
																	display='flex'
																	alignItems='center'
																	gap='1'
																	pr='2'
																	bg='inherit'
																	onMouseEnter={() => {
																		setdappHoverIndex(
																			index
																		);
																	}}
																	onMouseLeave={() => {
																		setdappHoverIndex(
																			-1
																		);
																	}}
																	onClick={() => {
																		setCurrentDapp(
																			dapp.name
																		);
																		setdappHoverIndex(
																			-1
																		);
																		if (
																			dapp.name ===
																			'Jediswap'
																		) {
																			setL3App(
																				'JEDI_SWAP'
																			);
																		} else if (
																			dapp.name ===
																			'mySwap'
																		) {
																			setL3App(
																				'MY_SWAP'
																			);
																		}
																	}}
																	fontSize='sm'
																	_hover={{
																		background:
																			'inherit',
																	}}
																	_disabled={{
																		cursor: 'pointer',
																	}}
																	isDisabled={
																		dapp.status ===
																		'disable'
																	}>
																	{((
																		dappHoverIndex ===
																		-1
																	) ?
																		dapp.name ===
																		currentDapp
																	:	dappHoverIndex ===
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
																				(dapp.name ===
																					currentDapp &&
																					dappHoverIndex ===
																						-1) ||
																				dappHoverIndex ===
																					index
																			) ?
																				'1'
																			:	'5'
																		}`}
																		gap='1'
																		bg={`${
																			(
																				(dapp.name ===
																					currentDapp &&
																					dappHoverIndex ===
																						-1) ||
																				dappHoverIndex ===
																					index
																			) ?
																				'#4D59E8'
																			:	'inherit'
																		}`}
																		borderRadius='md'>
																		<Box p='1'>
																			{getCoin(
																				dapp.name
																			)}
																		</Box>
																		<Text
																			pt='1'
																			color='white'>
																			{
																				dapp.name
																			}
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
																	{dapp.status ===
																		'disable' && (
																		<Text
																			pt='1'
																			pr='3'
																			fontSize='.6rem'
																			fontWeight='thin'>
																			paused
																		</Text>
																	)}
																</Button>
															);
														}
													)}
												</Box>
											)}
										</Box>
									</Box>
									<Box
										display='flex'
										flexDirection='column'
										gap='1'>
										<Box display='flex'>
											<Text
												fontSize='xs'
												color='#676D9A'>
												Select Pool
											</Text>
											<Tooltip
												hasArrow
												placement='right'
												boxShadow='dark-lg'
												label='Choose a specific liquidity pool within the protocol.'
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
												<Box p='1'>
													<InfoIcon />
												</Box>
											</Tooltip>
										</Box>
										<Box
											display='flex'
											border='1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
											justifyContent='space-between'
											py='2'
											pl='3'
											pr='3'
											borderRadius='md'
											className='navbar'
											onClick={() => {
												if (transactionStarted) {
													return;
												} else {
													handleDropdownClick(
														'yourBorrowPoolDropdown'
													);
												}
											}}
											as='button'>
											<Box
												display='flex'
												gap='1'>
												{(
													getCoin(
														radioValue === '1' ?
															currentPool
														:	currentPoolCoin
													)
												) ?
													<Box p='1'>
														{getCoin(
															radioValue === '1' ?
																currentPool
															:	currentPoolCoin
														)}
													</Box>
												:	''}

												<Text>
													{radioValue === '1' ?
														(
															currentPool.split(
																'/'
															)[0] == 'BTC' &&
															currentPool.split(
																'/'
															)[1] == 'BTC'
														) ?
															'w' +
															currentPool.split(
																'/'
															)[0] +
															'/w' +
															currentPool.split(
																'/'
															)[1]
														: (
															currentPool.split(
																'/'
															)[0] == 'BTC'
														) ?
															'w' +
															currentPool.split(
																'/'
															)[0] +
															'/' +
															currentPool.split(
																'/'
															)[1]
														: (
															currentPool.split(
																'/'
															)[1] == 'BTC'
														) ?
															currentPool.split(
																'/'
															)[0] +
															'/w' +
															currentPool.split(
																'/'
															)[1]
														:	currentPool
													: currentPoolCoin == 'BTC' ?
														'w' + currentPoolCoin
													:	currentPoolCoin}
												</Text>
											</Box>
											<Box
												pt='1'
												className='navbar-button'>
												{(
													activeModal ==
													'yourBorrowPoolDropdown'
												) ?
													<ArrowUp />
												:	<DropdownUp />}
											</Box>
											{(
												modalDropdowns.yourBorrowPoolDropdown &&
												radioValue === '1'
											) ?
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
													{pools.map(
														(pool, index) => {
															const matchingPair =

																	(
																		currentDapp ==
																		'Jediswap'
																	) ?
																		poolsPairs.find(
																			(
																				pair: any
																			) =>
																				pair.keyvalue ===
																				pool
																		)
																	:	mySwapPoolPairs.find(
																			(
																				pair: any
																			) =>
																				pair.keyvalue ===
																				pool
																		);

															if (
																!matchingPair &&
																currentDapp !=
																	'Select a dapp'
															) {
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
																	onMouseEnter={() => {
																		setpoolHoverIndex(
																			index
																		);
																	}}
																	onMouseLeave={() => {
																		setpoolHoverIndex(
																			-1
																		);
																	}}
																	onClick={() => {
																		setCurrentPool(
																			pool
																		);
																		setpoolHoverIndex(
																			-1
																		);
																		//set type for pools as native token[]
																		//@ts-ignore
																		setToMarketLiqA(
																			pool.split(
																				'/'
																			)[0] as NativeToken
																		);
																		//@ts-ignore
																		setToMarketLiqB(
																			pool.split(
																				'/'
																			)[1] as NativeToken
																		);
																	}}
																	// borderBottom={
																	//   index == 2 && currentDapp == 'Jediswap'
																	//     ? '1px solid #30363D'
																	//     : ''
																	// }
																>
																	{((
																		poolHoverIndex ===
																		-1
																	) ?
																		pool ===
																		currentPool
																	:	poolHoverIndex ===
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
																		pl={`${(pool === currentPool && poolHoverIndex === -1) || poolHoverIndex === index ? '1' : '4'}`}
																		gap='1'
																		bg={`${
																			(
																				(pool ===
																					currentPool &&
																					poolHoverIndex ===
																						-1) ||
																				poolHoverIndex ===
																					index
																			) ?
																				'#4D59E8'
																			:	'inherit'
																		}`}
																		borderRadius='md'>
																		<Box
																			display='flex'
																			mt={
																				(
																					index <=
																						2 &&
																					currentDapp ==
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
																						currentDapp ==
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
																					:	pool
																					}
																				</Text>
																			</Tooltip>
																			{/* <Text mt="-0.1rem">
                                      {(index <= 2 && currentDapp == "Jediswap") ? "✨" : ""}
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
																				Pool
																				APR:{' '}
																				{numberFormatterPercentage(
																					getAprByPool(
																						poolAprs,
																						pool,
																						currentDapp
																					)
																				)}

																				%
																			</Box>
																			{/* {index <= 2 &&
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
                                      )} */}
																		</Box>
																	</Box>
																</Box>
															);
														}
													)}
												</Box>
											: (
												modalDropdowns.yourBorrowPoolDropdown &&
												radioValue === '2'
											) ?
												<Box
													w='full'
													left='0'
													bg='#03060B'
													py='2'
													className='dropdown-container'
													boxShadow='dark-lg'>
													{coins?.map(
														(
															coin: NativeToken,
															index: number
														) => {
															if (
																coin === 'DAI'
															) {
																return null;
															}
															const matchingPair =
																myswapPools?.find(
																	(
																		pair: any
																	) =>
																		pair ===
																		coin
																);
															const matchingPairJedi =
																jediswapPools?.find(
																	(
																		pair: any
																	) =>
																		pair ===
																		coin
																);
															if (
																coin ==
																	currentBorrowCoin ||
																(process.env
																	.NEXT_PUBLIC_NODE_ENV ==
																	'mainnet' &&
																	currentDapp ==
																		'mySwap' &&
																	!matchingPair)
															) {
																return null;
															}
															if (
																coin ==
																	currentBorrowCoin ||
																(process.env
																	.NEXT_PUBLIC_NODE_ENV ==
																	'mainnet' &&
																	currentDapp ==
																		'Jediswap' &&
																	!matchingPairJedi)
															) {
																return null;
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
																	onMouseEnter={() => {
																		setpoolHoverIndex(
																			index
																		);
																	}}
																	onMouseLeave={() => {
																		setpoolHoverIndex(
																			-1
																		);
																	}}
																	onClick={() => {
																		setCurrentPoolCoin(
																			coin
																		);
																		setToMarketSwap(
																			coin
																		);
																		setpoolHoverIndex(
																			-1
																		);
																	}}>
																	{((
																		poolHoverIndex ===
																		-1
																	) ?
																		coin ===
																		currentPoolCoin
																	:	poolHoverIndex ===
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
																		px={`${(coin === currentPoolCoin && poolHoverIndex === -1) || poolHoverIndex === index ? '1' : '5'}`}
																		gap='1'
																		bg={`${
																			(
																				(coin ===
																					currentPoolCoin &&
																					poolHoverIndex ===
																						-1) ||
																				poolHoverIndex ===
																					index
																			) ?
																				'#4D59E8'
																			:	'inherit'
																		}`}
																		borderRadius='md'>
																		<Box p='1'>
																			{getCoin(
																				coin
																			)}
																		</Box>
																		<Text>
																			{(
																				coin ==
																				'BTC'
																			) ?
																				'w' +
																				coin
																			:	coin
																			}
																		</Text>
																	</Box>
																</Box>
															);
														}
													)}
												</Box>
											:	<Box display='none'></Box>}
										</Box>
									</Box>
								</Box>
								<Box
									p='4'
									borderRadius='6px'
									border='1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
									background='var(--surface-of-10, rgba(103, 109, 154, 0.10))'
									my='4'>
									{radioValue == '1' &&
										currentPool !== 'Select a pool' &&
										collateralAmount > 0 &&
										inputBorrowAmount > 0 && (
											<Box
												display='flex'
												justifyContent='space-between'
												mb='1'>
												<Box display='flex'>
													<Text
														color='#676D9A'
														fontSize='xs'>
														est LP tokens recieved:{' '}
													</Text>
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
														maxW='232px'
														// mt="50px"
													>
														<Box p='1'>
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
														currentLPTokenAmount ===
															null
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
									{radioValue == '1' &&
										currentPool !== 'Select a pool' &&
										collateralAmount > 0 &&
										inputBorrowAmount > 0 && (
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
														label='The fee for reallocating liquidity across assets in a protocol.'
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
														<Box mt='2px'>
															{/* <SmallEth /> */}
															<Image
																src={`/${toMarketLiqA}.svg`}
																alt='liquidity split coin1'
																width='12'
																height='12'
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
														<Box mt='2px'>
															{/* <SmallUsdt /> */}
															<Image
																src={`/${toMarketLiqB}.svg`}
																alt='liquidity split coin1'
																width='12'
																height='12'
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
									<Box
										display='flex'
										justifyContent='space-between'
										mb='1'>
										<Box display='flex'>
											<Text
												color='#676D9A'
												fontSize='xs'>
												Fees:{' '}
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
												<Box p='1'>
													<InfoIcon />
												</Box>
											</Tooltip>
										</Box>
										<Text
											color='#676D9A'
											fontSize='xs'>
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
									<Box
										display='flex'
										justifyContent='space-between'
										mb='1'>
										<Box display='flex'>
											<Text
												color='#676D9A'
												fontSize='xs'>
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
												maxW='274px'
												// mb="10px"
											>
												<Box p='1'>
													<InfoIcon />
												</Box>
											</Tooltip>
										</Box>
										<Text
											color='#676D9A'
											fontSize='xs'>
											{(
												!borrowAPRs ||
												borrowAPRs.length === 0 ||
												!borrowAPRs[currentBorrowAPR]
											) ?
												<Box pt='1px'>
													<Skeleton
														width='2.3rem'
														height='.85rem'
														startColor='#2B2F35'
														endColor='#101216'
														borderRadius='6px'
													/>
												</Box>
											:	'-' +
												borrowAPRs[currentBorrowAPR] +
												'%'
											}
											{/* 5.56% */}
										</Text>
									</Box>
									<Box
										display='flex'
										justifyContent='space-between'
										mb='1'>
										<Box display='flex'>
											<Text
												color='#676D9A'
												fontSize='xs'>
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
												maxW='274px'
												// mb="10px"
											>
												<Box p='1'>
													<InfoIcon />
												</Box>
											</Tooltip>
										</Box>
										<Text
											color='#676D9A'
											fontSize='xs'>
											{(
												!borrowAPRs ||
												borrowAPRs.length === 0 ||
												!borrowAPRs[currentBorrowAPR]
											) ?
												<Box pt='1px'>
													<Skeleton
														width='2.3rem'
														height='.85rem'
														startColor='#2B2F35'
														endColor='#101216'
														borderRadius='6px'
													/>
												</Box>
											:	numberFormatterPercentage(
													getBoostedApr(
														currentBorrowCoin
													) +
														getBoostedAprSupply(
															currentCollateralCoin
														)
												) + '%'
											}
											{/* 5.56% */}
										</Text>
									</Box>
									{collateralAmount > 0 &&
										inputBorrowAmount > 0 && (
											<Text
												display='flex'
												justifyContent='space-between'
												fontSize='12px'
												mb='0.4rem'>
												<Text
													display='flex'
													alignItems='center'
													key={'effective apr'}>
													<Text
														mr='0.2rem'
														font-style='normal'
														font-weight='400'
														font-size='14px'
														lineHeight='16px'
														color='#676D9A'>
														Effective APR:
													</Text>
													<Tooltip
														hasArrow
														placement='right'
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
														maxW='222px'>
														<Box>
															<InfoIcon />
														</Box>
													</Tooltip>
												</Text>
												<Text
													font-style='normal'
													font-weight='400'
													font-size='14px'
													color='#676D9A'>
													{
														(
															tokenTypeSelected ===
															'Native'
														) ?
															(
																inputBorrowAmount ===
																	0 ||
																collateralAmount ===
																	0 ||
																!borrowAPRs[
																	currentBorrowAPR
																]
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
																currentPool ==
																'Select a pool'
															) ?
																<Text
																	color={
																		(
																			Number(
																				(inputBorrowAmountUSD *
																					(-protocolStats?.find(
																						(
																							stat: any
																						) =>
																							stat?.token ===
																							currentBorrowCoin
																					)
																						?.borrowRate +
																						getBoostedApr(
																							currentBorrowCoin
																						)) +
																					inputCollateralAmountUSD *
																						(protocolStats?.find(
																							(
																								stat: any
																							) =>
																								stat?.token ===
																								currentCollateralCoin
																						)
																							?.supplyRate +
																							getBoostedAprSupply(
																								currentCollateralCoin
																							))) /
																					inputCollateralAmountUSD
																			) <
																			0
																		) ?
																			'rgb(255 94 94)'
																		:	'#00D395'
																	}>
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
																				(
																					stat: any
																				) =>
																					stat?.token ===
																					currentBorrowCoin
																			)
																				?.borrowRate +
																				getBoostedApr(
																					currentBorrowCoin
																				)) +
																			inputCollateralAmountUSD *
																				(protocolStats?.find(
																					(
																						stat: any
																					) =>
																						stat?.token ===
																						currentCollateralCoin
																				)
																					?.supplyRate +
																					getBoostedAprSupply(
																						currentCollateralCoin
																					))) /
																			inputCollateralAmountUSD
																	).toFixed(
																		2
																	)}
																	%
																</Text>
															:	<Text
																	color={
																		(
																			Number(
																				(inputBorrowAmountUSD *
																					(-protocolStats?.find(
																						(
																							stat: any
																						) =>
																							stat?.token ===
																							currentBorrowCoin
																					)
																						?.borrowRate +
																						getAprByPool(
																							poolAprs,
																							currentPool,
																							currentDapp
																						) +
																						getBoostedApr(
																							currentBorrowCoin
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
																								)
																									?.price)) /
																							getTvlByPool(
																								poolAprs,
																								currentPool,
																								currentDapp
																							)) +
																					inputCollateralAmountUSD *
																						(protocolStats?.find(
																							(
																								stat: any
																							) =>
																								stat?.token ===
																								currentCollateralCoin
																						)
																							?.supplyRate +
																							getBoostedAprSupply(
																								currentCollateralCoin
																							))) /
																					inputCollateralAmountUSD
																			) <
																			0
																		) ?
																			'rgb(255 94 94)'
																		:	'rgb(3 211 148)'
																	}>
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
																				(
																					stat: any
																				) =>
																					stat?.token ===
																					currentBorrowCoin
																			)
																				?.borrowRate +
																				getAprByPool(
																					poolAprs,
																					currentPool,
																					currentDapp
																				) +
																				getBoostedApr(
																					currentBorrowCoin
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
																						)
																							?.price)) /
																					getTvlByPool(
																						poolAprs,
																						currentPool,
																						currentDapp
																					)) +
																			(inputCollateralAmountUSD *
																				protocolStats?.find(
																					(
																						stat: any
																					) =>
																						stat?.token ===
																						currentCollateralCoin
																				)
																					?.supplyRate +
																				getBoostedAprSupply(
																					currentCollateralCoin
																				))) /
																			inputCollateralAmountUSD
																	).toFixed(
																		2
																	)}
																	%
																</Text>

															// (100*365*(poolAllocatedData*(oraclePrices.find((curr: any) => curr.name === "STRK")?.price))/getTvlByPool(poolAprs, currentPool, currentDapp))
															// protocolStats.length === 0 ||
														: (
															rTokenAmount ===
																0 ||
															inputBorrowAmount ===
																0 ||
															!borrowAPRs[
																currentBorrowAPR
															]
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
															currentPool ==
															'Select a pool'
														) ?
															<Text
																color={
																	(
																		Number(
																			(inputBorrowAmountUSD *
																				(-protocolStats?.find(
																					(
																						stat: any
																					) =>
																						stat?.token ===
																						currentBorrowCoin
																				)
																					?.borrowRate +
																					getBoostedApr(
																						currentBorrowCoin
																					)) +
																				inputCollateralAmountUSD *
																					(protocolStats?.find(
																						(
																							stat: any
																						) =>
																							stat?.token ===
																							rToken.slice(
																								1
																							)
																					)
																						?.supplyRate +
																						getBoostedAprSupply(
																							currentCollateralCoin
																						))) /
																				inputCollateralAmountUSD
																		) < 0
																	) ?
																		'rgb(255 94 94)'
																	:	'#00D395'
																}>
																{/* 5.56% */}
																{/* loan_usd_value * loan_apr - collateral_usd_value * collateral_apr) / loan_usd_value */}
																{Number(
																	(inputBorrowAmountUSD *
																		(-protocolStats?.find(
																			(
																				stat: any
																			) =>
																				stat?.token ===
																				currentBorrowCoin
																		)
																			?.borrowRate +
																			getBoostedApr(
																				currentBorrowCoin
																			)) +
																		inputCollateralAmountUSD *
																			(protocolStats?.find(
																				(
																					stat: any
																				) =>
																					stat?.token ===
																					rToken.slice(
																						1
																					)
																			)
																				?.supplyRate +
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
														:	<Text
																color={
																	(
																		Number(
																			(inputBorrowAmountUSD *
																				(-protocolStats?.find(
																					(
																						stat: any
																					) =>
																						stat?.token ===
																						currentBorrowCoin
																				)
																					?.borrowRate +
																					getAprByPool(
																						poolAprs,
																						currentPool,
																						currentDapp
																					) +
																					getBoostedApr(
																						currentBorrowCoin
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
																							)
																								?.price)) /
																						getTvlByPool(
																							poolAprs,
																							currentPool,
																							currentDapp
																						)) +
																				inputCollateralAmountUSD *
																					(protocolStats?.find(
																						(
																							stat: any
																						) =>
																							stat?.token ===
																							rToken.slice(
																								1
																							)
																					)
																						?.supplyRate +
																						getBoostedAprSupply(
																							rToken.slice(
																								1
																							)
																						))) /
																				inputCollateralAmountUSD
																		) < 0
																	) ?
																		'rgb(255 94 94)'
																	:	'#00D395'
																}>
																{/* (100*365*(poolAllocatedData*(oraclePrices.find((curr: any) => curr.name === "STRK")?.price))/getTvlByPool(poolAprs, currentPool, currentDapp)) */}
																{/* 5.56% */}
																{/* loan_usd_value * loan_apr - collateral_usd_value * collateral_apr) / loan_usd_value */}
																{Number(
																	(inputBorrowAmountUSD *
																		(-protocolStats?.find(
																			(
																				stat: any
																			) =>
																				stat?.token ===
																				currentBorrowCoin
																		)
																			?.borrowRate +
																			getAprByPool(
																				poolAprs,
																				currentPool,
																				currentDapp
																			) +
																			getBoostedApr(
																				currentBorrowCoin
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
																					)
																						?.price)) /
																				getTvlByPool(
																					poolAprs,
																					currentPool,
																					currentDapp
																				)) +
																		inputCollateralAmountUSD *
																			(protocolStats?.find(
																				(
																					stat: any
																				) =>
																					stat?.token ===
																					rToken.slice(
																						1
																					)
																			)
																				?.supplyRate +
																				getBoostedAprSupply(
																					rToken.slice(
																						1
																					)
																				))) /
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

													}
												</Text>
											</Text>
										)}
									{healthFactor ?
										<Box
											display='flex'
											justifyContent='space-between'>
											<Box display='flex'>
												<Text
													color='#676D9A'
													fontSize='xs'>
													Health factor:{' '}
												</Text>
												<Tooltip
													hasArrow
													placement='right'
													boxShadow='dark-lg'
													label='Loan risk metric comparing collateral value to borrowed amount to check potential liquidation.'
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
													<Box padding='0.25rem'>
														<InfoIcon />
													</Box>
												</Tooltip>
											</Box>
											<Text
												color='#676D9A'
												fontSize='xs'>
												{healthFactor?.toFixed(2)}
											</Text>
										</Box>
									:	''}
								</Box>
								{currentCollateralCoin &&
									currentCollateralCoin[0] !== 'r' &&
									stats && (
										<Box
											// display="flex"
											// justifyContent="left"
											w='100%'
											// pb="4"
											height='64px'
											display='flex'
											alignItems='center'
											mt='2rem'
											// mb="1rem"
										>
											<Box
												display='flex'
												bg={
													(
														dollarConvertor(
															maximumLoanAmount,
															currentBorrowCoin,
															oraclePrices
														) < 100 ||
														((
															tokenTypeSelected ==
															'Native'
														) ?
															currentBorrowCoin ==
																'BTC' &&
															currentCollateralCoin ==
																'STRK'
														:	currentBorrowCoin ==
																'BTC' &&
															rToken ==
																'rSTRK') ||
														(currentBorrowCoin ===
															'USDT' &&
															currentPool ==
																'STRK/ETH') ||
														(currentBorrowCoin ===
															'BTC' &&
															currentPool ==
																'STRK/ETH')
													) ?
														'#480C104D'
													:	'#676D9A4D'
												}
												color='#F0F0F5'
												fontSize='12px'
												p='4'
												border={
													(
														dollarConvertor(
															maximumLoanAmount,
															currentBorrowCoin,
															oraclePrices
														) < 100 ||
														((
															tokenTypeSelected ==
															'Native'
														) ?
															currentBorrowCoin ==
																'BTC' &&
															currentCollateralCoin ==
																'STRK'
														:	currentBorrowCoin ==
																'BTC' &&
															rToken ==
																'rSTRK') ||
														(currentBorrowCoin ===
															'USDT' &&
															currentPool ==
																'STRK/ETH') ||
														(currentBorrowCoin ===
															'BTC' &&
															currentPool ==
																'STRK/ETH')
													) ?
														'1px solid #9B1A23'
													:	'1px solid #3841AA'
												}
												fontStyle='normal'
												fontWeight='400'
												lineHeight='18px'
												borderRadius='6px'
												// textAlign="center"
											>
												<Box
													pr='3'
													mt='0.5'
													cursor='pointer'>
													{(
														dollarConvertor(
															maximumLoanAmount,
															currentBorrowCoin,
															oraclePrices
														) < 100 ||
														((
															tokenTypeSelected ==
															'Native'
														) ?
															currentBorrowCoin ==
																'BTC' &&
															currentCollateralCoin ==
																'STRK'
														:	currentBorrowCoin ==
																'BTC' &&
															rToken ==
																'rSTRK') ||
														(currentBorrowCoin ===
															'USDT' &&
															currentPool ==
																'STRK/ETH') ||
														(currentBorrowCoin ===
															'BTC' &&
															currentPool ==
																'STRK/ETH')
													) ?
														<RedinfoIcon />
													:	<BlueInfoIcon />}
												</Box>
												{(
													dollarConvertor(
														maximumLoanAmount,
														currentBorrowCoin,
														oraclePrices
													) < 100 ||
													((
														tokenTypeSelected ==
														'Native'
													) ?
														currentBorrowCoin ==
															'BTC' &&
														currentCollateralCoin ==
															'STRK'
													:	currentBorrowCoin ==
															'BTC' &&
														rToken == 'rSTRK')
												) ?
													`The current collateral and borrowing market combination isn't allowed at this moment.`
												: (
													(currentBorrowCoin ===
														'USDT' &&
														currentPool ==
															'STRK/ETH') ||
													(currentBorrowCoin ===
														'BTC' &&
														currentPool ==
															'STRK/ETH')
												) ?
													"The current borrow market and spend pool isn't allowed at this moment"
												:	`You have selected a native token as collateral which will be
                    converted to rtokens 1r${currentCollateralCoin} =
                    ${
						((
							stats.find(
								(val: any) =>
									val?.token == currentCollateralCoin.split(1)
							)?.exchangeRateRtokenToUnderlying
						) ?
							numberFormatter(
								stats.find(
									(val: any) =>
										val?.token ==
										currentCollateralCoin.split(1)
								)?.exchangeRateRtokenToUnderlying
							)
						:	'') + currentCollateralCoin?.split(1)
					}`
												}
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
								{(
									(tokenTypeSelected == 'rToken' ?
										rTokenAmount > 0
									:	true) &&
									(tokenTypeSelected == 'Native' ?
										!(
											currentBorrowCoin == 'BTC' &&
											currentCollateralCoin == 'STRK'
										)
									:	!(
											currentBorrowCoin == 'BTC' &&
											rToken == 'rSTRK'
										)) &&
									(tokenTypeSelected == 'Native' ?
										collateralAmount > 0
									:	true) &&
									((inputBorrowAmount >= minimumLoanAmount &&
										inputBorrowAmount <=
											maximumLoanAmount) ||
										process.env.NEXT_PUBLIC_NODE_ENV ==
											'testnet') &&
									inputBorrowAmount <=
										currentAvailableReserves &&
									(currentBorrowCoin === 'USDT' ?
										currentPool !== 'STRK/ETH'
									: currentBorrowCoin === 'BTC' ?
										currentPool !== 'STRK/ETH'
									:	true) &&
									inputBorrowAmount > 0 &&
									((tokenTypeSelected == 'Native' ?
										inputCollateralAmount >=
											minimumDepositAmount &&
										inputCollateralAmount <=
											maximumDepositAmount
									:	true) ||
										process.env.NEXT_PUBLIC_NODE_ENV ==
											'testnet') &&
									inputCollateralAmount <= walletBalance &&
									inputBorrowAmountUSD <=
										4.98 * inputCollateralAmountUSD &&
									currentDapp != 'Select a dapp' &&
									(currentPool != 'Select a pool' ||
										currentPoolCoin != 'Select a pool')
								) ?
									<Box
										onClick={() => {
											setTransactionStarted(true);
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
												posthog.capture(
													'Trade Button Clicked Market page',
													{
														Clicked: true,
													}
												);
												dispatch(
													setTransactionStartedAndModalClosed(
														false
													)
												);
												handleBorrowAndSpend();
											}
										}}>
										<AnimatedButton
											// bgColor="red"
											// p={0}
											border='1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
											background='var(--surface-of-10, rgba(103, 109, 154, 0.10))'
											color='#676D9A'
											size='sm'
											width='100%'
											mt='1.5rem'
											mb='1.5rem'
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
													successText={
														'Borrow successful'
													}
												/>,
											]}
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
											_disabled={{
												bgColor: 'white',
												color: 'black',
											}}
											isDisabled={
												transactionStarted == true
											}
											currentTransactionStatus={
												currentTransactionStatus
											}
											setCurrentTransactionStatus={
												setCurrentTransactionStatus
											}>
											Spend
										</AnimatedButton>
									</Box>
								:	<Button
										border='1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
										background='var(--surface-of-10, rgba(103, 109, 154, 0.10))'
										color='#676D9A'
										size='sm'
										width='100%'
										mt='1.5rem'
										mb='1.5rem'
										_hover={{
											bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
										}}>
										Spend
									</Button>
								}
							</Box>
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default TradeModal;
