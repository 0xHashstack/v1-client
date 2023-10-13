import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  account: "",
  accountAddress: "",
  inputSupplyAmount: 0,
  inputBorrowModalCollateralAmount: 0,
  inputBorrowModalBorrowAmount: 0,
  inputTradeModalCollateralAmount: 0,
  inputTradeModalBorrowAmount: 0,
  coinSelectedSupplyModal: "BTC",
  collateralCoinSelectedBorrowModal: "BTC",
  borrowCoinSelectedBorrowModal: "BTC",
  coinSelectedExchangeRateDToken: "BTC",
  coinSelectedExchangeRateRToken: "BTC",
  coinSelectedAPRByMarket: "BTC",
  spendBorrowselectedDapp: "",
  walletBalance: 90,
  inputYourBorrowModalRepayAmount: 0,
  transactionStatus: "",
  // currentTransactionStatus: "",
  language: "English",
  currentPage: "market",
  reserves: undefined,
  oracleAndFairPrices: undefined,
  offchainCurrentBlock: undefined,
  assetWalletBalance: "",
  userLoans: null,
  userUnspentLoans: null,
  transactionSuccessArray: [],
  transactionFailureArray: [],
  transactionStartedAndStartToast: false,

  toastTransactionStarted: false,
  transactionStarted: false,
  transactionStartedAndModalClosed: false,
  refreshHooks: false,

  protocolReserves: {
    totalReserves: null,
    availableReserves: null,
    avgAssetUtilisation: null,
  },
  activeTransactions: [],
  transactionRefresh: 0,
  avgSupplyAPR: null,
  avgBorrowAPR: null,
  protocolStatsCount: -1,
  protocolReservesCount: -1,
  userDepositsCount: -1,
  userLoansCount: -1,
  oraclePricesCount: -1,
  userInfoCount: -1,
  aprAndHealthFactorCount: -1,
  aprCount: -1,
  healthFactorCount: -1,
  hourlyDataCount: -1,
  weeklyDataCount: -1,
  monthlyDataCount:-1,
  allDataCount:-1,
  netAprCount: -1,
  avgBorrowAprCount: -1,
  avgSupplyAprCount: -1,
  yourMetricsSupplyCount: -1,
  yourMetricsBorrowCount: -1,
  stakingSharesCount: -1,
  jediSwapPoolsSupportedCount:-1,
  mySwapPoolsSupportedCount:-1,
  minMaxDepositCount:-1,
  minMaxLoanCount:-1,
  feesCount:-1,
  transactionCheck: [],
  lightModeSelected:false,

  // walletBalance: {
  //   BTC: 0,
  //   USDT: 0,
  //   USDC: 0,
  //   ETH: 0,
  //   DAI: 0,
  // },
};

