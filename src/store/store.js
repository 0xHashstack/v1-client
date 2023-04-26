import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { userAccountSlice } from "./slices/userAccountSlice";

export const store = configureStore({
  reducer: {
    [userAccountSlice.name]: userAccountSlice.reducer,
  },
  devTools: true,
});
    