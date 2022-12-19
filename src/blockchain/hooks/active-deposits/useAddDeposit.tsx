import {
	useAccount,
	useConnectors,
	useContract,
	useStarknet,
	useStarknetCall,
	useStarknetExecute,
} from '@starknet-react/core';
import { exec } from 'child_process';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Abi, number, uint256 } from 'starknet';
import deposit from '../../../components/deposit';
import { ERC20Abi, tokenAddressMap } from '../../stark-constants';
import { BNtoNum, GetErrorText, NumToBN } from '../../utils';

const useAddDeposit = (_token: any, _diamondAddress: string) => {
	const [token, setToken] = useState('');
	const [diamondAddress, setDiamondAddress] = useState('');

	const [depositMarket, setDepositMarket] = useState<string>('');
	const [depositAmount, setDepositAmount] = useState<number>();
	const [depositCommit, setDepositCommit] = useState();

	const [approveStatus, setApproveStatus] = useState('');
	const [isAllowed, setAllowed] = useState(false);
	const [shouldApprove, setShouldApprove] = useState(false);
	const [allowanceVal, setAllowance] = useState(0);

	const { address: account } = useAccount();
	const [transApprove, setTransApprove] = useState('');
	const [transDeposit, setTransBorrow] = useState('');


	useEffect(() => {
		setToken(_token.market);
		setDiamondAddress(_diamondAddress);
	}, [_diamondAddress, _token.market]);

	const { contract } = useContract({
		abi: ERC20Abi as Abi,
		address: tokenAddressMap[token] as string,
	});

	const {
		data: dataAllowance,
		loading: loadingAllowance,
		error: errorAllowance,
		refresh: refreshAllowance,
	} = useStarknetCall({
		contract: contract,
		method: 'allowance',
		args: [account, diamondAddress],
		options: {
			watch: true,
		},
	});

	useEffect(() => {
		console.log('check allownace', {
			dataAllowance,
			errorAllowance,
			refreshAllowance,
			loadingAllowance,
		});
		if (dataAllowance) {
			console.log('yo', Number(BNtoNum(dataAllowance[0]?.low, 18)));
		}
		if (!loadingAllowance) {
			if (dataAllowance) {
				let data: any = dataAllowance;
				let _allowance = uint256.uint256ToBN(data.remaining);
				// console.log({ _allowance: _allowance.toString(), depositAmount });
				setAllowance(Number(BNtoNum(dataAllowance[0]?.low, 18)));
				if (allowanceVal > (depositAmount as number)) {
					setAllowed(true);
					setShouldApprove(false);
				} else {
					setShouldApprove(true);
					setAllowed(false);
				}
			} else if (errorAllowance) {
				// handleToast(true, "Check allowance", errorAllowance)
			}
		}
	}, [dataAllowance, errorAllowance, refreshAllowance, loadingAllowance]);

	const {
		data: dataApprove,
		loading: loadingApprove,
		error: errorApprove,
		reset: resetApprove,
		execute: executeApprove,
	} = useStarknetExecute({
		calls: {
			contractAddress: depositMarket as string,
			entrypoint: 'approve',
			calldata: [diamondAddress, NumToBN(depositAmount as number, 18), 0],
		},
	});

	const {
		data: dataDeposit,
		loading: loadingDeposit,
		error: errorDeposit,
		reset: resetDeposit,
		execute: executeDeposit,
	} = useStarknetExecute({
		calls: {
			contractAddress: diamondAddress,
			entrypoint: 'deposit_request',
			calldata: [
				tokenAddressMap[token],
				depositCommit,
				NumToBN(depositAmount as number, 18),
				0,
			],
		},
	});

	const handleApprove = async (asset: string) => {
		try {
			const val = await executeApprove();
			setTransApprove(val.transaction_hash)
		} catch(err) {
			console.log(err, 'err approve for add deposit')
		}
	};

	const DepositAmount = async (asset: string) => {
		if (
			!tokenAddressMap[asset] &&
			!depositAmount &&
			!diamondAddress &&
			!depositCommit
		) {
			toast.error(`${GetErrorText(`Invalid request`)}`, {
				position: toast.POSITION.BOTTOM_RIGHT,
				closeOnClick: true,
			});
			return;
		}
		if (depositAmount === 0) {
			// approve the transfer
			toast.error(`${GetErrorText(`Can't deposit 0 of ${asset}`)}`, {
				position: toast.POSITION.BOTTOM_RIGHT,
				closeOnClick: true,
			});
			return;
		}
		console.log(diamondAddress, depositAmount);
		// await handleApprove();
		// run deposit function

		// console.log("allowance", BNtoNum(dataAllowance[0]?.low, 18).toString());
		// console.log("amountin -: ", depositAmount);

		// setAllowance(Number(BNtoNum(dataAllowance[0]?.low, 18)));
		try {
			let tx = await executeDeposit();
			setTransBorrow(tx.transaction_hash);
		} catch(err) {
			console.log(err, 'err add deposit')
		}
	};

	return {
		DepositAmount,
		handleApprove,
		setDepositAmount,
		setDepositCommit,
		setDepositMarket,
		allowanceVal,
		depositAmount,
		depositCommit,
		transApprove,
		transDeposit,
		loadingApprove,
		loadingDeposit,
		dataApprove,
    dataDeposit

	};
};

export default useAddDeposit;
