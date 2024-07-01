import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const {
  contractsEnv,
  metricsContractAddress,
  getTokenFromAddress,
  diamondAddress,
} = require('../src/Blockchain/stark-constants');
const { tokenDecimalsMap,tokenAddressMap }= require('@/Blockchain/utils/addressServices')
const { RpcProvider, Contract, shortString, num, uint256 } = require('starknet');
import governorAbi from '../src/Blockchain/abis_mainnet/governor_abi.json'
import BigNumber from 'bignumber.js';

describe('Get supported pools',()=>{
    const poolsPairsMainnet=[
        {
          address:
            '0x5801bdad32f343035fb242e98d1e9371ae85bc1543962fedea16c59b35bd19b',
          keyvalue: 'USDC/USDT',
        },
        {
          address:
            '0x45e7131d776dddc137e30bdd490b431c7144677e97bf9369f629ed8d3fb7dd6',
          keyvalue: 'ETH/USDT',
        },
        {
          address:
            '0x260e98362e0949fefff8b4de85367c035e44f734c9f8069b6ce2075ae86b45c',
          keyvalue: 'BTC/ETH',
        },
        {
          address:
            '0x4d0390b777b424e43839cd1e744799f3de6c176c7e32c1812a41dbd9c19db6a',
          keyvalue: 'ETH/USDC',
        },
        {
          address:
            '0x7e2a13b40fc1119ec55e0bcf9428eedaa581ab3c924561ad4e955f95da63138',
          keyvalue: 'DAI/ETH',
        },
        {
          address:
            '0x44d13ad98a46fd2322ef2637e5e4c292ce8822f47b7cb9a1d581176a801c1a0',
          keyvalue: 'BTC/USDT',
        },
        {
          address:
            '0x5a8054e5ca0b277b295a830e53bd71a6a6943b42d0dbb22329437522bc80c8',
          keyvalue: 'BTC/USDC',
        },
        {
          address:
            '0x39c183c8e5a2df130eefa6fbaa3b8aad89b29891f6272cb0c90deaa93ec6315',
          keyvalue: 'BTC/DAI',
        },
        {
          address:
            '0xf0f5b3eed258344152e1f17baf84a2e1b621cd754b625bec169e8595aea767',
          keyvalue: 'USDT/DAI',
        },
        {
          address:
            '0xcfd39f5244f7b617418c018204a8a9f9a7f72e71f0ef38f968eeb2a9ca302b',
          keyvalue: 'USDC/DAI',
        },
        {
          address:
            '0x2ed66297d146ecd91595c3174da61c1397e8b7fcecf25d423b1ba6717b0ece9',
          keyvalue: 'STRK/ETH',
        },
      ]
      let totalCount=0;
      let totalCountMyswap=0;
      const mySwapPoolPairsMainnet = [
        {
          address:
            '0x1ea237607b7d9d2e9997aa373795929807552503683e35d8739f4dc46652de1',
          keyvalue: 'USDC/USDT',
        },
        {
          address:
            '0x41f9a1e9a4d924273f5a5c0c138d52d66d2e6a8bee17412c6b0f48fe059ae04',
          keyvalue: 'ETH/USDT',
        },
        {
          address:
            '0x22b05f9396d2c48183f6deaf138a57522bcc8b35b67dee919f76403d1783136',
          keyvalue: 'ETH/USDC',
        },
        {
          address:
            '0x7c662b10f409d7a0a69c8da79b397fd91187ca5f6230ed30effef2dceddc5b3',
          keyvalue: 'DAI/ETH',
        },
        {
          address:
            '0x393d6cbf933e7ecc819a74cf865fce148b237004954e49c118773cdd0e84ab9',
          keyvalue: 'BTC/USDT',
        },
      ]
    it('Get jediswap supported pools',async()=>{
        const provider = new RpcProvider({
            nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7',
          });
          for(var i=0;i<poolsPairsMainnet.length;i++){
              const governorContract = new Contract(
                governorAbi,
                diamondAddress,
                provider
              );
              const result = await governorContract.call(
                "get_secondary_market_support",
                [poolsPairsMainnet[i].address,'1962660952167394271600'],
                { blockIdentifier: "pending" }
              );
              const data = result?.secondary_market?.supported.toString()
              if(data==='1'){
                totalCount++;
              }
              ////console.log("getPoolsSupported ", result?.secondary_market?.supported.toString(),data);
          }
          expect(totalCount).toBe(6);
    }, 20000)
    it('Get myswap supported pools',async()=>{
      const provider = new RpcProvider({
          nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7',
        });
        for(var i=0;i<mySwapPoolPairsMainnet.length;i++){
            const governorContract = new Contract(
              governorAbi,
              diamondAddress,
              provider
            );
            const result = await governorContract.call(
              "get_secondary_market_support",
              [mySwapPoolPairsMainnet[i].address,'30814223327519088'],
            );
            const data = result?.secondary_market?.supported.toString()
            if(data==='1'){
              totalCountMyswap++;
            }
            ////console.log("getPoolsSupported ", result?.secondary_market?.supported.toString(),data);
        }
        expect(totalCountMyswap).toBe(3);
  }, 20000)
})