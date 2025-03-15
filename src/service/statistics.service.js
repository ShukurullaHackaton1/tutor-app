import {
  boilerTypes,
  genderStatistics,
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
      console.log(error);
      dispatch(statisticsFailure());
    }
  },
  async getAppartmentsLocation(dispatch) {
    dispatch(statisticsStart());
    try {
      const { data } = await axios.get("/statistics/appartments/map");
      console.log(data.data);
      dispatch(getMapAppartments(convertLocations(data.data)));
    } catch (error) {
      console.log(error);
      dispatch(statisticsFailure());
    }
  },
  async filterAppartmentLocation(dispatch, filter) {
    dispatch(statisticsStart());
    try {
      const { data } = await axios.post(
        "/statistics/appartment/filter",
        filter
      );
      console.log(data.data);
      dispatch(getMapAppartments(convertLocations(data.data)));
    } catch (error) {
      console.log(error);
      dispatch(statisticsFailure());
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
      console.log(error);
      dispatch(statisticsFailure());
    }
  },
  async getBoilerTypes(dispatch) {
    dispatch(statisticsStart());
    try {
      const { data } = await axios.get("/statistics/appartment/boiler");
      dispatch(boilerTypes(data.data));
    } catch (error) {
      console.log(error);
      dispatch(statisticsFailure());
    }
  },
  async getSmallDistricts(dispatch) {
    dispatch(statisticsStart());
    try {
      const { data } = await axios.get("/statistics/appartment/smallDistrict");
      dispatch(smallDistricts(data.data));
    } catch (error) {
      console.log(error);
      dispatch(statisticsFailure());
    }
  },
  async regionStudents(dispatch) {
    dispatch(statisticsStart());
    try {
      const { data } = await axios.get("/statistics/region");

      dispatch(studentsRegion(data.data));
    } catch (error) {
      console.log(error);
      dispatch(statisticsFailure());
    }
  },
};
export default StatisticsService;
