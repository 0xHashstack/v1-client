
import SupplyModal from "../src/components/modals/SupplyModal";
import {
  getTotalSupply,
  getTotalBorrow,
  getL3USDTValue,
  getNetworth,
  effectivAPRLoan,
  effectiveAprDeposit,
  getNetApr,
} from "../src/Blockchain/scripts/userStats";
describe("Get total supply", () => {
  it("displays total supply", () => {
    const prices = [
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
    const deposits = [
      {
        tokenAddress:
          "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
        token: "BTC",
        rTokenAddress:
          "0x1a542a2859369b78515fe0ea16647e094dac5dba307f0c656a25c2b260df6ad",
        rToken: "rBTC",
        rTokenFreeParsed: 7.637778,
        rTokenLockedParsed: 0.01998,
        rTokenStakedParsed: 2.157552,
        rTokenAmountParsed: 7.657758,
        underlyingAssetAmount: "2da02fc5",
        underlyingAssetAmountParsed: 7.654727,
      },
      {
        tokenAddress:
          "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
        token: "ETH",
        rTokenAddress:
          "0x5bac7932c6a6dc0578feab3643269fa3ce7bf2729a1ede9c37273dcb9b1eec1",
        rToken: "rETH",
        rTokenFreeParsed: 69.792651,
        rTokenLockedParsed: 0.369625,
        rTokenStakedParsed: 8.424319,
        rTokenAmountParsed: 70.162276,
        underlyingAssetAmount: "03cdcae9c64f24729a",
        underlyingAssetAmountParsed: 70.169153,
      },
      {
        tokenAddress:
          "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
        token: "USDT",
        rTokenAddress:
          "0x300f2c472ab337f55993a32fdf7c43016cb0d81c1d3e8b155b92fe6475086a1",
        rToken: "rUSDT",
        rTokenFreeParsed: 18655.481168,
        rTokenLockedParsed: 5302.830936,
        rTokenStakedParsed: 14467.146927,
        rTokenAmountParsed: 23958.312103999997,
        underlyingAssetAmount: "05932ad301",
        underlyingAssetAmountParsed: 23943.893761,
      },
      {
        tokenAddress:
          "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
        token: "USDC",
        rTokenAddress:
          "0x2fb267c4b264af1b8fea1052d3f8d853f438c7e2270eb39637375d3b5952a40",
        rToken: "rUSDC",
        rTokenFreeParsed: 14235.068506,
        rTokenLockedParsed: 4966.935284,
        rTokenStakedParsed: 1020.56,
        rTokenAmountParsed: 19202.00379,
        underlyingAssetAmount: "0479234cec",
        underlyingAssetAmountParsed: 19212.225772,
      },
      {
        tokenAddress:
          "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
        token: "DAI",
        rTokenAddress:
          "0x1e8ca2770648c089818c047ee09395258fd2b1562a081c2e31788b86e2355ac",
        rToken: "rDAI",
        rTokenFreeParsed: 3432.042303,
        rTokenLockedParsed: 0,
        rTokenStakedParsed: 0.98,
        rTokenAmountParsed: 3432.042303,
        underlyingAssetAmount: "ba189c747e7603af08",
        underlyingAssetAmountParsed: 3432.867818,
      },
    ];
    const expectedTotalSupply = 413268.74694184994;
    const totalSupply = getTotalSupply(deposits, prices);
    expect(totalSupply).toEqual(expectedTotalSupply);
    //   render(<SupplyModal/>)
    // check if all components are rendered
  });
  it("displays total borrow", async () => {
    const loans = [
      {
        loanId: 7,
        borrower:
          "0x5970da1011e2f8dc15bc12fc1b0eb8e382300a334de06ad17d1404384b168e4",
        loanMarket: "dBTC",
        loanMarketAddress:
          "0x2880ea27d58d202ae78984f8462dd5b2808c3f6e7327af6deaa7ef454be58f",
        underlyingMarket: "BTC",
        underlyingMarketAddress:
          "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
        currentLoanMarketAddress:
          "0x129c74ca4274e3dbf7ab83f5916bebf087ce7af7495b3c648f1d2f2ab302330",
        collateralMarket: "rBTC",
        collateralMarketAddress:
          "0x1a542a2859369b78515fe0ea16647e094dac5dba307f0c656a25c2b260df6ad",
        loanAmount: "2000000",
        loanAmountParsed: 0.02,
        currentLoanAmount: "138784491822687747",
        currentLoanAmountParsed: 0,
        collateralAmount: "1998000",
        collateralAmountParsed: 0.01998,
        createdAt: "1970-01-20T12:39:25.969Z",
        loanState: "SPENT",
        l3App: "JEDI_SWAP",
        spendType: "LIQUIDITY",
        state: "2",
        l3_integration: "1962660952167394271600",
        l3_category: "2",
      },
      {
        loanId: 13,
        borrower:
          "0x5970da1011e2f8dc15bc12fc1b0eb8e382300a334de06ad17d1404384b168e4",
        loanMarket: "dUSDT",
        loanMarketAddress:
          "0x7a6a7296e19273a10b3d4834ae14bec18f075f7d77d998b072bd5e5a747ab20",
        underlyingMarket: "USDT",
        underlyingMarketAddress:
          "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
        currentLoanMarketAddress:
          "0x4e05550a4899cda3d22ff1db5fc83f02e086eafa37f3f73837b0be9e565369e",
        collateralMarket: "rETH",
        collateralMarketAddress:
          "0x5bac7932c6a6dc0578feab3643269fa3ce7bf2729a1ede9c37273dcb9b1eec1",
        loanAmount: "179994",
        loanAmountParsed: 0.179994,
        currentLoanAmount: "89358",
        currentLoanAmountParsed: 0,
        collateralAmount: "369625715204133410",
        collateralAmountParsed: 0.369625,
        createdAt: "1970-01-20T12:39:42.043Z",
        loanState: "SPENT",
        l3App: "JEDI_SWAP",
        spendType: "LIQUIDITY",
        state: "2",
        l3_integration: "1962660952167394271600",
        l3_category: "2",
      },
      {
        loanId: 118,
        borrower:
          "0x5970da1011e2f8dc15bc12fc1b0eb8e382300a334de06ad17d1404384b168e4",
        loanMarket: "dUSDT",
        loanMarketAddress:
          "0x7a6a7296e19273a10b3d4834ae14bec18f075f7d77d998b072bd5e5a747ab20",
        underlyingMarket: "USDT",
        underlyingMarketAddress:
          "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
        currentLoanMarketAddress:
          "0x28edc2adbdc46e745ab9af076cf9a3359d0b7925ec36e32cd4a040ac73233bb",
        collateralMarket: "rUSDC",
        collateralMarketAddress:
          "0x2fb267c4b264af1b8fea1052d3f8d853f438c7e2270eb39637375d3b5952a40",
        loanAmount: "494157573",
        loanAmountParsed: 494.157573,
        currentLoanAmount: "246810610",
        currentLoanAmountParsed: 0,
        collateralAmount: "333221642",
        collateralAmountParsed: 333.221642,
        createdAt: "1970-01-20T12:55:32.851Z",
        loanState: "SPENT",
        l3App: "JEDI_SWAP",
        spendType: "LIQUIDITY",
        state: "2",
        l3_integration: "1962660952167394271600",
        l3_category: "2",
      },
      {
        loanId: 208,
        borrower:
          "0x5970da1011e2f8dc15bc12fc1b0eb8e382300a334de06ad17d1404384b168e4",
        loanMarket: "dBTC",
        loanMarketAddress:
          "0x2880ea27d58d202ae78984f8462dd5b2808c3f6e7327af6deaa7ef454be58f",
        underlyingMarket: "BTC",
        underlyingMarketAddress:
          "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
        currentLoanMarketAddress:
          "0x4b6e4bef4dd1424b06d599a55c464e94cd9f3cb1a305eaa8a3db923519585f7",
        collateralMarket: "rUSDT",
        collateralMarketAddress:
          "0x300f2c472ab337f55993a32fdf7c43016cb0d81c1d3e8b155b92fe6475086a1",
        loanAmount: "8974419",
        loanAmountParsed: 0.089744,
        currentLoanAmount: "1008629050577643094",
        currentLoanAmountParsed: 0,
        collateralAmount: "4225344025",
        collateralAmountParsed: 4225.344025,
        createdAt: "1970-01-20T13:15:21.068Z",
        loanState: "SPENT",
        l3App: "JEDI_SWAP",
        spendType: "LIQUIDITY",
        state: "2",
        l3_integration: "1962660952167394271600",
        l3_category: "2",
      },
      {
        loanId: 221,
        borrower:
          "0x5970da1011e2f8dc15bc12fc1b0eb8e382300a334de06ad17d1404384b168e4",
        loanMarket: "dDAI",
        loanMarketAddress:
          "0x4d84998c8cb5daa6664124c58d0006250c7631051a4b3abd61b03663ee1cc02",
        underlyingMarket: "DAI",
        underlyingMarketAddress:
          "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
        currentLoanMarket: "DAI",
        currentLoanMarketAddress:
          "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
        collateralMarket: "rUSDT",
        collateralMarketAddress:
          "0x300f2c472ab337f55993a32fdf7c43016cb0d81c1d3e8b155b92fe6475086a1",
        loanAmount: "1967903111465296349903",
        loanAmountParsed: 1967.903111,
        currentLoanAmount: "1973964060000000000001",
        currentLoanAmountParsed: 1973.96406,
        collateralAmount: "1077486911",
        collateralAmountParsed: 1077.486911,
        createdAt: "1970-01-20T13:15:27.303Z",
        loanState: "ACTIVE",
        l3App: "NONE",
        spendType: "UNSPENT",
        state: "1",
        l3_integration: "0",
        l3_category: "0",
      },
      {
        loanId: 225,
        borrower:
          "0x5970da1011e2f8dc15bc12fc1b0eb8e382300a334de06ad17d1404384b168e4",
        loanMarket: "dUSDC",
        loanMarketAddress:
          "0x3b8e16870d6eb725650d23a020883056a6f1093326fe547ac4d40e4c71052c9",
        underlyingMarket: "USDC",
        underlyingMarketAddress:
          "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
        currentLoanMarket: "USDC",
        currentLoanMarketAddress:
          "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
        collateralMarket: "rUSDC",
        collateralMarketAddress:
          "0x2fb267c4b264af1b8fea1052d3f8d853f438c7e2270eb39637375d3b5952a40",
        loanAmount: "2892711466",
        loanAmountParsed: 2892.711466,
        currentLoanAmount: "2902844251",
        currentLoanAmountParsed: 2902.844251,
        collateralAmount: "926740740",
        collateralAmountParsed: 926.74074,
        createdAt: "1970-01-20T13:15:27.867Z",
        loanState: "ACTIVE",
        l3App: "NONE",
        spendType: "UNSPENT",
        state: "1",
        l3_integration: "0",
        l3_category: "0",
      },
      {
        loanId: 226,
        borrower:
          "0x5970da1011e2f8dc15bc12fc1b0eb8e382300a334de06ad17d1404384b168e4",
        loanMarket: "dBTC",
        loanMarketAddress:
          "0x2880ea27d58d202ae78984f8462dd5b2808c3f6e7327af6deaa7ef454be58f",
        underlyingMarket: "BTC",
        underlyingMarketAddress:
          "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
        currentLoanMarket: "USDT",
        currentLoanMarketAddress:
          "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
        collateralMarket: "rUSDC",
        collateralMarketAddress:
          "0x2fb267c4b264af1b8fea1052d3f8d853f438c7e2270eb39637375d3b5952a40",
        loanAmount: "1994288",
        loanAmountParsed: 0.019942,
        currentLoanAmount: "620135242",
        currentLoanAmountParsed: 620.135242,
        collateralAmount: "1853491457",
        collateralAmountParsed: 1853.491457,
        createdAt: "1970-01-20T13:15:27.867Z",
        loanState: "SPENT",
        l3App: "JEDI_SWAP",
        spendType: "SWAP",
        state: "2",
        l3_integration: "1962660952167394271600",
        l3_category: "1",
      },
      {
        loanId: 228,
        borrower:
          "0x5970da1011e2f8dc15bc12fc1b0eb8e382300a334de06ad17d1404384b168e4",
        loanMarket: "dETH",
        loanMarketAddress:
          "0x5b5dece096eaf569624f215fcf0ed8210a16f79dca691aef1a42c716bd37da0",
        underlyingMarket: "ETH",
        underlyingMarketAddress:
          "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
        currentLoanMarket: "USDT",
        currentLoanMarketAddress:
          "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
        collateralMarket: "rUSDC",
        collateralMarketAddress:
          "0x2fb267c4b264af1b8fea1052d3f8d853f438c7e2270eb39637375d3b5952a40",
        loanAmount: "89637760909644031",
        loanAmountParsed: 0.089637,
        currentLoanAmount: "199090940",
        currentLoanAmountParsed: 199.09094,
        collateralAmount: "926740728",
        collateralAmountParsed: 926.740728,
        createdAt: "1970-01-20T13:15:28.073Z",
        loanState: "SPENT",
        l3App: "MY_SWAP",
        spendType: "SWAP",
        state: "2",
        l3_integration: "30814223327519088",
        l3_category: "1",
      },
      {
        loanId: 229,
        borrower:
          "0x5970da1011e2f8dc15bc12fc1b0eb8e382300a334de06ad17d1404384b168e4",
        loanMarket: "dDAI",
        loanMarketAddress:
          "0x4d84998c8cb5daa6664124c58d0006250c7631051a4b3abd61b03663ee1cc02",
        underlyingMarket: "DAI",
        underlyingMarketAddress:
          "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
        currentLoanMarketAddress:
          "0x129c74ca4274e3dbf7ab83f5916bebf087ce7af7495b3c648f1d2f2ab302330",
        collateralMarket: "rUSDC",
        collateralMarketAddress:
          "0x2fb267c4b264af1b8fea1052d3f8d853f438c7e2270eb39637375d3b5952a40",
        loanAmount: "1119486889511286498060",
        loanAmountParsed: 1119.486889,
        currentLoanAmount: "280321280528979880",
        currentLoanAmountParsed: 0,
        collateralAmount: "926740717",
        collateralAmountParsed: 926.740717,
        createdAt: "1970-01-20T13:15:28.265Z",
        loanState: "SPENT",
        l3App: "JEDI_SWAP",
        spendType: "LIQUIDITY",
        state: "2",
        l3_integration: "1962660952167394271600",
        l3_category: "2",
      },
    ];
    const prices = [
      {
        name: "BTC",
        address:
          "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
        price: 30196.1,
        lastUpdated: "2023-07-17T11:10:30.000Z",
      },
      {
        name: "ETH",
        address:
          "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
        price: 1914.5,
        lastUpdated: "2023-07-17T11:10:30.000Z",
      },
      {
        name: "USDT",
        address:
          "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
        price: 1,
        lastUpdated: "2023-07-17T11:10:30.000Z",
      },
      {
        name: "USDC",
        address:
          "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
        price: 1,
        lastUpdated: "2023-07-17T11:10:30.000Z",
      },
      {
        name: "DAI",
        address:
          "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
        price: 0.99,
        lastUpdated: "2023-07-17T11:10:30.000Z",
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
    const borrowAmount = 10575.308151822046;
    const totalBorrow = await getTotalBorrow(loans, prices, stats);
    const totalBorrowAmount = totalBorrow?.totalBorrow;
    expect(totalBorrowAmount).toEqual(borrowAmount);
  });
  it("displays the networth", async () => {
    const expectedNetWorth = 323400821.686917;
    const totalSupply = 58434.75601492;
    const totalBorrow = 126096.4985969382;
    const totalCurrentAmount = 323468483.42949903;
    const net_worth = await getNetworth(
      totalSupply,
      totalBorrow,
      totalCurrentAmount
    );
    // console.log("getting the l3 value", net_worth);
    expect(net_worth).toEqual(expectedNetWorth);
  });
  it("displays the effective apr of loan", async () => {
    const expectedEffectiveAPR = "3.43";
    const currentLoan = {
      loanId: 5,
      borrower:
        "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
      loanMarket: "dUSDT",
      loanMarketAddress:
        "0x7a6a7296e19273a10b3d4834ae14bec18f075f7d77d998b072bd5e5a747ab20",
      underlyingMarket: "USDT",
      underlyingMarketAddress:
        "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
      currentLoanMarketAddress:
        "0x4b6e4bef4dd1424b06d599a55c464e94cd9f3cb1a305eaa8a3db923519585f7",
      collateralMarket: "rUSDT",
      collateralMarketAddress:
        "0x300f2c472ab337f55993a32fdf7c43016cb0d81c1d3e8b155b92fe6475086a1",
      loanAmount: "99999238",
      loanAmountParsed: 99.999238,
      currentLoanAmount: "27319361803622228868200",
      currentLoanAmountParsed: 0,
      collateralAmount: "136369742",
      collateralAmountParsed: 136.369742,
      createdAt: "1970-01-20T12:39:25.096Z",
      loanState: "SPENT",
      l3App: "JEDI_SWAP",
      spendType: "LIQUIDITY",
      state: "2",
      l3_integration: "1962660952167394271600",
      l3_category: "2",
    };
    const prices = [
      {
        name: "BTC",
        address:
          "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
        price: 30196.1,
        lastUpdated: "2023-07-17T11:10:30.000Z",
      },
      {
        name: "ETH",
        address:
          "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
        price: 1914.5,
        lastUpdated: "2023-07-17T11:10:30.000Z",
      },
      {
        name: "USDT",
        address:
          "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
        price: 1,
        lastUpdated: "2023-07-17T11:10:30.000Z",
      },
      {
        name: "USDC",
        address:
          "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
        price: 1,
        lastUpdated: "2023-07-17T11:10:30.000Z",
      },
      {
        name: "DAI",
        address:
          "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
        price: 0.99,
        lastUpdated: "2023-07-17T11:10:30.000Z",
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
    const effectiveAPR = await effectivAPRLoan(currentLoan, stats, prices);
    expect(effectiveAPR).toEqual(expectedEffectiveAPR);
  });
  it("displays the effective apr of deposit", async () => {
    const expectedEffectiveAPR = 1.61;
    const currentDeposit = {
      tokenAddress:
        "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
      token: "BTC",
      rTokenAddress:
        "0x1a542a2859369b78515fe0ea16647e094dac5dba307f0c656a25c2b260df6ad",
      rToken: "rBTC",
      rTokenFreeParsed: 0.011983,
      rTokenLockedParsed: 0.000499,
      rTokenStakedParsed: 0,
      rTokenAmountParsed: 0.012482,
      underlyingAssetAmount: "130a4d",
      underlyingAssetAmountParsed: 0.012478,
    };
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
    const effectiveAPR = await effectiveAprDeposit(currentDeposit, stats);
    expect(effectiveAPR).toBe(expectedEffectiveAPR);
  });
  it("displays the net apr", async () => {
    const expectedNetAPR = "-5.62";
    const loans = [
      {
        loanId: 5,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dUSDT",
        loanMarketAddress:
          "0x7a6a7296e19273a10b3d4834ae14bec18f075f7d77d998b072bd5e5a747ab20",
        underlyingMarket: "USDT",
        underlyingMarketAddress:
          "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
        currentLoanMarketAddress:
          "0x4b6e4bef4dd1424b06d599a55c464e94cd9f3cb1a305eaa8a3db923519585f7",
        collateralMarket: "rUSDT",
        collateralMarketAddress:
          "0x300f2c472ab337f55993a32fdf7c43016cb0d81c1d3e8b155b92fe6475086a1",
        loanAmount: "99999238",
        loanAmountParsed: 99.999238,
        currentLoanAmount: "27319361803622228868200",
        currentLoanAmountParsed: 0,
        collateralAmount: "136369742",
        collateralAmountParsed: 136.369742,
        createdAt: "1970-01-20T12:39:25.096Z",
        loanState: "SPENT",
        l3App: "JEDI_SWAP",
        spendType: "LIQUIDITY",
        state: "2",
        l3_integration: "1962660952167394271600",
        l3_category: "2",
      },
      {
        loanId: 98,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dUSDC",
        loanMarketAddress:
          "0x3b8e16870d6eb725650d23a020883056a6f1093326fe547ac4d40e4c71052c9",
        underlyingMarket: "USDC",
        underlyingMarketAddress:
          "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
        currentLoanMarket: "USDC",
        currentLoanMarketAddress:
          "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
        collateralMarket: "rUSDC",
        collateralMarketAddress:
          "0x2fb267c4b264af1b8fea1052d3f8d853f438c7e2270eb39637375d3b5952a40",
        loanAmount: "199658054",
        loanAmountParsed: 199.658054,
        currentLoanAmount: "199800001",
        currentLoanAmountParsed: 199.800001,
        collateralAmount: "99831375",
        collateralAmountParsed: 99.831375,
        createdAt: "1970-01-20T12:50:46.039Z",
        loanState: "ACTIVE",
        l3App: "NONE",
        spendType: "UNSPENT",
        state: "1",
        l3_integration: "0",
        l3_category: "0",
      },
      {
        loanId: 149,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dDAI",
        loanMarketAddress:
          "0x4d84998c8cb5daa6664124c58d0006250c7631051a4b3abd61b03663ee1cc02",
        underlyingMarket: "DAI",
        underlyingMarketAddress:
          "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
        currentLoanMarketAddress:
          "0x129c74ca4274e3dbf7ab83f5916bebf087ce7af7495b3c648f1d2f2ab302330",
        collateralMarket: "rUSDC",
        collateralMarketAddress:
          "0x2fb267c4b264af1b8fea1052d3f8d853f438c7e2270eb39637375d3b5952a40",
        loanAmount: "43183502576250003648",
        loanAmountParsed: 43.183502,
        currentLoanAmount: "91971280962843475010671",
        currentLoanAmountParsed: 0,
        collateralAmount: "975178613",
        collateralAmountParsed: 975.178613,
        createdAt: "1970-01-20T13:04:32.951Z",
        loanState: "SPENT",
        l3App: "JEDI_SWAP",
        spendType: "LIQUIDITY",
        state: "2",
        l3_integration: "1962660952167394271600",
        l3_category: "2",
      },
      {
        loanId: 169,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dUSDT",
        loanMarketAddress:
          "0x7a6a7296e19273a10b3d4834ae14bec18f075f7d77d998b072bd5e5a747ab20",
        underlyingMarket: "USDT",
        underlyingMarketAddress:
          "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
        currentLoanMarketAddress:
          "0x4e05550a4899cda3d22ff1db5fc83f02e086eafa37f3f73837b0be9e565369e",
        collateralMarket: "rETH",
        collateralMarketAddress:
          "0x5bac7932c6a6dc0578feab3643269fa3ce7bf2729a1ede9c37273dcb9b1eec1",
        loanAmount: "2738298015",
        loanAmountParsed: 2738.298015,
        currentLoanAmount: "1367772494",
        currentLoanAmountParsed: 0,
        collateralAmount: "4990333089748695517",
        collateralAmountParsed: 4.990333,
        createdAt: "1970-01-20T13:11:14.347Z",
        loanState: "SPENT",
        l3App: "JEDI_SWAP",
        spendType: "LIQUIDITY",
        state: "2",
        l3_integration: "1962660952167394271600",
        l3_category: "2",
      },
      {
        loanId: 215,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dUSDC",
        loanMarketAddress:
          "0x3b8e16870d6eb725650d23a020883056a6f1093326fe547ac4d40e4c71052c9",
        underlyingMarket: "USDC",
        underlyingMarketAddress:
          "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
        currentLoanMarket: "USDC",
        currentLoanMarketAddress:
          "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
        collateralMarket: "rUSDT",
        collateralMarketAddress:
          "0x300f2c472ab337f55993a32fdf7c43016cb0d81c1d3e8b155b92fe6475086a1",
        loanAmount: "298654124",
        loanAmountParsed: 298.654124,
        currentLoanAmount: "299700001",
        currentLoanAmountParsed: 299.700001,
        collateralAmount: "99863472",
        collateralAmountParsed: 99.863472,
        createdAt: "1970-01-20T13:15:26.906Z",
        loanState: "ACTIVE",
        l3App: "NONE",
        spendType: "UNSPENT",
        state: "1",
        l3_integration: "0",
        l3_category: "0",
      },
      {
        loanId: 216,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dUSDT",
        loanMarketAddress:
          "0x7a6a7296e19273a10b3d4834ae14bec18f075f7d77d998b072bd5e5a747ab20",
        underlyingMarket: "USDT",
        underlyingMarketAddress:
          "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
        currentLoanMarket: "USDT",
        currentLoanMarketAddress:
          "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
        collateralMarket: "rUSDC",
        collateralMarketAddress:
          "0x2fb267c4b264af1b8fea1052d3f8d853f438c7e2270eb39637375d3b5952a40",
        loanAmount: "29920411",
        loanAmountParsed: 29.920411,
        currentLoanAmount: "29970001",
        currentLoanAmountParsed: 29.970001,
        collateralAmount: "9976218",
        collateralAmountParsed: 9.976218,
        createdAt: "1970-01-20T13:15:27.112Z",
        loanState: "ACTIVE",
        l3App: "NONE",
        spendType: "UNSPENT",
        state: "1",
        l3_integration: "0",
        l3_category: "0",
      },
      {
        loanId: 220,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dBTC",
        loanMarketAddress:
          "0x2880ea27d58d202ae78984f8462dd5b2808c3f6e7327af6deaa7ef454be58f",
        underlyingMarket: "BTC",
        underlyingMarketAddress:
          "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
        currentLoanMarketAddress:
          "0x4b6e4bef4dd1424b06d599a55c464e94cd9f3cb1a305eaa8a3db923519585f7",
        collateralMarket: "rUSDC",
        collateralMarketAddress:
          "0x2fb267c4b264af1b8fea1052d3f8d853f438c7e2270eb39637375d3b5952a40",
        loanAmount: "159742",
        loanAmountParsed: 0.001597,
        currentLoanAmount: "17956660159758593",
        currentLoanAmountParsed: 0,
        collateralAmount: "9976217",
        collateralAmountParsed: 9.976217,
        createdAt: "1970-01-20T13:15:27.303Z",
        loanState: "SPENT",
        l3App: "JEDI_SWAP",
        spendType: "LIQUIDITY",
        state: "2",
        l3_integration: "1962660952167394271600",
        l3_category: "2",
      },
      {
        loanId: 222,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dETH",
        loanMarketAddress:
          "0x5b5dece096eaf569624f215fcf0ed8210a16f79dca691aef1a42c716bd37da0",
        underlyingMarket: "ETH",
        underlyingMarketAddress:
          "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
        currentLoanMarket: "ETH",
        currentLoanMarketAddress:
          "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
        collateralMarket: "rUSDT",
        collateralMarketAddress:
          "0x300f2c472ab337f55993a32fdf7c43016cb0d81c1d3e8b155b92fe6475086a1",
        loanAmount: "24930276572827419",
        loanAmountParsed: 0.02493,
        currentLoanAmount: "25005969000000001",
        currentLoanAmountParsed: 0.025005,
        collateralAmount: "9986347",
        collateralAmountParsed: 9.986347,
        createdAt: "1970-01-20T13:15:27.303Z",
        loanState: "ACTIVE",
        l3App: "NONE",
        spendType: "UNSPENT",
        state: "1",
        l3_integration: "0",
        l3_category: "0",
      },
      {
        loanId: 223,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dDAI",
        loanMarketAddress:
          "0x4d84998c8cb5daa6664124c58d0006250c7631051a4b3abd61b03663ee1cc02",
        underlyingMarket: "DAI",
        underlyingMarketAddress:
          "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
        currentLoanMarketAddress:
          "0x129c74ca4274e3dbf7ab83f5916bebf087ce7af7495b3c648f1d2f2ab302330",
        collateralMarket: "rUSDT",
        collateralMarketAddress:
          "0x300f2c472ab337f55993a32fdf7c43016cb0d81c1d3e8b155b92fe6475086a1",
        loanAmount: "73698998545904862512",
        loanAmountParsed: 73.698998,
        currentLoanAmount: "197351294207533918602894",
        currentLoanAmountParsed: 0,
        collateralAmount: "14979520",
        collateralAmountParsed: 14.97952,
        createdAt: "1970-01-20T13:15:27.505Z",
        loanState: "SPENT",
        l3App: "JEDI_SWAP",
        spendType: "LIQUIDITY",
        state: "2",
        l3_integration: "1962660952167394271600",
        l3_category: "2",
      },
      {
        loanId: 224,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dBTC",
        loanMarketAddress:
          "0x2880ea27d58d202ae78984f8462dd5b2808c3f6e7327af6deaa7ef454be58f",
        underlyingMarket: "BTC",
        underlyingMarketAddress:
          "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
        currentLoanMarket: "BTC",
        currentLoanMarketAddress:
          "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
        collateralMarket: "rUSDT",
        collateralMarketAddress:
          "0x300f2c472ab337f55993a32fdf7c43016cb0d81c1d3e8b155b92fe6475086a1",
        loanAmount: "319484",
        loanAmountParsed: 0.003194,
        currentLoanAmount: "320081",
        currentLoanAmountParsed: 0.0032,
        collateralAmount: "19972694",
        collateralAmountParsed: 19.972694,
        createdAt: "1970-01-20T13:15:27.867Z",
        loanState: "ACTIVE",
        l3App: "NONE",
        spendType: "UNSPENT",
        state: "1",
        l3_integration: "0",
        l3_category: "0",
      },
      {
        loanId: 227,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dETH",
        loanMarketAddress:
          "0x5b5dece096eaf569624f215fcf0ed8210a16f79dca691aef1a42c716bd37da0",
        underlyingMarket: "ETH",
        underlyingMarketAddress:
          "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
        currentLoanMarket: "ETH",
        currentLoanMarketAddress:
          "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
        collateralMarket: "rUSDC",
        collateralMarketAddress:
          "0x2fb267c4b264af1b8fea1052d3f8d853f438c7e2270eb39637375d3b5952a40",
        loanAmount: "49798756060913350",
        loanAmountParsed: 0.049798,
        currentLoanAmount: "49950000000000001",
        currentLoanAmountParsed: 0.04995,
        collateralAmount: "19952435",
        collateralAmountParsed: 19.952435,
        createdAt: "1970-01-20T13:15:28.073Z",
        loanState: "ACTIVE",
        l3App: "NONE",
        spendType: "UNSPENT",
        state: "1",
        l3_integration: "0",
        l3_category: "0",
      },
      {
        loanId: 230,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dBTC",
        loanMarketAddress:
          "0x2880ea27d58d202ae78984f8462dd5b2808c3f6e7327af6deaa7ef454be58f",
        underlyingMarket: "BTC",
        underlyingMarketAddress:
          "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
        currentLoanMarket: "BTC",
        currentLoanMarketAddress:
          "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
        collateralMarket: "rBTC",
        collateralMarketAddress:
          "0x1a542a2859369b78515fe0ea16647e094dac5dba307f0c656a25c2b260df6ad",
        loanAmount: "29914",
        loanAmountParsed: 0.000299,
        currentLoanAmount: "29971",
        currentLoanAmountParsed: 0.000299,
        collateralAmount: "9985",
        collateralAmountParsed: 0.000099,
        createdAt: "1970-01-20T13:15:28.265Z",
        loanState: "ACTIVE",
        l3App: "NONE",
        spendType: "UNSPENT",
        state: "1",
        l3_integration: "0",
        l3_category: "0",
      },
      {
        loanId: 232,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dUSDT",
        loanMarketAddress:
          "0x7a6a7296e19273a10b3d4834ae14bec18f075f7d77d998b072bd5e5a747ab20",
        underlyingMarket: "USDT",
        underlyingMarketAddress:
          "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
        currentLoanMarket: "USDT",
        currentLoanMarketAddress:
          "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
        collateralMarket: "rBTC",
        collateralMarketAddress:
          "0x1a542a2859369b78515fe0ea16647e094dac5dba307f0c656a25c2b260df6ad",
        loanAmount: "9973460",
        loanAmountParsed: 9.97346,
        currentLoanAmount: "9990001",
        currentLoanAmountParsed: 9.990001,
        collateralAmount: "9985",
        collateralAmountParsed: 0.000099,
        createdAt: "1970-01-20T13:15:28.437Z",
        loanState: "ACTIVE",
        l3App: "NONE",
        spendType: "UNSPENT",
        state: "1",
        l3_integration: "0",
        l3_category: "0",
      },
      {
        loanId: 233,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dUSDC",
        loanMarketAddress:
          "0x3b8e16870d6eb725650d23a020883056a6f1093326fe547ac4d40e4c71052c9",
        underlyingMarket: "USDC",
        underlyingMarketAddress:
          "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
        currentLoanMarket: "USDC",
        currentLoanMarketAddress:
          "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
        collateralMarket: "rBTC",
        collateralMarketAddress:
          "0x1a542a2859369b78515fe0ea16647e094dac5dba307f0c656a25c2b260df6ad",
        loanAmount: "9955120",
        loanAmountParsed: 9.95512,
        currentLoanAmount: "9990001",
        currentLoanAmountParsed: 9.990001,
        collateralAmount: "9985",
        collateralAmountParsed: 0.000099,
        createdAt: "1970-01-20T13:15:28.613Z",
        loanState: "ACTIVE",
        l3App: "NONE",
        spendType: "UNSPENT",
        state: "1",
        l3_integration: "0",
        l3_category: "0",
      },
      {
        loanId: 234,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dETH",
        loanMarketAddress:
          "0x5b5dece096eaf569624f215fcf0ed8210a16f79dca691aef1a42c716bd37da0",
        underlyingMarket: "ETH",
        underlyingMarketAddress:
          "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
        currentLoanMarket: "ETH",
        currentLoanMarketAddress:
          "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
        collateralMarket: "rBTC",
        collateralMarketAddress:
          "0x1a542a2859369b78515fe0ea16647e094dac5dba307f0c656a25c2b260df6ad",
        loanAmount: "4979871203161618",
        loanAmountParsed: 0.004979,
        currentLoanAmount: "4995000000000001",
        currentLoanAmountParsed: 0.004995,
        collateralAmount: "9985",
        collateralAmountParsed: 0.000099,
        createdAt: "1970-01-20T13:15:28.801Z",
        loanState: "ACTIVE",
        l3App: "NONE",
        spendType: "UNSPENT",
        state: "1",
        l3_integration: "0",
        l3_category: "0",
      },
      {
        loanId: 235,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dDAI",
        loanMarketAddress:
          "0x4d84998c8cb5daa6664124c58d0006250c7631051a4b3abd61b03663ee1cc02",
        underlyingMarket: "DAI",
        underlyingMarketAddress:
          "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
        currentLoanMarket: "DAI",
        currentLoanMarketAddress:
          "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
        collateralMarket: "rBTC",
        collateralMarketAddress:
          "0x1a542a2859369b78515fe0ea16647e094dac5dba307f0c656a25c2b260df6ad",
        loanAmount: "12947102547870745616",
        loanAmountParsed: 12.947102,
        currentLoanAmount: "12987000000000000001",
        currentLoanAmountParsed: 12.987,
        collateralAmount: "9985",
        collateralAmountParsed: 0.000099,
        createdAt: "1970-01-20T13:15:28.801Z",
        loanState: "ACTIVE",
        l3App: "NONE",
        spendType: "UNSPENT",
        state: "1",
        l3_integration: "0",
        l3_category: "0",
      },
      {
        loanId: 236,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dUSDC",
        loanMarketAddress:
          "0x3b8e16870d6eb725650d23a020883056a6f1093326fe547ac4d40e4c71052c9",
        underlyingMarket: "USDC",
        underlyingMarketAddress:
          "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
        currentLoanMarket: "USDC",
        currentLoanMarketAddress:
          "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
        collateralMarket: "rETH",
        collateralMarketAddress:
          "0x5bac7932c6a6dc0578feab3643269fa3ce7bf2729a1ede9c37273dcb9b1eec1",
        loanAmount: "49685979823",
        loanAmountParsed: 49685.979823,
        currentLoanAmount: "49860090001",
        currentLoanAmountParsed: 49860.090001,
        collateralAmount: "4989688270491279590",
        collateralAmountParsed: 4.989688,
        createdAt: "1970-01-20T13:15:29.185Z",
        loanState: "ACTIVE",
        l3App: "NONE",
        spendType: "UNSPENT",
        state: "1",
        l3_integration: "0",
        l3_category: "0",
      },
      {
        loanId: 237,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dBTC",
        loanMarketAddress:
          "0x2880ea27d58d202ae78984f8462dd5b2808c3f6e7327af6deaa7ef454be58f",
        underlyingMarket: "BTC",
        underlyingMarketAddress:
          "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
        currentLoanMarket: "BTC",
        currentLoanMarketAddress:
          "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
        collateralMarket: "rETH",
        collateralMarketAddress:
          "0x5bac7932c6a6dc0578feab3643269fa3ce7bf2729a1ede9c37273dcb9b1eec1",
        loanAmount: "129628338",
        loanAmountParsed: 1.296283,
        currentLoanAmount: "129870001",
        currentLoanAmountParsed: 1.2987,
        collateralAmount: "4989688162837048678",
        collateralAmountParsed: 4.989688,
        createdAt: "1970-01-20T13:15:29.374Z",
        loanState: "ACTIVE",
        l3App: "NONE",
        spendType: "UNSPENT",
        state: "1",
        l3_integration: "0",
        l3_category: "0",
      },
      {
        loanId: 239,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dETH",
        loanMarketAddress:
          "0x5b5dece096eaf569624f215fcf0ed8210a16f79dca691aef1a42c716bd37da0",
        underlyingMarket: "ETH",
        underlyingMarketAddress:
          "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
        currentLoanMarket: "ETH",
        currentLoanMarketAddress:
          "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
        collateralMarket: "rETH",
        collateralMarketAddress:
          "0x5bac7932c6a6dc0578feab3643269fa3ce7bf2729a1ede9c37273dcb9b1eec1",
        loanAmount: "14939596004857552644",
        loanAmountParsed: 14.939596,
        currentLoanAmount: "14985000000000000001",
        currentLoanAmountParsed: 14.985,
        collateralAmount: "4989687918684730093",
        collateralAmountParsed: 4.989687,
        createdAt: "1970-01-20T13:15:29.762Z",
        loanState: "ACTIVE",
        l3App: "NONE",
        spendType: "UNSPENT",
        state: "1",
        l3_integration: "0",
        l3_category: "0",
      },
      {
        loanId: 240,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dDAI",
        loanMarketAddress:
          "0x4d84998c8cb5daa6664124c58d0006250c7631051a4b3abd61b03663ee1cc02",
        underlyingMarket: "DAI",
        underlyingMarketAddress:
          "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
        currentLoanMarket: "DAI",
        currentLoanMarketAddress:
          "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
        collateralMarket: "rETH",
        collateralMarketAddress:
          "0x5bac7932c6a6dc0578feab3643269fa3ce7bf2729a1ede9c37273dcb9b1eec1",
        loanAmount: "4013596179345117184994",
        loanAmountParsed: 4013.596179,
        currentLoanAmount: "4025970000000000000001",
        currentLoanAmountParsed: 4025.97,
        collateralAmount: "3991750233938883557",
        collateralAmountParsed: 3.99175,
        createdAt: "1970-01-20T13:15:29.952Z",
        loanState: "ACTIVE",
        l3App: "NONE",
        spendType: "UNSPENT",
        state: "1",
        l3_integration: "0",
        l3_category: "0",
      },
      {
        loanId: 241,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dUSDT",
        loanMarketAddress:
          "0x7a6a7296e19273a10b3d4834ae14bec18f075f7d77d998b072bd5e5a747ab20",
        underlyingMarket: "USDT",
        underlyingMarketAddress:
          "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
        currentLoanMarketAddress:
          "0x4e05550a4899cda3d22ff1db5fc83f02e086eafa37f3f73837b0be9e565369e",
        collateralMarket: "rDAI",
        collateralMarketAddress:
          "0x1e8ca2770648c089818c047ee09395258fd2b1562a081c2e31788b86e2355ac",
        loanAmount: "44880517",
        loanAmountParsed: 44.880517,
        currentLoanAmount: "22429785",
        currentLoanAmountParsed: 0,
        collateralAmount: "9978320854512811821",
        collateralAmountParsed: 9.97832,
        createdAt: "1970-01-20T13:15:29.952Z",
        loanState: "SPENT",
        l3App: "JEDI_SWAP",
        spendType: "LIQUIDITY",
        state: "2",
        l3_integration: "1962660952167394271600",
        l3_category: "2",
      },
      {
        loanId: 242,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dUSDC",
        loanMarketAddress:
          "0x3b8e16870d6eb725650d23a020883056a6f1093326fe547ac4d40e4c71052c9",
        underlyingMarket: "USDC",
        underlyingMarketAddress:
          "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
        currentLoanMarket: "USDC",
        currentLoanMarketAddress:
          "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
        collateralMarket: "rDAI",
        collateralMarketAddress:
          "0x1e8ca2770648c089818c047ee09395258fd2b1562a081c2e31788b86e2355ac",
        loanAmount: "46788958",
        loanAmountParsed: 46.788958,
        currentLoanAmount: "46953001",
        currentLoanAmountParsed: 46.953001,
        collateralAmount: "9978320320475234541",
        collateralAmountParsed: 9.97832,
        createdAt: "1970-01-20T13:15:30.146Z",
        loanState: "ACTIVE",
        l3App: "NONE",
        spendType: "UNSPENT",
        state: "1",
        l3_integration: "0",
        l3_category: "0",
      },
      {
        loanId: 243,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dBTC",
        loanMarketAddress:
          "0x2880ea27d58d202ae78984f8462dd5b2808c3f6e7327af6deaa7ef454be58f",
        underlyingMarket: "BTC",
        underlyingMarketAddress:
          "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
        currentLoanMarket: "BTC",
        currentLoanMarketAddress:
          "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
        collateralMarket: "rDAI",
        collateralMarketAddress:
          "0x1e8ca2770648c089818c047ee09395258fd2b1562a081c2e31788b86e2355ac",
        loanAmount: "151565",
        loanAmountParsed: 0.001515,
        currentLoanAmount: "151849",
        currentLoanAmountParsed: 0.001518,
        collateralAmount: "9978319797448768756",
        collateralAmountParsed: 9.978319,
        createdAt: "1970-01-20T13:15:30.336Z",
        loanState: "ACTIVE",
        l3App: "NONE",
        spendType: "UNSPENT",
        state: "1",
        l3_integration: "0",
        l3_category: "0",
      },
      {
        loanId: 244,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dETH",
        loanMarketAddress:
          "0x5b5dece096eaf569624f215fcf0ed8210a16f79dca691aef1a42c716bd37da0",
        underlyingMarket: "ETH",
        underlyingMarketAddress:
          "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
        currentLoanMarket: "ETH",
        currentLoanMarketAddress:
          "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
        collateralMarket: "rDAI",
        collateralMarketAddress:
          "0x1e8ca2770648c089818c047ee09395258fd2b1562a081c2e31788b86e2355ac",
        loanAmount: "24401299503376859",
        loanAmountParsed: 0.024401,
        currentLoanAmount: "24475500000000001",
        currentLoanAmountParsed: 0.024475,
        collateralAmount: "9978317763151508650",
        collateralAmountParsed: 9.978317,
        createdAt: "1970-01-20T13:15:31.075Z",
        loanState: "ACTIVE",
        l3App: "NONE",
        spendType: "UNSPENT",
        state: "1",
        l3_integration: "0",
        l3_category: "0",
      },
      {
        loanId: 250,
        borrower:
          "0x6561ce61e0c21c2c234b52f557b392a38abd10b30374692983c110048331efc",
        loanMarket: "dDAI",
        loanMarketAddress:
          "0x4d84998c8cb5daa6664124c58d0006250c7631051a4b3abd61b03663ee1cc02",
        underlyingMarket: "DAI",
        underlyingMarketAddress:
          "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
        currentLoanMarketAddress:
          "0x4e05550a4899cda3d22ff1db5fc83f02e086eafa37f3f73837b0be9e565369e",
        collateralMarket: "rDAI",
        collateralMarketAddress:
          "0x1e8ca2770648c089818c047ee09395258fd2b1562a081c2e31788b86e2355ac",
        loanAmount: "29874096708546425315",
        loanAmountParsed: 29.874096,
        currentLoanAmount: "14894772",
        currentLoanAmountParsed: 0,
        collateralAmount: "9978132603925134835",
        collateralAmountParsed: 9.978132,
        createdAt: "1970-01-20T13:16:45.633Z",
        loanState: "SPENT",
        l3App: "JEDI_SWAP",
        spendType: "LIQUIDITY",
        state: "2",
        l3_integration: "1962660952167394271600",
        l3_category: "2",
      },
    ];
    const deposits = [
      {
        tokenAddress:
          "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
        token: "BTC",
        rTokenAddress:
          "0x1a542a2859369b78515fe0ea16647e094dac5dba307f0c656a25c2b260df6ad",
        rToken: "rBTC",
        rTokenFreeParsed: 0.011983,
        rTokenLockedParsed: 0.000499,
        rTokenStakedParsed: 0,
        rTokenAmountParsed: 0.012482,
        underlyingAssetAmount: "130a4d",
        underlyingAssetAmountParsed: 0.012478,
      },
      {
        tokenAddress:
          "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
        token: "ETH",
        rTokenAddress:
          "0x5bac7932c6a6dc0578feab3643269fa3ce7bf2729a1ede9c37273dcb9b1eec1",
        rToken: "rETH",
        rTokenFreeParsed: 4.989688,
        rTokenLockedParsed: 23.951147,
        rTokenStakedParsed: 9.98067,
        rTokenAmountParsed: 28.940835,
        underlyingAssetAmount: "0191acdcf6fa04338e",
        underlyingAssetAmountParsed: 28.943751,
      },
      {
        tokenAddress:
          "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
        token: "USDT",
        rTokenAddress:
          "0x300f2c472ab337f55993a32fdf7c43016cb0d81c1d3e8b155b92fe6475086a1",
        rToken: "rUSDT",
        rTokenFreeParsed: 820.086325,
        rTokenLockedParsed: 281.171775,
        rTokenStakedParsed: 0,
        rTokenAmountParsed: 1101.2581,
        underlyingAssetAmount: "4199cf7c",
        underlyingAssetAmountParsed: 1100.599164,
      },
      {
        tokenAddress:
          "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
        token: "USDC",
        rTokenAddress:
          "0x2fb267c4b264af1b8fea1052d3f8d853f438c7e2270eb39637375d3b5952a40",
        rToken: "rUSDC",
        rTokenFreeParsed: 379.196503,
        rTokenLockedParsed: 1114.914858,
        rTokenStakedParsed: 489.32508,
        rTokenAmountParsed: 1494.1113610000002,
        underlyingAssetAmount: "591ac88a",
        underlyingAssetAmountParsed: 1494.927498,
      },
      {
        tokenAddress:
          "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
        token: "DAI",
        rTokenAddress:
          "0x1e8ca2770648c089818c047ee09395258fd2b1562a081c2e31788b86e2355ac",
        rToken: "rDAI",
        rTokenFreeParsed: 11.372023,
        rTokenLockedParsed: 49.891411,
        rTokenStakedParsed: 0,
        rTokenAmountParsed: 61.263434,
        underlyingAssetAmount: "035269063c6430d677",
        underlyingAssetAmountParsed: 61.278516,
      },
    ];
    const prices = [
      {
        name: "BTC",
        address:
          "0x25ef77455d671317799ecda57ee634633b2577d9f9f439c062d7e9c9e1fc29f",
        price: 30196.1,
        lastUpdated: "2023-07-17T11:10:30.000Z",
      },
      {
        name: "ETH",
        address:
          "0x5d22cffa8d9538876d2b553e97c6067d34de78949c146d9d7e37b054403a536",
        price: 1914.5,
        lastUpdated: "2023-07-17T11:10:30.000Z",
      },
      {
        name: "USDT",
        address:
          "0x4b68b44da8123719395b1670c60e55f0a5e0571d0dbb33b2c2d991ee4a3f1c5",
        price: 1,
        lastUpdated: "2023-07-17T11:10:30.000Z",
      },
      {
        name: "USDC",
        address:
          "0x27d11831d1a104c63210944ee137375f8b0a2adcfa085453827cda2991454ca",
        price: 1,
        lastUpdated: "2023-07-17T11:10:30.000Z",
      },
      {
        name: "DAI",
        address:
          "0xc1e528bbbb53eeab7f89c00ad87aef8a12e4caf07832112febc53d76cfca16",
        price: 0.99,
        lastUpdated: "2023-07-17T11:10:30.000Z",
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
    const netAPR = await getNetApr(deposits, loans, prices, stats);
    expect(netAPR).toBe(expectedNetAPR);
  });
  //   it("displays the l3USDT Value", async () => {
  //     const expectedL3USDTValue = [
  //       {
  //         low: "5ec8976a12ba",
  //         high: "00",
  //       },
  //     ];
  //     const loanId = 5;
  //     const loanMarketAddress = 0x7a6a7296e19273a10b3d4834ae14bec18f075f7d77d998b072bd5e5a747ab20;
  //     const l3USDTValue = await getL3USDTValue(loanId, loanMarketAddress);
  //     expect(l3USDTValue).toBe(expectedL3USDTValue);
  //   });
});
