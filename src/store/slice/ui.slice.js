import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    currentPage: "Bosh sahifa",
    fullStatisticPage: false,
    openCreateSide: false,
  },
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
    changeFullPage: (state, action) => {
      state.fullStatisticPage = action.payload;
    },
    changeCreateSide: (state, action) => {
      state.openCreateSide = action.payload;
    },
  },
});

export const { changePage, changeFullPage, changeCreateSide } = uiSlice.actions;

export default uiSlice.reducer;
