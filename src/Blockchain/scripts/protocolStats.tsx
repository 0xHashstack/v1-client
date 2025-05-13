import { Contract, number, uint256 } from 'starknet';
import {
	contractsEnv,
	getProvider,
	getTokenFromAddress,
	metricsContractAddress,
} from '../stark-constants';
// import metricsAbi from "../abis_upgrade/metrics_abi.json";
// import metricsAbi from "../abi_new/metrics_abi.json";
import metricsAbi from '../abis_mainnet/metrics_abi.json';
import {
	IMarketInfo,
	IProtocolReserves,
	NativeToken,
	Token,
} from '../interfaces/interfaces';
import { parseAmount, weiToEtherNumber } from '../utils/utils';
import BigNumber from 'bignumber.js';

function parseProtocolStat(marketData: any, decimal: number): IMarketInfo {
	let marketInfo: IMarketInfo = {
		borrowRate: parseAmount(
			uint256.uint256ToBN(marketData?.borrow_rate).toString(),
			2
		),
		supplyRate: parseAmount(
			uint256.uint256ToBN(marketData?.supply_rate).toString(),
			2
		),
		stakingRate: parseAmount(
			uint256.uint256ToBN(marketData?.staking_rate).toString(),
			2
		),

		totalSupply: weiToEtherNumber(
			uint256.uint256ToBN(marketData?.total_supply).toString(),
			getTokenFromAddress(number.toHex(marketData?.token_address))
				?.name as Token
		),
		lentAssets: weiToEtherNumber(
			uint256.uint256ToBN(marketData?.lent_assets).toString(),
			getTokenFromAddress(number.toHex(marketData?.token_address))
				?.name as Token
		),
		totalBorrow: weiToEtherNumber(
			uint256.uint256ToBN(marketData?.total_borrow).toString(),
			getTokenFromAddress(number.toHex(marketData?.token_address))
				?.name as Token
		),
		availableReserves: weiToEtherNumber(
			new BigNumber(Number(uint256.uint256ToBN(marketData?.total_supply)))
				.minus(
					new BigNumber(
						Number(uint256.uint256ToBN(marketData?.total_borrow))
					)
				)
				.toString(),
			getTokenFromAddress(number.toHex(marketData?.token_address))
				?.name as Token
		),
		utilisationPerMarket: parseAmount(
			uint256.uint256ToBN(marketData?.utilisation_per_market).toString(),
			2
		),

		exchangeRateRtokenToUnderlying: parseAmount(
			uint256
				.uint256ToBN(marketData?.exchange_rate_rToken_to_asset)
				.toString(),
			18
		),
		exchangeRateDTokenToUnderlying: parseAmount(
			uint256
				.uint256ToBN(marketData?.exchange_rate_dToken_to_asset)
				.toString(),
			decimal
		),
		exchangeRateUnderlyingToRtoken: parseAmount(
			uint256
				.uint256ToBN(marketData?.exchange_rate_asset_to_rToken)
				.toString(),
			18
		),
		exchangeRateUnderlyingToDtoken: parseAmount(
			uint256
				.uint256ToBN(marketData?.exchange_rate_asset_to_dToken)
				.toString(),
			decimal
		),

		tokenAddress: number.toHex(marketData?.token_address),
		token: getTokenFromAddress(number.toHex(marketData?.token_address))
			?.name as NativeToken,
	};
	return marketInfo;
}

export async function getProtocolStats() {
	const marketStats: IMarketInfo[] = [];
	const provider = getProvider();
	const metricsContract = new Contract(
		metricsAbi,
		metricsContractAddress,
		provider
	);
	try {
		const promises: any = [];
		for (let i = 0; i < contractsEnv.TOKENS.length; ++i) {
			const token = contractsEnv.TOKENS[i];

			const res = metricsContract.call(
				'get_protocol_stats',
				[token.address],
				{
					blockIdentifier: 'pending',
				}
			);
			promises.push(res);
		}
		return new Promise((resolve, reject) => {
			Promise.allSettled([...promises]).then((val) => {
				//  console.log("protocol stats result - ", val);
				const results = val.map((stat, idx) => {
					if (stat?.status == 'fulfilled' && stat?.value)
						return parseProtocolStat(
							stat?.value,
							contractsEnv?.TOKENS[idx]?.decimals
						);
					else return marketStats;
				});
				//console.log("protocol stats result: ", results);
				resolve(results);
			});
		});
		////console.log(marketStats,"market Stats in protocol stats")
	} catch (e) {
		//console.log("get_protocol_stat failed for token: ", e);
		return marketStats;
	}
}

function parseProtocolReserves(protocolReservesData: any): IProtocolReserves {
	try {
		let protocolReserves: IProtocolReserves = {
			totalReserves: parseAmount(
				uint256
					.uint256ToBN(
						protocolReservesData?.total_reserves || BigInt(0)
					)
					.toString(),
				8
			),
			availableReserves: parseAmount(
				uint256
					.uint256ToBN(
						protocolReservesData?.available_reserves || BigInt(0)
					)
					.toString(),
				8
			),
			avgAssetUtilisation: parseAmount(
				uint256
					.uint256ToBN(
						protocolReservesData?.avg_asset_utilisation || BigInt(0)
					)
					.toString(),
				2
			),
		};
		return protocolReserves;
	} catch (error) {
		console.warn('getProtocol reserves: ', error);
		throw 'get protocol stat error';
	}
}

export async function getProtocolReserves() {
	const provider = getProvider();
	try {
		const metricsContract = new Contract(
			metricsAbi,
			metricsContractAddress,
			provider
		);
		const res: any = await metricsContract.call(
			'get_protocol_reserves',
			[],
			{
				blockIdentifier: 'pending',
			}
		);

		const protocolReserves = parseProtocolReserves(res?.protocol_reserves);
		return protocolReserves;
	} catch (e) {
		//console.log("get_protocol_reserves failed: ", e);
		return parseProtocolReserves({});
	}
}
