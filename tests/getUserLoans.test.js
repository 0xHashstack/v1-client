import BigNumber from 'bignumber.js'
import { TextDecoder, TextEncoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

const routerAbi = require('../src/Blockchain/abis_mainnet/router_abi.json')
const {
  diamondAddress,
  getDTokenFromAddress,
  getRTokenFromAddress,
  getTokenFromAddress,
} =require( '../src/Blockchain/stark-constants')
const { tokenDecimalsMap,tokenAddressMap }= require('@/Blockchain/utils/addressServices')
const { Contract, RpcProvider, uint256, num } = require('starknet')

// export const BNtoNum = (value, decimal = 18) => {
//   const val = new value.shiftedBy(-decimal)
//   return val < 1 ? val.toPrecision() : fixedSpecial(val, 0).toFixed(4)
// }

export const weiToEtherNumber = (amount, tokenName) => {
  const decimals = tokenDecimalsMap[tokenName];
  if (!decimals) {
    return 0;
  } // @todo should avoid using 18 default
  const factor = new BigNumber(1000000);
  const amountBN = new BigNumber(amount)
    .times(factor)
    .dividedBy(new BigNumber(10).exponentiatedBy(decimals));
    const result = amountBN.dividedBy(factor).toNumber();
    const truncatedResult = Math.trunc(result * 1e6) / 1e6; // Keep six digits after the decimal point without rounding
    return truncatedResult;;
};

function parseLoansData(loansData, collateralsData) {
  const loans = []

  for (let i = 0; i < loansData?.length; ++i) {
    let loanData = loansData[i]
    let collateralData = collateralsData[i]
    let loan = {
      loanId: Number(loanData?.loan_id, 0),
      borrower: num.toHex(loanData?.borrower),

      loanMarket: getDTokenFromAddress(num.toHex(loanData?.market))?.name,
      loanMarketAddress: num.toHex(loanData?.market),
      underlyingMarket: getTokenFromAddress(
        getDTokenFromAddress(num.toHex(loanData?.market))
          ?.underlying_asset || ''
      )?.name,
      underlyingMarketAddress: getDTokenFromAddress(
        num.toHex(loanData?.market)
      )?.underlying_asset,
      currentLoanMarket: getTokenFromAddress(
        num.toHex(loanData?.current_market)
      )?.name, // Borrow market(current)
      currentLoanMarketAddress: num.toHex(loanData?.current_market),
      collateralMarket: getRTokenFromAddress(
        num.toHex(collateralData?.collateral_token)
      )?.name, //  Collateral Market
      collateralMarketAddress: num.toHex(collateralData?.collateral_token),

      loanAmount: uint256.uint256ToBN(loanData?.amount).toString(), //  Amount
      loanAmountParsed: weiToEtherNumber(
        uint256.uint256ToBN(loanData?.amount).toString(),
        getDTokenFromAddress(num.toHex(loanData?.market))?.name
      ),

      currentLoanAmount: uint256
        .uint256ToBN(loanData?.current_amount)
        .toString(), //  Amount
      currentLoanAmountParsed: weiToEtherNumber(
        uint256.uint256ToBN(loanData?.current_amount).toString(),
        getTokenFromAddress(num.toHex(loanData?.current_market))?.name
      ),

      collateralAmount: uint256.uint256ToBN(collateralData?.amount).toString(), // 5 Collateral Amount
      collateralAmountParsed: weiToEtherNumber(
        uint256.uint256ToBN(collateralData?.amount).toString(),
        getRTokenFromAddress(num.toHex(collateralData?.collateral_token))
          ?.name
      ),

      createdAt: new Date(Number(loanData?.created_at)),

      loanState:
        num.toBigInt(loanData?.state).toString() === '1'
          ? 'ACTIVE'
          : num.toBigInt(loanData?.state).toString() === '2'
            ? 'SPENT'
            : num.toBigInt(loanData?.state).toString() === '3'
              ? 'REPAID'
              : num.toBigInt(loanData?.state).toString() === '4'
                ? 'LIQUIDATED'
                : null,

      l3App:
        num.toBigInt(loanData?.l3_integration).toString() ===
        '1962660952167394271600'
          ? 'JEDI_SWAP'
          : num.toBigInt(loanData?.l3_integration).toString() ===
              '30814223327519088'
            ? 'MY_SWAP'
            : num.toBigInt(loanData?.l3_integration).toString() ===
                '134601798676068'
              ? 'ZKLEND'
              : num.toBigInt(loanData?.l3_integration).toString() ===
                  '30814223327519089'
                ? 'YAGI'
                : 'NONE',
      spendType:
        num.toBigInt(loanData?.l3_category).toString() === '0'
          ? 'UNSPENT'
          : num.toBigInt(loanData?.l3_category).toString() === '1'
            ? 'SWAP'
            : num.toBigInt(loanData?.l3_category).toString() === '2'
              ? 'LIQUIDITY'
              : null,

      state: num.toBigInt(loanData?.state).toString(),
      l3_integration: num.toBigInt(loanData?.l3_integration).toString(),
      l3_category: num.toBigInt(loanData?.l3_category).toString(),
    }
    loans.push(JSON.parse(JSON.stringify(loan)))
  }

  return loans
}

describe('Get user loans', () => {
  it('displays user loans', async () => {
    const provider = new RpcProvider({
      nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7',
    })

    const routerContract = new Contract(routerAbi, diamondAddress, provider)
    const res = await routerContract.call('get_user_loans', ['0x05970da1011e2f8dc15bc12fc1b0eb8e382300a334de06ad17d1404384b168e4'], {
      blockIdentifier: 'pending',
    })

    const loans = parseLoansData(res?.loans, res?.collaterals)
    console.log(loans, 'loans-----------------------')
  }, 10000)
})
