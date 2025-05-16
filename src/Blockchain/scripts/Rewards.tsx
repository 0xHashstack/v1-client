import { Contract, number, uint256 } from 'starknet';

// import stakingAbi from "../abis_upgrade/staking_abi.json";
// import supplyABI from "../abis_upgrade/supply_abi.json";
// import governorAbi from "../abis_upgrade/governor_abi.json";
import stakingAbi from '../abis_mainnet/staking_abi.json';
import supplyABI from '../abis_mainnet/supply_abi.json';
import governorAbi from '../abis_mainnet/governor_abi.json';
import comptrollerAbi from '../abis_mainnet/comptroller_abi.json';
import nftAbi from '../abis_mainnet/nft_soul_abi.json';
import borrowTokenAbi from '../abis_mainnet/dToken_abi.json';
import claimStrkabi from '../abis_mainnet/claim_strk_abi.json';
import {
	diamondAddress,
	getProvider,
	stakingContractAddress,
	nftAddress,
	governorAddress,
	comptrollerAddress,
} from '../stark-constants';
import { tokenAddressMap, tokenDecimalsMap } from '../utils/addressServices';
import { etherToWeiBN, parseAmount } from '../utils/utils';
// import { useContractWrite } from "@starknet-react/core";
import { useState } from 'react';
import { RToken } from '../interfaces/interfaces';
import { useAccount } from '@starknet-react/core';
// const { address } = useAccount();
interface ResultObject {
	[key: string]: any;
}
export async function getrTokensMinted(rToken: any, amount: any) {
	////console.log("getRtokensminted", rToken, amount);

	try {
		const provider = getProvider();
		const supplyContract = new Contract(
			supplyABI,
			tokenAddressMap[rToken],
			provider
		);
		////console.log("Called")
		////console.log(supplyContract,"suppply contract")
		const parsedAmount = etherToWeiBN(amount, rToken).toString();
		////console.log(parsedAmount, "parsed amount");
		const res: any = await supplyContract.call(
			'preview_deposit',
			[uint256.bnToUint256(parsedAmount)],
			{
				blockIdentifier: 'pending',
			}
		);
		////console.log(res, "data in rewards");
		const data = parseAmount(
			uint256.uint256ToBN(res?.shares).toString(),
			tokenDecimalsMap[rToken]
		);
		////console.log(
		//     parseAmount(
		//         uint256.uint256ToBN(res?.shares).toString(),
		//         tokenDecimalsMap[rToken]
		//     )
		// );
		const ans = data.toFixed(2);
		return ans;
	} catch (err) {
		//console.log(err,"err in rewards");
	}
}

