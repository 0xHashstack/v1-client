import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  refreshHooks: false,
  userDeposits: null,
  protocolStats: null,
  oraclePrices: null,
  userLoans: null,

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
};

export const userAccountSlice = createSlice({
  name: "user_account",
  initialState,
  reducers: {
    setUserLoans(state, action) {
      state.userLoans = action.payload;
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
    },
    setProtocolStatsCount(state, action) {
      state.protocolStatsCount = state.transactionRefresh;
    },
    setOraclePricesCount(state, action) {
      state.oraclePricesCount = state.transactionRefresh;
    },
    setUserInfoCount(state, action) {
      state.userInfoCount = state.transactionRefresh;
    },
    setUserDepositsCount(state, action) {
      state.userDepositsCount = state.transactionRefresh;
    },
    setUserLoansCount(state, action) {
      state.userLoansCount = state.transactionRefresh;
    },
    setBlock(state, action) {
      state.block = action.payload;
    },
    setCurrentNetwork(state, action) {
      state.currentNetwork = action.payload;
    },

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
  setUserLoans,
  setUserDeposits,
  setProtocolStats,
  setOraclePrices,
  setReserves,
  setRefreshHooks,
  setProtocolReserves,
  setNetWorth,
  setYourSupply,
  setYourBorrow,
  setNetAPR,
  setActiveTransactions,
  setTransactionRefresh,
  setProtocolReservesCount,
  setProtocolStatsCount,
  setOraclePricesCount,
  setUserInfoCount,
  setUserDepositsCount,
  setUserLoansCount,
  setBlock,
  setCurrentNetwork,
} = userAccountSlice.actions;

export const selectUserDeposits = (state) => state.user_account.userDeposits;
export const selectProtocolStats = (state) => state.user_account.protocolStats;
export const selectOraclePrices = (state) => state.user_account.oraclePrices;
export const selectUserLoans = (state) => state.user_account.userLoans;

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
export const selectProtocolReservesCount = (state) =>
  state.user_account.protocolReservesCount;
export const selectProtocolStatsCount = (state) =>
  state.user_account.protocolStatsCount;
export const selectUserLoansCount = (state) =>
  state.user_account.userLoansCount;
export const selectOraclePricesCount = (state) =>
  state.user_account.oraclePricesCount;
export const selectUserInfoCount = (state) => state.user_account.userInfoCount;
export const selectBlock = (state) => state.user_account.block;
export const selectCurrentNetwork = (state) =>
  state.user_account.currentNetwork;

export default userAccountSlice.reducer;
