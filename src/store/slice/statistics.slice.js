import { createSlice } from "@reduxjs/toolkit";

const statisticsSlice = createSlice({
  name: "statistics",
  initialState: {
    studentsByGender: [],
    isLoading: false,
    map: [],
    studentsLevel: [],
    boilerTypes: [],
    smallDistricts: [],
    regionStudents: [],
    facultyData: [],
  },
  reducers: {
    statisticsStart: (state) => {
      state.isLoading = true;
    },
    genderStatistics: (state, action) => {
      state.studentsByGender = action.payload;
      state.isLoading = false;
    },
    statisticsFailure: (state) => {
      state.isLoading = false;
    },
    getMapAppartments: (state, action) => {
      state.isLoading = false;
      state.map = action.payload;
    },
    levelStudents: (state, action) => {
      state.isLoading = false;
      state.studentsLevel = action.payload;
    },
    boilerTypes: (state, action) => {
      state.isLoading = false;
      state.boilerTypes = action.payload;
    },
    smallDistricts: (state, action) => {
      state.isLoading = false;
      state.smallDistricts = action.payload;
    },
    studentsRegion: (state, action) => {
      state.isLoading = false;
      state.regionStudents = action.payload;
    },
    getFacultyDataSuccess: (state, action) => {
      state.isLoading = false;
      state.facultyData = action.payload;
    },
  },
});

export const {
  statisticsFailure,
  statisticsStart,
  getMapAppartments,
  genderStatistics,
  boilerTypes,
  levelStudents,
  studentsRegion,
  getFacultyDataSuccess,
  smallDistricts,
} = statisticsSlice.actions;

export default statisticsSlice.reducer;
