import axios from "axios";

axios.defaults.baseURL = "https://teacher-portfolio-server.vercel.app";
axios.interceptors.request.use((option) => {
  const token = localStorage.getItem("admin-jwt")
    ? localStorage.getItem("admin-jwt")
    : "";
  option.headers.Authorization = `Bearer ${token}`;
  return option;
});

export default axios;
