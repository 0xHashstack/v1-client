export type NativeToken = "BTC" | "ETH" | "DAI" | "USDC" | "USDT";
export type DToken = "dBTC" | "dETH" | "dDAI" | "dUSDC" | "dUSDT";
export type RToken = "rBTC" | "rETH" | "rDAI" | "rUSDC" | "rUSDT";

export type Token = NativeToken | DToken | RToken;

export type LoanState = "ACTIVE" | "SPENT" | "REPAID" | "LIQUIDATED" | null;
export type SpendType = "UNSPENT" | "SWAP" | "LIQUIDITY" | null;
export type L3App = "JEDI_SWAP" | "MY_SWAP" | "YAGI" | "NONE";
export type Method = "SWAP" | "ADD_LIQUIDITY";

export type ItokenAddressMap = {
  [key in Token]: string | undefined;
};

export type ItokenDecimalsMap = {
  [key in Token]: number | undefined;
};

export interface ILoan {
  loanId: number; // loan id
  borrower: string; // borrower address

  loanMarket: DToken | undefined; // dToken like dBTC
  loanMarketAddress: string | undefined; // dToken Address
  underlyingMarket: NativeToken | undefined; // BTC
  underlyingMarketAddress: string | undefined; // BTC Address
  currentLoanMarket: string | undefined; // USDT, will be native only or any lpToken  after swap this is pair(lp) address
  currentLoanMarketAddress: string | undefined; // USDT Address
  collateralMarket: RToken | undefined; // rToken like rUSDC
  collateralMarketAddress: string | undefined; // rToken Address

  loanAmount: string; // dToken amount
  loanAmountParsed: number;

  currentLoanAmount: string; // native tokens
  currentLoanAmountParsed: number;

  collateralAmount: string; // rToken amount
  collateralAmountParsed: number;

  loanState: LoanState;
  spendType: SpendType;
  l3App: L3App;
  createdAt: Date;

  state: string | null;
  l3_integration: string;
  l3_category: string;
}

export interface IDeposit {
  tokenAddress: string;
  token: NativeToken;
  rToken: RToken;
  rTokenAddress: string;
  // 2000 USDT -> 2000 rUSDT
  // 500rusdt i staked
  // 1500rusdt i have free(wallet balance)
  // 500rusdt i have locked(still in my wallet but locked for loans)
  // 1000 rusdt free + locked = 1500rusdt
  rTokenFreeParsed: number;
  rTokenLockedParsed: number;
  rTokenStakedParsed: number;
  
  rTokenAmountParsed: number;   // sum of rTokenFreeParsed + rTokenLockedParsed

  underlyingAssetAmount: number;
  underlyingAssetAmountParsed: number;
}

export interface IMarketInfo {
  borrowRate: number; // borrow rate
  supplyRate: number;
  stakingRate: number;

  totalSupply: number; //
  lentAssets: number;
  totalBorrow: number;
  availableReserves: number;

  utilisationPerMarket: number;
  exchangeRateRtokenToUnderlying: number; // 10^18 precision
  exchangeRateDTokenToUnderlying: number; // 10^18 precision
  exchangeRateUnderlyingToRtoken: number;
  exchangeRateUnderlyingToDtoken: number;

  tokenAddress: String;
  token: NativeToken;
}

export interface IProtocolReserves {
  totalReserves: number | null;  // usdt terms(6 decimals)
  availableReserves: number | null;
  avgAssetUtilisation: number | null; // weighted avg of all the utilisations of markets
}

export interface IUserStats {
  netWorth: number; // current values of loans - total borrow + total supply
  yourSupply: number; // usd terms
  yourBorrow: number; // usd terms
  netSupplyAPR: number; // usd terms
  netBorrowAPR: number; // usd terms
}

// Net apr = (total supply * supply apr - total borrow * borrow apr) / networth
