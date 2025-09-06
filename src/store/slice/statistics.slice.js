import { createSlice } from "@reduxjs/toolkit";

const statisticsSlice = createSlice({
  name: "statistics",
  initialState: {
    studentsByGender: [],
    isLoading: false,
    map: [], // Map markerlar uchun
    studentsLevel: [],
    boilerTypes: [],
    smallDistricts: [],
    regionStudents: [],
    facultyData: [],
    error: null,
  },
  reducers: {
    statisticsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    genderStatistics: (state, action) => {
      state.studentsByGender = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    statisticsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Unknown error";
    },

    getMapAppartments: (state, action) => {
      console.log("🔄 Redux: Setting map data:", action.payload);
      state.map = action.payload || [];
      state.isLoading = false;
      state.error = null;
    },

    clearMapData: (state) => {
      state.map = [];
    },

    levelStudents: (state, action) => {
      state.isLoading = false;
      state.studentsLevel = action.payload;
      state.error = null;
    },

    boilerTypes: (state, action) => {
      state.isLoading = false;
      state.boilerTypes = action.payload;
      state.error = null;
    },

    smallDistricts: (state, action) => {
      state.isLoading = false;
      state.smallDistricts = action.payload;
      state.error = null;
    },

    studentsRegion: (state, action) => {
      state.isLoading = false;
      state.regionStudents = action.payload;
      state.error = null;
    },

    getFacultyDataSuccess: (state, action) => {
      state.isLoading = false;
      state.facultyData = action.payload;
      state.error = null;
    },
  },
});

export const {
  statisticsFailure,
  statisticsStart,
  getMapAppartments,
  clearMapData,
  genderStatistics,
  boilerTypes,
  levelStudents,
  studentsRegion,
  getFacultyDataSuccess,
  smallDistricts,
} = statisticsSlice.actions;

export default statisticsSlice.reducer;
