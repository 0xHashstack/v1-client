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
  refreshHooks: false,
  userDeposits: null,
  protocolStats: null,
  oraclePrices: null,

  protocolReserves: {
    totalReserves: null,
    availableReserves: null,
    avgAssetUtilisation: null,
  },
  netWorth: null,
  yourSupply: null,
  yourBorrow: null,
  netAPR: null,
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
  block: null,
  currentNetwork: null,

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
    setUserLoans(state, action) {
      state.userLoans = action.payload;
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
    setUserDeposits(state, action) {
      state.userDeposits = action.payload;
    },
    setProtocolStats(state, action) {
      state.protocolStats = action.payload;
    },
    setOraclePrices(state, action) {
      state.oraclePrices = action.payload;
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
    setProtocolReserves(state, action) {
      return { ...state, protocolReserves: action.payload };
    },
    setNetWorth(state, action) {
      state.netWorth = action.payload;
    },
    setYourSupply(state, action) {
      state.yourSupply = action.payload;
    },
    setYourBorrow(state, action) {
      state.yourBorrow = action.payload;
    },
    setNetAPR(state, action) {
      state.netAPR = action.payload;
    },
    setActiveTransactions(state, action) {
      state.activeTransactions = action.payload;
    },
    setTransactionRefresh(state, action) {
      const count = state.transactionRefresh;
      state.transactionRefresh = count + 1;
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
    setBlock(state, action) {
      state.block = action.payload;
    },
    setCurrentNetwork(state, action) {
      state.currentNetwork = action.payload;
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
  setUserLoans,
  setTransactionSuccessArray,
  setTransactionFailureArray,
  setProtocolReserves,
  setYourBorrow,
  setYourSupply,
  setNetAPR,
  setNetWorth,
  setUserDeposits,
  setProtocolStats,
  setOraclePrices,
  setActiveTransactions,
  setTransactionRefresh,
  setAvgBorrowAPR,
  setAvgSupplyAPR,
  setUserInfoCount,
  setUserLoansCount,
  setOraclePricesCount,
  setUserDepositsCount,
  setProtocolStatsCount,
  setProtocolReservesCount,
  setUserUnspentLoans,
  setBlock,
  setCurrentNetwork,
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
export const selectUserDeposits = (state) => state.user_account.userDeposits;
export const selectProtocolStats = (state) => state.user_account.protocolStats;
export const selectOraclePrices = (state) => state.user_account.oraclePrices;
// export const selectCurrentTransactionStatus = (state) =>
//   state.user_account.currentTransactionStatus;
export const selectAssetWalletBalance = (state) =>
  state.user_account.assetWalletBalance;
export const selectUserLoans = (state) => state.user_account.userLoans;

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
export const selectProtocolReserves = (state) =>
  state.user_account.protocolReserves;
export const selectYourSupply = (state) => state.user_account.yourSupply;

export const selectYourBorrow = (state) => state.user_account.yourBorrow;
export const selectNetWorth = (state) => state.user_account.netWorth;

export const selectNetAPR = (state) => state.user_account.netAPR;
export const selectActiveTransactions = (state) =>
  state.user_account.activeTransactions;

export const selectTransactionRefresh = (state) =>
  state.user_account.transactionRefresh;
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
export const selectUserUnspentLoans = (state) =>
  state.user_account.userUnspentLoans;
export const selectBlock = (state) => state.user_account.block;
export const selectCurrentNetwork = (state) =>
  state.user_account.currentNetwork;
// export const select=(state)=> state.user_account.
export default userAccountSlice.reducer;
