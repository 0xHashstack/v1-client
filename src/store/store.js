import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { userAccountSlice } from "./slices/userAccountSlice";
import { dropdownSlice } from "./slices/dropdownsSlice";

export const store = configureStore({
  reducer: {
    [userAccountSlice.name]: userAccountSlice.reducer,
    [dropdownSlice.name]: dropdownSlice.reducer,
  },
  devTools: true,
});
