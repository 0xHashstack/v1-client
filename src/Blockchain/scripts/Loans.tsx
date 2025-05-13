import { Contract, num, number, uint256 } from 'starknet';
import {
	diamondAddress,
	getDTokenFromAddress,
	getProvider,
	getRTokenFromAddress,
	getTokenFromAddress,
} from '../stark-constants';
// import routerAbi from "@/Blockchain/abis_upgrade/router_abi.json";
import routerAbi from '@/Blockchain/abis_mainnet/router_abi.json';
// import routerAbi from "@/Blockchain/abi_new/router_abi.json";
import { BNtoNum, weiToEtherNumber } from '../utils/utils';
import { ILoan, NativeToken, RToken, Token } from '../interfaces/interfaces';

function parseLoansData(loansData: any, collateralsData: any): ILoan[] {
	const loans: ILoan[] = [];
	for (let i = 0; i < loansData?.length; ++i) {
		let loanData = loansData[i];
		let collateralData = collateralsData[i];
		let loan: ILoan = {
			loanId: Number(BNtoNum(loanData?.loan_id, 0)),
			borrower: number.toHex(loanData?.borrower),

			loanMarket: getDTokenFromAddress(number.toHex(loanData?.market))
				?.name as any,
			loanMarketAddress: number.toHex(loanData?.market),
			underlyingMarket: getTokenFromAddress(
				getDTokenFromAddress(number.toHex(loanData?.market))
					?.underlying_asset || ''
			)?.name as NativeToken,
			underlyingMarketAddress: getDTokenFromAddress(
				number.toHex(loanData?.market)
			)?.underlying_asset,
			currentLoanMarket: getTokenFromAddress(
				number.toHex(loanData?.current_market)
			)?.name, // Borrow market(current)
			currentLoanMarketAddress: number.toHex(loanData?.current_market),
			collateralMarket: getRTokenFromAddress(
				number.toHex(collateralData?.collateral_token)
			)?.name as RToken, //  Collateral Market
			collateralMarketAddress: number.toHex(
				collateralData?.collateral_token
			),

			loanAmount: uint256.uint256ToBN(loanData?.amount).toString(), //  Amount
			loanAmountParsed: weiToEtherNumber(
				uint256.uint256ToBN(loanData?.amount).toString(),
				getDTokenFromAddress(number.toHex(loanData?.market))
					?.name as Token
			),

			currentLoanAmount: uint256
				.uint256ToBN(loanData?.current_amount)
				.toString(), //  Amount
			currentLoanAmountParsed: weiToEtherNumber(
				uint256.uint256ToBN(loanData?.current_amount).toString(),
				getTokenFromAddress(number.toHex(loanData?.current_market))
					?.name as Token
			),

			collateralAmount: uint256
				.uint256ToBN(collateralData?.amount)
				.toString(), // 5 Collateral Amount
			collateralAmountParsed: weiToEtherNumber(
				uint256.uint256ToBN(collateralData?.amount).toString(),
				getRTokenFromAddress(
					number.toHex(collateralData?.collateral_token)
				)?.name as Token
			),

			createdAt: new Date(Number(loanData?.created_at)),

			loanState:
				num.toBigInt(loanData?.state).toString() === '1' ? 'ACTIVE'
				: num.toBigInt(loanData?.state).toString() === '2' ? 'SPENT'
				: num.toBigInt(loanData?.state).toString() === '3' ? 'REPAID'
				: num.toBigInt(loanData?.state).toString() === '4' ?
					'LIQUIDATED'
				:	null,

			l3App:
				(
					num.toBigInt(loanData?.l3_integration).toString() ===
					'1962660952167394271600'
				) ?
					'JEDI_SWAP'
				: (
					num.toBigInt(loanData?.l3_integration).toString() ===
					'30814223327519088'
				) ?
					'MY_SWAP'
				: (
					num.toBigInt(loanData?.l3_integration).toString() ===
					'134601798676068'
				) ?
					'ZKLEND'
				: (
					num.toBigInt(loanData?.l3_integration).toString() ===
					'30814223327519089'
				) ?
					'YAGI'
				:	'NONE',
			spendType:
				num.toBigInt(loanData?.l3_category).toString() === '0' ?
					'UNSPENT'
				: num.toBigInt(loanData?.l3_category).toString() === '1' ?
					'SWAP'
				: num.toBigInt(loanData?.l3_category).toString() === '2' ?
					'LIQUIDITY'
				:	null,

			state: num.toBigInt(loanData?.state).toString(),
			l3_integration: num.toBigInt(loanData?.l3_integration).toString(),
			l3_category: num.toBigInt(loanData?.l3_category).toString(),
		};
		loans.push(JSON.parse(JSON.stringify(loan)));
	}
	////console.log("loans parsed", loans);
	return loans;
}

export async function getUserLoans(account: string) {
	const provider = getProvider();
	try {
		////console.log("loans params", diamondAddress, account);
		const routerContract = new Contract(
			routerAbi,
			diamondAddress,
			provider
		);
		const res: any = await routerContract.call(
			'get_user_loans',
			[account],
			{
				blockIdentifier: 'pending',
			}
		);
		////console.log(res, "loans called");
		return parseLoansData(res?.loans, res?.collaterals);
	} catch (error) {
		console.log(error, 'err in loans');
	}
}
