import {
  getAppartmentsFailure,
  getAppartmentsStart,
  getAppartmentsSuccess,
} from "../store/slice/appartments.slice";
import axios from "./api";

const AppartmentService = {
  async getAppartment(dispatch) {
    dispatch(getAppartmentsStart());
    try {
      const { data } = await axios.get("/appartment/all");
      dispatch(
        getAppartmentsSuccess(
          data.data.filter((c) => c.status !== "Being checked")
        )
      );
    } catch (error) {
      console.log(error);
      dispatch(getAppartmentsFailure());
    }
  },
};

export default AppartmentService;
