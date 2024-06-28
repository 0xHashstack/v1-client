import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
const {
  contractsEnv,
  metricsContractAddress,
  getTokenFromAddress,

} = require('../src/Blockchain/stark-constants')
const { RpcProvider, Contract, shortString, num,uint256 } = require('starknet')
import metricsAbi from '../src/Blockchain/abis_mainnet/metrics_abi.json'
import BigNumber from 'bignumber.js'
const { tokenDecimalsMap }= require('@/Blockchain/utils/addressServices')

const weiToEtherNumber = (amount, tokenName) => {
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

const parseAmount = (amount, decimals = 18) => {
  const factor = new BigNumber(1000000);
  const amountBN = new BigNumber( amount)
    .times(factor)
    .dividedBy(new BigNumber(10).exponentiatedBy(decimals));
    const roundedAmountBN = amountBN.decimalPlaces(8, BigNumber.ROUND_DOWN);
  return roundedAmountBN.toNumber()/factor.toNumber();
};

function parseProtocolStat(marketData, decimal) {
    let marketInfo = {
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
        getTokenFromAddress(num.toHex(marketData?.token_address))
          ?.name 
      ),
      lentAssets: weiToEtherNumber(
        uint256.uint256ToBN(marketData?.lent_assets).toString(),
        getTokenFromAddress(num.toHex(marketData?.token_address))
          ?.name 
      ),
      totalBorrow: weiToEtherNumber(
        uint256.uint256ToBN(marketData?.total_borrow).toString(),
        getTokenFromAddress(num.toHex(marketData?.token_address))
          ?.name 
      ),
      availableReserves: weiToEtherNumber(
        new BigNumber(Number(uint256.uint256ToBN(marketData?.total_supply)))
  .minus(new BigNumber(Number(uint256.uint256ToBN(marketData?.total_borrow))))
          .toString(),
        getTokenFromAddress(num.toHex(marketData?.token_address))
          ?.name 
      ),
      utilisationPerMarket: parseAmount(
        uint256.uint256ToBN(marketData?.utilisation_per_market).toString(),
        2
      ),
  
      exchangeRateRtokenToUnderlying: parseAmount(
        uint256.uint256ToBN(marketData?.exchange_rate_rToken_to_asset).toString(),
        18
      ),
      exchangeRateDTokenToUnderlying: parseAmount(
        uint256.uint256ToBN(marketData?.exchange_rate_dToken_to_asset).toString(),
        decimal
      ),
      exchangeRateUnderlyingToRtoken: parseAmount(
        uint256.uint256ToBN(marketData?.exchange_rate_asset_to_rToken).toString(),
        18
      ),
      exchangeRateUnderlyingToDtoken: parseAmount(
        uint256.uint256ToBN(marketData?.exchange_rate_asset_to_dToken).toString(),
        decimal
      ),
  
      tokenAddress: num.toHex(marketData?.token_address),
      token: getTokenFromAddress(num.toHex(marketData?.token_address))
        ?.name ,
    };
    return marketInfo;
  }

describe('Get protocol metrics', () => {
  let marketStats = []
  beforeAll(async () => {
    const provider = new RpcProvider({
      nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7',
    })
    const metricsContract = new Contract(
      metricsAbi,
      metricsContractAddress,
      provider
    )
    const promises = []
    for (let i = 0; i < contractsEnv.TOKENS.length; ++i) {
      const token = contractsEnv.TOKENS[i]

      const res = await metricsContract.call(
        'get_protocol_stats',
        [token.address],
        {
          blockIdentifier: 'pending',
        }
      )
      const val=parseProtocolStat(res?.market_info,contractsEnv.TOKENS[i]?.decimals)
      marketStats.push(val);
    }
    
  });
  it('Get protocol stats',()=>{
    expect(marketStats.length).toBe(6);
  })
  it('Check structure of marketStats objects', () => {
    marketStats.forEach((marketStat) => {
      expect(marketStat).toHaveProperty('borrowRate');
      expect(typeof marketStat.borrowRate).toBe('number');

      expect(marketStat).toHaveProperty('supplyRate');
      expect(typeof marketStat.supplyRate).toBe('number');

      expect(marketStat).toHaveProperty('stakingRate');
      expect(typeof marketStat.stakingRate).toBe('number');

      expect(marketStat).toHaveProperty('totalSupply');
      expect(typeof marketStat.totalSupply).toBe('number');

      expect(marketStat).toHaveProperty('lentAssets');
      expect(typeof marketStat.lentAssets).toBe('number');

      expect(marketStat).toHaveProperty('totalBorrow');
      expect(typeof marketStat.totalBorrow).toBe('number');

      expect(marketStat).toHaveProperty('availableReserves');
      expect(typeof marketStat.availableReserves).toBe('number');

      expect(marketStat).toHaveProperty('utilisationPerMarket');
      expect(typeof marketStat.utilisationPerMarket).toBe('number');

      expect(marketStat).toHaveProperty('exchangeRateRtokenToUnderlying');
      expect(typeof marketStat.exchangeRateRtokenToUnderlying).toBe('number');

      expect(marketStat).toHaveProperty('exchangeRateDTokenToUnderlying');
      expect(typeof marketStat.exchangeRateDTokenToUnderlying).toBe('number');

      expect(marketStat).toHaveProperty('exchangeRateUnderlyingToRtoken');
      expect(typeof marketStat.exchangeRateUnderlyingToRtoken).toBe('number');

      expect(marketStat).toHaveProperty('exchangeRateUnderlyingToDtoken');
      expect(typeof marketStat.exchangeRateUnderlyingToDtoken).toBe('number');

      expect(marketStat).toHaveProperty('tokenAddress');
      expect(typeof marketStat.tokenAddress).toBe('string');

      expect(marketStat).toHaveProperty('token');
      expect(typeof marketStat.token).toBe('string');
    });
  });
})
