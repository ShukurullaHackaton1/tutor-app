import { Error } from "../components/alert.jsx";
import {
  getAdminFailure,
  getAdminStart,
  getAdminSuccess,
} from "../store/slice/admin.slice.js";
import axios from "./api.js";

const AdminService = {
  async loginAdmin(dispatch, navigate, admin) {
    dispatch(getAdminStart());
    try {
      const { data } = await axios.post("/admin/login", admin);
      if (data.token) {
        dispatch(getAdminSuccess(data.data));
        localStorage.setItem("admin-jwt", data.token);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
      if (data.status == "error") {
        dispatch(getAdminFailure());
      }
      return { status: data.status };
    } catch (error) {
      console.log(error);
      dispatch(getAdminFailure());
    }
  },
};

export default AdminService;
