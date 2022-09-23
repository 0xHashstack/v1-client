import {
	useConnectors,
	useStarknet,
	useStarknetExecute,
} from '@starknet-react/core';
import { useEffect, useState } from 'react';
import { number } from 'starknet';
import { tokenAddressMap, diamondAddress } from '../stark-constants';
import * as DeployDetails from '../../../../zkOpen/contract_addresses.json';

const useGetToken = ({ token }: { token: string }) => {
	const { available, connect, disconnect } = useConnectors();

	const { account } = useStarknet();

	const [_account, setAccount] = useState<string>('');

	// useEffect(() => {
	//   console.log(number.toHex(number.toBN(number.toFelt(_account || ""))));
	//   setAccount(number.toHex(number.toBN(number.toFelt(_account || ""))));
	// }, [account]);

	const {
		data: dataBTC,
		loading: loadingBTC,
		error: errorBTC,
		reset: resetBTC,
		execute: BTC,
	} = useStarknetExecute({
		calls: {
			contractAddress: DeployDetails.hardhat.FAUCET_ADDRESS as string,
			entrypoint: 'get_tokens',
			calldata: [number.toFelt(0)],
		},
	});

	const {
		data: dataUSDC,
		loading: loadingUSDC,
		error: errorUSDC,
		reset: resetUSDC,
		execute: USDC,
	} = useStarknetExecute({
		calls: {
			contractAddress: DeployDetails.hardhat.FAUCET_ADDRESS as string,
			entrypoint: 'get_tokens',
			calldata: [number.toFelt(1)],
		},
	});

	const {
		data: dataUSDT,
		loading: loadingUSDT,
		error: errorUSDT,
		reset: resetUSDT,
		execute: USDT,
	} = useStarknetExecute({
		calls: {
			contractAddress: DeployDetails.hardhat.FAUCET_ADDRESS as string,
			entrypoint: 'get_tokens',
			calldata: [number.toFelt(2)],
		},
	});

	const {
		data: dataBNB,
		loading: loadingBNB,
		error: errorBNB,
		reset: resetBNB,
		execute: BNB,
	} = useStarknetExecute({
		calls: {
			contractAddress: DeployDetails.hardhat.FAUCET_ADDRESS as string,
			entrypoint: 'get_tokens',
			calldata: [number.toFelt(3)],
		},
	});

	const handleGetToken = async (token: string) => {
		let val;
		if (token === 'BTC') {
			val = await BTC();
		}
		if (token === 'BNB') {
			val = await BNB();
		}
		if (token === 'USDC') {
			val = await USDC();
		}
		if (token === 'USDT') {
			val = await USDT();
		}
	};

	const returnTransactionParameters = (token: string) => {
		let data, loading, reset, error;
		if (token === 'BTC') {
			[data, loading, reset, error] = [dataBTC, loadingBTC, resetBTC, errorBTC];
		}
		if (token === 'BNB') {
			[data, loading, reset, error] = [dataBNB, loadingBNB, resetBNB, errorBNB];
		}
		if (token === 'USDC') {
			[data, loading, reset, error] = [
				dataUSDC,
				loadingUSDC,
				resetUSDC,
				errorUSDC,
			];
		}
		if (token === 'USDT') {
			[data, loading, reset, error] = [
				dataUSDT,
				loadingUSDT,
				resetUSDT,
				errorUSDT,
			];
		}
		return { data, loading, reset, error };
	};
	return { handleGetToken, returnTransactionParameters };
};

export default useGetToken;
