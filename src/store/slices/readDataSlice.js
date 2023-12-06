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
  monthlyBTCData: null,
  monthlyETHData: null,
  monthlyUSDTData: null,
  monthlyUSDCData: null,
  monthlyDAIData: null,
  allBTCData: null,
  allETHData: null,
  allUSDTData: null,
  allUSDCData: null,
  allDAIData: null,

  protocolReserves: {
    totalReserves: null,
    availableReserves: null,
    avgAssetUtilisation: null,
  },
  netWorth: null,
  yourSupply: null,
  yourBorrow: null,
  netAPR: null,
  netAPRDeposits:null,
  netAPRLoans:null,
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
  jediSwapPoolsSupported:null,
  mySwapPoolsSupported:null,
  nftBalance:null,
  referral:null,
  userType:null,
  existingLink:null,
  messageHash:null,
  signature:null,
  nftMaxAmount:null,
  nftCurrentAmount:null,
  whitelisted:false,
  interactedAddress:false,
  jediSwapPoolAprs:[],
  stakingShares: {
    rBTC: null,
    rETH: null,
    rUSDT: null,
    rUSDC: null,
    rDAI: null,
  },
  minDepositAmounts:{
    rBTC: 0.00037,
    rETH: 0.006,
    rUSDT: 10,
    rUSDC: 10,
    rDAI: 10,
  },
  maxDepositAmounts:{
    rBTC: 0.00074,
    rETH: 0.012,
    rUSDT: 20,
    rUSDC: 20,
    rDAI: 20,
  },
  minLoanAmounts:{
    dBTC: 0.001,
    dETH: 0.018,
    dUSDT: 30,
    dUSDC: 30,
    dDAI: 30,
  },
  maxLoanAmounts:{
    dBTC: 0.00148,
    dETH: 0.024,
    dUSDT: 40,
    dUSDC: 40,
    dDAI: 40,
  },
  fees:{
    supply: 0,
    stake: 0,
    unstake: 0,
    withdrawSupply: 0,
    borrow: 0,
    borrowAndTrade: 0.1,  
    l3interaction:0.1,
    repayLoan:0,
  }

  
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
    setNetAprDeposits(state,action){
      state.netAPRDeposits=action.payload;
    },
    setNetAprLoans(state,action){
      state.netAPRLoans=action.payload;
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
    setMonthlyBTCData(state, action) {
      state.monthlyBTCData = action.payload;
    },
    setMonthlyETHData(state, action) {
      state.monthlyETHData = action.payload;
    },
    setMonthlyUSDTData(state, action) {
      state.monthlyUSDTData = action.payload;
    },
    setMonthlyUSDCData(state, action) {
      state.monthlyUSDCData = action.payload;
    },
    setMonthlyDAIData(state, action) {
      state.monthlyDAIData = action.payload;
    },
    setAllBTCData(state, action) {
      state.allBTCData = action.payload;
    },
    setAllETHData(state, action) {
      state.allETHData = action.payload;
    },
    setAllUSDTData(state, action) {
      state.allUSDTData = action.payload;
    },
    setAllUSDCData(state, action) {
      state.allUSDCData = action.payload;
    },
    setAllDAIData(state, action) {
      state.allDAIData = action.payload;
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
    setStakingShares(state, action) {
      state.stakingShares = action.payload;
    },
    setMinimumDepositAmounts(state,action){
      state.minDepositAmounts=action.payload;
    },
    setMaximumDepositAmounts(state,action){
      state.maxDepositAmounts=action.payload;
    },
    setMinimumLoanAmounts(state,action){
      state.minLoanAmounts=action.payload;
    },
    setMaximumLoanAmounts(state,action){
      state.maxLoanAmounts=action.payload;
    },
    setJediSwapPoolsSupported(state,action){
      state.jediSwapPoolsSupported=action.payload;
    },
    setMySwapPoolsSupported(state,action){
      state.mySwapPoolsSupported=action.payload;
    },
    setNftBalance(state,action){
      state.nftBalance=action.payload;
    },
    setReferral(state,action){
      state.referral=action.payload;
    },
    setUserType(state,action){
      state.userType=action.payload;
    },
    setExisitingLink(state,action){
      state.existingLink=action.payload;
    },
    setMessageHash(state,action){
      state.messageHash=action.payload;
    },
    setSignature(state,action){
      state.signature=action.payload;
    },
    setFees(state,action){
      state.fees=action.payload;
    },
    setNftMaxAmount(state,action){
      state.nftMaxAmount=action.payload;
    },
    setNftCurrentAmount(state,action){
      state.nftCurrentAmount=action.payload;
    },
    setUserWhiteListed(state,action){
      state.whitelisted=action.payload;
    },
    setInteractedAddress(state,action){
      state.interactedAddress=action.payload;
    },
    setJediSwapPoolAprs(state,action){
      state.jediSwapPoolAprs=action.payload;
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
  setNetAprDeposits,
  setNetAprLoans,
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
  setMonthlyBTCData,
  setMonthlyETHData,
  setMonthlyUSDCData,
  setMonthlyUSDTData,
  setMonthlyDAIData,
  setAllBTCData,
  setAllETHData,
  setAllUSDCData,
  setAllUSDTData,
  setAllDAIData,
  setYourMetricsBorrow,
  setYourMetricsSupply,
  setStakingShares,
  setMinimumDepositAmounts,
  setMaximumDepositAmounts,
  setMinimumLoanAmounts,
  setMaximumLoanAmounts,
  setNftBalance,
  setReferral,
  setUserType,
  setExisitingLink,
  setMessageHash,
  setSignature,
  setJediSwapPoolsSupported,
  setMySwapPoolsSupported,
  setFees,
  setNftMaxAmount,
  setNftCurrentAmount,
  setUserWhiteListed,
  setInteractedAddress,
  setJediSwapPoolAprs
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
export const selectnetAprDeposits=(state)=> state.read_data.netAPRDeposits;
export const selectnetAprLoans=(state)=>state.read_data.netAPRLoans;
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
export const selectMonthlyBTCData = (state) => state.read_data.monthlyBTCData;
export const selectMonthlyETHData = (state) => state.read_data.monthlyETHData;
export const selectMonthlyUSDTData = (state) => state.read_data.monthlyUSDTData;
export const selectMonthlyUSDCData = (state) => state.read_data.monthlyUSDCData;
export const selectMonthlyDAIData = (state) => state.read_data.monthlyDAIData;
export const selectAllBTCData = (state) => state.read_data.allBTCData;
export const selectAllETHData = (state) => state.read_data.allETHData;
export const selectAllUSDTData = (state) => state.read_data.allUSDTData;
export const selectAllUSDCData = (state) => state.read_data.allUSDCData;
export const selectAllDAIData = (state) => state.read_data.allDAIData;
export const selectYourMetricsSupply = (state) =>
  state.read_data.yourMetricsSupply;
export const selectYourMetricsBorrow = (state) =>
  state.read_data.yourMetricsBorrow;
export const selectStakingShares = (state) => state.read_data.stakingShares;
export const selectMinimumDepositAmounts=(state)=>state.read_data.minDepositAmounts;
export const selectMaximumDepositAmounts=(state)=>state.read_data.maxDepositAmounts;
export const selectMinimumLoanAmounts=(state)=>state.read_data.minLoanAmounts;
export const selectMaximumLoanAmounts=(state)=>state.read_data.maxLoanAmounts;
export const selectJediSwapPoolsSupported = (state) => state.read_data.jediSwapPoolsSupported;
export const selectMySwapPoolsSupported = (state) => state.read_data.mySwapPoolsSupported;
export const selectFees=(state)=>state.read_data.fees;
export const selectNftBalance=(state)=>state.read_data.nftBalance;
export const selectreferral=(state)=>state.read_data.referral;
export const selectUserType=(state)=>state.read_data.userType;
export const selectExistingLink=(state)=>state.read_data.existingLink;
export const selectMessageHash=(state)=>state.read_data.messageHash;
export const selectSignature=(state)=>state.read_data.signature;
export const selectNftMaxAmount=(state)=>state.read_data.nftMaxAmount;
export const selectNftCurrentAmount=(state)=>state.read_data.nftCurrentAmount;
export const selectWhiteListed=(state)=>state.read_data.whitelisted;
export const selectInteractedAddress=(state)=>state.read_data.interactedAddress;
export const selectJediswapPoolAprs=(state)=>state.read_data.jediSwapPoolAprs;
export default readDataSlice.reducer;
