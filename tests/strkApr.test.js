import { TextDecoder, TextEncoder } from 'util'
import EmpiricAbi from '../src/Blockchain/abis_mainnet/empiric_proxy.json'
import metricsAbi from '../src/Blockchain/abis_mainnet/metrics_abi.json'
import axios from 'axios'
import BigNumber from 'bignumber.js'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
const { contractsEnv,ERC20Abi,metricsContractAddress,getTokenFromAddress } = require('../src/Blockchain/stark-constants')
const { RpcProvider, Contract, shortString, num,uint256 } = require('starknet')
const { tokenDecimalsMap }= require('@/Blockchain/utils/addressServices')
const getSupplyStrkApr = (coin,strkData,oraclePrices) => {
    if (strkData == null) {
      return 0
    } else {
      if (strkData?.[coin?.name]) {
        if (oraclePrices == null) {
          return 0
        } else {
          let value = strkData?.[coin?.name]
            ? (365 *
                100 *
                strkData?.[coin?.name][strkData[coin?.name]?.length - 1]
                  ?.allocation *
                0.7 *
                oraclePrices?.find((curr) => curr.name === 'STRK')
                  ?.price) /
              strkData?.[coin?.name][strkData[coin?.name].length - 1]
                ?.supply_usd
            : 0
          return value
        }
      } else {
        return 0
      }
    }
  }

  const getBoostedAprBorrow = (coin,strkData,oraclePrices,netStrkBorrow,netSpendBalance) => {
    if (strkData == null) {
      return 0
    } else {
      if (strkData?.[coin.name]) {
        if (oraclePrices == null) {
          return 0
        } else {
          if (netStrkBorrow != 0) {
            if (netSpendBalance) {
              let value =
                (365 *
                  100 *
                  netStrkBorrow *
                  oraclePrices?.find((curr) => curr.name === 'STRK')
                    ?.price) /
                netSpendBalance
              return value
            } else {
              return 0
            }
          } else {
            return 0
          }
        }
      } else {
        return 0
      }
    }
  }

const Coins = [
    { name: 'STRK', icon: 'mdi-strk', symbol: 'STRK' },
    { name: 'USDT', icon: 'mdi-bitcoin', symbol: 'USDT' },
    { name: 'USDC', icon: 'mdi-ethereum', symbol: 'USDC' },
    { name: 'ETH', icon: 'mdi-ethereum', symbol: 'WETH' },
    // { name: 'BTC', icon: 'mdi-bitcoin', symbol: 'WBTC' },
    // { name: 'DAI', icon: 'mdi-dai', symbol: 'DAI' },
  ]

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

  const parseAmount = (amount, decimals = 18) => {
    const factor = new BigNumber(1000000);
    const amountBN = new BigNumber( amount)
      .times(factor)
      .dividedBy(new BigNumber(10).exponentiatedBy(decimals));
      const roundedAmountBN = amountBN.decimalPlaces(8, BigNumber.ROUND_DOWN);
    return roundedAmountBN.toNumber()/factor.toNumber();
  };

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

describe('get strk aprs', () => {
  let prices = [];
  let spendBalances=[];
  let netbalance = 0;
  let marketStats = [];
  let netstrkBorrow=[];

  beforeAll(async () => {
    const MEDIAN_AGGREGATION_MODE = shortString.encodeShortString('MEDIAN')
    const provider = new RpcProvider({
      nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7',
    })
    const empiricContract = new Contract(
      EmpiricAbi.abi,
      contractsEnv.EMPIRIC_PROXY_ADDRESS,
      provider
    )

    for (let i = 0; i < contractsEnv.TOKENS.length; ++i) {
      const token = contractsEnv.TOKENS[i]
      const result = await empiricContract.call('get_spot', [
        token.pontis_key,
        MEDIAN_AGGREGATION_MODE,
      ])

      const price = num.toBigInt(result.price.toString())
      const decimals = num.toBigInt(result.decimals.toString())
      const last_updated_timestamp = num.toBigInt(
        result.last_updated_timestamp.toString()
      )
      const lastUpdated = new Date(Number(last_updated_timestamp) * 1000)

      const oraclePrice = {
        name: token.name,
        address: token.address,
        price: (Number(price) * 100) / Math.pow(10, Number(decimals)) / 100,
        lastUpdated,
      }

      prices.push(oraclePrice)

      const metricsContract = new Contract(
        metricsAbi,
        metricsContractAddress,
        provider
      )
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
    }
  }, 30000)
  it('should display prices', () => {
    expect(prices.length).toBe(6)
  }, 20000)

  it('Checks for supply strk apr',async()=>{
    const strkData=await axios.get('https://kx58j6x5me.execute-api.us-east-1.amazonaws.com/starknet/fetchFile?file=prod-api/lending/lending_strk_grant.json');
    if(strkData){
        for(var i=0;i<Coins.length;i++){
            const val=getSupplyStrkApr(Coins[i],strkData?.data?.Hashstack,prices);
            expect(val).toBeGreaterThan(0);
        }
    }
  },20000)

  it('Check for spend balances and net spend balance',async()=>{
    const provider = new RpcProvider({
        nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7',
      })
    for(let i=0;i<contractsEnv.TOKENS.length;i++){
        const token=contractsEnv.TOKENS[i];
        const contract = new Contract(ERC20Abi, token?.address, provider);
        const res = await contract.call("balanceOf", [token?.dToken], {
            blockIdentifier: "pending",
          });
          const spendValue={
            token:contractsEnv.TOKENS[i]?.name,
            balance: parseAmount(
                uint256.uint256ToBN(res?.balance).toString(),
                contractsEnv?.TOKENS[i]?.decimals
              ),
          }
          spendBalances.push(spendValue);
    }
    if(spendBalances.length===6){
        for(var i=0;i<spendBalances.length;i++){
            if (
                spendBalances[i].token == 'BTC' ||
                spendBalances[i].token == 'DAI'
              ) {
                let value = 0
                netbalance += value
              } else {
                let value =
                  (marketStats[i]?.totalBorrow - spendBalances[i]?.balance) *
                  prices[i].price
                netbalance += value
              }
        }
    }
    expect(spendBalances.length).toBe(6);
    expect(netbalance).toBeGreaterThan(0);


  },20000)

  it('Check for borrow apr',async()=>{
    let netallocation=0;
    const res=await axios.get('https://kx58j6x5me.execute-api.us-east-1.amazonaws.com/starknet/fetchFile?file=prod-api/lending/lending_strk_grant.json');
    const strkData={ ...res.data.Hashstack }
    if(strkData){
        for (let token in strkData) {
            if (strkData.hasOwnProperty(token)) {
              const array = strkData[token]
              const lastObject = array[array.length - 1]
              netallocation += 0.3 * (lastObject?.allocation ?lastObject?.allocation:0)
            }
          }
          netstrkBorrow=netallocation; 
           for(var i=0;i<Coins.length;i++){
               const val=getBoostedAprBorrow(Coins[i],strkData,prices,netstrkBorrow,netbalance);
                expect(val).toBeGreaterThan(0);
      
          }
    }



  },20000)





})
