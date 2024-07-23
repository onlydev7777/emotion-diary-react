import {useState} from 'react';
import axiosInstance from '../api/axiosConfig';

const useApi = (defaultUrl, defaultMethod = 'get', defaultOptions = {}) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshToken = async () => {
    try {
      const response = await axiosInstance.post('/auth/refresh-token', {}, {
        headers: {
          ['Refresh-Token']: localStorage.getItem('Refresh-Token')
        }
      });
      localStorage.setItem('Access-Token', response.headers.authorization);
      localStorage.setItem('Refresh-Token', response.headers['refresh-token']);
      return response.headers.authorization;
    } catch (err) {
      throw new Error('Failed to refresh token');
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
          const newToken = await refreshToken();
          const retryResponse = await axiosInstance({
            url,
            method,
            data,
            headers: {...headers, Authorization: newToken},
            params,
            ...defaultOptions,
          });
          setResponse(retryResponse);
        } catch (refreshError) {
          setError(refreshError);
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
