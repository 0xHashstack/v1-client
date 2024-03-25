import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  currentDropdown: "",
  currentModalDropdown: "",
  navDropdowns: {
    moreButtonDropdown: false,
    walletConnectionDropdown: false,
    settingsDropdown: false,
    languagesDropdown: false,
  },
  modalDropdowns: {
    borrowModalBorrowMarketDropdown: false,
    borrowModalCollateralMarketDropdown: false,
    tradeModalBorrowMarketDropdown: false,
    tradeModalCollateralMarketDropdown: false,
    supplyModalDropdown: false,
    yourBorrowModalBorrowMarketDropdown1: false,
    yourBorrowBorrowIDsDropdown1: false,
    yourBorrowModalBorrowMarketDropdown2: false,
    yourBorrowBorrowIDsDropdown2: false,
    yourBorrowModalActionDropdown: false,
    yourBorrowDappDropdown: false,
    yourBorrowPoolDropdown: false,
    yourSupplyAddsupplyDropdown: false,
    yourSupplyWithdrawlDropdown: false,
    spendBorrowBorrowIDDropdown: false,
    spendBorrowBorrowMarketDropdown: false,
    walletConnectDropDown: false,
    stakeMarketDropDown: false,
    unstakeMarketDropDown: false,
    swapModalSupplyMarketDropDown: false,
    swapModalBorrowMarketDropDown: false,
    swapModalBorrowIDDropDown: false,
    stakeModalSupplyMarketDropDown: false,
    stakeModalBorrowMarketDropDown: false,
    stakeModalBorrowIDDropDown: false,
    liquidityProvisionPoolDropDown: false,
    liquidityProvisionBorrowIDDropDown: false,
    liquidityProvisionBorrowMarketDropDown: false,
    supplyEquivalentMarketDropDown: false,
    transferDepositProtocolDropdown: false,
    transferDepostMarketDropdown: false,
    yourBorrowTokenDropdown: false,
    coinSelectedExchangeRateDToken: false,
    coinSelectedAPRByMarket: false,
    coinSelectedExchangeRateRToken: false,
    liquidityMiningTenureDropDown: false,
    borrowDropdown:false,
    degenModeDropdown:false,
  },
  metricsDropdowns: {
    yourMetricsMarketDropdown: false,
  },
  airdropDropdowns: {
    airdropAndCcpDropdown: false,
  },
};

export const dropdownSlice = createSlice({
  name: "dropdowns",
  initialState,
  reducers: {
    setNavDropdown(state, action) {
      const dropdownName = action.payload;
      const dropdowns = { ...state.navDropdowns };
      Object.keys(dropdowns)?.forEach((key) => {
        if (key == dropdownName) {
          dropdowns[key] = !dropdowns[key];
        } else {
          dropdowns[key] = false;
        }
      });
      state.currentDropdown = dropdownName;

      state.navDropdowns = dropdowns;
    },
    setModalDropdown(state, action) {
      const dropdownName = action.payload;
      const dropdowns = { ...state.modalDropdowns };
      Object.keys(dropdowns)?.forEach((key) => {
        if (key === dropdownName) {
          dropdowns[key] = !dropdowns[key];
        } else {
          dropdowns[key] = false;
        }
      });
      state.currentDropdown = dropdownName;

      state.modalDropdowns = dropdowns;
    },
    setMetricsDropdown(state, action) {
      const dropdownName = action.payload;
      const dropdowns = { ...state.metricsDropdowns };
      Object.keys(dropdowns)?.forEach((key) => {
        if (key == dropdownName) {
          dropdowns[key] = !dropdowns[key];
        } else {
          dropdowns[key] = false;
        }
      });
      state.currentDropdown = dropdownName;
      // alert(dropdownName);
      state.metricsDropdowns = dropdowns;
    },
    setAirdropDropdown(state, action) {
      const dropdownName = action.payload;
      const dropdowns = { ...state.airdropDropdowns };
      Object.keys(dropdowns)?.forEach((key) => {
        if (key == dropdownName) {
          dropdowns[key] = !dropdowns[key];
        } else {
          dropdowns[key] = false;
        }
      });
      state.currentDropdown = dropdownName;
      state.airdropDropdowns = dropdowns;
    },
    resetModalDropdowns(state) {
      state.modalDropdowns = initialState.modalDropdowns;
      state.currentModalDropdown = initialState.currentModalDropdown;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetModalDropdowns, (state) => {
        state.navDropdowns = initialState.navDropdowns;
        state.modalDropdowns = initialState.modalDropdowns;
        state.currentModalDropdown = initialState.currentModalDropdown;
        state.currentDropdown = initialState.currentDropdown;
      })
      .addCase(HYDRATE, (state, action) => {
        return {
          ...state,
          ...action.payload.dropdowns,
        };
      });
  },
});

export const { setNavDropdown, resetModalDropdowns } = dropdownSlice.actions;
export const { setModalDropdown } = dropdownSlice.actions;
export const { setMetricsDropdown } = dropdownSlice.actions;
export const { setAirdropDropdown } = dropdownSlice.actions;
export const selectNavDropdowns = (state) => state.dropdowns.navDropdowns;
export const selectCurrentDropdown = (state) => state.dropdowns.currentDropdown;
export const selectModalDropDowns = (state) => state.dropdowns.modalDropdowns;
export const selectCurrentModalDropdown = (state) =>
  state.dropdowns.currentModalDropdown;
export const selectMetricsDropdowns = (state) =>
  state.dropdowns.metricsDropdowns;
export default dropdownSlice.reducer;
export const selectAirdropDropdowns = (state) =>
  state.dropdowns.airdropDropdowns;
