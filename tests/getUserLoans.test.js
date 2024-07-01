import { TextDecoder, TextEncoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

import routerAbi from '../src/Blockchain/abis_mainnet/router_abi.json'
import {
  diamondAddress,
  getDTokenFromAddress,
  getRTokenFromAddress,
  getTokenFromAddress,
} from '../src/Blockchain/stark-constants'
import { BNtoNum, weiToEtherNumber } from '../src/Blockchain/utils/utils'

const { Contract, RpcProvider, uint256, num, number } = require('starknet')

function parseLoansData(loansData, collateralsData) {
  const loans = []

  for (let i = 0; i < loansData?.length; ++i) {
    let loanData = loansData[i]
    let collateralData = collateralsData[i]
    let loan = {
      loanId: Number(BNtoNum(loanData?.loan_id, 0)),
      borrower: number.toHex(loanData?.borrower),

      loanMarket: getDTokenFromAddress(number.toHex(loanData?.market))?.name,
      loanMarketAddress: number.toHex(loanData?.market),
      underlyingMarket: getTokenFromAddress(
        getDTokenFromAddress(number.toHex(loanData?.market))
          ?.underlying_asset || ''
      )?.name,
      underlyingMarketAddress: getDTokenFromAddress(
        number.toHex(loanData?.market)
      )?.underlying_asset,
      currentLoanMarket: getTokenFromAddress(
        number.toHex(loanData?.current_market)
      )?.name, // Borrow market(current)
      currentLoanMarketAddress: number.toHex(loanData?.current_market),
      collateralMarket: getRTokenFromAddress(
        number.toHex(collateralData?.collateral_token)
      )?.name, //  Collateral Market
      collateralMarketAddress: number.toHex(collateralData?.collateral_token),

      loanAmount: uint256.uint256ToBN(loanData?.amount).toString(), //  Amount
      loanAmountParsed: weiToEtherNumber(
        uint256.uint256ToBN(loanData?.amount).toString(),
        getDTokenFromAddress(number.toHex(loanData?.market))?.name
      ),

      currentLoanAmount: uint256
        .uint256ToBN(loanData?.current_amount)
        .toString(), //  Amount
      currentLoanAmountParsed: weiToEtherNumber(
        uint256.uint256ToBN(loanData?.current_amount).toString(),
        getTokenFromAddress(number.toHex(loanData?.current_market))?.name
      ),

      collateralAmount: uint256.uint256ToBN(collateralData?.amount).toString(), // 5 Collateral Amount
      collateralAmountParsed: weiToEtherNumber(
        uint256.uint256ToBN(collateralData?.amount).toString(),
        getRTokenFromAddress(number.toHex(collateralData?.collateral_token))
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
    const accountAddress =
      '0x05d3a8f378500497479d3a16cfcd54657246dc37da8270b52e49319fac139939'

    const provider = new RpcProvider({
      nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7',
    })

    const routerContract = new Contract(routerAbi, diamondAddress, provider)
    const res = await routerContract.call('get_user_loans', [account], {
      blockIdentifier: 'pending',
    })

    const loans = parseLoansData(res?.loans, res?.collaterals)
    console.log(loans, 'loans-----------------------')
  }, 10000)
})
