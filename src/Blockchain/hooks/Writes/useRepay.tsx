import {
	useAccount,
	useContractRead,
	useContractWrite,
	useWaitForTransaction,
} from '@starknet-react/core';
import { useEffect, useState } from 'react';
import { Abi, uint256 } from 'starknet';
import { ERC20Abi, diamondAddress } from '../../stark-constants';
import { etherToWeiBN, weiToEtherNumber } from '../../utils/utils';
import {
	tokenAddressMap,
	tokenDecimalsMap,
} from '@/Blockchain/utils/addressServices';
import { ILoan, Token } from '@/Blockchain/interfaces/interfaces';
import {
	selectActiveTransactions,
	setActiveTransactions,
	setTransactionStatus,
} from '@/store/slices/userAccountSlice';
import CopyToClipboard from '@/components/clipboard/clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Text } from '@chakra-ui/react';
const useRepay = (loanParam: any) => {
	const [repayAmount, setRepayAmount] = useState<number>(0);
	const [loan, setLoan] = useState<ILoan>(loanParam);
	const [allowanceVal, setAllowance] = useState(0);
	////console.log(repayAmount, "loan param", loanParam);

	const [transApprove, setTransApprove] = useState('');
	const [transRepayHash, setTransRepayHash] = useState('');
	const dispatch = useDispatch();
	const [transSelfLiquidateHash, setIsSelfLiquidateHash] = useState('');

	// const repayTransactionReceipt = useWaitForTransaction({
	//   hash: transRepayHash,
	//   watch: true,
	// });

	// const selfLiquidateTransactionReceipt = useWaitForTransaction({
	//   hash: transSelfLiquidateHash,
	//   watch: true,
	// });

	// useEffect(() => {
	//   TxToastManager.handleTxToast(
	//     repayTransactionReceipt,
	//     `Repay Loan ID ${loan?.loanId}`
	//   );
	// }, [repayTransactionReceipt]);

	// useEffect(() => {
	//   TxToastManager.handleTxToast(
	//     selfLiquidateTransactionReceipt,
	//     `Liquidate Loan ID ${loan?.loanId}`
	//   );
	// }, [selfLiquidateTransactionReceipt]);

	const {
		data: dataRepay,
		error: errorRepay,
		reset: resetRepay,
		write: writeRepay,
		writeAsync: writeAsyncRepay,
		isError: isErrorRepay,
		isIdle: isIdleRepay,
		isSuccess: isSuccessRepay,
		status: statusRepay,
	} = useContractWrite({
		calls: [
			{
				contractAddress: loan?.underlyingMarketAddress as string,
				entrypoint: 'approve',
				calldata: [
					diamondAddress,
					etherToWeiBN(
						repayAmount as number,
						loan?.underlyingMarket as Token
					).toString(),
					0,
				],
			},
			{
				contractAddress: diamondAddress,
				entrypoint: 'repay_loan',
				calldata: [
					loan?.loanId,
					etherToWeiBN(
						repayAmount as number,
						loan?.underlyingMarket as Token
					).toString(),
					0,
				],
			},
		],
	});

	const {
		data: dataSelfLiquidate,
		error: errorSelfLiquidate,
		reset: resetSelfLiquidate,
		write: writeSelfLiquidate,
		writeAsync: writeAsyncSelfLiquidate,
		isError: isErrorSelfLiquidate,
		isIdle: isIdleSelfLiquidate,
		isSuccess: isSuccessSelfLiquidate,
		status: statusSelfLiquidate,
	} = useContractWrite({
		calls: [
			{
				contractAddress: diamondAddress,
				entrypoint: 'repay_loan',
				calldata: [loan?.loanId, 0, 0],
			},
		],
	});
	const [toastId, setToastId] = useState<any>();
	let activeTransactions = useSelector(selectActiveTransactions);
	const [currentTransactionStatus, setCurrentTransactionStatus] =
		useState('');

	return {
		repayAmount,
		setRepayAmount,
		loan,
		setLoan,
		// handleApprove,
		writeAsyncRepay,
		transRepayHash,
		setTransRepayHash,
		// repayTransactionReceipt,
		errorRepay,
		// handleRepayBorrow,

		//SelfLiquidate - Repay with 0 amount
		writeAsyncSelfLiquidate,
		errorSelfLiquidate,
		// selfLiquidateTransactionReceipt,
		setIsSelfLiquidateHash,
	};
};

export default useRepay;
