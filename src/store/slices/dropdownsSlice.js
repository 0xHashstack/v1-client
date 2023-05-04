import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  navDropdowns: {
    moreButtonDropdown: false,
    walletConnectionDropdown: false,
    borrowModalBorrowMarketDropdown: false,
    borrowModalCollateralMarketDropdown: false,
    supplyModalDropdown:false,
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
      state.navDropdowns = dropdowns;
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
export const selectNavDropdowns = (state) => state.dropdowns.navDropdowns;
export default dropdownSlice.reducer;
