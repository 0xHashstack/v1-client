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
    yourMetricsMarketDropdown: false,
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
  },
};

export const dropdownSlice = createSlice({
  name: "dropdowns",
  initialState,
  reducers: {
    setNavDropdown(state, action) {
      const dropdownName = action.payload;
      const dropdowns = { ...state.navDropdowns };
      Object.keys(dropdowns).forEach((key) => {
        if (key === dropdownName) {
          dropdowns[key] = !dropdowns[key];
        } else {
          dropdowns[key] = false;
        }
      });
      state.currentDropdown = dropdownName;
      console.log("aryan1", dropdownName);
      state.navDropdowns = dropdowns;
    },
    setModalDropdown(state, action) {
      const dropdownName = action.payload;
      const dropdowns = { ...state.modalDropdowns };
      Object.keys(dropdowns).forEach((key) => {
        if (key === dropdownName) {
          dropdowns[key] = !dropdowns[key];
        } else {
          dropdowns[key] = false;
        }
      });
      state.currentDropdown = dropdownName;
      console.log("aryan1", dropdownName);
      state.modalDropdowns = dropdowns;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.dropdowns,
      };
    },
  },
});

export const { setNavDropdown } = dropdownSlice.actions;
export const { setModalDropdown } = dropdownSlice.actions;
export const selectNavDropdowns = (state) => state.dropdowns.navDropdowns;
export const selectCurrentDropdown = (state) => state.dropdowns.currentDropdown;
export const selectModalDropDowns = (state) => state.dropdowns.modalDropdowns;
export default dropdownSlice.reducer;
