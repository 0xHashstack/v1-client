import { TextDecoder, TextEncoder } from 'util'
import EmpiricAbi from '../src/Blockchain/abis_mainnet/empiric_proxy.json'
import axios from 'axios'
import BigNumber from 'bignumber.js'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
const { contractsEnv,ERC20Abi } = require('../src/Blockchain/stark-constants')
const { RpcProvider, Contract, shortString, num,uint256 } = require('starknet')

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

const Coins = [
    { name: 'STRK', icon: 'mdi-strk', symbol: 'STRK' },
    { name: 'USDT', icon: 'mdi-bitcoin', symbol: 'USDT' },
    { name: 'USDC', icon: 'mdi-ethereum', symbol: 'USDC' },
    { name: 'ETH', icon: 'mdi-ethereum', symbol: 'WETH' },
    // { name: 'BTC', icon: 'mdi-bitcoin', symbol: 'WBTC' },
    // { name: 'DAI', icon: 'mdi-dai', symbol: 'DAI' },
  ]

  const parseAmount = (amount, decimals = 18) => {
    const factor = new BigNumber(1000000);
    const amountBN = new BigNumber( amount)
      .times(factor)
      .dividedBy(new BigNumber(10).exponentiatedBy(decimals));
      const roundedAmountBN = amountBN.decimalPlaces(8, BigNumber.ROUND_DOWN);
    return roundedAmountBN.toNumber()/factor.toNumber();
  };

describe('get strk aprs', () => {
  let prices = [];
  let spendBalances=[];

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
    }
  }, 20000)
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

  it('Check for net spend balances',async()=>{
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
    expect(spendBalances.length).toBe(6);
  },20000)

  

})
