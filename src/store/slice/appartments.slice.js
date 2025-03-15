import { createSlice } from "@reduxjs/toolkit";

const appartmentSlice = createSlice({
  name: "appartment",
  initialState: {
    appartments: [],
    isLoading: false,
    selectedAppartment: {},
  },
  reducers: {
    getAppartmentsStart: (state) => {
      state.isLoading = true;
    },
    getAppartmentsSuccess: (state, action) => {
      state.appartments = action.payload;
      state.isLoading = false;
    },
    getAppartmentsFailure: (state) => {
      state.isLoading = false;
    },
    setSelectedAppartment: (state, action) => {
      state.selectedAppartment = action.payload;
    },
  },
});

export const {
  getAppartmentsFailure,
  getAppartmentsStart,
  getAppartmentsSuccess,
  setSelectedAppartment,
} = appartmentSlice.actions;

export default appartmentSlice.reducer;