export async function getSupplyunlocked(rToken: any, amount: any) {
	try {
		const provider = getProvider();
		const supplyContract = new Contract(
			supplyABI,
			tokenAddressMap[rToken],
			provider
		);
		const parsedAmount = etherToWeiBN(amount, rToken).toString();
		const res: any = await supplyContract.call(
			'preview_redeem',
			[uint256.bnToUint256(parsedAmount)],
			{
				blockIdentifier: 'pending',
			}
		);
		////console.log(res, "data in est supply");
		const data = parseAmount(
			uint256.uint256ToBN(res?.asset_amount_to_withdraw).toString(),
			tokenDecimalsMap[rToken]
		);
		////console.log(parseAmount(uint256.uint256ToBN(res?.asset_amount_to_withdraw).toString(),8),"parsed")
		return data.toFixed(2);
	} catch (err) {
		//console.log(err, "err in getSupplyUnlocked");
	}
}
export async function getEstrTokens(rToken: any, amount: any) {
	try {
		const provider = getProvider();
		const stakingContract = new Contract(
			stakingAbi,
			stakingContractAddress,
			provider
		);
		// const parsedAmount=etherToWeiBN(amount,rToken).toString();
		////console.log(amount,"stake amount")
		////console.log(stakingContract, "staking contract")
		const parsedAmount = etherToWeiBN(amount, rToken).toString();
		////console.log(parsedAmount,"amount in staking")
		const res: any = await stakingContract.call(
			'preview_redeem',
			[tokenAddressMap[rToken], uint256.bnToUint256(parsedAmount)],
			{
				blockIdentifier: 'pending',
			}
		);
		const data = parseAmount(
			uint256.uint256ToBN(res?.rToken_amount_to_withdraw).toString(),
			tokenDecimalsMap[rToken]
		);
		////console.log(data, "call in stake");
		return data;
	} catch (err) {
		//console.log(err, "err in est rtokens staking");
	}
}
export async function getFees(modalFees: any) {
	try {
		const provider = getProvider();
		const governorContract = new Contract(
			comptrollerAbi,
			comptrollerAddress,
			provider
		);
		const result: any = await governorContract.call(modalFees);
		const res = result?.fees;
		return Number(res.toString()) / 100;
	} catch (err) {
		//console.log(err,"err in getFees")
	}
}
export async function getNFTMaxAmount() {
	try {
		const provider = getProvider();
		const nftContract = new Contract(nftAbi?.abi, nftAddress, provider);
		const result: any = await nftContract.call('get_max_nft_amount');

		const res = (result?.number).toString();
		return res;
	} catch (err) {
		//console.log(err,"err in getNFTMaxAmount")
	}
}
export async function getCurrentNftAmount() {
	try {
		const provider = getProvider();
		const nftContract = new Contract(nftAbi?.abi, nftAddress, provider);
		const result: any = await nftContract.call('get_current_nft_minted');
		const res = parseAmount(
			uint256.uint256ToBN(result?.number).toString(),
			0
		);
		return res;
	} catch (err) {
		//console.log(err,"err in getNFTCurrentAmount")
	}
}
export async function getNFTBalance(address: string) {
	try {
		const provider = getProvider();
		const nftContract = new Contract(nftAbi?.abi, nftAddress, provider);
		const result: any = await nftContract.call('balanceOf', [address], {
			blockIdentifier: 'pending',
		});
		const res = parseAmount(
			uint256.uint256ToBN(result?.balance).toString(),
			0
		);
		return res;
	} catch (err) {
		//console.log(err,"err in getNFTBalance")
	}
}
export async function getSupportedPools(poolPairAddress: any, dapp: any) {
	////console.log("getMinimumDepositAmount called - ", rTokenAddress);
	try {
		const provider = getProvider();
		const governorContract = new Contract(
			governorAbi,
			governorAddress,
			provider
		);
		const result: any = await governorContract.call(
			'get_secondary_market_support',
			[poolPairAddress, dapp],
			{ blockIdentifier: 'pending' }
		);
		const data = result?.secondary_market?.supported.toString();
		////console.log("getPoolsSupported ", result?.secondary_market?.supported.toString(),data);
		return data;
	} catch (err) {
		//console.log(err, "err in getPoolsSupporte");
	}
}
export async function getMinimumDepositAmount(rToken: any) {
	////console.log("getMinimumDepositAmount called - ", rTokenAddress);
	try {
		const provider = getProvider();
		const governorContract = new Contract(
			governorAbi,
			governorAddress,
			provider
		);
		const result: any = await governorContract.call(
			'get_minimum_deposit_amount',
			[tokenAddressMap[rToken]],
			{ blockIdentifier: 'pending' }
		);
		const res = parseAmount(
			uint256.uint256ToBN(result?._get_minimum_deposit_amount).toString(),
			tokenDecimalsMap[rToken]
		);
		////console.log("getPoolsSupported ", result?.secondary_market?.supported.toString(),data);
		return res;
	} catch (err) {
		//console.log(err, "err in getMinimumDeposit");
	}
}
export async function getMaximumDepositAmount(rToken: any) {
	////console.log("getMinimumDepositAmount called - ", rTokenAddress);
	try {
		const provider = getProvider();
		const governorContract = new Contract(
			governorAbi,
			governorAddress,
			provider
		);
		const result: any = await governorContract.call(
			'get_maximum_deposit_amount',
			[tokenAddressMap[rToken]],
			{ blockIdentifier: 'pending' }
		);
		const res = parseAmount(
			uint256.uint256ToBN(result?._get_maximum_deposit_amount).toString(),
			tokenDecimalsMap[rToken]
		);
		////console.log("getPoolsSupported ", result?.secondary_market?.supported.toString(),data);
		return res;
	} catch (err) {
		//console.log(err, "err in getMaximumDeposit");
	}
}
export async function getMaximumLoanAmount(dToken: any) {
	////console.log("getMinimumDepositAmount called - ", rTokenAddress);
	try {
		const provider = getProvider();
		const governorContract = new Contract(
			governorAbi,
			governorAddress,
			provider
		);
		const result: any = await governorContract.call(
			'get_maximum_loan_amount',
			[tokenAddressMap[dToken]],
			{ blockIdentifier: 'pending' }
		);
		const res = parseAmount(
			uint256.uint256ToBN(result?._get_maximum_loan_amount).toString(),
			tokenDecimalsMap[dToken]
		);
		////console.log("getPoolsSupported ", result?.secondary_market?.supported.toString(),data);
		return res;
	} catch (err) {
		//console.log(err, "err in getMaximumDeposit");
	}
}
export async function getMaximumDynamicLoanAmount(
	amount: any,
	borrowMarket: any,
	collateralMarket: any
) {
	////console.log("getMinimumDepositAmount called - ", rTokenAddress);
	try {
		const provider = getProvider();
		const borrowToken = new Contract(
			borrowTokenAbi,
			tokenAddressMap['d' + borrowMarket],
			provider
		);
		const parsedAmount = etherToWeiBN(amount, borrowMarket).toString();
		const result: any = await borrowToken.call(
			'max_loan_limit',
			[
				uint256.bnToUint256(parsedAmount),
				tokenAddressMap[borrowMarket],
				tokenAddressMap[collateralMarket],
			],
			{ blockIdentifier: 'pending' }
		);
		const res: any = parseAmount(
			uint256.uint256ToBN(result?.max_loan_limit).toString(),
			tokenDecimalsMap[borrowMarket]
		);
		// const res = parseAmount(
		//   uint256.uint256ToBN(result?._get_maximum_loan_amount).toString(),
		//   tokenDecimalsMap[dToken]
		// );
		return res;
	} catch (err) {
		console.log(err, 'err in getMaximumDynamicDeposit');
	}
}
export async function getMinimumLoanAmount(dToken: any) {
	console.log({ dToken: tokenAddressMap[dToken] });
	////console.log("getMinimumDepositAmount called - ", rTokenAddress);
	try {
		const provider = getProvider();
		const governorContract = new Contract(
			governorAbi,
			governorAddress,
			provider
		);

		const result: any = await governorContract.call(
			'get_minimum_loan_amount',
			[tokenAddressMap[dToken]],
			{ blockIdentifier: 'pending' }
		);
		console.log({ result1: result });
		const res = parseAmount(
			uint256.uint256ToBN(result?._get_minimum_loan_amount).toString(),
			tokenDecimalsMap[dToken]
		);
		////console.log("getPoolsSupported ", result?.secondary_market?.supported.toString(),data);
		return res;
	} catch (err) {
		console.log(err, 'err in getMinimumLoanAmount');
		//console.log(err, "err in getMaximumDeposit");
	}
}

