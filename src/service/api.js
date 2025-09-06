import axios from "axios";

// Base URL ni to'g'ri o'rnatish
axios.defaults.baseURL = "http://localhost:7788";

// Request interceptor - har bir so'rovga token qo'shish
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin-jwt");
    if (token && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug logging
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - javoblarni boshqarish
axios.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    // 401 xatolik bo'lsa, foydalanuvchini login sahifasiga yo'naltirish
    if (error.response?.status === 401) {
      localStorage.removeItem("admin-jwt");
      window.location.href = "/sign";
    }
    
    return Promise.reject(error);
  }
);

export default axios;