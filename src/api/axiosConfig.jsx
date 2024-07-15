import axios from "axios";

const axiosInstance = axios.create({
  baseURL:'http://localhost:9001',
  timeout: 10000,
  headers:{
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
    config=>{
      config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
      return config;
    },
    error => {
      return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      // 응답 에러 처리
      return Promise.reject(error);
    }
);

export default axiosInstance;