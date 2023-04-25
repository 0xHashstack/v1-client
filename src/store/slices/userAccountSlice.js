import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  accountAddress: "",
};

export const userAccountSlice = createSlice({
  name: "user_account",
  initialState,
  reducers: {
    setAccountAddress(state, action) {
      state.accountAddress = action.payload;
    },

    extraReducers: {
      [HYDRATE]: (state, action) => {
        return {
          ...state,
          ...action.payload.auth,
        };
      },
    },
  },
});

export const { setAccountAddress } = userAccountSlice.actions;
export const selectAccountAddress = (state) =>
  state.user_account.accountAddress;
export default userAccountSlice.reducer;
