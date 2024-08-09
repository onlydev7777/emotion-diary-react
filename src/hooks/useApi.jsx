import {useState} from 'react';
import axiosInstance from '../api/axiosConfig';
import {useNavigate} from "react-router-dom";

const useApi = (defaultUrl, defaultMethod = 'get', defaultOptions = {}) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const refreshToken = async () => {
    try {
      const response = await axiosInstance.post('/auth/refresh-token');
      const accessToken = response.headers.authorization;
      axiosInstance.defaults.headers.common["Authorization"] = accessToken;
      localStorage.setItem("id", response.data.id);
    } catch (err) {
      localStorage.removeItem("id");
      alert("로그인 유효시간이 지났습니다. 재로그인 바랍니다.");
      nav("/signin", {replace: true});
      throw err;
    }
  };

  const fetchData = async ({
    url = defaultUrl,
    method = defaultMethod,
    data = null,
    headers = {},
    params = {}
  } = {}) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const response = await axiosInstance({
        url,
        method,
        data,
        headers,
        params,
        ...defaultOptions,
      });
      setResponse(response);
    } catch (err) {
      if (err.response && err.response.status === 401 && err.response.data
          === 'Access-Token is expired') {
        try {
          await refreshToken();
          const retryResponse = await axiosInstance({
            url,
            method,
            data,
            headers,
            params,
            ...defaultOptions,
          });
          setResponse(retryResponse);
        } catch (error) {
          setError(error)
        }
      } else {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return {response, error, loading, fetchData};
};

export default useApi;
