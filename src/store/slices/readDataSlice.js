import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  userDeposits: null,
  protocolStats: null,
  oraclePrices: null,
  userLoans: null,
  aprAndHealthFactor: null,
  hourlyBTCData: {},
  hourlyETHData: null,
  hourlyUSDTData: null,
  hourlyUSDCData: null,
  hourlyDAIData: null,
  dailyBTCData: null,
  dailyETHData: null,
  dailyUSDTData: null,
  dailyUSDCData: null,
  dailyDAIData: null,

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
  block: null,
  currentNetwork: null,
  effectiveAPR: null,
  healthFactor: null,
  yourMetricsSupply: null,
  yourMetricsBorrow: null,
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
    setBlock(state, action) {
      state.block = action.payload;
    },
    setCurrentNetwork(state, action) {
      state.currentNetwork = action.payload;
    },
    setHourlyBTCData(state, action) {
      state.hourlyBTCData = action.payload;
    },
    setHourlyETHData(state, action) {
      state.hourlyETHData = action.payload;
    },
    setHourlyUSDTData(state, action) {
      state.hourlyUSDTData = action.payload;
    },
    setHourlyUSDCData(state, action) {
      state.hourlyUSDCData = action.payload;
    },
    setHourlyDAIData(state, action) {
      state.hourlyDAIData = action.payload;
    },
    setDailyBTCData(state, action) {
      state.dailyBTCData = action.payload;
    },
    setDailyETHData(state, action) {
      state.dailyETHData = action.payload;
    },
    setDailyUSDTData(state, action) {
      state.dailyUSDTData = action.payload;
    },
    setDailyUSDCData(state, action) {
      state.dailyUSDCData = action.payload;
    },
    setDailyDAIData(state, action) {
      state.dailyDAIData = action.payload;
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
    setYourMetricsSupply(state, action) {
      state.yourMetricsSupply = action.payload;
    },
    setYourMetricsBorrow(state, action) {
      state.yourMetricsBorrow = action.payload;
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
  setDailyBTCData,
  setDailyETHData,
  setDailyUSDCData,
  setDailyUSDTData,
  setDailyDAIData,
  setYourMetricsBorrow,
  setYourMetricsSupply,
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
export const selectBlock = (state) => state.read_data.block;
export const selectCurrentNetwork = (state) => state.read_data.currentNetwork;
export const selectEffectiveApr = (state) => state.read_data.effectiveAPR;
export const selectHealthFactor = (state) => state.read_data.healthFactor;
export const selectHourlyBTCData = (state) => state.read_data.hourlyBTCData;
export const selectHourlyETHData = (state) => state.read_data.hourlyETHData;
export const selectHourlyUSDTData = (state) => state.read_data.hourlyUSDTData;
export const selectHourlyUSDCData = (state) => state.read_data.hourlyUSDCData;
export const selectHourlyDAIData = (state) => state.read_data.hourlyDAIData;
export const selectDailyBTCData = (state) => state.read_data.dailyBTCData;
export const selectDailyETHData = (state) => state.read_data.dailyETHData;
export const selectDailyUSDTData = (state) => state.read_data.dailyUSDTData;
export const selectDailyUSDCData = (state) => state.read_data.dailyUSDCData;
export const selectDailyDAIData = (state) => state.read_data.dailyDAIData;
export const selectYourMetricsSupply = (state) =>
  state.read_data.yourMetricsSupply;
export const selectYourMetricsBorrow = (state) =>
  state.read_data.yourMetricsBorrow;
export default readDataSlice.reducer;
