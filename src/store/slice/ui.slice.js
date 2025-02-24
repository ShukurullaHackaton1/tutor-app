import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    currentPage: "Bosh sahifa",
    fullStatisticPage: false,
  },
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
    changeFullPage: (state, action) => {
      state.fullStatisticPage = action.payload;
    },
  },
});

export const { changePage, changeFullPage } = uiSlice.actions;

export default uiSlice.reducer;
