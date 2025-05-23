import { diamondAddress, itachiSpend } from '@/Blockchain/stark-constants';
import { useContractWrite } from '@starknet-react/core';
import { useEffect, useState } from 'react';

const useRevertInteractWithL3 = () => {
	const [revertLoanId, setRevertLoanId] = useState<string>('');
	const [revertParams, setRevertParams] = useState<any>([]);

	const {
		data: dataRevertInteractWithL3,
		error: errorRevertInteractWithL3,
		write: writeRevertInteractWithL3,
		writeAsync: writeAsyncRevertInteractWithL3,
		isIdle: isIdleRevertInteractWithL3,
	} = useContractWrite({
		calls: [
			{
				contractAddress: diamondAddress,
				entrypoint: 'revert_interaction_with_l3',
				calldata: revertParams,
			},
		],
	});

	const revertInteractWithL3 = async (id: string) => {
		setRevertLoanId(id);
		if (revertLoanId) {
			try {
				const loanData =
					await itachiSpend.getRevertCalldata(revertLoanId);
				setRevertParams([loanData]);
				return await writeAsyncRevertInteractWithL3();
			} catch (error) {}
		}
	};

	return {
		revertLoanId,
		setRevertLoanId,
		dataRevertInteractWithL3,
		writeAsyncRevertInteractWithL3,
		writeRevertInteractWithL3,
		errorRevertInteractWithL3,
		isIdleRevertInteractWithL3,
		revertInteractWithL3,
	};
};

export default useRevertInteractWithL3;
