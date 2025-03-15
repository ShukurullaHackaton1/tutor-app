import {
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
};

export default TutorService;
