import { createSlice } from "@reduxjs/toolkit";

const tutorSlice = createSlice({
  name: "tutor",
  initialState: {
    isLoading: false,
    tutors: [],
  },
  reducers: {
    getTutorsStart: (state) => {
      state.isLoading = true;
    },
    getTutorsSuccess: (state, action) => {
      state.isLoading = false;
      state.tutors = action.payload;
    },
    getTutorsFailure: (state) => {
      state.isLoading = false;
    },
  },
});

export const { getTutorsFailure, getTutorsStart, getTutorsSuccess } =
  tutorSlice.actions;

export default tutorSlice.reducer;
