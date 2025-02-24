import { configureStore } from "@reduxjs/toolkit";
import UiReducer from "./slice/ui.slice.js";
import AdminReducer from "./slice/admin.slice.js";
import AppartmentReducer from "./slice/appartments.slice.js";
import StatisticsReducer from "./slice/statistics.slice.js";

const store = configureStore({
  devTools: process.env.NODE_ENV != "production",
  reducer: {
    ui: UiReducer,
    admin: AdminReducer,
    appartment: AppartmentReducer,
    statistics: StatisticsReducer,
  },
});

export default store;
