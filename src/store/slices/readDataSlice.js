import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  userDeposits: null,
  protocolStats: null,
  oraclePrices: null,
  userLoans: null,
  aprAndHealthFactor: null,
  hourlyBTCData:{
    
  },
  hourlyETHData:null,
  hourlyUSDTData:null,
  hourlyUSDCData:null,
  hourlyDAIData:null,


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
  effectiveAPR: null,
  healthFactor: null,
};

export const readDataSlice = createSlice({
  name: "read_data",
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
    setProtocolReserves(state, action) {
      return { ...state, protocolReserves: action.payload };
    },
    setAprAndHealthFactor(state, action) {
      state.aprAndHealthFactor = action.payload;
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
      const count = action.payload == "reset" ? -1 : state.transactionRefresh;
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
    setHourlyBTCData(state,action){
      state.hourlyBTCData=action.payload;
    },
    setHourlyETHData(state,action){
      state.hourlyETHData=action.payload;
    },
    setHourlyUSDTData(state,action){
      state.hourlyUSDTData=action.payload;
    },
    setHourlyUSDCData(state,action){
      state.hourlyUSDCData=action.payload;
    },
    setHourlyDAIData(state,action){
      state.hourlyDAIData=action.payload
    },
    resetState(state, action) {
      return { ...initialState };
    },
    setEffectiveAPR(state, action) {
      state.effectiveAPR = action.payload;
    },
    setHealthFactor(state, action) {
      state.healthFactor = action.payload;
    },

    extraReducers: {
      [HYDRATE]: (state, action) => {
        return {
          ...state,
          ...action.payload.read_data,
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
  setProtocolReserves,
  setAprAndHealthFactor,
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
  setHourlyBTCData,
  setHourlyDAIData,
  setHourlyETHData,
  setHourlyUSDCData,
  setHourlyUSDTData,
  resetState,
  setEffectiveAPR,
  setHealthFactor,
} = readDataSlice.actions;

export const selectUserDeposits = (state) => state.read_data.userDeposits;
export const selectProtocolStats = (state) => state.read_data.protocolStats;
export const selectOraclePrices = (state) => state.read_data.oraclePrices;
export const selectUserLoans = (state) => state.read_data.userLoans;
export const selectAprAndHealthFactor = (state) =>
  state.read_data.aprAndHealthFactor;
export const selectProtocolReserves = (state) =>
  state.read_data.protocolReserves;
export const selectYourSupply = (state) => state.read_data.yourSupply;
export const selectYourBorrow = (state) => state.read_data.yourBorrow;
export const selectNetWorth = (state) => state.read_data.netWorth;
export const selectNetAPR = (state) => state.read_data.netAPR;
export const selectActiveTransactions = (state) =>
  state.read_data.activeTransactions;
export const selectTransactionRefresh = (state) =>
  state.read_data.transactionRefresh;
export const selectUserDepositsCount = (state) =>
  state.read_data.userDepositsCount;
export const selectProtocolReservesCount = (state) =>
  state.read_data.protocolReservesCount;
export const selectProtocolStatsCount = (state) =>
  state.read_data.protocolStatsCount;
export const selectUserLoansCount = (state) => state.read_data.userLoansCount;
export const selectOraclePricesCount = (state) =>
  state.read_data.oraclePricesCount;
export const selectUserInfoCount = (state) => state.read_data.userInfoCount;
export const selectBlock = (state) => state.read_data.block;
export const selectCurrentNetwork = (state) => state.read_data.currentNetwork;
export const selectEffectiveApr = (state) => state.read_data.effectiveAPR;
export const selectHealthFactor = (state) => state.read_data.healthFactor;
export const selectHourlyBTCData=(state)=>state.read_data.hourlyBTCData;
export const selectHourlyETHData=(state)=>state.read_data.hourlyETHData;
export const selectHourlyUSDTData=(state)=>state.read_data.hourlyUSDTData;
export const selectHourlyUSDCData=(state)=>state.read_data.hourlyUSDCData;
export const selectHourlyDAIData=(state)=>state.read_data.hourlyDAIData;
export default readDataSlice.reducer;
