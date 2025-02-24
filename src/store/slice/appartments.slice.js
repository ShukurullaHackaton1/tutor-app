import { createSlice } from "@reduxjs/toolkit";

const appartmentSlice = createSlice({
  name: "appartment",
  initialState: {
    appartments: [],
    isLoading: false,
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
  },
});

export const {
  getAppartmentsFailure,
  getAppartmentsStart,
  getAppartmentsSuccess,
} = appartmentSlice.actions;

export default appartmentSlice.reducer;