export async function getUserStakingShares(address: string, tokenName: RToken) {
	try {
		const provider = getProvider();
		const stakingContract = new Contract(
			stakingAbi,
			stakingContractAddress,
			provider
		);
		const result: any = await stakingContract.call(
			'get_user_staking_shares',
			[address, tokenAddressMap[tokenName]]
		);
		const res = parseAmount(
			uint256.uint256ToBN(result?.user_staking_share).toString(),
			tokenDecimalsMap[tokenName]
		);
		////console.log("getUserStakingShares ", res);
		return res;
	} catch (err) {
		//console.log(err,"err in getUserStakingShares")
	}
}

export async function getUserSTRKClaimedAmount(address: string) {
	try {
		const provider = getProvider();
		const strkContract = new Contract(
			claimStrkabi,
			'0x02e20db0cd0af6739ff3e3003ea6932409867040b227bf9ba822239e5ba0dcaf',
			provider
		);
		const result: any = await strkContract.call('amount_already_claimed', [
			address,
		]);
		const res = parseAmount(result.toString(), tokenDecimalsMap['STRK']);
		////console.log("getUserStakingShares ", res);
		return res;
	} catch (err) {
		console.log(err, 'err in getUserSTRKClaimedAmount');
	}
}

// const userTokensMinted=()=>{
//     const [rToken1, setRToken1] = useState<RToken>("rUSDT");
//     const [rTokenAmount1, setRTokenAmount1] = useState<number>(20.0);
//     // const { address: owner } = useAccount();
//     const {
//                     data: dataStakeRequest1,
//                     error: errorStakeRequest1,
//                     reset: resetStakeRequest1,
//                     write: writeStakeRequest1,
//                     writeAsync: writeAsyncStakeRequest1,
//                     isError: isErrorStakeRequest1,
//                     isIdle: isIdleStakeRequest1,
//                     isLoading: isLoadingStakeRequest1,
//                     isSuccess: isSuccessStakeRequest1,
//                     status: statusStakeRequest1,
//                   } = useContractWrite({
//                     calls: [
//                       {
//                         contractAddress: "0x73e84ffcc178373b80cf2109d0e9beb93da9710d32a93a45eeeada957c133bd",
//                         entrypoint: "preview_redeem",
//                         calldata: [
//                             tokenAddressMap[rToken1],
//                           etherToWeiBN(rTokenAmount1, rToken1).toString(),
//                           "0",
//                         ],
//                       },
//                     ],
//                   });
//                 ////console.log(dataStakeRequest1,"data estrtokens")
//                 return {
//                     rToken1,
//                     setRToken1,
//                     rTokenAmount1,
//                     setRTokenAmount1,
//                     dataStakeRequest1,
//                     errorStakeRequest1,
//                     resetStakeRequest1,
//                     writeStakeRequest1,
//                     writeAsyncStakeRequest1,
//                     isErrorStakeRequest1,
//                     isIdleStakeRequest1,
//                     isLoadingStakeRequest1,
//                     isSuccessStakeRequest1,
//                     statusStakeRequest1,
//                   };
// }
// export default userTokensMinted;