export const userAccountSlice = createSlice({
  name: "user_account",
  initialState,
  reducers: {
    setAccount(state, action) {
      state.account = action.payload;
    },
    setAssetWalletBalance(state, action) {
      state.assetWalletBalance = action.payload;
    },
    setTransactionSuccessArray(state, action) {
      state.transactionSuccessArray = action.payload;
    },
    setTransactionFailureArray(state, action) {
      state.transactionFailureArray = action.payload;
    },
    setUserUnspentLoans(state, action) {
      state.userUnspentLoans = action.payload;
    },
    setAccountAddress(state, action) {
      state.accountAddress = action.payload;
    },
    setTransactionStatus(state, action) {
      state.transactionStatus = action.payload;
    },
    // setCurrentTransactionStatus(state, action) {
    //   state.currentTransactionStatus = action.payload;
    // },
    setAvgSupplyAPR(state, action) {
      state.avgSupplyAPR = action.payload;
    },
    setAvgBorrowAPR(state, action) {
      state.avgBorrowAPR = action.payload;
    },
    setLanguage(state, action) {
      state.language = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setReserves(state, action) {
      state.reserves = action.payload;
    },
    setOracleAndFairPrices(state, action) {
      state.oracleAndFairPrices = action.payload;
    },
    setOffchainCurrentBlock(state, action) {
      state.offchainCurrentBlock = action.payload;
    },
    setInputSupplyAmount(state, action) {
      state.inputSupplyAmount = action.payload;
    },
    setCoinSelectedSupplyModal(state, action) {
      state.coinSelectedSupplyModal = action.payload;
    },
    setCoinSelectedExchangeRateDToken(state, action) {
      state.coinSelectedExchangeRateDToken = action.payload;
    },
    setCoinSelectedExchangeRateRToken(state, action) {
      state.coinSelectedExchangeRateRToken = action.payload;
    },
    setCoinSelectedAPRByMarket(state, action) {
      state.coinSelectedAPRByMarket = action.payload;
    },
    setInputBorrowModalCollateralAmount(state, action) {
      state.inputBorrowModalCollateralAmount = action.payload;
    },
    setInputBorrowModalBorrowAmount(state, action) {
      state.inputBorrowModalBorrowAmount = action.payload;
    },
    setSpendBorrowSelectedDapp(state, action) {
      state.spendBorrowselectedDapp = action.payload;
    },
    setInputTradeModalCollateralAmount(state, action) {
      state.inputTradeModalCollateralAmount = action.payload;
    },
    setInputTradeModalBorrowAmount(state, action) {
      state.inputTradeModalBorrowAmount = action.payload;
    },
    setWalletBalance(state, action) {
      state.walletBalance = action.payload;
    },
    setCollateralCoinSelectedBorrowModal(state, action) {
      state.collateralCoinSelectedBorrowModal = action.payload;
    },
    setBorrowCoinSelectedBorrowModal(state, action) {
      state.borrowCoinSelectedBorrowModal = action.payload;
    },
    setInputYourBorrowModalRepayAmount(state, action) {
      state.inputYourBorrowModalRepayAmount = action.payload;
    },
    setToastTransactionStarted(state, action) {
      state.toastTransactionStarted = action.payload;
    },
    setTransactionStarted(state, action) {
      state.transactionStarted = !state.transactionStarted;
    },
    setRefreshHooks(state, action) {
      state.refreshHooks = action.payload;
    },
    setTransactionStartedAndModalClosed(state, action) {
      state.transactionStartedAndModalClosed = action.payload;
    },
    setActiveTransactions(state, action) {
      state.activeTransactions = action.payload;
    },
    setProtocolReservesCount(state, action) {
      state.protocolReservesCount = action.payload;
      // const count = state.protocolReservesCount + 1;
      // return {
      //   ...state,
      //   protocolReservesCount: count,
      // };
    },
    setProtocolStatsCount(state, action) {
      state.protocolStatsCount = action.payload;
      // const count = state.protocolStatsCount + 1;
      // return { ...state, protocolStatsCount: count };
    },
    setOraclePricesCount(state, action) {
      state.oraclePricesCount = action.payload;
      // const count = state.oraclePricesCount + 1;
      // return { ...state, oraclePricesCount: count };
    },
    setUserInfoCount(state, action) {
      state.userInfoCount = action.payload;
      // const count = state.userInfoCount + 1;
      // return { ...state, userInfoCount: count };
    },
    setUserDepositsCount(state, action) {
      state.userDepositsCount = action.payload;
      // const count = state.userDepositsCount + 1;
      // return { ...state, userDepositsCount: count };
    },
    setUserLoansCount(state, action) {
      state.userLoansCount = action.payload;
      // const count = state.userLoansCount + 1;
      // return { ...state, userLoansCount: count };
    },
    setAprsAndHealthCount(state, action) {
      state.aprAndHealthFactorCount = action.payload;
    },
    setHourlyDataCount(state, action) {
      state.hourlyDataCount = action.payload;
    },
    setWeeklyDataCount(state, action) {
      state.weeklyDataCount = action.payload;
    },
    setMonthlyDataCount(state,action){
      state.monthlyDataCount=action.payload;
    },
    setAllDataCount(state,action){
      state.allDataCount=action.payload;
    },
    setAccountReset(state, action) {
      return { ...initialState };
    },

    setAprCount(state, action) {
      state.aprCount = action.payload;
    },
    setHealthFactorCount(state, action) {
      state.healthFactorCount = action.payload;
    },
    setNetAprCount(state, action) {
      state.netAprCount = action.payload;
    },
    setAvgBorrowAprCount(state, action) {
      state.avgBorrowAprCount = action.payload;
    },
    setAvgSupplyAprCount(state, action) {
      state.avgSupplyAprCount = action.payload;
    },
    setYourMetricsSupplyCount(state, action) {
      state.yourMetricsSupplyCount = action.payload;
    },
    setYourMetricsBorrowCount(state, action) {
      state.yourMetricsBorrowCount = action.payload;
    },
    setStakingSharesCount(state, action) {
      state.stakingSharesCount = action.payload;
    },
    setJediSwapPoolsSupportedCount(state,action){
      state.jediSwapPoolsSupportedCount=action.payload;
    },
    setMySwapPoolsSupportedCount(state,action){
      state.mySwapPoolsSupportedCount=action.payload;
    },
    setMinMaxDepositCount(state,action){
      state.minMaxDepositCount=action.payload;
    },
    setMinMaxLoanCount(state,action){
      state.minMaxLoanCount=action.payload;
    },
  setFeesCount(state,action){
    state.feesCount=action.payload;
  },
    setLightModeSelected(state,action){
      state.lightModeSelected=action.payload;
    },
    setTransactionCheck(state, action) {
      let data = state.transactionCheck;
      if (data.includes(action.payload[0])) {
        if (action.payload[1] == "remove") {
          data = data.filter((val) => val != action.payload[0]);
        }
      } else {
        if (action.payload[1] == "add") {
          data.push(action.payload[0]);
        }
      }
      state.transactionCheck = data;
    },
    // setWalletBalance(state, action) {
    //   state.walletBalance = action.payload;
    // },

    extraReducers: {
      [HYDRATE]: (state, action) => {
        return {
          ...state,
          ...action.payload.user_account,
        };
      },
    },
  },
});

export const {
  setAccount,
  setAccountAddress,
  setCurrentPage,
  setLanguage,
  setReserves,
  setOracleAndFairPrices,
  setOffchainCurrentBlock,
  setSpendBorrowSelectedDapp,
  setAssetWalletBalance,
  setToastTransactionStarted,
  setTransactionStarted,
  setTransactionSuccessArray,
  setTransactionFailureArray,
  setActiveTransactions,
  setAvgBorrowAPR,
  setAvgSupplyAPR,
  setUserInfoCount,
  setUserLoansCount,
  setOraclePricesCount,
  setUserDepositsCount,
  setProtocolStatsCount,
  setProtocolReservesCount,
  setAprsAndHealthCount,
  setHourlyDataCount,
  setWeeklyDataCount,
  setMonthlyDataCount,
  setAllDataCount,
  setUserUnspentLoans,
  setTransactionStartedAndModalClosed,
  setAccountReset,
  setAprCount,
  setHealthFactorCount,
  setNetAprCount,
  setAvgBorrowAprCount,
  setAvgSupplyAprCount,
  setYourMetricsSupplyCount,
  setYourMetricsBorrowCount,
  setStakingSharesCount,
  setJediSwapPoolsSupportedCount,
  setMySwapPoolsSupportedCount,
  setMinMaxDepositCount,
  setMinMaxLoanCount,
  setFeesCount,
  setTransactionCheck,
  setLightModeSelected
} = userAccountSlice.actions;
export const selectAccount = (state) => state.user_account.account;
export const { setInputSupplyAmount } = userAccountSlice.actions;
export const { setTransactionStatus } = userAccountSlice.actions;
// export const { setCurrentTransactionStatus } = userAccountSlice.actions;
export const { setInputBorrowModalCollateralAmount } = userAccountSlice.actions;
export const { setInputBorrowModalBorrowAmount } = userAccountSlice.actions;
export const { setInputTradeModalCollateralAmount } = userAccountSlice.actions;
export const { setInputTradeModalBorrowAmount } = userAccountSlice.actions;
export const { setCoinSelectedSupplyModal } = userAccountSlice.actions;
export const { setCoinSelectedExchangeRateDToken } = userAccountSlice.actions;
export const { setCoinSelectedExchangeRateRToken } = userAccountSlice.actions;
export const { setCoinSelectedAPRByMarket } = userAccountSlice.actions;
export const { setCollateralCoinSelectedBorrowModal } =
  userAccountSlice.actions;
export const { setBorrowCoinSelectedBorrowModal } = userAccountSlice.actions;
export const { setInputYourBorrowModalRepayAmount } = userAccountSlice.actions;
export const selectTransactionSuccessArray = (state) =>
  state.user_account.transactionSuccessArray;
export const selectTransactionFailureArray = (state) =>
  state.user_account.transactionFailureArray;
export const selectSelectedDapp = (state) =>
  state.user_account.spendBorrowselectedDapp;
export const selectTransactionStatus = (state) =>
  state.user_account.transactionStatus;
// export const selectCurrentTransactionStatus = (state) =>
//   state.user_account.currentTransactionStatus;
export const selectAssetWalletBalance = (state) =>
  state.user_account.assetWalletBalance;
export const selectTransactionStartedAndModalClosed = (state) =>
  state.user_account?.transactionStartedAndModalClosed;
export const selectInputSupplyAmount = (state) =>
  state.user_account.inputSupplyAmount;
export const selectCoinSelectedSupplyModal = (state) =>
  state.user_account.coinSelectedSupplyModal;
export const selectCoinSelectedExchangeRateDToken = (state) =>
  state.user_account.coinSelectedExchangeRateDToken;
export const selectCollateralCoinSelectedBorrowModal = (state) =>
  state.user_account.collateralCoinSelectedBorrowModal;
export const selectBorrowCoinSelectedBorrowModal = (state) =>
  state.user_account.borrowCoinSelectedBorrowModal;
export const selectWalletBalance = (state) => state.user_account.walletBalance;
export const selectAccountAddress = (state) =>
  state.user_account.accountAddress;
export const selectAvgSupplyAPR = (state) => state.user_account.avgSupplyAPR;
export const selectAvgBorrowAPR = (state) => state.user_account.avgBorrowAPR;
export const selectLanguage = (state) => state.user_account.language;
export const selectCurrentPage = (state) => state.user_account.currentPage;
export const selectReserves = (state) => state.user_account.reserves;
export const selectOracleAndFairPrices = (state) =>
  state.user_account.oracleAndFairPrices;
export const selectOffchainCurrentBlock = (state) =>
  state.user_account.offchainCurrentBlock;
export const selectToastTransactionStarted = (state) =>
  state.user_account.toastTransactionStarted;
export const selectTransactionStarted = (state) =>
  state.user_account.transactionStarted;
export const selectActiveTransactions = (state) =>
  state.user_account.activeTransactions;
export const selectUserDepositsCount = (state) =>
  state.user_account.userDepositsCount;
export const selectprotocolReservesCount = (state) =>
  state.user_account.protocolReservesCount;
export const selectProtocolStatsCount = (state) =>
  state.user_account.protocolStatsCount;
export const selectUserLoansCount = (state) =>
  state.user_account.userLoansCount;
export const selectOraclePricesCount = (state) =>
  state.user_account.oraclePricesCount;
export const selectUserInfoCount = (state) => state.user_account.userInfoCount;
export const selectAprsAndHealthCount = (state) =>
  state.user_account.aprAndHealthFactorCount;
export const selectHourlyDataCount = (state) =>
  state.user_account.hourlyDataCount;
export const selectWeeklyDataCount = (state) =>
  state.user_account.weeklyDataCount;
  export const selectMonthlyDataCount = (state) =>
  state.user_account.monthlyDataCount;
  export const selectAllDataCount = (state) =>
  state.user_account.allDataCount;
export const selectUserUnspentLoans = (state) =>
  state.user_account.userUnspentLoans;
export const selectAprCount = (state) => state.user_account.aprCount;
export const selectHealthFactorCount = (state) =>
  state.user_account.healthFactorCount;
export const selectNetAprCount = (state) => state.user_account.netAprCount;
export const selectAvgBorrowAprCount = (state) =>
  state.user_account.avgBorrowAprCount;
export const selectAvgSupplyAprCount = (state) =>
  state.user_account.avgSupplyAprCount;
export const selectYourMetricsSupplyCount = (state) =>
  state.user_account.yourMetricsSupplyCount;
export const selectYourMetricsBorrowCount = (state) =>
  state.user_account.yourMetricsBorrowCount;
export const selectStakingSharesCount = (state) =>
  state.user_account.stakingSharesCount;
  export const selectJediSwapPoolsSupportedCount = (state) =>
  state.user_account.jediSwapPoolsSupportedCount;
  export const selectMySwapPoolsSupportedCount = (state) =>
  state.user_account.mySwapPoolsSupportedCount;
export const selectMinMaxDepositCount=(state)=>
  state.user_account.minMaxDepositCount;
  export const selectMinMaxLoanCount=(state)=>
  state.user_account.minMaxLoanCount;
export const selectFeesCount=(state)=>
  state.user_account.feesCount;
export const selectTransactionCheck = (state) =>
  state.user_account.transactionCheck;
export const selectLightModeSelected=(state)=>
  state.user_account.lightModeSelected;
// export const select=(state)=> state.user_account.
export default userAccountSlice.reducer;
