import { useContract } from '@starknet-react/core';
import { Abi } from 'starknet';

import DepositAbi from '../../../starknet-artifacts/contracts/modules/deposit.cairo/deposit_abi.json';
import ERC20Abi from '../../../starknet-artifacts/contracts/mockups/erc20.cairo/erc20_abi.json';


export function useDepositContract() {
	return useContract({
		abi: DepositAbi as Abi,
		address: process.env.NEXT_PUBLIC_DAIMOND_ADDRESS,
	});
}


export function useERC20Contract(tokenAddress: any) {
	return useContract({
		abi: ERC20Abi as Abi,
		address: tokenAddress,
	});
}
