import {useState} from 'react';
import axiosInstance from '../api/axiosConfig';

const useApi = (url, method = 'get', body = null, options = {}) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (method === 'get') {
  //     const fetchData = async () => {
  //       setLoading(true);
  //       try {
  //         const response = await axiosInstance({
  //           url,
  //           method,
  //           ...options,
  //         });
  //         setResponse(response);
  //       } catch (err) {
  //         setError(err);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //
  //     fetchData();
  //   }
  // }, [url, method, options]);

  const fetchData = async (method, requestData = null) => {
    setLoading(true);
    try {
      const response = await axiosInstance({
        url,
        method,
        data: requestData,
        ...options,
      });
      setResponse(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {response, error, loading, fetchData};
};

export default useApi;