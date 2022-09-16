import { useContract } from '@starknet-react/core';
import { Abi } from 'starknet';
import {
	useStarknet,
	useStarknetInvoke,
	useStarknetCall,
} from '@starknet-react/core';

import DepositAbi from '../../../starknet-artifacts/contracts/modules/deposit.cairo/deposit_abi.json';

class DepositWrapper {
	// Contracts
	deposit: any;

	constructor() {
		this.deposit = useContract({
			abi: DepositAbi as Abi,
			address: process.env.NEXT_PUBLIC_DAIMOND_ADDRESS,
		});
	}

	function depositRequest(market: number, commitment: number, amount: number) {
		const { invoke: _depositRequest } = useStarknetInvoke({
			contract: deposit,
			method: 'deposit_request',
		});

		return _depositRequest({
			args: [
				market,
				commitment,
				amount,
				// uint256.bnToUint256('3000000000000000000000'),
			],
		});
	}

	withdrawDeposit(depositId: number, amount: number) {
		const { invoke: _withdraw } = useStarknetInvoke({
			contract: deposit,
			method: 'withdraw_deposit',
		});

		return _withdraw({
			args: [depositId, amount],
		});
	}
}

export default DepositWrapper;
