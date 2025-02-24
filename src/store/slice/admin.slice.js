import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    isLoading: false,
    admin: {},
  },
  reducers: {
    getAdminStart: (state) => {
      state.isLoading = true;
    },
    getAdminSuccess: (state, action) => {
      state.isLoading = false;
      state.admin = action.payload;
    },
    getAdminFailure: (state) => {
      state.isLoading = false;
    },
  },
});

export const { getAdminFailure, getAdminStart, getAdminSuccess } =
  adminSlice.actions;

export default adminSlice.reducer;
