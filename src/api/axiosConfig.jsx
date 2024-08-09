import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:9001',
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

axiosInstance.interceptors.request.use(
    config => {
      // const token = localStorage.getItem('Access-Token');
      // if (token) {
      //   config.headers.Authorization = token
      // }
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