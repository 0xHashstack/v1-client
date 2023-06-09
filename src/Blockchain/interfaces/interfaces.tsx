export interface ItokenAddressMap {
    [key: string]: string | undefined;
}

export interface ItokenDecimalsMap {
    [key: string]: number | undefined;
}

export interface ILoan {
    loanId: number; // loan id
    borrower: string; // borrower address
  
    loanMarket: string | undefined;    // dToken like dBTC
    loanMarketAddress: string | undefined; // dToken Address 
    underlyingMarket: string | undefined;  // BTC
    underlyingMarketAddress: string | undefined; // BTC Address
    currentLoanMarket: string | undefined;  // USDT, will be native only
    currentLoanMarketAddress: string | undefined; // USDT Address
    collateralMarket: string | undefined;  // rToken like rUSDC
    collateralMarketAddress: string | undefined; // rToken Address
  
    loanAmount: number;  // dToken amount
    currentLoanAmount: number;  // dToken amount
    collateralAmount: number;  // rToken amount
  
    createdAt: Date;
    state: string | null;
  
    l3_integration: string;
    l3App: string | null;
  
    l3_category: string;
}

