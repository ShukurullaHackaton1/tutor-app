import {
  boilerTypes,
  genderStatistics,
  getFacultyDataSuccess,
  getMapAppartments,
  levelStudents,
  smallDistricts,
  statisticsFailure,
  statisticsStart,
  studentsRegion,
} from "../store/slice/statistics.slice";
import { convertLocations } from "../utils/converLocation";
import axios from "./api";

const StatisticsService = {
  async getGenderStatistics(dispatch) {
    dispatch(statisticsStart());
    try {
      const { data } = await axios.get("/statistics/students/gender");
      const all = data.data;
      dispatch(
        genderStatistics([
          {
            id: 0,
            value: all["Ayol"],
            label: "Ayol Talabalar",
            color: "#8979FF",
          },
          {
            id: 1,
            value: all["Erkak"],
            label: "Erkak Talabalar",
            color: "#FF928A",
          },
        ])
      );
    } catch (error) {
      console.error("Gender statistics error:", error);
      dispatch(statisticsFailure());
    }
  },

  async getAppartmentsLocation(dispatch) {
    try {
      console.log("🗺️ Fetching map data from API...");

      const response = await axios.get("/statistics/appartments/map");
      console.log("📡 Raw API response:", response);

      if (response.data && response.data.status === "success") {
        console.log("✅ API Success - Data:", response.data.data);
        console.log("📊 Total apartments:", response.data.total);

        if (response.data.data && Array.isArray(response.data.data)) {
          const convertedData = convertLocations(response.data.data);
          console.log("🔄 Converted data for map:", convertedData);

          dispatch(getMapAppartments(convertedData));
          console.log("✅ Map data dispatched to Redux");
        } else {
          console.warn("⚠️ Invalid data structure:", response.data);
          dispatch(getMapAppartments([]));
        }
      } else {
        console.error("❌ API Error response:", response.data);
        dispatch(getMapAppartments([]));
      }
    } catch (error) {
      console.error("❌ Map API Error:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });
      dispatch(getMapAppartments([]));
    }
  },

  async filterAppartmentLocation(dispatch, filter) {
    try {
      console.log("🔍 Filtering apartments with:", filter);

      const response = await axios.post(
        "/statistics/appartment/filter",
        filter
      );
      console.log("📡 Filter API response:", response);

      if (response.data && response.data.status === "success") {
        console.log("✅ Filter Success - Data:", response.data.data);

        if (response.data.data && Array.isArray(response.data.data)) {
          const convertedData = convertLocations(response.data.data);
          console.log("🔄 Converted filtered data:", convertedData);

          dispatch(getMapAppartments(convertedData));
        } else {
          console.warn("⚠️ Invalid filtered data:", response.data);
          dispatch(getMapAppartments([]));
        }
      } else {
        console.error("❌ Filter API Error:", response.data);
        dispatch(getMapAppartments([]));
      }
    } catch (error) {
      console.error("❌ Filter API Error:", error);
      dispatch(getMapAppartments([]));
    }
  },

  async getLevelStudents(dispatch) {
    dispatch(statisticsStart());
    const colors = ["#8979FF", "#FF928A", "#3CC3DF", "#FFAE4C"];
    try {
      const { data } = await axios.get("/statistics/appartments/level");
      const levels = data.data.slice(0, 4).map((item, idx) => {
        return {
          id: idx,
          value: item.total,
          label: item.level,
          color: colors[idx],
        };
      });
      dispatch(levelStudents(levels));
    } catch (error) {
      console.error("Level students error:", error);
      dispatch(statisticsFailure());
    }
  },

  async getBoilerTypes(dispatch) {
    dispatch(statisticsStart());
    try {
      const { data } = await axios.get("/statistics/appartment/boiler");
      dispatch(boilerTypes(data.data));
    } catch (error) {
      console.error("Boiler types error:", error);
      dispatch(statisticsFailure());
    }
  },

  async getSmallDistricts(dispatch) {
    dispatch(statisticsStart());
    try {
      const { data } = await axios.get("/statistics/appartment/smallDistrict");
      dispatch(smallDistricts(data.data));
    } catch (error) {
      console.error("Small districts error:", error);
      dispatch(statisticsFailure());
    }
  },

  async regionStudents(dispatch) {
    dispatch(statisticsStart());
    try {
      const { data } = await axios.get("/statistics/region");
      dispatch(studentsRegion(data.data));
    } catch (error) {
      console.error("Region students error:", error);
      dispatch(statisticsFailure());
    }
  },

  async facultyData(dispatch, faculties) {
    dispatch(statisticsStart());
    try {
      const { data } = await axios.post("/statistics/faculty-data", {
        faculty: faculties,
      });
      dispatch(getFacultyDataSuccess(data));
    } catch (error) {
      console.error("Faculty data error:", error);
      dispatch(statisticsFailure());
    }
  },
};

export default StatisticsService;
