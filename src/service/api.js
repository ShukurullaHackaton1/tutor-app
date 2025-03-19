import axios from "axios";

axios.defaults.baseURL = "http://45.134.39.117:5050";
axios.interceptors.request.use((option) => {
  const token = localStorage.getItem("admin-jwt")
    ? localStorage.getItem("admin-jwt")
    : "";
  option.headers.Authorization = `Bearer ${token}`;
  return option;
});

export default axios;
