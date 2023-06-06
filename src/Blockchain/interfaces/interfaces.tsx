export interface ItokenAddressMap {
    [key: string]: string | undefined;
}

export interface IDtokenAddressMap {
    [key: string]: string | undefined;
}

export interface IRTokenAddressMap {
    [key: string]: string | undefined;
}

export interface ItokenDecimalsMap {
    [key: string]: number | undefined;
}

export interface ILoans {
    loanId: number;
    loanMarket: string | undefined;
    loanMarketAddress: string | undefined;
    loanAmount: number;
    collateralMarket: string | undefined;
    collateralAmount: number;
    loanInterest: number;
    interestRate: number;
    account: string | undefined;
    cdr: number;
    debtCategory: number | undefined;
    isSwapped: boolean;
    state: string;
    stateType: number;
    currentLoanMarket: string | undefined;
    currentLoanAmount: number;
    l3Integration: number | undefined;
    l3Category: number | undefined;
    createdAt: Date;
}

