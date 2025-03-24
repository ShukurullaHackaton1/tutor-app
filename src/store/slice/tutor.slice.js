import { createSlice } from "@reduxjs/toolkit";

const tutorSlice = createSlice({
  name: "tutor",
  initialState: {
    isLoading: false,
    tutors: [],
    groups: [],
    groupLoading: true,
  },
  reducers: {
    getTutorsStart: (state) => {
      state.isLoading = true;
    },
    getGroupsStart: (state) => {
      state.groupLoading = true;
    },
    getTutorsSuccess: (state, action) => {
      state.isLoading = false;
      state.tutors = action.payload;
    },
    getGroupsSuccess: (state, action) => {
      state.groupLoading = false;
      state.groups = action.payload;
    },
    getTutorsFailure: (state) => {
      state.isLoading = false;
    },
    getGroupFailure: (state) => {
      state.groupLoading = false;
    },
  },
});

export const {
  getTutorsFailure,
  getTutorsStart,
  getTutorsSuccess,
  getGroupsSuccess,
  getGroupFailure,
  getGroupsStart,
} = tutorSlice.actions;

export default tutorSlice.reducer;
