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
  hourlyDataCount:-1,

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
      state.protocolReservesCount = state.transactionRefresh;
      // const count = state.protocolReservesCount + 1;
      // return {
      //   ...state,
      //   protocolReservesCount: count,
      // };
    },
    setProtocolStatsCount(state, action) {
      state.protocolStatsCount = state.transactionRefresh;
      // const count = state.protocolStatsCount + 1;
      // return { ...state, protocolStatsCount: count };
    },
    setOraclePricesCount(state, action) {
      state.oraclePricesCount = state.transactionRefresh;
      // const count = state.oraclePricesCount + 1;
      // return { ...state, oraclePricesCount: count };
    },
    setUserInfoCount(state, action) {
      state.userInfoCount = state.transactionRefresh;
      // const count = state.userInfoCount + 1;
      // return { ...state, userInfoCount: count };
    },
    setUserDepositsCount(state, action) {
      state.userDepositsCount = state.transactionRefresh;
      // const count = state.userDepositsCount + 1;
      // return { ...state, userDepositsCount: count };
    },
    setUserLoansCount(state, action) {
      state.userLoansCount = state.transactionRefresh;
      // const count = state.userLoansCount + 1;
      // return { ...state, userLoansCount: count };
    },
    setAprsAndHealthCount(state, action) {
      state.aprAndHealthFactorCount = state.transactionRefresh;
    },
    setHourlyDataCount(state,action){
      state.hourlyDataCount=state.hourlyDataCount;
    },
    setAccountReset(state, action) {
      return { ...initialState };
    },

    setAprCount(state, action) {
      state.aprCount = state.transactionRefresh;
    },
    setHealthFactorCount(state, action) {
      state.healthFactorCount = state.transactionRefresh;
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
  setUserUnspentLoans,
  setTransactionStartedAndModalClosed,
  setAccountReset,
  setAprCount,
  setHealthFactorCount,
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
  state.user_account.transactionStartedAndModalClosed;
export const selectInputSupplyAmount = (state) =>
  state.user_account.inputSupplyAmount;
export const selectCoinSelectedSupplyModal = (state) =>
  state.user_account.coinSelectedSupplyModal;
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
export const selectHourlyDataCount=(state)=>
  state.user_account.hourlyDataCount;
export const selectUserUnspentLoans = (state) =>
  state.user_account.userUnspentLoans;
export const selectAprCount = (state) => state.user_account.aprCount;
export const selectHealthFactorCount = (state) =>
  state.user_account.healthFactorCount;
// export const select=(state)=> state.user_account.
export default userAccountSlice.reducer;
