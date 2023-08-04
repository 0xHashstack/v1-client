import routerAbi from "../src/Blockchain/abis/router_abi.json";
import { Contract } from "starknet";
import {
    diamondAddress,
    getProvider,
    getRTokenFromAddress,
  } from "../src/Blockchain/stark-constants";
import {getLoanHealth_NativeCollateral,getLoanHealth_RTokenCollateral} from '../src/Blockchain/scripts/LoanHealth'
  import { TextEncoder, TextDecoder } from 'text-encoding-utf-8';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
import { BNtoNum } from "../src/Blockchain/utils/utils";
import { useSelector } from "react-redux";
describe('Get Loan Health',()=>{
    it('displays exisiting loan health',async()=>{
        const provider = getProvider();
        const loanId="221";
        const healthFactor="0.15"
        const routerContract = new Contract(routerAbi, diamondAddress, provider);
        const res = await routerContract.call("get_health_factor", [loanId], {
          blockIdentifier: "pending",
        });
        const healthFactorAmount=BNtoNum(res?.factor,6);
        expect(healthFactorAmount.substring(0,4)).toBe(healthFactor);
    },20000);
    it('displays native collateral loan health',async()=>{
        const inputBorrowAmount="8960.76"
        const currentBorrowCoin="USDT"
        const inputCollateralAmount="3341.77"
        const currentCollateralCoin="USDT";
        const oraclePrices=[
            {
              name: "BTC",
              address:
                "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
              price: 30263.59,
              lastUpdated: "2023-07-17T09:21:19.000Z",
            },
            {
              name: "ETH",
              address:
                "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
              price: 1924.7,
              lastUpdated: "2023-07-17T09:21:19.000Z",
            },
            {
              name: "USDT",
              address:
                "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
              price: 1,
              lastUpdated: "2023-07-17T09:21:19.000Z",
            },
            {
              name: "USDC",
              address:
                "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
              price: 1,
              lastUpdated: "2023-07-17T09:21:19.000Z",
            },
            {
              name: "DAI",
              address:
                "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
              price: 0.99,
              lastUpdated: "2023-07-17T09:21:19.000Z",
            },
          ];
          const expectedHealth="1.37";
          const value=await getLoanHealth_NativeCollateral(inputBorrowAmount,currentBorrowCoin,inputCollateralAmount,currentCollateralCoin,oraclePrices);

          expect(value.toFixed(2)).toBe(expectedHealth);
    },10000)
    it('displays rToken collateral laon health',async()=>{
        const inputBorrowAmount="8960.76"
        const currentBorrowCoin="USDT"
        const inputCollateralAmount="5223.53"
        const currentCollateralCoin="rUSDT";
        const oraclePrices=[
            {
              name: "BTC",
              address:
                "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
              price: 30263.59,
              lastUpdated: "2023-07-17T09:21:19.000Z",
            },
            {
              name: "ETH",
              address:
                "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
              price: 1924.7,
              lastUpdated: "2023-07-17T09:21:19.000Z",
            },
            {
              name: "USDT",
              address:
                "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
              price: 1,
              lastUpdated: "2023-07-17T09:21:19.000Z",
            },
            {
              name: "USDC",
              address:
                "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
              price: 1,
              lastUpdated: "2023-07-17T09:21:19.000Z",
            },
            {
              name: "DAI",
              address:
                "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
              price: 0.99,
              lastUpdated: "2023-07-17T09:21:19.000Z",
            },
          ];
          const stats = [
            {
              borrowRate: 6.16,
              supplyRate: 1.61,
              stakingRate: 1.34,
              totalSupply: 131.325734,
              lentAssets: 33.510449,
              totalBorrow: 33.513305,
              availableReserves: 97.812428,
              utilisationPerMarket: 25.51,
              exchangeRateRtokenToUnderlying: 1.000607,
              exchangeRateDTokenToUnderlying: 1.003391,
              exchangeRateUnderlyingToRtoken: 0.999393,
              exchangeRateUnderlyingToDtoken: 0.996619,
              tokenAddress:
                "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
              token: "BTC",
            },
            {
              borrowRate: 4.33,
              supplyRate: 0.66,
              stakingRate: 0.55,
              totalSupply: 1005206.160713,
              lentAssets: 148919.452004,
              totalBorrow: 148922.628607,
              availableReserves: 856283.532106,
              utilisationPerMarket: 14.81,
              exchangeRateRtokenToUnderlying: 1.000399,
              exchangeRateDTokenToUnderlying: 1.002973,
              exchangeRateUnderlyingToRtoken: 0.9996,
              exchangeRateUnderlyingToDtoken: 0.997034,
              tokenAddress:
                "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
              token: "USDT",
            },
            {
              borrowRate: 7.66,
              supplyRate: 2.74,
              stakingRate: 2.28,
              totalSupply: 360007.051369,
              lentAssets: 125459.195287,
              totalBorrow: 125463.782928,
              availableReserves: 234543.268441,
              utilisationPerMarket: 34.84,
              exchangeRateRtokenToUnderlying: 1.001537,
              exchangeRateDTokenToUnderlying: 1.005093,
              exchangeRateUnderlyingToRtoken: 0.998464,
              exchangeRateUnderlyingToDtoken: 0.994932,
              tokenAddress:
                "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
              token: "USDC",
            },
            {
              borrowRate: 4.16,
              supplyRate: 0.55,
              stakingRate: 0.45,
              totalSupply: 1155.846237,
              lentAssets: 150.884531,
              totalBorrow: 150.696085,
              availableReserves: 1005.150152,
              utilisationPerMarket: 13.05,
              exchangeRateRtokenToUnderlying: 1.001099,
              exchangeRateDTokenToUnderlying: 1.004378,
              exchangeRateUnderlyingToRtoken: 0.998901,
              exchangeRateUnderlyingToDtoken: 0.99564,
              tokenAddress:
                "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
              token: "ETH",
            },
            {
              borrowRate: 5.33,
              supplyRate: 1.01,
              stakingRate: 0.84,
              totalSupply: 53752.037986,
              lentAssets: 11181.843531,
              totalBorrow: 11182.475862,
              availableReserves: 42569.562124,
              utilisationPerMarket: 20.8,
              exchangeRateRtokenToUnderlying: 1.001243,
              exchangeRateDTokenToUnderlying: 1.004544,
              exchangeRateUnderlyingToRtoken: 0.998758,
              exchangeRateUnderlyingToDtoken: 0.995476,
              tokenAddress:
                "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
              token: "DAI",
            },
          ];
          const expectedHealth="1.58";
          const result=await getLoanHealth_RTokenCollateral(inputBorrowAmount,currentBorrowCoin,inputCollateralAmount,currentCollateralCoin,oraclePrices,stats);
          expect(expectedHealth).toBe(result.toFixed(2));
    })
},30000)