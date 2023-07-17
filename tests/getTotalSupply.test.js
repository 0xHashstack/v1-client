import { render, screen, fireEvent } from "@testing-library/react";
import SupplyModal from '../src/components/modals/SupplyModal'
import {getTotalSupply,getTotalBorrow} from '../src/Blockchain/scripts/userStats'
describe("Get total supply", () => {
    it("displays total supply", () => {
        const prices=[
            {
                "name": "BTC",
                "address": "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
                "price": 30263.59,
                "lastUpdated": "2023-07-17T09:21:19.000Z"
            },
            {
                "name": "ETH",
                "address": "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
                "price": 1924.7,
                "lastUpdated": "2023-07-17T09:21:19.000Z"
            },
            {
                "name": "USDT",
                "address": "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
                "price": 1,
                "lastUpdated": "2023-07-17T09:21:19.000Z"
            },
            {
                "name": "USDC",
                "address": "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
                "price": 1,
                "lastUpdated": "2023-07-17T09:21:19.000Z"
            },
            {
                "name": "DAI",
                "address": "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
                "price": 0.99,
                "lastUpdated": "2023-07-17T09:21:19.000Z"
            }
          ]
          const deposits=[
            {
                "tokenAddress": "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
                "token": "BTC",
                "rTokenAddress": "0x1a542a2859369b78515fe0ea16647e094dac5dba307f0c656a25c2b260df6ad",
                "rToken": "rBTC",
                "rTokenFreeParsed": 7.637778,
                "rTokenLockedParsed": 0.01998,
                "rTokenStakedParsed": 2.157552,
                "rTokenAmountParsed": 7.657758,
                "underlyingAssetAmount": "2da02fc5",
                "underlyingAssetAmountParsed": 7.654727
            },
            {
                "tokenAddress": "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
                "token": "ETH",
                "rTokenAddress": "0x5bac7932c6a6dc0578feab3643269fa3ce7bf2729a1ede9c37273dcb9b1eec1",
                "rToken": "rETH",
                "rTokenFreeParsed": 69.792651,
                "rTokenLockedParsed": 0.369625,
                "rTokenStakedParsed": 8.424319,
                "rTokenAmountParsed": 70.162276,
                "underlyingAssetAmount": "03cdcae9c64f24729a",
                "underlyingAssetAmountParsed": 70.169153
            },
            {
                "tokenAddress": "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
                "token": "USDT",
                "rTokenAddress": "0x300f2c472ab337f55993a32fdf7c43016cb0d81c1d3e8b155b92fe6475086a1",
                "rToken": "rUSDT",
                "rTokenFreeParsed": 18655.481168,
                "rTokenLockedParsed": 5302.830936,
                "rTokenStakedParsed": 14467.146927,
                "rTokenAmountParsed": 23958.312103999997,
                "underlyingAssetAmount": "05932ad301",
                "underlyingAssetAmountParsed": 23943.893761
            },
            {
                "tokenAddress": "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
                "token": "USDC",
                "rTokenAddress": "0x2fb267c4b264af1b8fea1052d3f8d853f438c7e2270eb39637375d3b5952a40",
                "rToken": "rUSDC",
                "rTokenFreeParsed": 14235.068506,
                "rTokenLockedParsed": 4966.935284,
                "rTokenStakedParsed": 1020.56,
                "rTokenAmountParsed": 19202.00379,
                "underlyingAssetAmount": "0479234cec",
                "underlyingAssetAmountParsed": 19212.225772
            },
            {
                "tokenAddress": "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
                "token": "DAI",
                "rTokenAddress": "0x1e8ca2770648c089818c047ee09395258fd2b1562a081c2e31788b86e2355ac",
                "rToken": "rDAI",
                "rTokenFreeParsed": 3432.042303,
                "rTokenLockedParsed": 0,
                "rTokenStakedParsed": 0.98,
                "rTokenAmountParsed": 3432.042303,
                "underlyingAssetAmount": "ba189c747e7603af08",
                "underlyingAssetAmountParsed": 3432.867818
            }
          ]
          const expectedTotalSupply = 413268.74694184994;
          const totalSupply = getTotalSupply(deposits, prices);
          expect(totalSupply).toEqual(expectedTotalSupply);
    //   render(<SupplyModal/>)
      // check if all components are rendered
    });
    it('displays total borrow',async()=>{
        const loans=[
            {
                "loanId": 7,
                "borrower": "0x5970da1011e2f8dc15bc12fc1b0eb8e382300a334de06ad17d1404384b168e4",
                "loanMarket": "dBTC",
                "loanMarketAddress": "0x2880ea27d58d202ae78984f8462dd5b2808c3f6e7327af6deaa7ef454be58f",
                "underlyingMarket": "BTC",
                "underlyingMarketAddress": "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
                "currentLoanMarketAddress": "0x129c74ca4274e3dbf7ab83f5916bebf087ce7af7495b3c648f1d2f2ab302330",
                "collateralMarket": "rBTC",
                "collateralMarketAddress": "0x1a542a2859369b78515fe0ea16647e094dac5dba307f0c656a25c2b260df6ad",
                "loanAmount": "2000000",
                "loanAmountParsed": 0.02,
                "currentLoanAmount": "138784491822687747",
                "currentLoanAmountParsed": 0,
                "collateralAmount": "1998000",
                "collateralAmountParsed": 0.01998,
                "createdAt": "1970-01-20T12:39:25.969Z",
                "loanState": "SPENT",
                "l3App": "JEDI_SWAP",
                "spendType": "LIQUIDITY",
                "state": "2",
                "l3_integration": "1962660952167394271600",
                "l3_category": "2"
            },
            {
                "loanId": 13,
                "borrower": "0x5970da1011e2f8dc15bc12fc1b0eb8e382300a334de06ad17d1404384b168e4",
                "loanMarket": "dUSDT",
                "loanMarketAddress": "0x7a6a7296e19273a10b3d4834ae14bec18f075f7d77d998b072bd5e5a747ab20",
                "underlyingMarket": "USDT",
                "underlyingMarketAddress": "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
                "currentLoanMarketAddress": "0x4e05550a4899cda3d22ff1db5fc83f02e086eafa37f3f73837b0be9e565369e",
                "collateralMarket": "rETH",
                "collateralMarketAddress": "0x5bac7932c6a6dc0578feab3643269fa3ce7bf2729a1ede9c37273dcb9b1eec1",
                "loanAmount": "179994",
                "loanAmountParsed": 0.179994,
                "currentLoanAmount": "89358",
                "currentLoanAmountParsed": 0,
                "collateralAmount": "369625715204133410",
                "collateralAmountParsed": 0.369625,
                "createdAt": "1970-01-20T12:39:42.043Z",
                "loanState": "SPENT",
                "l3App": "JEDI_SWAP",
                "spendType": "LIQUIDITY",
                "state": "2",
                "l3_integration": "1962660952167394271600",
                "l3_category": "2"
            },
            {
                "loanId": 118,
                "borrower": "0x5970da1011e2f8dc15bc12fc1b0eb8e382300a334de06ad17d1404384b168e4",
                "loanMarket": "dUSDT",
                "loanMarketAddress": "0x7a6a7296e19273a10b3d4834ae14bec18f075f7d77d998b072bd5e5a747ab20",
                "underlyingMarket": "USDT",
                "underlyingMarketAddress": "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
                "currentLoanMarketAddress": "0x28edc2adbdc46e745ab9af076cf9a3359d0b7925ec36e32cd4a040ac73233bb",
                "collateralMarket": "rUSDC",
                "collateralMarketAddress": "0x2fb267c4b264af1b8fea1052d3f8d853f438c7e2270eb39637375d3b5952a40",
                "loanAmount": "494157573",
                "loanAmountParsed": 494.157573,
                "currentLoanAmount": "246810610",
                "currentLoanAmountParsed": 0,
                "collateralAmount": "333221642",
                "collateralAmountParsed": 333.221642,
                "createdAt": "1970-01-20T12:55:32.851Z",
                "loanState": "SPENT",
                "l3App": "JEDI_SWAP",
                "spendType": "LIQUIDITY",
                "state": "2",
                "l3_integration": "1962660952167394271600",
                "l3_category": "2"
            },
            {
                "loanId": 208,
                "borrower": "0x5970da1011e2f8dc15bc12fc1b0eb8e382300a334de06ad17d1404384b168e4",
                "loanMarket": "dBTC",
                "loanMarketAddress": "0x2880ea27d58d202ae78984f8462dd5b2808c3f6e7327af6deaa7ef454be58f",
                "underlyingMarket": "BTC",
                "underlyingMarketAddress": "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
                "currentLoanMarketAddress": "0x4b6e4bef4dd1424b06d599a55c464e94cd9f3cb1a305eaa8a3db923519585f7",
                "collateralMarket": "rUSDT",
                "collateralMarketAddress": "0x300f2c472ab337f55993a32fdf7c43016cb0d81c1d3e8b155b92fe6475086a1",
                "loanAmount": "8974419",
                "loanAmountParsed": 0.089744,
                "currentLoanAmount": "1008629050577643094",
                "currentLoanAmountParsed": 0,
                "collateralAmount": "4225344025",
                "collateralAmountParsed": 4225.344025,
                "createdAt": "1970-01-20T13:15:21.068Z",
                "loanState": "SPENT",
                "l3App": "JEDI_SWAP",
                "spendType": "LIQUIDITY",
                "state": "2",
                "l3_integration": "1962660952167394271600",
                "l3_category": "2"
            },
            {
                "loanId": 221,
                "borrower": "0x5970da1011e2f8dc15bc12fc1b0eb8e382300a334de06ad17d1404384b168e4",
                "loanMarket": "dDAI",
                "loanMarketAddress": "0x4d84998c8cb5daa6664124c58d0006250c7631051a4b3abd61b03663ee1cc02",
                "underlyingMarket": "DAI",
                "underlyingMarketAddress": "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
                "currentLoanMarket": "DAI",
                "currentLoanMarketAddress": "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
                "collateralMarket": "rUSDT",
                "collateralMarketAddress": "0x300f2c472ab337f55993a32fdf7c43016cb0d81c1d3e8b155b92fe6475086a1",
                "loanAmount": "1967903111465296349903",
                "loanAmountParsed": 1967.903111,
                "currentLoanAmount": "1973964060000000000001",
                "currentLoanAmountParsed": 1973.96406,
                "collateralAmount": "1077486911",
                "collateralAmountParsed": 1077.486911,
                "createdAt": "1970-01-20T13:15:27.303Z",
                "loanState": "ACTIVE",
                "l3App": "NONE",
                "spendType": "UNSPENT",
                "state": "1",
                "l3_integration": "0",
                "l3_category": "0"
            },
            {
                "loanId": 225,
                "borrower": "0x5970da1011e2f8dc15bc12fc1b0eb8e382300a334de06ad17d1404384b168e4",
                "loanMarket": "dUSDC",
                "loanMarketAddress": "0x3b8e16870d6eb725650d23a020883056a6f1093326fe547ac4d40e4c71052c9",
                "underlyingMarket": "USDC",
                "underlyingMarketAddress": "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
                "currentLoanMarket": "USDC",
                "currentLoanMarketAddress": "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
                "collateralMarket": "rUSDC",
                "collateralMarketAddress": "0x2fb267c4b264af1b8fea1052d3f8d853f438c7e2270eb39637375d3b5952a40",
                "loanAmount": "2892711466",
                "loanAmountParsed": 2892.711466,
                "currentLoanAmount": "2902844251",
                "currentLoanAmountParsed": 2902.844251,
                "collateralAmount": "926740740",
                "collateralAmountParsed": 926.74074,
                "createdAt": "1970-01-20T13:15:27.867Z",
                "loanState": "ACTIVE",
                "l3App": "NONE",
                "spendType": "UNSPENT",
                "state": "1",
                "l3_integration": "0",
                "l3_category": "0"
            },
            {
                "loanId": 226,
                "borrower": "0x5970da1011e2f8dc15bc12fc1b0eb8e382300a334de06ad17d1404384b168e4",
                "loanMarket": "dBTC",
                "loanMarketAddress": "0x2880ea27d58d202ae78984f8462dd5b2808c3f6e7327af6deaa7ef454be58f",
                "underlyingMarket": "BTC",
                "underlyingMarketAddress": "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
                "currentLoanMarket": "USDT",
                "currentLoanMarketAddress": "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
                "collateralMarket": "rUSDC",
                "collateralMarketAddress": "0x2fb267c4b264af1b8fea1052d3f8d853f438c7e2270eb39637375d3b5952a40",
                "loanAmount": "1994288",
                "loanAmountParsed": 0.019942,
                "currentLoanAmount": "620135242",
                "currentLoanAmountParsed": 620.135242,
                "collateralAmount": "1853491457",
                "collateralAmountParsed": 1853.491457,
                "createdAt": "1970-01-20T13:15:27.867Z",
                "loanState": "SPENT",
                "l3App": "JEDI_SWAP",
                "spendType": "SWAP",
                "state": "2",
                "l3_integration": "1962660952167394271600",
                "l3_category": "1"
            },
            {
                "loanId": 228,
                "borrower": "0x5970da1011e2f8dc15bc12fc1b0eb8e382300a334de06ad17d1404384b168e4",
                "loanMarket": "dETH",
                "loanMarketAddress": "0x5b5dece096eaf569624f215fcf0ed8210a16f79dca691aef1a42c716bd37da0",
                "underlyingMarket": "ETH",
                "underlyingMarketAddress": "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
                "currentLoanMarket": "USDT",
                "currentLoanMarketAddress": "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
                "collateralMarket": "rUSDC",
                "collateralMarketAddress": "0x2fb267c4b264af1b8fea1052d3f8d853f438c7e2270eb39637375d3b5952a40",
                "loanAmount": "89637760909644031",
                "loanAmountParsed": 0.089637,
                "currentLoanAmount": "199090940",
                "currentLoanAmountParsed": 199.09094,
                "collateralAmount": "926740728",
                "collateralAmountParsed": 926.740728,
                "createdAt": "1970-01-20T13:15:28.073Z",
                "loanState": "SPENT",
                "l3App": "MY_SWAP",
                "spendType": "SWAP",
                "state": "2",
                "l3_integration": "30814223327519088",
                "l3_category": "1"
            },
            {
                "loanId": 229,
                "borrower": "0x5970da1011e2f8dc15bc12fc1b0eb8e382300a334de06ad17d1404384b168e4",
                "loanMarket": "dDAI",
                "loanMarketAddress": "0x4d84998c8cb5daa6664124c58d0006250c7631051a4b3abd61b03663ee1cc02",
                "underlyingMarket": "DAI",
                "underlyingMarketAddress": "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
                "currentLoanMarketAddress": "0x129c74ca4274e3dbf7ab83f5916bebf087ce7af7495b3c648f1d2f2ab302330",
                "collateralMarket": "rUSDC",
                "collateralMarketAddress": "0x2fb267c4b264af1b8fea1052d3f8d853f438c7e2270eb39637375d3b5952a40",
                "loanAmount": "1119486889511286498060",
                "loanAmountParsed": 1119.486889,
                "currentLoanAmount": "280321280528979880",
                "currentLoanAmountParsed": 0,
                "collateralAmount": "926740717",
                "collateralAmountParsed": 926.740717,
                "createdAt": "1970-01-20T13:15:28.265Z",
                "loanState": "SPENT",
                "l3App": "JEDI_SWAP",
                "spendType": "LIQUIDITY",
                "state": "2",
                "l3_integration": "1962660952167394271600",
                "l3_category": "2"
            }
        ];
        const prices=[
            {
                "name": "BTC",
                "address": "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
                "price": 30196.1,
                "lastUpdated": "2023-07-17T11:10:30.000Z"
            },
            {
                "name": "ETH",
                "address": "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
                "price": 1914.5,
                "lastUpdated": "2023-07-17T11:10:30.000Z"
            },
            {
                "name": "USDT",
                "address": "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
                "price": 1,
                "lastUpdated": "2023-07-17T11:10:30.000Z"
            },
            {
                "name": "USDC",
                "address": "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
                "price": 1,
                "lastUpdated": "2023-07-17T11:10:30.000Z"
            },
            {
                "name": "DAI",
                "address": "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
                "price": 0.99,
                "lastUpdated": "2023-07-17T11:10:30.000Z"
            }
        ]
const stats=[
    {
        "borrowRate": 6.16,
        "supplyRate": 1.61,
        "stakingRate": 1.34,
        "totalSupply": 131.325734,
        "lentAssets": 33.510449,
        "totalBorrow": 33.513305,
        "availableReserves": 97.812428,
        "utilisationPerMarket": 25.51,
        "exchangeRateRtokenToUnderlying": 1.000607,
        "exchangeRateDTokenToUnderlying": 1.003391,
        "exchangeRateUnderlyingToRtoken": 0.999393,
        "exchangeRateUnderlyingToDtoken": 0.996619,
        "tokenAddress": "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
        "token": "BTC"
    },
    {
        "borrowRate": 4.33,
        "supplyRate": 0.66,
        "stakingRate": 0.55,
        "totalSupply": 1005206.160713,
        "lentAssets": 148919.452004,
        "totalBorrow": 148922.628607,
        "availableReserves": 856283.532106,
        "utilisationPerMarket": 14.81,
        "exchangeRateRtokenToUnderlying": 1.000399,
        "exchangeRateDTokenToUnderlying": 1.002973,
        "exchangeRateUnderlyingToRtoken": 0.9996,
        "exchangeRateUnderlyingToDtoken": 0.997034,
        "tokenAddress": "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
        "token": "USDT"
    },
    {
        "borrowRate": 7.66,
        "supplyRate": 2.74,
        "stakingRate": 2.28,
        "totalSupply": 360007.051369,
        "lentAssets": 125459.195287,
        "totalBorrow": 125463.782928,
        "availableReserves": 234543.268441,
        "utilisationPerMarket": 34.84,
        "exchangeRateRtokenToUnderlying": 1.001537,
        "exchangeRateDTokenToUnderlying": 1.005093,
        "exchangeRateUnderlyingToRtoken": 0.998464,
        "exchangeRateUnderlyingToDtoken": 0.994932,
        "tokenAddress": "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
        "token": "USDC"
    },
    {
        "borrowRate": 4.16,
        "supplyRate": 0.55,
        "stakingRate": 0.45,
        "totalSupply": 1155.846237,
        "lentAssets": 150.884531,
        "totalBorrow": 150.696085,
        "availableReserves": 1005.150152,
        "utilisationPerMarket": 13.05,
        "exchangeRateRtokenToUnderlying": 1.001099,
        "exchangeRateDTokenToUnderlying": 1.004378,
        "exchangeRateUnderlyingToRtoken": 0.998901,
        "exchangeRateUnderlyingToDtoken": 0.99564,
        "tokenAddress": "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
        "token": "ETH"
    },
    {
        "borrowRate": 5.33,
        "supplyRate": 1.01,
        "stakingRate": 0.84,
        "totalSupply": 53752.037986,
        "lentAssets": 11181.843531,
        "totalBorrow": 11182.475862,
        "availableReserves": 42569.562124,
        "utilisationPerMarket": 20.8,
        "exchangeRateRtokenToUnderlying": 1.001243,
        "exchangeRateDTokenToUnderlying": 1.004544,
        "exchangeRateUnderlyingToRtoken": 0.998758,
        "exchangeRateUnderlyingToDtoken": 0.995476,
        "tokenAddress": "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
        "token": "DAI"
    }
]
        const borrowAmount=10575.308151822046;
        const totalBorrow=await getTotalBorrow(loans,prices,stats);
        const totalBorrowAmount=totalBorrow?.totalBorrow;
        expect(totalBorrowAmount).toEqual(borrowAmount);

    });
  });