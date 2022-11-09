import { ethers } from 'ethers'; // for nodejs only
const provider = new ethers.providers.JsonRpcProvider(
	'https://eth-mainnet.g.alchemy.com/v2/ueGR8qTG6QCRxfEPO9JVlfkOJUrKMtd5'
);
const aggregatorV3InterfaceABI = [
	{
		inputs: [],
		name: 'decimals',
		outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'description',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint80', name: '_roundId', type: 'uint80' }],
		name: 'getRoundData',
		outputs: [
			{ internalType: 'uint80', name: 'roundId', type: 'uint80' },
			{ internalType: 'int256', name: 'answer', type: 'int256' },
			{ internalType: 'uint256', name: 'startedAt', type: 'uint256' },
			{ internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
			{ internalType: 'uint80', name: 'answeredInRound', type: 'uint80' },
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'latestRoundData',
		outputs: [
			{ internalType: 'uint80', name: 'roundId', type: 'uint80' },
			{ internalType: 'int256', name: 'answer', type: 'int256' },
			{ internalType: 'uint256', name: 'startedAt', type: 'uint256' },
			{ internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
			{ internalType: 'uint80', name: 'answeredInRound', type: 'uint80' },
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'version',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
];

const eth_goerli_address: any = {
	BTC: '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c',
	BNB: '0x14e613AC84a31f709eadbdF89C6CC390fDc9540A',
	USDC: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6',
	USDT: '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D',
};

// ethereum network address
export const getPrice = (asset: any) => {
	const priceFeed = new ethers.Contract(
		eth_goerli_address[asset],
		aggregatorV3InterfaceABI,
		provider
	);

	const price = priceFeed
		.latestRoundData()
		.then((roundData: any) => roundData.answer);
	return price;
};
