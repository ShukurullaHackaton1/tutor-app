import {
  getGroupFailure,
  getGroupsStart,
  getGroupsSuccess,
  getTutorsFailure,
  getTutorsStart,
  getTutorsSuccess,
} from "../store/slice/tutor.slice";
import axios from "./api";

const TutorService = {
  async getTutors(dispatch) {
    dispatch(getTutorsStart());
    try {
      const { data } = await axios.get("/admin/tutors");
      dispatch(getTutorsSuccess(data.data));
    } catch (error) {
      console.log(error);
      dispatch(getTutorsFailure());
    }
  },
  async getGroups(dispatch, search = "") {
    dispatch(getGroupsStart());
    try {
      const { data } = await axios.get(`/groups?search=${search}`);
      dispatch(getGroupsSuccess(data.data));
    } catch (error) {
      console.log(error);
      dispatch(getGroupFailure());
    }
  },

  async createTutor(dispatch, value) {
    dispatch(getTutorsStart());
    try {
      await axios.post("/tutor/create", value);
      const { data } = await axios.get("/admin/tutors");
      dispatch(getTutorsSuccess(data.data));
    } catch (error) {
      console.log(error);
      dispatch(getTutorsFailure());
    }
  },
  async tutorsRemoveGroup(dispatch, id, value) {
    dispatch(getTutorsStart());
    try {
      await axios.post(`/tutor/delete-group/${id}`, value);
      const { data } = await axios.get("/admin/tutors");
      dispatch(getTutorsSuccess(data.data));
    } catch (error) {
      console.log(error);
      dispatch(getTutorsFailure());
    }
  },
};

export default TutorService;
