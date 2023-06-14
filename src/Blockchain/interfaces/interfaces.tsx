export interface ItokenAddressMap {
  [key: string]: string | undefined;
}

export interface ItokenDecimalsMap {
  [key: string]: number | undefined;
}

export interface ILoan {
  loanId: number; // loan id 
  borrower: string; // borrower address

  loanMarket: string | undefined; // dToken like dBTC
  loanMarketAddress: string | undefined; // dToken Address
  underlyingMarket: string | undefined; // BTC
  underlyingMarketAddress: string | undefined; // BTC Address
  currentLoanMarket: string | undefined; // USDT, will be native only
  currentLoanMarketAddress: string | undefined; // USDT Address
  collateralMarket: string | undefined; // rToken like rUSDC
  collateralMarketAddress: string | undefined; // rToken Address

  loanAmount: number; // dToken amount
  currentLoanAmount: number; // native tokens
  collateralAmount: number; // rToken amount

  createdAt: Date;
  state: string | null;

  l3_integration: string;
  l3App: string | null;

  l3_category: string;
}
const loans = [{ loanId: 132, borrower: "123" }];
export interface IDeposit {
  tokenAddress: string;
  rTokenAmount: number;
  underlyingAssetAmount: number;
}

export interface IMarketInfo {
  borrowRate: number; // borrow rate
  supplyRate: number;
  stakingRate: number;

  totalSupply: number; //
  lentAssets: number;
  totalBorrow: number;

  utilisationPerMarket: number;
  exchangeRateRtokenToUnderlying: number; // 10^18 precision
  exchangeRateDTokenToUnderlying: number; // 10^18 precision
  exchangeRateUnderlyingToRtoken: number;
  exchangeRateUnderlyingToDtoken: number;

  tokenAddress: string;
}

export interface IProtocolReserves {
  totalReserves: number;
  availableReserves: number;
  avgAssetUtilisation: number; // weighted avg of all the utilisations of markets
}

export interface IUserStats {
  netWorth: number; // current values of loans - total borrow + total supply
  yourSupply: number; // usd terms
  yourBorrow: number; // usd terms
  netSupplyAPR: number; // usd terms
  netBorrowAPR: number; // usd terms
}

// Net apr = (total supply * supply apr - total borrow * borrow apr) / networth
