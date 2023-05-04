import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  account: "",
  accountAddress: "",
  inputSupplyAmount:0,
  inputBorrowModalCollateralAmount:0,
  inputBorrowModalBorrowAmount:0,
  coinSelectedSupplyModal:"BTC",
  collateralCoinSelectedBorrowModal:"BTC",
  borrowCoinSelectedBorrowModal:"BTC",
  walletBalance:90,


};

export const userAccountSlice = createSlice({
  name: "user_account",
  initialState,
  reducers: {
    setAccount(state, action) {},
    setAccountAddress(state, action) {
      state.accountAddress = action.payload;
    },
    setInputSupplyAmount(state,action){
      state.inputSupplyAmount=action.payload;
    },
    setCoinSelectedSupplyModal(state,action){
      state.coinSelectedSupplyModal=action.payload;
    },
    setInputBorrowModalCollateralAmount(state,action){
      state.inputBorrowModalCollateralAmount=action.payload;
    },
    setInputBorrowModalBorrowAmount(state,action){
      state.inputBorrowModalBorrowAmount=action.payload;
    },
    setWalletBalance(state,action){
      state.walletBalance=action.payload;
    },
    setCollateralCoinSelectedBorrowModal(state,action){
      state.collateralCoinSelectedBorrowModal=action.payload;
    },
    setBorrowCoinSelectedBorrowModal(state,action){
      state.borrowCoinSelectedBorrowModal=action.payload;
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

export const { setAccountAddress } = userAccountSlice.actions;
export const {setInputSupplyAmount}=userAccountSlice.actions;
export const {setInputBorrowModalCollateralAmount}=userAccountSlice.actions;
export const {setInputBorrowModalBorrowAmount}=userAccountSlice.actions;
export const {setCoinSelectedSupplyModal}=userAccountSlice.actions;
export const {setCollateralCoinSelectedBorrowModal}=userAccountSlice.actions;
export const {setBorrowCoinSelectedBorrowModal}=userAccountSlice.actions;
export const selectInputSupplyAmount=(state)=>state.user_account.inputSupplyAmount;
export const selectCoinSelectedSupplyModal=(state)=>state.user_account.coinSelectedSupplyModal;
export const selectCollateralCoinSelectedBorrowModal=(state)=>state.user_account.collateralCoinSelectedBorrowModal;
export const selectBorrowCoinSelectedBorrowModal=(state)=>state.user_account.borrowCoinSelectedBorrowModal;
export const selectWalletBalance=(state)=>state.user_account.walletBalance;
export const selectAccountAddress = (state) =>
  state.user_account.accountAddress;
export default userAccountSlice.reducer;
