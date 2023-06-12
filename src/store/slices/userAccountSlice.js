import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  account: "",
  accountAddress: "",
  inputSupplyAmount: 0,
  inputBorrowModalCollateralAmount: 0,
  inputBorrowModalBorrowAmount: 0,
  inputTradeModalCollateralAmount: 0,
  inputTradeModalBorrowAmount: 0,
  coinSelectedSupplyModal: "BTC",
  collateralCoinSelectedBorrowModal: "BTC",
  borrowCoinSelectedBorrowModal: "BTC",
  spendBorrowselectedDapp: "",
  walletBalance: 90,
  inputYourBorrowModalRepayAmount: 0,
  transactionStatus:"",

  language: "English",
  currentPage: "market",
  reserves: undefined,
  oracleAndFairPrices: undefined,
  offchainCurrentBlock: undefined,

  // walletBalance: {
  //   BTC: 0,
  //   USDT: 0,
  //   USDC: 0,
  //   ETH: 0,
  //   DAI: 0,
  // },
};

export const userAccountSlice = createSlice({
  name: "user_account",
  initialState,
  reducers: {
    setAccount(state, action) {
      state.account = action.payload;
    },
    setAccountAddress(state, action) {
      state.accountAddress = action.payload;
    },
    setTransactionStatus(state,action){
      state.transactionStatus=action.payload;
    },
    setLanguage(state, action) {
      state.language = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setReserves(state, action) {
      state.reserves = action.payload;
    },
    setOracleAndFairPrices(state, action) {
      state.oracleAndFairPrices = action.payload;
    },
    setOffchainCurrentBlock(state, action) {
      state.offchainCurrentBlock = action.payload;
    },
    setInputSupplyAmount(state, action) {
      state.inputSupplyAmount = action.payload;
    },
    setCoinSelectedSupplyModal(state, action) {
      state.coinSelectedSupplyModal = action.payload;
    },
    setInputBorrowModalCollateralAmount(state, action) {
      state.inputBorrowModalCollateralAmount = action.payload;
    },
    setInputBorrowModalBorrowAmount(state, action) {
      state.inputBorrowModalBorrowAmount = action.payload;
    },
    setSpendBorrowSelectedDapp(state, action) {
      state.spendBorrowselectedDapp = action.payload;
    },
    setInputTradeModalCollateralAmount(state, action) {
      state.inputTradeModalCollateralAmount = action.payload;
    },
    setInputTradeModalBorrowAmount(state, action) {
      state.inputTradeModalBorrowAmount = action.payload;
    },
    setWalletBalance(state, action) {
      state.walletBalance = action.payload;
    },
    setCollateralCoinSelectedBorrowModal(state, action) {
      state.collateralCoinSelectedBorrowModal = action.payload;
    },
    setBorrowCoinSelectedBorrowModal(state, action) {
      state.borrowCoinSelectedBorrowModal = action.payload;
    },
    setInputYourBorrowModalRepayAmount(state, action) {
      state.inputYourBorrowModalRepayAmount = action.payload;
    },
    // setWalletBalance(state, action) {
    //   state.walletBalance = action.payload;
    // },

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

export const {
  setAccount,
  setAccountAddress,
  setCurrentPage,
  setLanguage,
  setReserves,
  setOracleAndFairPrices,
  setOffchainCurrentBlock,
  setSpendBorrowSelectedDapp,
} = userAccountSlice.actions;
export const selectAccount = (state) => state.user_account.account;
export const { setInputSupplyAmount } = userAccountSlice.actions;
export const {setTransactionStatus}=userAccountSlice.actions;
export const { setInputBorrowModalCollateralAmount } = userAccountSlice.actions;
export const { setInputBorrowModalBorrowAmount } = userAccountSlice.actions;
export const { setInputTradeModalCollateralAmount } = userAccountSlice.actions;
export const { setInputTradeModalBorrowAmount } = userAccountSlice.actions;
export const { setCoinSelectedSupplyModal } = userAccountSlice.actions;
export const { setCollateralCoinSelectedBorrowModal } =
  userAccountSlice.actions;
export const { setBorrowCoinSelectedBorrowModal } = userAccountSlice.actions;
export const { setInputYourBorrowModalRepayAmount } = userAccountSlice.actions;
export const selectSelectedDapp = (state) =>
  state.user_account.spendBorrowselectedDapp;
  export const selectTransactionStatus = (state) =>
  state.user_account.transactionStatus;

export const selectInputSupplyAmount = (state) =>
  state.user_account.inputSupplyAmount;
export const selectCoinSelectedSupplyModal = (state) =>
  state.user_account.coinSelectedSupplyModal;
export const selectCollateralCoinSelectedBorrowModal = (state) =>
  state.user_account.collateralCoinSelectedBorrowModal;
export const selectBorrowCoinSelectedBorrowModal = (state) =>
  state.user_account.borrowCoinSelectedBorrowModal;
export const selectWalletBalance = (state) => state.user_account.walletBalance;
export const selectAccountAddress = (state) =>
  state.user_account.accountAddress;
export const selectLanguage = (state) => state.user_account.language;
export const selectCurrentPage = (state) => state.user_account.currentPage;
export const selectReserves = (state) => state.user_account.reserves;
export const selectOracleAndFairPrices = (state) =>
  state.user_account.oracleAndFairPrices;
export const selectOffchainCurrentBlock = (state) =>
  state.user_account.offchainCurrentBlock;
export default userAccountSlice.reducer;
