import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

const useApi = (url, method = 'get', body = null, options = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (method === 'get') {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance({
            url,
            method,
            ...options,
          });
          setData(response.data);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [url, method, options]);

  const postData = async (postData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(url, postData, options);
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, postData };
};

export default useApi;